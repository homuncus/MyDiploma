const ADM = require('../../assets/adm/adm');

ADM.ui.set('inputmask', {
  init: (context) => {
    $('.inputmask_phone', context).inputmask("mask", {
      "mask": "+1 (999) 999-9999 [ext. 9{0,4}]"
  }); 
  }
});
