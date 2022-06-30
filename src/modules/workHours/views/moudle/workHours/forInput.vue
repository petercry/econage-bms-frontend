<template>
    <eco-content top="0px" bottom="0px" type="tool" v-loading="loading" style="background-color:#f5f5f5">
        <div class="forInput">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                    <el-row style="padding:12px 10px;background-color:#fff;">
                        <el-col :span="24" >
                            <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'工时填报（'+total+'）'"></eco-tool-title>
                            <el-button plain class="plainBtn toolBtn" @click.native="dialogVisible = true;"><i class="icon el-icon-document-add"></i>&nbsp;添加</el-button>
                            <el-button plain class="plainBtn toolBtn" @click.native="copyWeek"><i class="icon el-icon-document-copy"></i>&nbsp;复制上周</el-button>
                            <!-- <el-button plain class="plainBtn toolBtn" ><i class="icon el-icon-delete"></i>&nbsp;批量删除</el-button> -->
                            <el-button type="primary" class="toolBtn" @click.native="save"><i class="icon el-icon-s-claim"></i>&nbsp;保存</el-button>
                        </el-col>
                    </el-row>
            </eco-content>
            <eco-content bottom="0" top="61px" ref="content" style="padding:10px 15px;">
                <el-table
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    class="ecoList"
                    height="100%"
                    stripe
                    v-if="!loading"
                    border
                    ref="wkTable"
                     @header-dragend="changeColWidth"
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                    @current-change="handleCurrentChange"
                >
                     <el-table-column
                        type="selection"
                        key="10"
                        fixed
                        min-width="45"
                        width="35">

                    </el-table-column>
                    <el-table-column
                        prop="index"
                        label="序号"
                        fixed
                        min-width="50"
                        width='50'
                        >
                        <template slot-scope="scope">

                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="60"
                        min-width="50"
                        fixed
                        >
                        <template slot-scope="scope" >
                            <div class="dealCol">
                                <span class="pointerClass redColor"  @click="hideItem(scope.row,scope.$index)">隐藏</span>
                                <!-- <span class="pointerClass redColor" v-show="false" @click="clearItem(scope.row,scope.$index)">清空</span> -->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="modelId"
                        label="项目名称"
                        width="200"
                        min-width="150"
                        fixed
                        >
                        <template slot-scope="scope">
                            {{getProjectName(scope.row.modelId)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="modelCode"
                        label="编码"
                        width='120'
                        min-width="100"
                        fixed
                        >
                    </el-table-column>
                    <el-table-column
                        prop="activityId"
                        label="专业"
                        width='120'
                        min-width="100"
                        fixed
                        >
                        <template slot-scope="scope">
                            {{getActivityName(scope.row.activityId)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-for="(item,index) in currentTimeList"
                        :key="item.date"
                        :resizable="false"
                        min-width='110'
                        >
                         <template slot="header">
                            <span>{{item.weekDesc}}</span>
                            <br>
                            <span>{{item.date.substring(5,10)}}</span>
                         </template>
                        <template slot-scope="scope">
                             <el-input-number :disabled="!item.editable" v-model="scope.row.dataMap[item.date].num" style="width:100%;" type="number"  size="mini" @blur="inputBlur(item,scope.row.dataMap[item.date],$event)" @change="(currentValue, oldValue)=>numChange(currentValue,oldValue,item,scope.row.dataMap[item.date])" :controls="false" :step="0.5" step-strictly :min="0">

                             </el-input-number>
                        </template>
                    </el-table-column>

                </el-table>

            </eco-content>
        </div>
        <el-dialog title="添加" :visible.sync="dialogVisible" :modal="false" width="600px" custom-class="workHoursDialog">
            <el-form ref="addForm" :model="form" label-width="80px" class="addForm" :rules="rules">
                <el-form-item label="项目" prop="modelId">
                    <el-select filterable value-key="id" :filter-method="projectSearch" v-model="modelItem" placeholder="请选择或输入名称、编码查询" style="width:450px;" @visible-change="copyProjectList = projectList" @change="projectChange">
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
                </el-form-item>
                <el-form-item label="专业" prop="activityId">
                  <el-select v-model="form.activityId" placeholder="请选择或输入名称查询" filterable style="width:450px;">
                    <el-option
                        v-for="(item,index) in activityList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="btn">
                <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
                <el-button type="primary" size="medium"  @click="onSubmit">确定</el-button>
            </div>
        </el-dialog>
    </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {saveWorkHours,getWorkHoursInfo,hideWorkHours,copyLastWeek,getHideItemInfo,getHideTotalByDate,getHideTotalMap} from '../../../api/workHours.js'
import {getWorkHoursSetting,getScheduleMap} from '../../../api/common.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import { Loading } from 'element-ui';
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
       baseDataList:[],//保存之前的原始数据
       multipleSelection:[],
       dialogVisible:false,
       form:{
           modelId:"",
           activityId:"",
           modelCode:"",
           model:"FAW_PPM"
       },
       modelItem:{},
       rules:{
           modelId: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
          activityId: [
            { required: true, message: '请选择专业', trigger: 'change' }
          ],
       },
       copyProjectList:[],
       setting:{},
       scheduleMap:{},
       currentTimeList:[],
       hideItems:[],
       currentRow:null,
       loading:true,
       hideTotalMap:{}
    }
  },
  created() {
      this.setActivityList()
      this.getWorkHoursSetting();
        this.setProjectList().then(() => {
            this.copyProjectList = this.projectList;
        });

  },
  activated(){

  },

  mounted(){
        this.getListDataFunc();

  },

  computed: {
      ...mapGetters([
        'projectList',
        'activityList',
        "getProjectName",
        "getActivityName"
      ]),

      currentDateList(){
          let that = this;
          let now = new Date();
          if(!that.setting.id) return [];
          let today = now.getDay() !== 0 ?now.getDay() : 7;
          let total = 7 * (that.setting['editBefore'] + that.setting['editAfter'] + 1) || 7;
          return Array.from(new Array(total),function(val,index){
              let increase = today - index  - 1 + (that.setting['editBefore'] + that.setting['editAfter'] ) * 7;
              let time = new Date(Date.now() - increase * 24 * 60 * 60 * 1000);
              return that.formatDate(time);
          })
      },
      total(){
          return this.dataList.length;
      },

  },

  methods: {
    ...mapActions([
        'setProjectList',
        'setActivityList'
    ]),
    formatDate(date){
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) >= 10? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        let days = date.getDate() >= 10? date.getDate() : "0" + date.getDate();
        return year + "-" + month + "-" + days;
    },
    getWorkHoursSetting(){
        getWorkHoursSetting().then(res => {
            this.setting = res["FAW_PPM"];
             this.currentTimeList = this.getWeekDate();
            this.getScheduleMap();
            this.getHideTotalMap();
        })
    },
    getHideTotalMap(){
        let startDate = this.currentDateList[0];
        let endDate = this.currentDateList[this.currentDateList.length-1];
        let params = {
            startDate:startDate,
            endDate:endDate
        }
        getHideTotalMap(params).then(res => {
            this.hideTotalMap = res;
            this.currentTimeList.forEach(item =>{
                if(res.hasOwnProperty(item.date)){
                    item.yc_num = res[item.date];
                }else{
                    item.yc_num = 0;
                }
            })
            console.log(this.currentTimeList)
        })
    },
    getWeekDate(){
        let that = this;
        if(!that.setting.id) return [];
        let now = new Date();
        let today = now.getDay() !== 0 ?now.getDay() : 7;
        let week = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
        let total = 7 * (that.setting['editBefore'] + that.setting['editAfter'] + 1) || 7;

        return Array.from(new Array(total),function(val,index){
            let obj = {};
            let increase = today - index  - 1 + (that.setting['editBefore'] + that.setting['editAfter'] ) * 7;
            let time = new Date(Date.now() - increase * 24 * 60 * 60 * 1000);
            let day = time.getDay() !== 0 ? time.getDay() : 7;
            obj.date = that.formatDate(time);
            obj.weekDesc = week[day-1];
            obj.totalNum = 0;
            obj.editable = true;
            obj.yc_num = 0;
            if(that.hideTotalMap.hasOwnProperty(obj.date)){
                obj.yc_num = that.hideTotalMap[obj.date];
            }
            if(increase < 0 ){
                obj.editable = false;
            }
            return obj;
        })

    },
    getScheduleMap(){
        let startDate = this.currentDateList[0];
        let endDate = this.currentDateList[this.currentDateList.length-1];
       getScheduleMap(startDate,endDate).then(res => {
            this.scheduleMap = res;
        })
    },

    changeFun(rows) {
        this.multipleSelection = rows;
    },

    getListDataFunc(){
        this.loading = true;
        let startDate = this.currentDateList[0];
        let endDate = this.currentDateList[this.currentDateList.length-1];
        getWorkHoursInfo(startDate,endDate).then(res => {

            this.dataList = res.rows
            this.loading = false;
            this.transData();
        })
    },
    transData(){
        //先把每列的总数清0
        for(let item of this.currentTimeList){
            item.totalNum = 0;
        }
        if(this.dataList.length == 0) return ;
        this.dataList.forEach(element => {
            if(element.dataMap){
                this.currentTimeList.forEach(item =>{

                    if(!element.dataMap.hasOwnProperty(item.date)){
                        this.$set(element.dataMap,item.date,{});
                        this.$set(element.dataMap[item.date],"savedNum","");
                        this.$set(element.dataMap[item.date],"computedNum","");

                    }else{
                        if(element.dataMap[item.date].num){
                            element.dataMap[item.date].savedNum = parseFloat(element.dataMap[item.date].num);
                            item.totalNum = item.totalNum + parseFloat(element.dataMap[item.date].num);
                            element.dataMap[item.date].computedNum = parseFloat(element.dataMap[item.date].num);//被累加的指
                        }else{
                            element.dataMap[item.date].computedNum = "";
                            element.dataMap[item.date].savedNum = "";
                        }

                    }
                })
            }else{
                //初始化....
                 this.$set(element,"dataMap",{});
                for(let i = 0;i<this.currentTimeList.length;i++){
                    let item = this.currentTimeList[i];
                    this.$set(element.dataMap,item.date,{});


                    this.$set(element.dataMap[item.date],"computedNum","");
                }
            }
        });
        this.baseDataList = JSON.parse(JSON.stringify(this.dataList))
    },
    onCancel(){
        this.dialogVisible = false;
        this.$refs['addForm'].resetFields();
        this.modelItem = {};
    },
    onSubmit(){
         this.$refs['addForm'].validate((valid) => {
            if(this.dataList.find(single => single.modelId && single.activityId && single.modelId == this.form.modelId && single.activityId == this.form.activityId)){
                return EcoMessageBox.alert("已有重复的项目和专业，请重新选择","提示");
            }
            if (valid) {
                let startDate = this.currentDateList[0];
                let endDate = this.currentDateList[this.currentDateList.length-1];
                let params = {
                    model:this.form.model,
                    modelId:this.form.modelId,
                    activityId:this.form.activityId,
                    startDate:startDate,
                    endDate:endDate
                }
                this.dialogVisible = false;
                let obj = Object.assign({},this.form);
                obj.dataMap = {};
                for(let i = 0;i<this.currentTimeList.length;i++){
                    let item = this.currentTimeList[i];
                    obj.dataMap[item.date] = {};
                    this.$set(obj.dataMap[item.date],"computedNum","");
                }

                this.dataList.push(obj);
                this.$refs['addForm'].resetFields();
                this.modelItem = {};
                getHideItemInfo(params).then( res => {
                    if(!res.dataMap) return false;
                    this.currentTimeList.forEach(item =>{
                        if(res.dataMap.hasOwnProperty(item.date) && item.editable){
                            obj.dataMap[item.date] = res.dataMap[item.date];
                            let num = res.dataMap[item.date].num;
                            obj.dataMap[item.date].computedNum = num;
                            item.totalNum = item.totalNum + parseFloat(num);
                            item.yc_num = item.yc_num - num;
                        }
                    });
                })

            } else {

                return false;
            }
       });

    },
    checkDayTotalNum(){

        for(let i = 0;i<this.currentTimeList.length;i++){
            let element = this.currentTimeList[i];
            console.log(element.totalNum)
            console.log(element.yc_num)
            console.log(element.totalNum + element.yc_num)
            if(element.totalNum + element.yc_num > this.setting['hour']){
                let str = element.date+" 不能超过规定的工时 "+this.setting['hour'];
                if(element.yc_num ){
                    str = str + "，隐藏行已填报的工时总和为 "+element.yc_num+"，请重新填报";
                }
                EcoMessageBox.alert(str,"提示");
                return false;
                break;
            }
        }
        return true;
    },
    save(){
        if(!this.checkDayTotalNum()) return;
        let loadingInstance = Loading.service({ fullscreen: true,text:"保存中...."});

        saveWorkHours(this.dataList).then(res => {
             this.$nextTick(() => {
                loadingInstance.close();
                this.$message({
                    message: '保存成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this.getListDataFunc(1);
                this.getHideTotalMap();
             });

        })
    },
    projectChange(item){
        this.form.modelId = item.id;
        this.form.modelCode = item.code;
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
    numChange(value,oldValue,col,item){
        let computedNum = parseFloat(oldValue?oldValue:0);
        col.totalNum = col.totalNum - computedNum + parseFloat(value?value:0);
        item.computedNum = parseFloat(value);
        //要加上被隐藏的原始行数据

        let str = col.date+" 不能超过规定的工时 "+this.setting['hour'];
        getHideTotalByDate(col.date).then(res => {
            col.yc_num = res;
            if(col.totalNum + col.yc_num > this.setting['hour']){
                if(col.yc_num){
                    str = str + "，隐藏行已填报的工时总和为 "+col.yc_num+"，请重新填报";
                }
                return EcoMessageBox.alert(str,"提示");
            }



        })



    },
    inputBlur(col,item,e){
        //col.totalNum = 0;
        // this.dataList.forEach(element => {

        //     if(!element.dataMap.hasOwnProperty(col.date)){

        //     }else{
        //         if(element.dataMap[col.date].num){
        //             col.totalNum = col.totalNum + parseFloat(element.dataMap[col.date].num);
        //         }

        //     }

        // });


    },
    handleCurrentChange(val) {
        this.currentRow = val;
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    hideItem(row,index){
        let options = {
            type: 'warning',
            lockScroll:false
        }
        let that = this;
        let row_map = row['dataMap'];
        let confirmYesFunc = function(){
            that.dataList.splice(index,1);

            hideWorkHours({model:row.model,modelId:row.modelId,activityId:row.activityId}).then(res=>{
                that.$message({
                    message: '隐藏成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                that.currentTimeList.forEach(item =>{
                    let num = row_map[item.date].num;
                    item.totalNum = item.totalNum - parseFloat(num?num:0);
                    item.yc_num = item.yc_num + parseFloat(num?num:0);
                })

            })

        }
        EcoMessageBox.confirm('确定要隐藏这行数据吗?','提示',options,confirmYesFunc);


        // //拿原始的数据项放入隐藏的数组里
        // let row_map = row['dataMap'];
        // this.hideItems.push(this.baseDataList[index]);
        // let base_row_map = this.baseDataList[index]['dataMap'];
        // //拿被隐藏的行数据,然后要把已经加上去的工时总数去掉,并且加上原始行的工时
        // this.currentTimeList.forEach(item =>{
        //    let num = row_map[item.date].num;
        //    let num_ = base_row_map[item.date].num;
        //    item.totalNum = item.totalNum - parseFloat(num?num:0) + parseFloat(num_?num_:0);
        // })

    },
    clearItem(row,index){
        let options = {
            type: 'warning',
            lockScroll:false
        }
        let that = this;
        let confirmYesFunc = function(){
            let row_map = row['dataMap'];
            that.currentTimeList.forEach(item =>{
                let num = row_map[item.date].num;
                row_map[item.date].num = "";
                row_map[item.date].computedNum = "";
                item.totalNum = item.totalNum - parseFloat(num?num:0);
            })

        }
        EcoMessageBox.confirm('确定要清空这行数据吗?','提示',options,confirmYesFunc);

    },
    copyWeek(){
        if(this.multipleSelection.length == 0) return EcoMessageBox.alert('请先选择行','提示');
        this.multipleSelection.forEach(element => {
            let params = {
                model:element.model,
                modelId:element.modelId,
                activityId:element.activityId,
                currDate:this.formatDate(new Date())
            }
            copyLastWeek(params).then(res=>{
                if(!res.dataMap) return false;
                this.currentTimeList.forEach(item =>{
                    if(res.dataMap.hasOwnProperty(item.date) && item.editable && !element.dataMap[item.date].savedNum){
                        let num = res.dataMap[item.date].num;
                        element.dataMap[item.date].num = num;
                        let computedNum = parseFloat(element.dataMap[item.date].computedNum?element.dataMap[item.date].computedNum:0);
                        item.totalNum = item.totalNum - computedNum + parseFloat(num);
                        element.dataMap[item.date].computedNum = num;
                    }
                });

            })
        });

    },
    changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    }
  },
  watch:{

  },

};
</script>

<style scoped>
.forInput{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.forInput .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.forInput .toolBtn{
    margin:0 10px;
}

.workHoursDialog .btn{
    text-align: right;
    bottom: 0;
    right: 0;
    left: 0;
}
.hicon{
    position: relative;
    top:3px;
}

</style>
