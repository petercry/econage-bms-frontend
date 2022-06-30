<template>
    <div class="personalIndex">
        <div class="personalAside">
          <div class="personalAsideTop">
            <div style="position:absolute;left:20px;top:30px">
              <ecoUserImg ref="ecoUserImg" :name="userInfo.mi" :userId="userInfo.id"></ecoUserImg>
            </div>
            <div class="ellipsis name">{{userInfo.mi}}</div>
            <div class="ellipsis desc" :title="userInfo.departments.length?userInfo.departments[0].orgPathI18nText:''">{{userInfo.departments.length?userInfo.departments[0].orgPathI18nText:''}}</div>
          </div>
          <div class="personalAsideMenu">
            <div class="menuItem" v-if="$route.query.fromLogin!=='Y'" :class="{active:$route.name=='personalInfo'}" @click="$router.push({name:'personalInfo'})">个人信息</div>
            <div class="menuItem" :class="{active:$route.name=='personalPassword'}" @click="$router.push({name:'personalPassword'})">修改密码</div>
            <div class="menuItem" v-if="$route.query.fromLogin!=='Y'" :class="{active:$route.name=='personalFastOpinion'}" @click="$router.push({name:'personalFastOpinion'})">常用意见</div>
            <div class="menuItem" v-if="$route.query.fromLogin!=='Y'" :class="{active:$route.name=='personalRemind'}" @click="$router.push({name:'personalRemind'})">消息提醒</div>
            <div class="menuItem" v-if="personalPortalTypeShow" :class="{active:$route.name=='personalPortalType'}" @click="$router.push({name:'personalPortalType'})">登录设置</div>
          </div>
        </div>

        <div class="personalMain">
            <router-view ></router-view>
        </div>
     </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoUserImg from '@/components/tool/ecoUserImg.vue'
import {getPersonalInfo} from '@/modules/manage/service/service.js'
import {mapState,mapMutations} from 'vuex'
import {sysEnv} from '../../config/env.js'
import EcoUtil from '@/components/util/main.js'

export default{
  name:'personalIndex',
  components:{
      ecoUserImg,
      ecoToolTitle
  },
  data(){
    return {
      userInfo:{
        id:'',
        mi:'',
        departments:[],
      },
      personalPortalTypeShow:false
    }
  },
  computed:{

  },
  mounted(){
      this.getData();
      this.addMonitor(); //添加监听
      if (parent.window.sysSetting&&parent.window.sysSetting.userPortal&&parent.window.sysSetting.userPortal.enable){
        this.personalPortalTypeShow = true;
      }
  },
  methods: {
    addMonitor(){
        let callBackDialogFunc = function(obj){
            if(obj && (obj.action == '')){ 
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'personalIndex');
    }, 
    getData(){
      getPersonalInfo().then(res=>{
        this.userInfo = Object.assign(this.userInfo,res.data);
      }).catch(e=>{})
    },
    
  },
  watch: {

  }
}
</script>
<style scope>
.personalIndex{
  position:fixed;
  top:0px;
  left:0px;
  bottom:0px;
  right:0px;
  background-color: rgb(245, 245, 245);
}
.personalIndex .personalAside{
   position:absolute;
   top:2%;
   left:20px;
   bottom:2%;
   width:270px;
}
.personalIndex .personalAsideTop{
   position:absolute;
   top:0;
   height: 120px;
   width:270px;
   background-color: #fff;
   padding: 30px 20px 30px 100px;
   box-sizing: border-box;
}
.personalIndex .personalAsideMenu{
   position:absolute;
   top:140px;
   bottom:0;
   width:270px;
   background-color: #fff;
}
.personalIndex .personalMain{
  position:absolute;
  left:305px;
  right:20px;
  top:2%;
  bottom:2%;
  background-color:#fff ;
}


.personalAsideTop .name{
  font-size: 16px;
  line-height: 30px;
}
.personalAsideTop .desc{
  font-size: 14px;
  color: #aaa;
  line-height: 20px;
}
.menuItem {
  line-height: 48px;
  height: 48px;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
}
.menuItem:hover,.menuItem.active{
  color: #1CA5FA;
}
</style>
