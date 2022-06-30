import {
    SET_POWER_TYPE,
    SET_APLICABLEMODELS,
    SET_ISAPPLICABLE,
    SET_AVAilABLE,
    SET_DISCHARGE_STAGELIST,
    SET_MODELNAME_LIST,
    SET_TEMP_OBJ,
    SET_APPLICATION_CATEGORY,
    SET_COPESTATUS,
    SET_STATUS_LIST,
    SET_SPOTINREGULATION_STATUS,
    SET_TYPE_LIST,
    SET_SUBCLASS_LIST,
    SET_NATURE_LIST,
    SET_VEHICLE_LIST,
    SET_AUTHENTICATION_LIST,
    SET_STANDARD_STATE,
    SET_STATUS_SET,
    SET_SPOTCHECK_STATUS,
    SET_RESPOND_LIST,
    SET_DFHANDLINGINTERFACE_LIST,
    SET_PROFESSION,
    SET_RESULTENUM_LIST
} from './mutation-types.js'

export default{
    [SET_POWER_TYPE](state,arr){
        state.powerType = arr;
    },
    [SET_APLICABLEMODELS](state,arr){
        state.applicableModels = arr;
    },
    [SET_ISAPPLICABLE](state,arr){
        state.isApplicable = arr;
    },
    [SET_AVAilABLE](state,arr){
        state.available = arr;
    },
    [SET_DISCHARGE_STAGELIST](state,arr){
        state.dischargeStageList = arr;
    },
    [SET_MODELNAME_LIST](state,arr){
        state.modelNameList = arr;
    },
    [SET_TEMP_OBJ](state, tempObj) {
        state.tempObj = tempObj;
    },
    [SET_APPLICATION_CATEGORY](state,arr){
        state.ApplicationCategory = arr;
    },
    [SET_COPESTATUS](state,obj){
        state.copeStatus = obj;
    },
    [SET_STATUS_LIST](state,obj){
        state.statusList = obj;
    },
    [SET_SPOTINREGULATION_STATUS](state,obj){
        state.spotInRegulationStatus = obj;
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
    [SET_STANDARD_STATE](state, arr) {
        state.standardState = arr;
    },
    [SET_STATUS_SET](state, obj) {
        state.statusSet = obj;
    },
    [SET_SPOTCHECK_STATUS](state,obj){
        state.spotCheckStatus = obj;
    },
    [SET_RESPOND_LIST](state,obj){
        state.respondList=obj;
    },
    [SET_DFHANDLINGINTERFACE_LIST](state,obj){
        state.dfHandlingInterfaceList =obj
    },
    [SET_PROFESSION](state,arr){
        state.professionList = arr;
    },
    [SET_RESULTENUM_LIST](state,obj){
        state.resultEnumList = obj
    }
    
}
