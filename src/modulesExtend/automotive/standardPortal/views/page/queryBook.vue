<template>
    <div class="queryBook">
        <div class="queryBookLogo">
            <img src="../../assets/img/alert.png" alt="">
        </div>
        <div class="queryBookContent" id='queryBookContent'>
            <div class="queryBookContentBox" id='queryBookContentBox' style="margin-left: 0px;">
                <div class="queryBookContentItem" v-for='(item,index) in dataList' :key='item.id' @click='goMore(item.id)'>
                    <div class="content ellipsis fontWeight">{{item.title}}</div>
                    <div class="time">{{item.createDate}}</div>
                </div>
                <!-- 无缝效果 多出一组 -->
                <div class="queryBookContentItem" v-if='dataList.length>2'  @click='goMore(dataList[0].id)'>
                    <div class="content ellipsis fontWeight">{{dataList[0].title}}</div>
                    <div class="time">{{dataList[0].createDate}}</div>
                </div>
                <div class="queryBookContentItem" v-if='dataList.length>2'  @click='goMore(dataList[1].id)'>
                    <div class="content ellipsis fontWeight">{{dataList[1].title}}</div>
                    <div class="time">{{dataList[1].createDate}}</div>
                </div>
            </div>
        </div>
        <div class="more cursorP" @click='goMore()'>more&ensp;></div>
    </div>
</template>
<script>
    import {standardMessageQueryBook} from '../../service/service.js'
    export default {
        data(){
            return {
               dataList:[],
               timer:null,
               offsetWidth:0,
               scrollIndex:0
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            goMore(value){
                localStorage.setItem('ecoSysLoginAction', 'sso')
                localStorage.setItem('ecoSSOTargetURL', (value?`{id:${value}}`:""))
                localStorage.setItem('ecoSSORequestSource', 'standardInformationRelease')
                window.location.href = '/index.html#/sysInit'  
            },
            getData(){
                standardMessageQueryBook('1472818779770249217').then(res=>{
                    res.data.rows.forEach(element => {
                         if(element.createDate){
                            element.createDate = element.createDate.split(' ')[0]; 
                         }
                    });
                    this.dataList = res.data.rows;
                    if(this.dataList.length>2){
                        this.$nextTick(function(){
                            let queryBookContent =  document.getElementById('queryBookContent');
                            this.offsetWidth = queryBookContent.offsetWidth;
                            queryBookContent.addEventListener('mouseenter',this.mouseover);
                            queryBookContent.addEventListener('mouseleave',this.mouseout)
                            this.timer = setInterval(this.scrollCase,3000);
                        })
                    }
  
                })
            },
            mouseout(){
                this.timer = setInterval(this.scrollCase,3000);
            },
            mouseover(){
                if(this.timer){
                    clearInterval(this.timer);
                    this.timer = null;
                }
            },
            scrollCase(){
                let boxNode =  document.getElementById('queryBookContentBox');
                if(this.scrollIndex<this.dataList.length){
                    let oldLeft = parseFloat(getComputedStyle(boxNode)['margin-left']);
                    let newLeft = oldLeft - (592+100);
                    boxNode.style.cssText =  `margin-left:${newLeft}px`;
                    this.scrollIndex++;
                }else{
                    this.scrollIndex = 0;
                    boxNode.style.cssText =  ` transition:none;margin-left:${0}px`;
                    // /此处6秒进入下个/
                }
         
            }
        }
    }
</script>
<style scoped>
.queryBook {
   position: relative;
   height:60px;
   /* max-content */
   width:100%; 
   background-color: rgba(241, 244, 249, 1);
   border-radius: 4px;
   overflow:hidden;
   display: flex;
   align-items: center;
}
.queryBook .queryBookLogo{
    width: 60px;
    height: 60px;
    line-height: 67px;
    text-align: center;
    background-color: #409EFF;
}
.queryBook .queryBookLogo img{
    width:27px;
    height: 20px;  
}
.queryBook .queryBookContent{
    /* flex:1; */
    width:1285px;
    /* margin:0px 80px 0 20px; */
    margin:0px auto;
    overflow: hidden;
}
.queryBook .queryBookContentBox{
    /* display: flex;
    align-items: center; */
    width: max-content;
    transition: margin 1s linear;
}
.queryBook .queryBookContentItem{
    background-color: #fff;
    cursor: pointer;
    display: flex;
    height: 35px;
    width:592px;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 20px;
    border-radius: 2px;
    float: left;
}
.queryBook .queryBookContentItem +.queryBookContentItem{
    margin-left:100px;
}
.queryBook .queryBookContentItem .conten{
    flex: 1;
}
.queryBook .queryBookContentItem .time{
    color:#ccc;
    width:100px;
    text-align: center;
}
.queryBook .more{
    color:#409EFF;
    position: absolute;
    right:25px;
    top:50%;
    transform: translateY(-50%);
    /* margin-right: 25px; */

}
</style>
