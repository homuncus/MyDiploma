const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const Workshop = use('Workshops/Models/Workshop');

class WorkshopsController {
  async index({ view, auth, __ }) {

    const table = new TableBuilder('workshops');

    table.setName(__('Workshops.workshops.list'));

    if (auth.user.managerCan('workshops_create')) {
      table.setButtons([
        [`<a href="${Route.url('Workshops.workshops.edit')}" class="pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Workshops.workshops.name'), width: '' },
      { title: __('Workshops.workshops.address'), width: '' },
      { title: __('Workshops.workshops.confirmed'), width: '' },
      { title: __('Workshops.workshops.created_at'), width: '10%' },
      { title: __('Workshops.workshops.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Workshops.workshops.workshops'), url: Route.url('Workshops.workshops.index') },
    ]);

    return view.render('Workshops.workshops.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database
      .select('workshops.id', 'workshops.name', 'workshops.address', 'workshops.confirmed', 'workshops.created_at', 'workshops.updated_at')
      .from('workshops');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __ }) {
    const { id } = params;
    const data = await Workshop.find(id);

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    return response.json({
      modal: {
        title: id ? __('Workshops.workshops.edit') : __('Workshops.workshops.create'),
        content: View.render('Workshops.workshops.form', { data }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.all();

    let workshop = {};

    if (!input.id) {
      workshop = new Workshop();
    } else {
      workshop = await Workshop.find(input.id);
      if (!workshop) {
        return response.json(Notify.error('Workshop not found', {}));
      }
    }

    workshop.merge(input);

    if (!await workshop.save()) {
      return response.json(Notify.error('Not updated', {}));
    }

    return response.json(Notify.success('Saved', {}));
  }

  async show({ params, response }) {
    const { id } = params;
    const workshop = await Workshop.query()
      .with('users')
      .with('productions')
      .where('id', id)
      .fetch();

    if (!workshop) {
      return response.notFound().json(Notify.error('Workshop not found', {}));
    }

    return response.json(workshop.toJSON());
  }

  async productions({ params, response }) {
    const { id } = params;
    const workshop = await Workshop.find(id);

    if (!workshop) {
      return response.notFound().json(Notify.error('Workshop not found', {}));
    }

    const productions = await workshop.productions().fetch();
    return response.json(productions.toJSON());
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const workshop = await Workshop.find(id);

    if (!workshop) {
      return response.notFound().json(Notify.error('Something went wrong. workshop not found', {}));
    }

    if (await workshop.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = WorkshopsController;
