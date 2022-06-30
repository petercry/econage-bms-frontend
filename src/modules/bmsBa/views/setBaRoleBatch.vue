<template>
    <div >
        <el-form label-width="100px" ref="myform"  :model="roleInfoObj" class="setBaRoleForm">
            <el-form-item label="操作">
                <el-radio-group v-model="roleInfoObj.op">
                    <el-radio label="1" >添加权限</el-radio>
                    <el-radio label="2" >删除权限</el-radio>
                    <el-radio label="3" >更新权限</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="老角色" v-show="roleInfoObj.op=='3'">
                <el-radio-group v-model="roleInfoObj.oldRole">
                    <el-radio label="owner" >负责人</el-radio>
                    <el-radio label="collaborator" >工作人员</el-radio>
                    <el-radio label="guest" >访客</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="老人员" class="baSearchArea" v-show="roleInfoObj.op=='3'">
                <tag-select 
                placeholder="请选择人员"  
                style="width: 340px;vertical-align: top;"
                :initDataStr="roleInfoObj.oldRoleUser"
                :initOptions="{selectNum:1,selectType:'User',maxOrgPathLevel:0,idSplit:','}" 
                @callBack="selectOldRoleUser" >
                </tag-select>
            </el-form-item>
            <div style="margin:5px 0px 5px 47px;font-weight:700;color:#f25d0c;"  v-show="roleInfoObj.op=='3'">替换为 ===>>></div>
            <el-form-item label="角色">
                <el-radio-group v-model="roleInfoObj.newRole">
                    <el-radio label="owner" >负责人</el-radio>
                    <el-radio label="collabrator" >工作人员</el-radio>
                    <el-radio label="guest" >访客</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="人员" class="baSearchArea">
                <tag-select 
                placeholder="请选择人员"  
                style="width: 340px;vertical-align: top;"
                :initDataStr="roleInfoObj.newRoleUser"
                :initOptions="{selectNum:2,selectType:'User',maxOrgPathLevel:0,idSplit:','}" 
                @callBack="selectNewRoleUser" >
                </tag-select>
            </el-form-item>
        </el-form>    
    </div>
</template>
<script>

import { setBaRoleBatchAjax } from "@/modules/bmsBa/service/service.js";
import {mapMutations} from 'vuex';
import tagSelect from '@/components/orgPick/tagSelect.vue';
export default{
  name:'setBaRoleBatch',
  components:{
      tagSelect
  },
  data(){
    return {
      roleInfoObj:{
          op : "1" ,
          newRole : "owner" , 
          oldRole : "owner" , 
          newRoleUser : "" ,
          oldRoleUser : ""
      },
    }
  },
  created(){
      //console.log("@@@@@" + this.roleInfoObj.op);
  },
  mounted(){
  },
  methods: {
    cleanInfo(){
     this.roleInfoObj.op = "1";
     this.roleInfoObj.newRole = "owner";
     this.roleInfoObj.oldRole = "owner";
     this.roleInfoObj.newRoleUser = "";
     this.roleInfoObj.oldRoleUser = "";
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      //obj.baIdStr = 
      let baIdStr = "";
      for(let i in this.$parent.$parent.multipleTableSelection){
          //console.log("@@@@@@@@@@@@@@@@@@@@" + this.$parent.$parent.multipleTableSelection[i].id);
          if(baIdStr == ""){
              baIdStr = this.$parent.$parent.multipleTableSelection[i].id;
          }else{
              baIdStr += "," + this.$parent.$parent.multipleTableSelection[i].id;
          }
      }
      obj.baIdStr = baIdStr;
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
        this.$parent.$parent.openLoading();
        setBaRoleBatchAjax(this.setSaveData(this.roleInfoObj)).then((res)=>{
            console.log("submit  done!!res.data:"+res);
            if (res.status == 200){
                console.log("new id:"+res.data);
                this.$parent.$parent.setBaRoleBatchDialogVisible = false;
                this.$parent.$parent.getBaListFunc();
                this.$message({type: 'success',message: '操作成功！'});
            }else{
                this.$message({type: 'error',message: '操作失败！'});
            }
        }).catch((error)=>{
            this.$parent.$parent.closeLoading();
            console.log("error:"+error);
            this.$message({type: 'error',message: '操作失败！'});
        })
    },
    selectNewRoleUser(data){
        this.roleInfoObj.newRoleUser = data.orgId;
    },
    selectOldRoleUser(data){
        this.roleInfoObj.oldRoleUser = data.orgId;
    }
  },
  watch: {

  }
}
</script>
<style >

</style>
