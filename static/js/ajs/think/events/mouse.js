/**
 * @fileoverview This file contains all of the mouse listener functions.
 */


goog.provide('ajs.think.events.mouse');

goog.require('ajs.mouseEntity');
goog.require('ajs.think');
goog.require('ajs.think.globals');


/**
 * A function that processes a mouse click on the canvas.
 * 
 * @param {event} e the mouse click event.
 * @uses CanvasContext
 * @uses ajs.global.thought
 * @uses ajs.global.viewport
 */
ajs.think.events.mouse.clickListener = function(e) {
  if (ajs.think.globals.thought != null) {
    ajs.mouseEntity.processClick(ajs.think.globals, ajs.think.globals.mouseEntities, ajs.mouse.clickType.single, e);
  }
}

/**
 * A function that processes a mouse double click on the canvas.
 * 
 * @param {event} e the mouse click event.
 * @uses CanvasContext
 * @uses ajs.global.thought
 * @uses ajs.global.viewport
 */
ajs.think.events.mouse._doubleClickListener = function(e) {
  if (ajs.think.globals.thought != null) {
    ajs.mouseEntity.processClick(ajs.think.globals, ajs.think.globals.mouseEntities, ajs.mouse.clickType._double, e);
  }
}

/**
 * A function that processes a mouse down on the canvas.
 * 
 * @param {event} e the mouse down event.
 * @uses CanvasContext
 * @uses ajs.global.thought
 * @uses ajs.global.viewport
 */
ajs.think.events.mouse.downListener = function(e) {
  if (ajs.think.globals.thought != null) {
    if (e.button == ajs.mouse.button.left) {
      ajs.mouseEntity.processDown(ajs.think.globals, ajs.think.globals.mouseEntities, null, e);
    }
  }
}

/**
 * A function that processes a mouse up on the canvas.
 * 
 * @param {event} e the mouse up event.
 * @uses CanvasContext
 * @uses ajs.global.thought
 * @uses ajs.global.viewport
 */
ajs.think.events.mouse.upListener = function(e) {
  if (ajs.think.globals.thought != null) {
    if (e.button == ajs.mouse.button.left) {
      ajs.mouseEntity.processUp(ajs.think.globals, ajs.think.globals.mouseEntities, null, e);
    }
  }
}

/**
 * A function that processes a mouse hover on the canvas.
 * 
 * @param {event} e the mouse hover event.
 */
ajs.think.events.mouse.hoverListener = function(e) {
  if (ajs.think.globals.thought != null) {
    ajs.mouseEntity.processHover(ajs.think.globals, ajs.think.globals.mouseEntities, null, e);
  }
}

