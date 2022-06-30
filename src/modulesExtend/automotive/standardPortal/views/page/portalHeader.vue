<template>
    <div class="portalHeader">
         <div class="portalHeader-logo"></div>
         <div class="portalHeader-btn">
             <span>欢迎您,{{userInfo.mi}}</span>&emsp;<span>|&emsp;</span><span class="loginOut" @click='loginOut'>退出</span>
         </div>
    </div>
</template>
<script>
    import {EcoMessageBox} from '@/components/messageBox/main.js'
    import {getUserSelfInfo} from '../../service/service.js'
    export default {
        name:'portalHeader',
        data(){
            return {
                 userInfo:{}
            }
        },created(){
            window.portalHeader = this;
            getUserSelfInfo().then(res=>{
                this.userInfo = res.data;
            })
        },
        methods:{
            loginOut(){
                var that  = this;
                let confirmYesFunc = function(){
                    sessionStorage.removeItem('ecoToken');
                    // window.location.href = '/index.html#/login';
                    window.location.href = '/#/login';
                }
                let options = { center: true,lockScroll:false,customClass:'exitbox'}
                EcoMessageBox.confirm('退出系统?','',options,confirmYesFunc);
            }
        }
    }
</script>
<style scoped>
.portalHeader{
    position: absolute;
    top:0px;
    bottom:0px;
    right:0px;
    left:0px;
    height: 70px;
    background-color: #fff;
    min-width: 1300px;
}
.portalHeader .portalHeader-logo,
.portalHeader .portalHeader-btn{
    position: absolute;
    top:50%;
    transform: translateY(-50%);
}
.portalHeader .portalHeader-logo{
    left:80px;
    height:36px;
    width:250px;
    background:url("../../assets/img/headLogo.png") center center / 100% 100% no-repeat;;
}
.portalHeader .portalHeader-btn{
    right:80px;
    color:#606266;
    font-size:14px;
}
.loginOut{
    transition: color 0.3s linear;
    cursor: pointer;
}
.loginOut:hover{
    color:#409EFF;
}
</style>