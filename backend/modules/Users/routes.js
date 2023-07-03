const Route = use('Route');

Route.group(() => {

  // Users
  Route
    .any('users', '@provider:Users/Controllers/UsersController.index')
    .as('Users.users.index')
    .middleware(['managerAuth', 'managerCan:users_view', 'managerXHR']);
  Route
    .post('users/list', '@provider:Users/Controllers/UsersController.list')
    .as('Users.users.list')
    .middleware(['managerAuth', 'managerCan:users_view']);

  Route
    .post('users/edit/:id?', '@provider:Users/Controllers/UsersController.edit')
    .as('Users.users.edit')
    .middleware(['managerAuth', 'managerCan:users_edit']);

  Route
    .post('users/delete/:id', '@provider:Users/Controllers/UsersController.delete')
    .as('Users.users.delete')
    .middleware(['managerAuth', 'managerCan:users_delete']);

  Route
    .post('users/save', '@provider:Users/Controllers/UsersController.save')
    .as('Users.users.save')
    .middleware(['managerAuth', 'managerCan:users_edit']);

  // Roles
  Route
    .any('users/roles', '@provider:Users/Controllers/RolesController.index')
    .as('Users.roles.index')
    .middleware(['managerAuth', 'managerCan:roles_view', 'managerXHR']);
  Route
    .post('users/roles/list', '@provider:Users/Controllers/RolesController.list')
    .as('Users.roles.list')
    .middleware(['managerAuth', 'managerCan:roles_view']);

  Route
    .post('users/roles/edit/:id?', '@provider:Users/Controllers/RolesController.edit')
    .as('Users.roles.edit')
    .middleware(['managerAuth', 'managerCan:roles_edit']);

  Route
    .post('users/roles/delete/:id', '@provider:Users/Controllers/RolesController.delete')
    .as('Users.roles.delete')
    .middleware(['managerAuth', 'managerCan:roles_delete']);

  Route
    .post('users/roles/save', '@provider:Users/Controllers/RolesController.save')
    .as('Users.roles.save')
    .middleware(['managerAuth', 'managerCan:roles_edit']);

  // UserConnections
  Route
    .any('users/connections', '@provider:Users/Controllers/UserConnectionsController.index')
    .as('Users.userConnections.index')
    .middleware(['managerAuth', 'managerCan:userConnections_view', 'managerXHR']);
  Route
    .post('users/connections/list', '@provider:Users/Controllers/UserConnectionsController.list')
    .as('Users.userConnections.list')
    .middleware(['managerAuth', 'managerCan:userConnections_view']);

  Route
    .post('users/connections/edit/:id?', '@provider:Users/Controllers/UserConnectionsController.edit')
    .as('Users.userConnections.edit')
    .middleware(['managerAuth', 'managerCan:userConnections_edit']);

  Route
    .post('users/connections/delete/:id', '@provider:Users/Controllers/UserConnectionsController.delete')
    .as('Users.userConnections.delete')
    .middleware(['managerAuth', 'managerCan:userConnections_delete']);

  Route
    .post('users/connections/save', '@provider:Users/Controllers/UserConnectionsController.save')
    .as('Users.userConnections.save')
    .middleware(['managerAuth', 'managerCan:userConnections_edit']);

}).prefix('admin').middleware('adminPanelLocal');

Route.group(() => {
  Route.post('connections/:id/accept', '@provider:Users/Controllers/UserConnectionsController.accept');
  Route.post('connections/:id/decline', '@provider:Users/Controllers/UserConnectionsController.decline');
  Route.get('findBy/:attr', '@provider:Users/Controllers/UsersController.findBy');
  Route.get('chats', '@provider:Users/Controllers/UsersController.chats');
  Route.get('messagesWith/:userId', '@provider:Users/Controllers/UsersController.messages');
  Route.get('/productions/:finished?', '@provider:Users/Controllers/UsersController.productions');

  Route.post('/workshops/:id', '@provider:Workshops/Controllers/UserWorkshopsController.saveWorkshopMember');
  Route.patch('/workshops/:id', '@provider:Workshops/Controllers/UserWorkshopsController.save');
  Route.delete('/workshops/:id', '@provider:Workshops/Controllers/UserWorkshopsController.deleteWorkshopMember');

  Route.get('/', '@provider:Users/Controllers/UsersController.scrollList');
  Route.post('/', '@provider:Users/Controllers/UsersController.save');
  Route.get('/:id', '@provider:Users/Controllers/UsersController.show');
  Route.delete('/:id', '@provider:Users/Controllers/UsersController.delete');
  Route.patch('/:id', '@provider:Users/Controllers/UsersController.save');
  Route.post('/:id/sendFriendRequest', '@provider:Users/Controllers/UserConnectionsController.send');
  Route.get('/:id/friends', '@provider:Users/Controllers/UsersController.friends');

  Route.get('/:id/workshops', '@provider:Users/Controllers/UsersController.workshops');
}).prefix('api/users').middleware('auth:jwt');
