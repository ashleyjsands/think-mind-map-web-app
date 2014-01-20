/**
 * @fileoverview A collection of functions that collectively draw a selected node on a canvas context.
 */


goog.provide('ajs.think.draw.selection');


/**
 * Draws the node selection visuals.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {ajs.Viewport} viewport the viewport for the canvas.
 * @param {ajs.Selection} selection info about the currently selected node.
 */
ajs.think.draw.selection.drawSelection = function(context, options, viewport, selection) {
	var selectedNode = selection.node;
	if (selectedNode != null) {
      context.save();
      var selectionRadius = selectedNode.radius(context, options) + selection.selectionAddition;
      context.lineWidth = options.selectionStrokeWidth;
      context.strokeStyle = options.selectionStrokeStyle;
      context.beginPath();
      var startAngle = 0;
      var endAngle = Math.PI * 2; // 360 degrees
      var clockwise = true;
      context.arc(selectedNode.x - viewport.xOffset, selectedNode.y - viewport.yOffset, selectionRadius, startAngle, endAngle, clockwise);
      context.closePath();
      context.stroke();
      context.restore();
	}
}