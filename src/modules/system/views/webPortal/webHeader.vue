<template>
  <div class="ecoHeader webHeader">
      <el-row>

          <el-col :span="4">
                <div class="logo" style="display: inline-block;cursor:pointer;" @click="toIndex">
                    <img  v-if="sysSetting.headLogoShow" :src="sysSetting.headLogoURL||'/assets/img/aflogo.png'"/>
                    <span style="margin-left:15px;">{{sysSetting.headTitle}}</span>
                </div>
          </el-col>


          <el-col :span="16" style="text-align:center;">
                <div class="menuTool" v-bind:style={width:getMenuWidth}  v-if="heanderMenuType == 'jinan-type'">
                    <el-menu
                        :default-active="activeIndex"
                        mode="horizontal"
                        background-color="#0084ff"
                        text-color="#fff"
                        active-text-color="#fff"
                        @select="selectMenu"
                    >
                        <el-menu-item  index="webHome" >首页</el-menu-item>
                        <el-menu-item :index="menuItem.key" v-for="menuItem in menuArray" :key="menuItem.key" v-if="menuObj[menuItem.key] && menuObj[menuItem.key].showFlag">
                            {{menuItem.name}}
                        </el-menu-item>
                         <el-menu-item  index="webEcoSetting" v-if="ecoSysSettingRole">系统设置</el-menu-item>
                    </el-menu>
                </div>

                <div class="menuTool"  v-if="heanderMenuType == 'default'" v-bind:style={width:getMenuDefaultWidth}>
                    <el-menu
                        :default-active="activeIndex"
                        class="el-menu-demo"
                        mode="horizontal"
                        @select="selectMenu"
                        background-color="#153462"
                        text-color="#fff"
                        active-text-color="#fff">

                        <el-menu-item  index="webHome" >首页</el-menu-item>
                        <el-submenu :index="item.id" v-for="(item,index) in menuArrayDefault" :key="item.id"  v-if="item.children.length > 0 && index < menuNum " class="headerlevelMenu1" >
                                <template slot="title">
                                    <span v-text="item.name"></span>
                                </template>

                                <el-submenu  :index="subItem.id" v-for="subItem in item.children" :key="subItem.id" v-if="subItem.children.length > 0" :popper-append-to-body="false" class="headerlevelMenu2">
                                        <template slot="title" >
                                            <span>{{subItem.name}}</span>
                                        </template>
                                        <el-submenu :index="ssubItem.id" v-for="ssubItem in subItem.children" :key="ssubItem.id" v-if="ssubItem.children.length > 0" class="headerlevelMenu3">
                                            <template slot="title" >
                                                {{ssubItem.name}}
                                            </template>
                                        </el-submenu>
                                        <el-menu-item  :index="ssubItem.id" v-else  class="headerlevelMenu3">
                                            {{ssubItem.name}}
                                        </el-menu-item>
                                </el-submenu>
                                <el-menu-item :index="subItem.id" v-else class="headerlevelMenu2">
                                    <span>{{subItem.name}}</span>
                                </el-menu-item>
                            </el-submenu>

                            <el-menu-item :index="item.id" v-else-if="index < menuNum" class="headerlevelMenu1" >
                                <span slot="title">{{item.name}}</span>
                            </el-menu-item>
                    </el-menu>
                </div>
          </el-col>

          <el-col :span="4" class="tool">
                <i v-for="(item, index) in sysSetting.iconMore" :key="index" :class="'cpointer '+item.icon"  @click="toIframe(item.name,item.url)"></i>
                <i class="cpointer el-icon-house"  @click="toIndex" v-if="sysSetting && sysSetting.homeUrl"></i>
                <el-dropdown v-if="userObj!=null" trigger="click" placement="bottom-end">
                    <div>
                        <img v-show="showImg" class="userimg" :src="userObj.min_imgPath" @error="showImg=false"/>
                      <div v-show="!showImg" class="userimg" ><span v-if="userObj.mi">{{userObj.mi.slice(-2)}}</span></div>
                    </div>

                    <el-dropdown-menu slot="dropdown" class="e9-dropdown">
                        <el-dropdown-item @click.native="goUserPage">设置</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">{{$t('common.exit')}}</el-dropdown-item>
                    </el-dropdown-menu>
             </el-dropdown>
          </el-col>
      </el-row>
  </div>
</template>
<script>

  import {getUserSelfInfo,getMenuTreeViewAjax,isSuperAdmin} from '../../service/service.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {mapState,mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'

  export default {
    components:{


    },
    data(){
      return {
          activeIndex:'webHome',
          userObj:{},
          showImg:false,
          sysSetting:{
                headTitle:"",
                headLogoShow:false,
                headLogoURL:"/assets/img/aflogo.png",
                iconMore:[],
          },
          toggleStyle:{
              left:'210px'
          },
          menuArray:[],
          menuObj:{},
          ecoSysSettingRole:false,
          menuArrayDefault:[],
          menuObjDefault:{},
          heanderMenuType:'default', //custom 自定义配置 2 济南模式
          menuNum:9
      }
    },
    computed: {
        ...mapState([
            'sysWidth'
        ]),

        getMenuWidth:function(){
            let _width = 68;
            for(let key in this.menuObj){
                if(this.menuObj[key].showFlag){
                    _width += 100;
                }
            }
            if(this.ecoSysSettingRole){
                _width+=100;
            }
            return _width+'px';
        },

        getMenuDefaultWidth:function(){
            let _width = 68;
            for(let i = 0;i<this.menuArrayDefault.length && i< this.menuNum;i++){
                _width += 100;
            }

            return _width+'px';
        }

    },
    created(){
        window.webHeaderVm = this;
        if(window.sysSetting && window.sysSetting.heanderMenuType){
            this.heanderMenuType = window.sysSetting.heanderMenuType ;
        }

        if(window.sysSetting && window.sysSetting.menuNum){
            this.menuNum = window.sysSetting.menuNum ;
        }
    },
    mounted() {
        this.getSysSetting();
        this.getUserSelfInfoFunc();
        this.isSuperAdminFunc();

        this.menuArray.push({name:'启动流程',viewFlag:false,key:'WF-START'});
        this.menuArray.push({name:'我的待办',viewFlag:false,key:'WF-TODO'});
        this.menuArray.push({name:'流程查看',viewFlag:false,key:'WF-TOVIEW'});
        this.menuArray.push({name:'流程监控',viewFlag:false,key:'WF-TOCONTROL'});
        this.menuArray.push({name:'流程设计',viewFlag:false,key:'WF-TEMPLATE'});
        this.menuArray.push({name:'流程报表',viewFlag:false,key:'WF-REPORT'});
        this.menuArray.push({name:'集成平台',viewFlag:false,key:'INTEGRATION-PLATFORM'});
        this.menuArray.push({name:'系统设置',viewFlag:false,key:'SYS-SETTING'});

        this.menuObj = {
            'WF-START':{showFlag:false,href_link:null},
            'WF-TODO':{showFlag:false,href_link:null},
            'WF-TOVIEW':{showFlag:false,href_link:null},
            'WF-TOCONTROL':{showFlag:false,href_link:null},
            'WF-TEMPLATE':{showFlag:false,href_link:null},
            'WF-REPORT':{showFlag:false,href_link:null},
            'INTEGRATION-PLATFORM':{showFlag:false,href_link:null},
            'SYS-SETTING':{showFlag:false,href_link:null},
        };

        this.getMenuTreeViewFunc();

    },
    methods:{
        ...mapMutations([
            'SET_MENU_TAB_CLICK',
             'SET_TOGGLE_MENU'
        ]),

        isSuperAdminFunc(){
            isSuperAdmin().then((response)=>{
                this.ecoSysSettingRole = response.data;
            })
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
            }else if (window.sysSetting.homeType){
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
            let menuTab = {};
            if(key == 'webHome'){
                menuTab.desc = this.$t('module.home'); //默认首页门户
                if(window.sysSetting.homeType){
                    if((window.sysSetting.homeType).startsWith('frame:')){
                        menuTab.r_func = "{menuTarget:'IFRAME',tabKey:'contentPage',href_link:'"+ window.sysSetting.homeType.substring(6)+"'}";
                        menuTab.reload = true;
                    }else{
                        menuTab.r_func = "{menuTarget:'VUE',tabKey:'webMainPage',routerName:'"+window.sysSetting.homeType+"'}";
                    }
                }else{
                     menuTab.r_func = "{menuTarget:'VUE',tabKey:'webMainPage',routerName:'webMainPage'}";
                }

            }else if(key == 'SYS-SETTING'){
                menuTab.desc = '系统设置' //用户系统设置
                menuTab.r_func = "{menuTarget:'VUE',tabKey:'webSettingPage',routerName:'webSettingPage'}";
            }else if(key == 'webEcoSetting'){ //econage 系统设置
                menuTab.desc = '系统设置' //用户系统设置
                menuTab.r_func = "{menuTarget:'VUE',tabKey:'webEcoSettingPage',routerName:'webEcoSettingPage'}";
            } else{
                let r_func = null;
                if(this.heanderMenuType == 'default'){
                    let _fullScreen = false;
                    if(this.menuObjDefault[key+'']){
                        _fullScreen = (this.menuObjDefault[key+''].desc == 'fullscreen')?true:false; //备注
                    }
                    if(this.menuObjDefault[key+''].href && this.menuObjDefault[key+''].href.startsWith('vue:')){
                        r_func = "{menuTarget:'VUE',tabKey:'"+this.menuObjDefault[key+''].id+"tab',routerName:'"+this.menuObjDefault[key+''].href.substring(4)+"',fullScreen:"+_fullScreen+"}";
                    }else{
                        r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObjDefault[key+''].id+"tab',href_link:'"+this.menuObjDefault[key+''].href+"',fullScreen:"+_fullScreen+"}";
                    }
                    menuTab.desc = this.menuObjDefault[key+''].key;
                }else if(this.heanderMenuType == 'jinan-type'){
                    r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObj[key].id+"tab',href_link:'"+this.menuObj[key].href_link+"',fullScreen:false}";
                    menuTab.desc = this.menuObj[key+''].key;
                }
                menuTab.r_func = r_func;
                menuTab.reload = true;
            }
            this.SET_MENU_TAB_CLICK(menuTab);
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
                if(window.sysSetting.loginOutURL){
                    let _url = window.sysSetting.loginOutURL|| "/#/login";
                    _url = _url.replace('ecoHrLink', that.userObj.hrLink);
                    window.location.href = _url;
                }else{
                    that.$router.replace({name:'login'});
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


        //获取菜单json
        getMenuTreeViewFunc(){
            getMenuTreeViewAjax().then((response)=>{

                let _response1 = EcoUtil.objDeepCopy(response.data);
                _response1.forEach(element => {
                    if(this.menuObj && element.desc && element.desc!="" && this.menuObj[String(element.desc)]){
                         this.$set(this.menuObj[String(element.desc)],'showFlag',true);
                         this.$set(this.menuObj[String(element.desc)],'href_link',element.href);
                         this.$set(this.menuObj[String(element.desc)],'id',element.id);
                    }
                });


                //自定义配置菜单，和左侧菜单类似
                if(this.heanderMenuType == 'default'){
                    let _response2 = EcoUtil.objDeepCopy(response.data);
                    let tempMenuObj = {};
                    let tempMenuArray = [];
                    _response2.forEach(element => {
                            element.children = [];
                            if(!tempMenuObj[element.parentId+'']){
                                tempMenuObj[element.parentId+''] = [];
                            }
                            tempMenuObj[element.parentId+''].push(element);
                            this.menuObjDefault[element.id+''] = element;
                    });

                    /*从根节点开始过滤 */
                    if(tempMenuObj['-1'] && tempMenuObj['-1'].length > 0){
                        tempMenuObj['-1'].forEach((item)=>{
                                this.getSubMenu(tempMenuObj,item);
                                tempMenuArray.push(item);
                        })
                    }
                    this.menuArrayDefault = tempMenuArray;
                }


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


    },

    destroyed() {
        delete window.webHeaderVm;
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
      height: 48px;
      line-height: 48px;
      background-color: #fff;
      overflow: hidden;
      color:#FFF;
  }



  .ecoHeader .logo img{
      margin-top:7px;
      margin-left:15px;
      height: 36px;
  }

  .ecoHeader .menuTool{
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
  .el-menu--horizontal>.el-menu-item {
    height: 48px;
    line-height: 48px;
}
</style>

<style>
.webHeader .menuTool .el-menu--horizontal .is-active{
    background-color:#2c7cc7  !important;
}

.webHeader .el-menu--horizontal>.el-submenu .el-submenu__icon-arrow{
    display: none;
}

.el-menu.el-menu--popup{
    padding:5px 0px;
}

.el-menu--horizontal .el-submenu__title i{
    color:#fff;
}

.el-menu-item:focus,.el-menu-item:hover{
    background-color: #2c7cc7 !important;
}
</style>
