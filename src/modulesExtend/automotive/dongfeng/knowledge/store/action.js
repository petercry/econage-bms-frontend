import {getEnumSelectEnabled} from '../api/common.js'
import {
    SET_ACTIVITY_TYPE,
    SET_PROJECT_LIST,
    SET_ACTIVITY_LIST
} from './mutation-types.js'
const actions = {
    setActivityType({commit}){
        return new Promise((resolve, reject) => {
            getEnumSelectEnabled("faw_mh_activity_type").then(data => {
                commit(SET_ACTIVITY_TYPE,data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    // setProjectList({commit}){
    //     return new Promise((resolve, reject) => {
    //         getProjectList().then(data => {
    //             commit(SET_PROJECT_LIST,data.rows);
    //             resolve()
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // },
    // setActivityList({commit}){
    //     return new Promise((resolve, reject) => {
    //         getActivityList().then(data => {
    //             commit(SET_ACTIVITY_LIST,data.rows);
    //             resolve()
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // }
}

export default actions
