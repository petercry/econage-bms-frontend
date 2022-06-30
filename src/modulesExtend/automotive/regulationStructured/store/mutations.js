import {
    SET_TEMP_OBJ,
    SET_TYPE_LIST,
    SET_SUBCLASS_LIST,
    SET_NATURE_LIST,
    SET_VEHICLE_LIST,
    SET_AUTHENTICATION_LIST,
    SET_APLICABLEMODELS,
    SET_POWER_TYPE,
    SET_STANDARD_STATE,
    SET_STATUS_SET,
    DELETE_TEMP_OBJ,
    SET_GAS_LIST,
    SET_REGULATORY_REQUIREMENTS_TYPE,
    SET_ARTICLE_TYPE,
    SET_DELIVERABLE,
    SET_FUNCTION_GROUP_MAP,
    SET_PROFESSION
} from './mutation-types.js'

export default {
    [SET_TEMP_OBJ](state, tempObj) {
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
    [SET_APLICABLEMODELS](state, arr) {
        state.applicableModels = arr;
    },
    [SET_POWER_TYPE](state, arr) {
        state.powerType = arr;
    },
    [SET_STANDARD_STATE](state, arr) {
        state.standardState = arr;
    },
    [SET_STATUS_SET](state, obj) {
        state.statusSet = obj;
    },
    [DELETE_TEMP_OBJ](state, key) {
        delete state.tempObj[key + ''];
    },
    [SET_GAS_LIST](state, arr) {
        state.gasList = arr;
    },
    [SET_REGULATORY_REQUIREMENTS_TYPE](state,arr){
        state.RegulatoryRequirementsType = arr;
    },
    [SET_ARTICLE_TYPE](state,arr){
        state.articleType=arr;
    },
    [SET_DELIVERABLE](state,arr){
        state.deliverable = arr;
    },
    [SET_FUNCTION_GROUP_MAP](state,res){
        state.functionGroupMap.data = res.data.rows;
        state.functionGroupMap.total = res.data.total;
    },
    [SET_PROFESSION](state,arr){
        state.professionList = arr;
    },
}
