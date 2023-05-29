const ADM = require('../../../Adm/resources/assets/adm/adm');

ADM.modules.set('menu', {
  events: {
    'click: a': 'mark',
  },

  mark: function(e, module){
    $('li', $(module.el)).removeClass('kt-menu__item--active');
    $('.kt-menu__item--submenu', $(module.el)).removeClass('kt-menu__item--open');
    

    $(this).parents('li').addClass('kt-menu__item--active');
    $(this).parents('li.kt-menu__item--submenu').addClass('kt-menu__item--open');
  },
  
  init: function(){
    
  }
});
