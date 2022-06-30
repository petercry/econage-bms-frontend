<template>
    <div class="editRole">
      <ecoContent top="0" bottom="0" style="padding:10px;">
        <span style="line-height:26px;color:#999;font-size:12px;">选择角色</span>
        <el-button type="primary" @click.native="save" style="float: right;">保存<i class="el-icon-check el-icon--right"></i></el-button>
        
        <tag-select 
                  style="width:100%;vertical-align:text-top;margin-top:10px;" 
                  :initDataArray="form.roles" 
                  :initOptions="options1" 
                  @callBack="(data)=>{form.roles = data.itemArray}" >
        </tag-select>
        <span style="line-height:26px;color:#999;font-size:12px;">角色权限范围</span>
        <div style="margin-top:4px">
          <el-radio-group v-model="form.coverRoleSubDept" size="small">
            <el-radio-button :label="false">当前机构下</el-radio-button>
            <el-radio-button :label="true" >当前机构及下属机构</el-radio-button>
          </el-radio-group>
        </div>
      </ecoContent>
    </div>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getInstancePrivilegeSingle,instancePrivilegeResetRoleAjax} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {Loading } from 'element-ui';

export default{
  name:'instancePrivilegeRole',
  components:{
      ecoContent,
      tagSelect
  },
  data(){
    return {
      content:[],
      form:{
        id:'',
        roles:[],
        coverRoleSubDept:false,
      },
      options1:{
          selectNum:0,
          maxOrgPathLevel:-1,
          selectType:'role'
      },
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    getData(){
        var that = this;
        let id = this.$route.params.id; 
        getInstancePrivilegeSingle(id).then((response)=>{
            that.form.id = response.data.id;
            that.form.roles = response.data.roles||[];
            that.form.coverRoleSubDept = response.data.coverRoleSubDept;
        }).catch((error)=>{ });
    },
    save(){
          let id = this.$route.params.id; 
          let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
 
          instancePrivilegeResetRoleAjax(this.form).then((res)=>{
                this.$message({type: 'success',message: '保存成功！'});
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                 });

                let doObj = {}
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);

          }).catch((error)=>{
                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                 });
                this.$message({type: 'error',message: '保存失败！'});
          })
    }

  },
  watch: {

  }
}
</script>
<style>

.editRole .el-customDiv {
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
.editRole .el-customDiv {
	  height: auto;
    min-height: 250px;
    line-height: 30px;
}
</style>
