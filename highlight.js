
/*
 Highlighter which could
   - highlight tables on the current web page.
   - remove highlights of the tables on current web page.
 */
var TableHighlighter = function() {
  this.originalColors = [];
};

// Traverse all the tables on the page and apply function fn
// to every table.
TableHighlighter.prototype.walkTables = function(fn) {
  var tables = document.body.querySelectorAll("table");
  for (var i = 0; i < tables.length; i++) {
    var items = tables[i].querySelectorAll("*");
    for (var j = 0; j < items.length; j++) {
      fn(i, j, items[j]);
    }
  }
};

// Highlight all the tables on the page. Colors of these tables will
// also be stored.
TableHighlighter.prototype.highlightTable = function() {
  var tables = document.body.querySelectorAll("table");
  for (var i = 0; i < tables.length; i++) {
    var colors = [];
    var items = tables[i].querySelectorAll("*");
    for (var j = 0; j < items.length; j++) {
      colors.push(items[j].style.backgroundColor);
    }
    this.originalColors.push(colors);
  }

  this.highlight();
};

// Highlight all the tables
TableHighlighter.prototype.highlight = function() {
  var highlightColor = "#E0F7FA";
  this.walkTables(function(i, j, item) {
    item.style.backgroundColor = highlightColor;
  });
};

// Restore the original colors of tables on the web page
TableHighlighter.prototype.restoreTable = function() {
  var originalColors = this.originalColors;
  this.walkTables(function(i, j, item) {
    item.style.backgroundColor = originalColors[i][j];
  });
};

var tableMarker = new TableHighlighter();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("highligh.js receives message: ", message);
  switch(message.command) {
    case "highlightTable":
      tableMarker.highlightTable();
      break;
    case "restoreTable":
      tableMarker.restoreTable();
      break;
    default:
      break;
  }
});
