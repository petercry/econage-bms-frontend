<template>
  <div class="reloginVue">
        <el-row>
            <el-col :span="8">
               <div class="reloginImg">
                     <img src="../../assets/img/fail.jpg" align="absmiddle">
               </div>
            </el-col>
            <el-col :span="16">
                <div class="reloginDesc">
                     <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$t('message.msg1')}}</span>
                     <span class="timeMinute" v-if="this.min > 0">{{min}}分</span>
                     <span class="timeSecode">{{sec}}{{$t('common.second')}}</span>
                    <span>{{$t('message.msg2')}}</span>
                </div>
                <div class="reloginIpt">
                            <el-row>
                                <el-col :span="6">
                                    <span class="iptDesc">{{$t('common.username')}}:</span>
                                </el-col>

                                <el-col :span="18">
                                    <span><input type="text" name="user" v-model="iptName" class="iptUser"  readonly/></span>
                                </el-col>

                            </el-row>

                            <el-row style="margin-top:10px;">
                                <el-col :span="6">
                                    <span class="iptDesc">{{$t('common.password')}}:</span>
                                </el-col>
                                <el-col :span="18">
                                     <span><input type="password" id="reloginPass" name="user" v-model="iptPassword" class="iptUser"  @keyup.enter="login"/></span>
                                </el-col>
                            </el-row>
                           
                </div>
                <div class="mt10 reloginBtn">
                        <el-button type="primary" @click="login">{{$t('common.login')}}</el-button>
                </div>
            </el-col>
        </el-row>
  </div>
</template>
<script>

import ecoContent from "@/components/pageAb/ecoContent.vue";
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import {getUserSelfInfo,loginAjax} from '../../service/service.js'

 export default {
     components:{
          ecoContent,
     },
     data(){
         return{
             un:'',
             pw:'',
             secs:120,
             min:0,
             sec:0,

             iptName:'',
             iptPassword:''             
         }
     },
     computed:{
     
     },
     created(){
           
     },
     mounted(){
            this.init();
            document.getElementById('reloginPass').focus();
     },
    
     methods: {
            init(){

                 getUserSelfInfo().then((response)=>{
                        this.iptName = response.data.hrLink;
                 });

                let that = this;
                for(let i=1;i<= this.secs;i++) {
                    window.setTimeout(function(){
                          that.update(i);
                    }, i * 1000);
                }
            },

            update(num){
                if(num == this.secs) {
                    EcoUtil.getSysvm().logout();
                }else{
                    var  printnr = this.secs-num; 
                    this.min = parseInt(printnr / 60); 
                    this.sec = printnr % 60 ; 
                }
            },

            login(){
                let _data = {};
                _data.username = this.iptName;
                _data.password = this.iptPassword;
                loginAjax(_data).then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                        EcoUtil.getSysvm().checkSessionDone();

                        let doObj = {}
                        doObj.action = 'reloadSessionFacadeCallBack';
                        doObj.data = {};
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);

                });
            }
     },
     watch: {

    }

 }
</script>

<style scope>
.reloginVue{
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    background-color: #fff;
}

.reloginVue .reloginImg{

    margin:40px 10px 10px 10px;
    text-align: center;
    vertical-align: middle;
}

.reloginVue .reloginDesc{
    margin:10px;
    font-size:14px;
    font-weight:bold;
    color:#030381
}
.reloginVue .timeMinute{
    color:red;
}

.reloginVue .timeSecode{
    color:red;
}

.reloginVue .reloginIpt{
    margin:10px;
}

.reloginVue .iptDesc{
    font-size: 12px;
    font-weight: bold;
    width:100px;
    position: relative;
}

.reloginVue .iptUser{
    font-size: 12px;
    width: 150px;
    background-color:#EFF6FD;
    border:0px;
    height:20px;
    line-height: 20px;
}

.reloginVue .mt10{
    margin-top:20px;
}

.reloginVue .reloginBtn{
    text-align: center;
}

</style>
