(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var a= {
            exec:function(editor){
                // alert("这是自定义按钮");
                var retVals = { content: null }
                var url = '/wh/jsp/version3/samplePlate/index.html#/selectMemo';
                window.parent.sysvm.openDialog('插入便签',url,800,700,retVals,function(data){
                    console.log(data)
                })

                // })
                //     {  //openDialog打开一个新窗口
                // title: '插入便签',
                // url: url,
                // height: 600,
                // width: 900,
                // callback:function(){

                // }
                // });
                console.log(editor)
            }
        },
        //Section 2 : 创建自定义按钮、绑定方法
        b='linkbutton';
    CKEDITOR.plugins.add(b,{
        init:function(editor){
            editor.addCommand(b,a);
            editor.ui.addButton('linkbutton',{
                label:'Link Button',
                icon: this.path + 'logo_ckeditor.png',
                command:b
            });
        }
    });
})();