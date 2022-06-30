<template>
    <div class="designDateSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName">日期输入框</div>
        <div class="setting">
            <el-tabs v-model="tabActiveName" type="card">
                <el-tab-pane label="视图" name="view">
                    <div >
                        <div class="ecoSettingBlock">
                            <el-row class="ecoSettingDesc">
                                <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;标题名称</span> </el-col>
                                <el-col :span="12" class="note"><span>最多20字</span></el-col>
                            </el-row>
                            <div><el-input v-model="config.view.display" maxlength="20" show-word-limit></el-input></div>
                        </div>
                        <div class="ecoSettingBlock">
                                <el-row class="ecoSettingDesc">
                                        <el-col :span="24" class="switchDesc">
                                            <el-switch  v-model="config.view.attrs.titlePos" size="mini"> </el-switch>
                                            <span>隐藏标题</span>
                                        </el-col>
                                </el-row>
                        </div>
                        <div class="ecoSettingBlock">
                            <div class="ecoSettingDesc"><span class="title">标题对齐方式</span></div>
                            <div>
                                <el-radio-group v-model="config.view.style.titleAlign" >
                                        <el-radio-button label="left" >左对齐</el-radio-button>
                                        <el-radio-button label="center" >居中</el-radio-button>
                                        <el-radio-button label="right" >右对齐</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="ecoSettingBlock">
                            <div class="ecoSettingDesc"><span class="title">标题宽度( px )</span></div>
                            <div>
                                <el-slider v-model="config.view.style.titleWidth"  :min="0" :max="500" :step="5" show-input input-size="mini" ></el-slider>
                            </div>
                        </div>
                        <div class="ecoSettingBlock">
                            <el-row class="ecoSettingDesc">
                                <el-col :span="12" class="title"><span>标题文字颜色</span></el-col>
                                <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.view.style.ftColor" @active-change="onFtChange"></el-color-picker></span></el-col>
                            </el-row>
                        </div>

                        <div class="ecoSettingBlock">
                            <el-row class="ecoSettingDesc">
                                <el-col :span="12" class="title"><span>标题背景颜色</span></el-col>
                                <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.view.style.bgColor"  @active-change="onBgChange"></el-color-picker></span></el-col>
                            </el-row>
                        </div>

                        <el-divider></el-divider>
                        <div class="ecoSettingBlock">
                            <div class="ecoSettingDesc"><span class="title">日期格式</span></div>
                            <div>
                                <el-select v-model="config.view.attrs.dateType" placeholder="请选择" @change="changeDateType">
                                    <el-option
                                        v-for="item in dateTypeArray"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        
                         <div class="ecoSettingBlock">
                                <el-row class="ecoSettingDesc">
                                    <el-col :span="24" class="title"><span>默认内容</span> </el-col>
                                </el-row>
                                <div>
                                    <el-radio-group v-model="config.view.attrs.defaultId" style="margin-bottom: 15px;" @change="changeDefaultId">
                                        <el-radio-button :label="item.value" v-for="item in dateDefaultIdArray" :key="item.value">{{item.label}}</el-radio-button>
                                    </el-radio-group>

                                    <div v-show="config.view.attrs.defaultId == 'custom'">
                                            <el-time-picker
                                                    v-if="config.view.attrs.dateType == 'HH:mm'"
                                                    v-model="config.view.attrs.defaultVal"
                                                    placeholder="选择默认时间"
                                                    :format="config.view.attrs.dateType"
                                                    :value-format="config.view.attrs.dateType"
                                                    style="width:205px;"
                                                >
                                            </el-time-picker>

                                            <el-date-picker
                                                    v-else
                                                    v-model="config.view.attrs.defaultVal"
                                                    :type="getDateType"
                                                    placeholder="选择默认日期"
                                                    :format="config.view.attrs.dateType"
                                                    :value-format="config.view.attrs.dateType"
                                                    style="width:205px;"
                                                >
                                            </el-date-picker>
                                    </div>
                                    <div v-show="config.view.attrs.defaultId == 'current'">
                                    
                                    </div>
                                </div>
                        </div>

                        <el-divider></el-divider>
                        <div class="ecoSettingBlock">
                            <el-row class="ecoSettingDesc">
                                    <el-col :span="12" class="switchDesc">  
                                        <el-switch v-model="config.view.attrs.required" size="mini"></el-switch>
                                        <span class="">必填</span>
                                    </el-col>
                                    <el-col :span="12" class="switchDesc">
                                        <el-switch v-model="config.view.attrs.visiable" size="mini"></el-switch>
                                        <span>隐藏</span>
                                    </el-col>
                            </el-row>

                            <el-row class="ecoSettingDesc">
                                    <el-col :span="12" class="switchDesc">
                                        <el-switch  v-model="config.view.attrs.ispk" size="mini"> </el-switch>
                                        <span>主键</span>
                                    </el-col>

                                    <el-col :span="12" class="switchDesc" >
                                        <el-switch  v-model="config.view.attrs.isfk" size="mini"> </el-switch>
                                        <span>外键</span>
                                    </el-col>
                            </el-row>
                        
                        </div>

                        <div class="ecoSettingBlock">
                            <div class="ecoSettingDesc"><span class="title">自定义标识</span></div>
                            <div><el-input v-model="config.view.attrs.defFieldId" ></el-input></div>
                            <div class="tip">注：用于二次开发接口时的唯一性标识，建议使用英文命名</div>
                        </div>

                        <div class="ecoSettingBlock">
                            <div class="ecoSettingDesc"><span class="title">操作提示</span></div>
                            <div><el-input v-model="config.view.attrs.inst" ></el-input></div>
                        </div>
                
                 </div>


                </el-tab-pane>
                <el-tab-pane label="物理" name="model">

                        <div>
                            <div class="ecoSettingBlock">
                                <el-row class="ecoSettingDesc">
                                    <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;物理列名称</span> </el-col>
                                    <el-col :span="12" class="note"><span>最多20字</span></el-col>
                                </el-row>
                                <div><el-input v-model="config.model.display" maxlength="20" show-word-limit></el-input></div>
                            </div>

                          <div class="ecoSettingBlock">
                                <div class="ecoSettingDesc"><span class="title">字段类型</span></div>
                                <div>
                                    <el-select v-model="config.model.fieldType"  placeholder="请选择">
                                            <el-option
                                                v-for="item in fieldTypeArray"
                                                :key="item.id"
                                                :label="item.desc"
                                                :value="item.id">
                                            </el-option>
                                    </el-select>
                                </div>
                          </div>

                          
                          <el-divider></el-divider> 
                          <div class="ecoSettingBlock">
                                <el-row class="ecoSettingDesc">
                                        <el-col :span="24" class="switchDesc">  
                                            <el-switch v-model="config.model.createIdx" size="mini"></el-switch>
                                            <span class="">物理索引</span>
                                        </el-col>
                                </el-row>
                          </div>

                        </div>

                </el-tab-pane>
            </el-tabs>
        </div>

       



    </div>
</template>
<script>

import {getFieldId} from'../../../service/service'
import {defaultTitleWidth}  from'../../../config/setting.js'
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
        tableDef:null,
        action:null,
        loaded:false,
        changed:false,
        tabActiveName:'view',
        crtlType:'TIMEFIELD',
        fieldTypeArray:[],
        config:{
            loaded1:false,
            loaded2:false,
            action:null,
            view:{//视图层
                type:null,
                fieldId:null,
                nodeType:'basic',
                display: '日期输入框',
                attrs:{
                    titlePos:false,
                    required:false,
                    visiable:false,
                    ispk:false,//主键
                    isfk:false,//外健
                    inst:null,//操作提示,
                    defFieldId:null,//自定义表示
                    dateType:null,
                    defaultId:null,
                    defaultVal:null, //默认内容
                },
                style:{
                    ftColor:null,//标题文字颜色
                    bgColor:null,//标题背景颜色,
                    titleAlign:'left',//标题对齐方式
                    titleWidth:defaultTitleWidth,//标题宽度
                }
            },
            model:{//物理层
                crtlType:null,
                createIdx:false,
                display:'日期输入框',
                field:null,
                fieldType:'DATETIME', //物理类型
                id:null,
                linkId:null,
            }
        },

        dateTypeArray:[],
        dateDefaultIdArray:[],
        dateFormaterStr:'yyyy-MM-dd',

  
     
    }
  },
 computed:{
        ...mapState([
            'wfFormDesignConfig',
            'formDesignModelAndView'
        ]), 
        
        getDateType(){
            if(this.config.view.attrs.dateType == 'yyyy-MM-dd'){
                    return 'date';
            }else if(this.config.view.attrs.dateType == 'yyyy-MM-dd HH:mm'){
                    return 'datetime';
            }else if(this.config.view.attrs.dateType == 'yyyy-MM-dd HH'){
                    return 'datetime';
            }else if(this.config.view.attrs.dateType == 'yyyy-MM'){
                   return 'month';
            }else if(this.config.view.attrs.dateType == 'HH:mm'){
                   return 'time';
            }else{
                   return 'date'
            }
        },  
  },
  created(){

     

      this.initItem();
      window.ecoDesignSettingVm = this;
  },
  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE',
            'DELETE_FORM_DESIGN_MODEL_AND_VIEW'
       ]),

       /*初始化组件*/
       initItem(){
            this.uuid = this.$route.params.uuid;
            this.tableDef = this.$route.params.tableDef;
            this.action = this.$route.params.action;

            this.config.loaded1 = false;
            this.config.loaded2 = false;
            
            if(this.action == 'create'){ //添加组件 申请添加组件
                this.getItemModelCreateApplyFunc();
            }else{ //修改组件 申请修改组件权限，并获取数据
                this.getItemModelUpdateApplyFunc();
            }
       },
        
       /*申请创建表单组件*/ 
       getItemModelCreateApplyFunc(){ 
            getFieldId().then((response)=>{
                    let _fieldId = response.data;
                    /*初始化配置信息*/
                    this.initConfig(_fieldId);
                    this.action = 'update';
                    /*添加保存成功，向上冒泡，后面都转为更新操作*/
                    this.onEmitHandle('createConfig',true);
            }).catch((err)=>{
                this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
            })
       },

       /*申请更新表单组件*/ 
       getItemModelUpdateApplyFunc(){ 
           let _config = this.formDesignModelAndView[this.uuid];
           this.initConfig(_config.model.field,_config);
            
           this.DELETE_FORM_DESIGN_MODEL_AND_VIEW(this.uuid);
       },
        
       /*初始化配置信息*/
       initConfig(_fieldId,remap){

            this.fieldTypeArray = [];
            this.fieldTypeArray.push({id:'DATETIME',desc:'DATETIME'});
            this.fieldTypeArray.push({id:'DATE',desc:'DATE'});


            this.dateTypeArray = [];
            this.dateTypeArray.push({ desc:'yyyy-MM-dd',label: '年-月-日',value:'yyyy-MM-dd'});
            this.dateTypeArray.push({ desc:'yyyy-MM-dd HH',  label: '年-月-日 时',value:'yyyy-MM-dd HH'});
            this.dateTypeArray.push({ desc:'yyyy-MM-dd HH:mm',  label: '年-月-日 时:分',value:'yyyy-MM-dd HH:mm'});
            this.dateTypeArray.push({ desc:'HH:mm', label: '时:分',value:'HH:mm'});
            this.dateTypeArray.push({ desc:'yyyy-MM', label: '年-月',value:'yyyy-MM'});

            /*初始化日期defaultId*/
            this.dateDefaultIdArray = [];
            this.dateDefaultIdArray.push({value:'custom',label:'自定义'});
            this.dateDefaultIdArray.push({value:'current',label:'当前时间/日期'});



            let _attrsObj = null;
            let _styleObj = null;
            if(remap && remap.view && remap.view.attrs){
                _attrsObj = remap.view.attrs;
            }
            if(remap && remap.view && remap.view.style){
                _styleObj = remap.view.style;
            }

            let _config = {};
            _config.view = {};
            _config.view.type = this.crtlType;
            _config.view.fieldId =  this.tableDef+'.'+_fieldId;
            _config.view.nodeType = 'basic';
            _config.view.display =  remap?remap.view.display:'日期输入框';
            
            _config.view.attrs = {};

            _config.view.attrs.titlePos = _attrsObj?(String(_attrsObj.titlePos) == 'true'?true:false):false;
            _config.view.attrs.required = _attrsObj?(String(_attrsObj.required) =='true'?true:false):false;
            _config.view.attrs.visiable = _attrsObj?(String(_attrsObj.visiable) == 'true'?true:false):false;
            _config.view.attrs.ispk = _attrsObj?(String(_attrsObj.ispk) == 'true'?true:false):false;
            _config.view.attrs.isfk = _attrsObj?(String(_attrsObj.isfk) == 'true'?true:false):false;

            _config.view.attrs.inst = _attrsObj?(_attrsObj.inst):null;
            _config.view.attrs.defFieldId = _attrsObj?_attrsObj.defFieldId:null;

            _config.view.attrs.defaultId = _attrsObj?_attrsObj.defaultId:'custom';
            _config.view.attrs.defaultVal = _attrsObj?_attrsObj.defaultVal:null;
            _config.view.attrs.dateType = _attrsObj?_attrsObj.dateType:'yyyy-MM-dd';

            _config.view.style = {};
            _config.view.style.ftColor = _styleObj?_styleObj.ftColor:null;
            _config.view.style.bgColor = _styleObj?_styleObj.bgColor:null;
            _config.view.style.titleAlign = _styleObj?_styleObj.titleAlign:'left';

            _config.view.style.titleWidth = _styleObj?Number(_styleObj.titleWidth):defaultTitleWidth;
       
            _config.model = {};
            _config.model.crtlType = this.crtlType;
            _config.model.display = remap?remap.model.display:'日期输入框',
            _config.model.field = _fieldId ;
            _config.model.fieldType =  remap?remap.model.fieldType:'DATETIME';
            _config.model.createIdx = remap?remap.model.createIdx:false ;
            _config.model.id = this.tableDef+'.'+_fieldId;
            _config.model.linkId = this.tableDef;
            _config.loaded1 = true;
            _config.loaded2 = true;
           
            this.config = _config;
        
       },


        

       onEmitHandle(action,emitConfig){
               if(emitConfig){
                    let obj = {};
                    obj.key = this.uuid;
                    obj.value = EcoUtil.objDeepCopy(this.config);
                    this.SET_WF_FORM_DESIGN_CONFIG(obj);
                }

                let actionObj = {};
                actionObj.uuid = this.uuid;
                actionObj.action = action;
                actionObj.time = new Date().getTime();
                this.SET_WF_FORM_DESIGN_CONFIG_CHANGE(actionObj); //设置操作
       },



       onFtChange(val){
           this.config.view.style.ftColor = val;
       },

       onBgChange(val){
            this.config.view.style.bgColor = val;
       },
        
      /*日期格式发生变化 重置自定义 默认内容*/
       changeDateType(val){
            this.config.view.attrs.defaultVal = null;
       },

        changeDefaultId(val){ //选项内容切换的时候变化
            this.config.view.attrs.defaultVal = null;
       },

     
  },
  watch:{
      '$route' (to, from) {
            if(this.changed){
                  this.onEmitHandle('saveUpdateConfig',true);
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
                        this.onEmitHandle('changeConfig',true);

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
             this.onEmitHandle('saveUpdateConfig',true);
         }
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
