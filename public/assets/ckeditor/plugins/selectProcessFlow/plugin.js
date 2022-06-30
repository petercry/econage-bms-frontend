(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var selectFunc= {
            exec:function(editor){
                // alert("这是自定义按钮");
                var url = '/wh/jsp/version3/flow/index.html#/selectMyProcessFlow';
                window.parent.sysvm.openDialog('关联模块',url,1000,500)
                // console.log(editor)
            }
        },
        //Section 2 : 创建自定义按钮、绑定方法
        selectProcessFlow='selectProcessFlow';
    CKEDITOR.plugins.add(selectProcessFlow,{
        init:function(editor){
            editor.addCommand(selectProcessFlow,selectFunc);
            editor.ui.addButton('selectProcessFlow',{
                label:'经办流程',
                icon: this.path + 'flow.png',
                command:selectProcessFlow
            });
        }
    });
})();