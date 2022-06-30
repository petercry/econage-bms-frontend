import {getEnumSelectEnabled,getRoleBtnSetting} from '../service/service.js'
import {
    SET_TERM_TYPE,
    SET_PROFESSION,
    SET_BTNROLE_MAP
} from './mutation-types.js'
import { resolve } from 'url';
import { rejects } from 'assert';
export default {
    setTermType({commit},action='create-enabled'){
        //类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('01',action).then(res=>{
                commit(SET_TERM_TYPE,res.data);
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
    setBtnRoleMap({commit}){
        //管理员权限
        return new Promise((resolve,reject)=>{
            const btn_array = ['ext_dongfeng_term_manage_term_manage_insert',
            'ext_dongfeng_term_manage_term_manage_update',
            'ext_dongfeng_term_manage_term_manage_disable',
            'ext_dongfeng_term_manage_term_manage_export',
            'ext_dongfeng_term_manage_term_manage_import',
            ];
            getRoleBtnSetting(btn_array).then((res)=>{
                if(res.data){
                    commit(SET_BTNROLE_MAP,res.data.authenticationMap);
                    resolve();
                }
             }).catch(err=>{
                 reject(err);
             })
        })
    }
}
