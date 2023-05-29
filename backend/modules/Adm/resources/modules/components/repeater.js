/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,CKEDITOR, window */
const ADM = require('../../../../Adm/resources/assets/adm/adm');

const $repeaterTemplate = $(`
<div class="col-l g-12 col-m d-12">
  <div class="repeater-header">
    <div class="col-md-10 repeater-head"></div>
    <div class="col-md-2"></div>
  </div>
  <br />
  <div class="repeater-template hidden"></div>

  <div data-repeater-list="" class="repeater-list draggable-zone"></div>

  <a href="javascript:;" data-repeater-create="" class="btn btn-bold btn-sm btn-label-brand no-ajax repeater-add">
      <i class="la la-plus"></i> Add
  </a>
</div>
`);

const $repeaterItem = $(`
<div data-repeater-item class="repeater-item form-group row draggable">
  <div class="col-md-1"><i class="draggable-handle ki ki-menu"></i></div>
  <div class="col-md-9 repeater-row"></div>
  <div class="col-md-2">
    <a href="javascript:;" data-repeater-delete="" class="btn btn-label-danger btn-bold repeater-delete">
      <i class="la la-trash-o"></i>
      Delete
    </a>
  </div>
</div>
`);

ADM.ui.set('repeater', {
  init: (context) => {
    $('.repeater').each(function () {
      if ($(this).hasClass('mounted')) return;
      $(this).addClass('mounted');

      const repeater = $(this);
      const $template = $repeaterTemplate.clone();

      const $rowTemplate = $repeaterItem.clone();
      $('.repeater-row', $rowTemplate).append($('.repeater-template', this).clone());
      $('.repeater-template', this).remove();

      $('.repeater-row', this).each(function () {
        const $item = $repeaterItem.clone();
        $('.repeater-row', $item).append($(this).children());
        $('.repeater-list', $template).append($item);
      });

      //const $rowTemplate = $('.repeater-template', this).clone();

      if (!$('.repeater-row', this).length) {
        $('.repeater-list', $template).append($rowTemplate.clone());
      }

      $('.repeater-head', $template).append($('.repeater-header', this).clone());


      $('.repeater-add', $template).on('click', function (e) {
        e.preventDefault();
        const $newRow = $rowTemplate.clone();
        //ADM.ui.init($newRow);
        $newRow.fadeTo(0, 0.001);
        $newRow.slideUp(0);
        $('.repeater-list', $template).append($newRow);
        $newRow.slideDown(300, function () {
          $newRow.fadeTo(300, 1);
        });
      });

      $($template).on('click', '.repeater-delete', function (e) {
        e.preventDefault();
        const anomationElement = $(this).closest('.repeater-item');
        anomationElement.fadeTo(300, 0.001, function () {
          anomationElement.slideUp(300, function () {
            anomationElement.remove();
          });
        });
      });

      $(this).empty().append($template);

      // const swappable = new Sortable.default($('.draggable-zone', this).get()[0], {
      //   draggable: '.draggable',
      //   handle: '.draggable .draggable-handle',
      //   mirror: {
      //     appendTo: 'body',
      //     constrainDimensions: true
      //   }
      // });
    });
  }
});
