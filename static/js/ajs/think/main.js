/**
 * @fileoverview Loads and initialises the Web App.
 * 
 * This file needs the globals.js loaded before it.
 */


goog.provide('ajs.think.main');

goog.require('ajs.think');
goog.require('ajs.think.mainMenu');
goog.require('ajs.think.ui.tabs');
goog.require('ajs.think.thoughtMenu');
goog.require('ajs.think.events.window');
goog.require('ajs.think.globals');
goog.require('ajs.think.Options');
goog.require('ajs.think.ThoughtContext');
goog.require('openiduser');


/**
 * Hides and Reveals certain elements.
 */
ajs.think.bodyLoad = function() {
  ajs.think.setupGlobals();
  ajs.think.ui.tabs.initialiseTabs();
  ajs.think.events.window.setupListeners();
  if (document.location.hash != "") {
    var matches = document.location.hash.match( /thought\/(.*)/ );
    // TODO: the above code will break with additional params.
    var thoughtId = matches[1];
    ajs.think.thoughtMenu.openThoughtUsingId(thoughtId);
  } else {
    ajs.think.mainMenu.showMainMenu();
    if (ajs.think.mainMenu.userLoggedIn()) {
      ajs.think.mainMenu.showMotdDialog();
    } else {
      ajs.think.mainMenu.checkNewUser();
    }
  }
}

/**
 * Sets up the ajs.think.globals global variable.
 */
ajs.think.setupGlobals = function() {
  var drawingCanvas = document.getElementById(new ajs.think.Options().ids.canvas);
  ajs.think.globals = new ajs.think.ThoughtContext(drawingCanvas);
}