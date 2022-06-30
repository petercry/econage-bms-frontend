<template>
   <eco-content top="0px" bottom="0px" class="editProNode">
      <ecoLoading ref='ecoLoadingRef' :text="'编辑中...'"></ecoLoading>
      <eco-content top="0px" height="60px" type="tool">
              <el-row  class="toolbar">
                  <el-col :span="6">
                        <eco-tool-title style="line-height: 38px;" title="编辑节点"></eco-tool-title>
                  </el-col>
                  <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                        <el-button type="danger" size="mini" @click="delFunc" >删除 <i class="el-icon-close el-icon--right"></i></el-button>
                        <el-button type="primary" size="mini" @click="save" >保存 <i class="el-icon-check el-icon--right"></i></el-button>
                  </el-col>
              </el-row>
      </eco-content>

      <ecoContent top="60px" bottom="0" style="padding:20px 20px 10px;">
          
          <el-form ref="form" :model="form" label-width="110px">

            <el-form-item label="节点名称" prop="node" :rules="[ { required: true, message: '节点名称不能为空'} ]">
                <el-select v-model="form.node" style="width:100%">
                    <el-option
                    v-for="item in baseInfo"
                    :key="item.id"
                    :label="item.text"
                    :value="item.text">
                    </el-option>
                </el-select>
            </el-form-item>

             <el-form-item label="计划完成时间" prop="planCompleteDate" :rules="[ { required: true, message: '计划完成时间不能为空'} ]">
                <el-date-picker style="width:100%" type="date" v-model="form.planCompleteDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
            </el-form-item>

            
          </el-form>
  
      </ecoContent>
   </eco-content>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {editProNode,getProNodeSingle,deleteProNode,getEnumSelectEnabled} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  name:'editProNode',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
        form:{
            id:null,
            projectId:null,
            node:null,
            planCompleteDate:null
        },
        baseInfo:[]
    }
  },
  created(){
      this.form.id = this.$route.params.id;
      this.getProNodeSingleFunc();
      this.getBaseInfo();
  },
  mounted(){
     
  },
  methods: {

      ...mapMutations([
            'SET_ECO_EVENT',
            'SET_ECO_EVENT_DATA'
      ]),

      getBaseInfo() {
          getEnumSelectEnabled('SSJD').then((res) => {
              this.baseInfo = res.data
          })
      },

      getProNodeSingleFunc(){
          getProNodeSingle(this.form.id).then((response)=>{
                this.form.projectId = response.data.projectId;
                this.form.node = response.data.node;
                this.form.planCompleteDate = response.data.planCompleteDate;
          })
      },

      delFunc(){
            let _id = this.form.id;
            let _that  = this;

            let confirmYesFunc = function(){
                  deleteProNode(_id).then((response)=>{
                        _that.$message({type: 'success',message: '操作成功'});
                        _that.SET_ECO_EVENT({action:'delNode',key: EcoUtil.getUID()});
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
                    editProNode(this.form).then((res)=>{
                        this.$refs.ecoLoadingRef.close();
                        this.$message({type: 'success',message: '修改成功！'});

                        this.SET_ECO_EVENT({action:'editNode',key: EcoUtil.getUID()});
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
        this.getProNodeSingleFunc();
    }
  }
}
</script>
<style>
.editProNode .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}
</style>
