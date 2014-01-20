/**
 * @fileoverview This file contains utility event functions.
 */


goog.provide('ajs.events');


/**
 * Creates an event in an element.
 * 
 * @param {HtmlElement} element the element the event is created for.
 * @param {ajs.names.event} eventName the name of the event.
 * @param {Array(string -> object)} eventParameters parameters that will be created on the event.
 */
ajs.events.createEvent = function(element, eventName, eventParameters) {
  var incorrectEventType = "HTMLEvents";
  var e = document.createEvent(incorrectEventType);
  e.initEvent(eventName, true, true);
  
  if (eventParameters) {
    for (var paramName in eventParameters) {
      e[paramName] = eventParameters[paramName];
    }
  }
  element.dispatchEvent(e);
}