/**
 * @fileoverview A collection of functions and constants relating to the OpenID user login.
 * @requires jQuery.
 */


goog.provide('openiduser');
goog.provide('openiduser.ids');
goog.provide('openiduser.openIdProviderUrls');
goog.provide('openiduser.classes');
goog.provide('openiduser.metaData');


openiduser.ids.openIdUrlTextField = "openid_url";
openiduser.ids.openIdUsernameSignIn = "openIdUsernameSignIn";
openiduser.ids.openIdUsernameProvider = "openIdUsernameProvider";
openiduser.ids.openIdUsername = "openIdUsername";
openiduser.ids.loginForm = "loginForm";

openiduser.openIdProviderUrls = {
  myOpenId: 'http://{username}.myopenid.com/',
  google: 'https://www.google.com/accounts/o8/id',
  yahoo: 'http://yahoo.com/'
};

openiduser.classes.openIdProviderButton = "openIdProviderButton";

openiduser.metaData.openIdProviderButtonHeight = 50;

/**
 * Setup the OpenID Provider login.
 * 
 * @param {openiduser.openIdProviderUrls} openIdProviderUrl the url of the OpenID provider.
 */
openiduser.setupOpenIdProviderLogin = function(openIdProviderUrl) {  
  openiduser.hideOpenIdUsernameSignIn();
  
  switch (openIdProviderUrl) {
    case openiduser.openIdProviderUrls.myOpenId:
      openiduser.showOpenIdUsernameSignIn(openIdProviderUrl);
      return false;
    case openiduser.openIdProviderUrls.google:
      openiduser.loginOpenId(openIdProviderUrl);
      return true;
    case openiduser.openIdProviderUrls.yahoo:
      openiduser.loginOpenId(openIdProviderUrl);
      return true;
    default:
      throw 'Unknown ajs.openIdProviders';
  }
}

/** 
 * Hide the OpenID username sign-in div.
 */
openiduser.hideOpenIdUsernameSignIn = function() {
  $("#" + openiduser.ids.openIdUsernameSignIn).hide();
}

/** 
 * Show the OpenID username sign-in div.
 * 
 * @param {openiduser.openIdProviderUrls} openIdProviderUrl the url of the OpenID provider.
 */
openiduser.showOpenIdUsernameSignIn = function(openIdProviderUrl) {
  $("#" + openiduser.ids.openIdUsernameSignIn).show();
  $("#" + openiduser.ids.openIdUsernameProvider).val(openIdProviderUrl);
}

/**
 * Log into the OpenID provider account.
 * 
 * @param {String} openIdProviderUrl the url of the OpenID provder account.
 */
openiduser.loginOpenId = function(openIdProviderUrl) {
  $("#" + openiduser.ids.openIdUrlTextField).val(openIdProviderUrl);
  $("#" + openiduser.ids.loginForm).submit();
}

/**
 * Sign into the OpenID provider account using the supplied username.
 */
openiduser.openIdUsernameSignIn = function() {
  var username = $("#" + openiduser.ids.openIdUsername).val();
  if (ajs.utils.isEmptyOrNull(username)) {
    alert('Enter a username.');
    return null;
  }
  var openidUrl = $("#" + openiduser.ids.openIdUsernameProvider).val();
  openiduser.loginOpenId(openidUrl.replace(openiduser.userNameTemplateIdentifier, username));
}

/**
 * Resize the OpenID Provider buttons.
 */
openiduser.resizeOpenIdProviderButtons = function() {
  $("." + openiduser.classes.openIdProviderButton).height(openiduser.metaData.openIdProviderButtonHeight);
}