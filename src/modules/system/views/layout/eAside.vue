<template>
  <div class="aside" id="aside" v-bind:style="eAsideStyle" >
        <el-scrollbar style="height:100%" >

            <div v-if="sysSetting.asideType == 1" class="eAsideHeadDiv">
                <img  v-if="sysSetting.headLogoShow" :src="sysSetting.headLogoURL||'/assets/img/aflogo.png'" v-bind:style="headLogoStyle"/>
                <div  class="eAsideHeadTitle">{{sysSetting.headTitle}}</div>
            </div>

            <el-menu
                style="margin:0px;padding:0px;"
                default-active="2"
                class="el-menu-vertical"
                @select="handleSelect">

                <el-submenu :index="item.id" v-for="(item,index) in menuArray" :key="item.id"  v-if="item.children.length > 0" class="levelMenu1" >
                    <template slot="title">
                        <i  class="icon menuImg" v-bind:class="getMenuFontClass(item)"></i>
                        <span v-text="item.name"></span>
                    </template>
                    <el-submenu  :index="subItem.id" v-for="subItem in item.children" :key="subItem.id" v-if="subItem.children.length > 0" :popper-append-to-body="false" class="levelMenu2">
                        <template slot="title" >
                            <span>{{subItem.name}}</span>
                        </template>

                        <el-submenu :index="ssubItem.id" v-for="ssubItem in subItem.children" :key="ssubItem.id" v-if="ssubItem.children.length > 0" class="levelMenu3">
                            <template slot="title" >
                                <i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i>
                                {{ssubItem.name}}
                            </template>

                            <el-submenu :index="sssubItem.id" v-for="sssubItem in ssubItem.children" :key="sssubItem.id" v-if="sssubItem.children.length > 0" class="levelMenu4">
                                    <template slot="title" >
                                    <i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i>
                                    {{sssubItem.name}}
                                    </template>

                                    <el-menu-item  :index="ssssubItem.id" v-for="ssssubItem in sssubItem.children" :key="ssssubItem.id"  class="levelMenu5">
                                        <i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i>
                                        {{ssssubItem.name}}
                                    </el-menu-item>
                            </el-submenu>

                            <el-menu-item  :index="sssubItem.id" v-else  class="levelMenu4">
                                <i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i>
                                {{sssubItem.name}}
                            </el-menu-item>
                        </el-submenu>

                        <el-menu-item  :index="ssubItem.id" v-else  class="levelMenu3">
                        <i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i><i v-html="'&nbsp;'"></i>
                        {{ssubItem.name}}
                    </el-menu-item>

                </el-submenu>

                <el-menu-item :index="subItem.id" v-else class="levelMenu2">
                    <span>{{subItem.name}}</span>
                </el-menu-item>
            </el-submenu>

            <el-menu-item :index="item.id" v-else class="levelMenu1" >
                <i  class="icon menuImg" v-bind:class="getMenuFontClass(item)"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>

        </el-menu>

        </el-scrollbar>


        <form name="logForm" id="logForm"  method="post" action="/wh/servlet/MainServer">
                <input type="hidden" name="doNothing" value="N" />
                <input type="hidden" name="nextPage" value="" />
                <input type="hidden" name="cmd" value="" />
                <input type="hidden" name="language" value="" />
        </form>

  </div>
</template>
<script>
  import {getMenuTreeViewAjax} from '@/modules/system/service/service.js'
  import {mapState,mapMutations} from 'vuex'
  export default {
    data(){
      return {
            menuArray:[],
            menuObj:{},
            userObj:{},
            eAsideStyle:null,
            sysSetting:{},
      }
    },

    created(){

        this.getMenuTreeViewFunc();

        this.sysSetting = window.sysSetting;
        if(this.sysSetting.layout && this.sysSetting.layout.asideWidth){
            this.eAsideStyle = {};
            this.$set(this.eAsideStyle,'width',this.sysSetting.layout.asideWidth+'px');
            if(this.sysSetting && this.sysSetting.asideType == 1){
                this.$set(this.eAsideStyle,'top',0);
            }
        }

    },
    mounted() {

    },
    computed:{
        headLogoStyle:function(){
             if(this.sysSetting && this.sysSetting.headLogoStyle){
                return this.sysSetting.headLogoStyle;
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_MENU_TAB_CLICK'
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
             }else if(this.menuObj[key+''].href && this.menuObj[key+''].href.startsWith('web:')){
                 r_func = "{menuTarget:'WEB',tabKey:'"+this.menuObj[key+''].id+"tab',href_link:'"+this.menuObj[key+''].href.substring(4)+"',href_target:'_blank', fullScreen:"+_fullScreen+"}";
             }else{
                 r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObj[key+''].id+"tab',href_link:'"+this.menuObj[key+''].href+"',fullScreen:"+_fullScreen+"}";
             }
             let menuTab = {
                 desc:desc,
                 r_func:r_func,
                 reload:true
             };

             this.SET_MENU_TAB_CLICK(menuTab);
        }
    },

    destroyed() {

    }
  }
</script>
<style scoped>
  .aside{
      position: fixed;
      top:60px;
      left:0;
      width: 210px;
      bottom: 0px;
      overflow-y:hidden;
      overflow-x: hidden;
      background-image: linear-gradient(to bottom,rgb(33,43,72) 0%, rgb(33,43,72) 100%);
  }

.aside .menuImg{
    vertical-align: middle;
    margin-right: 6px;
    width: 24px;
    text-align: center;
    font-size: 14px;
}

.aside .el-menu-vertical{
    margin-bottom: 10px;
}

.aside .eAsideHeadTitle{
    margin:10px;
    font-size: 16px;
    color:#fff;
    text-align: center;
}

.aside .eAsideHeadDiv{
    text-align: center;
    margin:10px;
}
</style>
