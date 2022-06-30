<template>
    <div class="addGroupType" v-loading="loading">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="form.id > 0? '编辑团队类型':'新建团队类型'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-if="false" @click="deleteGroupType">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="120px" class="addForm">
            <el-form-item label="团队类型名称" required>
                <el-input v-model.trim="form.text"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import tagSelect from '@/components/orgPick/tagSelect.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {addGroupType} from '../../../api/group.js'
import {getKVSingleInfo,updateKVSingle} from '../../../api/common.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addGroupType',
  components: {
    tagSelect,
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
          this.getGroupTypeInfo(this.form.id)
      }
  },
  filters:{

  },
  computed: {


  },

  methods: {
     getGroupTypeInfo(id){
         this.loading = true;
         getKVSingleInfo(id).then((res)=>{
            this.loading = false;
            this.form.text = res.text;
         })
     },
     onSubmit(){
         if(!this.form.text){
             return  EcoMessageBox.alert('团队类型名称 不能为空','提示')
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
                this.$emit("callBack","updateGroupType",res);
             });
         }else{
             addGroupType(this.form).then((res)=>{
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addGroupType",res);
                // if(window.isInCard){
                //     this.$router.push({name:'addOrUpdateGroupTypeInCard',params:{id:res.id}});
                // }else{
                //     this.$router.push({name:'addOrUpdateGroupType',params:{id:res.id}});
                // }
                if(window.isInCard){
                    this.$router.push({name:'templatesCard'});
                }else if(window.isInProjectCard){
                    this.$router.push({name:'projectCard'});
                }else{
                    this.$router.push({name:'groupSetting'});
                }
            })
         }

     },
     deleteGroupType(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteGroupTypeFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteGroupTypeFunc(id){
         deleteGroupType(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteGroupType",id);
            if(window.isInCard){
                this.$router.push({name:'templatesCard'});
            }else if(window.isInProjectCard){
                this.$router.push({name:'projectCard'});
            }else{
                this.$router.push({name:'groupSetting'});
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
                this.getGroupTypeInfo(this.form.id)
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
.addGroupType{
    position: relative;
}
.addGroupType .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addGroupType .addForm{
    margin: 0 auto;
    padding: 20px;
    color: #0f1419 !important;
}
</style>
