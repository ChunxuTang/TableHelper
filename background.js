

// Create context menu:
//   Table Marker: root item
//     Select Table: select a specific table
//     Copy Table: copy the table selected
//     Drop Table: paste the table into a target web page
var menu = {};
menu.root = chrome.contextMenus.create({
  "title": "Table Marker",
  "type": "normal",
  "id": "root"
});
menu.select = chrome.contextMenus.create({
  "title": "Select Table",
  "type": "normal",
  "id": "select_table",
  "parentId": menu.root,
  "onclick": function(){ menuClick("selectTable");}
});
menu.select = chrome.contextMenus.create({
  "title": "Copy Table",
  "type": "normal",
  "id": "copy_table",
  "parentId": menu.root,
  "onclick": function(){ menuClick("copyHTML");}
});
menu.drop = chrome.contextMenus.create({
  "title": "Drop Table",
  "type": "normal",
  "id": "drop_table",
  "parentId": menu.root,
  "onclick": function(){ menuClick("dropTable")}
});


// Send a command to tabs.
function sendCommand(cmd, broadcast, fn) {
  var qry = broadcast ? {} : {active: true, currentWindow: true};
  chrome.tabs.query(qry, function(tabs) {
    tabs.forEach(function(tab) {
      console.log("send", qry, tab, cmd);
      chrome.tabs.sendMessage(tab.id, {command: cmd}, fn || function(r) {});
    });
  });
}

function menuClick(cmd) {
  sendCommand(cmd);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.command) {
    case "copyHTML":
      console.log("message content", message.content);
      sendResponse({});
      chrome.storage.local.set({'table': message.content}, function () {
        console.log('table saved');
      });
      chrome.storage.local.set({'url': sender.tab.url}, function() {
        console.log('url saved', sender.tab.url);
      });
      chrome.storage.local.set({'index': message.index}, function() {
        console.log('index saved', message.index);
      });
      break;
  }
});
