import {
    SET_ACTIVITY_TYPE,
    SET_PROJECT_LIST,
    SET_ACTIVITY_LIST,
    SET_TEMP_OBJ,
    DELETE_TEMP_OBJ,
    SET_USER_INFO
} from './mutation-types.js'

export default{
    [SET_ACTIVITY_TYPE](state,array = []){
        state.activityType = array;
    },
    [SET_PROJECT_LIST](state,array = []){
        state.projectList = array;
    },
    [SET_ACTIVITY_LIST](state,array = []){
        state.activityList = array;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [DELETE_TEMP_OBJ](state,key){
        delete  state.tempObj[key+''];
    },
    [SET_USER_INFO](state,data = {}){
        state.userInfo = data;
    }
}
