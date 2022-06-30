import axios from 'axios'
import {baseUrl,baseMainServerUrl} from '../config/env'
import qs from 'qs';
import { Message } from 'element-ui';
import {FlowFormUtil} from '../config/util'
import {EcoUtil} from '@/components/util/main.js'


//全局设置超时时间 120s
axios.defaults.timeout = 120000;

axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    EcoUtil.beforeAjaxDoAction();

   if(config.url && (config.url.indexOf('/login') == -1 && config.url.indexOf('/dingding-login')== -1 )){
        config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
    }
     return config;
}, function (error) {
    return Promise.reject(error);
});

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((response) => {
    if(typeof response.data != 'boolean' && !response.data){
      Message({
        message: "网络错误",
        type: 'error',
        showClose: true,
        duration:2000,
        customClass:'design-from-el-message'
      });
    }
    if(( response.data.status && (response.data.status >= 100 && response.data.status != 301)) || (response.data.hasOwnProperty("success") && response.data.success == false)){
        Message({
          message: response.data.msg || response.data.msgDesc,
          type: 'warning',
          showClose: true,
          duration:2000,
          customClass:'design-from-el-message'
        });
    }
    return response;
}, (err) => { // 这里是返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        err.message = '未授权，请登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }

    if(err.response && err.response.data){
        err.message = err.message +','+ err.response.data
    }

    try{
        if( parent.window.sysvm){
            parent.window.sysvm.$message.error({
                showClose: true,
                message:  err.message,
                type: 'error'
            })
        }else{
          Message({
            showClose: true,
            message:  err.message,
            type: 'error'
        });
        }
    }catch(e){
      Message({
        showClose: true,
        message:  err.message,
        type: 'error'
    });
    }

  }
  return Promise.reject(err);
})



export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'15869061873',
      password:'1234abcd',
      time:new Date().getTime()
  }),{traditional:true});
}



/*获取全局配置*/
export const getPublicSettingUnion = function(){
  return axios.get(baseUrl+'/public/setting/union',{
      params:{
          time: new Date().getTime(),
      }
  })
}



/*申请创建流程模板*/
export const getEETempToken = function(){
    return axios.get(baseUrl+'/file-manager/download-tmp-token',{
        params:{
            time: new Date().getTime()
        }
    })
}


//获取流程类别
export const getWFGroupList = function(parentId){
  return axios.get(baseUrl+'/bpm/v95/group/list',{
      params:{
          parentId:parentId,
          time: new Date().getTime()
      }
  })
}

export const addWFGroup = function(data){
    return axios.post(baseUrl+'/bpm/v95/group/create',{
        parentId:data.parentId,
        name:data.name,   //国际化key
        code:data.code, //名称
        comments:data.comments,
        category:data.category,
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;charset=UTF-8'},traditional:true})
}

export const updateWFCategory = function(data){
    return axios.post(baseUrl+'/bpm/v95/group/update/'+data.id,{
        parentId:data.parentId,
        name:data.name,   //国际化key
        code:data.code, //名称
        comments:data.comments,
        category:data.category,
        time:new Date().getTime()
    },
    {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}

export const invalidWFCategory = function(id){
  return axios.post(baseUrl+'/bpm/v95/group/invalid/'+id,{
      time:new Date().getTime()
  },
  {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}



export const sortWFCategory = function(groupIds){
  return axios.post(baseUrl+'/bpm/v95/group/order?v='+new Date().getTime(),groupIds,
  {headers: {'Content-Type': 'application/json;charset=UTF-8'},traditional:true})
}



export const getCategorySingleById = function(id){
    return axios.get(baseUrl+'/bpm/v95/group/get',{
        params:{
            id:id,
            time: new Date().getTime()
        }
    })
}








//获取流程模板列表
export const getWFModelListAjax = function(data){
    let _data = {};
    _data.ajaxTime = new Date().getTime();
    _data.valid_flag = data.validFlag;
    _data.page = data.page;
    _data.rows = data.rows;
    _data.sort = data.sort;
    _data.order = data.order;
    _data.sch_name =data.schName;
    _data.group_id = data.groupId;
    return axios.post(baseUrl+'/bpm/v95/model/workflow/list',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


/*申请创建流程模板*/
export const getWFModelCreateApplyAjax = function(){
  return axios.get(baseUrl+'/bpm/v95/model/workflow/apply/create',{
    params:{
        time: new Date().getTime()
    }
  })
}


//创建流程模板
export const createWFModelAjax = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.operate_id = data.operateId;
    _saveData.wftemp_id = data.wftempId;
    _saveData.req_name = data.reqName;
    _saveData.is_public = data.isPublic?1:0;
    _saveData.menu_ind = data.menuInd?1:0;
    _saveData.into_comp = data.intoComp?1:0;
    _saveData.allow_init_cancel = data.allowInitCancel?1:0;
    _saveData.group = data.group;
    _saveData.sub_group = data.subGroup;
    _saveData.sys_reserve_flag = data.sysReserveFlag?1:0;
    _saveData.def_field_id = data.defFieldId;
    _saveData.code = data.code;
    _saveData.comments = data.comments;
    _saveData.branch_dept_id = data.branchDeptId;
    _saveData.icon_card = data.iconCard;
    return axios.post(baseUrl+'/bpm/v95/model/workflow/create',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//获取流程类别
export const getWFGroupsAjax = function(){
  return axios.get(baseUrl+'/bpm/v95/model/workflow/group',{
      params:{
          set_token_flag: "N",
          time: new Date().getTime()
      }
  })
}


//删除流程模版
export const deleteWFTemplateSingle = function(template_id){
    let _data = {};
    _data.ajaxTime = new Date().getTime();
    _data.template_id = template_id
    return axios.post(baseUrl+'/bpm/v95/model/workflow/invalid',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


//导入流程模板
export const importWFTemplateSingle = function(fileList){
    let param = new window.FormData();
    param.append("time",new Date().getTime());
    for(let i = 0;i < fileList.length;i++){
        param.append('file',fileList[i].file,fileList[i].file.name);
    }
    let config = {
        headers:{'Content-Type':'multipart/form-data'},
        traditional:true
    };  //添加请求头

    let url = baseUrl+'/bpm/v95/model/workflow/import';
    return axios.post(url,param,config);
}


//导出流程模板
export const exportWFTemplateSingle = function(data){
  return axios.get(baseUrl+'/bpm/v95/model/workflow/export',{
        params:{
            wfTempId:data.wfTempId,
            time: new Date().getTime(),
        },
        responseType:'blob',
    }
  )
}



/*申请编辑表单信息*/
export const getformModelUpdateApplyAjax = function(formId){
    return axios.get(baseUrl+'/bpm/v95/model/form/apply/form-update',{
      params:{
          form_id:formId,
          time: new Date().getTime()
      }
    })
}

/*表单渲染 (style)*/
export const getformModelReaderAjax = function(operateId){
    return axios.get(baseUrl+'/bpm/v95/model/form/render/form',{
        params:{
            operate_id:operateId,
            time: new Date().getTime()
        }
    })
}


/*申请创建表单组件*/
export const getItemModelCreateApplyAjax = function(operateId,modelType,changeLine){
    return axios.get(baseUrl+'/bpm/v95/model/form/apply/formitem-create',{
      params:{
          operate_id:operateId,
          model_type:modelType,
          change_line:changeLine,
          time: new Date().getTime(),
      }
  })
}

export const getTabViewDetail = function(view_id){
    return axios.get(baseUrl+'/bpm/v95/model/form/view/get',{
        params:{
          view_id:view_id,
          time: new Date().getTime(),
        }
    })
}


/*添加tab视图*/
export const createTabViewAjax = function(data){
    let _data = {};
    _data.ajaxTime = new Date().getTime();
    _data.operate_id = data.operate_id;
    _data.display_name = data.name;
    _data.order = data.order;
    return axios.post(baseUrl+'/bpm/v95/model/form/view/create',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}





/*创建表单组件*/
export const createFormItemModelAjax = function(data,viewId){

      let _saveData = {};
      _saveData.ajaxTime = new Date().getTime();
      _saveData.operate_id = data.itemOperateId; //申请到的操作id
      _saveData.model_type = data.modelType; //组件模型类型
      _saveData.item_id = data.itemId; //组件id
      _saveData.change_line = data.changeLine; //是否换行
      _saveData.title_name = data.titleName; //标题名称
      _saveData.title_pos = data.titlePos?'n':'l'; //标题位置
      _saveData.title_align = data.titleAlign?data.titleAlign:'l'; //标题对齐方式
      _saveData.vertical_align = data.verticalAlign?data.verticalAlign:'top'; //标题对齐方式
      _saveData.title_width = data.titleWidth;//标题宽度
      _saveData.ft_color = data.ftColor; //标题字体颜色
      _saveData.bg_color = data.bgColor; //标题背景颜色
      _saveData.formula = data.formula; //公式
      _saveData.nullable = data.nullable?0:1; //必填 0 必填 1 非必填
      _saveData.visiable = data.visiable?0:1; //隐藏 0 隐藏 1 可见
      _saveData.ispk = data.ispk?1:0; //主键 1 主键 0 其他

      _saveData.item_width = data.itemWidth; //组件宽度 占比 整型
      _saveData.inst = data.inst; //操作提示
      _saveData.sub_type_id = data.subTypeId?data.subTypeId:0; //时间组件格式 ，选人选机构 选项限制

      _saveData.key_value_list = data.sysKeyValueOptionsValue?data.sysKeyValueOptionsValue:0; //下拉 单选 多选 选项基础类别id
      _saveData.const_type = data.constraintType?data.constraintType:0;
      _saveData.font_weight = data.fontWeight; //字体加粗 bolder 或 空
      _saveData.font_family = data.fontFamily; //文字字体
      _saveData.font_size = data.fontSize?data.fontSize:12; //字体大小
      _saveData.grid_addbutton = data.gridAddbutton; //表单新增按钮文本 数据方阵
      _saveData.grid_row = data.gridRow?data.gridRow:1; //表单默认行数 数据方阵
      _saveData.grid_sum = data.gridSum; //列序号组成的字符串 用“|”分隔 如果 1|2|3
      _saveData.parent_id = data.parentId?data.parentId:0; //父组件id 比如：数据方阵id
      _saveData.show_col_title = data.showColTitle?1:0; //显示表头 1 显示 0 不显示 数据方阵
      _saveData.show_row_idx = data.showRowIdx?1:0; //显示行号 1 显示 0 不显示 数据方阵
      _saveData.allow_edit_row = data.allowEditRow?1:0; //允许增删行 1 允许 0 不允许 数据方阵
    _saveData.grid_import = data.allowGridImport?1:0; //允许导入 1 允许 0 不允许 数据方阵
    _saveData.grid_export = data.allowGridExport?1:0; //允许导出 1 允许 0 不允许 数据方阵

    _saveData.precision = data.precision?data.precision:0; //精度 数据方阵
      _saveData.file_uploadbutton = data.fileUploadbutton; //附件 上传 按钮名称
      _saveData.default_org_level = data.defaultOrgLevel;
      _saveData.def_field_id = data.defFieldId;
      _saveData.api_scene_id = data.apiSceneId;
      _saveData.view_scene_id = data.viewSceneId;
      _saveData.wf_scene_id = data.wfSceneId;
      _saveData.cs_levelnum = data.csLevelNum ;
      _saveData.search_cols = data.searchCols;

      let _itemKv = '';
      let _defaultId = 0 ; //缺省项
      if(data.modelType == 'TIMEFIELD' || data.modelType == 'USERSLT' || data.modelType == 'ORGSLT'
            || data.modelType == 'TEXTFIELD' || data.modelType == 'TEXTAREA' || data.modelType == 'NUMFIELD' ){/*时间组件*/
          _defaultId = data.defaultId;
      }else if(data.modelType == 'CHECKBOX' || data.modelType == 'RADIO' || data.modelType == 'SLT'){
          _defaultId  = null;
      }

      _saveData.default_id = _defaultId;//缺省项
      _saveData.default_val = data.defaultVal;  //缺省值
      _saveData.item_kv = _itemKv   //下拉 单选 多选 自定义基础数据名称， 格式： 数据项1^数据项2^...^数据项n^...; 用^分隔
      _saveData.option_grid = data.optionGrid;
      //默认模版 attch_template

      let _fileTemplateLists = [];
      if(data.fileTemplateLists && data.fileTemplateLists.length > 0){
          (data.fileTemplateLists).forEach((item)=>{
              _fileTemplateLists.push(item.fileHeaderId);
          })
      }
      _saveData.attch_template = JSON.stringify({'type':0,"fileHeaderId":_fileTemplateLists.join(",")});
      _saveData.attch_suffix = data.attchSuffix;

      _saveData.compFixed = data.compFixed;
      _saveData.compWidth = data.compWidth;
      _saveData.view_id = viewId;


     return axios.post(baseUrl+'/bpm/v95/model/form/create/formitem',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


/*申请编辑表单组件*/
export const getItemModelUpdateApplyAjax = function(operateId,itemId){
    return axios.get(baseUrl+'/bpm/v95/model/form/apply/formitem-update',{
        params:{
            operate_id:operateId,
            item_id:itemId,
            time: new Date().getTime(),
        }
    })
}



/*更新表单组件*/
export const updateFormItemModelAjax = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = data.itemOperateId; //申请到的操作id
  _saveData.model_type = data.modelType; //组件模型类型
  _saveData.item_id = data.itemId; //组件id
  _saveData.change_line = data.changeLine; //是否换行
  _saveData.title_name = (data.titleName && data.titleName !='')?data.titleName:FlowFormUtil.getTitleNameByModelType(data.modelType); //标题名称
  _saveData.title_pos = data.titlePos?'n':'l'; //标题位置
  _saveData.title_align = data.titleAlign?data.titleAlign:'l'; //标题对齐方式
  _saveData.vertical_align = data.verticalAlign?data.verticalAlign:'top'; //标题对齐方式
  _saveData.title_width = data.titleWidth;//标题宽度
  _saveData.ft_color = data.ftColor; //标题字体颜色
  _saveData.bg_color = data.bgColor; //标题背景颜色
  _saveData.formula = data.formula; //公式
  _saveData.funcDataId = data.funcDataId; //公式

  _saveData.nullable = data.nullable?0:1; //必填 0 必填 1 非必填
  _saveData.visiable = data.visiable?0:1; //隐藏 0 隐藏 1 可见
  _saveData.ispk = data.ispk?1:0; //主键 1 主键 0 其他


  _saveData.item_width = data.itemWidth; //组件宽度 占比 整型
  _saveData.inst = data.inst; //操作提示
  _saveData.sub_type_id = data.subTypeId?data.subTypeId:0; //时间组件格式 ，选人选机构 选项限制
  _saveData.key_value_list = data.sysKeyValueOptionsValue?data.sysKeyValueOptionsValue:0; //下拉 单选 多选 选项基础类别id
  _saveData.const_type = data.constraintType?data.constraintType:0;
  _saveData.font_weight = data.fontWeight; //字体加粗 bolder 或 空
  _saveData.font_family = data.fontFamily; //文字字体
  _saveData.font_size = data.fontSize?data.fontSize:12; //字体大小
  _saveData.grid_addbutton = data.gridAddbutton; //表单新增按钮文本 数据方阵
  _saveData.grid_row = data.gridRow?data.gridRow:0; //表单默认行数 数据方阵
  _saveData.grid_sum = data.gridSum; //列序号组成的字符串 用“|”分隔 如果 1|2|3
  _saveData.parent_id = data.parentId?data.parentId:0; //父组件id 比如：数据方阵id
  _saveData.show_col_title = data.showColTitle?1:0; //显示表头 1 显示 0 不显示 数据方阵
  _saveData.show_row_idx = data.showRowIdx?1:0; //显示行号 1 显示 0 不显示 数据方阵
  _saveData.allow_edit_row = data.allowEditRow?1:0; //允许增删行 1 允许 0 不允许 数据方阵
  _saveData.grid_import = data.allowGridImport?1:0; //允许导入 1 允许 0 不允许 数据方阵
  _saveData.grid_export = data.allowGridExport?1:0; //允许导出 1 允许 0 不允许 数据方阵
  _saveData.precision = data.precision?data.precision:0; //精度 数据方阵
  _saveData.file_uploadbutton = data.fileUploadbutton; //附件 上传 按钮名称
  _saveData.select_asn_type = data.selectAsnType;
  _saveData.select_asn_lg = data.selectAsnLg;
  _saveData.select_asn_val = data.selectAsnVal;
  _saveData.option_grid = data.optionGrid;
  _saveData.default_org_level = data.defaultOrgLevel;
  _saveData.def_field_id = data.defFieldId;
  _saveData.seq_group_id = data.seqGroupId;
  _saveData.exec_timing = data.execTiming;
  _saveData.api_scene_id = data.apiSceneId;
  _saveData.view_scene_id = data.viewSceneId;
  _saveData.wf_scene_id = data.wfSceneId;
  _saveData.search_cols = data.searchCols;

    let _itemKv = '';
    let _defaultId = 0 ; //缺省项
    let _defaultVal = data.defaultValHidden?data.defaultValHidden:(data.defaultVal?data.defaultVal:'');
    if(data.modelType == 'TIMEFIELD' || data.modelType == 'USERSLT' || data.modelType == 'ORGSLT'
        || data.modelType == 'TEXTFIELD' || data.modelType == 'TEXTAREA' || data.modelType == 'NUMFIELD'){/*时间组件*/
        _defaultId = data.defaultId;
    }else if(data.modelType == 'CHECKBOX' || data.modelType == 'RADIO' || data.modelType == 'SLT'){
        _defaultId = null;
        if(data.modelType == 'CHECKBOX'){
              if(data.sysOptionsDefautl){
                  _defaultId = data.sysOptionsDefautl.join(",");
              }
        }else{
            _defaultId = data.sysOptionsDefautl;
        }
    }else{
        _defaultId = data.defaultId;
    }
    _saveData.default_id = _defaultId;//缺省项
    _saveData.default_val = _defaultVal;  //缺省值
    _saveData.default_seal = data.defaultSeal;  //签章
    _saveData.cs_dataset = data.csDataSet;
    _saveData.cs_levelnum = data.csLevelNum ;
    _saveData.item_kv = _itemKv   //下拉 单选 多选 自定义基础数据名称， 格式： 数据项1^数据项2^...^数据项n^...; 用^分隔
    if(data.modelType == 'USERSLT'){
        let _select_asn_val = {};
        _select_asn_val.selectUserByDept =  data.selectUserByDept?1:0;
        _select_asn_val.chooseOne = data.chooseOne?1:0;
        _saveData.select_asn_val = JSON.stringify(_select_asn_val);
    }

    /*grid的列标题更新 */
    if(data.childItems && data.childItems.length > 0){
        let _child_item_str = {};
        data.childItems.forEach((childItem)=>{
            _child_item_str[String(childItem.itemId)] = (childItem.titleName && childItem.titleName!='')?childItem.titleName:FlowFormUtil.getTitleNameByModelType(childItem.modelType);
        })

        try{
            _saveData.child_item_str = JSON.stringify(_child_item_str);
        }catch(e){
            console.log(e);
        }
    }


    let _fileTemplateLists = [];
     if(data.fileTemplateLists && data.fileTemplateLists.length > 0){
        (data.fileTemplateLists).forEach((item)=>{
            _fileTemplateLists.push(item.fileHeaderId);
        })
     }

    _saveData.attch_template = JSON.stringify({'type':0,"fileHeaderId":_fileTemplateLists.join(",")});
    _saveData.attch_suffix = data.attchSuffix;

    _saveData.compFixed = data.compFixed;
    _saveData.compWidth = data.compWidth;



    return axios.post(baseUrl+'/bpm/v95/model/form/update/formitem',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



/*更新tabview*/
export const updateTabViewModelAjax = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.operate_id = data.operateId; //申请到的操作id
    _saveData.display_name = data.displayName;

    _saveData.show_title = data.showTitle?1:0;
    _saveData.view_type = data.viewType?1:0;

    _saveData.id = data.viewId;
    return axios.post(baseUrl+'/bpm/v95/model/form/view/update',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

/*更新表单组件*/
export const sortTabViewModelAjax = function(array){
  return axios.post(baseUrl+'/bpm/v95/model/form/view/order',array,
  {headers: {'Content-Type': 'application/json;;charset=UTF-8'},traditional:true})
}


//保存表单组件布局
export const saveFormItemModelOrderAjax = function(operateId,parentId,saveLayoutArray){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.operate_id = operateId;
    _saveData.parent_id = parentId;
    (saveLayoutArray).forEach((element)=>{
        _saveData[String(element.itemId)] = element.value;
    })
    return axios.post(baseUrl+'/bpm/v95/model/form/order/formitem',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//保存表单组件布局
export const saveTabViewFormItemModelOrderAjax = function(operateId,saveLayoutArray){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = operateId;
  _saveData.orders = saveLayoutArray;
  return axios.post(baseUrl+'/bpm/v95/model/form/view/item-order',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


export const moveItemTabViewModelAjax = function(operateId, data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = operateId; //申请到的操作id
  _saveData.item_ids = data.itemIds;
  _saveData.from_view = data.fromViewId;
  _saveData.to_view = data.toViewId;
  return axios.post(baseUrl+'/bpm/v95/model/form/view/move-item',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//删除表单组件
export const deleteFormItemModelAjax = function(operateId,itemId){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.operate_id = operateId;
    _saveData.item_id = itemId;
    return axios.post(baseUrl+'/bpm/v95/model/form/delete/formitem',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//删除表单组件
export const deleteFormItemModelInViewAjax = function(operateId,itemId,viewId){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = operateId;
  _saveData.item_id = itemId;
  _saveData.view_id = viewId;
  return axios.post(baseUrl+'/bpm/v95/model/form/view/item-delete',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


/*删除tab视图*/
export const deleteTabViewModelAjax = function(data){
    let _data = {};
    _data.ajaxTime = new Date().getTime();
    _data.operate_id = data.operate_id;
    _data.id = data.viewId;

    return axios.post(baseUrl+'/bpm/v95/model/form/view/delete',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


//更新form组件
export const updateFormModelAjax = function(operateId,formId,data){
      let _saveData = {};
      _saveData.ajaxTime = new Date().getTime();
      _saveData.operate_id = operateId;
      _saveData.form_id = formId;
      _saveData.name = data.name;
      _saveData.short_name = data.shortName;
      _saveData.form_width = data.formWidth;
      _saveData.style_name = data.styleName;
      _saveData.title_text_color = data.titleTextColor;
      _saveData.title_bg_color = data.titleBgColor;

      return axios.post(baseUrl+'/bpm/v95/model/form/update/form',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}






/*获取系统基础数据*/
export const getSystemKVDataModelAjax = function(catId){
  return axios.get(baseUrl+'/bpm/v95/model/data/systemkv',{
      params:{
          cat_id:catId,
          time: new Date().getTime(),
      }
  })
}



//枚举-分组-查询全部
export const getBasicKvCategoryList= function(){
  return axios.get(baseUrl+'/basic/kv/category',{
      params:{
        time:new Date().getTime()
      }
  })
}




//枚举-分组-下属枚举列表
export const getBasicKvGroupList= function(categoryId){
  return axios.get(baseUrl+'/basic/kv/group/'+categoryId+'/detail',{
      params:{
          time:new Date().getTime()
      }
  })
}





/*表单渲染 (value)*/
export const getformModelLoadAjax = function(operateId){
  return axios.get(baseMainServerUrl,{
      params:{
          cmd:'wf.model.form',
          _method:'read',
          action: "load_form_model",
          operate_id:operateId,
          time: new Date().getTime(),
      }
  })
}




/*流向设计*/
export const getTemplateOperateId = function(wftemp_id){
  return axios.get(baseUrl+'/bpm/v95/model/workflow/apply/update',{
    params:{
        wftemp_id:wftemp_id,
        time: new Date().getTime(),
    }
  })
}



export const loadTopoXml = function(reqId){
  return axios.get(baseUrl+'/bpm/v95/model/graph/get/topo-xml',{
    params:{
        reqId:reqId,
        time: new Date().getTime(),
    }
  })
}

export const updateTopoXml = function(data){
  let param = {
      reqId:data.reqId,
      xml:data.xmlStr,
      time:new Date().getTime()
  }
  return axios.post(baseUrl+'/bpm/v95/model/graph/update/topo-xml',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

export const getApplyTaskModel = function(data){
  return axios.get(baseUrl+'/bpm/v95/model/task/apply/task-update',{
    params:{
        operate_id:data.operate_id,
        task_id:data.task_id,
        time: new Date().getTime(),
    }
  })
}


export const updateTaskModel = function(data){
  let param = {
      time:new Date().getTime(),
      operate_id:data.operate_id,
      model_type:data.modelType,
      task_id:data.taskId,
      task_level:data.taskLevel,
      task_name:data.taskName,
      comments:data.comments,
      inst:data.inst,
      file_editable:data.editInfo.fileEditable,
      edit_trace:data.editInfo.editTrace,
      edit_redhead:data.editInfo.editRedhead,
      ext_param:data.ext_param,
      biz_tag:data.bizTag,
  }
  // Object.keys(data).forEach(function(key){
  //   param[key] = data[key];
  // });
  return axios.post(baseUrl+'/bpm/v95/model/task/update/task',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


export const updateWorkTaskModel = function(data){
  let param = {
      time:new Date().getTime(),
      operate_id:data.operate_id,
      model_type:data.modelType,
      task_id:data.taskId,
      task_level:data.taskLevel,
      task_name:data.taskName,
      comments:data.comments,
      inst:data.inst,
      select_asn_type:data.select_asn_type,
      select_asn_lg:data.select_asn_lg,
      select_asn_val:data.select_asn_val,
      asn_notnull:data.asnNotnull,
      approvable:data.approvable,
      apprdesc_itemid:data.apprDescItemId,
      cosignable:data.cosignable,
      delegatable:data.delegatable,
      duplicatable:data.duplicatable,
      overtime_alert:data.overtimeAlert,
      asn_emptylogic:data.asnEmptyLogic,
      drive_type:data.driveType,
      time_limit_type:data.timeLimitType,
      time_limit_num:data.timeLimitNum,
      overtime_events:data.overtime_events,
      overtime_item:data.overtimeItem,
      overtime_cat:data.overtimeCat,
      plg_ukey:data.plgUkey,
      file_editable:data.editInfo?data.editInfo.fileEditable:undefined,
      edit_trace:data.editInfo?data.editInfo.editTrace:undefined,
      edit_redhead:data.editInfo?data.editInfo.editRedhead:undefined,
      appr_kv:data.appr_kv,
      it_agent:data.it_agent,
      it_agentname:data.it_agentname,
      param_in:data.param_in,
      mobile_url:data.mobile_url,
      pc_url:data.pc_url,
      it_catid:data.it_catid,
      ref_type:data.ref_type,
      sc_id:data.sc_id,
      ext_param:data.ext_param,
      overtime_action:data.overtimeAction,
      file_sign:data.fileSign,
      biz_tag:data.bizTag,
      roleuser_logic:data.roleUserLogic,
  }
  // Object.keys(data).forEach(function(key){
  //   param[key] = data[key];
  // });
  return axios.post(baseUrl+'/bpm/v95/model/task/update/task',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

export const updateconditionTaskModel = function(data){
  let param = {
      time:new Date().getTime(),
      operate_id:data.operate_id,
      model_type:data.modelType,
      task_id:data.taskId,
      task_level:data.taskLevel,
      task_name:data.taskName,
      comments:data.comments,
      inst:data.inst,
      check_complate:data.checkComplate,
      single_deny:data.singleDeny,
      route_conds:data.route_conds,
  }
  return axios.post(baseUrl+'/bpm/v95/model/task/update/task',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


export const updateSubProcessTaskModel = function(data){
  let param = {
      time:new Date().getTime(),
      operate_id:data.operate_id,
      model_type:data.modelType,
      task_id:data.taskId,
      task_level:data.taskLevel,
      task_name:data.taskName,
      comments:data.comments,
      inst:data.inst,
      sub_wf_id:data.subWf,
      select_asn_type:data.select_asn_type,
      select_asn_lg:data.select_asn_lg,
      select_asn_val:data.select_asn_val,
      auto_submit:data.subStatement.autoSubmit,
      sub_wfview:data.subStatement.subWfview,
      wf_subview:data.subStatement.wfSubview,
  }
  return axios.post(baseUrl+'/bpm/v95/model/task/update/task',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

export const updateAlphaTaskModel = function(data){
  let param = {
      time:new Date().getTime(),
      operate_id:data.operate_id,
      model_type:data.modelType,
      task_id:data.taskId,
      task_level:data.taskLevel,
      task_name:data.taskName,
      comments:data.comments,
      inst:data.inst,
      pf_type:data.pf_type,
      rel_assignee:data.relAssignee,
      rel_orglevel:data.relOrgLevel,
      seal_cat:data.sealCat,
      seal_id:data.sealId,
      pos_item:data.posItem,
      sel_orgname:data.selOrgName,
      sel_orgid:data.selOrgId,
      seal_name:data.sealName,
      small_src:data.smallSrc,
      sc_id:data.scId,
      performer_agent:data.performer_agent,
      dosuspend:data.dosuspend

  }
  return axios.post(baseUrl+'/bpm/v95/model/task/update/task',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


export const getRenderTaskItempvg = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/model/task/get/item-pvg',{
    params:{
        operate_id:operate_id,
        time: new Date().getTime(),
    }
  })
}


export const getRenderTaskAssigneepvg = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/model/task/get/assignee-pvg',{
    params:{
        operate_id:operate_id,
        time: new Date().getTime(),
    }
  })
}


export const getRenderTaskInspectform = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/model/task/get/inspect-form',{
    params:{
        operate_id:operate_id,
        time: new Date().getTime(),
    }
  })
}


export const updateTaskItempvg = function(data){
  let param = {
      time:new Date().getTime(),

  }
  Object.keys(data).forEach(function(key){
     param[key] = data[key];
  });
  return axios.post(baseUrl+'/bpm/v95/model/task/update/item-pvg',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}



export const updateTaskInspectform = function(data){

  let param = {
      time:new Date().getTime(),

  }
  Object.keys(data).forEach(function(key){
     param[key] = data[key];
  });
  return axios.post(baseUrl+'/bpm/v95/model/task/save/inspact-form',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


export const getRenderSubwfDatamap = function(data){
  return axios.get(baseUrl+"/bpm/v95/model/data/rander/subwf-datamap",{
    params:{
        operate_id:data.operate_id,
        sub_wf_id:data.sub_wf_id,
        output_mapping:data.output_mapping,
        input_mapping:data.input_mapping,
        time: new Date().getTime(),
    }
  })
}

export const updateSubwfDatamap = function(data){
  let param = {
      time:new Date().getTime(),

  }
  Object.keys(data).forEach(function(key){
     param[key] = data[key];
  });
  return axios.post(baseUrl+'/bpm/v95/model/data/save/subwf-datamap',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}
//获取建模时的所有环节列表
export const getAllTaskListForDesign = function(reqId){
  return axios.get(baseUrl+'/bpm/v95/model/workflow/list/all-tasks',{
    params:{
        reqId:reqId,
        time: new Date().getTime(),
    }
  })
}
//保存环节排序
export const updateAllTaskListOrderForDesign = function(data){
  let param = {

      time:new Date().getTime(),

  }
  Object.keys(data).forEach(function(key){
     param[key] = data[key];
  });
  return axios.post(baseUrl+'/bpm/v95/model/workflow/taskorder-update',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}



//获取测试记录
export const getFlowTestRecordList = function(template_id){
    return axios.get(baseMainServerUrl,{
        params:{
            cmd: "wf.test.record",
            _method: "read",
            action: "record_list",
            template_id:template_id,
            time: new Date().getTime(),
        }
    })
}

//创建测试记录
export const createFlowTestRecord = function(template_id,test_type){
  let param = {
      cmd:'wf.test.record',
      action:'record_create',
      _method:'read',
      set_token_flag:'N',
      template_id:template_id,
      test_type:test_type,
      time:new Date().getTime(),
  }

  return axios.post(baseMainServerUrl,qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


//访问测试记录
export const getFlowTestRecordView = function(record_id){
  return axios.get(baseMainServerUrl,{
    params:{
        cmd: "wf.test.record",
        _method: "read",
        action: "record_view",
        record_id:record_id,
        time: new Date().getTime(),
    }
  })
}


/*创建路线（手动）*/
export const createFlowTestLine = function(data){
  let param = {
      cmd:'wf.test.manul',
      action:'line_create',
      _method:'read',
      set_token_flag:'N',
      record_id:data.recordId,
      tempId:data.tempId,
      userReq:data.userReq,
      time:new Date().getTime(),
  }

  return axios.post(baseMainServerUrl,qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


//路线访问
export const processFlowTestLine = function(record_id,line_id){
  let param = {
      cmd:'wf.test.manul',
      action:'line_process',
      _method:'read',
      set_token_flag:'N',
      record_id:record_id,
      line_id:line_id,
      time:new Date().getTime(),
  }

  return axios.post(baseMainServerUrl,qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

//环节办理申请（手动）
export const getFlowTestProcessForm = function(task_id){
  return axios.get(baseMainServerUrl,{
    params:{
        cmd: "wf.test.manul",
        _method: "read",
        action: "process_form",
        task_id:task_id,
        time: new Date().getTime(),
    }
  })
}

//流程暂时保存
export const wfTestSaveFormAjax = function(data,action,root_opid){
  let _saveData = {};
  _saveData.cmd = 'wf.test.manul';
  _saveData._method = 'read';
  _saveData.action = 'save_form';
  _saveData.ajaxTime = new Date().getTime();
  _saveData.root_opid = root_opid;

  if(action == 'submit'){
      _saveData.ss_flag = 'E'
  }else{
      _saveData.ss_flag = 'S'
  }
  Object.keys(data).forEach(function(key){
    _saveData[key] = data[key];
  });

  return axios.post(baseMainServerUrl,qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//环节提交
export const wfTestSubmitTaskAjax = function(data){
    let _saveData = {};
    _saveData.cmd = 'wf.test.manul';
    _saveData._method = 'read';
    _saveData.action = 'submit_task';
    _saveData.ajaxTime = new Date().getTime();
    Object.keys(data).forEach(function(key){
      _saveData[key] = data[key];
    });
    return axios.post(baseMainServerUrl,qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}






/*参数配置*/

//解析打印模板文件中的书签内容
export const resolvePrintTemplate = function(template_id,fileHeaderId){
  return axios.get(baseUrl+'/bpm/v95/model/printset/resolve',{
    params:{
        template_id:template_id,
        fileHeaderId:fileHeaderId,
        time: new Date().getTime(),
    }
  })
}

//保存打印设置
export const savePrintTemplate = function(data){
  let param = {
      time:new Date().getTime(),

  }
  Object.keys(data).forEach(function(key){
     param[key] = data[key];
  });
  return axios.post(baseUrl+'/bpm/v95/model/printset/info-save',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

//获取打印设置列表
export const getPrintSetList = function(template_id){
  return axios.get(baseUrl+'/bpm/v95/model/printset/list/printset',{
    params:{
        reqId:template_id,
        time: new Date().getTime(),
    }
  })
}


//得到某个打印模板的信息
export const getPrintSetInfo = function(template_id,id){
  return axios.get(baseUrl+'/bpm/v95/model/printset/info',{
    params:{
        reqId:template_id,
        printSetId:id,
        time: new Date().getTime(),
    }
  })
}
//删除打印设置
export const deletePrintSet = function(id){
  let param = {
      printSetId:id,
      time:new Date().getTime(),

  }
  return axios.post(baseUrl+'/bpm/v95/model/printset/printset-delete',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

//获取被选中的打印设置列表
export const getSelectedPrintSetList = function(reqId){
  return axios.get(baseUrl+'/bpm/v95/model/printset/list/printset-selected',{
      params:{
          reqId:reqId,
          time: new Date().getTime(),
      }
  })
}

//打印表单
export const getPrintFormData = function(reqId,printSetId){
  let param = {
    reqId:reqId,
    printSetId:printSetId,
    time: new Date().getTime(),
  }
  return axios.post(baseUrl+'/bpm/v95/model/printset/print',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}
//保存扩展配置

export const saveWfExtConfig = function(template_id,id){
  let param = {
      reqId:template_id,
      printSetId:id,
      time:new Date().getTime(),

  }
  return axios.post(baseUrl+'/bpm/v95/model/workflow/ext-config-save',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}





/*发布流程*/
export const getApplyUpdateWFModel = function(wftemp_id){
    return axios.get(baseUrl+'/bpm/v95/model/workflow/apply/update',{
        params:{
            wftemp_id:wftemp_id,
            time: new Date().getTime(),
        }
    })
}


//编辑流程模板
export const updateWFModel = function(data){
    let param = {
        time:new Date().getTime(),
        operate_id:data.operate_id,
        wftemp_id:data.wfTempId,
        req_name:data.name,
        is_public:data.isPublic,
        menu_ind:data.menuInd,
        into_comp:data.intoComp,
        allow_init_cancel:data.allowInitCancel,
        group:data.group,
        sub_group:data.subGroup,
        sys_reserve_flag:data.sysReserveFlag,
        def_field_id:data.defFieldId,
        code:data.code,
        comments:data.comments,
        revoke_flag:data.revokeFlag,
        rk_time_limit_type:data.rkTimeLimitType,
        rk_time_limit_num:data.rkTimeLimitNum,
        viewed_no_revoke:data.viewedNoRevoke,
        rate_derail:data.rateDerail,
        is_rel_klg:data.isRelKlg,
        rel_klg:data.relKlg,
        klg_acr_link:data.klgAcrLink,
        klg_acr_entity:data.klgAcrEntity,
        branch_dept_id:data.branchDeptId,
        icon_card:data.iconCard
    }

    return axios.post(baseUrl+'/bpm/v95/model/workflow/update',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

//发布流程模板
export const publishWFModel = function(operate_id){
    let param = {
        time:new Date().getTime(),
        operate_id:operate_id
    }
    return axios.post(baseUrl+'/bpm/v95/model/workflow/publish',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}



// get 获取流程模板
export const getWFTemplatesAjax = function(groupId,subGroupId){
  let param = {
      time:new Date().getTime(),
      group_id:groupId,
      sub_group_id:subGroupId||-1,
  }
  return axios.post(baseUrl+'/bpm/v95/model/workflow/list',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}




//流程 待办流程取数
export const getTaskWFModuleAjax = function(data){
    let param = {
      folder: 0,
      group_id: data.groupId||-1,
      sub_group_id:data.subGroupId||-1,
      rows: data.rows,
      page: data.page,
      request_desc: data.searchMsg,
      sort:data.sort,
      order:data.order,
      template_id: data.templateId||-1,
      init_start_time:data.init_start_time,
      init_end_time:data.init_end_time,
      assign_start_time:data.assign_start_time,
      assign_end_time:data.assign_end_time,
      init_user:data.initValue,
      time:new Date().getTime()
   }
   return axios.post(baseUrl+'/bpm/v95/psn-search/toassign',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

// get 获取我发起的流程列表
export const getWfSelfInitAjax = function(baseInfo){
    let param = {
        folder: baseInfo.folder,
        group_id: baseInfo.groupId,
        sub_group_id:baseInfo.subGroupId||-1,
        rows: baseInfo.rows,
        page: baseInfo.page,
        sort: baseInfo.sort,
        order: baseInfo.order,
        request_desc: baseInfo.searchMsg,
        template_id: baseInfo.templateId||-1,
        init_start_time:baseInfo.init_start_time,
        init_end_time:baseInfo.init_end_time,
        extendFilter:baseInfo.extendFilter,
        time: new Date().getTime(),

    }
    return axios.post(baseUrl+'/bpm/v95/psn-search/selfinit',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

// get 获取我经办的流程列表
export const getWFMyAllProcessAjax = function(baseInfo){
      let param = {
            folder: baseInfo.folder,
            group_id: baseInfo.groupId,
            sub_group_id:baseInfo.subGroupId||-1,
            rows: baseInfo.rows,
            page: baseInfo.page,
            sort: baseInfo.sort,
            order: baseInfo.order,
            request_desc: baseInfo.searchMsg,
            template_id: baseInfo.templateId||-1,
            init_start_time:baseInfo.init_start_time,
            init_end_time:baseInfo.init_end_time,
            op_start_time:baseInfo.op_start_time,
            op_end_time:baseInfo.op_end_time,
            initValue:baseInfo.initValue,
            extendFilter:baseInfo.extendFilter,
            time: new Date().getTime(),
      }

    return axios.post(baseUrl+'/bpm/v95/psn-search/selfprocess',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}

// get 获取流程运维列表
export const getWFControlListAjax = function(baseInfo){
          let param = {
            rows: baseInfo.rows,
            page: baseInfo.page,
            sort: baseInfo.sort,
            order: baseInfo.order,
            folder: baseInfo.folder,
            group_id: baseInfo.groupId,
            ae_ar_flag:"A",
            request_desc: baseInfo.searchMsg,
            template_id: baseInfo.templateId||-1,
            init_start_time:baseInfo.init_start_time,
            init_end_time:baseInfo.init_end_time,
            initValue:baseInfo.initValue,
            abnormal_flag:baseInfo.abnormalFlag,
            sub_group_id: baseInfo.subGroupId||-1,
            time:new Date().getTime(),
        }

        return axios.post(baseUrl+'/bpm/v95/psn-search/monitor',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}



// get 获取流程运维列表 根据流程id
export const getWFControlListByWfIdAjax = function(wf_id){
  let param = {
    wf_id:wf_id,
    time:new Date().getTime(),
}

return axios.post(baseUrl+'/bpm/v95/psn-search/about-relate',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


//流程 抄送列表
export const getWFCCListAjax = function(data){
  let param = {
          folder: data.folder,
          group_id: data.groupId||-1,
          sub_group_id:data.subGroupId||-1,
          num_per_page: data.rows,
          page: data.page,
          request_desc: data.searchMsg,
          sortCol:data.sort,
          sortDir:data.order,
          cc_user:data.cc_user,
          cc_start_time:data.assign_start_time,
          cc_end_time:data.assign_end_time,
          extendFilter:data.extendFilter,
          time:new Date().getTime()
  }
  return axios.post(baseUrl+'/bpm/v95/psn-search/cc',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});

}

//申请办理流程
export const getWFOperateId = function(task_id){
    let _data = {};
    _data.task_id = task_id;
    _data.time = new Date().getTime();
    return axios.post(baseUrl+'/bpm/v95/process/process',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


//流程布局
export const getWFFormRender = function(root_opid){
  return axios.get(baseUrl+'/bpm/v95/task-form/style',{
      params:{
          operate_id:root_opid,
          time:new Date().getTime()
      }
  })
}



//流程
export const getWFFormTaskLoad = function(root_opid){
  return axios.get(baseUrl+'/bpm/v95/task-form/val',{
      params:{
          operate_id:root_opid,
          time:new Date().getTime()
      }
  })
}

//流程暂时保存
export const wfSaveFormAjax = function(data,action){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  if(action == 'submit'){
      _saveData.ss_flag = 'E'
  }else{
      _saveData.ss_flag = 'S'
  }

  Object.keys(data).forEach(function(key){
    _saveData[key] = data[key];
  });
  return axios.post(baseUrl+'/bpm/v95/process/form-save ',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//环节提交
export const wfSubmitTaskAjax = function(data){

  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  Object.keys(data).forEach(function(key){
    _saveData[key] = data[key];
  });

  return axios.post(baseUrl+'/bpm/v95/process/submit',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//ajax事件
export const postWFAjaxEvent = function(url,data){
  let _postDate = {};
  _postDate.ajaxTime = new Date().getTime();

  Object.keys(data).forEach(function(key){
    _postDate[key] = data[key];
  });

  return axios.post(
    url,
    qs.stringify( _postDate,{arrayFormat:'repeat'}),
    {traditional:true}
    );
}


//表单编号事件 action=seqnum_view&cmd=wf.loadTaskForm
export const getSeqNumViewAjaxEvent = function(data,seggroup_id){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.seggroup_id = seggroup_id;

    Object.keys(data).forEach(function(key){
        _saveData[key] = data[key];
    });

    return axios.post(baseUrl+'/bpm/v95/task-form/seq-view',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//启动流程获取数据接口
export const getWFStartInfo = function(data){
    return axios.get(baseUrl+'/bpm/v95/model/workflow/init-grid',{
        params:{
            time:new Date().getTime()
        }
    })
}


/*初始化启动流程*/
export const initWFAjax = function(map_id){
    let _data = {};
    _data.map_id = map_id;
    _data.ajaxTime = new Date().getTime();
    return axios.post(baseUrl+'/bpm/v95/process/workflow-init',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


/*初始化启动流程*/
export const initWFByMapDefAjax = function(map_def){
      let _data = {};
      _data.map_def = map_def;
      _data.ajaxTime = new Date().getTime();
      return axios.post(baseUrl+'/bpm/v95/process/workflow-init',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


export const getFormIdAndTempIdByMapDef = function(wfDef){
    return axios.get(baseUrl+'/bpm/v95/model/workflow/template-info',{
          params:{
              wfDef:wfDef,
              time:new Date().getTime()
          }
    })
}


/*获取流程历史记录*/
export const getWFHisDataAjax = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/task-form/history',{
      params:{
          operate_id:operate_id,
          time: new Date().getTime(),
      }
  })
}


//申请查看流程
export const getWFViewOperateId = function(wfId,formView,ccId){
    let _data = {};
    _data.ajaxTime = new Date().getTime();
    _data.wf_id = wfId;
    _data.cc_id = ccId;
    _data.form_view = formView;
    return axios.post(baseUrl+'/bpm/v95/process/form-view',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


//待办流程抄送
export const doWFToDoCCSend = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.operate_id = data.operateId;
    _saveData.cc_assignee = data.assignHiddenValue;
    _saveData.cc_title = data.title;
    _saveData.cc_content = data.content;
    return axios.post(baseUrl+'/bpm/v95/task-form/cc-send',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



//获取相关性设置
export const getRenderInteractionModel = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/model/form/render/interaction',{
      params:{
          operate_id:operate_id,
          time:new Date().getTime()
      }
  })
}
//保存相关性设置
export const saveInteractionModel = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = data.operateId;
  _saveData.interaction_conds = data.interaction_conds;
  return axios.post(baseUrl+'/bpm/v95/model/form/save/interaction',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//恢复流程模版
export const recoverWFTemplateSingle = function(template_id){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.template_id = template_id
  return axios.post(baseUrl+'/bpm/v95/model/workflow/recover',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//拷贝流程模板
export const copyWFTemplate = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.wftemp_id = data.wftemp_id;
    _saveData.wf_name = data.wf_name;
    return axios.post(baseUrl+'/bpm/v95/model/workflow/copy',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}




//保存模板权限
export const saveFlowStartPermission = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.template_id = data.template_id;
    _saveData.role_str = data.role_str;
    return axios.post(baseUrl+'/bpm/v95/model/workflow/permission-save',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//获取模板权限
export const getFlowStartPermission = function(template_id){
    return axios.get(baseUrl+'/bpm/v95/model/workflow/permission',{
      params:{
          template_id:template_id,
          time:new Date().getTime()
      }
})}


//修改流程状态
export const changeWfStatus = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.wf_id = data.wf_id;
    _saveData.target_status_flag = data.target_status_flag;

    return axios.post(baseUrl+'/bpm/v95/model/maintain/change-wfstatus',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});

}


//批量取消流程
export const batchCancelWf = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.wf_id_str = data.wf_id_str;
    return axios.post(baseUrl+'/bpm/v95/model/maintain/batch-cancelwf',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//流程设置异常
export const setAbnormal = function(wfId){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.wfId = wfId;
    return axios.post(baseUrl+'/bpm/v95/model/maintain/wf-to-abnormal',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//流程设置异常
export const cancelAbnormal = function(wfId){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.wfId = wfId;
  return axios.post(baseUrl+'/bpm/v95/model/maintain/wf-to-normal',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//环节撤回
export const reCallWF = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.wf_id = data.wf_id;
    return axios.post(baseUrl+'/bpm/v95/process/wf-revoke',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//获取流程大环节列表
export const getDriveTaskList = function(wf_id){
  return axios.get(baseUrl+'/bpm/v95/model/maintain/list/drive-task',{
    params:{
        wf_id:wf_id,
        time:new Date().getTime()
    }
})}


//变更整个大环节（同一task_level）状态
export const changeTaskStatusForLevel = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.task_level = data.task_level;
    _saveData.wf_id = data.wf_id;
    _saveData.target_status_flag = data.target_status_flag;
    return axios.post(baseUrl+'/bpm/v95/model/maintain/batch/change-taskstatus',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//获取某个大环节当前轮的所有办理环节
export const getProcessTaskListByTaskLevel = function(wf_id,task_level){
  return axios.get(baseUrl+'/bpm/v95/model/maintain/list/process-task',{
    params:{
        wf_id:wf_id,
        task_level:task_level,
        time:new Date().getTime()
    }
})}


//变更单个环节状态
export const changeTaskStatus = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.task_id = data.task_id;
    _saveData.wf_id = data.wf_id;
    _saveData.target_status_flag = data.target_status_flag;
    return axios.post(baseUrl+'/bpm/v95/model/maintain/change-taskstastus',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


// 获取编号序列列表
export const getWFSeqIndexListAjax = function(data){
  return axios.get(baseUrl+'/common-sequence',{
        params:{
              search_name:data.schName,
              page:data.page,
              rows:data.rows,
              sort:data.sort,
              order:data.order,
              time: new Date().getTime(),
        }
  })
}

//获取流水号 重复规则
export const getCommonSequenceIdxRestType = function(){
  return axios.get(baseUrl+'/common-sequence/idx-rest-type-enum',{
    params:{
      time:new Date().getTime()
    }
  })
}

//根据orgId，获取entity
export const getOrgsByOrgIds = function(orgIdArray){
  return axios.get(baseUrl+'/org/tree-select',{
        params:{
            orgIds:orgIdArray.join(','),
            time:new Date().getTime()
        }
    })
}

//角色-角色定义列表
export const getRoleList = function(){
  return axios.get(baseUrl+'/role/def',{
    params:{
      time:new Date().getTime()
    }
  })
}




// 获取编号序列列表
export const getWFSeqIndexDetailAjax = function(id){
  return axios.get(baseMainServerUrl,{
        params:{
            cmd:'wf.facade.seqIndx',
            _method:'read',
            action: "load_seq_indx",
            lg_id:id,
            time: new Date().getTime(),
        }
  })
}



export const createWFSeqIndexAjax = function(data){
    let _saveData = {};
    _saveData.cmd = 'wf.facade.seqIndx';
    _saveData._method = 'read';
    _saveData.action = 'add_seq_indx';
    _saveData.ajaxTime = new Date().getTime();
    _saveData.name = data.name;
    _saveData.seg_size = data.segSize;
    _saveData.overflow_lg = data.overflowLg;
    _saveData.reset_cycl = data.resetCycl;
    _saveData.init_val = data.initVal;
    return axios.post(baseMainServerUrl,qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



export const editWFSeqIndexAjax = function(data){
      let _saveData = {};
      _saveData.cmd = 'wf.facade.seqIndx';
      _saveData._method = 'read';
      _saveData.action = 'update_seq_indx';
      _saveData.ajaxTime = new Date().getTime();
      _saveData.name = data.name;
      _saveData.seg_size = data.segSize;
      _saveData.overflow_lg = data.overflowLg;
      _saveData.reset_cycl = data.resetCycl;
      _saveData.curr_val = data.currVal;
      _saveData.lg_id = data.id;
      return axios.post(baseMainServerUrl,qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});

}


export const renderSeqGroupModelAjax = function(operateId,seqGroupId){
  return axios.get(baseUrl+'/bpm/v95/model/form/render/seqgroup',{
        params:{
            operate_id:operateId,
            seq_group_id:seqGroupId,
            time: new Date().getTime(),
        }
  })
}

//保存组件序号逻辑
export const saveSeqgroupModelAjax = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = data.operateId;
  _saveData.seq_group_id = data.seqGroupId;
  _saveData.seq_group_list = data.seqGroupList;

  return axios.post(baseUrl+'/bpm/v95/model/form/save/seqgroup',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//获取组件相关性
export const getItemInteractionAjax = function(data){
   let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  Object.keys(data).forEach(function(key){
    _saveData[key] = data[key];
  });

  return axios.post(baseUrl+'/bpm/v95/task-form/interaction/events',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//获取印章信息列表
export const getSignatureList = function(orgId){
  return axios.get(baseUrl+"/sign/online/listSeals",{
    params:{
        orgId:orgId,
        time: new Date().getTime(),
    }
  })
}
//组件签章加载设置
export const getSignatureSettingInfo = function(operateId){
  return axios.get(baseUrl+"/bpm/v95/model/form/load/seal-default",{
    params:{
        operate_id:operateId,
        time: new Date().getTime(),
    }
  })
}
//组件签章设置保存

export const saveSignatureSettingInfo = function(data){
  let _saveData = {};
 _saveData.ajaxTime = new Date().getTime();

 Object.keys(data).forEach(function(key){
   _saveData[key] = data[key];
 });

 return axios.post(baseUrl+"/bpm/v95/model/form/save/seal-default",qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


export const getSealById = function(id){
    return axios.get(baseUrl+"/sign/online/getSealById",{
      params:{
          id:id,
          time: new Date().getTime(),
      }
    })
}





//获取连接器类型列表
export const getConnectorTypeList = function(agentId){
  return axios.get(baseUrl+'/bpm/v95/model/afbot/list/connector-type',{
    params:{
        agent_id:agentId,
        time: new Date().getTime(),
    }
  })
}


//获取某类连接器列表
export const getConnectorListByType = function(desc,agentId){
  return axios.get(baseUrl+'/bpm/v95/model/afbot/list/connector',{
    params:{
        connector_type_desc:desc,
        agent_id:agentId,
        time: new Date().getTime(),
    }
  })
}

//获取某连接器相关的接口列表
export const getApiListByConnector = function(id){
  return axios.get(baseUrl+'/bpm/v95/model/afbot/list/api',{
    params:{
        connector_id:id,
        time: new Date().getTime(),
    }
  })
}

//获取某接口的详细信息
export const getApiDetByApiId = function(id){
  return axios.get(baseUrl+'/bpm/v95/model/afbot/api',{
    params:{
        api_id:id,
        time: new Date().getTime(),
    }
  })
}

//获取连接器列表
export const getConnectorList = function(data){
  let params = {
    operate_id:data.operate_id,
    page:0,
    cat_name:data.cat_name,
    if_name:data.if_name,
    ref_name:data.ref_name,
    agent_id:data.it_agent,
    time: new Date().getTime(),
  }
  return axios.post(baseUrl+'/bpm/v95/performer/list/ref',qs.stringify(params,{arrayFormat:'repeat'}),{traditional:true});
}
// 保存执行器配置
export const saveConnectorInfo = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();

  Object.keys(data).forEach(function(key){
    _saveData[key] = data[key];
  });

  return axios.post(baseUrl+'/bpm/v95/performer/ref/save',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}
//加载执行器详情
export const loadConnectorInfo = function(data){
  return axios.get(baseUrl+'/bpm/v95/performer/ref',{
    params:{
        operate_id:data.operate_id,
        ref_id:data.ref_id,
        time: new Date().getTime(),
    }
  })
}

//加载场景详情
export const loadSceneInfo = function(data){
  return axios.get(baseUrl+"/bpm/v95/performer/scene/load",{
    params:{
        operate_id:data.operate_id,
        sc_id:data.sc_id,
        ref_id:data.ref_id,
        time: new Date().getTime(),
    }
  })
}

// 保存场景配置
export const saveSceneInfo = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();

  Object.keys(data).forEach(function(key){
    _saveData[key] = data[key];
  });

  return axios.post(baseUrl+"/bpm/v95/performer/scene/save",qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



// api 组件接口
export const getFormApiSceneEvent = function(data,baseInfo,searchData){

    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();

    Object.keys(data).forEach(function(key){
        _saveData[key] = data[key];
    });

    if(baseInfo && baseInfo.ispage == 1){ //分页
        _saveData['#page'] = baseInfo.page;
        _saveData['#page_size'] = baseInfo.pageSize;
    }

    if(searchData){
        Object.keys(searchData).forEach(function(key){
            _saveData[key] = searchData[key];
        });
    }

    return axios.post(baseUrl+'/bpm/v95/task-form/form-scene/event',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


// api 组件接口
export const getViewApiSceneEvent = function(data){
      let _saveData = {};
      _saveData.ajaxTime = new Date().getTime();
      Object.keys(data).forEach(function(key){
          _saveData[key] = data[key];
      });
      return axios.post(baseUrl+'/bpm/v95/task-form/view-scene/event',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



//关联流程加载接口
export const loadRelWfInfo = function(data){
  return axios.get(baseUrl+'/bpm/v95/model/form/load/relwf-scene',{
      params:{
          operate_id:data.operate_id,
          sc_id:data.sc_id,
          time: new Date().getTime(),
      }
  })
}

//获取关联流程表单数据项
export const getRelWfFormData = function(wf_id){
  return axios.get(baseUrl+'/bpm/v95/model/data/form/datamodel',{
    params:{
        wf_id:wf_id,
        time: new Date().getTime(),
    }
  })
}

//保存关联流程数据
export const saveWfLinkInfo = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = data.operate_id;
  _saveData.sc_id = data.sc_id;
  _saveData.sc_select = data.sc_select;
  _saveData.wf_status = data.wf_status_string;
  _saveData.wf_template = data.wf_template;
  _saveData.sel_wfname = data.templateName;
  _saveData.rel_data = data.rel_data;
  _saveData.sel_scope = data.sel_scope_string;
  _saveData.sc_mapping = data.sc_mapping;

  return axios.post(baseUrl+'/bpm/v95/model/form/save/relwf-scene',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//根据审批意见组件自动生成审批环节
export const addTaskForApprItem = function(reqId,formId){
  let _saveData = {};
  _saveData.cmd = 'wf.model.graphTopo';
  _saveData._method = 'read';
  _saveData.action = 'addTaskForApprItem';
  _saveData.reqId = reqId;
  _saveData.formId = formId;
  _saveData.ajaxTime = new Date().getTime();

  return axios.post(baseMainServerUrl,qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



// 流程关联 组件接口
export const getWFSceneEventAjax = function(data){
      return axios.get(baseUrl+'/bpm/v95/task-form/wf-scene/meta',{
            params:{
              operate_id: data.operateId,
              sc_id:data.scId,
              time: new Date().getTime(),
            }
      })
}




// 流程关联 组件接口
export const getWFSceneLoadAjax = function(data){
  let _saveData = {};
 _saveData.ajaxTime = new Date().getTime();

 _saveData.operate_id = data.operateId;
 _saveData.sc_scope = data.scScope; //选择范围
 _saveData.sc_status = data.scStatus;
 _saveData.wf_tempid = data.wfTempId;

 _saveData.page = data.page;
 _saveData.rows = data.rows;
 _saveData.sort = data.sort;
 _saveData.order = data.order;

 _saveData.sc_name = data.scName;
 _saveData.sc_init_req = data.sc_init_req;
 _saveData.sc_inittime_start = data.sc_inittime_start;
 _saveData.sc_inittime_end = data.sc_inittime_end;
 _saveData.sc_duetime_start = data.sc_duetime_start;
 _saveData.sc_duetime_end = data.sc_duetime_end;

 return axios.post(baseUrl+'/bpm/v95/task-form/wf-scene/load',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



// 流程关联 组件接口
export const getWFSceneFormDataAjax = function(data,_selWf){
    return axios.get(baseUrl+'/bpm/v95/task-form/wf-scene/formdata',{
          params:{
                operate_id: data.operateId,
                sc_id:data.scId,
                sel_wf:_selWf,
                time: new Date().getTime(),
          }
    })
}


//获取激活的Agent列表
export const getAgentList = function(data){
  return axios.get(baseUrl+'/bpm/v95/model/afbot/list/active-agents',{
    params:{
        time: new Date().getTime(),
    }
  })
}


export const changeTaskAssingee = function(data,_selWf){
      let _saveData = {};
      _saveData.ajaxTime = new Date().getTime();
      _saveData.wf_id = data.wf_id;
      _saveData.task_level = data.task_level;
      _saveData.task_id = data.task_id;
      _saveData.assignee = data.assignee;
    return axios.post(baseUrl+'/bpm/v95/model/maintain/task-change-assignee',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


export const addTaskLevelAssignee = function(data,_selWf){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.wf_id = data.wf_id;
  _saveData.task_level = data.task_level;
  _saveData.assignee = data.assignee;
 return axios.post(baseUrl+'/bpm/v95/model/maintain/task-add-assignee',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//删除流程
export const deleteWorkFlow = function(data){
      let _saveData = {};
      _saveData.ajaxTime = new Date().getTime();
      _saveData.wf_id = data.wf_id;

      return axios.post(baseUrl+'/bpm/v95/model/maintain/workflow-delete',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//批量删除流程
export const batchDeleteWf = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.wf_ids = data.wf_ids;
  return axios.post(baseUrl+'/bpm/v95/model/maintain/batch/workflow-delete',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//获取输出项
export const getOutPutInfo = function(ref_id){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.ref_id = ref_id;
  console.log(_saveData)
  return axios.get(baseUrl+"/bpm/v95/performer/ref/outitems",{params:_saveData});
}



//Ukey 上传附件
export const updateFileToServerUKey = function(data,url){
      let _saveData = {};
      Object.keys(data).forEach(function(key){
          _saveData[key] = data[key];
      });
      let config = {
          headers:{'Content-Type':'application/json'}
      };
      let _url = url+'/TGCtrlApi';
      return axios.post(_url,_saveData,config);
}


//get Ukey 基本信息
export const getUKeyBaseInfo = function(data){
    return axios.get(baseMainServerUrl,{
        params:{
            cmd:'ukeySealConstant',
            _method:'getUkeyContant',
            time: new Date().getTime(),
        }
    })
}


// 删除执行器配置
export const deleteConnectorInfo = function(ref_id){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.ref_id = ref_id;


  return axios.post(baseUrl+"/bpm/v95/performer/ref/del",qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//pc端导入流程模板
export const resolveFormByImportFile = function(fileHeaderId,curr_user_id,curr_user_req_id){
  return axios.get(baseMainServerUrl,{
    params:{
        cmd: "wf.model.aiImport",
        _method: "read",
        action: "resolveFormByImportFile",
        fileHeaderId:fileHeaderId,
        curr_user_id:curr_user_id,
        curr_user_req_id:curr_user_req_id,
        time: new Date().getTime(),
    }
  })
}
//轮询缓存


export const repeatCacheIdData = function(cacheId){
  return axios.get(baseMainServerUrl,{
    params:{
        cmd: "wf.model.aiImport",
        _method: "read",
        action: "checkCache",
        checkCacheId:cacheId,
        time: new Date().getTime(),
    }
  })
}


export const getTreeKvListByParentId= function(parentId,action){
    return axios.get(baseUrl+'/basic/tree-kv/group/'+action,{
        params:{
            parentId:parentId,
            time:new Date().getTime()
        }
    })
}


export const getCascaderNodeLevelNum = function(id){
  return axios.get(baseUrl+'/basic/tree-kv/single/tree-height',{
    params:{
        id:id,
        time: new Date().getTime(),
    }
  })
}

//评价流程
export const rateWorkFlow = function(data){
  let _saveData = {};
  _saveData.cmd = 'workflowRateController';
  _saveData._method = 'addWorkflowRate';
  _saveData.ajaxTime = new Date().getTime();
  _saveData.workflowId = data.wfId;
  _saveData.score = data.score;
  _saveData.comment = data.comments;
  return axios.post(baseMainServerUrl,qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}
//获取流程评价信息
export const getWorkFlowRateInfo = function(workflowId){
  return axios.get(baseMainServerUrl,{
    params:{
        cmd:'workflowRateController',
        _method:'queryWorkflowRateByWorkflowId',
        workflowId:workflowId,
        time: new Date().getTime(),
    }
  })
}
//获取系统默认审批秒速
export const getWorkFlowApprKv = function(){
  return axios.get(baseUrl+'/bpm/v95/model/workflow/apprkv',{
    params:{
        time: new Date().getTime(),
    }
  })
}
//批量审批校验
export const checkBatchAppr = function(data){
  return axios.get(baseUrl+'/bpm/v95/process/form-check-batch',{
      params:{
            batch_tasks:data.batchTasks,
            appr_code:data.apprCode,
            appr_desc:data.apprDesc,
            time: new Date().getTime(),
      }
  })
}


//批量审批提交
export const submitBatchAppr = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.batch_tasks = data.batchTasks;
  _saveData.appr_code = data.apprCode;
  _saveData.appr_desc = data.apprDesc;
  return axios.post(baseUrl+'/bpm/v95/process/submit-batch',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}

//获取知识库列表
export const getKMListInfo = function(){
  return axios.get(baseMainServerUrl,{
      params:{
          cmd:'knowledgeExtController',
          _method:"queryList",
          time: new Date().getTime(),
      }
  })
}

//获取知识库数据
export const getKMInfoByReqId = function(reqId){
  return axios.get(baseMainServerUrl,{
      params:{
          cmd:'knowledgeExtController',
          _method:"queryFolderTree",
          id:reqId,
          time: new Date().getTime(),
      }
  })
}



//（通讯录）根据KEY 搜索组织架构 
export const searchUser = function(operate_id,item_id,sch_key){
    return axios.get(baseMainServerUrl,{
          params:{
                  cmd:"wf.loadTaskForm",
                  _method:"read",
                  action:"search_user",
                  operate_id:operate_id,
                  item_id:item_id,
                  sch_key:sch_key,
                  time:new Date().getTime()
          }
    })
}

//（通讯录）根据KEY 搜索组织架构 
export const searchOrg = function(operate_id,item_id,sch_key){
  return axios.get(baseMainServerUrl,{
        params:{
                cmd:"wf.loadTaskForm",
                _method:"read",
                action:"search_dept",
                operate_id:operate_id,
                item_id:item_id,
                sch_key:sch_key,
                time:new Date().getTime()
        }
  })
}


//（通讯录）根据KEY 搜索组织架构 
export const getAddressBookSearch = function(key,options){
  return axios.get(baseUrl,{
    params:{
          flag:"v3.org",
          _method:"read",
          action:"getAddressbookSearch",
          key:key,
          idType:options.idType,
          filterType:0,
          selectType:options.selectType,
          beginId:options.beginId,
          time:new Date().getTime()
    }
  })
}

//获取机构列表
export const getOrgsListBySignature = function(){
  return axios.get(baseUrl+'/org/tree-select/-1/sub',{
    params:{
        selectScope:"DEPT",
        deptScopeType:"BUSINESS",
        time: new Date().getTime(),
    }
  })
}


//获取button组件配置
export const getButtoInteraction = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/model/form/render/button-interaction',{
    params:{
        operate_id:operate_id,
        time: new Date().getTime(),
    }
  })
}

// 保存button组件配置
export const saveButtonInteraction = function(data){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.operate_id = data.operateId;
  _saveData.interaction_conds = data.interaction_conds;


  return axios.post(baseUrl+"/bpm/v95/model/form/save/button-interaction",qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}
//获取button组件配置
export const getBranchOrg = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/facade/branch-org',{
    params:{
        time: new Date().getTime(),
    }
  })
}

//获取权限按钮配置项
export const getRoleBtnSetting = function(refs){
  return axios.get(baseUrl+'/org/user/personal/role/is-exists-one-by-one',{
    params:{
        'ref':refs,
        time:new Date().getTime()
      },

      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  })
}


export const doGridExlImpAjax = function(data,fileList){
    let param = new window.FormData();
    param.append("operate_id",data.operateId);
    param.append("itemId", data.itemId);
    param.append("gridData",data.gridData); //要添加的节点的ID
    param.append("saveType",data.saveType);
    param.append("startIdx",data.startIdx);//要添加的节点的fileLevel
    param.append("time",new Date().getTime());

    for(let i = 0;i < fileList.length;i++){
        param.append('file',fileList[i].file,fileList[i].file.name);
    }

    let config = {
        headers:{'Content-Type':'multipart/form-data'},
        traditional:true
    };  //添加请求头

    let url = baseUrl+'/bpm/v95/task-form/grid/data-upload';
    return axios.post(url,param,config);
}


export const doGridExlExpAjax = function(data){
    return axios.get(baseUrl+'/bpm/v95/task-form/grid/data-download',{
          params:{
              operate_id:data.operateId,
              gridData:data.gridData,
              itemId:data.itemId,
              time: new Date().getTime(),
          },
          responseType:'blob',
      }
    )
}


//镜像拷贝
export const mirrorItemAjax = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.operate_id = data.operateId;
    _saveData.item_id = data.itemId;
    _saveData.from_view = data.fromView;
    _saveData.to_views = data.toViews;
    return axios.post(baseUrl+'/bpm/v95/model/form/view/copy-item',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



//模板收藏与取消
export const setTemplateCollection = function(templateId){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.templateId = templateId;
    return axios.post(baseUrl+'/bpm/v95/model/wftemp/collect',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}




export const getWorkflowInitCount = function(num){
    return axios.get(baseUrl+'/bpm/v95/portal/workflow-init-count',{
          params:{
                num:num,
                time: new Date().getTime(),
          }
      }
    )
}


//加载公式配置页面
export const getFormulaLoad = function(wf_id){
    return axios.get(baseUrl+'/bpm/v95/model/data/load-func',{
        params:{
            wf_id:wf_id,
            time: new Date().getTime(),
        }
    })
}


//加载公式配置页面
export const loadFormulaItem = function(data_id){
  return axios.get(baseUrl+'/bpm/v95/model/data/load-funcitem',{
      params:{
          data_id:data_id,
          time: new Date().getTime(),
      }
  })
}


//添加公式
export const createFormula = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.wf_id = data.wf_id;
    _saveData.name = data.name;
    _saveData.rel_items = data.rel_items;
    _saveData.express = data.express;
    _saveData.func = data.func;
    return axios.post(baseUrl+'/bpm/v95/model/data/create-funcitem',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


//修改公式
export const updateFormula = function(data){
    let _saveData = {};
    _saveData.ajaxTime = new Date().getTime();
    _saveData.wf_id = data.wf_id;
    _saveData.name = data.name;
    _saveData.rel_items = data.rel_items;
    _saveData.express = data.express;
    _saveData.func = data.func;
    _saveData.id = data.funcDataId;

    return axios.post(baseUrl+'/bpm/v95/model/data/update-funcitem',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}


export const deleteFormula = function(data_id){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.data_id = data_id;
  return axios.post(baseUrl+'/bpm/v95/model/data/delete-funcitem',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



/*获取流程所有附件 */
export const getWFAllAttachment = function(operate_id){
  return axios.get(baseUrl+'/bpm/v95/task-form/all-attachments',{
      params:{
          operate_id:operate_id,
          time: new Date().getTime()
      }
  })
}


/*生成PDF*/
export const convert2Pdf = function(wfId,fileHeaderId){
  let _saveData = {};
  _saveData.ajaxTime = new Date().getTime();
  _saveData.wfId = wfId;
  _saveData.fileHeaderId = fileHeaderId;

  return axios.post(baseUrl+'/jinan/doc2pdf/convert2Pdf',qs.stringify(_saveData,{arrayFormat:'repeat'}),{traditional:true});
}



