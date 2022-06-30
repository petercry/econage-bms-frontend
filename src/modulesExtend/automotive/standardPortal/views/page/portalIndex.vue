<template>
    <div class="portalIndex">
        <el-row class="padding2">
            <el-col  :lg='6' :md='12'>
                <el-carousel ref='carousel'  @change='carouselChange' height='210px' style='width:100%' indicator-position='none' trigger='click' :autoplay='false'>
                    <el-carousel-item v-for='(item,index) in carouselList' :key='"carouselItem"+index'>
                        <img class="carouselImg" :src="item.bigSrc">
                    </el-carousel-item>
                </el-carousel>
                <div class="carouselBottom">
                    <div class="carouselTitle ellipsis" :title='carouselList[carouselIndex].title||"暂无"'>{{carouselList[carouselIndex].title||"暂无"}}</div>
                    <div class="carouselBtns" v-show='carouselList.length>1'>
                        <div class="carouselBtn-item cursorP" :class='{active:carouselIndex===index}' @click='carouseIndicatorlClick(index)'  v-for='(item,index) in carouselList' :key='"carouselBtn"+index'></div>
                    </div>
                </div>
            </el-col>
            <el-col  :lg='9' :md='12'>
                <page1></page1>
            </el-col>
            <el-col  :lg='9' :md='24'>
                <toDoCenter v-on='$listeners' ref='toDoCenter'></toDoCenter>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="marginTop2 padding2">
                <queryBook></queryBook>
            </el-col>
        </el-row>
        <el-row class="marginTop2 padding2">
            <el-col :lg='11' :md='24' :span='11'> 
               <page2></page2>
            </el-col>
            <el-col :span='1'>
                <div style='opacity: 0;'>123</div>
            </el-col>
            <el-col :lg='12' :span='11' :md='24'>
                <page3></page3>
             </el-col>
        </el-row>
        <el-row class='marginTop2 padding2'>
            <el-col :span='24'>
                 <echartPage></echartPage>
            </el-col>
        </el-row>
        <footerPage></footerPage>
    </div>
</template>
<script>
    import {baseUrl} from '../../config/env.js'
    import {getEETempToken,queryBookPohto} from '../../service/service.js'
    import page1 from './page1.vue'
    import page2 from './page2.vue'
    import page3 from './page3.vue'
    import queryBook from './queryBook.vue'
    import toDoCenter from './toDoCenter.vue'
    import echartPage from './echartPage.vue'
    import footerPage from './footerPage.vue'
    export default {
        data(){
            return {
                carouselIndex:0,
                carouselList:[{}],

            }
        },
        created(){
            this.initCase();
        },
        components:{
            page1,
            page2,
            page3,
            queryBook,
            toDoCenter,
            footerPage,
            echartPage
        },
        methods:{
            callAction(data){
               this.$refs.toDoCenter.callAction(data);
            },
            initCase(){
                Promise.all([
                    queryBookPohto(),
                    getEETempToken()
                ]).then(resList=>{
                    let carouselList = resList[0].data;
                    let tempToken = resList[1].data;
                        carouselList.forEach((element) => {
                            element.smallSrc = baseUrl + '/file-manager/safe/image/thumbnail/traditional?lg=100&mt-token=' + tempToken + '&file-header-Id=' + element.id;
                            element.bigSrc = baseUrl + '/file-manager/safe/preview?mt-token=' + tempToken + '&file-header-Id=' + encodeURIComponent(element.id);
                        })
                        this.carouselList = carouselList;
                })
            },
            carouselChange(index){
                 this.carouselIndex = index;
            },
            carouseIndicatorlClick(index){
                this.$refs.carousel.setActiveItem(index);
                this.carouselIndex = index;
            },
        }
    }
</script>
<style scoped>
    .portalIndex{
        min-width: 1300px;
        box-sizing: border-box;
    }
    .portalIndex .padding2{
        padding: 0 80px;
    }
    .portalIndex .carouselImg{
        width:100%;
        height:100%;
    }
    .portalIndex .carouselBottom{
        height:30px;
        display: flex;
        align-items: center;
    }
    .portalIndex .carouselTitle{
        width:160px;
        cursor: pointer;
    }
    .portalIndex .carouselBtns{
        flex:1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .portalIndex .carouselBtn-item{
        height:10px;
        width:25px;
        background-color: #ddd;
    }
    .portalIndex .carouselBtn-item.active{
        background-color: #409EFF;
    }
    .portalIndex .carouselBtn-item+.carouselBtn-item{
        margin-left:5px;
    }
</style>
