<template>
  <div class="aside" id="aside" v-bind:style="eAsideStyle" >
     <el-scrollbar style="height:100%" >
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
                            &nbsp;&nbsp;&nbsp;
                            {{ssubItem.name}}
                          </template>

                        <el-submenu :index="sssubItem.id" v-for="sssubItem in ssubItem.children" :key="sssubItem.id" v-if="sssubItem.children.length > 0" class="levelMenu4">
                                <template slot="title" >
                                  &nbsp;&nbsp;&nbsp;
                                  {{sssubItem.name}}
                                </template>

                                <el-menu-item  :index="ssssubItem.id" v-for="ssssubItem in sssubItem.children" :key="ssssubItem.id"  class="levelMenu5">
                                    &nbsp;&nbsp;
                                    {{ssssubItem.name}}
                                </el-menu-item>
                        </el-submenu>

                        <el-menu-item  :index="sssubItem.id" v-else  class="levelMenu4">
                            &nbsp;&nbsp;
                            {{sssubItem.name}}
                        </el-menu-item>
                    </el-submenu>

                    <el-menu-item  :index="ssubItem.id" v-else  class="levelMenu3">
                      &nbsp;&nbsp;&nbsp;
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
  import {getMenuTreeViewAjax} from '@/modules/bmsSystem/service/service.js'
  import {mapState,mapMutations} from 'vuex'
  export default {
    data(){
      return {
            menuArray:[],
            menuObj:{},
            userObj:{},
            eAsideStyle:null,
      }
    },

    created(){
        this.getMenuTreeViewFunc();
        if(window.sysSetting && window.sysSetting.layout && window.sysSetting.layout.asideWidth){
            this.eAsideStyle = {};
            this.$set(this.eAsideStyle,'width',window.sysSetting.layout.asideWidth+'px');
        }
       
    },
    mounted() {

    },
    computed:{

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
             r_func = "{menuTarget:'IFRAME',tabKey:'"+this.menuObj[key+''].id+"tab',href_link:'"+this.menuObj[key+''].href+"',fullScreen:"+_fullScreen+"}";
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
      top:45px;
      left:0;
      width: 210px;
      bottom: 0px;
      overflow-y:hidden;
      overflow-x: hidden;
      background-image: linear-gradient(to bottom,rgb(33,43,72) 0%, rgb(33,43,72) 100%);  
  }
/* 
  @media screen and (min-width: 768px){
    .aside {
        width: 205px;
        font-size: 13px;
    }
  }

  @media screen and (min-width: 1400px){
    .aside {
        width: 230px;
        font-size: 14px;
    }
  } */



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
</style>
