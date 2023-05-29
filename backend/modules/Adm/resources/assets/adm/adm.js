/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* global window, location */
import { unmountComponentAtNode } from 'react-dom';

const notification = require('./Notification');
const template = require('./Template');
const modules = require('./Modules');
const modal = require('./Modal');
const ajax = require('./Ajax');
const UI = require('./ui');

const ADM = {
  noHistoryClass: 'no-history',
  noAjaxClass: 'no-ajax',
  setting: {
    lang: document.documentElement.lang,
  },
  notification,
  template,
  ajax,
  modules,
  modal,
  ui: UI,
  adminPath: (path) => `${window.location.origin}/${ADM.adminPathPrefix || 'admin'}/${path}`,
  path: (path) => `${window.location.origin}/${ADM.adminPathPrefix || 'admin'}/${path}`,

  // @TODO: Deprecated
  showViewport: (viewName) => {
    ADM.template.load(viewName, (response) => {
      const obj = $.extend({}, ADM.setting, response);
      unmountComponentAtNode($('#viewport')[0]);
      $('#viewport').html(ADM.template.parse(response, obj));
    });
  },
  setViewPort: (html, response) => {
    unmountComponentAtNode($('#viewport')[0]);
    $('#viewport').html(ADM.template.parse(response, ADM.setting));
  },

  RequestParse: (request) => {
    if (request.notification) ADM.notification.message(request.notification);
    if (request.responseText) {
      unmountComponentAtNode($('#viewport')[0]);
      $('#viewport').html(request.responseText);
      ADM.ui.init($('#viewport'));
    }
    if (request.modal) ADM.modal.show(request.modal);
    if (request.redirect) window.location = request.redirect;
    if (request.blank) window.open(request.blank);
    ADM.modules.init();
  },

  CKEditorsUpdate: () => {
    for (const instanceName in CKEDITOR.instances) {
      CKEDITOR.instances[instanceName].updateElement();
    }
  },

  init: () => {
    // ???
    if (['admin'].indexOf(location.pathname.replace(/^\/|\/$/g, '')) === -1) {
      ADM.ajax({
        url: location.href,
      });
    }

    $(window).on('popstate', (event) => {
      ADM.ajax({
        url: location.href,
        success: $(this).attr('data-callback'),
      });
    });

    window.onload = (e) => {
      const { hash } = location;
      if (hash === '' || hash === '#') return;

      // console.log(location)
      ADM.ajax({
        url: hash.substring(1),
      });
    };

    $(document).on('click', 'a', function (e) {
      const confirmData = $(this).attr('data-confirm');

      if (confirmData) {
        const isConfirmed = confirm(confirmData);
        if (!isConfirmed) return false;
      }

      const href = $(this).attr('href');

      if (!href || href === '#') {
        e.preventDefault();
        return;
      }

      if ($(this).data('toggle') === 'tab') return;
      if ($(this).hasClass('no-ajax')) return;
      if (href === '#') return;
      const voids = /^javascript*/g;
      if (voids.test(href)) return;
      if ($(this).attr('target')) return;
      if ($(this).closest('.cke_reset').length > 0) return;
      if ($(this).closest('.cke_reset_all').length > 0) return;

      e.preventDefault();

      if (CKEDITOR && (typeof CKEDITOR !== 'undefined')) {
        for (const instance in CKEDITOR.instances) {
          CKEDITOR.instances[instance].updateElement();
        }
      }

      if (!$(this).hasClass('no-history') && href.indexOf('#') !== 0) {
        const last = href.split('/').pop();
        const ignore = ['edit', 'delete', 'logout'];
        if (ignore.indexOf(last) === -1) {
          history.pushState({}, $(this).attr('title'), href);
        }
      } else {
        // href = href.substring(1);
      }

      ADM.ajax({
        url: href,
        success: $(this).attr('data-callback'),
      });
    });

    $(document).on('submit', 'form', function () {
      const form = $(this);
      const action = form.attr('action');

      if (!action) return;
      if (action === '#') return;
      if ($(this).hasClass('no-ajax')) return;

      if (CKEDITOR && (typeof CKEDITOR !== 'undefined')) {
        for (const instance in CKEDITOR.instances) {
          CKEDITOR.instances[instance].updateElement();
        }
      }
      ADM.ajax({
        url: action,
        data: new FormData(this),
        processData: false,
        contentType: false,
        success: $(this).attr('data-callback'),
      });
      return false;
    });
  },
};

// ADM.ui.set('component_name', {
//   init: function(context) {
//     $(".styled, .multiselect-container input", context).uniform({
//       radioClass: 'choice'
//     });

//     // File input
//     $(".file-styled", context).uniform({
//       wrapperClass: 'bg-blue',
//       fileButtonHtml: '<i class="icon-file-plus"></i>'
//     });
//   }
// });

// ADM.ui.set('ckeditor', {
//   init: (context) => {
//     const editors = $(context).find('[data-ui="ckeditor"]');
//     if (editors.length > 0) {
//       $.each(editors, (index, editor) => {
//         CKEDITOR.replace($(editor).attr('name'), {
//           filebrowserBrowseUrl: '/fs/dialog.php?type=2&editor=ckeditor&fldr=',
//           filebrowserUploadUrl: '/fs/dialog.php?type=2&editor=ckeditor&fldr=',
//           filebrowserImageBrowseUrl: '/fs/dialog.php?type=1&editor=ckeditor&fldr='
//         });
//       });
//     }
//   }
// });

window.ADM = ADM;
console.info('ADM loaded');
console.info('it can be accessed from global ADM');

module.exports = ADM;