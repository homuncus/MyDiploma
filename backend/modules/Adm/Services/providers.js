const path = require('path');

module.exports = [
  path.join(__dirname, './View', 'Provider'),
  path.join(__dirname, './Localization', 'Provider'),
  path.join(__dirname, './Adm', 'Provider'),
  path.join(__dirname, './Menu', 'Provider'),
  path.join(__dirname, './Notify', 'Provider'),
  path.join(__dirname, './TableBuilder', 'Provider'),
  path.join(__dirname, './Datatables', 'Provider'),
  path.join(__dirname, './FileManager', 'Provider'),
];
