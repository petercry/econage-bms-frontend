<template>
    <div class="page1 componentPage">
          <div class="pageHeader">
              <div class="pageHeaderBtn cursorP" @click='changeActive(true)' :class='{active:active}'>标准<span>动态</span></div>
              <div class="pageHeaderBtn cursorP" @click='changeActive(false)' :class='{active:!active}'>标准征求<span>意见</span></div>
              <div class="more" @click='goMore'>more&ensp;></div>
          </div>
          <div class="pageBody" v-show='active'> 
              <div class="pageBodyItem cursorP fontWeight" :key='item.id' @click='goDetails(item.id)' v-for='(item,index) in dataList'><span class="marginR5 fontWeight">·</span>{{item.title}}</div>
          </div>
          <div class="pageBody" v-show='!active'>
            <div class="pageBodyItem cursorP fontWeight" :key='item.id+"-type"' @click='goDetails(item.id)' v-for='(item,index) in dataList2'><span class="marginR5 fontWeight">·</span>{{item.title}}</div>
         </div>
    </div>
</template>
<script>
    import {standardMessageQueryBook} from '../../service/service.js'
    export default {
        data(){
            return {
                active:true,
                dataList:[],
                dataList2:[]
            }
        },
        created(){
            this.initCase();
        },
        methods:{
            goMore(){
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', `{type:${this.active?"1471683239838654466":"1471682873621389314"}}`)
                localStorage.setItem('ecoSSORequestSource', 'standardInformationRelease')
                window.location.href = '/index.html#/sysInit'  
            },
            goDetails(id){
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', `{type:${this.active?"1471683239838654466":"1471682873621389314"},id:${id}}`);
                localStorage.setItem('ecoSSORequestSource', 'standardInformationRelease')
                window.location.href = '/index.html#/sysInit'  
            },
            initCase(){
                Promise.all([
                  standardMessageQueryBook('1471683239838654466'),//标准动态
                  standardMessageQueryBook('1471682873621389314')
                ]).then(resList=>{
                    this.dataList = resList[0].data.rows;
                    this.dataList2 = resList[1].data.rows;
                })
            },
            changeActive(val){
                 if(this.active===val){
                     return;
                 }
                 this.active = val;
            }
        }
    }
</script>
<style scoped>
.page1{
    height: 240px;
    width:100%;
    padding: 0px 30px;
    box-sizing: border-box;
}
.page1 .pageBody{
    margin-top:15px;
    height: calc(100% - 55px);
    overflow-y:auto;
}
.page1 .pageBodyItem{
    font-size:14px;
    color:#303133;
}
.page1 .pageBodyItem+.pageBodyItem{
    margin-top:10px;
}
</style>