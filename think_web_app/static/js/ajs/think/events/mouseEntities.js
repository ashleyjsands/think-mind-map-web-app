/**
 * @fileoverview This file sets up all the mouse entities for the Web App.
 */


goog.provide('ajs.think.events.mouseEntities');

goog.require('ajs.MouseEntity');
goog.require('ajs.math');
goog.require('ajs.events');
goog.require('ajs.mouse');
goog.require('ajs.point');
goog.require('ajs.think');
goog.require('ajs.think.mouse');
goog.require('ajs.think.events.names');
goog.require('ajs.think.ThoughtContext');
goog.require('ajs.think.thoughtMenu.menuItem');
goog.require('ajs.think.node');


ajs.think.events.mouseEntities.dragging = {};

/**
 * A collection of Dragging mouse functions.
 */
ajs.think.events.mouseEntities.dragging.mouseFunctions = {
  down: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.lastDraggedMouseRelativePoint = mousePoint;
    return false;
  },
  up: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.lastDraggedMouseRelativePoint = null;
    return false;
  }
};

/**
 * A collection of Dragging global no event functions.
 */
ajs.think.events.mouseEntities.dragging.globalNoEventFunctions = {
  hover: function(thoughtContext, mousePoint, clickType) {
    if (thoughtContext.lastDraggedMouseRelativePoint != null) {   
      thoughtContext.lastDraggedMouseRelativePoint = mousePoint;
    }
  }
};

ajs.think.events.mouseEntities.menuItem = {};

/**
 * A collection of MenuItem MouseEntity mouse functions.
 */
ajs.think.events.mouseEntities.menuItem.mouseFunctions = {
  click: function(thoughtContext, mousePoint, clickType) {
    var menuItems = ajs.think.thoughtMenu.menuItem.getMenuItems();
    for (var i = 0; i < menuItems.length; i++) {
      if (!menuItems[i].disabled(thoughtContext.thought)) {
	      if (ajs.math.absoluteDistance(mousePoint, menuItems[i]) <= thoughtContext.options.thoughtMenuItemRadius) {
		      // Create an event based on the Menu Item's type.
          // Create an Menu Item event despite the value of clickType.
		      ajs.events.createEvent(thoughtContext.canvas, menuItems[i].type, { "thoughtContext": thoughtContext });
          return true;
	      }
      }
    }
    return false;
  }, 
  hover: function(thoughtContext, mousePoint, clickType) {
    var menuItems = ajs.think.thoughtMenu.menuItem.getMenuItems();
    for (var i = 0; i < menuItems.length; i++) {
	    if (ajs.math.absoluteDistance(mousePoint, menuItems[i]) <= thoughtContext.options.thoughtMenuItemRadius) {
		    // Create an event based on the Menu Item's type.
        // Create an Menu Item event despite the value of clickType.
		    ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.hoverMenuItem, { "thoughtContext": thoughtContext, "buttonType": menuItems[i].type});
        return true;
	    }
    }
    return false;
  }
};

/**
 * A collection of MenuItem MouseEntity no event functions.
 */
ajs.think.events.mouseEntities.menuItem.noEventFunctions = {
  hover: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.hover.menuItemType = null;
  }
};

ajs.think.events.mouseEntities.action = {};

/**
 * A collection of Action MouseEntity mouse functions.
 */
ajs.think.events.mouseEntities.action.mouseFunctions = {
  click: function(thoughtContext, mousePoint, clickType) {
    var actions = thoughtContext.selection.createActions(thoughtContext.canvas.getContext('2d'), thoughtContext.options);
	  for (var i = 0; i < actions.length; i++) {
	    if (ajs.math.absoluteDistance(mousePoint, actions[i]) <= thoughtContext.options.actionRadius) {
		    // Create an event based on the action's type.
        // Create an Action event despite the value of clickType.
		    ajs.events.createEvent(thoughtContext.canvas, actions[i].type,  { "thoughtContext": thoughtContext, "node": thoughtContext.selection.node });
        return true;
	    }
	  }
    return false;
  }, 
  hover: function(thoughtContext, mousePoint, clickType) {
    var actions = thoughtContext.selection.createActions(thoughtContext.getCanvasContext(), thoughtContext.options);
	  for (var i = 0; i < actions.length; i++) {
	    if (ajs.math.absoluteDistance(mousePoint, actions[i]) <= thoughtContext.options.actionRadius) {
		    // Create an event based on the action's type.
        // Create an Action event despite the value of clickType.
		    ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.hoverAction, { "thoughtContext": thoughtContext, "buttonType": actions[i].type});
        return true;
	    }
	  }
    return false;
  }
};

/**
 * A collection of Action MouseEntity no event functions.
 */
ajs.think.events.mouseEntities.action.noEventFunctions = {
  hover: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.hover.actionType = null;
  }
};

ajs.think.events.mouseEntities.node = {};

/**
 * A collection of Node MouseEntity mouse functions.
 */
ajs.think.events.mouseEntities.node.mouseFunctions = {
  click: function(thoughtContext, mousePoint, clickType) {
    // Copy and reverse the nodes because the order opposite of drawing connections is the order you want to register mouse events.
    var nodes = ajs.utils.cloneArray(thoughtContext.thought.nodes).sort(ajs.utils.reverseSortFunc);
    for (var i = 0; i < nodes.length; i++) {
	    var node = nodes[i];
	    if (ajs.think.mouse.clickedNode(thoughtContext.getCanvasContext(), thoughtContext.options, mousePoint, node)) {
        if (thoughtContext.connectStartingNode != null) {
          ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.connectTwoNodes, { "thoughtContext": thoughtContext, "node": node });
          // This code assumes that it returns before the thoughtContext.connectStartingNode is wiped at the bottom.
        }
        
        if (clickType == ajs.mouse.clickType.single) {
          ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.select, { "thoughtContext": thoughtContext, "node": node });
        } else if (clickType == ajs.mouse.clickType._double) {
	        ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.editNode, { "thoughtContext": thoughtContext, "node": node });
        }
        return true;
	    }
	  }
    return false;
  },
  down: function(thoughtContext, mousePoint, clickType) {  
    // Copy and reverse the nodes because the order opposite of drawing connections is the order you want to register mouse events.
    var nodes = ajs.utils.cloneArray(thoughtContext.thought.nodes).sort(ajs.utils.reverseSortFunc);
    for (var i = 0; i < nodes.length; i++) {
	    var node = nodes[i];
      if (ajs.think.mouse.clickedNode(thoughtContext.getCanvasContext(), thoughtContext.options, mousePoint, node)) {
	      thoughtContext.draggedNode = node;
	      return true;
	    }
    }  
    return false;
  },
  up: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.draggedNode = null;
    return false;
  },
  hover: function(thoughtContext, mousePoint, clickType) {
    if (thoughtContext.lastDraggedMouseRelativePoint != null && thoughtContext.draggedNode != null) {
      // Mouse Point is an absolute point because this is specified in the Node Mouse Entity.
      var relativeMousePoint = ajs.point.convertAbsolutePointToRelative(mousePoint, thoughtContext.viewport);
      // If dragging a node.
      thoughtContext.draggedNode.x += relativeMousePoint.x - thoughtContext.lastDraggedMouseRelativePoint.x;
      thoughtContext.draggedNode.y += relativeMousePoint.y - thoughtContext.lastDraggedMouseRelativePoint.y;
      // If a mouse entity uses thoughtContext.lastDraggedMouseRelativePoint then it must update it after usage.
      thoughtContext.lastDraggedMouseRelativePoint = relativeMousePoint;
      thoughtContext.thought.modified = true;
      return true;
    } else {
      // Copy and reverse the nodes because the order opposite of drawing connections is the order you want to register mouse events.
      var nodes = ajs.utils.cloneArray(thoughtContext.thought.nodes).sort(ajs.utils.reverseSortFunc);
      for (var i = 0; i < nodes.length; i++) {
	      var node = nodes[i];
	      if (ajs.think.mouse.clickedNode(thoughtContext.getCanvasContext(), thoughtContext.options, mousePoint, node)) {
          ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.hoverNode, { "thoughtContext": thoughtContext, "node": node });
          return true;
	      }
	    }
    }
    return false;
  }
};

/**
 * A collection of Node MouseEntity no event functions.
 */
ajs.think.events.mouseEntities.node.noEventFunctions = {
  click: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.connectNodesNoEvent();
  },
  down: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.draggedNode = null;
  },
  hover: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.hover.node = null;
  }
};

ajs.think.events.mouseEntities.node.globalNoEventFunctions = {
  click: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.selection.node = null;
  }
};

ajs.think.events.mouseEntities.connection = {};

/**
 * A collection of Connection MouseEntity mouse functions.
 */
ajs.think.events.mouseEntities.connection.mouseFunctions = {
  click: function(thoughtContext, mousePoint, clickType) {
    // Copy and reverse the connections because the order opposite of drawing connections is the order you want to register mouse events.
    var connections = ajs.utils.cloneArray(thoughtContext.thought.connections).sort(ajs.utils.reverseSortFunc);
    for (var i = 0; i < connections.length; i++) {
	    var connection = connections[i];
      var controlPointValue = ajs.think.node.computeConnectionControlPointValue(thoughtContext.getCanvasContext(), thoughtContext.options, connection);
      var connectionPolygons = ajs.think.node.computeConnectionTwoConvexPolygonVertices(thoughtContext.getCanvasContext(), thoughtContext.options, connection, controlPointValue);
      // Check the mousePoint against the connections polygons.
      for (var j = 0; j < connectionPolygons.length; j++) {
        if (ajs.math.pointInPolygon(mousePoint, connectionPolygons[j])) {
          ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.removeConnection, { "thoughtContext": thoughtContext, "connection": connection });
          return true;
        }
      }
	  }
    return false;
  },
  hover: function(thoughtContext, mousePoint, clickType) {
    // Copy and reverse the connections because the order opposite of drawing connections is the order you want to register mouse events.
    var connections = ajs.utils.cloneArray(thoughtContext.thought.connections).sort(ajs.utils.reverseSortFunc);
    for (var i = 0; i < connections.length; i++) {
	    var connection = connections[i];
      var controlPointValue = ajs.think.node.computeConnectionControlPointValue(thoughtContext.getCanvasContext(), thoughtContext.options, connection);
      var connectionPolygons = ajs.think.node.computeConnectionTwoConvexPolygonVertices(thoughtContext.getCanvasContext(), thoughtContext.options, connection, controlPointValue);
      // Check the mousePoint against the connections polygons.
      for (var j = 0; j < connectionPolygons.length; j++) {
        if (ajs.math.pointInPolygon(mousePoint, connectionPolygons[j])) {
          ajs.events.createEvent(thoughtContext.canvas, ajs.think.events.names.hoverConnection, { "thoughtContext": thoughtContext, "connection": connection });
          return true;
        }
      }
	  }
    return false;
  }
};

/**
 * A collection of Connection MouseEntity no event functions.
 */
ajs.think.events.mouseEntities.connection.noEventFunctions = {
  hover: function(thoughtContext, mousePoint, clickType) {
    thoughtContext.hover.connection = null;
  }
};

ajs.think.events.mouseEntities.viewport = {};

/**
 * A collection of Connection MouseEntity mouse functions.
 */
ajs.think.events.mouseEntities.viewport.mouseFunctions = {
  hover: function(thoughtContext, mousePoint, clickType) {
    if (thoughtContext.lastDraggedMouseRelativePoint != null) {  
      // It is assumed that since no other mouse entities have generated an event that the user is dragging the background, meaning they want to change the viewport. 
      var viewport = thoughtContext.viewport;
      // change the view port.
      // Notice the minus equal operators. This is because a drag is the positive direction make the viewport offset go into the negative direction.
      viewport.xOffset -= mousePoint.x - thoughtContext.lastDraggedMouseRelativePoint.x; 
      viewport.yOffset -= mousePoint.y - thoughtContext.lastDraggedMouseRelativePoint.y;
      // If a mouse entity uses thoughtContext.lastDraggedMouseRelativePoint then it must update it after usage.
      thoughtContext.lastDraggedMouseRelativePoint = mousePoint;
      return true;
    }
    return false;
  }
};

/**
 * Create the Mouse Entities.
 * 
 * @param {ajs.Options} options the web app options.
 * @return {Array(ajs.MouseEntity)} an array of mouse entities.
 */
ajs.think.events.mouseEntities.createMouseEntities = function(options) {
  var draggingMouseEntity = new ajs.MouseEntity(ajs.mouseEntity.pointType.Relative, options.mouseEntityZOrders.dragging, ajs.think.events.mouseEntities.dragging.mouseFunctions, {}, ajs.think.events.mouseEntities.dragging.globalNoEventFunctions);
  
  var menuItemMouseEntity = new ajs.MouseEntity(ajs.mouseEntity.pointType.Relative, options.mouseEntityZOrders.menuItem, ajs.think.events.mouseEntities.menuItem.mouseFunctions, ajs.think.events.mouseEntities.menuItem.noEventFunctions);

  var actionMouseEntity = new ajs.MouseEntity(ajs.mouseEntity.pointType.Absolute, options.mouseEntityZOrders.action, ajs.think.events.mouseEntities.action.mouseFunctions, ajs.think.events.mouseEntities.action.noEventFunctions);

  var nodesMouseEntity = new ajs.MouseEntity(ajs.mouseEntity.pointType.Absolute, options.mouseEntityZOrders.node, ajs.think.events.mouseEntities.node.mouseFunctions, ajs.think.events.mouseEntities.node.noEventFunctions, ajs.think.events.mouseEntities.node.globalNoEventFunctions);
  
  var connecitonsMouseEntity = new ajs.MouseEntity(ajs.mouseEntity.pointType.Absolute, options.mouseEntityZOrders.connection, ajs.think.events.mouseEntities.connection.mouseFunctions, ajs.think.events.mouseEntities.connection.noEventFunctions);
  
  var viewportMouseEntity = new ajs.MouseEntity(ajs.mouseEntity.pointType.Relative, options.mouseEntityZOrders.viewport, ajs.think.events.mouseEntities.viewport.mouseFunctions, {});
  
  return [draggingMouseEntity, menuItemMouseEntity, actionMouseEntity, nodesMouseEntity, connecitonsMouseEntity, viewportMouseEntity];
}

/**
 * Setup the Mouse Entities.
 * 
 * @param {ajs.think.ThoughtContext} thoughtContext the ThoughtContext to setup the MouseEntities for.
 */
ajs.think.events.mouseEntities.setupMouseEntities = function(thoughtContext) {
  thoughtContext.mouseEntities = ajs.think.events.mouseEntities.createMouseEntities(thoughtContext.options);
}