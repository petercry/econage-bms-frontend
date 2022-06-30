<template>
    <div class="ecoHandWritten" v-if="imgList && imgList.length > 0">
           <ul class="ecoHandWritten-area">
                <li
                        v-for="(item, index) in imgList"
                        :key="index"
                        :style="item!='line'?{}:{width:'100%',height:'0px'}"
                >
                    <div v-if="item == 'line'" class="ecoHandWritten-line"><br/></div>
                    <div v-if="item == 'space'" class="ecoHandWritten-space"></div>
                    <img v-if="item!='space' && item != 'line'" :src="item" class="ecoHandWritten-img"/>
                </li>
        </ul>
   </div>
</template>
<script>
export default{
  components:{
    
  },
  name:'ecoHandWritten',
  props:{
    imgList:{
        type:Array,
        default:function(){
            return [];
        },
        
    },
  },
  data(){
        return {
          
        }
  },
  created(){
       
  },
  mounted(){
  },
  computed:{
  },
  methods: {
     
  },
  watch: {

  }
}
</script>
<style scoped>

.ecoHandWritten{
    background-color:#fff;
    padding:10px 0px;
    
}

.handleApprovalDescVue .oneApprovalDesc2 .ecoHandWritten{
    margin-left:10px;
}

.ecoHandWritten .ecoHandWritten-area{
    width: 100%;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 0;
    position: relative;
}

.ecoHandWritten .ecoHandWritten-area::after{
    clear:both;
}

.ecoHandWritten .ecoHandWritten-area li {
    float: left;
    padding: 2px 2px 0px 0;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.ecoHandWritten .ecoHandWritten-line{
    width:100%;
    height:0px;
}

.ecoHandWritten .ecoHandWritten-space{
    width: 13px;
    height:16px;
}

.ecoHandWritten .ecoHandWritten-img{
    max-width:20px;
    max-height:20px;
}
</style>
