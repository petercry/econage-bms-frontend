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
                <div class="menuTool" v-bind:style={width:getMenuWidth}>
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

          </el-col>

          <el-col :span="4" class="tool">
                <i v-for="(item, index) in sysSetting.iconMore" :key="index" :class="'cpointer '+item.icon"  @click="toIframe(item.name,item.url)"></i>
                <i class="cpointer el-icon-house"  @click="toIndex"></i>
               <el-dropdown v-if="userObj!=null" trigger="click" placement="bottom-end">
                    <div>
                        <img v-show="showImg" class="userimg" :src="userObj.min_imgPath" @error="showImg=false"/>
                      <div v-show="!showImg" class="userimg" ><span v-if="userObj.mi">{{userObj.mi.slice(-2)}}</span></div>
                    </div>

                    <el-dropdown-menu slot="dropdown" class="e9-dropdown">
                        <el-dropdown-item @click.native="goUserPage">{{userObj.mi}}</el-dropdown-item>
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
                homeUrl:"/portalIndex/#/",
                iconMore:[],
          },
          toggleStyle:{
              left:'210px'
          },

          menuArray:[],
          menuObj:{},
          ecoSysSettingRole:false
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
        }
    },
    created(){
        window.webHeaderVm = this;
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
        this.menuArray.push({name:'系统设置',viewFlag:false,key:'SYS-SETTING'});

        this.menuObj = {
            'WF-START':{showFlag:false,href_link:null},
            'WF-TODO':{showFlag:false,href_link:null},
            'WF-TOVIEW':{showFlag:false,href_link:null},
            'WF-TOCONTROL':{showFlag:false,href_link:null},
            'WF-TEMPLATE':{showFlag:false,href_link:null},
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
            }else  if (window.sysSetting.homeType){
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
                menuTab.r_func = "{menuTarget:'VUE',tabKey:'webMainPage',routerName:'webMainPage'}";
            }else if(key == 'SYS-SETTING'){
                menuTab.desc = '系统设置' //用户系统设置
                menuTab.r_func = "{menuTarget:'VUE',tabKey:'webSettingPage',routerName:'webSettingPage'}";
            }else if(key == 'webEcoSetting'){ //econage 系统设置
                menuTab.desc = '系统设置' //用户系统设置
                menuTab.r_func = "{menuTarget:'VUE',tabKey:'webEcoSettingPage',routerName:'webEcoSettingPage'}";
            } else{
                let r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObj[key].id+"tab',href_link:'"+this.menuObj[key].href_link+"',fullScreen:false}";
                menuTab.desc = this.menuObj[key+''].key;
                menuTab.r_func = r_func;
                menuTab.reload = true;
            }
            this.SET_MENU_TAB_CLICK(menuTab);
        },

        setSelectMenu(activeIndex){
            this.activeIndex = activeIndex
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


        //获取菜单json
        getMenuTreeViewFunc(){
            getMenuTreeViewAjax().then((response)=>{
                response.data.forEach(element => {
                    if(this.menuObj && element.desc && element.desc!="" && this.menuObj[String(element.desc)]){
                         this.$set(this.menuObj[String(element.desc)],'showFlag',true);
                         this.$set(this.menuObj[String(element.desc)],'href_link',element.href);
                         this.$set(this.menuObj[String(element.desc)],'id',element.id);
                    }
                });
            }).catch((error)=>{});
        }
       
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
      height: 60px;
      line-height: 60px;
      background-color: #fff;
      overflow: hidden;
      color:#FFF;
  }

 

  .ecoHeader .logo img{
      margin-top:12px;
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
  
</style>

<style>
.webHeader .menuTool .el-menu--horizontal .is-active{
    background-color:#106dc9  !important;
}
</style>
