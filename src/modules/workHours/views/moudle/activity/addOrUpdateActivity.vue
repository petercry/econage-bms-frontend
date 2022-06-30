<template>
    <div class="addActivity">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="form.id > 0? '编辑专业':'新建专业'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-show="form.id > 0" @click="deleteActivity">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="120px" class="addForm">
            <el-form-item label="专业名称" required>
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="专业类型" required>
                <el-select v-model="form.type" :disabled="form.id > 0" style="width:280px;"  placeholder="请选择类型">
                   <el-option v-for="(item,index) in activityType" :key="index"

                    :label="item.text"
                    :value="item.id">

                    </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="关联部门">
               <tag-select
                    style="width: 100%;vertical-align: top;"
                    ref="tagSelect"
                    :initDataStr="initDataStr"
                    :initOptions="{selectNum:0,selectType:'DEPT',treeUserHidden:true}"
                    @callBack="selectDept" >
                </tag-select>
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
import {addActivity,updateActivity,getActivityInfo,deleteActivity} from '../../../api/activity.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addActivity',
  components: {
    tagSelect,
    ecoToolTitle
  },
  data() {
    return {
        form:{
            id:null,
            name:"",
            type:"",
            depts:[],
        },
        initDataStr:""
    }
  },
  created() {


  },
  activated(){

  },

  mounted(){
      if(this.$route.params.id > 0){
          this.form.id = this.$route.params.id;
          this.getActivityInfo(this.form.id)
      }else{
            this.form = {
                id:null,
                name:"",
                type:"",
                depts:[],
            }
            this.initDataStr = "";
        }
  },
  filters:{

  },
  computed: {
       ...mapGetters([
        'activityType',
    ]),

  },

  methods: {
     selectDept(data){
         this.form.depts = [];
         if(data.itemArray.length > 0){
            data.itemArray.forEach(element => {
                let obj = {
                    deptLinkId:element.linkId,
                    deptLinkName:element.name
                }
                this.form.depts.push(obj);
            });
            this.initDataStr = data.id;
         }else{

            this.initDataStr = "";
         }
     },
     getActivityInfo(id){
         getActivityInfo(id).then((res)=>{
            this.form.name = res.name;
            this.form.type = res.type;
            this.form.depts = res.depts;
            if(res.depts.length>0){
                let strArray = [];
                for(let i = 0;i<res.depts.length;i++){
                    let item = res.depts[i];
                    strArray.push(`{"type":"DEPT","orgId":"${item.deptLinkId}","linkId":"${item.deptLinkId}"}`);

                    //this.initDataStr = `{"type":"DEPT","orgId":"${res.deptLinkId}","linkId":"${res.deptLinkId}"}`
                }
                this.initDataStr = strArray.join('|');
            }else{
                this.initDataStr = "";
            }
         })
     },
     onSubmit(){
         if(!this.form.name){
             return  EcoMessageBox.alert('专业名称 不能为空','提示')
         }
         if(!this.form.type){
             return  EcoMessageBox.alert('请选择专业类型','提示')
         }
         if(this.form.id > 0){
             updateActivity(this.form).then((res)=>{
                 this.$message({
                    message: '修改成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","updateActivity",res);
             });
         }else{
             addActivity(this.form).then((res)=>{
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                 this.$emit("callBack","addActivity",res);
                this.$router.push({name:'addOrUpdateActivity',params:{id:res.id}});

            })
         }

     },
     deleteActivity(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteActivityFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteActivityFunc(id){
         deleteActivity(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteActivity",id);
            this.$router.push({name:'activity'});
        })
     },
  },
  watch:{
     $route:{
         deep:true,
         handler(){
             if(this.$route.params.id > 0){
                this.form.id = this.$route.params.id;
                this.getActivityInfo(this.form.id)
            }else{
                this.form = {
                    id:null,
                    name:"",
                    type:"",
                    depts:[],
                }
                this.initDataStr = "";
            }
         }
     }
  },

};
</script>

<style scoped>
.addActivity .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addActivity .addForm{
    margin: 0 auto;
    padding: 20px;
    color: #0f1419 !important;
}
</style>
