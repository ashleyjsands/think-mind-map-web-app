/**
 * @fileoverview The Thought class and related functions.
 */


goog.provide('ajs.think.Thought');
goog.provide('ajs.think.thought');

goog.require('ajs.utils');
goog.require('ajs.think.node');
goog.require('ajs.Observable');
goog.require('ajs.think.thought.theme');
goog.require('ajs.think.thought.theme.metaData');


/**
 * The Thought class represents a thought or a mind map the user has created.
 * 
 * @constructor
 * @param {Array(ajs.Node)} nodes the nodes of the thought.
 * @param {Array(Array(ajs.Node))} connections the node connections of the thought.
 * @param {String} name the name of the thought.
 * @param {String} id the server's identifier of the thought which is an optional argument.
 * @param {boolean} modifiable whether the thought is modifiable. This is an optional argument.
 * @param {boolean} isPublic the thought is available to the public. This is an optional argument.
 * @param {ajs.think.thought.Theme} theme the Thought's theme.
 */
ajs.think.Thought = function(nodes, connections, name, id, modifiable, isPublic, theme) {
  this.nodes = nodes;
  this.connections = connections;
  this.name = name;
  this.id = id; // This is used by the Server.
  if (modifiable == null) {
    modifiable = true; // This is set to true because if it isn't set then it is assumed that it is a thought being created by the user.
  } 
  this.modifiable = modifiable;
  this.modified_ = false;
  if (isPublic == null) {
   isPublic = false;
  }
  this.isPublic = isPublic;
  /*if (!theme) {
    theme = ajs.think.thought.theme.metaData.defaultTheme;
  }*/
  this.theme = theme;
}

// "Inherits" from Observable.
ajs.utils.copyPrototype(ajs.think.Thought, ajs.Observable);

/**
 * Getter and Setter for the modified property. Notifies Observers when the thought is modified.
 */
ajs.think.Thought.prototype.__defineGetter__('modified', function() { return this.modified_; });
ajs.think.Thought.prototype.__defineSetter__('modified', function(value) { this.modified_ = value; this.notify('modified'); });

/** 
 * Creates an ajs.think.Thought object based on a JSON Thought object that is the result of a AJAX operation.
 *
 * @param {JSON} jsonThought Thought data in the form of a JSON object.
 * @returns {ajs.think.Thought} the Thought instance.
 */
ajs.think.thought.createThoughtBasedOnJsonObjects = function(jsonThought) {
  var nodes = [];
  for (var i = 0; i < jsonThought.nodes.length; i++) {
    var jsonNode = jsonThought.nodes[i];
    var node = ajs.think.node.createNodeBasedOnJsonObjects(jsonNode);
    nodes.push(node);
  }
  
  var connections = [];
  for (var i = 0; i < jsonThought.connections.length; i++) {
    var connection = jsonThought.connections[i];
    
    var nodeOne = null;
    var nodeTwo = null;
    for (var j = 0; j < nodes.length; j++) {
      var node = nodes[j];
      if (connection.nodeOne == node.id) {
        nodeOne = node;
      } else if (connection.nodeTwo == node.id) {
        nodeTwo = node;
      }
      
      if (nodeOne != null && nodeTwo != null) {
        break;
      }
    }
    if (nodeOne == null || nodeTwo == null) {
      throw "Could not find connection nodes.";
    }
    connections.push([nodeOne, nodeTwo]);
  }
  
  var theme = ajs.think.thought.theme.createThemeBasedOnJsonObject(jsonThought.theme);
  
  return new ajs.think.Thought(nodes, connections, jsonThought.name, jsonThought.id, jsonThought.modifiable, jsonThought.isPublic, theme);
}