<template>
    <eco-content top='0px' bottom='0px' style='background-color:#F5F5F5;'>
        <div class='personAudit'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;border-top-width:0px;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong>法规专业负责人审核</strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='driveCase(true)' v-show='initRole.PAGE_CC_REGULATION_PROFESSION_LEADER.permission.AGREE'>同意</el-button>
                        <el-button type='danger' size='small' @click='driveCase(false)' v-show='initRole.PAGE_CC_REGULATION_PROFESSION_LEADER.permission.REJECT'>驳回</el-button>
                        <el-button type='primary' size='small'  v-show='initRole.PAGE_CC_REGULATION_PROFESSION_LEADER.permission.EXPORT' @click='exportCase'>导出</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>状态:</span>
                        <el-select filterable v-model='searchContent.status'  clearable>
                            <el-option v-for='(item,key) in statusList' :value='key' :label='item' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>标准法规号:</span>
                        <el-input clearable  @keyup.enter.native="requestData('search',true,true)"
                            v-model='searchContent.regulationCode' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <!-- <span class='searchInputLabel'>重要类型:</span>
                        <el-select v-model="searchContent.importantType" placeholder="请选择">
                            <el-option v-for="item in importantTypeList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select> -->
                        <span class='searchInputLabel'>标准法规名称:</span>
                        <el-input clearable  @keyup.enter.native="requestData('search',true,true)"
                          v-model='searchContent.regulationName' placeholder='请输入'>
                          <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <!-- <span class='searchInputLabel'>部门:</span>
                        <tag-select style="width: 100%;vertical-align: top;" ref="tagSelect" :initOptions="{selectNum:1,selectType:'dept'}" @callBack="selectDept">
                        </tag-select> -->
                    </el-col>
                    <el-col>
                            <span class='searchInputLabel'>计划开始日期:</span>
                            <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                v-model="searchContent.dateRange1" value-format='yyyy-MM-dd'
                                type="daterange" placeholder="选择日期">
                            </el-date-picker>
                            <span class='searchInputLabel'>计划完成日期:</span>
                            <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                 v-model="searchContent.dateRange2" value-format='yyyy-MM-dd'
                                type="daterange" placeholder="选择日期">
                            </el-date-picker>
                            <span class='searchInputLabel'>实际完成日期:</span>
                            <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                 v-model="searchContent.dateRange3" value-format='yyyy-MM-dd'
                                type="daterange" placeholder="选择日期">
                            </el-date-picker>  
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='personAuditTable' @selection-change="handleSelectionChange" highlight-current-row stripe
                    :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%'
                    class='standardizationTable' row-key='id'>
                    <el-table-column type="selection" width="55" reserve-selection>
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='status' label='状态'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'status')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='regulatoryCompliance' label='符合性'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.regulatoryCompliance,'regulatoryCompliance')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='planStartDate' label='计划开始日期'></el-table-column>
                    <el-table-column prop='planCompleteDate' label='计划完成日期'></el-table-column>
                    <el-table-column prop='actualCompleteDate' label='实际完成日期'></el-table-column>
                    <el-table-column prop='regulationCode' label='标准法规号'>
                        <template slot-scope='scope'>
                            <span class="cursorP" @click.stop='editCase(scope.row,"viewCase")'>{{scope.row.regulationCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='regulationName' label='标准法规名称'></el-table-column>
                    <el-table-column prop='articleCode' label='条文号'></el-table-column>
                    <el-table-column prop='updateUserName' label='更新人员'></el-table-column>
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
  import { EcoMessageBox } from "@/components/messageBox/main.js";
  import {mapState} from 'vuex'
  import tagSelect from "@/components/orgPick/tagSelect.vue";
  import {carcheckApprovalList,carcheckDriveApproval,carcheckDriveDisapproval,approvalListExportCase} from '../../service/service.js'
  export default {
      name:'personAudit',
      data(){
          return {
            baseInfo: {
                page: 1,
                rows: 30,
                total: 0
            },
            tableData: [],
            multipleSelection: [],
            isShowSearch:false,
            searchContent:{
                status:'',
                regulationName:'',
                regulationCode:'',
                dateRange1:[],
                dateRange2:[],
                dateRange3:[]
            }
          }
      },
      components:{
        ecoContent,
        ecoLoading,
        ecoToolTitle,
        tagSelect
      },
      computed:{
          ...mapState(['statusList','importantTypeList','initRole']),
          contentTop() {
                return this.isShowSearch ? '150px' : '59px';
          },
      },
      created(){
        _self=this;
      },
      mounted(){
        this.requestData('',false,false);
      },
      methods:{
        driveCase(type){
            if(this.multipleSelection.length===0){
                this.$message.warning('请至少选择一条数据!');
                return;
            }
            this.$refs.refLoading.open();
            let ids = this.multipleSelection.map(item=>{
                return item.id;
            })
            if(type){
                //同意
                carcheckDriveApproval(ids).then(res=>{
                    this.$message.success('同意成功');
                    this.$refs.refLoading.close();
                    this.restSearContent();
                }).catch(err=>{
                    this.$refs.refLoading.close();
                })
            }else{
                carcheckDriveDisapproval(ids).then(res=>{
                    this.$message.success('驳回成功');
                    this.$refs.refLoading.close();
                    this.restSearContent();
                }).catch(err=>{
                    this.$refs.refLoading.close();
                })
            }
            
        },
        editCase(row,type) {
                let _width = '1000';
                let _height = '450';
                let url;
                let dialogTitle = '查看';
                if(sysEnv==0){
                    this.$router.push({name:'editCheck',params:{id:row.id,caseType:type}});
                }else{
                    url = '/project/index.html#/editCheck/' + row.id + '/viewCase';
                    EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');      
                }   
            },
        restSearContent() {
            this.searchContent = {
                status:'',
                regulationName:'',
                regulationCode:'',
                dateRange1:[],
                dateRange2:[],
                dateRange3:[]
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
        requestData(type,isFirstPage,isClearSel) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                    projectId: this.$route.params.proId
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                                params.planStartDateFrom = this.searchContent[key][0];
                                params.planStartDateTo = this.searchContent[key][1]; 
                            } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                                params.planCompleteDateFrom = this.searchContent[key][0]; 
                                params.planCompleteDateTo = this.searchContent[key][1]; 
                            } else if (key == 'dateRange3' && this.searchContent[key].length == 2){
                                params.actualCompleteDateFrom = this.searchContent[key][0]; 
                                params.actualCompleteDateTo = this.searchContent[key][1]; 
                            }else {
                                params[key] = this.searchContent[key];
                            }
                        }
                    }
                  
                }
                if(isClearSel){
                    this.$refs.personAuditTable.clearSelection(); //清除选项
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                carcheckApprovalList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
        },
        // selectDept(data) {
        //     if (data.itemArray.length > 0) {
        //         this.searchContent.deptId = data.itemArray[0].linkId;
        //     } else {
        //         this.searchContent.deptId = null;
        //     }
        // },
        changeSearchShow() {
            this.isShowSearch = !this.isShowSearch;
        },
        exportCase() {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    projectId: this.$route.params.proId
                };
                for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                                params.planStartDateFrom = this.searchContent[key][0];
                                params.planStartDateTo = this.searchContent[key][1]; 
                            } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                                params.planCompleteDateFrom = this.searchContent[key][0]; 
                                params.planCompleteDateTo = this.searchContent[key][1]; 
                            } else if (key == 'dateRange3' && this.searchContent[key].length == 2){
                                params.actualCompleteDateFrom = this.searchContent[key][0]; 
                                params.actualCompleteDateTo = this.searchContent[key][1]; 
                            }else {
                                params[key] = this.searchContent[key];
                            }
                        }
                }
                approvalListExportCase(params).then(res => {
                    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                        navigator.msSaveBlob(new Blob([res.data],'法规专业负责人审核.xlsx'));
                        this.$refs.refLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
                        let url = window.URL.createObjectURL(blob);  
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '法规专业负责人审核.xlsx';
                        this.$refs.refLoading.close();
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err => {
                    this.$refs.refLoading.close();
                })
            },
      }
  }

</script>
<style scoped>
    .personAudit .searchInputLabel {
        font-size: 14px;
        margin: 0 5px 0px 5px;
    }

    .personAudit .searchRow {
        padding: 15px 10px 16px 10px;
        background: #fff
    }

    .personAudit .searchRow .el-col {
        display: flex;
        align-items: center;
    }
    .personAudit .searchRow .el-col+.el-col{
        margin-top:7px;
    }
    .personAudit .searchRow .el-input,
    .personAudit .searchRow .el-select{
        width: 150px;
    }
    .personAudit .searchRow .el-date-editor{
        width: 230px;
    }
</style>