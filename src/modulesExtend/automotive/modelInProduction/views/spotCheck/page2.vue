<template>
    <eco-content top='0px' bottom='0px' type='tool'>
        <div class='spotCheckChild'>
            <ecoLoading ref='pageLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong></strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='editCase()'>批量办理</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='120px' type='tool'
                style='overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class="searchInputLabel">&emsp;&emsp;状态:</span>
                        <el-select filterable v-model='searchContent.status'  clearable>
                            <el-option v-for='(item,key) in spotInRegulationStatus' :value='key' :label='item' :key='key'></el-option>
                        </el-select>
                        <span class="searchInputLabel">&emsp;项目代号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)"
                            v-model='searchContent.projectCode' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class="searchInputLabel">&emsp;&emsp;&emsp;&emsp;部门:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)"
                            v-model='searchContent.deptName' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col :span='24'>
                        <span class="searchInputLabel">车型型号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)"
                            v-model='searchContent.carModel' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准法规号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)"
                            v-model='searchContent.standardRegulationNo' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准法规名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)"
                            v-model='searchContent.nameStandardsRegulations' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>  
                    </el-col>
                    <el-col>
                        <span class="searchInputLabel">&emsp;&emsp;专业:</span>
                        <el-select filterable v-model='searchContent.major' clearable >
                            <el-option v-for='(item,index) in professionList' :value='item.id' :label='item.text' :key='"professionList"+index'></el-option>
                        </el-select>
                        <span class="searchInputLabel">&emsp;&emsp;符合性:</span>
                        <el-select filterable v-model='searchContent.accordWith'  clearable>
                           <el-option v-for='(item,key) in dfHandlingInterfaceList' :value='key' :label='item' :key='key'></el-option>
                        </el-select> 
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;'>
                <el-table ref='' border @selection-change="handleSelectionChange" stripe :data='tableData'
                    header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label='状态' prop='status'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'spotInRegulationStatus')}}</span>
                        </template> 
                    </el-table-column>
                    <el-table-column label='标准法规号' width='150' prop='standardRegulationNo'></el-table-column>
                    <el-table-column label='标准法规名称' width='150' prop='nameStandardsRegulations'></el-table-column>
                    <el-table-column label='车型型号' prop='carModel'></el-table-column>
                    <el-table-column label='项目代号' prop='projectCode'></el-table-column>
                    <el-table-column label='部门' prop='deptName' width='150'></el-table-column>
                    <el-table-column label='专业' prop='major'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.major,'major')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='设计师' prop='designerName'></el-table-column>
                    <el-table-column label='符合性' prop='accordWith'  fixed='right'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.accordWith,'accordWith')}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label='操作' fixed='right' width='50'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click.stop='editCase(scope.row)'>办理</el-button>
                        </template>    
                    </el-table-column> -->
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
    </eco-content>
</template>
<script>
    import {mapState} from 'vuex'
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import { EcoUtil } from '@/components/util/main.js'
    import {dfHandlingInterfaceList,dfHandlingInterfaceDesignerDetails} from '../../service/service.js'
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    export default {
        name:'spotCheckChild2',
        data(){
            return {
                multipleSelection:[],
                isShowSearch:false,
                tableData:[],
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent:{
                    status:'',
                    carModel:'',
                    projectCode:'',
                    deptName:'',
                    major:'',
                    accordWith:'',
                    standardRegulationNo:'',
                    nameStandardsRegulations:''

                }
            }
        },
        props:{
            standardRegulationNo:{
                type:String,
                default:''
            }
        },
        components:{
            ecoContent,
            ecoLoading
        },
        computed:{
            ...mapState(['dfHandlingInterfaceList','spotInRegulationStatus','professionList']),
            contentTop() {
                return this.isShowSearch ? "180px" : "59px";
            }
        },
        mounted(){
            // this.requestData();
        },
        activated(){
            this.requestData('search',false);
        },
        methods:{
            editCase(row){
                let standardRegulationNos= [];
                let ids = [];
                if(!row){
                    if(this.multipleSelection.length===0){
                        this.$message.warning('请至少选择一条数据进行操作！');
                        return;
                    }
                    this.multipleSelection.forEach(item=>{
                        ids.push(item.id);
                        standardRegulationNos.push(item.standardRegulationNo);
                    })
                }else{
                    ids.push(row.id);
                    standardRegulationNos.push(row.standardRegulationNo);
                }
                dfHandlingInterfaceDesignerDetails(standardRegulationNos).then(response=>{
                    if(response.data){
                        this.$emit('changeDrawerInfo',{
                            goRoute:'editPage2',
                            caseType:'editCase',
                            drawerTitle:!row?"批量办理":'办理',
                            paramsValue:{
                                ids:JSON.stringify(ids),
                                standardRegulationNo: this.standardRegulationNo
                            }
                        })
                    }
                })
            },
            restSearContent() {
                this.searchContent = {
                    status:'',
                    carModel:'',
                    projectCode:'',
                    deptName:'',
                    major:'',
                    accordWith:'',
                    standardRegulationNo:'',
                    nameStandardsRegulations:''
                };
                this.requestData('search',true);
            },
            requestData(type,isFirstPage) {
                this.$refs.pageLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                    standardRegulationNo:this.standardRegulationNo,  //标准法规名称
                    stepStatus:'STEP2'
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
                params.page = this.baseInfo.page;
                dfHandlingInterfaceList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.pageLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.pageLoading.close();
                })
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData("search",true);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',true);
            },
        }
    }
</script>
<style scoped>
</style>