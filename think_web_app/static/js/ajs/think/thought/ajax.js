/**
 * @fileoverview functions to load, draw and animate thoughts.
 * 
 * This file needs the globals.js loaded before it.
 */


goog.provide('ajs.think.thought.ajax');

goog.require('ajs.ajax');
goog.require('ajs.think.uri');
goog.require('ajs.think.thought');


/**
 * A example class to show what AJAX callbacks will be called with.
 *
 * @private
 * @constructor
 * @param {boolean} success the success of the AJAX call.
 * @param {string} errorMsg in the event of the AJAX call failing, this will contain an error message.
 */
ajs.think.thought.ajax.Response_ = function(success, errorMsg) {
  this.success = success;
  if (!this.success) {
    this.errorMsg = errorMsg;
  }
}

/**
 * Generic get thought function.
 * 
 * @private
 * @param {dict} params the params that are passed to ajs.ajax.getRequest.
 * @param {function} callback the callback function that is called with an ajs.think.thought.ajax.Response_ object as the first parameter which will contain an additional property 'thought' if the AJAX call is successful.
 */
ajs.think.thought.ajax.getThought_ = function(params, callback) {
  ajs.ajax.getRequest(ajs.think.uri.thought, params, callback);
}

/**
 * Gets a thought.
 *
 * @param {string} thoughtName the name of the thought to get.
 * @param {function} callback the callback function that is called with an ajs.think.thought.ajax.Response_ object as the first parameter which will contain an additional property 'thought' if the AJAX call is successful.
 */
ajs.think.thought.ajax.getThoughtUsingName = function(thoughtName, callback) {
  ajs.think.thought.ajax.getThought_({'name': thoughtName}, callback);
} 

/**
 * Opens a thought into the Web App.
 *
 * @param {string} thoughtId the id of the thought to load. 
 * @param {function} callback the callback function that is called with an ajs.think.thought.ajax.Response_ object as the first parameter which will contain an additional property 'thought' if the AJAX call is successful.
 */
ajs.think.thought.ajax.getThoughtUsingId = function(thoughtId, callback) {
  ajs.think.thought.ajax.getThought_({'id' : thoughtId}, callback);
} 

/**
 * Deletes a thought.
 *
 * @param {string} thoughtId the id of the thought to delete. 
 * @param {function} callback the callback function that is called with an ajs.think.thought.ajax.Response_ object as the first parameter.
 */
ajs.think.thought.ajax.deleteThoughtUsingId = function(thoughtId, callback) {
  ajs.ajax.deleteRequest(ajs.think.uri.thought, {'id': thoughtId}, callback);
} 

/**
 * Gets the user's thought descriptions.
 * 
 * @param {function} callback the callback function that is called with an ajs.think.thought.ajax.Response_ object as the first parameter which will contain an additional property 'thoughtDescriptions' if the AJAX call is successful.
 */
ajs.think.thought.ajax.getThoughtDescriptionsForUser = function(callback) {
  var thoughtDescriptionParams = {'collection': 'all'};
  ajs.ajax.getRequest(ajs.think.uri.thought, thoughtDescriptionParams, callback);
}

/**
 * Creates a new Thought or Updates an existing one with the Server via AJAX.
 * 
 * @param {ajs.Thought} thought the thought to send to the Server to create or update.
 * @param {function} callback the callback function that is called with an ajs.think.thought.ajax.Response_ object as the first parameter.
 * @param {function} timeoutCallback the callback function called when the AJAX call times out.
 */
ajs.think.thought.ajax.createOrUpdateThought = function(thought, callback, timeoutCallback) {
  ajs.ajax.putRequest(ajs.think.uri.thought, {'thought': thought}, callback, true, timeoutCallback);
}
