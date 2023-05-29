/* global ADM */

ADM.modules.set('login', {
  init() {
    const login = $.proxy(this, 'login');
    $('#loginForm').submit(() => {
    }).validate({
      errorClass: 'text-danger',
      validClass: 'text-succes',
      errorElement: 'span',
      highlight(element, errorClass, validClass) {
        $(element).parents('.text-danger').addClass(errorClass).removeClass(validClass);
      },
      unhighlight(element, errorClass, validClass) {
        $(element).parents('.text-succes').removeClass(errorClass).addClass(validClass);
      },
      rules: {
        email: {
          required: true,
          email: true,
          minlength: 5,
          maxlength: 255,
        },
        password: {
          required: true,
          minlength: 6,
          maxlength: 60,
        },
      },
      submitHandler(form) {
        login(form);
      },
    });
  },

  login(form) {
    const thisForm = $(form);

    ADM.ajax({
      type: thisForm.attr('method'),
      url: thisForm.attr('action'),
      data: thisForm.serialize(),
      cache: false,
      success(response) {
        const { notification } = response;
        const { type, path } = notification || {};
        if (type === 'success') {
          setTimeout(document.location.href = path, 1000);
        }
      },
    });
  },
});
