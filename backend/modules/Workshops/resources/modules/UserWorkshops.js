/* ADM, global permissions, $, __, window */

ADM.modules.set('userWorkshops', {
  tableSelector: '#userWorkshops',

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
        url: `${ADM.managerPath}/workshops/users/list`,
        type: 'POST',
        dataType: 'json',
      },

      columns: [
        { data: 'id', name: 'user_workshops.id' },
        { data: 'user_id', name: 'user_workshops.user_id', orderable: true, searchable: true },
        { data: 'workshop_id', name: 'user_workshops.workshop_id', orderable: true, searchable: true },
        { data: 'is_manager', name: 'user_workshops.is_manager', orderable: true, searchable: true },
        {
          data: 'created_at', name: 'user_workshops.created_at', orderable: true, searchable: true,
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
            if (permissions.includes('userWorkshops_edit')) {
              actions.push(`
                <li class="nav-item">
                  <a class="nav-link ${ADM.noHistoryClass}" href="${ADM.managerPath}/workshops/users/edit/${row.id}">
                    <i class="nav-icon la la-edit"></i>
                    <span class="nav-text">${__('Adm.admin.edit')}</span>
                  </a>
                </li>
              `);
            }

            if (permissions.includes('userWorkshops_delete')) {
              actions.push(`
                <li class="nav-item">
                  <a class="nav-link ${ADM.noHistoryClass}" href="${ADM.managerPath}/workshops/users/delete/${row.id}"
                   data-confirm="${__('Adm.admin.remove')} - ${row.id}?" data-callback="userWorkshops::ReloadTable">
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
