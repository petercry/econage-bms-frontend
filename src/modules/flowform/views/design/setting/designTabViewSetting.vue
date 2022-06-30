<template>
    <div class="designTabViewSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName">Tab页签</div>
        <div class="setting">

                <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                        <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;页签名称</span> </el-col>
                        <el-col :span="12" class="note"><span>最多20字</span></el-col>
                    </el-row>
                    <div><el-input v-model="config.displayName" maxlength="20" show-word-limit></el-input></div>
                </div>


                  <div class="ecoSettingBlock">

                    <el-row class="ecoSettingDesc">
                            <el-col :span="24" class="switchDesc">  
                                <span class="">显示表单标题</span>
                                <el-switch v-model="config.showTitle" size="mini"></el-switch>
                            </el-col>
                    </el-row>

                    <el-row class="ecoSettingDesc" v-show="config.name != '@DEFAULT_VIEW'">
                            <el-col :span="24" class="switchDesc">  
                                <span class="">在办理中显示</span>
                                <el-switch v-model="config.viewType" size="mini"></el-switch>
                            </el-col>
                    </el-row>
                
                </div>
          
        </div>
    </div>
</template>
<script>

import { getTabViewDetail} from'../../../service/service'
import {defaultTitleWidth}  from'../../../config/setting.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'designTabViewSettingVue',
  components:{
        
  },
  data(){
    return {
        viewId:0,
        formOperateId:0,
        
        action:null,
        loaded:false,
        changed:false,

        config:{
            loaded1:false,
            loaded2:false,
            viewId:0,
            operateId:0,
            name:null,
            order:0,

            showTitle:true,
            viewType:false,
        },
     
    }
  },
 computed:{
        ...mapState([
            'wfFormDesignConfig',
        ]),   
  },
  created(){
      this.initItem();
  },

  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE'
       ]),

       /*初始化组件*/
       initItem(){
            this.viewId = this.$route.params.viewId;
            this.formOperateId = this.$route.params.formOperateId;
            this.config.loaded1 = false;
            this.config.loaded2 = false;
            this.getTabViewDetailFunc(); //修改组件 申请修改组件权限，并获取数据
       },
     

       /*申请更新表单组件*/ 
       getTabViewDetailFunc(){ 
           getTabViewDetail(this.viewId).then((response)=>{
                this.initConfig(response.data);
           })
       },
        
       /*初始化配置信息*/
       initConfig(remap){
            let _config = {};
            _config.operateId = this.formOperateId;
            _config.viewId = this.viewId;
            _config.name = remap?remap.name:''; 
            _config.displayName = remap?remap.displayName:'页签'; 
            _config.order = remap?remap.order:0;

            _config.showTitle = remap?(remap.showTitle==0?false:true):true;
            _config.viewType = remap?(remap.viewType=='1'?true:false):false;

            _config.loaded1 = true;
            _config.loaded2 = true;

            this.config = _config;
       },

       onEmitHandle(action,emitConfig){
               if(emitConfig){
                    let obj = {};
                    obj.key = this.viewId;
                    obj.value = EcoUtil.objDeepCopy(this.config);
                    this.SET_WF_FORM_DESIGN_CONFIG(obj);
                }

                let actionObj = {};
                actionObj.uuid = this.viewId;
                actionObj.action = action;
                actionObj.time = new Date().getTime();
                this.SET_WF_FORM_DESIGN_CONFIG_CHANGE(actionObj); //设置操作
       },
      
     
  },
  watch:{
      '$route' (to, from) {
            if(this.changed){
                  this.onEmitHandle('saveTabViewUpdateConfig',true);
            }
            this.changed = false;
            this.loaded = false;
            this.initItem();
       },

       config: {
            handler(newValue, oldValue) {
                if(newValue.loaded1 && newValue.loaded2){  
                    if(this.loaded){
                        this.changed = true;
                        this.onEmitHandle('tabViewChangeConfig',true);
                    }else{
                        this.loaded = true;
                    }
                }
            },
            deep: true,
            immediate:true,
      }
  },
  beforeDestroy(){
         if(this.changed){
             this.onEmitHandle('saveTabViewUpdateConfig',true);
         }
  }

}

</script>
<style scoped>
.designTabViewSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designTabViewSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designTabViewSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designTabViewSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designTabViewSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designTabViewSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designTabViewSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designTabViewSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designTabViewSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designTabViewSettingVue  .addOptions{
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
.designTabViewSettingVue .el-select{
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



</style>
