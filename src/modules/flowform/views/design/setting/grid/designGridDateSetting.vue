<template>
    <div class="designDateSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName"><span @click="goBack" class="pointerCalss"><i class="icon iconfont iconback back"></i></span> 明细:日期输入框</div>
        <div class="setting">

            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;列名称</span> </el-col>
                    <el-col :span="12" class="note"><span>最多20字</span></el-col>
                </el-row>
                <div><el-input v-model="config.titleName" maxlength="20" show-word-limit></el-input></div>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">列标题对齐方式</span></div>
                <div>
                     <el-radio-group v-model="config.titleAlign" >
                            <el-radio-button label="left" >左对齐</el-radio-button>
                            <el-radio-button label="center" >居中</el-radio-button>
                            <el-radio-button label="right" >右对齐</el-radio-button>
                     </el-radio-group>
                </div>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">列宽度( px )</span></div>
                <div>
                    <el-slider v-model="config.titleWidth"  :min="10" :max="500" :step="5" show-input input-size="mini" ></el-slider>
                </div>
            </div>

            <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span>列文字颜色</span></el-col>
                    <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.ftColor" @active-change="onFtChange"></el-color-picker></span></el-col>
                </el-row>
            </div>

            <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span>列背景颜色</span></el-col>
                    <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.bgColor" @active-change="onBgChange"></el-color-picker></span></el-col>
                </el-row>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">日期格式</span></div>
                <div>
                    <el-select v-model="config.subTypeId" placeholder="请选择" @change="changeSubType">
                        <el-option
                            v-for="item in dateFormater"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <el-divider></el-divider>

            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title"><span>默认内容</span> </el-col>
                </el-row>
                <div>
                    <el-radio-group v-model="config.defaultId" style="margin-bottom: 15px;" @change="changeDefaultId">
                        <el-radio-button :label="item.id" v-for="item in dateDefaultIdArray" :key="item.value">{{item.text}}</el-radio-button>
                    </el-radio-group>

                    <div v-show="config.defaultId == '17'">
                            <el-time-picker
                                v-if="config.subTypeId == 27"
                                v-model="config.defaultVal"
                                placeholder="选择默认时间"
                                :format="dateFormaterStr"
                                :value-format="dateFormaterStr"
                                >
                            </el-time-picker>

                            <el-date-picker
                                v-else
                                v-model="config.defaultVal"
                                :type="dateType"
                                placeholder="选择默认日期"
                                :format="dateFormaterStr"
                                :value-format="dateFormaterStr"
                                >
                            </el-date-picker>
                    </div>
                    <div v-show="config.defaultId == '7'">
                       
                    </div>
                </div>
            </div>

            <el-divider></el-divider>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">公式</span></div>
                <div>
                    <el-input v-model="config.formula" >
                          <template slot="append"><i class="icon iconfont icongongshi pointerCalss"  @click="setFormula"></i></template>
                    </el-input>
                </div>
            </div>

            
            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title">
                         <el-button  @click="setFuncDataIdSetting" class="plainBtn" style="width:100%;">设置公式 ({{config.funcDataId?1:0}})</el-button>
                    </el-col>
                </el-row>
            </div>


            <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                        <el-col :span="12" class="switchDesc">  
                            <el-switch v-model="config.nullable" size="mini"></el-switch>
                            <span class="">必填</span>
                        </el-col>
                        <el-col :span="12" class="switchDesc">
                            <el-switch v-model="config.visiable" size="mini"></el-switch>
                            <span>隐藏</span>
                        </el-col>
                </el-row>
            </div>

               <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">自定义标识</span></div>
                    <div><el-input v-model="config.defFieldId" ></el-input></div>
                    <div class="tip">注：用于二次开发接口时的唯一性标识，建议使用英文命名</div>
            </div>


            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">操作提示</span></div>
                <div><el-input v-model="config.inst" ></el-input></div>
            </div>
          
        </div>
    </div>
</template>
<script>

import {getItemModelCreateApplyAjax,getSystemKVDataModelAjax,createFormItemModelAjax,updateFormItemModelAjax,getItemModelUpdateApplyAjax} from'../../../../service/service'
import {defaultColDateTitleWidth,defaultFTColor}  from'../../../../config/setting.js'
import {Loading} from 'element-ui';
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'


export default{
  name:'designDateSettingVue',
  components:{
        
  },
  data(){
    return {
        uuid:null,
        itemId:0,
        formOperateId:0,
        action:null,
        loaded:false,
        changed:false,

        config:{
            loaded1:false,
            loaded2:false,
            itemId:0,
            parentId:this.$route.params.parentItemId,
            itemOperateId:0,
            modelType:'TIMEFIELD',
            changeLine:1,
            titleName:'日期输入框', //标题名称
            titlePos:'l',//标题位置
            titleAlign:'left',//标题对齐方式
            titleWidth:defaultColDateTitleWidth,//标题宽度
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
            formula:null,
            nullable:false, //必填
            visiable:false, //隐藏
            itemWidth:160, //组件宽度 占比 整型
            inst:null,//操作提示
            defFieldId:null,//自定义表示
            defaultId:'17', //默认内容 自定义/当前时间
            defaultVal:null, //默认内容
            subTypeId:14, //日期格式
            funcDataId:null//公式id
        },
        
     
        dateFormater:[],
        dateFormaterStr:'yyyy-MM-dd',
        dateDefaultIdArray:[],

    }
  },
 computed:{
        dateType(){
            if(this.dateFormaterStr == 'yyyy-MM-dd'){
                    return 'date';
            }else if(this.dateFormaterStr == 'yyyy-MM-dd HH:mm'){
                    return 'datetime';
            }else if(this.dateFormaterStr == 'yyyy-MM-dd HH'){
                    return 'datetime';
            }else if(this.dateFormaterStr == 'yyyy-MM'){
                   return 'month';
            }else if(this.dateFormaterStr == 'HH:mm'){
                   return 'time';
            }else{
                   return 'date'
            }
        },
  },
  created(){
      this.listAction();
      this.initItem();
      window.ecoDesignGridDateVm = this;
  },
  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE',
            'SET_WF_GRID_DESIGN_CONFIG',
            'SET_WF_GRID_DESIGN_CONFIG_CHANGE',
       ]),

        listAction(){
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'formulaCallBack'){
                    window.ecoDesignGridDateVm.setFormulaCallBack(obj.data);
                }else if(obj && obj.action == 'formulaSettingV2Callback'){
                    window.ecoDesignGridDateVm.setFormulaCallBackV2(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'ecoDesignGridDateVmCallBack');
        },

       /*初始化组件*/
       initItem(){
            this.uuid = this.$route.params.childUUID;
            this.itemId = this.$route.params.childItemId;
            this.formOperateId = this.$route.params.formOperateId;
            this.config.loaded1 = false;
            this.config.loaded2 = false;
            this.getItemModelUpdateApplyFunc();
       },
      

       /*申请更新表单组件*/ 
       getItemModelUpdateApplyFunc(){ 
            getItemModelUpdateApplyAjax(this.formOperateId,this.itemId).then((response)=>{
                if(response.data.status <= 99){
                        let _itemOperateId = response.data.operate_id;
                        let _itemId = response.data.remap.item_model.itemId;
                    
                       this.initConfig(_itemOperateId,_itemId,response.data.remap);
                }         
            }).catch((err)=>{
                console.log(err);
            })
       },

        
       /*初始化配置信息*/
       initConfig(_itemOperateId,_itemId,remap){
            /*初始化日期格式选择*/
            this.dateFormater = [];
            this.dateFormater.push({ desc: 'yyyy-MM-dd',  label: '年-月-日',value:14});
            this.dateFormater.push({ desc: 'yyyy-MM-dd HH',  label: '年-月-日 时',value:19});
            this.dateFormater.push({ desc: 'yyyy-MM-dd HH:mm',  label: '年-月-日 时:分',value:15});
            this.dateFormater.push({ desc: 'HH:mm',  label: '时:分',value:27});
            this.dateFormater.push({ desc: 'yyyy-MM',  label: '年-月',value:26});

            /*初始化日期defaultId*/
            this.dateDefaultIdArray = [];
            this.dateDefaultIdArray.push({id:'17',text:'自定义'});
            this.dateDefaultIdArray.push({id:'7',text:'当前时间/日期'});
            
            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;
            _config.parentId = this.$route.params.parentItemId; //grid的id

            _config.modelType = 'TIMEFIELD',
            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'日期输入框';
            _config.titleAlign = remap?remap.item_model.titleAlign:'left';
            _config.titleWidth = remap?remap.item_model.titleWidth:defaultColDateTitleWidth;
            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
          
            _config.inst = remap?remap.item_model.inst:null;

            _config.subTypeId = remap?remap.item_model.subTypeId:14; //日期格式 默认年月日
            _config.defaultId = remap?remap.item_model.defaultId:'17'; //默认内容 自定义/ 当前时间/日期
            _config.defaultVal = remap?remap.item_model.defaultVal:null;//默认的内容
            _config.formula = remap?remap.item_model.formula:null;//公式
            _config.defFieldId = remap?remap.item_model.defFieldId:null;
            _config.funcDataId = remap?remap.item_model.funcDataId:null;//公式

            _config.loaded1 = true;
            _config.loaded2 = true;
            this.config = _config;

            for(let i = 0;i<this.dateFormater.length;i++){
                if(this.dateFormater[i].value == this.config.subTypeId){
                     this.dateFormaterStr = this.dateFormater[i].desc;
                     break;
                }
            }
       },

       /*日期格式发生变化 重置自定义 默认内容*/
       changeSubType(val){
            for(let i = 0;i<this.dateFormater.length;i++){
                if(this.dateFormater[i].value == val){
                    this.dateFormaterStr = this.dateFormater[i].desc;
                    this.config.defaultVal = null;
                    break;
                }
            }
       },

       changeDefaultId(val){ //选项内容切换的时候变化
            this.config.defaultVal = null;
       },

       setFormula(){ //设置公式
             this.onEmitHandle('setFormula',true);
       },

       setFormulaCallBack(data){
            this.config.formula = data.formula
       },

        setFormulaCallBackV2(data){
           this.config.funcDataId = data.funcDataId;
       },

       onEmitHandle(action,emitConfig){
               if(emitConfig){
                    let obj = {};
                    obj.key = this.uuid;
                    obj.value = EcoUtil.objDeepCopy(this.config);
                    obj.value.dateFormaterStr = this.dateFormaterStr;
                    this.SET_WF_FORM_DESIGN_CONFIG(obj);
                }

                let actionObj = {};
                actionObj.uuid = this.uuid;
                actionObj.action = action;
                actionObj.time = new Date().getTime();
                this.SET_WF_FORM_DESIGN_CONFIG_CHANGE(actionObj); //设置操作
       },

       onGridEmitHandle(action,emitConfig){
               if(emitConfig){
                    let obj = {};
                    obj.key = this.uuid;
                    obj.value = EcoUtil.objDeepCopy(this.config);
                    this.SET_WF_GRID_DESIGN_CONFIG(obj);
                }

                let actionObj = {};
                actionObj.uuid = this.uuid;
                actionObj.action = action;
                actionObj.time = new Date().getTime();
                this.SET_WF_GRID_DESIGN_CONFIG_CHANGE(actionObj); //设置操作
       },

         onFtChange(val){
           this.config.ftColor = val;
       },

       onBgChange(val){
           this.config.bgColor = val;
       },

        goBack(){
           this.$router.push({name:'designGridSetting'});
       },

       setFuncDataIdSetting(){
            let _key = EcoUtil.getUID();
            let _keyData = {};
            _keyData.wfTemplateId = this.$route.params.templateId;
            _keyData.funcDataId = this.config.funcDataId;
            _keyData.itemName = this.config.titleName;
            _keyData.itemParentId = this.$route.params.parentItemId;

            EcoUtil.getSysvm().setTempStore(_key,_keyData);
            let url = '/flowform/index.html#/formulaSetting/'+ _key;
            EcoUtil.getSysvm().openDialog('公式设置',url,1200,590,'6vh');
       }

     
  },
  watch:{
       config: {
            handler(newValue, oldValue) {
                if(newValue.loaded1 && newValue.loaded2){  
                    if(this.loaded){
                        this.changed = true;
                        this.onEmitHandle('changeGirdColConfig',true); 
                        this.onGridEmitHandle('changeGirdColConfig',true);
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
         console.log('销毁组件前调用');
         if(this.changed){
             this.onEmitHandle('saveGridColUpdateConfig',true);
         }
         delete window.ecoDesignGridDateVm;
  }

}

</script>
<style scoped>
.designDateSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designDateSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designDateSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designDateSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designDateSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designDateSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designDateSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designDateSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designDateSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designDateSettingVue  .addOptions{
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
.designDateSettingVue .el-select{
    width:100%;
}

.designDateSettingVue .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
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
.ecoSettingSwitch{
    font-size:14px;
    padding-bottom:15px;
    padding-top:15px;
    border-bottom:  1px solid #e8e8e8 ;
    color:rgb(139, 139, 139);
}

</style>
