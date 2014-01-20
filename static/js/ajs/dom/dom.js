/**
 * @fileoverview A collection of functions relating to the DOM.
 * @requires jQuery
 */


goog.provide('ajs.dom');


/**
 * Loads html file as a URI into a new div.
 * 
 * @param {string} uri the uri to GET the html file.
 */
ajs.dom.loadIntoNewDiv = function(uri, callback) {
  var div = $('<div></div>');
  $("body").append(div);
  $(div).load(uri, null, callback);
}

/**
 * Loads the URI if the Element does not exist.
 * 
 * @param {string} uri the uri to GET the html file.
 * @param {string} id the id of the element to check.
 * @param {function} callback a callback invoked when the URI is loaded.
 */
ajs.dom.loadUriIfElementNonExistant = function(uri, id, callback) {
  if (document.getElementById(id) == null) {
    ajs.dom.loadIntoNewDiv(uri, callback);
  } else if (callback) {
    callback();
  } 
}

/**
 * Scale an Image element to a given height and width.
 * 
 * @param {ImageElement} image an image element.
 * @param {number} width the width value the image will be fitted into.
 * @param {number} height the height value the image will be fitted into.
 */
ajs.dom.fitImageToSize = function(image, width, height){
  // In the case that the image is not initialized set it to the given dimensions. 
  // This will result in a strange image though.
  if (image.width == 0 || image.height == 0) {
    image.width = width;
    image.height = height;
    return;
  }
  var scaleRatio = 1;
  if (image.width > image.height) {
    if (image.width > width) {
      scaleRatio = width / image.width;
    }
  } else {
    if (image.height > height) {
      scaleRatio = height / image.height;
    }
  }
  image.width = image.width * scaleRatio;
  image.height = image.height * scaleRatio;
}