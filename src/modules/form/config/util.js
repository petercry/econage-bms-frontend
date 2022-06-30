const FormUtil = function() {};


/*根据modelType,获取grid的组件名称*/
FormUtil.getDesignGridModelName = (modelType) => {
    if(modelType == "SEGMENT_HEADER"){ //表单头
        return 'designGridSegmentHeader'
    }else if(modelType == "TEXTFIELD"){
        return 'designGridInput';
    }else if(modelType == "NUMFIELD"){
        return 'designGridNumber';
    }else if(modelType == "RADIO"){ //radio 组件
        return 'designGridRadio';
    }else if(modelType == "TIMEFIELD"){
        return 'designGridDate';
    }else if(modelType == "USERSLT"){ //选择人员
        return 'designGridUserSelect';
    }else if(modelType == "ORGSLT"){ //选择机构
        return 'designGridOrgSelect';
    }else if(modelType == "CHECKBOX"){ //checkbox 组件
        return 'designGridCheckbox';
    }else if(modelType == "SLT"){// select组件
        return 'designGridSelect';
    }else if(modelType == "TEXTAREA"){//textarea组件
        return 'designGridTextarea';  
    }else if(modelType == "REL_API"){//textarea组件
        return 'designGridApi';  
    }else if(modelType == "REL_WF"){//textarea组件
        return 'designGridRelWF';  
    }else if(modelType == 'GRID'){
        return 'designGrid';
    }else{
        return '';
    }
}

FormUtil.getModelNameByModelType = (modelType,prefix) => {
    let _prefix = '';
    if(prefix){
        _prefix = prefix;
    }
    if(modelType == "SEGMENT_HEADER"){ //表单头
        return _prefix+'GridSegmentHeader'
    }else if(modelType == "TEXTFIELD"){
        return _prefix+'GridInput';
    }else if(modelType == "NUMFIELD"){
        return _prefix+'GridNumber';
    }else if(modelType == "RADIO"){ //radio 组件
        return _prefix+'GridRadio';
    }else if(modelType == "TIMEFIELD"){
        return _prefix+'GridDate';
    }else if(modelType == "USERSLT"){ //选择人员
        return _prefix+'GridUserSelect';
    }else if(modelType == "ORGSLT"){ //选择机构
        return _prefix+'GridOrgSelect';
    }else if(modelType == "CHECKBOX"){ //checkbox 组件
        return _prefix+'GridCheckbox';
    }else if(modelType == "SLT"){// select组件
        return _prefix+'GridSelect';
    }else if(modelType == "TEXTAREA"){//textarea组件
        return _prefix+'GridTextarea';  
    }else if(modelType == "REL_API"){//textarea组件
        return _prefix+'GridApi';   
    }else if(modelType == "REL_WF"){//textarea组件
        return _prefix+'GridRelWF';   
    }else if(modelType == 'GRID'){
        return _prefix+'Grid';
    }else{
        return '';
    }
  }

  FormUtil.getTitleNameByModelType = (modelType) =>{
    
    if(modelType == "SEGMENT_HEADER"){ //表单头
        return '说明文字';
    }else if(modelType == "TEXTFIELD"){
        return '单行输入框';
    }else if(modelType == "NUMFIELD"){
        return '数字输入框';
    }else if(modelType == "RADIO"){ //radio 组件
        return '单选框';
    }else if(modelType == "TIMEFIELD"){
        return '日期输入框';
    }else if(modelType == "USERSLT"){ //选择人员
        return '选择人员';
    }else if(modelType == "ORGSLT"){ //选择机构
        return '选择机构';
    }else if(modelType == "CHECKBOX"){ //checkbox 组件
        return '多选框';
    }else if(modelType == "SLT"){// select组件
        return '下拉框';
    }else if(modelType == "TEXTAREA"){//textarea组件
        return '多行输入框';  
    }else if(modelType == 'GRID'){
        return '数据方阵';
    }else if(modelType == 'SEAL'){
        return '签章';
    }else if(modelType == 'REL_API'){
        return 'API关联';
    }else if(modelType == 'REL_WF'){
        return '流程关联';
    }else{
        return '无标题';
    }
  }


  FormUtil.getDesignModelName = (type,nodeType) =>{
        if(nodeType == 'basic'){
            if(type == "TEXTFIELD"){
                return 'designInput';
            }else if(type == 'TEXTAREA'){
                return 'designTextarea'
            }else if(type == 'NUMFIELD'){
                return 'designNumber'
            }else if(type == 'TIMEFIELD'){
                return 'designDate'
            }else if(type == "SLT"){// select组件
                return 'designSelect';
            }else if(type == 'RADIO'){
                return 'designRadio';
            }else if(type == 'CHECKBOX'){
                return 'designCheckbox';
            }else if(type == 'ATTACHEMENT'){
                return 'designAttachement';
            }else if(type == 'IMG'){
                return 'designImg';
            }else if(type == 'APPROVALDESC'){
                return 'designApproval';
            }else{
                return '';
            }
        }else if(nodeType == 'table'){
            return 'designGrid';
        }else{
            return '';
        }
  }


export default FormUtil;
export { FormUtil };
