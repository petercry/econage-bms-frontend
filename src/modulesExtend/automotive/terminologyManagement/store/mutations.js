import {
    SET_DEMO,
    SET_TERM_TYPE,
    SET_PROFESSION,
    SET_TEMP_OBJ,
    DELETE_TEMP_OBJ,
    SET_BTNROLE_MAP

} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [SET_TERM_TYPE](state,arr){
        state.termTypeList=arr;
    },
    [SET_PROFESSION](state,arr){
        state.professionList = arr;
    },
    [DELETE_TEMP_OBJ](state,key){
        delete  state.tempObj[key+''];
    },
    [SET_BTNROLE_MAP](state,obj){
        state.btnRoleMap = obj;
    }
}
