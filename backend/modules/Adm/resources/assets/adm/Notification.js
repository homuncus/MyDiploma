class Notification {
  constructor() {
    this.settings = {
      type: 'success',
      allow_dismiss: true,
      newest_on_top: true,
      mouse_over: true,
      showProgressbar: false,
      spacing: 10,
      timer: 2000,
      placement: {
        from: 'top',
        align: 'right',
      },
      offset: {
        x: 30,
        y: 30,
      },
      delay: 1000,
      z_index: 10000,
      animate: {
        enter: 'animated fadeIn',
        exit: 'animated fadeOut',
      },
    };
  }

  success(content, params) {
    this.show(content, params);
  }

  info(content, params) {
    this.show(content, {
      ...params,
      type: 'info',
    });
  }

  warning(content, params) {
    this.show(content, {
      ...params,
      type: 'warning',
    });
  }

  error(content, params) {
    this.show(content, {
      ...params,
      type: 'danger',
    });
  }

  show(content, params) {
    $.notify({
      message: 'Empty message',
      title: 'Empty title',
      icon: 'url',
      // url: '#',
      target: '_self',
      ...content,
    }, {
      ...this.settings,
      ...params,
    });
  }

  message(params) {
    this[params.type]({
      message: params.text || params.message,
      title: params.title,
    });
  }
}

module.exports = new Notification();
