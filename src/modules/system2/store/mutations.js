import {
  SET_LOGIN_USER,
  SET_MENU_TAB_ARRAY,
  SET_MENU_TAB_CLICK,
  SET_TOGGLE_MENU,
  SET_TOGGLE_FLAG,
  SET_SYS_WIDTH,
  SET_THEME,
  SET_LANGUAGE,
  SET_TEMP_OBJ,
  SET_DOCUMENT_READY
} from './mutation-types.js'


export default{
    [SET_LOGIN_USER](state,loginUser){
        state.loginUser = loginUser;
    },
    [SET_MENU_TAB_ARRAY](state,menuTabArray){
          state.menuTabArray.push(menuTabArray);
    },
    [SET_MENU_TAB_CLICK](state,menuTabObj){
          state.menuTabClickObj = menuTabObj;
    },
    [SET_TOGGLE_MENU](state,toggleMenuObj){
          state.toggleMenuObj = toggleMenuObj;
    },
    [SET_TOGGLE_FLAG](state,toggleFlag){
          state.toggleFlag = toggleFlag;
    },
    [SET_SYS_WIDTH](state){
          state.sysWidth = document.body.clientWidth;
    },
    [SET_THEME](state){
          state.themeStatus = new Date().getTime();
    },
    [SET_LANGUAGE](state,language){
          state.lang = language;
    },
    [SET_TEMP_OBJ](state,tempObj){
          state.tempObj = tempObj;
    },
    [SET_DOCUMENT_READY](state,tempObj){
            state.documentReady = tempObj.documentReady;
     },
    
}
