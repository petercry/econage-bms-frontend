<template>
  <div class="eco-btn-div">
    <span v-bind:class="{'eco-btn-split':leftSplit}"></span>
    <button v-bind:class="ecoButtonClass" v-if="hasButton">
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  name:'ecoButton',
  props: {
      type:{
          type:String,
          default:'tool'
      },
      leftSplit:{
          type:Boolean,
          default:true
      },
      hasButton:{
          type:Boolean,
          default:true
      }
  },
  data() {
    return {
        ecoButtonClass:''
    };
  },
  mounted(){

  },
  created(){
      this.initClass();
  },
  computed:{

  },
  methods:{
    initClass(){
        this.ecoButtonClass = 'eco-button eco-button--'+this.type;
    }
  },

  destroyed(){

  }

};

</script>

<style scoped>
.eco-btn-div{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  font-size: 12px;
}

.eco-btn-div .iconfont{
  font-size: 14px;
}

.eco-btn-split{
    border-left:2px solid #aaa;
    margin-right:5px;
}

.eco-button {
    line-height: 1;
    cursor: pointer;
    border: 0px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    font-weight: 500;
    padding: 8px 8px;
    font-size: 12px;
    border-radius: 4px;
    /* background-color: inherit; ie不支持该属性 用transparent设置透明 跟随父元素背景*/          
    background-color: transparent;
}

.eco-button--tool {
    color: #4a4a4a;
}
.eco-button--tool:hover {
    background-color: rgb(221,221,221);
}
.eco-button--tool:active {
    outline: 0;
}
.eco-button--tool.is-active,.eco-button--tool:active {
    background: rgb(221,221,221);
}
.eco-button--tool:focus, .eco-button--tool:hover {
    background: rgb(221,221,221);
}

</style>
