/**
 * @fileoverview A collection of functions that collectively draw actions on a canvas context.
 */


goog.provide('ajs.think.draw.action');

goog.require('ajs.draw');
goog.require('ajs.Point');
goog.require('ajs.think.action');


/**
 * Draws the Node actions on the selected node.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {ajs.Viewport} viewport the viewport for the canvas.
 * @param {Array(ajs.Action)} actions an array of actions.
 * @param {ajs.think.actionTypes} hoverActionType the type of action being hovered on.
 */
ajs.think.draw.action.drawActions = function(context, options, viewport, actions, hoverActionType) {  
  for(var i = 0; i < actions.length; i++) {
    var actionX = actions[i].x - viewport.xOffset;
    var actionY = actions[i].y - viewport.yOffset;
    var fillStyle;
    if (actions[i].type == hoverActionType) {
      fillStyle = options.actionButtonHoverFillStyle;
    } else {
      fillStyle = options.buttonFillStyle;
    }
    ajs.draw.drawButton(context, options, actionX, actionY, options.actionRadius, fillStyle);
    context.drawImage(actions[i].image(), actionX - options.actionRadius, actionY - options.actionRadius, 
      options.imgWidth, options.imgHeight);
  }
}

/**
 * Draws a tool tip for an action for the selected node.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {ajs.Viewport} viewport the viewport for the canvas.
 * @param {ajs.think.actionTypes} actionType the type of action the tool tip is displayed for.
 * @param {ajs.Point} centrePoint the centre point of the action tool tip.
 */
ajs.think.draw.action.drawActionToolTip = function(context, options, viewport, actionType, centrePoint) {  
  var radius = options.actionToolTipFontSize + options.actionToolTipLineWidth;
  var text = ajs.think.action.toolTips[actionType];
  var length = ajs.utils.canvas.textLength(context, text, options.actionToolTipFontStyle);
  var pointA = new ajs.Point(centrePoint.x - viewport.xOffset - length / 2, centrePoint.y - viewport.yOffset);
  var pointB = new ajs.Point(centrePoint.x - viewport.xOffset + length / 2, centrePoint.y - viewport.yOffset);
  
  ajs.draw.drawRoundedRectangle(context, pointA, pointB, radius, options.actionToolTipFillStyle, options.actionToolTipLineWidth, options.actionToolTipStrokeStyle);
  
  // Draw tool tip Text
  context.save();
  context.textBaseline= "middle";
  ajs.draw.drawText(context, text, pointA, options.actionToolTipFontStyle, options.actionToolTipTextColour)
  context.restore();
}