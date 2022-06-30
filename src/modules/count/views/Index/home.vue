<template>
  <div class="pcChart">
    <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
    <div style="padding:12px 24px 8px;background-color: rgba(35,115,210,0.3);">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="6" style="line-height:1px;">
          &nbsp;
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="12">
          <div class="header" style="margin-bottom:0;">
            <div class="title-border-left hidden-sm-and-down"></div>
            <div class="title-border-right hidden-sm-and-down"></div>
            <div class="title">
              2020年出国统计
              <!-- <img src="@/modules/8List/assets/img/title.png"/> -->
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="6" style="text-align:right;">
          &nbsp;
        </el-col>
      </el-row>
      <div class="countHeader" style="margin:20px 0;">
        <div class="countItem"><p class="title">团组个数</p><p class="l2"><span class="num">124</span></p></div>
        <div class="countItem"><p class="title">总人次</p><p class="l2"><span class="num">2907</span></p></div>
        <div class="countItem"><p class="title">出访国家个数</p><p class="l2"><span class="num">26</span></p></div>
        <!-- <div class="countItem"><p class="title">今日</p><p class="l2 orange"><span class="num">26</span>件</p></div> -->
      </div>
    </div>
    <div class="pageMain">
      <!-- <div class="chartBox"></div> -->
      <el-row :gutter="12">
        <el-col :sm="24" :md="24" :lg="6" :xl="6">
          <chart1 ref="chart1"></chart1>
          <chart2 ref="chart2"></chart2>
        </el-col>
        <el-col :sm="24" :md="24" :lg="12" :xl="12">
          <map1 class="hasAngle" ref="map1"></map1>
        </el-col>
        <el-col :sm="24" :md="24" :lg="6" :xl="6">
          <chart3 ref="chart3"></chart3>
          <chart4 ref="chart4"></chart4>
        </el-col>
      </el-row>
    </div>
    <img class="bgImg" src="@/modules/count/assets/img/bg.jpg">
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css';
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {} from '@/modules/count/service/service.js'
import {mapState,mapMutations} from 'vuex'
import chart1 from './charts/chart1.vue'
import chart2 from './charts/chart2.vue'
import chart3 from './charts/chart3.vue'
import chart4 from './charts/chart4.vue'
import map1 from './charts/map1.vue'
export default{
  name:'home',
  components:{
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    chart1,
    chart2,
    chart3,
    chart4,
    map1,
  },
  computed:{
      ...mapState(['sysWidth'])
  },
  data(){
    return {
    }
  },
  mounted(){
    
  },
  methods: {
  },
  watch: {
  }
}
</script>
<style>
.pcChart .chartBox{
  margin-bottom: 0;
}
.pcChart .chartBox-header{
  line-height: 42px;
  font-size: 16px;
}
.colTitle{
  color: #fff;
  font-size: 20px;
  line-height: 42px;
  text-align: center;
  font-weight: bold;
}
.header{
  position: relative;
}
.title-border-right{
    width: 240px;
    height: 30px;
    overflow: hidden;
    right: 0;
    left: 580px;
    margin: auto;
    position: absolute;
    background: url(../../assets/img/title-border.png) center center / 100% 100% no-repeat;
}
.title-border-left{
    width: 240px;
    height: 30px;
    overflow: hidden;
    left: 0;
    right: 580px;
    margin: auto;
    position: absolute;
    background: url(../../assets/img/title-border.png) center center / 100% 100% no-repeat;
    transform: rotateY(180deg);
}
.header .title{
  left: 0;
  right: 0;
  line-height: 30px;
  /* position: absolute; */
  color: rgb(204,255,255);
  text-align: center;
  font-size: 19pt;
  color: #9FC4F1;
}
.selectTheme1{
  color: #fff;
  background-color: transparent;
}
.selectTheme1 .el-input-group__prepend{
  background-color: #184684;
  color: #fff;
  border-color:#2D5486;
}
.selectTheme1 .el-input__inner{
  background-color: #153D73;
  border-color:#2D5486;
  color: #fff;
}
.selectTheme1.el-button,.selectTheme1.el-button:focus, .selectTheme1.el-button:hover {
  color: #fff;
  background-color: transparent;
}

.chartBox{
  position: relative;
  /* background-color: rgba(15, 22, 40, 0.25); */
  background:url('../../assets/img/itemBg.png');
  /* color:#67A0E5; */
  color:#fff;
  padding: 0 12px;
  padding-bottom: 12px;
  margin-bottom: 0;
}
.chartBox-header{
  line-height: 48px;
  font-size: 16px;
}
.chartTheme.red{
  background-color: #C4333A!important;
}
.chartTheme.green{
  background-color: #30B7BC!important;
}
.chartTheme.yellow{
  background-color: #FCB154!important;
}
.hasAngle{
  position: relative;
}
.hasAngle .angle1::before{
  content: '';
  position: absolute;
  background:url('../../assets/img/left-top.png')no-repeat;
  left: 0;
  top: 0;
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
}
.hasAngle .angle1::after{
  content: '';
  position: absolute;
  background:url('../../assets/img/right-top.png')no-repeat;
  right: 0;
  top: 0;
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
}
.hasAngle .angle2::before{
  content: '';
  position: absolute;
  background:url('../../assets/img/right-bottom.png')no-repeat;
  right: 0;
  bottom: 0;
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
}
.hasAngle .angle2::after{
  content: '';
  position: absolute;
  background:url('../../assets/img/left-bottom.png')no-repeat;
  left: 0;
  bottom: 0;
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
}

.countHeader {
  display: flex;
  flex:1;
  justify-content: space-between;
  align-items: center;
}

.countItem{
  text-align: center;
  color: #000;
  line-height: 20px;
  /* background-color: #199ED8; */
  background-image: url('../../assets/img/count.png');
  background-size: 100% 100%;
  font-size: 14px;
  padding: 4px 18px;
}
.countItem .title{
  color: #fff;
  font-size: 16px;
  line-height: 22px;
}
.countItem .l2{
  font-size: 12px;
  color: #fff;
}
.countItem .l2 .num{
  line-height: 30px;
  color:#01ECE7;
  text-shadow: 0px 0px 2px #fff;
  font-size: 22px;
}
.countItem .l2.orange .num{
  color:#CE8814;
}
</style>
<style scoped>
.pageMain{
  padding: 6px 24px;
  /* background-color: #1A3C72 ; */
}
.userItem{
  cursor: pointer;
  line-height:20px;
  text-align: center;
  padding: 12px 0;
}
.userItem.active{
  color: #66b1ff;
}
.webDrawer{
  z-index: 9999999 !important;
}
</style>
