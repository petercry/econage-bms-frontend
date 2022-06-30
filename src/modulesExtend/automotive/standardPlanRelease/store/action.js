import {getEnumSelectEnabled,getTreeSelectEnabled,planPublishStateFlow,planPublishPhaseStatus} from '../service/service.js'
import {
    SET_STATEFLOW_LIST,
    SET_PHASE_STATUS_LIST,
    SET_STANDARD_TYPE,
    SET_EDIT_TYPE,
    SET_PROGRAM_SOURCE,
    SET_FIVEASPECTS_FIELD,
    SET_APPLICA_CARTYPE,
    SET_APPLICATION_FIELD,
    SET_APPLICABLE_PROJECT
} from  './mutation-types.js'
export default {   
    setStateFlow({commit}){
        //所有节点审批状态
        return new Promise((resolve,reject)=>{
            planPublishStateFlow().then(res=>{
                commit(SET_STATEFLOW_LIST,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setPhaseStatus({commit}){
        //审批状态
        return new Promise((resolve,reject)=>{
            planPublishPhaseStatus().then(res=>{
                commit(SET_PHASE_STATUS_LIST,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setStandardType({commit}){
        //标准分类
        return new Promise((resolve,reject)=>{
            getTreeSelectEnabled('esProgramClass').then(res=>{
                commit(SET_STANDARD_TYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setEditType({commit},action='create-enabled'){
        //制修订
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1372800315492569089',action).then(res=>{
                commit(SET_EDIT_TYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setProGramSource({commit},action='create-enabled'){
        //规划来源
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('esProgramSource',action).then(res=>{
                commit(SET_PROGRAM_SOURCE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        }) 
    },
    setFiveAspectsField({commit},action='create-enabled'){
      //五化领域
      return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('esProgramFive',action).then(res=>{
                commit(SET_FIVEASPECTS_FIELD,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setApplicaCarType({commit},action='create-enabled'){
        //应用车型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('esProgramAppCarType',action).then(res=>{
                commit(SET_APPLICA_CARTYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setAppliCationField({commit},action='create-enabled'){
          //应用领域
          return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('esProgramAppField',action).then(res=>{
                commit(SET_APPLICATION_FIELD,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setApplicablePro({commit},action='create-enabled'){
            //适用项目
            return new Promise((resolve,reject)=>{
                getEnumSelectEnabled('esProgramAppProject',action).then(res=>{
                    commit(SET_APPLICABLE_PROJECT,res.data);
                    resolve();
                }).catch(err=>{
                    reject(err);
                })
            })
    },  
    
}
