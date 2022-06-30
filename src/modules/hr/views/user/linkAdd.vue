<template>
    <div style="height:180px;" class="linkAdd">
        <div style="padding:0px 20px 10px;position: relative;">
          <el-form ref="form" :model="form" label-width="110px">

          <el-form-item label="引用现有人员" prop="userArr" :rules="[{ required: true, message: '人员不能为空'} ]">
              <tag-select 
                      style="width:100%;vertical-align:text-top;" 
                      :initDataArray="form.userArr" 
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
        
        </el-form>
      </div>
    </div>
</template>
<script>


import {Loading } from 'element-ui';
import {addUserLink} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'

export default{
  name:'userLinkAdd',
  components:{
    tagSelect
  },
  data(){
    return {
      dialogVisible:false,
      form:{
          userArr:[]
      },

       options:{
          selectNum:0,
          maxOrgPathLevel:2,
          selectType:'user'
      }
    }
  },
  mounted(){
  },
  methods: {

    cbMember(data){
        this.form.userArr = data.itemArray;
    },

    save(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
              let deptId = this.$route.params.deptId;
              let userId = this.form.userArr.map(item=>{
                  return item.linkId;
              })
              let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});
              addUserLink(deptId,userId).then((res)=>{
                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                  });

                  try {
                      this.$message({type: 'success',message: '添加成功！'});
                      let doObj = {}
                      doObj.action = 'linkAddCallBack';
                      doObj.close = true;
                      EcoUtil.getSysvm().callBackDialogFunc(doObj);
                  } catch (error) { }

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
  }
}
</script>
<style scope>


.linkAdd .el-customDiv {
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


.linkAdd .el-customDiv {
	  height: auto;
    min-height: 150px;
    line-height: 30px;
}
</style>