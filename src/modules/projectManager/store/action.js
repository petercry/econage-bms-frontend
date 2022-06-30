import {getEnumSelectEnabled,getRoleListGroup,getPMModelRole,getActivityList,getUserSelfInfo} from '../api/common.js'
import {getRoleList} from '../api/role.js'
import {
    SET_BASE_DATA_OBJ,
    SET_MAJOR_TYPE,
    SET_ROLE_TYPE,
    SET_GROUP_TYPE,
    SET_ROLE_LIST,
    SET_DELIVER_TYPE,
    SET_ROLE_LIST_GROUP,
    SET_MILES_ROLE,
    SET_GROUP_ROLE,
    SET_MILES_TYPE,
    SET_ACTIVITY_LIST,
    SET_USER_INFO,
} from './mutation-types.js'
const actions = {
    initProjectBaseData({commit,state},action = 'select-enabled'){
        return new Promise((resolve, reject) => {
            const keys = Object.keys(state.baseData);
            let index_ = 0;
            keys.map((key,index)=>{
                getEnumSelectEnabled(key,action).then(data => {
                    let obj = {};
                    obj.key = key;
                    obj.array = data;
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
    initSomeBaseData({commit},{array = [],action = 'select-enabled'}){
        return new Promise((resolve, reject) => {
            let index_ = 0;
            array.forEach(element => {
                getEnumSelectEnabled(element,action).then(data => {
                    let obj = {};
                    obj.key = element;
                    obj.array = data;
                    commit(SET_BASE_DATA_OBJ,obj);
                    index_++;
                    if(index_ == array.length - 1){
                        resolve();
                    }
                }).catch(error => {
                    reject(error);
                })
            });
        })
    },
    setMajorType({commit}){
        return new Promise((resolve, reject) => {
            getEnumSelectEnabled("faw_pm_activity_type",'create-enabled').then(data => {
                commit(SET_MAJOR_TYPE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setRoleType({commit}){
        return new Promise((resolve, reject) => {
            getEnumSelectEnabled("faw_pm_role_type",'create-enabled').then(data => {
                commit(SET_ROLE_TYPE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setGroupType({commit}){
        return new Promise((resolve, reject) => {
            getEnumSelectEnabled("faw_pm_group_type",'create-enabled').then(data => {
                commit(SET_GROUP_TYPE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setRoleList({commit}){
        return new Promise((resolve, reject) => {
            getRoleList().then(data => {
                commit(SET_ROLE_LIST,data.rows);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setRoleListGroup({commit}){
        return new Promise((resolve, reject) => {
            getRoleListGroup().then(data => {
                commit(SET_ROLE_LIST_GROUP,data.rows);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setDeliverType({commit}){
        return new Promise((resolve, reject) => {
            getEnumSelectEnabled("faw_pm_deliv_type",'create-enabled').then(data => {
                commit(SET_DELIVER_TYPE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setMilesType({commit}){
        return new Promise((resolve, reject) => {
            getEnumSelectEnabled("faw_pm_milestone_type",'create-enabled').then(data => {
                commit(SET_MILES_TYPE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setMilesRole({commit},id){
        return new Promise((resolve, reject) => {
            getPMModelRole(id,'faw_pm_model_miles').then(data => {
                commit(SET_MILES_ROLE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setGroupRole({commit},id){
        return new Promise((resolve, reject) => {
            getPMModelRole(id,'faw_pm_model_group').then(data => {
                commit(SET_GROUP_ROLE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setActivityList({commit}){
        return new Promise((resolve, reject) => {
            getActivityList().then(data => {
                commit(SET_ACTIVITY_LIST,data?data.rows:[]);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    setUserInfo({commit}){
        return new Promise((resolve, reject) => {
            getUserSelfInfo().then(data => {
                commit(SET_USER_INFO,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default actions
