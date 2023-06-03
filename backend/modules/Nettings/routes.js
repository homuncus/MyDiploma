const Route = use('Route');

Route.group(() => {
  // Nettings
  Route
    .any('nettings', '@provider:Nettings/Controllers/NettingsController.index')
    .as('Nettings.nettings.index')
    .middleware(['managerAuth', 'managerCan:nettings_view', 'managerXHR']);
  Route
    .post('nettings/list', '@provider:Nettings/Controllers/NettingsController.list')
    .as('Nettings.nettings.list')
    .middleware(['managerAuth', 'managerCan:nettings_view']);

  Route
    .post('nettings/edit/:id?', '@provider:Nettings/Controllers/NettingsController.edit')
    .as('Nettings.nettings.edit')
    .middleware(['managerAuth', 'managerCan:nettings_edit']);

  Route
    .post('nettings/delete/:id', '@provider:Nettings/Controllers/NettingsController.delete')
    .as('Nettings.nettings.delete')
    .middleware(['managerAuth', 'managerCan:nettings_delete']);

  Route
    .post('nettings/save', '@provider:Nettings/Controllers/NettingsController.save')
    .as('Nettings.nettings.save')
    .middleware(['managerAuth', 'managerCan:nettings_edit']);

  // Types
  Route
    .any('nettings/types', '@provider:Nettings/Controllers/TypesController.index')
    .as('Nettings.types.index')
    .middleware(['managerAuth', 'managerCan:types_view', 'managerXHR']);
  Route
    .post('nettings/types/list', '@provider:Nettings/Controllers/TypesController.list')
    .as('Nettings.types.list')
    .middleware(['managerAuth', 'managerCan:types_view']);

  Route
    .post('nettings/types/edit/:id?', '@provider:Nettings/Controllers/TypesController.edit')
    .as('Nettings.types.edit')
    .middleware(['managerAuth', 'managerCan:types_edit']);

  Route
    .post('nettings/types/delete/:id', '@provider:Nettings/Controllers/TypesController.delete')
    .as('Nettings.types.delete')
    .middleware(['managerAuth', 'managerCan:types_delete']);

  Route
    .post('nettings/types/save', '@provider:Nettings/Controllers/TypesController.save')
    .as('Nettings.types.save')
    .middleware(['managerAuth', 'managerCan:types_edit']);
}).prefix('admin').middleware('adminPanelLocal');

Route.group(() => {
  Route.get('types', '@provider:Nettings/Controllers/TypesController.list');
  Route.post('types', '@provider:Nettings/Controllers/TypesController.save');
  Route.delete('types/:id', '@provider:Nettings/Controllers/TypesController.delete');
  Route.patch('types/:id', '@provider:Nettings/Controllers/TypesController.save');
  Route.get('types/:id', '@provider:Nettings/Controllers/TypesController.show');
  Route.get('types/:id/nettings', '@provider:Nettings/Controllers/TypesController.nettings');

  Route.get('/', '@provider:Nettings/Controllers/NettingsController.list');
  Route.post('/', '@provider:Nettings/Controllers/NettingsController.save');
  Route.delete('/:id', '@provider:Nettings/Controllers/NettingsController.delete');
  Route.patch('/:id', '@provider:Nettings/Controllers/NettingsController.save');
  Route.get('/:id', '@provider:Nettings/Controllers/NettingsController.show');
}).prefix('api/nettings').middleware('auth:jwt');
