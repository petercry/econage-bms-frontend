<template>
  <div class="listView">
    <el-table
      border
      :data="roomList"
      height="100%"
      style="width: 100%"
      :header-cell-style="{textAlign:'center',backgroundColor:'#f1f9ff',color:'#000'}"
    >
      <el-table-column
       fixed
        prop="room"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-for="(i,idx) in timeList"
        :key="i"
        :render-header="renderHeader"
      >
        <template slot-scope="scope">
          <div
            v-for="(arr,rowIndex) in map[idx]"
            :key="rowIndex"
          >
            <div
              v-for="(item, index) in arr"
              :key="index"
            >
              {{item.name}}
            </div>
          </div>
      </template>
</el-table-column>
</el-table>
</div>
</template>
<script>
import { formatDate,getWeekDay } from '@/modules/meeting/utils/date.js'
export default {
  name: 'listView',
  props:{
    dateTime:{
      type:String,
      default:new Date()
    }
  },
  data() {
    return {
      roomList: [
        {
          room: '集团总部第一会议室',
          arrange: '111122',
        },
        {
          room: '集团总部第二会议室'
        },
        {
          room: '大王工厂第一会议室'
        },
        {
          room: '集团总部第二会议室'
        },
        {
          room: '大王工厂第一会议室'
        },
      ],
      timeList: [],
      weekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      map: [
        // 星期一
        [
          [{ name: '223' }, { name: '333' }, { name: '测试安排' }]
        ],
        // 星期二
        [
         [{ name: '222453' }, { name: '367' }]
        ],
      ],
    }
  },
  created() {
    this.timeList = getWeekDay(this.dateTime);
  },
  methods: {
    renderHeader(createElement, { column, $index }) {
      return createElement('div', {
        attrs: {
          class: 'cell',
        },
        domProps: {
          innerHTML: `${this.timeList[$index - 1]}</br>${this.weekList[$index - 1]}`
        }
      })
    }
  },
  watch:{
    'dateTime'(newVal){
      this.timeList=getWeekDay(newVal);
    }
  }
}
</script>

<style >
.listView {
  width: 100%;
  height: 100%;
}
.listView .el-table{
  cursor: pointer;
}
</style>
