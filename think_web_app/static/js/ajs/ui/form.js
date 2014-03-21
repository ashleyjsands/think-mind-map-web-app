/**
 * @fileoverview Functions that customise the use of JQuery.
 * @requires JQuery.
 */


goog.provide('ajs.ui.form');


/**
 * Clears all the text input values from a form.
 *
 * @param {string} formId the id of the form.
 */
ajs.clearFormInputs = function(formId) {
  var $inputs = $('#' + formId + ' :input');
  for (var i=0; i < $inputs.length; i++) {
    if ($inputs[i].type == 'text') {
      $inputs[i].value = '';
    }
  }
}
