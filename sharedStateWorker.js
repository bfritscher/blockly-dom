const ports = {
  bridges: {},
  editors: {}
};
const xml = {};
const js = {};

function addPortToLookupByLocation(port, lookup, location) {
  if (!lookup.hasOwnProperty(location)) {
    lookup[location] = [];
  }
  lookup[location].push(port);
}

function sendMessage(ports, data, notSelf) {
  if (ports) {
    for (const port of ports) {
      if (port !== notSelf) {
        port.postMessage(data);
      }
    }
  }
}

onconnect = function(e) {
  const port = e.ports[0];
  port.onmessage = function(e) {
    if (e.data.type === "editorReady") {
      if (!e.data.location) return;
      addPortToLookupByLocation(port, ports.editors, e.data.location);
      port.postMessage({
        type: "blocklySource",
        blocklySource: xml[e.data.location]
      });
      // close others only one per location
      sendMessage(ports.editors[e.data.location], { type: "close" }, port);
    } else if (e.data.type === "bridgeReady") {
      if (!e.data.location) return;
      addPortToLookupByLocation(port, ports.bridges, e.data.location);
      // blocklySource if no editor open?
      if (e.data.blocklySource && !xml.hasOwnProperty(e.data.location)) {
        xml[e.data.location] = e.data.blocklySource;
      }
      if (js[[e.data.location]]) {
        port.postMessage({ type: "script", script: js[e.data.location] });
      }
    } else if (e.data.type === "codeUpdate") {
      xml[e.data.location] = e.data.blocklySource;
      js[e.data.location] = e.data.script;
      sendMessage(ports.bridges[e.data.location], e.data);
    } else if (
      e.data.type === "highlightBlock" ||
      e.data.type === "scriptError"
    ) {
      sendMessage(ports.editors[e.data.location], e.data);
    }
  };
};

function removePortFromLookup(port, lookup) {
  for (const location in lookup) {
    if (location.hasOwnProperty(lookup)) {
      const index = lookup[location].indexOf(port);
      if (index > -1) {
        lookup[location].splice(index, 1);
      }
    }
  }
}

close = function(e) {
  const port = e.ports[0];
  removePortFromLookup(port, ports.editors);
  removePortFromLookup(port, ports.bridges);
};
