<template>
    <div class='page2 componentPage'>
        <div class="pageHeader">
            <div class="pageHeaderBtn cursorP active">法规实施<span>时间预警</span></div>
            <div class="more" @click='goMore()'>more&ensp;></div>
        </div>
        <div class="pageBody">
            <div class="pageBodyItem cursorP fontWeight" v-for='(item,index) in dataList' :key='item.id' @click='goMore(item.id)'>
                 <div class='column1'><span class="marginR5 fontWeight">·</span><span>{{item.regulationCode}}</span></div>
                 <div class="nameColumn">{{item.regulationName}}</div>
                 <div class='column2' :title='`NT:${item.implTimeNt||"暂无时间"}`'>NT:{{item.implTimeNt||'暂无时间'}}</div>
                 <div class='column3' :title="`TT:${item.implTimeTt||'暂无时间'}`">TT:{{item.implTimeTt||'暂无时间'}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import {queryRegulationTrack} from '../../service/service.js'
    export default {
        data(){
            return {
                dataList:[],
            }
        },
        created(){
            this.getData();
        },
        methods:{
            goMore(value){
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', value||'')
                localStorage.setItem('ecoSSORequestSource', 'regulatoryTrackingForm')
                window.location.href = '/index.html#/sysInit'
            },
            getData(){
                queryRegulationTrack().then(res=>{
                    this.dataList = res.data.rows;
                })
            }
        }
    }
</script>
<style scoped>
.page2{
    height: 240px;
    width:100%;
}
.page2 .pageBody{
    margin-top:15px;
    height: calc(100% - 55px);
    overflow-y:auto;
}
.page2 .pageBodyItem{
    display: flex;
    font-size:14px;
    color:#303133;
}
.page2 .pageBodyItem+.pageBodyItem{
    margin-top:10px;
}
.page2 .pageBodyItem .column1{
    width:150px;
}
.page2 .pageBodyItem .nameColumn{
    width:100px;
}
.page2 .pageBodyItem .column2,
.page2 .pageBodyItem .column3{
    text-align: center;
    flex:1;
    min-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>