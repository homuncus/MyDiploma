/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,Bloodhound */

const ADM = require('../../../Adm/resources/assets/adm/adm');

const bloodhound = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: '%QUERY',
    url: '/admin/tags?q=%QUERY'
  }
});

bloodhound.initialize();

ADM.ui.set('tags', {
  init: (context) => {

    $('.tags', context).each(function (i, o) {
      if ($(this).hasClass('mounted')) return;
      $(this).addClass('mounted');

      $(this).tagsinput({
        tagClass: 'btn btn-sm btn-brand',
        typeaheadjs: [{
          hint: true,
          highlight: true,
          minLength: 3,
        }, {
          limit: 20,
          source: bloodhound,
          afterSelect: () => {
            $(this).tagsinput('input').val('');
          }
        }]
      });
    });
  }
});
