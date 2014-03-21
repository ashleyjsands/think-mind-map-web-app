/**
 * @fileoverview Functions that customise the use of JQuery.
 * @requires JQuery.
 */


goog.provide('ajs.think.ui.tabs');
goog.provide('ajs.think.ui.tabs.ids');


/**
 * The Tabs and their indexes.
 * 
 * @enum {number}
 */
ajs.think.ui.tabs.names = {
  thoughts : 0,
  login : 1, 
  register : 2, 
  logout : 3,
  about : 4
};

ajs.think.ui.tabs.ids.mainMenuTabs = 'mainMenuTabs';

/**
 * Initialises all the tabs.
 */
ajs.think.ui.tabs.initialiseTabs = function() {
  for (var id in ajs.think.ui.tabs.ids) {
    $('#' + ajs.think.ui.tabs.ids[id]).tabs();
  }
}

/**
 * Disables a group of tabs based on the given indexes.
 * 
 * @param {Array(ajs.tab.names)} disableTabs an array of indexes of tabs to disable.
 * @param {string} tabsId the id of the tabs.
 */
ajs.think.ui.tabs.disableTabs = function(tabsId, disableTabs) {
  $('#' + tabsId).tabs('option', 'disabled', disableTabs);
}

/**
 * Enables a group of tabs based on the given indexes.
 * 
 * @param {Array(ajs.tab.names)} enableTabs an array of indexes of tabs to enable.
 * @param {string} tabsId the id of the tabs.
 */
ajs.think.ui.tabs.enableTabs = function(tabsId, enableTabs) {
  $('#' + tabsId).tabs('option', 'enabled', enableTabs);
}

/**
 * Shows a tab.
 *
 * @param {ajs.tab.names} tab the tab identifier.
 * @param {string} tabsId the id of the tabs.
 */
ajs.think.ui.tabs.showTab = function(tabsId, tab) {
  $('#' + tabsId).tabs('select', tab);
}
