/**
 * @fileoverview Functions that customise the use of JQuery.
 * @requires JQuery.
 */


goog.provide('ajs.ui.dialog');

goog.require('ajs.ui.ids');


/**
 * Initialises a DialogMessage div.
 *
 * @param {String} dialogId the id of the dialog div.
 * @param {number} width an optional parameter to specify the width of the dialog.
 * @param {boolean} autoOpen an optional parameter that opens or hides the dialog message when it is initialised.
 * @param {AssociativeArray} buttons an optional parameter that is an associative array of button name to button function.
 */
ajs.ui.dialog.initialiseDialogMessage = function(dialogId, width, autoOpen, buttons) {
  if (!buttons) {
    buttons = {
			Ok: function() {
				$(this).dialog('close');
			}
		};
  }

  var params;
  if (!width) {
    params = {
	    modal: true,
		  buttons: buttons,
      autoOpen: autoOpen
	  };
  } else {
    params = {
	    modal: true,
		  buttons: buttons,
      width: width,
      autoOpen: autoOpen
	  };
  }
  $("#" + dialogId).dialog(params);
}

/**
 * Create and Show a Dialog Message box.
 *
 * @param {String} title the title of the message dialog box.
 * @param {String} content a string representing the html content of the dialog.
 * @param {number} width an optional parameter to specify the width of the dialog.
 * @param {function} onclose a function that is called when the dialog is closed.
 */
ajs.ui.dialog.showDialogMessage = function(title, content, width, onclose) {
  var id = ajs.ui.ids.dialogMessage;
  var div = document.getElementById(id);
  if (div === null) {
    div = document.createElement('div');
    div.id = id;
  }

  // Clean up the div in case it has been used before.
  while (div.children.length > 0) {
    div.removeChild(div.children[0]);
  }
  
  div.title = title;
  div.innerHTML = content;
  document.body.appendChild(div);
  ajs.ui.dialog.initialiseDialogMessage(div.id, width);
  if (onclose) {
    $('#' + ajs.ui.ids.dialogMessage).bind('dialogclose', onclose);
  }
}

/**
 * Create and Show a Dialog Message box.
 *
 * @param {String} title the title of the message dialog box.
 * @param {Array} elements HTML elements to be the content of the dialog box.
 * @param {number} width an optional parameter to specify the width of the dialog.
 * @param {function} onclose a function that is called when the dialog is closed.
 */
ajs.ui.dialog.showDialogMessageWithElements = function(title, elements, width, onclose) {
  var id = ajs.ui.ids.dialogMessage;
  var div = document.getElementById(id);
  if (div === null) {
    div = document.createElement('div');
    div.id = id;
  }

  // Clean up the div in case it has been used before.
  while (div.children.length > 0) {
    div.removeChild(div.children[0]);
  }

  div.title = title;
  for (var i = 0; i < elements.length; i++) {
    div.appendChild(elements[i]);
  }
  document.body.appendChild(div);
  ajs.ui.dialog.initialiseDialogMessage(div.id, width);
  if (onclose) {
    $('#' + ajs.ui.ids.dialogMessage).bind('dialogclose', onclose);
  }
}

