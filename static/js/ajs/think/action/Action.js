/**
 * @fileoverview The Action class and related functions and enums.
 */


goog.provide('ajs.think.action');
goog.provide('ajs.think.Action');

goog.require('ajs.think.options');


/**
 * Returns the first action instance with the given type.
 * 
 * @param {Array(ajs.think.Action)} actions an array of Actions.
 * @param {ajs.think.action.types} type an Action type.
 * @return {ajs.think.Action} an Action.
 */
ajs.think.action.getActionByType = function(actions, type) {
  for (var i = 0; i < actions.length; i++) {
    if (actions[i].type == type) {
	    return actions[i];
	  }
  }
}

/**
 * An enumeration for Action Types.
 * @enum {String}
 */
ajs.think.action.types = {
  Create : "Create",
  Connect : "Connect",
  Destroy : "Destroy"
};

/**
 * An array version of ajs.think.action.types.
 */
ajs.think.action.typesArray = [ 
  "Create",
  "Connect",
  "Destroy"
];

/**
 * An association of Action Types to Tool tips used for their buttons.
 * @enum {String}
 */
ajs.think.action.toolTips = {
  Create : "Create a node", 
  Connect : "Connect this node to another",
  Destroy : "Destroy this node"
};

/**
 * The Action class represents the action button for a selected Node.
 * 
 * @constructor
 * @param {number} x the x component of the Action's point.
 * @param {number} y the y component of the Action's point.
 * @param {ajs.think.action.types} type the Action.
 */
ajs.think.Action = function(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
}

/**
 * Returns the associated image.
 * 
 * @return {Image} the associate image of the action.
 */
ajs.think.Action.prototype.image = function() {
  var typesToImages = {
    Create : ajs.think.options.createImage, 
    Connect : ajs.think.options.connectImage,
    Destroy : ajs.think.options.destroyImage
  };
  return typesToImages[this.type];
}

