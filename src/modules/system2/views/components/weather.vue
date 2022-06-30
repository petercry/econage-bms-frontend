<template>
  <div class="weather-box">
      <div class="city">{{city}}</div>
      <i class="icon iconfont" :class="classType"></i>
      <div class="num">{{temperatureScope}}<span></span></div>
      <div class="status">{{weatherType}}</div>
      <div class="cloud" ><span v-if="windInfo">{{windInfo.dir || '未知'}} {{windInfo.lv.replace(/^\<!\[CDATA\[/g,'').replace(/\]\]\>/g,'') || '未知'}}</span></div>
      <iframe name="weatherFrame" :src='weatherIframe' style="display:none"></iframe>
  </div>
</template>

<script>
  import {sysEnv} from '@/modules/system/config/env.js'
  import {getWeatherByCityCode,getAllCity,getCurrentPositionByIp} from "@/modules/system/service/service.js";
  import {weatherType2Icon} from "@/modules/system/assets/js/weathertype2icon";
  import axios from 'axios'

  export default {
      components:{

      },
      data(){
          return{
              cityWeather:{},
              isFah:false,
              city:'',
              weatherIframe:''
          }
      },
      computed: {
        // 今天的最高温和最低温
         temperatureScope() {

              if (!this.cityWeather.forecast) return;
              // 提取数字
              let highTmp = this.cityWeather.forecast[0].high.match(/[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0];
              let lowTmp  = this.cityWeather.forecast[0].low.match(/[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0];
              if (this.isFah) {
                  highTmp = highTmp * 9 / 5 + 32;
                  lowTmp = lowTmp * 9 / 5 + 32;
                  return `${lowTmp}~${highTmp}°F`;
              }
              return `${lowTmp}~${highTmp}°C`;
         },
         // 根据天气类型设置天气图标
         classType() {
           if (!this.cityWeather.forecast) return;
           return weatherType2Icon(this.cityWeather.forecast[0].type);
         },
         // 天气类型
         weatherType() {
           if (!this.cityWeather.forecast) return;
                return this.cityWeather.forecast[0].type;
         },
         // 风向风力
         windInfo() {
           if (!this.cityWeather.forecast) return false;
            let obj = {};
            obj.lv = this.cityWeather.forecast[0].fengli;
            obj.dir = this.cityWeather.forecast[0].fengxiang;
            return obj;
         }
      },
      created(){
      },
      mounted(){
            window.weatherVm = this;
            if(sysEnv == 1){
                this.weatherIframe = '/wh/jsp/version3/system/weather.jsp';
            }else{
                this.weatherIframe = 'about:blank';                
            }

        //    this.getData('杭州');
      },
      methods: {
          getData(cityNameByIp){
              let that = this;
              axios.all([getAllCity()]).then(axios.spread(function(city){
                      let citys = city.data;
                      let weatherData = '';
                      citys.zone.forEach(province => {
                            province.zone.forEach(city => {
                                city.zone.forEach(area => {
                                    // let cityNameByJson = area.name.match(cityNameByIp);
                                    if (cityNameByIp.includes(area.name)) {
                                         that.city = area.name;
                                        // 根据城市代码获取天气信息
                                          getWeatherByCityCode(area.code).then(response => {
                                                that.cityWeather = response.data.data;
                                          });
                                    }
                                });
                            });
                        })
                }));
          }

      },
      watch:{

      }

  }

</script>
<style scoped>
.weather-box{
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    /* background-image: linear-gradient(to bottom,#1ba5fa 0%, #1bcdfa 100%); */
    overflow: hidden;
}
.weather-box .city{
    padding: 12px 0 8px 12px;
    font-size: 12px;
    text-align: left;
}
.weather-box .icon{
    font-size: 60px;
    height: 60px;
    line-height: 60px;
    margin-bottom: 14px;
}
.weather-box .num{
    font-size: 20px;
    line-height: 32px;
    margin-bottom: 16px;
}
.weather-box .num span{
    font-size: 16px;
    line-height: 16px;
    vertical-align: top;
}
.weather-box .status{
    font-size: 12px;
    margin-bottom: 10px;
}
.weather-box .cloud{
    font-size: 12px;
}
</style>
