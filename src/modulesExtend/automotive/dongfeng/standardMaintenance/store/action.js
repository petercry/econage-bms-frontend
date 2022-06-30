import {getEnumSelectEnabled,getTreeSelectEnabled,planPublishPhaseStatus} from '../service/service.js'
import {SET_OPERATION_TYPE,SET_STANDARD_TYPE,SET_PLAN_TYPE,SET_EDIT_TYPE,SET_PLANSTATUS_LIST} from  './mutation-types.js'
export default {
    setOperationType( {commit} , action='create-enabled'){
        //调整类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1374984805560344577',action).then(res=>{
                commit(SET_OPERATION_TYPE,res.data)
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
    setPlanType({commit},action='create-enabled'){
        //计划类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1374925683821371393',action).then(res=>{
                commit(SET_PLAN_TYPE,res.data)
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
    setPlanStatus({commit}){
        //当前审批状态
        return new Promise((resolve,reject)=>{
            planPublishPhaseStatus().then(res=>{
                commit(SET_PLANSTATUS_LIST,res.data.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
}