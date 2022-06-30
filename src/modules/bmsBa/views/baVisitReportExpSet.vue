<template>
    <div style="height:100%">
        <div style="height:40px;padding-left:20px;" class="baReportExpSearchArea">
          <el-row  >
            <el-col :span="24" style="padding-bottom:10px;">
              选择日期区间：<el-date-picker
                  v-model="fromToDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  size="mini" style="width:270px;margin-right:5px;">
                </el-date-picker>
                <el-button type="primary" class="btn"  icon="el-icon-notebook-1" @click.native="expReport"  size="mini">导出报表</el-button>
            </el-col>
          </el-row>  
          <el-row  >
            <el-col :span="24" style="padding-bottom:10px;">
                标签：<el-select
                v-model="baTags"
                multiple
                collapse-tags
                clearable
                size="mini"
                style="width:150px;margin-left:14px;"
                placeholder="请选择标签">
                <el-option
                  v-for="item in dynamicTags"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              来源：
              <el-select  placeholder="请选择来源" v-model="sourceCode" style="width: 112px;" size="mini" clearable>
                  <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('sourceCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
              </el-select>
            </el-col>
          </el-row> 
          <el-row  >
            <el-col :span="24" style="padding-bottom:10px;">
                价值：<el-select  placeholder="请选择价值" v-model="valueCode" style="width: 150px;margin-left:14px;" size="mini" clearable>
                    <el-option v-for="(kvEl,index) in kvInfo.getKvListByGroupDesc('valueCode')" :key="index" :label="kvEl.text" :value="kvEl.id"></el-option>
                </el-select>
            </el-col>
          </el-row> 
          <el-row  >
            <el-col :span="24" style="line-height:30px;margin-bottom:30px;">
              负责人：<tag-select
                  placeholder="请选择负责人"
                  style="width: 150px;vertical-align: top;"
                  :initDataStr="searchOwnerUserStr"
                  :initOptions="{selectNum:1,selectType:'User',maxOrgPathLevel:0,idSplit:','}"
                  @callBack="selectOwnerRoleUserForSearch" >
              </tag-select>
              <el-checkbox style="margin-right:15px;" v-model="searchOwnerEmptyFlag">为空</el-checkbox>
            </el-col>
          </el-row>   
        </div>
    </div>
</template>
<script>
import { searchBaVisitReportXlsExpAjax } from "@/modules/bmsBa/service/service.js";
import {EcoFile} from '@/components/file/main.js';
import tagSelect from '@/components/orgPick/tagSelect.vue';
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import {getTagOption} from "@/modules/bmsMmm/util/utility.js";
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
export default{
  name:'baVisitReportExpSet',
  components:{
    tagSelect
  },
  data(){
    return {
        fromToDate:[],
        searchOwnerUserStr : "" ,
        searchOwnerEmptyFlag : false ,
        sourceCode : "",
        valueCode : "",
        baTags : [],
        dynamicTags: [], //多选标签
        TAG_GROUP_ID: "BMS_BA_TAG" ,
        kvInfo: new KvGroup()
        .add("sourceCode",'704')//来源
        .add("valueCode",'700')//价值
    }
  },
  created(){
     
  },
  mounted(){
     this.initData();
  },
  methods: {
      cleanInfo(){
        this.fromToDate = [];
        this.searchOwnerUserStr = "";
        this.searchOwnerEmptyFlag = false;
        this.sourceCode = "";
        this.valueCode = "";
        this.baTags = [];
      },
      initData(){
        this.initDynamicTags();
        this.initKvList();
      },
      async initKvList(){
        for (let i in this.kvInfo) {
          let e = this.kvInfo[i];
          e.kvList = await axios.get(baseUrl+'/basic/kv/group/'+e.groupId+'/detail/select-enabled',{
            params:{
              time:new Date().getTime()
            }
          }).then(res=>{
            return res.data;
          }).catch(e=>{console.log("errorrrrrr!")});
          /*
          if(e.groupDesc=='scaleCode'){
            e.kvList.push({id: "1",text:"未知"});
          }*/
        }
      },
      async initDynamicTags(){
        this.dynamicTags = await getTagOption(this.TAG_GROUP_ID);
      },
      expReport(){
          if(this.fromToDate==null || this.fromToDate.length!=2){
              this.$message({type: 'error',message: '请选择日期区间'});
              return;
          }
          searchBaVisitReportXlsExpAjax(this.fromToDate,this.sourceCode,this.valueCode,this.baTags,this.searchOwnerUserStr,this.searchOwnerEmptyFlag).then((response)=>{
            var blob = new Blob([response.data], { type: 'application/octet-stream' });
            EcoFile.downloadFile(blob, this.fromToDate[0] + "至" + this.fromToDate[1] + "客户拜访记录表.xlsx");
          });
      },
      selectOwnerRoleUserForSearch(data){
        //this.paginationInfo.searchOwnerUserStr = data.orgId;
      },
  },
  watch: {

  }
}
</script>
<style >

</style>
