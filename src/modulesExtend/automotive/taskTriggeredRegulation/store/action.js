import {getEnumSelectEnabled,getTreeSelectEnabled} from '../service/service.js'
import {
    SET_TYPE_LIST,
    SET_SUBCLASS_LIST,
    SET_STANDARD_STATE,
    SET_NATURE_LIST,
    SET_APLICABLEMODELS,
    SET_POWER_TYPE,
    SET_PRO_PLATFORM
} from  './mutation-types.js'
export default {
    setTypeList({commit}){
        //类别
        return new Promise((resolve,reject)=>{
            getTreeSelectEnabled('1002').then(res=>{
                commit(SET_TYPE_LIST,res.data);
                this.dispatch('setSubClassList',res.data)
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setSubClassList({commit},arr){
        //子类
        return new Promise((resolve,reject)=>{
            let _index = arr.length-1;
            arr.forEach((item,index)=>{
                getTreeSelectEnabled(item.id).then(res=>{
                    commit(SET_SUBCLASS_LIST,{name:item.id,data:res.data});
                    if(_index===index){
                        resolve();
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        })
    },
    setStandardState({commit},action='create-enabled'){
        //标准状态
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1118',action).then(res=>{
                commit(SET_STANDARD_STATE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setNatureList({commit},action='create-enabled'){
        //性质
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1113',action).then(res=>{
                commit(SET_NATURE_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setAplicableModelsList({commit},action='create-enabled'){
        //适用车型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1116',action).then(res=>{
                commit(SET_APLICABLEMODELS,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setPowerType({commit},action='create-enabled'){
        //动力类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1117',action).then(res=>{
                commit(SET_POWER_TYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setProPlatfForm({commit},action='create-enabled'){
        //所属平台
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('PRO_PLATFORM',action).then(res=>{
                commit(SET_PRO_PLATFORM,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })

    }
}
