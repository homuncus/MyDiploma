'use strict';

const View = use('View');
const Route = use('Route');
class DevelopmentController {
  async ui({ view, __ }) {
    View.global('breadcrumbs', [
      { name: __('admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('admin.development') },
      { name: __('admin.ui'), url: Route.url('admin.roles.list') },
    ]);

    return view.render('Adm.development.ui');
  }
}

module.exports = DevelopmentController;
