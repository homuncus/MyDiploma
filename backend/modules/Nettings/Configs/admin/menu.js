module.exports = [
  {
    "index": 0,
    "text": "\n    <span class=\"svg-icon menu-icon\">\n<i class=\"fas fa-solid fa-hashtag\"></i></span>\n    <span class=\"menu-text\">{{Nettings.nettings.nettings}}</span>\n    <i class=\"menu-arrow\"></i>\n    ",
    "a.href": "javascript:;",
    "li.class": "menu-item menu-item-submenu",
    "a.class": "menu-link menu-toggle",
    "li.data-menu-toggle": "hover",
    "li.aria-haspopup": "true",
    "ul.class": "menu-subnav",
    "permissions": [
      "types_view",
      "nettings_view"
    ],
    "children": [
      {
        "li.class": "menu-item",
        "li.aria-haspopup": "true",
        "a.class": "menu-link",
        "text": "\n      <i class=\"menu-bullet menu-bullet-dot\"><span></span></i>\n      <span class=\"menu-text\">{{Nettings.nettings.nettings}}</span>\n    ",
        "a.href": "Nettings.nettings.index",
        "permissions": [
          "nettings_view"
        ],
        "children": []
      },
      {
        "li.class": "menu-item",
        "li.aria-haspopup": "true",
        "a.class": "menu-link",
        "text": "\n    <i class=\"menu-bullet menu-bullet-dot\"><span></span></i>\n    <span class=\"menu-text\">{{Nettings.types.types}}</span>\n  ",
        "a.href": "Nettings.types.index",
        "permissions": [
          "types_view"
        ],
        "children": []
      }
    ]
  }
]