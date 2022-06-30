<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class="regulatoryChangePoints">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                  <el-col :span='5' style='height:30px;line-height: 30px;'>
                    <strong>法规变更点检</strong>
                  </el-col>
                  <el-col :span='19' style='text-align:right'>
                      <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                      <el-button type='primary' size='small' @click='editCase({},"addCase")'>新增</el-button>
                      <el-button type='primary' size='small' @click='publishCase'>发布</el-button>
                  </el-col>
                </el-row>
              </eco-content>
              <eco-content v-show='isShowSearch' top='59px' height='60px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class="searchRow">
                    <el-col>
                        <span class='searchInputLabel'>标准法规编号:</span>
                        <el-input clearable  @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.regulationCode' placeholder='请输入'>
                          <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准法规名称:</span>
                        <el-input clearable  @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.regulationName' placeholder='请输入'>
                          <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
              </eco-content>
              <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='regulatoryPointTab' @selection-change="handleSelectionChange" highlight-current-row stripe
                    :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%'
                    class='standardizationTable' row-key='id'>
                    <el-table-column type="selection" width="55" reserve-selection>
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='regulationCode' label='标准法规编号'></el-table-column>
                    <el-table-column prop='regulationName' label='标准法规名称'></el-table-column>
                    <el-table-column label='实施时间' align='center'>
                        <el-table-column prop='implTimeNt' label='NT' align='center'></el-table-column>
                        <el-table-column prop='implTimeTt' label='TT' align='center'></el-table-column>
                    </el-table-column>
                    <el-table-column label='操作' fixed='right' width='100'>
                        <template slot-scope='scope'>
                          <el-button type='text' @click='editCase(scope.row,"editCase")'>修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </eco-content>
              <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
        <drawer @callAction='callAction' :goRoute='drawerOption.goRoute' :paramsValue='drawerOption.paramsValue' :caseType='drawerOption.caseType' :isShowDrawer='drawerOption.isShowDrawer' :drawerTitle='drawerOption.drawerTitle' @changeDrawerInfo='changeDrawerInfo'  @initDrawerInfo='initDrawerInfo'></drawer>
    </eco-content>
</template>   
<script>
    var _self;
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import { mapState } from "vuex";
    import {regulationChangeList,regulationChangePublish} from '../service/service.js' 
    import drawer from './drawer.vue'
    export default {
        name:'',
        data(){
            return {
                drawerOption:{
                    goRoute:'',
                    paramsValue:{},
                    caseType:'',
                    isShowDrawer:false,
                    drawerTitle:''
                },
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                tableData:[],
                multipleSelection:[],
                isShowSearch:false,
                searchContent:{
                    regulationCode:'',
                    regulationName:''
                }
            }
        },
        computed:{
            contentTop() {
                return this.isShowSearch ? '120px' : '59px';
            },
        },
        created(){
            _self=this;
        },
        mounted() {
            this.requestData('',false,false);
        },
        components:{
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            drawer
        },
        methods:{
            publishCase(){
                if(this.multipleSelection.length===0){
                    this.$message.warning('请至少选择一条数据!');
                    return;
                }
                this.$refs.refLoading.open();
                var ids = [];
                this.multipleSelection.forEach(item=>{
                    ids.push(item.id);
                })
                regulationChangePublish(ids).then(res=>{
                    this.$message.success('发布功能!');
                    this.requestData('search',true,true);
                }).catch(err=>{
                    this.$refs.refLoading.close();
                })

            },
            callAction(obj) {
                if (obj && (obj.action === 'edit')) {
                        //修改 刷新
                        _self.$message.success('修改成功!');
                        _self.initDrawerInfo(true);
                } else if (obj.action === 'add') {
                        //新建 刷新
                        _self.$message.success('新建成功!');
                        _self.initDrawerInfo(false);
                        _self.restSearContent();
                }
                // let callBackDialogFunc = function (obj) {
                   
                // }
                // EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'regulatoryChangePoints');
            },
            editCase(row,type){
                this.drawerOption.caseType = type;
                this.drawerOption.goRoute = 'editPoint';
                this.drawerOption.drawerTitle = type=='editCase'?'编辑':(type=='addCase'?'新增':'查看');
                if(type=='editCase' || type=="viewCase"){
                    this.drawerOption.paramsValue = {id:row.id,caseType:type};
                }else{
                    this.drawerOption.paramsValue = {id:0,caseType:type};
                }
                this.changeShowDrawer(true);
            },
            changeShowDrawer(bool){
                if(this.drawerOption.isShowDrawer == bool){
                    return;
                }
                this.drawerOption.isShowDrawer = bool;
            },
            initDrawerInfo(isRefresh){
                this.drawerOption={
                    goRoute:'',
                    paramsValue:{},
                    caseType:'',
                    isShowDrawer:false,
                    drawerTitle:''
                };
                if(isRefresh){
                    this.requestData('search',false,true);
                }
            },
            changeDrawerInfo(obj){
                this.drawerOption.goRoute =obj.goRoute;
                this.drawerOption.caseType=obj.caseType;
                this.drawerOption.drawerTitle=obj.drawerTitle;
                this.drawerOption.paramsValue = obj.paramsValue
            },
            restSearContent() {
                this.searchContent = {
                    regulationCode:'',
                    regulationName:''
                };
                this.requestData('',true,true);
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false,false);
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true,true)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            requestData(type,isFirstPage,isClearSel) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                if(isClearSel){
                    this.$refs.regulatoryPointTab.clearSelection(); //清除选项
                }
                params.page = this.baseInfo.page;
                regulationChangeList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
            },
        }
    }
</script> 
<style scoped>
.regulatoryChangePoints {
  color: #0f1419;
  min-width: 1000px;
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: auto;
  color: #0f1419;
}
.regulatoryChangePoints .searchRow{
    padding:15px 10px 16px 10px;
    background:#fff;
}
.regulatoryChangePoints .searchRow .el-col+.el-col{
    margin-top:7px;
}
.regulatoryChangePoints .searchRow .el-input{
    width:135px;
}
.regulatoryChangePoints .plainBtn:first-of-type {
    margin-left: 20px;
}

.regulatoryChangePoints .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
}
</style>