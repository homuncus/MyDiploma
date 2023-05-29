/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,CKEDITOR, window */

const ADM = require('../../../../Adm/resources/assets/adm/adm');

ADM.ui.set('datetimepicker', {
  init: (context) => {
    $('.datetimepicker', context).datetimepicker({
      format: 'yyyy-mm-dd hh:ii',
      todayHighlight: true,
      bootcssVer: 3,
      autoclose: true,
    });
  }
});

ADM.ui.set('datepicker', {
  init: (context) => {
    $('.datepicker', context).datepicker({
      format: 'mm/dd/yyyy',
      clearBtn: true,
      autoclose: true,
      todayBtn: "linked",
    });
  }
});

ADM.ui.set('daterangepicker', {
  init: (context) => {
    var start = moment().subtract(29, 'days');
    var end = moment();

    $('.kt_daterangepicker', context).daterangepicker({
      buttonClasses: 'btn',
      applyClass: 'btn-primary',
      cancelClass: 'btn-secondary',
      showDropdowns: true,

      startDate: start,
      endDate: end,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    },
      function (start, end, label) {
        $('.kt_daterangepicker .form-control', context).val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        $('.kt_daterangepicker .form-control', context).trigger("change");
      });
  }
});
