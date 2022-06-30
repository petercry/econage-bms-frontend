import {
    SET_DEMO,
    SET_WF_KV_MAP,
    SET_WF_PAGE_EVENTS,
    SET_WF_HAND_SIGNS_MAP,

    INIT_WF_FORM_DESIGN_CONFIG,
    DELETE_WF_FORM_DESIGN_CONFIG,
    SET_WF_FORM_DESIGN_CONFIG,
    SET_WF_FORM_DESIGN_CONFIG_CHANGE,

    SET_WF_FORM_DESIGN_CONFIG2,
    SET_WF_FORM_DESIGN_CONFIG_CHANGE2,

    INIT_WF_GRID_DESIGN_CONFIG,
    DELETE_WF_GRID_DESIGN_CONFIG,
    SET_WF_GRID_DESIGN_CONFIG,
    SET_WF_GRID_DESIGN_CONFIG_CHANGE,

    SET_DIRECTION_DATA,
    SET_OPERATE_ID,
    SET_PUBLIC_SETTING_UNION,
    SET_VIEW_TAB_ACTIVE_KEY,
    
    SET_FORMULA_SETTING,
    SET_FORMULA_SETTING_CHANGE,
    SET_FORMULA_FORM_DATA,
    DELETA_ALL_FORMULA_SETTING,
} from './mutation-types.js'

export default{
    [SET_DEMO](state,demo){
        state.demo = demo;
    },
    [SET_WF_KV_MAP](state,val){
        state.wfKvMap = val;
    },
    [SET_WF_PAGE_EVENTS](state,val){
        state.wfPageEvents = val;
    },

    [SET_WF_HAND_SIGNS_MAP](state,val){
        state.wfHandSigns = val;
    },

    /*初始化 store中的配置信息*/
    [INIT_WF_FORM_DESIGN_CONFIG](state){
        state.wfFormDesignConfig = {};
        state.wfFormDesignConfigChange = {};
    },
    /*保存某个组件的信息*/
    [SET_WF_FORM_DESIGN_CONFIG](state,obj){
        state.wfFormDesignConfig[obj.key] = obj.value;
    },

     /*保存某个组件的信息*/
     [SET_WF_FORM_DESIGN_CONFIG2](state,obj){
        state.wfFormDesignConfig[obj.key] = obj.value;
    },

    /*删除某个组件的信息*/
    [DELETE_WF_FORM_DESIGN_CONFIG](state,key){
        delete state.wfFormDesignConfig[key];
    },

    [SET_WF_FORM_DESIGN_CONFIG_CHANGE](state,obj){
        state.wfFormDesignConfigChange = obj
    },

    [SET_WF_FORM_DESIGN_CONFIG_CHANGE2](state,obj){
        state.wfFormDesignConfigChange2 = obj
    },


    /*初始化 store中的配置信息*/
    [INIT_WF_GRID_DESIGN_CONFIG](state){
        state.wfGridDesignConfig = {};
        state.wfGridDesignConfigChange = {};
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

    [SET_DIRECTION_DATA](state,directionData){
        state.directionData = directionData;
    },
    [SET_OPERATE_ID](state,operate_id){
        state.operate_id = operate_id;
    },

    [SET_PUBLIC_SETTING_UNION](state,obj){
        state.publicSettingUnion = obj;
    },

    /*设置 tabview的id*/
    [SET_VIEW_TAB_ACTIVE_KEY](state,data){
        state.viewTabActiveKey = data;
    },


    //公式
    [SET_FORMULA_SETTING](state,obj){
        state.wfFormulateSetting[obj.key] = obj.value;
    },

    //删除全部公式信息
    [DELETA_ALL_FORMULA_SETTING](state,obj){
        state.wfFormulateSetting = {};
    },

    //公式
    [SET_FORMULA_SETTING_CHANGE](state,obj){
        state.wfFormulateSettingChange = obj;
    },

    //公式表单数据
    [SET_FORMULA_FORM_DATA](state,obj){
        state.wfFormulateFormData = obj;
    },

   

    
}
