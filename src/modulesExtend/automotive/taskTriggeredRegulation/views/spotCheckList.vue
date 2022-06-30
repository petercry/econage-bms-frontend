<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class="spotCheckList">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                  <el-col :span='5' style='height:30px;line-height: 30px;'>
                    <strong>{{titleList[phase]}}</strong>
                  </el-col>
                  <el-col :span='19' style='text-align:right'>
                      <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                      <el-button type='primary' size='small' v-show='phase == "PROJECT_CONTACT"' @click='checkCase(true)'>点检</el-button>
                      <el-button type='primary' size='small' v-show='phase == "PROJECT_CONTACT"' @click='checkCase(false)'>不点检</el-button>
                      <el-button type='primary' size='small' v-show='phase !== "PROJECT_CONTACT"' @click='approvalCase(true)'>同意</el-button>
                      <el-button type='primary' size='small' v-show='phase !== "PROJECT_CONTACT"' @click='approvalCase(false)'>不同意</el-button>
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
                        <span class='searchInputLabel'>平台:</span>
                        <el-select style='width:150px;' v-model='searchContent.platform' placeholder="请选择" clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in proPlatfForm' :key='item.id'>
                            </el-option>
                        </el-select>
                        <span class='searchInputLabel'>状态:</span>
                        <el-select style='width:150px;' v-model='searchContent.processStatus' placeholder="请选择" clearable>
                            <el-option value='PENDING' label='待办'></el-option>
                            <el-option value='HANDLED' label='已办'></el-option>
                        </el-select> 
                        <!-- <span class='searchInputLabel'>车型:</span>
                        <el-input clearable  @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.a' placeholder='请输入'>
                          <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input> -->
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
              </eco-content>
              <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='spotCheckTab' @selection-change="handleSelectionChange" highlight-current-row stripe
                    :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%'
                    class='standardizationTable' row-key='id'>
                    <el-table-column type="selection" width="55" reserve-selection>
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='processStatusName' label='状态'></el-table-column>
                    <el-table-column prop='type' label='类型'>
                        <template slot-scope='scope'>
                            <span>{{scope.row.type=='INIT'?"初始":(scope.row.type=="CHECK"?"点检":"不点检")}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='regulationCode' label='标准编号'></el-table-column>
                    <el-table-column prop='regulationName' label='标准法规名称'></el-table-column>
                    <el-table-column prop='platform' label='平台'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.platform,'proPlatfForm')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='projectName' label='项目名称'></el-table-column>
                    <el-table-column prop='projectContactName' label='项目联络人姓名'></el-table-column>
                    <el-table-column prop='regulationLeaderName' label='标准专业负责人姓名'></el-table-column>
                    <el-table-column prop='projectLeaderName' label='项目专业负责人姓名'></el-table-column>
                    <el-table-column prop='projectContactAssignTime' label='发布时间' v-if='phase == "PROJECT_CONTACT"'></el-table-column>
                    <el-table-column prop='regulationLeaderAssignTime' label='到达时间' v-if='phase=="REGULATION_LEADER"'></el-table-column>
                    <el-table-column prop='projectLeaderAssignTime' label='到达时间' v-if='phase=="PROJECT_LEADER"'></el-table-column>
                    <el-table-column prop='cause' v-if='phase == "PROJECT_CONTACT"' label='不点检原因'></el-table-column>
                    <!-- <el-table-column prop='' label='车型代号'></el-table-column>
                    <el-table-column prop='' label='标准归口人'></el-table-column> -->
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
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import {projectLeaderApproval,regulationChangeTaskList,regulationChangeDoCheck,regulationLeaderApproval,regulationLeaderDisapproval,projectLeaderDisapproval} from '../service/service.js'
    import {mapState} from 'vuex' 
    export default {
        data(){
            return {
                titleList:{"PROJECT_CONTACT":'确定点检清单',"REGULATION_LEADER":'标准专业负责人',"PROJECT_LEADER":"项目专业负责人"},
                multipleSelection:[],
                isShowSearch:true,
                searchContent:{
                    regulationName:'',
                    regulationCode:'',
                    platform:'',
                    processStatus:''
                },
                tableData:[],
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
            }
        },
        computed:{
            ...mapState(['proPlatfForm']),
            contentTop() {
                return this.isShowSearch ? '120px' : '59px';
            },
            phase(){
                return this.$route.params.phase;
            }
        },
        components:{
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        created(){
            _self = this;
            this.listenAction();
        },
        mounted(){
            this.requestData('',false,false);
        },
        methods:{
            approvalCase(type){
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert("当前未选中行,请勾选要操作的行再进行操作。","提示");
                }
                this.$refs.refLoading.open();
                var ids =[];
                this.multipleSelection.forEach(item=>{
                    ids.push(item.id)
                })
                if(this.phase ==='REGULATION_LEADER'){
                    //标准专业负责人
                    if(type){
                        //同意
                        regulationLeaderApproval(ids).then(res=>{
                            this.$message.success('操作成功!');
                            this.restSearContent();
                        }).catch(err=>{
                            this.$refs.refLoading.close();
                        })
                    }else{
                         //不同意
                        regulationLeaderDisapproval(ids).then(res=>{
                            this.$message.success('操作成功!')
                            this.restSearContent();
                        }).catch(err=>{
                            this.$refs.refLoading.close();
                        })
                    }
                }else{
                   //项目专业负责人
                   if(type){
                        //同意
                        projectLeaderApproval(ids).then(res=>{
                            this.$message.success('操作成功!');
                            this.restSearContent();
                        }).catch(err=>{
                            this.$refs.refLoading.close();
                        })
                    }else{
                         //不同意
                         projectLeaderDisapproval(ids).then(res=>{
                            this.$message.success('操作成功!')
                            this.restSearContent();
                        }).catch(err=>{
                            this.$refs.refLoading.close();
                        })
                    }
                }

            },
            listenAction(){
                let callBackDialogFunc = function (obj) {
                    //退回
                    if (obj && (obj.action === 'withdraw')) {
                        _self.$message.success('操作成功!');
                        _self.requestData('search',true,true);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'spotCheckList');
            },
            checkCase(type){
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert("当前未选中行,请勾选要操作的行再进行操作。","提示");
                }
                let bool=true;
                let arr=[];
                this.multipleSelection.forEach(item=>{
                    if(item.type!=='INIT'){
                        bool=false;
                    }
                    arr.push(item.id);  
                })
                if(!bool){
                    this.$message.warning('数据类型为初始才能进行操作');
                    return;
                }
                if(type){
                    //点检
                    this.$refs.refLoading.open();
                    regulationChangeDoCheck(arr).then(res=>{
                        this.$message.success('点检成功!');
                        this.restSearContent();
                    }).catch(err=>{
                        this.$refs.refLoading.close();
                    })
                }else{
                    // if (this.multipleSelection.length > 1) {
                    //     return EcoMessageBox.alert("此操作不能批量处理,请选中一条数据","提示");
                    // }
                    var url = "/taskTriggeredRegulation/index.html#/withdrawPage/"+ JSON.stringify(arr);
                    EcoUtil.getSysvm().openDialog("不点检", url, 700, 200, "15vh");
                }
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false,false);
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true,true)
            },
            restSearContent() {
                this.searchContent = {
                    regulationName:'',
                    regulationCode:'',
                    platform:'',
                    processStatus:''
                };
                this.requestData('',true,true);
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            requestData(type,isFirstPage,isClearSel) {
                this.$refs.refLoading.open();
                let params = {
                    phase:this.phase,
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
                    this.$refs.spotCheckTab.clearSelection(); //清除选项
                }
                params.page = this.baseInfo.page;
                regulationChangeTaskList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                    console.log(res.data);
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        }
    }
</script>
<style scoped>
.spotCheckList {
  color: #0f1419;
  min-width: 1000px;
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: auto;
  color: #0f1419;
}
.spotCheckList .searchRow{
    padding:15px 10px 16px 10px;
    background:#fff;
}

.spotCheckList .searchRow .el-input{
    width:135px;
}
.spotCheckList .plainBtn:first-of-type {
    margin-left: 20px;
}

.spotCheckList .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
}
</style>
