import {
  SET_LOGIN_USER,
  SET_MENU_TAB_ARRAY,
  SET_MENU_TAB_CLICK,
  SET_TOGGLE_MENU,
  SET_SYS_WIDTH,
  SET_THEME,
  SET_LANGUAGE,
  SET_TEMP_OBJ,
  SET_DOCUMENT_READY,
  DELETE_TEMP_OBJ,
  SET_TASK_STATUS,
  SET_ECO_SETTING_OBJ,
  SET_SETTING_CHANGE
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
     [DELETE_TEMP_OBJ](state,key){
            delete  state.tempObj[key+''];
      },
      [SET_TASK_STATUS](state){
            state.taskStatus = new Date().getTime();
      },

      [SET_ECO_SETTING_OBJ](state,obj){
            state.ecoSettingObj = obj;
      },

      [SET_SETTING_CHANGE](state,obj){
            state.settingChange = obj;
      },


}
