const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const Role = use('Users/Models/Role');

class RolesController {
  async index({ view, auth, __ }) {
    const table = new TableBuilder('roles');

    table.setName(__('Users.roles.list'));

    if (auth.user.managerCan('roles_create')) {
      table.setButtons([
        [`<a href="${Route.url('Users.roles.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Users.roles.name'), width: '' },
      { title: __('Users.roles.created_at'), width: '10%' },
      { title: __('Users.roles.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Users.roles.roles'), url: Route.url('Users.roles.index') },
    ]);

    return view.render('Users.roles.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('roles.id', 'roles.name', 'roles.created_at', 'roles.updated_at')
      .from('roles');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await Role.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Users.roles.edit') : __('Users.roles.create'),
        content: View.render('Users.roles.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.all();

    let role = {};

    if (!input.id) {
      role = new Role();
    } else {
      role = await Role.find(input.id);
      if (!role) {
        return response.json(Notify.error('Role not found', {}));
      }
    }

    role.merge(input);

    if (!await role.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const role = await Role.find(id);

    if (!role) {
      return response.json(Notify.error('Something went wrong. role not found', {}));
    }

    if (await role.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = RolesController;
