<template>
    <div class="header-menu-right">
      
      <!-- <i class="icon iconfont icon-zhuti" @click="ChangeTheme"></i> -->
      <el-dropdown v-if="userObj!=null" trigger="click" placement="bottom-end">
          <div>
              <img v-show="showImg" class="userimg" :src="userObj.min_imgPath" @error="showImg=false"/>
             <div v-show="!showImg" class="userimg" ><span v-if="userObj.userName">{{userObj.userName.slice(-2)}}</span></div>
          </div>

          <el-dropdown-menu slot="dropdown" class="e9-dropdown">
              <el-dropdown-item @click.native="goUserPage">{{userObj.userName}}</el-dropdown-item>
              <el-dropdown-item @click.native="logout">{{$t('common.exit')}}</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>

    </div>
</template>
<script>
              
  import {loginOutAjax} from '@/modules/system/service/service.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {mapState,mapMutations} from 'vuex'
  import {EcoUtil} from '@/components/util/main.js'

  export default {
    components:{

    },
    data(){
      return {
        userObj:{userName:'管理员'},
        showImg:true,
        colorList:[
          {
            key:'0acab8',
            color:'0acab8',
            title:this.$t('color.green')
          },{
            key:'1ba5fa',
            color:'07458a',
            title:this.$t('color.blue')
          },{
            key:'e76f6f',
            color:'CC3333',
            title:this.$t('color.red')
          },{
            key:'202225',
            color:'202225',
            title:this.$t('color.black')
          },
        ],
        choosedColor:'',
        oTimer:null,
     
      }
    },
    computed: {
      ...mapState([
         'lang'
      ])
    },
    created(){
          window.headervm = this;
    },
    mounted() {
    },
    methods:{
        ...mapMutations([
            'SET_MENU_TAB_CLICK',
           'SET_THEME'
        ]),

        logout(){
            var that  = this;
            let confirmYesFunc = function(){
                // loginOutAjax().then(function(){
                    sessionStorage.removeItem('ecoToken');
                    that.$router.replace({name:'login'});                
                // })
            }
            let options = { center: true,lockScroll:false,customClass:'exitbox'}
            EcoMessageBox.confirm(this.$t('message.exit')+'?','',options,confirmYesFunc);
        
        },
        ChangeTheme(){
            let theme = this.$cookies.get('ecoTheme');
        //    let theme = EcoUtil.getEcoCookie('ecoTheme');
            // this.ThemeColor=theme;
            this.choosedColor=theme;
            let that = this;
            let options = {
              // cancelButtonText:this.$t('button.reset')
              showCancelButton:false,
              showConfirmButton:false
            }

            this.$nextTick(function(){
              EcoMessageBox.confirm((
                <div>
                {
                  this.colorList.map((item, index) => (
                    <div class="colorItem" onClick={this.colorItemClick.bind(this,item)}>
                      <span style={{backgroundColor:"#"+item.color}}></span> {item.title}
                      <i v-show={item.key==this.choosedColor}  data-key={item.key} class="el-icon-check" style="margin-left: 12px;"></i>
                    </div>
                  ))
                }
              </div>
            ),this.$t('title.theme'),options);
          })
        },

        callBacllThemeChangeFunc(){
            this.SET_THEME();
        },
   
        colorItemClick(item){
            let aCheck = document.querySelectorAll('.colorItem .el-icon-check');
            aCheck.forEach(citem=>{
              if(citem.dataset.key==item.key){
                citem.style.display="inline"
              }else{
                citem.style.display="none"
              }
            })
            this.choosedColor=item.key;
            EcoUtil.toggleClass(document.body,"custom-"+item.key);
            this.$cookies.set('ecoTheme',item.key);
            //EcoUtil.setEcoCookie('ecoTheme',that.choosedColor);
            /*通知iframe中的样式变化*/
            this.callBacllThemeChangeFunc();

        }
    },
    destroyed() {

    },
    watch:{
      'lang'(val){
        this.colorList = [
          {
            key:'0acab8',
            color:'45A86F',
            title:this.$t('color.green')
          },{
            key:'1ba5fa',
            color:'07458a',
            title:this.$t('color.blue')
          },{
            key:'e76f6f',
            color:'CC3333',
            title:this.$t('color.red')
          },{
            key:'202225',
            color:'202225',
            title:this.$t('color.black')
          },
        ];
      
      }
    }
  }
</script>
<style scoped>
  .header-menu-right {
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
  }
  .header-menu-right i.icon{
    vertical-align: middle;
    margin-right: 10px;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
  }
  .userimg{
    margin-top: -4px;
    margin-right: 20px;
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    vertical-align: middle;
    /* background-color: #1ba5fa; */
    line-height: 30px;
    text-align: center;
    color:#fff;
    cursor: pointer;
  }
  .search-box{
    position: absolute;
    right:-10px;
    top: -7px;
    width: 280px;
    height: 30px;
    /* border-bottom: 1px solid #e8e8e8; */
    z-index: -1;
  }
  .srch-choose-box{
    padding-left: 8px;
    width: 84px;
    height: 30px;
    vertical-align: top;
    line-height: 30px;
    outline: none;
    border: 1px #e8e8e8 solid;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #f9f9f9;
  }
  .srch-choose-box .el-dropdown-link{
    position: relative;
    display: inline-block;
    width: 84px;
    line-height: 30px;
    color: #262626;
    font-size: 12px;
  }
  .srch-choose-box i{
    position: absolute;
    color: #bebebe;
    font-size: 12px;
    right: 14px;
    top: 8px;
  }
  .srch-choose-list{
    margin-top: 0;
    width:110px;
  }
  .search-box-input{
    padding-left: 4px;
    padding-right: 30px;
    width: 186px;
    height: 30px;
    border: none;
    outline: 0;
    font-size: 12px;
    color: #262626;
    border: 1px #e8e8e8 solid;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #f9f9f9;
  }
  .colorItem{
    margin-bottom: 4px;
    cursor: pointer;
  }
  .colorItem>span{
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    margin-right: 6px;
  }
</style>
