/**
 *
 * @type {{show: Function, hide: Function}}
 * @private
 *
 * V0.2 change log:
 * - 1.05.2015 Add multiDialogs support
 * v0.3
 * - 13.07.2019 Refactored to ES7
 */
class Modal {
  constructor() {
    this.instance = {};
  }

  close(name) {
    if (typeof (name) === 'undefined') {
      this.hide();
    } else {
      if (!this.instance[name]) {
        console.log(`Dialog ${name} not found.`);
        return;
      }
      this.instance[name].close();
      delete this.instance[name];
    }
  }

  show(params) {
    let modal = $('#modal');
    const buttons = [];

    if (params.cancel) {
      buttons.push({
        label: params.cancel === true ? 'Cancel' : params.cancel,
        action: (dialog) => {
          dialog.close();
        },
        cssClass: 'modal-cancel btn btn-warning'
      });
    }

    if (params.submit) {
      buttons.push({
        label: params.submit === true ? "Save" : params.submit,
        action: (dialog) => {
          // dialog.closest('.modal-content').find('form').submit();
          dialog.getModal().find('form').submit();
        },
        cssClass: 'modal-submit btn btn-primary'
      });
    }

    const onshownCallback = params.onshown || function () { };


    params.onshown = function (dialog) {
      ADM.modules.init();
      ADM.ui.init(dialog.$modal[0]);

      eval(' onshownCallback = ' + onshownCallback);
      onshownCallback(dialog.$modal[0]);
    }

    var onhideCallback = params.onhide ? params.onhide : function () { };
    params.onhide = function (dialog) {
      ADM.ui.destroy(dialog.$modal[0]);
      eval(' onhideCallback = ' + onhideCallback);
      onhideCallback(dialog.$modal[0]);
    }
    if (!params.buttons) {
      params.buttons = buttons;
    } else {
      for (var i in params.buttons) {
        if (params.buttons[i].action) {
          var func = new Function('return function(dialog) {' + params.buttons[i].action + '}');
          params.buttons[i].action = func();
        }
        buttons.push(params.buttons[i]);
      }
      params.buttons = buttons;
    }
    params.message = params.content;
    params.nl2br = false;

    modal = BootstrapDialog.show(params);
    var width = params.width || 900;
    modal.$modalDialog.css({ width: (width > $(window).width() ? $(window).width() - 35 : width), height: params.height || 500 });

    if (params.name) {
      this.instance[params.name] = modal;
    }
    return modal;
  }

  hide(modal) {
    if (modal) {
      modal.close();
    } else {
      BootstrapDialog.closeAll();
    }
  }

  /*
  * Replace modal content
  */
  replace(name, html) {
    if (typeof (name) === 'undefined') return;
    this.instance[name].getModal()
      .find('form .well')
      .html(html)
      .promise()
      .done(() => { });
  }
}

module.exports = new Modal();
