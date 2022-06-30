<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <eco-content top="0" bottom="0"  class="layout" style="padding:12px 24px;">
        <el-card style="position:relative;height: 100%;">
        <div slot="header" class="clearfix">
          <span>排班管理</span>
          <!-- <el-button  style="float: right; padding: 3px 5px" type="text" @click.native="add"><i class="el-icon-plus"></i>添加打印模板</el-button>
          <el-button  style="float: right; padding: 3px 5px;color:#E37087;" type="text" @click.native="delMult"><i class="el-icon-delete"></i>批量删除</el-button>
          <el-input
                placeholder="模板名称"
                v-model="baseInfo.tplName"
                style="float: right; top:-2px;width:200px;"
                @keyup.enter.native="searchFunc">
              <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
          </el-input> -->
        </div>
        <!-- <ecoContent class="themeList" top="58px" bottom="0" style="padding:12px 24px;"> -->
        <eco-content bottom="42px" top="58px" ref="content" style="padding:0;">
          <div class="calendar">
            <div class="calendar-header">
              <i class="el-icon-arrow-left" @click="date = new Date(year,month-2,1)"></i>
              <span style="position:relative;" @click="$refs.datePicker.focus()">{{year}}年 {{month}}月
                  <el-date-picker style="position:absolute;top: -11px;left: 0px;width: 40px;opacity:0;" popper-class="time-c-popper" ref="datePicker" v-model="selectMonth" type="month"></el-date-picker>
              </span>
              <i class="el-icon-arrow-right" @click="date = new Date(year,month,1)"></i>
            </div>
            <div class="calendar-body">
                <ul class="calender-week clearfix">
                    <li v-for="item in weekList" :key="item" :class="{red:item=='六'||item=='日'}">{{item}}</li>
                </ul>
                <ul class="calender-date clearfix">
                    <li v-for="item in beforeList" class="notthisMonth" :key="'b'+item" :class="{today:isToday(-1,item),choosed:isChoosed(-1,item)}" @click="select(-1,item)">
                    </li>
                    <li 
                      v-for="item in nowList"  :key="'n'+item" 
                      :class="{today:isToday(0,item),choosed:isChoosed(0,item),work:getScheduleObj(item).type=='WORKING_DAY',future:isFuture(0,item)}" 
                      @click="select(0,item)&&edit(item)">
                      <div class="date" :class="{red:isSunSat(0,item)}">{{item}}</div>
                      <span class="status" v-if="getScheduleObj(item).type=='WORKING_DAY'">上班</span>
                      <span class="status" v-else>休息</span>
                      <div class="comment">
                        <div class="ellipsis">{{getScheduleObj(item).comments}}</div>
                      </div>
                      <!-- <span v-if="isNote(0,item)" class="point themeB"></span> -->
                    </li>
                    <li v-for="item in afterList" :key="'a'+item" class="notthisMonth" :class="{today:isToday(1,item),choosed:isChoosed(1,item)}" @click="select(1,item)">
                    </li>
                </ul>
            </div>
          </div>
        </eco-content>
        </el-card>
      </eco-content>
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoDate} from '@/components/date/main.js'
import EcoUtil from '@/components/util/main.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getScheduleMonthView,editScheduleAjax} from '@/modules/schedule/service/service.js'
export default{
  name:'demo',
  components:{
    ecoContent,
    ecoLoading,
  },
  data(){
    return {
      month:1,
      year:1900,
      dater:1,
      date:null,
      selectdate:null,
      // weekList:[
      //     this.$t('calendar.sun'),
      //     this.$t('calendar.mon'),
      //     this.$t('calendar.tue'),
      //     this.$t('calendar.wed'),
      //     this.$t('calendar.thu'),
      //     this.$t('calendar.fri'),
      //     this.$t('calendar.sat')
      // ],
      weekList:["日","一","二","三","四","五","六"],
      beforeList:[],
      nowList:[],
      afterList:[],
      selectMonth:'',
      dayNumObj:{},
      scheduleList:[],
    }
  },
  mounted(){
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.selectdate = this.date=new Date();
  },
  methods: {
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'scheduleEditCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.dateRender(window.ecoFrameVm.date);
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    getScheduleMonthView(year,month){
      getScheduleMonthView({year:year,month:month}).then(res=>{
        this.scheduleList = res.data;
      }).catch(e=>{})
    },
    dateRender(date) {
        let month=date.getMonth()+1;
        let year=date.getFullYear();
        this.getScheduleMonthView(year,month)
        this.month=month;
        this.year=year;
        let beforeLastDate = new Date(year,month-1,0).getDate();//上月最后一天日期数
        let thisFirstWeek = new Date(year,month-1,1).getDay();//本月1号星期数
        let thisLastDate = new Date(year,month,0).getDate();//本月最后一天日期数
        let thisLastWeek = new Date(year,month,0).getDay();//本月最后一天星期数
        let beforeList=[];
        let nowList=[];
        let afterList=[];
        //组装之前的日期
        for (let i=0 ;i<thisFirstWeek;i++,beforeLastDate--){
            beforeList.unshift(beforeLastDate);
        }
        //组装这个月的日期
        for (let i=1 ;i<=thisLastDate;i++){
            nowList.push(i);
        }
        //组装下个月的日期
        for (let i=1 ;i<7-thisLastWeek;i++){
            afterList.push(i);
        }
        this.beforeList=beforeList;
        this.nowList=nowList;
        this.afterList=afterList;

    },
    isToday(val,riqi){
        let date = new Date(this.year,this.month-1+val,riqi);
        let today = new Date();
        if (date.getFullYear()===today.getFullYear()&&date.getMonth()===today.getMonth()&&date.getDate()===today.getDate()){
            return true;
        }else{
            return false;
        }
    },
    isChoosed(val,riqi){
        let date = new Date(this.year,this.month-1+val,riqi);
        if (date.getFullYear()===this.selectdate.getFullYear()&&date.getMonth()===this.selectdate.getMonth()&&date.getDate()===this.selectdate.getDate()){
            return true;
        }else{
            return false;
        }
    },
    getScheduleObj(riqi){
      let date = new Date(this.year,this.month-1,riqi);
      let dateStr  = EcoDate.formatDateDefault(date);
      let schedule = this.scheduleList.filter(item=>item.date==dateStr);
      if (schedule.length>0){
        return schedule[0]
      }else{
        let day = date.getDay();
        let isWork = true;
        if (day==0||day==6){
          isWork = false;
        }
        return{
          date: dateStr,
          type: isWork?"WORKING_DAY":"HOLIDAY_VACATIONS",
          comments: null,
        }
      }
    },
    isFuture(val,riqi){
      let date = new Date(this.year,this.month-1+val,riqi);
      let today = new Date();
      if (date.getFullYear()===today.getFullYear()&&date.getMonth()===today.getMonth()&&date.getDate()===today.getDate()){
          return false;
      }
      if (today.getTime()>date.getTime()){
        return false;
      }
      return true;
    },
    isSunSat(val,riqi){
      let date = new Date(this.year,this.month-1+val,riqi);
      let day = date.getDay();
      if (day==0||day==6){
        return true;
      }
      return false;
    },
    // isNote(val,riqi){
    //     let dateStr  = EcoDate.formatDateDefault(new Date(this.year,this.month-1+val,riqi));
    //     if(this.dayNumObj[dateStr]){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // },
    select(val,riqi){
        this.selectdate = new Date(this.year,this.month-1+val,riqi);
        if (val==-1){
            this.date = new Date(this.year,this.month-2,1);
        }
        if (val==1){
            this.date = new Date(this.year,this.month,1);
        }
        return true;
    },
    edit(riqi){
      let isFuture = this.isFuture(0,riqi);
      if (isFuture){
        window.parent.sysvm.scheduleData = this.getScheduleObj(riqi);
        window.parent.sysvm.openDialog('调整排班',
        '/schedule/index.html#/scheduleEdit',700,450);
      }
    },
  },
  watch: {
   'date' (val){
     if(val){
       this.dateRender(val);
     }  
    },
    // 'selectdate'(val){
    //     this.$emit('input', val);
    // },
    'selectMonth'(val){
        this.date = val;
    }
  }
}
</script>
<style>
.calendar{
    /* border-bottom: 1px solid #e8e8e8; */
    padding: 0 20px;
}
.calendar-header{
    height: 36px;
    font-size: 12px;
    line-height: 36px;
    color: #000;
    text-align: center;
    /* border-bottom: 1px solid #e8e8e8; */
}
.calendar-header i{
    cursor:pointer;
}
.calendar-body{
    /* height: 184px; */
    /* overflow-y: auto; */
    border-bottom: 1px solid #e8e8e8; 
    border-right: 1px solid #e8e8e8; 
}
.calendar-body ul{
    clear:both;
    line-height: 26px;
}
.calendar-body li{
    position: relative;
    float:left;
    width:14.28571%;
    text-align: center;
    /* cursor:pointer; */
    box-sizing: border-box;
    border-top: 1px solid #e8e8e8; 
    border-left: 1px solid #e8e8e8; 
}
/* .calendar-body li div{
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius:12px;
} */
 /* .calendar-body li.gray{
    color:#bebebe;
} */
/*.calendar-body li.today div{
    background-color:gray;
    color:#fff;
}
.calendar-body li.choosed div{
  
    background-color:greenyellow;
}
.calendar-body li.today .point{
    background-color:#fff;
}
.calendar-body li.choosed .point{
    background-color:#fff;
} */



.calendar-body li .point{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    margin: 0 auto;
    display: inline-block;
    height: 4px;
    width: 4px;
    border-radius: 2px;
}
/* .calendar-body li.choosed div{
    background-color:#1ba5fa;
    color:#fff;
} */
.calender-week{
    font-size:12px;
    color: #262626;
    font-weight:bold;
}
.calender-date{
    font-size:12px;
    color: #595959;
}
.calender-week li{
  height: 50px;
  line-height: 50px;
}
.calender-week li.red{
  color: red;
}
.calender-date li{
  position: relative;
  height:80px;
  line-height: 80px;
  font-size: 18px;
  background-color: #AAAAAA;
}
.calender-date li div.date{
  position: absolute;
  left: 4px;
  top: 4px;
  line-height: 20px;
  font-size: 14px;
  color: #fff;
}
.calender-date li div.date.red{
  color: red;
}
.calender-date li .comment{
  position: absolute;
  bottom: 4px;
  padding: 0 4px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 20px;
  width: 100%;
}
.calender-date li .status{
  font-weight: bold;
}
.calender-date li.notthisMonth{
  background-color: transparent;
  background-color: unset;
}
.calender-date li.work{
  background-color: #48A5F4;
}
.calender-date li.future{
  color: #fff;
  cursor: pointer;
}
</style>
