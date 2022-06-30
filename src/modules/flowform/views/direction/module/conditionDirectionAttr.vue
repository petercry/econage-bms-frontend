<template>
    <div class="dirctionAttr">
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" @click="save" type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!isCustomer">
            <el-tab-pane label="基本属性" name="first">
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
                  <el-form-item  class="formItem inline" size="medium">
                        <span style="color: #262626;" slot="label">待前置环节全部完成后触发
                          <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">选中此项时，连接到该决策环节的所有环节需要全部完成才会触发规则判断计算，否则就等待。</div>
                            <i class="iconfont icon iconbangzhu-kong"></i>
                          </el-tooltip>
                      </span>
                      <el-switch
                        v-model="task_model.checkComplate" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item>
                  <el-form-item  class="formItem inline" size="medium">
                        <span style="color: #262626;" slot="label">一票否决
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">选中此项时，连接到该决策环节的所有环节里，只要有一个环节不同意，其他的待办环节就无需办理，流程按照所有环节不同意的规则流转。</div>
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-switch
                        v-model="task_model.singleDeny" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item>
                  <el-form-item  class="formItem" size="medium">
                      <span style="color: #262626;" slot="label">流转规则设置
                        <el-tooltip class="item" effect="dark" content="可结合表单及环节组件属性进行规则设置，可用并且、或者等条件进行复合连接。审批环节中如果有多人办理，则可进行通过率设置" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <div class="lcgzsz" v-for="(item,index) in task_routes" :key="index">
                          <div v-if="task_routes.length == 1">
                              <p style="line-height: 64px;"><span class="num">{{index+1}}、</span>当满足以下条件时,流转到：<i class="iconfont icon iconren"></i><span class="title">{{item.taskName}}</span></p>
                              <dirction-option :data="item.condSet"></dirction-option>

                          </div>
                          <div v-else>
                              <p style="line-height: 64px;"><span class="num">{{index+1}}、</span>
                              <el-select size="mini" style="width: 160px;" @change="negativeChange" v-model="item.isNegative">
                                <el-option
                                label="满足以下条件"
                                :value="0">
                                </el-option>
                                <el-option
                                :disabled="ifexistelse"
                                label="不满足其他分支条件"
                                :value="1">
                                </el-option>
                              </el-select>

                              时,流转到：<i class="iconfont icon iconren"></i><span class="title">{{item.taskName}}</span></p>
                              <dirction-option v-show="item.isNegative == 0" :data="item.condSet"></dirction-option>
                          </div>
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
            <!-- <el-tab-pane label="高级设置" name="second">
            </el-tab-pane> -->
        </el-tabs>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="isCustomer">
            <el-tab-pane label="基本属性" name="first">
              <el-form ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                  <el-form-item  class="formItem" size="medium" prop="taskName">
                      <span style="color: #262626;" slot="label">环节名称
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-input v-model="task_model.taskName"></el-input>
                  </el-form-item>
                  <el-form-item  class="formItem" size="medium">
                      <span style="color: #262626;" slot="label">流转规则设置
                        <el-tooltip class="item" effect="dark" content="可结合表单及环节组件属性进行规则设置，可用并且、或者等条件进行复合连接。审批环节中如果有多人办理，则可进行通过率设置" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <div class="lcgzsz" v-for="(item,index) in task_routes" :key="index">
                          <div v-if="task_routes.length == 1">
                              <p style="line-height: 64px;"><span class="num">{{index+1}}、</span>当满足以下条件时,流转到：<i class="iconfont icon iconren"></i><span class="title">{{item.taskName}}</span></p>
                              <dirction-option :data="item.condSet"></dirction-option>

                          </div>
                          <div v-else>
                              <p style="line-height: 64px;"><span class="num">{{index+1}}、</span>
                              <el-select size="mini" style="width: 160px;" @change="negativeChange" v-model="item.isNegative">
                                <el-option
                                label="满足以下条件"
                                :value="0">
                                </el-option>
                                <el-option
                                :disabled="ifexistelse"
                                label="不满足其他分支条件"
                                :value="1">
                                </el-option>
                              </el-select>

                              时,流转到：<i class="iconfont icon iconren"></i><span class="title">{{item.taskName}}</span></p>
                              <dirction-option v-show="item.isNegative == 0" :data="item.condSet"></dirction-option>
                          </div>
                      </div>

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
import dirctionOption from './dirctionOption.vue'
import {updateconditionTaskModel} from '../../../service/service.js'
import {mapState,mapMutations} from 'vuex'
export default{
  name:'dirctionAttr',
  data(){
    return {
        activeName:"first",
        task_model:{

        },
        task_routes:[],
        rules: {
          taskName: [
            { required: true,  trigger: 'blur' },
            { max: 50, trigger: 'blur' }
          ],
        },
        isEdit:false,
        ifexistelse:false
    }
  },
  components:{
    dirctionOption,
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
      init(){
        this.task_model = this.directionData.task_model;
        this.task_routes = this.directionData.task_routes;
        for(let i=0;i<this.task_routes.length;i++){
            if(this.task_routes[i].isNegative == 1){
              this.ifexistelse = true;
              break;
            }
        }
      },
      hideDialog(){
          this.$emit('hideDialog');
      },
      addItem(){

      },
      negativeChange(value){
        if(value == 1){
           this.ifexistelse = true;
        }else{
           this.ifexistelse = false;
        }
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
       async save(){
        let valid = true;
        this.$refs['taskModelForm'].validate((result) => {
          valid = result;
        });
        if(!valid) return;
        this.isEdit = false;
        this.task_model.operate_id = this.operate_id;
        if(this.task_model.checkComplate == 0){
          this.task_model.do_complete = 0 ;
        }
         for(let i=0;i<this.task_routes.length;i++){
            let condSet = this.task_routes[i].condSet;
            if(this.task_routes[i].isNegative == 1){
              this.task_routes[i].condSet = [];
              continue;
            }
            condSet.forEach(item => {
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
        this.task_model.route_conds = JSON.stringify(this.task_routes);
        this.$emit('saveLoading');
        await updateconditionTaskModel(this.task_model).then((response) => {
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
    padding: 24px;
    background: #fafafa;
    text-align: right;
}
.dirctionAttr .hjItem{
    padding: 24px;
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
.lcgzsz{
    padding: 16px 12px;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
    margin-bottom: 20px;
}
.lcgzsz .num{
    color: #262626;
}
.lcgzsz .iconren{
    color: #1ba5fa;
    margin-right: 8px;
    font-size: 18px;
    position: relative;
    top: 2px;
}
.lcgzsz .title{
    color: #262626;
    font-weight: bold;
}
.flowLevel{
  display: block;
  font-size: 12px;
  margin-top: 10px;
  line-height: 1;
}
</style>
