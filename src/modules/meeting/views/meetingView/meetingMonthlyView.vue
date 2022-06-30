<template>
  <div class="tableView">
      <el-calendar v-model="chooseDate">
           <template
                slot="dateCell"
                slot-scope="{date, data}">
                <div slot="refreshFunc" class="date-content" @click="selectDateClick(data)">
                    <div class="date-cell" :class="data.isSlected ? 'is-selected' : ''">
                        <div class="calendar-day">
                            {{data.day.split('-').slice(2).join('-')}}    
                        </div>    
                        <div v-for="(item,idx) in meetingList" :key="idx">
                            <!-- {{item.startTime.substring(0,10)}} -->
                            <div v-if="item.startTime.substring(0,10) == data.day" class="zbItem color-1" @click="goMeetingViewPage(item)">
                                  <span class="meetingNameClass">{{item.name}}</span>
                                  <span style="float:right;font-size:12px">{{item.startTime.substring(11,16)}}-{{item.endTime.substring(11,16)}}</span>
                            </div>
                        </div>
                     </div>
                   
                </div>
            </template>
        </el-calendar>

  </div>
</template>

<script>
import {createMonthDay } from '@/modules/meeting/utils/date.js'
import {EcoDate} from '@/components/date/main.js'
import {getGanttInfoAjax,getRoomListAjax,getRoleBtnSetting} from '@/modules/meeting/service/service.js'
import {sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'

export default {
  components:{
         
    }, 
  name: 'tableView',
  props:{
     chooseDate:{
        type:String,
        default:()=>{
            EcoDate.formatDateDefault(new Date())
        }
     },

  },
  data() {
    return {
        roomParams:{
            name:null,
            page:1,
            rows:999999,
            order:'desc',
            sort:'createDate',
        },
          value: new Date(),
          meetingList:[],
        roomList: [],
        meetingMap:{},
        contentForm:{
            endDateFrom:null,
            startDateTo:null,
            filterWfStatusAvailable:false,
            catId:'CONFERENCE'
        },
        loadedOrder:true,
        timeWeek:[],
        timeWeekDesc:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
        btnRoleMap:{},
        beforeList:[],
        nowList:[],
        afterList:[],
        date:''
    }
  },
   computed:{
       colorObj: function () {
            let color = 'color-'+(( (Math.floor(Math.random() * (1 - 1)) + 1) % 1)+1);
            return color;
        },
   },
  mounted() {
        let year = this.chooseDate ? this.chooseDate.split('-')[0]: ''
        let month = this.chooseDate ? this.chooseDate.split('-')[1]:''
        this.timeWeek = createMonthDay(year,month)
        this.date = new Date();
        this.getRoleBtnSetting();
        this.initModuleFunc();
        this.handleMapData();
     
  },
  methods: {
   
    initModuleFunc() {
          getRoomListAjax(this.roomParams).then(res=>{
                this.roomList=res.data.rows;
                
          })
    },

      getRoleBtnSetting(){
              const btn_array = ['oa.conference_graphical_VIEW_Conference',
                'oa.conference_graphical_CREATE_Conference',
                'oa.conference_graphical_UPDATE_Conference',
                'oa.conference_graphical_DELETE_Conference'
              ];
              getRoleBtnSetting(btn_array).then((res)=>{
                    if(res.data){

                        this.btnRoleMap = res.data.authenticationMap;
                    }
              })
        },
     
      selectDateClick(e) {
        console.log(e);
      },
      
    handleMapData(){
          getGanttInfoAjax(this.contentForm).then(res=>{
              this.meetingList = res.data.rows 
        })
    },

      
        addMeeting(item,date,$event){
            
            if(this.btnRoleMap['oa.conference_graphical_CREATE_Conference']){
                if(sysEnv == 1){
                        let _storeObj = {};
                        _storeObj.key = EcoUtil.getUID();
                        _storeObj.data = {};
                        _storeObj.data.roomName = item.name;
                        _storeObj.data.roomId = item.id;
                        _storeObj.data.startTime = date+" 08:00:00";
                        _storeObj.data.endTime = date+" 08:00:00";
                        EcoUtil.getSysvm().setTempStore(_storeObj.key,_storeObj.data);
                        let url = '/meeting/index.html#/meetingAdd/'+_storeObj.key;
                        EcoUtil.getSysvm().openDialog('会议新增',url,900,550,'8vh');
                }else{
                        this.$router.push({name:'meetingAdd',params:{storeKey:EcoUtil.getUID()}});
                }
            }
        },


        goMeetingViewPage(item){
            if(sysEnv == 1){
                let url = '/meeting/index.html#/meetingView/'+item.id;
                EcoUtil.getSysvm().openDialog('会议详情',url,750,550,'8vh');
            }else{
                this.$router.push({name:'meetingView',params:{id:item.id}});
            }
        }
   
  },
  watch: {
     'chooseDate'(to,from){
            let date = new Date(to)
            this.chooseDate= EcoDate.formatDateDefault(date);
            this.$emit('dateFunc',this.chooseDate);
            this.handleMapData();         
     },
  },
  


}
</script>

<style scoped>
.tableView .zbTableFixed{
    width:calc(100% - 93px);
    position: fixed;
    left:39px;
    right:39px;
    background-color: #fff;
    z-index: 99;
}

.tableView .zbTableFixed th{
    text-align:center;
    font-size: 14px;
    border:1px solid #ededed;
    padding:5px 0px;
    color:#9c9c9c;    
}

.tableView .zbTableFixed .col-desc{
    width:16%;
    line-height: 40px;
    color:#9c9c9c;
}

.tableView .zbTableFixed .col-a{
    width:12%;
}


.tableView .zbTable{
    width:100%;
    border-collapse: collapse;
}

.tableView .zbTable th{
    text-align:center;
    font-size: 14px;
    border:1px solid #ededed;
    padding:5px 0px;
    color:#9c9c9c;    
}

.tableView .zbTable td{
    text-align:center;
    font-size: 12px;
    border:1px solid #ededed;
    /* padding:5px 0px; */
}

.tableView .zbTable .col-desc{
    width:16%;
    line-height: 40px;
    color:#9c9c9c;
}

.tableView .zbTable .col-a{
    position: relative;
    width:12%;
}

.tableView .zbTable .dayClass {
    height: 15px;
    position:absolute;
    color:red;
    padding:2px;
    top:-3px;
    right:0;
    background:rgba(255,255,255,.8)
}


.tableView .zbDiv .title{
    font-size: 28px;
    text-align: center;
    color:red;
    font-weight: 500;
}

.tableView .zbItem{
    display: inline-block;
    width: 100%;
    height: 100%;
    padding-left: 5px;
    padding-right:3px;
    margin-top:2px;
    box-sizing: border-box;
    font-size:12px;
    color:#4a4a4a;
}
.tableView .zbTable .zbItem1{
    margin-top:5px;
}

.tableView .zbTable .zbItem .desc{
    color:#347fb7;
}
.tableView .zbTable .gray {
    background-color:#d9d9d9
}
.tableView {
    font-size:14px
}
.date-content {
    position: relative;
    top:0;
    left:0;
}
.tableView .date-content .meetingNameClass {
    display: inline-block;
    width:110px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

}
.tableView >>> .el-calendar-table thead th {
    border: 1px solid #ededed;
    text-align: center;
    color:#9aa6a2
}
.tableView >>> .el-calendar-table thead th:before{
    content: '星期';
}
.tableView >>> .el-calendar__header {
    padding:0
}
.tableView >>> .el-calendar__title {
    display: none;
}
.tableView >>> .el-calendar__button-group {
    display: none;
}

.tableView .date-content .calendar-day {
    /* position:absolute; 
    top:0px;
    right:6px; */
    float:right;
    color:red;
    font-size:12px
}
.tableView >>> .el-calendar-table .el-calendar-day {
    padding:0;
    height: 100px;
    overflow:auto;
}

.tableView >>> .el-calendar-table:not(.is-range) td.next, .tableView >>> .el-calendar-table:not(.is-range) td.prev {
    color:#C0C4CC;
    background:#fafafa
}
 
</style>
