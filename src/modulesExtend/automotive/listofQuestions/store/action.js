import {getEnumSelectEnabled} from '../service/service.js'
import {
    SET_REVISIONTYPE
} from  './mutation-types.js'
export default {
    setRevisiontype({commit},action='create-enabled'){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1372800315492569089',action).then(res=>{
                commit(SET_REVISIONTYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
