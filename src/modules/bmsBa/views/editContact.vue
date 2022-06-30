<template>
    <div >
        <el-form label-width="110px" ref="myform" :rules="rules" :model="contactInfoObj">
            <template v-for="(nodeEl,key) in formItemInfo" >
                <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="baFormItemDiv">
                    <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                        <template v-if="nodeEl.paramName=='sex'">
                            <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="contactInfoObj[key]" style="width: 100%;" size="mini">
                                <el-option  label="未知" value=""></el-option>
                                <el-option  label="男" value="m"></el-option>
                                <el-option  label="女" value="w"></el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.kvGroupDesc!=''">
                            <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="contactInfoObj[key]" style="width: 100%;" size="mini">
                                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.eleType=='time'">
                            <el-date-picker v-model="contactInfoObj[key]" type="datetime" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="mini"></el-date-picker>
                        </template>
                        <template v-else-if="nodeEl.eleType=='date'">
                            <el-date-picker v-model="contactInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
                        </template>
                        <template v-else-if="nodeEl.eleType=='textarea'">
                            <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="contactInfoObj[key]" rows="5" size="mini"></el-input>
                        </template>
                        <template v-else>
                            <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="contactInfoObj[key]"  size="mini"></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>
        </el-form>
    </div>
</template>
<script>

import { getBaDetail,getEnumText,editBaContactAjax,getContactDetail } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import {mapMutations} from 'vuex'
export default{
  name:'editContact',
  components:{

  },
  data(){
    return {
      baId:'',
      contactId:'',
      contactInfoObj:{},
      kvInfo:new KvGroup(),
      formItemInfo:new FormItemEl()
        .add("姓名(称呼)","name",'',false)
        .add("性别","sex",'',false)
        .add("职务","title",'',false)
        .add("价值","valueCode",'baContactValueCode',false)
        .add("工作电话","workPhone",'',false)
        .add("手机","mobilePhone",'',false)
        .add("宅电","homePhone",'',false)
        .add("传真","faxNo",'',false)
        .add("电子邮件","email",'',true)
        .add("工作地址","workAddr",'',true,'textarea')
        .add("家庭地址","homeAddr",'',true,'textarea')
        .add("备注","comments",'',true,'textarea'),
    /**
     * 添加字段
     *
     * @param {string} desc  描述
     * @param {string} paramName  属性名
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isWholeRow  是否占满整行，为“否”则默认两个元素一行
     * @param {string} eleType  组件类型 date\time\textarea
     */
      rules: {
        name: [
          { required: true, message: '请填写联系人称呼' }
        ]
      }
    }
  },
  created(){
    this.kvInfo = this.$parent.$parent.kvInfo;
    this.contactId = this.$parent.$parent.focusContactId;
    this.getContactInfo(this.contactId);
  },
  mounted(){

  },
  methods: {
    getContactInfo(contactId){
        if(contactId=='')return;
        this.contactId = contactId;
        console.log("focusContactId:" + this.contactId);
        this.$parent.$parent.openLoading();
        getContactDetail(contactId).then((response)=>{
            if (response.data&&response.data.id){
                this.contactInfoObj = response.data;
                this.baId = response.data.baId;
                this.$parent.$parent.closeLoading();
            }
        }).catch((error)=>{
            console.log("error!!!!!:" + error);
            this.$parent.$parent.closeLoading();
        });
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.baId = this.baId;
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      //console.log("saving contact    ===this.baId:" + this.baId);
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            //console.log("submit!!");
            //return;
            this.$parent.$parent.openLoading();
            editBaContactAjax(this.contactId,this.setSaveData(this.contactInfoObj)).then((res)=>{
              //console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                //console.log("new id:"+res.data.id);
                this.$parent.$parent.dialogVisible = false;
                this.$parent.$parent.focusPanelName = "contactor";
                this.$parent.$parent.setTabPanel();
                this.$message({type: 'success',message: '编辑成功！'});
              }else{
                this.$message({type: 'error',message: '编辑失败！'});
              }
              this.$parent.$parent.closeLoading();
            }).catch((error)=>{
              this.$parent.$parent.closeLoading();
              console.log("error:"+error);
              this.$message({type: 'error',message: '编辑失败！'});
            })
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    cleanInfo(){
       this.baId='';
       this.contactInfoObj={};
    },
    setBaId(baId){
      this.baId = baId;
    }
  },
  watch: {

  }
}
</script>
<style scpoe>

</style>
