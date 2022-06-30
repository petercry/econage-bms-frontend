(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var selectFunc= {
            exec:function(editor){
                // alert("这是自定义按钮");
                var url = '/wh/jsp/version3/flow/index.html#/selectBacklogFlow';
                window.parent.sysvm.openDialog('关联模块',url,1000,500)
                // console.log(editor)
            }
        },
        //Section 2 : 创建自定义按钮、绑定方法
        selectDbFlow='selectDbFlow';
    CKEDITOR.plugins.add(selectDbFlow,{
        init:function(editor){
            editor.addCommand(selectDbFlow,selectFunc);
            editor.ui.addButton('selectDbFlow',{
                label:'待办流程',
                icon: this.path + 'dbFlow.png',
                command:selectDbFlow
            });
        }
    });
})();