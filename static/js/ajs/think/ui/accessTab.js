/**
 * @fileoverview A collection of functions relating to the Access tab.
 */


goog.provide('ajs.think.ui.accessTab');
goog.provide('ajs.think.ui.accessTab.ids');

goog.require('ajs.think.ui.thoughtOptions');
goog.require('ajs.think.globals');
goog.require('ajs.think.uri');


ajs.think.ui.accessTab.publizeThoughtButtonContent = 'Publicize Thought';
ajs.think.ui.accessTab.privatizeThoughtButtonContent = 'Privatize Thought';

ajs.think.ui.accessTab.ids.thoughtOptionsPublicStatus = 'thoughtOptionsPublicStatus';
ajs.think.ui.accessTab.ids.publicizeThoughtButton = 'publicizeThoughtButton';

/**
 * Publicizes or privatizes the Thought.
 */
ajs.think.ui.accessTab.publicizeThoughtButtonClick = function() {
  if (ajs.think.globals.thought.isPublic) {
    ajs.ajax.deleteRequest(ajs.think.uri._public, {'id': ajs.think.globals.thought.id}, ajs.think.ui.accessTab.publicizeThoughtCallBack);
  } else {
    ajs.ajax.postRequest(ajs.think.uri._public, {'id': ajs.think.globals.thought.id}, ajs.think.ui.accessTab.publicizeThoughtCallBack);
  }
}

/**
 * The callback function for publicizes or privatizes the Thought.
 */
ajs.think.ui.accessTab.publicizeThoughtCallBack = function(response) {
  if (response.success) {
    ajs.think.globals.thought.isPublic = !ajs.think.globals.thought.isPublic;
    ajs.think.ui.accessTab.setupThoughtOptionsPublicElements();
  } else {
    alert(response.errorMsg);
  }
}


/**
 * Setup the public elements in the Thought Options Dialog.
 */
ajs.think.ui.accessTab.setupThoughtOptionsPublicElements = function() {
  $('button').button();
  var publicStatus = document.getElementById(ajs.think.ui.accessTab.ids.thoughtOptionsPublicStatus);
  var publicButton = document.getElementById(ajs.think.ui.accessTab.ids.publicizeThoughtButton);

  if (ajs.think.globals.thought.isPublic) {
    var uri = "http://" + document.location.host;
    publicStatus.innerHTML = "This thought is public. Anyone can acess this thought at: " + uri + "/#thought/" + ajs.think.globals.thought.id;
    publicButton.innerHTML = ajs.think.ui.accessTab.privatizeThoughtButtonContent;
  } else {
    publicStatus.innerHTML = "This thought is private.";
    publicButton.innerHTML = ajs.think.ui.accessTab.publizeThoughtButtonContent;
  }
}

/**
 * Initialises the Access tab of the Thought Options.
 */
ajs.think.ui.accessTab.initialiseAccessTab = function() {
  ajs.think.ui.accessTab.setupThoughtOptionsPublicElements();
  ajs.think.ui.thoughtOptions.checkThatDialogIsInitialised();
}