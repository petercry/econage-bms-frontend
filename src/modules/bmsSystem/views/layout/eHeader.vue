<template>
  <div class="ecoHeader"> 
      <el-row>
          <el-col :span="4">
                <div class="logo" style="display: inline-block;cursor:pointer;" @click="toIndex">
                    <img  v-if="sysSetting.headLogoShow" :src="sysSetting.headLogoURL||'/assets/img/aflogo.png'" v-bind:style="headLogoStyle"/>
                    <span style="margin-left:15px;">{{sysSetting.headTitle}}</span>
                </div>
                &nbsp;
                <span class="sidebar-toggle" @click="toggleLeftMenu"  v-bind:style="toggleStyle" v-if="headToggleShow">
                    <i class="icon iconfont icon-sidebar-toggle"></i>
                </span>
          </el-col>

          <el-col :span="11">
            <el-select v-model="menuId" placeholder="请选择菜单" @change="handleSelect" class="sysMenu" style="width:130px;">
                <el-option
                v-for="(item) in menuArray"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>


              <div class="menuTool" >
                     <el-menu 
                        v-if="false"
                        :default-active="activeIndex"
                        class="el-menu-demo"
                        mode="horizontal"
                        background-color="#0E152C"
                        text-color="#a9b0bb"
                        active-text-color="#F7F7F9"
                        @select="selectMenu"
                    >
                        <el-menu-item index="sysPortal" >流程门户</el-menu-item>
                        <el-menu-item index="workPlatform">工作平台</el-menu-item>
                    </el-menu>
                    &nbsp;
              </div>
          </el-col>
          <el-col :span="9" class="tool">
                <i v-for="(item, index) in sysSetting.iconMore" :key="index" :class="'cpointer '+item.icon"  @click="toIframe(item.name,item.url)"></i>
                <i class="cpointer el-icon-house"  @click="toIndex"></i>
               <el-dropdown v-if="userObj!=null" trigger="click" placement="bottom-end">
                    <div>
                        <img v-show="showImg" class="userimg" :src="userObj.min_imgPath" @error="showImg=false"/>
                      <div v-show="!showImg" class="userimg" ><span v-if="userObj.mi">{{userObj.mi.slice(-2)}}</span></div>
                    </div>

                    <el-dropdown-menu slot="dropdown" class="e9-dropdown mainPageDropDown">
                        <el-dropdown-item @click.native="goUserPage">{{userObj.mi}}</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">{{$t('common.exit')}}</el-dropdown-item>
                    </el-dropdown-menu>
             </el-dropdown>
          </el-col>
      </el-row>
  </div>
</template>
<script>

  import {getUserSelfInfo} from '../../service/service.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {mapState,mapMutations} from 'vuex'
  import {getMenuTreeViewAjax} from '@/modules/bmsSystem/service/service.js'
  export default {
    components:{
      
      
    },
    data(){
      return {
          menuArray:[],
          menuObj:{},
          menuId:'',
          activeIndex:'sysPortal',
          userObj:{},
          showImg:false,
          sysSetting:{
                headTitle:"",
                headLogoShow:false,
                headLogoURL:"/assets/img/aflogo.png",
                homeUrl:"/portalIndex/#/",
                iconMore:[],
          },
          toggleStyle:{
              left:'210px'
          }
      }
    },
    computed: {
        ...mapState([
            'sysWidth'
        ]),
        headToggleShow:function(){
            if(window.sysSetting && window.sysSetting.togglePosition && window.sysSetting.togglePosition != 'header'){
                return false;
            }else{
                return true;
            }
        },
        headLogoStyle:function(){
             if(window.sysSetting && window.sysSetting.headLogoStyle){
                return window.sysSetting.headLogoStyle;
            }
        }
    },
    created(){
        this.getMenuTreeViewFunc();
        if(this.$route.path.indexOf('workPlatform')>-1){
            this.activeIndex = 'workPlatform';
        }else if(this.$route.path.indexOf('sysPortal')>-1){
            this.activeIndex = 'sysPortal';
        }
    },
    mounted() {
        this.getSysSetting();
        this.getUserSelfInfoFunc();
        
    },
    methods:{
        ...mapMutations([
            'SET_MENU_TAB_CLICK',
             'SET_TOGGLE_MENU'
        ]),
        //获取菜单json
        getMenuTreeViewFunc(){
            getMenuTreeViewAjax().then((response)=>{
             
                  let tempMenuObj = {};
                  let tempMenuArray = [];
                  response.data.forEach(element => {
                        element.children = [];
                        if(!tempMenuObj[element.parentId+'']){
                            tempMenuObj[element.parentId+''] = [];
                        }
                        tempMenuObj[element.parentId+''].push(element);
                        this.menuObj[element.id+''] = element;
                  });
                  
                  /*从根节点开始过滤 */
                  if(tempMenuObj['-1'] && tempMenuObj['-1'].length > 0){
                      tempMenuObj['-1'].forEach((item)=>{
                            //this.getSubMenu(tempMenuObj,item);
                            tempMenuArray.push(item);
                      })
                  }
                  this.menuArray = tempMenuArray;
                  //console.log("this.menuArray:" + this.menuArray);
            }).catch((error)=>{ console.log("error:" + error); });
        },
        handleSelect(key) {
             let r_func = '';
             let desc = "";  
             let _fullScreen = false;
             console.log("###############key:" + key);   
             if(this.menuObj[key+'']){
                 r_func = this.menuObj[key+''].r_func;
                 desc = this.menuObj[key+''].name;
                 _fullScreen = (this.menuObj[key+''].desc == 'fullscreen')?true:false; //备注
             }
             r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObj[key+''].id+"tab',href_link:'"+this.menuObj[key+''].href+"',fullScreen:"+_fullScreen+"}";
             console.log("###############r_func:" + r_func);  
             let menuTab = {
                 desc:desc,
                 r_func:r_func,
                 reload:true
             };

             this.SET_MENU_TAB_CLICK(menuTab);
        },
        getSysSetting(){
            this.sysSetting = window.sysSetting;
            if(this.sysSetting && this.sysSetting.layout && this.sysSetting.layout.asideWidth){
                this.toggleStyle.left = this.sysSetting.layout.asideWidth+'px';
            }
        },

        toIframe(name,url){
            let nextMenu = {};
            nextMenu.desc = name; 
            nextMenu.r_func = "{menuTarget:'IFRAME',tabKey:'"+url+"',href_link:'"+url+"'}";
            window.sysvm.doTab(nextMenu);
        },

        toIndex(){
            if(window.sysSetting.homeUrl){
                location.href = window.sysSetting.homeUrl||'/portalIndex/#/'
            }else if(window.sysSetting.homeType){
                let nextMenu = {};
                nextMenu.desc = this.$t('module.home'); //默认首页门户
                nextMenu.r_func = "{menuTarget:'VUE',tabKey:'contentPage',routerName:'"+window.sysSetting.homeType+"'}";
                window.sysvm.doTab(nextMenu);
            }else if(window.sysSetting.backUrl){
                let nextMenu = {};
                nextMenu.desc = ''; 
                nextMenu.r_func = "{menuTarget:'IFRAME',tabKey:'contentUrlPage',href_link:'"+window.sysSetting.backUrl+"'}";
                window.sysvm.doTab(nextMenu);
            }
        },

        selectMenu(key, keyPath) {
            if(key == 'sysPortal'){
                this.$router.push({name:'wfPortal'});
            }else if(key == 'workPlatform'){
                this.$router.push({name:'workPlatform'});
            }
        },

        getUserSelfInfoFunc(){
                getUserSelfInfo().then((res)=>{
                        this.userObj = res.data;
                })
        },

         logout(){
            var that  = this;
            let confirmYesFunc = function(){
                sessionStorage.removeItem('ecoToken');
                that.$router.replace({name:'login'});                
            }

            let options = { center: true,lockScroll:false,customClass:'exitbox'}
            EcoMessageBox.confirm(this.$t('message.exit')+'?','',options,confirmYesFunc);
        },

        goUserPage(){
            let nextMenu = {};
            nextMenu.desc = '个人设置';
            nextMenu.r_func = "{menuTarget:'IFRAME',tabKey:'userSettingPage',href_link:'manage/#/personal'}";
            window.sysvm.doTab(nextMenu);
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
       
    }
  }
</script>
<style scoped>
  .ecoHeader {
      position: fixed;
      left:0px;
      right:0px;
      top: 0px;
      z-index:100;
      height: 45px;
      line-height: 45px;
      background-color: rgb(13,22,45);
      overflow: hidden;
      color:#fff;
  }

  .ecoHeader .sidebar-toggle{
      position:absolute;
      left:210px;
      cursor: pointer;
  }

  .ecoHeader .logo{
        text-align: center;
        vertical-align:middle;
  }

  .ecoHeader .logo img{
      margin-left:15px;
      vertical-align: middle
  }

  .ecoHeader .menuTool{
    width:300px;
    text-align: center;
    margin:0 auto;
  }

  .ecoHeader .tool{
    text-align: right;
  }

  .ecoHeader .tool i{
        font-size: 20px;
        margin-right: 6px;
    }

  .ecoHeader  .userimg{
    margin-top: -4px;
    margin-right: 20px;
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    vertical-align: middle;
    line-height: 30px;
    text-align: center;
    color:#fff;
    cursor: pointer;
    background-color:rgb(46,56,73);
  }
  
</style>
