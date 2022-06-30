<template>
    <div class="apiSetting">
        <el-form  v-loading="loading" :model="form" ref="form" label-position="top" :show-message="false" class="container" label-width="100px">
             <el-form-item label="连接器类型">
                    <el-radio-group v-model="form.refType" @change="refTypeChange">
                        <el-radio-button label="1" >API</el-radio-button>
                        <el-radio-button label="4">URL</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            <el-form-item label="接口选择"  v-if="form.refType ==1 ">

                <el-select placeholder="请选择Agent"  v-model="form.agentName" value-key="identification" :disabled="agentDisabled" @change="agentChange" style="width: 200px;margin-right:10px;" >
                     <el-option
                        :key="index"
                        v-for="(item,index) in agentOp"
                        :label="item.desc"
                        :value="item">
                    </el-option>
                </el-select>
                <el-select placeholder="请选择连接器类别" v-if="form.agentId || this.refId !=0 " :disabled="connectorDisabled" v-model="form.connectorTypeIndex" style="width: 200px;margin-right:10px;" @change="connectorTypeChange">
                     <el-option
                        :key="index"
                        v-for="(item,index) in connectTypeOp"
                        :label="item.name"
                        :value="index">
                        <span>{{ item.name + (item.connectorNum == 0 || item.connectorNum?' (' + item.connectorNum + ')':'')}}</span>
                    </el-option>
                </el-select>
                <el-select placeholder="请选择连接器名称" v-if="form.connectorNum > 0 || this.refId !=0 " style="width: 200px;margin-right:10px;" v-model="form.connectorIndex" @change="connectorChange">
                     <el-option
                        :key="index"
                        v-for="(item,index) in connectorList"
                        :label="item.name"
                        :value="index">
                        <span>{{ item.name + ' (' + item.apiNum + ')'}}</span>
                    </el-option>
                </el-select>
                <el-select placeholder="请选择接口" v-if="form.apiNum > 0 || this.refId !=0" v-model="form.apiIndex" @change="apiChange" style="width: 200px;">
                     <el-option
                            :key="index"
                            v-for="(item,index) in apiList"
                            :label="item.apiName"
                            :value="index">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="执行器名称">
                <el-input type="text" v-model="form.connectName" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="URL类型" v-if="form.refType ==4">
                <el-radio-group v-model="form.itCatId">
                    <el-radio-button label="1">内部链接</el-radio-button>
                    <el-radio-button label="2">外部链接</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="URL地址 ( PC )" v-if="form.refType ==4">
               <el-input type="text" v-model="url.pc_url" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="URL地址 ( Mobile )" v-if="form.refType ==4">
               <el-input type="text" v-model="url.mobile_url" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="输入参数配置">
                <el-table

                    size="medium"
                    class="list"
                    :data="form.inputParamList"
                    style="width: 100%;">
                    <el-table-column
                        prop="paramName"
                        label="请求参数"
                        show-overflow-tooltip
                        >
                         <template slot-scope="scope">
                             <i class="iconfont icon-act iconhandright" v-if="scope.row.paramPath"></i>
                             <span v-if="form.refType == 1">{{scope.row.paramName}}</span>
                             <el-input v-model="scope.row.paramName" v-if="form.refType == 4" style="width:220px;"></el-input>
                         </template>
                    </el-table-column>

                    <el-table-column
                        label="数据"

                        prop="templateType"
                        >
                        <template slot-scope="scope">
                            <div v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' ">
                                <el-cascader
                                style="width:180px;"
                                v-show="!scope.row.changeFormItem"
                                v-model="scope.row.dataParent_temp"
                                @change="modelSelect(scope.row,scope.$index)"
                                :ref="'modelOptions'+scope.$index"
                                :options="modelData"
                                :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"

                                >
                                <template slot-scope="{ node, data }">
                                <span>{{ data.optionName }}</span>
                                <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                                <el-select v-show="scope.row.showRightTaskItems" @change="task_right_change($event,scope.row)" size="small" style="width: 110px;" v-model="scope.row.rightTaskValue">
                                    <el-option
                                    :key="index"
                                    v-for="(item,index) in scope.row.R_TASK_ITEMS"
                                    :label="item.optionName"
                                    :value="index">
                                    </el-option>
                                </el-select>
                                <el-input type="text" v-model="scope.row.dataVal" v-show="scope.row.changeFormItem" style="width:180px;">

                                </el-input>
                                 <el-input class="pointerCalss" type="text" style="width: 130px;" readonly v-model="scope.row.dataParent" @click.native="selectConnector(5,scope.row)" v-if="scope.row.showRightApiInput ">

                                </el-input>
                                <div class="qiehuan" @click="changeFormItem(scope.row)">
                                    <i class="iconfont icon iconqiehuan"></i>
                                </div>
                                <div class="qiehuan" v-if="form.refType ==4" @click="deleteInputItem(scope.$index)" style="color:rgb(245, 108, 108)">
                                    <i class="iconfont icon iconshanchudelete30"></i>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="addBtn" style="margin-top: 20px" v-if="form.refType ==4">
                    <el-button size="medium" @click="addInputItem">添加一行</el-button>
                </div>
            </el-form-item>
            <el-form-item label="输出参数配置" v-if="form.refType ==1">
                <el-table
                    size="medium"
                    class="list"
                    :data="form.outputParamList"
                    style="width: 100%;">
                    <el-table-column
                        prop="paramName"
                        label="赋值参数"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope">
                             <i class="iconfont icon-act iconhandright" v-if="scope.row.paramPath"></i>
                             {{scope.row.paramName}}
                         </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="参数描述"
                        >
                        <template slot-scope="scope">

                            <el-input type="text"  v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY'" v-model="scope.row.titleName" style="width:180px;">

                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div class="btn">
              <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
              <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import {getConnectorTypeList,getConnectorListByType,getApiListByConnector,getApiDetByApiId,loadConnectorInfo,saveConnectorInfo,getAgentList} from '../../service/service.js'

export default{
  data(){
    return {
      loading:true,
      form:{
          selectType:"1",
          selectMult:"1",
          refType:1,
          inputParamList:[],
          outputParamList:[],
          connectorTypeIndex:"",
          connectorType:"",
          connectorTypeName:"",
          connectorNum:0,
          connectorIndex:"",
          connectorId:"",
          connectorName:"",
          apiNum:0,
          connectName:"",
          apiId:"",
          apiName:"",
          apiIndex:"",
          inputList:0,
          outputList:0,
          agentId:"",
          agentName:"",
          itCatId:"1",
          ifParams:""
      },
      connectTypeOp:[{
              id:"SAP",
              name:"SAP",
              icon:"iconabt_1_0",
              connectorNum:0
          },
          {
              id:"WEBSERVICE",
              name:"WSDL",
              icon:"iconabt_2_0",
              connectorNum:0
          },
          {
              id:"REST",
              name:"rest",
              icon:"iconabt_4_0",
              connectorNum:0

          },
          {
              id:"SMTP",
              name:"smtp",
              icon:"iconabt_5_0",
              connectorNum:0
          },
          {
              id:"ORACLE",
              name:"Oracle",
              icon:"iconabt_3_1",
              connectorNum:0,
          },
          {
              id:"MYSQL",
              name:"Mysql",
              icon:"iconabt_3_2",
              connectorNum:0,
          },
          {
              id:"SQL_SERVER",
              name:"SqlServer",
              icon:"iconabt_3_3",
              connectorNum:0,
          },
          {
            name:"签章",
            id:"8"
          },
          {
              name:"内部模块",
              id:"INNER",
              connectorNum:0
          },
      ],
      agentOp:[],
      modelData:[],
      connectorList:[],
      apiList:[],
      refId:"",
      operateId:"",
      agentDisabled:false,
      connectorDisabled:false,
      needIngItem:{},//当前需要回写的项,
      needConfirm:true,
      url:{
          pc_url:"",
          mobile_url:""
      }
    }
  },
  components: {
   ecoLoading,
  },
  created(){

    this.operateId = this.$route.params.operateId;
    this.refId = this.$route.params.refId;
    window.convm = this;
  },
  beforeDestroy() {

  },
  mounted(){
      this.getAgentList();
      this.loadConnectorInfo();
      this.bindAction();
  },
  computed:{

  },
  methods: {
      bindAction(){
        let callBackDialogFunc = function(obj){

            if(obj && obj.action == 'selectConnector' ){
                if(obj.flag == 3){//左边选择

                }else if(obj.flag == 5){//右边选择
                    window.convm.needIngItem.dataParent = obj.data.paramName;
                    window.convm.needIngItem.dataItemId = obj.data.paramId?obj.data.paramId:obj.data.paramDataId?obj.data.paramDataId:"";
                }
            }
            return;
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'connectApi');
      },
       loadConnectorInfo(){
           let data = {
               operate_id:this.operateId,
           }
           if(this.refId != 0){
               data.ref_id = this.refId;

           }
           loadConnectorInfo(data).then((response)=>{
                if(response.data.status<100){
                    this.modelData = response.data.remap.model_options;
                    let remap = response.data.remap;
                    // this.form = remap.ref_entity;
                    if(this.refId != 0){
                        this.needConfirm = false;
                        this.form.connectorType = remap.ref_entity.itCatId;
                        this.form.connectorTypeName = remap.ref_entity.itCatName;
                        this.form.connectorId = remap.ref_entity.itId;
                        this.form.connectorName = remap.ref_entity.itName;
                        this.form.apiId = remap.ref_entity.ifId;
                        this.form.apiName = remap.ref_entity.ifName;
                        this.form.connectName = remap.ref_entity.refName;
                        this.form.agentId = remap.ref_entity.itAgent;
                        this.form.agentName = remap.ref_entity.itAgentName;
                        this.form.outputList = remap.ref_entity.outputList;
                        this.form.inputList = remap.ref_entity.inputList;
                        this.form.inputParamList = this.transformData(remap.in_list);
                        this.form.outputParamList = remap.out_list;
                        this.form.refType = remap.ref_entity.refType;
                        //编辑
                        console.log(this.form.refType);
                        if(this.form.refType == 1){
                            this.getConnectorTypeList(true);
                            getConnectorListByType(this.form.connectorType,this.form.agentId).then((response)=>{
                                if(response.data.status<100){
                                    this.connectorList = response.data.remap.connector_list;
                                    for(let i = 0;i<this.connectorList.length;i++){
                                        let item = this.connectorList[i];
                                        if(item.id == this.form.connectorId){
                                            this.form.connectorIndex = i;
                                            this.form.apiNum = item.connectorNum;
                                            break;
                                        }
                                    }
                                }
                            });
                            getApiListByConnector(this.form.connectorId).then((response)=>{
                                if(response.data.status < 100){
                                    this.apiList = response.data.remap.api_list;
                                    for(let i = 0;i<this.apiList.length;i++){
                                        let item = this.apiList[i];
                                        if(item.id == this.form.apiId){
                                            this.form.apiIndex = i;
                                            break;
                                        }
                                    }
                                }
                            })
                            for(let i = 0;i<this.connectTypeOp.length;i++){
                                let item = this.connectTypeOp[i];
                                if(item.id == this.form.connectorType){
                                    this.form.connectorTypeIndex = i;
                                    this.form.connectorNum = item.connectorNum;
                                    break;
                                }
                            }
                        } else if(this.form.refType == 4){
                            let url = JSON.parse(remap.ref_entity.ifParams);
                            this.form.itCatId = remap.ref_entity.itCatId;
                            //this.form.ifParams = remap.ref_entity.ifParams;
                            this.url.pc_url = url.pc_url;
                            this.url.mobile_url = url.mobile_url;
                            this.form.connectorType = "";
                            this.form.connectorTypeName = "";

                        }
                    }
                }

                this.loading = false;
           });
       },
       transformData(data){
           data.forEach((item,index) =>{
                this.$set(item,'changeFormItem',false);
                if(item.dataVal){
                     this.$set(item,'changeFormItem',true);
                }
                if(item.dataModelId == "3"){
                    this.$set(item,'dataParent_temp',item.dataModelId.split(','));
                    this.$set(item,'showRightApiInput',true);
                }
               if(item.dataParent){
                    if(item.dataModelId == "3"){

                    }else{
                        this.$set(item,'dataParent_temp',item.dataParent.split(','));
                    }
                  if(item.dataItemId && item.dataItemId != item.dataParent_temp[item.dataParent_temp.length - 1]){
                    this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
                    this.$set(item,'showRightTaskItems',true);
                    let r_node = this.getCascaderObj(item.dataParent_temp,this.modelData);
                    let r_data = r_node[r_node.length-1];
                    if(r_data.modelType == "DATAMODEL_API"){
                        this.$set(item,'showRightTaskItems',false);


                    }else{
                        item.R_TASK_ITEMS = r_data.taskItems;
                        r_data.taskItems.forEach((element,index) => {
                            if(element.optionId == item.dataItemId){
                                this.$set(item,'rightTaskValue',index);
                            }
                        });
                    }
                  }
               }
           });
           return data;
       },
       getCascaderObj(val,opt) {
        return val.map(function (value, index, array) {
          for (var itm of opt) {
            if (itm.optionId == value) { opt = itm.deriveItems; return itm; }
          }
          return null;
        });
      },
      getAgentList(){
          getAgentList().then((response)=>{
             if(response.data.status < 100){
                this.agentOp = response.data.remap.agentList;
                if(this.$route.params.agentId != 0){
                    this.form.agentId = this.$route.params.agentId;
                    for(let i = 0;i<this.agentOp.length;i++){
                        let item = this.agentOp[i];
                        if(item.identification == this.form.agentId){
                            this.form.agentName = item.desc;
                            break;
                        }
                    }
                    this.agentDisabled = true;
                }
                if(this.$route.params.catName != 0){
                    if(this.refId == 0){
                        this.getConnectorTypeList();
                    }
                    this.connectorDisabled = true;
                    this.form.connectorTypeName = this.$route.params.catName;


                }
             }
          }).catch((error)=>{

            })
      },
      //初始化一下数据
      refTypeChange(value){




      },
      agentChange(item){
          this.form.agentId = item.identification;
          this.form.agentName = item.desc;
          this.loading = true;
          this.getConnectorTypeList();
          this.$set(this.form,"connectorTypeIndex","");
          this.$set(this.form,"connectorType","");
          this.$set(this.form,"connectorTypeName","");
          this.$set(this.form,"connectorNum","");
          this.$set(this.form,"connectorId","");
          this.$set(this.form,"connectorName","");
          this.$set(this.form,"connectorIndex","");
          this.$set(this.form,"apiNum",0);
          this.$set(this.form,"apiId","");
          this.$set(this.form,"apiName","");
          this.$set(this.form,"apiIndex","");
          this.form.inputParamList = [];
          this.form.outputParamList = [];
      },
       getConnectorTypeList(){
            getConnectorTypeList(this.form.agentId).then((response)=>{

             if(response.data.status < 100){
                 let connector_type_list = response.data.remap.connector_type_list;
                 connector_type_list.forEach((element,index) => {
                      if(element.identification == "REST"){
                          this.connectTypeOp[2].connectorNum = element.connectorNum;
                      }else if(element.identification == "ORACLE"){
                          this.connectTypeOp[4].connectorNum = element.connectorNum;
                      }else if(element.identification == "MYSQL"){
                          this.connectTypeOp[5].connectorNum = element.connectorNum;
                      }else if(element.identification == "WEBSERVICE"){
                          this.connectTypeOp[1].connectorNum = element.connectorNum;
                      }else if(element.identification == "SAP"){
                          this.connectTypeOp[0].connectorNum = element.connectorNum;
                      }else if(element.identification == "SMTP"){
                          this.connectTypeOp[3].connectorNum = element.connectorNum;
                      }else if(element.identification == "SQL_SERVER"){
                          this.connectTypeOp[6].connectorNum = element.connectorNum;
                      }else if(element.identification == "INNER"){
                          this.connectTypeOp[8].connectorNum = element.connectorNum;
                      }

                });
                //如果是编辑下则不需要执行
                 if( this.refId == 0 && this.$route.params.catName != 0){
                     console.log(this.form.connectorTypeName)
                      for(let i = 0;i<this.connectTypeOp.length;i++){
                        let item = this.connectTypeOp[i];
                        if(item.name == this.form.connectorTypeName || item.id == this.form.connectorTypeName){
                            this.form.connectorType = item.id;
                            this.form.connectorTypeIndex = i;
                             this.form.connectorNum = item.connectorNum;
                            this.connectorTypeChange(this.form.connectorTypeIndex);

                            break;
                        }
                    }
                 }
                   this.loading = false;
             }
        }).catch((error)=>{

        })
      },
      connectorTypeChange(index){
          this.form.connectorType = this.connectTypeOp[index].id;
          if(this.connectTypeOp[index].id != 'INNER'){
            this.form.connectorTypeName = this.connectTypeOp[index].name;
          }
          this.form.connectorNum = this.connectTypeOp[index].connectorNum;
          this.$set(this.form,"connectorId","");
          this.$set(this.form,"connectorName","");
          this.$set(this.form,"connectorIndex","");
          this.$set(this.form,"apiNum",0);
          this.$set(this.form,"apiId","");
          this.$set(this.form,"apiName","");
          this.$set(this.form,"apiIndex","");
          if(this.form.connectorNum>0){
              this.loading = true;
              getConnectorListByType(this.form.connectorType,this.form.agentId).then((response)=>{
                 this.loading = false;
                 if(response.data.status<100){
                     this.connectorList = response.data.remap.connector_list;
                 }
             });
          }
          this.form.inputParamList = [];
          this.form.outputParamList = [];
      },
      connectorChange(index){
          this.form.connectorId = this.connectorList[index].id;
          this.form.connectorName = this.connectorList[index].name;
          this.form.apiNum = this.connectorList[index].apiNum;
          this.$set(this.form,"apiId","");
          this.$set(this.form,"apiName","");
          this.$set(this.form,"apiIndex","");
          if(this.form.apiNum > 0){
              this.loading = true;
              getApiListByConnector(this.form.connectorId).then((response)=>{
                   this.loading = false;
                  if(response.data.status < 100){
                      this.apiList = response.data.remap.api_list;
                  }
              })
          }
          this.form.inputParamList = [];
          this.form.outputParamList = [];
      },
      apiChange(index){
          this.loading = true;
          this.form.apiId = this.apiList[index].id;
          this.form.apiName = this.apiList[index].apiName;
          this.form.connectName = this.form.apiName;
          getApiDetByApiId(this.apiList[index].id).then((response)=>{
                if(response.data.status < 100){
                   let remap = response.data.remap;

                   this.form.inputParamList = [];
                     if(remap.api_info.inputParamList){
                          let param_in_data = this.transDataByArray(remap.api_info.inputParamList);
                            param_in_data.forEach((element,index) => {
                                let data = {};
                                data.paramName = element.name;
                                data.paramPath = element.paramPath
                                data.paramValType = element.type;
                                data.opType = "1";
                                data.dataModelId = element.dataModelId;
                                data.dataItemId = element.dataItemId;
                                data.dataParent = element.dataParent;
                                data.porder = index;

                                if(element.defaultVal){
                                    this.changeFormItem(data);
                                }
                                data.dataVal = element.defaultVal;
                                this.form.inputParamList.push(data);
                            });
                     }
                    this.form.outputParamList = [];
                    if(remap.api_info.outputParamList){
                        let param_out_data = this.transDataByArray(remap.api_info.outputParamList);
                        param_out_data.forEach((element,index) => {
                            let data = {};
                            data.titleName = element.titleName || element.comment;
                            data.paramName = element.name;
                            data.paramPath = element.paramPath;
                            data.paramValType = element.type;
                            data.porder = index;
                            this.form.outputParamList.push(data);
                        });
                    }
                   this.form.inputList = remap.api_info.ifInputArray ? 1:0;
                   this.form.outputList = remap.api_info.outputType == "JSON_ARRAY" ? 1:0;
                }
                 this.loading = false;
            })

      },
      transDataByArray(data){
            let tempArray = [];
            let childArray = [];
            data.forEach((element,index) => {
                if(element.parentId == -1){
                    tempArray.push(element);
                }else{
                    childArray.unshift(element);
                }
            })
            childArray.forEach((child,index) => {
                for(let i = 0;i<tempArray.length;i++){
                    let parent = tempArray[i];
                    if(child.parentId == parent.id){
                        child.isChild = true;
                        parent.isParent = true;
                        parent.paramPath = "";
                        child.paramPath = parent.name;
                        tempArray.splice(i+1,0,child);
                        break;
                    }
                }

            });
            return tempArray;
      },
      modelSelect(item,index){
        let model = 'modelOptions'+index;
        this.needIngItem = {};
          this.$set(item,'dataParent',item.dataParent_temp?item.dataParent_temp.join(','):'');
         this.$set(item,'showRightTaskItems',false);
         this.$set(item,'showRightApiInput',false);
        this.$set(item,'rightTaskValue',0);
        this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
        if(item.dataParent_temp.length>0){
            let node = this.$refs[model].getCheckedNodes()[0].data;
            this.$set(item,'dataModelId',node.mdId); //添加属性或修改属性
            if(node.hasOwnProperty("taskItems") && node.modelType == "TASK_LEVEL"){
                  this.$set(item,'showRightTaskItems',true);
                  item.R_TASK_ITEMS = node.taskItems;
                  this.$set(item,'dataItemId',item.R_TASK_ITEMS[0].optionId);
              }else{
                  this.$set(item,'dataItemId',item.dataParent_temp[item.dataParent_temp.length - 1]);
              }
            if(node.modelType == "DATAMODEL_API"){
                   this.$set(item,'showRightApiInput',true);
                   this.$set(item,'dataParent','');
                   this.selectConnector(5,item);

            }

        }
     },
      changeFormItem(item){
          this.$set(item,'dataVal',''); //添加属性或修改属性
          this.$set(item,'dataItemId',''); //添加属性或修改属性
          this.$set(item,'dataModelId','0'); //添加属性或修改属性
          this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
          this.$set(item,'dataParent_temp',''); //添加属性或修改属性
          this.$set(item,'rightTaskValue',0);
          this.$set(item,'showRightApiInput',false);
          if(!item.changeFormItem){
           this.$set(item,'showRightTaskItems',item.R_TASK_ITEMS && item.R_TASK_ITEMS.length>0? true:false);
          }else{
            this.$set(item,'showRightTaskItems',false);

          }
           this.$set(item,'changeFormItem',item.changeFormItem? false:true);
      },
      task_right_change(value,item){
          this.$set(item,'dataItemId',item.R_TASK_ITEMS[value].optionId);
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        this.loading = true;
        let data = {
            operate_id:this.operateId,
            ref_name:this.form.connectName,
            ref_type:this.form.refType,
            it_catid:this.form.connectorType,
            it_catname:this.form.connectorTypeName,
            it_id:this.form.connectorId,
            it_name:this.form.connectorName,
            if_id:this.form.apiId,
            if_name:this.form.apiName,
            if_params:"",
            it_agent:this.form.agentId,
            it_agentname:this.form.agentName,
            input_list:this.form.inputList,
            output_list:this.form.outputList
        }
        //url
        if(this.form.refType == 4){
            data.it_catid = this.form.itCatId;
            data.if_params = JSON.stringify( this.url);
            data.it_catname = this.form.itCatId == 1?"内部链接":"外部链接";
        }
        // let param_in_data = [];
        // this.form.inputParamList.forEach((element,index) => {
        //     let data = {};
        //     data.paramName = element.name;
        //     data.paramPath = element.paramPath
        //     data.paramValType = element.type;
        //     data.opType = "1";
        //     data.dataModelId = element.dataModelId;
        //     data.dataItemId = element.dataItemId;
        //     data.dataParent = element.dataParent;
        //     data.dataVal = element.defaultVal;
        //     data.porder = index;
        //     param_in_data.push(data);
        // });
        data.param_in = JSON.stringify( this.form.inputParamList);
        // let param_out_data = [];
        // this.form.outputParamList.forEach((element,index) => {
        //     let data = {};
        //     data.titleName = element.titleName;
        //     data.paramName = element.name;
        //     data.paramPath = element.paramPath;
        //     data.paramValType = element.type;
        //     data.porder = index;
        //     param_out_data.push(data);
        // });
        data.param_out = JSON.stringify(this.form.outputParamList);
        if(this.refId != 0){
            data.ref_id = this.refId;
        }
        saveConnectorInfo(data).then((response) => {
            this.loading = false;
            let doObj = {}
            doObj.action = 'saveConnectorInfo';
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
        });

      },
      selectConnector(flag,item){
        window.convm.needIngItem = item;
        let _url = '/flowform/index.html#/selectConnector/'+this.operateId+'/0/0/'+flag;
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
     },
     addInputItem(){
         this.form.inputParamList.push({})
     },
     deleteInputItem(index){
       this.form.inputParamList.splice(index,1);
     }
  },
  watch: {
     "form.refType":{
         handler(newValue,oldValue){
             if(newValue != oldValue && this.needConfirm){
                let that  = this;

                let confirmYesFunc = function(){
                    that.form.selectType = "1",
                    that.form.selectMult = "1",
                    that.form.inputParamList = [],
                    that.form.outputParamList = [],
                    that.form.connectorTypeIndex = "",
                    that.form.connectorType = "",
                    that.form.connectorTypeName = "",
                    that.form.connectorNum = 0,
                    that.form.connectorIndex = "",
                    that.form.connectorId = "",
                    that.form.connectorName = "",
                    that.form.apiNum = 0,
                    that.form.connectName = "",
                    that.form.apiId = "",
                    that.form.apiName = "",
                    that.form.apiIndex = "",
                    that.form.inputList = 0,
                    that.form.outputList = 0,
                    that.form.agentId = "",
                    that.form.agentName = "",
                    that.form.itCatId = "1",
                    that.form.ifParams = "";
                    that.url.pc_url = "";
                    that.url.mobile_url = "";
                    that.needConfirm = true;
                    console.log(that.refId);
                    that.getAgentList();
                    if(that.refId != 0){
                       that.loadConnectorInfo();

                    }
                }

                let confirmCancelFunc = function(){
                    that.$set(that.form,"refType",oldValue);

                }

                let options = {
                    type: 'warning',
                    lockScroll:false
                }
                EcoMessageBox.confirm('切换会导致未保存数据丢失，确认切换吗','提示',options,confirmYesFunc,confirmCancelFunc);

            }

                 this.needConfirm = !this.needConfirm;

         },
     }
  }
}
</script>
<style scoped>
.apiSetting{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
.container{
    padding: 20px 12px 10px;
}
.apiSetting .btn{
  text-align: right;
  margin:20px 10px;
}
.apiSetting .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}
.qiehuan{
    height: 32px;
    line-height: 32px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 28px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 1px;
    cursor: pointer;
}
.icon-act {
    color: #1ba5fa;
    margin-right: 8px;
    margin-left: 15px;
    position: relative;
    top: 2px;
}
</style>
