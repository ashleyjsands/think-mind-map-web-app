/**
 * @fileoverview This file sets up all the window event listeners for the Web App.
 */


goog.provide('ajs.think.events.window');

goog.require('ajs.think.globals');
goog.require('ajs.think.mainMenu');
goog.require('ajs.think');


/**
 * Sets up the Window event listeners.
 */
ajs.think.events.window.setupListeners = function() {
  window.onresize = ajs.think.events.window.resizeListener;
  window.onfocus = ajs.think.events.window.focusListener;
  window.onblur = ajs.think.events.window.blurListener;
}

/**
 * Handles the window resize event by resizing the canvas and main menu.
 * 
 * @param {event} e the window resize event.
 */
ajs.think.events.window.resizeListener = function(e) {
  ajs.think.mainMenu.resizeMenuWidths();
  ajs.think.sizeCanvasToWindow();
  // Remove the cached culled data because it is now incorrect.
  ajs.think.globals.resetCulling();
}

/**
 * Handles the window focus event by starting current animation.
 * 
 * @param {event} e the window focus event.
 * @uses ajs.global.thought
 */
ajs.think.events.window.focusListener = function(e) {
  if (ajs.think.globals.thought != null) {
    ajs.think.startThoughtAnimation(ajs.think.globals);
  }
}

/**
 * Handles the window blur event by stopping current animation.
 * 
 * @param {event} e the window blur event.
 * @uses ajs.global.thought
 */
ajs.think.events.window.blurListener = function(e) {
  if (ajs.think.globals.thought != null) {
    ajs.think.stopThoughtAnimation(ajs.think.globals);
    ajs.think.globals.resetMouseStates();
  }
}
