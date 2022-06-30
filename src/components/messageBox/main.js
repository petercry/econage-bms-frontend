import { MessageBox } from 'element-ui';
const EcoMessageBox = function(options, callback) {

};

EcoMessageBox.alert = (message, title, options) => {
    try{
        if(window.ecoWFVm){
            window.ecoWFVm.showNtkoIframe = false;
        }
    }catch(e){}

    if(options && options.ntkoAlert){
        options.beforeClose = function(action, instance, done){
            try{
                if(window.ecoWFVm){
                    window.ecoWFVm.showNtkoIframe = true;
                }
            }catch(e){}
            done();
        }
    }

    if((window.parent!=window) && window.parent.sysvm && window.parent.sysvm.alert){
        window.parent.sysvm.alert(message, title, options);
    }else{
        MessageBox.alert(message,title,options);
    }
};


EcoMessageBox.confirm = (message,title,options,doFunc,cancelFunc) => {

    if((window.parent!=window) && window.parent.sysvm && window.parent.sysvm.confirm){

          //初始化window参数，必须
          window.callBackConfirmFunc = function(obj){
              if(obj.action == 'confirmActionYes'){
                  //回调确定
                  if(doFunc){
                      try{
                          doFunc();
                      }catch(error){}
                  }
              }else if(obj.action == 'confirmActionNo'){
                  // 回调取消
                  if(cancelFunc){
                      try{
                            cancelFunc();
                      }catch(error){}
                  }
              }
          }
          window.parent.sysvm.confirm(message,title,options);
    }else{
        MessageBox.confirm(message,title,options).then(()=>{
            
            if(doFunc){
                try{
                      doFunc();
                }catch(error){}
            }
        }).catch(()=>{
            if(cancelFunc){
                try{
                      cancelFunc();
                }catch(error){}
            }
        });
    }
};


EcoMessageBox.prompt = (message, title, options) => {

};



export default EcoMessageBox;
export { EcoMessageBox };
