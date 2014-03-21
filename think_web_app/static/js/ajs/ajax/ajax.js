/**
 * @fileoverview All methods relating to ajax calls.
 */


goog.provide('ajs.ajax');

goog.require('ajs.constants');
goog.require('ajs.ajax.constants');


// As mentioned at http://en.wikipedia.org/wiki/XMLHttpRequest
// This portable code that setups alternative XMLHttpRequest objects.
if(!window.XMLHttpRequest) XMLHttpRequest = function() {
  try{ return new ActiveXObject("Msxml2.XMLHTTP.6.0") }catch(e){}
  try{ return new ActiveXObject("Msxml2.XMLHTTP.3.0") }catch(e){}
  try{ return new ActiveXObject("Msxml2.XMLHTTP") }catch(e){}
  try{ return new ActiveXObject("Microsoft.XMLHTTP") }catch(e){}
  throw new Error("Could not find an XMLHttpRequest alternative.")
};


/**
 * Makes a GET AJAX request to a local server function.
 * 
 * @param {string} uri the uri to send the request to.
 * @param {Array(string)} args the arguments to send.
 * @param {function} callback the function to callback.
 */
ajs.ajax.getRequest = function(uri, args, callback) {
  ajs.ajax.requestWithoutBody(uri, ajs.ajax.constants.httpMethods.get, args, callback);
}

/**
 * Makes a DELETE AJAX request to a local server function.
 * 
 * @param {string} uri the uri to send the request to.
 * @param {Array(string)} args the arguments to send.
 * @param {function} callback the function to callback.
 */
ajs.ajax.deleteRequest = function(uri, args, callback) {
  ajs.ajax.requestWithoutBody(uri, ajs.ajax.constants.httpMethods._delete, args, callback);
}

/**
 * Makes a DELETE AJAX request to a local server function.
 * 
 * @param {string} uri the uri to send the request to.
 * @param {ajs.ajax.constants.httpMethods} httpMethodType the http method type of the request.
 * @param {Array(string)} args the arguments to send.
 * @param {function} callback the function to callback.
 */
ajs.ajax.requestWithoutBody = function(uri, httpMethodType, args, callback) {
  // Encode the arguments in to a URI
  var query = ajs.ajax.convertArgsIntoUriStringFragment(args);
  
  var async = (callback != null);

  // Create an XMLHttpRequest request w/ an optional callback handler
  var req = new XMLHttpRequest();
  req.open(httpMethodType, uri + "?" + query, async);

  if (async) {
    req.onreadystatechange = function() {
      if(req.readyState == 4 && req.status == 200) {
        var response = null;
        try {
          response = JSON.parse(req.responseText);
        } catch (e) {
          response = req.responseText;
        }
        callback(response);
      }
    }
  }

  // Make the actual request
  req.send(null);
}


/**
 * Converts arguments into the query string fragment of a URI.
 * 
 * @params {Array(string,string)} args an associative array of argument names and values.
 * @returns {string} the query string fragment.
 */
ajs.ajax.convertArgsIntoUriStringFragment = function(args) {
  var fragment = "";
  var first = true;
  for (var key in args) {
    // This is so that the first argument does not have an ampersand in front of it.
    if (first) {
      first = false;
    } else {
      fragment += '&';
    }
    
    // I commented out the following line because I did't like the quotes it would add. This may break for other types of data.
    //var val = JSON.stringify(args[key]);
    var val = args[key];
    fragment += key + '=' + encodeURIComponent(val);
  }
  return fragment;
}

/**
 * Makes a POST AJAX request to a local server function.
 * 
 * Args:
 *   uri: the URI to request.
 *   args: an Array of arguments for the AJAX function.
 *   callback: an optional argument to provide a callback function when the AJAX request is completed.
 *   putArgsAsJsonInBody: an optional argument to put the args as JSON into the body of the AJAX request.
 *   timeoutCallback: the callback function called when the AJAX call times out.
 */
ajs.ajax.postRequest = function(uri, args, callback, putArgsAsJsonInBody, timeoutCallback) {
  ajs.ajax.request(ajs.ajax.constants.httpMethods.post, uri, args, callback, putArgsAsJsonInBody, timeoutCallback);
}

/**
 * Makes a PUT AJAX request to a local server function.
 * 
 * Args:
 *   uri: the URI to request.
 *   args: an Array of arguments for the AJAX function.
 *   callback: an optional argument to provide a callback function when the AJAX request is completed.
 *   putArgsAsJsonInBody: an optional argument to put the args as JSON into the body of the AJAX request.
 *   timeoutCallback: the callback function called when the AJAX call times out.
 */
ajs.ajax.putRequest = function(uri, args, callback, putArgsAsJsonInBody, timeoutCallback) {
  ajs.ajax.request(ajs.ajax.constants.httpMethods.put, uri, args, callback, putArgsAsJsonInBody, timeoutCallback);
}

/**
 * Makes a AJAX request to a local server function.
 * 
 * Args:
 *   httpMethod: can be POST or PUT.
 *   uri: the URI to request.
 *   args: an Array of arguments for the AJAX function.
 *   callback: an optional argument to provide a callback function when the AJAX request is completed.
 *   putArgsAsJsonInBody: an optional argument to put the args as JSON into the body of the AJAX request.
 *   timeoutCallback: the callback function called when the AJAX call times out.
 */
ajs.ajax.request = function(httpMethod, uri, args, callback, putArgsAsJsonInBody, timeoutCallback) {
  var async = (callback != null);
  if (putArgsAsJsonInBody == null) {
    putArgsAsJsonInBody = false;
  }
   
  var timeoutValue = null;
  if (timeoutCallback) {
    timeoutValue = setTimeout(timeoutCallback, ajs.ajax.constants.timeoutValue);
  }
  
  var body;
  if (putArgsAsJsonInBody) {
    body = JSON.stringify(args);
  } else {
    body = null;
  }
  
  // Encode the arguments in to a URI
  var query = ajs.ajax.convertArgsIntoUriStringFragment(args);
  
  // Create an XMLHttpRequest 'POST' request w/ an optional callback handler
  var req = new XMLHttpRequest();
  req.open(httpMethod, uri + "?" + query, async);

  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // the following two lines are considered unsafe.
  //req.setRequestHeader("Content-length", body.length);
  //req.setRequestHeader("Connection", "close");

  if (async) {
    req.onreadystatechange = function() {
      if(req.readyState == 4 && req.status == 200) {
        var response = null;
        try {
         response = JSON.parse(req.responseText);
        } catch (e) {
         response = req.responseText;
        }
        
        if (timeoutValue != null) {
          clearTimeout(timeoutValue);
        }
        callback(response);
      }
    }
  }

  // Make the actual request
  req.send(body);
}
