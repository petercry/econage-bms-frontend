import {
    SET_TEMP_OBJ,
    SET_OPERATION_TYPE,
    SET_STANDARD_TYPE,
    SET_PLAN_TYPE,
    SET_EDIT_TYPE,
    SET_PLANSTATUS_LIST,
    SET_PROGRAM_SOURCE
} from './mutation-types.js'

export default {
    [SET_TEMP_OBJ](state, tempObj) {
        state.tempObj = tempObj;
    },
    [SET_OPERATION_TYPE](state, arr) {
        state.operationType = arr;
    },
    [SET_STANDARD_TYPE](state, arr) {
        state.standardType = arr;
    },
    [SET_PLAN_TYPE](state, arr) {
        state.planType = arr;
    },
    [SET_EDIT_TYPE](state, arr) {
        state.editType = arr;
    },
    [SET_PLANSTATUS_LIST](state, arr) {
        state.planStatusList = arr;
    },
    [SET_PROGRAM_SOURCE](state, arr) {
        state.programSource = arr;
    }
}
