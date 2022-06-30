import {planPublishPhaseStatus,planPublishStateFlow,getUserSelfInfo,getEnumSelectEnabled,getOperationTypeList,getSupportStatusList,supportReviewConclusion,supportStateFlow,supportPhaseStatus} from '../service/service.js'
import {
    SET_EDIT_TYPE,
    SET_OPERATION_TYPE,
    SET_SUPPORT_STATUS,
    SET_SUPPORT_REVIEW,
    SET_STATEFLOW,
    SET_PHASE_STATUS,
    SET_USAGELIST,
    SET_EDITUSER,
    SET_REQUIEWMENT_COMPARELIST,
    SET_STATE_PLANFLOW,
    SET_PLAN_PHASE_STATUS
} from  './mutation-types.js'
export default { 
    setEditType({commit},action='create-enabled'){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1372800315492569089',action).then(res=>{
                commit(SET_EDIT_TYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setOperationType({commit}){
        return new Promise((resolve,reject)=>{
            getOperationTypeList().then(res=>{
                commit(SET_OPERATION_TYPE,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setsupportStatus({commit}){
        return new Promise((resolve,reject)=>{
            getSupportStatusList().then(res=>{
                commit(SET_SUPPORT_STATUS,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setSupportReview({commit}){
        return new Promise((resolve,reject)=>{
            supportReviewConclusion().then(res=>{
                commit(SET_SUPPORT_REVIEW,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setStateFlow({commit}){
        return new Promise((resolve,reject)=>{
            supportStateFlow().then(res=>{
                commit(SET_STATEFLOW,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setPhaseStatus({commit}){
        return new Promise((resolve,reject)=>{
            supportPhaseStatus().then(res=>{
                commit(SET_PHASE_STATUS,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setUsageList({commit},action='create-enabled'){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('shiyongqingkuang',action).then(res=>{
                commit(SET_USAGELIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    getUserInfo({commit}){
        return new Promise((resolve,reject)=>{
            getUserSelfInfo().then(res=>{
                commit(SET_EDITUSER,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setRequirementCompare({commit},action='create-enabled'){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('FSD-XQBJ',action).then(res=>{
                commit(SET_REQUIEWMENT_COMPARELIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setStatePlanFlow({commit}){
        return new Promise((resolve,reject)=>{
            planPublishStateFlow().then(res=>{
                commit(SET_STATE_PLANFLOW,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setPlanPhaseStatus({commit}){
        return new Promise((resolve,reject)=>{
            planPublishPhaseStatus().then(res=>{
                commit(SET_PLAN_PHASE_STATUS,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
}
