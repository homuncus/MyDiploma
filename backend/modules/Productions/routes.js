const Route = use('Route');

Route.group(() => {

  // Productions
  Route
    .any('productions', '@provider:Productions/Controllers/ProductionsController.index')
    .as('Productions.productions.index')
    .middleware(['managerAuth', 'managerCan:productions_view', 'managerXHR']);
  Route
    .post('productions/list', '@provider:Productions/Controllers/ProductionsController.list')
    .as('Productions.productions.list')
    .middleware(['managerAuth', 'managerCan:productions_view']);

  Route
    .post('productions/edit/:id?', '@provider:Productions/Controllers/ProductionsController.edit')
    .as('Productions.productions.edit')
    .middleware(['managerAuth', 'managerCan:productions_edit']);

  Route
    .post('productions/delete/:id', '@provider:Productions/Controllers/ProductionsController.delete')
    .as('Productions.productions.delete')
    .middleware(['managerAuth', 'managerCan:productions_delete']);

  Route
    .post('productions/save', '@provider:Productions/Controllers/ProductionsController.save')
    .as('Productions.productions.save')
    .middleware(['managerAuth', 'managerCan:productions_edit']);

}).prefix('admin').middleware('adminPanelLocal');

Route.group(() => {
  Route.get('/', '@provider:Productions/Controllers/ProductionsController.list');
  Route.post('/', '@provider:Productions/Controllers/ProductionsController.save');
  Route.delete('/:id', '@provider:Productions/Controllers/ProductionsController.delete');
  Route.patch('/:id', '@provider:Productions/Controllers/ProductionsController.save');
  Route.get('/:id', '@provider:Productions/Controllers/ProductionsController.show');
  Route.get('/:id/users', '@provider:Productions/Controllers/ProductionsController.save');
}).prefix('api/productions').middleware('auth:jwt');
