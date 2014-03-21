/**
 * @fileoverview The Options class and global variable declaration.
 */


goog.provide('ajs.think.options');
goog.provide('ajs.think.Options');

goog.require('ajs.constants');


// Setup Images
ajs.think.options.thinkUrlDir = '/';
ajs.think.options.imageUrlDir = ajs.think.options.thinkUrlDir + 'images/';
ajs.think.options.closeImage = new Image();
ajs.think.options.closeImage.src = ajs.think.options.imageUrlDir + 'close.png';
ajs.think.options.thoughtOptionsImage = new Image();
ajs.think.options.thoughtOptionsImage.src = ajs.think.options.imageUrlDir + 'thought_options.png';
ajs.think.options.saveImage = new Image();
ajs.think.options.saveImage.src = ajs.think.options.imageUrlDir + 'save.png';
ajs.think.options.exportImage = new Image();
ajs.think.options.exportImage.src = ajs.think.options.imageUrlDir + 'export.png';
ajs.think.options.createImage = new Image();
ajs.think.options.createImage.src = ajs.think.options.imageUrlDir + 'create.png';
ajs.think.options.connectImage = new Image();
ajs.think.options.connectImage.src = ajs.think.options.imageUrlDir + 'connect.png';
ajs.think.options.destroyImage = new Image();
ajs.think.options.destroyImage.src = ajs.think.options.imageUrlDir + 'destroy.png';

/**
 * The Options class represents the options for the Think Web App.
 * 
 * @constructor
 */
ajs.think.Options = function() {	  

	// fps
	this.fps = 25;
	this.intervalTime = ajs.constants.millisecondsInASecond / this.fps;
	
	// Connection control point
	this.controlPointConstant = 550;
	
	// Title
	this.titleColour = "#000000";
  this.titleFontSize = 22;
	this.titleFontStyle = "bold " + this.titleFontSize + "px sans-serif";
	this.titleText = "Think";
	this.version = "v1.2.1";
	this.titleX = 450;
	this.titleY = 27;
	
	// Node
	this.circleGradientInnerRadiusQuotient = 10;
	this.circleStrokeWidth = 3;
	this.circleStrokeStyle = "#000000";
  this.nodeFontSize = 14;
	this.nodeFontStyle = this.nodeFontSize + "px sans-serif";
	this.nodePadding = 15;
  this.minimumTextWidth = 10;
  this.wrapNodeText = true;
  this.wrapNodeTextGreedy = false;
  this.nodeHightlightLightenVal = 0.333;

    // Dragged
	this.draggedNodeFillStyle = "#888888";
	this.draggedNodeStrokeWidth = 2;
	this.draggedNodeStrokeStyle = "#000000";
	this.draggedNodeDotAngle = 5;
	
	// Action
	this.actionRadius = 15;
	this.actionMargin = 7;
	this.numberOfActions = 3;
	this.imgWidth = this.actionRadius * 2;
	this.imgHeight = this.actionRadius * 2;
  this.createdNodeDistance = 30;
	this.createImage = ajs.think.options.createImage;
	this.connectImage = ajs.think.options.connectImage;
	this.destroyImage = ajs.think.options.destroyImage;
  // Action Tool Tip
  this.actionToolTipFontSize = 12;
	this.actionToolTipFontStyle = "" + this.actionToolTipFontSize + "px sans-serif";
  this.actionToolTipTextColour = "#000000";
  this.actionToolTipMargin = 6;
  this.actionToolTipFillStyle = "#FFFFFF";
  this.actionToolTipLineWidth = 2;
  this.actionToolTipStrokeStyle = "#000000";

  // Connection
  this.connectionDrawGradient = true;  
  this.connectionOuterHightlightLightenVal = 0.33;
  this.connectionInnerHightlightLightenVal = 0.2;

	// Selection
	this.selectionStrokeWidth = 3;
	this.selectionStrokeStyle = "#000000";
	this.selectionPadding = 5;
	this.selectionDiffMin = (this.actionRadius + this.actionMargin) * 2 + this.selectionPadding;
	this.selectionDiffMax = this.selectionDiffMin + 10;
	this.animationLengthInMillseconds = 1000;
  
  // Buttons (menu items and actions)
  this.buttonFillStyle = "#000000";
  this.actionButtonHoverFillStyle = "#FFFFFF";
  this.menuItemButtonHoverFillStyle = "#777777";
  
  // Thought Menu Items
  this.thoughtMenuItemRadius = 15;
  this.thoughtMenuItemMargin = 3;
  this.thoughtDisabledMenuItemFillStyle = "rgba(0,0,0,0.7)";
  this.thoughtDisabledMenuItemLineWidth = 1;
  this.thoughtDisabledMenuItemStrokeStyle = "#000000";
  this.closeImage = ajs.think.options.closeImage;
  this.thoughtOptionsImage = ajs.think.options.thoughtOptionsImage;
  this.saveImage = ajs.think.options.saveImage;
  this.exportImage = ajs.think.options.exportImage;
  // Thought Menu
  this.thoughtMenuPadding = 2;
  this.thoughtMenuMarginTop = 5;
  this.thoughtMenuMarginLeft = 5;
  this.thoughtMenuFillStyle = "#FFFFFF";
  this.thoughtMenuLineWidth = 5;
  this.thoughtMenuStrokeStyle = "#000000";
  // Thought Menu Tool Tip
  this.thoughtMenuToolTipFontSize = 12;
	this.thoughtMenuToolTipFontStyle = "" + this.thoughtMenuToolTipFontSize + "px sans-serif";
  this.thoughtMenuToolTipTextColour = "#000000";
  this.thoughtMenuToolTipLeftMargin = 0;
  this.thoughtMenuToolTipTopMargin = 0;
  this.thoughtMenuToolTipFillStyle = "#FFFFFF";
  this.thoughtMenuToolTipLineWidth = 2;
  this.thoughtMenuToolTipStrokeStyle = "#000000";
  // Save Submenu 
  this.saveSubmenuFontSize = 12;
	this.saveSubmenuFontStyle = "" + this.saveSubmenuFontSize + "px sans-serif";
  this.saveSubmenuTextColour = "#000000";
  this.saveSubmenuLeftMargin = 0;
  this.saveSubmenuTopMargin = 0;
  this.saveSubmenuFillStyle = "#FFFFFF";
  this.saveSubmenuLineWidth = 2;
  this.saveSubmenuStrokeStyle = "#000000";
  this.saveOperationDisplayDuration = 3000; // This is time in milliseconds.
  // Thought Options Modal Dialog
  this.thoughtOptionsWidth = 730;
  this.editNodeModalDialogWidth = 500;
  this.exportThoughtDialogImageSize = 300;
  this.exportThoughtDialogImageMargin = 30;
  
  // Misc
  this.exportedImagePadding = 10;
  
  // Mouse Entities
  this.mouseEntityZOrders = {
    dragging: 5,
    menuItem: 4,
    action: 3,
    node: 2,
    connection: 1,
    viewport: 0
  };
  
  // Dialogs
  this.defaultDialogWidth = 500;
  
  // Ids
  this.ids = {};
  this.ids.canvas = "think";
}


