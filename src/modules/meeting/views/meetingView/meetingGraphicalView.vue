<template>
  <div class="ganttView">

      <div class="oneTableFix">
          <div class="oneRowFix">
                    <span class="oneHeadTitle"></span>
                    <span class="oneHeadSpan" v-for="i in 11" :key="i">
                        <i>{{i+7}}时</i>
                        <div class="gui-cle"></div>
                        <div class="gui-lit"></div>
                    </span>
          </div>
      </div>

      <div class="oneTable">
            <div class="oneRow">
                  <span class="oneHeadTitle"></span>
                  <span class="oneHeadSpan" v-for="i in 11" :key="i">
                    <i>{{i+7}}时</i>
                  </span>
            </div>

            <div class="oneRow" v-for="item in roomList" :key="item.id">
                      <span class="oneTitle"><i>{{item.name}}</i></span>
                      <span class="oneSpan" v-for="i in 11" :key="i" @click="addMeeting(item,i)">&nbsp;</span>
                      <template v-if="meetingMap[item.id]">
                          <span class="orderItem"  v-for="(orderItem, colIndex) in meetingMap[item.id]" :key="orderItem.id" 
                                @click="goMeetingViewPage(orderItem)"
                                v-if="loadedOrder"
                                v-bind:class="{'color-approval':orderItem.status == 'APPROVING',colorObj}"
                                :style="{left:getResLeftTime(orderItem.startTime)+'%',width:getReservationWidth(orderItem)+'% !important'}"
                              >
                                <i class="top-clu"></i>
                                <span class="ellipsis" style="margin-left:5px;">{{orderItem.startTime.substring(11)}} - {{orderItem.endTime.substring(11)}}</span>
                                <p style="margin-left:5px;">{{orderItem.name}}</p>
                            </span>
                      </template>
            </div>

            <div class="oneCol" v-for="i in 11" :key="i" :style="{left:(roomColWidth+(i-1)*resColWidth)+'%'}"></div>

      </div>


  </div>
</template>

<script>
import {EcoDate} from '@/components/date/main.js'
import {getGanttInfoAjax,getRoomListAjax,getRoleBtnSetting} from '@/modules/meeting/service/service.js'
import {sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'


export default {
  components:{
         
    }, 
  name: 'ganttView',
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
      config: {
          s_time: 8,
          e_time: 18,
      },
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
      roomColWidth:12,
      resColWidth:8,
      btnRoleMap:{}
    }
  },
   computed:{
       colorObj: function () {
            let color = 'color-'+(( (Math.floor(Math.random() * (1 - 1)) + 1)   % 1)+1);
            return color;
        }
   },

    created(){
        this.initModuleFunc();
        this.handleMapData();
        this.getRoleBtnSetting();
        this.listAction();
        window.meetingGraphicalViewVm = this;
    },

  mounted() {
      this.initModuleFunc();
      this.handleMapData();

  },
  methods: {

        listAction(){
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'updateMeetingAddBack'){
                    window.meetingGraphicalViewVm.handleMapData();
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'meetingGraphicalViewVm');
        },

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
            let _startTime = (this.chooseDate?this.chooseDate:EcoDate.formatDateDefault(new Date()));
            this.contentForm.endDateFrom = _startTime;
            /*结束时间 多一天*/
            let _endTime = EcoDate.formatDateDefault(new Date( (EcoDate.convertDateFromString(_startTime).getTime()+24*60*60*1000)));
            this.contentForm.startDateTo = _endTime;
            this.loadedOrder = false;

            getGanttInfoAjax(this.contentForm).then(res=>{
                this.meetingMap = {};
                for(let i = 0;i<res.data.rows.length;i++){
                        if(this.meetingMap[res.data.rows[i].roomId]){

                        }else{
                            this.$set(this.meetingMap,res.data.rows[i].roomId,[]);
                        }
                        this.meetingMap[res.data.rows[i].roomId].push(res.data.rows[i]);
                        this.loadedOrder = true;
                    }
            }).catch(e=>{})
        },


      getResLeftTime(cTime){
              let startLong = EcoDate.convertDateTimeFromString(cTime+":00").getTime();
              let leftLong  = EcoDate.convertDateTimeFromString(this.chooseDate + ' ' + this.config.s_time + ':00:00').getTime();
              if (leftLong>=startLong){
                    return this.roomColWidth;
              }else{
                    let time = (startLong-leftLong)/(1000*60);//分
                    return  (time*(this.resColWidth/60))+this.roomColWidth ;
              }
        },

        getReservationWidth(item){
            let _left1 = this.getResLeftTime(item.startTime);
            let _left2 = this.getResLeftTime(item.endTime);

            let _width = _left2 - _left1;
            if(_width+_left1 <= 100){
                return _width;
            }else{
              return 100-_left1;
            }
        },

        addMeeting(item,idx){
            if(this.btnRoleMap['oa.conference_graphical_CREATE_Conference']){
                if(sysEnv == 1){
                        let _storeObj = {};
                        _storeObj.key = EcoUtil.getUID();
                        _storeObj.data = {};
                        _storeObj.data.roomName = item.name;
                        _storeObj.data.roomId = item.id;
                        _storeObj.data.startTime = this.chooseDate+" "+((idx+7)>=10?(idx+7):'0'+(idx+7))+":00";
                        _storeObj.data.endTime = this.chooseDate+" "+((idx+8)>=10?(idx+8):'0'+(idx+8))+":00";
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
          this.handleMapData();
     }
  },
  


}
</script>

<style scoped>
.ganttView .gui-cle {
    position: absolute;
    left: -5px;
    bottom: -5px;
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    border: solid 2px #1ba5fa;
    z-index: 666;
}

.ganttView .gui-lit {
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 3px;
    height: 3px;
    background: #fff;
    border-radius: 50%;
    border: solid 1px #1ba5fa;
    margin-left: 50%;
    z-index: 666;
}

.ganttView .clear {
  *zoom: 1;
}

.ganttView .clear:after {
  content: ".";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
  font-size: 0;
}

.ganttView .meet-color-finished {
  background: #64ae3c;
}
.ganttView .meet-color-having {
  background: #eb865e;
}

.ganttView .oneTableFix{
    display:table;
    width:calc(100% - 93px);
    position: fixed;
    left:39px;
    right:39px;
    background-color: #fff;
    z-index: 99;
}

.ganttView .oneRowFix{
    position: relative;
    border-bottom:1px solid #dedede;
    display:table-row;
}

.ganttView .oneTable{
    display:table;
    width:100%;
    position: relative;
}

.ganttView .oneRow{
    position: relative;
    border-bottom:1px solid #dedede;
    display:table-row;
}

.ganttView .oneCol{
    position:absolute;
    top:0px;
    bottom: 0px;
    width:1px;
    border-left: 1px solid #ededed;
}

.ganttView .oneHeadTitle{
    height: 40px;
    line-height:40px;
    display: table-cell;
    width:12%;
    font-size: 14px;
    color:#9c9c9c;
}

.ganttView .oneHeadSpan{
    height: 40px;
    line-height:40px;
    display: table-cell;
    width:8%;
    font-size: 12px;
    color:#000;
    position: relative;
    border-bottom:1px solid #1ba5fa;
}


.ganttView .oneTitle{
    height: 50px;
    line-height:20px;
    width:12%;
    border-bottom:1px solid #ededed;
    font-size: 12px;
    display:table-cell;
    color:#4a4a4a;
    vertical-align: middle;
}

.ganttView .oneTitle i{
    margin-left:10px;
}

.ganttView .oneSpan{
    height: 50px;
    line-height:20px;
    width:8%;
    border-bottom:1px solid #ededed;
    display:table-cell;
}



.ganttView .orderItem{
    position:absolute;
    height:50px;
    background-color: #e3fcd2;
    line-height: 20px;
    font-size: 12px;
}
</style>
