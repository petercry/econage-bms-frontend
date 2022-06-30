<template>
    <div >
        <el-form label-width="110px" ref="myform" :rules="rules" :model="baInfoObj">
            <template v-for="(nodeEl,key) in formItemInfo" >
                <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="baFormItemDiv">
                    <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                        <template v-if="nodeEl.paramName=='address'">
                          <el-cascader
                            size="mini"
                            :options="areaOptions"
                            v-model="baInfoObj['stateAreaArray']"
                            placeholder="请选择行政区划">
                          </el-cascader>
                          <el-input type="textarea" placeholder="请输入详细地址" v-model="baInfoObj[key]" rows="3" style="margin-top:2px;" size="mini"></el-input>
                        </template>
                        <template v-else-if="nodeEl.paramName=='baTag'">
                          <div  >
                            <el-tag
                              :key="tag.id"
                              v-for="(tag, i) in dynamicTags"
                              @click="changeTag(i)"
                              :type="tag.type"
                              style="cursor: pointer;"
                              class="infoTag"
                            >
                              {{ tag.name }}
                            </el-tag>
                            <el-input
                              class="input-new-tag"
                              v-if="dynamicTagInputVisible"
                              v-model="dynamicTagInputValue"
                              ref="newTagInput"
                              size="mini"
                              @keyup.enter.native="handleTagInputConfirm"
                              @blur="handleTagInputConfirm"
                            >
                            </el-input>
                            <el-button
                              v-else
                              class="button-new-tag"
                              size="mini"
                              @click="showTagInput"
                              >+ 添加</el-button
                            >
                          </div>
                        </template>
                        <template v-else-if="nodeEl.paramName=='productDirection'">
                            <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="selectedProductDirectionOptions" style="width: 100%;" size="mini" multiple collapse-tags>
                                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.kvGroupDesc!=''">
                            <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="baInfoObj[key]" style="width: 100%;" size="mini">
                                <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.eleType=='textarea'">
                            <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="baInfoObj[key]" rows="3" size="mini"></el-input>
                        </template>
                        <template v-else-if="nodeEl.eleType=='date'">
                            <el-date-picker v-model="baInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  size="mini"></el-date-picker>
                        </template>
                         <template v-else-if="nodeEl.eleType=='month'">
                            <el-date-picker v-model="baInfoObj[key]" type="month" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM" value-format="yyyy-MM"  size="mini"></el-date-picker>
                        </template>
                        <template v-else-if="nodeEl.eleType=='time'">
                            <el-date-picker v-model="baInfoObj[key]" type="datetime" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"  size="mini"></el-date-picker>
                        </template>
                        <template v-else-if="nodeEl.eleType=='number'">
                            <el-input :placeholder="'请输入'+nodeEl.desc" v-model.number="baInfoObj[key]" oninput="this.value = this.value.replace(/[^0-9.]/g,'');" size="mini"></el-input>
                        </template>
                        <template v-else>
                            <el-input :placeholder="'请输入'+nodeEl.desc" v-model="baInfoObj[key]" size="mini"></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>
        </el-form>
    </div>
</template>
<script>
import {getTagOption,setSelectedTag,handleTagInputConfirm,showTagInput} from "@/modules/bmsMmm/util/utility.js";
import { getBaDetail,getEnumText,editBaAjax } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import {mapMutations} from 'vuex';
import { regionDataPlus,CodeToText } from 'element-china-area-data';
export default{
  name:'editBa',
  components:{
  },
  data(){
    return {
      baInfoObj:{},
      areaOptions: regionDataPlus,
      baId:'',
      baName:'',
      kvInfo:new KvGroup(),
      formItemInfo:new FormItemEl()
        .add("客户名称","baName",'',true)
        .add("标签","baTag",'',true)
        .add("简称","shortName",'',false)
        .add("协作要求","relationCode",'relationCode',false)
        .add("数据状态","firstStatus",'firstStatus',false)
        .add("来源","sourceCode",'sourceCode',false)
        .add("规模","scaleCode",'scaleCode',false)
        .add("商机时间","bizOppoTime",'',false,"time")
        .add("排名","posCode",'posCode',false)
        .add("价值","valueCode",'valueCode',false)

        .add("当前阶段","currentPhase",'currentPhase',false)
        .add("产品方向","productDirection",'productDirection',false)
        .add("项目预算(万元)","projectBudget",'',false,"number")
        .add("预期定标时间","expectTenderTime",'',false,"month")
        .add("竞争情况","competitiveSituation",'',true,"textarea")

        .add("行业","industryCode",'industryCode',false)
        .add("目前软件","currentSoftware",'',false)
        .add("网址","webUrl",'',true)
        .add("销售额(亿)","revenue",'',false)
        .add("员工人数","numOfEmp",'',false)
        .add("所有制","ownershipCode",'ownershipCode',false)
        .add("地址","address",'',true)
        .add("联系人状态","contactsStatus",'contactsStatus',false)
        .add("联系人","clientContactPerson",'',false)
        .add("电话","phoneNo",'',false)
        .add("传真","faxNo",'',false)
        .add("电子邮件","emailAddr",'',true)
        .add("开户银行","bankName",'',false)
        .add("帐号","bankAccount",'',false)
        .add("税号","taxId",'',false)
        .add("备注","comments",'',true,"textarea")

        .add("下次联系时间","nextContactTime",'',false,"date"),
      rules: {
        baName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        relationCode:[
          { required: true, message: '请选择协作要求' }
        ],
        firstStatus:[
          { required: true, message: '请选择数据状态' }
        ],
        sourceCode:[
          { required: true, message: '请选择来源' }
        ],
        valueCode:[
          { required: true, message: '请选择价值' }
        ],
        industryCode:[
          { required: true, message: '请选择行业' }
        ],
        ownershipCode:[
          { required: true, message: '请选择所有制' }
        ],
        stateAreaArray:[
          { required: true, message: '请选择地址' }
        ],
      },
      dynamicTags: [], //多选标签
      dynamicTagInputVisible: false, //控制添加标签input的显示与隐藏
      dynamicTagInputValue: "", // 添加标签input值
      selectedBaTags: [],
      TAG_GROUP_ID: "BMS_BA_TAG",
      selectedProductDirectionOptions: [],
    }
  },
  created(){
    this.kvInfo = this.$parent.$parent.kvInfo;
    this.baId = this.$parent.$parent.baId;
    this.getBaInfo(this.baId);
  },
  mounted(){
  },
  methods: {
    async initDynamicTags(){
      this.dynamicTags = await getTagOption(this.TAG_GROUP_ID);
      this.selectedBaTags = [];
      //console.log("this.dynamicTags:" + this.dynamicTags + "###" + this.dynamicTags.length);
    },
    initBaAssociationInfo(){
      this.selectedProductDirectionOptions = [];
      //console.log("this.dynamicTags:" + this.dynamicTags + "###" + this.dynamicTags.length);
    },
    getBaInfo(baId){
      if(baId=='')return;
      this.$parent.$parent.openLoading();
      this.initDynamicTags();
      this.initBaAssociationInfo();
      this.baId = baId;
      //console.log("getBaInfo in editBa--> baId:" + baId);
      getBaDetail(baId).then((response)=>{
          //console.log("response back:" + baId);
        if (response.data&&response.data.id){
            this.baInfoObj = response.data;
            this.baName = response.data.baName;
            if(this.baInfoObj.stateArea!=null&&this.baInfoObj.stateArea!=""){
              let stateAreaStr = this.baInfoObj.stateArea;
              if(stateAreaStr.indexOf("[")==0&&stateAreaStr.indexOf("]")>0){
                stateAreaStr = stateAreaStr.substring(1,stateAreaStr.length-1);
                this.baInfoObj.stateAreaArray = stateAreaStr.split(',');
                for(let i in this.baInfoObj.stateAreaArray){
                  this.baInfoObj.stateAreaArray[i] = this.baInfoObj.stateAreaArray[i].trim();
                }
              }
            }
            this.selectedBaTags = this.baInfoObj.baTag;
            for(let i = 0; i< this.baInfoObj.baTag.length; i++) {
              for(let j = 0; j< this.dynamicTags.length; j++) {
                if(this.baInfoObj.baTag[i].tagKeyId == this.dynamicTags[j].id) {
                  this.dynamicTags[j].type = ''
                }
              }
            }
            this.selectedProductDirectionOptions = [];
            if(this.baInfoObj.productDirectionOptions!=null && this.baInfoObj.productDirectionOptions.length > 0){
              for(let i=0;i<this.baInfoObj.productDirectionOptions.length;i++){
                this.selectedProductDirectionOptions.push(this.baInfoObj.productDirectionOptions[i].modularInnerId);
              }
            }
            this.$parent.$parent.closeLoading();
        }
      }).catch((error)=>{
          console.log("error!!!!!:" + error);
         this.$parent.$parent.closeLoading();
      });
    },
    cleanInfo(){
      this.baName='';
      this.baInfoObj={};
      this.baInfoObj.stateAreaArray = new Array("","","");
      this.dynamicTagInputVisible = false;
      this.dynamicTagInputValue = "";
      this.initDynamicTags();
      this.initBaAssociationInfo();
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      let stateAreaDesc = "";
      if(this.baInfoObj['stateAreaArray']!=null&&this.baInfoObj['stateAreaArray'].length>0){
        for(let i in this.baInfoObj['stateAreaArray']){
          let node_code = this.baInfoObj['stateAreaArray'][i];
          let node_desc = CodeToText[node_code];
          if(node_desc!=null&&node_desc!=""){
            if(stateAreaDesc == "") stateAreaDesc = node_desc;
            else stateAreaDesc += "/" + node_desc;
          }
        }
      }
      //console.log("obj.expectTenderTime:"+obj.expectTenderTime);
      if(obj.expectTenderTime!=null && obj.expectTenderTime!='' && obj.expectTenderTime.length == 7){
        obj.expectTenderTime = obj.expectTenderTime + "-01";
      }
      obj.stateAreaDesc = stateAreaDesc;
      obj.baTag = this.selectedBaTags;
      obj.productDirectionOptions = [];
      for(let i=0;i<this.selectedProductDirectionOptions.length;i++){
        let productDirectionOption_obj = {baId:this.baId , modular:"product_direction", modularInnerId:this.selectedProductDirectionOptions[i]};
        obj.productDirectionOptions.push(productDirectionOption_obj);
      }
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            //console.log("submit!!");
            //return;
            this.$parent.$parent.openLoading();
            editBaAjax(this.baId,this.setSaveData(this.baInfoObj)).then((res)=>{
              //console.log("submit  done!!");
              this.$message({type: 'success',message: '编辑成功！'});
              this.$parent.$parent.dialogVisible = false;
              this.$parent.$parent.getBaInfo(this.baId);
              try{this.$parent.$parent.$parent.$parent.refreshSingleRowInTable(this.baId);}catch(error){console.log("error:"+error);}
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
    changeTag(i){
      this.selectedBaTags = setSelectedTag(this.dynamicTags , i);
      //console.log("this.selectedBaTags:" + this.selectedBaTags.length);
    },
    handleTagInputConfirm,showTagInput,getEnumText
  },
  watch: {

  }
}
</script>
<style scoped>
.el-tag{
  font-weight: 600;
  margin-right: 10px;
}
.el-tag--info{
  font-weight: 600;
  color: #aeb1b7;
}

</style>
