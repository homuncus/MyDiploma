'use strict';

module.exports = [
  {
    index: 0,
    text: '<span class="svg-icon menu-icon"><i class="fas fa-user-cog"></i></span><span class="menu-text">{{Managers.manager.managers}}</span><i class="menu-arrow"></i>',
    'li.class': 'menu-item menu-item-submenu',
    'a.class': 'menu-link menu-toggle',
    'li.data-menu-toggle': 'hover',
    'li.aria-haspopup': 'true',
    'ul.class': 'menu-subnav',
    permissions: [
      'admin_users_view',
      'admin_roles_view',
    ],

    children: [
      {
        'li.class': 'menu-item',
        'li.aria-haspopup': 'true',
        'a.class': 'menu-link',
        'a.href': 'admin.user.index',
        text: '<i class="menu-bullet menu-bullet-dot"><span></span></i><span class="menu-text">{{Managers.user.users}}</span>',
        permissions: [
          'admin_users_view',
        ],
        children: [],
      },
      {
        'li.class': 'menu-item',
        'li.aria-haspopup': 'true',
        'a.class': 'menu-link',
        'a.href': 'admin.role.index',
        text: '<i class="menu-bullet menu-bullet-dot"><span></span></i><span class="menu-text">{{Managers.role.roles}}</span>',
        permissions: [
          'admin_roles_view',
        ],
        children: [],
      },
    ],
  },
];
