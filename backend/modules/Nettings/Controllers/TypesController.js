const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const Type = use('Nettings/Models/Type');

class TypesController {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('types');

    table.setName(__('Nettings.types.list'));

    if (auth.user.managerCan('types_create')) {
      table.setButtons([
        [`<a href="${Route.url('Nettings.types.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Nettings.types.name'), width: '' },
      { title: __('Nettings.types.created_at'), width: '10%' },
      { title: __('Nettings.types.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Nettings.types.types'), url: Route.url('Nettings.types.index') },
    ]);

    return view.render('Nettings.types.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('netting_types.id', 'netting_types.name', 'netting_types.created_at', 'netting_types.updated_at')
      .from('netting_types');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async listAll({ response }) {
    const types = await Type.all();

    return response.json(types.toJSON());
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await Type.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Nettings.types.edit') : __('Nettings.types.create'),
        content: View.render('Nettings.types.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ params, request, response }) {
    const input = { ...request.all(), ...params };

    let type = {};

    if (!input.id) {
      type = new Type();
    } else {
      type = await Type.find(input.id);
      if (!type) {
        return response.notFound(Notify.error('Netting type not found', {}));
      }
    }

    type.merge(input);

    if (!await type.save()) {
      return response.status(500).json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async show({ response, params }) {
    const { slug } = params;
    const type = await Type.findBy('slug', slug);

    if (!type) {
      return response.notFound(Notify.error('Netting type not found', {}));
    }

    return response.json(type.toJSON());
  }

  async nettings({ response, params }) {
    const { id } = params;
    const type = await Type.find(id);

    if (!type) {
      return response.notFound(Notify.error('Netting type not found', {}));
    }

    const nettings = await type.nettings().fetch();
    return response.json(nettings.toJSON());
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const type = await Type.find(id);

    if (!type) {
      return response.notFound(Notify.error('Something went wrong. type not found', {}));
    }

    if (await type.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = TypesController;
