<template>
    <div class="addRoleType" v-loading="loading">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="form.id > 0? '编辑角色类型':'新建角色类型'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-if="false" @click="deleteRoleType">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="120px" class="addForm">
            <el-form-item label="角色类型" required>
                <el-input v-model.trim="form.text"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {addRoleType} from '../../../api/role.js'
import {getKVSingleInfo,updateKVSingle} from '../../../api/common.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addRoleType',
  components: {
    ecoToolTitle
  },
  data() {
    return {
        form:{
            id:null,
            text:"",
        },
        loading:false
    }
  },
  created() {


  },
  activated(){

  },

  mounted(){
      if(this.$route.params.id > 0){
          this.form.id = this.$route.params.id;
          this.getRoleTypeInfo(this.form.id)
      }
  },
  filters:{

  },
  computed: {


  },

  methods: {
     getRoleTypeInfo(id){
         this.loading = true;
         getKVSingleInfo(id).then((res)=>{
            this.loading = false;
            this.form.text = res.text;

         })
     },
     onSubmit(){
         if(!this.form.text){
             return  EcoMessageBox.alert('角色名称 不能为空','提示')
         }
         if(this.form.id > 0){
             updateKVSingle(this.form).then((res)=>{
                 this.$message({
                    message: '修改成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","updateRoleType",res);
             });
         }else{
             addRoleType(this.form).then((res)=>{
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addRoleType",res);
                // if(window.isInCard){
                //     this.$router.push({name:'addOrUpdateRoleTypeInCard',params:{id:res.id}});
                // }else{
                //     this.$router.push({name:'addOrUpdateRoleType',params:{id:res.id}});
                // }
                if(window.isInCard){
                    this.$router.push({name:'templatesCard'});
                }else if(window.isInProjectCard){
                    this.$router.push({name:'projectCard'});
                }else{
                    this.$router.push({name:'roleSetting'});
                }
            })
         }

     },
     deleteRoleType(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteRoleTypeFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteRoleTypeFunc(id){
         deleteRoleType(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteRoleType",id);
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
                this.getRoleTypeInfo(this.form.id)
            }else{
                this.form = {
                    id:null,
                    text:"",

                }
            }

         }
     }
  },

};
</script>

<style scoped>
.addRoleType{
    position: relative;
}
.addRoleType .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addRoleType .addForm{
    margin: 0 auto;
    padding: 20px;
    color: #0f1419 !important;
}
</style>
