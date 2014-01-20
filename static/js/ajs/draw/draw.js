/**
 * @fileoverview A collection of miscellaneous functions that draw on a canvas context.
 */


goog.provide('ajs.draw');

//goog.require('goog.color');
goog.require('ajs.Point');
goog.require('ajs.math');


/**
 * Clears the Canvas
 * 
 * @param {CanvasRenderingContext2D} context the Canvas context.
 * @param {number} width the width of the Canvas.
 * @param {number} height the height of the Canvas.
 */
ajs.draw.clearCanvas = function(context, width, height) {
  context.clearRect(0, 0, width, height);
}

/**
 * Draw a top-to-bottom gradient for the given dimensions.
 * 
 * @param {CanvasRenderingContext2D} context the Canvas context.
 * @param {number} x the x component of the top left hand corner of the area.
 * @param {number} y the y component of the top left hand corner of the area.
 * @param {number} width the width of the area.
 * @param {number} height the height of the area.
 * @param {String} topColor the top color of the gradient.
 * @param {String} bottomColor the bottom color of the gradient.
 */
ajs.draw.drawTopToBottomGradientArea = function(context, x, y, width, height, topColor, bottomColor) {
  context.save();
  var gradient = context.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor); 
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);
  context.restore();
}

/**
 * Draws a circle onto the canvas.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {number} x the x point of the centre of the Node.
 * @param {number} y the y point of the centre of the Node.
 * @param {number} radius the radius of the node.
 * @param {string} fillStyle the fillStyle of the circle.
 * @param {string} lineWidth the lineWidth of the circle.
 * @param {string} strokeStyle the strokeStyle of the circle.
 */
ajs.draw.drawCircle = function(context, x, y, radius, fillStyle, lineWidth, strokeStyle) {
	context.save();
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.beginPath();
    var startAngle = 0;
    var endAngle = Math.PI * 2;;
    var clockwise = true;
    context.arc(x, y, radius, startAngle, endAngle, clockwise);
    context.closePath();
    context.stroke();
	if (fillStyle != null) {
      context.fillStyle = fillStyle;
      context.fill();
	}
  context.restore();
}


/**
 * Draws a Button onto the canvas.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {number} x the x point of the centre of the Button.
 * @param {number} y the y point of the centre of the Button.
 * @param {number} radius the radius of the node.
 * @param {string} fillStyle the fillStyle of the button..
 */
ajs.draw.drawButton = function(context, options, x, y, radius, fillStyle) {
  ajs.draw.drawCircle(context, x, y, radius, fillStyle, options.circleStrokeWidth, options.circleStrokeStyle);
}

/**
 * Draws a rounded rectangle. It is assumed that the points are vertically equal and pointA is to the left of
 * pointB.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Point} pointA an arbitrary point defining the middle point of one of arcs.
 * @param {ajs.Point} pointB an arbitrary point defining the middle point of one of arcs.
 * @param {number} radius the radius of the arcs.
 * @param {string} fillStyle the fillStyle of the circle.
 * @param {string} lineWidth the lineWidth of the circle.
 * @param {string} strokeStyle the strokeStyle of the circle.
 */
ajs.draw.drawRoundedRectangle = function(context, pointA, pointB, radius, fillStyle, lineWidth, strokeStyle) {
  if (pointA.y != pointB.y) {
    throw 'Points not vertically equal.';
  } else if (!(pointA.x < pointB.x)) {
    throw 'pointA is not to the left of pointB.';
  }
  
	context.save();
  context.lineWidth = lineWidth;
  context.strokeStyle = strokeStyle;
  context.beginPath();
  var bottomAngle = ajs.math.degree2rad(270);
  var topAngle = ajs.math.degree2rad(90);
  var clockwise = true;
  // Note: the top and bottom lines of the rectangle are automatically filled by the context. 
  // Draw left arc.
  context.arc(pointA.x, pointA.y, radius, bottomAngle, topAngle, clockwise);
  // Draw Bottom.
  context.arc(pointB.x, pointB.y, radius, topAngle, bottomAngle, clockwise);
  
  context.closePath();
  context.stroke();
	if (fillStyle != null) {
    context.fillStyle = fillStyle;
    context.fill();
	}
  context.restore();
}

/**
 * Draws some text.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {string} text the text to draw.
 * @param {ajs.Point} point the point to draw the text at.
 * @param {string} fontStyle the font of the text.
 * @param {string} colour the fillStyle of the text.
 */
ajs.draw.drawText = function(context, text, point, fontStyle, colour) {
  context.save();
  context.font = fontStyle;
  context.fillStyle = colour;
  context.fillText(text, point.x, point.y);
  context.restore();
}

/**
 * Lightens a colour.
 * 
 * @param {String} color a string that contains a hex color.
 * @param {number} lightenVal the value to lighten the color. Assert -1 < lightenVal < 1.
 * @param {string} a string containing the lightened color.
 */
ajs.draw.lightenColor = function(color, lightenVal) {
  var minlightenVal = -1;
  if (lightenVal < minlightenVal) {
    throw "lightenVal less than minimum allowed value.";
  }
  var maxlightenVal = 1;
  if (lightenVal > maxlightenVal) {
    throw "lightenVal greater than minimum allowed value.";
  }
  
  var hsl = goog.color.hexToHsl(color);  var lightnessIndex = 2;
  var lightnessIndex = 2;
  hsl[lightnessIndex] = hsl[lightnessIndex] + lightenVal;
  return goog.color.hslToHex(hsl[0], hsl[1], hsl[2]);
}
