/* eslint-disable no-continue */

'use strict';

const Route = use('Route');

class Menu {
  constructor() {
    this.default = {
      index: 0,
      text: '',
      childs: null,
    };
  }

  generateTag(tag, attributes) {
    const attr = [];

    for (const key in attributes) {
      if (['childs', 'text'].includes(key)) continue;
      if (!key.startsWith(`${tag}.`)) continue;

      let attribute = attributes[key];

      if (key === 'a.href' && typeof attributes['a.href'] === 'function') {
        attribute = attributes['a.href']();
      }
      if (key === 'a.href' && typeof attributes['a.href'] !== 'function') {
        if (attributes['a.href'].indexOf('//') > -1) {
          attribute = attributes['a.href'];
        } else {
          attribute = Route.url(attributes['a.href']);
        }
      }
      if (key === 'a.href' && attributes['a.href'] === 'javascript:;') {
        attribute = attributes['a.href'];
      }

      attribute = Array.isArray(attribute) ? attribute.join(' ') : attribute;

      attr.push(`${key.replace(`${tag}.`, '')}="${attribute}"`);
    }
    return `<${tag} ${attr.join(' ')}>{content}</${tag}>`;
  }

  build(menu, userPermissions, __) {
    const list = [];
    menu.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    });

    menu.forEach((item) => {
      if (item.permissions.length && userPermissions && !userPermissions.filter((r) => item.permissions.indexOf(r) > -1).length) return;

      const node = this.normalize(item);
      const li = this.generateTag('li', node);
      const a = this.generateTag('a', node);
      let ul = '';

      if (Array.isArray(node.childs) && node.childs.length) {
        ul = `<div class="menu-submenu"><i class="menu-arrow"></i>${this.generateTag('ul', node)}</div>`;
        const inner = this.build(node.childs, userPermissions, __);
        ul = ul.replace('{content}', `${inner}`);
      }

      if (Array.isArray(node.children) && node.children.length) {
        ul = `<div class="menu-submenu"><i class="menu-arrow"></i>${this.generateTag('ul', node)}</div>`;
        const inner = this.build(node.children, userPermissions, __);
        ul = ul.replace('{content}', `${inner}`);
      }

      const text = node.text.replace(/{{(.*)}}/gm, (a, b) => __(b));

      list.push((li.replace('{content}', `${a}${ul}`)).replace('{content}', text));
    });
    return list.join('');
  }

  normalize(node) {
    const templateMain = {
      index: 0,
      _textRaw: (icon, title) => `
        <span class="kt-menu__link-icon">
          <i class="${icon}"></i>
        </span>
        <span class="kt-menu__link-text">${title}</span>
        <i class="kt-menu__ver-arrow la la-angle-right"></i>`,
      'a.href': 'javascript:;',
      'li.class': 'kt-menu__item kt-menu__item--submenu',
      'a.class': 'kt-menu__link kt-menu__toggle',
      'li.data-ktmenu-submenu-toggle': 'hover',
      'li.aria-haspopup': 'true',
      'ul.class': 'kt-menu__subnav',
      childs: [],
    };

    const templateItem = {
      index: 0,
      _textRaw: (icon, title) => `<i class="kt-menu__link-icon ${icon}"></i><span class="kt-menu__link-text">${title}</span>`,
      'li.class': 'kt-menu__item',
      'a.class': 'kt-menu__link kt-menu__toggle',
    };

    if (Array.isArray(node.childs) && node.childs.length) {
      return {
        ...templateMain,
        ...node,
      };
    }
    return {
      ...templateItem,
      ...node,
    };
  }
}

module.exports = new Menu();
