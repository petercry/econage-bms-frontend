<template>
  <div class="pcChart">
    <div style="padding:12px 24px 8px;" >
        <el-row >
            <el-col :span="5" class="headerLeft" >
                  <el-row>
                      <el-col :span="12" style="text-align:right;padding-right:10px;">
                            <span class="itemTime">{{timeStr}}</span>
                      </el-col>
                      <el-col :span="12" style="text-align:left;padding-top:8px">
                          <div class="itemDate">{{dateStr}}</div>
                          <div class="itemDate">{{weekStr}}</div>
                      </el-col>
                  </el-row>
            </el-col>

            <el-col :span="14">
                <div class="header" style="margin-bottom:0;">
                    <div class="title-border-left hidden-sm-and-down"></div>
                    <div class="title-border-right hidden-sm-and-down"></div>
                    <div class="title">
                      山东德州市场监管平台
                    </div>
                </div>
            </el-col>

            <el-col  :span="5" style="text-align:right;height:30px;">
                &nbsp;
            </el-col>
        </el-row>
    </div>

    <div class="pageMain">
      <el-row style="height:100%">

          <el-col :span="6" style="height:100%">
              <div class="chartDiv1">
                  <chart1 ref="chart1"></chart1>
              </div>
              <div class="chartDiv2">
                 <chart2 ref="chart2"></chart2>
              </div>
              <div class="chartDiv3">
                <chart3 ref="chart3"></chart3> 
              </div>
        </el-col>

        <el-col :span="12" style="height:100%;">
            <div class="chartDiv4">
                <map1 class="hasAngle" ref="map1"></map1>
            </div>

            <div class="chartDiv5">
                <el-row style="height:100%;" >
                  <el-col :span="12" style="height:100%;padding:0px 5px 0px 10px">
                      <chart5 ref="chart5"></chart5> 
                  </el-col>
                  <el-col :span="12" style="height:100%;padding:0px 10px 0px 5px">
                      <chart6 ref="chart6"></chart6> 
                  </el-col>
                </el-row>
            </div>
          
        </el-col>

        <el-col :span="6" style="height:100%;">
            <div class="chartDiv6">
                 <chart7 ref="chart7"></chart7> 
            </div>
            <div class="chartDiv7">
                 <chart8 ref="chart8"></chart8> 
            </div>
    
        </el-col>
      </el-row>

    </div>
    <img class="bgImg" src="@/modules/count/assets/img/bg.jpg">
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css';


import {mapState,mapMutations} from 'vuex'
import chart1 from './charts/chart1.vue'
import chart2 from './charts/chart2.vue'
import chart3 from './charts/chart3.vue'
import chart4 from './charts/chart4.vue'
import chart5 from './charts/chart5.vue'
import chart6 from './charts/chart6.vue'
import chart7 from './charts/chart7.vue'
import chart8 from './charts/chart8.vue'
import map1 from './charts/map1.vue'

import {EcoDate} from '@/components/date/main.js'
export default{
  name:'home',
  components:{
      chart1,
      chart2,
      chart3,
      chart4,
      chart5,
      chart6,
      chart7,
      chart8,
      map1,
  },
  computed:{
      ...mapState(['sysWidth'])
  },
  data(){
    return {
        date:new Date(),

        timeStr:null,
        weekStr:null,
        dateStr:null,
    }
  },
  mounted(){
        var _this = this; //声明一个变量指向vue实例this,保证作用域一致
        this.timer = setInterval(function() {
              _this.date = new Date();//修改数据date
              let _obj = EcoDate.formatDateCNObj(_this.date);
              
              _this.dateStr = _obj.dateStr;
              _this.weekStr = _obj.weekStr;
              _this.timeStr = _obj.timeStr;
              
        }, 1000);
  },
  methods: {
  },
  beforeDestroy () {
        if(this.timer) {
              clearInterval(this.timer);//在vue实例销毁钱，清除我们的定时器
        }
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



.pcChart .headerLeft{
  height:30px;
  color:#fff;
  text-align: center;
}

.pcChart .itemTime{
    font-size: 35px;
}

.pcChart .itemDate{
    margin-left:10px;
    font-size: 14px;
    line-height: 20px;
} 

.pageMain{
    position:absolute;
    left:0px;
    right:0px;
    bottom:0px;
    top:60px;
}

.pageMain .chartDiv{
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqAAAAGQCAYAAABxrtL1AAAJaklEQVR4nO3dMW5jZQCF0VnDNLT0LIFl0NBR0NNSjZgGzaaA0RSsKyiFJcvYjpNMvhtNTnH03v8Qz3Z39QWJd5++3N0V3n/8/AEAgNer2oXvqg/66be/fgQA4PXKB+j6BwMA8G27OEDv8+v6ywEA8G043pYKKAAAqScN0J9//+eHw/UpTt9x+l5nZ2dnZ2dnZ+f+fLi/vz7F8XuvefQAfeoXAgDgbfhqA/Qlvtwvf/z7/em9q6urq6urq6tre7307LmeNUDPvfD+ywEA8O14zsZ7zAh9cIAangAAPMZDI/TqADU+AQB4imsj9OYBeunlv/7593cAALxtD43QmwboQ/Xz9APdu3fv3r179+7duz92qYLeVEBPX/bQhx/z3HPPPffcc8899/ztPL82Qh9VQM8N0EtfAACAt+l4J14an08aoOsfBgDA63apgB6GqAEKAMBX8yJ/gj+8eP3jAAB4nV5kgAIAwKnT/wZUAQUAIKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJm4eoO8/fv5w/P/oVEABAHiMWwvovfvt+agBaogCAHDJiwxQAAA4pYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATCigAAAkFFACACQUUAICEAgoAwIQCCgBAQgEFAGBCAQUAIKGAAgAwoYACAJBQQAEAmFBAAQBIKKAAAEwooAAAJBRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACChgAIAMKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJhRQAAASCigAABMKKAAACQUUAIAJBRQAgIQCCgDAhAIKAEBCAQUAYEIBBQAgoYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATCigAAAkFFACACQUUAICEAgoAwIQCCgBAQgEFAGBCAQUAIKGAAgAwoYACAJBQQAEAmFBAAQBIKKAAAEwooAAAJBRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACChgAIAMKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJhRQAAASCigAABMKKAAACQUUAIAJBRQAgIQCCgDAhAIKAEBCAQUAYEIBBQAgoYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATCigAAAkFFACACQUUAICEAgoAwIQCCgBAQgEFAGBCAQUAIKGAAgAwoYACAJBQQAEAmFBAAQBIKKAAAEwooAAAJBRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACChgAIAMKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJhRQAAASCigAABMKKAAACQUUAIAJBRQAgIQCCgDAhAIKAEBCAQUAYEIBBQAgoYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATCigAAAkFFACACQUUAICEAgoAwIQCCgBAQgEFAGBCAQUAIKGAAgAwoYACAJBQQAEAmFBAAQBIKKAAAEwooAAAJBRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACChgAIAMKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJhRQAAASCigAABMKKAAACQUUAIAJBRQAgIQCCgDAhAIKAEBCAQUAYEIBBQAgoYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATCigAAAkFFACACQUUAICEAgoAwIQCCgBAQgEFAGBCAQUAIKGAAgAwoYACAJBQQAEAmFBAAQBIKKAAAEwooAAAJBRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACChgAIAMKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJhRQAAASCigAABMKKAAACQUUAIAJBRQAgIQCCgDAhAIKAEBCAQUAYEIBBQAgoYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATCigAAAkFFACACQUUAICEAgoAwIQCCgBAQgEFAGBCAQUAIKGAAgAwoYACAJBQQAEAmFBAAQBIKKAAAEwooAAAJBRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACChgAIAMKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJhRQAAASCigAABMKKAAACQUUAIAJBRQAgIQCCgDAhAIKAEBCAQUAYEIBBQAgoYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATCigAAAkFFACACQUUAICEAgoAwIQCCgBAQgEFAGBCAQUAIKGAAgAwoYACAJBQQAEAmFBAAQBIKKAAAEwooAAAJBRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACChgAIAMKGAAgCQUEABAJhQQAEASCigAABMKKAAACQUUAAAJhRQAAASCigAABMKKAAACQUUAIAJBRQAgIQCCgDAhAIKAEBCAQUAYEIBBQAgoYACADChgAIAkFBAAQCYUEABAEgooAAATCigAAAkFFAAACYUUAAAEgooAAATNw/QT1/u7u4poAAAPMWtBfSwOx81QA1RAAAueZEBCgAApxRQAAAmFFAAABIKKAAAEwooAAAJBRQAgAkFFACAhAIKAMCEAgoAQEIBBQBgQgEFACDxYgXUEAUA4JLTzfhVC6gRCgDAwa318+oAfaiCHn8QAABv17nx+ewCeunP8Oc+zNnZ2dnZ2dnZ+e2cT//ZwemWvLmAGqLOzs7Ozs7Ozs63ng8Om/HZf4K/Nj4BAODgWv28qYCeG6LHq3b9AwEAeB3ObcYnDdDDv3TphQAAcM65sHlzATVEAQC41fF2fNYAPR2hxigAAPfO7cRrHjVAAQDguf43QF/a+gcDAHBdtQuzAfr+4+cPAAC8XtUu/A/2FYHiJQR2qgAAAABJRU5ErkJggg==) no-repeat 50%;
  background-size: 100% 95%;
 
}


.pageMain .chartDiv1{
    height:31%;
    margin-top:10px;
}

.pageMain .chartDiv2{
    height:31%;
    margin-top:10px;
}

.pageMain .chartDiv3{
    height:31%;
    margin-top:10px;
}

.pageMain .chartDiv4{
    height:62%;
    margin-top:10px;
    margin-bottom:15px;
    padding-left:10px;
    padding-top:5px;
    padding-right:10px;
   
}

.pageMain .chartDiv5{
    height:31%;
}

.pageMain .chartDiv6{
    height:46%;
    margin-top:8px;
}

.pageMain .chartDiv7{
    height:48%;
    margin-top:17px;
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
