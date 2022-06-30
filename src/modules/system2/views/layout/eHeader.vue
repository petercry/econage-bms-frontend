<template>
<!-- :style="{backgroundColor:toggleFlag?'#fff':'#5373C8',color:toggleFlag?'#333':'#fff'}" -->
  <header class="main-header">
      <div class="leftControl">
          <i class="icon iconfont icon-sidebar-toggle"  @click="toggleLeftMenu"></i>
      </div>
      <span class="logoDesc" style="color:#5373c8;position: relative;top: -4px;" v-if="!toggleFlag" @click="toIndex">机关内部最多跑一次</span>
      <headerRight ref="headerRight"></headerRight>
  </header>
</template>
<script>

  import {getTopMenuTreeViewAjax} from '@/modules/system2/service/service.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {mapState,mapMutations} from 'vuex'
  import headerRight from './components/headerRight.vue'
  export default {
    components:{
      headerRight
        // ecoImgScroll
    },
    data(){
      return {
        showMessageBox: false,
        showProfileBox: false,
        user:{},
        menuArray:[],
        menuObj:{},
        menuLeft:0,
        menuConShow:false,
        menuConRight:478
      }
    },
    computed: {
        ...mapState([
            'sysWidth',
            'toggleFlag',
        ]),
    },
    created(){
      //  this.getTopMenuTreeViewFunc();
    },
    mounted() {
        // this.getUserInfoFunc();
        // this.fitHeaderMenu(document.body.clientWidth);
    },
    methods:{
        ...mapMutations([
          'SET_MENU_TAB_CLICK',
          'SET_TOGGLE_MENU'
        ]),
        toIndex(){
          location.href="/portalIndex/#/serviceList"
        },
        fitHeaderMenu(val){//根据宽度调整头部nav布局
        
        },
        toggleLeftMenu(){
            let obj = {}
            obj.time =  new Date().getTime();
            this.SET_TOGGLE_MENU(obj);
        }
    },
    destroyed() {

    },
    watch:{
        'sysWidth'(val){
            this.fitHeaderMenu(val);
        },
    }
  }
</script>
<style scoped>
  .main-header {
      position: absolute;
      left:0px;
      top: -65px;
      z-index: 1999;
      height: 65px;
      line-height: 65px;
      right:0px;
      background-color: #fafafa;
      min-width:400px;
      overflow: hidden;
  }
  .leftControl{
    margin-left: 10px;
    display: inline-block;
    height: 100%;
  }
  .leftControl .icon{
    font-size: 26px;
    color: #333;
    cursor: pointer;
  }
  .logoDesc{
    padding-left: 10px;
  }
  .header-menu{
    position: absolute;
    left: 60px;
    top: 0;
    overflow: hidden;
  }
  .header-menu-list{
    width:10000px;
    position: relative;
    transition: left 1s ;
  }
   .header-menu-con{
    position: absolute;
    top: 0px;
    padding: 0 20px;
    font-size: 20px;
    cursor: pointer;
    line-height: 40px;
    color: #262626;
    /* z-index: 8888; */
  }
  .header-menu-con i{
    width: 20px;
  }
  /* .ivu-dropdown{
    float: left;
    height: 24px;
    margin-top:12px;
    margin-left:8px;
  } */
</style>
