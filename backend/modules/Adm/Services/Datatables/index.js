'use strict';

class Datatables {
  constructor(query, request, customSearch) {
    this.customSearch = customSearch;
    this.query = query;
    this.request = request;
    this.draw = request.get('draw', 1);
    this.recordsTotal = 0;
    this.recordsFiltered = 0;
    this.filterParams = [];
    this.orderParams = [];
    this.paginateParams = {};
    this.additionalColumns = []; // { action: (add|edit|delete), column: string, callback: function }
  }

  parseRequest() {
    this.filterParams = this.parseFilter();
    this.searchParams = this.parseSearch();
    this.orderParams = this.parseOrder();
    this.paginateParams = this.parsePaginate();
  }

  parseSearch() {
    // const columns = this.getColumns();
    const {
      columns: dtColumns,
      search: {
        value: searchValue,
      },
    } = this.request.all();

    if (!searchValue) return [];

    const search = dtColumns
      .filter((c) => c.searchable === 'true')
      .map((c) => ({
        column: c.name,
        value: searchValue,
      }));

    return search;
  }

  parseFilter() {
    const columns = this.getColumns();
    const {
      columns: dtColumns,
    } = this.request.all();

    const search = dtColumns
      .filter((c) => c.searchable)
      .filter((c) => columns.indexOf(c.name) !== -1)
      .map((c) => {
        if (!c.search.value) {
          return null;
        }

        return {
          column: c.name,
          value: c.search.value,
        };
      })
      .filter((c) => c);

    return search;
  }

  parseOrder() {
    const orderableColumns = [];
    const columns = this.getColumns();
    const dtOrder = this.request.input('order', []);
    const dtColumns = this.request.input('columns', []);

    // console.log(columns);

    if (dtOrder.length > 0) {
      for (const key in dtOrder) {
        const item = dtOrder[key];
        const column = dtColumns[Number(item.column)];
        // console.log(column.orderable, column.name);
        if (column.orderable && columns.indexOf(column.name) != -1) {
          orderableColumns.push({
            column: column.name,
            dir: item.dir,
          });
        }
      }
    }

    return orderableColumns;
  }

  parsePaginate() {
    const { length, start } = this.request.only(['start', 'length']);

    if (length && Number(length) !== -1) {
      return {
        length,
        start,
      };
    }

    return {};
  }

  getColumns() {
    let columns = [];
    const item = this.query._statements.find(function (item) {
      return item.grouping == 'columns';
    });

    if (item) {
      columns = item.value;
    }

    return columns;
  }

  addColumn(column, callback) {
    this.additionalColumns.push({
      action: 'add',
      column,
      callback,
    });

    return this;
  }

  editColumn(column, callback) {
    this.additionalColumns.push({
      action: 'edit',
      column,
      callback,
    });

    return this;
  }

  deleteColumn(column) {
    this.additionalColumns.push({
      action: 'delete',
      column,
    });

    return this;
  }

  sortAdditionalColumns(columns) {
    let priority = {
      add: 1,
      edit: 2,
      delete: 3,
    };

    columns = columns.map((column) => {
      column.action = priority[column.action];

      return column;
    });

    columns.sort((a, b) => a.action - b.action);

    priority = _.invert(priority);

    columns = columns.map((column) => {
      column.action = priority[column.action];

      return column;
    });

    return columns;
  }

  async additionalColumnsProcessing(results) {
    if (this.additionalColumns.length > 0) {
      // sort additional columns

      this.additionalColumns = this.sortAdditionalColumns(
        this.additionalColumns,
      );

      for (const key in this.additionalColumns) {
        const additionalColumn = this.additionalColumns[key];

        switch (additionalColumn.action) {
          case 'add':
            results = await Promise.all(results.map(async (item) => {
              if (item[additionalColumn.column] === undefined) {
                item[additionalColumn.column] = await additionalColumn.callback(item);
              }
              return item;
            }));

            break;
          case 'edit':
            results = await Promise.all(results.map(async (item) => {
              if (item[additionalColumn.column] || item[additionalColumn.column] === 0 || item[additionalColumn.column] === null) {
                item[additionalColumn.column] = await additionalColumn.callback(item);
              }
              return item;
            }));
            break;

          case 'delete':
            results = await Promise.all(results.map(async (item) => {
              if (item[additionalColumn.column]) {
                delete item[additionalColumn.column];
              }

              return item;
            }));
            break;
        }
      }
    }
    return await Promise.all(results);
  }

  async getCount() {
    const query = this.query.clone();
    const result = await query.clearSelect().getCount();

    return result || 0;
  }

  async make() {
    this.recordsTotal = await this.getCount();

    const { search } = this.request.only('search') || {};
    const { value } = search || {}
    const { searchValue } = value || {}
    const { customSearch } = this;

    this.parseRequest();

    const { filterParams, searchParams } = this;

    if (searchParams.length > 0) {
      this.query.andWhere(function () {
        // console.log(searchParams);
        for (let i = 0; i < searchParams.length; i += 1) {
          this.orWhereRaw(`LOWER(${searchParams[i].column}::text) like '%${searchParams[i].value.toLowerCase()}%'`);
        }
        if (customSearch && searchValue) customSearch(this, searchValue.toLowerCase());
      });
    }

    if (filterParams.length > 0) {
      this.query.andWhere(function () {
        for (let i = 0; i < filterParams.length; i += 1) {
          this.orWhereRaw(`LOWER(${filterParams[i].column}::text) like '%${filterParams[i].value.toLowerCase()}%'`);
        }
      });
    }

    this.recordsFiltered = await this.getCount();

    if (this.orderParams.length > 0) {
      const { orderParams } = this;

      for (const key in orderParams) {
        if (Object.hasOwnProperty.call(orderParams, key)) {
          const { column, dir } = orderParams[key];
          this.query.orderBy(column, dir);
        }
      }
      // for (const key in orderParams) {
      //   this.query.orderBy(orderParams[key].column, orderParams[key].dir);
      // }
    }

    if (this.paginateParams.length !== undefined && this.paginateParams.start !== undefined) {
      this.query
        .limit(Number(this.paginateParams.length))
        .offset(Number(this.paginateParams.start));
    }

    // console.log(this.query.toString());

    let results = await this.query;
    results = await this.additionalColumnsProcessing(results);

    return {
      draw: parseInt(this.draw, 10) + 1,
      data: results,
      recordsFiltered: parseInt(this.recordsFiltered, 10),
      recordsTotal: parseInt(this.recordsTotal, 10),
    };
  }
}

module.exports = Datatables;
