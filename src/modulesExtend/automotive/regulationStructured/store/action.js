import {getTreeSelectEnabled,getEnumSelectEnabled,regulationtrackStatusSet,structurebaseFuncGroupList} from '../service/service.js'
import {
    SET_TYPE_LIST,
    SET_SUBCLASS_LIST,
    SET_NATURE_LIST,
    SET_VEHICLE_LIST,
    SET_AUTHENTICATION_LIST,
    SET_APLICABLEMODELS,
    SET_POWER_TYPE,
    SET_STANDARD_STATE,
    SET_STATUS_SET,
    SET_GAS_LIST,
    SET_REGULATORY_REQUIREMENTS_TYPE,
    SET_ARTICLE_TYPE,
    SET_DELIVERABLE,
    SET_FUNCTION_GROUP_MAP,
    SET_PROFESSION
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
    setGasList({commit},action='create-enabled'){
        //标准状态
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1119',action).then(res=>{
                commit(SET_GAS_LIST,res.data);
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
    setRegulatoryRequirementsType({commit},action='create-enabled'){
        //法规要求类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('FG001',action).then(res=>{
                commit(SET_REGULATORY_REQUIREMENTS_TYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setArticleType({commit},action='create-enabled'){
        //条文类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('FGFL',action).then(res=>{
                commit(SET_ARTICLE_TYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setDeliverable({commit},action='create-enabled'){
        //交付物
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('FG002',action).then(res=>{
                commit(SET_DELIVERABLE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setFunctionGroupMap({commit},params){
        //功能分组
        params||(
            params={
                page:1,
                rows: 10
            }
        )
        return new Promise((resolve,reject)=>{
            structurebaseFuncGroupList(params).then(res=>{
                commit(SET_FUNCTION_GROUP_MAP,res);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setProfession({commit},action='create-enabled'){
        //专业
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1372459642503467009',action).then(res=>{
                commit(SET_PROFESSION,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },

}
