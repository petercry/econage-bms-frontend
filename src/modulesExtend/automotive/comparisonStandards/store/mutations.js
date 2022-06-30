import {
    SET_DEMO,
    SET_TEMP_OBJ,
    SET_TYPE_LIST,
    SET_SUBCLASS_LIST,
    SET_NATURE_LIST,
    SET_VEHICLE_LIST,
    SET_AUTHENTICATION_LIST,
    SET_APLICABLEMODELS,
    SET_POWER_TYPE,
    SET_STANDARD_STATE,
    SET_STATUS_SET  
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [SET_TYPE_LIST](state, arr) {
        state.typeList = arr;
    },
    [SET_SUBCLASS_LIST](state,obj) {
        state.subClassList[obj.name] = obj.data;
    },
    [SET_NATURE_LIST](state, arr) {
        state.natureList = arr;
    },
    [SET_VEHICLE_LIST](state, arr) {
        state.vehicleList = arr;
    },
    [SET_AUTHENTICATION_LIST](state, arr) {
        state.authenticationList = arr;
    },
    [SET_APLICABLEMODELS](state,arr){
        state.applicableModels = arr;
    },
    [SET_POWER_TYPE](state,arr){
        state.powerType = arr;
    },
    [SET_STANDARD_STATE](state, arr) {
        state.standardState = arr;
    },
    [SET_STATUS_SET](state, obj) {
        state.statusSet = obj;
    },
}
