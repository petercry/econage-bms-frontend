<template>
<div  class="webContent webEcoSettingVue">

        <el-row :gutter="20">
              <el-col v-for="oneItem in menuArray" :key="oneItem.id" :span="6">
                  <el-card shadow="hover" @click.native="clickMenu(oneItem)" class="menuCard">
                      <el-row>
                          <el-col :span="22"><i class="icon iconfont " v-bind:class="[ (false && oneItem.iconCls!='')?oneItem.iconCls:'icon-fenlei']"></i>  {{oneItem.name}}</el-col>
                          <el-col :span="2"><i class="el-icon-arrow-right"></i></el-col>
                      </el-row>
                  </el-card>
              </el-col>
        </el-row>


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

        clickMenu(item){
              let menuTab = {};
              let r_func = "{menuTarget:'IFRAME',tabKey:'"+item.id+"tab',href_link:'"+item.href+"',fullScreen:true}";
              menuTab.desc = item.key;
              menuTab.r_func = r_func;
              menuTab.reload = true;
              menuTab.webCloseBtn = true;
              this.SET_MENU_TAB_CLICK(menuTab);
        }
   
  },

  destroyed() {}
};
</script>



<style>
.webRootVue .webEcoSettingVue{
    margin-top:20px;
    padding:20px !important;
    background-color: #fff;
    min-height: 350px;
}

.webEcoSettingVue .menuCard{
    cursor:pointer;
    font-size: 14px;
    background-color: #f9f8f8;
    border: 1px solid #e8e8e8;
}
</style>
