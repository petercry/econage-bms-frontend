<template>
    <div class="addMajorType" v-loading="loading">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="form.id > 0? '编辑专业类型':'新建专业类型'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-if="false" @click="deleteMajorType">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="120px" class="addForm">
            <el-form-item label="专业类型名称" required>
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
import {addMajorType} from '../../../api/major.js'
import {getKVSingleInfo,updateKVSingle} from '../../../api/common.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addMajorType',
  components: {
    ecoToolTitle
  },
  data() {
    return {
        form:{
            id:null,
            text:"",

        },
        initDataStr:"",
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
          this.getMajorTypeInfo(this.form.id)
      }
  },
  filters:{

  },
  computed: {


  },

  methods: {
     getMajorTypeInfo(id){
         this.loading = true;
         getKVSingleInfo(id).then((res)=>{
            this.loading = false;
            this.form.text = res.text;

         })
     },
     onSubmit(){
         if(!this.form.text){
             return  EcoMessageBox.alert('专业类型名称 不能为空','提示')
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
                this.$emit("callBack","updateMajorType",res);
             });
         }else{
             addMajorType(this.form).then((res)=>{
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addMajorType",res);
                // if(window.isInCard){
                //     this.$router.push({name:'addOrUpdateMajorTypeInCard',params:{id:res.id}});
                // }else{
                //     this.$router.push({name:'addOrUpdateMajorType',params:{id:res.id}});
                // }
                if(window.isInCard){
                    this.$router.push({name:'templatesCard'});
                }else if(window.isInProjectCard){
                    this.$router.push({name:'projectCard'});
                }else{
                    this.$router.push({name:'majorSetting'});
                }
            })
         }

     },
     deleteMajorType(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteMajorTypeFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteMajorTypeFunc(id){
         deleteMajorType(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteMajorType",id);
            if(window.isInCard){
                this.$router.push({name:'templatesCard'});
            }else if(window.isInProjectCard){
                this.$router.push({name:'projectCard'});
            }else{
                this.$router.push({name:'majorSetting'});
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
                this.getMajorTypeInfo(this.form.id)
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
.addMajorType{
    position: relative;
}
.addMajorType .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addMajorType .addForm{
    margin: 0 auto;
    padding: 20px;
    color: #0f1419 !important;
}
</style>
