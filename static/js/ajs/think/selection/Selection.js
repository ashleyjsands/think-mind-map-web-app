/**
 * @fileoverview The Selection class.
 */


goog.provide('ajs.think.Selection');

goog.require('ajs.Point');
goog.require('ajs.think.action');
goog.require('ajs.think.Action');
goog.require('ajs.think.node');


/**
 * The Selection class represents the currently selected Node in the thought.
 * 
 * @constructor
 * @param {ajs.think.ThoughtContext} context the context of the Thought the selection is associated with.
 * @param {ajs.think.Node} node the selected node. This may be set to null.
 */
ajs.think.Selection = function(thoughtContext, node) {
  this.thoughtContext = thoughtContext;
  this.node_ = node;
  this.selectionAddition = this.thoughtContext.options.selectionDiffMin;
  this.expanding = true;
}

ajs.think.Selection.prototype.__defineGetter__('node', function() { return this.node_; });
ajs.think.Selection.prototype.__defineSetter__('node', function(value) { this.node_ = value; this.selectionAddition = this.thoughtContext.options.selectionDiffMin; this.expanding = true; });
  
/**
 * Animates the selection visuals.
 * 
 * @param {number} timeDiff the time difference in milliseconds between this animation frame and 
 *   the previous one.
 */
ajs.think.Selection.prototype.animate = function(timeDiff) {
  
 if (this.node != null) {
   var value = (this.thoughtContext.options.selectionDiffMax - this.thoughtContext.options.selectionDiffMin) / this.thoughtContext.options.animationLengthInMillseconds * timeDiff;
	 if (this.expanding) {
	   this.selectionAddition += value;
	 } else {
	   this.selectionAddition -= value;
	 }
	
	 // Check for the bounds
	 if (this.selectionAddition >= this.thoughtContext.options.selectionDiffMax) {
	   this.selectionAddition = this.thoughtContext.options.selectionDiffMax;
	   this.expanding = false;
	 } else if (this.selectionAddition <= this.thoughtContext.options.selectionDiffMin) {
	   this.selectionAddition = this.thoughtContext.options.selectionDiffMin;
	   this.expanding = true;
   }
 }
}
  
/**
 * Creates the actions for the selection Node.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @return {Array(ajs.think.Action)} an array of Actions.
 */
ajs.think.Selection.prototype.createActions = function(context, options) {
  if (this.node == null) {
    return [];
  }
  var points = this.computeActionPoint(context, options);
  var types = ajs.think.action.typesArray;
	
  if (points.length != types.length) {
    throw "Must be equal.";
  }
	
  var actions = [];
  for(var i = 0; i < points.length; i++) {
    actions.push(new ajs.think.Action(points[i].x, points[i].y, types[i]));
  }
	return actions;
}


/**
 * Computes the angles the actions have relative to the centre of the Node that are surrounding.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @return {Array(number)} an array of angles.
 */
ajs.think.Selection.prototype.computeActionAngles = function(context, options) {
  var actionDiameterWithMargin = 2 * (options.actionRadius + options.actionMargin);
  // Calculate Action Arc circumference. 
  var arcCircum = (actionDiameterWithMargin) * options.numberOfActions;
  
  var dist = ajs.think.node.distanceBetweenNodeCentreAndActionCentre(context, options, this.node);
  // Calculate THE angle an action takes up.
  var actionAngle = Math.atan(actionDiameterWithMargin/dist);
  
  // Calculate Action Angles
  // Make the centre angle of the actions point up on the window.
  var centreAngle = ajs.math.degree2rad(270); // Because canvas draws upside down the angle is 270 instead of 90 
  var angles = [];
  
  var postiveAngle = null;
  var negativeAngle = null;
  if (options.numberOfActions % 2 == 0) { // numberOfActions is even
	  postiveAngle = centreAngle + actionAngle / 2;
	  negativeAngle = centreAngle - actionAngle / 2;
  } else { // numberOfActions is odd
	  postiveAngle = centreAngle;
    negativeAngle = centreAngle;
  }
  
  for (var i = 0; i < Math.ceil(options.numberOfActions / 2); i++) { // Create two angles at a time, so loop through half the actions
    if (i == 0 && options.numberOfActions % 2 != 0) { // If there is an odd number of actions and this is the first.
      angles.push(postiveAngle);  // postiveAngle is centreAngle.
      continue;
    } 
    angles.push(postiveAngle + actionAngle * i);
    angles.push(negativeAngle - actionAngle * i);
  }
  
  return angles;
}

/**
 * Computes the points of the actions of the selected Node.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @return {Array(ajs.Point)} an array of points.
 */
ajs.think.Selection.prototype.computeActionPoint = function(context, options) {
  // The angles must be sorted so the icons are displayed correctly.
  var angles = this.computeActionAngles(context, options).sort();
  var dist = ajs.think.node.distanceBetweenNodeCentreAndActionCentre(context, options, this.node);
  
  var points = [];
  for(var i = 0; i < angles.length; i++) {
    var actionX = this.node.x + dist * Math.cos(angles[i]);
    var actionY = this.node.y + dist * Math.sin(angles[i]);
	  points.push(new ajs.Point(actionX, actionY));
  }
  return points;
}

/**
 * Computes the centre point of the Action Tool Tip
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.Options} option the options for the Web App.
 * @return {ajs.Point} the centre point of the tool tip.
 */
ajs.think.Selection.prototype.computeActionToolTipCentrePoint = function(context, options) {
  // Make the centre angle of the actions point up on the window.
  var centreAngle = ajs.math.degree2rad(270); // Because canvas draws upside down the angle is 270 instead of 90 
  var dist = ajs.think.node.distanceBetweenNodeCentreAndActionCentre(context, options, this.node);
  
  var distanceBetweenActionsAndToolTips = options.actionRadius + options.actionMargin + options.circleStrokeWidth + options.actionToolTipMargin + options.actionToolTipLineWidth;
  var x = this.node.x + dist * Math.cos(centreAngle);
  var y = this.node.y + dist * Math.sin(centreAngle) - distanceBetweenActionsAndToolTips; // Minus this because up is down and down is up.
  return new ajs.Point(x, y);
}
