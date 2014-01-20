/**
 * @fileoverview A collection of functions relating to the Export Thought Dialog.
 * @requires third_party/canvas2image.js
 * @requires jQuery
 */


goog.provide('ajs.think.ui.exportThoughtDialog');
goog.provide('ajs.think.ui.exportThoughtDialog.ids');

goog.require('ajs.draw');
goog.require('ajs.dom');
goog.require('ajs.Viewport');
goog.require('ajs.think.draw');
goog.require('ajs.think.node');
goog.require('ajs.think.globals');
goog.require('ajs.think.uri');


ajs.think.ui.exportThoughtDialog.ids.exportCanvas = 'exportCanvas';
ajs.think.ui.exportThoughtDialog.ids.exportThoughtDialog = 'exportThoughtDialog';
ajs.think.ui.exportThoughtDialog.ids.exportThoughtImage = 'exportThoughtImage';

/**
 * Get the Export Canvas.
 * 
 * @return {CanvasElement} the export canvas element.
 */
ajs.think.ui.exportThoughtDialog.getExportCanvas = function() {
  var canvas;
  canvas = document.getElementById(ajs.think.ui.exportThoughtDialog.ids.exportCanvas);
  if (canvas == null) {
    canvas = document.createElement('canvas');
    canvas.id = ajs.think.ui.exportThoughtDialog.ids.exportCanvas;
  }
  return canvas;
}

/**
 * Exports the Thought in a new Canvas as a PNG Image element.
 * 
 * @return {Image} the PNG Image element.
 */
ajs.think.ui.exportThoughtDialog.exportThoughtAsImage = function() {
  var canvas = ajs.think.ui.exportThoughtDialog.getExportCanvas();
  var context = canvas.getContext('2d');
  var thought = ajs.think.globals.thought;
  
  var dimensions = ajs.think.node.getBoundingBoxForNodes(context, ajs.think.globals.options, thought.nodes, ajs.think.globals.options.exportedImagePadding);
  var viewport = new ajs.Viewport(dimensions.x, dimensions.y, dimensions.width, dimensions.height);
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  
  //TODO: remove this hack by not suppling the selection param to the draw function.
  // Temporarily remove selection
  var selectionNode = ajs.think.globals.selection.node;
  ajs.think.globals.selection.node = null;
  
  // Draw
  var x = 0;
  var y = 0;
  ajs.draw.drawTopToBottomGradientArea(context, x, y, canvas.width, canvas.height, ajs.think.globals.getTheme().backgroundTopColor, ajs.think.globals.getTheme().backgroundBottomColor);
  ajs.think.draw.drawThink(context, ajs.think.globals.options, viewport, ajs.think.globals.getTheme(), thought, ajs.think.globals.selection, null, null, null, null, null, null);
  
  // Export
  var image = Canvas2Image.saveAsPNG(canvas, true, canvas.width, canvas.height);
  
  // Restore selection.
  ajs.think.globals.selection.node = selectionNode;
  return image;
}

/**
 * Dynamically loads the Export Thought Dialog.
 * 
 * @param {function} callback a callback invoked when the dialog is loaded.
 */
ajs.think.ui.exportThoughtDialog.loadExportThoughtDialog = function(callback) {
  ajs.dom.loadUriIfElementNonExistant(ajs.think.uri.exportThoughtDialog, ajs.think.ui.exportThoughtDialog.ids.exportThoughtDialog, callback);
}

/** 
 * Show the Export Thought dialog.
 * 
 * @param {Image} image the exported thought image.
 */
ajs.think.ui.exportThoughtDialog.showExportThoughtDialog = function(image) {
  ajs.dom.fitImageToSize(image, ajs.think.globals.options.exportThoughtDialogImageSize, ajs.think.globals.options.exportThoughtDialogImageSize);
  
  var imgDiv = document.getElementById(ajs.think.ui.exportThoughtDialog.ids.exportThoughtImage);
  // Remove any existing children.
  while (imgDiv.children.length > 0) {
    imgDiv.removeChild(imgDiv.children[0]);
  }
  
  imgDiv.appendChild(image);
  $('#' + ajs.think.ui.exportThoughtDialog.ids.exportThoughtDialog).dialog('open');
}

/**
 * Initialise the Export Thought Dialog.
 */
ajs.think.ui.exportThoughtDialog.initialiseExportThoughtDialog = function() {
  var width = ajs.think.globals.options.exportThoughtDialogImageSize + ajs.think.globals.options.exportThoughtDialogImageMargin * 2;

  $('#' + ajs.think.ui.exportThoughtDialog.ids.exportThoughtDialog).dialog({
	  modal: true,
    autoOpen: false,
		buttons: {
			Ok: function() {
				$(this).dialog('close');
			}
		}, 
    width: width
	});
}