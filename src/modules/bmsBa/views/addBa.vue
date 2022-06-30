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
                            <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="baInfoObj[key]" size="mini"></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>

        </el-form>
    </div>
</template>
<script>
import {getCurrDateMinute,getTagOption,setSelectedTag,handleTagInputConfirm,showTagInput} from "@/modules/bmsMmm/util/utility.js";
import { getBaDetail,addBaAjax } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import {mapMutations} from 'vuex';
import { regionDataPlus,CodeToText } from 'element-china-area-data'
export default{
  name:'addBa',
  components:{
  },
  data(){
    return {
      baInfoObj:{},
      areaOptions: regionDataPlus,
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
        .add("备注","comments",'',true,"textarea"),
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
    this.initData();
  },
  mounted(){
    this.baInfoObj.bizOppoTime = getCurrDateMinute();
    this.baInfoObj = {...this.baInfoObj};
    console.log("this.baInfoObj.bizOppoTime:" + this.baInfoObj.bizOppoTime);
  },
  methods: {
    async initData(){
      this.dynamicTags = await getTagOption(this.TAG_GROUP_ID);
      this.selectedBaTags = [];
      this.selectedProductDirectionOptions = [];
      //console.log("this.dynamicTags:" + this.dynamicTags + "###" + this.dynamicTags.length);
    },
    cleanInfo(){
      this.baInfoObj={};
      this.baInfoObj.bizOppoTime = getCurrDateMinute();
      this.baInfoObj = {...this.baInfoObj};
      this.dynamicTagInputVisible = false;
      this.dynamicTagInputValue = "";
      this.initData();
      //console.log("cleanInfo after---this.baInfoObj.bizOppoTime:" + this.baInfoObj.bizOppoTime);
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      if(obj.expectTenderTime!=null && obj.expectTenderTime!='' && obj.expectTenderTime.length == 7){
        obj.expectTenderTime = obj.expectTenderTime + "-01";
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
      //console.log("stateAreaDesc:"+stateAreaDesc);
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
            addBaAjax(this.setSaveData(this.baInfoObj)).then((res)=>{
              console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                console.log("new id:"+res.data.id);
                this.$parent.$parent.trivialDialogVisible = false;
                this.$parent.$parent.clearSearchParam();
                this.$parent.$parent.getBaListFunc("showBaInfo_"+res.data.id);
                //this.$parent.$parent.showBaInfo(res.data.id);
                this.$message({type: 'success',message: '添加成功！'});
              }else{
                this.$message({type: 'error',message: '添加失败！'});
              }
            }).catch((error)=>{
              this.$parent.$parent.closeLoading();
              console.log("error:"+error);
              this.$message({type: 'error',message: '添加失败！'});
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
    handleTagInputConfirm,showTagInput
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
