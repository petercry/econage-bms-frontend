<template>
    <div class="flowStartQuanXian" v-loading="loading">
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            
            <el-tab-pane label="启动权限" name="14">
                <tag-select  style="width: 100%;vertical-align: top;" :initDataArray="dataMap['14'].tgList" :initOptions="options" @callBack="tagSelectCB"></tag-select>
            </el-tab-pane>

            <el-tab-pane label="查看权限" name="16">
                <tag-select  style="width: 100%;vertical-align: top;" :initDataArray="dataMap['16'].tgList" :initOptions="options" @callBack="tagSelectCB" ></tag-select>
            </el-tab-pane>

            <el-tab-pane label="监管权限" name="12">
              <tag-select  style="width: 100%;vertical-align: top;"  :initDataArray="dataMap['12'].tgList" :initOptions="options" @callBack="tagSelectCB" ></tag-select>
            </el-tab-pane>

            <el-tab-pane label="设计权限" name="11">
              <tag-select  style="width: 100%;vertical-align: top;"  :initDataArray="dataMap['11'].tgList" :initOptions="options" @callBack="tagSelectCB" ></tag-select>
            </el-tab-pane>
        </el-tabs>
        
         <div class="btn">
                <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
                <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
          </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import tagSelect from '../../views/direction/module/tagSelect.vue'
import {getFlowStartPermission,saveFlowStartPermission} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'

export default{
  data(){
    return {
        initValue:"",
        activeName:'14',

        dataMap:{
            "14":{tgList:null},
            "12":{tgList:null},
            "11":{tgList:null},
            "16":{tgList:null},
            "15":{tgList:null},
        },

        options:{
            selectNum:0,
            selectType:'dept-user-usergroup-role',
        },

        loading:true,
        templateId:""
    }
  },
  components: {
      ecoLoading,
      tagSelect
  },
  created(){
     
  },
  beforeDestroy() {
     
  },
  mounted(){
        this.templateId = this.$route.params.templateId;
        this.getFlowStartPermission();
  },
  computed:{

  },
  methods: {
      getFlowStartPermission(){
         this.loading = true;
         getFlowStartPermission(this.templateId).then((response) => {
               this.loading = false;
               if(response.data.status <=99){
                    let _data = response.data.remap.permissions;
                    for(let key in _data){
                            this.$set(this.dataMap[key],'tgList',_data[key].tgList);
                    }
               }
         }).catch((error) => {
                this.loading = false;
          });
      },

      tagSelectCB(data){
          this.$set(this.dataMap[this.activeName],'tgList',data.itemArray);
      },
      
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },

      handleClick(){
          if(!this.dataMap.hasOwnProperty(this.activeName)){
              this.dataMap[this.activeName] = { tgList:null};
          }
      },

      onSubmit(){
          let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
          let _dataRole = [];
          for(let key in this.dataMap){
                let _item = {};
                _item.roleId = key;
                _item.tgList = this.dataMap[key].tgList;
                _dataRole.push(_item);
          }
      
          let _data = {
              role_str:JSON.stringify(_dataRole),
              template_id:this.templateId
          }
          saveFlowStartPermission(_data).then((response) => {
               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
                if(response.data.status <=99){
                         EcoUtil.getSysvm().$message({type: 'success',message: '保存成功！'});
                        let doObj = {}
                        doObj.action = 'flowStartQuanXian';
                        doObj.data = {};
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                  };
          }).catch((error) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
          });
      },
  },
  watch: {
     
  }
}
</script>
<style >
.flowStartQuanXian .el-customDiv{
	height: 200px;
    overflow-y: auto;
    overflow-x:hidden;
}
</style>

<style scoped>

.flowStartQuanXian{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}

 .flowStartQuanXian .panel{
   height:220px;
 }
 .flowStartQuanXian .btn{
    text-align: right;
    margin:10px;
}


</style>
