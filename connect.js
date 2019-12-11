/*
Create iframe button and listen to events
*/
(function() {
  const ME_REGEXP = /^(.+\/)connect\.js$/;
  const DEFAULT_STYLE =
    "position: absolute; top: 0; left: 0; " +
    "visibility: hidden; overflow: hidden";
  let baseURL;

  // On IE9, the latest entry in document.scripts isn't necessarily
  // our script, as inline scripts after our scripts can actually already
  // be part of document.scripts, so we'll just find the latest script
  // that matches what we think our script is called.
  [].slice.call(document.scripts).forEach(script => {
    const match = script.src.match(ME_REGEXP);
    if (match) {
      baseURL = match[1];
    }
  });


  let iframe;
  let script;

  const observer = new MutationObserver(function(mutations) {
    // check for removed target
    mutations.forEach(function(mutation) {
      if([...mutation.removedNodes].includes(iframe)){
        init();
      }
    });
  });

  const config = {
    subtree: false,
    childList: true,
    attributes: false
  };
  observer.observe(document.body, config);



  function init() {
    if (document.referrer && document.referrer.includes("s/github")) {
        document.body.innerHTML = "<h1>Please, first fork the project</h1>";
      return
    }
    iframe = document.createElement("iframe");

    if (!baseURL) throw new Error("baseURL not found");

    iframe.setAttribute("src", baseURL + "bridge.html");

    window.addEventListener(
      "error",
      e => {
        iframe.contentWindow.postMessage(
          { type: "scriptError", msg: e.message },
          "*"
        );
      },
      false
    );

    window.highlightBlock = function highlightBlock(id) {
      iframe.contentWindow.postMessage({ type: "highlightBlock", id: id }, "*");
    };

    window.addEventListener("message", event => {
      if (event.source !== iframe.contentWindow) return;
      const msg = event.data;
      if (msg.type === "init") {
        iframe.setAttribute("style", msg.style);
        const response = {
          type: "initResponse",
          blocklySource: window.BLOCKLY_SOURCE || null,
          location: window.location.href
        };
        iframe.contentWindow.postMessage(response, "*");
      } else if (msg.type == "reload") {
        sessionStorage.USE_BLOCKLY_CODE = "INDEED";
        window.location.reload();
      } else if (msg.type == "script") {
        if (script) {
          script.remove();
        }
        script = document.createElement("script");
        script.appendChild(document.createTextNode(msg.script));
        document.body.appendChild(script);
        iframe.contentWindow.postMessage({ type: "scriptInjected" }, "*");
      }
    });

    iframe.setAttribute("style", DEFAULT_STYLE);
    document.body.appendChild(iframe);
  }

  if (document.readyState === "complete" || document.readyState === "loaded") {
    init();
  }
  window.addEventListener("DOMContentLoaded", init, false);
})();
