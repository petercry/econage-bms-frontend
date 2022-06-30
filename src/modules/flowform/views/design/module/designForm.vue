<template>
  <div class="designForm designField" >
        <div class="formTitle">{{itemObj.name}}</div>
  </div>
</template>
<script>

export default{
  name:'designForm',
  components:{
      
  },
  props:{
        mItem:{
            type:Object
        },
        mConfig:{
            type:Object,
        } 
  },
  data(){
        return {
            settingConfing:{},
        }
  },
  computed:{
        itemObj(){
         
            let _item = {};
            _item.name = this.mConfig?this.mConfig.name:this.mItem.name;//表单名称
            _item.shortName = this.mConfig?this.mConfig.shortName:this.mItem.shortName;//表单名称简称
            _item.formWidth = this.mConfig?this.mConfig.formWidth:this.mItem.formWidth; //表单宽度
            _item.styleName = this.mConfig?this.mConfig.styleName:this.mItem.styleName; //表单样式
           
            return _item;
        },
  },
  created(){
       
  },
  mounted(){
     
     
  },
  methods: {
     
  },
  watch: {
 
  }
}
</script>
<style scoped>

.designForm{
    background-color: #ffff;  
    cursor:pointer;
}

.designForm .formTitle{
    padding:20px 0px;
    text-align: center;
    font-size: 16px;
    border-bottom:1px solid #e7e7e7
}


</style>
