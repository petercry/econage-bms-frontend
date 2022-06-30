<template>
    <div class="designGridSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">

        <div class="gridClass" v-show="gridShow">
            <div class="itemVueName">数据方阵</div>
            <div class="setting">
                <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                        <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;标题名称</span> </el-col>
                        <el-col :span="12" class="note"><span>最多20字</span></el-col>
                    </el-row>
                    <div><el-input v-model="config.titleName" maxlength="20" show-word-limit></el-input></div>
                </div>

                <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                            <el-col :span="24" class="switchDesc">
                                <el-switch  v-model="config.titlePos" size="mini"> </el-switch>
                                <span>隐藏标题</span>
                            </el-col>
                    </el-row>
                </div>

                <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">标题对齐方式</span></div>
                    <div>
                        <el-radio-group v-model="config.titleAlign" >
                                <el-radio-button label="left" >左对齐</el-radio-button>
                                <el-radio-button label="center" >居中</el-radio-button>
                                <el-radio-button label="right" >右对齐</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
              
                <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                        <el-col :span="12" class="title"><span>标题文字颜色</span></el-col>
                        <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.ftColor" @active-change="onFtChange"></el-color-picker></span></el-col>
                    </el-row>
                </div>

                <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                        <el-col :span="12" class="title"><span>标题背景颜色</span></el-col>
                        <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.bgColor" @active-change="onBgChange"></el-color-picker></span></el-col>
                    </el-row>
                </div>

           
                <el-divider></el-divider>
                <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                        <el-col :span="24" class="title"><span>表格字段</span> </el-col>
                    </el-row>
                    <div>
                         <draggable  :list="config.childItems" class="list-group" handle=".handle" v-bind="dragOptions"  @change="doDragChangeRow">
                                    <div
                                        class="optionsDiv"
                                        v-for="(item,idx) in config.childItems"
                                        :key="item.uuid"
                                    >
                                        <input type="text"  v-model="item.titleName"  @blur="onBlurChildrenItem"/>
                                        <i class="icon iconfont icondrag-handle handle"></i>
                                        <i class="icon iconfont iconbianji edition" @click="editChildItem(item)"></i>
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
                                <el-switch v-model="config.showColTitle" size="mini"></el-switch>
                                <span class="">显示表头</span>
                            </el-col>

                            <el-col :span="12" class="switchDesc">  
                                <el-switch v-model="config.showRowIdx" size="mini"></el-switch>
                                <span class="">显示行号</span>
                            </el-col>

                             <el-col :span="18" class="switchDesc">  
                                <el-switch v-model="config.allowEditRow" size="mini"></el-switch>
                                <span class="">允许增删行</span>
                            </el-col>

                             <el-col :span="12" class="switchDesc">  
                                <el-switch v-model="config.allowGridImport" size="mini"></el-switch>
                                <span class="">允许导入</span>
                            </el-col>

                             <el-col :span="12" class="switchDesc">  
                                <el-switch v-model="config.allowGridExport" size="mini"></el-switch>
                                <span class="">允许导出</span>
                            </el-col>

                             
                    </el-row>
                </div>

                <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">表单新增按钮文本</span></div>
                    <div>
                        <el-input v-model="config.gridAddbutton" > </el-input>
                    </div>
                </div>

                <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">默认行数</span></div>
                    <div>
                        <el-input-number v-model="config.gridRow" :min="0" :max="3" label="默认行数" size="mini"></el-input-number>
                    </div>
                </div>


                 <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">精度</span></div>
                    <div>
                        <el-input-number v-model="config.precision" :min="0" :max="10" label="精度" size="mini"></el-input-number>
                    </div>
                </div>

             <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">公式</span></div>
                <div>
                    <el-input v-model="config.formula" >
                          <template slot="append"><i class="icon iconfont icongongshi pointerCalss"  @click="setFormula"></i></template>
                    </el-input>
                </div>
            </div>

                
                <el-divider></el-divider>
                <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                            <el-col :span="12" class="switchDesc">  
                                <el-switch v-model="config.nullable" size="mini"></el-switch>
                                <span class="">必填</span>
                            </el-col>
                            <el-col :span="12" class="switchDesc">
                                <el-switch v-model="config.visiable" size="mini"></el-switch>
                                <span>隐藏</span>
                            </el-col>
                    </el-row>
                    <el-row class="ecoSettingDesc">
                            <el-col :span="12" class="switchDesc">
                                <el-switch  v-model="config.ispk" size="mini"> </el-switch>
                                <span>主键</span>
                            </el-col>
                    </el-row>
                
                </div>

                <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">自定义标识</span></div>
                    <div><el-input v-model="config.defFieldId" ></el-input></div>
                    <div class="tip">注：用于二次开发接口时的唯一性标识，建议使用英文命名</div>
                </div>

                <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">操作提示</span></div>
                    <div><el-input v-model="config.inst" ></el-input></div>
                </div>

            </div>
        </div>

        <div v-show="!gridShow">
            <router-view></router-view>
        </div>

    </div>
</template>
<script>

import {getItemModelCreateApplyAjax,createFormItemModelAjax,getItemModelUpdateApplyAjax,saveFormItemModelOrderAjax,deleteFormItemModelAjax} from'../../../../service/service'
import {defaultTitleWidth,defaultColDateTitleWidth, defaultFTColor}  from'../../../../config/setting.js'
import {FlowFormUtil} from '../../../../config/util.js'
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
        itemId:0,
        formOperateId:0,
        action:null,
        loaded:false,
        childItemLoaded:false,
        changed:false,
        gridShow:true,

        config:{
            loaded1:false,
            loaded2:false,
            itemId:0,
            itemOperateId:0,
            modelType:'GRID',
            changeLine:1,
            titleName:'数据方阵', //标题名称
            titlePos:true,//标题位置
            titleAlign:'left',//标题对齐方式
       
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
            formula:null,
            nullable:false, //必填
            visiable:false, //隐藏
            ispk:false, //主键
          
            itemWidth:160, //组件宽度 占比 整型
            inst:null,//操作提示
            defFieldId:null,//自定义表示
         
            gridAddbutton:'添加',//表单新增按钮文本 数据方阵
            gridRow:2,//表单默认行数 数据方阵
            gridSum:null,
            showColTitle:true,//显示表头
            showRowIdx:true,//显示行号
            allowEditRow:true,//允许增删行 
            allowGridImport:false,
            allowGridExport:false,
            precision:2,//精度
            childItems:[]
        },
        
   
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
            'wfFormDesignConfig',
            'wfFormDesignConfigChange',
            'wfGridDesignConfig',
            'wfGridDesignConfigChange',
            'viewTabActiveKey'
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
            this.itemId = this.$route.params.itemId;
            this.formOperateId = this.$route.params.formOperateId;
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
            getItemModelCreateApplyAjax(this.formOperateId,this.config.modelType,1).then((response)=>{
                if(response.data.status <= 99){
                        let _itemOperateId = response.data.operate_id;
                        let _itemId = response.data.remap.item_id;
                        /*初始化配置信息*/
                        this.initConfig(_itemOperateId,_itemId);
                        this.createItem();
                }else{
                        this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
                }         
            }).catch((err)=>{
                console.log(err);
                this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
            })
       },

       /*申请更新表单组件*/ 
       getItemModelUpdateApplyFunc(){ 
            getItemModelUpdateApplyAjax(this.formOperateId,this.itemId).then((response)=>{
                if(response.data.status <= 99){
                        let _itemOperateId = response.data.operate_id;
                        let _itemId = response.data.remap.item_model.itemId;

                      
                        this.initConfig(_itemOperateId,_itemId,response.data.remap);
                }         
            }).catch((err)=>{
                console.log(err);
            })
       },
        
       /*初始化配置信息*/
       initConfig(_itemOperateId,_itemId,remap){
            this.gridColItemsArray = [];
            this.gridColItemsArray.push({modelName:'designGridInput',modelType:'TEXTFIELD', itemName:'单行输入框',icon:'icondanhangshurukuang'});
            this.gridColItemsArray.push({modelName:'designGridTextarea',modelType:'TEXTAREA',itemName:'多行输入框',icon:'iconduohangshurukuang'});
            this.gridColItemsArray.push({modelName:'designGridNumber',modelType:'NUMFIELD',itemName:'数字输入框',icon:'iconshuzi1'});
            this.gridColItemsArray.push({modelName:'designGridDate',modelType:'TIMEFIELD',itemName:'日期输入框',icon:'iconriqi'});
            this.gridColItemsArray.push({modelName:'designGridSelect',modelType:'SLT',itemName:'下拉选框',icon:'iconxialaanniu'});
            this.gridColItemsArray.push({modelName:'designGridRadio',modelType:'RADIO',itemName:'单选框', icon:'icondanxuan1'});
            this.gridColItemsArray.push({modelName:'designGridCheckbox',modelType:'CHECKBOX',itemName:'多选框', icon:'iconduoxuan'});
            this.gridColItemsArray.push({modelName:'designGridUserSelect',modelType:'USERSLT',itemName:'选择人员', icon:'iconduoxuan'});
            this.gridColItemsArray.push({modelName:'designGridOrgSelect',modelType:'ORGSLT',itemName:'选择机构', icon:'iconduoxuan'});
            this.gridColItemsArray.push({modelName:'designGridApi',modelType:'REL_API',itemName:'API关联', icon:'iconAPI'});
            this.gridColItemsArray.push({modelName:'designGridRelWF',modelType:'REL_WF',itemName:'流程关联', icon:'iconAPI'});
            this.gridColItemsArray.push({modelName:'designGridAttachment',modelType:'ATTACHEMENT',itemName:'附件', icon:'iconAPI'});
           
            
            this.gridKvMap = remap?remap.kvMap:[];

            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;
            _config.modelType = 'GRID',

            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'数据方阵';
            _config.titlePos = remap?(remap.item_model.titlePos=='n'?true:false):true;//隐藏标题 默认隐藏
            _config.titleAlign = remap?remap.item_model.titleAlign:'left';
            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
            _config.ispk = remap?(remap.item_model.ispk==1?true:false):false; //主键

            _config.defFieldId = remap?remap.item_model.defFieldId:null;
            _config.inst = remap?remap.item_model.inst:null;
      
            _config.formula = remap?remap.item_model.formula:null;//公式
         
            _config.gridAddbutton = remap?remap.item_model.gridAddbutton:'添加';//表单新增按钮文本 数据方阵
            _config.gridRow = remap?remap.item_model.gridRow:2;//表单默认行数 数据方阵
            _config.gridSum = remap?remap.item_model.gridSum:null;//表单默认行数 数据方阵

            _config.showColTitle = remap?(remap.item_model.showColTitle==1?true:false):true;//显示表头 1显示
            _config.showRowIdx = remap?(remap.item_model.showRowIdx==1?true:false):true;//显示行号 1显示
            _config.allowEditRow = remap?(remap.item_model.allowEditRow==1?true:false):true;//允许增删行 1显示
            _config.allowGridImport = remap?(remap.item_model.gridImport==1?true:false):true;//允许增删行 1显示
            _config.allowGridExport = remap?(remap.item_model.gridExport==1?true:false):true;//允许增删行 1显示
            _config.precision = remap?remap.item_model.precision:2;//精度
            _config.childItems = (remap && remap.child_item)?remap.child_item:[];
            
            if(_config.childItems){
                 (_config.childItems).forEach((item)=>{
                        item.uuid = EcoUtil.getUID();
                        item.modelName = FlowFormUtil.getDesignGridModelName(item.modelType)+'Setting';
                        item.KVMap = this.gridKvMap[item.kvName];
                        item.parentId = _itemId;
                        item.changedFlag = false;
                })
            }
            
            _config.loaded1 = true;
            _config.loaded2 = true;

            /*初始化合计*/
            if(_config.gridSum){
                let _orderArray = _config.gridSum.split('|');
                _orderArray.forEach((item)=>{
                    if(Number(item)<= _config.childItems.length){
                        this.$set(this.gridSumMap,_config.childItems[Number(item)-1].uuid,1);
                    }
                })
            }
            this.config = _config;
           
       },

   
    
       editChildItem(item){
            this.gridShow = false;
            this.$router.push({name:item.modelName,params:{childUUID:item.uuid,childItemId:item.itemId,parentItemId:this.config.itemId}});
            
       },

       doDragChangeRow(evt){
           if(evt && evt.moved){
                 this.saveGridLayout();
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
            createFormItemModelAjax(this.config,this.viewTabActiveKey).then((response)=>{
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
             deleteFormItemModelAjax(this.formOperateId,item.itemId).then((response)=>{
                    if(response.data.status <= 99){
                            let actionObj = {};
                            actionObj.uuid = item.uuid;
                            actionObj.action = 'deleteNeedSaveUpdateItem';
                            actionObj.time = new Date().getTime();
                            this.SET_WF_FORM_DESIGN_CONFIG_CHANGE(actionObj); //设置操作

                            this.config.childItems.splice(idx,1);
                            /* 调用重新布局方法 保存到数据库*/
                            this.saveGridLayout();
                            /*调用合计重新渲染方法*/
                            this.setGridSumValue();

                    }else{
                        this.$message({message:'删除失败',type: 'error'});
                    }
                }).catch((error)=>{
                       this.$message({message:'删除失败',type: 'error'});
                })
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
                (this.config.childItems).forEach((element,idx)=>{
                    if(this.gridSumMap[element.uuid] == 1){
                        _gridSumArray.push(idx+1);
                    }
                })
                if(_gridSumArray.length > 0){
                    _value = _gridSumArray.join("|");
                }
                this.config.gridSum = _value;
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
            let _childConfig = {};
            _childConfig.modelType = item.modelType;
            _childConfig.titleName = item.itemName;
            _childConfig.titleWidth = defaultTitleWidth;
            _childConfig.parentId = this.config.itemId;
            _childConfig.titleAlign = 'center'
            
            _childConfig.uuid = EcoUtil.getUID();

            if(item.modelType == 'TIMEFIELD'){ //时间
                _childConfig.defaultId = '17';
                _childConfig.subTypeId = 14;
                _childConfig.titleWidth = defaultColDateTitleWidth;
            }else if(item.modelType == 'USERSLT'){
                _childConfig.subTypeId = 16;
                _childConfig.defaultId = '17';
            }else if(item.modelType == 'ORGSLT'){
                _childConfig.subTypeId = 17;
                _childConfig.defaultId = '17';
            }else if(item.modelType == 'TEXTAREA' || item.modelType == 'TEXTFIELD'){
                _childConfig.defaultId = '0';
            }

            if(item.modelType == 'RADIO' || item.modelType == 'SLT' || item.modelType == 'CHECKBOX'){
                _childConfig.changedFlag = true;
            }

            /*申请添加操作*/
            getItemModelCreateApplyAjax(this.formOperateId,_childConfig.modelType,1).then((response)=>{
                if(response.data.status <= 99){
                    _childConfig.itemId = response.data.remap.item_id;
                    _childConfig.itemOperateId = response.data.operate_id;
                    _childConfig.modelName = FlowFormUtil.getDesignGridModelName(_childConfig.modelType)+'Setting';
                    _childConfig.apiSceneId = response.data.remap.api_scene_id;
                    _childConfig.viewSceneId = response.data.remap.view_scene_id;

                    this.createChildrenItem(_childConfig);
                }else{
                    this.$message({ message:'申请组件失败', type: 'error'  });
                }         
            }).catch((err)=>{
                 console.log(err);
                 this.$message({ message:'申请组件失败', type: 'error'  });
            })
       },

       /*添加列组件*/
       createChildrenItem(config){
            createFormItemModelAjax(config,this.viewTabActiveKey).then((response)=>{ 
                    if(response.data.status <= 99){ //创建列组件成功，同时调用grid里面的布局
                        this.config.childItems.push(config);
                        /*调用grid 里面的布局*/
                        this.saveGridLayout();
                     }else{
                        this.$message({ message:'创建组件失败 '+response.data.msg, type: 'error'  });
                     }
                }).catch((error)=>{
                        console.log(error);
                        this.$message({ message:'创建组件失败', type: 'error'  });
                })
        },

        onBlurChildrenItem(){
            if(this.changed){
                this.onEmitHandle('saveUpdateConfig',true);
            }
        },

        /*保存列组件布局*/
        saveGridLayout(){
            let saveFormLayoutObj = [];
            let idx = 0;
            if(this.config.childItems){
                (this.config.childItems).forEach((item,colIdx)=>{
                    idx++;
                    saveFormLayoutObj.push({itemId:item.itemId,value:(colIdx==0?1:0)+'-'+idx})
                })
            }
            let that = this;
            saveFormItemModelOrderAjax(this.formOperateId,this.config.itemId,saveFormLayoutObj).then((response)=>{
                  if(response.data.status <= 99){
                      
                  }else{
                         this.$message({ message:'grid列布局失败', type: 'error'  });
                  }
            }).catch((error)=>{
                     this.$message({ message:'grid列布局失败', type: 'error'  });
            })
        },

     

        /*只监听grid列组件发生变化的通知*/
        watchGridConfigAction(obj){
                console.log('grid 里面监听 到的变化 '+obj.action);
                /* 监听 列组件 发生的变化*/
                if(obj.action == 'changeGirdColConfig'){ //如果是配置变化，通知组件重新渲染
                    for(let i = 0;i < this.config.childItems.length;i++){
                        if(this.config.childItems[i].uuid == obj.uuid){
                            let _item = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);
                            _item.uuid = obj.uuid;
                            _item.changedFlag = true;
                            _item.modelName = FlowFormUtil.getDesignGridModelName(_item.modelType)+'Setting';

                            try{
                                 this.$set(this.config.childItems,i,_item);
                            }catch(e){
                                console.log(e);
                            }
                     
                            this.onEmitHandle('changeConfig',true);
                            break;
                        }
                    }
                    this.DELETE_WF_GRID_DESIGN_CONFIG(obj.uuid);//删除gridstore 里面保留的信息   
                }
               
        },

        onFtChange(val){
           this.config.ftColor = val;
       },

       onBgChange(val){
           this.config.bgColor = val;
       },

       setColTitleNameNotEmpty(){
           if(this.config.childItems){
                 (this.config.childItems).forEach((item)=>{
                     if(item.titleName == ''){
                        item.titleName = FlowFormUtil.getTitleNameByModelType(item.modelType);
                        
                     }
                })
            }
       }
     
  },
  watch:{
       '$route' (to, from) {
            /* 表单这边 点击不同的 grid 组件 */
            if(to.name == 'designGridSetting' && from.name == 'designGridSetting'){ 
                if(this.changed){
                    this.onEmitHandle('saveGridUpdateConfig',true);
                }
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
         if(this.changed){
             this.onEmitHandle('saveGridUpdateConfig',true);
         }
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
