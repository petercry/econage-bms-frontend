import {
    SET_DEMO,
    SET_TEMP_OBJ,
    SET_STANDARD_TYPE,
    SET_STANDARD_STATUS_NAME,
    REVISION_TYPE_NAME,
    PARTICIPATION_FORM_LIST,
    GB_TYPE_LIST,
    SET_ADMIN_ROLE,
    SET_PROFESSION_LIST
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [SET_STANDARD_TYPE](state,arr){
        state.standardTypeList=arr;
    },
    [SET_STANDARD_STATUS_NAME](state,arr){
        state.standardStatusNameList=arr;
    },
    [REVISION_TYPE_NAME](state,arr){
        state.revisionTypeNameList=arr;
    },
    [PARTICIPATION_FORM_LIST](state,arr){
        state.participationFormList=arr;
    },
    [GB_TYPE_LIST](state,arr){
        state.GbTypeList=arr;
    },
    [SET_ADMIN_ROLE](state,bool){
        state.adminRole = bool;
    },
    [SET_PROFESSION_LIST](state,arr){
        state.professionList = arr;
    }
}
