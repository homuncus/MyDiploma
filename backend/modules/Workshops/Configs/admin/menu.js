module.exports = [
  {
    "index": 0,
    "text": "\n    <span class=\"svg-icon menu-icon\">\n<i class=\"fas fa-solid fa-warehouse\"></i>\n    </span>\n    <span class=\"menu-text\">{{Workshops.workshops.workshops}}</span>\n    <i class=\"menu-arrow\"></i>\n    ",
    "a.href": "javascript:;",
    "li.class": "menu-item menu-item-submenu",
    "a.class": "menu-link menu-toggle",
    "li.data-menu-toggle": "hover",
    "li.aria-haspopup": "true",
    "ul.class": "menu-subnav",
    "permissions": [
      "users_view",
      "workshops_view",
      "userWorkshops",
      "materials"
    ],
    "children": [
      {
        "li.class": "menu-item",
        "li.aria-haspopup": "true",
        "a.class": "menu-link",
        "text": "\n      <i class=\"menu-bullet menu-bullet-dot\"><span></span></i>\n      <span class=\"menu-text\">{{Workshops.workshops.workshops}}</span>\n    ",
        "a.href": "Workshops.workshops.index",
        "permissions": [
          "workshops_view"
        ],
        "children": []
      },
      {
        "li.class": "menu-item",
        "li.aria-haspopup": "true",
        "a.class": "menu-link",
        "text": "\n    <i class=\"menu-bullet menu-bullet-dot\"><span></span></i>\n    <span class=\"menu-text\">{{Workshops.userWorkshops.userWorkshops}}</span>\n  ",
        "a.href": "Workshops.userWorkshops.index",
        "permissions": [
          "userWorkshops_view"
        ],
        "children": []
      },
    ]
  }
]