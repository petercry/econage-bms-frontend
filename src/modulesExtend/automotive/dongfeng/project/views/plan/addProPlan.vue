<template>
   <eco-content top="0px" bottom="0px" class="addProPlan">
      <ecoLoading ref='ecoLoadingRef' :text="'添加中...'"></ecoLoading>

      <eco-content top="0px" height="60px" type="tool">
              <el-row  class="toolbar">
                  <el-col :span="6">
                        <eco-tool-title style="line-height: 38px;" title="添加计划"></eco-tool-title>
                  </el-col>

                  <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                        <el-button type="primary" size="mini" @click="save" >保存  <i class="el-icon-check el-icon--right"></i></el-button>
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
                                placeholder="请选择人员"  
                                style="width: 100%;vertical-align: top;"
                                :initOptions="{selectNum:1,selectType:'user'}" 
                                @callBack="selectResponsibleUser" >
                        </tag-select>
                </el-form-item>

                <el-form-item label="计划开始日期" prop="planStartDate" :rules="[ { required: true, message: '计划开始日期为空'} ]">
                    <el-date-picker style="width:100%" type="date" v-model="form.planStartDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>

                <el-form-item label="计划完成日期" prop="planCompleteDate" :rules="[ { required: true, message: '计划完成日期为空'} ]">
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
import tagSelect from '@/components/orgPick/tagSelect.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {addProPlan} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
import {mapMutations} from 'vuex'

export default{
  name:'addProPlan',
  components:{
        ecoLoading,
        ecoContent,
        ecoToolTitle,
        tagSelect
  },
  data(){
    return {
        form:{
            projectId:null,
            taskName:null,
            responsibleUserId:null,
            planStartDate:null,
            planCompleteDate:null,
            actualCompleteDate:null,
            status:null
        },
        statusOptions:[]
    }
  },
  created(){
        this.form.projectId = this.$route.params.proId;
        this.statusOptions.push({text:'进行中',id:'processing'});
        this.statusOptions.push({text:'已完成',id:'complete'});
  },
  mounted(){
     
  },
  methods: {
        ...mapMutations([
                'SET_ECO_EVENT',
                'SET_ECO_EVENT_DATA'
        ]),

        selectResponsibleUser(data){
            if(data.itemArray.length > 0){
                this.form.responsibleUserId = data.itemArray[0].linkId;
            }else{
                this.form.responsibleUserId = null;
            }
        },

        save(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$refs.ecoLoadingRef.open();
                    addProPlan(this.form).then((res)=>{
                        this.$refs.ecoLoadingRef.close();
                        this.$message({type: 'success',message: '添加成功！'});

                        this.SET_ECO_EVENT({action:'addPlan',key: EcoUtil.getUID()});
                        this.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(res.data));
                    }).catch((error)=>{
                        this.$refs.ecoLoadingRef.close();
                        this.$message({type: 'error',message: '添加失败！'});
                    })
                } else {
                    return false;
                }
        });
    }
  },

  watch: {
 
  }
}
</script>
<style>
.addProPlan .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}
</style>
