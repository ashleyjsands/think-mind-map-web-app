/**
 * @fileoverview The Viewport class.
 */


goog.provide('ajs.Viewport');
goog.provide('ajs.viewport');

goog.require('ajs.utils');
goog.require('ajs.Observable');


/**
 * The Viewport class represents the view of the canvas displaying the current Thought.
 * 
 * The Viewport class contains two offset properties for the x and y axis, defining what point the top left hand
 * corner of the canvas represents within a Thought. These offset properties determine how graphics are drawn and
 * mouse events are handled. The offset values are to be subtracted from graphic positions and added to mouse 
 * positions.
 * 
 * @constructor
 * @param {number} xOffset the offset for the x component of the Viewport.
 * @param {number} yOffset the offset for the y component of the Viewport.
 */
ajs.Viewport = function(xOffset, yOffset) {
  this.xOffset_ = xOffset;
  this.yOffset_ = yOffset;
}

// "Inherits" from Observable.
ajs.utils.copyPrototype(ajs.Viewport, ajs.Observable);

ajs.viewport.observerMessages = {
  xOffset: 'xOffset',
  yOffset: 'yOffset'
};

/**
 * Getter and Setter for the xOffset property. Notifies Observers when the xOffset is changed.
 */
ajs.Viewport.prototype.__defineGetter__('xOffset', function() { return this.xOffset_; });
ajs.Viewport.prototype.__defineSetter__('xOffset', function(value) { this.xOffset_ = value; this.notify(ajs.viewport.observerMessages.xOffset); });

/**
 * Getter and Setter for the yOffset property. Notifies Observers when the yOffset is changed.
 */
ajs.Viewport.prototype.__defineGetter__('yOffset', function() { return this.yOffset_; });
ajs.Viewport.prototype.__defineSetter__('yOffset', function(value) { this.yOffset_ = value; this.notify(ajs.viewport.observerMessages.yOffset); });