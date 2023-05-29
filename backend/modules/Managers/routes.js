const Route = use('Route');

Route.group(() => {

  // AdminUser
  Route
    .any('admin-users', '@provider:Managers/Controllers/ManagersController.index')
    .as('user.index')
    .middleware(['managerAuth', 'managerCan:admin_users_view', 'managerXHR']);

  Route
    .post('admin-users/list', '@provider:Managers/Controllers/ManagersController.list')
    .as('user.list')
    .middleware(['managerAuth', 'managerCan:admin_users_view']);

  Route
    .post('admin-users/edit/:id?', '@provider:Managers/Controllers/ManagersController.edit')
    .as('user.edit')
    .middleware(['managerAuth', 'managerCan:admin_users_edit']);

  Route
    .post('admin-users/save', '@provider:Managers/Controllers/ManagersController.save')
    .as('user.save')
    .validator('App/../modules/Managers/Validators/SaveManager')
    .middleware(['managerAuth', 'managerCan:admin_users_edit']);

  Route
    .post('admin-users/delete/:id', '@provider:Managers/Controllers/ManagersController.delete')
    .as('user.delete')
    .middleware(['managerAuth', 'managerCan:admin_users_delete']);

  // AdminRole

  Route
    .any('admin-roles', '@provider:Managers/Controllers/RolesController.index')
    .as('role.index')
    .middleware(['managerAuth', 'managerCan:admin_roles_view', 'managerXHR']);

  Route
    .post('admin-roles/list', '@provider:Managers/Controllers/RolesController.list')
    .as('role.list')
    .middleware(['managerAuth', 'managerCan:admin_roles_view']);

  Route
    .post('admin-roles/edit/:id?', '@provider:Managers/Controllers/RolesController.edit')
    .as('role.edit')
    .middleware(['managerAuth', 'managerCan:admin_roles_edit']);

  Route
    .post('admin-roles/save', '@provider:Managers/Controllers/RolesController.save')
    .as('role.save')
    .validator('App/../modules/Managers/Validators/SaveRole')
    .middleware(['managerAuth', 'managerCan:admin_roles_edit']);

  Route
    .post('admin-roles/delete/:id', '@provider:Managers/Controllers/RolesController.delete')
    .as('role.delete')
    .middleware(['managerAuth', 'managerCan:admin_roles_delete']);

}).prefix('admin').as('admin').middleware(['adminPanelLocal']);
