<template>
    <router-view ></router-view>
</template>
<script>

  import {sysEnv} from '@/modules/portalIndex/config/env'
  import {loginAjax,getRoleExistsAdmin} from '@/modules/portalIndex/service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations,mapState} from 'vuex'
  export default{
      name:'frame',
      created(){
          this.initTheme();
          this.handleLogin();
          this.getRoleExistsAdmin('portal_link_item_manage');
          window.sysvm = this;
      },
      computed: {
          ...mapState(['breadList'])
      },
      methods: {
          ...mapMutations(['SET_BREAD','SET_ROLE']),
          getRoleExistsAdmin(key){
              getRoleExistsAdmin(key).then(res=>{
                this.SET_ROLE({
                    key:key,
                    value:res.data
                })
              }).catch(e=>{})
          },
          /*初始化主题*/
          initTheme(){
                let theme = this.$cookies.get('ecoTheme');
                theme  = "1ba5fa";
                this.$cookies.set('ecoTheme',theme);
                this.setTheme(theme);
          },

          setTheme(color){
              EcoUtil.toggleClass(document.body,"custom-"+color);
          },
          handleLogin(){
                if(sysEnv == 0){
                    loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
                }
          },
          logout(){
              location.href="/#/login"
          }

      },
      watch:{
        // '$route.name'(valNew,valOld){
        //     let index = null;
        //     for (let i=0;i<this.breadList.length;i++){//跳转路由在路由列表中是否存在，找到index
        //         if (this.breadList[i].to&&this.breadList[i].to.name==valNew){
        //         index = i;
        //         }
        //     }
        //     if (index&&(this.breadList.length-1>index)){//这个路由是否为数组末尾，不是则再判断是不是返回操作
        //         if (this.breadList[index+1].to&&this.breadList[index+1].to.name==valOld){//确认是返回操作
        //             let breadList = this.breadList.slice(0,index);
        //             this.SET_BREAD(breadList);
        //         }
        //     }
        // }
      }
  }
</script>
<style>


</style>
