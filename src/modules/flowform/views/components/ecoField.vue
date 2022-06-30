<template>
      <div class="ecoFieldVue"  style="display:table;width:100%;height:100%" >
          <div style="display:table-row;" class="ecoFieldRow">
            <div    class="ecoFieldLabel" 
                    style="display:table-cell"
                    v-bind:style="{width:titleWidth+'px',backgroundColor:bgColor}" 
                    v-if="titlePos!='n'"
                    :class=[verticalAlign]
            >
                    <div class="eco-cb" v-if="textAlign == 'left'" >
                        <div class="eco-sd1">
                            <i v-if="required" class="el-form-required-i">*</i>
                        </div>
                        <div class="eco-mn1">
                            <div class="eco-mn1c">
                                <slot name="label"></slot>
                            </div>
                        </div>
                    </div>

                    <div v-else class="labelTitlePadding" style="padding-left:5px;padding-right:5px;">
                        <slot name="label" ></slot>
                    </div>
            </div>

            <div class="ecoFieldContent" 
                  style="display:table-cell"
                  v-bind:style="{borderLeftWidth:(titlePos!='n')?('1px'):0,paddingLeft:(titlePos!='n')?('5px'):0,paddingRight:(titlePos!='n')?('5px'):0}">
                  <div class="eco-cb" v-if="titlePos=='n' && required ">
                        <div class="eco-sd1">
                            <i v-if="required" class="el-form-required-i">*</i>
                        </div>

                        <div class="eco-mn1">
                            <div class="eco-mn1c">
                                  <slot name="content"></slot>
                            </div>
                        </div>
                   </div>
                  
                  <slot v-else name="content"></slot>
            </div>
        
        
        </div>
      </div>

</template>
<script>
export default{
  name:'ecoField',
  components:{
    
  },
  props:{
      titleWidth:{
          type:Number,
          default:80
      },
      bgColor:{
          type:String,
      },
      titlePos:{
          type:String
      },
      required:{
        type:Boolean,
        default:false
      },
      textAlign:{
          type:String,
          default:'left',
      },
      
      verticalAlign:{
          type:String,
          default:'top',
      }
     
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
       
  }
}
</script>
<style scoped>


.ecoFieldVue .ecoFieldRow{
   
}


.flowFormVue.styleTable .iptReadonly .el-form-item__content{
    background-color: #f5f5f5;
}

.designField .ecoFieldLabel{
  cursor: move;
}


.ecoFieldLabel{
  height:100%;
  color:#606266;
  line-height: 20px;
}

.ecoFieldVue .top{
    vertical-align: top;
    padding-top:10px;
}

.ecoFieldVue .middle{
    vertical-align: middle;
}

.ecoFieldVue .bottom{
    vertical-align: bottom;
}



.ecoFieldContent{
  height:100%;
  border-left:1px solid #e7e7e7;
  line-height: 40px;
  vertical-align: top;
}

.eco-cb{
  padding-left:3px;
  padding-right:3px;
}


.eco-bd1{margin:0 0 10px;}
.eco-sd1{
  position:relative;
  float:left;
  width:8px;
  margin-right:-8px;
  }
.eco-mn1{float:right;width:100%;}
.eco-mn1c{margin-left:10px;}
.eco-cb:after{
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
    overflow: hidden;
    content: "";
}

</style>
