/**
 * @fileoverview The Point class.
 */


goog.provide('ajs.Point');
goog.provide('ajs.point');


/**
 * The Point class represents the position in 2D space.
 * 
 * @constructor
 * @param {number} x the x component of the Point.
 * @param {number} y the y component of the Point.
 */
ajs.Point = function(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * Checks if two points are equal.
 * 
 * @param {ajs.point} pointOne the first point.
 * @param {ajs.point} positionOne the second point.
 * @returns {boolean} true if the points are equal, otherwise false.
 */
ajs.point.pointsEqual = function(pointOne, pointTwo) {
  if (pointOne == null || pointTwo == null) {
    return false;
  }
  
  if (pointOne.x != pointTwo.x) {
    return false;
  } else if (pointOne.y != pointTwo.y) {
    return false;
  } else {
    return true;
  }
}

/**
 * Converts a relative point into an absolute point based on a viewport.
 * 
 * @param {ajs.Point} relativePoint the relative point.
 * @param {ajs.Viewport} viewport the Viewport.
 * @return {ajs.Point} the absolute point.
 */
ajs.point.convertRelativePointToAbsolute = function(relativePoint, viewport) {
	return new ajs.Point(relativePoint.x + viewport.xOffset, relativePoint.y + viewport.yOffset);
}

/**
 * Converts an absolute point into a relative point based on a viewport.
 * 
 * @param {ajs.Point} absolutePoint the absolute point.
 * @param {ajs.Viewport} viewport the Viewport.
 * @return {ajs.Point} the relative point.
 */
ajs.point.convertAbsolutePointToRelative = function(absolutePoint, viewport) {
	return new ajs.Point(absolutePoint.x - viewport.xOffset, absolutePoint.y - viewport.yOffset);
}