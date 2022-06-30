import {
    SET_TEMP_OBJ,
    SET_STATUS_MENU,
    SET_OPERATE_MENU
} from './mutation-types.js'

export default {
    [SET_TEMP_OBJ](state, tempObj) {
        state.tempObj = tempObj;
    },
    [SET_STATUS_MENU](state,obj){
        state.statusMenu = obj;
    },
    [SET_OPERATE_MENU](state,obj){
        state.operateMenu = obj
    }
}
