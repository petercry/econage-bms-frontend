import {getEnumSelectEnabled,getStatusAjax,projectPermission} from '../service/service.js'
import {SET_BASE_DATA_OBJ,SET_STATUS_LIST,SET_IMPORTANTTYPE_LIST,SET_REGULATORYCOMPLIANCE_LIST,SET_INIT_ROLE} from './mutation-types.js'

const actions = {
    setRole({commit},projectId=''){
        return new Promise((resolve, reject) => {
            projectPermission(projectId).then(res=>{
                commit(SET_INIT_ROLE,res.data);
                resolve();
            }).catch(err=>{
                reject();
            })
        })
    },
    initProjectBaseData({commit,state},action = 'select-enabled'){
        return new Promise((resolve, reject) => {
            const keys = Object.keys(state.baseData);
            let index_ = 0;
            keys.map((key,index)=>{
                getEnumSelectEnabled(key,action).then(response => {
                    let obj = {};
                    obj.key = key;
                    obj.array = response.data;
                    commit(SET_BASE_DATA_OBJ,obj);
                    index_++;
                    if(index_ == keys.length - 1){
                        resolve();
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        })
    },
    setStatus({commit}){
        return new Promise((resolve,reject)=>{
            getStatusAjax().then(res=>{
                commit(SET_STATUS_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject();
            })
        })
    },
    setImportantType({commit}){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled("ZYLX").then(res=>{
                commit(SET_IMPORTANTTYPE_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject();
            })
        })
    },
    setRegulatoryCompliance({commit}){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled("FGFHX").then(res=>{
                commit(SET_REGULATORYCOMPLIANCE_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject();
            })
        })
    },
}

export default actions
