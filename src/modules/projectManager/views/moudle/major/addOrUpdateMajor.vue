<template>
    <div class="addMajor" v-loading="loading">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="form.id > 0? '编辑专业':'新建专业'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-show="form.id > 0" @click="deleteMajor">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="120px" class="addForm">
            <el-form-item label="专业名称" required>
                <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="专业类型" required>
                <el-select v-model="form.type" :disabled="form.id > 0" style="width:400px;"  placeholder="请选择类型">
                   <el-option v-for="(item,index) in majorType" :key="index"

                    :label="item.text"
                    :value="item.id">

                    </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="关联部门" required>
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
import {addMajor,updateMajor,getMajorInfo,deleteMajor} from '../../../api/major.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'addMajor',
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
        initDataStr:"",
        loading:false
    }
  },
  created() {
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
          this.getMajorInfo(this.form.id)
      }
  },
  filters:{

  },
  computed: {
    ...mapGetters([
        'majorType',
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
     getMajorInfo(id){
         this.loading = true;
         console.log(213123);
         getMajorInfo(id).then((res)=>{
            this.loading = false;
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
         if(!this.form.depts || this.form.depts.length == 0 ){
             return  EcoMessageBox.alert('请选择关联部门','提示')
         }
         if(this.form.id > 0){
             updateMajor(this.form).then((res)=>{
                 this.$message({
                    message: '修改成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","updateMajor",res);
             });
         }else{
             addMajor(this.form).then((res)=>{
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addMajor",res);
                if(window.isInCard){
                    this.$router.push({name:'addOrUpdateMajorInCard',params:{id:res.id}});
                }else if(window.isInProjectCard){
                    this.$router.push({name:'addOrUpdateMajorInProjectCard',params:{id:res.id}});
                }else{
                    this.$router.push({name:'addOrUpdateMajor',params:{id:res.id}});
                }
            })
         }

     },
     deleteMajor(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteMajorFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteMajorFunc(id){
         deleteMajor(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteMajor",id);
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
             console.log(111);
             if(this.$route.params.id > 0){
                this.form.id = this.$route.params.id;
                this.getMajorInfo(this.form.id)
            }else{
                this.form = {
                    id:null,
                    name:"",
                    type:"",
                    depts:[],
                }
                this.initDataStr = "";
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
.addMajor{
    position: relative;
}
.addMajor .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addMajor .addForm{
    margin: 0 auto;
    padding: 20px;
    color: #0f1419 !important;
}
</style>
