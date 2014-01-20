/**
 * @fileoverview This file sets up all the events for the Web App.
 */


goog.provide('ajs.think.events');

goog.require('ajs.mouse');
goog.require('ajs.think');
goog.require('ajs.think.action');
goog.require('ajs.think.mainMenu');
goog.require('ajs.think.thought.ajax');
goog.require('ajs.think.events.names');
goog.require('ajs.think.events.mouse');
goog.require('ajs.think.events.mouseEntities');
goog.require('ajs.think.thoughtMenu');
goog.require('ajs.think.thoughtMenu.menuItem');
goog.require('ajs.think.node');
goog.require('ajs.think.ui.thoughtOptions');
goog.require('ajs.think.ui.exportThoughtDialog');
goog.require('ajs.think.ui.editNodeDialog');


/**
 * A function that sets up all the event listeners for the Web App.
 * 
 * @param {CanvasRenderingContext2D} canvas the canvas context.
 */
ajs.think.events.setupCanvasListeners = function(thoughtContext) {
  var unknownParam = false;
  
  ajs.think.events.mouseEntities.setupMouseEntities(thoughtContext);
  
  // Setup the mouse listeners.
  thoughtContext.canvas.addEventListener(ajs.think.events.names.click, ajs.think.events.mouse.clickListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.dblclick, ajs.think.events.mouse._doubleClickListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.mousedown, ajs.think.events.mouse.downListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.mouseup, ajs.think.events.mouse.upListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.mousemove, ajs.think.events.mouse.hoverListener, unknownParam);
  
  // Setup the Web App custom event listeners.
  thoughtContext.canvas.addEventListener(ajs.think.events.names.select, ajs.think.events.selectActionListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.action.types.Create, ajs.think.events.createActionListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.action.types.Connect, ajs.think.events.connectActionListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.connectTwoNodes, ajs.think.events.connectTwoNodesListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.action.types.Destroy, ajs.think.events.destroyActionListener, unknownParam);
  
  // An Edit Node event, edits the node and selects the node.
  thoughtContext.canvas.addEventListener(ajs.think.events.names.editNode, ajs.think.events.editNodeActionListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.editNode, ajs.think.events.selectActionListener, unknownParam);
  
  // Remove connection event listener
  thoughtContext.canvas.addEventListener(ajs.think.events.names.removeConnection, ajs.think.events.removeConnectionListener, unknownParam);
  
  // Setup the hover event listeners.
  thoughtContext.canvas.addEventListener(ajs.think.events.names.hoverMenuItem, ajs.think.events.hoverMenuItemListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.hoverAction, ajs.think.events.hoverActionListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.hoverNode, ajs.think.events.hoverNodeListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.events.names.hoverConnection, ajs.think.events.hoverConnectionListener, unknownParam);
  
  // Setup the Thought Menu event listeners.
  thoughtContext.canvas.addEventListener(ajs.think.thoughtMenu.menuItem.types.Close, ajs.think.events.closeThoughtListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.thoughtMenu.menuItem.types.ThoughtOptions, ajs.think.events.openThoughtOptionsListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.thoughtMenu.menuItem.types.Save, ajs.think.events.saveThoughtListener, unknownParam);
  thoughtContext.canvas.addEventListener(ajs.think.thoughtMenu.menuItem.types.Export, ajs.think.events.exportThoughtListener, unknownParam);
}

/**
 * Handles the Select event. Changes the node select to the new node.
 * 
 * @param {event} e the Select event.
 * @uses ajs.global.thought
 */
ajs.think.events.selectActionListener = function(e) {
  if (!e.node) {
    throw "Select Event needs a 'node' parameter.";
  }
  
  if (e.thoughtContext.thought != null) {
    e.thoughtContext.selection.node = e.node;
  }
}

/**
 * Handles the EditNode event. Pops up an Edit Node dialog.
 * 
 * @param {event} e the EditNode event.
 * @uses ajs.global.thought
 */
ajs.think.events.editNodeActionListener = function(e) {
  if (!e.node) {
    throw "EditNode Event needs a 'node' parameter.";
  }
  ajs.think.ui.editNodeDialog.promptUserToEditNodeText(e.node);
}

/**
 * Handles the RemoveConnection event. Removes a connection.
 * 
 * @param {event} e the RemoveConnection event.
 */
ajs.think.events.removeConnectionListener = function(e) {
  if (!e.connection) {
    throw "RemoveConnection Event needs a 'connection' parameter.";
  }
  ajs.think.thoughtMenu.promptUserToRemoveConnection(e.connection);
}

/**
 * Handles the Create Action event by creating a new Node off the currrently selected one. 
 * 
 * @param {event} e the Create Action event.
 * @uses CanvasContext
 * @uses ajs.global.thought
 */
ajs.think.events.createActionListener = function(e) {
  if (e.thoughtContext.thought != null) {
    var thought = e.thoughtContext.thought;
    var node = ajs.think.node.createNode(e.thoughtContext.getCanvasContext(), e.thoughtContext.options, thought.nodes, thought.connections, e.thoughtContext.selection.node);
    e.thoughtContext.selection.node = node;
    e.thoughtContext.thought.modified = true;
  }
}

/**
 * Handles the Connect Action event.
 * 
 * @param {event} e the Connect Action event.
 * @uses ajs.global.thought
 */
ajs.think.events.connectActionListener = function(e) {
  if (e.thoughtContext.thought != null) {
    e.thoughtContext.setStartingConnectNode(e.node);
  }
}

/**
 * Handles the Connect Two Nodes event.
 * 
 * @param {event} e the Connect Two Nodes event.
 * @uses ajs.global.thought
 */
ajs.think.events.connectTwoNodesListener = function(e) {
  if (e.thoughtContext.thought != null) {
    if (ajs.think.node.connectNodes(e.thoughtContext.thought.connections, e.thoughtContext.connectStartingNode, e.node)) {
      e.thoughtContext.thought.modified = true;
    }
    e.thoughtContext.connectStartingNode = null;
  }
}

/**
 * Handles the Destroy Action event by destroying the selected node.
 * 
 * @param {event} e the Destroy Action event.
 * @uses ajs.global.thought
 */
ajs.think.events.destroyActionListener = function(e) {
  if (e.thoughtContext.thought != null) {
    var thought = e.thoughtContext.thought;
    ajs.think.node.destroyNode(thought.nodes, thought.connections, e.thoughtContext.selection.node);
    e.thoughtContext.selection.node = null;
    e.thoughtContext.thought.modified = true;
  }
}

/**
 * Handles the Close Thought event by closing the current thought.
 * 
 * @param {event} e the Close Thought event.
 * @uses ajs.global.thought
 */
ajs.think.events.closeThoughtListener = function(e) {
  var thought = e.thoughtContext.thought;
  if (thought == null) {
    throw 'Cannot close a thought when there is none loaded.';
  }
  
  if (thought.modifiable && thought.modified) {
    if (confirm("This thought has unsaved changes. Do you still want to close this though?")) {
      ajs.think.closeThought();
      ajs.think.mainMenu.showMainMenu();
    } else {
      return false;
    } 
  } else { 
    ajs.think.closeThought();
    ajs.think.mainMenu.showMainMenu();
  }
}

/**
 * Handles the Open Thought Options event by opening the thought options modal dialog.
 * 
 * @param {event} e the Open Thought Options event.
 * @uses ajs.global.thought
 */
ajs.think.events.openThoughtOptionsListener = function(e) {
  ajs.think.ui.thoughtOptions.loadThoughOptionsDialog(function() {
    ajs.think.ui.thoughtOptions.showThoughtOptionsModalDialog();
  });
}

/**
 * Handles the Save Thought event by saving the current thought.
 * 
 * @param {event} e the Save Thought event.
 * @uses ajs.global.thought
 */
ajs.think.events.saveThoughtListener = function(e) {
  var thought = e.thoughtContext.thought;
  if (thought == null) {
    throw 'Cannot save thought when there is none loaded.';
  }
  
  e.thoughtContext.saveSubmenu = ajs.think.submenu.saveStates.Saving;
  var timeoutCallback = function() { e.thoughtContext.saveSubmenu = ajs.think.submenu.saveStates.TimeOutMessage; };
  ajs.think.thought.ajax.createOrUpdateThought(thought, ajs.think.thoughtMenu.createOrUpdateThoughtCallBack, timeoutCallback);
}

/**
 * Handles the Export Thought event by export the current thought.
 * 
 * @param {event} e the Export Thought event.
 * @uses ajs.global.thought
 */
ajs.think.events.exportThoughtListener = function(e) {
  var thought = e.thoughtContext.thought;
  if (thought == null) {
    throw 'Cannot Export a thought when there is none loaded.';
  }
  
  ajs.think.ui.exportThoughtDialog.loadExportThoughtDialog(function() {
    var image = ajs.think.ui.exportThoughtDialog.exportThoughtAsImage();
    ajs.think.ui.exportThoughtDialog.showExportThoughtDialog(image);
  });
}

/**
 * Handles the Hover Menu Item event by displaying a tool tip.
 * 
 * @param {event} e the Hover Menu Item event.
 */
ajs.think.events.hoverMenuItemListener = function(e) {
  assert(e.buttonType != null);
  e.thoughtContext.hover.menuItemType = e.buttonType;
}

/**
 * Handles the Hover Action event by displaying a tool tip.
 * 
 * @param {event} e the Hover Action event.
 */
ajs.think.events.hoverActionListener = function(e) {
  assert(e.buttonType != null);
  e.thoughtContext.hover.actionType = e.buttonType;
}

/**
 * Handles the Hover Node event by displaying a tool tip.
 * 
 * @param {event} e the Hover Node event.
 */
ajs.think.events.hoverNodeListener = function(e) {
  assert(e.node);
  e.thoughtContext.hover.node = e.node;
}

/**
 * Handles the Hover Connection event by displaying a tool tip.
 * 
 * @param {event} e the Hover Connection event.
 */
ajs.think.events.hoverConnectionListener = function(e) {
  assert(e.connection);
  e.thoughtContext.hover.connection = e.connection;
}
