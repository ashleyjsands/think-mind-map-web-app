/**
 * @fileoverview A collection of globals.
 */


goog.provide('ajs.think.globals');


// This global variable is to be set to a ThoughtContext instance.
// Due to the ThoughtContext's dependency on a Canvas Element, this variable can only be set once the DOM has loaded.
// This is set by ajs.think.setupGlobals
ajs.think.globals = null;
