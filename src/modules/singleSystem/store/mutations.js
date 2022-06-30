import {
  SET_LOGIN_USER,
  SET_MENU_TAB_ARRAY,
  SET_MENU_TAB_CLICK,
  SET_TOGGLE_MENU,
  SET_TEMP_OBJ,
  DELETE_TEMP_OBJ,
  SET_ECO_SETTING_OBJ
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
    [SET_TEMP_OBJ](state,tempObj){
      state.tempObj = tempObj;
    },
    [DELETE_TEMP_OBJ](state,key){
      delete  state.tempObj[key+''];
    },
    
    [SET_ECO_SETTING_OBJ](state,obj){
      state.ecoSettingObj = obj;
    }


}
