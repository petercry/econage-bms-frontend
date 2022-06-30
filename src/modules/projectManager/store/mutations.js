import {
    SET_BASE_DATA,
    SET_BASE_DATA_OBJ,
    SET_MAJOR_TYPE,
    SET_ROLE_TYPE,
    SET_GROUP_TYPE,
    SET_ROLE_LIST,
    SET_DELIVER_TYPE,
    SET_TEMP_OBJ,
    DELETE_TEMP_OBJ,
    SET_ROLE_LIST_GROUP,
    SET_PROJECT_INFO,
    SET_MILES_ROLE,
    SET_GROUP_ROLE,
    SET_MILES_TYPE,
    SET_ACTIVITY_LIST,
    SET_USER_INFO
} from './mutation-types.js'

export default{
    [SET_BASE_DATA](state,obj = {}){
        state.baseData = obj;
    },
    [SET_BASE_DATA_OBJ](state,obj = {}){
        state.baseData[obj.key] = obj.array;
    },
    [SET_MAJOR_TYPE](state,array = []){
        state.majorType = array;
    },
    [SET_ROLE_TYPE](state,array = []){
        state.roleType = array;
    },
    [SET_ROLE_LIST_GROUP](state,array = []){
        state.roleListGroup = array;
    },
    [SET_GROUP_TYPE](state,array = []){
        state.groupType = array;
    },
    [SET_ROLE_LIST](state,array = []){
        state.roleList = array;
    },
    [SET_DELIVER_TYPE](state,array = []){
        state.deliverType = array;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [DELETE_TEMP_OBJ](state,key){
        delete  state.tempObj[key+''];
    },
    [SET_PROJECT_INFO](state,data = {}){
        state.projectInfo = data;
    },
    [SET_MILES_ROLE](state,data = {}){
        state.milesRole = data;
    },
    [SET_GROUP_ROLE](state,data = {}){
        state.groupRole = data;
    },
    [SET_MILES_TYPE](state,array = []){
        state.milesType = array;
    },
    [SET_ACTIVITY_LIST](state,array = []){
        state.activityList = array;
    },
    [SET_USER_INFO](state,data = {}){
        state.userInfo = data;
    }
}
