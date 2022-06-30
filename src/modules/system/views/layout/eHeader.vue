<template>
  <div class="ecoHeader" v-bind:style="eHeaderStyle">
      <el-row>
          <el-col :span="18">

                <div class="logo"   v-if="sysSetting.asideType != 1">
                    <img  v-if="sysSetting.headLogoShow" :src="sysSetting.headLogoURL||'/assets/img/aflogo.png'" v-bind:style="headLogoStyle"/>
                    <span style="margin-left:15px;">{{sysSetting.headTitle}}</span>
                </div>
                <span class="sidebar-toggle" @click="toggleLeftMenu"  v-bind:style="toggleStyle" v-if="headToggleShow">
                    <i class="icon iconfont icon-sidebar-toggle"></i>
                </span>
                <div  style="display: inline-block;">
                        <el-menu
                            v-if="!sysSetting.customCenterMenu||!sysSetting.customCenterMenu.length"
                            default-active="2"
                            mode="horizontal"
                            @select="handleSelect"
                            active-text-color="#2196f3"
                            v-bind:style="{marginLeft:headToggleShow?'50px':'10px'}"
                        >

                            <el-submenu :index="item.id" v-for="item in menuArray" :key="item.id"  v-if="item.children.length > 0" class="levelMenu1">
                                <template slot="title">
                                    <span>{{item.name}} </span>
                                </template>

                                <el-submenu  :index="subItem.id" v-for="subItem in item.children" :key="subItem.id" v-if="subItem.children.length > 0" class="levelMenu2">
                                    <template slot="title" >
                                        {{subItem.name}}
                                    </template>

                                    <el-submenu :index="ssubItem.id" v-for="ssubItem in subItem.children" :key="ssubItem.id" v-if="ssubItem.children.length > 0" class="levelMenu3">
                                        <template slot="title" >
                                            {{ssubItem.name}}
                                        </template>

                                        <el-menu-item  :index="sssubItem.id" v-for="sssubItem in ssubItem.children" :key="sssubItem.id"  class="levelMenu4">
                                            {{sssubItem.name}}
                                        </el-menu-item>
                                    </el-submenu>

                                    <el-menu-item  :index="ssubItem.id" v-else  class="levelMenu3">
                                        {{ssubItem.name}}
                                    </el-menu-item>
                            </el-submenu>

                            <el-menu-item :index="subItem.id" v-else class="levelMenu2">
                                {{subItem.name}}
                            </el-menu-item>
                        </el-submenu>

                        <el-menu-item :index="item.id" v-else class="levelMenu1" >
                            <span slot="title">
                                {{item.name}}
                            </span>
                        </el-menu-item>
                    </el-menu>

                    <el-menu
                        v-if="sysSetting.customCenterMenu&&sysSetting.customCenterMenu.length"
                        default-active="1"
                        mode="horizontal"
                        active-text-color="#2196f3"
                        v-bind:style="{marginLeft:headToggleShow?'50px':'10px'}"

                    >
                        <el-menu-item :index="item.key" v-for="(item, index) in sysSetting.customCenterMenu" :key="item.key" class="levelMenu1" @click.native="item.func">
                            <span slot="title">
                                {{item.name}}
                            </span>
                        </el-menu-item>
                    </el-menu>
                </div>


          </el-col>

          <el-col :span="6" class="tool">
                <el-tooltip v-for="(item, index) in sysSetting.iconMore" :key="index" effect="dark" :content="item.name" placement="top">
                    <i :key="'ICON'+index" :class="'cpointer '+item.icon"  @click="toIframe(item.name,item.url)"></i>
                </el-tooltip>

                <el-tooltip effect="dark" content="切换至门户" placement="top" v-if="sysSetting && sysSetting.homeUrl">
                    <i class="cpointer el-icon-house"  @click="toIndex"></i>
                </el-tooltip>


                <el-tooltip effect="dark" content="设置" placement="top" v-if="sysSetting && sysSetting.settingPage">
                    <i class="cpointer el-icon-setting"  @click="goSetting"></i>
                </el-tooltip>

                <el-dropdown v-if="userObj!=null" trigger="click" placement="bottom-end">
                    <div>
                    <img v-show="showImg" class="userimg" :src="userObj.min_imgPath" @error="showImg=false"/>
                      <div v-show="!showImg" class="userimg" ><span v-if="userObj.mi">{{userObj.mi.slice(-2)}}</span></div>
                    </div>

                    <el-dropdown-menu slot="dropdown" class="e9-dropdown">
                        <el-dropdown-item @click.native="goUserPage">个人设置</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">{{$t('common.exit')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
          </el-col>
      </el-row>



  </div>
</template>
<script>

  import {getUserSelfInfo,getMenuFacadeTreeViewAjax} from '../../service/service.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {mapState,mapMutations} from 'vuex'
  export default {
    components:{


    },
    data(){
      return {
          activeIndex:'sysPortal',
          userObj:{},
          showImg:false,
          sysSetting:{
                headTitle:"",
                headLogoShow:false,
                headLogoURL:"/assets/img/aflogo.png",
                iconMore:[],
                customCenterMenu:[]
          },
          toggleStyle:{
              left:'210px'
          },
          eHeaderStyle:null,
          eHeaderStyleOld:{},
          toggleFlag:1,
          menuArray:[],
          menuObj:{},
          objTimer:null,

      }
    },
    computed: {
        ...mapState([
            'sysWidth',
            'tempObj',
            'toggleMenuObj'
        ]),

        headToggleShow:function(){
            if(window.sysSetting && window.sysSetting.togglePosition && window.sysSetting.togglePosition == 'header'){
                return true;
            }else{
                return false;
            }
        },

        headLogoStyle:function(){
             if(window.sysSetting && window.sysSetting.headLogoStyle){
                return window.sysSetting.headLogoStyle;
            }
        }

    },
    created(){


        if(this.$route.path.indexOf('workPlatform')>-1){
            this.activeIndex = 'workPlatform';
        }else if(this.$route.path.indexOf('sysPortal')>-1){
            this.activeIndex = 'sysPortal';
        }

        this.getSysSetting();

        if(this.sysSetting && this.sysSetting.asideType == 1){
            if(this.sysSetting.layout){
                if(this.sysSetting.layout.asideHidden){
                    this.toggleFlag = 0;
                    this.$set(this.eHeaderStyleOld,'left',(this.sysSetting.layout.asideWidth)?(this.sysSetting.layout.asideWidth)+'px':this.eHeaderStyle.left);
                    this.$set(this.eHeaderStyle,'left','0px');
                }else{
                    if(this.sysSetting.layout.asideWidth){
                        this.eHeaderStyle = {};
                        this.$set(this.eHeaderStyle,'left',(this.sysSetting.layout.asideWidth)+'px');
                    }
                }
            }
        }


    },
    mounted() {
        this.getUserSelfInfoFunc();
        this.getMenuTreeViewFunc();
    },
    methods:{
        ...mapMutations([
            'SET_MENU_TAB_CLICK',
            'SET_TOGGLE_MENU',
            'SET_TEMP_OBJ',
            'SET_LOGIN_USER',
        ]),

        getSysSetting(){
            this.sysSetting = window.sysSetting;
            if(this.sysSetting && this.sysSetting.layout && this.sysSetting.layout.asideWidth){
                if(this.sysSetting.asideType == 1 ){
                    this.toggleStyle.left = '25px'
                }else{
                    this.toggleStyle.left = this.sysSetting.layout.asideWidth+'px';
                }
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
                    this.SET_LOGIN_USER(res.data)
                        this.userObj = res.data;
                })
        },

        logout(){
            var that  = this;
            let confirmYesFunc = function(){
                sessionStorage.removeItem('ecoToken');
                let _requestSource = localStorage.getItem('ecoSSORequestSource');
                if(_requestSource == 'IAM'){
                    localStorage.removeItem('ecoSSORequestSource');
                    window.location.href = window.sysSetting.loginOutURL || "/#/login";
                }else{
                    if(window.sysSetting.loginOutURL){
                        window.location.href = window.sysSetting.loginOutURL || "/#/login";
                    }else{
                        that.$router.replace({name:'login'});
                    }

                }

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
        },
        getTempStore(key){
            let tempStore = this.tempObj;
            if(tempStore && tempStore[key]){
                return tempStore[key];
            }else{
                return '';
            }
        },
        removeTempStore(key){
          let tempStore = this.tempObj;
          if(tempStore && tempStore[key]){
             delete tempStore[key] ;
          }
          this.SET_TEMP_OBJ(tempStore);
      },

        //获取菜单json
        getMenuTreeViewFunc(){
            getMenuFacadeTreeViewAjax().then((response)=>{
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
                            this.getSubMenu(tempMenuObj,item);
                            tempMenuArray.push(item);
                      })
                  }
                  this.menuArray = tempMenuArray;
            }).catch((error)=>{});
        },

        getSubMenu(tempMenuObj,item){
             if(tempMenuObj[item.id+'']){
                  let childItems = tempMenuObj[item.id+''];
                  childItems.forEach((childItem)=>{
                        if(tempMenuObj[childItem.id+'']){
                             this.getSubMenu(tempMenuObj,childItem);
                        }else{
                            childItem.children = [];
                        }
                  })
                  item.children = childItems
              }else{
                  item.children = [];
              }
        },

       handleSelect(key, keyPath) {
             let r_func = '';
             let desc = "";
             let _fullScreen = false;

             if(this.menuObj[key+'']){
                 r_func = this.menuObj[key+''].r_func;
                 desc = this.menuObj[key+''].name;
                 _fullScreen = (this.menuObj[key+''].desc == 'fullscreen')?true:false; //备注
             }

             if(this.menuObj[key+''].type == "APP_SSO"){
                r_func = "{menuTarget:'APP_SSO',tabKey:'"+this.menuObj[key+''].id+"tab',paramName:'"+this.menuObj[key+''].paramName+"',paramVal:'"+ this.menuObj[key+''].paramVal+"' }";
             }else if(this.menuObj[key+''].href && this.menuObj[key+''].href.startsWith('vue:')){
                r_func = "{menuTarget:'VUE',tabKey:'"+this.menuObj[key+''].id+"tab',routerName:'"+this.menuObj[key+''].href.substring(4)+"',fullScreen:"+_fullScreen+"}";
             }else{
                r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObj[key+''].id+"tab',href_link:'"+this.menuObj[key+''].href+"',fullScreen:"+_fullScreen+"}";
             }

             let menuTab = {
                 desc:desc,
                 r_func:r_func,
                 reload:true
             };

             this.SET_MENU_TAB_CLICK(menuTab);
        },




        doMainToggle(flag){
            if(this.objTimer){
                window.clearInterval(this.objTimer) ;
                this.objTimer = null;
            }
            if(flag == "LEFT"){
                  this.toggleFlag = 0;
                  this.eHeaderStyleOld.left = this.eHeaderStyle.left;
                  this.eHeaderStyle.left = 0;
            }else{
                  this.toggleFlag = 1;
                  this.eHeaderStyle.left = this.eHeaderStyleOld.left;
            }
        },
        goSetting(){
            let nextMenu = {};
            nextMenu.desc = '自定义设置'
            nextMenu.r_func = "{menuTarget:'VUE',tabKey:'settingPage',routerName:'settingPage'}";
            window.sysvm.doTab(nextMenu);
        }

    },
    destroyed() {

    },
    watch:{
        toggleMenuObj(value,oldValue){
            if(this.toggleFlag == 0){
                this.doMainToggle('RIGHT');
            }else if(this.toggleFlag == 1){
                this.doMainToggle('LEFT');
            }
        },
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
      height: 60px;
      line-height: 60px;
      background-color: rgb(13,22,45);
      overflow: hidden;
      color:#fff;
      transition: left 1s;

  }

  .ecoHeader .sidebar-toggle{
      position:absolute;
      left:210px;
      cursor: pointer;
  }

  .ecoHeader .logo{
        text-align: center;
        vertical-align:middle;
        display:inline-block;
        cursor:pointer;
        float:left;
  }

  .ecoHeader .logo img{
      margin-left:15px;
      vertical-align: middle
  }

  .ecoHeader .logo::after{
      clear: both;
  }

  .ecoHeader .menuTool{
        width:300px;
        text-align: center;
        margin:0 auto;
        height:60px;
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

  .ecoHeader .colorItem{
      width:20%;
  }

</style>
