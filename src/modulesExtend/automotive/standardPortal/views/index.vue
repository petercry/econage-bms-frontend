<template>
    <div class="standardPortalIndex">
         <portalHeader></portalHeader>
         <eco-content top='70px' height='70px' type='tool' style='min-width: 1300px;overflow: hidden;background-color: rgba(241, 244, 249, 1);'>
              <div class="menuBox">
                  <div class="menuItem cursorP" @click='changeActivePage(item.name)' :class='{active:activeName===item.name}' v-for='(item,index) in menuList' :key='"menuItem"+index'>
                        <img class="menuItemImg" :src='activeName===item.name?item.lightIconUrl:item.iconUrl'></img>
                        <div>{{item.label}}</div>
                  </div>
                  <div class="menuSearchBox">
                    <el-select v-model="searchContent.selectType" size='medium'  placeholder="请选择">
                        <el-option label='标准' value='1'></el-option>
                        <el-option label='业务指南' value='2'></el-option>
                    </el-select>
                    <el-input size='medium'  placeholder='请输入查询内容' @keyup.enter.native="searchCase" v-model='searchContent.content' ></el-input>
                    <div class="searchBtn" @click='searchCase'>查询</div>
                  </div>
              </div>
        </eco-content>
        <!-- 150px box-sizing: border-box;padding: 0px 200px;-->
        <eco-content top='170px' bottom='0px' type='tool' style="overflow-y:auto;overflow-x:hidden;min-width: 1300px;background-color: #fff;">
            <keep-alive>
                <router-view ref='childPage' @changeDialog='changeDialog'></router-view>
           </keep-alive>
        </eco-content>
        <dialogPage :dialog="dialog"></dialogPage>
    </div>
</template>
<script>
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import portalHeader from './page/portalHeader.vue'
    import dialogPage from './component/dialog.vue'
    export default {
        name:'standardPortalIndex',
        data(){
            return {
                dialog:{
                    title:'',
                    show:false,
                    width:'',
                    height:'',
                    top:'',
                    url:''
                },
                activeName:'portalIndex',
                searchContent:{
                    selectType:'',
                    content:''
                },
                menuList:[
                    {
                        name:'portalIndex',
                        label:'首页',
                        iconUrl:require('../assets/img/1.png'),
                        lightIconUrl:require('../assets/img/1_w.png'),
                    },
                    {
                        name:'page2',
                        label:'标准化管理',
                        iconUrl:require('../assets/img/3.png'),
                        lightIconUrl:require('../assets/img/3_w.png'),
                    },
                    {
                        name:'page3',
                        label:'法规智库',
                        iconUrl:require('../assets/img/4.png'),
                        lightIconUrl:require('../assets/img/4_w.png'),
                    },
                    {
                        name:'page4',
                        label:'常见问题Q&A',
                        iconUrl:require('../assets/img/2.png'),
                        lightIconUrl:require('../assets/img/2_w.png'),
                    },
                    {
                        name:'page5',
                        label:'下载专区',
                        iconUrl:require('../assets/img/6.png'),
                        lightIconUrl:require('../assets/img/6_w.png'),
                    },
                    {
                        name:'page6',
                        label:'我的',
                        iconUrl:require('../assets/img/5.png'),
                        lightIconUrl:require('../assets/img/5_w.png'),
                    },
                    {
                        name:'page7',
                        label:'集团标准',
                        iconUrl:require('../assets/img/5.png'),
                        lightIconUrl:require('../assets/img/5_w.png'),
                    }
                ]

            }
        },
        components:{
            ecoContent,
            portalHeader,
            dialogPage
        },
        created(){
            window.portalIndex = this;
            if(this.$route.name!==this.activeName){
                this.$router.push({name:this.activeName})
            }
        },
        methods:{
            searchCase(){
                if(!this.searchContent.selectType){
                    this.$message.warning('未选择搜索类型');
                    return 
                }
                if(this.searchContent.content){
                    localStorage.setItem('ecoSysLoginAction', 'sso')
                    localStorage.setItem('ecoSSOTargetURL', encodeURIComponent(JSON.stringify(this.searchContent).replace(/%/ig,'%25')))
                    localStorage.setItem('ecoSSORequestSource', 'portalStandardQuery')
                    window.location.href = '/index.html#/sysInit'
                }
            },
            callBack(data){
                this.$refs.childPage.callAction(data);
            },
            changeDialog(data){
                this.dialog.title = data.title;
                this.dialog.show = data.show;
                this.dialog.width = data.width;
                this.dialog.height = data.height;
                this.dialog.top = data.top;
                this.dialog.url = data.url;
                console.log(data);
            },
            goOASystem() {
                //跳转oa平台
                // window.location.href = '/index.html#/workPlatform/mainPage'
                // this.$router.push({name: 'planList'})
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', '')
                localStorage.setItem('ecoSSORequestSource', 'DongfengOA')
                window.location.href = '/index.html#/sysInit'
            },
            changeActivePage(val){
                if(this.activeName === val){
                    return;    
                }
                if(val === "page7"){
                    return this.$message.warning("建设中请期待...");
                }
                this.activeName = val;
            }
        },
        
    }
</script>
<style scoped>
    .standardPortalIndex{
        color:#303133;
        font-size: 14px;
    }
.standardPortalIndex .menuBox{
     position: absolute;
     /* 200px */
     left:80px; 
     right:80px; 
     top:0px;
     bottom:0px;
     display: flex;
     min-width: 1300px;
}
.standardPortalIndex .menuItem{
    position: relative;
    color:#909399;
    width:120px;
    text-align: center;
}
.standardPortalIndex .menuItem img{
    width:24px;
    height:24px;
    margin:15px 0px 0px;
}
.standardPortalIndex .menuItem +.menuItem{
    margin-left:1px;
}
.standardPortalIndex .menuItem::before{
    content: '';
    position: absolute;
    right:-1px;
    width:1px;
    height:30px;
    background-color: #ddd;
    top:50%;
    transform: translateY(-50%);
}
.standardPortalIndex .menuItem.active{
    background-color: rgb(68,141,236);
    color:#fff;
}
.standardPortalIndex .menuSearchBox{
     border:1px solid #DCDFE6;
     display: flex;
     position: absolute;
     right:0px;
     top:50%;
     transform: translateY(-50%);
     border-radius: 5px;
     overflow: hidden;

}
.standardPortalIndex .menuSearchBox .el-select{
    width:150px;
}
/* .standardPortalIndex .menuSearchBox .el-input{
    width:350px;
} */
.standardPortalIndex .menuSearchBox /deep/ .el-input .el-input__inner{
    border-width: 0px;
    border-radius: 0px;
}

.standardPortalIndex .searchBtn{
    height:36px;
    background-color: rgb(68,141,236);
    width:100px;
    text-align: center;
    line-height: 36px;;
    color:#fff;
}
</style>