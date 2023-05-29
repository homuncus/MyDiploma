/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: 0 */
/* global $,CKEDITOR */
const ADM = require('../../../../Adm/resources/assets/adm/adm');

ADM.ui.set('ckeditor', {
  init: (context) => {
    CKEDITOR.config.extraPlugins = 'justify,font';
    // CKEDITOR.replace('instancename', {
    //   filebrowserBrowseUrl: "/admin/filemanager/index.html"
    //   // other configuration options
    // });


    CKEDITOR.on('dialogDefinition', function (event) {
      var editor = event.editor;
      var dialogDefinition = event.data.definition;
      var dialogName = event.data.name;

      var cleanUpFuncRef = CKEDITOR.tools.addFunction(function () {
        // Do the clean-up of filemanager here (called when an image was selected or cancel was clicked)
        $('#fm-iframe').remove();
        $("body").css("overflow-y", "scroll");
      });

      var tabCount = dialogDefinition.contents.length;
      for (var i = 0; i < tabCount; i++) {
        var dialogTab = dialogDefinition.contents[i];
        if (!(dialogTab && typeof dialogTab.get === 'function')) {
          continue;
        }

        var browseButton = dialogTab.get('browse');
        if (browseButton !== null) {
          browseButton.hidden = false;
          browseButton.onClick = function (dialog, i) {
            editor._.filebrowserSe = this;
            var iframe = $("<iframe id='fm-iframe' class='fm-modal'/>").attr({
              src: '/admin/filemanager/index.html' + // Change it to wherever  Filemanager is stored.
                '?CKEditorFuncNum=' + CKEDITOR.instances[event.editor.name]._.filebrowserFn +
                '&CKEditorCleanUpFuncNum=' + cleanUpFuncRef +
                '&langCode=en' +
                '&CKEditor=' + event.editor.name
            });

            $("body").append(iframe);
            $("body").css("overflow-y", "hidden");  // Get rid of possible scrollbars in containing document
          }
        }
      }
    });

    CKEDITOR.on('instanceReady', function(ev) {
      var editor = ev.editor;
      editor.dataProcessor.htmlFilter.addRules({
          elements : {
              a : function( element ) {
                  if ( !element.attributes.rel ){
                      //gets content's a href values
                      var url = element.attributes.href;
  
                      //extract host names from URLs (IE safe)
                      var parser = document.createElement('a');
                      parser.href = url;
  
                      var hostname = parser.hostname;
                      if ( hostname !== window.location.host) {
                          element.attributes.rel = 'nofollow';
                          //element.attributes.target = '_blank';
                      }
                  }
              }
          }
      });
  })

    const editors = $(context).find('.editor');
    if (editors.length > 0) {
      $.each(editors, (index, editor) => {
        try {
          CKEDITOR.replace($(editor)[0], {
            language: 'en',
            filebrowserBrowseUrl: '/admin/filemanager/index.html'
            // filebrowserBrowseUrl: '/fs/dialog.php?type=2&editor=ckeditor&fldr=',
            // filebrowserUploadUrl: '/fs/dialog.php?type=2&editor=ckeditor&fldr=',
            // filebrowserImageBrowseUrl: '/fs/dialog.php?type=1&editor=ckeditor&fldr='
          });
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
});
