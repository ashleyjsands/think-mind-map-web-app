/**
 * @fileoverview The Dimension class and related functions.
 */


goog.provide('ajs.Observable');


/**
 * The Observable class is an implementation of the Observer Design Pattern.
 * 
 * @constructor
 */
ajs.Observable = {}

ajs.Observable.prototype = {

  // The functions to call.
  functions : [],
  
  /**
   * Subscribe to the Observable.
   * 
   * @param {function} fn the function the Observable calls when it notifies its Observers.
   */
  subscribe : function(fn) {
    this.functions.push(fn);
  },
  
  /**
   * Unsubscribe from the Observable.
   * 
   * @param {function} fn the function that will be unsubscribed from the Observable.
   */
  unsubscribe : function(fn) {
    this.functions = this.functions.filter(
      function(element) {
        if (element !== fn ) {
          return el;
        }
      }
    );
  },
  
  /**
   * Notify all the Observers.
   * 
   * @param {object} o the object that is passed as a notification to the Observers.
   * @param {object} thisObj the scope?.
   */
  notify : function(o, thisObj) {
    var scope = thisObj || window;
    this.functions.forEach(
      function(element) {
        element.call(scope, o);
      }
    );
  }
};