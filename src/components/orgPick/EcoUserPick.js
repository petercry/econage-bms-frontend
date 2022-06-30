import {EcoUtil} from '@/components/util/main.js'
const EcoUserPick = function(options,callback) {

};

EcoUserPick.searchReceiver = (key,callback) => {
    let url = '/hr/index.html#/orgUserSelect/'+key;
    window.callBackUserSelectDialogFunc = function(cbData){
        if(cbData.action == 'userSelectCallBack'){
            EcoUserPick.setReceiverData(cbData.data,callback);
        }
    }
    EcoUtil.getSysvm().openDialog('选择人员或组织',url,700,550,'8vh');
};

EcoUserPick.searchReceiverByEnv = (key,callback) => {
    let url = window.location.origin+'/#/env/orgUserSelect/'+key;
    window.callBackUserSelectDialogFunc = function(cbData){
        if(cbData.action == 'userSelectCallBack'){
            EcoUserPick.setReceiverData(cbData.data,callback);
        }
    }
    EcoUtil.getSysvm().openDialog('选择人员或组织',url,700,550,'8vh');
};

EcoUserPick.setReceiverData = (cbData,callback) => {
    EcoUtil.getSysvm().closeDialog();
    callback(cbData);
};


EcoUserPick.getSelectType = (selectType) => {
    if(Number(selectType) == 0){
        return 'Dept-User';
    }else if(Number(selectType) == 1){
        return  'User';
    }else if(Number(selectType) == 2){
        return  'Dept';
    }else{
        return 'User'
    }
}

export default EcoUserPick;
export { EcoUserPick };
