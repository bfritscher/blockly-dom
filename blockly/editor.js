(function() {
  let workspace;
  let lastBlockId;
  const errorComments = [];
  const BLOCKLY_LAST_LOCAL_XML = "BLOCKLY_LAST_LOCAL_XML";
  let options = {
    withHighlight: true
  };
  Object.assign(options, JSON.parse(localStorage.getItem("BLOCKLY_OPTIONS") || "{}"));

  function getWorkspaceXml() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToPrettyText(xml);
  };

  function getCurrentWorkspaceXml() {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToText(xml);
  }

  function setCurrentWorkspaceXml(xml) {
    try {
      workspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } catch (e) {
      console.log(e);
      window.alert("error parsing blockly xml");
      workspace.clear();
    }
  }

  function getWorkspaceCompressed() {
    return B64Gzip.compress(getCurrentWorkspaceXml());
  }

  function setWorkspaceCompressed(blocklySource) {
    setCurrentWorkspaceXml(B64Gzip.decompress(blocklySource));
  }

  function getWorkspaceCode(withHighlight = false) {
    if (withHighlight) {
      Blockly.JavaScript.STATEMENT_PREFIX = "highlightBlock(%1);\n";
    }
    const js = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.STATEMENT_PREFIX = "";
    return js;
  }

  function generateViewSourceCode() {
    let js = getWorkspaceCode();

    if (document.getElementById("include-blockly-source").checked) {
      js =
        "if (!sessionStorage.USE_BLOCKLY_CODE) {\n" +
        js +
        "}\n" +
        [
          "// Below is information about the Blockly blocks that",
          "// made up your program. It is not required for your",
          "// webpage to work, and you can remove it if you",
          "// don't care about others remixing your work."
        ].join("\n") +
        '\nvar BLOCKLY_SOURCE = "' +
        getWorkspaceCompressed() +
        '";';
    }
    return js;
  }

  function loadSavedWorkspaceFromLocalStorage() {
    if (BLOCKLY_LAST_LOCAL_XML in localStorage) {
      setWorkspaceCompressed(localStorage.getItem(BLOCKLY_LAST_LOCAL_XML));
    }
  }

  function loadSavedWorkspaceFromURL() {
    const blocklySourceMatch = window.location.search.match(
      /[&?]blocklySource=([A-Za-z0-9._]+)/
    );

    if (blocklySourceMatch) {
      setWorkspaceCompressed(blocklySourceMatch[1]);
    }
  }

  // svg export inspired by
  // https://github.com/microsoft/pxt/blob/master/pxtblocks/blocklylayout.ts
  function serializeNode(sg) {
    return serializeSvgString(new XMLSerializer().serializeToString(sg));
  }

  function serializeSvgString(xmlString){
    return xmlString
        .replace(new RegExp('&nbsp;', 'g'), '&#160;'); // Replace &nbsp; with &#160; as a workaround for having nbsp missing from SVG xml
  }

  function workspaceToSvg(ws) {
    const {x, y, width, height} = ws.getBlocksBoundingBox();
    const sg = ws.getParentSvg().cloneNode(true);
    sg.setAttribute('width', `${width}`);
    sg.setAttribute('height', `${height}`);
    sg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
    const bws = sg.querySelector('.blocklyWorkspace');
    const bc = sg.querySelector('.blocklyBlockCanvas');
    bc.removeAttribute('transform')
    const children = [...bws.childNodes];
    for(const node of children) {
      bws.removeChild(node);
    }
    bws.appendChild(bc);
    sg.appendChild(document.querySelector('style').cloneNode(true));
    return {
      svg: serializeNode(sg),
      width,
      height
    };
  }


  function toPngAsync(width, height, pixelDensity, data){
    return new Promise((resolve, reject) => {
        const cvs = document.createElement("canvas");
        const ctx = cvs.getContext("2d");
        const img = new Image;

        cvs.width = width * pixelDensity;
        cvs.height = height * pixelDensity;
        img.onload = function () {
            ctx.drawImage(img, 0, 0, width, height, 0, 0, cvs.width, cvs.height);
            const canvasdata = cvs.toDataURL("image/png");
            resolve(canvasdata);
        };
        img.onerror = ev => {
            pxt.reportError("blocks", "blocks screenshot failed");
            resolve(undefined)
        }
        img.src = data;
    });
  }

  function workspaceToPicAsync(ws) {
    const {svg, width, height} = workspaceToSvg(ws);
    const svgData = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    return toPngAsync(width, height, 4, svgData).then(pngData => {
      return {
        svgData,
        pngData
      };
    });
  }

  // end of image export

  function updateSourceCode() {
    const sourceCodeDom = document.getElementById("source-code-holder");
    sourceCodeDom.innerHTML = generateViewSourceCode();
    hljs.highlightBlock(sourceCodeDom);
  }

  function sendMessage(msg) {
    msg = Object.assign(msg, { location: window.name });
    worker.port.postMessage(msg);
  }

  let lastSentBlocklySource;

  function sendCodeToWorker(reload = false) {
    const blocklySource = getWorkspaceCompressed();
    if (lastSentBlocklySource === blocklySource && !reload) return;
    localStorage.setItem(BLOCKLY_LAST_LOCAL_XML, blocklySource);
    if (reload) {
      workspace.highlightBlock();
      lastBlockId = undefined;
      let comment;
      while ((comment = errorComments.pop())) {
        if (comment && comment.block_) {
          comment.dispose();
        }
      }
    }

    const script = getWorkspaceCode(options.withHighlight);
    sendMessage({
      type: "codeUpdate",
      script,
      blocklySource,
      reload
    });
    lastSentBlocklySource = blocklySource;
    if (!window.name && reload) {
      // execute locally Better would be in a custom iframe or with special interpreter
      eval(script);
    }
  }

  const worker = new SharedWorker(
    "../sharedStateWorker.js",
    "BlocklyEditorSharedStateWorker"
  );
  worker.port.onmessage = function(e) {
    if (e.data.type === "blocklySource") {
      if (e.data.blocklySource) {
        try {
          setWorkspaceCompressed(e.data.blocklySource);
          sendCodeToWorker(true);
        } catch (err) {
          console.log(err);
        }
      }
    } else if (e.data.type === "highlightBlock") {
      lastBlockId = e.data.id;
      workspace.highlightBlock(e.data.id);
    } else if (e.data.type === "scriptError") {
      if (lastBlockId) {
        const block = workspace.getBlockById(lastBlockId);
        block.setCommentText(e.data.msg);
        block.comment.setVisible(true);
        block.comment.setBubbleSize(300, 100);
        errorComments.push(block.comment);
      }
    } else if (e.data.type === "close") {
      // only one open window
      window.close();
    }
  };

  // for local execution
  window.highlightBlock = function highlightBlock(id) {
    workspace.highlightBlock(id);
  };

  window.addEventListener("DOMContentLoaded", () => {
    Blockly.JavaScript.addReservedWords("highlightBlock");
    workspace = Blockly.inject(document.getElementById("blockly"), {
      path: "vendors/blockly/",
      toolbox: document.getElementById("toolbox"),
      oneBasedIndex: false,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 1.5,
        minScale: 0.3,
        scaleSpeed: 1.1
      }
    });
    sendMessage({ type: "editorReady" });

    workspace.addChangeListener(() => {
      sendCodeToWorker(false);
    });

    let modalOpenXml;
    document.getElementById("view-options").onclick = function() {
      updateSourceCode();
      workspaceToPicAsync(workspace).then(({svgData, pngData}) => {
        document.getElementById("svg").src = svgData;
        document.getElementById("svg-download").href = svgData;
        document.getElementById("png").src = pngData;
        document.getElementById("png-download").href = pngData;
      });
      modalOpenXml = getWorkspaceXml();
      document.getElementById("xml").value = modalOpenXml;
      document.getElementById("xml-download").href = "data:text/xml;base64," + btoa(unescape(encodeURIComponent(modalOpenXml)));
      $("#options").modal();
    };

    $("#options").on("hidden.bs.modal", function() {
      const modalCloseXml = document.getElementById('xml').value;
      if(modalCloseXml !== modalOpenXml) {
        setCurrentWorkspaceXml(modalCloseXml);
      }
    })

    $(document).on("click", "code", function() {
      if (this.select) {
        this.select();
      } else if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(this);
        range.select();
      } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(this);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    });

    document
      .getElementById("include-blockly-source")
      .addEventListener("change", updateSourceCode);

    document.getElementById("play").onclick = function() {
      sendCodeToWorker(true);
    };

    window.addEventListener("keydown", event => {
      if (event.key === "Enter" && event.ctrlKey) {
        sendCodeToWorker(true);
      }
    });

    if (!window.name) {
      loadSavedWorkspaceFromLocalStorage();
      loadSavedWorkspaceFromURL();
    }
  });
})();
