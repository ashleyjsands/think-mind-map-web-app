/**
 * @fileoverview Contains a Menu Item class and menu item functions and enums.
 */
 
 
goog.provide('ajs.think.thoughtMenu.MenuItem');
goog.provide('ajs.think.thoughtMenu.menuItem');

goog.require('ajs.Point');
goog.require('ajs.think.options');


/**
 * The MenuItem class represents a menu item in a menu within the Canvas.
 * 
 * @constructor
 * @param {number} x the x component of the Menu Item Point.
 * @param {number} y the y component of the Menu Item Point.
 * @param {number} type the type of the Menu Item.
 * @param {number} image the image for the Menu Item.
 */
ajs.think.thoughtMenu.MenuItem = function(x, y, type, image) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.image = image;
}
  
/**
 * Checks if the menu item modifies the thought data on the Sever.
 * 
 * @return {bool} true if it modifies the thought data on the Server, false otherwise.
 */
ajs.think.thoughtMenu.MenuItem.prototype.modifiesThought = function() {
  return this.type == ajs.think.thoughtMenu.menuItem.types.Save;
}
  
/**
 * Checks if the menu item is disabled.
 * 
 * @param {ajs.Thought} thought the current thought.
 * @return {bool} true if the menu item is disabled, otherwise false.
 */
ajs.think.thoughtMenu.MenuItem.prototype.disabled = function(thought) {
  // If the thought is not modifiable and the menu item modifies the thought, then it is disabled.
  if (this.modifiesThought()) {
    if (!thought.modifiable) {
      return true;
    } else {
      return !thought.modified;
    }  
  } else {
    return false;
  } 
}

/**
 * Thought Menu Item Types.
 *
 * @enum {String}
 */
ajs.think.thoughtMenu.menuItem.types = {
  Close : "Close",
  ThoughtOptions : "ThoughtOptions",
  Save : "Save",
  Export : "Export"
};

/**
 * An assocative array of Menu Item types to their respective tool tips.
 */
ajs.think.thoughtMenu.menuItem.toolTips = {
  Close : "Close Thought",
  ThoughtOptions : "Open Thought Options",
  Save : "Save Thought",
  Export : "Export Thought as Image"
};

  
/**
 * Computes the point of the thought menu items.
 *
 * @param {ajs.Options} option the options for the Web App.
 * @param {Array} menuItems an array of menu items.
 * @return {Array(ajs.Point)} an array of points.
 */
ajs.think.thoughtMenu.menuItem.computeMenuItemPoints = function(options, menuItems) {
  var points = [];
  for (var i = 0; i < menuItems.length; i++) {
    var menuItemX = options.thoughtMenuMarginLeft + ((options.thoughtMenuItemRadius + options.thoughtMenuItemMargin) * 2) * (i + 0.5);
    
    var menuItemY = options.thoughtMenuMarginTop + options.thoughtMenuItemRadius + options.thoughtMenuItemMargin;
    var point = new ajs.Point(menuItemX, menuItemY);
    points.push(point);
  }
  return points;
}

/**
 * Gets the Menu Item type based on the image.
 * 
 * @param {Image} image the menu item image.
 * @param {ajs.think.thoughtMenu.menuItem.types} the Menu Item Type.
 */
ajs.think.thoughtMenu.menuItem.getMenuItemType = function(image) {
 var typesToImages = {
   Close : ajs.think.options.closeImage,
   ThoughtOptions : ajs.think.options.thoughtOptionsImage,
   Save : ajs.think.options.saveImage,
   Export : ajs.think.options.exportImage
 };
 for (var i in typesToImages) {
   if (typesToImages[i] === image) {
     return i;
   }
 }
 return null;
}

/**
 * Gets all the Menu items based on the context of the Web App.
 *
 * @return {Array(MenuItem)} an array of Menu Items.
 */
ajs.think.thoughtMenu.menuItem.getMenuItems = function() {
  var images = [
    ajs.think.options.closeImage, 
    ajs.think.options.thoughtOptionsImage, 
    ajs.think.options.saveImage, 
    ajs.think.options.exportImage
  ]; 
  var points = ajs.think.thoughtMenu.menuItem.computeMenuItemPoints(ajs.think.globals.options, images);
  var items = [];
  for (var i = 0; i < images.length; i++) {
    var item = new ajs.think.thoughtMenu.MenuItem(points[i].x, points[i].y, ajs.think.thoughtMenu.menuItem.getMenuItemType(images[i]), images[i]);
    items.push(item);
  }
  return items;
}