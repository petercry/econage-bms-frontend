<template>
    <div class="formContentVue flowFormVue designTable">
        <div class="designTopModule">
            <flowFormStep :title="formModel.name" :step="0" @close="closeDialog"   ref="flowFormStep" ></flowFormStep>
        </div>
        <div class="designContent">
                <div class="flowForm" v-bind:style="{width:formWidth+'px'}" v-bind:class="['formContent'+views.length]">  


                                <el-tabs v-model="viewTabActive"  >
                                    <el-tab-pane 
                                        :label="formItemConfigObj[viewItem.id]?formItemConfigObj[viewItem.id].displayName:(viewItem.displayName?viewItem.displayName:'页签')" 
                                        :name="viewItem.id"
                                        v-for="(viewItem,viewIdx) in views" 
                                        :key="viewItem.id"   >

                                            <component 
                                                v-if="formItemConfigObj[viewItem.id]?(formItemConfigObj[viewItem.id].showTitle ):(viewItem. showTitle === 1)"
                                                :is="'designForm'" 
                                                :mItem="formModel"
                                                :mConfig="formItemConfigObj[formKey]"
                                                id="designComponentForm"
                                                ref="designComponentForm"
                                                v-bind:class="{active:formKey == activeUuid}"
                                            ></component>
                                            
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
                                           

                                    </el-tab-pane>
                                </el-tabs>
           </div>
        </div>

        <div class="contentSaveLoading" v-show="saveConfig.loading">
            <div class="content">
                {{saveConfig.msg}}
            </div>
        </div>

    </div>
</template>
<script>



import {getformModelUpdateApplyAjax,getformModelReaderAjax} from'../../../service/service'
import {defaultFormWidth} from '../../../config/setting.js'
import axios from 'axios'
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
          moduleGroup:[],
          rowArray:[],
          activeUuid:'',
          drag: false,
          formItemConfigObj:{},
          saveConfig:{
              loading:false,
              msg:'',
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
        /*初始化store 中的数据*/
        this.INIT_WF_FORM_DESIGN_CONFIG();
        /*申请编辑表单*/
        this.getFormModelUpdateApplyFunc(); 
    },
    methods: {   
        ...mapMutations([
            'INIT_WF_FORM_DESIGN_CONFIG',
            'DELETE_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG',
        ]),
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
                .then(axios.spread(function (res1, res2) {
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
                        }
                    }else{
                        that.$message({showClose:true,message:res1.data.msgDesc,type:'error',duration:2000,customClass:'design-from-el-message'});
                    }
                    /*初始化布局方法*/
                    that.drawLayout(); 
                    /*默认跳转到表单编辑页面*/
                  
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
             for(let key in this.viewsItemMap){
                
                if(this.viewsItemMap[key] && this.viewsItemMap[key].length > 0){
                    let viewsRowArray = [];
                    let colArray = [];
                    (this.viewsItemMap[key]).forEach((item)=>{
                            let _item = EcoUtil.objDeepCopy(item);
                            _item.designModelName = this.getDesignModelName(_item.modelType);
                            _item.uuid = EcoUtil.getUID();
                            _item.action = 'update';
                            try{
                                _item.KVMap =  this.formKVMap[_item.kvName];
                            }catch(e){}
                            
                            try{
                                 _item.formGrid = [];
                                try{
                                    if(this.formGrids[String(_item.itemId)]){
                                        _item.formGrid =  this.formGrids[String(_item.itemId)];   
                                    }
                                }catch(e){
                                    console.log(e);
                                }
                        
                                if(_item.formGrid && _item.formGrid.length>0){
                                    (_item.formGrid).forEach((gridColItem)=>{
                                        gridColItem.KVMap =  this.formKVMap[gridColItem.kvName];
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
       
  }
}

</script>
<style scoped>


.formContentVue{
    background-color: #fafafa;
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
    left:0px;
    top:65px;
    bottom:0px;
    right:0px;
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

.flowFormVue .contentSaveLoading{
    position:fixed;
    left:0;
    bottom:0;
}

.flowFormVue .contentSaveLoading .content{
    padding:20px;
    font-size: 12px;
}


</style>

<style>


.formContentVue .formContent1 .el-tabs__header{
    display:none
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