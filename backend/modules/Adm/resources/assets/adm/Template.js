/**
 *
 * @type {{get: Function, parse: Function, load: Function}}
 * @private
 */
class Template {

  get(html){
    return _.template(html)
  }

  parse(template, obj){
    const tpl = ADM.template.get(template);
    return tpl(obj);
  }

  load(name, callback){
    $.ajax({
      url: name,
      type: 'post',
      dataType: 'html',
      cache: false,
      success: (response, codeMessage, xhr) => {
        callback(response);
      },
      error: (response) => {
        ADM.Notifications.warning("Something was wrong.");
      }
    });
  }
};

module.exports = new Template();