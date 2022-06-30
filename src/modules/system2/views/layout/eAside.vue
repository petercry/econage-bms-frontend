<template>
  <div class="aside" id="aside">
        <div class="logoDiv">
            <el-row @click.native="toIndex">
                <el-col :span="6"> <img class="logo" src="../../assets/img/logo.png" style="width:36px;"/></el-col>
                <el-col :span="18" v-if="toggleFlag"><span class="logoDesc">机关内部最多跑一次</span></el-col>
            </el-row>
        </div>

        <el-menu
          :collapse="!toggleFlag"
          text-color="#fff"
          active-text-color="#ffd04b"
          default-active="2"
          class="el-menu-vertical"
          @select="handleSelect">

          <el-submenu :index="item.id" v-for="(item,index) in menuArray" :key="item.id"  v-if="item.children.length > 0" class="levelMenu1" >
            
              <template slot="title">
                  <i  class="icon menuImg" v-bind:class="getMenuFontClass(item)"></i>
                  <span  slot="title" v-text="item.i18nText"></span>
              </template>
    
              <el-submenu  :index="subItem.id" v-for="subItem in item.children" :key="subItem.id" v-if="subItem.children.length > 0" :popper-append-to-body="false" class="levelMenu2">
                  <template slot="title" >
                    <span>{{subItem.i18nText}}</span>
                  </template>

                    <el-submenu :index="ssubItem.id" v-for="ssubItem in subItem.children" :key="ssubItem.id" v-if="ssubItem.children.length > 0" class="levelMenu3">
                        <template slot="title" >
                          &nbsp;&nbsp;&nbsp;
                          {{ssubItem.i18nText}}
                        </template>

                        <el-submenu :index="sssubItem.id" v-for="sssubItem in ssubItem.children" :key="sssubItem.id" v-if="sssubItem.children.length > 0" class="levelMenu4">
                              <template slot="title" >
                                &nbsp;&nbsp;&nbsp;
                                {{sssubItem.i18nText}}
                              </template>

                              <el-menu-item  :index="ssssubItem.id" v-for="ssssubItem in sssubItem.children" :key="ssssubItem.id"  class="levelMenu5">
                                  &nbsp;&nbsp;
                                  {{ssssubItem.i18nText}}
                              </el-menu-item>
                      </el-submenu>

                        <el-menu-item  :index="sssubItem.id" v-else  class="levelMenu4">
                            &nbsp;&nbsp;
                            {{sssubItem.i18nText}}
                        </el-menu-item>
                    </el-submenu>

                    <el-menu-item  :index="ssubItem.id" v-else  class="levelMenu3">
                      &nbsp;&nbsp;&nbsp;
                      {{ssubItem.i18nText}}
                  </el-menu-item>

              </el-submenu>

              <el-menu-item :index="subItem.id" v-else class="levelMenu2">
                <!-- <i  class="icon menuImg" v-bind:class="getMenuFontClass(item)"></i> -->
                <span>{{subItem.i18nText}}</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item :index="item.id" v-else class="levelMenu1" >
            <i  class="icon menuImg" v-bind:class="getMenuFontClass(item)"></i>
            <span slot="title">{{item.i18nText}}</span>
          </el-menu-item>


        </el-menu>

<form name="logForm" id="logForm"  method="post" action="/wh/servlet/MainServer">
    <input type="hidden" name="doNothing" value="N" />
    <input type="hidden" name="nextPage" value="" />
    <input type="hidden" name="cmd" value="" />
    <input type="hidden" name="language" value="" />
</form>

  </div>
</template>
<script>
  import {getMenuTreeViewAjax} from '@/modules/system2/service/service.js'
  import {mapState,mapMutations} from 'vuex'

  export default {
    data(){
      return {
        // isCollapse:false,
        menuArray:[],
        menuObj:{},
        userObj:{}
      }
    },

    created(){
          this.getMenuTreeViewFunc();
    },
    mounted() {

    },
    computed:{
      ...mapState([
          'toggleFlag',
      ]),
    },
    methods: {
        ...mapMutations([
            'SET_MENU_TAB_CLICK'
        ]),
        toIndex(){
          location.href="/portalIndex/#/serviceList"
        },
        //获取菜单json
        getMenuTreeViewFunc(){
            getMenuTreeViewAjax().then((response)=>{
                  let tempMenuObj = {};
                  let tempMenuArray = [];
                  response.data.forEach(element => {
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
                             this.getSubMenu(tempMenuObj,childItems);
                        }else{
                            childItem.children = [];
                        }
                  })
                  item.children = childItems
              }else{
                  item.children = [];
              }
        },

        getMenuFontClass(item){
        //    return 'icon-fenlei';
              if(item && item.iconCls && item.iconCls !=""){
                  // if(item.iconCls == 'fa-tags'){
                  //     return 'icon-fenlei';
                  // }else{
                      return item.iconCls;
                  // }
              }else{
                  return 'fa fa-tags';
              }
        },

        handleSelect(key, keyPath) {
             let r_func = '';
             let desc = "";
             if(this.menuObj[key+'']){
                 r_func = this.menuObj[key+''].r_func;
                 desc = this.menuObj[key+''].i18nText;
             }
            //  this.menuObj[key+''].href = 'common/index.html#/i18nList'
             r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObj[key+''].id+"tab',href_link:'"+this.menuObj[key+''].href+"'}";
             let menuTab = {
                 desc:desc,
                 r_func:r_func,
                 reload:true
             };
             this.SET_MENU_TAB_CLICK(menuTab);
        
        }

    },
    watch: {
      // 'toggleFlag'(val){
      //   if (val){
      //     this.isCollapse = false;
      //   }else{
      //     this.isCollapse = true;
      //   }
      // }
    },

    destroyed() {

    }
  }
</script>
<style scoped>
  .aside{
      position: fixed;
      top: 0px;
      left: 0;
      width: 210px;
      bottom: 0px;
      overflow-y:scroll;
      overflow-x: hidden;
      background-image: linear-gradient(to bottom,#1b5293 0%, #1b5293 100%);  
  }
  @media screen and (min-width: 768px){
    .aside {
        width: 225px;
        font-size: 13px;
    }
  }
  @media screen and (min-width: 1400px){
    .aside {
        width: 250px;
        font-size: 14px;
    }
  }

.logoDiv{
  vertical-align: middle;
  height:50px;
  margin-top:10px;
}

.logoDiv .logo{
    margin-left: 20px; 
    height: 45px;
}

.logoDiv .logoDesc{
  color:#fff;
  font-size: 16px;
  line-height: 50px;
  vertical-align: middle;
}

.menuImg{
    vertical-align: middle;
    margin-right: 6px;
    width: 24px;
    text-align: center;
    font-size: 14px;
    /* font-weight: bold; */
}
.el-menu-vertical{
    margin-bottom: 10px;
}
</style>
