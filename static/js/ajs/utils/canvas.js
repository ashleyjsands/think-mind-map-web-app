/**
 * @fileoverview A collection of utility functions for the Canvas element.
 */
  
  
goog.provide('ajs.utils.canvas');


/**
 * Computes the pixel length of the text with the given context.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {string} text the text to measure.
 * @param {string} fontStyle the font style of the text.
 * @return {number} the pixel length of the text.
 */
ajs.utils.canvas.textLength = function(context, text, fontStyle) {
  assert(fontStyle);
  if (context.font != fontStyle) {
    context.save();
    context.font = fontStyle;
  }
  
  var length = context.measureText(text).width;
  
  if (context.font != fontStyle) {
    context.restore();
  }
  return length;
}

/**
 * Resizes the canvas based on the given dimensions.
 * 
 * @param {string} canvasId the id of the canvas element.
 * @param {number} width the new width of the canvas.
 * @param {number} height the new height of the canvas.
 */
ajs.utils.canvas.changeCanvasSize = function(canvasId, width, height) {
  var canvas = document.getElementById(canvasId);
  canvas.width = width;
  canvas.height = height;
}