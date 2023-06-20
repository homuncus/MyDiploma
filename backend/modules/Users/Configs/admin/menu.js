module.exports = [
  {
    "index": 0,
    "text": "\n    <span class=\"svg-icon menu-icon\">\n<i class=\"fas fa-solid fa-users\"></i>\n    </span>\n    <span class=\"menu-text\">{{Users.users.users}}</span>\n    <i class=\"menu-arrow\"></i>\n    ",
    "a.href": "javascript:;",
    "li.class": "menu-item menu-item-submenu",
    "a.class": "menu-link menu-toggle",
    "li.data-menu-toggle": "hover",
    "li.aria-haspopup": "true",
    "ul.class": "menu-subnav",
    "permissions": [
      "roles_view",
      "users_view",
      "userConnections"
    ],
    "children": [
      {
        "li.class": "menu-item",
        "li.aria-haspopup": "true",
        "a.class": "menu-link",
        "text": "\n      <i class=\"menu-bullet menu-bullet-dot\"><span></span></i>\n      <span class=\"menu-text\">{{Users.users.users}}</span>\n    ",
        "a.href": "Users.users.index",
        "permissions": [
          "users_view"
        ],
        "children": []
      },
      {
        "li.class": "menu-item",
        "li.aria-haspopup": "true",
        "a.class": "menu-link",
        "text": "\n    <i class=\"menu-bullet menu-bullet-dot\"><span></span></i>\n    <span class=\"menu-text\">{{Users.userConnections.userConnections}}</span>\n  ",
        "a.href": "Users.userConnections.index",
        "permissions": [
          "userConnections_view"
        ],
        "children": []
      }
    ]
  }
]