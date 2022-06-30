import {getEnumSelectEnabled} from '../service/service.js'
import {
    SET_TYPE_LIST
} from  './mutation-types.js'
export default {
    setTypeList({commit},action='create-enabled'){
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('CM01',action).then(res=>{
                commit(SET_TYPE_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
