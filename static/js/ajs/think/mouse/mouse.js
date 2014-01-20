/**
 * @fileoverview A collection of functions that handle Think mouse events for the canvas.
 */


goog.provide('ajs.think.mouse');

goog.require('ajs.math');


/**
 * Checks if a Node has been clicked on.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.Point} clickAbsolutePoint the mouse click's absolute point in the thought.
 * @param {ajs.think.Node} node the node being checked.
 * @return {boolean} true.
 */
ajs.think.mouse.clickedNode = function(context, options, clickAbsolutePoint, node) {
  return ajs.math.absoluteDistance(clickAbsolutePoint, node) <= node.radius(context, options);
}