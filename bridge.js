(function() {
  let editor;
  let location;
  const connectedDom = document.getElementById("connected");
  const errorDom = document.getElementById("error");
  const modifiedDom = document.getElementById("modified");
  const editorLink = document.getElementById("editorLink");

  const KEY = "BLOCKLY";
  const KEY_BL = `${KEY}_bl_`;
  const KEY_JS = `${KEY}_js_`;

  function save(data) {
    localStorage.setItem(`${KEY_BL}${data.location}`, data.blocklySource);
    localStorage.setItem(`${KEY_JS}${data.location}`, data.script);
  }

  // setup connection to backend to receive update from editor
  const worker = new SharedWorker(
    "sharedStateWorker.js",
    "BlocklyEditorSharedStateWorker"
  );
  worker.port.onmessage = function(e) {
    if (e.data.type === "codeUpdate") {
      save(e.data);
      modifiedDom.style.display = "inherit";
      if (e.data.reload) {
        window.parent.postMessage({ type: "reload" }, "*");
      }
    } else {
      // forward message
      window.parent.postMessage(e.data, "*");
    }
  };

  // messages from parent of iframe
  window.addEventListener(
    "message",
    event => {
      if (event.source !== window.parent) return;

      const msg = event.data;

      if (msg.type === "initResponse") {
        location = msg.location;
        let blocklySource = msg.blocklySource;
        let script;
        if ( localStorage.hasOwnProperty(`${KEY_BL}${location}` )) {
          blocklySource = localStorage.getItem(`${KEY_BL}${location}`)
        }
        if ( localStorage.hasOwnProperty(`${KEY_JS}${location}` )) {
          script = localStorage.getItem(`${KEY_JS}${location}`)
        }
        // TODO when to send script for execution?
        worker.port.postMessage({
          type: "bridgeReady",
          location: msg.location,
          blocklySource,
          script
        });
        // load JS script from remote?
        // TODO if editor open use editor?
      } else if (msg.type === "scriptInjected") {
        connectedDom.style.display = "inherit";
      } else if (msg.type === "scriptError") {
        errorDom.style.display = "inherit";
        worker.port.postMessage({
          type: "scriptError",
          location: location,
          msg: msg.msg
        });
      } else if (msg.type === "highlightBlock") {
        worker.port.postMessage({
          type: "highlightBlock",
          location: location,
          id: msg.id
        });
      }
    },
    false
  );

  function makeStyle() {
    const content = document.querySelector(".content");
    return `width:${content.offsetWidth}px;height:${
      content.offsetHeight
    }px;position:absolute;bottom:0;left:0;border:none;overflow:hidden;`;
  }

  window.parent.postMessage(
    {
      type: "init",
      style: makeStyle()
    },
    "*"
  );

  modifiedDom.onclick = function() {
    window.parent.postMessage({ type: "reload" }, "*");
  };

  editorLink.onclick = e => {
    e.preventDefault();
    if (editor && !editor.isClosed) {
      editor.focus();
      return;
    }
    editor = window.open(
      editorLink.href,
      location,
      "width=800,height=600,resizable=yes"
    );
  };
})();
