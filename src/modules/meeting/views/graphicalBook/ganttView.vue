<template>
  <div class="ganttView">
    <div
      class="gui-whole"
      v-if="contentType"
    >
      <div style="min-width:800px;">
        <div
          id="gui-bot"
          class="gui-bot"
        >
          <div class="gui-list clear">
            <div
              id="curr_date"
              class="fasten"
              style=" color: #1ba5fa; font-size: 14px;"
            ></div>
            <ul class="gui-table clear">
              <li
                :style="{width: 100/(config.e_time-config.s_time+1)+'%'}"
                v-for="(item, index) in (config.e_time-config.s_time+1)"
                :key="index"
              >
                <span><span v-if="config.s_time+index<10">0</span>{{config.s_time+index}}:00</span>
                <div class="gui-cle"></div>
                <div class="gui-lit"></div>
              </li>
            </ul>
          </div>
          <div
            style="margin-top: 2px;overflow:auto;"
            :style="{height:'700px'}"
          >
            <div id="gui-content">
              <div
                class="gui-content gui-list clear room-gui-list"
                v-for="room in roomList"
                :key="room.id"
              >
                <div
                  id="roomName"
                  class="fasten ellipsis"
                  :title="room.name"
                >{{room.name}}</div>
                <ul class="gui-tab">
                  <li
                    v-for="(o,index) in (config.e_time-config.s_time+1)"
                    :key="o"
                    :style="{width: 100/(config.e_time-config.s_time+1)+'%',cursor:'pointer'}"
                    @click="currentAction(room.name,index)"
                  ></li>
                </ul>
                <template v-if="map[room.id]">
                  <div
                    v-for="(item, index) in map[room.id]"
                    :key="index"
                    class="meet-item-one"
                    v-bind:class="[(item.statusDesc== '进行中')?'meet-color-having':'meet-color-finished']"
                    :title="item.ownerName+':'+item.name"
                    :style="{left:getLeftTime(item.startTime)+'%',width:getWidth(item)+'%'}"
                    v-show="getWidth(item)!=0"
                  >
                    <p
                      class="ellipsis"
                      @click="goMeetingDetail(item)"
                    >{{item.name}}:{{item.desc}}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {EcoDate} from '@/components/date/main.js'
import { getGanttInfoAjax,getRoomListAjax} from '@/modules/meeting/service/service.js'
export default {
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
      meetForm:{
        name:'',
        order:'desc',
        sort:'createDate',
        createDateFrom:'',
        createDateTo:''
      },
      itemsList: [],
      config: {
        s_time: 8,
        e_time: 18,
      },
      map: {},
      roomList: [],
      roomData: {},
      contentType: true,
      contentForm:{
        filterWfStatusAvailable:false,
        catId:'CONFERENCE'
     }
    }
  },
  mounted() {
    this.initModuleFunc();
  },
  methods: {

    initModuleFunc() {
      getRoomListAjax(this.meetForm).then(res=>{
        this.roomList=res.data.rows
      })
      // this.roomList.push({ id: '1', name: '大会议室' });
      // this.roomList.push({ id: '2', name: '小会议室' });
      // this.roomList.push({ id: '3', name: '中心会议室' });
      // this.roomList.push({ id: '4', name: '阶梯会议室' });
    },
    getLeftTime(cTime) {
      let dTime = new Date(cTime).getTime();
      let leftTime = new Date(this.chooseDate + ' ' + this.config.s_time + ':00:00').getTime();
      if (leftTime >= dTime) {
        return 12;
      } else {
        let time = (dTime - leftTime) / 1000;//秒数
        let bai = time / ((this.config.e_time - this.config.s_time + 1) * 60 * 60) * 100 * 0.88 + 12
        if (bai < 100) {
          return bai;
        } else {
          return 100
        }
      }
    },
    getWidth(item) {
      let _left1 = this.getLeftTime(item.startTime);
      let _left2 = this.getLeftTime(item.endTime);
      return _left2 - _left1
    },
    handleMapData(){
      getGanttInfoAjax(this.contentForm).then(res=>{
          console.log(res);
          // this.meetingData = res.data;
          // this.map = this.dataFactory4MeetingRoomMap(this.roomData,this.meetingData);
            }).catch(e=>{})
    },
    // 点击当前格子
    currentAction(name, index) {
      this.$router.push({ name: 'bookLaunch' })
    }
  },
}
</script>

<style scoped>
.ganttView .gui-whole {
  width: auto;
  /* border: 1px solid #e5e5e5; */
  font-family: "microsoft yahei";
  color: #333;
  padding-bottom: 12px;
  overflow: auto;
}
.ganttView .slideBox {
  width: 100%;
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
}

.ganttView .slideBox .bd {
  position: relative;
  height: 100%;
  z-index: 0;
  width: 90%;
  margin: auto;
  overflow: hidden;
}
.ganttView .bd ul {
  width: 7680px;
}
.ganttView .slideBox .bd li {
  zoom: 1;
  vertical-align: middle;
}

.ganttView .bd li {
  float: left;
}

.ganttView .bd li div {
  width: 14.28%;
  float: left;
  height: 59px;
  /* cursor: pointer; */
  text-align: center;
  border-bottom: solid 3px #1ba5fa;
  font-size: 12.6px;
}
.ganttView .bd li p:nth-child(1) {
  margin-top: 12px;
}

.ganttView .bd li p {
  line-height: 18px;
}

.ganttView .gui-list:first-child {
  background: #fff;
}
.ganttView .gui-list {
  position: relative;
}

.ganttView .room-gui-list {
  border-bottom: 1px solid #f5f5f5;
}

.ganttView .fasten {
  width: 12%;
  float: left;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 12px;
  color: #333;
}
.ganttView .gui-tab,
.gui-table {
}
.ganttView .gui-table,
.gui-tab {
  font-size: 12px;
  color: #333;
  margin: 0;
  width: 88%;
  float: right;
  white-space: nowrap;
  height: 60px;
}
.ganttView .gui-table li {
  position: relative;
  border-bottom: solid 1px #1ba5fa;
  z-index: 666;
}
.ganttView .gui-table li {
  cursor: default;
}

.ganttView .gui-table li,
.gui-tab li {
  float: left;
  text-align: left;
  width: 8.9%;
  height: 60px;
  line-height: 60px;
  /* cursor: pointer; */
}
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

.ganttView .meet-item-one {
  color: #000;
  text-align: center;
  position: absolute;
  height: 58px;
  left: 12%;
  top: 1px;
  color: #fafafa;
  font: 14px/60px microsoft yahei;
  padding: 0 5px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  width: 20%;
}

.ganttView .meet-color-finished {
  background: #4dc394;
}

.ganttView .meet-color-having {
  background: #eb865e;
}
</style>
