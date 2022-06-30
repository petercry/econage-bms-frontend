import {getEnumSelectEnabled} from '../service/service.js'
import {
    SET_REVISIONTYPE
} from  './mutation-types.js'
export default{
    setRevisiontype({commit}){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1372800315492569089').then(res=>{
                commit(SET_REVISIONTYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
