/**
 * @fileoverview A collection of utility functions.
 */


goog.provide('ajs.utils');


/**
 * Checks if a variable is an empty string or is null.
 *
 * @param {string} string the string to check.
 @ @returns {bool} true if the string is empty or null, otherwise false. 
 */
ajs.utils.isEmptyOrNull = function(string) {
  if (string) {
    return string === "" || string === null;
  } else { // Undefined
    return true;
  }
}

/**
 * Clones an array.
 * 
 * @param {Array} array an array.
 * @returns {Array} a clone/copy of the given array.
 */
ajs.utils.cloneArray = function(array) {
  var newArray = [];
  for (var key in array) {
    newArray[key] = array[key];
  }
  return newArray;
}

/**
 * Concates all possible ordered string combinations from the given array of strings.
 * 
 * @param {Array(string)} strings an array of strings.
 * @returns {Array(Array(string))} an array of ordered string combinations (Array of strings).
 */
ajs.utils.concateAllOrderedStringCombinations = function(strings) {
  strings = ajs.utils.cloneArray(strings);
  var ws = ajs.constants.whiteSpace;
  if (strings.length < 1) {
    return [];
  } else if (strings.length == 1) {
    var linesOne = [strings[0]];
    return [linesOne];
  } else {
    var lastLine = strings.pop();
    var concatLines = ajs.utils.concateAllOrderedStringCombinations(strings);
    var newLines = [];
    for (var i=0; i < concatLines.length; i++) {
      var stringCombinationArr = concatLines[i];
      var length = stringCombinationArr.length;
      // Concate the last line to the combination array's last tine.
      var newCombinationArrOne = ajs.utils.cloneArray(stringCombinationArr);
      newCombinationArrOne[length - 1] = newCombinationArrOne[length - 1] + ws + lastLine;
      newLines.push(newCombinationArrOne);
      // Push the last line onto the end of the combination array.
      var newCombinationArrTwo = ajs.utils.cloneArray(stringCombinationArr);
      newCombinationArrTwo.push(lastLine);
      newLines.push(newCombinationArrTwo);
    }
    return newLines;
  }
}

/**
 * Copies the prototype of a parent to the descendant.
 * 
 * @param {class} descendant the class that is going to "inherit" the parent's members.
 * @param {class} parent the parent class.
 */
ajs.utils.copyPrototype = function(descendant, parent) { 
  var sConstructor = parent.toString(); 
  var aMatch = sConstructor.match( /\s*function (.*)\(/ ); 
  if ( aMatch != null ) { 
    descendant.prototype[aMatch[1]] = parent; 
  } 
  for (var member in parent.prototype) { 
    descendant.prototype[member] = parent.prototype[member]; 
  } 
}; 

/**
 * Set a Cookie.
 * 
 * @param {String} name the name of the cookie.
 * @param {String} value the value of the cookie.
 * @param {number} expireDays the number of days before the cookie expires. This parameter is optional.
 */
ajs.utils.setCookie = function(name, value, expireDays) {
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expireDays);
  document.cookie = name+ "=" +escape(value) + ((expireDays==null) ? "" : ";expires=" + expirationDate.toGMTString());
}

/**
 * Get the value from a cookie.
 * 
 * @param {string} the name of the cookie.
 */
ajs.utils.getCookie = function(cookieName) {
  var notFound = -1;
  if (document.cookie.length > 0) { 
    var start = document.cookie.indexOf(cookieName + "=");
    if (start != notFound) {
      start = start + cookieName.length + 1;
      var end = document.cookie.indexOf(";", start);
      if (end == notFound) {
        end = document.cookie.length;
      }
      return unescape(document.cookie.substring(start, end));
    }
  }
  return null;
}

/**
 * Append a new table row based on the given cells.
 * 
 * @param {String} tableId the table id.
 * @param {Array} cells an array of html strings representing cells for the row to be created.
 */
ajs.utils.appendTableRow = function(tableId, cells) {
  var table = document.getElementById(tableId);
  var row = table.insertRow(table.rows.length);
  
  for (var i = 0; i < cells.length; i++) {
    var cell = row.insertCell(i);
    var element = document.createElement('div');
    element.innerHTML = cells[i];
    cell.appendChild(element);
  }
}

/**
 * Delete all the rows of a table.
 * 
 * @param {String} tableId the table id.
 */
ajs.utils.deleteTableRows = function(tableId) {
  var table = document.getElementById(tableId);
  while (table.rows.length != 0) {
    table.deleteRow(0);
  }
}

/**
 * Removes all option elements from Select element.
 *
 * @param {string} selectId the id of the select element.
 */
ajs.utils.removeAllOptionsFromSelect = function(selectId) {
  var select = document.getElementById(selectId);
  while (select.length > 0) {
    select.remove(select.length - 1);
  }
}

/**
 * Appends an option to the given Select element.
 *
 * @param {string} selectId the id of the select element.
 * @param {string} optionText the text for the new option.
 * @param {string} optionValue the value of the new option.
 */
ajs.utils.appendOptionToSelect = function(selectId, optionText, optionValue) {
  var newOptionElement = document.createElement('option');
  newOptionElement.text = optionText;
  newOptionElement.value = optionValue;
  var selectElement = document.getElementById(selectId);

  try {
    selectElement.add(newOptionElement, null); // standards compliant; doesn't work in IE
  } catch(ex) {
    selectElement.add(newOptionElement); // IE only
  }
}

/** 
 * This function is to be used with Array.sort . It reverses an array.
 */
ajs.utils.reverseSortFunc = function(elementA, elementB) {
  var greaterThan = 1;
  return greaterThan;
}

/**
 * Remove element from array.
 * 
 * @param {object} element the element to be removed.
 * @param {Array} array the array.
 */
ajs.utils.removeElementFromArray = function(element, array) {
  array.splice(array.indexOf(element),1);
}

/**
 * Clones an object.
 * 
 * @param {Object} obj an object to clone.
 * @returns {Object} a clone of the object.
 */
ajs.utils.clone = function(obj) {
  if(obj == null || typeof(obj) != 'object') {
    return obj;
  }
  
  var temp = new obj.constructor(); 
  for(var key in obj) {
    temp[key] = ajs.utils.clone(obj[key]);
  }
  
  return temp;
}

/**
 * Tests whether the two objects are equal.
 *
 * @param {Object} objOne the first object.
 * @param {Object} objTwo the second object.
 * @returns {Boolean} true if they are equal, false if they are not.
 */
ajs.utils.equals = function(objOne, objTwo) {
  if (objOne == null || objTwo == null) {
    return false;
  }
  // For laziness this function assumes that objTwo has the same keys as objOne.
  for(var key in objOne) {
    if (typeof(objOne[key]) == 'object') {
      if (!ajs.utils.equals(objOne[key], objTwo[key])) {
        return false;
      }
    } else if (objOne[key] != objTwo[key]) {
      return false;
    }
  }
  return true;
}

/**
 * Creates a clone of the given object and updates its properties with the given dictionary.
 * This can be considered as a method of mutating an immuttable object.
 * 
 * @param {object} obj an object.
 * @param {dict} updatePropertiesDict a dictionary of property names and values.
 * @return {object} the new cloned & updated object.
 */
ajs.utils.cloneAndUpdateObject = function(obj, updatePropertiesDict) {
  var clone = ajs.utils.clone(obj);
  for (var propertyName in updatePropertiesDict) {
    clone[propertyName] = updatePropertiesDict[propertyName];
  }
  return clone;
}

