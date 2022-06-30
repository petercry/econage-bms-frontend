<template>
    <div class="header-menu-right">
        <div >
             <span class="userBtn">你好，{{userObj.mi}}</span> |
             <span class="logoutBtn" @click="logout">{{$t('common.exit')}}</span>
        </div>
    </div>
</template>
<script>
              
  import {loginOutAjax,getUserSelfInfo} from '@/modules/system2/service/service.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {mapState,mapMutations} from 'vuex'
  import {EcoUtil} from '@/components/util/main.js'

  export default {
    components:{

    },
    data(){
      return {
        userObj:{mi:''},
        showImg:true,
      }
    },
    computed: {
      ...mapState([
         'lang'
      ])
    },
    created(){
          window.headervm = this;
    },
    mounted() {
      this.getUserSelfInfo();
    },
    methods:{
        ...mapMutations([
            'SET_MENU_TAB_CLICK',
            'SET_THEME'
        ]),
        getUserSelfInfo(){
          getUserSelfInfo().then(res=>{
            if (res.data){
              this.userObj = res.data;
            }
          }).catch(e=>{})
        }, 
        logout(){
            var that  = this;
            let confirmYesFunc = function(){
                // loginOutAjax().then(function(){
                    sessionStorage.removeItem('ecoToken');
                    that.$router.replace({name:'login'});                
                // })
            }
            let options = { center: true,lockScroll:false,customClass:'exitbox'}
            EcoMessageBox.confirm(this.$t('message.exit')+'?','',options,confirmYesFunc);
        
        },
    },
    destroyed() {

    },
    watch:{
      
    }
  }
</script>
<style scoped>
  .header-menu-right {
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
  }

.header-menu-right i.icon{
    vertical-align: middle;
    margin-right: 10px;
    font-size: 20px;
    color: #666;
    cursor: pointer;
}


.header-menu-right .userBtn{
  font-size: 14px;
  margin:0px 10px 0px 10px;
}

.header-menu-right .logoutBtn{
  font-size: 14px;
  margin:0px 20px 0px 10px;
  cursor: pointer;
}
</style>
