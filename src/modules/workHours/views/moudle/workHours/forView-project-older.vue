<template>
    <eco-content top="0px" bottom="0px" type="tool" class="workHours-view" style="background-color:#f5f5f5">
        <div class="forView-pm">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="24" >
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'项目工时报表'"></eco-tool-title>
                        <el-button plain class="plainBtn toolBtn" ><i class="icon el-icon-document-add"></i>&nbsp;导出</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top="61px">
                <div class="searchBox" style="overflow:hidden;">
                    <div>
                        <span>时间范围：</span>
                        <div class="itemInput">
                            <el-date-picker
                                v-model="dates"
                                type="monthrange"
                                @change="datesChange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                            </el-date-picker>
                        </div>
                        <span>项目：</span>
                        <div class="itemInput">
                            <el-select filterable value-key="id" :filter-method="projectSearch" v-model="modelItem" placeholder="请选择或输入名称、编码查询" style="width:450px;" @blur="copyProjectList = projectList" multiple @change="projectChange">
                                <el-option
                                v-for="item in copyProjectList"
                                :key="item.id"
                                :label="item.name"
                                :value="item"
                                >
                                    <span style="float: left">{{ item.name }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px;margin-left:10px;">{{ item.code }}</span>
                                </el-option>
                            </el-select>
                        </div>

                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchFunc">搜索</el-button>
                    </div>
                </div>
            </eco-content>
            <eco-content bottom="0" top="113px" ref="content" style="padding:10px 15px;">
                <p v-show="isSearch" class="danwei">单位：人月</p>
                <el-table
                :data="tableData"
                border
                :row-class-name="rowClassMethod"
                v-show="isSearch"
                :span-method="arraySpanMethod"
                height="calc(100% - 30px)"
                style="width: 100%">
                <el-table-column  align="center" class-name="table-header" label="项目工时统计报表">
                    <el-table-column
                        prop="pmName"
                        label="项目名称"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="deptName"
                        align="center"
                        label="部门"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="activityName"
                        align="center"
                        label="专业"
                        >
                    </el-table-column>
                    <el-table-column v-for="(item,index) in monthColum"
                        :key="index"
                        :prop="item.key"
                        :label="item.label"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            {{scope.row.dataMap && scope.row.dataMap.hasOwnProperty(item.key)?scope.row.dataMap[item.key]:0}}
                        </template>
                    </el-table-column>
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
import {getChartByPm} from '../../../api/workHours.js'

export default{
    name:'forView-pm',
    data(){
        return {
            params:{
                startDateStr:"",
                endDateStr:"",
                modelId:[]
            },
            dates:[],
            modelItem:[],
            tableData:[],
            monthColum:[],
            isSearch:false,
            copyProjectList:[],
            rowspanMap:{}
        }
    },
    components:{
        ecoContent,
        ecoLoading,
        ecoToolTitle,
        tagSelect
    },
    computed:{
        ...mapGetters([
            'projectList',
        ])
    },
    created(){
        this.setProjectList().then(() => {
            this.copyProjectList = this.projectList;
        });
    },
    methods: {
         ...mapActions([
            'setProjectList',
        ]),
        resetSearch(){
            this.params = {
                startDateStr:"",
                endDateStr:"",
                modelId:[]
            }
            this.dates = [];
        },
        datesChange(values){
            if(values){
                this.params.startDateStr = this.formatDate(values[0]);
                this.params.endDateStr = this.formatDate(values[1]);
            }else{
                this.params.startDateStr = "";
                this.params.endDateStr = "";
            }
        },
        searchFunc(){
            if(!this.dates || this.dates.length == 0){
                return EcoMessageBox.alert('请选择时间范围','提示')
            }
            if(!this.params.modelId || this.params.modelId.length == 0){
                return EcoMessageBox.alert('请选择项目','提示')
            }
            this.$refs.ecoLoadingRef.open();
            this.isSearch = true;
            this.monthColum = this.getSerachMonthList();
            this.rowspanMap = {};
            this.tableData = [];
            getChartByPm(this.params).then(res=>{
                if(res && res.length >0){
                    this.putRowspan(res).then(()=>{
                        this.tableData = res;
                        this.$refs.ecoLoadingRef.close();
                    });
                }else{
                    this.tableData = [];
                }
            })
        },
        putRowspan(array = []){
            return new Promise((resolve, reject) => {
                try{
                    if(array.length == 0) resolve();
                    array.forEach((element,index) => {
                        if(element.pmId){
                            if(!this.rowspanMap.hasOwnProperty(element.pmId)){
                                this.rowspanMap[element.pmId] = {
                                    rowspan:1,
                                    rowIndex:-1
                                };
                                this.rowspanMap[element.pmId][element.deptId] = {
                                    rowIndex:-1
                                };
                                this.rowspanMap[element.pmId][element.deptId].rowspan = 1;
                            }else{
                                this.rowspanMap[element.pmId].rowspan++;
                                if(element.deptId){
                                    if(this.rowspanMap[element.pmId].hasOwnProperty(element.deptId)){
                                        this.rowspanMap[element.pmId][element.deptId].rowspan++;
                                    }else{
                                        this.rowspanMap[element.pmId][element.deptId] = {
                                            rowIndex:-1
                                        };
                                        this.rowspanMap[element.pmId][element.deptId].rowspan = 1;
                                    }
                                }
                            }
                        }
                        if(index == array.length - 1){
                            resolve()
                        } 
                    });
                }catch(e){
                    reject(e)
                }
            })
        },
        formatDate(date){
            let year = date.getFullYear();
            let month = (date.getMonth() + 1) >= 10? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
            return year + "-" + month;
        },
        getSerachMonthList(){
            let startDate = this.dates[0];
            let endDate = this.dates[1];


            let array = [];
            //插入第一个月份
            console.log(startDate.getDate())
            let month = (startDate.getMonth() + 1 < 10? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1);
            //当前月的天数
            let dateNum = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
            let increaseMonth = new Date(startDate.getTime() + dateNum * 24 * 60 * 60 * 1000);
            let item = {
                key:startDate.getFullYear() + "-" + month,
                total:0,
                label:startDate.getFullYear() + "-" + month,
            }
            array.push(item);
            console.log(increaseMonth.getMonth()+ 1)
            while(increaseMonth.getTime() <= endDate.getTime()  ){
                month = (increaseMonth.getMonth() + 1 < 10? "0" + (increaseMonth.getMonth() + 1) : increaseMonth.getMonth() + 1);
                item = {
                    key:increaseMonth.getFullYear() + "-" + month,
                    total:0,
                    label:increaseMonth.getFullYear() + "-" + month,
                }
                 //当前月的天数
                dateNum = new Date(increaseMonth.getFullYear(), increaseMonth.getMonth() + 1, 0).getDate();

                increaseMonth =  new Date(increaseMonth.getTime() + dateNum * 24 * 60 * 60 * 1000);
                array.push(item);
            }
            console.log(array);
            return array;
        },
        projectChange(item){
            if(item && item.length>0){
                this.params.modelId = item.map(item => {
                    return item.id;
                })
            }else{
                this.params.modelId = [];
            }
        },
        projectSearch(value){
            if(value){
                this.copyProjectList = this.projectList.filter(single => {
                    if(single.name.indexOf(value) > -1 || (single.code && single.code.indexOf(value) > -1)){
                        return true;
                    }
                });
            }else{
                this.copyProjectList = this.projectList;
            }
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
           
            if((columnIndex == 0)){
                //合计行
                if(!this.rowspanMap[row.pmId]){
                    return [1,1]
                }
                if(this.rowspanMap[row.pmId].rowIndex == -1 || this.rowspanMap[row.pmId].rowIndex === rowIndex ){
                    this.rowspanMap[row.pmId].rowIndex = rowIndex;
                    return {
                        rowspan: this.rowspanMap[row.pmId].rowspan || 1,
                        colspan: 1
                    };
                }else{
                    return [0,0]
                }
              
               
            }else if(columnIndex == 1){
                 //合计行
                if((!this.rowspanMap[row.pmId] || !this.rowspanMap[row.pmId][row.deptId]) && row.activityName == '合计'){
                    return [1,2]
                }
                if(this.rowspanMap[row.pmId][row.deptId].rowIndex == -1 || this.rowspanMap[row.pmId][row.deptId].rowIndex === rowIndex){
                    let rowspan = this.rowspanMap[row.pmId][row.deptId].rowspan || 1;
                    this.rowspanMap[row.pmId][row.deptId].rowIndex = rowIndex
                    return {
                        rowspan: rowspan,
                        colspan: 1
                    };
                }else{
                    return [0,0]
                }
                
            } else if(columnIndex == 2){
                //合计行
                if((!this.rowspanMap[row.pmId] || !this.rowspanMap[row.pmId][row.deptId]) && row.deptName == '合计'){
                    return [0,0]
                }
            }else{
                return [1, 1];
            }
            
        },
        rowClassMethod({row, rowIndex}){
            if(!row.deptId && row.deptName == '合计'){
                return 'is-summary'
            }
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
</style>
