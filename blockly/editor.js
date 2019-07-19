(function() {
  let workspace;
  let lastBlockId;
  const errorComments = [];
  // This can be used by developers from the debug console.
  window.getWorkspaceXml = function() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToPrettyText(xml);
  };

  function getCurrentWorkspaceXml() {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToText(xml);
  }

  function setCurrentWorkspaceXml(xml) {
    try {
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } catch (e) {
      console.log(e);
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
    sendMessage({
      type: "codeUpdate",
      script: getWorkspaceCode(true),
      blocklySource,
      reload
    });
    lastSentBlocklySource = blocklySource;
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

    document.getElementById("view-source").onclick = function() {
      updateSourceCode();
      $("#source").modal();
    };

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
      if (event.which == 32 && event.ctrlKey) {
        sendCodeToWorker(true);
      }
    });
  });
})();
