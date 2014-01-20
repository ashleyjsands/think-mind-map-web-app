/**
 * @fileoverview A collection of functions and constants relating to the Main Menu.
 * @requires third_party/getElementsByClassName.js
 */


goog.provide('ajs.think.mainMenu');

goog.require('ajs.dom');
goog.require('ajs.ui.form');
goog.require('ajs.utils');
goog.require('ajs.constants');
goog.require('ajs.think.ui.tabs');
goog.require('ajs.think.ui.tabs.ids');
goog.require('ajs.think.mainMenu.ids');
goog.require('ajs.think.mainMenu.classes');
goog.require('ajs.think.globals');
goog.require('ajs.think.thoughtMenu');
goog.require('ajs.think.thought.ajax');
goog.require('openiduser');


ajs.think.mainMenu.forms = [ajs.think.mainMenu.ids.thoughtsForm, ajs.think.mainMenu.ids.registerForm, openiduser.ids.loginForm];
ajs.think.mainMenu.loggedInDisabledTabs = [ajs.think.ui.tabs.names.register, ajs.think.ui.tabs.names.login];
ajs.think.mainMenu.notLoggedInDisabledTabs = [ajs.think.ui.tabs.names.logout];
ajs.think.mainMenu.sessionIdCookie = 'session_id';

ajs.think.mainMenu.userNameTemplateIdentifier = '{username}';


/**
 * This function is used to resize the widths of menus.
 */
ajs.think.mainMenu.resizeMenuWidths = function() {
  var width = window.innerWidth;
  var menus = getElementsByClassName(ajs.think.mainMenu.classes.menu);
  for (var i = 0; i < menus.length; i++) {
    menus[i].style.marginLeft = "" + Math.round((width - menus[i].offsetWidth) / 2) + "px";
  }
}

/**
 * This function is used to resize heights of menus.
 */
ajs.think.mainMenu.resizeMenuHeights = function() {
  var height = window.innerHeight;
  var menus = getElementsByClassName(ajs.think.mainMenu.classes.menu);
  for (var i = 0; i < menus.length; i++) {
    menus[i].style.marginTop = "" + Math.round((height - menus[i].offsetHeight) / 2) + "px";
  }
}

/**
 * Logs the user out of the Web App.
 */
ajs.think.mainMenu.logout = function() {
  var params = [];
  var callback = function() {
    ajs.think.mainMenu.showMainMenu();
  };
  ajs.ajax.postRequest('/logout', params, callback);
}

/**
 * Checks if an element is non-empty.
 * 
 * @param {string} elementId the id of the element to check.
 * @returns {bool} true if the element is not empty, false if it is empty.
 */
ajs.think.mainMenu.validateNonEmptyElement = function(elementId) {
  var value = document.getElementById(elementId).value;
  
  return !ajs.utils.isEmptyOrNull(value);
}

/**
 * Shows the default Welcome menu.
 */
ajs.think.mainMenu.showMainMenu = function() { 
  // This is for public thoughts to come back to the main app. 
  if (document.location.hash != "") {
    document.location.hash = "";
  }
  var hiddableElementIds = getElementsByClassName(ajs.think.mainMenu.classes.hiddable);
  var visibleOnLoadIds = getElementsByClassName(ajs.think.mainMenu.classes.visibleOnLoad);
  ajs.think.mainMenu.showElementAndHideGroup(visibleOnLoadIds, hiddableElementIds);
  ajs.think.mainMenu.resetErrors();
  ajs.think.ui.tabs.showTab(ajs.think.ui.tabs.ids.mainMenuTabs, ajs.think.ui.tabs.names.thoughts); // showTab must be called before customizeForUser
  ajs.think.mainMenu.customizeForUser();
  
  for (var i=0; i < ajs.think.mainMenu.forms.length; i++) {
    ajs.clearFormInputs(ajs.think.mainMenu.forms[i]);
  }
  
  // This is done at the end because the previous code may change the size of the menus.
  ajs.think.mainMenu.resizeMenuWidths();
  
  ajs.think.mainMenu.initialiseThoughtsTab();
}

/**
 * Resets the values in all the error elements.
 */
ajs.think.mainMenu.resetErrors = function() {
  var errors = getElementsByClassName('error');
  for (var i=0; i < errors.length; i++) {
    errors[i].innerText = "";
  }
}

/**
 * Initialises the Thoughts tab.
 */
ajs.think.mainMenu.initialiseThoughtsTab = function() {
  $("button").button();
  
  if (ajs.think.mainMenu.userLoggedIn()) {
    ajs.think.mainMenu.populateComboboxWithThoughtDescriptions();
  }
}

/**
 * Customize the Main Menu for the user. Certain functionality is disabled or enabled depending upon whether
 * the user is logged in or not.
 */
ajs.think.mainMenu.customizeForUser = function() {
  if (!ajs.think.mainMenu.userLoggedIn()) {
    // Hide loggedInOnlyElements
    var loggedInOnlyElements = getElementsByClassName(ajs.think.mainMenu.classes.loggedInOnly);
    for (var i=0; i < loggedInOnlyElements.length; i++) {
      var element = loggedInOnlyElements[i];
      element.disabled = true;
    }
    
    // Enabled the ajs.think.mainMenu.loggedInDisabledTabs because the user may have logged out.
    ajs.think.ui.tabs.enableTabs(ajs.think.ui.tabs.ids.mainMenuTabs, ajs.think.mainMenu.loggedInDisabledTabs);
    // Disable the ajs.think.mainMenu.notLoggedInDisabledTabs.
    ajs.think.ui.tabs.disableTabs(ajs.think.ui.tabs.ids.mainMenuTabs, ajs.think.mainMenu.notLoggedInDisabledTabs);
    
  } else {
    // Show loggedInOnlyElements
    var loggedInOnlyElements = getElementsByClassName(ajs.think.mainMenu.classes.loggedInOnly);
    for (var i=0; i < loggedInOnlyElements.length; i++) {
      var element = loggedInOnlyElements[i];
      element.disabled = false;
    }
    
    // Enabled the ajs.think.mainMenu.notLoggedInDisabledTabs
    ajs.think.ui.tabs.enableTabs(ajs.think.ui.tabs.ids.mainMenuTabs, ajs.think.mainMenu.notLoggedInDisabledTabs);
    // Disable certain tabs.
    ajs.think.ui.tabs.disableTabs(ajs.think.ui.tabs.ids.mainMenuTabs, ajs.think.mainMenu.loggedInDisabledTabs);
  }
}

/**
 * Checks if the user is logged in.
 *
 * @returns {bool} true if the user is logged in, false otherwise.
 */
ajs.think.mainMenu.userLoggedIn = function() {
  return !ajs.utils.isEmptyOrNull(ajs.think.mainMenu.getSessionId());
}

/**
 * Get the Session Id from the cookie.
 * 
 * @return {string} the session id or null.
 */
ajs.think.mainMenu.getSessionId = function() {
  return ajs.utils.getCookie(ajs.think.mainMenu.sessionIdCookie);
}

/**
 * Shows a given element and hides the rest. The element to be shown can be in the hidden group because the
 * hidden group is hidden before the visible element is shown.
 * 
 * @param {Array(HTMLElement)} visibleElements an array of elments to be shown. This can be empty or null.
 * @param {Array(HTMLElement)} hiddenElements an Array of of elements to be hidden.
 */
ajs.think.mainMenu.showElementAndHideGroup = function(visibleElements, hiddenElements) {
  for (var index in hiddenElements) {
    hiddenElements[index].style.display = "none";
  }
  
  if (visibleElements != null) {
    for (var i = 0; i < visibleElements.length; i++) {
      visibleElements[i].style.display = "block";
    }
  }
}

/**
 * Hides all hiddable elements.
 */
ajs.think.mainMenu.hideAll = function() {
  var hiddableElementIds = getElementsByClassName(ajs.think.mainMenu.classes.hiddable);
  ajs.think.mainMenu.showElementAndHideGroup([], hiddableElementIds);
}

ajs.think.mainMenu.tutorialName = 'Tutorial';

/**
 * Loads the Tutorial thought into the Web App.
 */
ajs.think.mainMenu.loadTutorial = function() {
  ajs.think.mainMenu.hideAll();
  ajs.think.thoughtMenu.openThoughtUsingName(ajs.think.mainMenu.tutorialName);
}

/**
 * Loads the Tutorial thought into the Web App.
 */
ajs.think.mainMenu.loadNewThought = function() {
  if (ajs.think.mainMenu.validateNonEmptyElement(ajs.think.mainMenu.ids.newThought)) {
    ajs.think.mainMenu.hideAll();
    ajs.think.thoughtMenu.createAndLoadNewThought(document.getElementById(ajs.think.mainMenu.ids.newThought).value);
  } else {
    document.getElementById(ajs.think.mainMenu.ids.newThoughtError).innerText = "You must enter a thought name.";
  }
}

/**
 * Populates a combobox with thought descriptions for the user.
 * 
 * @param {string} comboBoxId the id of the combo box to populate.
 */
ajs.think.mainMenu.populateComboboxWithThoughtDescriptions = function(comboBoxId) {
  ajs.think.thought.ajax.getThoughtDescriptionsForUser(ajs.think.mainMenu.getThoughtDescriptionsForUserCallBack);
}

/**
 * The callback function for retrieving the user's Thought descriptions.
 * 
 * @param {object} response a JSON object with properties: success, thoughtDescriptions, and errorMsg.
 * @uses ajs.think.globals.thoughtDescriptions .
 */
ajs.think.mainMenu.getThoughtDescriptionsForUserCallBack = function(response) {
  if (response.success) {
    ajs.think.globals.thoughtDescriptions = response.thoughtDescriptions;
    ajs.utils.deleteTableRows(ajs.think.mainMenu.ids.thoughtTable);
    
    if (ajs.think.globals.thoughtDescriptions.length == 0) {
      var noThoughtsCells = ['', '<span><i>You have no thoughts</i></span>', ''];
      ajs.utils.appendTableRow(ajs.think.mainMenu.ids.thoughtTable, noThoughtsCells);
    } else {
      for (var i = 0; i < ajs.think.globals.thoughtDescriptions.length; i++) {
        var description = ajs.think.globals.thoughtDescriptions[i];
        var id = "'" + description.id + "'";
        var openButtonCell = '<button onclick="ajs.think.mainMenu.hideAll(); ajs.think.thoughtMenu.openThoughtUsingId({id});">Open</button>'.replace(/{id}/g, id);
        var nameCell = '<span class="thoughtNameTableCell">{name}</span>'.replace(/{name}/g, description.name);
        // This button has an inline css styles because it is needed to overwrite the default JQuery UI values.
        var deleteButtonCell = '<button style="font-size: 8px;" onclick="ajs.think.mainMenu.promptUserToDeleteThought({id});">Delete</button>'.replace(/{id}/g, id);
        var cells = [openButtonCell, nameCell, deleteButtonCell];
        ajs.utils.appendTableRow(ajs.think.mainMenu.ids.thoughtTable, cells);
      }
      $("button").button();
    }
  } else {
    alert(response.errorMsg);
  }
}

/**
 * Prompt the user to Delete Thought.
 * 
 * @param {String} thoughtId the id of the thought to delete.
 */
ajs.think.mainMenu.promptUserToDeleteThought = function(thoughtId) {
  if (confirm('Click OK to delete Thought.')) {
    ajs.think.thought.ajax.deleteThoughtUsingId(thoughtId, ajs.think.mainMenu.deleteThoughtCallBack);
  }
}

/**
 * The callback function for deleting a Thought.
 * 
 * @param {object} response a JSON object with properties: success and errorMsg.
 */
ajs.think.mainMenu.deleteThoughtCallBack = function(response) {
  if (response.success) {
    ajs.think.mainMenu.showMainMenu();
  } else {
    alert(response.errorMsg);
  }
}

/**
 * Loads the select Thought options from the "thoughtList" select element.
 */
ajs.think.mainMenu.openSelectedThought = function() {
  ajs.think.mainMenu.hideAll();
  ajs.think.thought.ajax.openThoughtUsingId(document.getElementById(ajs.think.mainMenu.ids.thoughtList).value);
}

/**
 * Deletes the select Thought options from the "thoughtList" select element.
 */
ajs.think.mainMenu.deleteSelectedThought = function() {
  if (confirm("Are you sure you want to delete this thought?")) {
    ajs.deleteThoughtUsingId(document.getElementById(ajs.think.mainMenu.ids.thoughtList).value);
  }
}

/**
 * Retrieves and shows the MOTD message.
 */
ajs.think.mainMenu.showMotdDialog = function() {
  var title = 'Welcome to Think';
  var motd = '';
  var width = 700;
  // No motd.
  //ajs.ui.dialog.showDialogMessage(title, motd, width);
}

ajs.think.mainMenu.newUserCookie = 'newUser';

/**
 * Initialises the New User Dialog.
 */
ajs.think.mainMenu.initialiseNewUserDialog = function() {
  $('button').button();
  var width = 600;
  var onclose = function(event) {
    ajs.utils.setCookie(ajs.think.mainMenu.newUserCookie, false, ajs.constants.daysInAYear);
    // Unbind this function, otherwise it will cause a bug when the editNode dialog is used more than once.
    $("#" + ajs.think.mainMenu.ids.newUserDialog).unbind('dialogclose', onclose);
  };
  $('#' + ajs.think.mainMenu.ids.newUserDialog).dialog({
	  modal: true,
    autoOpen: false,
		buttons: {
			Ok: function() {
				$(this).dialog('close');
			}
		}, 
    width: width
	});
  $("#" + ajs.think.mainMenu.ids.newUserDialog).bind('dialogclose', onclose);
}

//TODO: move this into uri.js
ajs.think.mainMenu.newUserDialogUri = '/page/newuser-dialog.html';

/**
 * Dynamically loads the new user Dialog.
 * 
 * @param {function} callback a callback invoked when the dialog is loaded.
 */
ajs.think.mainMenu.loadNewUserDialog = function(callback) {
  ajs.dom.loadUriIfElementNonExistant(ajs.think.mainMenu.newUserDialogUri, ajs.think.mainMenu.ids.newUserDialog, callback);
}

/**
 * Shows the New User Dialog.
 */
ajs.think.mainMenu.showNewUserDialog = function() {
  $('#' + ajs.think.mainMenu.ids.newUserDialog).dialog('open');
}

/**
 * Checks if the user is new.
 */
ajs.think.mainMenu.checkNewUser = function() {
  if (ajs.utils.getCookie(ajs.think.mainMenu.newUserCookie) != String(false)) {
    ajs.think.mainMenu.loadNewUserDialog(function() { ajs.think.mainMenu.showNewUserDialog(); });
    
  }
}



