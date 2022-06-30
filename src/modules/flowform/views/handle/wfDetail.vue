<template>
  <div class="flowFormVue designTable flowDetailVue" >

    <eco-content top="0px" height="40px" ref="content1"  style="background-color:#fafafa">
         <wfDetailToolbar :formWf="formWf" :formTask="formTask" :formPageRender="formPageRender" ref="wfDetailToolbar"  @cancelWFCallBack="cancelWFCallBack" @emitEvent="toolBarEmitEvent"></wfDetailToolbar>
    </eco-content>

    <eco-content top="40px" bottom="0px" ref="content2"  style="background-color:#f4f4f5" >
                
                <div class="flowForm"  v-bind:style="{width:(formWidth+60)+'px',marginBottom:showApprovalDiv?0:'60px',minHeight:getFormHeight}">
                        <div style="padding-left:30px;padding-right:30px;" v-bind:class="['formContent'+viewTabNum]">
                            
                            <el-tabs v-model="viewTabActive" >
                                    <el-tab-pane 
                                        v-if="viewItem.viewType != '1'"
                                        :label="(viewItem.displayName?viewItem.displayName:'页签')" 
                                        :name="viewItem.id"
                                        v-for="(viewItem) in views" 
                                        :key="viewItem.id" >

                                        <component 
                                            v-if="viewItem.showTitle == 1"
                                            :is="'handleForm'" 
                                            id="handleComponentForm"
                                            ref="handleComponentForm"
                                            :formWf="formWf"
                                        ></component>
                                        <div class="borderDiv" v-else></div>

                                        <div v-bind:style="{marginBottom:isHandleOpenDialog?'63px':null}">
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
                                                                class="flowFormCol"
                                                                style="display:table-cell"

                                                                v-bind:class="{lastColComponent:isLastColComponent(rowsItem.items,colItem),firstColComponent:isFirstColComponent(rowsItem.items,colItem)}"
                                                                v-bind:style="getColWidth(rowsItem.items,colItem)"

                                                            >
                                                                <component 
                                                                        :id="'m-'+colItem.viewId+'-'+colItem.itemId"
                                                                        :mValue="getComponentValue(colItem)"  
                                                                        :mItem="colItem" 
                                                                        :is="colItem.handleModelName"   
                                                                        :ref="'m'+colItem.itemId"
                                                                        @emitEvent="emitEvent"   
                                                                        :formWidth="formWidth"
                                                                        :mForm="formThemeStyleAO"   
                                                                        :operateId="operateId"
                                                                        :mTask="formTask"
                                                                        :formWf="formWf"
                                                                ></component>
                                                        </div>          
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </el-tab-pane>
                            </el-tabs>




                            <div v-if="hasRefWfMainList || hasRefWfSubList " class="handleLink">
                                            <div class="refWFTitle">
                                                <span>链接</span>
                                                <el-button-group class="hasSplit" style="float:right;">
                                                
                                                        <el-button type="text" v-bind:class="{active:activeLinkName == 'handleRefSubList'}" v-if="hasRefWfSubList" @click="activeLinkName = 'handleRefSubList';formWfList = formSubWfList;" size="medium">子流程</el-button>
                                                        <el-button type="text" v-bind:class="{active:activeLinkName == 'handleRefMainList'}" v-if="hasRefWfMainList" @click="activeLinkName = 'handleRefMainList';formWfList = formMainWfList;" size="medium">主流程</el-button>
                                                        
                                                </el-button-group>
                                                
                                            </div>
                                            <component :is="activeLinkName || initActiveLinkName" :formWfList="formWfList" :refKmArray="relKlgArray"></component>
                                        </div>
                            </div>

                            <div v-bind:style="ecoSaveDivStyle" class="ecoSaveDiv" v-if="hasSaveDiv"  id="ecoSaveDiv">
                                    <el-button style="font-size:14px;" @click="saveForm">暂时保存</el-button>
                                    <el-button style="font-size:14px;" type="success" @click="handleTaskBtn" v-if="isHandleOpenDialog && this.formTask.taskType != 'START'">办理</el-button>
                                    <el-button style="font-size:14px;" type="primary" @click="submitTaskBtn" v-else>确认提交</el-button>

                                    <el-button style="font-size:14px;background-color:#f56c6c;border-color:#f56c6c;" type="primary" @click="sealForm" v-if="formTask.plgUkey == 1 && uKeyBaseInfo.uKeyReady">盖章</el-button>
                                    <el-button style="font-size:14px;background-color:#ff9e0b;border-color:#ff9e0b;" type="primary" @click="dealForm" v-if="formTask.plgUkey == 1 && uKeyBaseInfo.uKeyReady">批注</el-button>
                            </div>

                </div>
             


                <div  v-if="!isHandleOpenDialog" v-show="hasSaveDiv && showApprovalDiv" class="flowForm" v-bind:style="{width:(formWidth+60)+'px',marginBottom:!showApprovalDiv?0:'80px'}"  style="border:3px solid #409EFF;margin-top:20px;padding-top:10px;" >
                         <div style="padding-left:30px;padding-right:30px;">
                            <div class="approvalDivDesc">审批区域</div>
                            <div class="approvalForm">
                                    <component  v-for="(item,index) in formApprovalItems" :key="index" class="flowFormRow"
                                                :mValue="getComponentValue(item)" 
                                                :mItem="item" 
                                                :mTask="formTask"
                                                :mApproveKv="formApproveKV"
                                                :is="getComponentName(item)"   
                                                :ref="'m'+item.itemId"  
                                                 @emitEvent="emitEvent"    
                                    ></component>
                            </div>
                        </div>
                </div>


                <!--弹出审批区域-->
                <div v-else v-show="handleTaskDialogFlag">
                    <div class="v-modal" tabindex="0" style="z-index: 2910;"></div>
                    <div class="el-dialog__wrapper" style="z-index: 2915;">
                        <div class="el-dialog" style="margin-top:5vh;" v-bind:style="{width:(formWidth+60)+'px'}">
                            
                            <div class="el-dialog__header">
                                <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="handleTaskDialogFlag = false">
                                    <i class="el-dialog__close el-icon el-icon-close"></i>
                                </button>
                            </div>

                            <div class="el-dialog__body" style="padding:0px 0px 0px 0px">
                                    <div v-bind:class="['formContent'+viewTabHandleNum]" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                                        <el-tabs v-model="viewTabHandleActive" >
                                            <el-tab-pane 
                                                v-if="viewItem.viewType == '1'"
                                                :label="(viewItem.displayName?viewItem.displayName:'页签')" 
                                                :name="viewItem.id"
                                                v-for="(viewItem) in views" 
                                                :key="viewItem.id" >
                                        
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
                                                                    class="flowFormCol"
                                                                    style="display:table-cell"
                                                                    v-bind:class="{lastColComponent:isLastColComponent(rowsItem.items,colItem),firstColComponent:isFirstColComponent(rowsItem.items,colItem)}"
                                                                    v-bind:style="getColWidth(rowsItem.items,colItem)"
                                                                >
                                                                    <component 
                                                                        :id="'m'+colItem.itemId"
                                                                        :mValue="getComponentValue(colItem)"  
                                                                        :mItem="colItem" 
                                                                        :is="colItem.handleModelName"   
                                                                        :ref="'m'+colItem.itemId"
                                                                        @emitEvent="emitEvent"   
                                                                        :formWidth="formWidth"
                                                                        :mForm="formThemeStyleAO"   
                                                                        :operateId="operateId"
                                                                        :mTask="formTask"
                                                                    ></component>
                                                            </div>          
                                                        </div>
                                                </div>

                                            </el-tab-pane>
                                        </el-tabs>
                                    </div>
                                

                                    <div v-show="hasSaveDiv && showApprovalDiv">
                                            <div class="approvalForm approvalFormDialog">
                                                <div class="approvalDivDescDialog">审批意见</div>
                                                <component  
                                                        v-for="(item,index) in formApprovalItems" :key="index" class="flowFormRow"
                                                        :mValue="getComponentValue(item)" 
                                                        :mItem="item" 
                                                        :mTask="formTask"
                                                        :mApproveKv="formApproveKV"
                                                        :is="getComponentName(item)"   
                                                        :ref="'m'+item.itemId"  
                                                        @emitEvent="emitEvent"
                                                ></component>

                                                <div class="el-dialog__footer">
                                                    <el-button @click="handleTaskDialogFlag = false" style="font-size:14px;">取 消</el-button>
                                                    <el-button style="font-size:14px;" @click="saveForm" v-if="hasSaveDiv">暂时保存</el-button>
                                                    <el-button type="primary" @click="submitTaskBtn" style="font-size:14px;" v-if="hasSaveDiv">确 定</el-button>
                                                </div>
                                            </div>
                                    </div>
                            </div>

                        </div>
                    </div>
                </div>
               




    </eco-content>
  

      <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
          <input type="hidden" name="fileHeaderIds"/>
          <input type="hidden" name="expectedName"/>
      </form>

      <iframe name="docviewIframe" style="display:none"></iframe>

    </div>

</template>
<script>

import {mapState,mapMutations} from 'vuex'
import {getWFFormRender,getWFFormTaskLoad,wfSaveFormAjax,wfSubmitTaskAjax,postWFAjaxEvent,
getItemInteractionAjax,updateFileToServerUKey,getUKeyBaseInfo,getSeqNumViewAjaxEvent,getFormApiSceneEvent,getPublicSettingUnion} from'../../service/service'
import {sysEnv,decimal,baseUrl} from '../../config/env.js'
import {defaultFormWidth,defaultFormTitleTextColor,defaultFormTitleBgColor} from '../../config/setting.js'
import {EcoFile} from '@/components/file/main.js'
import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {Loading} from 'element-ui';
import ecoContent from '@/components/pageAb/ecoContent.vue'

import wfDetailToolbar from './wfDetailToolbar.vue'
import handleForm from "./module/handleForm.vue";
import handleInput from "./module/handleInput.vue";
import handleNumber from "./module/handleNumber.vue";
import handleTextarea from "./module/handleTextarea.vue";
import handleDate from "./module/handleDate.vue";
import handleSelect from "./module/handleSelect.vue";
import handleRadio from "./module/handleRadio.vue";
import handleCheckbox from "./module/handleCheckbox.vue";
import handleUserSelect from "./module/handleUserSelect.vue";
import handleOrgSelect from "./module/handleOrgSelect.vue";
import handleAttachment from "./module/handleAttachment.vue";
import handleImg from "./module/handleImg.vue";
import handleSeqField from "./module/handleSeqField.vue";
import handleSeal from "./module/handleSeal.vue";
import handleApi from "./module/handleApi.vue";
import handleRelWF from "./module/handleRelWF.vue";
import handleCascader from "./module/handleCascader.vue";
import handleGrid from "./module/grid/handleGrid.vue";
import handleApprovalDesc from "./module/handleApprovalDesc.vue";
import handleApprovalOrgSelect from "./module/handleApprovalOrgSelect.vue";
import handleApprovalSuggest from "./module/handleApprovalSuggest.vue";
import handleApprovalTextarea from "./module/handleApprovalTextarea.vue";
import handleTaskAttachment from "./module/handleTaskAttachment.vue";
import handleSegmentHeader from "./module/handleSegmentHeader.vue";
import handleBlank from "./module/handleBlank.vue";
import handleRefMainList from "./module/handleRefMainList.vue";
import handleRefSubList from "./module/handleRefSubList.vue";
import handleRefKmLink from "./module/handleRefKmLink.vue";
import handleBtn from "./module/handleBtn.vue";

import ecoHandle from "./module/ecoHandle.vue";

import axios from 'axios'

export default{
   components:{
        ecoContent,
        wfDetailToolbar,
        handleForm,
        handleInput,
        handleNumber,
        handleTextarea,
        handleDate,
        handleSelect,
        handleRadio,
        handleCheckbox,
        handleUserSelect,
        handleOrgSelect,
        handleAttachment,
        handleImg,
        handleSeqField,
        handleSeal,
        handleGrid,
        handleApprovalOrgSelect,
        handleApprovalDesc,
        handleApprovalSuggest,
        handleApprovalTextarea,
        handleTaskAttachment,
        handleSegmentHeader,
        handleRefMainList,
        handleRefSubList,
        handleApi,
        handleRelWF,
        handleCascader,
        ecoHandle,
        handleBlank,
        handleRefKmLink,
        handleBtn
  },
  name:'wfDetail',
  data(){
    return {
        taskId:0,
        operateId:0,
        formActGroupItems:{},
        formItems:[],
        formApprovalItems:[],
        formHandleItems:[],    
        formSys:{},
        formTask:{},
        formThemeStyleAO:{},
        formWf:{},
        formGrids:{},
        formMainWfList:[],
        formSubWfList:[],
        formPageRender:{},
        formApproveKV:[],

        dataApprovals:{},
        dataGrids:{},
        dataItemOAObj:{},
        dataKVMap:{},
        dataPageEvents:{},
        dataApprovalItem:{},
        dataItemDefMap:{},

        views:[],
        viewsItemMap:{},
        viewsItemMapRes:{},
        viewsRowArrayMap:{},
        viewTabActive:null,
        viewTabHandleActive:null,
        viewTabNum:0,
        viewTabHandleNum:0,
        itemIdViewMap:{},
        handleTaskDialogFlag:false,

        loading:false,
        rowArray:[],
        tempEvent:{},
        formStyle:'styleTable',
        formWidth:defaultFormWidth,
        defaultFormTitleTextColor:defaultFormTitleTextColor,
        defaultFormTitleBgColor:defaultFormTitleBgColor,
        loadingInstance:null,
        approvalRowShowFlag:0,

        printTemplateId:0,
        uKeyBaseInfo:{
            ukeySealDefaultSavePath:null,
            ukeySealServiceHost:null,
            uKeyReady:false
        },
        relKlgArray:[],
        activeLinkName:"",
        formWfList:[],

        interactionEventList:[], //相关性事件队列
        interactionEventMap:{},
      
       
    }
  },
  created(){
     
  },
  mounted(){
       this.listAction();
       this.taskId = this.$route.params.taskId;
       this.operateId = this.$route.params.operateId;
       this.getWFFormInit();
       this.getPublicSettingUnionFunc();
      
       window.ecoWFVm = this;
       window.onresize = function(){
            window.ecoWFVm.onResize();
       }
  },
  computed:{
     ...mapState([
        'wfKvMap',
        'wfPageEvents',
        'wfHandSigns',
    ]),

    hasSaveDiv:function(){
             if(this.formWf && this.formTask){
                 if(this.formWf.status == 1 || this.formWf.status == 11){
                     if(this.formTask.status == 1 || this.formTask.status == 3){
                         return true;
                     }
                 }
             }
             
             return false;
    },
    
    showApprovalDiv:function(){
        return this.approvalRowShowFlag != (this.formApprovalItems.length-1);
    },

    getFormHeight:function(){
        if(this.hasSaveDiv && this.showApprovalDiv && !this.isHandleOpenDialog){
            return 'calc(100% - 340px)';
        }else{
            return 'calc(100% - 140px)';
        }
    },

    ecoSaveDivStyle:function(){
        let _style = {};
        _style.margin = 'auto';
        _style.width = (this.formWidth+60)+'px';
        _style.padding= "20px 0px ";
        return _style;
    },

    hasRefWfMainList:function(){
        return this.formMainWfList && this.formMainWfList.length>0;
    },
    hasRefWfSubList:function(){
        return this.formSubWfList && this.formSubWfList.length>0;
    },
  
    initActiveLinkName:function(){
        if(this.hasRefWfSubList){
            this.activeLinkName = 'handleRefSubList';
            this.formWfList = this.formSubWfList;
            return 'handleRefSubList';
        }
        if(this.hasRefWfMainList){
            this.formWfList = this.formMainWfList;
            this.activeLinkName = 'handleRefMainList';
            return 'handleRefMainList';
        }
        return '';
    },
    
    isHandleOpenDialog:function(){
        if(window.flowformSetting && window.flowformSetting.wfDetailHandleType && window.flowformSetting.wfDetailHandleType == 'openDialog'){
            return true;
        }else{
            return false;
        }
    }
    
  },
  methods: {
        ...mapMutations([
            'SET_WF_KV_MAP',
            'SET_WF_PAGE_EVENTS',
            'SET_WF_HAND_SIGNS_MAP',
            'SET_PUBLIC_SETTING_UNION'
        ]),

        getColWidth(rowsItemArray,colItem){
            let _style = {};
            if(colItem.visiable == 0){
                _style.width = '0%';
                _style.display = 'none';
            }else if(colItem.compFixed){
                _style.width = colItem.compWidth+'%';
            }else{
                let _length =0;
                let _fixWidth = 0;
                
                (rowsItemArray).forEach((item)=>{
                    if(item.visiable == 1 && !item.compFixed){
                        _length++;
                    }
                    if(item.compFixed){
                         _fixWidth+=item.compWidth;
                    }
                })

                _style.width = Math.floor( ((100-_fixWidth))/_length )+'%';
            }
            return _style;
        },

        isLastColComponent(rowsItemArray,colItem){
            let _last = false;
            for(let i = rowsItemArray.length-1;i>=0;i--){
                if(rowsItemArray[i].visiable == 1){
                     if(rowsItemArray[i].itemId == colItem.itemId){
                         _last = true;
                         break;
                     }else{
                         _last = false;
                         break;
                     }
                }
            }
            return _last;
        },

        isFirstColComponent(rowsItemArray,colItem){
            let _last = false;
            for(let i = 0;i< rowsItemArray.length;i++){
                if(rowsItemArray[i].visiable == 1){
                     if(rowsItemArray[i].itemId == colItem.itemId){
                         _last = true;
                         break;
                     }else{
                         _last = false;
                         break;
                     }
                }
            }
            return _last;
        },

        listAction(){
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'pageSelectCallBack'){
                    window.ecoWFVm.eventHandle(obj.data);
                }else if(obj && obj.action == 'onFileUploadActionCallBack'){ //附件上传回写
                    window.ecoWFVm.onFileUploadActionCallBack(obj.data);
                }else if(obj && obj.action == 'apiPageSelectCallBack'){
                    window.ecoWFVm.apiEventHandle(obj.data);
                }else if(obj && obj.action == 'apiSelfPageSelectCallBack'){
                    window.ecoWFVm.apiSelfEventHandle(obj.data);
                }else if(obj && obj.action == 'relWFPageSelectCallBack'){
                    window.ecoWFVm.relWFEventHandle(obj.data);
                }else if(obj && obj.action == 'selectUkeyPrintTemplate'){
                    window.ecoWFVm.selectUkeyPrintTemplate(obj.data);
                }else if(obj && obj.action == 'wfGridExlImportCallBack'){
                    window.ecoWFVm.wfGridExlImportCallBack(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfDetailVue');
        },
        //初始化数据
        doWFDataInit(){
            this.formActGroupItems = {};
            this.formItems = [];
            this.formApprovalItems = [];
            this.formHandleItems = [];  
            this.formSys = {};
            this.formTask = {};
            this.formThemeStyleAO = {};
            this.formWf = {};
            this.formGrids = {};
            this.formMainWfList = [];
            this.formSubWfList = [];
            this.formPageRender = {};

            this.dataApprovals = {};
            this.dataGrids = {};
            this.dataItemOAObj = {};
            this.dataKVMap = {};
            this.dataPageEvents = {};
            this.dataItemDefMap = {};

            this.views = [];
            this.viewsItemMapRes = {};
            this.viewsItemMap = {};
            this.viewsRowArrayMap = {};
            this.viewTabActive = null; 
            this.viewTabHandleActive = null;
            this.viewTabHandleNum = 0;
            this.viewTabNum = 0;
            this.handleTaskDialogFlag = false;


            this.rowArray = [];
            this.tempEvent = {};
            this.approvalRowShowFlag = 0;
            this.dataApprovalItem = {};
            this.relKlgArray = [];
            this.formWfList = [];
            this.SET_WF_KV_MAP({});
            this.SET_WF_PAGE_EVENTS({});
            this.SET_WF_HAND_SIGNS_MAP({});
        },

        //获取配置的信息
        getPublicSettingUnionFunc(){
            getPublicSettingUnion().then((response)=>{
                this.SET_PUBLIC_SETTING_UNION(response.data);    
            })  
        },

        //初始化流程基本信息
        getWFFormInit(){
            let that = this;
            this.loadingInstance = Loading.service({ fullscreen: true,text:'初始化表单信息,请稍等...'});
         
            // axios.all([getWFFormRender(this.operateId), getWFFormTaskLoad(this.operateId)])
            //         .then(axios.spread(function (res1, res2) {
               
                getWFFormRender(that.operateId).then((res1)=>{
                    getWFFormTaskLoad(that.operateId).then((res2)=>{

                            if( res1.data && res1.data.remap.load){
                                    that.formActGroupItems = res1.data.remap.load.actGroupItems;
                                    that.formSys = res1.data.remap.load.sys;
                                    that.formTask = res1.data.remap.load.task;
                                    that.formThemeStyleAO = res1.data.remap.load.themeStyleAO;
                                    that.formWf = res1.data.remap.load.wf;
                                    
                                    that.views = res1.data.remap.load.views;
                                    that.viewsItemMapRes = EcoUtil.objDeepCopy(res1.data.remap.load.vitemMap);
                                    (that.views).forEach((viewItem)=>{
                                        that.$set(that.viewsRowArrayMap,viewItem.id,[]);
                                    })
                            
                                    if(that.views && that.views.length > 0){ //设置默认的tab页签
                                        for(let i =0;i<that.views.length;i++){
                                            if(that.views[i].viewType == '1'){
                                                if(!that.viewTabHandleActive || that.viewTabHandleActive==0){
                                                    that.viewTabHandleActive = that.views[i].id;
                                                }
                                                that.viewTabHandleNum++;
                                            }
                                        }
                                        for(let i =0;i<that.views.length;i++){
                                            if(that.views[i].viewType != '1'){
                                                if(!that.viewTabActive || that.viewTabActive==0){
                                                    that.viewTabActive = that.views[i].id;
                                                }
                                                that.viewTabNum++;
                                            }
                                        }
                                    }
                                
                                    try{
                                        (res1.data.remap.load.grids).forEach((item)=>{
                                            that.formGrids[item.id] = item.list;
                                        })
                                    }catch(e){
                                        console.log(e);
                                    }
                                    
                                    that.formPageRender = res1.data.remap.load.pageRender;
                                    that.formApproveKV = res1.data.remap.load.approveKV;

                                    if(res1.data.remap.load.mainWfList){
                                        that.formMainWfList = res1.data.remap.load.mainWfList;
                                    }
                                    if(res1.data.remap.load.subWfList){
                                        that.formSubWfList = res1.data.remap.load.subWfList;
                                    }
                                
                                    try{
                                        that.formWidth = (that.formThemeStyleAO && that.formThemeStyleAO.formWidth)?Number(that.formThemeStyleAO.formWidth):defaultFormWidth;
                                    }catch(e){}
                                    if(!that.formThemeStyleAO.titleBgColor){
                                        that.formThemeStyleAO.titleBgColor = that.defaultFormTitleBgColor;
                                    }
                                    if(!that.formThemeStyleAO.titleTextColor){
                                        that.formThemeStyleAO.titleTextColor = that.defaultFormTitleTextColor;
                                    }

                                
                                    let _formApprovalDesc = [];
                                    let _formApprovalItems = [];
                                    let _formApprovalCodeItems = [];

                                    for(let i = 0;i < that.views.length;i++){
                                        let _formItems = [];
                                        let _viewArray = [];
                                        if(res1.data.remap.load.vitemMap && res1.data.remap.load.vitemMap[that.views[i].id]){
                                            _viewArray = res1.data.remap.load.vitemMap[that.views[i].id];
                                        }

                                        (_viewArray).forEach((item)=>{
                                            
                                            if(item.actionGroup == 0){
                                                if(item.actionType == -1){//节点选人
                                                    _formApprovalItems.push(item);
                                                }else if(item.actionType == 0){//表单数据
                                                    _formItems.push(item);
                                                }else{//分支
                                                    _formApprovalCodeItems.push(item);
                                                }
                                            }else{
                                                if(item.actionType == 0){ //表单数据
                                                    let _item = EcoUtil.objDeepCopy(item);
                                                    _item.actionType = 'approvalDesc'; //环节描述
                                                    _item.itemId = '#'+item.itemId;
                                                    _formItems.push(_item);
                                                    _formApprovalDesc.push(item);
                                                    that.dataApprovalItem[String(item.itemId)] = 1;
                                                }else if(item.actionType == -1){ //节点选人
                                                    _formApprovalItems.push(item);
                                                }else { //分支
                                                    _formApprovalCodeItems.push(item);
                                                }
                                            }
                                        })
                                        that.$set(that.viewsItemMap,String(that.views[i].id), _formItems);
                                    }

                                    let _approvalItem = (_formApprovalItems).concat(_formApprovalCodeItems).concat(_formApprovalDesc);
                                    // that.formItems = _formItems;
                                    _approvalItem.push({itemId:'appr_attachments',modelType:'TASKATTACHMENT',actionGroup:0});
                                    that.formApprovalItems = _approvalItem;

                                    if(that.formTask.plgUkey == 1){
                                        that.addWindowUKeyAddListen();
                                    }

                                }else{
                                    that.$message({
                                        message: res1.data.msgDesc,
                                        type: 'error'
                                    });
                                }

                                if( res2.data && res2.data.remap.load){
                                    that.dataApprovals = res2.data.remap.load.approvals;
                                    that.dataGrids = res2.data.remap.load.grids;
                                    (res2.data.remap.load.itemAOList).forEach((item)=>{
                                        that.dataItemOAObj[item.itemId] = item ;
                                    })

                                    that.dataKVMap = res2.data.remap.load.kvMap;
                                    that.dataPageEvents = res2.data.remap.load.pageEvents;
                                    that.dataItemDefMap = res2.data.remap.load.itemDefMap;

                                    /*把 kvmap 和 pageEvent 放到 vuex里面*/
                                    that.SET_WF_KV_MAP(res2.data.remap.load.kvMap);
                                    that.SET_WF_PAGE_EVENTS(res2.data.remap.load.pageEvents);
                                    that.SET_WF_HAND_SIGNS_MAP(res2.data.remap.load.handSigns);

                                }

                                
                                that.drawLayout();
                                that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                    that.loadingInstance.close();
                                });
                        })
                    })
            // }));
        },

        //初始化布局方法
        drawLayout(){
            try{
                let _itemIdViewMap = {};
                for(let j = 0;j<this.views.length;j++){
                    if(this.viewsItemMap[this.views[j].id] && this.viewsItemMap[this.views[j].id].length > 0){
                        let key = this.views[j].id;
                        let viewsRowArray = [];
                        let colArray = [];
                        this.viewsItemMap[key].forEach((item)=>{
                            let _viewArray = _itemIdViewMap[String(item.itemId)]?_itemIdViewMap[String(item.itemId)]:[];
                            _viewArray.push(key);
                            _itemIdViewMap[String(item.itemId)] = _viewArray;
                            
                            let _item = EcoUtil.objDeepCopy(item);
                            _item.handleModelName = this.getComponentName(_item);
                            _item.viewId = key;
                            
                            if(_item.changeLine == 'Y'){
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

                this.itemIdViewMap = _itemIdViewMap;
            }catch(e){
                console.log(e);
            }
        },

        getComponentValue(colItem){
                let itemId = colItem.itemId;
                let _item =  this.dataItemOAObj[itemId.toString()];
             
                    if(_item && _item.kvName){
                        _item.KVMap =  this.dataKVMap[_item.kvName];
                    }
                    if(colItem.compType == 'GRID'){
                        _item.dataGrids = this.dataGrids[itemId];
                        _item.formGrids = this.formGrids[itemId]
                    }
                    if(colItem.actionGroup !=0){ //驱动
                        if(colItem.actionType == "approvalDesc"){ //环节描述
                            _item = this.dataItemOAObj[itemId.substring(1)];
                            _item.approvalObj = {};
                            if(_item.actionGroupIds && _item.actionGroupIds.length > 0){
                                for(let j = 0;j<_item.actionGroupIds.length;j++){
                                    if(this.dataApprovals[String(_item.actionGroupIds[j])]){
                                        _item.approvalObj[String(_item.actionGroupIds[j])] = this.dataApprovals[String(_item.actionGroupIds[j])];
                                    }else{
                                        _item.approvalObj[String(_item.actionGroupIds[j])] = [];
                                    }
                                }
                            }
                        }
                    }
                
                    if(this.itemIdViewMap[itemId.toString()]){
                        if(_item){
                            _item.itemIdToViewList = this.itemIdViewMap[itemId.toString()];
                        }
                    }
              
            
                return EcoUtil.objDeepCopy(_item);
        },

        //获取对于的组件名称
        getComponentName(item){
            if(item.actionGroup == 0){ //不是驱动组件 一般的表单数据
                if(item.modelType == "SEGMENT_HEADER"){ //表单头
                    return 'handleSegmentHeader'
                }else if(item.modelType == "TEXTFIELD"){
                    return 'handleInput';
                }else if(item.modelType == "NUMFIELD"){
                    return 'handleNumber';
                }else if(item.modelType == "RADIO"){ //radio 组件
                    return 'handleRadio';
                }else if(item.modelType == "TIMEFIELD"){
                    return 'handleDate';
                }else if(item.modelType == "USERSLT"){ //选择人员
                    return 'handleUserSelect';
                }else if(item.modelType == "ORGSLT"){ //选择机构
                    return 'handleOrgSelect';
                }else if(item.modelType == "CHECKBOX"){ //checkbox 组件
                    return 'handleCheckbox';
                }else if(item.modelType == "SLT"){// select组件
                    return 'handleSelect';
                }else if(item.modelType == "TEXTAREA"){//textarea组件
                    return 'handleTextarea';  
                }else if(item.modelType == 'GRID'){
                    return 'handleGrid';
                }else if(item.modelType == 'APPROVALDESC'){
                    return 'handleApprovalDesc';    
                }else if(item.modelType == 'ATTACHEMENT'){
                    return 'handleAttachment';    
                }else if(item.modelType == 'IMG'){
                    return 'handleImg';    
                }else if(item.modelType == 'SEQFIELD'){
                    return 'handleSeqField';
                }else if(item.modelType == 'SEAL'){
                    return 'handleSeal';
                }else if(item.modelType == 'REL_API'){
                    return 'handleApi';
                }else if(item.modelType == 'REL_WF'){
                    return 'handleRelWF';    
                }else if(item.modelType == 'TASKATTACHMENT'){
                    return 'handleTaskAttachment';
                }else if(item.modelType == 'SLT_CASCADE'){
                    return 'handleCascader';
                }else if(item.modelType == 'BTN'){
                    return 'handleBtn';
                }else{
                    return '';
                }
            }else{ //驱动组件，分为 表单数据，分支，节点工作人员
                if(item.actionType == 0){ //表单数据
                      return 'handleApprovalTextarea';
                }else if(item.actionType == 1){ //分支
                      return 'handleApprovalSuggest'
                }else if(item.actionType == -1){ //节点工作人员
                      return 'handleApprovalOrgSelect'
                }else if(item.actionType == 'approvalDesc'){ //环节描述
                     return 'handleApprovalDesc'
                }else{
                     return 'handleBlank';
                }
            }
        },

         /*冒泡事件处理*/
        emitEvent(emitObj){
            if(emitObj){
                 if(emitObj.action == 'callEventAction'){ //借用冒泡，调用其他组件的callevent
                     if(this.getRefComponentByRefName(emitObj.refName)){
                        this.getRefComponentByRefName(emitObj.refName).callEvent(emitObj.data);
                     }
                 }else if(emitObj.action == 'onEventKeyAction'){ //冒泡eventKey 触发事件
                     this.onEventKeyAction(emitObj.data);
                 }else if(emitObj.action == 'onCustomOrgSelectAction'){ //选人
                     this.onCustomOrgSelectAction(emitObj.data);
                 }else if(emitObj.action == 'onFileUploadAction'){ //附件上传事件
                     this.onFileUploadAction(emitObj.data);
                 }else if(emitObj.action == 'onFilePreviewAction'){//附件预览
                     this.onFilePreviewAction(emitObj.data);
                 }else if(emitObj.action == 'onFileDownloadAction'){//附件下载
                     this.onFileDownloadAction(emitObj.data);
                 }else if(emitObj.action == 'onFileDownloadAllAction'){
                     this.onFileDownloadAllAction(emitObj.data);
                 } else if(emitObj.action == 'onFileEditAction'){
                     this.onFileEditAction(emitObj.data);
                 } else if(emitObj.action == 'onFileSignatureAction'){
                     this.onFileSignatureAction(emitObj.data);
                 }else if(emitObj.action == 'approvalSuggestChange'){//审批意见同意不同意改变回写textarea
                     let _approval = this.formActGroupItems[String(emitObj.data.actionGroup)];
                     if(_approval){
                         let _approvalDescItemId = _approval.approvalDescItem;
                         try{
                              this.getRefComponentByRefName('m'+_approvalDescItemId).callEvent(emitObj.data);
                         }catch(e){}
                     }
                 }else if(emitObj.action == 'approvalActGroupEvent'){ //驱动 选人条件关联
                      let _approval = this.formActGroupItems[String(emitObj.data.actionGroup)];
                      if(_approval){
                            let _approvaItemId = _approval[emitObj.data.targetGroupItemName];
                            let _pre = '';
                            if(emitObj.data.targetGroupItemNamePre){
                                _pre = emitObj.data.targetGroupItemNamePre;
                            }
                            if(this.getRefComponentByRefName('m'+_pre+_approvaItemId)){
                                 this.getRefComponentByRefName('m'+_pre+_approvaItemId).callEvent(emitObj.data);
                            }
                     }
                 }else if(emitObj.action == 'approvalRowShowFlag'){
                        this.approvalRowShowFlag++;
                 }else if(emitObj.action == 'onInteractionAction'){//相关性事件
                        this.onInteractionAction(emitObj.data);
                 }else if(emitObj.action == 'onItemVisibleAction'){//组件显示或隐藏事件
                        this.onItemVisibleAction(emitObj.data);
                 }else if(emitObj.action == 'onMirrorEmitAction'){
                        this.onMirrorEmitAction(emitObj.data);
                 }
            }
        },

        onItemVisibleAction(emitObj){
              for(let k = 0;k<this.views.length;k++){
                   for(let i = 0;i< this.viewsRowArrayMap[this.views[k].id].length;i++){
                        for(let j = 0;j<this.viewsRowArrayMap[this.views[k].id][i].items.length;j++){
                            if(this.viewsRowArrayMap[this.views[k].id][i].items[j].itemId ==emitObj.itemId ){
                                this.viewsRowArrayMap[this.views[k].id][i].items[j].visiable = emitObj.visiable;
                                break;
                            }
                        }
                    }
              }  
        },

         /*根据 冒泡的 eventkey  处理事件*/
        onEventKeyAction(emitObj){
            if(this.dataPageEvents && this.dataPageEvents[emitObj.eventKey]){ //根据事件key获取事件
                 let _event =  EcoUtil.objDeepCopy(this.dataPageEvents[emitObj.eventKey]); //复制事件
                 _event.emitObj = EcoUtil.objDeepCopy(emitObj); //保留抛出来的数据
                 if(true || _event.triggerItem == emitObj.itemId || _event.triggerItem == emitObj.colItemId){ //是不是本组件触发
                    
                    /* 获取 输入参数 inputParams的值 */
                    if( _event.eventSource && _event.eventSource.inputParams){ //根据 itemid,获取inputParams里面的值 
                        (_event.eventSource.inputParams).forEach((inputParamsItem,idx)=>{
                                let _valueObj = null;
                                if(_event.eventType == 'GRIDSUM'){ //grid 合计 
                                    if(this.getItemInputParamsValue){
                                        _valueObj = this.getItemInputParamsValue(inputParamsItem,'GRIDSUM');
                                    }
                                }else{
                                    let _gridrowIndex = null;
                                    if(_event.emitObj.emitStatus){
                                        _gridrowIndex = _event.emitObj.emitStatus.gridRowIndex
                                    }
                                    if(this.getItemInputParamsValue){
                                         _valueObj = this.getItemInputParamsValue(inputParamsItem,null,_gridrowIndex);
                                    }
                                }
                                if(_valueObj){
                                    Object.keys(_valueObj).forEach(function(key){
                                         inputParamsItem[key] = _valueObj[key];
                                    });
                                }
                        })
                    }

                    // console.log('事件eventkey--'+emitObj.eventKey);
                    // console.log(_event);
                    
                    /*根据事件的类型 处理不同的事件*/
                    if(_event.eventType == "ARITHMETIC"){ //四者运算事件处理
                         this.onArithmetic(_event);
                    }else if(_event.eventType == "NUM_ZHCN"){ //大写金额
                         this.onNumZhcn(_event);
                    } else if(_event.eventType == 'GRIDSUM'){ //grid 合计 
                         this.onGridSum(_event);
                    }else if(_event.eventType == 'PAGE'){ //弹出窗口事件
                       if(_event.eventSource.catName == 'USER'|| _event.eventSource.catName == 'DEPT' || _event.eventSource.catName == 'ALLORG'){ //选人弹窗事件
                            this.onOrgUserSelectEvent(_event);
                       }else{
                            this.tempEvent = _event;
                            let _url = '';
                            if(_event.eventSource.url.indexOf("http:")==0){
                                _url = _event.eventSource.url
                            }else if(_event.eventSource.url.indexOf("cmd.")==0){
                                _url = "/wh/servlet/MainServer?cmd="+_event.eventSource.url.replace("cmd.","")
                            }else if(_event.eventSource.url.indexOf("/wh")==0){
                                _url = _event.eventSource.url;
                            }else{
                                _url = "/wh"+_event.eventSource.url;
                            }

                            _url = _url.replace('[wf.id]',this.formWf.wfId);
                            if( _event.eventSource && _event.eventSource.inputParams){
                                (_event.eventSource.inputParams).forEach((inputParamsItem,idx)=>{
                                    _url = _url.replace('['+inputParamsItem.item+']',encodeURIComponent(inputParamsItem.hiddenValue?inputParamsItem.hiddenValue:inputParamsItem.value));
                                });
                            }
                            EcoUtil.getSysvm().openDialog('',_url,'900','500');
                       }
                    }else if(_event.eventType == 'AJAX'){
                        this.onAjaxEvent(_event);
                    }else if(_event.eventType == 'FORM_SCENE'){ //api 弹窗
                        if(!emitObj.eventModuleReadOnly){ 
                              this.tempEvent = _event;
                              this.onApiEvent(_event);
                        }
                    }else if(_event.eventType == 'VIEW_SCENE'){ //显示
                         if(emitObj.eventModuleReadOnly){ //只读
                             this.onApiViewDetailEvent(_event);
                         }
                    }else if(_event.eventType == 'WF_SCENE'){
                        this.onRelWFEvent(_event);
                    }else if(_event.eventType == 'SEQNUM_VIEW'){
                        this.onSeqNumViewEvent(_event);
                    }
                }
            }
        },

        /*选人*/
        onCustomOrgSelectAction(emitObj){
            let _event = {};
            _event.emitObj = EcoUtil.objDeepCopy(emitObj); //保留抛出来的数据
            let that = this;
            let callBack = function(callObj){
                let _data = {};
                _data.action = 'orgSelectPopupConfirm';
                _data.data = callObj;
                if(_event.emitObj && _event.emitObj.emitStatus){
                    _data.emitStatus = EcoUtil.objDeepCopy(_event.emitObj.emitStatus);
                }
                if(that.getRefComponentByRefName('m'+_event.emitObj.itemId)){
                    that.getRefComponentByRefName('m'+_event.emitObj.itemId).callEvent(_data);
                }
            }

            let _key = EcoUtil.getUID();
            let _keyData = {};
            if(_event.emitObj.initData){
                _keyData.initDataType = _event.emitObj.initData.initDataType;
                _keyData.initDataStr = _event.emitObj.initData.initDataStr;
                _keyData.actionGroup = _event.emitObj.initData.actionGroup;
            }
            _keyData.options =  _event.emitObj.options;

            EcoUtil.getSysvm().setTempStore(_key,_keyData);
            EcoUserPick.searchReceiver(_key,callBack);  
     
        },

        /*上传附件*/
        onFileUploadAction(emitObj){
                if(!emitObj.statusObj && emitObj.emitStatus){
                    emitObj.statusObj = emitObj.emitStatus;
                }
                EcoUtil.getSysvm().onFileUpload(emitObj);
        },

        /*附件上传回写*/
        onFileUploadActionCallBack(emitObj){
                let _data = {};
                _data.action = 'onFileUploadActionCallBack';
                _data.data = emitObj;
                if(emitObj.statusObj){
                    _data.emitStatus = emitObj.statusObj;
                }
                if(emitObj.statusObj.parentItemId){ //grid组件
                     if(this.getRefComponentByRefName('m'+(emitObj.statusObj.parentItemId?emitObj.statusObj.parentItemId:emitObj.statusObj.itemId))){
                        this.getRefComponentByRefName('m'+(emitObj.statusObj.parentItemId?emitObj.statusObj.parentItemId:emitObj.statusObj.itemId)).callEvent(_data);
                    }
                }else{ //普通组件
             
                     this.getRefComponentByRefName('m'+emitObj.statusObj.itemId).callEvent(_data);
                }
        },

        /*附件预览*/
        onFilePreviewAction(obj){
            if(obj.fileType && obj.fileType.toLowerCase()== 'pdf'){
                EcoFile.openFileByPdfJs(obj.fileHeaderId,obj.model);
            }else{
                EcoFile.openFileHeaderByView(obj.fileHeaderId,obj.fileName);
            }
        },

         /*附件下载*/
        onFileDownloadAction(obj){
              EcoFile.openFileHeaderByDownload(obj.fileHeaderId,obj.fileName);
        },

        /*附件全部下载*/
        onFileDownloadAllAction(obj){
             EcoFile.openFileHeadersByDownloadAll(obj.fileIds,obj.expectedName);
        },

         /*附件编辑*/
        onFileEditAction(obj){
            EcoFile.openFileHeaderByEdit(obj.fileHeaderId,obj.fileName);
        },

        /*附件盖章*/
        onFileSignatureAction(obj){
            EcoFile.onFileBySignature(obj.fileHeaderId,obj.fileName,obj.modelInnerId);
        },

        /*相关性事件*/
        onInteractionAction(obj){
            this.getItemInteractionFunc(obj);
        },

        /*根据itemid 获取对于的取值*/
        getItemInputParamsValue(inputParamsItem,action,rowIdx){ 
             let obj = null;
             let _refId = 'm'+inputParamsItem.item;
             if(inputParamsItem && inputParamsItem.parentItem){  //grid组件
                    _refId = 'm'+inputParamsItem.parentItem;
             }
             try{
                 let _ref = this.getRefComponentByRefName(_refId);
                 if(_ref){
                    if(_ref.getItemInputParamsValue){
                        obj = this.getRefComponentByRefName(_refId).getItemInputParamsValue(inputParamsItem.item,action,rowIdx); ;
                    }
                 }
             }catch(e){console.log(e);}
             return obj;
        },

        /*事件回写组件方法 */
        setItemOutputParamsValue(outputParamsItem,value,hiddenValue,fromParentItemId,fromItemId,fromRowIndex,fromFormIndex){ //根据itemid 设置对于的取值
             if(outputParamsItem && outputParamsItem.parentItem){ //如果回写的是grid
                  try{
                      if(this.getRefComponentByRefName('m'+outputParamsItem.parentItem)){
                            this.getRefComponentByRefName('m'+outputParamsItem.parentItem).setItemOutputParamsValue(outputParamsItem.item,value,hiddenValue,fromParentItemId,fromItemId,fromRowIndex,fromFormIndex); ;
                      }
                   }catch(e){console.log(e);}
             }else{
                try{ //回写一般组件
                         if(this.getRefComponentByRefName('m'+outputParamsItem.item)){
                             this.getRefComponentByRefName('m'+outputParamsItem.item).setItemOutputParamsValue(value,hiddenValue,fromItemId);
                         }
                }catch(e){
                    console.log(e);
                }
             }
        },

        setItemOutputParamsAction(outputParamsItem,action,value,fromItemId){ //根据itemid 设置对于的取值
             if(outputParamsItem && outputParamsItem.parentItem){
                  if(this.getRefComponentByRefName('m'+outputParamsItem.parentItem)){
                        try{
                            this.getRefComponentByRefName('m'+outputParamsItem.parentItem).setItemOutputParamsAction(outputParamsItem.item,action); ;
                        }catch(e){console.log(e)}
                  }
             }else{
                    if(this.getRefComponentByRefName('m'+outputParamsItem.item)){
                         try{
                             this.getRefComponentByRefName('m'+outputParamsItem.item).setItemOutputParamsValue(value,null,fromItemId);
                            }catch(e){                  
                                console.log(e);
                            }
                    }
             }
        },

        /*选人弹窗*/
        onOrgUserSelectEvent(_event){
                let _options = {};
                _options.selectType = _event.eventSource.params.selectType;
                if(_event.eventSource.params.extra){
                    try{
                        let _extra = JSON.parse(_event.eventSource.params.extra);
                        if(_options.selectType == '1'  &&  _extra.selectUserByDept == 1){
                              _options.selectType = '0';
                        }
                    }catch(e){

                    }
                }
                _options.selectType =  EcoUserPick.getSelectType( _options.selectType);
                _options.selectNum = _event.eventSource.params.selectNum;
                if(_event.emitObj && _event.emitObj.isRole){
                    _options.isRole = true;
                }
                if(_event.emitObj.initData && (_event.emitObj.initData.maxOrgPathLevel || _event.emitObj.initData.maxOrgPathLevel == 0)){
                    _options.maxOrgPathLevel = _event.emitObj.initData.maxOrgPathLevel;
                }

                let that = this;
                let callBack = function(callObj){
                     let _data = {};
                     _data.action = 'orgSelectPopupConfirm';
                     _data.data = callObj;
                     if(_event.emitObj && _event.emitObj.emitStatus){
                        _data.emitStatus = EcoUtil.objDeepCopy(_event.emitObj.emitStatus);
                     }
                     if(that.getRefComponentByRefName('m'+(_event.emitObj.parentItemId?_event.emitObj.parentItemId:_event.emitObj.itemId ))){
                        that.getRefComponentByRefName('m'+(_event.emitObj.parentItemId?_event.emitObj.parentItemId:_event.emitObj.itemId)).callEvent(_data);
                     }
                }
                
                let _key = EcoUtil.getUID();
                let _keyData = {};
                if(_event.emitObj.initData){
                        _keyData.initDataType = _event.emitObj.initData.initDataType;
                        _keyData.initDataStr = _event.emitObj.initData.initDataStr;
                        _keyData.actionGroup = _event.emitObj.initData.actionGroup;
                        
                        if(_event.emitObj.initData.selectType){
                            _options.selectType = _event.emitObj.initData.selectType;
                        }
                }
              
                _keyData.options = _options;
                EcoUtil.getSysvm().setTempStore(_key,_keyData);
                EcoUserPick.searchReceiver(_key,callBack);               
        },

        /*四则运算*/
        onArithmetic(_event){
            console.log('触发四则运算');
            let re = 0;
            let symbolArr = _event.eventSource.symbol.split(",");
            let _arString = '';
            let _type = '';
            for(let i = 0;i<_event.eventSource.inputParams.length;i++){ //生成四则运算的公式
                let _v = 0;
                if(_event.eventSource.inputParams[i].type == 'DATE'){ //时间四则运算
                     _type = 'DATE';
                     _v = _event.eventSource.inputParams[i].longTime;
                }else{
                     _v  = EcoUtil.parseFloat(_event.eventSource.inputParams[i].hiddenValue?_event.eventSource.inputParams[i].hiddenValue:_event.eventSource.inputParams[i].value);
                }
                if(i!=0){
                    _arString+=symbolArr[i-1];
                }
                _arString += _v;
            }
            
            try{
                if(_type == 'DATE'){
                    re = eval(_arString); //事件算天数
                    re = Math.floor(re/86400000);
                }else{
                    re = eval(_arString); //执行四则运算的公式
                }
            }catch(e){
                console.log(e);
            }
            re = Math.floor(re * decimal)/decimal ;  //保留两位小数
            (_event.eventSource.outputParams).forEach((outputParamsItem,idx)=>{ //将计算出来的数据，回写到outputParams里面
                     let _gridRowIndex = null;
                     let _gridColIndex = null;
                     if(_event.emitObj.emitStatus){
                            _gridRowIndex = _event.emitObj.emitStatus.gridRowIndex;
                            _gridColIndex = _event.emitObj.emitStatus.gridColIndex;
                     }
                     this.setItemOutputParamsValue(outputParamsItem,re,null,_event.emitObj.parentItem,_event.emitObj.itemId,_gridRowIndex,_gridColIndex);             
            })
        },

         /*转大写*/
        onNumZhcn(_event){
            console.log('触发大写事件');
            let _arString = '';
            for(let i = 0;i<_event.eventSource.inputParams.length;i++){ 
                _arString = _event.eventSource.inputParams[i].hiddenValue?_event.eventSource.inputParams[i].hiddenValue:_event.eventSource.inputParams[i].value;
            }
            _arString = EcoUtil.DX(_arString);
            (_event.eventSource.outputParams).forEach((outItem,idx)=>{ //将计算出来的数据，回写到outputParams里面
                     let _gridRowIndex = null;
                     let _gridColIndex = null;
                     if(_event.emitObj.emitStatus){
                            _gridRowIndex = _event.emitObj.emitStatus.gridRowIndex;
                            _gridColIndex = _event.emitObj.emitStatus.gridColIndex;
                     }
                     this.setItemOutputParamsValue(outItem,_arString,null,_event.emitObj.parentItem,_event.emitObj.itemId,_gridRowIndex,_gridColIndex);             
            })
        },

        onGridSum(_event){
            console.log('触发GRID合计事件');
            let _sum = '';
            for(let i = 0;i<_event.eventSource.inputParams.length;i++){ 
                _sum = _event.eventSource.inputParams[i].hiddenValue?_event.eventSource.inputParams[i].hiddenValue:_event.eventSource.inputParams[i].value;
            }
            (_event.eventSource.outputParams).forEach((outItem,idx)=>{ //将计算出来的数据，回写到outputParams里面
                this.setItemOutputParamsAction(outItem,'GRIDSUM',_sum,_event.emitObj.itemId);            
         
            })
        },

        /*ajax 事件*/
        onAjaxEvent(_event){
            console.log('触发ajax事件');
            let _url = _event.eventSource.url;
            let _data = {};
            (_event.eventSource.inputParams).forEach((item)=>{
                if(item.name && item.name !=''){
                    _data[item.name] = item.hiddenValue?item.hiddenValue:item.value;
                }else{
                    _data['param'+item.indx] = item.hiddenValue?item.hiddenValue:item.value;
                }
            })
            let that = this;
            postWFAjaxEvent(_url,_data).then((response=>{
                    let xmldoc = EcoUtil.loadXML(response.data);
                    let intoElements = xmldoc.getElementsByTagName("info");
                    let _valueArray = [];
                    for (let i = 0;i < intoElements.length; i++) {
                         
                         let valueElement = intoElements[i].getElementsByTagName("value");
                         if(valueElement){
                             for(let j = 0;j<valueElement.length;j++){
                                 _valueArray.push(valueElement[j].firstChild.nodeValue);
                             }
                         }
                         let alertElement= intoElements[i].getElementsByTagName("alert");
                         if(alertElement && alertElement.length > 0){
                                EcoMessageBox.alert(alertElement[0].firstChild.nodeValue);
                         }
                    }

                    (_event.eventSource.outputParams).forEach((outItem,idx)=>{ //将计算出来的数据，回写到outputParams里面
                                let _gridRowIndex = null;
                                let _gridColIndex = null;
                                if(_event.emitObj.emitStatus){
                                        _gridRowIndex = _event.emitObj.emitStatus.gridRowIndex;
                                        _gridColIndex = _event.emitObj.emitStatus.gridColIndex;
                                }
                                let _value = null;
                                if(idx < _valueArray.length){
                                    _value = _valueArray[idx];
                                    if(_value == 'nnn'){
                                        _value = '';
                                    }
                                }
                                that.setItemOutputParamsValue(outItem,_value,null,_event.emitObj.parentItem,_event.emitObj.itemId,_gridRowIndex,_gridColIndex);             
                        })
                }))
        },

        /*api 事件*/
        onApiEvent(_event){
                    if(_event.emitObj.clearBtn){ //清空api
                        this.onClearApiEvent(_event);
                        return ;
                    }
                    let _storeObj = {};
                    _storeObj.key = EcoUtil.getUID();
                    _storeObj.data = {};
                    _storeObj.data.operateId = this.operateId;
                    _storeObj.data.event = _event;
                    let _saveDate = {};  
                    _saveDate.operate_id = this.operateId;
                    // _saveDate.item_id = obj.itemId;
                    // 获取表单数据
                    for(let j = 0;j<this.views.length;j++){
                        if(this.viewsItemMap[this.views[j].id]){
                            for(let i = 0;i < this.viewsItemMap[this.views[j].id].length;i++){ //循环表单检查
                                let item  = this.viewsItemMap[this.views[j].id][i];
                                let _ref = this.getRefComponentByRefName('m'+item.itemId);
                                if(_ref){
                                    try{
                                        let _data = null;
                                        if(_ref.getRefValue){
                                            _data = _ref.getRefValue();
                                        }
                                        if(_data){
                                            if(item.compType == 'GRID'){ //grid
                                                _saveDate[item.itemId.toString()] = JSON.stringify(_data);
                                            }else{
                                                _saveDate[item.itemId.toString()] = (_data.hiddenValue && _data.hiddenValue!='')?_data.hiddenValue:_data.value;
                                            }
                                        }
                                    }catch(e){
                                        console.log(e);
                                    }
                                }
                             }
                        }
                    }

                    _saveDate['wf_name'] = this.$refs.wfDetailToolbar.getWFName();
                    _storeObj.data.formData = _saveDate;
                    
                    EcoUtil.getSysvm().setTempStore(_storeObj.key,_storeObj.data);
                    let _url = '/flowform/index.html#/wfApiSelectPage/'+ _storeObj.key;
                    let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                    EcoUtil.getSysvm().openDialog('',_url,1100,_height,'50px');
        },

        /*api 清除事件*/
        onClearApiEvent(_event){
                    let _data = {};
                    _data.ref_id = _event.eventSource.sceneEntity.refId;
                    _data.sc_id = _event.eventSource.sceneEntity.scId;
                    _data.scSelect = _event.eventSource.sceneEntity.scSelect;
                    _data.is_preload = 0;
                    _data.operate_id = this.operateId;;
                    _data.row_ind = 0;
                    if(_event.emitObj.emitStatus){
                        try{
                            _data.row_ind = _storeData.event.emitObj.emitStatus.gridRowIndex+1;
                        }catch(e){
                            _data.row_ind = 0;
                        }
                    }

                    let _baseInfo = {ispage:0,page:1,pageSize:1,sortCol:'create_date desc',schName:null,total:0};
                    getFormApiSceneEvent(_data,_baseInfo,{}).then((response)=>{
                      if(response.data.status <= 99){
                            if(response.data.remap.url_info){ //url显示
                                 
                            }else{
                                let _outputParams = [];
                                let _outputParamsObj = {};
                                (response.data.remap.columns).forEach((item)=>{
                                        if(item.targetItemParent==0){
                                                _outputParams.push({item:item.targetItem,parentItem:item.targetItemParent,name:item.paramName});
                                        }else{
                                            if(_outputParamsObj[String(item.targetItemParent)]){
                                                _outputParamsObj[String(item.targetItemParent)].push({item:item.targetItem,parentItem:item.targetItemParent,name:item.paramName});
                                            }else{
                                                _outputParamsObj[String(item.targetItemParent)] = [];
                                                _outputParamsObj[String(item.targetItemParent)].push({item:item.targetItem,parentItem:item.targetItemParent,name:item.paramName});
                                            }
                                        }
                                })

                                for(let parentItem in _outputParamsObj) {
                                    _outputParams.push({parentItem:parentItem,children:_outputParamsObj[parentItem]});
                                }

                                let _callData = {};
                                _callData.selectObj = {};
                                _callData.selectObj.selItems = [{}];
                                _callData.selectObj.action = 'APIPAGE';
                                _callData.selectObj.emitObj = EcoUtil.objDeepCopy(_event.emitObj);
                                _callData.outputParams = _outputParams;
                                this.apiEventHandle(_callData);
                           }
                          
                      }
                }).catch((error)=>{
                    
                });
        },

        onApiViewDetailEvent(_event){
                    let _storeObj = {};
                    _storeObj.key = EcoUtil.getUID();
                    _storeObj.data = {};
                    _storeObj.data.operateId = this.operateId;
                    _storeObj.data.event = _event;

                    let _saveDate = {};  
                    _saveDate.operate_id = this.operateId;

                    for(let j = 0;j<this.views.length;j++){
                        if(this.viewsItemMap[this.views[j].id]){
                            for(let i = 0;i < this.viewsItemMap[this.views[j].id].length;i++){ //循环表单检查
                                let item  = this.viewsItemMap[this.views[j].id][i];
                                let _ref = this.getRefComponentByRefName('m'+item.itemId);
                                if(_ref){
                                    try{
                                        let _data = null;
                                        if(_ref.getRefValue){
                                            _data = _ref.getRefValue(true);
                                        }
                                        if(_data){
                                            if(item.compType == 'GRID'){ //grid
                                                _saveDate[item.itemId.toString()] = JSON.stringify(_data);
                                            }else{
                                                _saveDate[item.itemId.toString()] = (_data.hiddenValue && _data.hiddenValue!='')?_data.hiddenValue:_data.value;
                                            }
                                        }
                                    }catch(e){
                                        console.log(e);
                                    }
                                }
                            }
                        }
                    }

                    _saveDate['wf_name'] = this.$refs.wfDetailToolbar.getWFName();
                    _storeObj.data.formData = _saveDate;

                    EcoUtil.getSysvm().setTempStore(_storeObj.key,_storeObj.data);

                    let _url = '/flowform/index.html#/wfApiViewDetailPage/'+ _storeObj.key;
                    let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                    EcoUtil.getSysvm().openDialog('',_url,1100,_height,'50px');
        },


        onSeqNumViewEvent(_event){
            let _saveDate = {};  
            _saveDate.operate_id = this.operateId;
            // _saveDate.item_id = obj.itemId;

            for(let j = 0;j<this.views.length;j++){
                if(this.viewsItemMap[this.views[j].id]){
                    for(let i = 0;i < this.viewsItemMap[this.views[j].id].length;i++){ //循环表单检查
         
                        let item  = this.viewsItemMap[this.views[j].id][i];
                        let _ref = this.getRefComponentByRefName('m'+item.itemId);
                        if(_ref){
                            try{
                                let _data = null;
                                if(_ref.getRefValue){
                                    _data = _ref.getRefValue();
                                }
                                if(_data){
                                    if(item.compType == 'GRID'){ //grid
                                         _saveDate[item.itemId.toString()] = JSON.stringify(_data);
                                    } else{
                                        _saveDate[item.itemId.toString()] = (_data.hiddenValue && _data.hiddenValue!='')?_data.hiddenValue:_data.value;
                                    }
                                }
                            }catch(e){
                                console.log(e);
                            }
                        }
                    }
                }
            }

             _saveDate['wf_name'] = this.$refs.wfDetailToolbar.getWFName();
            let that = this;
            getSeqNumViewAjaxEvent(_saveDate,_event.eventSource.seqGroupId).then((response=>{
                    (_event.eventSource.outputParams).forEach((outItem,idx)=>{ //将计算出来的数据，回写到outputParams里面
                                let _gridRowIndex = null;
                                let _gridColIndex = null;
                                if(_event.emitObj.emitStatus){
                                        _gridRowIndex = _event.emitObj.emitStatus.gridRowIndex;
                                        _gridColIndex = _event.emitObj.emitStatus.gridColIndex;
                                }
                                let _value = response.data.remap.seq_no; 
                                that.setItemOutputParamsValue(outItem,_value,null,_event.emitObj.parentItem,_event.emitObj.itemId,_gridRowIndex,_gridColIndex);             
                    })
            }))
        },

        /*流程关联弹窗*/
        onRelWFEvent(_event){
                    let _storeObj = {};
                    _storeObj.key = EcoUtil.getUID();
                    _storeObj.data = {};
                    _storeObj.data.operateId = this.operateId;
                    _storeObj.data.event = _event;

                    EcoUtil.getSysvm().setTempStore(_storeObj.key,_storeObj.data);
                    
                    let _url = '/flowform/index.html?v='+new Date().getTime()+'#/wfRelWFPage/'+ _storeObj.key;
                    let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                    EcoUtil.getSysvm().openDialog('',_url,1125,_height,'50px');
        },

        /*page 弹窗 选择之后的回写*/
        eventHandle(obj){
            let _wfEventObj  =  EcoUtil.objDeepCopy(this.tempEvent);
            let _wfEventSelectObj = EcoUtil.objDeepCopy(obj); //复制选择返回的数据
            //分别处理grid和一般组件的 eventHandle
            if(_wfEventObj.emitObj.parentItemId){ //grid
                    try{
                        this.getRefComponentByRefName('m'+_wfEventObj.parentItemId).eventHandle(_wfEventObj,_wfEventSelectObj);
                    }catch(e){
                             console.log(e);
                    }
             }else{
                try{ //一般的组件
                     (_wfEventObj.eventSource.outputParams).forEach((element)=>{
                            this.getRefComponentByRefName('m'+element.item).callEvent(_wfEventSelectObj,element);
                     })
                }catch(e){                  
                    console.log(e);
                }
             }
             this.tempEvent = {};
        },

        eventHandleOtherItem(data){ //处理eventHandle里面 没有找到的事件
            let _wfEventSelectObj = data.dataObj 
            let _wfEventObj  =  {};
            _wfEventObj.eventSource = {};
            _wfEventObj.eventSource.outputParams = data.outputParams;

            if(_wfEventObj.eventSource.outputParams && _wfEventObj.eventSource.outputParams.length > 0){
                (_wfEventObj.eventSource.outputParams).forEach((element)=>{ //调用其他组件的 itemId
                    if(this.$refs['m'+element.item] && this.$refs['m'+element.item][0]){         
                         try{
                            this.$refs['m'+element.item][0] .eventHandle(_wfEventObj,_wfEventSelectObj);
                         }catch(e){
                            console.log(e);
                         }
                    }
                })
            }
        },

        /*page 弹窗 选择之后的回写*/
        apiEventHandle(obj){
              (obj.outputParams).forEach((element)=>{
                    if(element.parentItem && element.parentItem!="0"){ //grid
                        try{
                            if(element.parentItem != 'null'){
                                    this.getRefComponentByRefName('m'+element.parentItem).apiCallEvent(obj.selectObj,element);
                            }
                        }catch(e){
                            console.log(e);
                        }
                    }else{
                         try{ //一般的组件
                                if(element.item!='0'){
                                    this.getRefComponentByRefName('m'+element.item).callEvent(obj.selectObj,element);
                                }
                         }catch(e){                  
                                console.log(e);
                         }
                    }
              })
              this.tempEvent = {};
        },


         /*page 弹窗 选择之后的回写*/
        apiSelfEventHandle(obj){
              (obj.outputParams).forEach((element)=>{
                  if(element.item && this.dataItemDefMap[element.item]){
                      element.item = this.dataItemDefMap[element.item];
                  }
                  if(element.parentItem && this.dataItemDefMap[element.parentItem]){
                      element.parentItem = this.dataItemDefMap[element.parentItem];
                  }
                  if(element && element.children && element.children.length > 0){
                        (element.children).forEach((childItem)=>{
                            if(childItem.item && this.dataItemDefMap[childItem.item]){
                                childItem.item = this.dataItemDefMap[childItem.item];
                            }
                        })
                  }
              })

              obj.selectObj.emitObj = this.tempEvent.emitObj;
              this.apiEventHandle(obj);
        },


        /*page 弹窗 选择之后的回写*/
        relWFEventHandle(obj){
              if(obj.selectObj.selItems){
                  for(let _itemId in obj.selectObj.selItems){
                        try{ //一般的组件
                                this.getRefComponentByRefName('m'+_itemId).callRelWFEvent(obj.selectObj.selItems[_itemId],obj.selectObj.emitObj);
                         }catch(e){                  
                                console.log(e);
                         }
                  }
              }
              this.tempEvent = {};
        },
        
        /*grid 导入弹窗 选择之后的回写*/
        wfGridExlImportCallBack(obj){
            try{ 
                this.getRefComponentByRefName('m'+obj.itemId).callGridExlImpEvent(obj.selectObj.selItems,obj.selectObj.emitObj);
            }catch(e){                  
                console.log(e);
            }
        },

        /*获取ref组件*/
        getRefComponentByRefName(refName){
             if(this.$refs[refName]){
                 if(this.$refs[refName][0]){
                     return this.$refs[refName][0];
                 }else{
                     return this.$refs[refName];
                 }
             }
             return null;
         },


        saveFormConfirm(action){
            if(action && action=="submit"){
                let that  = this;
                let confirmYesFunc = function(){
                    that.saveForm(action);
                }
                let options = {
                        type: 'warning',
                        lockScroll:false
                }
                EcoMessageBox.confirm('确认保存并提交？','提示',options,confirmYesFunc);
            }
        },
      
        saveForm(action){
              if(sysEnv == 1){
                    EcoUtil.getSysvm().showLoadingDiv('正在处理... 请稍等');
              }
              let _saveDate = {};  
              _saveDate.root_opid = this.operateId;
              
              let _array = [];
              let _canSave = true;
              let _msg = '';
              let _errItemObj = null;
              let _errTabView = null;


              for(let j = 0;j<this.views.length;j++){
                    if(!_canSave){
                        break;
                    }
                    if(this.viewsItemMap[this.views[j].id]){
                        
                        for(let i = 0;i < this.viewsItemMap[this.views[j].id].length;i++){ //循环表单检查
                            let item = this.viewsItemMap[this.views[j].id][i];
                            let _ref = this.getRefComponentByRefName('m'+item.itemId);
                            if(_ref){
                                try{
                                    if(action && action=="submit"){ //如是是完成提交，检查是否必填等基本信息
                                        let _saveStatus = null;
                                        if(_ref.getRefCheck){
                                            _saveStatus = _ref.getRefCheck();
                                        }
                                        if(_saveStatus && _saveStatus.status !=0){ //没通过检查
                                            this.hideLoadingDiv();
                                            _msg = _saveStatus.msg;
                                            _canSave = false;
                                            _errItemObj = _saveStatus;
                                            _errTabView = this.views[j].id;
                                            break;
                                        }
                                    }
                                    let _data = null;
                                    if(_ref.getRefValue){
                                        _data = _ref.getRefValue();
                                    }
                                    if(_data){
                                        if(item.compType == 'GRID'){ //grid
                                            _saveDate[item.itemId.toString()] = JSON.stringify(_data);
                                        }else{
                                            if(_saveDate[item.itemId.toString()]){

                                            }else{
                                                _saveDate[item.itemId.toString()] = (_data.hiddenValue && _data.hiddenValue!='')?_data.hiddenValue:_data.value;
                                            }
                                        }
                                        if(sysEnv == 0){ //测试
                                            _array.push({itemId:item.itemId,itemName:item.itemName,data:_data});
                                        }
                                    }
                                }catch(e){
                                    console.log(e);
                                }
                            }
                        }
                    }
              }
             

              if(!_canSave){    
                  EcoMessageBox.alert(_msg,'',{
                      callback: action => {
                          if(_errItemObj.itemId){
                                try{ //一般组件里面的值
                                    let _checkRef = this.getRefComponentByRefName('m'+_errItemObj.itemId);
                                    if(_checkRef){
                                        if(_checkRef.doRefCheck){
                                            this.viewTabActive = _errTabView;
                                            _checkRef.doRefCheck(_errItemObj);
                                        }
                                    }
                                }catch(e){console.log(e);}
                          }
                      }
                  });
                  return ;
              }
            
              for(let i = 0;i<this.formApprovalItems.length;i++){ //循环审批意见
                    let item  = this.formApprovalItems[i];
                    let _ref = this.getRefComponentByRefName('m'+item.itemId);
                    if(_ref){
                            try{
                                if(action && action=="submit"){ //如是是完成提交，检查是否必填等基本信息
                                    let _saveStatus = null;
                                    if(_ref.getRefCheck){
                                        _saveStatus = _ref.getRefCheck();
                                    }
                                    if(_saveStatus && _saveStatus.status !=0){ //没通过检查
                                        this.hideLoadingDiv();
                                        _msg = _saveStatus.msg;
                                        _canSave = false;
                                        _errItemObj = _saveStatus;
                                        break;
                                    }
                                }
                                let _data = null;
                                
                                if(_ref.getRefValue){
                                    _data = _ref.getRefValue();
                                }

                                if(_data){
                                    if(_data.a_d_flag || _data.a_d_flag == 0){
                                            _saveDate['a_d_flag'] = _data.a_d_flag;
                                            _saveDate['a_d_assignee'] = _data.a_d_assignee;
                                            if(sysEnv == 0){ //测试
                                                _array.push({itemId:'EcoHandle',itemName:'处理方式',data:_data});
                                            }
                                    }else{
                                        _saveDate[item.itemId.toString()] = (_data.hiddenValue && _data.hiddenValue!='')?_data.hiddenValue:_data.value;
                                        if(_saveDate[item.itemId.toString()].indexOf('ecoHandle')>-1){
                                            delete _saveDate[item.itemId.toString()];
                                        }else{
                                            if(sysEnv == 0){ //测试
                                                _array.push({itemId:item.itemId,itemName:item.itemName,data:_data});
                                            }
                                        }
                                    }
                                }
                            }catch(e){}
                        }
               };

                if(!_canSave){
                     EcoMessageBox.alert(_msg,'',{
                        callback: action => {
                            if(_errItemObj.itemId){
                                try{ //环节里面的值
                                    let _checkRef = this.getRefComponentByRefName('m'+_errItemObj.itemId);
                                    if(_checkRef){
                                        if(_checkRef.doRefCheck){
                                             _checkRef.doRefCheck(_errItemObj);
                                        }
                                    }
                                }catch(e){console.log(e);}
                            }
                        }
                    });
                    return ;
                }
            
                /*处理组件*/
                // let _handleData = this.getRefComponentByRefName('mEcoHandle').getRefValue();
                // _saveDate['a_d_flag'] = _handleData.a_d_flag;
                // _saveDate['a_d_assignee'] = _handleData.a_d_assignee;
                _saveDate['wf_name'] = this.$refs.wfDetailToolbar.getWFName();

                if(_canSave){
                    if(action && action == 'submit'){
                            if(this.formWf.commitConfirm == 1){
                                let that  = this;
                                that.hideLoadingDiv();
                                let confirmYesFunc = function(){
                                if(sysEnv == 1){
                                    EcoUtil.getSysvm().showLoadingDiv('正在处理... 请稍等');
                                }
                                    that.saveFormAjax(_saveDate,action);
                                }

                                let options = {
                                        type: 'warning',
                                        lockScroll:false
                                }
                                EcoMessageBox.confirm('确认保存并提交？','提示',options,confirmYesFunc);
                            }else{
                                this.saveFormAjax(_saveDate,action);
                            }
                    }else{
                          this.saveFormAjax(_saveDate,action);
                    }
                 
               }
         },
         
        saveFormAjax(_saveDate,action){ 
                let _that = this;
                wfSaveFormAjax(_saveDate,action).then((response)=>{
                        if(response.data.status == 0){
                            if(action && action == 'submit'){
                                 _that.submitTaskFunc();
                            }else{
                                 _that.hideLoadingDiv(); 
                                 _that.$message({
                                        message: '表单数据保存完成(尚未提交)',
                                        type: 'success'
                                 });
                            }
                        }else if(response.data.status == 301){
                            let _msg = '';
                            if(response.data.remap && response.data.remap.inspect_form){
                                 (response.data.remap.inspect_form).forEach((element,idx)=>{
                                        if(idx!=0){
                                            _msg+="<br>";
                                        }
                                        _msg+='<div>'+element+'</div>';
                                 })
                            }
                            _that.hideLoadingDiv(); 
                            EcoMessageBox.alert(_msg,'',{
                                dangerouslyUseHTMLString: true
                            });
                       }else{
                            _that.hideLoadingDiv(); 
                            EcoMessageBox.alert(response.data.msg);
                        }
                    })
        },

        handleTaskBtn(){
            this.handleTaskDialogFlag = true;
        },

        submitTaskBtn(action){
            this.saveForm('submit');
        },

         submitTaskFunc(){
             let _that = this;
             let _saveDate = {};  
             _saveDate.root_opid = this.operateId;
             
             wfSubmitTaskAjax(_saveDate).then((response)=>{
                    if(response.data.status >99){
                        _that.hideLoadingDiv();
                        EcoMessageBox.alert(response.data.msg);
                    }else{
                        
                        _that.$message({
                            message: '提交完成',
                            type: 'success'
                        });

                        if(sysEnv == 1 &&  _that.formWf.commitForward == 'PORTAL'){ //提交完成，返回到首页
                            _that.hideLoadingDiv();

                            let tabObj = {};
                            tabObj.reload = true;
                            tabObj.r_func = '{menuTarget:"VUE", tabKey:"mainPage", routerName:"mainPage", routerParams:"{}"}';
                            EcoUtil.getSysvm().doTab(tabObj);

                            let _closeObj = {};
                            _closeObj.clearIframe = true;
                            _closeObj.tabClick = true;
                            EcoUtil.getSysvm().closeFullScreen(_closeObj);

                        }else{
                            
                            _that.operateId = response.data.operate_id;
                            _that.doWFDataInit();
                            _that.getWFFormInit();
                            _that.hideLoadingDiv();

                        }
                        
                    }
             })
         },

         hideLoadingDiv(){
              if(sysEnv == 1){
                EcoUtil.getSysvm().hideLoadingDiv(); 
              }
         },

         /*兼容老的 获取组件的值*/
         getEleById(targetElementId){
                let _valueObj = {};
                try{ //一般组件里面的值
                    let _ref = this.getRefComponentByRefName('m'+targetElementId);
                    if(_ref){
                         if(_ref.getItemInputParamsValue){
                              _valueObj = _ref.getItemInputParamsValue();
                         }
                    }
                }catch(e){console.log(e);}
                return _valueObj;       
         },

         cancelWFCallBack(){
                this.doWFDataInit();
                this.getWFFormInit();
         },
         
         /*获取组件的相关性*/
         getItemInteractionFunc(obj){  
              let _saveDate = {};  
              _saveDate.operate_id = this.operateId;
              _saveDate.item_id = obj.itemId;
              try{
                  if(obj.emitStatus){
                        _saveDate.row_ind = (obj.emitStatus.gridRowIndex+1) || 0;
                  }
              }catch(e){}
                

                for(let j = 0;j<this.views.length;j++){
                    if(this.viewsItemMap[this.views[j].id]){
                        for(let i = 0;i < this.viewsItemMap[this.views[j].id].length;i++){ //循环表单检查
                            let item  = this.viewsItemMap[this.views[j].id][i];
                            let _ref = this.getRefComponentByRefName('m'+item.itemId);
                            if(_ref){
                                try{
                                    let _data = null;
                                    if(_ref.getRefValue){
                                        _data = _ref.getRefValue();
                                    }
                                    if(_data){
                                        if(item.compType == 'GRID'){ //grid
                                            _saveDate[item.itemId.toString()] = JSON.stringify(_data);
                                        }else{
                                            _saveDate[item.itemId.toString()] = (_data.hiddenValue && _data.hiddenValue!='')?_data.hiddenValue:_data.value;
                                        }
                                    }
                                }catch(e){
                                    console.log(e);
                                }
                            }
                        }
                    }
                }
                for(let i = 0;i<this.formApprovalItems.length;i++){ //循环审批意见
                        let item  = this.formApprovalItems[i];
                        let _ref = this.getRefComponentByRefName('m'+item.itemId);
                        if(_ref){
                                try{
                                    let _data = null;
                                    if(_ref.getRefValue){
                                        _data = _ref.getRefValue();
                                    }
                                    if(_data){
                                        if(_data.a_d_flag || _data.a_d_flag == 0){
                                                _saveDate['a_d_flag'] = _data.a_d_flag;
                                                _saveDate['a_d_assignee'] = _data.a_d_assignee;
                                        }else{
                                            _saveDate[item.itemId.toString()] = (_data.hiddenValue && _data.hiddenValue!='')?_data.hiddenValue:_data.value;
                                            if(_saveDate[item.itemId.toString()].indexOf('ecoHandle')>-1){
                                                delete _saveDate[item.itemId.toString()];
                                            }
                                        }
                                    }
                                }catch(e){}
                            }
                };
                
                _saveDate['wf_name'] = this.$refs.wfDetailToolbar.getWFName();
                obj.eventUUID =  EcoUtil.getUID();
                this.interactionEventList.push(obj.eventUUID);
                getItemInteractionAjax(_saveDate).then((response)=>{
                    if(response.data.status <=99){
                        // let _event = response.data.remap.events ;
                        // this.setItemInteractionFunc(_event,obj.emitStatus);
                        let _tempObj = {};
                        _tempObj.event = response.data.remap.events;
                        _tempObj.emitStatus = obj.emitStatus;
                        this.interactionEventMap[obj.eventUUID]  = EcoUtil.objDeepCopy(_tempObj);
                        this.doItemInteractionFinish();
                    }
                });
         },

         doItemInteractionFinish(){
             if(this.interactionEventList && this.interactionEventList.length > 0){
                 let _tempObj = this.interactionEventMap[this.interactionEventList[0]];
                
                 if(_tempObj){ //如果第一个事件已经返回
                        let _tempObj1 = EcoUtil.objDeepCopy(_tempObj)
                        this.setItemInteractionFunc(_tempObj1.event,_tempObj1.emitStatus);
                        delete this.interactionEventMap[this.interactionEventList[0]];
                        this.interactionEventList.splice(0,1);
                        this.doItemInteractionFinish();
                 }
             }
         },

         /*设置相关性*/
         setItemInteractionFunc(event,emitStatus){
                if(event!=null){
                    (event).forEach((item)=>{
                        this.setItemInteraction(item,emitStatus);
                    })
                }
         },
        
         /*设置组件的相关性*/
         setItemInteraction(event,emitStatus){ //根据itemid 设置对于的取值
             if(event && event.eventSource &&  ( event.eventSource.parentId !=null && event.eventSource.parentId !='0' )){ //如果回写的是grid
                  try{
                      if(this.getRefComponentByRefName('m'+event.eventSource.parentId)){
                            this.getRefComponentByRefName('m'+event.eventSource.parentId).setItemInteraction(event,emitStatus) ;
                      }
                   }catch(e){console.log(e);}
             }else{
                try{ //回写一般组件
                         if(this.dataApprovalItem[String(event.eventSource.itemId)]){
                            if(this.getRefComponentByRefName('m#'+ event.eventSource.itemId)){
                                    this.getRefComponentByRefName('m#'+ event.eventSource.itemId).setItemInteraction(event,emitStatus);
                            }
                         }else{
                            if(this.getRefComponentByRefName('m'+ event.eventSource.itemId)){
                                    this.getRefComponentByRefName('m'+ event.eventSource.itemId).setItemInteraction(event,emitStatus);
                            }
                         }
                }catch(e){
                    console.log(e);
                }
             }
        },

        //点击批注
        dealForm(){
            this.$refs['wfDetailToolbar'].getPrintSetList(2,this.uKeyBaseInfo);
        },

        //点击签章
        sealForm(){
            this.$refs['wfDetailToolbar'].getPrintSetList(1,this.uKeyBaseInfo);
        },

        //获取ukey 基本信息
        getUKeyBaseInfoFunc(){
            getUKeyBaseInfo().then((response)=>{
                 if(response.data && response.data.success){
                        this.uKeyBaseInfo.ukeySealDefaultSavePath = response.data.queryObj.ukeySealDefaultSavePath;
                        this.uKeyBaseInfo.ukeySealServiceHost = response.data.queryObj.ukeySealServiceHost;
                        this.uKeyBaseInfo.uKeyReady = true;
                 }
            }).catch((e)=>{
                console.log(e);
            })
        },

        addWindowUKeyAddListen(){
            this.getUKeyBaseInfoFunc();
            let that = this;
            window.addEventListener('message',function(e){
                    that.UploadFileToServer();
                }
            )
        },

        //上传本地文档到ukey 服务器
        UploadFileToServer(){
                try{
                    if(window.uKeyWindow){
                         window.uKeyWindow.close();
                    }
                }catch(e){
                    console.log(e);
                }

                let _userStore = EcoUtil.getSysvm().getTempStore('userStore');
                let _saveData = {};
                _saveData.serverName = "{0DADE507-64D6-4306-956A-2ED144FF0ED1}";
                _saveData.funcName = "UploadFileToServer";
                
                let _param = {};
                _param.serverUrl = window.location.origin+"/wh/servlet/sealFileUpload";
                _param.filePath = this.uKeyBaseInfo.ukeySealDefaultSavePath;
                _param.fileForm = '1';
                _param.extraParam = this.formWf.wfId+"_"+this.printTemplateId+"_"+_userStore.user;
                _saveData.param = JSON.stringify(_param);

                updateFileToServerUKey(_saveData,this.uKeyBaseInfo.ukeySealServiceHost).then((response)=>{
                    console.log(response.data);
                }).catch((e)=>{
                    console.log(e);
                })
        },

        toolBarEmitEvent(obj){
            if(obj.action == 'printTempIdEmit'){
                this.printTemplateId = obj.id;
            }
        },

        //ukey 多个模版选择其中一个的时候，回写
        selectUkeyPrintTemplate(obj){
            this.printTemplateId = obj.printTemplateId;
            if(obj.flag == 1){/*签章*/
                EcoFile.openFileByUkeySeal(obj.filder_header_id,obj.model_id,this.uKeyBaseInfo);
            }else if(obj.flag == 2){/*批注*/
                EcoFile.openFileByUkeyDeal(obj.filder_header_id,obj.model_id,this.uKeyBaseInfo);
            }
        },

        onResize(){
            document.getElementById('ecoSaveDiv').style.paddingRight = '1px';
            setTimeout(function(){
                    document.getElementById('ecoSaveDiv').style.paddingRight = '0px';
            },300)
        },


        /*镜像*/
        onMirrorEmitAction(emitObj){
            let _refs = this.$refs['m'+(emitObj.parentItemId?emitObj.parentItemId:emitObj.itemId)];
            if(_refs){
                for(let i = 0;i<_refs.length;i++){
                    if(_refs[i].mItem && emitObj.mirrorViewItem[String(_refs[i].mItem.viewId) ]){
                        _refs[i].callMirror(emitObj);
                    }
                }
            }
        }
      

  },
  watch: {
      
  }
}
</script>
<style scoped>



.flowFormVue {
  background-color: #f5f5f5;
}

.flowFormVue .flowForm{
    margin:auto;
    margin-top:10px;
    padding: 20px 0px 40px 0px;
    position: relative;
    background-color:#fff;
}

.flowFormVue .flowFormRow{
    background-color:#fff;
    z-index: 99;
}

.flowFormVue .flowFormCol{
    background-color: #fff;
    z-index: 99;
}



.flowFormVue .flowForm .formItemContent{
    background-color:#fff;
    padding:10px 20px;
}

.flowFormVue .flowForm .flowFormDesc{
    margin:10px 0px;
    font-size: 12px;
    font-family: 'microsoft yahei,tahoma,sans-serif;'
}

.flowFormVue .approvalForm{
    background: #fff;
    margin-top:0px;
    /* padding:10px 0px 80px 0px;; */
}

.flowFormVue .approvalFormDialog{
    border: 5px solid rgb(64, 158, 255);
    padding:0px 10px;
}

.flowFormVue .approvalDivDescDialog{
    text-align: center;
    margin-top:5px;
    font-size: 22px;
    font-weight: bold;
    font-family: cursive;
}

.flowFormVue .ecoSaveDiv{
    position:fixed;
    bottom:0px;
    padding:20px 0px;
    background-color: #fff;
    margin:auto;
    text-align: center;
    box-shadow:0 2px 12px 3px rgba(0,0,0,.1);
    z-index: 2900;
}



.flowFormVue .sealDiv{
    position: absolute;
    width:70px;
    height:70px;
}

.ecoFormStyleSelect{
    position:absolute;
    right:50px;
    top:100px;
    background-color:#fff;
    padding:10px;
    width:70px;
}

.handleLink{
    border:1px solid #dcdfe6;
     margin-top:50px;
}

.handleLink .refWFTitle{
   
    padding: 8px 10px;
    font-size: 14px;
    color:rgb(103, 106, 108);
    background-color: rgb(250, 250, 250);
    border-bottom: 1px solid #dcdfe6;
}

.flowFormVue .approvalDivDesc{
    margin-bottom:10px;
    color:rgb(103, 106, 108);
}


.flowFormVue .borderDiv{
    border-bottom: 1px solid #dcdfe6;
}
</style>
<style>
.flowDetailVue .formContent1 .el-tabs__header{
    display:none
}

.flowDetailVue .el-tabs__nav-wrap::after{
    background-color: unset;
}

.flowDetailVue .el-tabs__header{
    padding:0px 10px 10px 0px;
    margin:0px;
}
</style>
