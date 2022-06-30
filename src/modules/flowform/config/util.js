const FlowFormUtil = function() {};

FlowFormUtil.getModelGruop = ()=>{
    let _moduleGroup = [];
    _moduleGroup.push(
            {
                name:'基础组件',
                moduleList:[
                    {moduleName:'designInput',itemName:'单行输入框',icon:'icondanhangshurukuang'},
                    {moduleName:'designTextarea',itemName:'多行输入框',icon:'iconduohangshurukuang'},
                    {moduleName:'designNumber',itemName:'数字输入框',icon:'iconshuzi1'},
                    {moduleName:'designDate',itemName:'日期输入框',icon:'iconriqi'},
                    {moduleName:'designSelect',itemName:'下拉选框',icon:'iconxialaanniu'},
                    {moduleName:'designRadio',itemName:'单选框', icon:'icondanxuan1'},
                    {moduleName:'designCheckbox',itemName:'多选框', icon:'iconduoxuan'},
                    {moduleName:'designCascader',itemName:'级联选择框', icon:'iconduoxuan'},
                    {moduleName:'designSegmentHeader',itemName:'说明文字', icon:'iconshuoming'},
                    {moduleName:'designGrid',itemName:'数据方阵', icon:'iconbiaoge'},
                    {moduleName:'designAttachement',itemName:'附件', icon:'iconfujian'},
                    {moduleName:'designImg',itemName:'图片', icon:'icontupian'},
                    {moduleName:'designSeal',itemName:'签章',icon:'iconseal'},
                    {moduleName:'designBtn',itemName:'按钮',icon:'iconanniu'},
                ]
            },
            {
                name:'机构人员选择组件',
                moduleList:[
                    {moduleName:'designUserSelect',itemName:'选择人员',icon:'iconrenyuan'},
                    {moduleName:'designOrgSelect',itemName:'选择机构',icon:'iconrenyuan-'},
                ]
            },
            {
                name:'增强组件',
                moduleList:[
                    {moduleName:'designApproval',itemName:'审批意见',icon:'iconrenyuan'},
                    {moduleName:'designRelWF',itemName:'流程关联',icon:'iconguanlianliucheng'},
                    {moduleName:'designApi',itemName:'API关联',icon:'iconAPI'},
                    {moduleName:'designSeqField',itemName:'自动编号',icon:'iconbianhao'},
                ]
            }
        );
        return _moduleGroup;
}


FlowFormUtil.getToolbarGroup = () => {
        let _toolBar = [];
        _toolBar.push({name:'页签添加',icon:'iconfuzhi',click:'addTabView'});
        _toolBar.push({name:'页签排序',icon:'icondrag-handle',click:'sortTabView'});
        _toolBar.push({name:'页签组件排序',icon:'iconpaixu',click:'sortItemTabView'});
        _toolBar.push({name:'组件镜像',icon:'iconjingxiang',click:'mirrorItemFunc'});
        _toolBar.push({name:'表单设置',icon:'iconshezhi',click:'goFormSettingRouter'});

        return _toolBar;
}


FlowFormUtil.getDesignModelName = (modelType) => {
    if(modelType == "SEGMENT_HEADER"){ //表单头
        return 'designSegmentHeader'
    }else if(modelType == "TEXTFIELD"){
        return 'designInput';
    }else if(modelType == "NUMFIELD"){
        return 'designNumber';
    }else if(modelType == "RADIO"){ //radio 组件
        return 'designRadio';
    }else if(modelType == "TIMEFIELD"){
         return 'designDate';
    }else if(modelType == "USERSLT"){ //选择人员
        return 'designUserSelect';
    }else if(modelType == "ORGSLT"){ //选择机构
        return 'designOrgSelect';
    }else if(modelType == "CHECKBOX"){ //checkbox 组件
        return 'designCheckbox';
    }else if(modelType == "SLT"){// select组件
        return 'designSelect';
    }else if(modelType == "TEXTAREA"){//textarea组件
        return 'designTextarea';  
    }else if(modelType == 'GRID'){
        return 'designGrid';
    }else if(modelType == 'APPROVALDESC'){
        return 'designApproval';    
    }else if(modelType == 'ATTACHEMENT'){
        return 'designAttachement';    
    }else if(modelType == 'IMG'){
        return 'designImg';
    }else if(modelType == 'SEQFIELD'){
        return 'designSeqField';
    }else if(modelType == 'SEAL'){
        return 'designSeal'
    }else if(modelType == 'REL_API'){
        return 'designApi'    
    }else if(modelType == 'REL_WF'){
        return 'designRelWF'    
    }else if(modelType == 'SLT_CASCADE'){
        return 'designCascader'    
    }else if(modelType == 'BTN'){
        return 'designBtn'    
    }else{
        return '';
    }

}




/*根据modelType,获取grid的组件名称*/
FlowFormUtil.getDesignGridModelName = (modelType) => {
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
    }else if(modelType == 'ATTACHEMENT'){
        return 'designGridAttachment'
    }else{
        return '';
    }
}

  FlowFormUtil.getModelNameByModelType = (modelType,prefix) => {
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
    }else if(modelType == 'ATTACHEMENT'){
        return _prefix+'GridAttachment';    
    }else{
        return '';
    }
  }

  FlowFormUtil.getTitleNameByModelType = (modelType) =>{
    
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


  FlowFormUtil.isFormulaFunc = (name)=>{
    let _map = {
        "CONCATENATE":1,
        "CALCULATE":1,
        "SUM":1,
        "REMUPPER":1,
        "DAYS":1,
        "HOURS":1,
        "YEARS":1,
        "DATEDELTA":1,
        "MID":1,
        "TONUMBER":1,
        "VAL":1,
        "COUNT":1,
        "MAX":1,
        "MIN":1,
        "INDX":1,
        "GRIDINDX":1
    };

    if(_map[name] == 1){
        return true;
    }else{
        return false;
    }
}

export default FlowFormUtil;
export { FlowFormUtil };
