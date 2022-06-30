<template>
    <div class="addTeamMember">
        <el-form label-width="110px" ref="myform" :rules="rules" :model="teamMemberInfoObj">
            <el-form-item label="添加人员" prop="roleUser">
              <tag-select
                    placeholder="请选择人员"
                    style="width: 100%;vertical-align: top;"
                    :initDataStr="teamMemberInfoObj.roleUser"
                    :initOptions="{selectNum:2,selectType:'User',maxOrgPathLevel:0,idSplit:','}"
                    @callBack="selectRoleUser" >
              </tag-select>
            </el-form-item>
            <el-form-item label="团队角色" prop="roleKey">
                <el-radio-group v-model="teamMemberInfoObj.roleKey" @change="changeExistPrompt">
                    <el-radio label="owner" >负责人</el-radio>
                    <el-radio label="collabrator" >工作人员</el-radio>
                    <el-radio label="guest" >访客</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div style="padding-left:41px;">
          {{existPrompt}}
        </div>
    </div>
</template>
<script>

import { addBaTeamMemberAjax,getBaTeamMemberList,getRoleDescByKey } from "@/modules/bmsBa/service/service.js";
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {mapMutations} from 'vuex'
export default{
  name:'addTeamMember',
  components:{
    tagSelect
  },
  data(){
    return {
      baId:'',
      baTeamList:[],
      teamMemberInfoObj:{
        roleUser:'',
        roleKey:'',
        baId:''
      },
      rules: {
        roleUser: [
          { required: true, message: '请选择需要添加的人员' }
        ],
        roleKey: [
          { required: true, message: '请选定团队角色' }
        ]
      },
      existPrompt:""
    }
  },
  created(){

  },
  mounted(){
    this.baId = this.$parent.$parent.baId;
    this.teamMemberInfoObj.baId = this.baId;
    this.setData();
  },
  methods: {
    changeExistPrompt(){
      this.existPrompt = "已有" + getRoleDescByKey(this.teamMemberInfoObj.roleKey) + "：";
      //console.log(this.teamMemberInfoObj.roleKey);
      let userStr = "";
      for (let i in this.baTeamList) {
        let checkNode = this.baTeamList[i];
        if(checkNode.key == this.teamMemberInfoObj.roleKey){
          if(userStr == "") userStr = checkNode.memberName;
          else userStr += " , " + checkNode.memberName;
        }
      }
      if(userStr == ""){
        this.existPrompt += "暂无";
      }else{
        this.existPrompt += userStr;
      }
    },
    getBaTeamMemberListFunc(){
      this.$parent.$parent.openLoading();
      getBaTeamMemberList(this.baId ).then(response => {
            this.baTeamList = response.data.rows;
            this.$parent.$parent.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.$parent.$parent.closeLoading();
        });
    },
    selectRoleUser(data){
      //console.log("aaaa"+data.orgId);
      //aaaa1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626 赖明桃、周彩霞、王珂伟
      this.teamMemberInfoObj.roleUser = data.orgId;
    },
    save(){
      //console.log("saving ba team member    ===this.baId:" + this.baId);
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            console.log("this.teamMemberInfoObj.roleUser:" + this.teamMemberInfoObj.roleUser);
            //console.log("submit!!");
            //return;
            this.$parent.$parent.openLoading();
            addBaTeamMemberAjax(this.teamMemberInfoObj).then((res)=>{
              console.log("submit  done!!res.status:"+res.status);
              if (res.status == 200){
                //console.log("new id:"+res.data.id);
                this.$parent.$parent.dialogVisible = false;
                this.$parent.$parent.focusPanelName = "team";
                this.$parent.$parent.setTabPanel();
                this.$message({type: 'success',message: '添加成功！'});
              }else{
                this.$message({type: 'error',message: '添加失败！'});
              }
              this.$parent.$parent.closeLoading();
            }).catch((error)=>{
              this.$parent.$parent.closeLoading();
              console.log("error:"+error);
              this.$message({type: 'error',message: '添加失败！'});
            })
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    cleanInfo(){
       this.baId='';
       this.teamMemberInfoObj={};
    },
    setBaId(baId){
      this.baId = baId;
      this.teamMemberInfoObj.baId = this.baId;
      this.setData();
    },
    setData(){
      this.existPrompt = "";
      //this.teamMemberInfoObj.roleUser = '1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626';
      //this.$set(this.teamMemberInfoObj,'roleUser','1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626')
      //this.teamMemberInfoObj = {...this.teamMemberInfoObj};
      this.getBaTeamMemberListFunc();
    }
  },
  watch: {

  }
}
</script>
<style scoped>
.addTeamMember .el-customDiv {
	min-height: 30px;
	line-height: 30px;
	-webkit-appearance: none;
	background-color: #fff;
	background-image: none;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	color: #606266;
	display: inline-block;
	font-size: inherit;
	outline: 0;
	padding: 0 5px;
	position: relative;
	-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
	transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
	width: 100%;
}
</style>
