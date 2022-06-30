import {
    INIT_WF_FORM_DESIGN_CONFIG,
    DELETE_WF_FORM_DESIGN_CONFIG,
    SET_WF_FORM_DESIGN_CONFIG,

    SET_WF_FORM_DESIGN_CONFIG_CHANGE,
    SET_WF_FORM_DESIGN_CONFIG_CHANGE2,

   

    SET_FORM_DESIGN_MODEL_AND_VIEW,
    DELETE_FORM_DESIGN_MODEL_AND_VIEW,

    SET_WF_GRID_DESIGN_CONFIG,
    SET_WF_GRID_DESIGN_CONFIG_CHANGE,
    DELETE_WF_GRID_DESIGN_CONFIG,

} from './mutation-types.js'

export default{

    /*初始化 store中的配置信息*/
    [INIT_WF_FORM_DESIGN_CONFIG](state){
        state.wfFormDesignConfig = {};
        state.wfFormDesignConfigChange = {};
    },

    /*删除某个组件的信息*/
    [DELETE_WF_FORM_DESIGN_CONFIG](state,key){
        delete state.wfFormDesignConfig[key];
    },

     /*保存某个组件的信息*/
     [SET_WF_FORM_DESIGN_CONFIG](state,obj){
        state.wfFormDesignConfig[obj.key] = obj.value;
    },

    [SET_WF_FORM_DESIGN_CONFIG_CHANGE](state,obj){
        state.wfFormDesignConfigChange = obj
    },

    [SET_WF_FORM_DESIGN_CONFIG_CHANGE2](state,obj){
        state.wfFormDesignConfigChange2 = obj
    },

    [SET_FORM_DESIGN_MODEL_AND_VIEW](state,obj){
        state.formDesignModelAndView[obj.key] = obj.value;
    },

    /*删除某个组件的信息*/
    [DELETE_FORM_DESIGN_MODEL_AND_VIEW](state,key){
        delete state.formDesignModelAndView[key];
    },


    /*保存某个组件的信息*/
    [SET_WF_GRID_DESIGN_CONFIG](state,obj){
        state.wfGridDesignConfig[obj.key] = obj.value;
    },
    /*删除某个组件的信息*/
    [DELETE_WF_GRID_DESIGN_CONFIG](state,key){
        delete state.wfGridDesignConfig[key];
    },
    [SET_WF_GRID_DESIGN_CONFIG_CHANGE](state,obj){
        state.wfGridDesignConfigChange = obj
    },
    
}
