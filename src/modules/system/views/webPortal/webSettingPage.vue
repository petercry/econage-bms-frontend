<template>
<div style="padding:20px 20px 0;" class="webContent webSettingVue">

    <el-tabs v-model="activeName" v-if="menuArray.length > 0">
        <el-tab-pane  :label="item.name" :name="item.id" v-for="item in menuArray[0].children" :key="item.id">
            <el-row :gutter="20">
              <el-col v-for="oneItem in item.children" :key="oneItem.id" :span="6">

                  <el-card shadow="hover" @click.native="clickMenu(oneItem)" class="menuCard">
                      <el-row>
                          <el-col :span="22"><i class="icon iconfont " v-bind:class="[( false &&  oneItem.iconCls!='')?oneItem.iconCls:'icon-fenlei']"></i>  {{oneItem.name}}</el-col>
                          <el-col :span="2"><i class="el-icon-arrow-right"></i></el-col>
                      </el-row>
                  </el-card>

              </el-col>
            </el-row>
           

        </el-tab-pane>
    </el-tabs>

</div>
</template>

<script>
import {EcoUtil} from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getMenuTreeViewAjax} from '../../service/service.js'
export default {
  name:'mainPage',
  components: {
   
  },
  data() {
    return {
         menuArray:[],
         menuObj:{},
         activeName:null
    };
  },
  created() {
      this.getMenuTreeViewFunc();
  },
  mounted() {

  },
  methods: {
        ...mapMutations([
            'SET_MENU_TAB_CLICK',
        ]),
   
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
                            if(item.desc == 'SYS-SETTING'){
                                tempMenuArray.push(item);
                            }
                            
                      })
                  }
                  this.menuArray = tempMenuArray;
                  if(this.menuArray && this.menuArray.length > 0 && this.menuArray[0].children && this.menuArray[0].children.length > 0){
                      this.activeName = this.menuArray[0].children[0].id;
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

        clickMenu(item){
              let menuTab = {};
              let r_func = "{menuTarget:'IFRAME',tabKey:'"+item.id+"tab',href_link:'"+item.href+"',fullScreen:true}";
              menuTab.desc = item.key;
              menuTab.r_func = r_func;
              menuTab.reload = true;
              menuTab.webCloseBtn = true;
              //window.sysvm.openDialog('','/'+item.href,1198,500,'15vh',null,{fullscreen:true});
              this.SET_MENU_TAB_CLICK(menuTab);
        }
   
  },

  destroyed() {}
};
</script>



<style>
.webSettingVue{
    margin-top:20px  !important;
    padding:20px !important;
    background-color: #fff;
    min-height: 350px;
}


.webSettingVue .el-tabs__nav-scroll{
  text-align: center;
}

.webSettingVue .el-tabs__nav{
    float: unset;
}

.webSettingVue .el-tabs__nav-wrap::after{
  background-color:unset;
}

.webSettingVue .el-tabs__active-bar{
    display:none;
}

.webSettingVue .menuCard{
    cursor:pointer;
    font-size: 14px;
    background-color: #f9f8f8;
    border: 1px solid #e8e8e8;
}
</style>
