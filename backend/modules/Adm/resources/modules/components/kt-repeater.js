/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,CKEDITOR, window */
const ADM = require('../../../../Adm/resources/assets/adm/adm');


ADM.ui.set('kt-repeater', {
  init: (context) => {
    $('.kt-repeater').each(function () {
      const self = this;
      new Sortable($('.draggable-zone', this).get()[0], {
        draggable: '.draggable',
        handle: '.draggable .draggable-handle',
        mirror: {
          appendTo: 'body',
          constrainDimensions: true
        }
      });
      $(this).repeater({
        show: function () {
          $(this).find('.preview')
            .find('img')
            .remove()
          $(this).slideDown();
          ADM.ui.components['image-input'].init($(this))
          ADM.ui.components.ckeditor.init($(this))
        },
        hide: function (deleteElement) {
          $(this).slideUp(deleteElement);
        },
        ready: function (setIndexes) {
          $(".draggable-zone", self).on("update", function (event, ui) {
            setIndexes();
          });
        },
        repeaters: [{
          selector: '.inner-repeater',
          show: function () {
            $(this).find('.preview')
              .find('img')
              .remove()
            $(this).slideDown();
            ADM.ui.components.ckeditor.init($(this))
          },
          hide: function (deleteElement) {
            $(this).slideUp(deleteElement);
          },
          ready: function (setIndexes) {
            $(".draggable-zone", self).on("update", function (event, ui) {
              setIndexes();
            });
          },
        }]
      })
    })
  }
});
