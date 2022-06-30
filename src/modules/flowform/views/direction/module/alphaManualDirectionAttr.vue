<template>
    <div class="dirctionAttr">
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" @click="save" type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="AlphaManual" name="first">
              <el-form  ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                 <div class="multipleformItem">
                     <el-form-item  size="medium" prop="taskName">
                      <span style="color: #262626;" slot="label">环节名称
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-input v-model="task_model.taskName"></el-input>

                    </el-form-item>
                    <el-form-item  size="medium">
                      <span style="color: #262626;" slot="label">选择办理人员
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">当前环节抄送人员的确定方式。有一<br/>种选择方式：1）指定人员或角色；</div>
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-radio-group v-model="task_model.selectAssignee.type">
                        <el-radio-button label="2">指定人员或角色</el-radio-button>
                        <el-radio-button label="3">关联流程数据</el-radio-button>
                      </el-radio-group>
                      <div>
                          <cirle-select style="margin-top:20px;" v-if="task_model.selectAssignee.type==2" :initDataStr="selectOrgValue" :initOptions="{selectType:'User-Role'}" @callBack="selCallBack"></cirle-select>
                          <el-cascader
                              v-if="task_model.selectAssignee.type==3"
                              size="medium"
                              v-model="select_assignee_3.dParent"
                              :options="directionData.select_assignee_3"
                              style="width:200px;margin-top:20px;"
                              @change="handleSelctAssignee"
                              ref="select_assignee_3"
                              :props="{ disabled:'disabled1', label:'optionName',value:'optionId',children:'deriveItems'}"

                            >
                             <template slot-scope="{ node, data }">
                              <span>{{ data.optionName }}</span>
                              <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                            </template>
                          </el-cascader>
                          <el-select  v-if="task_model.selectAssignee.type==3 && select_assignee_3.dParent && showOrgLevel" @change="orgLevelChange" clearable size="medium" style="width: 160px;" v-model="select_assignee_3.orgLevel">
                            <el-option
                                :key="index"
                                v-for="(item,index) in directionData.select_assigee_orglevelkv"
                                :label="item.text?'所在'+item.text+'的':' '"
                                :value="item.id">
                                </el-option>
                          </el-select>
                            <el-select  v-if="task_model.selectAssignee.type==3 && ((select_assignee_3.orgLevel && select_assignee_3.orgLevel != 0) || !showOrgLevel)" size="medium" style="width: 160px;" v-model="select_assignee_3.roleNum">
                            <el-option
                                :key="index"
                                v-for="(item,index) in directionData.select_assigee_rolekv"
                                :label="item.text?item.text:' '"
                                :value="item.id">
                                </el-option>
                          </el-select>
                      </div>
                    </el-form-item>
                 </div>
                  <el-form-item class="formItem" label="URL类型" size="medium">
                      <el-radio-group v-model="linkData.it_catid">
                        <el-radio-button label="1">内部模块</el-radio-button>
                        <el-radio-button label="2">外部链接</el-radio-button>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item v-show="linkData.it_catid == 1" class="formItem" label="模块选择" size="medium">
                       <el-select  clearable value-key="biz_code" size="medium" style="width: 160px;" placeholder="请选择" v-model="linkData.it_agentname" @change="itAgentChange">
                            <el-option
                                :key="index"
                                v-for="(item,index) in directionData.biz_list"
                                :label="item.biz_name?item.biz_name:' '"
                                :value="item">
                             </el-option>
                       </el-select>
                  </el-form-item>
                  <el-form-item v-show="linkData.it_catid == 2" class="formItem" label="URL地址（PC)" size="medium">
                       <el-input v-model="linkData.pc_url" clearable></el-input>
                  </el-form-item>
                   <el-form-item v-show="linkData.it_catid == 2" class="formItem" label="URL地址（Mobile）" size="medium">
                      <el-input v-model="linkData.mobile_url" clearable></el-input>
                  </el-form-item>
                  <el-form-item class="formItem" label="输入参数配置" size="medium">
                    <el-table

                        size="medium"
                        class="list"
                        :data="inputParamList"
                        style="width: 100%;">
                        <el-table-column
                            prop="paramName"
                            label="请求参数"
                            show-overflow-tooltip
                            >
                            <template slot-scope="scope">
                                <i class="iconfont icon-act iconhandright" v-if="scope.row.paramPath"></i>

                                <el-input v-model="scope.row.paramName"  style="width:220px;"></el-input>
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
                                    <div class="qiehuan"  @click="deleteInputItem(scope.$index)" style="color:rgb(245, 108, 108)">
                                        <i class="iconfont icon iconshanchudelete30"></i>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="addBtn" style="margin-top: 20px">
                        <el-button size="medium" @click="addInputItem">添加一行</el-button>
                    </div>
                </el-form-item>
                 <el-form-item class="formItem" label="备注" size="medium">
                    <el-input v-model="task_model.comments"></el-input>
                  </el-form-item>
                  <!-- <el-form-item class="formItem" label="操作提示" size="medium">
                    <el-input v-model="task_model.inst"></el-input>
                  </el-form-item> -->
              </el-form>
            </el-tab-pane>

        </el-tabs>

    </div>
</template>
<script>
import {updateWorkTaskModel} from '../../../service/service.js'
import cirleSelect from './cirleSelect.vue'
import {mapState,mapMutations} from 'vuex'
import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
export default{
  name:'dirctionAttr',
  data(){
    return {
        activeName:"first",
        task_model:{

        },
        task_itempvg:[],
        rules: {
          taskName: [
            { required: true,  trigger: 'blur' },
            { max: 50, trigger: 'blur' }
          ],
        },
        linkData:{
            ref_type:"5",
            it_catid:"1",
            it_agent:"",
            it_agentname:"",
            pc_url:"",
            mobile_url:"",
            sc_id:"",
            param_in:""
        },
        modelData:[],
        inputParamList:[],
        select_assignee_3:{
          lgId:"0",
          mdId:"",
          dataId:"",
          dParent:'',
          orgLevel:'0',
          roleNum:''
        },
        itempvgqx:0,
        assigneqx:0,
        isEdit:false,
        loading:false,
        type:2,
         showOrgLevel:true,
        selectOrgValue:"",
          needIngItem:{},//当前需要回写的项,
         //选人属性
    }
  },
  components:{
    cirleSelect
  },
   props:{
        dialogVisible: {
            type: Boolean
        }
    },
  created(){
      this.init();
        window.convm = this;
  },
  mounted(){
        this.bindAction();
  },
  computed:{
      ...mapState([
        'directionData',
        'operate_id'
    ]),
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
      init(){
        this.task_model = this.directionData.task_model;
        this.selectOrgValue = this.task_model.selectAssignee && this.task_model.selectAssignee.type==2  && this.task_model.selectAssignee.logicList.length>0? this.task_model.selectAssignee.logicList[0].target:"";
        if(typeof this.selectOrgValue != "string"){
          this.selectOrgValue = "";
        }
        this.select_assignee_3.mdId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].mdId:"";
        this.select_assignee_3.dParent = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
        this.select_assignee_3.dataId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
        if( this.task_model.selectAssignee.type==3 && this.task_model.selectAssignee.logicList.length>0){
          let target = this.task_model.selectAssignee.logicList[0].target;
          this.select_assignee_3.mdId = target.mdId;
          this.select_assignee_3.lgId = target.lgId;
          this.select_assignee_3.dataId = target.dataId;
          this.select_assignee_3.dParent = target.dParent.split(',');
          this.select_assignee_3.orgLevel = target.orgLevel;

          this.select_assignee_3.roleNum = target.roleNum;
          if(target.orgLevel == 0 && target.roleNum !=0){
              this.showOrgLevel = false;
          }
        }
        this.modelData = this.directionData.model_options;
        if(this.task_model.performer){
            this.inputParamList = this.task_model.performer.inlist && this.task_model.performer.inlist.length>0?this.transformData(this.task_model.performer.inlist):[];
            this.linkData.it_catid = this.task_model.performer.itCat?this.task_model.performer.itCat:"1";
            this.linkData.it_agent = this.task_model.performer.itAgent?this.task_model.performer.itAgent:"";
            this.linkData.it_agentname = this.task_model.performer.itAgentName?this.task_model.performer.itAgentName:"";
            this.linkData.sc_id = this.task_model.performer.scId?this.task_model.performer.scId:"";
        }

      },
      hideDialog(){
          // this.$emit('update:dialogVisible', false);
          this.$emit('hideDialog');
      },
       handleClick(tab, event) {

      },

      selCallBack(data){
          this.selectOrgValue = data.id;
      },
      handleSelctAssignee(value){
          let node = this.$refs["select_assignee_3"].getCheckedNodes()[0].data;
          this.select_assignee_3.mdId = node.mdId;
          this.select_assignee_3.roleNum = '';
          this.select_assignee_3.orgLevel = '0';
          this.select_assignee_3.dataId = value[value.length-1];
          this.showOrgLevel = true;
          if(node.hasOwnProperty('orgSelectStatement') && node.orgSelectStatement.catEnum == "DEPT"){
              this.showOrgLevel = false;
              this.select_assignee_3.roleNum = this.directionData.select_assigee_rolekv&& this.directionData.select_assigee_rolekv.length >0 ?this.directionData.select_assigee_rolekv[0].id:'';
          }
      },
      orgLevelChange(value){
          if(value){
              this.select_assignee_3.roleNum = this.directionData.select_assigee_rolekv&& this.directionData.select_assigee_rolekv.length >0 ?this.directionData.select_assigee_rolekv[0].id:'';
          }else{
              this.select_assignee_3.roleNum = '';
          }
      },
      itAgentChange(item){
          this.linkData.it_agent = item.biz_code;
           this.linkData.it_agentname = item.biz_name;
          this.inputParamList = [];
          if(item.input_params.length>0){
              let param_in_data = item.input_params;
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
                    this.inputParamList.push(data);
                });
          }

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
                        this.$set(item,'dataParent_temp',item.dataModelId.split(','));
                        this.$set(item,'showRightApiInput',true);
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
      addInputItem(){
         this.inputParamList.push({})
      },
      deleteInputItem(index){
        this.inputParamList.splice(index,1);
      },
       async save(){
        let valid = true;
        this.$refs['taskModelForm'].validate((result) => {
          valid = result;
        });

        // if(!this.task_model.select_asn_val){
        //    valid = false;
        //    this.$notify.error({
        //     title: '错误',
        //     message: '请选择人员'
        //   });
        // }
        if(!valid) return;
        this.isEdit = false;
        this.task_model.operate_id = this.operate_id;
        this.task_model.select_asn_type = this.task_model.selectAssignee.type;
        if(this.task_model.select_asn_type == 2){
            this.task_model.select_asn_val =  this.selectOrgValue;
        }
        if(this.task_model.select_asn_type == 3){
          if(typeof this.select_assignee_3.dParent == "object"){
              this.select_assignee_3.dParent = this.select_assignee_3.dParent.join(',');
          }
          if(!this.select_assignee_3.roleNum){
              this.select_assignee_3.roleNum = '';
          }
          this.task_model.select_asn_val = "0@"+JSON.stringify(this.select_assignee_3);
        }
        this.task_model.select_asn_lg = 0; //暂时默认写死
        this.$emit('saveLoading');
        this.linkData.param_in = JSON.stringify(this.inputParamList);
        this.task_model = Object.assign({},this.task_model,this.linkData);

        console.log(this.task_model);
        await updateWorkTaskModel(this.task_model).then((response) => {
            this.$emit('closeSaveLoading');
            if(response.data.status <100){
                this.$emit('closeSaveLoading',this.task_model.taskName);
                this.$message({
                    showClose: true,
                    duration:2000,
                    message: '保存成功',
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.isEdit = false;
            }
        }).catch((error) => {
            this.$emit('closeSaveLoading');
        });

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
       selectConnector(flag,item){
        window.convm.needIngItem = item;
        let _url = '/flowform/index.html#/selectConnector/'+this.operateId+'/0/0/'+flag;
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
     },

  },
  watch: {
     task_model:{
        handler(newValue, oldValue) {
            if(oldValue.taskName){
                this.isEdit = true;
            }
　　　　  },
　　　　  deep: true
     }
  }
}
</script>
<style scoped>
.dirctionAttr{
    height: 100%;
}
.dirctionAttr .btngroup{
    position: absolute;
    right: 24px;
    height: 60px;
    line-height: 60px;
    z-index: 888;
}
.dirctionAttr .formItem,.dirctionAttr .multipleformItem{
    padding: 10px 24px 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    margin: 0px;
}
.dirctionAttr .multipleformItem .el-form-item{
    margin: 0px;
}
.dirctionAttr .quickItem{
    border-bottom: 1px solid #e8e8e8;
    padding: 12px 24px;
    background: #fafafa;
    text-align: right;
}
.dirctionAttr .hjItem{
    padding: 12px 24px;
    border-bottom: 1px solid #e8e8e8;
}
.dirctionAttr .hjItem:hover{
    background: #fafafa;
}
.dirctionAttr .el-row{
    line-height: 30px;
}
.iconbangzhu-kong{
    position: relative;
    left: 5px;
    top: 1px;
    float: none !important;
}
.dirctionAttr .xjspyj{
    position:absolute;
    right:24px;
    color: #595959;
    cursor: pointer;
}
.dirctionAttr .xjspyj:hover{
    color: #1ba5fa;
}
.dirctionAttr .xjspyj .icon{
    color: #1ba5fa;
    font-size: 18px;
    line-height: 18px;
}
.el-radio__label{
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
}
.dirctionAttr .checkItem {
  padding: 10px 24px 20px 24px;
   border-bottom: 1px solid #e8e8e8;
}
.dirctionAttr .checkItem .checkOption{
    padding: 16px;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
}
.dirctionAttr .checkItem .icon{
  cursor: pointer;
  position: relative;
  top: 1px;
}
.dirctionAttr .qiehuan{
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
.dirctionAttr .icon-act {
    color: #1ba5fa;
    margin-right: 8px;
    margin-left: 15px;
    position: relative;
    top: 2px;
}
</style>
