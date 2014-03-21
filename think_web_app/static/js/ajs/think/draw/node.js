/**
 * @fileoverview A collection of functions that collectively draw a node on a canvas context.
 */


goog.provide('ajs.think.draw.node');

goog.require('ajs.draw');
goog.require('ajs.utils');


/**
 * Draws a Node onto the canvas.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.think.thought.Theme} theme the Thought's theme.
 * @param {number} x the x point of the centre of the Node.
 * @param {number} y the y point of the centre of the Node.
 * @param {number} radius the radius of the node.
 * @param {boolean} drawGradient if set to true, will draw the Node with a gradient, if set to 
 *   false, will draw the node with a flat colour.
 * @param {boolean} highlighted the node is to be drawn with the highlight gradient.
 */
ajs.think.draw.node.drawNode = function(context, options, theme, x, y, radius, drawGradient, highlighted) {
  var fillStyle = null;
  if (drawGradient) {
    var innerRadius = radius / options.circleGradientInnerRadiusQuotient;
    var radialGrad = context.createRadialGradient(x, y, innerRadius, x, y, radius);
      
    var outerColor = theme.nodeOuterColor;
    var innerColor;
    if (highlighted) {
      innerColor = ajs.draw.lightenColor(theme.nodeInnerColor, options.nodeHightlightLightenVal);
    } else {
      innerColor = theme.nodeInnerColor;
    }
    var gradientStops = [[0, innerColor], [1, outerColor]];
    
    for (var i = 0; i < gradientStops.length; i++) {
      var stop = gradientStops[i];
      radialGrad.addColorStop(stop[0],stop[1]);
    }
    fillStyle = radialGrad; 
  } else {
    fillStyle = options.circleFillColor;
  }
  ajs.draw.drawCircle(context, x, y, radius, fillStyle, options.circleStrokeWidth, options.circleStrokeStyle);
}

/**
 * Draws the text onto a Node.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.think.thought.Theme} theme the Thought's theme.
 * @param {number} x the x point of the centre of the Node.
 * @param {number} y the y point of the centre of the Node.
 * @param {number} radius the radius of the node.
 * @param {string} text the text to be drawn on the Node.
 */
ajs.think.draw.node.drawNodeText = function(context, options, theme, x, y, radius, text) {
  context.save();
  context.textAlign = "center";
  context.fillStyle = theme.nodeTextColor;
  context.textBaseline= "middle";
  context.font = options.nodeFontStyle;
  context.fillText(text, x, y);
  context.restore();
}

/**
 * Draws the wrapped text onto a Node.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.think.thought.Theme} theme the Thought's theme.
 * @param {number} x the x point of the centre of the Node.
 * @param {number} y the y point of the centre of the Node.
 * @param {number} radius the radius of the node.
 * @param {string} wrappedText the wrapped text to be drawn on the Node.
 */
ajs.think.draw.node.drawNodeWrappedText = function(context, options, theme, x, y, radius, wrappedText) {
  context.save();
  context.textAlign = "center";
  context.fillStyle = theme.nodeTextColor;
  context.textBaseline= "top";
  context.font = options.nodeFontStyle;
  
  // Draw the wrapped lines of text horizontaly and vertically centred.
  for (var i = 0; i < wrappedText.length; i++) {
    var line = wrappedText[i];
    // Remember up is down and down is up.
    var lineDistanceFromCentre = wrappedText.length / 2 - i;
    var lineX = x;
    var lineY = y - lineDistanceFromCentre * options.nodeFontSize;
    context.fillText(line, lineX, lineY);
  }

  context.restore();
}
