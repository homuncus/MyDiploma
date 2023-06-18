const Route = use('Route');

Route.group(() => {
  // Reports
  Route
    .any('reports', '@provider:Reports/Controllers/ReportsController.index')
    .as('Reports.reports.index')
    .middleware(['managerAuth', 'managerCan:reports_view', 'managerXHR']);
  Route
    .post('reports/list', '@provider:Reports/Controllers/ReportsController.list')
    .as('Reports.reports.list')
    .middleware(['managerAuth', 'managerCan:reports_view']);

  Route
    .post('reports/edit/:id?', '@provider:Reports/Controllers/ReportsController.edit')
    .as('Reports.reports.edit')
    .middleware(['managerAuth', 'managerCan:reports_edit']);

  Route
    .post('reports/delete/:id', '@provider:Reports/Controllers/ReportsController.delete')
    .as('Reports.reports.delete')
    .middleware(['managerAuth', 'managerCan:reports_delete']);

  Route
    .post('reports/save', '@provider:Reports/Controllers/ReportsController.save')
    .as('Reports.reports.save')
    .middleware(['managerAuth', 'managerCan:reports_edit']);
}).prefix('admin').middleware('adminPanelLocal');
 
Route.group(() => {
  Route.post(':userId', '@provider:Reports/Controllers/MessageController.save');
  Route.post(':messageId/report', '@provider:Reports/Controllers/ReportsController.save');
  Route.patch(':id', '@provider:Reports/Controllers/MessageController.save');
  Route.delete(':id', '@provider:Reports/Controllers/MessageController.delete');
}).prefix('api/messages').middleware('auth:jwt');
