<template>
    <eco-content top="0px" bottom="0px" type="tool" class="workHours-view" style="background-color:#f5f5f5">
        <div class="forView-user">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="24" >
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'项目成员工时报表'"></eco-tool-title>
                        <el-button plain class="plainBtn toolBtn" ><i class="icon el-icon-document-add"></i>&nbsp;导出</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top="61px">
                <div class="searchBox">
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
                        <span>人员：</span>
                        <div class="itemInput" style="width:300px;">
                            <tag-select
                                style="width: 100%;vertical-align: top;"
                                :initDataStr="''"
                                ref="tagSelect"
                                :initOptions="{selectNum:0,selectType:'User'}"
                                @callBack="selectUser" >
                            </tag-select>
                        </div>

                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchFunc">搜索</el-button>
                    </div>
                </div>
            </eco-content>
            <eco-content bottom="0" top="113px" ref="content" style="padding:10px 15px;">
                <p v-show="isSearch" class="danwei">单位：小时</p>
                <el-table
                :data="tableData"
                border
                :row-class-name="rowClassMethod"
                :span-method="arraySpanMethod"
                v-show="isSearch"
                height="calc(100% - 30px)"
                style="width: 100%;">
                <el-table-column  align="center" class-name="table-header" label="项目成员工时统计报表">
                    <el-table-column
                        prop="userName"
                        label="姓名"
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
                    <el-table-column
                        prop="pmName"
                        align="center"
                        label="项目"
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
import {getChartByUser} from '../../../api/workHours.js'
export default{
    name:'forView-user',
    data(){
        return {
            params:{
                startDateStr:"",
                endDateStr:"",
                userId:[]
            },
            dates:[],
            tableData:[],
            monthColum:[],
            isSearch:false,
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

    },
    created(){

    },
    methods: {
        selectUser(data){
            this.params.userId = [];
            if(data.itemArray.length > 0){
                data.itemArray.forEach(element => {
                    this.params.userId.push(element.linkId);
                });
            }
        },
        resetSearch(){
            this.params = {
                startDateStr:"",
                endDateStr:"",
                userId:[]
            }
            this.dates = [];
            this.$refs['tagSelect'].clearTag();
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
            if(!this.params.userId || this.params.userId.length == 0){
                return EcoMessageBox.alert('请选择人员','提示')
            }
            this.$refs.ecoLoadingRef.open();
            this.isSearch = true;
            this.monthColum = this.getSerachMonthList();
            this.rowspanMap = {};
            this.tableData = [];
            getChartByUser(this.params).then(res=>{
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
                        if(!element.userId){

                        }else{
                            if(!this.rowspanMap.hasOwnProperty(element.userId)){
                                this.rowspanMap[element.userId] = {
                                    rowspan:1,
                                    rowIndex:-1
                                };
                                this.rowspanMap[element.userId][element.activityId] = {
                                    rowIndex:-1
                                };
                                this.rowspanMap[element.userId][element.activityId].rowspan = 1;
                            }else{
                                this.rowspanMap[element.userId].rowspan++;
                                if(!element.activityId){

                                }else{
                                    if(this.rowspanMap[element.userId].hasOwnProperty(element.activityId)){
                                        this.rowspanMap[element.userId][element.activityId].rowspan++;
                                    }else{
                                        this.rowspanMap[element.userId][element.activityId] = {
                                            rowIndex:-1
                                        };
                                        this.rowspanMap[element.userId][element.activityId].rowspan = 1;
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
            return array;
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }){

            if((columnIndex == 0 || columnIndex == 1)){
                //合计行
                if(!this.rowspanMap[row.userId]){
                    return [1,1]
                }
                if(this.rowspanMap[row.userId].rowIndex == -1 || this.rowspanMap[row.userId].rowIndex === rowIndex ){
                    if(columnIndex == 1) this.rowspanMap[row.userId].rowIndex = rowIndex;
                    return {
                        rowspan: this.rowspanMap[row.userId].rowspan || 1,
                        colspan: 1
                    };
                }else{
                    return [0,0]
                }


            }else if(columnIndex == 2){
                 //合计行
                if((!this.rowspanMap[row.userId] || !this.rowspanMap[row.userId][row.activityId]) && row.activityName == '合计'){
                    return [1,2]
                }
                if(this.rowspanMap[row.userId][row.activityId].rowIndex == -1 || this.rowspanMap[row.userId][row.activityId].rowIndex === rowIndex){
                    let rowspan = this.rowspanMap[row.userId][row.activityId].rowspan || 1;
                    this.rowspanMap[row.userId][row.activityId].rowIndex = rowIndex
                    return {
                        rowspan: rowspan,
                        colspan: 1
                    };
                }else{
                    return [0,0]
                }

            }else if(columnIndex == 3){
                //合计行
                if((!this.rowspanMap[row.userId] || !this.rowspanMap[row.userId][row.activityId]) && row.activityName == '合计'){
                    return [0,0]
                }
            } else{
                return [1, 1];
            }

        },
        rowClassMethod({row, rowIndex}){
            if(!row.activityId && row.activityName == '合计'){
                return 'is-summary'
            }
        },
        getSummaries({ columns, data }) {
            const sums = [];
            columns.forEach((column, index) => {
                if(index < 2){
                    sums[index] = '';
                    return;
                }else if (index === 2) {
                    sums[index] = '总计';
                    return;
                }else if (index === 3) {
                    sums[index] = 'N/A';
                    return;
                }else{
                    const values = data.map(item => Number(item.dataMap && item.dataMap.hasOwnProperty(column.property)?item.dataMap[column.property]:0));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = 'N/A';
                    }
                }

            });
            return sums;
        }

    },
    watch: {

    }
}

</script>
<style scoped>

.forView-user{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.forView-user .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.forView-user .toolBtn{
    margin:0 10px;
}
.forView-user .danwei{
    font-size: 14px;
    float: right;
    margin-right: 20px;
    margin-bottom: 10px;
}
</style>
