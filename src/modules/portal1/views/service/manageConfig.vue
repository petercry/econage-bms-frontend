<template>
  <ecoContent top="0" bottom="0" class="container layout">
    <mainTab></mainTab>
    <ecoContent class="layout" top="48px" bottom="0" style="padding:0 30px 20px;backgrou">
      <el-card style="height: 100%;overflow:auto" :body-style="{padding:'36px 40px'}">
        <el-row :gutter="40">
          <el-col v-for="item in operateList" :key="item.key" :sm="8" :md="6" :lg="6">
            <el-card class="chooseItem" @click.native="goPage(item)" shadow="none" :body-style="{padding:'12px'}">
              <div class="wrap">
                <div class="iconCircle bgTheme"><i class="el-icon-edit"></i></div>
                <div class="text"><div class="ellipsis2">{{item.label}}</div></div>
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
  export default{
      name:'manageConfig',
      components: {
        mainTab,
        ecoContent
      },
      data() {
        return {
         operateList:[
           {
             key:'appManage',
             label:'应用系统管理',
             func:this.goAppManage
           },
           {
             key:'groupManage',
             label:'事项分类管理',
             func:this.goGroupManage
           },
           {
             key:'subjectManage',
             label:'事项管理',
             func:this.goSubjectManage
           }, 
           {
             key:'dingManage',
             label:'钉钉同步',
             func:this.goDingManage
           }
         ]
        }
      },
      created(){
      },
      methods: {
        ...mapMutations(['ADD_BREAD']),
        goPage(item){
          let key = item.key;
          // if (key=='groupManage'||key=='subjectManage'){
            this.ADD_BREAD({
              label:item.label,
              to:{
                name:key
              }
            })
            this.$router.push({
              name:key
            })
          // }
        },
        // goAppManage(){
        //   console.log(1)
        // },
        // goGroupManage(){
        //   console.log(2)
        // },
        // goSubjectManage(){
        //   console.log(3)
        // },
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
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  line-height: 24px;
  max-height: 48px;
}
</style>
