<template>
    <div class="signatureSetting" v-loading="loading">
       <el-form  :model="form" ref="form" label-position="top" :show-message="false" class="container" label-width="100px">
            <el-form-item label="印章类型">
                <el-radio-group v-model="selectType">
                  <el-radio-button label="1">单位印章</el-radio-button>
                  <!-- <el-radio-button label="2">个人印章</el-radio-button> -->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="印章选择">
               <div style="height: 50px;line-height: 50px;">
                  <!-- <el-select placeholder="请选择类型" style="width:130px;margin-right:10px;" v-model="form.relAssignee">
                      <el-option
                          :key="index"
                          v-for="(item,index) in typeList"
                          :label="item.name"
                          :value="item.value">
                      </el-option>
                  </el-select> -->
                   <el-cascader
                        style="width:166px;"
                        v-model="form.relAssignee_temp"
                        :options="typeList"
                        @change="relAssigneeChange"
                        :ref="'relAssignee'"
                        :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"
                        
                    >
                    <template slot-scope="{ node, data }">
                        <span>{{ data.optionName }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                    </template>
                    </el-cascader>
                  <div v-show="ifPersonType" style="display:inline-block;margin-left:10px;">
                    <el-select placeholder="请选择部门" style="width:130px;margin-right:10px;" v-model="form.relOrgLevel">
                        <el-option
                            :key="index"
                            v-for="(item,index) in system_orglevel"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select  placeholder="请选择印章类型" style="width:140px;" v-model="form.sealCat">
                        <el-option
                            :key="index"
                            v-for="(item,index) in seal_cats"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                  </div>
                  <div v-show="ifDeptType" style="display:inline-block;margin-left:10px;">
                    <tag-select v-show="form.relAssignee ==3" placeholder="点击选择机构" style="width:155px;margin-right:10px;" :initOptions="{selectType:'Dept',selectNum:1}" :initDataStr="form.selOrgId" @callBack="tagSelectCB"></tag-select>
                    <div class="el-customDiv"  style="width:155px;cursor: pointer;"  @click="selectSignature" v-show="form.relAssignee == 3">
                        <div class="selectDiv">
                        <span v-show="tags.length==0" class="placeholder">点击选择签章</span>
                        <el-tag
                            v-for="(tag,index) in tags"
                            :key="tag.name"
                            closable
                            size="mini"
                            class="ellipsis"
                            @close="removeTag($event,index)"
                            :type="tag.type">
                            {{tag.name}}
                        </el-tag>
                        </div>
                        <i class="iconfont icon iconseal"></i>
                    </div>
                    <el-image
                        v-show="form.relAssignee==3 && form.smallSrc"
                        style="width: 50px;height:50px;vertical-align: middle;margin-left:10px"
                        :src="form.smallSrc"
                        :zIndex=2910
                        >
                            <div slot="placeholder" class="image-slot">
                                加载中<span class="dot">...</span>
                            </div>
                        </el-image>
                  </div>
               </div>
            </el-form-item>
        </el-form>
        <div class="btn">
              <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
              <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import tagSelect from '../direction/module/tagSelect.vue'
import {EcoUtil} from '@/components/util/main.js'
import {getSignatureSettingInfo,saveSignatureSettingInfo} from '../../service/service.js'
export default{
  data(){
    return {
      selectType:"1",
      form:{
          relAssignee:1,
          relOrgLevel:"",
          sealCat:"",
          sealId:"",
          selOrgId:"",
          selOrgName:"",
          posItem:"",
          sealName:"",
          smallSrc:""
      },
      typeList:[
        {
          name:"发起人所在",
          value:1
        },
        {
          name:"选择机构",
          value:3
        }
      ],
      tags:[],
      bigSrc:[],
      operateId:"",
      seal_cats:[],
      system_orglevel:[],
      modelType:"",
      loading:false
    }
  },
  components: {
   ecoLoading,
   tagSelect
  
  },
  created(){
    this.operateId = this.$route.params.operateId;
    this.getSignatureSettingInfo();
  },
  beforeDestroy() {
     
  },
  mounted(){
    this.bindAction();
  },
  computed:{
      ifPersonType(){
          if(this.form.relAssignee != 3 || this.modelType == 'USERSLT'){
              return true;
          }
          return false;
      },
      ifDeptType(){
          if(this.form.relAssignee == 3 || this.modelType == 'ORGSLT'){
              return true;
          }
          return false;
      }
  },
  methods: {
       bindAction(){
            let that = this;
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'selectSignature'){
                    that.tags = [];
                    that.bigSrc = [];
                    that.form.smallSrc = "";
              
                    that.tags.push(obj.data);
                    that.form.sealId = obj.data.id;
                    that.form.sealName = obj.data.name;
                    that.form.smallSrc = obj.data.smallSrc;
                    that.bigSrc.push(obj.data.bigSrc);
                 
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'signatureSetting');
      },
      getSignatureSettingInfo(){
          this.loading = true;
          getSignatureSettingInfo(this.operateId).then((response) => {
              this.loading = false;
              this.seal_cats = response.data.remap.seal_cats;
              this.typeList = response.data.remap.rel_asn_options;
              this.system_orglevel = response.data.remap.system_orglevel;
              if(response.data.remap.default_seal){
                  this.form = response.data.remap.default_seal;
                  if(this.form.sealId){
                      let obj = {
                          name:this.form.sealName,
                          type:""
                      }
                      this.tags.push(obj);
                  }
                  if(this.form.relAssignee == 3){
                      this.form.sealCat = this.seal_cats.length>0?this.seal_cats[0].id:"";
                      this.form.relOrgLevel = this.system_orglevel.length>0?this.system_orglevel[0].id:"";
                  }
              }else{
                  this.form.relAssignee_temp = ['1'];
                  this.form.sealCat = this.seal_cats.length>0?this.seal_cats[0].id:"";
                  this.form.relOrgLevel = this.system_orglevel.length>0?this.system_orglevel[0].id:"";
              }
          });
      },
      selectSignature(){
            if(!this.form.selOrgId && this.form.relAssignee == 3){
              EcoMessageBox.alert('请先选择机构','提示');
              return;
            }
            let _width = '1000';
            let _height = '500';
            let url = '/flowform/index.html#/selectSignature/'+this.form.selOrgId;
            EcoUtil.getSysvm().openDialog('选择印章',url,_width,_height,'15vh');
      },
      tagSelectCB(data){
          console.log(data);
          this.form.selOrgId = data.orgId;
          this.form.selOrgName = data.name;
          if(!this.form.selOrgId){
              this.tags = [];
              this.form.sealId = "";
              this.form.sealName = "";
              this.form.smallSrc = "";
              this.bigSrc = [];
          }
      },
      relAssigneeChange(value){
          console.log(value)
          this.form.relAssignee = value[value.length-1];
          let node = this.$refs['relAssignee'].getCheckedNodes()[0].data;
          this.modelType = node.modelType;
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
           if(!this.form.sealId && this.form.relAssignee == 3){
             EcoMessageBox.alert('请选择签章','提示');
             return;
          }
          if(this.form.relAssignee == 3){
              this.form.sealCat = "";
              this.form.relOrgLevel = "";
          }else{
              this.form.sealId = "";
              this.form.sealName = "";
              this.form.selOrgName = "";
              this.form.selOrgId = "";
              this.form.smallSrc = "";
          }
          let obj = {
            operate_id:this.operateId,
            default_seal:JSON.stringify(this.form)
          }
          this.loading = true;
          saveSignatureSettingInfo(obj).then((response) => {
            this.loading = false;
            let doObj = {}
            doObj.action = 'signatureSetting';
            doObj.data = {
                id:this.form.sealId
            };
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
          });
          
      },
      removeTag(e,index){
          e.stopPropagation();
          this.tags.splice(index, 1);
          this.form.sealId = "";
          this.form.sealName = "";
          this.form.smallSrc = "";
          this.bigSrc = [];
      }
  },
  watch: {
     
  }
}
</script>
<style scoped>
.signatureSetting{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
.container{
    padding: 20px 12px 10px;
}
.signatureSetting .btn{
  text-align: right;
  margin:20px 10px;
}
.signatureSetting .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}
.signatureSetting .selectDiv{
    padding-right: 28px;
    display: inline-block;
}
.signatureSetting .iconfont{
    position: absolute;
    color: #1ba5fa;
    right: 8px;
    top: 6px;
    font-size: 20px;
    line-height: 20px;
    cursor: unset;
}
.signatureSetting .el-tag--mini{
    height: 22px;
    padding: 0 3px;
    line-height: 22px;
    margin-right: 3px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fafafa;
    border-color:#e8e8e8;
    max-width: 110px;
    position: relative;
    padding-right: 15px;
    top: 5px;
}
.signatureSetting .selectDiv .placeholder{
    margin-left: 10px;
    font-size: 13px;
    display: inline-block;
    position: absolute;
    top: 0px;
}
.signatureSetting .el-image__error{
	font-size: 12px;
}
</style>
