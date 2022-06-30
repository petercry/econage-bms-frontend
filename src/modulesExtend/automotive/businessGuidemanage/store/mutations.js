import {
    SET_DEMO,
    SET_TEMP_OBJ,
    SET_EDIT_TYPE,
    SET_OPERATION_TYPE,
    SET_SUPPORT_STATUS,
    SET_SUPPORT_REVIEW,
    SET_STATEFLOW,
    SET_PHASE_STATUS,
    SET_USAGELIST,
    SET_EDITUSER,
    SET_REQUIEWMENT_COMPARELIST,
    SET_STATE_PLANFLOW,
    SET_PLAN_PHASE_STATUS
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [SET_EDIT_TYPE](state,arr){
        state.editType = arr;
    },
    [SET_OPERATION_TYPE](state,obj){
        state.operationType = obj;
    },
    [SET_SUPPORT_STATUS](state,obj){
        state.supportStatus = obj;
    },
    [SET_SUPPORT_REVIEW](state,obj){
        state.supportReview = obj;
    },
    [SET_STATEFLOW](state,obj){
        state.stateFlow = obj;
    },
    [SET_PHASE_STATUS](state,obj){
        state.phaseStatus = obj;
    },
    [SET_USAGELIST](state,arr){
        state.usageList = arr;
    },
    [SET_EDITUSER](state,obj){
        state.editUser = obj;
    },
    [SET_REQUIEWMENT_COMPARELIST](state,arr){
        state.requirementCompareList = arr;
    },
    [SET_STATE_PLANFLOW](state,obj){
        state.statePlanFlow = obj;
    },
    [SET_PLAN_PHASE_STATUS](state,obj){
        state.planPhaseStatus = obj;
    }
}
