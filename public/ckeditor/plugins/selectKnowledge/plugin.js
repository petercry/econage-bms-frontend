(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var selectFunc= {
            exec:function(editor){
                var url = '/wh/jsp/version3/knowledge/index.html#/selectKnowledgePortal';
                window.parent.sysvm.openDialog('',url,1200,500)
                // console.log(editor)
            }
        },
        //Section 2 : 创建自定义按钮、绑定方法
        selectKnowledge='selectKnowledge';
    CKEDITOR.plugins.add(selectKnowledge,{
        init:function(editor){
            editor.addCommand(selectKnowledge,selectFunc);
            editor.ui.addButton('selectKnowledge',{
                label:'知识库',
                icon: this.path + 'knowledge.jpg',
                command:selectKnowledge
            });
        }
    });
})();