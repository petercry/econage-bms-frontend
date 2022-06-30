CKEDITOR.plugins.add('ecoFile', {
  hidpi: true,
  onLoad: function () {
    // Register styles for placeholder widget frame.
    CKEDITOR.addCss(`
    .cke_widget_wrapper_ecofile{display: inline-block;margin:0px 5px;}
    .ecofile{
      display: flex;
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 5px;
      width: 300px;
      height:40px;
    }
    .ecofile .left{
      flex: 1;
      width: 240px;
    }
    ` );
  },

  init: function (editor) {
      // 在toolbar中添加上传图片的插件按钮
      editor.ui.addButton( 'ecoFile', {
          label: '上传文件', // 调用时显示的名称
          command: 'ecoFile',
          toolbar: 'insert',
          icon: this.path + 'logo_ckeditor.png' // 在toolbar中的图标
      });
      window.aaa = function () {
        console.log(21332);
      }
      editor.widgets.add('ecofile', {
        init: function (res) {
          editor.aa = function () {
            console.log(123123);
          }
          console.log(editor)
         // code here that generates the HTML
        },

        data: function (res) {
          console.log(this)
          let editorHtml = `<span class="left">
            <i class="${this.data.fileIcon} fileType"> </i>
            <span class="fileName">${this.data.name}</span>
            <span class="fileSize">${this.data.size}</span>
            </span><span class="right">
              <i onclick="try{window.parent.filePreview('${this.data.fileId}','${this.data.name}')}catch(e){window.filePreview('${this.data.fileId}','${this.data.name}')}" class="iconfont icon-visibility"> </i><i onclick="try{window.parent.fileDownload('${this.data.fileId}','${this.data.name}')}catch(e){window.fileDownload('${this.data.fileId}','${this.data.name}')}" class="iconfont icon-download"> </i>
            </span>`;
          this.element.setHtml(editorHtml);
				},
        template: "<span class='ecofile'></span>"
       });
      editor.addCommand('ecoFile', {
        exec: function () {
          try {
            window.ckeditorVm.fileBtnClick();
          } catch (e) {
            window.parent.ckeditorVm.fileBtnClick();
          }
            //  // 获取富文本中选中的文本
            //  var text = editor.getSelection().getSelectedText();
            //  /**
            //  * 页面中要有一个form，向引入的页面中的form中添加一个input：
            //  * <input type="file" id="uploadFile" style="display: none" />
            //  **/
            //  var input = document.createElement( 'input' );
            //  input.setAttribute("type", "file");
            //  input.setAttribute("id", "uploadFile");
            //  input.style.display = 'none';
            //  document.getElementsByTagName("form")[0].prepend(input);

            //  // 上传文件
            //  $("#uploadFile").unbind("change").on('change', function() {
            //      if(flag) {
            //          alert("正在上传文件，请稍后再试");
            //          return;
            //      }
            //      flag = true;
            //      var formData = new FormData();
            //      formData.append("file",  $("#uploadFile")[0].files[0]);

            //      $.ajax({
            //          type: 'POST',
            //          url: '/api/file-manager/uploader/chunk/save/WF_ATTACHMENT',
            //          data: formData,
            //          re
            //          cache: false,
            //          processData: false,
            //          contentType: false,
            //          success: function(result) {
            //              if(result.successFlag) {
            //                  alert("文件上传成功");
            //                  // 将我们选择的文本替换成超链接
            //                  var a = editor.document.createElement( 'a' );
            //                // 将返回的文件名拼接到超链接的href中，当我们在页面中点击超链接时可以下载文件
            //                  a.setAttribute("href", "/api/common/downloadFile/"+result.data);
            //                  a.setText(text);
            //                  editor.insertElement(a);
            //              } else {
            //                  alert(result.data);
            //              }
            //          },
            //          error: function () {
            //              alert("文件上传失败！");
            //          },
            //          complete: function () {
            //              flag = false;
            //          }
            //      });
            //  });

            //  $("#uploadFile").click();
         }
      });
  }
});
