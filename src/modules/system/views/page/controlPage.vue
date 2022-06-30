<template>
  <div  class="controlPage">
        <el-row class="controlDiv" :gutter=20>

            <el-col :span="6" style="width:20%" v-for="(item,idx) in dataList" :key="idx">
                <el-card shadow="hover" class="controlCard"
                    @click.native="goDetail(item)"
                    @mouseenter.native="enterCard(item.id)"
                    @mouseleave.native="outCard((item.id))"
                >
                    <div>
                        <div class="controlImg"><img class="logo" src="../../assets/img/control/entrance.png" /></div>
                        <div class="controlName">{{item.name}}</div>
                        <div class="controlGo"><span v-html="'&nbsp;'"></span><span class="enterDesc" v-show="dataMap[item.id]">进入</span><span v-html="'&nbsp;'"></span></div>
                    </div>

                </el-card>
            </el-col>

        </el-row>
  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {goEESSO,getControlPageList} from'../../service/service'


export default {
  name:'mainPage',
  components: {

  },
  data() {
    return {
        dataList:[],
        dataMap:{},

    };
  },
  created() {
        this.init();
  },
  mounted() {},
  methods: {

      init(){
          getControlPageList().then((response)=>{
                let _dataMap = {};
                if(window.controlPageMap){
                    _dataMap = window.controlPageMap;
                }
                let _dataList = [];
                for(let i = 0;i<response.data.length;i++){
                    let _item = response.data[i];
                    _item.name = _dataMap[_item.id];
                    _dataList.push(_item);
                }
                this.dataList = _dataList;
          })

          for(let i = 0;i<this.dataList.length;i++){
                this.$set(this.dataMap,this.dataList[i].eeTarget,false);
          }
      },

      goDetail(item){
            window.open(item.url);
      },

      enterCard(eeTarget){
          this.$set(this.dataMap,eeTarget,true);
      },

      outCard(eeTarget){
          this.$set(this.dataMap,eeTarget,false);
      }

  },

  destroyed() {}
};
</script>



<style scpoe>
.controlPage{
    padding:20px 20px 0;
    position: absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    overflow: auto;
    background-color: #fafafa;
    font-size: 14px;
    background: url('../../assets/img/control/controlBg.jpg');
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
}

.controlPage .controlDiv{

}

.controlPage .controlCard{
  cursor: pointer;
  text-align: center;
  padding-top:20px;
  padding-bottom:20px;
}

.controlPage .controlCard .controlImg{
  margin-bottom:20px;
}

.controlPage .controlCard .controlName{
  color: #000;
  margin-bottom:10px;
}

.controlPage .controlCard .enterDesc{
    color: #409eff;
}

</style>
