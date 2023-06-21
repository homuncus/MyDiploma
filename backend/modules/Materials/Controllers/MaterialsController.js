const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const Material = use('Materials/Models/Material');

class MaterialsController {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('materials');

    table.setName(__('Materials.materials.list'));

    if (auth.user.managerCan('materials_create')) {
      table.setButtons([
        [`<a href="${Route.url('Materials.materials.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Materials.materials.workshop_id'), width: '' },
      { title: __('Materials.materials.name'), width: '' },
      { title: __('Materials.materials.quantity'), width: '' },
      { title: __('Materials.materials.created_at'), width: '10%' },
      { title: __('Materials.materials.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Materials.materials.materials'), url: Route.url('Materials.materials.index') },
    ]);

    return view.render('Materials.materials.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('materials.id',
        'workshops.name as workshop_name',
        'materials.name',
        'materials.quantity',
        'materials.created_at',
        'materials.updated_at')
      .from('materials')
      .join('workshops', 'workshops.id', 'materials.workshop_id');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await Material.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Materials.materials.edit') : __('Materials.materials.create'),
        content: View.render('Materials.materials.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ params, request, response }) {
    const input = { ...request.all(), ...params };

    let material = {};

    if (!input.id) {
      material = new Material();
    } else {
      material = await Material.find(input.id);
      if (!material) {
        return response.notFound(Notify.error('Material not found', {}));
      }
    }

    material.merge(input);

    if (!await material.save()) {
      return response.status(500).json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async show({ response, params }) {
    const { id } = params;
    const material = await Material.query()
      .with('workshop')
      .where('id', id)
      .first();

    if (!material) {
      return response.notFound().json(Notify.error('Material not found', {}));
    }

    return response.json(material.toJSON());
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const material = await Material.find(id);

    if (!material) {
      return response.notFound().json(Notify.error('Something went wrong. material not found', {}));
    }

    if (await material.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = MaterialsController;
