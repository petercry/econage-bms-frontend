<template>
  <div class="calendar">
    <div class="calendar-header">
      <i class="el-icon-arrow-left" @click="date = new Date(year,month-2,1)"></i>
      <span style="position:relative;" @click="$refs.datePicker.focus()">{{year}}{{$t('calendar.year')}} {{$t('calendar.month'+month)}}
          <el-date-picker style="position:absolute;top: -11px;left: 0px;width: 40px;opacity:0;" popper-class="time-c-popper" ref="datePicker" v-model="selectMonth" type="month"></el-date-picker>
      </span>
      <i class="el-icon-arrow-right" @click="date = new Date(year,month,1)"></i>
    </div>
    <div class="calendar-body">
        <ul class="calender-week clearfix">
            <li v-for="item in weekList" :key="item">{{item}}</li>
        </ul>
        <ul class="calender-date clearfix">
            <li v-for="item in beforeList" class="gray" :key="'b'+item" :class="{today:isToday(-1,item),choosed:isChoosed(-1,item)}" @click="select(-1,item)"><div>{{item}}</div></li>
            <li v-for="item in nowList"  :key="'n'+item" :class="{today:isToday(0,item),choosed:isChoosed(0,item)}" @click="select(0,item)"  @dblclick="goCalendar(0,item)"><div>{{item}}</div><span v-if="isNote(0,item)" class="point themeB"></span></li>
            <li v-for="item in afterList" :key="'a'+item" class="gray" :class="{today:isToday(1,item),choosed:isChoosed(1,item)}" @click="select(1,item)"><div>{{item}}</div></li>
        </ul>
    </div>
  </div>
</template>

<script>
  import {EcoDate} from '@/components/date/main.js'
  import {getCalendarStatusAjax} from "@/modules/bmsSystem/service/service.js"
  export default {
      components:{

      },

      data(){
          return{
            month:1,
            year:1900,
            dater:1,
            date:null,
            selectdate:null,
            weekList:[
                this.$t('calendar.sun'),
                this.$t('calendar.mon'),
                this.$t('calendar.tue'),
                this.$t('calendar.wed'),
                this.$t('calendar.thu'),
                this.$t('calendar.fri'),
                this.$t('calendar.sat')
            ],
            // ["日","一","二","三","四","五","六"],
            beforeList:[],
            nowList:[],
            afterList:[],
            selectMonth:'',
            dayNumObj:{}
          }
      },
      props:['cardclass','dateClick','value'],
      computed: {

      },
      created(){
      },
      mounted(){
          this.selectdate = this.date=new Date();
      },
      methods: {
        dateRender:function (date) {
            let month=date.getMonth()+1;
            let year=date.getFullYear();
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

            this.getCalendarStatusFunc();
        },
        isToday:function(val,riqi){
            let date = new Date(this.year,this.month-1+val,riqi);
            let today = new Date();
            if (date.getFullYear()===today.getFullYear()&&date.getMonth()===today.getMonth()&&date.getDate()===today.getDate()){
                return true;
            }else{
                return false;
            }
        },
        isChoosed:function(val,riqi){
            let date = new Date(this.year,this.month-1+val,riqi);
            if (date.getFullYear()===this.selectdate.getFullYear()&&date.getMonth()===this.selectdate.getMonth()&&date.getDate()===this.selectdate.getDate()){
                return true;
            }else{
                return false;
            }
        },
        isNote:function(val,riqi){
            let dateStr  = EcoDate.formatDateDefault(new Date(this.year,this.month-1+val,riqi));
            if(this.dayNumObj[dateStr]){
                return true;
            }else{
                return false;
            }
        },
        select:function(val,riqi){
            this.selectdate = new Date(this.year,this.month-1+val,riqi);
            if (val==-1){
                this.date = new Date(this.year,this.month-2,1);
            }
            if (val==1){
                this.date = new Date(this.year,this.month,1);
            }
        },
        //跳转到日程安排页面
        goCalendar(val,riqi){
              let clickDate = EcoDate.formatDateDefault(new Date(this.year,this.month-1+val,riqi));
              let tabObj = {};
              let goPage = "/wh/jsp/version3/calendar/index.html@/index/"+clickDate;
              tabObj.desc = this.$t('module.note2');
              tabObj.tabKey = "calendarArrangement";
              tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'calendarArrangement',doNothing:'N',cmd:'v3.goPage',goPage:'"+goPage+"'}";
              window.sysvm.doTab(tabObj);
          },

          getCalendarStatusFunc(){
              let year = this.year;
              let month = this.month;
              getCalendarStatusAjax(year,month).then((response)=>{
                  let tempDayNumObj = {};
                  for(let i = 0;i<response.data.info.length;i++){
                      if(response.data.info[i].dateStr && response.data.info[i].num == 2){
                            tempDayNumObj[response.data.info[i].dateStr]  = true;
                      }
                  }

                  this.dayNumObj = tempDayNumObj;
              }).catch((error)=>{});
          },
      },
      watch:{
          'date' (val){
              this.dateRender(val);
          },
          'selectdate'(val){
              this.$emit('input', val);
          },
          'selectMonth'(val){
              this.date = val;
          }
      }

  }

</script>

<style scoped>
.calendar{
    border-bottom: 1px solid #e8e8e8;
}
.calendar-header{
    height: 36px;
    font-size: 12px;
    line-height: 36px;
    color: #000;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
}
.calendar-header i{
    cursor:pointer;
}
.calendar-body{
    height: 184px;
    overflow-y: auto;
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
    cursor:pointer;
}
.calendar-body li div{
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius:12px;
}
.calendar-body li.gray{
    color:#bebebe;
}
.calendar-body li.today div{
    background-color:gray;
    color:#fff;
}
.calendar-body li.today .point{
    background-color:#fff;
}
.calendar-body li.choosed .point{
    background-color:#fff;
}



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
</style>
