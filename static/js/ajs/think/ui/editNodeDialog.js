/**
 * @fileoverview A collection of functions relating to the Edit Node Dialog.
 * @requires jQuery
 */


goog.provide('ajs.think.ui.editNodeDialog');
goog.provide('ajs.think.ui.editNodeDialog.ids');

goog.require('ajs.dom');
goog.require('ajs.think.globals');
goog.require('ajs.think.uri');


ajs.think.ui.editNodeDialog.ids.editNodeModalDialog = 'editNodeModalDialog';
ajs.think.ui.editNodeDialog.ids.editNodeModalDialogText = 'editNodeModalDialogText';

/**
 * Initialises (but does not show) the Edit Node Text modal dialog box.
 */
ajs.think.ui.editNodeDialog.initialiseEditNodeModalDialog = function() {
  $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialog).dialog({
		autoOpen: false,
		modal: true,
    width: ajs.think.globals.options.editNodeModalDialogWidth,
		buttons: {
			Ok: function() {
			 	$(this).dialog('close');
      },
			Cancel: function() {
				$(this).dialog('close');
			}
    }
  });
}

/**
 * A callback invoked when the Edit Node Prompt is successful (the user entered new node text).
 * 
 * @param {ajs.think.Node} node the Node to edit.
 * @param {String} newTextValue the new text for the Node.
 */
ajs.think.ui.editNodeDialog.editNodePromptSuccessCallback = function(node, newTextValue) {
  if (newTextValue != null) {
    node.text = newTextValue;
    ajs.think.globals.thought.modified = true;
  }
}

/**
 * Show the Edit Node text modal dialog.
 * 
 * @param {ajs.think.Node} node the node to edit.
 * @param {function} successCallback the callback that is called if the user makes a change to the Node text.
 */
ajs.think.ui.editNodeDialog.showEditNodeModalDialog = function(node, successCallback) {  
  $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialogText).val(node.text);
  
  // Return text value to caller.
  var returnText = function() {
    var text = $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialogText).val();
    successCallback(node, text);
    // Unbind this function, otherwise it will cause a bug when the editNode dialog is used more than once.
    $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialog).unbind('dialogclose', returnText);
  };
  
  var buttons = {
    Ok: function() {
      $(this).dialog('close');
    }
  };
  $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialog).dialog('option', 'buttons', buttons);
  $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialog).bind('dialogclose', returnText);
  
  // Close on enter, which will then return text value to caller.
  var closeOnEnter = function(e) {
    var enterKeyCode = 13;
    if (e.keyCode == enterKeyCode) {
      $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialog).dialog('close');
      return false;
    }
  };
  document.getElementById(ajs.think.ui.editNodeDialog.ids.editNodeModalDialogText).onkeypress = closeOnEnter;
  
  $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialog).dialog('open');
  $("#" + ajs.think.ui.editNodeDialog.ids.editNodeModalDialogText).focus();
}


/**
 * Dynamically loads the Edit Node Text Dialog.
 *
 * @param {function} callback a callback invoked when the dialog is loaded.
 */
ajs.think.ui.editNodeDialog.loadEditNodeModalDialog = function(callback) {
  ajs.dom.loadUriIfElementNonExistant(ajs.think.uri.editNodeDialog, ajs.think.ui.editNodeDialog.ids.editNodeModalDialog, callback);
}

/**
 * Prompts the user to edit the Node text
 * 
 * @param {ajs.think.Node} nodeText the Node to edit.
 */
ajs.think.ui.editNodeDialog.promptUserToEditNodeText = function(node) {
  ajs.think.ui.editNodeDialog.loadEditNodeModalDialog(function() {
    ajs.think.ui.editNodeDialog.showEditNodeModalDialog(node, ajs.think.ui.editNodeDialog.editNodePromptSuccessCallback);
  });
}