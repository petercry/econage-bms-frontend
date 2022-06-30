<template>
    <div class="designFormSettingVue designSettingVue">
        
        <div class="itemVueName">表单属性</div>
        <div class="setting">

            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;表单名称</span> </el-col>
                    <el-col :span="12" class="note"><span>最多30字</span></el-col>
                </el-row>
                <div><el-input v-model="config.model.fullName" maxlength="30" show-word-limit></el-input></div>
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
                <div><el-input v-model="config.model.shortName" maxlength="10" show-word-limit></el-input></div>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">表单宽度( px )</span></div>
                <div>
                    <el-slider v-model="config.view.style.formWidth"  :min="680" :max="1000" :step="5" show-input input-size="mini" ></el-slider>
                </div>
            </div>

             <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="15" class="title"><span>组件标题文字颜色</span></el-col>
                    <el-col :span="9" ><span><el-color-picker size="mini" v-model="config.view.style.titleTextColor" @active-change="onFtChange"></el-color-picker></span></el-col>
                </el-row>
            </div>

            <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="15" class="title"><span>组件标题背景颜色</span></el-col>
                    <el-col :span="9" ><span><el-color-picker size="mini" v-model="config.view.style.titleBgColor" @active-change="onBgChange"></el-color-picker></span></el-col>
                </el-row>
            </div>
           
           <el-divider></el-divider>

            <div class="ecoSettingBlock">
                  <el-row class="ecoSettingDesc">
                      <el-col :span="24" class="title"><span>表单样式</span> </el-col>
                  </el-row>
                  <div>
                      <el-select v-model="config.view.attrs.styleName"  placeholder="请选择">
                          <el-option
                              v-for="item in formStyleOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-select>
                  </div>
              </div>


             
          </div>
    </div>
</template>
<script>


import {defaultFormWidth,defaultFormTitleTextColor,defaultFormTitleBgColor} from '../../../config/setting.js'
import {Loading} from 'element-ui';
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
              view:{
                  style:{
                      formWidth:0,
                      titleTextColor:null,
                      titleBgColor:null,
                  },
                  attrs:{
                      styleName:null
                  }
              },
              model:{
                  shortName:null,
                  fullName:null,
                  id:null
              },
              loaded:false,
          },

          formStyleOptions:[],
          loaded:false,
          defaultFormTitleTextColor:defaultFormTitleTextColor,
          defaultFormTitleBgColor:defaultFormTitleBgColor,
    }
  },
 computed:{
    ...mapState([
          'wfFormDesignConfig',
          'formDesignModelAndView'
    ]),
  },
  created(){
  
  },
  mounted(){
      this.init();
  },
  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE',
            'DELETE_FORM_DESIGN_MODEL_AND_VIEW'
       ]),

       init(){
            this.formStyleOptions.push({value:'styleTable',label:'带边框'}); 

            let _cacheConfig = null;
            if(this.formDesignModelAndView && this.formDesignModelAndView[this.formKey]){ //如果保存有配置信息 不是新添加
                  _cacheConfig = this.formDesignModelAndView[this.formKey];
            }

            this.config.model.fullName = _cacheConfig?_cacheConfig.model.fullName:null;
            this.config.model.shortName = _cacheConfig?_cacheConfig.model.shortName:null;
            this.config.model.id = this.formKey;
            
            this.config.view.style.formWidth =  (_cacheConfig && _cacheConfig.view.style)?( _cacheConfig.view.style.formWidth?Number(_cacheConfig.view.style.formWidth):this.defaultFormWidth ):this.defaultFormWidth;
            this.config.view.style.titleTextColor = (_cacheConfig && _cacheConfig.view.style)?_cacheConfig.view.style.titleTextColor:this.defaultFormTitleTextColor;
            this.config.view.style.titleBgColor = (_cacheConfig && _cacheConfig.view.style )?_cacheConfig.view.style.titleBgColor:this.defaultFormTitleBgColor;
            this.config.view.attrs.styleName = (_cacheConfig && _cacheConfig.view.attrs )?_cacheConfig.view.attrs.styleName:'styleTable';
           
            this.config.loaded = true;

            this.DELETE_FORM_DESIGN_MODEL_AND_VIEW(this.formKey);
         
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
   

       onFtChange(val){
           this.config.view.style.titleTextColor = val;
       },

       onBgChange(val){
           this.config.view.style.titleBgColor = val;
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
