/**
 * @fileoverview Constants relating to ajax calls.
 */


goog.provide('ajs.ajax.constants');


ajs.ajax.constants.httpMethods = {};
ajs.ajax.constants.timeoutValue = 30 * 1000; // Thirty seconds - http request time limit for GAE.
ajs.ajax.constants.httpMethods.get = "GET";
ajs.ajax.constants.httpMethods.put = "PUT";
ajs.ajax.constants.httpMethods.post = "POST";
ajs.ajax.constants.httpMethods._delete = "DELETE"; // delete is a keyword so I had to prefix this with an underscore.