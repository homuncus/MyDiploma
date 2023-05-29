/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,CKEDITOR, window */
const ADM = require('../../../../Adm/resources/assets/adm/adm');

ADM.ui.set('filemanager', {
  init: (context) => {
    Filemanager.init(context);
  }
});

const Filemanager = {
  init: (context) => {
    $('.filemanager', context).each(function () {
      $(this).on('change', () => {
        const val = $(this).val();
        $(this).closest('.filemanagerwrap').find('.kt-media').remove();
        if(val) {
          //@todo: check if the image
          const image = ['jpg', 'jpeg', 'webp', 'png', 'gif'].includes(val.split('.').pop());
          if (image) {
            $(this).closest('.filemanagerwrap').find('.preview').append(`
              <span class="kt-media kt-media--xl kt-margin-r-5 kt-margin-t-5">
                <img src="${$(this).val()}" alt="image" style="max-height: 100px">
              </span>
            `)
          }
        } 
      });

      if ($(this).hasClass('mounted')) return;

      const el = $(this).clone();
      el.addClass('mounted');
//@todo: check if the image
      const image = ['jpg', 'jpeg', 'webp', 'png', 'gif'].includes($(this).val().split('.').pop());
      const wrap = $(`
        <div class="row filemanagerwrap">
          <div class="input-group"> 
            <div class="input-group-prepend">
                <button class="btn btn-primary filemanager-open" type="button">${__('Adm.admin.select')}</button>
            </div>
            <input type="text" name="image" class="form-control" placeholder="">
            <br />

          </div>
          ${image 
            ? `<div class="col-lg-9 col-xl-9">
            <div class="row preview pt-2">
              <span class="kt-media kt-media--xl kt-margin-r-5 kt-margin-t-5">
                <img src="${$(this).val()}" alt="image" style="max-height: 100px">
              </span>
            </div>
          </div>`
            : ''
          } 
        </div>
      `);

      wrap.find('input').replaceWith(el);

      el.on('change', () => {
        preview();
      });

      const preview = () => {
        wrap.find('img').attr('src', el.val());
        if (!!el.val()) {
          wrap.find('img').show();
        } else {
          wrap.find('img').hide();
        }
      };

      preview();
      $(this).replaceWith(wrap);
    });
  }
};



$(document).on('click', '.filemanager-open', function () {
  const that = this;

  // const dialog = BootstrapDialog.show({
  //   message: $('<iframe width="100%" height="100%" src="/admin/filemanager/index.html"></iframe>')
  // });
  var dialog = window.open("/admin/filemanager/index.html", 'targetWindow',
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800, height=800');
  function handlePostMessage(e) {
    var data = e.originalEvent.data;
    if (data.source === 'richfilemanager') {
      const url = `/assets${data.resourceObject.attributes.path}`;

      $(that).closest('.filemanagerwrap').find('input').val(url).trigger('change');

      $(that).closest('.filemanagerwrap').find('.kt-media').remove();
      $(that).closest('.filemanagerwrap').find('.preview').append(`<span class="kt-media kt-media--xl kt-margin-r-5 kt-margin-t-5">
        <img src="${url}" alt="image" style="max-height: 100px">
    </span>`)
      dialog.close();
      $(window).off('message', handlePostMessage);
    }
  }

  $(window).on('message', handlePostMessage);
});
