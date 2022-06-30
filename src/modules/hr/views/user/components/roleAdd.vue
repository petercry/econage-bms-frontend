<template>
    <div style="height:180px;" class="userRoleAdd">
      <ecoLoading ref='ecoLoadingRef' :text="'加载中'"></ecoLoading>
      
      <div style="padding:10px 20px 10px;position: relative;">
        <el-form ref="form" :model="form" label-width="80px">

          <el-form-item label="类型" prop="type" :rules="[ { required: true, message: '角色类型'}  ]">
              <el-select class="selectType1" popper-class="selectpop1" style="width:100%;" v-model="form.type" :popper-append-to-body="false" placeholder="请选择类型" @change="changeType">
                  <el-option v-for="item in roleTypeArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="角色" prop="role" :rules="[ { required: true, message: '角色不能为空'}  ]">
              <el-select class="selectType1 " popper-class="roleAddSelect" style="width:100%;" v-model="form.role" :popper-append-to-body="false" placeholder="请选择角色">
                  <el-option v-for="item in roleFilterList" :key="item.code" :label="item.name" :value="item.code" ></el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="角色范围" prop="orgArr" class="roleDef" :rules="[{ required: true, message: '角色范围不能为空'} ]"  v-if="form.type != globalKey">
              <tag-select 
                    style="width:100%;vertical-align:text-top;" 
                    :initDataArray="form.orgArr" 
                    :initOptions="options" 
                    @callBack="cbMember" >
              </tag-select>
          </el-form-item>

          <el-form-item label="">
              <el-button type="primary" @click.native="save">
                  保存
                  <i class="el-icon-check el-icon--right"></i>
              </el-button>
          </el-form-item>

          <!-- <el-dialog
            title="组织架构"
            :visible.sync="dialogVisible">
            <iframe style="width: 100%;height: 430px;" src="/hr/#/deptSelect/1"></iframe>
          </el-dialog> -->

        </el-form>
      </div>
    </div>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getRoleList,addAccountRoleConfig,getRoleTypeEnum,getOrgSingleDept} from '../../../service/service.js'
import {mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'


export default{
  name:'userRoleAdd',
  components:{
      ecoLoading,
      ecoContent,
      tagSelect
  },
  data(){
    return {
      dialogVisible:false,
      roleList:[],
      roleFilterList:[],
      form:{
          type:null,
          role:'',
          roleScope:'',
          orgObj:{
              orgPath:''
          },
          orgArr:[]
      },
      options:{
          selectNum:1,
          maxOrgPathLevel:2,
          selectType:'dept'
      },
      roleTypeArray:[],
      globalKey:'GLOBAL'
    }
  },
  mounted(){
        this.getRoleTypeEnumFunc();
        this.getRoleListFunc();
        this.getDeptDetailFunc();
  },
  methods: {
      getDeptDetailFunc(){
          let _deptId = this.$route.params.deptId;
          getOrgSingleDept(_deptId).then((response)=>{
              let _initData = {};
              _initData.linkId = response.data.id;
              _initData.orgId = response.data.id;
              _initData.type = 'DEPT';
              this.form.orgArr.push(_initData);
              this.form.roleScope = this.form.orgArr[0].orgId;
              
          })
    },

    getRoleTypeEnumFunc(){
          getRoleTypeEnum().then((response)=>{
              let _roleTypeObj = response.data;
              for(let key in _roleTypeObj){
                  this.roleTypeArray.push({id:key,name:_roleTypeObj[key]});
                  if(!this.form.type){
                     this.form.type = key;
                  }
              }
          })
    },

    cbMember(data){
        this.form.roleScope = null;
        this.form.orgArr = data.itemArray;
        if(data.itemArray.length > 0){
             this.form.roleScope = data.itemArray[0].orgId;
        }
    },

    
    getRoleListFunc(){
        getRoleList().then((response)=>{
            this.roleList = response.data.rows;
            this.getRoleFilterArray();
           
        }).catch((error)=>{ });
    },

    getRoleFilterArray(){
        let _roleArray = [];
        for(let i = 0;i<this.roleList.length;i++){
            if(this.form.type == this.globalKey){
                if(this.roleList[i].type == this.globalKey){
                     _roleArray.push(this.roleList[i]);
                }
            }else{
                if(this.roleList[i].type != this.globalKey){
                     _roleArray.push(this.roleList[i]);
                }
            }
        }
        this.roleFilterList = _roleArray;
    },

    changeType(){
        this.form.role = '';
        this.form.roleScope = null;
        this.form.orgArr = [];
        if(this.form.type == this.globalKey){
            this.form.roleScope = '-1';
        }
        this.getRoleFilterArray();
    },

    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let userId = this.$route.params.userId;
            this.$refs.ecoLoadingRef.open();
            addAccountRoleConfig(userId,this.form).then((res)=>{
              try {
                  this.$message({type: 'success',message: '添加成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'roleAddCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
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

.userRoleAdd .el-customDiv {
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


.userRoleAdd .roleDef .el-form-item__label{
  line-height: 38px;
}

.userRoleAdd .tagSelect .el-tag--mini{
  top:0px !important;
}
</style>
