import {getTreeSelectEnabled,resultEnum,dfHandlingInterfaceEnum,respondEnum,spotCheckStatusEnum,regulationtrackStatusSet,getEnumSelectEnabled,productioncarVcmenum,spotStandrTypeEnum,spotInRegulationTypeEnum} from '../service/service.js'
import {
    SET_POWER_TYPE,
    SET_APLICABLEMODELS,
    SET_ISAPPLICABLE,
    SET_AVAilABLE,
    SET_DISCHARGE_STAGELIST,
    SET_MODELNAME_LIST,
    SET_APPLICATION_CATEGORY,
    SET_COPESTATUS,
    SET_STATUS_LIST,
    SET_SPOTINREGULATION_STATUS,
    SET_TYPE_LIST,
    SET_SUBCLASS_LIST,
    SET_NATURE_LIST,
    SET_VEHICLE_LIST,
    SET_AUTHENTICATION_LIST,
    SET_STANDARD_STATE,
    SET_STATUS_SET,
    SET_SPOTCHECK_STATUS,
    SET_RESPOND_LIST,
    SET_DFHANDLINGINTERFACE_LIST,
    SET_PROFESSION,
    SET_RESULTENUM_LIST
} from  './mutation-types.js'
export default {
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
    setApplicable({commit},action='create-enabled'){
        //公告是否适用
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1399548523874754561',action).then(res=>{
                commit(SET_ISAPPLICABLE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setAvailable({commit},action='create-enabled'){
        //是否有效
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1399548768784359425',action).then(res=>{
                commit(SET_AVAilABLE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setDischarge({commit},action='create-enabled'){
        // 排放阶段
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('PFJD',action).then(res=>{
                commit(SET_DISCHARGE_STAGELIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setModelName({commit},action='create-enabled'){
        // 车辆类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('CNAME',action).then(res=>{
                commit(SET_MODELNAME_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    //申请检验类别
    setApplicationCategory({commit},action='create-enabled'){
        //是否有效
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1402202637523939329',action).then(res=>{
                commit(SET_APPLICATION_CATEGORY,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setCopestatus({commit}){
        //应对状态
        return new Promise((resolve,reject)=>{
            productioncarVcmenum().then(res=>{
                commit(SET_COPESTATUS,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setStatus({commit}){
        //状态
        return new Promise((resolve,reject)=>{
            spotStandrTypeEnum().then(res=>{
                commit(SET_STATUS_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setSpotInRegulationStatus({commit}){
        //状态
        return new Promise((resolve,reject)=>{
            spotInRegulationTypeEnum().then(res=>{
                commit(SET_SPOTINREGULATION_STATUS,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },

    setTypeList({commit}){
        //类别
        return new Promise((resolve,reject)=>{
            // getEnumSelectEnabled('1111').then(res=>{
            //     commit(SET_TYPE_LIST,res.data);
            //     resolve();
            // }).catch(err=>{
            //     reject(err);
            // })
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
    setSpotCheckStatus({commit}){
        //点检状态
        return new Promise((resolve,reject)=>{
            spotCheckStatusEnum().then(res=>{
                commit(SET_SPOTCHECK_STATUS,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setRespond({commit}){
        //是否应对
        return new Promise((resolve,reject)=>{
            respondEnum().then(res=>{
                commit(SET_RESPOND_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setDfhandLing({commit}){
        //符合性
        return new Promise((resolve,reject)=>{
            dfHandlingInterfaceEnum().then(res=>{
                commit(SET_DFHANDLINGINTERFACE_LIST,res.data);
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
    setResultState({commit}){
        //审批状态
        return new Promise((resolve,reject)=>{
            resultEnum().then(res=>{
                commit(SET_RESULTENUM_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },

}
