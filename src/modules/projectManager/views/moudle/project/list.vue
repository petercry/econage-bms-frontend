<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="projectList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                    <el-row style="padding:12px 10px;background-color:#fff;">
                        <el-col :span="24" >
                            <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'项目列表（'+total+'）'"></eco-tool-title>
                            <el-select v-model="params.placeTypes" style="width:115px;" @change="searchListFunc">
                                <el-option
                                    v-for="(item,index) in diyuArrays" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                            <el-button plain class="plainBtn toolBtn" @click.native="addProject"><i class="icon el-icon-document-add"></i>&nbsp;添加项目</el-button>
                            <el-button plain @click.native="showExportProjectDialog" class="plainBtn toolBtn"><i class="icon el-icon-upload2"></i>&nbsp;导 入</el-button>
                            <!-- <el-upload
                                class="upload"
                                action="/api/extend/faw/pm/info-imp"
                                :show-file-list="false"
                                :limit="1"
                                :on-success="uploadSuccess"
                                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                >
                                <el-button plain class="plainBtn toolBtn"><i class="icon el-icon-upload2"></i>&nbsp;导 入</el-button>
                            </el-upload>
                            -->
                            <el-button plain @click.native="exportProject" class="plainBtn toolBtn"><i class="icon el-icon-download"></i>&nbsp;导 出</el-button>
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

                        <span>编号：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入编号" @keyup.enter.native="searchListFunc" v-model="params.code"></el-input>
                        </div>
                        <span>PDT经理：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入经理名称" @keyup.enter.native="searchListFunc" v-model="params.pdtManagerName"></el-input>
                        </div>
                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

                    </div>
                    <div>
                        <span>类型：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.type" clearable style="width:100%">
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_type']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                        <span>状态：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.status" clearable style="width:100%">
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_status']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>


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
                    <el-table-column
                        prop="index"
                        label="序号"
                        width='60'
                        min-width="60"
                        >
                        <template slot-scope="scope">

                            {{scope.$index+(params.page-1)*params.rows+1}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        label="操作"
                        width="80"
                        >
                        <template slot-scope="scope" >
                            <span class="pointerClass" v-if="scope.row.status === 'faw_pm_status_draft'" @click="invalidProject(scope.row.id)" style="color:#F56C6C;">删除</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="项目名称"
                        min-width="100"
                        >
                        <template slot-scope="scope">

                            <span @click="goDetail(scope.row)" class="pointerClass">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="项目编码"
                        width='150'
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="pdtManagerName"
                        label="PDT经理"
                        width='150'
                        min-width="100"
                        >
                    </el-table-column>
                     <el-table-column
                        prop="type"
                        label="项目类型"
                        width='100'
                        min-width="80"
                        >
                        <template slot-scope="scope">
                            {{getBaseDataTextByKey(scope.row.type,"faw_pm_type")}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="stage"
                        label="项目阶段"
                        width='100'
                        min-width="80"
                        >
                        <template slot-scope="scope">
                            {{getBaseDataTextByKey(scope.row.stage,"faw_pm_stage")}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="status"
                        label="项目状态"
                        width='100'
                        min-width="80"
                        >
                        <template slot-scope="scope">
                            {{getBaseDataTextByKey(scope.row.status,"faw_pm_status")}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="createDate"
                        label="创建日期"

                        width='120'
                        min-width="100"
                        >
                        <template slot-scope="scope">{{scope.row.createDate?scope.row.createDate.substring(0,10):''}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="planGa"
                        label="计划GA时间"
                        width='120'
                        min-width="100"
                        >
                        <template slot-scope="scope">{{scope.row.planGa?scope.row.planGa.substring(0,10):''}}</template>
                    </el-table-column>
                     <el-table-column
                        prop="closeDate"
                        label="项目关闭时间"
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
import {getProjectList,inValidProject,exportProject} from '../../../api/project.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {mapState,mapGetters,mapActions} from 'vuex'
export default {
  name:'baseData',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
  },
  data() {
    return {
       dataList:[],
       total:0,
       multipleSelection:[],
       params:{
           page:1,
           rows:10,
           order:"desc",
           sort:"createDate",
           name:"",
           type:"",
           code:"",
           status:"",
           pdtManagerName:"",
           placeTypes:""
       },
       searchShow:false,
       diyuArrays:[
           {
               text:"全部",
               id:""
           },
           {
               text:"长春",
               id:"changchunBusiness"
           },
           {
               text:"青岛",
               id:"qingdaoBusiness"
           },
           {
               text:"锡柴",
               id:"xichaiBusiness"
           },
           {
               text:"其他",
               id:"other"
           },
       ]
    }
  },
  created() {
      this.callAction();
      this.initProjectBaseData();
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
               return '162px';
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
            if(obj && (obj.action == 'addProject') ){
                this_.$message({
                    message: '添加成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this_.getListDataFunc();
            }
            if(obj && (obj.action == 'uploadProject') ){
                this_.$message({
                    message: '导入成功！',
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
        this.$refs.ecoLoadingRef.open();
        getProjectList(this.params).then(res => {
            this.$refs.ecoLoadingRef.close();
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
    invalidProject(id){
        var that  = this;
        let confirmYesFunc = function(){

            inValidProject(id).then(res => {
                that.$message({
                    message: '删除成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                that.getListDataFunc();
            })
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除该项目吗?','提示',options,confirmYesFunc);

    },
    resetSearch(){
       this.params.name = "";
       this.params.type = "";
       this.params.code = "";
       this.params.pdtManagerName = "";
       this.params.status = "";
    },
    addProject(){
        if(sysEnv == 0){
            let _width = '900';
            let _height = '600';
            let url = window.location.origin + "/#" +'/addOrUpdateProject/0';
            EcoUtil.getSysvm().openDialog('添加项目',url,_width,_height,'15vh');
        }else{
            let _width = '900';
            let _height = '600';
            let url = '/projectManager/index.html#/addOrUpdateProject/0';
            EcoUtil.getSysvm().openDialog('添加项目',url,_width,_height,'15vh');
        }
    },
    goDetail({id}){
        this.$router.push({name:"projectCard",params:{infoId:id}})
    },
    changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    },
    exportProject(){
        //window.open('/api/extend/faw/pm/info-exp')
        exportProject(this.params).then((res) => {
            if(res){
                var blob = new Blob([res], {type: "application/vnd.ms-excel"})
                var fileName = "项目列表.xlsx";
                if(window.navigator.msSaveOrOpenBlob){			// IE浏览器下
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var  link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            }

        })
    },
    showExportProjectDialog(){
        if(sysEnv == 0){
            let _width = '500';
            let _height = '400';
            let url = window.location.origin + "/#" +'/exportProject/project/0';
            EcoUtil.getSysvm().openDialog('导入',url,_width,_height,'15vh');
        }else{
            let _width = '500';
            let _height = '400';
            let url = '/projectManager/index.html#/exportProject/project/0';
            EcoUtil.getSysvm().openDialog('导入',url,_width,_height,'15vh');
        }
    }
  },
  watch:{

  },

};
</script>

<style scoped>
.projectList{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.projectList .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.projectList .toolBtn{
    margin:0 10px;
}
.projectList .upload{
    display: inline-block;
}
</style>
