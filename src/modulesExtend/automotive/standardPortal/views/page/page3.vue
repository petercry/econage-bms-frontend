<template>
    <div class='page3 componentPage'>
        <div class="pageHeader">
            <div class="pageHeaderBtn cursorP active">法规<span>趋势分析</span></div>
            <div class="more" @click='goMore()'>more&ensp;></div>
        </div>
        <div class="pageBody">
            <div class="pageBodyItem cursorP fontWeight" @click='goMore(item.id)' v-for='(item,index) in dataList' :key='"page3"+item.id'>
                 <div class='column1'><span class="marginR5 fontWeight">·</span><span>{{item.title}}</span></div>
                 <div class='column2'>{{item.createDate?item.createDate.split(' ')[0]:''}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import {standardMessageQueryBook} from '../../service/service.js'
    export default {
        data(){
            return {
                dataList:[]

            }
        },
        created(){
            this.initCase();
        },
        methods:{
            goMore(id){
                let str = '{type:1472818901342150658}';
                if(id){
                    str = `{type:1472818901342150658,id:${id}}`;
                }
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL',str)
                localStorage.setItem('ecoSSORequestSource', 'standardInformationRelease')
                window.location.href = '/index.html#/sysInit'  
            },
            initCase(){
                standardMessageQueryBook('1472818901342150658').then(res=>{
                    console.log(res.data.rows)
                    this.dataList = res.data.rows;
                })
            }
                
        }
    }
</script>
<style scoped>
.page3{
    height: 240px;
    width:100%;
}
.page3 .pageBody{
    margin-top:15px;
    height: calc(100% - 55px);
    overflow-y:auto;
}
.page3 .pageBodyItem{
    display: flex;
    font-size:14px;
    color:#303133;
}
.page3 .pageBodyItem+.pageBodyItem{
    margin-top:10px;
}
.page3 .pageBodyItem .column1{
    flex: 1;
}
.page3 .pageBodyItem .column2{
   width:120px;
   color:#ccc;
   font-weight: 500;
}
</style>