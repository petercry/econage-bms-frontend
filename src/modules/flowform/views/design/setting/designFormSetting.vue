<template>
    <div class="designFormSettingVue designSettingVue">
        
        <div class="itemVueName">表单属性</div>
        <div class="setting">

            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;表单名称</span> </el-col>
                    <el-col :span="12" class="note"><span>最多30字</span></el-col>
                </el-row>
                <div><el-input v-model="config.name" maxlength="30" show-word-limit></el-input></div>
            </div>

            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span>&nbsp;表单名称简称</span> 
                         <el-tooltip class="item" effect="dark" content="简称用于移动端表单名称显示，为空则默认取“表单名称”" placement="top">
                            <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                         </el-tooltip>
                    </el-col>
                    <el-col :span="12" class="note"><span>最多10字</span></el-col>
                </el-row>
                <div><el-input v-model="config.shortName" maxlength="10" show-word-limit></el-input></div>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">表单宽度( px )</span></div>
                <div>
                    <el-slider v-model="config.formWidth"  :min="680" :max="1200" :step="5" show-input input-size="mini" ></el-slider>
                </div>
            </div>

             <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="15" class="title"><span>组件标题文字颜色</span></el-col>
                    <el-col :span="9" ><span><el-color-picker size="mini" v-model="config.titleTextColor" @active-change="onFtChange"></el-color-picker></span></el-col>
                </el-row>
            </div>

            <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="15" class="title"><span>组件标题背景颜色</span></el-col>
                    <el-col :span="9" ><span><el-color-picker size="mini" v-model="config.titleBgColor" @active-change="onBgChange"></el-color-picker></span></el-col>
                </el-row>
            </div>
           
           <el-divider></el-divider>

            <div class="ecoSettingBlock">
                  <el-row class="ecoSettingDesc">
                      <el-col :span="24" class="title"><span>表单样式</span> </el-col>
                  </el-row>
                  <div>
                      <el-select v-model="config.styleName"  placeholder="请选择">
                          <el-option
                              v-for="item in formStyleOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-select>
                  </div>
              </div>


              <div class="ecoSettingBlock" style="margin-top:20px;">
                 <el-row class="ecoSettingDesc">
                      <el-col :span="24" class="title">
                            <el-button class="plainBtn"   @click="goRelateSetting" style="width:100%;" size="medium">设置数据规则 <i v-show="config.interactionSize && config.interactionSize>0">({{config.interactionSize}})</i></el-button>
                      </el-col>
                  </el-row>
              </div>
          </div>

          


          </div>
       
    </div>
</template>
<script>


import {defaultFormWidth,defaultFormTitleTextColor,defaultFormTitleBgColor} from '../../../config/setting.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'


export default{
  name:'designFormSettingVue',
  components:{
    
  },
  data(){
    return {
          formKey:'FORM',
          defaultFormWidth:defaultFormWidth,
          config:{
              formWidth:0,
              name:null,
              shortName:null,
              styleName:null, 
              titleTextColor:null,
              titleBgColor:null,
              loaded:false,
              interactionSize:0
          },
         
          formStyleOptions:[],
          changeNum:0,
          loaded:false,

          defaultFormTitleTextColor:defaultFormTitleTextColor,
          defaultFormTitleBgColor:defaultFormTitleBgColor,
    }
  },
 computed:{
    ...mapState([
          'wfFormDesignConfig',
    ]),
  },
  created(){
    //  this.init();
  },
  mounted(){
      this.init();
  },
  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE'
       ]),
       init(){
            this.formStyleOptions.push({value:'styleTable',label:'带边框'}); 
            let _cacheConfig = null;
        
            if(this.wfFormDesignConfig && this.wfFormDesignConfig[this.formKey]){ //如果保存有配置信息 不是新添加
                  _cacheConfig = this.wfFormDesignConfig[this.formKey];
            }

           
            this.config.name = _cacheConfig?_cacheConfig.name:null;
            this.config.shortName = _cacheConfig?_cacheConfig.shortName:null;
            this.config.styleName = _cacheConfig?_cacheConfig.styleName:'styleTable';
            this.config.formWidth = _cacheConfig?(_cacheConfig.formWidth?Number(_cacheConfig.formWidth):this.defaultFormWidth):this.defaultFormWidth;
            
            this.config.titleTextColor = (_cacheConfig && _cacheConfig.titleTextColor)?_cacheConfig.titleTextColor:this.defaultFormTitleTextColor;
            this.config.titleBgColor = (_cacheConfig && _cacheConfig.titleBgColor )?_cacheConfig.titleBgColor:this.defaultFormTitleBgColor;
           
            this.config.interactionSize = _cacheConfig?_cacheConfig.interactionSize:null;
           
            this.config.loaded = true;

         
       },

       onEmitHandle(action){

                let obj = {};
                obj.key = this.formKey;
                obj.value = EcoUtil.objDeepCopy(this.config);
                this.SET_WF_FORM_DESIGN_CONFIG(obj);

                let actionObj = {};
                actionObj.uuid = this.formKey;
                actionObj.action = action;
                actionObj.time = new Date().getTime();
                this.SET_WF_FORM_DESIGN_CONFIG_CHANGE(actionObj); //设置操作
       },

       goRelateSetting(){
            let _url = '/flowform/index.html#/relateSetting/'+this.$route.params.formOperateId;
            console.log(_url);
            let _height = parent.window.document.getElementById("aside").offsetHeight-180;
            EcoUtil.getSysvm().openDialog('数据规则设置',_url,'900',_height,'50px');
       },

       onFtChange(val){
           this.config.titleTextColor = val;
       },

       onBgChange(val){
           this.config.titleBgColor = val;
       }
     
  },
  watch:{
      'config':{
          handler(newValue, oldValue) {
                if(newValue.loaded){
                      if(this.loaded){
                            this.onEmitHandle('changeConfig'); //配置发生变化
                      }else{    
                            this.loaded = true;
                      }
                }
          },
          deep: true,
          immediate:true,
      }
  }
}

</script>
<style scoped>
.designFormSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designFormSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designFormSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designFormSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designFormSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designFormSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designFormSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designFormSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designFormSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designFormSettingVue  .addOptions{
    border: 1px dashed #e8e8e8;
    border-radius: 2px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #1ba5fa;
    vertical-align: middle;
    cursor: pointer !important;
}

.designFormSettingVue .el-select{
    width:100%;
}

.ecoSettingDesc .title{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}

.ecoSettingDesc .note{
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    color: #8b8b8b;
    font-weight: normal;
    text-align: right;
}

.designSettingVue .tip{
    font-size: 12px;
    line-height: 16px;
    color: #8b8b8b;
    font-weight: normal;
    margin:10px 0px 5px 0px;
}

.ecoSettingDesc .formula{
    text-align:right;
}

.ecoSettingDesc .formula span{
    color:#ccc;
    cursor:pointer;
}


.ecoSettingDesc .switchDesc{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}

.ecoSettingBlock{
    margin-bottom:10px;
    
}

.ecoSettingSwitch{
    font-size:14px;
    padding-bottom:15px;
    padding-top:15px;
    border-bottom:  1px solid #e8e8e8 ;
    color:rgb(139, 139, 139);
}

.designFormSettingVue .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}


</style>
