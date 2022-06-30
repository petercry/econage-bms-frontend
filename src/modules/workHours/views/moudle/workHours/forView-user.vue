<template>
    <eco-content top="0px" bottom="0px" type="tool" class="workHours-view" style="background-color:#f5f5f5">
        <div class="forView-user">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="24" >
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="fixedEnable?'项目成员工时报表(换算后)':'项目成员工时报表'"></eco-tool-title>
                        <el-button plain class="plainBtn toolBtn" @click="exportChart"><i class="icon el-icon-download"></i>&nbsp;导出</el-button>
                        <!-- <el-button class="plainBtn toolBtn" type="primary" style="color:#fff " @click="clearFilter"><i class="icon el-icon-refresh"></i>&nbsp;重置</el-button> -->
                        <el-button type="text" class="backBtn" size="small" @click="goBack">
                            <i class="el-icon-back" style="margin-right:2px"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top="61px" v-bind:style="{height:flag === 'user'?'52px':'101px'}">
                <div class="searchBox">
                    <div>
                        <span>时间：</span>
                        <div class="itemInput">
                            <el-date-picker
                                v-model="dates"
                                type="daterange"
                                @change="datesChange"
                                range-separator="至"
                                unlink-panels
                                style="width:250px;"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                align="right">
                            </el-date-picker>
                        </div>
                        <span v-if="flag === 'user'" >
                            <span>项目：</span>
                            <div class="itemInput" style="width:250px;">
                                <el-select filterable value-key="id"  collapse-tags :filter-method="projectSearch" v-model="modelItem" placeholder="请选择或输入名称、编码查询" style="width:250px;" @visible-change="copyProjectList = projectList"  multiple @change="projectChange">
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
                        </span>
                        <span v-if="flag === 'linyu'" >
                            <span>人员：</span>
                            <div class="itemInput" style="width:250px;">
                                <el-select v-model="params.userArr" multiple  collapse-tags placeholder="请选择或输入名称查询" filterable style="width:250px;">
                                    <el-option
                                        v-for="(item,index) in roleGroup"
                                        :key="index"
                                        :label="item.userName"
                                        :value="item.userId"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </span>
                        <span v-if="hideParamsItems.indexOf('user') == -1" >
                            <span>人员：</span>
                            <div class="itemInput" style="width:250px;">
                                <tag-select
                                    style="width: 100%;vertical-align: top;"
                                    :initDataStr="''"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:0,selectType:'User'}"
                                    @callBack="selectUser" >
                                </tag-select>
                            </div>
                        </span>

                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchFunc">搜索</el-button>
                    </div>
                    <div>
                        <span v-show="hideParamsItems.indexOf('dept') == -1" >
                            <span>部门：</span>
                            <div class="itemInput" style="width:250px;">
                                <tag-select
                                    style="width: 100%;vertical-align: top;"
                                    :initDataStr="''"
                                    ref="tagSelectForDept"
                                    :initOptions="{selectNum:0,selectType:'DEPT',treeUserHidden:true}"
                                    @callBack="selectDept" >
                                </tag-select>
                            </div>
                        </span>
                        <span v-show="hideParamsItems.indexOf('activity') == -1" >
                            <span>专业：</span>
                            <div class="itemInput" style="width:250px;">
                                <el-select v-model="params.activityIdArr" multiple  collapse-tags  placeholder="请选择或输入名称查询" filterable style="width:250px;">
                                    <el-option
                                    v-for="(item,index) in activityList"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </span>
                        <span v-if="hideParamsItems.indexOf('project') == -1" >
                            <span>项目：</span>
                            <div class="itemInput" style="width:250px;">
                                <el-select filterable  collapse-tags value-key="id" :filter-method="projectSearch" v-model="modelItem" placeholder="请选择或输入名称、编码查询" style="width:250px;" @visible-change="copyProjectList = projectList"  multiple @change="projectChange">
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
                        </span>
                    </div>
                </div>
            </eco-content>
            <eco-content bottom="0" :top="getContentTop" ref="content" style="padding:10px 15px;">
                <p v-show="isSearch" class="danwei">单位：小时</p>

                    <el-table
                    :data="tableData"
                    border
                    v-show="isSearch && !loading"
                    ref="filterTable"
                    @header-dragend="changeColWidth"
                    height="calc(100% - 30px)"
                    header-row-class-name="table-header"
                    style="width: 100%;">
                        <el-table-column
                            prop="hrLink"
                            label="工号"
                            fixed
                            min-width="100"
                            align="center"
                            :filters="filtersMap['hrLink']"
                            :filter-method="filterHandler"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="userName"
                            label="姓名"
                            fixed
                            min-width="100"
                            align="center"
                            :filters="filtersMap['userName']"
                            :filter-method="filterHandler"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="deptName"
                            align="center"
                            fixed
                            min-width="100"
                            label="业务部门"
                            :filters="filtersMap['deptName']"
                            :filter-method="filterHandler"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="activityName"
                            align="center"
                            fixed
                            min-width="100"
                            label="专业"
                            :filters="filtersMap['activityName']"
                            :filter-method="filterHandler"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="modelName"
                            align="center"
                            fixed
                            min-width="100px"
                            label="投入项目"
                            :filters="filtersMap['modelName']"
                            :filter-method="filterHandler"
                            >
                        </el-table-column>
                        <el-table-column v-for="item in dayColum"
                            v-if="!fixedEnable || scheduleMap[item.key]"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :resizable="false"
                            align="center"
                            width="100"
                        >
                            <template slot-scope="scope">
                                {{scope.row.dataMap && scope.row.dataMap.hasOwnProperty(item.key)?fixedEnable?scope.row.dataMap[item.key].num.toFixed():scope.row.dataMap[item.key].num:0}}
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
import {getChartByUser,getFixedChartByUser,exportChartByUser,exportChartByUserFixed,getRoleGroupByLinyu} from '../../../api/workHours.js'
import {getScheduleMap,getActivityListByDept} from '../../../api/common.js'
import { mapActions,mapGetters,mapState } from 'vuex'
export default{
    name:'forView-user',
    data(){
        return {
            params:{
                startDateStr:"",
                endDateStr:"",
                userArr:[],
                deptArr:[],
                activityIdArr:[],
                modelId:[],
            },
             pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        let end = new Date();
                        end = new Date(end.getFullYear(),end.getMonth(),end.getDate());
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近半个月',
                    onClick(picker) {
                        let end = new Date();
                        end = new Date(end.getFullYear(),end.getMonth(),end.getDate());
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        let end = new Date();
                        end = new Date(end.getFullYear(),end.getMonth(),end.getDate());
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            dates:[],
            tableData:[],
            dayColum:[],
            isSearch:false,
            rowspanMap:{},
            modelItem:[],
            fixedEnable:false,
            scheduleMap:{},
            filtersMap:{
                hrLink:[],
                userName:[],
                deptName:[],
                activityName:[],
                modelName:[]
            },
            copyProjectList:[],
            activityList:[],
            flag:"user",
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
         ...mapGetters([
            'projectList','userInfo',
        ]),
        hideParamsItems(){
            if(this.flag === 'user'){
                return ['user','dept','activity','project'];
            }else if(this.flag === 'linyu'){
                return ['user'];
            }else if(this.flag === 'minister'){
                return ['dept'];
            }else{
                return [];
            }
        },
        getContentTop(){
            if(this.flag === 'user'){
                return '113px';
            }else{
                return '162px';
            }
        }

    },
    created(){

        this.setProjectList().then(() => {
            this.copyProjectList = this.projectList;
        });
        if(this.$route.name === 'workHour-forView-user-fixed'){
            this.fixedEnable = true;
        }
        if(this.$route.params.flag){
            this.flag = this.$route.params.flag;
        }
    },
    mounted(){
        if(this.flag === 'user'){
            this.params.roleGroup = "role_user";
            this.params.userArr.push(this.userInfo.id);
        }else if(this.flag === 'linyu'){
            this.getRoleGroupByLinyu();
            this.params.roleGroup = "role_field";
        }else if(this.flag === 'roles'){
            this.params.roleGroup = "role_pdt";

        }else if(this.flag === 'minister'){
            this.params.deptArr = this.userInfo.departments[0].id;
            this.params.roleGroup = "role_minister";
            this.getActivityListByDeptFunc();
        }

    },
    methods: {
        ...mapActions([
            'setProjectList',
        ]),
        getRoleGroupByLinyu(){
            getRoleGroupByLinyu().then(res=>{
                this.roleGroup = res;
            })
        },
        getScheduleMap(){
            let startDate = this.formatDate(this.dates[0]);
            let endDate = this.formatDate(this.dates[1]);
            getScheduleMap(startDate,endDate).then(res => {
                this.scheduleMap = res;
                getFixedChartByUser(this.params).then(res=>{
                    if(res && res.length >0){
                        this.getFilterColData(res).then(()=>{
                            this.tableData = res;
                        });
                    }else{
                        this.tableData = [];
                    }
                    this.$nextTick(() => {
                        this.loading = false;
                        this.$refs.filterTable.doLayout()
                    })
                    this.$refs.ecoLoadingRef.close();
                })
            })
        },

        selectUser(data){
            this.params.userArr = [];
            if(data.itemArray.length > 0){
                data.itemArray.forEach(element => {
                    this.params.userArr.push(element.linkId);
                });
            }
        },
        selectDept(data){
            this.params.deptArr = [];
            this.activityList = [];
            if(data.itemArray.length > 0){
                data.itemArray.forEach(element => {
                    this.params.deptArr.push(element.linkId);
                });
                this.getActivityListByDeptFunc();
            }

        },
        getActivityListByDeptFunc(){
            getActivityListByDept(this.params.deptArr).then(res => {
                this.activityList = res.rows;
            })
        },
        resetSearch(){
            this.params = {
                startDateStr:"",
                endDateStr:"",
                userArr:[],
                deptArr:[],
                activityIdArr:[],
                modelId:[]
            }
            this.modelItem = [];
            this.dates = [];
            this.$refs['tagSelect'].clearTag();
            this.$refs['tagSelectForDept'].clearTag();
        },
        exportChart(){
            if(this.fixedEnable){
                exportChartByUserFixed(this.params).then(res=>{
                    var blob = new Blob([res], {type: "application/vnd.ms-excel"})
                    var fileName = "项目成员工时报表.xlsx";
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
            }else{
                exportChartByUser(this.params).then(res=>{
                    var blob = new Blob([res], {type: "application/vnd.ms-excel"})
                    var fileName = "项目成员工时报表.xlsx";
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
            }
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
            // if(!this.params.userArr || this.params.userArr.length == 0){
            //     return EcoMessageBox.alert('请选择人员','提示')
            // }
            this.$refs.ecoLoadingRef.open();
            this.isSearch = true;
            this.loading = true;
            this.dayColum = this.getSearchDayList();
            this.rowspanMap = {};
            this.tableData = [];
            if(this.fixedEnable){
                 this.getScheduleMap();

            }else{
                 getChartByUser(this.params).then(res=>{

                    if(res && res.length >0){
                        this.getFilterColData(res).then(()=>{
                            this.tableData = res;
                        });
                    }else{
                        this.tableData = [];
                    }
                    this.$nextTick(() => {
                        this.loading = false;
                        this.$refs.filterTable.doLayout()
                    })
                    this.$refs.ecoLoadingRef.close();
                })
            }

        },
        getFilterColData(array = []){
            this.filtersMap = {
                hrLink:[],
                userName:[],
                deptName:[],
                activityName:[],
                modelName:[]
            }
            return new Promise((resolve, reject) => {
                try{
                    if(array.length == 0) resolve();
                    array.forEach((element,index) => {
                        for(let key in this.filtersMap){
                            if(!element[key]) continue;
                            let item = {
                                text:element[key],
                                value:element[key]
                            }
                            if(this.filtersMap[key].find(item=>item.value == element[key])){
                                continue;
                            }else{
                                this.filtersMap[key].push(item);
                            }
                        }
                        if(index == array.length - 1){
                            resolve()
                        }
                    })
                }catch(e){
                    reject(e)
                }
            });
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
            let day = date.getDate() >= 10? date.getDate() : "0" + date.getDate();
            return year + "-" + month + "-" + day;
        },
        getSearchDayList(){
            let startDate = this.dates[0];
            let endDate = this.dates[1];
            let array = [];
            let month = (startDate.getMonth() + 1 < 10? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1);
            let day = startDate.getDate() >= 10? startDate.getDate(): "0" + startDate.getDate();
            let increaseDay = startDate;
            let item = {
                key:this.formatDate(startDate),
                total:0,
                label:month + "月" + day + "日",
            }
            array.push(item);
            while(increaseDay.getTime() < endDate.getTime()  ){

                increaseDay =  new Date(increaseDay.getTime() + 1 * 24 * 60 * 60 * 1000);
                month = (increaseDay.getMonth() + 1 < 10? "0" + (increaseDay.getMonth() + 1) : increaseDay.getMonth() + 1);
                day = increaseDay.getDate() >= 10? increaseDay.getDate() : "0" + increaseDay.getDate();
                item = {
                    key:this.formatDate(increaseDay),
                    total:0,
                    label:month + "月" + day + "日",
                }
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
        },
        changeColWidth(nw,ow,col,evt){
            if(nw < 100){
                col.width = 100;
            }
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        clearFilter(){
            this.$refs.filterTable.clearFilter();
        },
        goBack(){
            this.$router.replace({name:'workHour-forView'});
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
        projectChange(item){
            if(item && item.length>0){
                this.params.modelId = item.map(item => {
                    return item.id;
                })
            }else{
                this.params.modelId = [];
            }
        },

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
.forView-user .backBtn{
    float: right;
    margin-right: 20px;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    padding: 0;
}
</style>
