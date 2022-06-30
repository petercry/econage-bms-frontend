<template>
    <div class="linkWfSetting">
         <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
         <el-form  v-loading="loading" :model="form" ref="form" label-position="top" :show-message="false" class="container" label-width="100px">
            <el-form-item label="流程状态">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部状态</el-checkbox>
                
                <el-checkbox-group v-model="form.wf_status" :min="1"  @change="handleCheckedCitiesChange" style="display: inline-block;margin-left: 28px;">
                    <el-checkbox v-for="item in status" :label="item.idString" v-if="item.id != '100'" :key="item.idString">{{item.text}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
           
            <el-form-item label="模板名称">
                 <el-select v-model="form.templateName" value-key="wfTempId" @change="templateChange" style="width:100%;" filterable placeholder="请选择模板">
                    <el-option
                        v-for="item in templateArray"
                        :key="item.wfTempId"
                        :label="item.name"
                        :value="item"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="选择方式">
                <el-radio-group v-model="form.sc_select"> 
                    <el-radio-button label="1" >单选</el-radio-button>
                    <el-radio-button label="2">多选</el-radio-button>
                </el-radio-group>
            </el-form-item>

             <el-form-item label="选择范围">
                <el-checkbox-group v-model="form.sel_scope"  style="display: inline-block;">
                    <el-checkbox v-for="item in fanWei" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item>
                <div slot="label">
                    <label>数据关联</label>
                    <el-switch
                        v-model="form.rel_data" @change="relateChange" style="margin-left:15px" :active-value=1 :inactive-value=0>
                    </el-switch>
                </div>
            </el-form-item>

            <el-form-item v-if="form.rel_data == 1">
                 <p style="line-height: 32px;color: #606266;">当选择关联流程后，将按照以下规则填充当前表单字段</p>
                 <div class="relateOption">
                     <div class="left-box">
                          <span>{{form.templateName}}</span>
                    </div>
                    <div class="arrow-box"></div>
                    <div class="right-box">
                        <span>{{curr_wfname}}</span>
                    </div>
                    
                    <div style="margin-bottom:10px;"  v-for="(item,index) in form.items" :key="index">
                        <div class="left-box">
                            <el-cascader
                                size="small" 
                                style="width: 60%;"
                                v-model="item.fromParent_temp"
                                :options="from_datamodel"
                                @change="leftFromDataChange(index,item)"
                                :ref="'modelLeftOptions'+index"
                                clearable
                                :props="{disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"
                                > 
                                
                                <template slot-scope="{ node, data }">
                                <span>{{ data.optionName }}</span>
                                <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                            </el-cascader>
                             <el-tooltip class="item" effect="dark" style="width:37%;display:inline-block;" :content="item.fromParent" placement="top">
                                <div  >
                                <el-input class="pointerCalss" style="width:100%;" :readonly="true" @click.native="needIngItem=item;selectPrintList()" v-model="item.fromParent" type="text" v-if="item.fromCat == 5">
                                </el-input>
                                </div>
                            </el-tooltip>
                           
                        </div>
                        <div class="arrow-box">
                            <i style="font-size: 25px;position:relative;top:3px;" class="iconfont icon iconarrowright"></i>
                        </div>   
                        <div class="right-box">
                            <el-select size="medium" style="width: 90%;" v-model="item.targetItem"  placeholder="请先选择左侧表单数据">
                                <el-option
                                        v-for="item in item.target_datamodel"
                                        :key="item.optionId"
                                        :label="item.optionName"
                                        :value="item.optionId">
                                </el-option>
                            </el-select>
                            <i class="iconfont icon iconclosecircleo" @click="deleteItem(index,form.items)"></i>
                        </div>
                    </div>
                     <div class="btn-line">
                        <el-button size="medium"  @click="addItem(form.items)" type="text"><i class="iconfont icon iconicon-test"></i> 添加</el-button>
                    </div>
                </div>
            </el-form-item>
        
        </el-form>
        <div class="btn">
              <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
              <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>

import {loadRelWfInfo,getRelWfFormData,saveWfLinkInfo,getPrintSetList} from '../../service/service.js'
import {Loading} from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'

export default{
  data(){
    return {
      loading:true,
      checkAll: true,
      status:[],
      fanWei:[
          {
              name:"我发起",
              value:"1"
          },
          {
              name:"我经办",
              value:"2"
          },
          {
              name:"所有流程",
              value:"0"
          }
      ], 
      curr_wfname:"",
      templateArray: [],
      isIndeterminate: false,
      form:{
          operate_id:"",
          sc_id:"",
          wf_status:[],
          sc_select:1,
          rel_data:0,
          sel_scope:[],
          wf_template:-1,
          templateName:"全部",
          items:[],
      },
      
      from_datamodel:[],
      to_datamodel:{},
      needIngItem:{}
    }
  },
  components: {
        ecoLoading,
  },
  created(){
        this.form.operate_id = this.$route.params.operateId;
        if(this.$route.params.scId != 0){
            this.form.sc_id = this.$route.params.scId;
        }
  },
  beforeDestroy() {
     
  },
  mounted(){
       this.loadRelWfInfoFunc();
       this.bindAction();
  },
  computed:{

  },
  methods: {
      bindAction(){
            let that = this;
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'selectPrintSet'){
                    let array = obj.data;
                    if(array.length == 1){
                      that.needIngItem.fromParent = array[0].set_name;
                      that.needIngItem.fromDataItem = array[0].id;
                    }else if (array.length > 1){
                      let str_array = [];
                      let id_array = [];
                      array.forEach(element => {
                            str_array.push(element.set_name);
                            id_array.push(element.id);
                      });
                      that.needIngItem.fromParent = str_array.join(',');
                      that.needIngItem.fromDataItem = id_array.join(',');
                    }
                }
            }
            
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'linkWfSetting');
      },

      loadRelWfInfoFunc(){
            loadRelWfInfo(this.form).then((response)=>{
                this.loading = false;
                    if(response.data.status<100){
                        let remap = response.data.remap;
                        this.templateArray = remap.wf_models||[];
                        this.templateArray.unshift({
                            name:"全部",
                            wfTempId:-1
                        })

                        this.status = remap.status_kv;
                        this.curr_wfname = remap.curr_wfname;
                        let array = remap.to_datamodel;
                        array.map((element) => {
                            if(this.to_datamodel.hasOwnProperty(element.modelType)){

                            }else{
                                this.to_datamodel[element.modelType] = [];
                            }
                            this.to_datamodel[element.modelType].push(element);
                        });
                        if(remap.hasOwnProperty("sel_wfname")){
                             this.form.templateName = remap.sel_wfname;
                        }
                        if(remap.hasOwnProperty("ref_data")){
                            this.form.wf_status = remap.ref_data.wfStatus.split(',');
                            this.form.sel_scope = remap.ref_data.selScope.split(',');
                            this.form.rel_data = remap.ref_data.relData;
                            this.form.wf_template = remap.ref_data.wfTempId;
                           
                        }else{
                            this.status.forEach((element,index) => {
                                if(element.id == '100'){
                                    
                                }else{
                                    this.form.wf_status.push(element.idString);
                                }
                                
                            });
                        }
                        if(remap.hasOwnProperty("sc_entity")){
                            this.form.sc_select = remap.sc_entity.scSelect;
                        }
                        if(remap.hasOwnProperty("from_datamodel")){
                             this.from_datamodel = response.data.remap.from_datamodel;
                        }
                        if(remap.hasOwnProperty("sc_mapping")){
                           this.form.items = remap.sc_mapping;


                           this.form.items.forEach((element,index) => {
                               element.fromParent_temp = element.fromParent.split(',');
                               if(element.fromCat == "5"){
                                    element.fromParent_temp = ['5'];
                                }

                               let node = this.getCascaderObj(element.fromParent_temp,this.from_datamodel);
                               let data = node[node.length-1];
                               this.$set(element,"target_datamodel",this.to_datamodel[data.modelType]);
                               
                               if(element.targetItem == '0'){
                                    element.targetItem = "";
                                } 
                           });
                       
                        }
                    }
            }).catch((error)=>{
                console.log(error);
                  this.loading = false;
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
      addItem(items){
          items.push({});
      },
      deleteItem(index,items){
          items.splice(index, 1);
      },
      templateChange(item){
          this.form.templateName = item.name;
          this.form.wf_template = item.wfTempId;
          this.form.items.forEach((item) => {
               this.$set(item,"targetItem","");
               this.$set(item,"fromDataItem","");
               this.$set(item,"fromParent_temp","");
               this.$set(item,"fromParent","");
               this.$set(item,"target_datamodel",new Array());
          })
          if(this.form.rel_data == 1){
              this.getRelWfFormDataFunc(this.form.wf_template);
          }
         
      },
      getRelWfFormDataFunc(wf_id){
           getRelWfFormData(wf_id).then((response)=>{
                if(response.data.status<100){
                    this.from_datamodel = response.data.remap.from_datamodel;
                }
            }).catch((error)=>{

            });
      },
      relateChange(){
          if(!this.form.wf_template){
              EcoMessageBox.alert("流程模板不能为空！");
              this.form.rel_data = 0;
              return;
          }else{
              this.getRelWfFormDataFunc(this.form.wf_template);
          }
      },
      handleCheckAllChange(val) {
        this.isIndeterminate = false;
        this.checkAll = true;
        this.form.wf_status = [];
        this.status.forEach((element,index) => {
            if(element.id == '100'){
                    
                    
            }else{
                this.form.wf_status.push(element.idString);
            }
                
        });
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.status.length-1;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.status.length-1;
      },
      leftFromDataChange(index,item){
          this.$set(item,'fromParent',item.fromParent_temp.join(','));
          let model = 'modelLeftOptions'+index;
          let data = this.$refs[model][0].getCheckedNodes()[0].data;
          item.fromDataItem = data.optionId;
          this.$set(item,"targetItem","");
          this.$set(item,"fromCat",data.mdId);
            this.$set(item,"target_datamodel",this.to_datamodel[data.modelType]);
          if(data.mdId == '5' && data.modelType == "ATTACHEMENT"){
              this.$set(item,'fromParent','');
              item.fromDataItem = '';
              this.needIngItem = item;
              this.selectPrintList();
          }
          
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        this.form.wf_status_string = this.form.wf_status.join(',');
        this.form.sel_scope_string = this.form.sel_scope.join(',');
        this.form.sc_mapping = JSON.stringify(this.form.items);
        saveWfLinkInfo(this.form).then((response)=>{
            if(response.data.status<100){
                let doObj = {}
                doObj.action = 'relWFSetting';
                doObj.data = {
                    scId:response.data.remap.sc_entity.scId,
                };

                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            }
                
        }).catch((error)=>{

        });
          
      },
      selectPrintList(){
          this.$refs.ecoLoadingRef.open();
         getPrintSetList(this.form.wf_template).then((response) => {
            this.$refs.ecoLoadingRef.close();
            if(response.data.status<100){
                let remap = response.data.remap;
                let array = remap.set_list;
                let print_set_list = []
                array.forEach(element => {
                  if(element.is_selected == 1){
                    print_set_list.push(element);
                  }
                });
                let len = print_set_list.length;
                //let len = 1;
                if(len>1){
                    // this.$router.push({name:'printSetList',params:{wfId:this.formWf.wfId}});
                    let _width = '700';
                    let _height = '400';
                    let url = '/flowform/index.html#/printSetListForMulit/'+this.form.wf_template;
                    EcoUtil.getSysvm().openDialog('选择打印模板',url,_width,_height,'50px');
                    
                }else if(len == 1 ){    
                    this.needIngItem.fromParent = print_set_list[0].set_name;
                    this.needIngItem.fromDataItem = print_set_list[0].id; 
                }else{
                    this.$message({
                        showClose: true,
                        duration:2000,
                        message: '请先配置打印模板',
                        customClass:'design-from-el-message',
                        type: 'warning'
                    });
                }
            }
        }).catch((error) => {
             this.$refs.ecoLoadingRef.close();
        });
     },
      
  },
  watch: {
     'form.items.length':{
        handler(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.form.items.forEach((element,index) => {
                    element.scOrder = index+1;
                });
            }
        }
    }
  }
}
</script>
<style scoped>
.linkWfSetting{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
.linkWfSetting .container{
    padding: 20px 12px 10px;
}
.linkWfSetting .btn{
  text-align: right;
  margin:20px 10px;
}
.linkWfSetting .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}
.linkWfSetting .icon-act {
    color: #1ba5fa;
    margin-right: 8px;
    margin-left: 15px;
    position: relative;
    top: 2px;
}
.linkWfSetting .relateOption{
    padding: 16px;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
}
.linkWfSetting .relateOption .arrow-box{
    width:80px;
    display: inline-block;
    height: 36px;
    line-height: 27px;
    text-align: center;
}
.linkWfSetting .relateOption .arrow-box .icon{
    font-size: 25px;
    position: relative;
    top: 3px;
}
.linkWfSetting .relateOption .left-box,.linkWfSetting .relateOption .right-box{
    display: inline-block;
    width: 325px;
    text-align: left;
    box-sizing: border-box;
}
.linkWfSetting .relateOption .left-box span,.linkWfSetting  .relateOption .right-box span{
    height: 48px;
    line-height: 48px;
    color: #606266;
}
.linkWfSetting .right-box .icon{
    margin-left: 10px;
    cursor: pointer;
    float: right;
    position: relative;
    top: 2px;
    color: #1ba5fa;
}
.linkWfSetting .relateOption .btn-line{
    text-align: center;
    border: 1px dashed #ddd;
    background-color: #fff;
    color: #1ba5fa;
    cursor: pointer;
    width: 98%;
    margin: 0 auto;
}
</style>
