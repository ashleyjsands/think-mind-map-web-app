/**
 * @fileoverview A collection of functions that draw connections on a canvas context.
 */


goog.provide('ajs.think.draw.connection');

goog.require('ajs.draw');
goog.require('ajs.math');


/**
 * Draws a connection between two nodes.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @param {ajs.think.thought.Theme} theme the Thought's theme.
 * @param {number} x0 the x point of the centre of the first node.
 * @param {number} y0 the y point of the centre of the first node.
 * @param {number} r0 the radius of the first node.
 * @param {number} x1 the x point of the centre of the second node.
 * @param {number} y1 the y point of the centre of the second node.
 * @param {number} r1 the radius of the second node.
 * @param {number} controlPointValue a value that determines the width of the connection. Set it to
 *   -50 for a small width, or set it to 1 for a big width.
 * @param {boolean} true if the connection is to be drawn as highlighted, false otherwise.
 */
ajs.think.draw.connection.drawConnection = function(context, options, theme, x0, y0, r0, x1, y1, r1, controlPointValue, highlighted) {
  // This calculation code is similar to the ajs.node.computeConnectionPolygonVertices
  // Caclulate connection slop angle
  var angle = null;
  if ((x1 - x0) == 0) {
    angle = ajs.math.degree2rad(90.0);
  } else {
    angle = Math.atan((y1 - y0) / (x1 - x0));
  }
  var topAngle = angle + ajs.math.degree2rad(90.0); 
  var bottomAngle = topAngle + ajs.math.degree2rad(180.0);

  // Compute the Connection points
  // Each node has a top and bottom node which has to be rotated based on the 
  // Connections angle. 
  var top0 = ajs.math.computePointOnCircle(x0, y0, r0, topAngle);
  var bottom0 = ajs.math.computePointOnCircle(x0, y0, r0, bottomAngle);
  var top1 = ajs.math.computePointOnCircle(x1, y1, r1, topAngle);
  var bottom1 = ajs.math.computePointOnCircle(x1, y1, r1, bottomAngle);
  var middlePointX = (x0 + x1) / 2;
  var middlePointY = (y0 + y1) / 2;
  var controlTopX = middlePointX + Math.cos(topAngle) * controlPointValue; 
  var controlTopY = middlePointY + Math.sin(topAngle) * controlPointValue; 
  var controlBottomX = middlePointX + Math.cos(bottomAngle) * controlPointValue; 
  var controlBottomY = middlePointY + Math.sin(bottomAngle) * controlPointValue; 

  var fillStyle;
  if (options.connectionDrawGradient) {
    var outerColor, innerColor;
    if (highlighted) {
      outerColor = ajs.draw.lightenColor(theme.connectionOuterColor, options.connectionOuterHightlightLightenVal);
      innerColor = ajs.draw.lightenColor(theme.connectionInnerColor, options.connectionInnerHightlightLightenVal);
    } else {
      outerColor = theme.connectionOuterColor;
      innerColor = theme.connectionInnerColor;
    }
    fillStyle = context.createLinearGradient(top0.x, top0.y, bottom0.x, bottom0.y);
    fillStyle.addColorStop(0, outerColor);
    fillStyle.addColorStop(0.5, innerColor);
    fillStyle.addColorStop(1, outerColor);
  } else {
    if (highlighted) {
      throw 'NotImplemented';
    } else {
      fillStyle = options.connectionFillColor;
    }
  }
  context.save();
  context.fillStyle = fillStyle;
  context.strokeStyle = options.connectionStrokeColor;
  context.beginPath();  

  context.moveTo(top0.x, top0.y);  
  context.quadraticCurveTo(controlTopX,controlTopY,top1.x,top1.y);  

  context.lineTo(bottom1.x, bottom1.y);  
  context.quadraticCurveTo(controlBottomX,controlBottomY,bottom0.x,bottom0.y);  

  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
}