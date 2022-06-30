<template>
    <div class="layoutOutDiv meetingGraphical">
      <div class="layoutInnerAbsoluteDiv">

          <eco-content top="0px" height="60px" type="tool">
              <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="12" >
                        <el-button  size="mini" v-show="viewType == 'monthly'"  @click.native="nowDay">本月</el-button>&nbsp;
                        <el-button  size="mini" v-show="(viewType == 'graphical') || (viewType == 'table')" @click.native="nowDay">今天</el-button>&nbsp;
                        <el-button-group size="mini">
                            <el-button  icon="el-icon-arrow-left" size="mini" @click.native="preDay"  title="上一天" v-show="viewType == 'graphical'">上一天</el-button>
                            <el-button  size="mini" title="下一天" @click.native="nextDay" v-show="viewType == 'graphical'">下一天<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
                        
                        
                            <el-button  icon="el-icon-arrow-left" size="mini" @click.native="preWeek"  title="上一周" v-show="viewType == 'table'">上一周</el-button>
                            <el-button  size="mini" title="下一周" @click.native="nextWeek" v-show="viewType == 'table'">下一周<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
                        
                            <el-button  icon="el-icon-arrow-left" size="mini" @click.native="preMonth"  title="上月" v-show="viewType == 'monthly'">上月</el-button>
                            <el-button  size="mini" title="下月" @click.native="nextMonth" v-show="viewType == 'monthly'">下月<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
                          
                        </el-button-group>
                        <el-date-picker  value-format="yyyy-MM-dd" v-show="(viewType == 'graphical') || (viewType == 'table')"  type="date" v-model="chooseDate"  placeholder="选择日期时间" size="mini" @change="listenTimeChange" style="width:130px;" :clearable=false></el-date-picker>
                        <el-date-picker  value-format="yyyy-MM-dd" v-show="viewType == 'monthly'" type="month" v-model="chooseDate"  placeholder="选择日期时间" size="mini" @change="listenTimeChange" style="width:130px;" :clearable=false></el-date-picker>
                    </el-col>

                    <el-col :span="12" style="text-align:right">
                         <el-radio-group v-model="viewType" @change="changeViewType">
                                <el-radio-button label="graphical">图形视图</el-radio-button>
                                <el-radio-button label="table">列表视图</el-radio-button>
                                <el-radio-button label="monthly">月度视图</el-radio-button>
                        </el-radio-group>
                    </el-col>
              </el-row>
          </eco-content>
          
          <eco-content bottom="0px" top="59px" ref="content" style="padding:0px 15px 15px 15px;overflow:auto">
                <meetingGraphicalView v-if="viewType == 'graphical'" :chooseDate="chooseDate"></meetingGraphicalView>
                <meetingGraphicalTableView v-if="viewType == 'table'" :chooseDate="chooseDate"></meetingGraphicalTableView>
                <meetingMonthlyView v-if="viewType == 'monthly'" @dateFunc="getDateFunc($event)" :chooseDate="chooseDate"></meetingMonthlyView>

          </eco-content>

      </div>
  </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {EcoDate} from '@/components/date/main.js'
import meetingGraphicalView from './meetingGraphicalView.vue'
import meetingGraphicalTableView from './meetingGraphicalTableView.vue'
import meetingMonthlyView from './meetingMonthlyView.vue'
export default {
     components:{
            ecoContent,
            ecoToolTitle,
            meetingGraphicalView,
            meetingGraphicalTableView,
            meetingMonthlyView
     }, 
     data(){
         return{
                viewType:'graphical',
                chooseDate:null,
                chooseDataLong:null,
         }
     },

    computed:{
         
    },
    created(){
         let _date = new Date();
         this.chooseDate= EcoDate.formatDateDefault(_date);
         this.chooseDataLong = _date.getTime();
    },
    mounted(){
    
    },
    methods: {
        listenTimeChange(val){
            this.chooseDataLong = EcoDate.convertDateFromString(this.chooseDate).getTime();
            console.log(this.chooseDataLong);
            
        },

        preDay(){
            this.chooseDataLong = (this.chooseDataLong - 24*60*60*1000);
            this.chooseDate = EcoDate.formatDateDefault(new Date(this.chooseDataLong));
        },

        //下一天
        nextDay(){
            this.chooseDataLong = (this.chooseDataLong + 24*60*60*1000);
            this.chooseDate = EcoDate.formatDateDefault(new Date(this.chooseDataLong));
        },

        //上一周
        preWeek(){
            this.chooseDataLong = (this.chooseDataLong - 7*24*60*60*1000);
            this.chooseDate = EcoDate.formatDateDefault(new Date(this.chooseDataLong));
        },

        //下一周
        nextWeek(){
            this.chooseDataLong = (this.chooseDataLong + 7*24*60*60*1000);
            this.chooseDate = EcoDate.formatDateDefault(new Date(this.chooseDataLong));
            console.log(this.chooseDate);
        },

        // 上月
        preMonth() {
           let days = new Array() 
           days = this.chooseDate.split('-')
           let month = days[1]
           if (month == '1' || month == '01') { //上一年
                this.chooseDate = (parseInt(days[0] - 1)) + '-12'
           } else {
               let month1 = (parseInt(days[1] - 1)) <9 ? '0' + (parseInt(days[1] - 1)) : (parseInt(days[1] - 1))
                this.chooseDate = days[0] + '-' + month1
           }

        },
        // 下月
        nextMonth() {
            let days = new Array() 
            days = this.chooseDate.split('-')
            let month = days[1]
            if (month == '12') { //上一年
                this.chooseDate = parseInt(parseInt(days[0]) + parseInt(1)) + '-01'
            } else {
                let month1 =  (parseInt(parseInt(days[1]) + parseInt(1))) < 9 ? '0' + (parseInt(parseInt(days[1]) + parseInt(1))) :  (parseInt(parseInt(days[1]) + parseInt(1)))
                this.chooseDate = days[0] + '-' +month1
            }
        },
       getDateFunc(e) {
           this.chooseDate = e
       },
        //今天
        nowDay(){
            let _date = new Date();
            this.chooseDate= EcoDate.formatDateDefault(_date);
            this.chooseDataLong = _date.getTime();
        },

        changeViewType(){
            // this.nowDay();
        }
    }

 }


</script>
<style>

  .meetingGraphical .searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #fafafa ;
      border-bottom: 1px solid #ddd;
      height:101px;
      overflow-y:hidden;
  }

 .meetingGraphical .itemInput{
      display: inline-block;
      width: 120px;
      margin-right: 10px;
  }

  .meetingGraphical .alink{
    cursor: pointer;
    color: #409eff;
  }

 .meetingGraphical .delLink{
    cursor: pointer;
    color: red;
  }

  
</style>
