<template>
   <eco-content top="0px" bottom="0px" class="editProPlan">
      <ecoLoading ref='ecoLoadingRef' :text="'编辑中...'"></ecoLoading>
      <eco-content top="0px" height="60px" type="tool">
              <el-row  class="toolbar">
                  <el-col :span="6">
                        <eco-tool-title style="line-height: 38px;" title="编辑计划"></eco-tool-title>
                  </el-col>

                  <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                        <el-button type="danger" size="mini" @click="delFunc" >删除 <i class="el-icon-close el-icon--right"></i></el-button>
                        <el-button type="primary" size="mini" @click="save" >保存 <i class="el-icon-check el-icon--right"></i></el-button>
                  </el-col>
              </el-row>
      </eco-content>

      <ecoContent top="60px" bottom="0" style="padding:20px 20px 10px;">
          
          <el-form ref="form" :model="form" label-width="110px">

                <el-form-item label="任务名称" prop="taskName" :rules="[ { required: true, message: '任务不能为空'} ]">
                        <el-input v-model="form.taskName"></el-input>
                </el-form-item>

                <el-form-item label="责任人" prop="responsibleUserId">
                        <tag-select 
                                style="width: 100%;vertical-align: top;"
                                :initDataArray="responsibleUserMember"
                                :initOptions="{selectNum:1,selectType:'user'}" 
                                @callBack="selectResponsibleUser" >
                        </tag-select>
                </el-form-item>

                <el-form-item label="计划开始日期" prop="planStartDate">
                    <el-date-picker style="width:100%" type="date" v-model="form.planStartDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>

                <el-form-item label="计划完成日期" prop="planCompleteDate">
                    <el-date-picker style="width:100%" type="date" v-model="form.planCompleteDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>

                <el-form-item label="实际完成日期" prop="actualCompleteDate">
                    <el-date-picker style="width:100%" type="date" v-model="form.actualCompleteDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                        <el-select
                                    style="width:100%"
                                    v-model="form.status"
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                            v-for="(item,index) in statusOptions"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                    >
                                    </el-option>
                        </el-select>
                </el-form-item>
            
          </el-form>
  
      </ecoContent>
   </eco-content>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {editProPlan,getProPlanSingle,deleteProPlan} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'

export default{
  name:'editProPlan',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle,
      tagSelect
  },
  data(){
    return {
        form:{
            id:null,
            projectId:null,
            taskName:null,
            responsibleUserId:null,
            planStartDate:null,
            planCompleteDate:null,
            actualCompleteDate:null,
            status:null
        },
        responsibleUserMember:[],
        statusOptions:[]
    }
  },
  created(){
      this.form.id = this.$route.params.id;
      this.statusOptions.push({text:'进行中',id:'processing'});
      this.statusOptions.push({text:'已完成',id:'complete'});
      this.getProPlanSingleFunc();
  },
  mounted(){
     
  },
  methods: {

      ...mapMutations([
            'SET_ECO_EVENT',
            'SET_ECO_EVENT_DATA'
      ]),

      getProPlanSingleFunc(){
          getProPlanSingle(this.form.id).then((response)=>{
                this.form.projectId = response.data.projectId;
                this.form.taskName = response.data.taskName;
                this.form.responsibleUserId = response.data.responsibleUserId;
                if(response.data.responsibleUserId){
                    let _memberList = [];
                    _memberList.push(response.data.responsibleUserMember);
                    this.responsibleUserMember = _memberList;
                }else{
                    this.responsibleUserMember = [];
                }
                this.form.planStartDate = response.data.planStartDate;
                this.form.planCompleteDate = response.data.planCompleteDate;
                this.form.actualCompleteDate = response.data.actualCompleteDate;
                this.form.status = response.data.status;
          })
      },

        selectResponsibleUser(data){
            if(data.itemArray.length > 0){
                this.form.responsibleUserId = data.itemArray[0].linkId;
            }else{
                this.form.responsibleUserId = null;
            }
        },

      delFunc(){
            let _id = this.form.id;
            let _that  = this;

            let confirmYesFunc = function(){
                  deleteProPlan(_id).then((response)=>{
                        _that.$message({type: 'success',message: '操作成功'});
                        _that.SET_ECO_EVENT({action:'delPlan',key: EcoUtil.getUID()});
                        _that.SET_ECO_EVENT_DATA({id:_id});
                  }).catch((error)=>{});
            }

            EcoMessageBox.confirm('确定删除该节点 ？','提示',{
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
            },confirmYesFunc);
           
      },

      save(){
          this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$refs.ecoLoadingRef.open();
                    editProPlan(this.form).then((res)=>{
                        this.$refs.ecoLoadingRef.close();
                        this.$message({type: 'success',message: '修改成功！'});

                        this.SET_ECO_EVENT({action:'editPlan',key: EcoUtil.getUID()});
                        this.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(res.data));

                    }).catch((error)=>{
                        this.$refs.ecoLoadingRef.close();
                        this.$message({type: 'error',message: '修改失败！'});
                    })
                } else {
                    return false;
                }
        });
    }
  },
  watch: {
    '$route'(val){
        this.form.id = this.$route.params.id;
        this.getProPlanSingleFunc();
    }
  }
}
</script>
<style>
.editProPlan .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}
</style>
