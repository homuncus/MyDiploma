/* global $, window, ADM */

/*
    AJAX default settings
*/
const notification = require('./Notification');

$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
  },
  statusCode: {
    401: (response) => {
      const { responseJSON } = response;
      const { path } = responseJSON || {};

      window.location.href = path;
    },
    403: () => {
      notification.error({
        message: 'You are not have permissions for this action.',
      });
    },
    404: () => {
      notification.error({
        message: 'Page not found.',
      });
    },
  },
  error: () => {
    notification.error({
      message: 'Something was wrong.',
    });
  },
});

const Ajax = (params) => {
  let _success = params.success;
  delete params.success;

  $('.loader').fadeIn(300);
  params = $.extend(true, {}, {
    type: 'post',
    dataType: 'json',
    cache: false,
    url: '',
    error: (request) => {
      $('.loader').stop(true, true).fadeOut(500);
      if (parseInt(request.status, 10) === 401) {
        window.location.href = `${ADM.managerPath}/account/login`;
      } else {
        ADM.RequestParse(request);
        if (_success) {
          if (typeof _success === 'function') {
            _success(request);
          } else if (_success.indexOf('::')) {
            const _tmp = _success.split('::');
            _success = ADM.modules.get(_tmp[0])[_tmp[1]];
            _success(request, ADM.modules.get(_tmp[0]));
          }
        }
      }
    },
    success: (request, codeMessage, xhr) => {
      $('.loader').stop(true, true).fadeOut(500);
      ADM.RequestParse(request);
      if (_success) {
        if (typeof _success === 'function') {
          _success(request);
        } else if (_success.indexOf('::')) {
          const _tmp = _success.split('::');
          _success = ADM.modules.get(_tmp[0])[_tmp[1]];
          _success(request, ADM.modules.get(_tmp[0]));
        }
      }
    },
  }, params);
  $.ajax(params);
};
module.exports = Ajax;
