<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="forInput deliverList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                    <el-row style="padding:12px 10px;background-color:#fff;">
                        <el-col :span="24" >
                            <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'风险清单（'+total+'）'"></eco-tool-title>
                            <el-button plain class="plainBtn toolBtn" @click.native="addRisk" v-if="editable && (roleMap['admin'] || roleMap['add'])"><i class="icon el-icon-document-add"></i>&nbsp;添加风险</el-button>
                            <el-button plain class="plainBtn toolBtn" @click.native="searchShow = !searchShow"><i class="icon el-icon-search"></i>&nbsp;高级搜索</el-button>
                        </el-col>
                    </el-row>
            </eco-content>
            <eco-content top="61px" v-show="searchShow" style="overflow:hidden">
                <div class="searchBox">
                    <div>

                        <span>名称：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入名称" @keyup.enter.native="searchListFunc" v-model="params.name"></el-input>
                        </div>

                        <span>状态：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.status" clearable style="width:100%">
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_risk_status']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                        <span>风险等级：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.level" clearable style="width:100%">
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_risk_important']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                        <span>类别：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.category" clearable style="width:100%">
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_risk_category']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>
                    </div>
                </div>
            </eco-content>
            <eco-content bottom="42px" :top="getContentTop" ref="content" style="padding:10px 15px;">
                <el-table
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    border
                    @header-dragend="changeColWidth"
                    ref="multipleTable"
                    class="ecoList"
                    height="100%"
                    @row-dblclick="goDetail"
                    stripe
                    @selection-change="changeFun"
                >
                  <el-table-column  min-width="50" width="50">
                      <template slot-scope="scope">
                      <div class="color-tag height-red"  v-if="scope.row.light=='red'"></div>
                        <div class="color-tag medium-yellow"   v-if="scope.row.light=='yellow'"></div>
                        <div class="color-tag low-green" v-if="scope.row.light=='green'" ></div>
                      </template>
                  </el-table-column>
                    <el-table-column
                        label="序号"
                        width='60'
                        type="index"
                        min-width="60"
                        >
                        <!-- <template slot-scope="scope">

                            {{scope.$index+(params.page-1)*params.rows+1}}
                        </template> -->
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="风险名称"
                        min-width="100"
                        >
                           <template slot-scope="scope">
                            <span @click="goDetail(scope.row)" class="pointerClass">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                      <el-table-column
                        prop="status"
                        label="风险状态"
                        width='150'
                        min-width="100"
                        >
                        <template slot-scope="scope">
                            {{getBaseDataTextByKey(scope.row.status,"faw_pm_risk_status")}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="level"
                        label="风险等级"
                        width='150'
                        min-width="100"
                        >
                        <template slot-scope="scope">
                            {{getBaseDataTextByKey(scope.row.level,"faw_pm_risk_important")}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="attention"
                        label="关注级别"
                        width='100'
                        min-width="80"
                        >
                        <template slot-scope="scope">
                            {{getBaseDataTextByKey(scope.row.attention,"faw_pm_risk_attention")}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="category"
                        label="类别"
                        width='100'
                        min-width="80"
                        >
                        <template slot-scope="scope">
                            {{getBaseDataTextByKey(scope.row.category,"faw_pm_risk_category")}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="dutyUserName"
                        label="负责人"
                        width='100'
                        min-width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="planCloseDate"
                        label="计划关闭时间"
                        width='120'
                        min-width="100"
                        >
                    </el-table-column>
                     <el-table-column
                        prop="actualCloseDate"
                        label="实际关闭时间"
                        width='120'
                        min-width="100"
                        >
                    </el-table-column>
                </el-table>

            </eco-content>
             <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
                <el-row >
                    <el-col :span="24" style="text-align:right">
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="params.page"
                            :page-sizes="[10,30,50,100]"
                            :page-size="params.rows"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total" style="margin-right:20px">
                            </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
    </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {getRiskList} from '../../../api/risk.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {getPMModelRole } from '../../../api/common.js'
import {mapState,mapGetters,mapActions} from 'vuex'
export default {
  name:'riskList',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
  },
  data() {
    return {
       id:"",
       dataList:[],
       total:0,
       multipleSelection:[],
       params:{
           infoId:'',
           page:1,
           rows:10,
           order:"desc",
           sort:"createDate",
           name:"",
           status:"",
           searchKey:"",
           level:'',
           category:''
       },
       searchShow:false,
       roleMap:{}
    }
  },
  props:{
        editable: {
            type: Boolean,
            default(){
                return true
            }
        }
  },
  created() {
      this.id=this.$route.params.id
      this.params.infoId=this.id
      this.callAction();
      this.initProjectBaseData();
      this.getPMModelRole();
  },

  activated(){

  },

  mounted(){
      this.getListDataFunc();
  },

  computed: {
      ...mapGetters([
          'baseData',
          'getBaseDataTextByKey'
      ]),
      getContentTop:function(){
           if(this.searchShow){
               return '113px';
           }else{
               return '61px';
           }
       },
  },

  methods: {
    ...mapActions([
        'initProjectBaseData',
    ]),
    callAction(){
        let this_ = this;
        window.tabClickFunc = function(){
            this_.getListDataFunc();
        }
        let callBackDialogFunc = function(obj){
            if(obj && (obj.action == 'addRisk') ){
                this_.$message({
                    message: '添加成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this_.getListDataFunc();
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'projectlistvue');
    },
    changeFun(rows) {
        this.multipleSelection = rows;
    },

    getListDataFunc(){
       this.$refs.ecoLoadingRef.open()
        getRiskList(this.params).then(res => {
          this.$refs.ecoLoadingRef.close()
            this.total = res.total;
            this.dataList = res.rows;
        })
    },
     searchListFunc(){
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.params.page = 1;
        this.getListDataFunc();
    },
    //表格排序
    sortTablefunc(column,prop,order){
        if(column.prop && column.order){
            this.params.sort = column.prop;
            if(column.order == 'ascending'){
                this.params.order = 'asc'
            }else if(column.order == 'descending'){
                this.params.order = 'desc'
            }
        }
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.getListDataFunc();
    },

    //每页条数
    handleSizeChange(val) {
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.params.rows = val;
        this.params.page = 1;
        this.getListDataFunc();
    },

    //跳转页码
    handleCurrentChange(val) {
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.params.page = val;
        this.getListDataFunc();
    },

    resetSearch(){
       this.params.name = "";
       this.params.status = "";
       this.params.level="";
       this.params.category="";
    },
    addRisk(){
        if(sysEnv == 0){
            // let _width = '900';
            // let _height = '600';
            // let url = window.location.origin + "/#" +'/addRisk/'+this.id;
            // EcoUtil.getSysvm().openDialog('添加风险',url,_width,_height,'15vh');
            this.$router.push({name:'addRisk',params:{infoId:this.id}})
            }
            else{
            let _width = '900';
            let _height = '600';
            let url = '/projectManager/index.html#/addRisk'+'/'+this.id;
            EcoUtil.getSysvm().openDialog('添加风险',url,_width,_height,'15vh');
        }
    },
      getPMModelRole(){
          getPMModelRole(this.$route.params.id,'faw_pm_model_risk').then(res=>{
            console.log(res);
            this.roleMap = res;
        })
      },
    goDetail({id}){
        this.$router.push({name:"detailRisk",params:{riskId:id}})
    },
    changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    }
  },
  watch:{

  },

};
</script>

<style scoped>
.forInput{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.forInput .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.forInput .toolBtn{
    margin:0 10px;
}
.color-tag{
   width: 16px;
   height: 16px;
   border-radius: 50%;
}
.height-red{
   background-color: red;
}
.low-green{
   background-color: #66cc00;
}
.medium-yellow{
  background-color: yellow;
}
</style>
