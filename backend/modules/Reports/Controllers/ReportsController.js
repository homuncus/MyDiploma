const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');
const moment = require('moment');

// const { validate } = use('Validator');

const Report = use('Reports/Models/Report');
const Message = use('Reports/Models/Message');

class ReportsController {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('reports');

    table.setName(__('Reports.reports.list'));

    if (auth.user.managerCan('reports_create')) {
      table.setButtons([
        [`<a href="${Route.url('Reports.reports.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Reports.reports.user_id'), width: '' },
      { title: __('Reports.reports.description'), width: '' },
      { title: __('Reports.reports.solved'), width: '' },
      { title: __('Reports.reports.created_at'), width: '' },
      { title: __('Reports.reports.updated_at'), width: '' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Reports.reports.reports'), url: Route.url('Reports.reports.index') },
    ]);

    return view.render('Reports.reports.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('message_reports.id',
        'users.username',
        'message_reports.description',
        'message_reports.solved',
        'message_reports.created_at',
        'message_reports.updated_at')
      .from('message_reports')
      .join('users', 'users.id', 'message_reports.user_id');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await Report.find(id);
    const message = await Database.select('messages.id',
      'messages.message',
      'users.username AS sender_username',
      'messages.created_at')
      .from('messages')
      .where('messages.id', data.message_id)
      .join('users', 'users.id', 'messages.sender_id');

    message.created_at = moment.utc(message.created_at).format('hh:mm');

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Reports.reports.edit') : __('Reports.reports.create'),
        content: View.render('Reports.reports.form', { data, message }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ params, request, response, auth }) {
    const input = request.all();
    const { messageId } = params;

    let report = {};

    if (!input.id) {
      report = new Report();
      const authUser = await auth.authenticator('jwt').getUser();
      report.message_id = messageId;
      report.user_id = authUser.id;
    } else {
      report = await Report.find(input.id);
      if (!report) {
        return response.json(Notify.error('Report not found', {}));
      }
    }

    report.merge(input);

    if (!await report.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const report = await Report.find(id);

    if (!report) {
      return response.json(Notify.error('Something went wrong. report not found', {}));
    }

    if (await report.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = ReportsController;
