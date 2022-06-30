import {getEnumSelectEnabled,getRoleExistsUnionRef} from '../service/service.js'
import {
    SET_STANDARD_TYPE,
    SET_STANDARD_STATUS_NAME,
    REVISION_TYPE_NAME,
    PARTICIPATION_FORM_LIST,
    GB_TYPE_LIST,
    SET_ADMIN_ROLE,
    SET_PROFESSION_LIST
} from './mutation-types.js'
export default {
    setProfession({commit},action='create-enabled'){
        //领域
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('LY0001',action).then(res=>{
                commit(SET_PROFESSION_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setStandardType({commit},action='create-enabled'){
        //标准类型
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1371283132551729153',action).then(res=>{
                commit(SET_STANDARD_TYPE,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setStandardStatusName({commit},action='create-enabled'){
        //标准颁布状态
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1371283221047349250',action).then(res=>{
                commit(SET_STANDARD_STATUS_NAME,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setRevisionTypeNameList({commit},action='create-enabled'){
        //制/修订
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1371283282024140801',action).then(res=>{
                commit(REVISION_TYPE_NAME,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setParticipationForm({commit},action='create-enabled'){
        //参与形式
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1371283318661386242',action).then(res=>{
                commit(PARTICIPATION_FORM_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setGbType({commit},action='create-enabled'){
        //类别
        return new Promise((resolve,reject)=>{
            getEnumSelectEnabled('1371283505781870593',action).then(res=>{
                commit(GB_TYPE_LIST,res.data);
                resolve();
            }).catch(err=>{
                reject(err);
            })
        })
    },
    setAdmin({commit}){
       //管理员权限
       return new Promise((resolve,reject)=>{
           //管理员权限组
           getRoleExistsUnionRef('1368748961459478530').then(res=>{
                commit(SET_ADMIN_ROLE,res.data);
                resolve();
            }).catch(err=>{
                reject(err)
            })
       })
    }
}
