<template>
  <ecoContent top="0" bottom="0" class="container layout">
    <mainTab></mainTab>
    <ecoContent class="layout" top="48px" bottom="0" style="padding:0 30px 20px;backgrou">
      <el-card style="height: 100%;overflow:auto" :body-style="{padding:'36px 40px'}">
        <el-row :gutter="40">
          <el-col v-for="(item, index) in appList" :key="item.id" :sm="8" :md="6" :lg="6">
            <el-card class="chooseItem" shadow="none" :body-style="{padding:'12px'}" @click.native="itemClick(item)">
              <div class="wrap">
                <div class="iconCircle bgTheme"><i class="el-icon-edit"></i></div>
                <div class="text"><div class="ellipsis2">{{item.name}}</div></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </ecoContent>
  </ecoContent>
</template>
<script>
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {mapMutations} from 'vuex'
  import mainTab from './components/mainTab.vue'
  import {getAppList,getOauth2Url} from '@/modules/portal1/service/service.js'
  export default{
      name:'appList',
      components: {
        mainTab,
        ecoContent
      },
      data() {
        return {
          appList:[]
        }
      },
      created(){
        this.getAppList();
      },
      methods: {
        getAppList(){
          getAppList().then(res=>{
            this.appList = res.data;
          }).catch(e=>{})
        },
        itemClick(item){
          getOauth2Url(item.id).then(res=>{
            window.open(res.data)
          }).catch(e=>{})
        }
      }
  }
</script>
<style scoped>
.chooseItem{
  margin-bottom: 32px;
  cursor: pointer;
}
.chooseItem .wrap{
  display: flex;
}
.chooseItem .wrap .iconCircle{
  flex-basis: 36px;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  border-radius: 18px;
}
.chooseItem .wrap .text{
  height: 100%;
  /* display: flex; */
  /* justify-content: space-between; */
  flex: 1;
  padding-left: 10px;
  line-height: 24px;
  max-height: 48px;
}
</style>
