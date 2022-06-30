<template>
    <div class="addGroup" v-loading="loading">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="form.id > 0? '编辑团队':'新建团队'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-show="form.id > 0 && editable && groupRoleDelete" @click="deleteGroup">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" v-if="editable && ((form.id > 0 && groupRoleEdit) || (!form.id && groupRoleAdd)) && roleEdit" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="120px" class="addForm" :disabled="!editable || !((form.id > 0 && groupRoleEdit) || (!form.id && groupRoleAdd)) || !roleEdit">
            <el-form-item label="团队名称" required>
                <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="团队类型" required>
                <el-select v-model="form.type" :disabled="form.id > 0" style="width:400px;"  placeholder="请选择类型">
                   <el-option v-for="(item,index) in groupType" :key="index"

                    :label="item.text"
                    :value="item.id">

                    </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="角色选择" required>
                <el-select v-model="roles" style="width:400px;" multiple filterable  placeholder="请选择角色">

                   <el-option v-for="(item,index) in roleList" :key="index"

                    :label="item.name"
                    :value="item.id">

                    </el-option>
               </el-select>
            </el-form-item>
            <el-form-item v-if="editable && ((form.id > 0 && groupRoleEdit) || (!form.id && groupRoleAdd)) && roleEdit">
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {addGroup,updateGroup,getGroupInfo,deleteGroup,getGroupRole} from '../../../api/group.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addGroup',
  components: {
    ecoToolTitle
  },
  data() {
    return {
        form:{
            id:null,
            name:"",
            type:"",
            links:[]
        },
        roles:"",
        loading:false,
        roleEdit:true

    }
  },
  created() {
        this.setRoleList();
        if(this.$route.params.modelId && this.$route.params.modelId >0){
            this.form.modelId = this.$route.params.modelId;
        }
        if(this.$route.params.infoId && this.$route.params.infoId > 0){
            this.form.infoId = this.$route.params.infoId;
        }

  },
  activated(){

  },

  mounted(){
      if(this.$route.params.id > 0){
          this.form.id = this.$route.params.id;
          this.getGroupInfo(this.form.id)
      }
  },
  filters:{

  },
  computed: {
    ...mapGetters([
        'groupType',
        'roleList',
        'groupRoleEdit','groupRoleAdd','groupRoleDelete'
    ]),

  },
  props:{
      editable: {
          type: Boolean,
          default(){
              return true
          }
      }
  },
  methods: {
      ...mapActions([
        'setRoleList',

     ]),
     getGroupInfo(id){
         this.loading = true;
         getGroupInfo(id).then((res)=>{
            this.loading = false;
            this.form.name = res.name;
            this.form.type = res.type;
            this.form.links = res.links;
            if(this.form.links.length > 0){
                this.roles = this.form.links.map((item,index) => {
                    return item.roleId;
                })
            }
         })
         if(this.$route.params.infoId && this.$route.params.infoId>0){
            getGroupRole(id,this.$route.params.infoId).then(res=>{
                this.roleEdit = res.flag;
            })
         }

     },
     onSubmit(){
         if(!this.form.name){
             return  EcoMessageBox.alert('团队名称 不能为空','提示')
         }
         if(!this.form.type){
             return  EcoMessageBox.alert('请选择团队类型','提示')
         }
         this.form.links = this.roles.map((item,index)=>{
             let obj = {};
             obj.roleId = item;
             return obj;
         })
         if(this.form.links.length == 0){
             return  EcoMessageBox.alert('请选择角色','提示')
         }

         if(this.form.id > 0){
             updateGroup(this.form).then((res)=>{
                 this.$message({
                    message: '修改成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","updateGroup",res);
             });
         }else{
             addGroup(this.form).then((res)=>{
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addGroup",res);
                if(window.isInCard){
                    this.$router.push({name:'addOrUpdateGroupInCard',params:{id:res.id}});
                }else if(window.isInProjectCard){
                    this.$router.push({name:'addOrUpdateGroupInProjectCard',params:{id:res.id}});
                }else{
                    this.$router.push({name:'addOrUpdateGroup',params:{id:res.id}});
                }
            })
         }

     },
     deleteGroup(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteGroupFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteGroupFunc(id){
         deleteGroup(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteGroup",id);
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
                this.getGroupInfo(this.form.id)
            }else{
                this.form = {
                    id:null,
                    name:"",
                    type:"",
                    links:[]
                }
                this.roles = [];
            }
            if(this.$route.params.modelId && this.$route.params.modelId >0){
                this.form.modelId = this.$route.params.modelId;
            }
            if(this.$route.params.infoId && this.$route.params.infoId > 0){
                this.form.infoId = this.$route.params.infoId;
            }
         }
     }
  },

};
</script>

<style scoped>
.addGroup{
    position: relative;
}
.addGroup .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addGroup .addForm{
    margin: 0 auto;
    padding: 20px;
    color: #0f1419 !important;
}
</style>
