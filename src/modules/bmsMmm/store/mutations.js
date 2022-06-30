import {
    SET_DEMO,
    SET_TEMP_OBJ,
    DELETE_TEMP_OBJ
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_TEMP_OBJ](state,tempObj){
        state.tempObj = tempObj;
    },
    [DELETE_TEMP_OBJ](state,key){
        delete  state.tempObj[key+''];
  },
}
