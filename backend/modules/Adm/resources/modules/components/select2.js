/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,CKEDITOR, window */

const ADM = require('../../../../Adm/resources/assets/adm/adm');

ADM.ui.set('kt-select2', {
  init: (context) => {
    $('.kt-select2', context).each(function () {
      $(this).select2({
        // placeholder: "Select a state",
      });
    });

    $('.kt-select2-tags', context).each(function () {
      $(this).select2({
        // placeholder: "Select a state",
        tags: true
      });
    });
  }
});
