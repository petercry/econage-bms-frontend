<template>
    <div class="addRole" v-loading="loading">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="form.id > 0? '编辑角色':'新建角色'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-show="form.id > 0" @click="deleteRole">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="120px" class="addForm">
            <el-form-item label="角色名称" required>
                <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="角色类型" required>
                <el-select v-model="form.type" :disabled="form.id > 0" style="width:400px;"  placeholder="请选择类型">
                   <el-option v-for="(item,index) in roleType" :key="index"

                    :label="item.text"
                    :value="item.id">

                    </el-option>
               </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {addRole,updateRole,getRoleInfo,deleteRole} from '../../../api/role.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addRole',
  components: {
    ecoToolTitle
  },
  data() {
    return {
        form:{
            id:null,
            name:"",
            type:"",
        },
        loading:false
    }
  },
  created() {
        if(this.$route.params.modelId && this.$route.params.modelId >0){
            this.form.modelId = this.$route.params.modelId;
        }
        if(this.$route.params.infoId && this.$route.params.infoId >0){
            this.form.infoId = this.$route.params.infoId;
        }

  },
  activated(){

  },

  mounted(){
      if(this.$route.params.id > 0){
          this.form.id = this.$route.params.id;
          this.getRoleInfo(this.form.id)
      }
  },
  filters:{

  },
  computed: {
    ...mapGetters([
        'roleType',
    ]),

  },

  methods: {
     getRoleInfo(id){
         this.loading = true;
         getRoleInfo(id).then((res)=>{
            this.loading = false;
            this.form.name = res.name;
            this.form.type = res.type;
            this.form.depts = res.depts;

         })
     },
     onSubmit(){
         if(!this.form.name){
             return  EcoMessageBox.alert('角色名称 不能为空','提示')
         }
         if(!this.form.type){
             return  EcoMessageBox.alert('请选择角色类型','提示')
         }
         if(this.form.id > 0){
             updateRole(this.form).then((res)=>{
                 this.$message({
                    message: '修改成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","updateRole",res);
             });
         }else{
             addRole(this.form).then((res)=>{
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addRole",res);
                if(window.isInCard){
                    this.$router.push({name:'addOrUpdateRoleInCard',params:{id:res.id}});
                }else if(window.isInProjectCard){
                    this.$router.push({name:'addOrUpdateRoleInProjectCard',params:{id:res.id}});
                }else{
                    this.$router.push({name:'addOrUpdateRole',params:{id:res.id}});
                }
            })
         }

     },
     deleteRole(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteRoleFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteRoleFunc(id){
         deleteRole(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteRole",id);
            if(window.isInCard){
                this.$router.push({name:'templatesCard'});
            }else if(window.isInProjectCard){
                this.$router.push({name:'projectCard'});
            }else{
                this.$router.push({name:'roleSetting'});
            }
        })
     },
  },
  watch:{
     $route:{
         deep:true,
         handler(){
             if(this.$route.params.id > 0){
                this.form.id = this.$route.params.id;
                this.getRoleInfo(this.form.id)
            }else{
                this.form = {
                    id:null,
                    name:"",
                    type:"",
                }
            }
            if(this.$route.params.modelId && this.$route.params.modelId >0){
                this.form.modelId = this.$route.params.modelId;
            }
            if(this.$route.params.infoId && this.$route.params.infoId >0){
                this.form.infoId = this.$route.params.infoId;
            }
         }
     }
  },

};
</script>

<style scoped>
.addRole{
    position: relative;
}
.addRole .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addRole .addForm{
    margin: 0 auto;
    padding: 20px;
    color: #0f1419 !important;
}
</style>
