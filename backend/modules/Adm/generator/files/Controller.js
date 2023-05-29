const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const __US_NAME__ = use('__MODULE__/Models/__US_NAME__');

class __UP_NAME__Controller {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('__LP_NAME__');

    table.setName(__('__MODULE__.__LP_NAME__.list'));

    if (auth.user.managerCan('__LP_NAME___create')) {
      table.setButtons([
        [`<a href="${Route.url('__MODULE__.__LP_NAME__.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('__MODULE__.__LP_NAME__.__LP_NAME__'), url: Route.url('__MODULE__.__LP_NAME__.index') },
    ]);

    return view.render('__MODULE__.__LP_NAME__.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('__TABLE__.id', __FIELDS__)
      .from('__TABLE__');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await __US_NAME__.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('__MODULE__.__LP_NAME__.edit') : __('__MODULE__.__LP_NAME__.create'),
        content: View.render('__MODULE__.__LP_NAME__.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.all();

    let __LS_NAME__ = {};

    if (!input.id) {
      __LS_NAME__ = new __US_NAME__();
    } else {
      __LS_NAME__ = await __US_NAME__.find(input.id);
      if (!__LS_NAME__) {
        return response.json(Notify.error('__US_NAME__ not found', {}));
      }
    }

    __LS_NAME__.merge(input);

      if (!await __LS_NAME__.save()) {
        return response.json(Notify.error('Not updated', {}));
      }

    return response.json(Notify.success('Saved', {}));
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const __LS_NAME__ = await __US_NAME__.find(id);

    if (!__LS_NAME__) {
      return response.json(Notify.error('Something went wrong. __LS_NAME__ not found', {}));
    }

    if (await __LS_NAME__.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = __UP_NAME__Controller;
