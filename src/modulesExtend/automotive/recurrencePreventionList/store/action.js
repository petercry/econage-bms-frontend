import {getTreeSelectEnabled,getEnumSelectEnabled,getStatusEnum,getOperateEnum,regulationtrackStatusSet} from '../service/service.js'
import {
    SET_STATUS,
    SET_OPERATE,
    SET_TYPE_LIST,
    SET_SUBCLASS_LIST,
    SET_NATURE_LIST,
    SET_VEHICLE_LIST,
    SET_AUTHENTICATION_LIST,
    SET_APLICABLEMODELS,
    SET_POWER_TYPE,
    SET_STANDARD_STATE,
    SET_STATUS_SET
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
    setVehicleList({commit},action='create-enabled'){
        //整车/零部件
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1114',action).then(res=>{
                commit(SET_VEHICLE_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setAuthenticationList({commit},action='create-enabled'){
        //认证管理公告
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1115',action).then(res=>{
                commit(SET_AUTHENTICATION_LIST,res.data);
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
    setStatusSet({commit}){
        //自定义集合
        return new Promise((resolve,reject)=>{
            regulationtrackStatusSet().then(res=>{
                commit(SET_STATUS_SET,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setStatus({commit}){
        //状态
        return new Promise((resolve,reject)=>{
            getStatusEnum().then(res=>{
                commit(SET_STATUS,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setOperate({commit}){
        //操作类型
        return new Promise((resolve,reject)=>{
            getOperateEnum().then(res=>{
                commit(SET_OPERATE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
