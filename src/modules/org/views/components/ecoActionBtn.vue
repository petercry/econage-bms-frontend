<template>
  <div class="eco-action-btn">
    <span v-bind:class="{'eco-btn-split':leftSplit}"></span>
    <span class="wrap" @click="actionBtnClick">
        <span class="eco-action-icon">
            <slot name="icon"></slot>
        </span>
        <slot></slot>
    </span>
    <slot name="more"></slot>
  </div>
</template>

<script>
export default {
  name:'ecoActionBtn',
  props: {
      leftSplit:{
          type:Boolean,
          default:true
      },
      to:{
          type:Object,
          default:null
      },
      ecoActionBtnFunc:{
          type:Function,
          default:()=>{}
      }
  },
  data() {
    return {
    };
  },
  mounted(){

  },
  created(){
      
  },
  computed:{

  },
  methods:{
    actionBtnClick(){
        if (this.to!==null){
            this.$router.push(this.to)
        }
        this.ecoActionBtnFunc();
    }
  },

  destroyed(){

  }

};

</script>

<style scoped>
.eco-action-btn{
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
.eco-action-btn .wrap{
    padding: 2px 6px;
    border-radius: 2px;
}
.eco-action-btn .wrap:hover{
    background-color: #ddd;
}
.eco-action-icon .iconfont{
  font-size: 14px;
}

.eco-btn-split{
    border-left:2px solid #aaa;
    margin-right:5px;
}
.eco-action-icon img{
    line-height: 14px;
    vertical-align: bottom;
}
</style>
