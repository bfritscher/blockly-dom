(function() {
  let workspace;
  // This can be used by developers from the debug console.
  window.getWorkspaceXml = function() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToPrettyText(xml);
  };

  function getWorkspaceCompressed() {
    var dom = Blockly.Xml.workspaceToDom(workspace);
    return B64Gzip.compress(Blockly.Xml.domToText(dom));
  }

  function getWorkspaceCode() {
    return Blockly.JavaScript.workspaceToCode(workspace);
  }

  function getCurrentWorkspaceXml() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToText(xml);
  }

  function setCurrentWorkspaceXml(xml) {
    try {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(xml),
        workspace
      );
    } catch (e) {
      console.log(e);
      workspace.clear();
    }
  }


  var editor = null;

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
    msg = Object.assign(msg, {location: window.name})
    worker.port.postMessage(msg);
  }

  function sendCodeToWorker(reload=false) {
    sendMessage({
      type: "codeUpdate",
      script: getWorkspaceCode(),
      blocklySource: getWorkspaceCompressed(),
      reload
   });
  }

  const worker = new SharedWorker('sharedStateWorker.js');
  worker.port.onmessage = function(e) {
    if (e.data.type === "blocklySource") {
      if (e.data.blocklySource) {
        try {
          setCurrentWorkspaceXml(B64Gzip.decompress(e.data.blocklySource));
          sendCodeToWorker(true);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    workspace = Blockly.inject(document.getElementById("blockly"), {
      path: "vendors/blockly/",
      toolbox: document.getElementById("toolbox")
    });
    sendMessage({type: 'editorReady'});

    workspace.addChangeListener(() => {
      sendCodeToWorker(false);
    });

    document.getElementById("view-source").onclick = function() {
      updateSourceCode()
      $("#source").modal();
    };

    $(document).on('click', 'code', function () {
      if (this.select) {
        this.select();
      }
      else if (document.selection) {
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
