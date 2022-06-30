<template>
    <div class="sealKgAdd">

      <ecoLoading ref='ecoLoadingRef' :text="'进行中...'"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:0px 20px 10px;">
        <el-form ref="form" :model="form" style="margin-top:20px;">

          <!-- <el-form-item label="印章类型" prop="groupId" :rules="[
            { required: true, message: '印章类型不能为空'}
          ]">
            <el-select style="width:100%;" v-model="form.groupId" clearable placeholder="请选择">
              <el-option v-for="item in sealGroupList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="印章Sealcode" prop="sealCode" :rules="[
            { required: true, message: '印章Sealcode不能为空'}
          ]">
            <el-input v-model="form.sealCode"></el-input>
          </el-form-item>

          <el-form-item label="印章管理人" prop="manageUser" :rules="[
            { required: true, message: '印章管理人不能为空'}
          ]">
            <tag-select 
                  placeholder="请选择人员"  
                  style="width: 100%;vertical-align: top;"
                  :initDataStr="form.manageUser"
                  :initOptions="{selectNum:0,selectType:'User'}" 
                  @callBack="selectManageUser" >
            </tag-select>
          </el-form-item> -->
          
          <el-form-item label="印章名称" prop="name" :rules="[
            { required: true, message: '印章名称不能为空'}
          ]">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="印章keySn" prop="keySn" :rules="[
            { required: true, message: '印章keySn不能为空'}
          ]">
            <el-input v-model="form.keySn"></el-input>
          </el-form-item>


          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
            </el-button>
            <!-- <el-button type="default" @click.native="$router.push({name:'sealListInDept'})">
              返回
            </el-button> -->
          </el-form-item>
        </el-form>
      </ecoContent>
    </div>
</template>
<script>

import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {addSealKg,getItemFetchId,getSealGroupAll} from '@/modules/sealManage/service/service.js'
export default{
  name:'sealKgAdd',
  components:{

      ecoLoading,
      ecoContent,
      ecoToolTitle,
      tagSelect,
  },
  data(){
    return {
      sealGroupList:[],
      form:{
        id:'',
        // groupId:'',
        // sealCode:'',
        // manageUser:'',
        orgId:'',
        name:'',
        keySn:'',
      }
    }
  },
  mounted(){
    this.form.orgId = this.$route.params.orgId;
    this.getItemFetchId();
    // this.getSealGroupAllFunc();
  },
  methods: {
    getItemFetchId(){
      getItemFetchId().then(res=>{
        this.form.id = res.data+'';
      }).catch(e=>{})
    },
    selectManageUser(data){
      console.log(data)
        this.form.manageUser = data.orgId;
    },
    //列表
    getSealGroupAllFunc(){
        // let orgId = this.$route.params.orgId;
        let orgId = '';
        getSealGroupAll(orgId).then((response)=>{
            this.sealGroupList = response.data.rows;
        }).catch((error)=>{
        });
    },
    save(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
                this.$refs.ecoLoadingRef.open();
                addSealKg(this.form).then((res)=>{
                  try {
                      if (res.data&&res.data.id){
                          this.$message({type: 'success',message: '添加成功！'});
                          this.$refs.ecoLoadingRef.close();
                          let doObj = {}
                          doObj.action = 'sealKgAddCallBack';
                          doObj.close = true;
                          parent.window.sysvm.callBackDialogFunc(doObj);
                      }
                  } catch (error) {}
                }).catch((error)=>{
                    this.$refs.ecoLoadingRef.close();
                    this.$message({type: 'error',message: '添加失败！'});
                })
            } else {
                return false;
            }
        });
    },

    // goBack(){
    //     this.$router.push({name:'sealListInDept'});
    // }
  },
  watch: {

  }
}
</script>
<style scope>
.sealKgAdd .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.sealKgAdd .toolbar i{
  font-size: 12px;
}
.sealKgAdd .el-customDiv {
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
