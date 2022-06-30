import {
  SET_FILETABLENODE,
  SET_FILETREENODE,
  SET_FILEMAINTABLENODE,
  SET_ACTIVEID,
  SET_TYPE
} from './mutation-types.js'

export default {
  // [SET_ACTIVITY_TYPE](state,array = []){
  //     state.activityType = array;
  // },
  // [SET_PROJECT_LIST](state,array = []){
  //     state.projectList = array;
  // },
  // [SET_ACTIVITY_LIST](state,array = []){
  //     state.activityList = array;
  // },
  [SET_FILETABLENODE](state, fileTableNode) {
    state.fileTableNode = fileTableNode;
  },
  [SET_FILETREENODE](state, fileTreeNode) {
    state.fileTreeNode = fileTreeNode;
  },
  [SET_FILEMAINTABLENODE](state, fileMainTableNode) {
    state.fileMainTableNode = fileMainTableNode;
  },
  [SET_ACTIVEID](state, id) {
    state.activeId = id;
  },
  [SET_TYPE](state, id) {
    state.type = id;
  },
}
