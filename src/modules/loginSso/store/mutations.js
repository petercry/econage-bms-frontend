import {
    SET_DEMO,
    SET_LOGIN_STATUS,
    SET_USEROBJ,
    SET_ROLE,
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_LOGIN_STATUS](state,val){
        state.isLogin = val;
    },
    [SET_USEROBJ](state,obj){
        state.userObj = obj;
    },
    [SET_ROLE](state,obj){
        state.userRole[obj.key] = obj.value;
    }
}
