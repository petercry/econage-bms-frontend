<template>
    <eco-content top='0px' bottom='0px' style='border-top:1px solid #f5f5f5'>
      <div class='spotCheckPage'>
          <div class='leftSlider'>
              <div class='sliderItem' :class='{active:(pageActive==key)}' v-for="(item,key) in menuList" @click='changeSlider(key)'>{{item}}</div>
          </div>
          <div class="rightContent">
               <page1 v-on='$listeners' ref='page1' :standardRegulationNo='standardRegulationNo' v-show='pageActive=="page1"'></page1>
               <page2 v-on='$listeners' ref='page2' :standardRegulationNo='standardRegulationNo' v-show='pageActive=="page2"'></page2>
               <page3 v-on='$listeners' ref='page3' :standardRegulationNo='standardRegulationNo' stepStatus='STEP3' v-show='pageActive=="page3"'></page3>
               <page3 v-on='$listeners' ref='page4' :standardRegulationNo='standardRegulationNo' stepStatus='STEP4' v-show='pageActive=="page4"'></page3>
               <page3 v-on='$listeners' ref='page5' :standardRegulationNo='standardRegulationNo' stepStatus='STEP5' v-show='pageActive=="page5"'></page3>
          </div>
      </div>
    </eco-content>
</template>
<script>
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import { EcoUtil } from '@/components/util/main.js'
    import page1 from './page1.vue'
    import page2 from './page2.vue'
    import page3 from './page3.vue'
    export default {
        name:"spotCheckPage",
        data(){
            return {
                pageActive:'page1',
                menuList:{'page1':'点检清单','page2':'设计师点检','page3':'专业部门审核','page4':'法规负责人审核','page5':'标准法规室总师审核'}
            }
        },
        components:{
            ecoContent,
            page1,
            page2,
            page3
        },
        computed:{
            standardRegulationNo(){
               return this.$route.params.standardRegulationNo;
            }
        },
        mounted(){
            if(this.$route.query.toDoStep){
                var list={
                    "STEP2":'page2',
                    "STEP3":'page3',
                    "STEP4":'page4',
                    "STEP5":'page5'
                }
                this.changeSlider(list[this.$route.query.toDoStep]);
            }  
        },methods:{
            changeSlider(pageActive){
                if(this.pageActive==pageActive){
                    return;
                }
                this.pageActive = pageActive;
                this.$refs[pageActive].requestData('search',false);
            }
        }
    }
</script>
<style scoped> 
.spotCheckPage{
    position: relative;
    top:1px;
    height: 100%;
    overflow-y: auto;
    color: #0f1419;
}
.spotCheckPage .leftSlider{
    width:200px;
    position: absolute;
    left:0px;
    top:0px;
    bottom: 0px;
    border-right:1px solid #f5f5f5;
    box-sizing: border-box;
    padding-top: 20px;
}
.spotCheckPage .rightContent{
    position: absolute;
    left:201px;
    right:0px;
    top:0px;
    bottom: 0px;
}
.spotCheckPage .sliderItem{
    height:45px;
    line-height: 45px;
    font-size:14px;
    padding-left:40px;
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
}
.spotCheckPage .sliderItem.active{
    background-color: rgba(75, 151, 238, 0.3);
    color:rgba(75, 151, 238,0.8);
}
</style>