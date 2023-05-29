'use strict';

const Config = use('Config');

// const Notification = use('Soket/Notification');

class DashboardController {
  async index({ view }) {
    // Notification.message('Hello this test message from Soket Notification');

    return view.render('Auth.dashboard.index');
  }

  async lang({ params, session, response }) {
    const { lang } = params;

    const locales = Config.get('admin.general.locales');

    if (lang && locales.filter((l) => l.slug === lang.toLowerCase()).length) {
      session.put('locale', lang);
    }

    return response.redirect('back');
  }
}

module.exports = DashboardController;
