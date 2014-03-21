/**
 * @fileoverview A collection of functions relating to the Thought Options Dialog.
 */


goog.provide('ajs.think.ui.thoughtOptions');
goog.provide('ajs.think.ui.thoughtOptions.ids');
goog.provide('ajs.think.ui.thoughtOptions.globals');

goog.require('ajs.dom');
goog.require('ajs.think.globals');
goog.require('ajs.think.uri');


// Ids
ajs.think.ui.thoughtOptions.ids.thoughtOptionsModalDialog = 'thoughtOptionsModalDialog';
ajs.think.ui.thoughtOptions.ids.thoughtOptionsTabs = 'thoughtOptionsTabs';

// Globals
ajs.think.ui.thoughtOptions.globals.dialogInitialised = false;
ajs.think.ui.thoughtOptions.globals.showDialog = false;


/**
 * Shows the Thought Options modal dialog box.
 */
ajs.think.ui.thoughtOptions.showThoughtOptionsModalDialog = function() {
  if (ajs.think.ui.thoughtOptions.globals.dialogInitialised) {
    $('#' + ajs.think.ui.thoughtOptions.ids.thoughtOptionsModalDialog).dialog('open');
    
    // Reload all tabs.
    var tabs = $('#' + ajs.think.ui.thoughtOptions.ids.thoughtOptionsTabs);
    tabs.tabs('destroy');
    tabs.tabs();

    ajs.think.ui.thoughtOptions.globals.showDialog = false;
  } else {
    ajs.think.ui.thoughtOptions.globals.showDialog = true;
  }
}

/**
 * Initialises (but does not show) the Thought Options modal dialog box.
 */
ajs.think.ui.thoughtOptions.initialiseThoughtOptionsModalDialog = function() {
  $('#' + ajs.think.ui.thoughtOptions.ids.thoughtOptionsTabs).tabs();
}

/**
 * Dynamically loads the Edit Node Text Dialog.
 * 
 * @param {function} callback the callback that is called when the dialog is loaded.
 */
ajs.think.ui.thoughtOptions.loadThoughOptionsDialog = function(callback) {
  ajs.dom.loadUriIfElementNonExistant(ajs.think.uri.thoughtOptionsDialog, ajs.think.ui.thoughtOptions.ids.thoughtOptionsModalDialog, callback);
}

/**
 * A function to be called by children tabs to check that the Dialog is initialised.
 * This is a hack due to the asynchronous nature of the initialises of tabs and dialogs.
 */
ajs.think.ui.thoughtOptions.checkThatDialogIsInitialised = function() {
  if (!ajs.think.ui.thoughtOptions.globals.dialogInitialised) {
    $('#' + ajs.think.ui.thoughtOptions.ids.thoughtOptionsModalDialog).dialog({
      modal: true,
      autoOpen: false,
      buttons: {
        Ok: function() {
          $(this).dialog('close');
        }
      }, 
      width: ajs.think.globals.options.thoughtOptionsWidth
    });
    ajs.think.ui.thoughtOptions.globals.dialogInitialised = true;
  }
  if (ajs.think.ui.thoughtOptions.globals.showDialog) {
    ajs.think.ui.thoughtOptions.showThoughtOptionsModalDialog();
  }
}