/**
 * @fileoverview The class that represents a context of a thought.
 */


goog.provide('ajs.think.ThoughtContext');

goog.require('ajs.think.Options');
goog.require('ajs.viewport');
goog.require('ajs.think.Selection');
goog.require('ajs.think.thought.theme.metaData');


/**
 * A class that contains all of the Web App's global variables.
 * 
 * @constructor
 * @param {CanvasElement} canvas the canvas for the Thought Context.
 */
ajs.think.ThoughtContext = function(canvas) {
  // Canvas
  this.canvas = canvas;
  
  // Option
  this.options = new ajs.think.Options();
  
  // Selection
  this.selection = new ajs.think.Selection(this, null);

  // Mouse Globals
  this.lastDraggedMouseRelativePoint = null;
  this.draggedNode = null;
  this.connectStartingNodeNoEvents = 0;
  this.connectStartingNode = null;
  this.mouseEntities = [];

  // Animation Globals.
  this.animatables = [];
  this.oldTime;
  this.animationIntervalIdentifier = null;

  // Setup the thought global.
  this.thought_ = null;
  this.__defineGetter__('thought', function() { return this.thought_; });

  /**
   * The ajs.thought setter function.
   * 
   * @param {ajs.Thought} value the thought;
   */
  var thoughtSetter = function(value) { 
    if (this.thought_ != null) { 
      this.destroyThoughtObservers();
      this.deanimateThought(this.thought_);
      this.selection.node = null;
    }
    this.thought_ = value; 
    if (value != null) {
      this.setupThoughtObservers();
      this.animateThought(value);
    }
  };
  this.__defineSetter__('thought', thoughtSetter);

  // Viewport
  this.viewport_ = null;
  this.__defineGetter__('viewport', function() { return this.viewport_; });
  var viewportSetter = function(value) {
    if (this.viewport_ != null) { 
      this.destroyViewportObservers(); 
    }
    this.viewport_ = value; 
    if (value != null) {
      this.setupViewportObservers();
    }
  };
  this.__defineSetter__('viewport', viewportSetter);
  
  this.culledNodes = null;
  this.culledConnections = null;

  // Draw
  this.drawHud = true;
  
  // Thought Descriptions
  this.thoughtDescriptions = null;

  // Hover globals
  this.hover = {};
  this.hover.menuItemType = null;
  this.hover.actionType = null;
  this.hover.node = null;
  this.hover.connection = null;

  // Menu
  this.saveSubmenu = null;
}

/**
 * Set the starting connection node.
 * 
 * @param {ajs.Node} node the starting connection node.
 */
ajs.think.ThoughtContext.prototype.setStartingConnectNode = function(node) {
  if (node == null) {
    throw 'node can not be null.';
  }
  this.connectStartingNode = node;
  var defaultNoEvents = 2;
  this.connectStartingNodeNoEvents = defaultNoEvents;
}

/**
 * When the app is in the 'Connect nodes' state and has no relevant event, this function should be called.
 */
ajs.think.ThoughtContext.prototype.connectNodesNoEvent = function() {
  this.connectStartingNodeNoEvents--;
  if (this.connectStartingNodeNoEvents <= 0) {
    this.connectStartingNodeNoEvents = 0;
    this.connectStartingNode = null;
  }
}

/**
 * Reset the culling globals.
 */
ajs.think.ThoughtContext.prototype.resetCulling = function() {
  this.culledNodes = null;
  this.culledConnections = null;
}

/**
 * Setup thought animation.
 *
 * @param {ajs.Thought} thought the thought to start animating.
 */
ajs.think.ThoughtContext.prototype.animateThought = function(thought) {
  this.animatables.push(this.selection);
}

/**
 * Stop thought animation.
 * 
 * @param {ajs.Thought} thought the thought to stop animating.
 */
ajs.think.ThoughtContext.prototype.deanimateThought = function(thought) {
  this.animatables = [];
}

/**
 * This function is used to reset culling whenever the thought property changes.
 * 
 * @param {string} message a message from the thought property.  
 */
ajs.think.ThoughtContext.resetCullingObserver = function(message) {
  var thoughtModified = "modified";
  if (message == thoughtModified) {
    if (ajs.think.globals.thought.modified) {
      ajs.think.globals.resetCulling();
    }
  } else if (message == ajs.viewport.observerMessages.xOffset || message == ajs.viewport.observerMessages.yOffset) {
    ajs.think.globals.resetCulling();
  }
}

// Setup the thought Observers
ajs.think.ThoughtContext.thoughtObservers = [ajs.think.ThoughtContext.resetCullingObserver];
  
/**
 * Setup all the thought observers.
 */
ajs.think.ThoughtContext.prototype.setupThoughtObservers = function() {
  for (var observer in ajs.think.ThoughtContext.thoughtObservers) {
    this.thought.subscribe(ajs.think.ThoughtContext.thoughtObservers[observer]);
  }
}

/**
 * Destroy all the thought observers.
 */
ajs.think.ThoughtContext.prototype.destroyThoughtObservers = function() {
  for (var observer in ajs.think.ThoughtContext.thoughtObservers) {
    this.thought.unsubscribe(ajs.think.ThoughtContext.thoughtObservers[observer]);
  }
}

// Setup the veiwport Observers
ajs.think.ThoughtContext.viewportObservers = [ajs.think.ThoughtContext.resetCullingObserver];
  
/**
 * Setup all the thought observers.
 */
ajs.think.ThoughtContext.prototype.setupViewportObservers = function() {
  for (var observer in ajs.think.ThoughtContext.viewportObservers) {
    this.viewport.subscribe(ajs.think.ThoughtContext.viewportObservers[observer]);
  }
}

/**
 * Destroy all the thought observers.
 */
ajs.think.ThoughtContext.prototype.destroyViewportObservers = function() {
  for (var observer in ajs.think.ThoughtContext.viewportObservers) {
    this.viewport.unsubscribe(ajs.think.ThoughtContext.viewportObservers[observer]);
  }
}

/**
 * Resets mouse states.
 */
ajs.think.ThoughtContext.prototype.resetMouseStates = function() {
  this.lastDraggedMouseRelativePoint = null;
  this.draggedNode = null;
  this.menuItemType = null;
  this.hover.actionType = null;
  this.hover.node = null;
}

/**
 * Resets mouse states.
 */
ajs.think.ThoughtContext.prototype.getCanvasContext = function() {
  if (this.canvas != null) {
    return this.canvas.getContext('2d');
  } else {
    throw 'canvas property is null.';
  }
}

/**
 * Returns the theme for the ThoughtContext.
 */
ajs.think.ThoughtContext.prototype.getTheme = function() {
  if (this.thought.theme != null) {
    return this.thought.theme;
  } else {
    return ajs.think.thought.theme.metaData.defaultTheme;
  }
}