'use strict'

const Model = use('Model');

class Report extends Model {
  static get table() {
    return 'message_reports';
  }
}

module.exports = Report;
