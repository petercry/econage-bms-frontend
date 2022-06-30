<template>
  <div style="display: inline-block;">
    <div class="eco-user-img" v-if="!imgUrl"  :style="{height:size+'px',width:size+'px',borderRadius:getBorderRadius,backgroundColor:bgColor}">
      <span :style="{lineHeight:size+'px',fontSize:fontSize+'px'}">{{name.slice(-2)}}</span>
    </div>
    <img v-else :style="{height:size+'px',width:size+'px',borderRadius:getBorderRadius}" :src="imgUrl" :alt="name">
  </div>
</template>

<script>
import axios from 'axios'
import { baseUrl } from '../../modules/common/config/env';
export default {
  name:'ecoUserImg',
  props: {
      bgColor:{
          type:String,
          default:'#1CA5FA'
      },
      name:{
          type:String,
          default:''
      },
      userId:{
        type:String,
        default:''
      },
      size:{
        type:Number,
        default:60
      },
      fontSize:{
        type:Number,
        default:20
      }
  },
  data() {
    return {
      imgUrl:'',
      // imgUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603194776746&di=39f07fa87efa32c7067152df758679ac&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201509%2F22%2F20150922180033_hV43u.jpeg'
       baseUrl:'/api'
    };
  },
  mounted(){

  },
  created(){
      if(window.sysSetting && window.sysSetting.baseUrl){
          this.baseUrl = window.sysSetting.baseUrl;
      }else if(window.parent.sysSetting && window.parent.sysSetting.baseUrl){
          this.baseUrl = window.parent.sysSetting.baseUrl;
      }else {
          this.baseUrl = '/api'
      }
  },
  computed:{
    getBorderRadius(){
      return Math.ceil(this.size/2)+'px';
    },
  },
  methods:{
    getImgUrl(){
      if(!this.userId){return;}
      let getFileListAjax  = axios.get(this.baseUrl + '/file-manager/info/modular/userImg?modularInnerId='+this.userId,{
        params:{time:new Date().getTime()}
      });
      let getFileMtToken  = axios.get(this.baseUrl + '/file-manager/download-tmp-token',{
        params:{time:new Date().getTime()}
      });
      axios.all([getFileListAjax,getFileMtToken]).then(axios.spread((res1, res2)=> {
        if (res1.data&&res1.data.length){
          let fileId = res1.data[res1.data.length-1].id;
          this.imgUrl = window.location.origin+this.baseUrl+'/file-manager/safe/download?mt-token='+res2.data+'&file-header-Id='+fileId;
        }else{
          this.imgUrl = '';
        }
      })).catch(e=>{})
    }
  },
  destroyed(){

  },
  watch: {
    userId (newOne, oldOne) {
      if (newOne){
        this.getImgUrl();
      }
    }
  }

};

</script>

<style scoped>
.eco-user-img{
  display: inline-block;
  overflow: hidden;
  text-align: center;
  color: #fff;
  line-height: 0;
  font-size: 0;
}
</style>
