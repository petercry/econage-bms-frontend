<template>
    <div class="dirctionAttr">
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" @click="save"  type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!isCustomer">
            <el-tab-pane label="基本属性" name="first">
              <el-form v-loading="loading" ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                 <el-form-item class="formItem" size="medium" prop="taskName">
                    <span style="color: #262626;" slot="label">环节名称
                      <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                        <i class="iconfont icon iconbangzhu-kong"></i>
                      </el-tooltip>
                    </span>
                    <el-input v-model="task_model.taskName"></el-input>
                    <div class="flowLevel">环节层级：<span>{{task_model.taskLevel}}</span></div>
                  </el-form-item>
                  <el-form-item  class="formItem inline" label="附件在线编辑" size="medium">
                      <el-switch
                        v-model="task_model.editInfo.fileEditable" :active-value="1" :inactive-value="0">
                      </el-switch>
                      <div style="display:inline-block;" v-show="task_model.editInfo.fileEditable == 1">
                        <div class="switch-inline">
                          <label>
                              留痕
                          </label>
                        <el-switch
                          v-model="task_model.editInfo.editTrace" :active-value="1" :inactive-value="0">
                        </el-switch>
                        </div>
                        <div class="switch-inline">
                          <label>
                              套红印章
                          </label>
                          <el-switch
                            v-model="task_model.editInfo.editRedhead" :active-value="1" :inactive-value="0">
                          </el-switch>
                        </div>
                      </div>
                  </el-form-item>
                  <el-form-item  class="formItem" label="按钮显示" size="medium">
                    <el-checkbox-group v-model="extParam.showBtnGroup">

                        <el-checkbox v-for="item in btnGroupArray" :label="item.value" :key="item.value" style="font-weight: normal;">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item  class="formItem" label="业务标识" size="medium">
                      <el-select size="medium" v-model="task_model.bizTag" style="width:100%;" clearable placeholder="请选择">
                            <el-option
                              :key="index"
                              v-for="(item,index) in directionData.biz_tag"
                              :label="item.text"
                              :value="item.idString">
                              </el-option>
                      </el-select>
                  </el-form-item>
                   <el-form-item class="formItem" label="备注" size="medium">
                    <el-input v-model="task_model.comments"></el-input>
                  </el-form-item>
                  <!-- <el-form-item class="formItem" label="操作提示" size="medium">
                    <el-input v-model="task_model.inst"></el-input>
                  </el-form-item> -->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="组件权限" name="second">
                <div v-loading="loading">
                  <div class="quickItem">
                      <span style="margin-right:15px;color: #8b8b8b;">快速选择</span>
                       <el-checkbox-group @change="qxChange" v-model="itempvgqx">
                          <el-checkbox-button label="1" >操作</el-checkbox-button>
                          <el-checkbox-button label="2">只读</el-checkbox-button>
                          <el-checkbox-button label="3">隐藏</el-checkbox-button>
                        </el-checkbox-group>
                  </div>
                  <div class="hjItem" v-for="(item,index) in task_itempvg" :key="index">
                      <el-row>
                          <el-col :span=12>
                            <span style="color: #262626;">{{item.itemName}} <span style="font-size:12px;color:#8b8b8b;">[{{item.type_desc}}]</span></span>
                          </el-col>
                          <el-col :span=12 style="text-align:right;">
                            <el-checkbox-group @change="hjChange($event,item)" v-model="item.value">
                                  <el-checkbox-button label="1" >操作</el-checkbox-button>
                                  <el-checkbox-button label="2">只读</el-checkbox-button>
                                  <el-checkbox-button label="3">隐藏</el-checkbox-button>
                                </el-checkbox-group>
                          </el-col>
                      </el-row>
                  </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="环节选人权限" name="third">
                <div v-loading="loading">
                  <div class="quickItem">
                      <span style="margin-right:15px;color: #8b8b8b;">快速选择</span>
                      <el-checkbox-group @change="assigneqxChange" v-model="assigneqx">
                          <el-checkbox-button label="1" >操作</el-checkbox-button>
                          <el-checkbox-button label="2">只读</el-checkbox-button>
                      </el-checkbox-group>
                  </div>
                  <div class="hjItem" v-for="(item,index) in task_assigneepvg" :key="index">
                      <el-row>
                          <el-col :span=12>
                            <span style="color: #262626;">{{item.itemName}}</span>
                          </el-col>
                          <el-col :span=12 style="text-align:right;">
                            <el-checkbox-group @change="assignehjChange($event,item)" v-model="item.value">
                                <el-checkbox-button label="1" >操作</el-checkbox-button>
                                <el-checkbox-button label="2">只读</el-checkbox-button>
                              </el-checkbox-group>
                          </el-col>
                      </el-row>
                  </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="校验规则" name="fourth">
                <div v-loading="loading">
                    <div class="checkItem" v-for="(item,index) in checkItems" :key="index">
                        <p style="line-height: 40px;color: #262626;">校验规则 {{index+1}}  <i @click="deleteCheckItem(index)" class="iconfont icon iconclosecircleo" style="color:#1ba5fa;"></i>
                        </p>
                        <div class="checkOption">
                          <div>
                              <p style="line-height: 40px;"><span>校验条件</span></p>
                              <op-check :data="item.logicSet"></op-check>
                          </div>
                        </div>
                        <div>
                          <p style="line-height: 40px;color: #262626;">提示描述</p>
                          <div v-if="item.changeContent || item.cnModel != '0'" style="display:inline-block;">
                            <el-select size="medium" v-model="item.cnModel"  @change="contentFromSelect($event,item)">
                              <el-option v-for="(item,index) in contentFromOp" :key="index"

                                :label="item.optionName"
                                :value="item.mdId">

                              </el-option>
                            </el-select>
                            <el-input class="pointerCalss" size="medium" type="text" style="width: 200px;" readonly v-model="item.cnName" @click.native="needIngItem=item;selectConnector(3)">

                            </el-input>
                          </div>
                          <el-input v-else style="width:500px;" size="medium" v-model="item.content"></el-input>
                          <div class="qiehuan" @click="changeContentFrom(item)">
                              <i class="iconfont icon iconqiehuan"></i>
                          </div>
                        </div>
                    </div>
                    <div class="opCheck">
                        <div class="btn-line">
                              <el-button size="medium" @click="addCheckItem(checkItems)" type="text"><i class="iconfont icon iconicon-test"></i> 添加校验规则</el-button>
                          </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="isCustomer">
            <el-tab-pane label="基本属性" name="first">
                <el-form v-loading="loading" ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                    <el-form-item class="formItem" size="medium" prop="taskName">
                      <span style="color: #262626;" slot="label">环节名称
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-input v-model="task_model.taskName"></el-input>
                    </el-form-item>
                    <el-form-item class="formItem" label="备注" size="medium">
                      <el-input v-model="task_model.comments"></el-input>
                    </el-form-item>
                </el-form>

            </el-tab-pane>
        </el-tabs>

    </div>
</template>
<script>
import opCheck from './opCheck.vue'
import {mapState,mapMutations} from 'vuex'
import {updateTaskModel,getRenderTaskItempvg,getRenderTaskAssigneepvg,getRenderTaskInspectform,updateTaskItempvg,updateTaskInspectform} from '../../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
export default{
  name:'dirctionAttr',
  data(){
    return {
        activeName:"first",
        task_model:{

        },
        checkItems:[],
        rules: {
          taskName: [
            { required: true, message: '请输入环节名称', trigger: 'blur' },
            { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
          ],
        },
        task_itempvg:[],
        task_assigneepvg:[],
        itempvgqx:[],
        assigneqx:[],
        isEdit:false,
        loading:false,
        contentFromOp:[
           {
              mapType: 3,
              mdId: "3",
              modelType: "DATAMODEL_API",
              optionId: "3",
              optionName: "API关联",
              orderId: 0,
           }
         ],
         btnGroupArray:[
           {
             name:"流程图",
             value:"flowChart"
           },
           {
             name:"历史列表",
             value:"history"
           },
           {
             name:"打印流程",
             value:"printWf"
           },
         ],
         needIngItem:{},//当前api需要回写的项
         extParam:{}
    }
  },
   props:{
        dialogVisible: {
            type: Boolean
        },
        roleObj: {
            type: Object

        }

    },
    components:{
    opCheck
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
        let this_ = this;
        let callBackDialogFunc = function(obj){
            if(obj && obj.action == 'selectConnector' ){

                if(obj.flag == 3){//左边选择
                    this_.needIngItem.cnName = obj.data.paramName;
                    this_.needIngItem.cnItem = obj.data.paramId?obj.data.paramId:obj.data.paramDataId?obj.data.paramDataId:"";
                }
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'startDirection');
      },
      init(){
        this.loading = true;
        this.getRenderTaskInspectformFunc();
        this.task_model = this.directionData.task_model;
        if(!this.task_model.extParam){
             //默认全部选中
             this.extParam = {};
             this.$set(this.extParam,'showBtnGroup',['flowChart','history','printWf']);

         }else{
           this.extParam = JSON.parse(this.task_model.extParam);
           if(!this.extParam.hasOwnProperty('showBtnGroup')){
             this.$set(this.extParam,'showBtnGroup',['flowChart','history','printWf']);
           }
         }
      },
      hideDialog(){
          // this.$emit('update:dialogVisible', false);
          this.$emit('hideDialog');
      },
      handleClick(tab, event) {
          if(tab.name === "second" &&  this.task_itempvg.length == 0 ){
              this.loading = true;
              this.getRenderTaskItempvgFunc();
          }else if(tab.name === "third" && this.task_assigneepvg.length == 0 ){
              this.loading = true;
              this.getRenderTaskAssigneepvgFunc();
          }else if(tab.name === "fourth" &&  this.checkItems.length == 0 ){
              // this.loading = true;
              // this.getRenderTaskInspectformFunc();
          }
      },
      getRenderTaskItempvgFunc(){
        getRenderTaskItempvg(this.operate_id).then((response) => {
            this.loading = false;
            if(response.data.status<100){
                this.task_itempvg = response.data.remap.pvg;

                this.task_itempvg.forEach(item => {
                  let value = [];
                  if(item.editable == 1){
                      value.push("1");
                  }
                  if(item.isreadonly == 1){
                      value.push("2");
                  }
                  if(item.hidden == 1){
                      value.push("3");
                  }
                  this.$set(item,'value',value);
                });
                if(this.task_itempvg.every( item => item.value.indexOf("1")>-1)){
                    this.itempvgqx.push("1");
                }
                if(this.task_itempvg.every( item => item.value.indexOf("2")>-1)){
                      this.itempvgqx.push("2");

                }
                if(this.task_itempvg.every( item => item.value.indexOf("3")>-1)){
                      this.itempvgqx.push("3");
                }

            }
        }).catch((error) => {
          this.loading = false;
        });
      },
      getRenderTaskAssigneepvgFunc(){
         getRenderTaskAssigneepvg(this.operate_id).then((response) => {
            this.loading = false;
           if(response.data.status<100){
                this.task_assigneepvg = response.data.remap.pvg;

                // if(this.task_assigneepvg.every( item => item.value == 1)){
                //      this.assigneqx = 1;
                // }else if(this.task_assigneepvg.every( item => item.value == 2)){
                //      this.assigneqx = 2;
                // }else if(this.task_assigneepvg.every( item => item.value == 3)){
                //      this.assigneqx = 3;
                // }else{
                //      this.assigneqx = 0;
                // }
               this.task_assigneepvg.forEach(item => {
                  let value = [];
                  if(item.editable == 1){
                      value.push("1");
                  }
                  if(item.isreadonly == 1){
                      value.push("2");
                  }

                  this.$set(item,'value',value);
                });
              if(this.task_assigneepvg.every( item => item.value.indexOf("1")>-1)){
                  this.assigneqx.push("1");
              }
              if(this.task_assigneepvg.every( item => item.value.indexOf("2")>-1)){
                    this.assigneqx.push("2");

              }
            }
        }).catch((error) => {
          this.loading = false;
        });
      },
      getRenderTaskInspectformFunc(){
          getRenderTaskInspectform(this.operate_id).then((response) => {
            this.loading = false;
            if(response.data.status<100){
                this.checkItems = response.data.remap.inspectform;
            }
          }).catch((error) => {
            this.loading = false;
          });
      },
      hjChange(value,item){
        //  if(value == 1){
        //     item.editable = 1;
        //     item.isreadonly = 0;
        //     item.hidden = 0;
        //  }else if(value == 2){
        //     item.editable = 0;
        //     item.isreadonly = 1;
        //     item.hidden = 0;
        //  }else if(value == 3){
        //     item.editable = 0;
        //     item.isreadonly = 0;
        //     item.hidden = 1;
        //  }
        if(value.indexOf("1")==-1 && value.indexOf("2") == -1){
            item.value.push("2");
            this.$nextTick(() => {
              if(this.task_itempvg.every( item => item.value.indexOf("2")>-1)){
                  if(this.itempvgqx.indexOf("2") == -1){
                        this.itempvgqx.push("2");
                  }
              }
            });
        }
        if(this.task_itempvg.every( item => item.value.indexOf("1")>-1)){
               if(this.itempvgqx.indexOf("1") == -1){
                    this.itempvgqx.push("1");
               }
        }else{
              if(this.itempvgqx.indexOf("1")>-1){
                  this.itempvgqx.splice(this.itempvgqx.indexOf("1"),1);
              }
        }
        if(this.task_itempvg.every( item => item.value.indexOf("2")>-1)){
              if(this.itempvgqx.indexOf("2") == -1){
                    this.itempvgqx.push("2");
               }
        }else{
              if(this.itempvgqx.indexOf("2")>-1){
                  this.itempvgqx.splice(this.itempvgqx.indexOf("2"),1);
              }
        }
        if(this.task_itempvg.every( item => item.value.indexOf("3")>-1)){
              if(this.itempvgqx.indexOf("3") == -1){
                    this.itempvgqx.push("3");
               }
        }else{
              if(this.itempvgqx.indexOf("3")>-1){
                  this.itempvgqx.splice(this.itempvgqx.indexOf("3"),1);
              }
        }
      },
      qxChange(value){
          // this.task_itempvg.forEach(item => {
          //   item.value = value;
          // });
      },
      assignehjChange(value,item){
         if(this.task_assigneepvg.every( item => item.value.indexOf("1")>-1)){
               if(this.assigneqx.indexOf("1") == -1){
                    this.assigneqx.push("1");
               }
        }else{
              if(this.assigneqx.indexOf("1")>-1){
                  this.assigneqx.splice(this.assigneqx.indexOf("1"),1);
              }
        }

        if(this.task_assigneepvg.every( item => item.value.indexOf("2")>-1)){
              if(this.assigneqx.indexOf("2") == -1){
                    this.assigneqx.push("2");
               }
        }else{
              if(this.assigneqx.indexOf("2")>-1){
                  this.assigneqx.splice(this.assigneqx.indexOf("2"),1);
              }
        }
        // if(this.task_assigneepvg.every( item => item.value == 1)){
        //     this.assigneqx = 1;
        // }else if(this.task_assigneepvg.every( item => item.value == 2)){
        //     this.assigneqx = 2;
        // }else if(this.task_assigneepvg.every( item => item.value == 3)){
        //     this.assigneqx = 3;
        // }else{
        //     this.assigneqx = 0;
        // }
      },
      assigneqxChange(value){
          // this.task_assigneepvg.forEach(item => {
          //   item.value = value;
          // });
      },
      addCheckItem(){
          this.checkItems.push({content:"",cnModel:"0",logicSet:[]});
      },
      deleteCheckItem(index){
           this.checkItems.splice(index,1);
      },
      async save(){
        let valid = true;
        this.$refs['taskModelForm'].validate((result) => {
          valid = result;
        });
        if(!valid) return;
        this.isEdit = false;
        this.task_model.operate_id = this.operate_id;
        this.$emit('saveLoading');
        let itempvgData = {
            operate_id:this.operate_id
        }
       this.task_itempvg.forEach(item => {
            let array  = ['0','0','0']
            if(item.value.indexOf('1')>-1){
               array[0] = '1';
            }
            if(item.value.indexOf('2')>-1){
               array[1] = '1';
            }
             if(item.value.indexOf('3')>-1){
               array[2] = '1';
            }
            let str_ = array.join('-');
            itempvgData[item.itemId] = str_;
        });
        this.task_assigneepvg.forEach(item => {
            let array  = ['0','0','0']
            if(item.value.indexOf('1')>-1){
               array[0] = '1';
            }
            if(item.value.indexOf('2')>-1){
               array[1] = '1';
            }
            let str_ = array.join('-');
            itempvgData[item.itemId] = str_;

        });
        await updateTaskItempvg(itempvgData).then((response) => {

        }).catch((error) => {

        });
        for(let i=0;i<this.checkItems.length;i++){
            let logicSet = this.checkItems[i].logicSet;
            logicSet.forEach(item => {
              EcoUtil.deleteAttrInObject(item,'');
              let logicConds = item.logicConds;

              logicConds.forEach(element => {
                EcoUtil.deleteAttrInObject(element,'APPR_ITEMS,TASK_ITEMS,changeFormItem,formula,l_parent_temp,r_item_temp,r_parent_temp,R_TASK_ITEMS,APPrItemS,showRightApiInput,showLeftTaskItems,showRightTaskItems');
              });
          });
        }
        let InspectformData = {
            operate_id:this.operate_id,
            inspectform_conds: JSON.stringify(this.checkItems)
        }
        await updateTaskInspectform(InspectformData).then((response) => {

        }).catch((error) => {

        });
        this.task_model.ext_param = JSON.stringify(this.extParam);
        await updateTaskModel(this.task_model).then((response) => {
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
       changeContentFrom(item){
          this.$set(item,"cnItem","");
          this.$set(item,"cnName","");
          this.$set(item,"content","");
          this.$set(item,'changeContent',item.cnModel!='0'? false:true);
          if(item.changeContent){
              this.$set(item,"cnModel","");
          }else{
              this.$set(item,"cnModel","0");
          }
      },
      selectConnector(flag){
        let _url = '/flowform/index.html#/selectConnector/'+this.operate_id+'/0/0/'+flag;
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
     },
     contentFromSelect(value,item){
        this.$set(item,"cnItem","");
        this.$set(item,"cnName","");
        this.$set(item,"content","");
        if(value == 3){
          this.needIngItem = item;
          this.selectConnector(3);
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
      itempvgqx:{
        handler(newValue,oldValue){
            if(newValue.length == oldValue.length) return;
            if(newValue.length>oldValue.length){//新增
                this.task_itempvg.forEach(item => {
                  for(var i=0;i<newValue.length;i++){
                      item.value.indexOf(newValue[i]) === -1 ?  item.value.push(newValue[i]) : 0;
                  }
                });
            }else{ //减少

                var str = '';//得到刚才点击的值
                for(let i=0;i<oldValue.length;i++){
                    if(newValue.indexOf(oldValue[i])==-1){
                      str = oldValue[i];
                      break;
                    }
                }
                this.task_itempvg.forEach(item => {
                  item.value.splice(item.value.indexOf(str),1);
                  if(item.value.indexOf("1")==-1 && item.value.indexOf("2") == -1){
                      item.value.push("2");
                      if(this.itempvgqx.indexOf('2') == -1){
                            this.itempvgqx.push("2");
                      }
                    }
                });
                 if(this.task_itempvg.every( item => item.value.indexOf("2") >-1)){
                      if(this.itempvgqx.indexOf('2') == -1){
                            this.itempvgqx.push("2");
                      }
                  }else{
                      if(this.itempvgqx.indexOf("2")>-1){
                          this.itempvgqx.splice(this.itempvgqx.indexOf("2"),1);
                      }
                  }
            }
        }
     },
     assigneqx:{
        handler(newValue,oldValue){
            if(newValue.length == oldValue.length) return;
            if(newValue.length>oldValue.length){//新增
                this.task_assigneepvg.forEach(item => {
                  for(var i=0;i<newValue.length;i++){
                      item.value.indexOf(newValue[i]) === -1 ?  item.value.push(newValue[i]) : 0;
                  }
                });
            }else{
               var str = '';//得到刚才点击的值
                for(let i=0;i<oldValue.length;i++){
                    if(newValue.indexOf(oldValue[i])==-1){
                      str = oldValue[i];
                      break;
                    }
                }
               this.task_assigneepvg.forEach(item => {
                  item.value.splice(item.value.indexOf(str),1);
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
.dirctionAttr .formItem{
    padding: 10px 24px 20px 24px;
    border-bottom: 1px solid #e8e8e8;
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
.dirctionAttr .el-checkbox-group{
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
}
.qiehuan{
    height: 34px;
    line-height: 34px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 34px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 1px;
    cursor: pointer;
}
.switch-inline{
  display: inline-block;
  margin-left: 20px;
}
.switch-inline label{
  margin-right: 20px;
}
.flowLevel{
  display: block;
  font-size: 12px;
  margin-top: 10px;
  line-height: 1;
}
</style>
