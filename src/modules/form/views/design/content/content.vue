<template>
    <div class="formContentVue flowFormVue designTable">

        <div class="designTopModule">

            <flowFormStep :title="formModel.name" :step="0"  @close="closeDialog" :checkSave="saveFormAll"  ref="flowFormStep" >
                    <span slot="rightDiv">
                         <el-button size="medium" type="primary" @click="saveFormAll(true)">保存</el-button>
                    </span>
            </flowFormStep>
        </div>

        <div class="designLeftModule">
            <div class="designLeftModuleContent">
                    <div v-for="(groupItem,index) in moduleGroup" :key="'groud'+index">
                        <div class="moduleDesc">{{groupItem.name}}</div>
                            <draggable
                                class="dragArea list-group modelOriItem"
                                :list="groupItem.moduleList"  
                                :clone="doModelClone"
                                 v-bind="dragItemOptions"
                                 
                            >
                                <div class="list-group-item " v-for="(element,idx) in groupItem.moduleList" :key="element.id+'module'+idx" @click="clickAddModuleItem(element)">
                                    <span class="title"><i class="icon iconfont " v-bind:class="[element.icon]"></i>&nbsp;{{ element.itemName }}</span>
                                </div>
                            </draggable>
                    </div>
                </div>
        </div>

        <div class="designContent">
                <div class="flowForm" v-bind:style="{width:formWidth+'px'}">  
                
                            <span class="flowFormSettingBorder"> </span>
                            <span class="flowFormSetting"  @click="goFormSettingRouter" title="点此编辑表单整体属性">
                                <el-tooltip class="item" effect="dark" :content="'点此编辑表单整体属性'" placement="top" >
                                     <span>  <i class="icon iconfont iconshezhi flowFormSettingIcon"></i></span>
                                 </el-tooltip>
                            </span>

                             <component 
                                    slot="header"
                                    :is="'designForm'" 
                                    :mConfig="formModelMap[formKey]"
                                    id="designComponentForm"
                                    ref="designComponentForm"
                                    @click.native="goFormSettingRouter"
                                    v-bind:class="{active:formKey == activeUuid}"
                            ></component>

                    <!--表单-->

                <draggable
                        v-model="rowArray"
                        @change="doDragChangeRow"
                        v-bind="dragRowOptions"
                        :ref="'dragRowRef'"
                        @start="drag=true"
                        @end="drag=false"
                        style="min-height:400px"
                    >
                                <div
                                    v-for="(rowsItem,rowIdx) in rowArray"
                                    :key="'row'+rowIdx"
                                    class="flowFormRow"
                                    style="display:table;width:100%;height:0px;"
                                >   
                                    <div style="display:table-row">
                                           <div
                                                v-for="(colItem,colIdx) in rowsItem.items"
                                                :key="'col'+colIdx"
                                                v-bind:class="{lastColComponent:colIdx == (rowsItem.items.length-1),firstColComponent:colIdx==0,active:colItem.uuid == activeUuid}"
                                                class="flowFormCol"
                                                style="display:table-cell"
                                                v-bind:style="{width:Math.floor(100/rowsItem.items.length)+'%'}"
                                            >
                                             
                                                <component 
                                                    :is="colItem.designModelName" 
                                                    :id="'designComponent'+colItem.uuid"
                                                    :ref="'designComponent'+colItem.uuid"
                                                    v-bind:class="{active:colItem.uuid == activeUuid}"

                                                    :mItem="colItem"
                                                    :mConfig="formPCViewMap[colItem.uuid]"
                                                    :mFormConfig="formPCViewMap[formKey]"

                                                    :formWidth="formWidth"
                                                    @mouseup.native="clickModel($event,colItem)"
                                                    :label="colItem.fieldId"

                                                ></component>

                                                <span class="moveUpIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID'"><i class="icon iconfont iconxiangshangyuanjiantou" @mouseup="moveModelUp(rowIdx,colIdx)"></i></span>
                                                <span class="moveDownIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID'"><i class="icon iconfont iconxiangxiayuanjiantou" @mouseup="moveModelDown(rowIdx,colIdx)"></i></span>
                                                <span class="moveLeftIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID' && colIdx !=0"><i class="icon iconfont icon07jiantouxiangzuofill" @mouseup="moveModelLeft(rowIdx,colIdx)"></i></span>
                                                <span class="moveRightIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID' && colIdx != (rowsItem.items.length-1) " ><i class="icon iconfont icon07jiantouxiangyoufill" @mouseup="moveModelRight(rowIdx,colIdx)"></i></span>
                                                <span class="DeleteIcon pointerClass" v-show="colItem.uuid == activeUuid "><i class="icon iconfont iconshanchu1" @mouseup="deleteModel(rowIdx,colIdx)"></i></span>
                                              
                                         </div>          
                                     </div>
                                </div>
                </draggable>

           </div>
        </div>

    </div>
</template>
<script>


import {getModuleGroup,getDesignViewModel,updateDesignViewModel} from'../../../service/service'
import {defaultFormWidth} from '../../../config/setting.js'
import axios from 'axios'
import draggable from "../../../assets/js/vuedraggable";
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import {Loading} from 'element-ui';
import {FormUtil} from '../../../config/util'


import designForm from "../module/designForm.vue";
import designRadio from "../module/designRadio.vue";
import designSelect from "../module/designSelect.vue";
import designCheckbox from "../module/designCheckbox.vue";
import designDate from "../module/designDate.vue";
import designInput from "../module/designInput.vue";
import designTextarea from "../module/designTextarea.vue";
import designNumber from "../module/designNumber.vue";
import designAttachement from "../module/designAttachement.vue";

// import designUserSelect from "../module/designUserSelect.vue";
// import designOrgSelect from "../module/designOrgSelect.vue";
// import designSegmentHeader from "../module/designSegmentHeader.vue";
import designApproval from "../module/designApproval.vue";

import designGrid from "../module/grid/designGrid.vue";
import designImg from "../module/designImg.vue";
// import designSeqField from "../module/designSeqField.vue";
// import designSeal from "../module/designSeal.vue";
// import designApi from "../module/designApi.vue";
// import designRelWF from "../module/designRelWF.vue";
// import designCascader from "../module/designCascader.vue";
import flowFormStep from "./flowFormStep.vue";


export default{
  name:'layoutContent',
  components:{
        draggable,
        designForm,
        designRadio,
        designSelect,
        designCheckbox,
        designInput,
        designTextarea,
        designNumber,
        designDate,

    //    designUserSelect,
    //    designOrgSelect,
    //    designSegmentHeader,
        designApproval,
        designAttachement,
        designImg,
    //    designSeqField,
    //    designSeal,
       designGrid,
    //    designApi,
    //    designRelWF,
    //    designCascader,
       flowFormStep,
     
  },

  data(){
      return {
          viewId:0,
          viewObj:{},
       
          moduleGroup:[],
          rowArray:[],
          formId:0,
          formKey:'FORM',
          formOperateId:0,
          formModel:{},
          formItems:[],
          formSys:{},
          formThemeStyleAO:{},
          formGrids:{},
          formKVMap:{},

          dataApprovals:{},
          dataGrids:{},
          dataItemOAObj:{},
          dataPageEvents:{},
        
          activeUuid:'',
          drag: false,
          formItemConfigObj:{},
          saveConfig:{
              loading:false,
              msg:'',
          },
          dragItemOptions:{
                group:{name:'module',pull:'clone',put:false},
                draggable:'.list-group-item',
                handle:'.list-group-item',
                sort:false,
                forceFallback:true,
          },
          dragRowOptions:{
                animation: 150,
                group: "module",
                ghostClass: "ghost", 
                draggable:'.flowFormRow',
                handle:'.flowFormRow',
                scroll:true,
                forceFallback:true,
            },

            loadingInstance:null, //loading 信息
            needSaveCreateItemConfig:{}, //需要保存的 添加组件
            needSaveUpdateItemConfig:{}, //需要保存的 修改组件
            needSaveDeleteItemConfig:{}, //需要保存的 删除组件
            needSaveFormConfig:{}, //需要保存的 表单信息
            needSaveUpdateSuccessItems:[],
            needSaveDeleteSuccessItems:[],
            formSaveStatus:{    //保存的状态信息
                success:true,
                saving:false,
                needSaveCount:0,
                hasSaveCount:0,
            },
            formSaveMsg:[],
            clickStepName:null,
        

            formModelMap:{},
            formPCViewMap:{}
    };
  },

    computed: {
     ...mapState([
            'wfFormDesignConfig',
            'wfFormDesignConfigChange',
            'wfFormDesignConfigChange2'
     ]),

    formWidth(){
            if(this.formItemConfigObj && this.formItemConfigObj[this.formKey] && this.formItemConfigObj[this.formKey].formWidth){
                return Number(this.formItemConfigObj[this.formKey].formWidth);
            }else if(this.formModel && this.formModel.formWidth){
                return Number(this.formModel.formWidth);
            }else{
                return Number(defaultFormWidth);
            }
    },
   
  },


  mounted(){

  },
  created(){
         this.viewId = this.$route.params.viewId;
         this.initModelGroup();  // /*初始化组件信息*/
         this.INIT_WF_FORM_DESIGN_CONFIG(); // /*初始化store 中的数据*/
         this.getDesignViewModelFunc(); 
    },
    methods: {   
        
        ...mapMutations([
            'INIT_WF_FORM_DESIGN_CONFIG',
            'DELETE_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_FORM_DESIGN_MODEL_AND_VIEW'
        ]),
    
        /*初始化组件信息*/
        initModelGroup(){
            getModuleGroup().then((response)=>{
                this.moduleGroup = response.data.moduleGroup;
            })
        },

        /*获取表单信息*/
        getDesignViewModelFunc(){
                this.loadingInstance = Loading.service({ fullscreen: true,text:'初始化表单信息,请稍等...'});
                getDesignViewModel(this.viewId).then((response)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            this.loadingInstance.close();
                        });

                        this.viewObj = response.data;
                        this.initDataInfo();
                        this.drawViewLayout();  /*初始化布局方法*/
                });
        },

        initDataInfo(){
            this.formModelMap = {};
            this.formPCViewMap = {};
            if(this.viewObj && this.viewObj.model){
                //初始化表单 物理配置
                this.formModelMap[this.formKey] = {shortName:this.viewObj.model.shortName,fullName:this.viewObj.model.fullName};
                
                //初始化普通组件 物理配置
                if(this.viewObj.model.fields){
                    this.viewObj.model.fields.forEach((item)=>{ 
                            let _item = EcoUtil.objDeepCopy(item);
                            this.formModelMap[_item.id] = _item;
                    })
                }

                if(this.viewObj.model.detailTables){
                    this.viewObj.model.detailTables.forEach((item)=>{
                            let _item = EcoUtil.objDeepCopy(item);
                            this.formModelMap[_item.tableDef] = _item;

                            //grid 里面的列
                            // if(_item.fields && _item.fields.length > 0){
                            //         (_item.fields).forEach((oneColItem)=>{
                            //             let _oneColItem = EcoUtil.objDeepCopy(item);
                            //             this.formModelMap[_oneColItem.id] = _oneColItem;
                            //         })
                            // }
                    })
                }
            }

            //初始化表单 视图配置
            this.$set(this.formPCViewMap,this.formKey,{
                style:this.viewObj.view.style?this.viewObj.view.style:{},
                attrs:this.viewObj.view.attrs?this.viewObj.view.attrs:{}
            });
        },


        /*初始化布局方法*/
        drawViewLayout(){
            let colArray = [];
            if(this.viewObj.view.pcCrtls && this.viewObj.view.pcCrtls.length > 0){
                this.viewObj.view.pcCrtls.forEach((item)=>{
                        let _uid =  EcoUtil.getUID();
                        let _item = EcoUtil.objDeepCopy(item);
                        _item.designModelName = FormUtil.getDesignModelName(_item.type,_item.nodeType);
                        _item.uuid = _uid ;
                        _item.action = 'update';
                        if(_item.attrs && _item.attrs.changeLine == 1){ //是否换行
                            if(colArray.length !=0 ){
                                let rowObj = {};
                                rowObj.items = colArray;
                                this.rowArray.push(rowObj);
                                colArray = [];
                            }
                                colArray.push(_item);
                        }else{
                                colArray.push(_item);
                        }
                        
                        this.$set(this.formPCViewMap,_item.uuid,EcoUtil.objDeepCopy(_item));
                })

                if(colArray.length !=0 ){
                        let rowObj = {};
                        rowObj.items = colArray;
                        rowObj.colSpan = Math.floor(24/rowObj.items.length);
                        this.rowArray.push(rowObj);
                }
            }
          
        },
          
        /*编辑表单基本信息*/ 
        goFormSettingRouter(){  
                this.activeUuid = this.formKey;

                let _pcView = this.formPCViewMap[this.formKey];
                let _model = this.formModelMap[this.formKey];
                let _data = {};

                _data.key = this.formKey;
                _data.value = {};
                _data.value.view = _pcView;
                _data.value.model = _model;

                this.SET_FORM_DESIGN_MODEL_AND_VIEW(_data);
                this.$router.push({name:'designFormSetting'});
        },

        /*克隆左边组件 返回的对象*/
        doModelClone(item) { 
            let _uuid = EcoUtil.getUID();
            return {
                items:[
                    {
                        display:item.itemName,
                        titleAlign:'left',
                        designModelName:item.moduleName,
                        fieldId:0,
                        uuid:_uuid,
                        action:'create'
                    }]
            }
        },

        /*点击左侧节点*/
        clickAddModuleItem(item){
             let _oldActiveUUID = this.activeUuid;
             let _obj = this.getRowAndColByUUID(this.activeUuid);
             let _uuid = EcoUtil.getUID();
             let _item = {
                    itemName:item.itemName,
                    titleName:item.itemName,
                    titleAlign:'l',
                    designModelName:item.moduleName,
                    fieldId:0,
                    uuid:_uuid,
                    action:'create'
            }

            let _rowItems = {items:[_item]};
            if(_obj.hasItem){
                    this.rowArray.splice(_obj.rowIndex+1,0,_rowItems);
            }else{
                 if(this.activeUuid == 'FORM'){
                    this.rowArray.splice(0,0,_rowItems);
                }else{
                    this.rowArray.splice(this.rowArray.length,0,_rowItems);
                }
            }

            this.activeUuid = _item.uuid;
            this.$router.push({
                        name:_item.designModelName+'Setting',
                        params:{
                            formOperateId:this.formOperateId,
                            uuid:_item.uuid,
                            fieldId:_item.fieldId,
                            action:_item.action
            }});

            try{
                document.getElementById('designComponent'+_oldActiveUUID).scrollIntoView();
            }catch(e){
                console.log(e);
            }

        },

        /*克隆左边组件触发*/
        doDragChangeRow(evt){
            /* 克隆添加组件 */
            if(evt && evt.added){ 
                let _item = evt.added.element.items[0];
                this.activeUuid = _item.uuid;
                this.$router.push({
                        name:_item.designModelName+'Setting',
                        params:{
                            formOperateId:this.formOperateId,
                            uuid:_item.uuid,
                            tableDef:this.viewObj.model.tableDef,
                            action:_item.action
                        }});
            }
        },
        
        startDraggable(e){
            console.log(e);
        },

        /*点击组件*/
        clickModel($event,item){
            let _urluuid = this.$route.params.uuid;
            if(false && $event.target.className.indexOf('iconshanchu')>-1){ //点击删除

            }else{
                /*不同一个组件点击，相同组件，多次点击不触发 */
                if(_urluuid != item.uuid){ 
                    if($event.target.className.indexOf('iconshanchu')==-1){
                            this.activeUuid = item.uuid;
                            let _pcView = this.formPCViewMap[item.uuid];
                            let _model = null;
                            if(_pcView.nodeType == 'table' && _pcView.fieldTableId){
                                _model = this.formModelMap[_pcView.fieldTableId];
                            }else if(_pcView.nodeType == 'basic' &&  _pcView.fieldId){
                                _model = this.formModelMap[_pcView.fieldId];
                            }
                            
                            let _data = {};
                            _data.key = item.uuid;
                            _data.value = {};
                            _data.value.view = _pcView;
                            _data.value.model = _model;
                            this.SET_FORM_DESIGN_MODEL_AND_VIEW(_data);

                            this.$router.push({
                                name:item.designModelName+'Setting',
                                params:{
                                    uuid:item.uuid,
                                    tableDef:this.viewObj.model.tableDef,
                                    action:item.action
                                }});
                            }
                }
            }
       },

        /*组件向上移动*/
        moveModelUp(rowIndex,colIndex){
            let _item = EcoUtil.objDeepCopy(this.rowArray[rowIndex].items[colIndex]);
            if(this.rowArray[rowIndex].items.length == 1){
                if(rowIndex > 0){
                    this.rowArray.splice(rowIndex,1);
                    this.rowArray[rowIndex-1].items.push(_item);
                }
            }else{
                if(rowIndex > 0){
                    this.rowArray[rowIndex].items.splice(colIndex,1);
                    this.rowArray[rowIndex-1].items.push(_item);
                }else{
                    this.rowArray[rowIndex].items.splice(colIndex,1);
                    let _rowItem = {};
                    _rowItem.items = [];
                    _rowItem.items.push(_item);
                    this.rowArray.splice(0,0,_rowItem);
                }
            }
        },
        
        /*向下移动组件*/
        moveModelDown(rowIndex,colIndex){
                let _item = EcoUtil.objDeepCopy(this.rowArray[rowIndex].items[colIndex]);
                if(this.rowArray[rowIndex].items.length == 1){
                    if(rowIndex < (this.rowArray.length-1)){
                        this.rowArray[rowIndex+1].items.push(_item);
                        this.rowArray.splice(rowIndex,1);
                    }
                }else{
                    if(rowIndex < (this.rowArray.length-1)){
                        this.rowArray[rowIndex].items.splice(colIndex,1);
                        this.rowArray[rowIndex+1].items.push(_item);
                    }else{
                         this.rowArray[rowIndex].items.splice(colIndex,1);
                         let _rowItem = {};
                         _rowItem.items = [];
                         _rowItem.items.push(_item);
                         this.rowArray.splice(rowIndex+1,0,_rowItem);
                    }
                }
        },
        
        /*向左移动组件*/
        moveModelLeft(rowIndex,colIndex){
                let _item = EcoUtil.objDeepCopy(this.rowArray[rowIndex].items[colIndex]);
                if(this.rowArray[rowIndex].items.length > 1){
                    if(colIndex > 0){
                         this.rowArray[rowIndex].items.splice(colIndex,1);
                         this.rowArray[rowIndex].items.splice(colIndex-1,0,_item);
                    }
                }
        },

        /*向右移动组件*/
        moveModelRight(rowIndex,colIndex){
                let _item = EcoUtil.objDeepCopy(this.rowArray[rowIndex].items[colIndex]);
                if(this.rowArray[rowIndex].items.length > 1){
                    if(colIndex < (this.rowArray[rowIndex].items.length-1)){
                         this.rowArray[rowIndex].items.splice(colIndex,1);
                         this.rowArray[rowIndex].items.splice(colIndex+1,0,_item);
                    }
                }
        },

        /*拷贝组件 有问题*/
        copyModel(rowIndex,colIndex){      
            
            return ;
            let _item = EcoUtil.objDeepCopy(this.formItems[rowIndex].items[colIndex]);
            _item.uuid = EcoUtil.getUID();
            let _rowItem = {};
            _rowItem.items = [];
            _rowItem.items.push(_item);
            this.$set(this.formItemConfigObj,_item.uuid,_item);
            this.formItems.splice(rowIndex+1,0,_rowItem);
        },


        /*删除组件*/
        deleteModel(rowIndex,colIndex){
            let _item = this.rowArray[rowIndex].items[colIndex];

            if(_item.action == 'update'){ //数据库中组件已经存在 添加的组件，都会先添加到数据库，变为update的组件
                  this.deleteFormItemModelFunc(_item,rowIndex,colIndex);
           }else if(_item.action == 'create'){ //create 创建成功后 直接面为 update了
                  this.deleteFormItemModelAndClickNextItem(rowIndex,colIndex);
            }
        },

        watchConfigAction(obj){
            if(obj.action == 'changeConfig'){ //如果是配置变化，通知组件重新渲染
                    let _item = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);
                    if(_item.model.crtlType == 'GRID'){
                        this.$set(this.formModelMap,_item.model.tableDef,_item.model);
                    }else{
                        this.$set(this.formModelMap,_item.model.id,_item.model);
                    }   
                  
                    this.$set(this.formPCViewMap,obj.uuid,_item.view);
                    this.DELETE_WF_FORM_DESIGN_CONFIG(obj.uuid);//删除store 里面保留的信息   
                    
            }else if(obj.action == 'changeGirdColConfig'){// grid的列发生变化

                   
            
            }else if(obj.action == 'createConfig'){ //拖拽添加组件，第一次添加数据库完成
                     
                     let _item = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);
                     
                     if(_item.view.nodeType == 'table'){
                        this.$set(this.formModelMap,_item.model.tableDef,_item.model);
                        this.$set(this.formPCViewMap,obj.uuid,_item.view);
                     }else if(_item.view.nodeType == 'basic'){
                        this.$set(this.formModelMap,_item.model.id,_item.model);
                        this.$set(this.formPCViewMap,obj.uuid,_item.view);
                     }

                     let _rowColObj = this.getRowAndColByUUID(obj.uuid);
                     this.rowArray[_rowColObj.rowIndex].items[_rowColObj.colIndex].action = 'update';

            }else if(obj.action == 'saveUpdateConfig'){ //保存数据库 更新表单组件

                    // this.updateFormItemModelFunc(EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]),obj.uuid); //后台调用更新操作，减少最后提交的数量
                    // this.DELETE_WF_FORM_DESIGN_CONFIG(obj.uuid);//删除store 里面保留的信息
            
            }else if(obj.action == 'saveGridUpdateConfig'){ //保存数据库 更新grid表单组件
            
            }else if(obj.action == 'saveGridColUpdateConfig'){//保存数据库 更新grid的 列组件

            }else if(obj.action == 'itemModelCreateApplyFaild'){ //申请表单失败
                    let _rowColObj = this.getRowAndColByUUID(obj.uuid);
                    this.$message({ showClose: true,message:'组件申请/添加,失败!',type:'error',duration:2000,customClass:'design-from-el-message'});
                    //删除组件
                    this.deleteFormItemModelAndClickNextItem(_rowColObj.rowIndex,_rowColObj.colIndex);
                    
            }else if(obj.action == 'setFormula'){ //设置公式
                    
                    let _storeObj = {};
                    _storeObj.key = EcoUtil.getUID();
                    _storeObj.data = {};
                    _storeObj.data.formula = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]).formula;
                    _storeObj.data.formItems = this.getAllFormItems();
                    console.log('存储storekey');
                    console.log(_storeObj);

                    EcoUtil.getSysvm().setTempStore(_storeObj.key,_storeObj.data);
                    let url = '/wh/jsp/version3/flowform/index.html#/designFormulaSetting/'+ _storeObj.key;
                    EcoUtil.getSysvm().openDialog('公式设置',url,600,500,'8vh');

            }else if(obj.action == 'deleteNeedSaveUpdateItem'){
                    delete this.needSaveUpdateItemConfig[obj.uuid];
            }
        },

        /*创建表单组件*/
        createFormItemModelFunc(config){
             this.saveConfig.loading = true;
             this.saveConfig.msg = "正在添加组件'"+config.titleName+"'...";
             console.log('createFormItemModelFunc');
             createFormItemModelAjax(config).then((response)=>{
                    if(response.data.status <= 99){
                          this.saveConfig.msg = "组件 "+config.titleName+" 添加完成";
                    }else{
                          this.saveConfig.msg = "组件 "+config.titleName+" 更新失败！！！";
                    }
                }).catch((error)=>{
                      this.saveConfig.msg = "组件 "+config.titleName+" 更新失败！！！";
                     
                })
        },


         /*后台 上传修改表单组件*/
        updateFormItemModelFunc(config,uuid,gridUpdate){
                this.saveConfig.loading = true;
                this.saveConfig.msg = "正在更新组件'"+config.titleName+"'...";

                console.log('updateFormItemModelFunc');
                updateFormItemModelAjax(config).then((response)=>{
                        if(response.data.status <= 99){
                             this.saveConfig.msg = "组件 "+config.titleName+" 更新完成";
                             delete this.needSaveUpdateItemConfig[uuid]; //删除 未保存对象
                             
                       
                             if(config.titleName == ''){
                                 if(this.formItemConfigObj[uuid]){
                                    this.$set(this.formItemConfigObj[uuid],'titleName',FormUtil.getTitleNameByModelType(config.modelType));
                                 }
                             }

                             if(gridUpdate){
                                if(config.childItems && config.childItems.length > 0){
                                    for(let i = 0;i<config.childItems.length;i++){
                                        if(config.childItems[i].titleName == ''){
                                            try{
                                                this.$set(this.formItemConfigObj[uuid].childItems[i],'titleName',FormUtil.getTitleNameByModelType(this.formItemConfigObj[uuid].childItems[i].modelType));
                                            }catch(e){
                                                console.log(e);
                                            }
                                        }
                                    }
                                }
                             }


                        }else{
                             this.saveConfig.msg = "组件 "+config.titleName+" 更新失败！！！";
                             delete this.needSaveUpdateItemConfig[uuid];
                             this.needSaveUpdateItemConfig[uuid] = config;
                        }
                        this.saveConfig.loading = false;
                }).catch((err)=>{
                            this.saveConfig.msg = "组件 "+config.titleName+" 更新失败！！！";
                            delete this.needSaveUpdateItemConfig[uuid];
                            this.needSaveUpdateItemConfig[uuid] = config;
                            this.saveConfig.loading = false;
                })
        },

        /*删除表单组件*/
        deleteFormItemModelFunc(item,rowIndex,colIndex){
                /*先删除页面数据 */ 
                this.deleteFormItemModelAndClickNextItem(rowIndex,colIndex);
                delete this.formModelMap[item.fieldId];
                delete this.formPCViewMap[item.uuid];
        },

        /*页面上删除，并点击下一个组件 */
        deleteFormItemModelAndClickNextItem(rowIndex,colIndex){
                let _nextRowIndex = rowIndex;
                let _nextColIndex = colIndex;
                let _clickForm = false;

                if(this.rowArray[rowIndex].items.length == 1){
                    this.rowArray.splice(rowIndex,1);
                    if(this.rowArray.length == 0){
                        _clickForm = true; //都删除完了 点击表单信息
                    } else if(rowIndex == this.rowArray.length){ //最后一行
                        _nextRowIndex = this.rowArray.length-1;
                    }

                }else{
                    this.rowArray[rowIndex].items.splice(colIndex,1);
                    if(colIndex > 0){
                        _nextColIndex = _nextColIndex-1;
                    }
                }
                
                if(_clickForm){
                    this.goFormSettingRouter();
                }else{
                    let _item = this.rowArray[_nextRowIndex].items[_nextColIndex];
                    let _event = {};
                    _event.target = {};
                    _event.target.className = '';
                    this.clickModel(_event,_item);
                }
        },

        /*根据uuid 获取组件的行列信息 */
        getRowAndColByUUID(uuid){
            let _obj = {};
            for(let rowIdx = 0;rowIdx<this.rowArray.length;rowIdx++){
                if(this.rowArray[rowIdx].items){
                    for(let colIdx = 0;colIdx < this.rowArray[rowIdx].items.length;colIdx++ ){
                        if(this.rowArray[rowIdx].items[colIdx].uuid == uuid){
                            _obj.rowIndex = rowIdx;
                            _obj.colIndex = colIdx;
                            _obj.hasItem = true;
                            break;
                        }
                    }
                }
            }
            return _obj;
        },

        getAllFormItems(){
            let _formItems = [];
            if(this.rowArray && this.rowArray.length>0){
                this.rowArray.forEach((rowItem,rowIdx)=>{
                    if(rowItem.items && rowItem.items.length > 0){
                         (rowItem.items).forEach((colItem,colIndex)=>{
                                let _item = {};
                                if(this.formItemConfigObj[colItem.uuid]){
                                      _item.fieldId = this.formItemConfigObj[colItem.uuid].fieldId;
                                      _item.uuid = colItem.uuid;
                                      _item.titleName = this.formItemConfigObj[colItem.uuid].titleName;
                                }else{
                                     _item.fieldId = colItem.fieldId;
                                     _item.uuid = colItem.uuid;
                                     _item.titleName = colItem.titleName;
                                }
                                _formItems.push(_item);
                         })
                    }
                })
            }
            return _formItems;
        },

        /*保存所有的表单数据*/
        saveFormAll(flag){
            let _data = {};

            let _model = {};
            _model.tableDef = this.viewObj.model.tableDef; //表单的id
            _model.version = this.viewObj.model.version;  //版本
            _model.shortName = this.viewObj.model.shortName; //简称
            _model.fullName = this.viewObj.model.fullName; //全称

            let _fields = [];
            let _fieldTables = [];
            let _view = {};
            let _pcCrtls = [];

            if(this.rowArray && this.rowArray.length>0){
                this.rowArray.forEach((rowItem,rowIdx)=>{
                    if(rowItem.items && rowItem.items.length > 0){
                         (rowItem.items).forEach((colItem,colIndex)=>{
                                /*视图*/ 
                                let _oneViewItem = this.formPCViewMap[colItem.uuid]; //要保存的组件信息
                    
                                let _oneViewFiled = {};
                                _oneViewFiled.plat = 'pc';
                                _oneViewFiled.nodeType = _oneViewItem.nodeType;
                                _oneViewFiled.display = _oneViewItem.display;
                                _oneViewFiled.attrs = _oneViewItem.attrs;
                                _oneViewFiled.style = _oneViewItem.style;
                                if(colIndex == 0){ //换行
                                    _oneViewFiled.attrs.changeLine = 1;
                                }

                                if(_oneViewFiled.nodeType == 'basic'){ //普通组件
                                        _oneViewFiled.fieldId = _oneViewItem.fieldId;
                                        _oneViewFiled.type = _oneViewItem.type;
                                }else if( _oneViewFiled.nodeType == 'table'){ //grid 组件
                                        _oneViewFiled.fieldTableId = _oneViewItem.fieldTableId;

                                        let _tableCrtls = [];
                                        if(_oneViewItem.crtls && _oneViewItem.crtls.length > 0){
                                            (_oneViewItem.crtls).forEach((colItem)=>{ //grid 里面的列
                                                    let _colOneViewItem = {};
                                                    _colOneViewItem.plat = 'pc';
                                                    _colOneViewItem.nodeType = colItem.nodeType;
                                                    _colOneViewItem.display = colItem.display;
                                                    _colOneViewItem.attrs = colItem.attrs;
                                                    _colOneViewItem.style = colItem.style;
                                                    _colOneViewItem.fieldId = colItem.fieldId;
                                                    _colOneViewItem.type = colItem.type;
                                                    _tableCrtls.push(_colOneViewItem);
                                            })
                                        }

                                        _oneViewFiled.crtls = _tableCrtls;
                                }
                                _pcCrtls.push(_oneViewFiled);


                                /*物理*/
                                let _oneModelItem = null;
                                let _oneModelFiled = {};
                            
                                if(_oneViewFiled.nodeType == 'basic'){ //普通组件
                                    _oneModelItem = this.formModelMap[_oneViewItem.fieldId];
                                    if(_oneModelItem){
                                            _oneModelFiled.id = _oneModelItem.id;
                                            _oneModelFiled.crtlType = _oneModelItem.crtlType;
                                            _oneModelFiled.createIdx = _oneModelItem.createIdx; //是否创建索引
                                            _oneModelFiled.field =   _oneModelItem.field;
                                            _oneModelFiled.display = _oneModelItem.display;
                                            _oneModelFiled.fieldType =  _oneModelItem.fieldType;
                                            _fields.push(_oneModelFiled);
                                    }
                                }else if( _oneViewFiled.nodeType == 'table'){ //grid组件

                                    _oneModelItem = this.formModelMap[_oneViewItem.fieldTableId];
                                    if(_oneModelItem){
                                        _oneModelFiled.tableDef = _oneModelItem.tableDef;
                                        _oneModelFiled.linkId = _oneModelItem.linkId;
                                        _oneModelFiled.display = _oneModelItem.display;

                                        
                                        let _tableFields = [];
                                        if(_oneViewItem.crtls && _oneViewItem.crtls.length > 0){
                                                (_oneViewItem.crtls).forEach((colItem)=>{
                                                        for(let k = 0;k<_oneModelItem.fields.length;k++ ){
                                                            if(_oneModelItem.fields[k].id == colItem.fieldId ){
                                                                let _colOneModeField = {};
                                                                _colOneModeField.id = _oneModelItem.fields[k].id;
                                                                _colOneModeField.crtlType = _oneModelItem.fields[k].crtlType;
                                                                _colOneModeField.createIdx = _oneModelItem.fields[k].createIdx; //是否创建索引
                                                                _colOneModeField.field =  _oneModelItem.fields[k].field;
                                                                _colOneModeField.display =  _oneModelItem.fields[k].display;
                                                                _colOneModeField.fieldType = _oneModelItem.fields[k].fieldType;
                                                                _tableFields.push(_colOneModeField);
                                                                break;
                                                            }
                                                        }
                                                })
                                        }

                                        _oneModelFiled.fields = _tableFields;
                                        _fieldTables.push(_oneModelFiled);
                                    }
                                }
                         
                         })
                    }
                })
            }

            _model.fields = _fields;
            _model.detailTables = _fieldTables;

            _view.pcCrtls = _pcCrtls;
            _view.id = this.viewObj.view.id;

            _data.model = _model;
            _data.view = _view;

      
            this.loadingInstance = Loading.service({ fullscreen: true,text:'正在保存表单数据,请稍等 ...'});
            updateDesignViewModel(_data).then((response)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                    this.$message({
                            showClose: true,
                            message:'保存成功！',
                            type: 'success',
                            duration:2000,
                            customClass:'design-from-el-message'
                    });
            }).catch((err)=>{
                    
            })
        
            return ;
        },

        saveShowMsg(){
            if(this.clickStepName && this.clickStepName!=null){
                this.$refs.flowFormStep.goNextStep(this.clickStepName);
            }

        },

        closeDialog(){
            let _closeObj = {};
            _closeObj.clearIframe = true;
            _closeObj.tabClick = true;
            EcoUtil.getSysvm().closeFullScreen(_closeObj);
        },

        clickStep(data){
            this.clickStepName = data.nextStep;
            this.saveFormAll();
        }

     
  },
  watch:{
        'wfFormDesignConfigChange'(newvalue,oldvalue){ //监听设置 里面发生的变化
            this.watchConfigAction(newvalue);
        }, 

        'wfFormDesignConfigChange2'(newvalue,oldvalue){ //监听设置 里面发生的变化
            this.watchConfigAction(newvalue);
        }, 

       
  }
}

</script>
<style scoped>


.formContentVue{
    background-color: #fafafa;
}

.formContentVue .ecoStep{
    max-width:600px;
    text-align: center;
    margin-top:5px;
}

.formContentVue .flowFormRow{
    background-color:#fafafa;
    cursor:move;
    z-index: 99;
}


.formContentVue .flowFormCol{
    background-color: #fff;
    position: relative;
    z-index: 99;
}

.formContentVue .designTopModule{
    position: absolute;
    left:0;
    right:0;
    top:0;
    height:55px;
    vertical-align: middle;
    background-color: #fff;
}

.formContentVue .designTopModule .leftCol{
    line-height: 55px;
    padding-left:20px;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #262626;
}

.formContentVue .designTopModule .rightCol{
    text-align:right;
    line-height:55px;
    padding-right:20px;
}

.formContentVue .designLeftModule{
    position: absolute;
    left:0px;
    width:280px;
    top:65px;
    bottom:0px;
    background-color: #fff;
}

.formContentVue .designLeftModule .designLeftModuleContent{
    margin:20px;
}

.formContentVue .designContent{
    position: absolute;
    left:290px;
    top:65px;
    bottom:0px;
    right:270px;
    background-color: #fafafa;
    overflow:auto;
}


.formContentVue .moduleDesc{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #262626;
    font-weight: bold;
    text-align: left;
}

.flowFormVue .flowForm{
    background: #fff;
    margin:auto;
    margin-top:10px;
    padding: 10px 20px 50px 20px;
    position: relative;
}


.flowFormVue .active{
    background-color: #e8faff;
    z-index:999;
}

.flowFormVue .moveUpIcon{
    position:absolute;
    top:-10px;
    left:50%;
    color:#1ba5fa;
    cursor:pointer;
}

.flowFormVue .moveUpIcon i{
    font-size: 20px;
}

.flowFormVue .moveDownIcon{
    position:absolute;
    bottom:-10px;
    left:50%;
    color:#1ba5fa;
    cursor:pointer;
}

.flowFormVue .moveDownIcon i{
    font-size: 20px;
}

.flowFormVue .moveLeftIcon{
    position:absolute;
    left:-10px;
    top:50%;
    color:#1ba5fa;
    cursor:pointer;
}

.flowFormVue .moveLeftIcon i{
    font-size: 20px;
}

.flowFormVue .moveRightIcon{
    position:absolute;
    right:-10px;
    top:50%;
    color:#1ba5fa;
    cursor:pointer;
}

.flowFormVue .moveRightIcon i{
    font-size: 20px;
    background-color: #fff;
}

.flowFormVue .CopyIcon{
    position:absolute;
    top:0px;
    right:40px;
    color:#1ba5fa
}

.flowFormVue .DeleteIcon{
    position:absolute;
    top:-10px;
    right:-10px;
    color:#F56C6C;
    
}

.flowFormVue .DeleteIcon i{
    font-size: 18px;
    background-color: #fff;
}



/* .flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
} */

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.dragArea {
  min-height: 40px;
}



.list-group-item i {
  cursor: pointer;

}

.list-group-item {
    border: 1px dashed #bebebe;
    width: 100px;
    height: 30px;
    line-height: 26px;
    background-color: #fafafa;
    font-size: 13px;
    color: #262626;
    display: inline-block;
    text-align: left;
    text-overflow: ellipsis;
    padding-left: 8px;
    margin:5px;
    cursor: move;
}


.flowFormVue .contentSaveLoading{
    position:fixed;
    left:0;
    bottom:0;
}

.flowFormVue .contentSaveLoading .content{
    padding:20px;
    font-size: 12px;
}

.flowFormVue .flowForm .flowFormSettingBorder{
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 30px solid #409EFF;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    transform: rotate(45deg);
    right:-20px;
    top:-5px;
}

.flowFormVue .flowForm .flowFormSetting{
    position: absolute;
    right:5px;
    top:3px;
}


.flowFormVue .flowForm  .flowFormSettingIcon{
    color:#fff;
    cursor:pointer;
    font-size: 14px;
}



</style>
