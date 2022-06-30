<template>
      <div class="el-form-item eco-form-item ecoFieldDiv">
            <label class="el-form-item__label eco-form-item__label ecoFieldLabel" 
              v-bind:style="{width:titleWidth+'px',backgroundColor:bgColor}" 
              v-if="!titlePos"
            >

                <div class="eco-cb" v-if="textAlign == 'left'">
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

            </label>

            <div class="el-form-item__content eco-form-item__content ecoFieldContent" 
                v-bind:style="{marginLeft:titlePos?0:titleWidth+'px',borderLeftWidth:(!titlePos)?('1px'):0,paddingLeft:(!titlePos)?('5px'):0,paddingRight:(!titlePos)?('5px'):0}">
                 <slot name="content"></slot>
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
          type:Boolean
      },

      required:{
        type:Boolean,
        default:false
      },

      textAlign:{
          type:String,
          default:'left',
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


.flowFormVue.styleTable .iptReadonly .el-form-item__content{
    background-color: #f5f5f5;
}

.designField .ecoFieldLabel{
  cursor: move;
}


.ecoFieldLabel{
  height:100%;
}

.ecoFieldContent{
  height:100%;
  border-left:1px solid #e7e7e7;
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
    content: ".";
}
</style>
