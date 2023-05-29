const ADM = require('../../assets/adm/adm');

ADM.ui.set('image-input', {
  init: (context) => {
    $('.image-input', context).each(function () {
      new KTImageInput($(this).get()[0]);
    })
  }
});
