// __UP_NAME__
Route
  .any('__LP_NAME__', '@provider:__MODULE__/Controllers/__UP_NAME__Controller.index')
  .as('__MODULE__.__LP_NAME__.index')
  .middleware(['managerAuth', 'managerCan:__LP_NAME___view', 'managerXHR']);
Route
  .post('__LP_NAME__/list', '@provider:__MODULE__/Controllers/__UP_NAME__Controller.list')
  .as('__MODULE__.__LP_NAME__.list')
  .middleware(['managerAuth', 'managerCan:__LP_NAME___view']);

Route
  .post('__LP_NAME__/edit/:id?', '@provider:__MODULE__/Controllers/__UP_NAME__Controller.edit')
  .as('__MODULE__.__LP_NAME__.edit')
  .middleware(['managerAuth', 'managerCan:__LP_NAME___edit']);

Route
  .post('__LP_NAME__/delete/:id', '@provider:__MODULE__/Controllers/__UP_NAME__Controller.delete')
  .as('__MODULE__.__LP_NAME__.delete')
  .middleware(['managerAuth', 'managerCan:__LP_NAME___delete']);

Route
  .post('__LP_NAME__/save', '@provider:__MODULE__/Controllers/__UP_NAME__Controller.save')
  .as('__MODULE__.__LP_NAME__.save')
  .middleware(['managerAuth', 'managerCan:__LP_NAME___edit']);
