<template>
    <div class="editMember">
      <ecoContent top="0" bottom="0" style="padding:10px;">
        <span style="line-height:26px;color:#999;font-size:12px;">选择人员</span>
        <el-button type="primary" @click.native="save" style="float: right;">保存<i class="el-icon-check el-icon--right"></i></el-button>
        
        <tag-select 
                  style="width:100%;vertical-align:text-top;margin-top:10px;" 
                  :initDataArray="form.users" 
                  :initOptions="options1" 
                  @callBack="(data)=>{form.users = data.itemArray}" >
        </tag-select>
      
        <span style="line-height:26px;color:#999;font-size:12px;">选择机构</span>
        <tag-select 
                  style="width:100%;vertical-align:text-top;margin-top:10px;" 
                  :initDataArray="form.userScopes" 
                  :initOptions="options2" 
                  @callBack="(data)=>{form.userScopes = data.itemArray}" >
        </tag-select>
      </ecoContent>
    </div>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getInstancePrivilegeSingle,instancePrivilegeResetUserAjax} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {Loading } from 'element-ui';

export default{
  name:'instancePrivilegeMember',
  components:{
      ecoContent,
      tagSelect
  },
  data(){
    return {
      content:[],
      form:{
        id:'',
        users:[],
        userScopes:[],
      },
      options1:{
          selectNum:0,
          maxOrgPathLevel:2,
          selectType:'user'
      },
      options2:{
          selectNum:0,
          maxOrgPathLevel:2,
          selectType:'dept'
      }
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
            that.form.users = response.data.users||[];
            that.form.userScopes = response.data.userScopes||[];
        }).catch((error)=>{ });
    },

    save(){
          let id = this.$route.params.id; 
          let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
 
          instancePrivilegeResetUserAjax(this.form).then((res)=>{
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

.editMember .el-customDiv {
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
.editMember .el-customDiv {
	  height: auto;
    min-height: 250px;
    line-height: 30px;
}
</style>
