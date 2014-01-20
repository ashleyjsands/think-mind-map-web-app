/**
 * @fileoverview A collections of functions that return Meta Data relating to the Thought Menu.
 */


goog.provide('ajs.think.thoughtMenu.metaData');

goog.require('ajs.think.ThoughtContext');
goog.require('ajs.think.Node');
goog.require('ajs.think.Thought');
goog.require('ajs.Viewport');


/**
 * Creates a ThoughtContext for the Theme tab preview.
 * 
 * @param {CanvasElement} canvas the canvas element the ThoughtContext is to be associated with.
 * @param {ajs.think.thought.Theme} theme the theme to be previewed.
 * @return {ajs.think.ThoughtContext} a thoughtContext for the Theme tab preview.
 */
ajs.think.thoughtMenu.metaData.getThemePreviewThoughtContext = function(canvas, theme) {
  var thoughtContext = new ajs.think.ThoughtContext(canvas);
  var xOffset = 0;
  var yOffset = 0;
  thoughtContext.viewport = new ajs.Viewport(xOffset, yOffset);
  thoughtContext.drawHud = false;
  
  var node1X = 60;
  var node1Y = 60;
  var node1Text = 'One node over here';
  var node1 = new ajs.think.Node(node1X, node1Y, node1Text);
  var node2X = 210;
  var node2Y = 60;
  var node2Text = 'Another node over there';
  var node2 = new ajs.think.Node(node2X, node2Y, node2Text);
  var nodes = [node1, node2];
  var connections = [[node1, node2]];
  thoughtContext.thought = new ajs.think.Thought(nodes, connections, null, null, false, false, theme);
  
  return thoughtContext;
}

ajs.think.thoughtMenu.metaData.defaultSelectedThemeProperty = 'backgroundTopColor';
