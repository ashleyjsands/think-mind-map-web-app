/**
 * @fileoverview The Thought Theme class.
 */


goog.provide('ajs.think.thought.Theme');
goog.provide('ajs.think.thought.theme');
goog.provide('ajs.think.thought.theme.metaData');


/**
 * The Theme class represents the options for a Thought. To make the background, node, or connection a solid 
 * colour without the 'expensive' gradient processing, set the top color to the same as bottom.
 * 
 * @constructor
 * @param {String} name the name of the Theme.
 * @param {String} backgroundTopColor the top color of the background gradient.
 * @param {String} backgroundBottomColor the bottom color of the background gradient. 
 * @param {String} nodeOuterColor the outer color of the node gradient.
 * @param {String} nodeInnerColor the inner color of the node gradient. 
 * @param {String} nodeTextColor the color of the node text. 
 * @param {String} connectionOuterColor the outer color of the connection gradient.
 * @param {String} connectionInnerColor the inner color of the connection gradient. 
 * @param {String} connectionTextColor the color of the connection text. 
 * @param {String} id the server's identifier of the thought which is an optional argument.
 */
ajs.think.thought.Theme = function(name, backgroundTopColor, backgroundBottomColor, nodeOuterColor, nodeInnerColor, nodeTextColor, connectionOuterColor, connectionInnerColor, connectionTextColor, id) {

  this.name = name;
  
  // Background
  this.backgroundTopColor = backgroundTopColor;
  this.backgroundBottomColor = backgroundBottomColor;
  
  // Node
	this.nodeOuterColor = nodeOuterColor;
  this.nodeInnerColor = nodeInnerColor;
  this.nodeTextColor = nodeTextColor;
  
  // Connection
	this.connectionOuterColor = connectionOuterColor;
	this.connectionInnerColor = connectionInnerColor;
  this.connectionTextColor = connectionTextColor;
  
  this.id = id; // This is used by the Server.
}

/** 
 * Creates an ajs.think.thought.Theme object based on a JSON Thought object that is the result of a AJAX 
 * operation.
 * 
 * @param {JSON} jsonTheme Theme data in the form of a JSON object.
 * @returns {ajs.think.thought.Theme} the Theme instance.
 */
ajs.think.thought.theme.createThemeBasedOnJsonObject = function(jsonTheme) {
  if (!jsonTheme) {
    return null;
  }
  // This basically acheives nothing but it may not always be the case.
  return new ajs.think.thought.Theme(jsonTheme.name, jsonTheme.backgroundTopColor, jsonTheme.backgroundBottomColor, jsonTheme.nodeOuterColor, jsonTheme.nodeInnerColor, jsonTheme.nodeTextColor, jsonTheme.connectionOuterColor, jsonTheme.connectionInnerColor, jsonTheme.connectionTextColor, jsonTheme.id);
}

ajs.think.thought.theme.metaData.defaultTheme = new ajs.think.thought.Theme('default-theme', "#abccff", "#000000", "#000000", "#555555", "#FFFFFF", "#111111", "#CCCCCC", "#FFFFFF");