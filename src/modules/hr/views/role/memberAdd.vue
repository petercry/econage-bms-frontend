<template>
    <div style="height:180px;" class="roleMemberAdd" v-show="!loading">
    
      
      <div style="padding:10px 20px 10px;position: relative;">
        <el-form ref="form" :model="form" label-width="80px">

            <el-form-item label="绑定角色" prop="role" :rules="[ { required: true, message: '角色不能为空'}  ]">
                  {{form.roleName}}
            </el-form-item>


            <el-form-item label="角色范围" prop="orgArr" class="roleDef" :rules="[{ required: true, message: '角色范围不能为空'} ]"  v-if="form.type != globalKey">
                  <tag-select 
                      style="width:100%;vertical-align:text-top;" 
                      :initDataArray="form.orgArr" 
                      :initOptions="options" 
                      @callBack="cbMember" >
                  </tag-select>
            </el-form-item>


            <el-form-item label="人员" prop="userArray" class="roleDef" :rules="[{ required: true, message: '人员不能为空'} ]" >
                  <tag-select 
                      style="width:100%;vertical-align:text-top;" 
                      :initDataArray="form.userArray" 
                      :initOptions="userOptions" 
                      @callBack="cbUser" >
                  </tag-select>
            </el-form-item>


            <el-form-item label="">
                <el-button type="primary" @click.native="save">
                    保存
                    <i class="el-icon-check el-icon--right"></i>
                </el-button>
            </el-form-item>

        </el-form>
      </div>
    </div>
</template>
<script>


import ecoContent from '@/components/pageAb/ecoContent.vue'
import {addAccountRoleConfig,updateRoleMember,getRoleMember} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {Loading } from 'element-ui';

export default{
  name:'roleMemberAdd',
  components:{
  
      ecoContent,
      tagSelect
  },
  data(){
    return {
      dialogVisible:false,
      form:{
          type:null,
          role:'',
          roleName:'',
          roleScope:'',
          orgObj:{
              orgPath:''
          },
          orgArr:[],
          userArray:[],
      },
      options:{
          selectNum:1,
          maxOrgPathLevel:2,
          selectType:'dept'
      },
      userOptions:{
          selectNum:0,
          maxOrgPathLevel:2,
          selectType:'user'
      },
  
      globalKey:'GLOBAL',
      dataList:[],
      loading:true
    }
  },
  mounted(){
        this.form.role =  this.$route.params.roleCode;
        this.form.type = this.$route.params.roleType;
        this.form.roleName = decodeURIComponent(this.$route.params.roleName);
        if(this.form.type == this.globalKey){
            this.form.roleScope = '-1';
        }
        this.getRoleMemberFunc();
  },
  methods: {

     getRoleMemberFunc(){
        let _params = {};
        _params.roleCode = this.form.role;
        _params.page = 1;
        _params.rows = 9999;
        getRoleMember(_params).then((response)=>{
              this.dataList = response.data;
              this.loading = false;
        })
    },

    cbMember(data){
        this.form.roleScope = null;
        this.form.orgArr = data.itemArray;
        if(data.itemArray.length > 0){
            this.form.roleScope = data.itemArray[0].orgId;
        }
    },

    cbUser(data){
        this.form.userArray = data.itemArray;
       
    },

    save(){
        this.$refs['form'].validate((valid) => {
            if (valid) {

              let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
              let _memberArray = EcoUtil.objDeepCopy(this.dataList);

              for(let i = 0;i< this.form.userArray.length;i++){
                  let _memberItem = {};
                  _memberItem.userId = this.form.userArray[i].linkId;
                  _memberItem.role = this.form.role;
                  _memberItem.roleScope = this.form.roleScope;
                  _memberArray.push(_memberItem);
              }

              updateRoleMember(this.form.role,_memberArray).then((res)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                    });
                    try {
                          this.$message({type: 'success',message: '添加成功！'});
                          let doObj = {}
                          doObj.action = 'roleMemberAddCallBack';
                          doObj.close = true;
                          parent.window.sysvm.callBackDialogFunc(doObj);
                    } catch (error) {}
              }).catch((error)=>{
                   this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                          loadingInstance.close();
                  });
                  this.$message({type: 'error',message: '添加失败！'});
              })
            } else {
                return false;
            }
        });
    }
  },
  watch: {

  }
}
</script>
<style>

.roleMemberAdd .el-customDiv {
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

.roleMemberAdd .el-customDiv .selectDiv{
  max-height: 140px;
  overflow: auto;
}

.roleMemberAdd .roleDef .el-form-item__label{
  line-height: 38px;
}

.roleMemberAdd .tagSelect .el-tag--mini{
  top:0px !important;
}
</style>
