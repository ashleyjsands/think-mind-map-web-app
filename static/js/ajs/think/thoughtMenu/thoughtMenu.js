/**
 * @fileoverview A collection of functions and enums relating to the Thought Menu.
 * @requires jQuery
 */


goog.provide('ajs.think.thoughtMenu');

goog.require('ajs.think');
goog.require('ajs.think.Node');
goog.require('ajs.think.node');
goog.require('ajs.think.globals');
goog.require('ajs.think.thoughtMenu.globals');
goog.require('ajs.think.Thought');
goog.require('ajs.think.thought');
goog.require('ajs.think.thought.ajax');
goog.require('ajs.think.Selection');
goog.require('ajs.think.Submenu');
goog.require('ajs.think.submenu');
goog.require('ajs.think.uri');
goog.require('ajs.think.ui.tabs');


/**
 * Creates a new Thought in the Web App.
 * 
 * @param {string} thoughtName the name of the new thought.
 */
ajs.think.thoughtMenu.createAndLoadNewThought = function(thoughtName) {
  ajs.think.setupCanvas();
  var drawingCanvas = ajs.think.globals.canvas;
  var nodes = [new ajs.think.Node(drawingCanvas.width/2, drawingCanvas.height/2, "")];
  var connections = [];
  ajs.think.loadThoughtIntoCanvas(new ajs.think.Thought(nodes, connections, thoughtName));
}

/**
 * Loads a thought into the Web App.
 *
 * @param {string} thoughtName the name of the thought to load. 
 */
ajs.think.thoughtMenu.openThoughtUsingName = function(thoughtName) {
  ajs.think.setupCanvas();
  ajs.think.thought.ajax.getThoughtUsingName(thoughtName, ajs.think.thoughtMenu.getThoughtCallBack);
} 

/**
 * Opens a thought into the Web App.
 *
 * @param {string} thoughtId the id of the thought to load. 
 */
ajs.think.thoughtMenu.openThoughtUsingId = function(thoughtId) {
  ajs.think.setupCanvas();
  ajs.think.thought.ajax.getThoughtUsingId(thoughtId, ajs.think.thoughtMenu.getThoughtCallBack);
} 

/**
 * The callback function for getting a Thought.
 * 
 * @param {object} response a response in the form of a JSON object. It has the following properties: success, 
 *   thought, errorMsg.
 */
ajs.think.thoughtMenu.getThoughtCallBack = function(response) {
  if (!response.success) {
    alert(response.errorMsg);
  } else {
    // Because of the nature of JSON, there are duplicate ajs.think.Node objects in the ajs.Connection objects.
    // So it is best if they are recreated from scratch.
    ajs.think.loadThoughtIntoCanvas(ajs.think.thought.createThoughtBasedOnJsonObjects(response.thought));
  }
}

/**
 * Deletes a thought.
 *
 * @param {string} thoughtId the id of the thought to delete. 
 */
ajs.think.thoughtMenu.deleteThoughtUsingId = function(thoughtId) {
  ajs.think.thought.ajax.deleteThoughtUsingId(thoughtId, ajs.deleteThoughtCallBack);
} 

/**
 * Hides the Save Submenu.
 */
ajs.hideSaveSubmenu = function() {
  ajs.think.globals.saveSubmenu = null;
};

/**
 * Prompts the user to remove a connection.
 * 
 * @param {Array(ajs.think.Node)} connection the connection to remove.
 */
ajs.think.thoughtMenu.promptUserToRemoveConnection = function(connection) {
  var content = 'Are you sure you want to delete this connection?';
  if (confirm(content)) {
    ajs.think.node.destroyConnection(ajs.think.globals.thought.connections, connection);
    ajs.think.globals.thought.modified = true;
  }
}

/**
 * The callback function for creating or inserting a Thought.
 * 
 * @param {object} response a JSON object with properties: success and errorMsg.
 */
ajs.think.thoughtMenu.createOrUpdateThoughtCallBack = function(response) {
  if (response.success) {
    ajs.think.globals.saveSubmenu = ajs.think.submenu.saveStates.SuccessfulSaveMessage;
    ajs.think.globals.thought.modified = false;
    ajs.think.globals.failureSaveErrorMessage = null;
    if (ajs.think.globals.thought.id == null) {
      // Reload the newly Saved thought so that everything will have its id values.
      ajs.think.thoughtMenu.openThoughtUsingName(ajs.think.globals.thought.name);
    }
  } else {
    ajs.think.globals.saveSubmenu = ajs.think.submenu.saveStates.FailureSaveErrorMessage;
    ajs.think.globals.failureSaveErrorMessage = response.errorMsg;
  }
  setTimeout(function() {ajs.hideSaveSubmenu();}, ajs.think.globals.options.saveOperationDisplayDuration);
}