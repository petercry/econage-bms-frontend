import {
    SET_DEMO,
    SET_SYS_WIDTH
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_SYS_WIDTH](state){
        state.sysWidth = document.body.clientWidth;
    }
    
}
