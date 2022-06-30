<template>
    <eco-content top="0px" bottom="0px" type="tool" class="workHours-view" style="background-color:#f5f5f5">
        <div class="forView-pm">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="24" >
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'项目工时报表'"></eco-tool-title>
                        <el-button plain class="plainBtn toolBtn" @click="exportChart"><i class="icon el-icon-document-add"></i>&nbsp;导出</el-button>
                        <el-button type="text" class="backBtn" size="small" @click="goBack">
                            <i class="el-icon-back" style="margin-right:2px"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top="61px">
                <div class="searchBox" style="overflow:hidden;">
                    <div>
                        <span>月份选择：</span>
                        <div class="itemInput">
                            <el-date-picker
                                v-model="params.month"
                                type="month"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="请选择月份"
                                align="right">
                            </el-date-picker>
                        </div>
                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchFunc">搜索</el-button>
                    </div>
                </div>
            </eco-content>
            <eco-content bottom="0" top="113px" ref="content" style="padding:10px 15px;">
                <p v-show="false" class="danwei">单位：人天</p>
                <el-table
                :data="tableData"
                border
                v-show="isSearch && !loading"
                @header-dragend="changeColWidth"
                height="100%"
                header-row-class-name="table-header"
                style="width: 100%">

                    <el-table-column
                        prop="costCode"
                        label="项目费用号"
                        align="center"
                        width="120"
                        min-width="120"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="modelName"
                        label="项目名称"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="modelCode"
                        label="项目编码"
                        align="center"
                        width="120"
                        min-width="120"
                        >
                    </el-table-column>
                     <el-table-column
                        prop="productCode"
                        label="产品编码"
                        align="center"
                        :resizable="false"
                        width="120"
                        >
                    </el-table-column>
                    <el-table-column v-for="(item,index) in deptColum"
                        :key="item.deptId"
                        :prop="item.deptId"
                        :label="item.deptName"
                        align="center"
                        min-width="100"
                    >
                        <template slot-scope="scope">
                            {{scope.row.dataMap && scope.row.dataMap.hasOwnProperty(item.deptId)?scope.row.dataMap[item.deptId].num.toFixed():0}}
                        </template>
                    </el-table-column>
                </el-table>
            </eco-content>
        </div>
    </eco-content>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {getChartByPm,getDeptForPmChart,exportChartByPm} from '../../../api/workHours.js'

export default{
    name:'forView-pm',
    data(){
        return {
            params:{
                month:"",
            },

            tableData:[],
            deptColum:[],
            isSearch:false,
            loading:false
        }
    },
    components:{
        ecoContent,
        ecoLoading,
        ecoToolTitle,
        tagSelect
    },
    computed:{

    },
    created(){

    },
    methods: {

        resetSearch(){
            this.params = {
                month:""
            }
        },
        exportChart(){
            exportChartByPm(this.params).then(res=>{
                var blob = new Blob([res], {type: "application/vnd.ms-excel"})
                var fileName = "项目工时报表.xlsx";
                if(window.navigator.msSaveOrOpenBlob){			// IE浏览器下
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var  link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            })
        },
        searchFunc(){
            if(!this.params.month){
                return EcoMessageBox.alert('请选择月份','提示')
            }
            this.$refs.ecoLoadingRef.open();
            this.isSearch = true;
            this.loading = true;
            //this.monthColum = this.getSerachMonthList();
            this.tableData = [];
            getDeptForPmChart(this.params).then(data=>{
                this.deptColum = data;
            })
            getChartByPm(this.params).then(res=>{
                this.$refs.ecoLoadingRef.close();
                if(res && res.length >0){

                    this.tableData = res;


                }else{
                    this.tableData = [];
                }
                this.loading = false;
            })

        },
        formatDate(date){
            let year = date.getFullYear();
            let month = (date.getMonth() + 1) >= 10? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
            return year + "-" + month;
        },
        changeColWidth(nw,ow,col,evt){
            if(nw < col.minWidth){
                col.width = col.minWidth;
            }
        },
        goBack(){
            this.$router.replace({name:'workHour-forView'});
        },
    },
    watch: {

    }
}

</script>
<style scoped>

.forView-pm{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.forView-pm .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.forView-pm .toolBtn{
    margin:0 10px;
}
.forView-pm .danwei{
    font-size: 14px;
    float: right;
    margin-right: 20px;
    margin-bottom: 10px;
}
.forView-pm .backBtn{
    float: right;
    margin-right: 20px;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    padding: 0;
}
</style>
