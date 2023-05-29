/* ADM, global permissions, $, __, window */

ADM.modules.set('productions', {
  tableSelector: '#productions',

  ReloadTable(response, module) {
    $(module.tableSelector).DataTable().ajax.reload(null, false);
  },

  AfterFormSend(response, module) {
    if (!response.notification) return;
    if (response.notification.type === 'success') {
      $('.modal').modal('hide');
      $(module.tableSelector).DataTable().ajax.reload(null, false);
    }
  },

  init(...args) {
    this.table = $(this.tableSelector).DataTable({
      scrollX: true,
      scrollCollapse: true,
      processing: true,
      serverSide: true,

      initComplete: (oSettings) => {
        $(window).resize();
      },

      drawCallback: (oSettings) => {
        $(window).trigger('resize');
      },

      ajax: {
        url: `${ADM.managerPath}/productions/list`,
        type: 'POST',
        dataType: 'json',
      },

      columns: [
        { data: 'id', name: 'productions.id' },
        { data: 'workshop_name', name: 'productions.workshop_id', orderable: true, searchable: true },
        { data: 'netting_name', name: 'productions.netting_id', orderable: true, searchable: true },
        { data: 'material_name', name: 'productions.material_id', orderable: true, searchable: true },
        { data: 'responsible_user_name', name: 'productions.user_id', orderable: true, searchable: true },
        {
          data: 'completed', name: 'productions.completed', orderable: true, searchable: true,
          render: () => {

          }
        },
        {
          data: 'created_at', name: 'productions.created_at', orderable: true, searchable: false,
          render: (data) => {
            if (!data) return '';
            const localTime = moment.utc(data).local();
            return `<div class="font-weight-bolder text-primary
           mb-0"><span>${localTime.format('MM/DD/YYYY')}</span></div><div
           class="text-muted"><span>${localTime.format('hh:mm A')}</span></div>`;
          },
        },
        {
          data: 'updated_at', name: 'productions.updated_at', orderable: true, searchable: false,
          render: (data) => {
            if (!data) return '';
            const localTime = moment.utc(data).local();
            return `<div class="font-weight-bolder text-primary
           mb-0"><span>${localTime.format('MM/DD/YYYY')}</span></div><div
           class="text-muted"><span>${localTime.format('hh:mm A')}</span></div>`;
          },
        },

        {
          data: 'actions',
          name: 'actions',
          orderable: false,
          searchable: false,
          render: (data, type, row, meta) => {
            const actions = [];
            if (permissions.includes('productions_edit')) {
              actions.push(`
                <li class="nav-item">
                  <a class="nav-link ${ADM.noHistoryClass}" href="${ADM.managerPath}/productions/edit/${row.id}">
                    <i class="nav-icon la la-edit"></i>
                    <span class="nav-text">${__('Adm.admin.edit')}</span>
                  </a>
                </li>
              `);
            }

            if (permissions.includes('productions_delete')) {
              actions.push(`
                <li class="nav-item">
                  <a class="nav-link ${ADM.noHistoryClass}" href="${ADM.managerPath}/productions/delete/${row.id}"
                   data-confirm="${__('Adm.admin.remove')} - ${row.id}?" data-callback="productions::ReloadTable">
                    <i class="nav-icon la la-trash"></i>
                    <span class="nav-text">${__('Adm.admin.remove')}</span>
                  </a>
                </li>
              `);
            }

            if (!actions.length) return '---';

            return `
            <div class="dropdown dropdown-inline">
              <button type="button" class="btn btn-sm btn-clean btn-icon" data-toggle="dropdown" aria-expanded="false">
                <i class="la la-cog"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right" style="display: none;">
                <ul class="nav nav-hoverable flex-column">
                  ${actions.join('')}
                </ul>
              </div>
            </div>
            `;
          },
        },
      ],
    });
  },
});
