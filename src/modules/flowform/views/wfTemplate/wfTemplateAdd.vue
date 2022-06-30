<template>
  <div class="wfTemplateAddVue wfEco">

       <el-form ref="form" :model="baseInfo" label-width="120px" label-position="left">
            
            <el-form-item label="流程名称" prop="reqName" :rules="[{ required: true, message: '流程名称不能为空'}]">
                    <el-input v-model="baseInfo.reqName" ref="reqName"></el-input>
            </el-form-item>

            <el-form-item label="所属分支机构"  v-if="branchDeptEnabled" prop="branchDeptId" :rules="[{ required: true, message: '所属分支机构不能为空'}]">
                 <el-select v-model="baseInfo.branchDeptId" clearable>
                    <el-option v-for="(item,index) in branchDept" :key="index" :label="item.name" :value="item.id"></el-option>
                 </el-select>
            </el-form-item>
            
            <el-form-item label="允许所有人启动" >
                   <el-switch v-model="baseInfo.isPublic"></el-switch>
             </el-form-item>

             <el-form-item label="允许独立衍生" >
                  <el-switch v-model="baseInfo.menuInd"></el-switch>
             </el-form-item>

             <el-form-item label="纳入模块体系" >
                  <el-switch v-model="baseInfo.intoComp"></el-switch>
             </el-form-item>

              <el-form-item label="允许启动人取消" >
                 <el-switch v-model="baseInfo.allowInitCancel"></el-switch>
             </el-form-item>

              <el-form-item label="流程模板类别"  prop="group" :rules="[{ required: true, message: '流程模板类别不能为空'}]">
                    <el-select v-model="baseInfo.group" clearable placeholder="请选择类别" @change="changeGroup" @clear="clearGroup">
                        <el-option
                            v-for="item in groupKv"
                            :key="item.idString"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
             </el-form-item>

             <el-form-item label="流程模板子类别" >
                    <el-select v-model="baseInfo.subGroup" clearable placeholder="请选择子类别">
                        <el-option
                            v-for="item in groupKVChild"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                 </el-select>
             </el-form-item>

             <el-form-item label="系统预留标识" >
                <el-switch v-model="baseInfo.sysReserveFlag"></el-switch>
             </el-form-item>

              <el-form-item label="自定义标识" >
                <el-input v-model="baseInfo.defFieldId" ></el-input>
             </el-form-item>

              <el-form-item label="编码" >
                <el-input v-model="baseInfo.code" ></el-input>
             </el-form-item>

            <el-form-item label="备注" >
                <el-input v-model="baseInfo.comments" type="textarea" :autosize="{ minRows: 2}"></el-input>
            </el-form-item>

            <el-form-item label="图标">
                <el-input class="pointerClass" v-model="baseInfo.iconCard" readonly @click.native="iconChoose" v-if="baseInfo.iconCard == null || baseInfo.iconCard == ''"></el-input>
                <span v-else><i class="icon iconfont pointerClass" v-bind:class=[baseInfo.iconCard] @click="iconChoose"></i> <i @click="deleteIconCard" class="delIcon">删除</i></span>
            </el-form-item>
             
       </el-form>
       
        <div class="btn">
                <el-button @click="cancelFunc">取消</el-button>
                <el-button type="primary" @click="createWFModelFunc">开始创建</el-button>
        </div>

  </div>
</template>
<script>

  import {getWFModelCreateApplyAjax,createWFModelAjax,getBranchOrg} from '../../service/service'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  
  export default {
      components:{
          ecoContent,
      },
      name:'wfTemplateAddVue', 
      data(){
          return{
             baseInfo:{
                 operateId:0,
                 wftempId:0,

                 reqName:null,
                 isPublic:true,
                 menuInd:false,
                 intoComp:true,
                 allowInitCancel:true,

                 group:null,
                 subGroup:null,
                 sysReserveFlag:false,
                 defFieldId:null,
                 code:null,
                 comments:null,
                 branchDeptId:"-100",
                 iconCard:null
             },
             groupKv:[],
             groupKVChild:[],
             groupKVChildObj:{},
             branchDeptEnabled:false,
             branchDept:[],
             roleObj:{},
           
          }
      },

      created(){
            window.wfTemplateAddVm = this;
            this.getWFModelCreateApplyFunc();
            this.listAction();
      },
      mounted(){
            try {
                this.roleObj = EcoUtil.getSysvm().getEcoSettingObj() || {};
            } catch (error) {
                this.roleObj = {};
            }
      },
      computed:{
         
      },
      methods: {

           listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'iconChooseCallBack'){
                        window.wfTemplateAddVm.iconChooseCallBack(obj.data);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfTemplateAdd');
          },

            getWFModelCreateApplyFunc(){
                let loadingInstance = Loading.service({ fullscreen: true,text:'正在初始化...'});
                getWFModelCreateApplyAjax().then((response)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                    });
                    this.getBranchOrg();
                    if(response.data.status <= 99){
                        this.baseInfo.operateId = response.data.operate_id; //操作ID
                        this.baseInfo.wftempId = response.data.remap.wftemp_id; //流程模板ID
                        (response.data.remap.group_kv).forEach(element => {
                                this.groupKv.push(element.body);
                                this.groupKVChildObj[element.body.id+''] = element.child;
                        });
                    }else{
                            EcoMessageBox.alert('申请操作失败'+response.data.msg);
                            EcoUtil.getSysvm().closeDialog();
                    }

                }).catch((error)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });
                        EcoMessageBox.alert('申请操作失败'+error);
                        EcoUtil.getSysvm().closeDialog();
                })
          },

          getBranchOrg(){
            getBranchOrg().then((response) => {
                    this.branchDeptEnabled = response.data.branchDeptEnabled;
                    this.branchDept = response.data.departments;
                    if(this.branchDeptEnabled){
                        this.baseInfo.branchDeptId = null;
                        // this.baseInfo.branchDeptId = this.branchDept[0].id;
                    }
            }).catch((error) => {
                console.log(error)
            });
         },

         changeGroup(){
              this.baseInfo.subGroup = null;
              if( this.groupKVChildObj[this.baseInfo.group+'']){
                    this.groupKVChild = this.groupKVChildObj[this.baseInfo.group+''];
              }else{
                    this.groupKVChild = [];
              }
          },

          clearGroup(){
              this.baseInfo.subGroup = null;
              this.baseInfo.group = null;
          },

          createWFModelFunc(){
             this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let loadingInstance = Loading.service({ fullscreen: true,text:'正在创建中...'});
                        createWFModelAjax(this.baseInfo).then((response)=>{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                            });
                            if(response.data.status <=99){
                                    let doObj = {}
                                    doObj.action = 'addWFTempAddBack';
                                    doObj.data = {};
                                    doObj.data.operate_id = response.data.operate_id;
                                    doObj.data.remap = response.data.remap;
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }
                        }).catch((err)=>{
                                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                    loadingInstance.close();
                                });
                        })
                    }else{
                        return false;
                    }
                });
          },

          cancelFunc(){
              EcoUtil.getSysvm().closeDialog();
          },

          iconChoose(){
                let url = '/flowform/index.html#/iconChoose';
                EcoUtil.getSysvm().openDialog('选择图标',url,700,550,'8vh');
          },

          iconChooseCallBack(data){
              this.baseInfo.iconCard = data;
          },

          deleteIconCard(){
              this.baseInfo.iconCard = null;
          }
      }

  }

</script>

<style scoped>
.wfTemplateAddVue{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}

.wfTemplateAddVue .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.wfTemplateAddVue .content{
    margin-top:5px;
    color:#8c8080
}

.wfTemplateAddVue .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}

.wfTemplateAddVue .delIcon{
    font-size: 12px;
    cursor: pointer;
    color:tomato;
    margin-left:10px;
}
</style>
