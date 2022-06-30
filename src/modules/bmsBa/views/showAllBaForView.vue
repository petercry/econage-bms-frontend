<template>
    <div style="height:100%">
        <div style="height:40px;" >
            <el-row style="padding:3px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
            <el-col :span="12" >
                <eco-tool-title style="line-height: 34px;" :title="'客户列表'+'（'+paginationInfo.total+'）'"></eco-tool-title>
            </el-col>
            <el-col :span="12" style="text-align:right;padding-right:10px;padding-top:5px;">
                <el-input placeholder="请输入客户名称" class="input-with-select searchBaHeaderInput" v-model="paginationInfo.name" @keyup.enter.native="getBaListFuncWithPageReset()" clearable style="width:250px;margin-right:5px"  size="mini">
                <el-select slot="prepend" v-model="sl_searchBaName" style="width:85px;padding-left:0px;margin-left:-30px">
                    <el-option label="客户名称" value="1"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click.native="getBaListFuncWithPageReset()" style=""></el-button>
                </el-input>
            </el-col>
            </el-row>
        </div>
        <div  style="height:calc(100% - 45px);">
            <el-table :data="baListArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'lastContactTime', order: 'descending'}" @sort-change="changeSort" size="mini" class="baTable" >
                <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                <template slot-scope="scope"  >
                    <div v-if="colEl.kvGroupDesc!=''">
                    {{getEnumText(scope.row[colEl.paramName],colEl.kvGroupDesc)}}
                    </div>
                    <div v-else class="baTableTextDiv">
                    {{scope.row[colEl.paramName]}}
                    </div>
                </template>
                </el-table-column>
            </el-table>
        
            <div style="text-align: right;">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="paginationInfo.page"
                :page-sizes="[20,30,50,100]"
                :page-size="paginationInfo.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="paginationInfo.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import { getBaList,getEnumSelectEnabled,getKvListEnabled,getEnumText,openLoading,closeLoading } from "@/modules/bmsBa/service/service.js";
import {mapMutations} from 'vuex';
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
export default{
  name:'showAllBaForView',
  components:{
      ecoToolTitle
  },
  data(){
    return {
        sl_baViewType : "1",
        doWarningViewFlag: false,
        sl_searchBaName : "1",
        kvInfo: new KvGroup()
        .add("relationCode",'706')//协作要求
        .add("scaleCode",'724')//规模
        .add("firstStatus",'716')//TSR数据状态1
        .add("valueCode",'700')//价值
        .add("baEventType",'713')//客户事件--联系方式
        .add("baContactValueCode",'714')//客户联系人价值
        .add("industryCode",'708')//行业
        .add("contactsStatus",'730')//联系人状态
        .add("sourceCode",'704')//来源
        .add("ownershipCode",'710')//所有制
        .add("posCode",'702'),//排名
        paginationInfo: {
            name : "",
            industryCode : "",
            sourceCode : "",
            expireContactDay:0,
            locationAreaDesc: "",
            firstStatus : "",
            fromToNextContactDate:[],
            fromToAlreadyContactDate:[],
            valueCode : "" ,

            scaleCode : "" ,
            ownershipCode : "" ,
            posCode : "" ,
            
            searchOwnerUserStr : "" ,
            searchOwnerEmptyFlag : false ,
            searchCollaboratorUserStr : '',
            searchCollaboratorEmptyFlag : false ,
            searchGuestUserStr : "",
            searchGuestEmptyFlag : false ,

            sort: "last_contact_time_,order_seq_",
            order: "desc,desc",
            page: 1,
            rows: 50,
            total: 0
        },
        baListArray:[],
        tableColEl: new TableColEl()
        .add("客户名称","baName",'500','',true,false,true)
        .add("协作要求","relationCode",'100',"relationCode",false,false,false)
        .add("规模","scaleCode",'100',"scaleCode",false,false,false)
        .add("数据状态","firstStatus",'135',"firstStatus",false,false,false)
        .add("价值","valueCode",'50',"valueCode",false,false,false)
        .add("所在地","stateAreaDesc",'160',"",false,false,false)
        .add("最后经办人","lastActionUser","95",'',false,false,false)
        .add("最后联系日期","lastContactTime","130",'',false,false,true)
        .add("下次联系日期","nextContactTime","130",'',false,false,true),
/*
     * @param {string} desc  描述
     * @param {string} paramName  值
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
*/
    }
  },
  created(){
      this.initKvList();
  },
  mounted(){
      this.getBaListFuncWithPageReset();
  },
  methods: {
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
    changeSort(val){
        //console.log("##changeSort##:"+val.prop+"##"+val.order);
        if(val.order == null){
            this.paginationInfo.sort = "lastContactTime,orderSeq";
            this.paginationInfo.order = "desc,desc";
            val.prop = "lastContactTime";
            val.order = "descending";
        }else{
            this.paginationInfo.sort = val.prop+",orderSeq";
            if(val.order == "ascending") this.paginationInfo.order = "asc,desc";
            else this.paginationInfo.order = "desc,desc";
        }
        this.getBaListFunc();
    },
    getBaListFuncWithPageReset(){
        this.paginationInfo.page = 1;
        this.getBaListFunc();
    },
    getBaListFunc(nextTriggerFlag) {
        this.openLoading();
        getBaList(this.paginationInfo,this.sl_baViewType,this.doWarningViewFlag).then(response => {
            this.baListArray = response.data.rows;
            this.paginationInfo.total = response.data.total;
            this.closeLoading();
            //console.log("nextTriggerFlag:" + nextTriggerFlag);
            if(typeof nextTriggerFlag != "undefined"){
                if(nextTriggerFlag.indexOf("showBaInfo_")==0){
                let opBaId = nextTriggerFlag.substring(nextTriggerFlag.indexOf("_")+1);
                this.showBaInfo(opBaId);
                }
            }
            }).catch(error => {
            this.closeLoading();
            });
    },
    handleSizeChange(val) {
        this.paginationInfo.rows = val;
        this.paginationInfo.page = 1;
        this.getBaListFunc();
    },
    handleCurrentChange(val) {
        this.paginationInfo.page = val;
        this.getBaListFunc();
    },
    cleanInfo(){
    
    },
    getEnumText,
    openLoading,closeLoading,
  },
  watch: {

  }
}
</script>
<style >

</style>
