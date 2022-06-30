<template>
    <div class="buttonSetting">
       <div v-loading="loading">
         
              <div v-for="(relateItem,index) in relateItems" :key="index">
              
                <div class="relateOption" style="border-top:none;">     
                      <p style="line-height: 40px;color: #262626;">点击触发以下操作</p>
                    <div>
                        <p class="header"><span style="width:30%;">目标元素</span><span style="width:16%;">改变属性</span><span style="width:52%;">属性值</span></p>
                    </div>
                    <div class="fromItem" v-for="(fromItem,index) in relateItem.targetList" :key="index">
                        <div>
                            <div class="con" style="width:30%;display:inline-block;text-align:center">
                             
                              <el-cascader
                                size="small" 
                                style="min-width: 120px;" 
                                v-model="fromItem.rParent_temp"
                                :options="formModelItem"
                                @change="handleLeftChange(index,fromItem)"
                                :ref="'modelLeftOptions'+index"
                                :props="{disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"
                                > 
                                
                                <template slot-scope="{ node, data }">
                                <span>{{ data.optionName }}</span>
                                <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                            </div>
                            <div class="con" style="width:16%;display:inline-block;text-align:center">
                              <el-select style="width: 80px" v-model="fromItem.attrId" @change="attrChange($event,fromItem)">
                                  <el-option
                                      :key="index"
                                      v-for="(item,index) in changeAttrOptions"
                                      :label="item.name"
                                      :value="item.value">
                                  </el-option>
                              </el-select>
                            </div>
                            <div class="con" style="width:52%;display:inline-block;text-align:left">
                                <div style="display:inline-block" v-if="!fromItem.changeFormItem && fromItem.ifFuZhi">
                                    <el-input size="small" v-if="needInput(fromItem)" type="text" style="width: 177px;" v-model="fromItem.val"></el-input>
                                    <el-date-picker size="small" v-if="needDate(fromItem)" style="width: 177px;" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" v-model="fromItem.val"></el-date-picker>
                                    <el-input-number size="small" v-if="needNumber(fromItem)" style="width: 177px;" v-model="fromItem.val" controls-position="right" ></el-input-number>
                                    <el-input-number size="small" v-if="needMinNumber(fromItem)" style="width: 100px;" v-model="fromItem.val" :max="1.0" :min=0 controls-position="right" ></el-input-number>
                                    <el-select v-if=" fromItem.kvName && kvMap.hasOwnProperty(fromItem.kvName) && kvMap[fromItem.kvName].length>0" size="small" v-show="needSelect(fromItem)" style="width: 177px;" v-model="fromItem.val">
                                        <el-option
                                        :key="index"
                                        v-for="(item,index) in kvMap[fromItem.kvName]"
                                        :label="item.text"
                                        :value="item.text">
                                        </el-option>
                                    </el-select>
                                    <el-select  v-if=" fromItem.kvName  && kvMap.hasOwnProperty(fromItem.kvName)  && kvMap[fromItem.kvName].length>0"  size="small" @change="MultSelect($event,fromItem)" v-show="needMultSelect(fromItem)" :multiple="true" style="width: 177px;" v-model="fromItem.r_item_temp">
                                        <el-option
                                        :key="index"
                                        v-for="(item,index) in kvMap[fromItem.kvName]"
                                        :label="item.text"
                                        :value="item.text">
                                        </el-option>
                                    </el-select>
                                    <tag-select v-if="needSelectPerson(fromItem)" style="width: 177px;"  :initDataStr="fromItem.val"  :initOptions="{selectType:fromItem.modelType == 'ORGSLT' ? 'Dept':'User'}"  @callBack="tagSelectCB($event,fromItem)" ></tag-select>
                                </div>
                                <el-cascader
                                size="small" 
                                style="width:177px;"
                                v-model="fromItem.mParent_temp"
                                :options="modelOption"
                                @change="handleRightChange(index,fromItem)"
                                :ref="'modelRightOptions'+index"
                                :props="{disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"
                                v-show="fromItem.changeFormItem && fromItem.ifFuZhi"
                                > 
                                
                                <template slot-scope="{ node, data }">
                                <span>{{ data.optionName }}</span>
                                <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                                <el-select v-show="fromItem.showRightTaskItems && fromItem.ifFuZhi" @change="task_right_change($event,fromItem)" size="small" style="width: 110px;" v-model="fromItem.rightTaskValue">
                                    <el-option
                                    :key="index"
                                    v-for="(item,index) in fromItem.R_TASK_ITEMS"
                                    :label="item.optionName"
                                    :value="index">
                                    </el-option>
                                </el-select>
                                <el-select v-show="!fromItem.ifFuZhi" size="small" style="width: 110px;" v-model="fromItem.val">
                                    <el-option
                                    :key="index"
                                    v-for="(item,index) in apprOption"
                                    :label="item.name"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                 <el-input class="pointerCalss" type="text" style="width: 110px;" readonly v-model="fromItem.mParent" @click.native="selectConnector(5,fromItem)" v-if="fromItem.showRightApiInput ">

                                </el-input>
                                <div class="qiehuan" v-if="fromItem.ifFuZhi" @click="changeFormItem(fromItem)">
                                    <i class="iconfont icon iconqiehuan"></i>
                                </div>
                                <div class="qiehuan" @click="deleteFormItem(index,relateItem)" style="color:rgb(245, 108, 108)">
                                    <i class="iconfont icon iconshanchudelete30"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn_line"><el-button @click="addFormItem(relateItem)" type="text"><i class="iconfont icon iconicon-test"></i> 添加目标元素</el-button></div>
                </div>
              </div>
          </div>
         
          <div class="btn">
                <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
                <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
          </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import opCheck from './commonModelOption.vue'
import {getButtoInteraction,saveButtonInteraction} from '../../service/service.js'
import tagSelect from '../direction/module/tagSelect.vue'
import {EcoUtil} from '@/components/util/main.js'
export default{
  data(){
    return {
       relateItems:[{targetList:[],logicSet:[]}],
       flowOperateId:"",
       loading:true,
       modelOption:[],
       kvMap:{},
       formModelItem:[],
       changeAttrOptions:[
         {
             name:"可见",
             value:1
         },
         {
             name:"必填",
             value:2
         },
         {
             name:"只读",
             value:3
         },
         {
             name:"赋值",
             value:4
         },
       ],
       apprOption:[
         {
             name:"是",
             value:'1'
         },
         {
             name:"否",
             value:'0'
         }
       ],
       needIngItem:{},//当前需要回写的项
    }
  },
  components: {
   ecoLoading,
    opCheck,
    tagSelect
  },
  created(){
      this.flowOperateId = this.$route.params.operateId;
       window.relateSetvm = this;
  },
  beforeDestroy() {
     
  },
  mounted(){
      this.getButtoInteraction();
      this.bindAction();
  },
  computed:{

  },
  methods: {
      bindAction(){
        let callBackDialogFunc = function(obj){
            console.log('buttonSetting 回写');

            if(obj && obj.action == 'selectConnector' ){
                console.log( window.relateSetvm);
                if(obj.flag == 3){//左边选择
 
                }else if(obj.flag == 5){//右边选择
                    window.relateSetvm.needIngItem.mParent = obj.data.paramName;
                    window.relateSetvm.needIngItem.dataId = obj.data.paramId?obj.data.paramId:obj.data.paramDataId?obj.data.paramDataId:"";
                }
            }
            return;
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'buttonSetting');
        console.log('relate');
        console.log(EcoUtil.callBackFuncObj);
      },
      addRelateItem(){
            this.relateItems.push({targetList:[],logicSet:[]});
      },
      deleteRelateItem(index){
           this.relateItems.splice(index,1);
      },
      getButtoInteraction(){
        this.loading = true;
        getButtoInteraction(this.flowOperateId).then((response) => {
              this.loading = false;
              if(response.data.status <100){
                  let remap = response.data.remap;
                  this.relateItems = remap.lg_list;
                  if(this.relateItems && this.relateItems.length == 0){
                      this.relateItems = [{targetList:[],logicSet:[]}];
                  }
                  this.modelOption = remap.model_options;
                  this.kvMap = remap.kv_map;
                  this.formModelItem = remap.form_item;
                  this.transFormRelate();
              }
          }).catch((error) => {
              console.log(error)
              this.loading = false;
          });
      },
      transFormRelate(){
     
           this.relateItems.forEach((item,index1) => {
                item.targetList.forEach((single,index2) => {
                    try{
                        this.$set(single,'rParent_temp',single.iParent.split(','));
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                let model = 'modelLeftOptions'+index2;
                                console.log(this.$refs[model][0].getCheckedNodes()[0])
                                let l_data = this.$refs[model][0].getCheckedNodes()[0].data;
                                this.$set(single,'modelType',l_data.modelType);
                                if(l_data.hasOwnProperty("kvName")){
                                    this.$set(single,'kvName',l_data.kvName);
                                }
                                if(single.modelType == "CHECKBOX" ){
                                    this.$set(single,'r_item_temp',single.val.split('####')); 
                                }
                        })
                        if(single.attrId == 4){
                            this.$set(single,'ifFuZhi',true);
                        }else{
                            this.$set(single,'ifFuZhi',false);
                        }
                        if(single.mdId && single.dataId){
                            if(single.mdId == "3"){
                                this.$set(single,'mParent_temp',single.mdId.split(','));
                                this.$set(single,'showRightApiInput',true);
                            }else{
                                this.$set(single,'mParent_temp',single.mParent.split(','));
                            }
                            this.$set(single,'changeFormItem',true);
                            if(single.dataId != single.mParent_temp[single.mParent_temp.length - 1]){
                                this.$set(single,'R_TASK_ITEMS',new Array); //添加属性或修改属性
                                this.$set(single,'showRightTaskItems',true); 
                                let r_node = this.getCascaderObj(single.mParent_temp,this.modelOption);
                                let r_data = r_node[r_node.length-1];
                                if(r_data.modelType == "DATAMODEL_API"){
                                    this.$set(single,'showRightTaskItems',false); 
                            
                                
                                }else{
                                    single.R_TASK_ITEMS = r_data.taskItems;
                                    r_data.taskItems.forEach((element,index) => {
                                    if(element.optionId == single.dataId){
                                        this.$set(single,'rightTaskValue',index);
                                    }
                                
                                    });
                                }
                            }
                        }
                    }
                    catch(e){
                        console.log(e)
                    }
                 });
           });
        
      },
      getCascaderObj(val,opt) {
        return val.map(function (value, index, array) {
          for (var itm of opt) {
            if (itm.optionId == value) { opt = itm.deriveItems; return itm; }
          }
          return null;
        });
      },
      addFormItem(item){
          let obj = {
            itemId:this.formModelItem[0].optionId,
            attrId:1,
            mdId:"0",
            dataId:"",
            val:"1",
            rParent_temp:"",
            ifFuZhi:false,
            mParent:"",
            iParent:"",
            modelType:this.formModelItem[0].modelType
          }
          item.targetList.push(obj);
      },
      deleteFormItem(index,item){
          item.targetList.splice(index,1);
      },
      MultSelect(value,item){
         this.$set(item,'val',value.join('####'));
      },
      handleLeftChange(index,item){
          this.$set(item,'iParent',item.rParent_temp.join(','));
          let model = 'modelLeftOptions'+index;
          let node = this.$refs[model][0].getCheckedNodes()[0].data;
          item.itemId = node.optionId;
          if(item.attrId == 4){
            this.$set(item,'val','');
          }else{
            this.$set(item,'val','1');
          }
          item.modelType = node.modelType;
          if(node.hasOwnProperty("kvName")){
            item.kvName = node.kvName;
          }
      },
      needInput(item){
          if(item.modelType && !this.needDate(item) && !this.needNumber(item) && !this.needSelect(item) && !this.needMultSelect(item) && !this.needSelectPerson(item) && !this.needMinNumber(item) && item.modelType !="APPR_CODE"){
              return true;
          }else{
              return false;
          }
          // if(item.modelType === "TEXTFIELD" || item.modelType === "TEXTAREA"){
          //   return true;
          // }
          // return false;
      },
      needDate(item){
          if(item.modelType === "TIMEFIELD"){
            return true;
          }
          return false;
      },
      needNumber(item){
          if(item.modelType === "NUMFIELDQUERY" || item.modelType === "NUMFIELD"){
            return true;
          }
          return false;
      },
      needMinNumber(item){
          if(item.modelType =="APPR_CODE,APPR_CODE_RATE"){
            return true;
          }
          return false;
      },
      needSelect(item){
          if(item.modelType === "SLT" || item.modelType === "RADIO"){
              return true;
          }
          return false;
      },
      needMultSelect(item){
          if(item.modelType === "CHECKBOX"){
              return true;
          }
          return false;
      },
      needSelectPerson(item){
          if(item.modelType === "USERSLT" || item.modelType === "ORGSLT" || item.modelType === "APPROVER"){
              return true;
          }
          return false;
      },
     changeFormItem(item){
          this.$set(item,'val',''); //添加属性或修改属性
          this.$set(item,'dataId',''); //添加属性或修改属性
          this.$set(item,'mdId','0'); //添加属性或修改属性
          this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
          this.$set(item,'mParent_temp',''); //添加属性或修改属性
          this.$set(item,'rightTaskValue',0);
          this.$set(item,'showRightApiInput',false);
          if(!item.changeFormItem){
           this.$set(item,'showRightTaskItems',item.R_TASK_ITEMS && item.R_TASK_ITEMS.length>0? true:false);
          }else{
            this.$set(item,'showRightTaskItems',false);
          }
           this.$set(item,'changeFormItem',item.changeFormItem? false:true); 
      },
      handleRightChange(index,item){
           item.mdId = item.mParent_temp[0];
           this.needIngItem = {};
           this.$set(item,'mParent',item.mParent_temp.join(','));
           this.$set(item,'showRightTaskItems',false);
           this.$set(item,'showRightApiInput',false);
           this.$set(item,'rightTaskValue',0);
           this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
            if(item.mParent_temp.length > 0){
              let model = 'modelRightOptions'+index;
              let node = this.$refs[model][0].getCheckedNodes()[0].data;
              item.r_md = node.mdId;
              if(node.hasOwnProperty("taskItems") && node.modelType == "TASK_LEVEL"){
                  this.$set(item,'showRightTaskItems',true);
                  item.R_TASK_ITEMS = node.taskItems;
                  this.$set(item,'dataId',item.R_TASK_ITEMS[0].optionId);
              }else{
                  this.$set(item,'dataId',item.mParent_temp[item.mParent_temp.length - 1]);
              }
              if(node.modelType == "DATAMODEL_API"){
                   this.$set(item,'showRightApiInput',true);
                   this.$set(item,'mParent','');
                   this.selectConnector(5,item);

                }
            }
      },
      task_right_change(value,item){
          this.$set(item,'dataId',item.R_TASK_ITEMS[value].optionId);
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      tagSelectCB(){
          arguments[1].val = arguments[0].id;
      },
      onSubmit(){
          let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
          for(let i=0;i<this.relateItems.length;i++){
                let logicSet = this.relateItems[i].logicSet;
                logicSet.forEach(item => {
                let logicConds = item.logicConds;
                    logicConds.forEach(element => {
                        if(element.hasOwnProperty("APPR_ITEMS")){
                        delete element.APPR_ITEMS;
                        }
                        if(element.hasOwnProperty("TASK_ITEMS")){
                        delete element.TASK_ITEMS;
                        }
                        if(element.hasOwnProperty("changeFormItem")){
                        delete element.changeFormItem;
                        }
                        if(element.hasOwnProperty("formula")){
                        delete element.formula;
                        }
                        if(element.hasOwnProperty("l_parent_temp")){
                        delete element.l_parent_temp;
                        }
                        if(element.hasOwnProperty("r_item_temp")){
                        delete element.r_item_temp;
                        }
                        if(element.hasOwnProperty("r_parent_temp")){
                        delete element.r_parent_temp;
                        }
                        if(element.hasOwnProperty("R_TASK_ITEMS")){
                        delete element.R_TASK_ITEMS;
                        }
                        if(element.hasOwnProperty("showRightApiInput")){
                        delete element.showRightApiInput;
                        }
                        if(element.hasOwnProperty("showLeftTaskItems")){
                        delete element.showLeftTaskItems;
                        }
                        if(element.hasOwnProperty("showRightTaskItems")){
                        delete element.showRightTaskItems;
                        }
                    });
                });
            }
          let data = {
              operateId:this.flowOperateId,
              interaction_conds:JSON.stringify(this.relateItems)
          }
          let that = this;
          saveButtonInteraction(data).then((response) => {
               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                    if(response.data.status<100){
                        let doObj = {}
                        doObj.action = 'buttonSetting';
                        doObj.data = {
                            apiSceneId:response.data.remap.apiSceneId
                        };
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }
                  
                });

          }).catch((error) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
          });
      },
      attrChange(value,item){
          if(value == 4){
              item.val = '';
              item.ifFuZhi = true;
          }else{
              item.val = '1';
              item.ifFuZhi = false;
          }
      },
      selectConnector(flag,item){
        window.relateSetvm.needIngItem = item;
        let _url = '/flowform/index.html#/selectConnector/'+this.flowOperateId+'/0/0/'+flag;
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
     },
  },
  watch: {
     'data.length':{
        handler(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.data.forEach((element,index) => {
                    element.lgOrder = index+1;
                });
            }
        }
    }
  }
}
</script>
<style scoped>
.buttonSetting{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
.buttonSetting .relateItem {
  padding: 10px 24px 20px 24px;
   border-bottom: 1px solid #e8e8e8;
}
.buttonSetting .relateItem .relateOption{
    padding: 16px;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
}
.buttonSetting .relateItem .icon{
  cursor: pointer;
  position: relative;
  top: 1px;
}
.buttonSetting .opRelate .btn-line {
	border: 1px dashed #409eff;
	background-color: #fff;
	color: #1ba5fa;
	cursor: pointer;
	text-align: center;
	margin: 10px 24px;
}
.relateOption .header {
  background-color: #d9d9d9;
  line-height: 40px;
}
.relateOption .header span{
    display: inline-block;
    width: 33%;
    text-align: center;
}
.btn_line{
      display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #f5f5f5;
    border: 1px dotted #e8e8e8;
    border-radius: 2px;
    color: #1ba5fa;
    height: 32px;
    cursor: pointer;
    margin-top: 10px;
}
.fromItem{
   margin-top: 10px;
}
.con{
  width:33%;
  display:inline-block;
  text-align:center;
}
.qiehuan{
    height: 30px;
    line-height: 30px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 26px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 1px;
    cursor: pointer;
}
.buttonSetting .btn{
    text-align: right;
    margin:10px;
    position: absolute;
    bottom: 0;
    right: 0;
}
.buttonSet ting .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}

</style>
