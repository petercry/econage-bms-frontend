<template>
   <el-card  :body-style="{ padding: '0 0px'}" style="" shadow='never' class="workPlanmodule">
        <el-row>
            <el-col :span="7" style="height:222px;">
                <weather></weather>
            </el-col>
            <el-col :span="17">
                <ecoCalendar v-model="selectDay"></ecoCalendar>
            </el-col>
        </el-row>

        <div class="e9-block clearfix">
            <div class="title">新闻动态<i class="el-icon-more" @click="goNewsMore"></i></div>
            <div style="height:300px;overflow-y:auto;">
                <el-row v-for="(item,index) in newsList" :key="item.id" class="itemRow" @click.native="goNewsDetail(item)">
                    <el-col :span="18" class="itemTitle">
                        <div class="rsfTitle">{{item.title}}</div>
                    </el-col>
                    <el-col :span="6" class="itemDate">
                        <span >{{item.createDate?item.createDate.substring(0,10):null}}</span>
                    </el-col>
                </el-row>
                <div v-if="newsList.length==0" class="fz12">{{$t('common.hasNone')}}</div>
            </div>
        </div>

        <div class="e9-block clearfix">
            <div class="title">通知公告<i class="el-icon-more" @click="goNoticesMore"></i></div>
            <div style="min-height:300px;max-height:115px;overflow:auto;">
                <el-row v-for="(item,index) in noticesList" :key="item.id" class="itemRow" @click.native="goNewsDetail(item)">
                    <el-col :span="18" class="itemTitle">
                        <div class="rsfTitle">{{item.title}}</div>
                    </el-col>
                    <el-col :span="6" class="itemDate">
                        <span >{{item.createDate?item.createDate.substring(0,10):null}}</span>
                    </el-col>
                </el-row>
                <div v-if="noticesList.length==0" class="fz12">{{$t('common.hasNone')}}</div>
            </div>
        </div>

   </el-card>
</template>

<script>
  import {getNewsList} from "../../../service/service.js";
  import {mapState,mapMutations} from 'vuex'
  import ecoCalendar from '../../../views/components/ecoCalendar.vue'
  import weather from '../../../views/components/weather.vue'
  import EcoDate from '@/components/date/main.js'

  export default {
    components:{
        weather,
        ecoCalendar
    },
    name:'e9WorkPlanModule',
    data(){
        return {
            newsList:[],
            noticesList:[],
            selectDay:'',
            newsBaseInfo:{
                page:1,
                rows:8,
                total:0,
                type:'news',
            },
            noticeBaseInfo:{
                page:1,
                rows:8,
                total:0,
                type:'notice',
            }

        }
    },

    created(){
        this.getNewsListFunc();
        this.getNoticesListFunc();
    },
    mounted() {

    },
    methods: {
        ...mapMutations([
            'SET_MENU_TAB_CLICK'
        ]),

        getMeetInfoCalendar(date){

        },
        getWorkInfoCalendar(date){

        },
        goNoticesMore(){
            let tabObj = {};
            tabObj.desc = '通知公告'
            let goPage = "news/index.html#/news/notice/通知公告";
            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'noticeList',href_link:'" + goPage + "'}"
            tabObj.reload = true;
            tabObj.clearIframe = true;
            window.sysvm.doTab(tabObj);
        },

        goNewsDetail(item){
            let tabObj = {};
            tabObj.desc = item.title;
            let goPage = "news/index.html#/newsDetail/"+item.id;
            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'newsDetail" + item.id + "',href_link:'" + goPage + "'}"
            tabObj.reload = true;
            tabObj.clearIframe = true;
            window.sysvm.doTab(tabObj);
        },

        goNewsMore(){
            let tabObj = {};
            tabObj.desc = '新闻动态'
            let goPage = "news/index.html#/news/news/新闻动态";
            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'newsList',href_link:'" + goPage + "'}"
            tabObj.reload = true;
            tabObj.clearIframe = true;
            window.sysvm.doTab(tabObj);
        },

        getNewsListFunc(){
            getNewsList(this.newsBaseInfo).then((response)=>{
                this.newsList = response.data.rows;
            }).catch((error)=>{ });
        },
        getNoticesListFunc(){
            getNewsList(this.noticeBaseInfo).then((response)=>{
                this.noticesList = response.data.rows;
            }).catch((error)=>{ });
        }
    },
    destroyed() {

    },
    watch:{
        'selectDay'(val){
            let date = EcoDate.formatDateDefault(val);
            this.$emit("selectDay",date)
            this.getMeetInfoCalendar(date);
            this.getWorkInfoCalendar(date);
        }
    }
  }
</script>
<style scoped>

.workPlanmodule .itemRow{
    padding-left:10px;
    padding-right:10px;
    border-bottom:1px solid #fbf7f7;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color:#404040;
}

.workPlanmodule .itemRow:hover{
    background-color:#fafafa;
    cursor: pointer;
}

.workPlanmodule .itemTitle{
    font-family: "Hiragino Sans GB", "STHeiti", "Microsoft Yahei";
}

.workPlanmodule .itemDate{
    text-align: right;
    color:rgb(139, 139, 139);
}

.workPlanmodule .rsfTitle{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}


    .meet-item{
        position: relative;
        cursor: pointer;
    }
    .meet-item .meet-info{
        height: 20px;
        line-height: 20px;
        color: #262626;
        font-size: 12px;
    }
    .meet-item .status{
        position: absolute;
        top: 8px;
        right: 24px;
        line-height: 20px;
        font-size: 12px;
    }
    .meet-item .status.red{
       color: #e03b3a;
    }
    .meet-item .status.blue{
       color: #1ba5fa;
    }
    .meet-item .status.green{
       color: #08cc15;
    }
   .note-item{
       padding: 10px 0;
       font-size: 12px;
       cursor: pointer;
   }
   .note-item .item-title{
       line-height: 16px;
       color: #262626;
   }
   .note-item .item-title .ball{
       line-height: 16px;
       display: inline-block;
       height: 8px;
       width: 8px;
       border-radius: 4px;
       margin-right: 10px;
       /* vertical-align: middle; */
   }
   .note-item .item-title .ball.red{
       background-color: #e03b3a;
   }
   .note-item .item-title .ball.blue{
       background-color: #1ba5fa;
   }
   .note-item .item-title .ball.green{
       background-color: #08cc15;
   }
   .note-item .time{
       line-height: 20px;
       color: #262626;
       margin-right: 16px;
   }
   .note-item .desc{
       line-height: 20px;
       color: #bebebe;
   }
</style>
