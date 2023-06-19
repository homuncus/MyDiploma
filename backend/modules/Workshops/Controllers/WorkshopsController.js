const View = use('View');
const Route = use('Route');
const Database = use('Database');

const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

// const { validate } = use('Validator');

const Workshop = use('Workshops/Models/Workshop');
const UserWorkshop = use('Workshops/Models/UserWorkshop');
const Productions = use('Productions/Models/Production');
const Materials = use('Materials/Models/Material');
const User = use('Users/Models/User')

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

  async scrollList({ request, response }) {
    const { offset, limit, search } = request.all();
    let result = Database
      .select('workshops.id',
        'workshops.name',
        'workshops.address',
        'workshops.slug',
        'workshops.description',
        Database.raw('COUNT("users"."id") AS users_count'),
        Database.raw('COUNT("nettings"."id") AS nettings_count'),
        Database.raw('CASE WHEN user_workshops.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_user_member'),
        'workshops.created_at',
        'workshops.updated_at')
      .from('workshops')
      .leftJoin('user_workshops', 'user_workshops.workshop_id', 'workshops.id')
      .leftJoin('users', 'user_workshops.user_id', 'users.id')
      .leftJoin('productions', 'productions.workshop_id', 'workshops.id')
      .leftJoin('nettings', 'nettings.id', 'productions.netting_id')
      .where('workshops.confirmed', true)
      .groupBy('workshops.id', 'user_workshops.user_id')
      .orderByRaw('is_user_member DESC, name DESC')
      .distinctOn('workshops.name', 'is_user_member')
      .offset(offset)
      .limit(limit);
    if (search) {
      result = result.andWhereRaw('LOWER(workshops.name) LIKE ?', `%${search.toLowerCase()}%`);
    }

    return response.json(await result);
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

  async save({ params, request, response, auth }) {
    const input = { ...request.all(), ...params };

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

  async saveWithMembership({ request, response, auth }) {
    const input = request.all();

    const workshop = await Workshop.create(input);

    if (!workshop) {
      return response.status(500).json(Notify.error('Not saved', {}));
    }

    await UserWorkshop.create({ // make a requester to be a manager of non-yet-confirmed place
      user_id: (await auth.authenticator('jwt').getUser()).id,
      workshop_id: workshop.id,
      is_manager: true
    });

    return response.json(Notify.success('Saved', {}));
  }

  async show({ params, request, response, auth }) {
    const { slug } = params;
    const authUser = await auth.authenticator('jwt').getUser();

    const workshop = await Workshop.query()
      .select('*')
      .with('users')
      .with('materials')
      .with('productions', (builder) => {
        builder.with('netting.type')
          .with('chief')
          .with('material')
          .with('workshop');
      })
      .select(Database.raw(
        `(SELECT COUNT(*) 
          FROM user_workshops 
          WHERE user_id = ? 
          AND workshop_id = workshops.id
        ) AS is_user_member`,
        [authUser.id]
      ))
      .select(Database.raw(
        `(SELECT COUNT(*) 
          FROM user_workshops 
          WHERE user_id = ? 
          AND workshop_id = workshops.id
          AND is_manager = true
        ) AS is_user_manager`,
        [authUser.id]
      ))
      .where('workshops.slug', slug)
      .first();

    if (!workshop) {
      return response.notFound(Notify.error('Workshop not found', {}));
    }

    workshop.is_user_member = !!parseInt(workshop.is_user_member, 10);
    workshop.is_user_manager = !!parseInt(workshop.is_user_manager, 10);

    return response.json(workshop.toJSON());
  }

  async findBy({ params, request, response }) {
    const { attr } = params;
    const { value } = request.all();

    const workshop = await Workshop.findBy(attr, value);

    if (!workshop) {
      return response.notFound(Notify.error('Workshop not found'));
    }

    return response.json(workshop.toJSON());
  }

  async productions({ params, request, response }) {
    const { id } = params;
    const { completed } = request.all();
    const workshop = await Workshop.find(id);

    if (!workshop) {
      return response.notFound(Notify.error('Workshop not found', {}));
    }

    let productions = Productions.query()
      .with('netting.type')
      .with('chief')
      .with('material')
      .with('workshop')
      .where('productions.workshop_id', id)
      .orderBy('productions.created_at', 'ASC');

    if (completed !== undefined) {
      productions = productions.andWhere('completed', completed);
    }

    return response.json((await productions.fetch()).toJSON());
  }

  async materials({ params, response }) {
    const { id } = params;
    const workshop = await Workshop.find(id);

    if (!workshop) {
      return response.notFound(Notify.error('Workshop not found', {}));
    }

    const materials = await workshop.materials()
      .orderBy('materials.created_at', 'ASC')
      .fetch();

    return response.json(materials.toJSON());
  }

  async delete({ request, response, params }) {
    const { id } = params;
    const workshop = await Workshop.find(id);

    if (!workshop) {
      return response.notFound(Notify.error('Something went wrong. workshop not found', {}));
    }

    if (await workshop.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }
}

module.exports = WorkshopsController;
