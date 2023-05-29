/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,CKEDITOR, window */

const ADM = require('../../../../Adm/resources/assets/adm/adm');

ADM.ui.set('tag', {
  init: (context) => {
    const tags = $('.tag', context);

    if (!tags.length) return;

    tags.each(function () {
      new Tagify($(this).get()[0], {
        originalInputValueFormat: valuesArr => valuesArr.map(({value}) => value)
      });
    });
  }
});
