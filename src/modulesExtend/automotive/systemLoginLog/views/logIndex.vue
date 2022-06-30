<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='logIndex'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow: hidden;'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <!-- <strong>系统登录日志</strong> -->
                        <eco-tool-title title='系统登录日志'></eco-tool-title>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='60px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row style="padding:15px 10px 16px 10px;background:#fff">
                   <el-col>
                        <span class='searchInputLabel'>员工编号:</span>
                        <el-input clearable style='width:170px' @keyup.enter.native="requestData('search',true)" v-model='searchContent.emId' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>登录时间</span>
                        <el-date-picker  range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" v-model="searchContent.dataRange"
                            value-format='yyyy-MM-dd HH:mm:ss' type="datetimerange" placeholder="选择日期">
                        </el-date-picker>
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                   </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table stripe :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type='index' label='序号' width='50' min-width='60px' max-width='90px'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label='员工编号' prop='emId' align='center'></el-table-column>
                    <el-table-column label='姓名' prop='name' align='center'></el-table-column>
                    <el-table-column label='IP地址' prop='ip' align='center'></el-table-column>
                    <el-table-column label='登录时间' prop='datetime' align='center'></el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
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
    import {loginLogList} from '../service/service.js'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    export default {
        data(){
            return {
                tableData:[],
                isShowSearch:false,
                searchContent:{
                    emId:'',
                    dataRange:[]
                },
                baseInfo:{
                    page:1,
                    rows:30,
                    total:0
                }
            }
        },
        computed:{
            contentTop() {
                return this.isShowSearch ? '120px' : '59px';
            },
        },
        components:{
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        mounted(){
            this.requestData('',false);
        },
        methods:{
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false);
            },
            restSearContent(){
                this.searchContent = {
                    emId:'',
                    dataRange:[]
                };
                this.requestData('',true);
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            requestData(type,isFirstPage){
                this.$refs.refLoading.open();
                let params = {
                    sort: ['datetime'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                }
                if(type==='search'){
                     for(var key in this.searchContent){
                         if(this.searchContent[key]){
                             if(key === 'dataRange'){
                                 params['startTime'] = this.searchContent[key][0];
                                 params['endTime'] = this.searchContent[key][1];
                             }else{
                                 params[key] = this.searchContent[key];
                             }
                         }
                     }
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                loginLogList(params).then(res=>{
                    this.tableData = res.data.rows;
                    this.baseInfo.total = res.data.total;
                    this.$refs.refLoading.close();
                }).catch(err=>{
                    this.tableData = [];
                    this.baseInfo.total = 0;
                    this.$refs.refLoading.close();
                })
            }
        }
    }
</script>
<style scoped>
    .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

    .standardizationTable /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
        height:60px;
    }
    .logIndex .searchInputLabel {
        font-size: 14px;
        margin-left: 8px;
    }
</style>