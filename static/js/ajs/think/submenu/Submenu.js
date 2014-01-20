/**
 * @fileoverview The Submenu class and related enums.
 */


goog.provide('ajs.think.submenu');


/** 
 * The Save Submenu States.
 *
 * @enum {String}
 */
ajs.think.submenu.saveStates = {
  Saving: "Saving",
  SuccessfulSaveMessage: "SuccessfulSaveMessage",
  FailureSaveErrorMessage: "FailureSaveErrorMessage",
  TimeOutMessage: "TimeOutMessage"
};

/** 
 * The Save Submenu texts.
 *
 * @enum {String}
 */
ajs.think.submenu.saveTexts = {
  Saving: "Saving thought ...",
  SuccessfulSaveMessage: "Thought saved",
  FailureSaveErrorMessage: "Thought save failed!",
  TimeOutMessage: "Though failed to save because it timed out!"
};
