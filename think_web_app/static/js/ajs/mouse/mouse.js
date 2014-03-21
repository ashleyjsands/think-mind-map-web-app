/**
 * @fileoverview A collection of functions that handle mouse events for the canvas.
 */


goog.provide('ajs.mouse');

goog.require('ajs.Point');


/**
 * The click types of a mouse click.
 * 
 * @enum {String}
 */
ajs.mouse.clickType = {};
ajs.mouse.clickType.single = 'single';
ajs.mouse.clickType._double = 'double';

/**
 * The mouseButton values used in the 'button' property of a MouseEvent.
 * 
 * @enum {number}
 */
ajs.mouse.button = {};
ajs.mouse.button.left = 0;
ajs.mouse.button.middle = 1;
ajs.mouse.button.right = 2;

/**
 * Converts a Mouse Event to an ajs.Point object. This function encapsulates some portable code.
 * 
 * @param {ClickEvent} mouseEvent a mouse event.
 * @returns {ajs.Point} the point.
 */
ajs.mouse.convertMouseEventToPoint = function(mouseEvent) {
  // Firefox does not have the 'x' and 'y' properties in the mouseEvent, so it is necessary to convert 
  // the event object into the ajs.Point object.
  return new ajs.Point(mouseEvent.clientX, mouseEvent.clientY);
}