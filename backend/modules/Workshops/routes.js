const Route = use('Route');

Route.group(() => {
  // Workshops
  Route
    .any('workshops', '@provider:Workshops/Controllers/WorkshopsController.index')
    .as('Workshops.workshops.index')
    .middleware(['managerAuth', 'managerCan:workshops_view', 'managerXHR']);
  Route
    .post('workshops/list', '@provider:Workshops/Controllers/WorkshopsController.list')
    .as('Workshops.workshops.list')
    .middleware(['managerAuth', 'managerCan:workshops_view']);

  Route
    .post('workshops/edit/:id?', '@provider:Workshops/Controllers/WorkshopsController.edit')
    .as('Workshops.workshops.edit')
    .middleware(['managerAuth', 'managerCan:workshops_edit']);

  Route
    .post('workshops/delete/:id', '@provider:Workshops/Controllers/WorkshopsController.delete')
    .as('Workshops.workshops.delete')
    .middleware(['managerAuth', 'managerCan:workshops_delete']);

  Route
    .post('workshops/save', '@provider:Workshops/Controllers/WorkshopsController.save')
    .as('Workshops.workshops.save')
    .middleware(['managerAuth', 'managerCan:workshops_edit']);

  // UserWorkshops
  Route
    .any('workshops/users', '@provider:Workshops/Controllers/UserWorkshopsController.index')
    .as('Workshops.userWorkshops.index')
    .middleware(['managerAuth', 'managerCan:userWorkshops_view', 'managerXHR']);
  Route
    .post('workshops/users/list', '@provider:Workshops/Controllers/UserWorkshopsController.list')
    .as('Workshops.userWorkshops.list')
    .middleware(['managerAuth', 'managerCan:userWorkshops_view']);

  Route
    .post('workshops/users/edit/:id?', '@provider:Workshops/Controllers/UserWorkshopsController.edit')
    .as('Workshops.userWorkshops.edit')
    .middleware(['managerAuth', 'managerCan:userWorkshops_edit']);

  Route
    .post('workshops/users/delete/:id', '@provider:Workshops/Controllers/UserWorkshopsController.delete')
    .as('Workshops.userWorkshops.delete')
    .middleware(['managerAuth', 'managerCan:userWorkshops_delete']);

  Route
    .post('workshops/users/save', '@provider:Workshops/Controllers/UserWorkshopsController.save')
    .as('Workshops.userWorkshops.save')
    .middleware(['managerAuth', 'managerCan:userWorkshops_edit']);
}).prefix('admin').middleware('adminPanelLocal');

Route.group(() => {
  Route.get('/', '@provider:Workshops/Controllers/WorkshopsController.scrollList');
  Route.post('/', '@provider:Workshops/Controllers/WorkshopsController.saveWithMembership');
  Route.get('/findBy/:attr', '@provider:Workshops/Controllers/WorkshopsController.findBy');
  Route.get('/:slug', '@provider:Workshops/Controllers/WorkshopsController.show');
  Route.delete('/:id', '@provider:Workshops/Controllers/WorkshopsController.delete');
  Route.patch('/:id', '@provider:Workshops/Controllers/WorkshopsController.save');
  Route.get('/:id/productions', '@provider:Workshops/Controllers/WorkshopsController.productions');
  Route.get('/:id/materials', '@provider:Workshops/Controllers/WorkshopsController.materials');
}).prefix('api/workshops');
