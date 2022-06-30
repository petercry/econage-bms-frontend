import {
    SET_BREAD,
    ADD_BREAD,
    SET_ROLE,
} from './mutation-types.js'

export default{
    [SET_BREAD](state,breadList){
        state.breadList = breadList;
    },
    [ADD_BREAD](state,bread){
        state.breadList.push(bread);
    },
    [SET_ROLE](state,obj){
        state.userRole[obj.key] = obj.value;
    }
}
