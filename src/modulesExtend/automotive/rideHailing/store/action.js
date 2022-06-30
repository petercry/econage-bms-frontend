import {getEnumSelectEnabled,ridehailingStatus,ridehailingOperate} from '../service/service.js'
import {
    SET_STATUS_MENU,
    SET_OPERATE_MENU
} from  './mutation-types.js'
export default {   
    setStatusMenu({commit}){
        //状态
        return new Promise((resolve,reject)=>{
            ridehailingStatus().then(res=>{
                commit(SET_STATUS_MENU,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setOperateMenu({commit}){
        //操作类型
        return new Promise((resolve,reject)=>{
            ridehailingOperate().then(res=>{
                commit(SET_OPERATE_MENU,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
