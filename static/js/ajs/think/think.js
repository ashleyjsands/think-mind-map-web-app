/**
 * @fileoverview Loads and initialises the Web App.
 * 
 * This file needs the globals.js loaded before it.
 */


goog.provide('ajs.think');

goog.require('ajs.draw');
goog.require('ajs.Dimensions');
goog.require('ajs.constants');
goog.require('ajs.Viewport');
goog.require('ajs.utils.canvas');
goog.require('ajs.think.events');
goog.require('ajs.think.globals');
goog.require('ajs.think.draw');
goog.require('ajs.think.Options');
goog.require('ajs.think.node');


/**
 * Sets up the canvas ready for a Thought to be loaded.
 */
ajs.think.setupCanvas = function() {
  var drawingCanvas = ajs.think.globals.canvas;
  ajs.think.sizeCanvasToWindow();
  ajs.think.initialiseThoughtContextCanvas(ajs.think.globals);
}

/**
 * Initialises a Canvas with a ThoughtContext to display Thoughts.
 *
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 */
ajs.think.initialiseThoughtContextCanvas = function(thoughtContext) {
  // Check the element is in the DOM and the browser supports canvas
  if(thoughtContext.canvas.getContext) {    
	  ajs.think.events.setupCanvasListeners(thoughtContext);
    ajs.think.startThoughtAnimation(thoughtContext);
  } else {
    alert('You need a better browser to view this.');
  }
}


/**
 * Loads the thought into the canvas.
 */
ajs.think.loadThoughtIntoCanvas = function(thought) {
  ajs.think.globals.thought = thought;
  var xOffset = 0;
  var yOffset = 0;
  ajs.think.globals.viewport = new ajs.Viewport(xOffset, yOffset);
}

/**
 * Starts the animations for the current Thought.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 */
ajs.think.startThoughtAnimation = function(thoughtContext) {
  var callback = function() {ajs.think.animateAndDrawOneFrame(thoughtContext);};
  thoughtContext.animationIntervalIdentifier = setInterval(callback, thoughtContext.intervalTime);
}

/**
 * Stops the animations for the current Thought.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the context to start animating.
 */
ajs.think.stopThoughtAnimation = function(thoughtContext) {
  if (thoughtContext.animationIntervalIdentifier != null) {
    clearInterval(thoughtContext.animationIntervalIdentifier);
    thoughtContext.animationIntervalIdentifier = null;
  }
}

/**
 * Resizes the canvas based on the window dimensions.
 */
ajs.think.sizeCanvasToWindow = function() {
  ajs.utils.canvas.changeCanvasSize(ajs.think.globals.options.ids.canvas, window.innerWidth, window.innerHeight);
}

/**
 * Clear the entire Canvas.
 * 
 * @param {CanvasElement} canvas the Canvas Element to clear.
 */
ajs.think.clearAllOfCanvas = function(canvas) {
  var context = canvas.getContext('2d');
  ajs.draw.clearCanvas(context, canvas.width, canvas.height);
}

/**
 * Close the current thought in the Canvas.
 */
ajs.think.closeThought = function() {
  ajs.think.globals.thought = null;
  ajs.think.globals.viewport = null;
  ajs.think.globals.culledNodes = null;
  ajs.think.globals.culledConnections = null;
  ajs.think.stopThoughtAnimation(ajs.think.globals);
  ajs.think.clearAllOfCanvas(ajs.think.globals.canvas);
}

/**
 * Draws the background for the entire Canvas.
 * 
 * @param {CanvasElement} canvas the canvas to the draw the background on.
 * @param {ajs.think.thought.Theme} theme the Thought's theme.
 */
ajs.think.drawBackground = function(canvas, theme) {
  var context = canvas.getContext('2d');
  var x = 0;
  var y = 0;
  ajs.draw.drawTopToBottomGradientArea(context, x, y, canvas.width, canvas.height, theme.backgroundTopColor, theme.backgroundBottomColor);
}

/**
 * Animates and draws a Thought Context for one frame.
 *
 * @uses ajs.think.globals.animatables
 * @uses ajs.think.globals.oldTime
 * @param {ajs.think.ThoughtContext} thoughtContext the context to draw.
 */
ajs.think.animateAndDrawOneFrame = function(thoughtContext) {
  var canvas = thoughtContext.canvas;
  var context = canvas.getContext('2d');

  // Calculate the timeDiff
  var date = new Date(); 
  var newTime = date.getSeconds() * ajs.constants.millisecondsInASecond + date.getMilliseconds();
  if (thoughtContext.oldTime == null) {
	  thoughtContext.oldTime = newTime;
    // Can't compute the time difference, do nothing this interval.
  }
  
  var timeDiff = newTime - thoughtContext.oldTime;
  thoughtContext.oldTime = newTime;
  for (var i = 0; i < thoughtContext.animatables.length; i++) {
    thoughtContext.animatables[i].animate(timeDiff);
  }
  
  if (thoughtContext.thought != null) {
    ajs.think.drawBackground(thoughtContext.canvas, thoughtContext.getTheme());
  
    var thought = thoughtContext.thought;
    var viewport = thoughtContext.viewport;
    if (viewport == null) {
      throw 'Viewport is null.';
    }
    var canvasDimensions = new ajs.Dimensions(viewport.xOffset, viewport.yOffset, canvas.width, canvas.height);
    
    if (thoughtContext.culledNodes == null) {
      thoughtContext.culledNodes = ajs.think.node.cullNodes(context, thoughtContext.options, canvasDimensions, thoughtContext.thought.nodes);
    } 
    if (thoughtContext.culledConnections == null) {
      thoughtContext.culledConnections = ajs.think.node.cullConnections(context, thoughtContext.options, canvasDimensions, thoughtContext.thought.connections);
    } 
    
    ajs.think.draw.drawThink(context, thoughtContext.options, viewport, thoughtContext.getTheme(), thought, thoughtContext.selection, thoughtContext.culledNodes, thoughtContext.culledConnections, thoughtContext.draggedNode, thoughtContext.hover.actionType, thoughtContext.hover.node, thoughtContext.hover.connection);
    if (thoughtContext.drawHud) {
      ajs.think.draw.drawHud(thoughtContext.getCanvasContext(), thoughtContext.options, thoughtContext.thought, thoughtContext.hover.menuItemType, thoughtContext.saveSubmenu);
    }
  }
}


