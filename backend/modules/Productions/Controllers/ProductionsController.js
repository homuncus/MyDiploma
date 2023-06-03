const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const Production = use('Productions/Models/Production');
const User = use('Users/Models/User');
const Workshop = use('Workshops/Models/Workshop');
const Netting = use('Nettings/Models/Netting');
const Materials = use('Materials/Models/Material');

class ProductionsController {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('productions');

    table.setName(__('Productions.productions.list'));

    if (auth.user.managerCan('productions_create')) {
      table.setButtons([
        [`<a href="${Route.url('Productions.productions.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Productions.productions.workshop_id'), width: '' },
      { title: __('Productions.productions.netting_id'), width: '' },
      { title: __('Productions.productions.material_id'), width: '' },
      { title: __('Productions.productions.user_id'), width: '' },
      { title: __('Productions.productions.completed'), width: '5%' },
      { title: __('Productions.productions.created_at'), width: '10%' },
      { title: __('Productions.productions.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Productions.productions.productions'), url: Route.url('Productions.productions.index') },
    ]);

    return view.render('Productions.productions.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('productions.id',
        'workshops.name AS workshop_name',
        Database.raw('CONCAT("netting_types"."name", \' | \', "nettings"."color", \' | \', "nettings"."size") AS netting_name'),
        'materials.name as material_name',
        'users.username AS responsible_user_name',
        'productions.completed',
        'productions.created_at',
        'productions.updated_at')
      .from('productions')
      .join('workshops', 'workshops.id', 'productions.workshop_id')
      .join('nettings', 'nettings.id', 'productions.netting_id')
      .join('netting_types', 'nettings.type_id', 'netting_types.id')
      .join('materials', 'materials.id', 'productions.material_id')
      .join('users', 'users.id', 'productions.user_id');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await Production.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Productions.productions.edit') : __('Productions.productions.create'),
        content: View.render('Productions.productions.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.all();

    let production = {};

    if (!input.id) {
      production = new Production();
    } else {
      production = await Production.find(input.id);
      if (!production) {
        return response.json(Notify.error('Production not found', {}));
      }
    }

    production.merge(input);

    if (!await production.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async show({ params, response }) {
    const { id } = params;
    const production = await Production.query()
      .with('netting')
      .with('chief')
      .with('material')
      .with('workshop')
      .where('id', id)
      .first();

    if (!production) {
      return response.notFound().json(Notify.error('Production not found'));
    }

    return response.json(production.toJSON());
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const production = await Production.find(id);

    if (!production) {
      return response.json(Notify.error('Something went wrong. production not found', {}));
    }

    if (await production.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = ProductionsController;
