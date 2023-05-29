/* global localisation */
/* eslint-disable no-underscore-dangle */

const get = function (obj, path, defaultValue) {
  const result = String.prototype.split.call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce((res, key) => ((res !== null && res !== undefined) ? res[key] : res), obj);
  return (result === undefined || result === obj) ? defaultValue : result;
};

function __(message) {
  const value = get(localisation, message);
  return value === undefined ? message : value;
}

if ($.fn.dataTable && $.fn.dataTable.defaults) {
  $.extend(true, $.fn.dataTable.defaults, {
    language: {
      info: __('Adm.admin.datatables_info'),
      search: __('Adm.admin.datatables_search'),
      sLengthMenu: __('Adm.admin.datatables_show'),
    },
  });
}
