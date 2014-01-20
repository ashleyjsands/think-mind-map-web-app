/**
 * @fileoverview A collection of functions that draw on a canvas context.
 */


goog.provide('ajs.think.draw');

goog.require('ajs.Point');
goog.require('ajs.think.node');
goog.require('ajs.draw');
goog.require('ajs.think.draw.connection');
goog.require('ajs.think.draw.selection');
goog.require('ajs.think.draw.node');
goog.require('ajs.think.draw.action');
goog.require('ajs.utils.canvas');
goog.require('ajs.think.submenu');
goog.require('ajs.think.thoughtMenu.menuItem');


/**
 * Draws the Think visuals on the canvas context.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.Viewport} viewport the viewport for the canvas.
 * @param {ajs.think.thought.Theme} theme the theme.
 * @param {ajs.think.Thought} thought the thought for the canvas.
 * @param {ajs.think.Selection} selection the current selection for the Thought.
 * @param {Array(ajs.think.Node)} culledNodes an optional parameter to supply culled nodes.
 * @param {Array(Array(ajs.think.Node))} culledConnections an optional parameter to supply culled connections.
 * @param {ajs.think.Node} draggedNode the node being dragged.
 * @param {ajs.think.action.types} hoverActionType the type of actiong being hovered on.
 * @param {ajs.think.Node} hoverNode the node being hovered on.
 * @param {Array(ajs.think.Node)} hoverConnection the connection being hovered on.
 */
ajs.think.draw.drawThink = function(context, options, viewport, theme, thought, selection, culledNodes, culledConnections, draggedNode, hoverActionType, hoverNode, hoverConnection) {
  // Connections must be drawn before Nodes.
  var connections;
  if (culledConnections) {
    connections = culledConnections;
  } else {
    connections = thought.connections;
  }
  for (var i = 0; i < connections.length; i++) {
    var node0 = connections[i][0];
    var node1 = connections[i][1];
    var r0 = node0.radius(context, options);
    var r1 = node1.radius(context, options);
    var controlPointValue = ajs.think.node.computeConnectionControlPointValue(context, options, connections[i]);
    var hovered = connections[i] == hoverConnection;
    ajs.think.draw.connection.drawConnection(context, options, theme, node0.x - viewport.xOffset, node0.y - viewport.yOffset, r0, node1.x - viewport.xOffset, node1.y - viewport.yOffset, r1, controlPointValue, hovered); 
  }

  // Draw Nodes
  var nodes;
  if (culledNodes) {
    nodes = culledNodes;
  } else {
    nodes = thought.nodes;
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var r = node.radius(context, options);
	  if (draggedNode === node) {
      var highlighted = true;
      ajs.think.draw.node.drawNode(context, options, theme, node.x - viewport.xOffset, node.y - viewport.yOffset, r, true, highlighted); 
	  } else {
      var highlighted = node == hoverNode;
      ajs.think.draw.node.drawNode(context, options, theme, node.x - viewport.xOffset, node.y - viewport.yOffset, r, true, highlighted); 
      if (options.wrapNodeText) {
        ajs.think.draw.node.drawNodeWrappedText(context, options, theme, node.x - viewport.xOffset, node.y - viewport.yOffset, r, node.getDisplayText(context, options));
      } else {
        ajs.think.draw.node.drawNodeText(context, options, theme, node.x - viewport.xOffset, node.y - viewport.yOffset, r, node.text);
      }
	  }
  }
  
  if (selection.node != null) {
    ajs.think.draw.selection.drawSelection(context, options, viewport, selection);
    ajs.think.draw.action.drawActions(context, options, viewport, selection.createActions(context, options), hoverActionType);
  
    if (hoverActionType != null) {
      var centrePoint = selection.computeActionToolTipCentrePoint(context, options);
      ajs.think.draw.action.drawActionToolTip(context, options, viewport, hoverActionType, centrePoint);
    }
  }
} 

/**
 * Draws the head up display over the thought.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {thought} thought the current thought.
 * @param {ajs.think.thoughtMenu.menuItemTypes} hoverMenuItemType the type of menu item being hovered on.
 * @param {ajs.think.Submenu} saveSubmenu the Save Submenu.
 */
ajs.think.draw.drawHud = function(context, options, thought, hoverMenuItemType, saveSubmenu) {
	ajs.think.draw.drawTitle(context, options, thought.name);
  ajs.think.draw.drawMenu(context, options, thought, hoverMenuItemType, saveSubmenu);
}

/**
 * Draws the thought title.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {string} thoughtName the name of the current thought.
 */
ajs.think.draw.drawTitle = function(context, options, thoughtName) {
  ajs.draw.drawText(context, thoughtName + " - " + options.titleText + " " + options.version, new ajs.Point(options.titleX, options.titleY), options.titleFontStyle, options.titleColour);
}

/**
 * Draws the thought menu.
 * 
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.think.Thought} thought the current thought.
 * @param {ajs.think.thoughtMenu.menuItemTypes} hoverMenuItemType the type of menu item being hovered on.
 * @param {ajs.think.Submenu} saveSubmenu the Save Submenu.
 */
ajs.think.draw.drawMenu = function(context, options, thought, hoverMenuItemType, saveSubmenu) {
  var menuItems = ajs.think.thoughtMenu.menuItem.getMenuItems();
  
  // Draw menu background.
  var backgroundRadius = options.thoughtMenuItemRadius + options.thoughtMenuItemMargin + options.thoughtMenuPadding;
  var firstMenuItemPoint = menuItems[0];
  var lastMenuItemPoint = menuItems[menuItems.length - 1]; 
  ajs.draw.drawRoundedRectangle(context, firstMenuItemPoint, lastMenuItemPoint, backgroundRadius, options.thoughtMenuFillStyle, options.thoughtMenuLineWidth, options.thoughtMenuStrokeStyle);

  // Draw menu items.
  for (var i = 0; i < menuItems.length; i++) {
    // If the button is disabled, draw as disabled, if the button is not disabled, check if it is hovered over.
    var disabled = menuItems[i].disabled(thought);
    var hovered = menuItems[i].type == hoverMenuItemType;
    var fillStyle;
    if (disabled) {
      fillStyle = options.buttonFillStyle;
    } else {
      if (hovered) {
        fillStyle = options.menuItemButtonHoverFillStyle;
      } else {
        fillStyle = options.buttonFillStyle;
      }
    }
    ajs.draw.drawButton(context, options, menuItems[i].x, menuItems[i].y, options.thoughtMenuItemRadius, fillStyle);
    
    context.drawImage(menuItems[i].image, menuItems[i].x - options.thoughtMenuItemRadius, menuItems[i].y - options.thoughtMenuItemRadius, options.imgWidth, options.imgHeight);
    
    if (disabled) {
      // Draw a gray circle of the menu item.
      ajs.draw.drawCircle(context, menuItems[i].x, menuItems[i].y, options.thoughtMenuItemRadius, options.thoughtDisabledMenuItemFillStyle, options.thoughtDisabledMenuItemLineWidth, options.thoughtDisabledMenuItemStrokeStyle);
    }
  }
  
  var x = 0;
  var bottomLeftCornerMenuPoint = new ajs.Point(x, backgroundRadius * 2 + options.thoughtMenuLineWidth);
  // Draw tool tip.  
  if (hoverMenuItemType != null) {
    ajs.think.draw.drawMenuToolTip(context, options, hoverMenuItemType, bottomLeftCornerMenuPoint);
  }
  
  var y = 0;
  var topRightCornerMenuPoint = new ajs.Point(backgroundRadius + options.thoughtMenuLineWidth + lastMenuItemPoint.x, y);
  // Draw Save Submenu.
  if (saveSubmenu != null) {
    ajs.think.draw.drawSaveSubmenu(context, options, saveSubmenu, topRightCornerMenuPoint);
  }
}

/**
 * Draws the menu tool tip.
 *
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.think.thoughtMenu.menuItemTypes} menuItemType the type of menu item to draw the tool tip for.
 * @param {ajs.Point} bottomLeftCornerMenuPoint the point representing the bottom left corner of the menu.
 */
ajs.think.draw.drawMenuToolTip = function(context, options, menuItemType, bottomLeftCornerMenuPoint) {
  var radius = options.thoughtMenuToolTipFontSize + options.thoughtMenuToolTipLineWidth;
  var pointA = new ajs.Point(bottomLeftCornerMenuPoint.x + radius + options.thoughtMenuToolTipLeftMargin, bottomLeftCornerMenuPoint.y + radius + options.thoughtMenuToolTipTopMargin);
  var text = ajs.think.thoughtMenu.menuItem.toolTips[menuItemType];
  var length = ajs.utils.canvas.textLength(context, text, options.thoughtMenuToolTipFontStyle);
  var pointB = new ajs.Point(pointA.x + length, pointA.y);
  
  ajs.draw.drawRoundedRectangle(context, pointA, pointB, radius, options.thoughtMenuToolTipFillStyle, options.thoughtMenuToolTipLineWidth, options.thoughtMenuToolTipStrokeStyle);
  
  // Draw tool tip Text
  context.save();
  context.textBaseline= "middle";
  ajs.draw.drawText(context, text, pointA, options.thoughtMenuToolTipFontStyle, options.thoughtMenuToolTipTextColour)
  context.restore();
}

/**
 * Draws the Save Submenu. 
 *
 * @param {CanvasRenderingContext2D} context the canvas context.
 * @param {ajs.think.Options} option the options for the Web App.
 * @param {ajs.think.Submenu} saveSubmenu the Save Submenu.
 * @param {ajs.Point} topLeftSaveSubmenuPoint the point representing the top left corner of the Save Submenu.
 */
ajs.think.draw.drawSaveSubmenu = function(context, options, saveSubmenu, topLeftSaveSubmenuPoint) { 
  var radius = options.saveSubmenuFontSize + options.saveSubmenuLineWidth;
  var pointA = new ajs.Point(topLeftSaveSubmenuPoint.x + radius + options.saveSubmenuLeftMargin, topLeftSaveSubmenuPoint.y + radius + options.saveSubmenuTopMargin);
  
  var text;
  switch (saveSubmenu) {
    case ajs.think.submenu.saveStates.Saving:
    case ajs.think.submenu.saveStates.SuccessfulSaveMessage:
    case ajs.think.submenu.saveStates.TimeOutMessage:
      text = ajs.think.submenu.saveTexts[saveSubmenu];
      break;
    case ajs.think.submenu.saveStates.FailureSaveErrorMessage:
      text = saveSubmenu.failureSaveErrorMessage;
      break;
    default:
      throw "Logic Error";
  }
  var length = ajs.utils.canvas.textLength(context, text, options.saveSubmenuFontStyle);
  var pointB = new ajs.Point(pointA.x + length, pointA.y);
    
  ajs.draw.drawRoundedRectangle(context, pointA, pointB, radius, options.saveSubmenuFillStyle, options.saveSubmenuLineWidth, options.saveSubmenuStrokeStyle);
  
  // Draw Save Submenu text
  context.save();
  context.textBaseline= "middle";
  ajs.draw.drawText(context, text, pointA, options.saveSubmenuFontStyle, options.saveSubmenuTextColour);
  context.restore();
}