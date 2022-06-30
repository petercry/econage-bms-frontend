(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var relevanceFunc= {
            exec:function(editor){
                // alert("这是自定义按钮");
                var url = '/wh/jsp/version3/flow/index.html#/selectMyFlow';
                window.parent.sysvm.openDialog('关联模块',url,1000,500)
                // console.log(editor)
            }
        },
        //Section 2 : 创建自定义按钮、绑定方法
        relevanceButton='relevanceButton';
    CKEDITOR.plugins.add(relevanceButton,{
        init:function(editor){
            editor.addCommand(relevanceButton,relevanceFunc);
            editor.ui.addButton('relevanceButton',{
                label:'我发起的流程',
                icon: this.path + 'workflow.png',
                command:relevanceButton
            });
        }
    });
})();