const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const UserWorkshop = use('Workshops/Models/UserWorkshop');

class UserWorkshopsController {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('userWorkshops');

    table.setName(__('Workshops.userWorkshops.list'));

    if (auth.user.managerCan('userWorkshops_create')) {
      table.setButtons([
        [`<a href="${Route.url('Workshops.userWorkshops.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Workshops.userWorkshops.user_id'), width: '' },
      { title: __('Workshops.userWorkshops.workshop_id'), width: '' },
      { title: __('Workshops.userWorkshops.created_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Workshops.userWorkshops.userWorkshops'), url: Route.url('Workshops.userWorkshops.index') },
    ]);

    return view.render('Workshops.userWorkshops.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('user_workshops.id',
        'users.username',
        'workshops.name',
        'user_workshops.created_at')
      .from('user_workshops')
      .innerJoin('users', 'user_workshops.user_id', 'users.id')
      .innerJoin('workshops', 'user_workshops.workshop_id', 'workshops.id');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await UserWorkshop.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Workshops.userWorkshops.edit') : __('Workshops.userWorkshops.create'),
        content: View.render('Workshops.userWorkshops.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.all();

    let userWorkshop = {};

    if (!input.id) {
      userWorkshop = new UserWorkshop();
    } else {
      userWorkshop = await UserWorkshop.find(input.id);
      if (!userWorkshop) {
        return response.json(Notify.error('UserWorkshop not found', {}));
      }
    }

    userWorkshop.merge(input);

    if (!await userWorkshop.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const userWorkshop = await UserWorkshop.find(id);

    if (!userWorkshop) {
      return response.json(Notify.error('Something went wrong. userWorkshop not found', {}));
    }

    if (await userWorkshop.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = UserWorkshopsController;
