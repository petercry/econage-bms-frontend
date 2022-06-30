<template>
<div>
  <el-dropdown style="position: absolute;top: 4px;right: 24px;z-index:9999999;" size="medium">
    <span class="el-dropdown-link" style="font-size:16px;">
      {{list.filter(item=>item.url==$route.name).map(item=>{return item.desc.toUpperCase()}).join('')||'切换门户'}}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, index) in list.filter(item=>item.url!=$route.name)" :key="index" @click.native="setHome(item)">{{item.desc.toUpperCase()}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <div v-if="loginUser.id">
    <router-view ></router-view>
  </div>
</div>
</template>
<script>

  import {projectDefaultHome,projectHomeList} from '@/modules/system/service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations,mapState} from 'vuex'
  export default{
      name:'projectPortalRoot',
      data() {
        return {
          list:[]
        }
      },
      computed: {
          ...mapState(['loginUser'])
      },
      created(){
        this.projectHomeList();
        // if (!window.projectHomeSetting){
        //   this.projectDefaultHome();
        // }else{
        //   this.$router.replace({name:window.projectHomeSetting.url}).catch(e=>{})
        // }
      },
      methods: {
        projectDefaultHome(){
          projectDefaultHome().then(res=>{
            this.setHome(res.data)
          }).catch(e=>{})
        },
        projectHomeList(){
          projectHomeList().then(res=>{
            this.list = res.data;
            if (this.list.length>0){
              this.setHome(this.list[0]);
            }
          }).catch(e=>{})
        },
        setHome(obj){
            window.projectHomeSetting = obj;
            if (window.projectHomeSetting&&window.projectHomeSetting.url){
              this.$router.replace({name:window.projectHomeSetting.url}).catch(e=>{})
            }
        }
      }
  }
</script>
<style>
 .projectPortal .el-tabs--border-card>.el-tabs__header{
	 background: #f5f5f5;
 }
 .projectPortal .el-tabs--border-card>.el-tabs__header .el-tabs__item{
	line-height: 40px;
	height:40px;
	background: #f5f5f5;
}
.projectPortal .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
	color:#003b90;
	border-bottom:1px solid #003b90;
	background: #f5f5f5;
}
.projectPortal .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled).is-active:hover{
	color:#003b90;
}
.projectPortal .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):not(.is-active):hover{
	color:#003b90;
}
.projectPortal .el-tabs__active-bar{
	background-color: #003b90;
}
.projectPortal .el-tabs__item.is-active{
	color:#003b90;
}
.projectPortal .el-tabs__item:hover{
	color: #003b90;
}

</style>
