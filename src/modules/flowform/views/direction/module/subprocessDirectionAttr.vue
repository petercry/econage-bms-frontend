<template>
    <div class="dirctionAttr">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" @click="save" type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!isCustomer">
            <el-tab-pane label="基本属性" name="first">
              <div v-loading="loading">
                  <el-form ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                      <el-form-item  class="formItem" size="medium" prop="taskName">
                          <span style="color: #262626;" slot="label">环节名称
                            <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                              <i class="iconfont icon iconbangzhu-kong"></i>
                            </el-tooltip>
                          </span>
                          <el-input v-model="task_model.taskName"></el-input>
                          <div class="flowLevel">环节层级：<span>{{task_model.taskLevel}}</span></div>
                      </el-form-item>
                      <el-form-item  class="formItem" label="选择流程模板" require="true" size="medium" >
                          <el-select placeholder="--选择流程模板--" v-model="task_model.subWf" filterable style="width:250px;" >
                              <el-option
                                :key="index"
                                v-for="(item,index) in directionData.wf_models.list"
                                :label="item.name"
                                :value="item.wfTempId">
                              </el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item   class="formItem" label="选择发起人" size="medium" >
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
                      <el-form-item  class="formItem" label="设置数据相关" size="medium">
                          <el-button class="btn" size="medium" @click="openGLSJ" plain>设置数据关联</el-button>
                      </el-form-item>
                      <el-form-item  class="formItem inline" label="子流程发起后自动提交" size="medium">
                          <el-switch
                            v-model="task_model.subStatement.autoSubmit" :active-value="1" :inactive-value="0">
                          </el-switch>
                      </el-form-item>
                      <el-form-item  class="formItem inline" label="允许子流程查看主流程" size="medium">
                          <el-switch
                            v-model="task_model.subStatement.subWfview" :active-value="1" :inactive-value="0">
                          </el-switch>
                      </el-form-item>
                      <el-form-item  class="formItem inline" label="允许主流程查看子流程" size="medium">
                          <el-switch
                            v-model="task_model.subStatement.wfSubview" :active-value="1" :inactive-value="0">
                          </el-switch>
                      </el-form-item>
                  </el-form>
              </div>
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="isCustomer">
            <el-tab-pane label="基本属性" name="first">
              <div v-loading="loading">
                  <el-form ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                      <el-form-item  class="formItem" size="medium" prop="taskName">
                          <span style="color: #262626;" slot="label">环节名称
                            <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                              <i class="iconfont icon iconbangzhu-kong"></i>
                            </el-tooltip>
                          </span>
                          <el-input v-model="task_model.taskName"></el-input>

                      </el-form-item>
                      <el-form-item  class="formItem" label="选择流程模板" require="true" size="medium" >
                          <el-select placeholder="--选择流程模板--" v-model="task_model.subWf" filterable style="width:250px;" >
                              <el-option
                                :key="index"
                                v-for="(item,index) in directionData.wf_models.list"
                                :label="item.name"
                                :value="item.wfTempId">
                              </el-option>
                          </el-select>
                      </el-form-item>

                      <el-form-item  class="formItem" label="设置数据相关" size="medium">
                          <el-button class="btn" size="medium" @click="openGLSJ" plain>设置数据关联</el-button>
                      </el-form-item>
                  </el-form>
              </div>
            </el-tab-pane>

        </el-tabs>

        <el-dialog class="glsj" append-to-body :visible.sync="glsjDialogVisible" :before-close="dataMapClose">
          <div slot="title" class="glsj-title">
             设置关联数据
          </div>
          <div class="dalog-body">
              <div v-loading="glsjLoading">
                <div class="content">
                    <p class="sub-title">当主流程触发子流程时,将按照下列规则把主流程的值填充至子流程</p>
                    <div class="content-contain">
                        <div class="left-box">
                          <span>主流程</span>
                        </div>
                        <div class="arrow-box"></div>
                        <div class="right-box">
                          <span>子流程</span>
                        </div>
                        <div style="margin-bottom:10px;"  v-for="(item,index) in firstItems" :key="index">
                            <div class="left-box">
                                <!-- <el-select size="medium" @change="modelSelect($event,firstMap,item,'from')" style="width: 155px;" v-model="item.formIndex">
                                      <el-option
                                      v-for="(item,key,index) in firstMap.fromDataModel"
                                        :key="index"
                                        :label="item.model.mdName"
                                        :value="key">
                                      </el-option>
                                </el-select>
                                <el-select v-if="item.formIndex !== '' && firstMap.fromDataModel[item.formIndex] && firstMap.fromDataModel[item.formIndex].items" size="medium" style="width: 150px;" v-model="item.fItem">
                                  <el-option
                                    v-for="(item,index)  in firstMap.fromDataModel[item.formIndex].items"
                                    :key="index"
                                    :label="item.dataName"
                                    :value="item.dataId">
                                  </el-option>
                                </el-select> -->
                                 <el-cascader
                                  size="medium"
                                  style="width:200px;"
                                   v-model="item.fParent_temp"
                                  :options="firstMap.fromDataModel"
                                  @change="modelSelect('first',index,firstMap,item,'from')"
                                  :ref="'firstModelOptionsfrom'+index"
                                  :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"

                                >
                                <template slot-scope="{ node, data }">
                                  <span>{{ data.optionName }}</span>
                                  <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                                  <el-tooltip class="item" effect="dark" :content="item.fParent" style="display:inline-block;" placement="top">
                                       <div  >
                                       <el-input class="pointerCalss" style="width:110px;"  size="medium" :readonly="true" @click.native="needIngItem=item;selectPrintList()" v-model="item.fParent" type="text" v-if="item.fType == 5">
                                        </el-input>
                                       </div>
                                  </el-tooltip>

                            </div>

                            <div class="arrow-box">
                                <i style="font-size: 25px;position:relative;top:3px;" class="iconfont icon iconarrowright"></i>
                            </div>
                            <div class="right-box">
                                <!-- <el-select size="medium" @change="modelSelect($event,firstMap,item,'to')" style="width: 155px;" v-model="item.toIndex">
                                      <el-option
                                      v-for="(item,key,index) in firstMap.toWfModel"
                                        :key="index"
                                        :label="item.model.name"
                                        :value="key">
                                      </el-option>
                                </el-select>
                                <el-select v-if="item.toIndex !== '' && firstMap.toWfModel[item.toIndex] && firstMap.toWfModel[item.toIndex].items" size="medium"  style="width: 130px;" v-model="item.tItem">
                                  <el-option
                                    v-for="(item,index)  in firstMap.toWfModel[item.toIndex].items"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id">
                                  </el-option>
                                </el-select> -->
                                <el-cascader
                                  size="medium"
                                  style="width:200px;"
                                  v-model="item.tParent_temp"
                                  :options="firstMap.toWfModel"
                                  @change="modelSelect('first',index,firstMap,item,'to')"
                                  :ref="'firstModelOptionsto'+index"
                                  :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"

                                >
                                <template slot-scope="{ node, data }">
                                  <span>{{ data.optionName }}</span>
                                  <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                                 <i class="iconfont icon iconclosecircleo" @click="deleteFlowItem(index,firstItems)"></i>
                            </div>
                        </div>
                        <div class="btn-line">
                            <div class="btn-item">
                              <el-button size="medium"  @click="addFlowItem(firstItems)" type="text"><i class="iconfont icon iconicon-test"></i> 添加关联规则</el-button>
                            </div>
                            <div class="btn-item">
                              <el-dropdown trigger="click" @command="handleCommand($event,firstMap,firstItems)">
                                  <span class="el-dropdown-link">
                                    快捷设置<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="bizLink">一键添加相同自定义标识组件关联</el-dropdown-item>
                                    <el-dropdown-item command="nameLink">一键添加同名组件关联</el-dropdown-item>
                                  </el-dropdown-menu>
                              </el-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <p class="sub-title">当子流程流转完成后，将按照下列规则把子流程的值填充至主流程</p>
                    <div class="content-contain">
                        <div class="left-box">
                          <span>子流程</span>
                        </div>
                        <div class="arrow-box"></div>
                        <div class="right-box">
                          <span>主流程</span>
                        </div>
                        <div style="margin-bottom:10px;"  v-for="(item,index) in secondItems" :key="index">
                            <div class="left-box">
                                <!-- <el-select size="medium" @change="modelSelect($event,secondMap,item,'from')" style="width: 155px;" v-model="item.formIndex">
                                      <el-option
                                      v-for="(item,key,index) in secondMap.fromDataModel"
                                        :key="index"
                                        :label="item.model.mdName"
                                        :value="key">
                                      </el-option>
                                </el-select> -->
                                <el-cascader
                                  size="medium"
                                  style="width:200px;"
                                  v-model="item.fParent_temp"
                                  :options="secondMap.fromDataModel"
                                  @change="modelSelect('second',index,secondMap,item,'from')"
                                  :ref="'secondModelOptionsfrom'+index"
                                  :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"

                                >
                                <template slot-scope="{ node, data }">
                                  <span>{{ data.optionName }}</span>
                                  <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                                <el-tooltip class="item" effect="dark" :content="item.fParent" style="display:inline-block;" placement="top">
                                       <div  >
                                       <el-input class="pointerCalss" style="width:110px;"  size="medium" :readonly="true" @click.native="needIngItem=item;selectPrintList(1)" v-model="item.fParent" type="text" v-if="item.fType == 5">
                                        </el-input>
                                       </div>
                                  </el-tooltip>

                            </div>
                            <div class="arrow-box">
                                <i style="font-size: 25px;position:relative;top:3px;" class="iconfont icon iconarrowright"></i>
                            </div>
                            <div class="right-box">
                                <!-- <el-select size="medium" @change="modelSelect($event,secondMap,item,'to')" style="width: 155px;" v-model="item.toIndex">
                                      <el-option
                                      v-for="(item,key,index) in secondMap.toWfModel"
                                        :key="index"
                                        :label="item.model.name"
                                        :value="key">
                                      </el-option>
                                </el-select>
                                <el-select v-if="item.toIndex !== '' && secondMap.toWfModel[item.toIndex] && secondMap.toWfModel[item.toIndex].items" size="medium"  style="width: 130px;" v-model="item.tItem">
                                  <el-option
                                    v-for="(item,index)  in secondMap.toWfModel[item.toIndex].items"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id">
                                  </el-option>
                                </el-select> -->
                                <el-cascader
                                  size="medium"
                                  style="width:200px;"
                                   v-model="item.tParent_temp"
                                  :options="secondMap.toWfModel"
                                  @change="modelSelect('second',index,secondMap,item,'to')"
                                  :ref="'secondModelOptionsto'+index"
                                  :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"

                                >
                                <template slot-scope="{ node, data }">
                                  <span>{{ data.optionName }}</span>
                                  <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                                <i class="iconfont icon iconclosecircleo" @click="deleteFlowItem(index,secondItems)"></i>
                            </div>
                        </div>
                        <div class="btn-line">
                            <div class="btn-item">
                              <el-button size="medium"  @click="addFlowItem(secondItems)" type="text"><i class="iconfont icon iconicon-test"></i> 添加关联规则</el-button>
                            </div>
                            <div class="btn-item">
                              <el-dropdown trigger="click" @command="handleCommand($event,secondMap,secondItems)">
                                  <span class="el-dropdown-link">
                                    快捷设置<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="bizLink">一键添加相同自定义标识组件关联</el-dropdown-item>
                                    <el-dropdown-item command="nameLink">一键添加同名组件关联</el-dropdown-item>
                                  </el-dropdown-menu>
                              </el-dropdown>
                            </div>

                        </div>
                    </div>
                </div>
              </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click="dataMapClose">取 消</el-button>
            <el-button size="medium" type="primary" @click="dataMapSave">保 存</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import cirleSelect from './cirleSelect.vue'
import {updateSubProcessTaskModel,getRenderSubwfDatamap,updateSubwfDatamap,getPrintSetList} from '../../../service/service.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'

export default{
  name:'dirctionAttr',
  data(){
    return {
        activeName:"first",

        task_model:{

        },
        dataMap:{

        },

        firstMap:{},
        firstItems:[],
        secondMap:{},
        secondItems:[],
        rules: {
          name: [
            { required: true,  trigger: 'blur' },
            { max: 50, trigger: 'blur' }
          ],
        },
        isEdit:false,
        glsjDialogVisible:false,
        loading:false,
        glsjLoading:true,
        //选人属性
        _options:{
           selectType:1,
          idType:3,
          selectNum:1,
          beginId:2
        },
        select_assignee_3:{
          lgId:"0",
          mdId:"",
          dataId:"",
          dParent:'',
          orgLevel:'0',
          roleNum:''
        },
        showOrgLevel:true,
        selectOrgValue:"",
        needIngItem:{}
    }
  },
  components:{
    cirleSelect,
    ecoLoading
  },
   props:{
        dialogVisible: {
            type: Boolean
        },
        roleObj: {
            type: Object

        }
    },
  created(){
      this.init();
  },
  mounted(){
      this.bindAction();
  },
  computed:{
     ...mapState([
        'directionData',
        'operate_id'
    ]),
    isCustomer(){
      return !this.roleObj.sysAdmin && this.roleObj.branchDeptEnabled;
    }
  },
  methods: {
      bindAction(){
            let that = this;
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'selectPrintSet'){
                    let array = obj.data;
                    if(array.length == 1){
                      that.needIngItem.fParent = array[0].set_name;
                      that.needIngItem.fItem = array[0].id;
                    }else if (array.length > 1){
                      let str_array = [];
                      let id_array = [];
                      array.forEach(element => {
                        str_array.push(element.set_name);
                        id_array.push(element.id);
                      });
                      that.needIngItem.fParent = str_array.join(',');
                      that.needIngItem.fItem = id_array.join(',');
                    }
                }
            }

            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'subprocessDirection');
      },
      init(){
        this.task_model = this.directionData.task_model;
        this.task_model.subWf = this.task_model.subWf ? this.task_model.subWf:"";
        this.selectOrgValue = this.task_model.selectAssignee.logicList && this.task_model.selectAssignee.logicList.length>0? this.task_model.selectAssignee.logicList[0].target:"";
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
      },
      // modelSelect(index,map,item,type){
      //   if(type == 'from'){
      //     item.fCat = map.fromDataModel[index].model.mdId;
      //     item.fType = map.fromDataModel[index].mapType;
      //     this.$set(item,'fItem','');
      //   }
      //   if(type == 'to'){
      //     item.tCat = map.toWfModel[index].model.code;
      //     item.tType = map.toWfModel[index].mapType;
      //     this.$set(item,'tItem','');
      //   }
      //   item.mpId = map.mpId;
      // },
      modelSelect(num,index,map,item,type){
        let model = num+'ModelOptions'+type+index;
        let node = this.$refs[model][0].getCheckedNodes()[0].data;
        if(type == 'from'){
          this.$set(item,'fParent',item.fParent_temp.join(','));
          item.fCat = item.fParent_temp[0];
          item.fType = node.mapType;

          this.$set(item,'fItem',item.fParent_temp[item.fParent_temp.length-1]);
          if(node.modelType == "ATTACHEMENT" && node.mdId == '5'){
                item.fCat = '5';
                item.fItem = '';
                this.$set(item,'fParent','');
                  this.needIngItem = item;
                  if(num == "first"){
                      this.selectPrintList();
                  }else if(num == "second"){
                      this.selectPrintList(1);
                  }

          }
        }
        if(type == 'to'){
          item.tCat = item.tParent_temp[0];
          item.tType = item.tParent_temp[0];

          this.$set(item,'tItem',item.tParent_temp[item.tParent_temp.length-1]);
        }
        item.mpId = map.mpId;
      },
      hideDialog(){
          this.$emit('hideDialog');
      },
      addFlowItem(singleItem){
          let obj = {
          }
          this.$set(obj,'formIndex','');
          this.$set(obj,'toIndex','');
          singleItem.push({})
      },
      deleteFlowItem(index,items){
          items.splice(index, 1);
      },
      handleClick(tab, event) {
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
      openGLSJ(){
        if(!this.task_model.subWf) return this.$notify.error({
          title: '错误',
          message: '请选择流程模板'
        });

        let data = {
            operate_id:this.operate_id,
            sub_wf_id:this.task_model.subWf,
            output_mapping:this.task_model.subStatement.outputMapping,
            input_mapping:this.task_model.subStatement.inputMapping
        }
        this.glsjDialogVisible = true;
        this.glsjLoading = true;
        getRenderSubwfDatamap(data).then((response) => {
            this.glsjLoading = false;
            if(response.data.status<100){
                this.dataMap = response.data.remap.datamap;
                for(let key in this.dataMap){
                    if(this.dataMap[key].toWf == this.task_model.subWf){
                        this.firstMap = this.dataMap[key];
                    }else{
                        this.secondMap = this.dataMap[key];
                    }
                }
                if(this.firstMap.items){
                    this.firstItems = this.firstMap.items;
                    this.firstItems.forEach(item => {
                      item.tParent = item.tItem?item.tCat + ',' + item.tItem :"";
                      this.$set(item,'fParent_temp',item.fParent.split(','));
                      this.$set(item,'tParent_temp',item.tParent.split(','));
                      this.$set(item,'tItem',item.tItem);
                      if(item.fCat == 5){
                        item.fParent_temp = ['5'];
                      }
                    });
                }
                if(this.secondMap.items){
                    this.secondItems = this.secondMap.items;
                    this.secondItems.forEach(item => {
                      item.tParent = item.tItem?item.tCat + ',' + item.tItem :"";
                      this.$set(item,'fParent_temp',item.fParent.split(','));
                      this.$set(item,'tParent_temp',item.tParent.split(','));
                      this.$set(item,'tItem',item.tItem);
                      if(item.fCat == 5){
                        item.fParent_temp = ['5'];
                      }
                    });
                }


            }
        }).catch((error) => {
          console.log(error);
            this.glsjLoading = false;
        });

      },
      selCallBack(data){
          this.selectOrgValue = data.id;
      },
      save(){
          let valid = true;
          this.$refs['taskModelForm'].validate((result) => {
            valid = result;
          });
           if(this.task_model.selectAssignee.type == 2 && !this.selectOrgValue){
            valid = false;
            this.$notify.error({
              title: '错误',
              message: '请选择人员'
            });
          }
          if(!valid) return;
          this.isEdit = false;
          this.task_model.operate_id = this.operate_id;
          this.task_model.select_asn_type = this.task_model.selectAssignee.type;
          this.task_model.select_asn_lg = 0; //暂时默认写死
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
          this.$emit('saveLoading');
          updateSubProcessTaskModel(this.task_model).then((response) => {
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
      dataMapSave(){
          let data = {
              operate_id:this.operate_id,
              output_mapping:this.task_model.subStatement.outputMapping,
              input_mapping:this.task_model.subStatement.inputMapping,
              sub_wf_id:this.task_model.subWf,
              data_map:JSON.stringify(this.firstItems.concat(this.secondItems))
          }
          this.glsjLoading = true;
          updateSubwfDatamap(data).then((response) => {
            this.glsjLoading = false;
            if(response.data.status < 100){
              this.$message({
                  showClose: true,
                  duration:2000,
                  message: '保存成功',
                  customClass:'design-from-el-message',
                  type: 'success'
              });
               this.glsjDialogVisible = false;
            }
          }).catch((error) => {
            this.glsjLoading = false;
            this.$message({
                    showClose: true,
                    duration:2000,
                    message: '保存失败',
                    customClass:'design-from-el-message',
                    type: 'error'
                });
          });
      },
      dataMapClose(){
         this.$confirm('确定关闭吗？')
          .then(_ => {
            this.glsjDialogVisible = false;
            this.firstItems = [];
            this.secondItems = [];

          })
          .catch(_ => {});

      },
      selectPrintList(flag){
        this.$refs.ecoLoadingRef.open();
         let wfTempId = this.$route.params.templateId;
         if(flag == 1){
           wfTempId = this.task_model.subWf;
         }
         getPrintSetList(wfTempId).then((response) => {
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
                    let url = '/flowform/index.html#/printSetListForMulit/'+wfTempId;
                    EcoUtil.getSysvm().openDialog('选择打印模板',url,_width,_height,'50px');

                }else if(len == 1 ){
                    this.needIngItem.fParent = print_set_list[0].set_name;
                    this.needIngItem.fItem = print_set_list[0].id;
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
     handleCommand(command,map,items){
       if(command == 'bizLink'){
         this.bizLink(map,items);
       }else if(command == 'nameLink'){
         this.nameLink(map,items);
       }
     },
     bizLink(map,items){
        let formData_from = map.fromDataModel[0].deriveItems;
        let opId_from = map.fromDataModel[0].optionId;
        let opId_to =map.toWfModel[0].optionId;
        let formData_to = map.toWfModel[0].deriveItems;

        if(formData_from && formData_from.length > 0 && formData_to && formData_to.length > 0){
          for(let i = 0;i<formData_from.length;i++){
               const item_from = formData_from[i];
               if(!item_from.itemDef) continue;
               //如果关联规则中已存在设置过的也过滤
               if(items.find(item => item.fItem == item_from.optionId)) continue;
               const item_to = formData_to.find(single => single.itemDef === item_from.itemDef);

               if(item_to){
                  let obj = {}
                  if(item_from.hasOwnProperty('deriveItems')){//下拉框 级联框 多选框等 默认选择主数据项
                    this.$set(obj,'fParent_temp',[opId_from,item_from.optionId,item_from.deriveItems[0].optionId]);
                  }else{
                    this.$set(obj,'fParent_temp',[opId_from,item_from.optionId]);
                  }
                  this.$set(obj,'fParent',obj.fParent_temp.join(','));
                  this.$set(obj,'fCat',obj.fParent_temp[0]);
                  this.$set(obj,'fType',item_from.mapType);
                  this.$set(obj,'fItem',obj.fParent_temp[obj.fParent_temp.length-1]);

                  this.$set(obj,'tParent_temp',[opId_to,item_to.optionId]);
                  this.$set(obj,'tCat',obj.tParent_temp[0]);
                  this.$set(obj,'tType',obj.tParent_temp[0]);
                  this.$set(obj,'tItem',obj.tParent_temp[obj.tParent_temp.length-1]);
                  this.$set(obj,'mpId',map.mpId);

                  items.push(obj);

               }

          }
        }
     },
     nameLink(map,items){
        let formData_from = map.fromDataModel[0].deriveItems;
        let opId_from = map.fromDataModel[0].optionId;
        let opId_to =map.toWfModel[0].optionId;
        let formData_to = map.toWfModel[0].deriveItems;

        if(formData_from && formData_from.length > 0 && formData_to && formData_to.length > 0){
          for(let i = 0;i<formData_from.length;i++){
               const item_from = formData_from[i];

               if(!item_from.optionName) continue;
                //如果关联规则中已存在设置过的也过滤
               if(items.find(item => item.fItem == item_from.optionId)) continue;
               const item_to = formData_to.find(single => single.optionName === item_from.optionName);
               if(item_to){
                  let obj = {}
                  if(item_from.hasOwnProperty('deriveItems')){//下拉框 级联框 多选框等 默认选择主数据项
                    this.$set(obj,'fParent_temp',[opId_from,item_from.optionId,item_from.deriveItems[0].optionId]);
                  }else{
                    this.$set(obj,'fParent_temp',[opId_from,item_from.optionId]);
                  }
                  this.$set(obj,'fParent',obj.fParent_temp.join(','));
                  this.$set(obj,'fCat',obj.fParent_temp[0]);
                  this.$set(obj,'fType',item_from.mapType);
                  this.$set(obj,'fItem',obj.fParent_temp[obj.fParent_temp.length-1]);

                  this.$set(obj,'tParent_temp',[opId_to,item_to.optionId]);
                  this.$set(obj,'tCat',obj.tParent_temp[0]);
                  this.$set(obj,'tType',obj.tParent_temp[0]);
                  this.$set(obj,'tItem',obj.tParent_temp[obj.tParent_temp.length-1]);
                  this.$set(obj,'mpId',map.mpId);

                  items.push(obj);

               }

          }
        }
     }
  },
  watch: {
     task_model:{
        handler(newValue, oldValue) {
            if(oldValue.taskName){
                this.isEdit = true;
            }
　　　　  },
　　　　  deep: true
     },
     'firstItems.length':{
        handler(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.firstItems.forEach((element,index) => {
                    element.orderId = index+1;
                });
            }
          }
      },
      'secondItems.length':{
        handler(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.secondItems.forEach((element,index) => {
                    element.orderId = index+1;
                });
            }
        }
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
.dirctionAttr .btn{
    background: #FFF;
    border-color: #409EFF;
    color: #409EFF;
}
.glsj .glsj-title{
    margin: 0;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
}
.glsj .dalog-body{
    padding: 24px 32px;
    box-sizing: content-box;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
}
.glsj .content{
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.glsj .content-contain{
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    text-align: center;
    padding-bottom: 15px;
}
.glsj .sub-title{
    text-align: left;
    line-height: 30px;
    margin-bottom: 0;
    margin-top: 15px;
}
.glsj .arrow-box{
    width:80px;
    display: inline-block;
    height: 36px;
    line-height: 27px;
}
.gjsj .arrow-box .icon{
    font-size: 25px;
    position: relative;
    top: 3px;
}
.glsj .left-box, .glsj .right-box{
    display: inline-block;
    width: 315px;
    text-align: left;
    box-sizing: border-box;
}
.glsj .left-box span, .glsj .right-box span{
    height: 48px;
    line-height: 48px;
}
.right-box .icon{
    margin-left: 3px;
    cursor: pointer;
    float: right;
    position: relative;
    top: 5px;
}
.glsj .btn-line{
    margin: 0 auto;
    border: 1px dashed #ddd;
    background-color: #fff;
    color: #1ba5fa;
    cursor: pointer;
    width: 733px;
    text-align: initial;
}
.glsj .btn-line .btn-item{
    width: 49%;
    display: inline-block;
    text-align: center;
    margin: 5px 0;
}
.glsj .btn-line .btn-item:first-child{
   border-right: 1px solid #ddd;
}
.glsj .btn-line .btn-item .el-button--medium{
    padding: 6px 20px;
}
.glsj .btn-line .btn-item .el-dropdown{
    color: #1ba5fa;
    font-weight: 500;
}
.flowLevel{
  display: block;
  font-size: 12px;
  margin-top: 10px;
  line-height: 1;
}
</style>
