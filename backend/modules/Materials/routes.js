const Route = use('Route');

Route.group(() => {
  // Materials
  Route
    .any('materials', '@provider:Materials/Controllers/MaterialsController.index')
    .as('Materials.materials.index')
    .middleware(['managerAuth', 'managerCan:materials_view', 'managerXHR']);
  Route
    .post('materials/list', '@provider:Materials/Controllers/MaterialsController.list')
    .as('Materials.materials.list')
    .middleware(['managerAuth', 'managerCan:materials_view']);

  Route
    .post('materials/edit/:id?', '@provider:Materials/Controllers/MaterialsController.edit')
    .as('Materials.materials.edit')
    .middleware(['managerAuth', 'managerCan:materials_edit']);

  Route
    .post('materials/delete/:id', '@provider:Materials/Controllers/MaterialsController.delete')
    .as('Materials.materials.delete')
    .middleware(['managerAuth', 'managerCan:materials_delete']);

  Route
    .post('materials/save', '@provider:Materials/Controllers/MaterialsController.save')
    .as('Materials.materials.save')
    .middleware(['managerAuth', 'managerCan:materials_edit']);
}).prefix('admin').middleware('adminPanelLocal');

Route.group(() => {
  Route.get('/', '@provider:Materials/Controllers/MaterialsController.list');
  Route.post('/', '@provider:Materials/Controllers/MaterialsController.save');
  Route.delete('/:id', '@provider:Materials/Controllers/MaterialsController.delete');
  Route.patch('/:id', '@provider:Materials/Controllers/MaterialsController.save');
  Route.get('/:id', '@provider:Materials/Controllers/MaterialsController.show');
}).prefix('api/materials').middleware('auth');
