<template>
    <div class="dirctionAttr">
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" @click="save" type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本属性" name="first">
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
                      <span style="color: #262626;" slot="label">选择抄送人员
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
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
                        <el-radio-group @change="qxChange" v-model="itempvgqx">
                          <el-radio-button label="2">只读</el-radio-button>
                          <el-radio-button label="3">隐藏</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="hjItem" v-for="(item,index) in task_itempvg" :key="index">
                        <el-row>
                            <el-col :span=12>
                              <span style="color: #262626;">{{item.itemName}} <span style="font-size:12px;color:#8b8b8b;">[{{item.type_desc}}]</span></span>
                            </el-col>
                            <el-col :span=12 style="text-align:right;">
                              <el-radio-group @change="hjChange($event,item)" v-model="item.value">
                                  <el-radio-button label="2">只读</el-radio-button>
                                  <el-radio-button label="3">隐藏</el-radio-button>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
      
    </div>
</template>
<script>
import {updateWorkTaskModel,getRenderTaskItempvg,updateTaskItempvg} from '../../../service/service.js'
import cirleSelect from './cirleSelect.vue'
import {mapState,mapMutations} from 'vuex'
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
        selectOrgValue:""
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
  },
  mounted(){
       
  },
  computed:{
      ...mapState([
        'directionData',
        'operate_id'
    ]),
  },
  methods: {
      init(){
        this.task_model = this.directionData.task_model;
        this.selectOrgValue = this.task_model.selectAssignee.type==2  && this.task_model.selectAssignee.logicList.length>0? this.task_model.selectAssignee.logicList[0].target:"";
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
      hideDialog(){
          // this.$emit('update:dialogVisible', false);
          this.$emit('hideDialog');
      },
       handleClick(tab, event) {
          if(tab.name === "second" &&  this.task_itempvg.length == 0 ){
              this.loading = true;
              this.getRenderTaskItempvgFunc();
          }
      },
      getRenderTaskItempvgFunc(){
        getRenderTaskItempvg(this.operate_id).then((response) => {
            this.loading = false;
            if(response.data.success){
                this.task_itempvg = response.data.queryObj;
                this.task_itempvg.forEach(item => {
                  let value = item.editable ==1 ? 1:item.isreadonly == 1? 2: item.hidden == 1 ? 3 : 0
                  this.$set(item,'value',value); 
                });
                if(this.task_itempvg.every( item => item.value == 1)){
                     this.itempvgqx = 1;
                }else if(this.task_itempvg.every( item => item.value == 2)){
                     this.itempvgqx = 2;
                }else if(this.task_itempvg.every( item => item.value == 3)){
                     this.itempvgqx = 3;
                }else{
                     this.itempvgqx = 0;
                }
               
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
        if(this.task_itempvg.every( item => item.value == 1)){
            this.itempvgqx = 1;
        }else if(this.task_itempvg.every( item => item.value == 2)){
            this.itempvgqx = 2;
        }else if(this.task_itempvg.every( item => item.value == 3)){
            this.itempvgqx = 3;
        }else{
            this.itempvgqx = 0;
        }
      },
      qxChange(value){
          this.task_itempvg.forEach(item => {
            item.value = value;
          });
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
       
        let itempvgData = {
            operate_id:this.operate_id
        } 
        this.task_itempvg.forEach(item => {
            let str_ = item.value == "1" ? "1-0-0" : item.value == "2" ? "0-1-0" : item.value == "3" ? "0-0-1": "0-0-0";  
            itempvgData[item.itemId] = str_;
        });
        await updateTaskItempvg(itempvgData).then((response) => {
           if(response.data.status <100){
              
            }
        }).catch((error) => {
             this.$emit('closeSaveLoading');
        }); 
        
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
</style>
