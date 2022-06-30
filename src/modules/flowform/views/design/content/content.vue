<template>
    <div class="formContentVue flowFormVue designTable">
        
        <div class="designTopModule">
            <flowFormStep :title="formModel.name" :step="0" @close="closeDialog" :checkSave="saveFormAll"  ref="flowFormStep" >
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

         <div class="toolbar">
             <div >
                  <span class="toolbarBtn" v-for="(toolItem,idx) in toolbarGroup" :key="idx" >
                                        <el-tooltip class="item" effect="dark" :content="toolItem.name" placement="top">
                                        <i class="icon iconfont " v-bind:class="[toolItem.icon]" @click="goToolbarAction(toolItem.click)"></i>
                                        </el-tooltip>
                    </span>
             </div>
                                   
        </div>

        <div class="designContent">
               

                <div class="flowForm" v-bind:style="{width:(formWidth+20)+'px'}">  

                            <div  v-bind:style="{width:(formWidth+20)+'px'}" v-bind:class="['designTabDiv'+views.length]">
                                <span class="flowFormSettingBorder"> </span>
                                <span class="flowFormSetting"  @click="goFormSettingRouter" title="点此编辑表单整体属性">
                                    <el-tooltip class="item" effect="dark" :content="'点此编辑表单整体属性'" placement="top" >
                                         <span>  <i class="icon iconfont iconshezhi flowFormSettingIcon"></i></span>
                                    </el-tooltip>
                                </span>
                              

                                <el-tabs v-model="viewTabActive" @tab-click="tabViewClick" @tab-remove="removeTabConfig" >
                                    <el-tab-pane 
                                        :label="formItemConfigObj[viewItem.id]?formItemConfigObj[viewItem.id].displayName:(viewItem.displayName?viewItem.displayName:'页签')" 
                                        :name="viewItem.id"
                                        v-for="(viewItem,viewIdx) in views" 
                                        :key="viewItem.id" closable  >

                                            <component 
                                                v-if="formItemConfigObj[viewItem.id]?(formItemConfigObj[viewItem.id].showTitle ):(viewItem. showTitle === 1)"
                                                :is="'designForm'" 
                                                :mItem="formModel"
                                                :mConfig="formItemConfigObj[formKey]"
                                                id="designComponentForm"
                                                ref="designComponentForm"
                                                @click.native="goFormSettingRouter"
                                                v-bind:class="{active:formKey == activeUuid}"
                                            ></component>

                                            <!-- <div class="borderDiv"></div> -->
                                            
                                            <draggable
                                                    v-model="viewsRowArrayMap[viewItem.id]"
                                                    @change="doDragChangeRow"
                                                    v-bind='dragRowOptions'
                                                    :ref="'dragRowRef'"
                                                    @start="drag=true"
                                                    @end="drag=false"
                                                    style="min-height:400px"
                                            >
                                                    <div
                                                        v-for="(rowsItem,rowIdx) in viewsRowArrayMap[viewItem.id]"
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
                                                                    v-bind:style="{width:getItemWidth(rowsItem,colIdx)}"
                                                                >
                                                                    <component 
                                                                        :is="colItem.designModelName" 
                                                                        :id="'designComponent'+colItem.uuid"
                                                                        :ref="'designComponent'+colItem.uuid"
                                                                        v-bind:class="{active:colItem.uuid == activeUuid}"
                                                                        :mItem="colItem"
                                                                        :mConfig="formItemConfigObj[colItem.uuid]"
                                                                        :mForm="formModel"
                                                                        :mFormConfig="formItemConfigObj[formKey]"
                                                                        :formWidth="formWidth"
                                                                        @mouseup.native="clickModel($event,colItem)"
                                                                        :label="colItem.itemId"
                                                                    ></component>

                                                                    <span class="moveUpIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID'"><i class="icon iconfont iconxiangshangyuanjiantou" @mouseup="moveModelUp(rowIdx,colIdx,viewItem.id)"></i></span>
                                                                    <span class="moveDownIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID'"><i class="icon iconfont iconxiangxiayuanjiantou" @mouseup="moveModelDown(rowIdx,colIdx,viewItem.id)"></i></span>
                                                                    <span class="moveLeftIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID' && colIdx !=0"><i class="icon iconfont icon07jiantouxiangzuofill" @mouseup="moveModelLeft(rowIdx,colIdx,viewItem.id)"></i></span>
                                                                    <span class="moveRightIcon pointerClass" v-show="colItem.uuid == activeUuid && colItem.modelType != 'GRID' && colIdx != (rowsItem.items.length-1) " ><i class="icon iconfont icon07jiantouxiangyoufill" @mouseup="moveModelRight(rowIdx,colIdx,viewItem.id)"></i></span>
                                                                    <span class="DeleteIcon pointerClass" v-show="colItem.uuid == activeUuid "><i class="icon iconfont iconshanchu1" @mouseup="deleteModel(rowIdx,colIdx,viewItem.id)"></i></span>
                                                                </div>          
                                                        </div>
                                                    </div>
                                            </draggable>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                </div>
        </div>

        <div class="contentSaveLoading" v-show="saveConfig.loading">
            <div class="content">
                {{saveConfig.msg}}
            </div>
        </div>


        <el-dialog
                    title="页签排序"
                    :visible.sync="viewSortDialog"
                    width="30%"
                    custom-class="tabViewSortDialog"
                >
                    <draggable v-model="views" tag="div"   v-bind="viewsDragOptions" @change="sortTabViewFunc">
                                <el-row v-for="(viewItem,idx) in views" :key="idx" class="dataRow dragTr" style="width:100%">
                                    <el-col :span="21">
                                        <span class="title">{{formItemConfigObj[viewItem.id]?formItemConfigObj[viewItem.id].displayName:(viewItem.displayName?viewItem.displayName:'页签')}}&nbsp;</span>
                                    </el-col>

                                    <el-col :span="3" style="" class="moveCol">
                                        <i class="icon iconfont iconpaixu1" ></i>
                                    </el-col>
                                </el-row>
                    </draggable>
        </el-dialog>


        <el-dialog
                title="页签组件调整"
                :visible.sync="viewItemSortDialog"
                width="90%"
                custom-class="tabItemViewSortDialog"
                fullscreen
                @closed="saveFormLayout"
        >       
             <div class="flowForm" v-bind:style="{width:(formWidth)+'px'}" style="padding-top:0px;">  
                <div v-for="(viewItem,viewIdx) in views" :key="viewItem.id" class="viewItemDiv">
                            <div class="tabName"><span>{{formItemConfigObj[viewItem.id]?formItemConfigObj[viewItem.id].displayName:(viewItem.displayName?viewItem.displayName:'页签')}}</span></div>
                            <draggable
                                    v-model="viewsRowArrayMap[viewItem.id]"
                                    @change="doViewItemDragChangeRow($event,viewItem.id)"
                                    v-bind='dragTabViewRowOptions'
                                    @start="drag=true"
                                    @end="drag=false"
                                    style="min-height:50px"
                            >
                                            <div
                                                v-for="(rowsItem,rowIdx) in viewsRowArrayMap[viewItem.id]"
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
                                                                v-bind:style="{width:getItemWidth(rowsItem,colIdx)}"
                                                            >
                                                                    <component 
                                                                        :is="colItem.designModelName" 
                                                                        :id="'designComponent'+colItem.uuid"
                                                                        :ref="'designComponent'+colItem.uuid"
                                                                        v-bind:class="{active:colItem.uuid == activeUuid}"
                                                                        :mItem="colItem"
                                                                        :mConfig="formItemConfigObj[colItem.uuid]"
                                                                        :mForm="formModel"
                                                                        :mFormConfig="formItemConfigObj[formKey]"
                                                                        :formWidth="formWidth"
                                                                        :label="colItem.itemId"
                                                                    ></component>
                                                                </div>          
                                                        </div>
                                                    </div>
                             </draggable>
                    </div>
                </div>
        </el-dialog>


        <el-dialog
                    title="镜像拷贝"
                    :visible.sync="mirrorItemDialog"
                    width="450px"
                    custom-class="mirrorItemDialog"
                >
                    
                <el-checkbox-group v-model="mirrorCheckList" class="mirrorCheckbox">
                        <el-checkbox :disabled="mirrorInViewsMap[String(viewItem.id)]==1"  :label="viewItem.id" v-for="(viewItem,viewIdx) in views" :key="viewItem.id">{{viewItem.displayName}}</el-checkbox>
                </el-checkbox-group>

                <span slot="footer" class="dialog-footer" >
                        <el-button @click="mirrorItemDialog = false" mini>取 消</el-button>
                        <el-button type="primary"  mini  @click="mirrorItemSubmit">确 定</el-button>
                </span>
        </el-dialog>




    </div>
</template>
<script>



import {getformModelUpdateApplyAjax,getformModelReaderAjax,updateFormItemModelAjax,deleteFormItemModelAjax,deleteFormItemModelInViewAjax,saveTabViewFormItemModelOrderAjax,updateFormModelAjax,createTabViewAjax,updateTabViewModelAjax,deleteTabViewModelAjax,sortTabViewModelAjax,moveItemTabViewModelAjax,mirrorItemAjax} from'../../../service/service'
import {defaultFormWidth} from '../../../config/setting.js'
import axios from 'axios'
import draggable from "../../../assets/js/vuedraggable";
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import {Loading} from 'element-ui';
import {FlowFormUtil} from '../../../config/util'

import designForm from "../module/designForm.vue";
import designRadio from "../module/designRadio.vue";
import designSelect from "../module/designSelect.vue";
import designCheckbox from "../module/designCheckbox.vue";

import designDate from "../module/designDate.vue";
import designInput from "../module/designInput.vue";
import designNumber from "../module/designNumber.vue";
import designTextarea from "../module/designTextarea.vue";
import designUserSelect from "../module/designUserSelect.vue";
import designOrgSelect from "../module/designOrgSelect.vue";
import designSegmentHeader from "../module/designSegmentHeader.vue";
import designApproval from "../module/designApproval.vue";
import designAttachement from "../module/designAttachement.vue";
import designGrid from "../module/grid/designGrid.vue";
import designImg from "../module/designImg.vue";
import designSeqField from "../module/designSeqField.vue";
import designSeal from "../module/designSeal.vue";
import designApi from "../module/designApi.vue";
import designRelWF from "../module/designRelWF.vue";
import designCascader from "../module/designCascader.vue";
import designBtn from "../module/designBtn.vue";
import flowFormStep from "../../../views/components/flowFormStep.vue";


export default{
  name:'layoutContent',
  components:{
       draggable,
       designForm,
       designRadio,
       designSelect,
       designCheckbox,
       designInput,
       designNumber,
       designTextarea,
       designDate,
       designUserSelect,
       designOrgSelect,
       designSegmentHeader,
       designApproval,
       designAttachement,
       designImg,
       designSeqField,
       designSeal,
       designGrid,
       designApi,
       designRelWF,
       designCascader,
       designBtn,
       flowFormStep,
     
  },

  data(){
      return {
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

            views:[],
            viewsItemMap:{},
            viewsRowArrayMap:{},
            viewTabActive:null,
            viewRemoveId:null,
            viewSortDialog:false,
            viewItemSortDialog:false,
            viewItemMoveObj:{
                fromViewId:null,
                toViewId:null,
                itemIds:null,
            },

            mirrorItemDialog:false,
            mirrorCheckList:[],
            mirrorInViewsMap:{},
            mirrorItem:null,

            moduleGroup:[],
            toolbarGroup:[],
            rowArray:[],
            activeUuid:'',

            drag: false,
            viewDrag:{},
            formItemConfigObj:{},
            saveConfig:{
                loading:false,
                msg:'',
            },
            dragItemOptions:{
                    group:{
                        name:'module',
                        pull:'clone',
                        put:false
                    },
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

            dragTabViewRowOptions:{
                animation: 150,
                group: "tabView",
                draggable:'.flowFormRow',
                handle:'.flowFormRow',
                scroll:true,
                forceFallback:true,
            },

            viewsDragOptions:{
                animation: 150,
                group: "tabViews",
                draggable:'.dragTr',
                handle:'.dragTr',
                scroll:true,
                forceFallback:true, 
            },

            loadingInstance:null, //loading 信息
            needSaveCreateItemConfig:{}, //需要保存的 添加组件
            needSaveUpdateItemConfig:{}, //需要保存的 修改组件
            needSaveDeleteItemConfig:{}, //需要保存的 删除组件
            needSaveUpdateTabViewConfig:{},
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
        this.formId = this.$route.params.formId;
        this.initModelGroup();    /*初始化组件信息*/
        this.initToolbarGroup();
        this.INIT_WF_FORM_DESIGN_CONFIG();  /*初始化store 中的数据*/
        this.getFormModelUpdateApplyFunc();  /*申请编辑表单*/
    },
    methods: {   
        ...mapMutations([
            'INIT_WF_FORM_DESIGN_CONFIG',
            'DELETE_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_VIEW_TAB_ACTIVE_KEY'
        ]),
    
        /*初始化组件信息*/
        initModelGroup(){
            this.moduleGroup = FlowFormUtil.getModelGruop();
        },

        /*初始化toolbar*/
        initToolbarGroup(){
            this.toolbarGroup = FlowFormUtil.getToolbarGroup();
        },

        goToolbarAction(click){
            if(click == 'addTabView'){
                this.addTabView();
            }else if(click == 'sortTabView'){
                this.sortTabView();
            }else if(click == 'sortItemTabView'){
                this.sortItemTabView();
            }else if(click == 'goFormSettingRouter'){
                this.goFormSettingRouter();
            }else if(click == 'mirrorItemFunc'){
                this.mirrorItemFunc();
            }
        },

        /*申请编辑表单*/
        getFormModelUpdateApplyFunc(){
                this.loadingInstance = Loading.service({ fullscreen: true,text:'初始化表单信息,请稍等...'});
                getformModelUpdateApplyAjax(this.formId).then((response)=>{
                        if(response.data.status <=99){
                            this.formOperateId = response.data.operate_id;
                            this.formModel = response.data.remap.form_model;
                            if(!this.formModel.titleBgColor){
                                this.formModel.titleBgColor = '#fafafa';
                            }
                            if(!this.formModel.titleTextColor){
                                this.formModel.titleBgColor = '#262626';
                            }
                            this.formModel.interactionSize = response.data.remap.interaction_size;
                            /*保存表单信息*/
                            let obj = {};
                            obj.key = this.formKey;
                            obj.value = response.data.remap.form_model;
                            this.SET_WF_FORM_DESIGN_CONFIG(obj);
                            
                            this.getWFFormInit();   /*初始化流程基本信息*/
                        }else{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                 this.loadingInstance.close();
                            });
                        }
                })
        },

        /*初始化流程基本信息*/
        getWFFormInit(){
            let that = this;
            axios.all([getformModelReaderAjax(this.formOperateId)])
                .then(axios.spread(function (res1) {
                    /* style 渲染*/
                    if( res1.data && res1.data.queryObj){
                        that.formSys = res1.data.queryObj.sys;
                        that.formThemeStyleAO = res1.data.queryObj.themeStyleAO;
                        try{
                            (res1.data.queryObj.grids).forEach((item)=>{
                                that.formGrids[item.id] = item.list;
                            })
                        }catch(e){
                            console.log(e);
                        }
                     
                        that.formItems = res1.data.queryObj.items;
                        that.formKVMap = res1.data.queryObj.kvMap;

                        that.views = res1.data.queryObj.views;
                        (that.views).forEach((viewItem)=>{
                            viewItem.uuid = EcoUtil.getUID();
                            viewItem.action = 'update';
                            that.$set(that.viewsRowArrayMap,viewItem.id,[]);
                        })

                        that.viewsItemMap = res1.data.queryObj.vitemMap;
                        if(that.views && that.views.length > 0){ //设置默认的tab页签
                            that.viewTabActive = that.views[0].id;
                            that.SET_VIEW_TAB_ACTIVE_KEY(that.viewTabActive);
                        }
                    }else{
                        that.$message({showClose:true,message:res1.data.msgDesc,type:'error',duration:2000,customClass:'design-from-el-message'});
                    }
                 
                    that.drawLayout();    /*初始化布局方法*/
                    that.goFormSettingRouter();   /*默认跳转到表单编辑页面*/
                    that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        that.loadingInstance.close();
                    });
            }));
        },

        //获取对应的组件名称
        getDesignModelName(modelType){
               return FlowFormUtil.getDesignModelName(modelType);
        },

        getItemWidth(rowsItem,idx){
            let _tempItem = rowsItem.items[idx];
            if(this.formItemConfigObj[_tempItem.uuid]){
                _tempItem = this.formItemConfigObj[_tempItem.uuid];
            }
            if(_tempItem.compFixed){
                return Math.floor(_tempItem.compWidth)+'%'
            }else{
                let _fixWidth = 0;
                let _fixNum = 0;
                for(let i = 0;i<rowsItem.items.length;i++){
                    let _temp = ( (this.formItemConfigObj[rowsItem.items[i].uuid])?(this.formItemConfigObj[rowsItem.items[i].uuid]):rowsItem.items[i] );
                    if(_temp.compFixed){
                        _fixWidth+=_temp.compWidth;
                        _fixNum++;
                    }
                }
                return Math.floor( (100-_fixWidth)/ (rowsItem.items.length-_fixNum) )+'%'
            }
        },

        /*获取 组件的 value*/
        getComponentValue(colItem){
            let itemId = colItem.itemId;
            let _item =  this.dataItemOAObj[itemId];
            return _item ;
        },

        /*初始化布局方法*/
        drawLayout(){
             let _uuidMap = {};
             for(let key in this.viewsItemMap){
                if(this.viewsItemMap[key] && this.viewsItemMap[key].length > 0){
                    let viewsRowArray = [];
                    let colArray = [];
                    let _that = this;
                    (this.viewsItemMap[key]).forEach((item)=>{
                            let _item = EcoUtil.objDeepCopy(item);
                            _item.designModelName = _that.getDesignModelName(_item.modelType);
                            if(_uuidMap[String(_item.itemId)]){
                                _item.uuid = _uuidMap[String(_item.itemId)];
                            }else{
                                _item.uuid = EcoUtil.getUID();
                                _uuidMap[String(_item.itemId)] = _item.uuid;
                            }
                            _item.action = 'update';
                            try{
                                _item.KVMap =  _that.formKVMap[_item.kvName];
                            }catch(e){}
                            
                            try{
                                 _item.formGrid = [];
                                try{
                                    if(_that.formGrids[String(_item.itemId)]){
                                        _item.formGrid =  _that.formGrids[String(_item.itemId)];   
                                    }
                                }catch(e){
                                    console.log(e);
                                }
                        
                                if(_item.formGrid && _item.formGrid.length>0){
                                    (_item.formGrid).forEach((gridColItem)=>{
                                        gridColItem.KVMap =  _that.formKVMap[gridColItem.kvName];
                                    })
                                }
                            }catch(e){
                                console.log(e);
                            }

                            if(_item.changeLine == 1){
                                if(colArray.length!=0){
                                    let rowObj = {};
                                    rowObj.items = colArray;
                                    viewsRowArray.push(rowObj);
                                    colArray = [];
                                }
                                    colArray.push(_item);
                            }else{
                                    colArray.push(_item);
                            }
                    })

                    if(colArray.length!=0){
                        let rowObj = {};
                        rowObj.items = colArray;
                        rowObj.colSpan = Math.floor(24/rowObj.items.length);
                        viewsRowArray.push(rowObj);
                    }

                    let _viewsRowArray = EcoUtil.objDeepCopy(viewsRowArray);
                    this.$set(this.viewsRowArrayMap,key,_viewsRowArray);
                }                
            }
            this.saveFormLayout();
            
        },
        
          
        /*编辑表单基本信息*/ 
        goFormSettingRouter(){  
            this.activeUuid = this.formKey;
            this.$router.push({name:'designFormSetting',params:{formOperateId:this.formOperateId}})
        },

        /*编辑tabView信息*/ 
        goTabViewRouter(){  
            this.activeUuid = this.viewTabActive;
            this.$router.push({name:'designTabViewSetting',params:{formOperateId:this.formOperateId,viewId:this.viewTabActive}})
        },

     

        /*克隆左边组件 返回的对象*/
        doModelClone(item) { 
            let _uuid = EcoUtil.getUID();
            return {
                    items:[
                        {
                            itemName:item.itemName,
                            titleName:item.itemName,
                            titleAlign:'l',
                            designModelName:item.moduleName,
                            itemId:0,
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
                    itemId:0,
                    uuid:_uuid,
                    action:'create'
            }

            let _rowItems = {items:[_item]};
            if(_obj.hasItem){
                    this.viewsRowArrayMap[this.viewTabActive].splice(_obj.rowIndex+1,0,_rowItems);
            }else{
                 if(this.activeUuid == 'FORM'){
                    this.viewsRowArrayMap[this.viewTabActive].splice(0,0,_rowItems);
                }else{
                    this.viewsRowArrayMap[this.viewTabActive].splice(this.viewsRowArrayMap[this.viewTabActive].length,0,_rowItems);
                }
            }

            this.activeUuid = _item.uuid;
            this.$router.push({
                    name:_item.designModelName+'Setting',
                    params:{
                        formOperateId:this.formOperateId,
                        uuid:_item.uuid,
                        itemId:_item.itemId,
                        action:_item.action
                    }
            });
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
                            itemId:_item.itemId,
                            action:_item.action
                        }
                });
            }
        },
      
        doViewItemDragChangeRow(evt,viewId){
            
            if(evt && evt.added){
                this.viewItemMoveObj.toViewId = viewId;
                let _ids = [];
                (evt.added.element.items).forEach((item)=>{
                    _ids.push(item.itemId);
                })
                let _idsStr = _ids.join(",");
                this.doViewItemDragChangeRowFunc(_idsStr);
            }else if(evt && evt.removed){
                this.viewItemMoveObj.fromViewId = viewId;
                let _ids = [];
                (evt.removed.element.items).forEach((item)=>{
                    _ids.push(item.itemId);
                })
                let _idsStr = _ids.join(",");
                this.doViewItemDragChangeRowFunc(_idsStr);
            }
        },

        doViewItemDragChangeRowFunc(ids){
                if(this.viewItemMoveObj.itemIds){
                    if(this.viewItemMoveObj.itemIds == ids){
                        moveItemTabViewModelAjax(this.formOperateId,this.viewItemMoveObj).then((response)=>{
                                this.viewItemMoveObj.itemIds = null;
                                this.viewItemMoveObj.fromViewId = null;
                                this.viewItemMoveObj.toViewId = null;
                        }).catch((e)=>{
                                this.viewItemMoveObj.itemIds = null;
                                this.viewItemMoveObj.fromViewId = null;
                                this.viewItemMoveObj.toViewId = null;
                        })
                    }   
                }else{
                    this.viewItemMoveObj.itemIds = ids;
                }
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
                            this.$router.push({
                                name:item.designModelName+'Setting',
                                params:{
                                    formOperateId:this.formOperateId,
                                    uuid:item.uuid,
                                    itemId:item.itemId,
                                    action:item.action
                            }});
                    }
                }
            }
       },

        /*组件向上移动*/
        moveModelUp(rowIndex,colIndex,viewKey){
            let _item = EcoUtil.objDeepCopy(this.viewsRowArrayMap[viewKey][rowIndex].items[colIndex]);
            if(this.viewsRowArrayMap[viewKey][rowIndex].items.length == 1){
                if(rowIndex > 0){
                    this.viewsRowArrayMap[viewKey].splice(rowIndex,1);
                    this.viewsRowArrayMap[viewKey][rowIndex-1].items.push(_item);
                }
            }else{
                if(rowIndex > 0){
                    this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex,1);
                    this.viewsRowArrayMap[viewKey][rowIndex-1].items.push(_item);
                }else{
                    this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex,1);
                    let _rowItem = {};
                    _rowItem.items = [];
                    _rowItem.items.push(_item);
                    this.viewsRowArrayMap[viewKey].splice(0,0,_rowItem);
                }
            }
        },
        
        /*向下移动组件*/
        moveModelDown(rowIndex,colIndex,viewKey){
                let _item = EcoUtil.objDeepCopy(this.viewsRowArrayMap[viewKey][rowIndex].items[colIndex]);
                if(this.viewsRowArrayMap[viewKey][rowIndex].items.length == 1){
                    if(rowIndex < (this.viewsRowArrayMap[viewKey].length-1)){
                        this.viewsRowArrayMap[viewKey][rowIndex+1].items.push(_item);
                        this.viewsRowArrayMap[viewKey].splice(rowIndex,1);
                    }
                }else{
                    if(rowIndex < (this.viewsRowArrayMap[viewKey].length-1)){
                        this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex,1);
                        this.viewsRowArrayMap[viewKey][rowIndex+1].items.push(_item);
                    }else{
                         this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex,1);
                         let _rowItem = {};
                         _rowItem.items = [];
                         _rowItem.items.push(_item);
                         this.viewsRowArrayMap[viewKey].splice(rowIndex+1,0,_rowItem);
                    }
                }
        },
        
        /*向左移动组件*/
        moveModelLeft(rowIndex,colIndex,viewKey){
                let _item = EcoUtil.objDeepCopy(this.viewsRowArrayMap[viewKey][rowIndex].items[colIndex]);
                if(this.viewsRowArrayMap[viewKey][rowIndex].items.length > 1){
                    if(colIndex > 0){
                         this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex,1);
                         this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex-1,0,_item);
                    }
                }
        },

        /*向右移动组件*/
        moveModelRight(rowIndex,colIndex,viewKey){
                let _item = EcoUtil.objDeepCopy(this.viewsRowArrayMap[viewKey][rowIndex].items[colIndex]);
                if(this.viewsRowArrayMap[viewKey][rowIndex].items.length > 1){
                    if(colIndex < (this.viewsRowArrayMap[viewKey][rowIndex].items.length-1)){
                         this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex,1);
                         this.viewsRowArrayMap[viewKey][rowIndex].items.splice(colIndex+1,0,_item);
                    }
                }
        },


        /*删除组件*/
        deleteModel(rowIndex,colIndex,viewKey){
            let _item = this.viewsRowArrayMap[viewKey][rowIndex].items[colIndex];
            if(_item.action == 'update'){ //数据库中组件已经存在 添加的组件，都会先添加到数据库，变为update的组件
                  this.deleteFormItemModelFunc(_item,rowIndex,colIndex,viewKey);
           }else if(_item.action == 'create'){ //create 创建成功后 直接面为 update了
                  this.deleteFormItemModelAndClickNextItem(rowIndex,colIndex);
            }
        },

        /*添加页签*/
        addTabView(){
            let _data = {};
            _data.operate_id = this.formOperateId;
            if(this.views && this.views.length>0){
                _data.order = this.views[this.views.length-1].orderId+1;
            }
            _data.name = '新页签';
            createTabViewAjax(_data).then((response)=>{
                if(response.data.status <= 99){
                    this.views.push(response.data.remap.view);
                    this.viewTabActive = response.data.remap.view.id;
                    this.SET_VIEW_TAB_ACTIVE_KEY(this.viewTabActive);
                    this.$set(this.viewsRowArrayMap,response.data.remap.view.id,[]);
                    this.goTabViewRouter();
                }else{
                    this.$message({ showClose: true,message:'添加失败!',type:'error',duration:2000,customClass:'design-from-el-message'});
                }
            })
        },

        sortItemTabView(){
            this.viewItemSortDialog = true;
        },

        sortTabView(){
            this.viewSortDialog = true;
        },

        sortTabViewFunc(val){
            let _sortArray = [];
            (this.views).forEach((item,idx)=>{
                _sortArray.push(item.id+"-"+idx);
            })
          
            sortTabViewModelAjax(_sortArray).then((response)=>{
                 if(response.data.status <= 99){
                 
                 }else{
                     this.$message({ showClose: true,message:'排序失败!',type:'error',duration:2000,customClass:'design-from-el-message'});
                 }
            })
        },

        tabViewClick(item){
            this.activeUuid = null;
            this.SET_VIEW_TAB_ACTIVE_KEY(this.viewTabActive);
            this.goTabViewRouter();
        },

        

        removeTabConfig(viewId){
            let _removeItem = null;
            for(let i = 0;i<this.views.length;i++){
                if(this.views[i].id == viewId){
                    _removeItem = this.views[i];
                    break;
                }
            }

            if(_removeItem && _removeItem.name == '@DEFAULT_VIEW'){
                this.$message({ showClose: true,message:'默认页签不能删除',type:'error',duration:2000,customClass:'design-from-el-message'});
                return ;
            }

         
            this.viewRemoveId = viewId;
            let that  = this;
            let confirmYesFunc = function(){
                that.removeTab();
            }
            let options = {
                type: 'warning',
                lockScroll:false
            }
            EcoMessageBox.confirm('确认删除改页签?','提示',options,confirmYesFunc);
        },

        removeTab(){
                let _data = {};
                _data.operate_id = this.formOperateId;
                _data.viewId = this.viewRemoveId;
                deleteTabViewModelAjax(_data).then((response)=>{
                    if(response.data.status <= 99){
                        let _activeName = this.viewTabActive;
                        if (this.viewTabActive === this.viewRemoveId) {
                            this.views.forEach((tab, index) => {
                                if (tab.id === this.viewRemoveId) {
                                    let nextTab = this.views[index + 1] || this.views[index - 1];
                                    if (nextTab) {
                                       _activeName = nextTab.id;
                                    }
                                }
                            });
                        }
                        this.viewTabActive = _activeName;
                        this.views = this.views.filter(tab => tab.id !== this.viewRemoveId);
                        this.goTabViewRouter();
                    }else{
                        this.$message({ showClose: true,message:'删除失败！',type:'error',duration:2000,customClass:'design-from-el-message'});
                    }
                })
        },

        watchConfigAction(obj){
            if(obj.action == 'changeConfig'){ //如果是配置变化，通知组件重新渲染
                    this.$set(this.formItemConfigObj,obj.uuid,EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]));
                    if(obj.uuid == this.formKey){//如果是 表单信息
                          this.needSaveFormConfig[obj.uuid] = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);
                    }else{ //如果是组件信息
                          delete this.needSaveUpdateItemConfig[obj.uuid];
                          this.needSaveUpdateItemConfig[obj.uuid] = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);
                          this.DELETE_WF_FORM_DESIGN_CONFIG(obj.uuid);//删除store 里面保留的信息   
                    }       
            }else if(obj.action == 'changeGirdColConfig'){// grid的列发生变化
                    delete this.needSaveUpdateItemConfig[obj.uuid];
                    this.needSaveUpdateItemConfig[obj.uuid] = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);

            }else if(obj.action == 'tabViewChangeConfig'){
                    this.$set(this.formItemConfigObj,obj.uuid,EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]));
                    delete this.needSaveUpdateTabViewConfig[obj.uuid];
                    this.needSaveUpdateTabViewConfig[obj.uuid] = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);
                  

            }else if(obj.action == 'createConfig'){ //拖拽添加组件，第一次添加数据库完成
                     
                     let _item = EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]);
                     this.$set(this.formItemConfigObj,obj.uuid,_item);
                     delete this.needSaveUpdateItemConfig[obj.uuid];
                     this.DELETE_WF_FORM_DESIGN_CONFIG(obj.uuid);//删除store 里面保留的信息
                     
                     let _rowColObj = this.getRowAndColByUUID(obj.uuid);
                     /*改变组件的 itemId 和 action */
                     this.viewsRowArrayMap[this.viewTabActive][_rowColObj.rowIndex].items[_rowColObj.colIndex].action = 'update'
                     this.viewsRowArrayMap[this.viewTabActive][_rowColObj.rowIndex].items[_rowColObj.colIndex].itemId = _item.itemId;

                     /*调用表单布局*/
                     this.saveFormLayout();

            }else if(obj.action == 'saveUpdateConfig'){ //保存数据库 更新表单组件
                    this.updateFormItemModelFunc(EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]),obj.uuid); //后台调用更新操作，减少最后提交的数量
                    this.DELETE_WF_FORM_DESIGN_CONFIG(obj.uuid);//删除store 里面保留的信息
            
            }else if(obj.action == 'saveGridUpdateConfig'){ //保存数据库 更新grid表单组件
                    this.updateFormItemModelFunc(EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]),obj.uuid,true); //后台调用更新操作，减少最后提交的数量
                    this.DELETE_WF_FORM_DESIGN_CONFIG(obj.uuid);//删除store 里面保留的信息
            
            }else if(obj.action == 'saveGridColUpdateConfig'){//保存数据库 更新grid的 列组件
                    this.updateFormItemModelFunc(EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]),obj.uuid); //后台调用更新操作，减少最后提交的数量

            }else if(obj.action == 'saveTabViewUpdateConfig'){ //保存数据库 更新tab页签组件
                    
                    this.updateTabViewModelFunc(EcoUtil.objDeepCopy(this.wfFormDesignConfig[obj.uuid]),obj.uuid); //后台调用更新操作，减少最后提交的数量
                    this.DELETE_WF_FORM_DESIGN_CONFIG(obj.uuid);//删除store 里面保留的信息
            
            } else if(obj.action == 'itemModelCreateApplyFaild'){ //申请表单失败
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

                    EcoUtil.getSysvm().setTempStore(_storeObj.key,_storeObj.data);
                    let url = '/flowform/index.html#/designFormulaSetting/'+ _storeObj.key;
                    EcoUtil.getSysvm().openDialog('公式设置',url,600,500,'8vh');

            }else if(obj.action == 'deleteNeedSaveUpdateItem'){
                    delete this.needSaveUpdateItemConfig[obj.uuid];
            }
        },

        /*后台 上传修改表单组件*/
        updateFormItemModelFunc(config,uuid){
                this.saveConfig.loading = true;
                this.saveConfig.msg = "正在更新组件'"+config.titleName+"'...";
            
                updateFormItemModelAjax(config).then((response)=>{
                        if(response.data.status <= 99){
                             this.saveConfig.msg = "组件 "+config.titleName+" 更新完成";
                             delete this.needSaveUpdateItemConfig[uuid]; //删除 未保存对象
                             if(config.titleName == ''){
                                 if(this.formItemConfigObj[uuid]){
                                    this.$set(this.formItemConfigObj[uuid],'titleName',FlowFormUtil.getTitleNameByModelType(config.modelType));
                                 }
                             }
                             if(gridUpdate){
                                if(config.childItems && config.childItems.length > 0){
                                    for(let i = 0;i<config.childItems.length;i++){
                                        if(config.childItems[i].titleName == ''){
                                            try{
                                                this.$set(this.formItemConfigObj[uuid].childItems[i],'titleName',FlowFormUtil.getTitleNameByModelType(this.formItemConfigObj[uuid].childItems[i].modelType));
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
        deleteFormItemModelFunc(item,rowIndex,colIndex,viewKey){
             let _delteItem = EcoUtil.objDeepCopy(item);
             _delteItem.viewId = viewKey;
          
             /*先删除页面数据 */ 
             this.deleteFormItemModelAndClickNextItem(rowIndex,colIndex);
             this.saveConfig.loading = true;
             this.saveConfig.msg = "正在删除组件'"+_delteItem.titleName+"'...";
             /*添加需删除对象*/
             this.needSaveDeleteItemConfig[_delteItem.uuid] = _delteItem;

             deleteFormItemModelInViewAjax(this.formOperateId,_delteItem.itemId,_delteItem.viewId).then((response)=>{
                    if(response.data.status <= 99){
                          
                          this.saveConfig.msg = "组件 "+_delteItem.titleName+" 删除完成";
                          delete this.needSaveUpdateItemConfig[_delteItem.uuid]; //删除 需保存对象
                          delete this.needSaveDeleteItemConfig[_delteItem.uuid]; //删除 需删除对象
                        
                          /* 调用重新布局方法 保存到数据库*/
                          this.saveFormLayout();
                    }else{
                       
                    }
                }).catch((error)=>{
                      
                })
        },


        /*后台 更新tab页签*/
        updateTabViewModelFunc(config,uuid,gridUpdate){
                this.saveConfig.loading = true;
                this.saveConfig.msg = "正在更新页签'"+config.name+"'...";
            
            
                updateTabViewModelAjax(config).then((response)=>{
                        if(response.data.status <= 99){
                             
                             this.saveConfig.msg = "页签 "+config.name+" 更新完成";
                             delete this.needSaveUpdateTabViewConfig[uuid]; //删除 未保存对象
                          
                        }else{
                             this.saveConfig.msg = "组件 "+config.name+" 更新失败！！！";
                             delete this.needSaveUpdateTabViewConfig[uuid];
                             this.needSaveUpdateTabViewConfig[uuid] = config;
                        }
                        this.saveConfig.loading = false;
                }).catch((err)=>{
                            
                            this.saveConfig.msg = "组件 "+config.name+" 更新失败！！！";

                            delete this.needSaveUpdateTabViewConfig[uuid];
                            this.needSaveUpdateTabViewConfig[uuid] = config;
                            this.saveConfig.loading = false;
                })
        },

        /*页面上删除，并点击下一个组件 */
        deleteFormItemModelAndClickNextItem(rowIndex,colIndex){
                let _nextRowIndex = rowIndex;
                let _nextColIndex = colIndex;
                let _clickForm = false;

                if(this.viewsRowArrayMap[this.viewTabActive][rowIndex].items.length == 1){
                    this.viewsRowArrayMap[this.viewTabActive].splice(rowIndex,1);
                    if(this.viewsRowArrayMap[this.viewTabActive].length == 0){
                         _clickForm = true; //都删除完了 点击表单信息
                    } else if(rowIndex == this.viewsRowArrayMap[this.viewTabActive].length){ //最后一行
                        _nextRowIndex = this.viewsRowArrayMap[this.viewTabActive].length-1;
                    }

                }else{
                    this.viewsRowArrayMap[this.viewTabActive][rowIndex].items.splice(colIndex,1);
                    if(colIndex > 0){
                        _nextColIndex = _nextColIndex-1;
                    }
                }
                
                if(_clickForm){
                    this.goFormSettingRouter();
                }else{
                    let _item = this.viewsRowArrayMap[this.viewTabActive][_nextRowIndex].items[_nextColIndex];
                    let _event = {};
                    _event.target = {};
                    _event.target.className = '';
                    this.clickModel(_event,_item);
                }
        },

        /*根据uuid 获取组件的行列信息 */
        getRowAndColByUUID(uuid){
            let _obj = {};
            for(let rowIdx = 0;rowIdx<this.viewsRowArrayMap[this.viewTabActive].length;rowIdx++){
                if(this.viewsRowArrayMap[this.viewTabActive][rowIdx].items){
                    for(let colIdx = 0;colIdx < this.viewsRowArrayMap[this.viewTabActive][rowIdx].items.length;colIdx++ ){
                        if(this.viewsRowArrayMap[this.viewTabActive][rowIdx].items[colIdx].uuid == uuid){
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
            for(let key in this.viewsRowArrayMap){
                    if(this.viewsRowArrayMap[key] && this.viewsRowArrayMap[key].length>0){
                        (this.viewsRowArrayMap[key]).forEach((rowItem,rowIdx)=>{
                            if(rowItem.items && rowItem.items.length > 0){
                                (rowItem.items).forEach((colItem,colIndex)=>{
                                        let _item = {};
                                        if(this.formItemConfigObj[colItem.uuid]){
                                            _item.itemId = this.formItemConfigObj[colItem.uuid].itemId;
                                            _item.uuid = colItem.uuid;
                                            _item.titleName = this.formItemConfigObj[colItem.uuid].titleName;
                                        }else{
                                            _item.itemId = colItem.itemId;
                                            _item.uuid = colItem.uuid;
                                            _item.titleName = colItem.titleName;
                                        }
                                        _formItems.push(_item);
                                })
                            }
                        })
                    }
            }
           
            return _formItems;
        },

        /*保存所有的表单数据*/
        saveFormAll(flag){
            if(flag){
                let _saveStatus = {
                    success:true,
                    saving:true,
                    needSaveCount: Object.keys(this.needSaveUpdateItemConfig).length+Object.keys(this.needSaveUpdateTabViewConfig).length+Object.keys(this.needSaveFormConfig).length + Object.keys(this.needSaveDeleteItemConfig).length, //加表单布局保存
                    hasSaveCount:0,
                };
                this.formSaveStatus = _saveStatus;
                this.loadingInstance = Loading.service({ fullscreen: true,text:'正在保存表单数据,请稍等 '+this.formSaveStatus.hasSaveCount+'/'+this.formSaveStatus.needSaveCount+' ...'});
            }
            
            this.needSaveUpdateSuccessItems = [];
            this.formSaveMsg = [];
            
            
            this.doNeedSaveFormModel(); /*保存表单信息*/
            this.doNeedFormItemUpdateModel(); /*保存更新尚未保存的组件 */
            this.doNeedTabViewUpdateModel(); /*保存更新尚未保存的tab页签 */
            this.doNeedFormItemDeleteModel();  /*保存删除尚未保存的组件*/
            // this.saveFormLayout();  /*保存表单组件布局*/
        },

      


        /*保存表单信息 needSaveFormConfig 里面的信息提交*/
        doNeedSaveFormModel(){
                let that = this;
                for(let _uuid in this.needSaveFormConfig){
                    let _config = this.needSaveFormConfig[_uuid]; /*未保存更新的数据*/
                    updateFormModelAjax(this.formOperateId,this.formId,_config).then((response)=>{
                            this.formSaveStatus.hasSaveCount++;
                          
                            if(response.data.status <= 99){
                                 delete this.needSaveFormConfig[_uuid]; //删除 未保存对象
                            }else{
                                this.formSaveStatus.success = false;
                                this.formSaveMsg.push({msg:'表单信息更新失败'});
                            }
                    }).catch((err)=>{
                           this.formSaveStatus.hasSaveCount++;
                           this.formSaveStatus.success = false;
                           this.formSaveMsg.push({msg:'表单信息更新失败'});
                    })
                }
        },


        /*保存更新尚未保存的组件 needSaveUpdateItemConfig 里面的信息提交*/
        doNeedFormItemUpdateModel(){
                let that = this;
                for(let _uuid in this.needSaveUpdateItemConfig){
                    let _config = this.needSaveUpdateItemConfig[_uuid]; /*未保存更新的数据*/
                    updateFormItemModelAjax(_config).then((response)=>{
                            this.formSaveStatus.hasSaveCount++;
                         // loadingInstance.text = '正在保存表单数据,请稍等 '+_saveStatus.hasSaveCount+'/'+_saveStatus.needSaveCount+' ...';
                            if(response.data.status <= 99){
                                 this.needSaveUpdateSuccessItems.push(_uuid);
                            //   delete this.needSaveUpdateItemConfig[uuid]; //删除 未保存对象
                            }else{
                                this.formSaveStatus.success = false;
                                this.formSaveMsg.push({msg:'组件 '+_config.titleName+' 更新失败'});
                            }
                    }).catch((err)=>{
                           console.log(err);
                           this.formSaveStatus.hasSaveCount++;
                           this.formSaveStatus.success = false;
                           this.formSaveMsg.push({msg:'组件 '+_config.titleName+' 更新失败'});
                    })
            }
        },

         /*保存更新尚未保存的tab页签 needSaveUpdateTabViewConfig 里面的信息提交*/
        doNeedTabViewUpdateModel(){
                let that = this;
                for(let _uuid in this.needSaveUpdateTabViewConfig){
                    let _config = this.needSaveUpdateTabViewConfig[_uuid]; /*未保存更新的数据*/
                    updateTabViewModelAjax(_config).then((response)=>{
                            this.formSaveStatus.hasSaveCount++;
                            if(response.data.status <= 99){
                                 this.needSaveUpdateSuccessItems.push(_uuid);
                            }else{
                                this.formSaveStatus.success = false;
                                this.formSaveMsg.push({msg:'页签 '+_config.titleName+' 更新失败'});
                            }
                    }).catch((err)=>{
                           console.log(err);
                           this.formSaveStatus.hasSaveCount++;
                           this.formSaveStatus.success = false;
                           this.formSaveMsg.push({msg:'页签 '+_config.titleName+' 更新失败'});
                    })
            }
        },

         /*保存删除尚未保存的组件 needSaveDeleteItemConfig 里面的信息提交*/
        doNeedFormItemDeleteModel(){
                let that = this;
                for(let _uuid in this.needSaveDeleteItemConfig){
                    let _config = this.needSaveDeleteItemConfig[_uuid]; /*未保存更新的数据*/
                    deleteFormItemModelInViewAjax(this.formOperateId,_config.itemId).then((response)=>{
                            this.formSaveStatus.hasSaveCount++;
                            if(response.data.status <= 99){
                                 this.needSaveDeleteSuccessItems.push(_uuid);
                            }else{
                                this.formSaveStatus.success = false;
                                this.formSaveMsg.push({msg:'组件 '+_config.titleName+' 删除失败'});
                            }
                    }).catch((err)=>{
                           this.formSaveStatus.hasSaveCount++;
                           this.formSaveStatus.success = false;
                           this.formSaveMsg.push({msg:'组件 '+_config.titleName+' 删除失败'});
                    })
            }
        },

        /*保存表单组件布局*/
        saveFormLayout(){
            let saveFormLayoutObj = [];
            let idx = 0;
            for(let i = 0;i<this.views.length;i++){
                let _itemIdInViewsMap = {};   
                let _hasSaveItemId = null;

                (this.viewsRowArrayMap[this.views[i].id]).forEach((rowItem,rowIdx)=>{
                  
                    if(rowItem.items){
                        (rowItem.items).forEach((colItem,colIdx)=>{
                            idx++;
                            saveFormLayoutObj.push(this.views[i].id+'-'+colItem.itemId+'-'+(colIdx==0?1:0)+'-'+idx);
                            
                            if(_itemIdInViewsMap[String(colItem.itemId)]){
                                _hasSaveItemId = colItem.itemId;
                            }else{
                                _itemIdInViewsMap[String(colItem.itemId)] = {viewName:this.views[i].displayName,itemName:colItem.titleName}
                            }
                        })
                    }
                }) 

                if(_hasSaveItemId!=null){
                     let _errObj = _itemIdInViewsMap[String(_hasSaveItemId)];
                     this.$message({
                            showClose: true,
                            message:'警告： '+_errObj.viewName+' 下面存在两个相同组件 '+_errObj.itemName+' 镜像',
                            type: 'warning',
                            duration:0,
                            customClass:'design-from-el-message'
                    });
                }
            }

            let that = this;
            saveTabViewFormItemModelOrderAjax(this.formOperateId,saveFormLayoutObj).then((response)=>{
                  if(response.data.status <= 99){
                      
                  }else{
                        this.formSaveStatus.success = false;
                        this.formSaveMsg.push({msg:'表单布局更新失败'});
                  }
                   this.formSaveStatus.hasSaveCount++;
            }).catch((error)=>{
                   this.formSaveStatus.success = false;
                   this.formSaveMsg.push({msg:'表单布局更新失败'});
                   this.formSaveStatus.hasSaveCount++;  
            })
        },

        saveShowMsg(){
            this.saveFormLayout(); 
            if(this.formSaveStatus.success){
                   
                    this.$message({
                        showClose: true,
                        message:'保存成功！',
                        type: 'success',
                        duration:2000,
                        customClass:'design-from-el-message'
                    });
            }else{
                if(this.needSaveUpdateSuccessItems && this.needSaveUpdateSuccessItems.length>0){
                    (this.needSaveUpdateSuccessItems).forEach((_uuid)=>{
                        delete this.needSaveUpdateItemConfig[_uuid]; //删除 未保存对象
                    })
                }

                 if(this.needSaveDeleteSuccessItems && this.needSaveDeleteSuccessItems.length>0){
                    (this.needSaveDeleteSuccessItems).forEach((_uuid)=>{
                            delete this.needSaveDeleteItemConfig[_uuid]; //删除 未保存对象
                    })
                 }

                 let _msg = '';
                 (this.formSaveMsg).forEach((item,idx)=>{
                        _msg+='<div>'+item.msg+'</div>'
                 })

                 this.$message({
                        showClose: true,
                        dangerouslyUseHTMLString: true,
                        type: 'error',
                        message: _msg,
                        duration:2000,
                        customClass:'design-from-el-message'
                });
            }

            this.needSaveUpdateSuccessItems = [];
            this.needSaveDeleteSuccessItems = [];

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
        },


        /*镜像开始*/
        mirrorItemFunc(){
            this.mirrorCheckList = [];
            this.mirrorInViewsMap = {};
            this.mirrorItem = [];
            let _item = null;
            for(let i = 0;i<this.views.length;i++){
                for(let j = 0;j<this.viewsRowArrayMap[this.views[i].id].length;j++){
                    let _rowItem = this.viewsRowArrayMap[this.views[i].id][j];
                    if(_rowItem.items){
                        for(let k = 0;k<_rowItem.items.length;k++){
                            if(this.activeUuid == _rowItem.items[k].uuid ){
                                _item = _rowItem.items[k];
                                this.mirrorInViewsMap[String(this.views[i].id)] = 1;
                                this.mirrorCheckList.push(this.views[i].id);
                            }
                        }
                    }
                }
            }
            if(_item !=null){
                if(_item.designModelName == "designApproval"){
                     EcoMessageBox.alert('该组件不能镜像');
                     return ;
                }

                this.mirrorItem = EcoUtil.objDeepCopy(_item);
                this.mirrorItemDialog = true;
            }else{
                EcoMessageBox.alert('该组件不能镜像');
            }
        },

        mirrorItemSubmit(){
            let _toView = [];
            (this.mirrorCheckList).forEach((item)=>{
                if(this.mirrorInViewsMap[String(item)]){

                }else{
                    _toView.push(item);
                }
            })

            let _data = {};
            _data.operateId = this.formOperateId;
            _data.itemId = this.mirrorItem.itemId;
            _data.fromView = this.viewTabActive;
            _data.toViews = _toView.join(",");
            
            if(_toView.length > 0){
                mirrorItemAjax(_data).then((response)=>{
                        if(response.data.status <=99){
                            (response.data.remap.items).forEach((item)=>{
                                let _item =  EcoUtil.objDeepCopy(this.mirrorItem);
                                let _rowItems = {items:[_item]};
                                this.viewsRowArrayMap[item.viewId].splice(this.viewsRowArrayMap[item.viewId].length,0,_rowItems);
                            })
                        }
                        this.mirrorItemDialog = false;
                })
            }
           
        }
        /*镜像结束*/
     
  },
  watch:{
       'wfFormDesignConfigChange'(newvalue,oldvalue){ //监听设置 里面发生的变化
            this.watchConfigAction(newvalue);
        }, 

        'wfFormDesignConfigChange2'(newvalue,oldvalue){ //监听设置 里面发生的变化
            this.watchConfigAction(newvalue);
        }, 

        'viewTabActive'(newvalue,oldvalue){
            // this.$set(this.dragItemOptions['group'],'name','module'+newvalue);
        },

        /*保存信息监听*/
        formSaveStatus: {
            handler(newValue, oldValue) {
                if(newValue.saving){
                    this.loadingInstance.text = '正在保存表单数据,请稍等 '+this.formSaveStatus.hasSaveCount+'/'+this.formSaveStatus.needSaveCount+' ...';
                    if(newValue.hasSaveCount >= newValue.needSaveCount){ /*提交完成*/
                         try{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                 this.loadingInstance.close();
                            });
                            this.saveShowMsg(); /*显示保存的结果*/
                            this.formSaveStatus.saving = false;
                         }catch(err){
                            console.log(err);
                         }
                    }
                }
            },
            deep: true
        }
  }
}

</script>

<style>
.formContentVue .designTabDiv1 .el-tabs__header{
    display:none
}
</style>


<style scoped>

.formContentVue{
    background-color: #fafafa;
}

.formContentVue .toolbar{
    /* margin:0px 10px; */
    line-height: 30px;
    position:absolute;
    left:290px;
    right:270px;
    top:65px;
    background-color: #fff;
    padding-left:23px;
}

.formContentVue .toolbarBtn{
    width: 20px;
    height: 20px;
    cursor: pointer;
    padding:0px 5px;
}


.formContentVue .toolbarBtn:hover{
    background-color:#fafafa;
    color:#409EFF;
}


.formContentVue .borderDiv{
    border-bottom: 1px solid #dcdfe6;
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
    top:95px;
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
    /* margin-top:10px; */
    padding: 0px 20px 50px 20px;
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


.flowFormVue .tabDragDiv{
    position: absolute;
    top: 10px;
    left:0px;
    right:0px;
    bottom:0px;
    overflow:auto;
    z-index: 999;
    background-color: #fff;
}



</style>

<style>

#tab-mainPage .el-icon-close{
  display: none;
}

.formContentVue .el-tabs__nav-wrap::after{
    background-color: unset;
}

.formContentVue .el-tabs__header{
    padding:0px 10px;
    margin:0px;
}

.formContentVue .el-tabs__content{
    padding:10px;
}

.formContentVue .el-tabs__item{
    padding:0px 15px;
}

.tabViewSortDialog .dataRow{
    padding:5px;
    background-color: rgb(231,232,236);
    margin:0px 0px 10px 0px;
    font-size: 14px;
}

.tabViewSortDialog .dataRow .title{
    color:#0e152ccc
}

.tabViewSortDialog .moveCol{
    text-align:right;
    color:#194ce6;
}

.tabViewSortDialog .dragTr{
    cursor:move;
}

.tabViewSortDialog .sortable-drag {
    background-color: #fff;
}

.tabItemViewSortDialog .viewItemDiv{
    margin-bottom:20px;
}

.tabItemViewSortDialog .tabName{
    background-color: #82c8ff;
    line-height: 30px;
    height:30px;
}

.tabItemViewSortDialog .tabName span{
    margin-left:10px;
    color: #262626;
    font-size: 14px;
}

.tabItemViewSortDialog .el-dialog__body{
    padding:0px 20px;
}

</style>