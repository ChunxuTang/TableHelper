
// Send a command to the content.
function sendCommand(cmd, broadcast, fn) {
  var qry = broadcast ? {} : {active: true, currentWindow: true};
  chrome.tabs.query(qry, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, {command: cmd}, fn || function(r) {});
    });
  });
}

document.addEventListener("click", function(e) {
  var cmd = e.target.getAttribute("data-command");
  if (cmd) {
    console.log("send ", cmd);
    sendCommand(cmd, false, function(res) {
      window.close();
    });
  }
});
