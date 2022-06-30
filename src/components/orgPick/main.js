import axios from 'axios'
// let baseUrl = 'http://192.168.0.59:80';
let baseUrl = "";
if(window.sysSetting && window.sysSetting.baseUrl){
    baseUrl = window.sysSetting.baseUrl;
}else if(window.parent.sysSetting && window.parent.sysSetting.baseUrl){
    baseUrl = window.parent.sysSetting.baseUrl;
}else {
    baseUrl = '/api'
}
let basePageUrl = '';
const EcoOrgPick = function(options, callback) {

};
//获取已选
EcoOrgPick.loadByOrgIds = function(orgIds){
    let orgIdArray = []; 
    if (Object.prototype.toString.call(orgIds) === '[object Array]'){
        orgIdArray = orgIds;
    }
    if (Object.prototype.toString.call(orgIds) === '[object String]'){
        orgIdArray = orgIds.split(',')
    }
    if (orgIdArray.length==0){
        return ;
    } 
    return axios.get(baseUrl+'/org/tree-select',{
        params:{
            orgIds:orgIdArray.join(','),
            time:new Date().getTime()
        }
      }
    )
}

//获取已选
EcoOrgPick.loadByArr = function(arr,selectType,callback){
    if (arr.length==0){
        return ;
    } 
    let hasOrg = selectType.indexOf('Dept')>-1||selectType.indexOf('User')>-1||selectType.indexOf('Role')>-1;
    let hasRole = selectType.indexOf('Role')>-1;
    let hasGroup = selectType.indexOf('userGroup')>-1;
    if (hasOrg){
        let orgIdArray = arr.filter(item=>{
            return item.type!='USERGROUP'
        }).map(item=>{
            return item.orgId;
        })
        axios.get(baseUrl+'/org/tree-select',{
            params:{
                orgIds:orgIdArray.join(','),
                time:new Date().getTime()
            }
          }
        ).then(res=>{
            arr = arr.map(item=>{
                for (let i=0;i<res.data.length;i++){
                    if (item.orgId == res.data[i].orgId){
                        item.orgPath = res.data[i].orgPath;
                    }
                }
                return item;
            })
            if (callback){
                callback()
            }
        }).catch(()=>{})
    }
    if (hasGroup){
        axios.get(baseUrl+'/user-group/pagination',{
            params:{page:1,rows:9999,sort:'modDate',order:'desc'}
        }).then((res)=>{
            if (res.data&&res.data.rows){
                arr = arr.map(item=>{
                    for (let i=0;i<res.data.rows.length;i++){
                        if (item.linkId == res.data.rows[i].id){
                            item.orgPath = res.data.rows[i].name;
                        }
                    }
                    return item;
                })
            }
            if (callback){
                callback()
            }
        }).catch((error)=>{
        })
    }
    if (hasRole){
        axios.get(baseUrl+'/role/def',{
            params:{
                time:new Date().getTime()
            }
        }).then(res=>{
            arr = arr.map(item=>{
                for (let i=0;i<res.data.rows.length;i++){
                    if (item.role == res.data.rows[i].code){
                        item.roleName = res.data.rows[i].name;
                    }
                }
                return item;
            })
            if (callback){
                callback()
            }
        }).catch(()=>{})
    }
}


EcoOrgPick.searchReceiver = (options,callback)=>{
    let url = basePageUrl+'/hr/index.html#/orgSelect';
    let title = '选择人员或组织';
    let selectMulti = '1';  //是否多选
    let selectType = 'Dept';  //选择类型 Dept-User-Role-userGroup
    let selectDefault = '';
    let deptScopeType = ''; //BUSINESS， MANAGE
    if(options && options.title){
        title = options.title;
    }
    if(options && options.selectObj){
        window.parent.sysvm.orgSelectObj = options.selectObj;
    }
    if(options && options.selectMulti){
        selectMulti = options.selectMulti?'2':'1';
    }
    if(options && options.selectType){
        selectType = options.selectType;
    }
    if(options && options.selectDefault){
        selectDefault = options.selectDefault;
    }
    if(options && options.deptScopeType){
        deptScopeType = options.deptScopeType;
    }
    url+='/'+selectMulti+'/'+selectType+'?selectDefault='+selectDefault+'&deptScopeType='+deptScopeType;
    window.callBackUserSelectDialogFunc = function(org_obj){
        if(org_obj.action == 'userSelectCallBack'){
            EcoOrgPick.setReceiverData(org_obj.data,callback);
        }
    }
    window.parent.sysvm.openDialog(title,url,791,540,'20px');
}
EcoOrgPick.setReceiverData = (org_obj,callback) => {
   window.parent.sysvm.closeDialog();
   window.setReceiver = null;
   callback(org_obj);
};

export default EcoOrgPick;
export { EcoOrgPick };
