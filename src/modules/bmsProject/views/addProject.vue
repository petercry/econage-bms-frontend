<template>
    <div >
        <el-form label-width="95px" ref="myform" :rules="rules" :model="projectInfoObj">
            <template v-for="(nodeEl,key) in formItemInfo" >
                <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                    <el-divider v-if="nodeEl.paramName=='productFocusFlag'" content-position="left">产品技术相关</el-divider>
                    <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                        <template v-if="nodeEl.paramName=='priority'">
                            <el-radio-group v-model="projectInfoObj[key]">
                                <el-radio v-for="(kvEl,index) in projectPriorityV" :key="index" :label="kvEl.id" >{{kvEl.desc}}</el-radio>
                            </el-radio-group>
                        </template>
                        <template v-else-if="nodeEl.paramName=='projectType'">
                            <el-radio-group v-model="projectInfoObj[key]" @change="changePhase">
                                <el-radio v-for="(kvEl,index) in projectTypeV" :key="index" :label="kvEl.id" >{{kvEl.desc}}</el-radio>
                            </el-radio-group>
                        </template>
                        <template v-else-if="nodeEl.paramName=='projectPhase'">
                            <el-radio-group v-model="projectInfoObj[key]">
                                <el-radio style="margin-right:20px;" v-for="(kvEl,index) in validProPhaseV" :key="index" :label="kvEl.id" >{{kvEl.desc}}</el-radio>
                            </el-radio-group>
                        </template>
                        <template v-else-if="nodeEl.paramName=='productFocusFlag'">
                            <el-tooltip class="item" effect="dark" placement="bottom-start">
                                <div slot="content" style="line-height:20px;">若选“是”，则此项目的二开指令流程均会流经产品团队关注需求
                                </div>
                                <i class="fa fa-question-circle-o " style="color:#606266;cursor:pointer;"></i>
                            </el-tooltip>
                            <el-radio-group v-model="projectInfoObj[key]">
                                <el-radio label="true" >是</el-radio>
                                <el-radio label="false" >否</el-radio>
                            </el-radio-group>
                        </template>
                        <template v-else-if="nodeEl.kvGroupDesc!=''">
                            <template v-if="nodeEl.eleType=='radio'">
                                <el-radio-group v-model="projectInfoObj[key]">
                                    <el-radio v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.id">{{kvEl.text}}</el-radio>
                                </el-radio-group>
                            </template>
                            <template v-else>
                                <el-select  :placeholder="'请选择'+nodeEl.desc" v-model="projectInfoObj[key]" :style="nodeEl.paramName=='contractNature'?'width: 150px;':'width: 100%;'" clearable>
                                    <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc(nodeEl.kvGroupDesc)" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                                </el-select>
                            </template>
                            <template v-if="nodeEl.paramName=='contractNature' && projectInfoObj.contractNature!=null && (projectInfoObj.contractNature=='1499698890439356417'||projectInfoObj.contractNature=='1499698945393127426'||projectInfoObj.contractNature=='1499698972526080001')">
                              &nbsp;&nbsp;&nbsp;合同有效期&nbsp;&nbsp;&nbsp;
                              <el-date-picker
                                v-model="projectInfoObj.contractValidDate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                >
                              </el-date-picker>
                            </template>
                        </template>
                        <template v-else-if="nodeEl.eleType=='textarea'">
                            <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="projectInfoObj[key]" rows="3"></el-input>
                        </template>
                        <template v-else-if="nodeEl.eleType=='date'">
                            <el-date-picker v-model="projectInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                        </template>
                        <template v-else-if="nodeEl.eleType=='selectSingleUser'">
                            <el-select
                                v-model="projectInfoObj[key]"
                                filterable
                                clearable
                                remote
                                :placeholder="'请输入'+nodeEl.desc"
                                :remote-method="getUserListByNameQuery"
                                style="width:400px;"
                                >
                                <el-option
                                v-for="userItem in userSearchResultsV"
                                :key="userItem.id"
                                :label="userItem.mi"
                                :value="userItem.id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.eleType=='selectCustomer'">
                            <el-select
                                v-model="projectInfoObj[key]"
                                filterable
                                clearable
                                remote
                                :placeholder="'请输入'+nodeEl.desc"
                                :remote-method="searchBa"
                                style="width:400px;"
                                >
                                <el-option
                                v-for="item in customerSearchResultsV"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else-if="nodeEl.eleType=='relatedBaIds'">
                            <el-select
                                v-model="projectInfoObj[key]"
                                multiple
                                filterable
                                clearable
                                remote
                                :placeholder="'请输入'+nodeEl.desc"
                                :remote-method="searchBa"
                                style="width:100%;"
                                >
                                <el-option
                                v-for="item in customerSearchResultsV"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else>
                            <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="projectInfoObj[key]" ></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>

        </el-form>
    </div>
</template>
<script>
import { getBaList } from "@/modules/bmsBa/service/service.js";
import {getUserListByNameQuery} from "@/modules/bmsMmm/service/service.js";
import { projectTypeV,projectPriorityV,projectPhaseForMaintain,projectPhaseForSales,projectPhaseForCommon,addProjectAjax } from "@/modules/bmsProject/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import {mapMutations} from 'vuex';
export default{
  name:'addProject',
  components:{
  },
  data(){
    var validateForContractNo = (rule, value, callback) => {
      if (this.projectInfoObj.contractSignDate!=null && this.projectInfoObj.contractSignDate!=='' && (value==null||value === '')) {callback(new Error('请输入合同编号'));}else{callback();}
    };
    var validateForContractStatus = (rule, value, callback) => {
      if (this.projectInfoObj.contractSignDate!=null && this.projectInfoObj.contractSignDate!=='' && (value==null||value === '')) {callback(new Error('请选择合同状态'));}else{callback();}
    };
    var validateForContractNature = (rule, value, callback) => {
      if (this.projectInfoObj.contractSignDate!=null && this.projectInfoObj.contractSignDate!=='' && (value==null||value === '')) {callback(new Error('请选择合同性质'));}else{callback();}
    };
    var validateForTotalStatus = (rule, value, callback) => {
      if (this.projectInfoObj.contractSignDate!=null && this.projectInfoObj.contractSignDate!=='' && (value==null||value === '')) {callback(new Error('请选择项目结算状态'));}else{callback();}
    };
    return {
      projectInfoObj:{},
      userSearchResultsV:[],
      kvInfo:new KvGroup(),
      formItemInfo:new FormItemEl()
        .add("项目名称","projectName",'',true)

        .add("客户全称","customerDesc",'',false)
        .add("合同编号","contractNo",'',false)
        .add("签约时间","contractSignDate",'',false,'date')
        .add("合同状态","contractStatus",'contractStatus',false,'')
        .add("合同性质","contractNature",'contractNature',false,'')
        .add("结算状态","totalStatus",'totalStatus',false,'')

        .add("优先级","priority",'',true)
        .add("项目类别","projectType",'',true)
        .add("当前阶段","projectPhase",'',true)
        .add("项目状态","projectStatus",'projectStatus',true,'radio')
        .add("产品类别","productType",'productType',true,'radio')
        .add("销售经理","salesManager",'',true,'selectSingleUser')
        .add("关联客户","relatedBaIds",'',true,'relatedBaIds')
        .add("开始时间","startDate",'',true,'date')
        .add("项目地点","location",'',true,"textarea")
        .add("备注","comments",'',true,"textarea")
        .add("是否需要产品团队关注","productFocusFlag",'',true)
        .add("内部平台URL","devPlatformUrl",'',true)
        .add("登录用户名","devPlatformUserid",'',false)
        .add("密码","devPlatformPwd",'',false)
        .add("数据库IP","devPlatformDbIp",'',false)
        .add("数据库SID","devPlatformDbSid",'',false)
        .add("版本库地址","devVersionLib",'',true)
        .add("其他内部环境相关备注","devComments",'',true,"textarea")
        .add("钉钉项目群助手令牌","dingGroupAccessToken",'',true)
        .add("钉钉项目群助手密钥","dingGroupSecret",'',true),

      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        customerDesc: [
          { required: true, message: '请输入客户全称', trigger: 'blur' }
        ],
        contractNo: [
          { validator: validateForContractNo, trigger: 'blur' }
        ],
        contractStatus: [
          { validator: validateForContractStatus, trigger: 'blur' }
        ],
        contractNature: [
          { validator: validateForContractNature, trigger: 'blur' }
        ],
        totalStatus: [
          { validator: validateForTotalStatus, trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '请设定项目优先级', trigger: 'blur' }
        ],
        projectType: [
          { required: true, message: '请选择项目类别', trigger: 'blur' }
        ],
        salesManager: [
          { required: true, message: '请确认销售经理', trigger: 'blur' }
        ],
        productFocusFlag: [
          { required: true, message: '请确定是否需要产品团队关注', trigger: 'blur' }
        ]
      },
      validProPhaseV:[],
      customerSearchResultsV:[],
      searchBaList:[],
      baSearchPaginationInfo: {
        name : "",
        industryCode : "",
        sourceCode : "",
        expireContactDay:0,
        locationAreaDesc: "",
        firstStatus : "",
        fromToNextContactDate:[],
        sort: "last_contact_time_,order_seq_",
        order: "desc,desc",
        page: 1,
        rows: 100,
        total: 0
      },
      projectTypeV,projectPriorityV
    }
  },
  created(){
    this.kvInfo = this.$parent.$parent.kvInfo;
  },
  mounted(){
  },
  methods: {
    changePhase(){
        if(this.projectInfoObj.projectType == '4'){ //维保项目
            this.validProPhaseV = projectPhaseForMaintain;
        }else if(this.projectInfoObj.projectType == '2'){ //售前项目
            this.validProPhaseV = projectPhaseForSales;
        }else{ //实施项目、研发项目、其他项目
            this.validProPhaseV = projectPhaseForCommon;
        }
        this.validProPhaseV = {...this.validProPhaseV};
    },
    cleanInfo(){
      this.projectInfoObj={};
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        if(i=='contractValidDate'){
          if(data[i]!=null){
            if(data[i][0]!=null && typeof data[i][0]!="undefined"){
              obj['contractValidDateFrom']=data[i][0];
            }else{
              obj['contractValidDateFrom']='';
            }
            if(data[i][1]!=null && typeof data[i][1]!="undefined"){
              obj['contractValidDateTo']=data[i][1];
            }else{
              obj['contractValidDateTo']='';
            }
          }else{
            obj['contractValidDateFrom']='';
            obj['contractValidDateTo']='';
          }
        }else{
          obj[i] = data[i];
        }
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
            addProjectAjax(this.setSaveData(this.projectInfoObj)).then((res)=>{
              console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                console.log("new id:"+res.data.id);
                this.$parent.$parent.trivialDialogVisible = false;
                this.$parent.$parent.clearSearchParam();
                this.$parent.$parent.getProjectListFunc("showProjectInfo_"+res.data.id);
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
    searchBa(nameQuery){
      //console.log("nameQuery:" + nameQuery);
      this.baSearchPaginationInfo.name = nameQuery;
      this.$parent.$parent.openLoading();

      getBaList(this.baSearchPaginationInfo,1,false).then(response => {
          this.searchBaList = response.data.rows;
          //console.log("####this.projectList:"+this.projectList.length);
          this.customerSearchResultsV = [];
          for(let i in this.searchBaList){
            let node = {"id":this.searchBaList[i].id , "name":this.searchBaList[i].baName};
            this.customerSearchResultsV.push(node);
          }
          //console.log("####this.proOptions:"+this.proOptions);
          this.baSearchPaginationInfo.total = response.data.total;
          this.$parent.$parent.closeLoading();
        }).catch(error => {
          this.$parent.$parent.closeLoading();
        });
    },
    getUserListByNameQuery
  },
  watch: {

  }
}
</script>
<style >

</style>
