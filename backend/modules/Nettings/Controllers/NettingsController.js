const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const Netting = use('Nettings/Models/Netting');
const NettingType = use('Nettings/Models/Type');

class NettingsController {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('nettings');

    table.setName(__('Nettings.nettings.list'));

    if (auth.user.managerCan('nettings_create')) {
      table.setButtons([
        [`<a href="${Route.url('Nettings.nettings.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Nettings.nettings.type_id'), width: '' },
      { title: __('Nettings.nettings.size'), width: '' },
      { title: __('Nettings.nettings.color'), width: '' },
      { title: __('Nettings.nettings.created_at'), width: '10%' },
      { title: __('Nettings.nettings.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Nettings.nettings.nettings'), url: Route.url('Nettings.nettings.index') },
    ]);

    return view.render('Nettings.nettings.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('nettings.id',
        'netting_types.name AS type_name',
        'nettings.size',
        'nettings.color',
        'nettings.created_at',
        'nettings.updated_at')
      .from('nettings')
      .join('netting_types', 'netting_types.id', 'nettings.type_id');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await Netting.find(id);
    const nettingTypes = await NettingType.all();

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Nettings.nettings.edit') : __('Nettings.nettings.create'),
        content: View.render('Nettings.nettings.form', { data, types: nettingTypes.toJSON() }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.all();

    let netting = {};

    if (!input.id) {
      netting = new Netting();
    } else {
      netting = await Netting.find(input.id);
      if (!netting) {
        return response.notFound().json(Notify.error('Netting not found', {}));
      }
    }

    netting.merge(input);

    if (!await netting.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async show({ response, params }) {
    const { id } = params;
    const netting = await Netting.query()
      .with('type')
      .where('id', id)
      .fetch();

    if (!netting) {
      return response.notFound().json(Notify.error('Netting not found', {}));
    }

    return response.json(netting.toJSON());
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const netting = await Netting.find(id);

    if (!netting) {
      return response.notFound().json(Notify.error('Something went wrong. netting not found', {}));
    }

    if (await netting.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = NettingsController;
