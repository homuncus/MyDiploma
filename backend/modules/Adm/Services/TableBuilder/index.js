'use strict';

const View = use('View');

class TableBuilder {
  constructor(id) {
    this.id = id;
    this.name = '';
    this.description = '';
    this.buttons = '';
    this.columns = '';
    this.view = 'Adm.ui.datatable';
  }

  setForm(form) {
    this.form = form;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setButtons(buttons = []) {
    this.buttons = buttons;
    return this;
  }

  setColums(columns = []) {
    this.columns = columns;
    return this;
  }

  build() {
    return View.render(this.view, {
      id: this.id,
      form: this.form,
      name: this.name,
      description: this.description,
      columns: this.buildColumns(),
      buttons: this.buttons,
    });
  }

  buildColumns() {
    const columns = [];
    this.columns.forEach((value) => {
      const width = value.width ? `width="${value.width}"` : '';
      columns.push(`<th ${width}> ${value.title} </th>`);
    });
    return columns.join('');
  }
}

module.exports = TableBuilder;
