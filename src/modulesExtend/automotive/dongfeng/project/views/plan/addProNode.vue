<template>
   <eco-content top="0px" bottom="0px" class="deptAdd">
      <ecoLoading ref='ecoLoadingRef' :text="'添加中...'"></ecoLoading>

      <eco-content top="0px" height="60px" type="tool">
              <el-row  class="toolbar">
                  <el-col :span="6">
                        <eco-tool-title style="line-height: 38px;" title="添加节点"></eco-tool-title>
                  </el-col>

                  <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                        <el-button type="primary" size="mini" @click="save" >保存  <i class="el-icon-check el-icon--right"></i></el-button>
                  </el-col>
              </el-row>
      </eco-content>

      <ecoContent top="60px" bottom="0" style="padding:20px 20px 10px;">
          
          <el-form ref="form" :model="form" label-width="110px">

            <el-form-item label="节点名称" prop="node" :rules="[ { required: true, message: '节点名称不能为空'} ]">
                <!-- <el-input v-model="form.node"></el-input> -->
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
import {addProNode,getEnumSelectEnabled} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
import {mapMutations} from 'vuex'

export default{
  name:'deptAdd',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
        form:{
            projectId:null,
            node:null,
            planCompleteDate:null
        },
        baseInfo:[]
    }
  },
  created(){
      this.form.projectId = this.$route.params.proId;
      this.getBaseInfo()
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

      save(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
                this.$refs.ecoLoadingRef.open();
                addProNode(this.form).then((res)=>{
                    this.$refs.ecoLoadingRef.close();
                    this.$message({type: 'success',message: '添加成功！'});

                    this.SET_ECO_EVENT({action:'addNode',key: EcoUtil.getUID()});
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
   '$route'(val){
     this.form.parentId = this.$route.params.parentId;
   }
  }
}
</script>
<style>
.deptAdd .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}
</style>
