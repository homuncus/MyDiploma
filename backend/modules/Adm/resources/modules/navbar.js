const ADM = require('../../../Adm/resources/assets/adm/adm');


ADM.modules.set('navbar', {
  events: {
    //'click: #logout': 'logout',
  },

  selectAll: function(e, module) {
    e.preventDefault();
    $('.checkbox :checkbox', $(module.el)).each(function() {this.checked = true;});
  },

  logout: function(e){
    location.href = location.href;
    return false;
  },
  
  init: function(){
    
  }
});
