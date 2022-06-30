import {
    SET_SYS_WIDTH,
} from './mutation-types.js'

export default{
    [SET_SYS_WIDTH](state){
        state.sysWidth = document.body.clientWidth;
   },
}
