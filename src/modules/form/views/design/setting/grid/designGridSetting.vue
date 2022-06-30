<template>
    <div class="designGridSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
     
       
        <div class="gridClass" v-show="gridShow">
             <div class="itemVueName">数据方阵</div>
            <div class="setting">
           
             <el-tabs v-model="tabActiveName" type="card">
                 <el-tab-pane label="视图" name="view">   

                    <div class="ecoSettingBlock">
                        <el-row class="ecoSettingDesc">
                            <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;标题名称</span> </el-col>
                            <el-col :span="12" class="note"><span>最多20字</span></el-col>
                        </el-row>
                        <div><el-input v-model="config.view.display" maxlength="20" show-word-limit></el-input></div>
                    </div>

                    <div class="ecoSettingBlock">
                        <el-row class="ecoSettingDesc">
                                <el-col :span="24" class="switchDesc">
                                    <el-switch  v-model="config.view.attrs.titlePos" size="mini"> </el-switch>
                                    <span>隐藏标题</span>
                                </el-col>
                        </el-row>
                    </div>

                    <div class="ecoSettingBlock">
                        <div class="ecoSettingDesc"><span class="title">标题对齐方式</span></div>
                        <div>
                            <el-radio-group v-model="config.view.style.titleAlign" >
                                    <el-radio-button label="left" >左对齐</el-radio-button>
                                    <el-radio-button label="center" >居中</el-radio-button>
                                    <el-radio-button label="right" >右对齐</el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                
                    <div class="ecoSettingBlock">
                        <el-row class="ecoSettingDesc">
                            <el-col :span="12" class="title"><span>标题文字颜色</span></el-col>
                            <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.view.style.ftColor" @active-change="onFtChange"></el-color-picker></span></el-col>
                        </el-row>
                    </div>

                    <div class="ecoSettingBlock">
                        <el-row class="ecoSettingDesc">
                            <el-col :span="12" class="title"><span>标题背景颜色</span></el-col>
                            <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.view.style.bgColor" @active-change="onBgChange"></el-color-picker></span></el-col>
                        </el-row>
                    </div>

                    <el-divider></el-divider>

                    <div class="ecoSettingBlock">
                        <el-row class="ecoSettingDesc">
                            <el-col :span="24" class="title"><span>表格字段</span> </el-col>
                        </el-row>

                        <div>
                            <draggable  :list="config.view.crtls" class="list-group" handle=".handle" v-bind="dragOptions"  @change="doDragChangeRow">
                                    <div
                                            class="optionsDiv"
                                            v-for="(item,idx) in config.view.crtls"
                                            :key="item.uuid"
                                     >

                                            <input type="text"  v-model="item.display"  @blur="onBlurChildrenItem"/>
                                            <i class="icon iconfont icondrag-handle handle"></i>
                                            <i class="icon iconfont iconbianji edition" @click="editChildItem(item,idx)"></i>
                                            <i class="icon iconfont iconshanchu deleteicon" @click="deleteChildItem(item,idx)"></i>
                                            <i class="icon iconfont iconheji " title="合计"  v-bind:class="{hasHeji:gridSumMap[item.uuid]== 1,noHeji:gridSumMap[item.uuid]!=1}"  @click="toggleHeji(item)"></i>
                                    </div>
                            </draggable>

                            <div class="addOptions">
                                    <el-dropdown size="medium" placement="top" trigger="click" @command="getChildrenItemModelCreateApplyFunc">
                                        <span class="el-dropdown-link">
                                            + 添加选项
                                        </span>
                                        <el-dropdown-menu slot="dropdown" size="medium">
                                            <el-dropdown-item  :command="item" style="width:120px;" size="medium" v-for="(item,idx) in gridColItemsArray" :key="'gridColItem'+idx">{{item.itemName}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>

                                </div>
                            </div>
                    </div>

                    <el-divider></el-divider>
                    
                    <div class="ecoSettingBlock">
                        <el-row class="ecoSettingDesc">
                                <el-col :span="12" class="switchDesc">  
                                    <el-switch v-model="config.view.attrs.showColTitle" size="mini"></el-switch>
                                    <span class="">显示表头</span>
                                </el-col>

                                <el-col :span="12" class="switchDesc">  
                                    <el-switch v-model="config.view.attrs.showRowIdx" size="mini"></el-switch>
                                    <span class="">显示行号</span>
                                </el-col>

                                <el-col :span="18" class="switchDesc">  
                                    <el-switch v-model="config.view.attrs.allowEditRow" size="mini"></el-switch>
                                    <span class="">允许增删行</span>
                                </el-col>
                        </el-row>
                    </div>

                    <div class="ecoSettingBlock">
                        <div class="ecoSettingDesc"><span class="title">表单新增按钮文本</span></div>
                        <div>
                            <el-input v-model="config.view.attrs.gridAddbutton" > </el-input>
                        </div>
                    </div>

                    <div class="ecoSettingBlock">
                        <div class="ecoSettingDesc"><span class="title">默认行数</span></div>
                        <div>
                            <el-input-number v-model="config.view.attrs.gridRow" :min="0" :max="3" label="默认行数" size="mini"></el-input-number>
                        </div>
                    </div>

                    <div class="ecoSettingBlock">
                        <div class="ecoSettingDesc"><span class="title">精度</span></div>
                        <div>
                            <el-input-number v-model="config.view.attrs.precision" :min="0" :max="10" label="精度" size="mini"></el-input-number>
                        </div>
                    </div>
                    
                    <el-divider></el-divider>

                    <div class="ecoSettingBlock">
                        <el-row class="ecoSettingDesc">
                                <el-col :span="12" class="switchDesc">  
                                    <el-switch v-model="config.view.attrs.required" size="mini"></el-switch>
                                    <span class="">必填</span>
                                </el-col>
                                <el-col :span="12" class="switchDesc">
                                    <el-switch v-model="config.view.attrs.visiable" size="mini"></el-switch>
                                    <span>隐藏</span>
                                </el-col>
                        </el-row>
                        <el-row class="ecoSettingDesc">
                                <el-col :span="12" class="switchDesc">
                                    <el-switch  v-model="config.view.attrs.ispk" size="mini"> </el-switch>
                                    <span>主键</span>
                                </el-col>
                                <el-col :span="12" class="switchDesc">
                                    <el-switch  v-model="config.view.attrs.isfk" size="mini"> </el-switch>
                                    <span>外键</span>
                                </el-col>
                        </el-row>

                        <el-row class="ecoSettingDesc">
                                <el-col :span="12" class="switchDesc">
                                    <el-switch  v-model="config.view.attrs.ispn" size="mini"> </el-switch>
                                    <span>记录名称</span>
                                </el-col>
                        </el-row>
                    
                    </div>

                    <div class="ecoSettingBlock">
                        <div class="ecoSettingDesc"><span class="title">自定义标识</span></div>
                        <div><el-input v-model="config.view.attrs.defFieldId" ></el-input></div>
                        <div class="tip">注：用于二次开发接口时的唯一性标识，建议使用英文命名</div>
                    </div>

                    <div class="ecoSettingBlock">
                        <div class="ecoSettingDesc"><span class="title">操作提示</span></div>
                        <div><el-input v-model="config.view.attrs.inst" ></el-input></div>
                    </div>

                    </el-tab-pane>
                </el-tabs>


                </div>
            </div>

            <div v-show="!gridShow">
                <router-view></router-view>
            </div>

    </div>
</template>
<script>


import {getTableId,getFieldId} from'../../../../service/service'
import {defaultTitleWidth,defaultColDateTitleWidth, defaultFTColor}  from'../../../../config/setting.js'
import {FormUtil} from '../../../../config/util'
import {Loading} from 'element-ui';
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import draggable from "../../../../assets/js/vuedraggable";

export default{
  name:'designGridSettingVue',
  components:{
        draggable
  },
  data(){
    return {
        uuid:null,
        tableDef:null,
        action:null,
        loaded:false,
        changed:false,
        tabActiveName:'view',
        crtlType:'GRID',
        fieldTypeArray:[],

        childItemLoaded:false,
        gridShow:true,

        config:{
            loaded1:false,
            loaded2:false,

            action:null,
            view:{//视图层
                type:null,
                fieldTableId:null,
                nodeType:'table',
                display: '数据方阵',
                attrs:{
                    titlePos:true,
                    showColTitle:true,
                    showRowIdx:true,
                    allowEditRow:true,
                    gridAddbutton:'添加',
                    gridRow:2,
                    gridSum:null,
                    precision:2,
                    required:false,
                    visiable:false,
                    ispk:false,//主键
                    isfk:false,//外健
                    ispn:false,//记录名称
                    inst:null,//操作提示,
                    defFieldId:null,//自定义表示
                    defaultVal:null, //默认内容
                },
                style:{
                    ftColor:null,//标题文字颜色
                    bgColor:null,//标题背景颜色,
                    titleAlign:'left',//标题对齐方式
                    titleWidth:defaultTitleWidth,//标题宽度
                },
                crtls:[]
            },
            model:{//物理层
                crtlType:null,
                createIdx:false,
                display:'数据方阵',
                tableDef:null,
                linkId:null,
                fields:[],
            },
        },
        
        outputColOptions:[],
        dragOptions:{
             animation: 200,
             group: "description",
             disabled: false,
             ghostClass: "ghost",  
        },
        gridColItemsArray:[],
        gridKvMap:[],
        gridSumMap:{}
      
    }
  },
 computed:{
        ...mapState([
            'formDesignModelAndView',
            'wfFormDesignConfig',
            'wfFormDesignConfigChange',
            'wfGridDesignConfig',
            'wfGridDesignConfigChange'
     ]),

      
  },
  created(){
      this.listAction();
      this.initItem();
      window.ecoDesignGridSettingVm = this;
  },
  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE',
            'SET_WF_FORM_DESIGN_CONFIG2',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE2',
            'DELETE_WF_GRID_DESIGN_CONFIG',
            'DELETE_FORM_DESIGN_MODEL_AND_VIEW',
            'SET_FORM_DESIGN_MODEL_AND_VIEW'
       ]),

       listAction(){
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'formulaCallBack'){
                    window.ecoDesignGridSettingVm.setFormulaCallBack(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfFormDesignConfig');
        },

       /*初始化组件*/
       initItem(){
            this.uuid = this.$route.params.uuid;
            this.tableDef = this.$route.params.tableDef;
            this.action = this.$route.params.action;

            this.config.loaded1 = false;
            this.config.loaded2 = false;

            if(this.action == 'create'){ //添加组件 申请添加组件
                this.getItemModelCreateApplyFunc();
            }else{ //修改组件 申请修改组件权限，并获取数据
                this.getItemModelUpdateApplyFunc();
            }
       },
        
       /*申请创建表单组件*/ 
       getItemModelCreateApplyFunc(){ 
            getTableId().then((response)=>{
                    let _tableId = response.data;
                    /*初始化配置信息*/
                    this.initConfig(_tableId);
                    this.action = 'update';
                    /*添加保存成功，向上冒泡，后面都转为更新操作*/
                    this.onEmitHandle('createConfig',true);
                    // this.createItem();
            }).catch((err)=>{
                this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
            })
         
       },

       /*申请更新表单组件*/ 
       getItemModelUpdateApplyFunc(){ 
            let _config = this.formDesignModelAndView[this.uuid];
            if(_config){
                 this.initConfig(_config.model.tableDef,_config);
            }
            this.DELETE_FORM_DESIGN_MODEL_AND_VIEW(this.uuid);
       },
        
       /*初始化配置信息*/
       initConfig(_tableId,remap){
           try{
                    this.gridColItemsArray = [];
                    this.gridColItemsArray.push({modelName:'designGridInput',crtlType:'TEXTFIELD', itemName:'单行输入框',icon:'icondanhangshurukuang'});
                    this.gridColItemsArray.push({modelName:'designGridTextarea',crtlType:'TEXTAREA',itemName:'多行输入框',icon:'iconduohangshurukuang'});
                    this.gridColItemsArray.push({modelName:'designGridNumber',crtlType:'NUMFIELD',itemName:'数字输入框',icon:'iconshuzi1'});
                    this.gridColItemsArray.push({modelName:'designGridDate',crtlType:'TIMEFIELD',itemName:'日期输入框',icon:'iconriqi'});
                    this.gridColItemsArray.push({modelName:'designGridSelect',crtlType:'SLT',itemName:'下拉选框',icon:'iconxialaanniu'});
                    this.gridColItemsArray.push({modelName:'designGridRadio',crtlType:'RADIO',itemName:'单选框', icon:'icondanxuan1'});
                    this.gridColItemsArray.push({modelName:'designGridCheckbox',crtlType:'CHECKBOX',itemName:'多选框', icon:'iconduoxuan'});
                    this.gridColItemsArray.push({modelName:'designGridUserSelect',crtlType:'USERSLT',itemName:'选择人员', icon:'iconduoxuan'});
                    this.gridColItemsArray.push({modelName:'designGridOrgSelect',crtlType:'ORGSLT',itemName:'选择机构', icon:'iconduoxuan'});
                    this.gridColItemsArray.push({modelName:'designGridApi',crtlType:'REL_API',itemName:'API关联', icon:'iconAPI'});
                    this.gridColItemsArray.push({modelName:'designGridRelWF',crtlType:'REL_WF',itemName:'流程关联', icon:'iconAPI'});

                
                    let _attrsObj = null;
                    let _styleObj = null;
                    if(remap && remap.view && remap.view.attrs){
                        _attrsObj = remap.view.attrs;
                    }
                    if(remap && remap.view && remap.view.style){
                        _styleObj = remap.view.style;
                    }


                    let _config = {};
                    _config.view = {};
                    _config.view.type = this.crtlType;
                    _config.view.fieldTableId = _tableId;
                    _config.view.nodeType = 'table';
                    _config.view.display =  remap?remap.view.display:'数据方正';
                    

                    _config.view.attrs = {};
                    _config.view.attrs.titlePos = _attrsObj?(String(_attrsObj.titlePos) == 'true'?true:false):true;
                    _config.view.attrs.showColTitle = _attrsObj?(String(_attrsObj.showColTitle) == 'true'?true:false):true;
                    _config.view.attrs.showRowIdx = _attrsObj?(String(_attrsObj.showRowIdx) == 'true'?true:false):true;
                    _config.view.attrs.allowEditRow = _attrsObj?(String(_attrsObj.allowEditRow) == 'true'?true:false):true;

                    _config.view.attrs.gridAddbutton = _attrsObj?_attrsObj.gridAddbutton:'添加';
                    _config.view.attrs.gridRow = _attrsObj?Number(_attrsObj.gridRow):2;
                    _config.view.attrs.gridSum = _attrsObj?_attrsObj.gridSum:null;

                    _config.view.attrs.precision = _attrsObj?Number(_attrsObj.precision):2;
                    _config.view.attrs.required = _attrsObj?(String(_attrsObj.required) =='true'?true:false):false;
                    _config.view.attrs.visiable = _attrsObj?(String(_attrsObj.visiable) == 'true'?true:false):false;
                    _config.view.attrs.ispk = _attrsObj?(String(_attrsObj.ispk) == 'true'?true:false):false;
                    _config.view.attrs.isfk = _attrsObj?(String(_attrsObj.isfk) == 'true'?true:false):false;
                    _config.view.attrs.ispn = _attrsObj?(String(_attrsObj.ispn) == 'true'?true:false):false;
                    _config.view.attrs.inst = _attrsObj?(_attrsObj.inst):null;
                    _config.view.attrs.defFieldId = _attrsObj?_attrsObj.defFieldId:null;
                    _config.view.attrs.defaultVal = _attrsObj?_attrsObj.defaultVal:null;

                    _config.view.style = {};
                    _config.view.style.ftColor = _styleObj?_styleObj.ftColor:null;
                    _config.view.style.bgColor = _styleObj?_styleObj.bgColor:null;
                    _config.view.style.titleAlign = _styleObj?_styleObj.titleAlign:'left';
                    _config.view.style.titleWidth = _styleObj?Number(_styleObj.titleWidth):defaultTitleWidth;

                    _config.view.crtls = (remap && remap.view.crtls)?remap.view.crtls:[];

                    if(_config.view.crtls){
                        (_config.view.crtls).forEach((item)=>{
                            
                                item.uuid = EcoUtil.getUID();
                                item.modelName = FormUtil.getDesignGridModelName(item.type)+'Setting';
                                item.parentId = _tableId;
                                item.changedFlag = false;
                        })
                    }

                    _config.model = {};
                    _config.model.crtlType = this.crtlType;
                    _config.model.display = remap?remap.model.display:'数据方正',
                    _config.model.tableDef = _tableId;
                    _config.model.linkId = this.tableDef;
                    _config.model.fields =( remap && remap.model && remap.model.fields)?remap.model.fields:[];

                    _config.loaded1 = true;
                    _config.loaded2 = true;

                    /*初始化合计*/
                    if(_config.view.attrs.gridSum){
                        let _orderArray = _config.view.attrs.gridSum.split('|');
                        _orderArray.forEach((item)=>{
                            if(Number(item)<= _config.view.crtls.length){
                                this.$set(this.gridSumMap,_config.view.crtls[Number(item)-1].uuid,1);
                            }
                        })
                    }
                    
                    this.config = _config;

             }catch(e){
                 console.log(e);
             }
           
       },

   
    
       editChildItem(item){
                
                let _filed = 0;
                let _data = {};
                _data.key = item.uuid;
                _data.value = {};
                _data.value.view = EcoUtil.objDeepCopy(item);


                for(let i = 0;i<this.config.model.fields.length;i++){
                    if(item.fieldId  ==  this.config.model.fields[i].id){
                          _data.value.model =  EcoUtil.objDeepCopy(this.config.model.fields[i]);
                          _filed = this.config.model.fields[i].field;
                          break;
                    }
                }

                this.SET_FORM_DESIGN_MODEL_AND_VIEW(_data);
              
                this.gridShow = false;
                this.$router.push({name:item.modelName,params:{childUUID:item.uuid,childFieldId:_filed,parentGridId:this.config.view.fieldTableId}});
   
        },

       doDragChangeRow(evt){
           if(evt && evt.moved){
                 this.setGridSumValue();
           }
       },

       setFormula(){ //设置公式
             this.onEmitHandle('setFormula',true);
       },

       setFormulaCallBack(data){
            this.config.formula = data.formula
       },

        /* 申请创建操作 保存数据库数据*/
       createItem(){
            createFormItemModelAjax(this.config).then((response)=>{
                     if(response.data.status <= 99){
                        this.action = 'update';
                        this.config.itemOperateId = response.data.operate_id;
                        /*添加保存成功，向上冒泡，后面都转为更新操作*/
                        this.onEmitHandle('createConfig',true);

                        //添加一个子单行输入框
                        try{
                             let _chileItem = this.gridColItemsArray[0];
                             this.getChildrenItemModelCreateApplyFunc(_chileItem);
                        }catch(e){
                            console.log(e);
                        }

                     }else{
                        this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
                     }
                }).catch((error)=>{
                        this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
                })
        },

    

       deleteChildItem(item,idx){ 
                    this.config.view.crtls.splice(idx,1);
                    for(let j = 0;j<this.config.model.fields.length;j++){
                        if(this.config.model.fields[j].id == item.fieldId){
                            try{
                                this.config.model.fields.splice(j,1);
                            }catch(e){
                                console.log(e);
                            }
                            break;
                        }
                    }
                    
                    /*调用合计重新渲染方法*/
                    this.setGridSumValue();
        },

       toggleHeji(item){
            if(this.gridSumMap[item.uuid]){
                this.$set(this.gridSumMap,item.uuid,0);
                delete this.gridSumMap[item.uuid];
            }else{
                this.$set(this.gridSumMap,item.uuid,1);
            }
            this.setGridSumValue();
       },

       setGridSumValue(){
           try{
                let _value = null;
                let _gridSumArray = [];
                (this.config.view.crtls).forEach((element,idx)=>{
                    if(this.gridSumMap[element.uuid] == 1){
                        _gridSumArray.push(idx+1);
                    }
                })

                if(_gridSumArray.length > 0){
                    _value = _gridSumArray.join("|");
                }
              

                this.config.view.attrs.gridSum = _value;
              
           }catch(e){
               console.log(e);
           }
       },

       hasHeji(item){
            if(this.gridSumMap[item.uuid] == 1){
                return true;
            }else{
                return false;
            }
       },

       onEmitHandle(action,emitConfig){
               if(emitConfig){
                    let obj = {};
                    obj.key = this.uuid;
                    obj.value = EcoUtil.objDeepCopy(this.config);
                    this.SET_WF_FORM_DESIGN_CONFIG(obj);
                }

                let actionObj = {};
                actionObj.uuid = this.uuid;
                actionObj.action = action;
                actionObj.time = new Date().getTime();
                this.SET_WF_FORM_DESIGN_CONFIG_CHANGE2(actionObj); //设置操作
       },


       /* 申请创建操作 保存数据库数据*/
       getChildrenItemModelCreateApplyFunc(item){
            getFieldId().then((response)=>{
                    let _fieldId = response.data;

                    let _childField = {};
                    _childField.uuid = EcoUtil.getUID();
                    _childField.modelName = FormUtil.getDesignGridModelName(item.crtlType)+'Setting'
                    _childField.type = item.crtlType;
                    _childField.fieldId =  this.config.view.fieldTableId+'.'+_fieldId;
                    _childField.nodeType = 'basic';
                    _childField.display =  item.itemName;
                    _childField.attrs = {};
                    _childField.style = {};
                    _childField.style.titleAlign = 'center';
                    _childField.style.titleWidth = defaultTitleWidth;
                    
                    
                    if(_childField.type == 'NUMFIELD'){
                        _childField.attrs.constraintType = "0";
                    }else if(_childField.type == 'TIMEFIELD'){
                        _childField.attrs.dateType = 'yyyy-MM-dd';
                        _childField.attrs.defaultId = 'custom';
                        _childField.style.titleWidth = defaultColDateTitleWidth;
                    }else if(_childField.type == 'SLT'){
                        
                    }

               
                    this.config.view.crtls.push(_childField);

                     let _childModel = {};
                    _childModel.crtlType = item.crtlType;
                    _childModel.display = item.itemName;
                    _childModel.field = _fieldId ;
                    _childModel.createIdx = false ;
                    _childModel.id = this.config.view.fieldTableId+'.'+_fieldId;


                    if(_childModel.crtlType == 'TEXTFIELD' || _childModel.crtlType == 'TEXTAREA'){
                         _childModel.fieldType = 'VARCHAR';
                    }else if(_childModel.crtlType == 'NUMFIELD'){
                         _childModel.fieldType = 'DECIMAL';
                    }else if(_childModel.crtlType == 'TIMEFIELD'){
                        _childModel.fieldType = 'DATETIME';
                    }else if(_childModel.crtlType == 'SLT' || _childModel.crtlType == 'RADIO'){
                        _childModel.fieldType = 'SINGLE_LINK';
                    }else if(_childModel.crtlType == 'CHECKBOX'){
                        _childModel.fieldType = 'MULTI_LINK';
                    }

                    this.config.model.fields.push(_childModel);

                   
            }).catch((err)=>{
                    console.log(err);
                    this.$message({ message:'申请组件失败', type: 'error'  });
            })
       },

     

        onBlurChildrenItem(){
            if(this.changed){
                this.onEmitHandle('saveUpdateConfig',true);
            }
        },
     

        /*只监听grid列组件发生变化的通知*/
        watchGridConfigAction(obj){
                console.log('grid 里面监听 到的变化 '+obj.action);
                /* 监听 列组件 发生的变化*/
                if(obj.action == 'changeGirdColConfig'){ //如果是配置变化，通知组件重新渲染

                    for(let i = 0;i < this.config.view.crtls.length;i++){
                        if(this.config.view.crtls[i].uuid == obj.uuid){
                            let _item = EcoUtil.objDeepCopy(this.wfGridDesignConfig[obj.uuid]);
                            _item.view.uuid = obj.uuid;
                            _item.view.modelName = FormUtil.getDesignGridModelName(_item.view.type)+'Setting';
                            // _item.changedFlag = true;

                            try{
                                 this.$set(this.config.view.crtls,i,_item.view);
                            }catch(e){
                                console.log(e);
                            }
                     
                            for(let j = 0;j<this.config.model.fields.length;j++){
                                if(this.config.model.fields[j].id == _item.view.fieldId){
                                    try{
                                        this.$set(this.config.model.fields,j,_item.model);
                                    }catch(e){
                                        console.log(e);
                                    }
                                    break;
                                }
                            }

                            this.onEmitHandle('changeConfig',true);
                            break;
                        }
                    }

                 
                    this.DELETE_WF_GRID_DESIGN_CONFIG(obj.uuid);//删除gridstore 里面保留的信息   
                }
        },

        onFtChange(val){
            this.config.view.style.ftColor = val;
        },

        onBgChange(val){
            this.config.view.style.bgColor = val;
        },

        setColTitleNameNotEmpty(){
           if(this.config.view.crtls){
                 (this.config.view.crtls).forEach((item)=>{
                     if(item.display == ''){
                            item.display = FormUtil.getTitleNameByModelType(item.model.crtlType);
                     }
                })
            }
       }
     
  },
  watch:{
       '$route' (to, from) {
            /* 表单这边 点击不同的 grid 组件 */
            if(to.name == 'designGridSetting' && from.name == 'designGridSetting'){ 
                this.changed = false;
                this.loaded = false;
                this.initItem();
            }else if(to.name == 'designGridSetting'){ //从列组件 返回grid组件
                this.gridShow = true;
                this.setColTitleNameNotEmpty();
                if(to.params.uuid != from.params.uuid){
                        if(this.changed){
                            this.onEmitHandle('saveGridUpdateConfig',true);
                        }
                        this.changed = false;
                        this.loaded = false;
                        this.initItem();
                }
            }
       },

       config: {
            handler(newValue, oldValue) {
                if(newValue.loaded1 && newValue.loaded2){  
                    if(this.loaded){
                        this.changed = true;
                        this.onEmitHandle('changeConfig',true);
                    }else{
                        this.loaded = true;
                    }
                }
            },
            deep: true,
            immediate:true,
      },

      'wfGridDesignConfigChange'(newvalue,oldvalue){ //监听列发生的变化 里面发生的变化
            this.watchGridConfigAction(newvalue);
       }, 
  },
  beforeDestroy(){
         console.log('销毁组件前调用');
  }

}

</script>
<style scoped>
.designGridSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designGridSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designGridSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designGridSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designGridSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designGridSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designGridSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}

.designGridSettingVue .optionsDiv .edition{
    color:#409eff;
    cursor: pointer;
    font-size: 14px;
}

.designGridSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}

.designGridSettingVue .optionsDiv .noHeji{
    color:#e8e8e8;
    cursor: pointer;
    font-size: 16px;
}

.designGridSettingVue .optionsDiv .hasHeji{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}


.designGridSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:110px;
    font-size: 14px;
}
.designGridSettingVue  .addOptions{
    border: 1px dashed #e8e8e8;
    border-radius: 2px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #1ba5fa;
    vertical-align: middle;
    cursor: pointer !important;
}
.designGridSettingVue .el-select{
    width:100%;
}

.ecoSettingDesc .title{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}
.ecoSettingDesc .note{
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    color: #8b8b8b;
    font-weight: normal;
    text-align: right;
}
.designSettingVue .tip{
    font-size: 12px;
    line-height: 16px;
    color: #8b8b8b;
    font-weight: normal;
    margin:10px 0px 5px 0px;
}
.ecoSettingDesc .switchDesc{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}
.ecoSettingBlock{
    margin-bottom:10px;
}




</style>
