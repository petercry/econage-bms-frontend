<template>
    <div class="designInputSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName">数字输入框</div>
        <div class="setting">

            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span><i class="el-form-required-i">*</i>&nbsp;标题名称</span> </el-col>
                    <el-col :span="12" class="note"><span>最多20字</span></el-col>
                </el-row>
                <div><el-input v-model="config.titleName" maxlength="20" show-word-limit></el-input></div>
            </div>

             <div class="ecoSettingBlock">
                    <el-row class="ecoSettingDesc">
                            <el-col :span="24" class="switchDesc">
                                <el-switch  v-model="config.titlePos" size="mini"> </el-switch>
                                <span>隐藏标题</span>
                            </el-col>
                    </el-row>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">标题对齐方式</span></div>
                <div>
                     <el-radio-group v-model="config.titleAlign" >
                            <el-radio-button label="left" >左对齐</el-radio-button>
                            <el-radio-button label="center" >居中</el-radio-button>
                            <el-radio-button label="right" >右对齐</el-radio-button>
                     </el-radio-group>
                </div>
            </div>

            <div class="ecoSettingBlock" >
                <div class="ecoSettingDesc"><span class="title">标题垂直对齐方式</span></div>
                <div>
                     <el-radio-group v-model="config.verticalAlign">
                            <el-radio-button label="top" >顶&nbsp;&nbsp;&nbsp;部</el-radio-button>
                            <el-radio-button label="middle" >居中</el-radio-button>
                            <el-radio-button label="bottom" >底&nbsp;&nbsp;&nbsp;部</el-radio-button>
                     </el-radio-group>
                </div>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">标题宽度( px )</span></div>
                <div>
                    <el-slider v-model="config.titleWidth"  :min="0" :max="500" :step="5" show-input input-size="mini" ></el-slider>
                </div>
            </div>

            <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span>标题文字颜色</span></el-col>
                    <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.ftColor" @active-change="onFtChange"></el-color-picker></span></el-col>
                </el-row>
            </div>

            <div class="ecoSettingBlock">
                 <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span>标题背景颜色</span></el-col>
                    <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.bgColor" @active-change="onBgChange"></el-color-picker></span></el-col>
                </el-row>
            </div>

            <el-divider></el-divider>
            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">格式</span></div>
                <div>
             
                    <el-select v-model="config.constraintType" placeholder="请选择" @change="changeConstraintType">
                        <el-option
                            v-for="item in numberFormater"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="ecoSettingBlock">

                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title"><span>默认内容</span> </el-col>
                </el-row>

                <div>
                    <el-select v-model="config.defaultId" style="margin-bottom: 15px;" @change="changeDefaultId">
                            <el-option
                                v-for="item in defaultIdArray"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                    </el-select>   

                    <div v-show="config.defaultId == '17'">
                                <el-input 
                                    :value="config.defaultVal"
                                    @input="defaultIdInput"
                                    @keypress.native="defaultIdOnKeyPress"
                                >
                                </el-input>
                        </div>
                   
                </div>
            </div>

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
            

            <el-divider></el-divider>
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
                 <el-row class="ecoSettingDesc">
                        <el-col :span="12" class="switchDesc">
                            <el-switch  v-model="config.ispk" size="mini"> </el-switch>
                            <span>主键</span>
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

import {getItemModelCreateApplyAjax,createFormItemModelAjax,getItemModelUpdateApplyAjax} from'../../../service/service'
import {defaultTitleWidth}  from'../../../config/setting.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'


export default{
  name:'designInputSettingVue',
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
            itemOperateId:0,
            modelType:'NUMFIELD',
            changeLine:1,
            titleName:'单行输入框', //标题名称
            titlePos:false,//标题位置
            titleAlign:'left',//标题对齐方式
            verticalAlign:'top',
            titleWidth:defaultTitleWidth,//标题宽度
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
            formula:null,
            nullable:false, //必填
            visiable:false, //隐藏
            ispk:false, //主键
            itemWidth:160, //组件宽度 占比 整型
            inst:null,//操作提示
            defFieldId:null,//自定义表示
        
            defaultId:'0', //默认内容 自定义/当前时间
            defaultVal:null, //默认内容
            defaultValHidden:null,//默认内容,
            constraintType:0,//格式
            funcDataId:null//公式id
          
        },

        defaultIdArray:[],
        numberFormater:[],
     
    }
  },
 computed:{
        ...mapState([
            'wfFormDesignConfig',
            'viewTabActiveKey'
        ]),   
  },
  created(){
      this.listAction();
      this.initItem();
      window.ecoDesignSettingVm = this;
  },
  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE'
       ]),

         listAction(){
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'formulaCallBack'){
                    window.ecoDesignSettingVm.setFormulaCallBack(obj.data);
                }else if(obj && obj.action == 'formulaSettingV2Callback'){
                    window.ecoDesignSettingVm.setFormulaCallBackV2(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfFormDesignConfig');
          
          },


       /*初始化组件*/
       initItem(){
            this.uuid = this.$route.params.uuid;
            this.itemId = this.$route.params.itemId;
            this.formOperateId = this.$route.params.formOperateId;
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
            getItemModelCreateApplyAjax(this.formOperateId,this.config.modelType,1).then((response)=>{
                if(response.data.status <= 99){
                        let _itemOperateId = response.data.operate_id;
                        let _itemId = response.data.remap.item_id;
                        /*初始化配置信息*/
                        this.initConfig(_itemOperateId,_itemId);
                        this.createItem();
                }else{
                        this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
                }         
            }).catch((err)=>{
                console.log(err);
                this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
            })
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

            this.numberFormater = [];
            this.numberFormater.push({id:0,text:'普通数字'});
            this.numberFormater.push({id:1,text:'仅允许整数'});
            this.numberFormater.push({id:2,text:'仅允许正整数'});

            /*初始化缺省项*/
            this.defaultIdArray = [];
            this.defaultIdArray.push({id:'0',text:'暂无'});
            this.defaultIdArray.push({id:'17',text:'自定义赋值'});
            
            
            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;
            _config.modelType = 'NUMFIELD',

            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'数字输入框';
            _config.titleAlign = remap?remap.item_model.titleAlign:'left';
            _config.verticalAlign = remap?remap.item_model.verticalAlign:'top';
            _config.titleWidth = remap?remap.item_model.titleWidth:defaultTitleWidth;
            _config.titlePos = remap?(remap.item_model.titlePos=='n'?true:false):false;//隐藏标题 默认隐藏
            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
            _config.ispk = remap?(remap.item_model.ispk==1?true:false):false; //主键
            _config.defFieldId = remap?remap.item_model.defFieldId:null;
            _config.inst = remap?remap.item_model.inst:null;
            _config.defaultId = remap?remap.item_model.defaultId:'0'; //缺省项 默认自定义
            _config.defaultVal = remap?remap.item_model.defaultVal:null;//默认的内容
            _config.defaultValHidden = remap?remap.item_model.defaultValHidden:null;//默认的内容
            _config.formula = remap?remap.item_model.formula:null;//公式
            _config.constraintType = remap?remap.item_model.constraintType:0; //格式 默认年月日
            _config.funcDataId = remap?remap.item_model.funcDataId:null;
            
            _config.loaded1 = true;
            _config.loaded2 = true;
            this.config = _config;
       },

        /*日期格式发生变化 重置自定义 默认内容*/
       changeConstraintType(val){
            this.config.defaultVal = null;
       },

       changeDefaultId(val){ //选项内容切换的时候变化
           this.config.defaultVal = null;
       },

       defaultIdOnKeyPress(event){
            if(event.keyCode < 45 || event.keyCode > 57){
                event.returnValue = false; 
            }else{
             
                if(this.config.constraintType == 0){

                }else if(this.config.constraintType == 1){ //整数
                        if(event.keyCode == 46){ //负号 小数点
                            event.returnValue = false; 
                        }
                }else if(this.config.constraintType== 2){ //正整数
                    if(event.keyCode == 45 || event.keyCode == 46){ //负号 小数点
                         event.returnValue = false; 
                    }
                }
            }              
        },

        defaultIdInput(val){
            if(EcoUtil.isNumber(val,this.config.constraintType)){
                this.config.defaultVal = val; 
            }
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

        /* 申请创建操作 保存数据库数据*/
       createItem(){
            createFormItemModelAjax(this.config,this.viewTabActiveKey).then((response)=>{
                if(response.data.status <= 99){
                        this.action = 'update';
                        this.config.itemOperateId = response.data.operate_id;
                        /*添加保存成功，向上冒泡，后面都转为更新操作*/
                        this.onEmitHandle('createConfig',true);
                     }else{
                        this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
                     }
                }).catch((error)=>{
                        this.onEmitHandle('itemModelCreateApplyFaild'); /*申请表单失败*/
                })
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
           this.config.ftColor = val;
       },

       onBgChange(val){
           this.config.bgColor = val;
       },

       setFuncDataIdSetting(){
            let _key = EcoUtil.getUID();
            let _keyData = {};
            _keyData.wfTemplateId = this.$route.params.templateId;
            _keyData.funcDataId = this.config.funcDataId;
            _keyData.itemName = this.config.titleName;
            _keyData.itemParentId = null;

            EcoUtil.getSysvm().setTempStore(_key,_keyData);
            let url = '/flowform/index.html#/formulaSetting/'+ _key;
            EcoUtil.getSysvm().openDialog('公式设置',url,1200,590,'6vh');
       }
     
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
        //  console.log('销毁组件前调用');
         if(this.changed){
             this.onEmitHandle('saveUpdateConfig',true);
         }

      
  }

}

</script>
<style scoped>
.designInputSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designInputSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designInputSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designInputSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designInputSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designInputSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designInputSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designInputSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designInputSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designInputSettingVue  .addOptions{
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
.designInputSettingVue .el-select{
    width:100%;
}

.designInputSettingVue .plainBtn{
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




</style>
