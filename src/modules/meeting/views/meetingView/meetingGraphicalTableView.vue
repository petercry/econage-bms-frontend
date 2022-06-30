<template>
  <div class="tableView">
        <table class="zbTableFixed">
                <thead>
                    <tr class="headTr">
                        <th class="col-desc">&nbsp;</th>
                        <th class="col-a" v-for="(col,idx) in timeWeek" :key="idx">
                            {{timeWeekDesc[idx]}}<br/>
                            ({{col}})
                        </th>
                    </tr>
                </thead>
        </table>

        <table class="zbTable">
                <thead>
                    <tr class="headTr">
                        <th class="col-desc">&nbsp;</th>
                        <th class="col-a" v-for="(col,idx) in timeWeek" :key="idx">
                            {{timeWeekDesc[idx]}}<br/>
                            ({{col}})
                        </th>
                    </tr>
                </thead>
                        <tbody>
                            <tr v-for="(item,idx) in roomList" :key="idx">
                                    <td class="col-desc">{{item.name}}</td>
                                    <td class="col-a" v-for="(col,idx) in timeWeek" :key="idx" >
                                        <template v-if="meetingMap[item.id] && meetingMap[item.id][timeWeek[idx]]">
                                                 <div v-for="(dataItem,daIdx) in meetingMap[item.id][timeWeek[idx]]" :key="'d'+daIdx"  class="zbItem color-1"  @click="goMeetingViewPage(dataItem)">
                                                    <div>{{dataItem.startTime.substring(11,16)}}-{{dataItem.endTime.substring(11,16)}}</div>
                                                    <div class="desc" >{{dataItem.name}}</div>
                                                </div>  
                                        </template>
                                    </td>
                            </tr>
                        </tbody>
        </table>

  </div>
</template>

<script>
import { formatDate,getWeekDay } from '@/modules/meeting/utils/date.js'
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
        btnRoleMap:{}
    }
  },
   computed:{
       colorObj: function () {
            let color = 'color-'+(( (Math.floor(Math.random() * (1 - 1)) + 1)   % 1)+1);
            return color;
        },
   },
  mounted() {
      this.timeWeek = getWeekDay(this.chooseDate);
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

    handleMapData(){
          /*开始时间*/
          let _startTime = this.timeWeek[0];
          console.log(_startTime);
          this.contentForm.endDateFrom = _startTime;
          /*结束时间 多一天*/
          let _endTime = EcoDate.formatDateDefault(new Date( (EcoDate.convertDateFromString(this.timeWeek[6]).getTime()+24*60*60*1000)));

          this.contentForm.startDateTo = _endTime;
          this.loadedOrder = false;

          

          getGanttInfoAjax(this.contentForm).then(res=>{
                    this.meetingMap = {};
                    for(let i = 0;i<res.data.rows.length;i++){
                            if(!(this.meetingMap[res.data.rows[i].roomId])){
                                    this.$set(this.meetingMap,res.data.rows[i].roomId,{});
                            }

                            let _startTime = res.data.rows[i].startTime.substring(0,10);
                            if( !(this.meetingMap[res.data.rows[i].roomId][_startTime])){
                                    this.$set(this.meetingMap[res.data.rows[i].roomId],_startTime,[]);
                            }

                            this.meetingMap[res.data.rows[i].roomId][_startTime].push(res.data.rows[i]);
                            this.loadedOrder = true;
                            
                        }
                       
                }).catch(e=>{})
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
          this.timeWeek = getWeekDay(this.chooseDate);
          this.handleMapData();
     }
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
    width:12%;
}



.tableView .zbDiv .title{
    font-size: 28px;
    text-align: center;
    color:red;
    font-weight: 500;
}

.tableView .zbTable .zbItem{
    text-align: left;
    padding-left:5px;
    color:#4a4a4a;
    padding-bottom:5px;
    padding-top:5px;
    margin-bottom:5px;
}

.tableView .zbTable .zbItem1{
    margin-top:5px;
}

.tableView .zbTable .zbItem .desc{
    color:#347fb7;
}
</style>
