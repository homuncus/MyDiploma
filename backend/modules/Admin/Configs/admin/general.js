module.exports = {
  locales: [
    {
      slug: 'en',
      title: 'English',
      baseUrl: '',
      flag: '/admin/assets/media/svg/flags/012-uk.svg',
      shortTitle: 'Eng',
    },
    {
      slug: 'ua',
      title: 'Українська',
      baseUrl: '/ua/',
      flag: '/admin/assets/media/svg/flags/ua.svg',
      shortTitle: 'Укр',
    },
  ],
  defaultLocale: 'en',
  masterTemplate: 'Admin.layout.app',
  afterLogin: 'admin.dashboard.index',
};
