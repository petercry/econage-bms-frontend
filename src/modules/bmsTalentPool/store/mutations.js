import {
  SET_BASE_DATA,
  SET_BASE_DATA_OBJ,
} from './mutation-types.js'

export default{
  [SET_BASE_DATA](state,obj = {}){
    state.baseData = obj;
  },
  [SET_BASE_DATA_OBJ](state,obj = {}){
      state.baseData[obj.key] = obj.array;
  },
}
