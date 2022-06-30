<template>
    <div class="designOrgSelectSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName"><span @click="goBack" class="pointerCalss"><i class="icon iconfont iconback back"></i></span> 明细:选择机构</div>
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
                    <el-slider v-model="config.titleWidth"  :min="10" :max="500" show-input input-size="mini" ></el-slider>
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

            <el-divider></el-divider>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">选择限制</span></div>
                <div>
                    <el-select v-model="config.subTypeId" placeholder="请选择" @change="changeSubType">
                        <el-option
                            v-for="item in subTypeArray"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="ecoSettingBlock">
                    <div class="ecoSettingDesc"><span class="title">选择范围</span></div>
                    <div>
                        <el-select v-model="config.selectAsnType" placeholder="请选择" @change="setSelectAsnVal" style="margin-bottom: 15px;">
                            <el-option
                                v-for="item in selectAsnTypeArray"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                     <div v-show="config.selectAsnType == 1">
                        
                         <tag-select 
                                style="width:205px;vertical-align:text-top;" 
                                :placeholder="'请选择机构'" 
                                :initDataStr="config.selectAsnOrgValHidden" 
                                @callBack="tagSelectCB" >
                            </tag-select>

                       
                    </div>

                     <div v-show="config.selectAsnType == 2" style="margin-bottom: 15px;">
                             <el-select v-model="selectAsnOrgLevel"  @change="setSelectAsnVal">
                                    <el-option
                                        v-show="item.valid !='N'"
                                        v-for="item in selectAsnOrgLevelArray"
                                        :key="item.id"
                                        :label="item.desc"
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
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                </el-select>   

                <div v-show="config.defaultId == '17'">
                            <tag-select 
                                style="width:205px;vertical-align:text-top;" 
                                :placeholder="'请选择机构'" 
                                :initDataStr="config.defaultValHidden" 
                                :initOptions="defaultValHiddenOptions" 
                                @callBack="selectOrg" >
                            </tag-select>

                           
                    </div>

                    <div v-show="config.defaultId == '41'">
                             <el-select v-model="config.defaultOrgLevel" style="margin-bottom: 15px;" >
                                    <el-option
                                        v-show="item.valid !='N'"
                                        v-for="item in systemOrglevelArray"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                            </el-select>   
                    </div>
                </div>
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
import {defaultTitleWidth}  from'../../../../config/setting.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import tagSelect from '../../../../views/direction/module/tagSelect.vue'

export default{
  name:'designGridOrgSelectSettingVue',
  components:{
        tagSelect
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
            modelType:'ORGSLT',
            changeLine:1,
            titleName:'选择机构', //标题名称
            titlePos:'l',//标题位置
            titleAlign:'left',//标题对齐方式
            titleWidth:defaultTitleWidth,//标题宽度
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
            formula:null,
            nullable:false, //必填
            visiable:false, //隐藏
         
            ispn:false, //记录名称
            itemWidth:160, //组件宽度 占比 整型
            inst:null,//操作提示
            defFieldId:null,//自定义表示
       
            defaultId:'17', //默认内容 自定义/当前时间
            defaultVal:null, //默认内容
            defaultValHidden:null,//默认内容
            defaultOrgLevel:1, //发起人所在
            subTypeId:17, //选择限制,

            selectAsnType:0,//选择范围
            selectAsnLg:0,
            selectAsnVal:null,
        },
        
     
        subTypeArray:[],
        defaultIdArray:[],
        systemOrglevelArray:[],

        selectAsnTypeArray:[],
        selectAsnOrgLevelArray:[],
        selectAsnOrgVal:null,
        selectAsnOrgValHidden:null,
        selectAsnOrgLevel:null
    }
  },
  computed:{
         defaultValHiddenOptions(){
            let _params = null;
            for(let i = 0;i<this.subTypeArray.length;i++){
                if(this.config.subTypeId == this.subTypeArray[i].id){
                    _params = this.subTypeArray[i].statement;
                }
            }

            let _options = {};
            if(_params){
                _options.selectNum = _params.selectNum;
                if(_params.selectType == 0){
                     _options.selectType = 'Dept-User';
                }else if(_params.selectType == 1){
                    _options.selectType = 'User';
                }else if(_params.selectType == 2){
                    _options.selectType = 'Dept';
                }
            }   
            return _options;
        } 
  },
  created(){
        this.listAction();
        this.initItem();
        window.ecoDesignGridOrgSelectVm = this;
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
                    window.ecoDesignGridOrgSelectVm.setFormulaCallBack(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'ecoDesignGridOrgSelectVmCallBack');
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

                         /*初始化选择限制*/
                         this.subTypeArray = [];
                         if(response.data.remap && response.data.remap.org_subtype){
                                (response.data.remap.org_subtype).forEach((item)=>{
                                    item.id = Number(item.id);
                                    this.subTypeArray.push(item);
                                })
                         }

                        this.initConfig(_itemOperateId,_itemId,response.data.remap);
                }         
            }).catch((err)=>{
                console.log(err);
            })
       },

        
       /*初始化配置信息*/
       initConfig(_itemOperateId,_itemId,remap){
           
            /*初始化缺省项*/
            this.defaultIdArray = [];
            this.defaultIdArray.push({value:'17',label:'自定义'});
            this.defaultIdArray.push({value:'19',label:'直属上级机构'});
            this.defaultIdArray.push({value:'41',label:'发起人所在'});


               /*初始化选择范围 */
            this.selectAsnTypeArray = [];
            this.selectAsnTypeArray.push({value:0,label:'请选择'});
            this.selectAsnTypeArray.push({value:1,label:'自定义'});
            this.selectAsnTypeArray.push({value:2,label:' 发起人所在'});
            
            /*发起人所在*/
            if(remap && remap.system_orglevel){
                this.systemOrglevelArray = remap.system_orglevel;
            }

            if(remap && remap.select_assigee_orglevelkv){
                this.selectAsnOrgLevelArray = remap.select_assigee_orglevelkv;
            }
            
            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;
            _config.parentId = this.$route.params.parentItemId; //grid的id

            _config.modelType = 'ORGSLT',
            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'选择机构';
            _config.titleAlign = remap?remap.item_model.titleAlign:'left';
            _config.titleWidth = remap?remap.item_model.titleWidth:defaultTitleWidth;
            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
         
            _config.inst = remap?remap.item_model.inst:null;
            _config.subTypeId = remap?remap.item_model.subTypeId:17; //选择限制 选择机构（单选）
            _config.defaultId = remap?remap.item_model.defaultId:'17'; //缺省项 默认自定义
            _config.defaultVal = remap?remap.item_model.defaultVal:null;//默认的内容
            _config.defaultValHidden = remap?remap.item_model.defaultValHidden:null;//默认的内容
            _config.defaultOrgLevel = remap?remap.item_model.defaultOrgLevel:1; //发起人所在
            _config.defFieldId = remap?remap.item_model.defFieldId:null;

            _config.selectAsnType = remap?remap.item_model.asnType:0; //选择范围
            _config.selectAsnLg = 0;
            _config.selectAsnVal = null;//默认的内容    

            let _asnVal = remap?remap.item_model.asnVal:[];
            try{
                 (_asnVal).forEach((item)=>{
                     this.selectAsnOrgValHidden = item.dataVal;
                     this.selectAsnOrgLevel = item.orgLevel;
                })
            }catch(e){}

            
            _config.loaded1 = true;
            _config.loaded2 = true;
            this.config = _config;

            this.setSelectAsnVal();
       },

       /*日期格式发生变化 重置自定义 默认内容*/
       changeSubType(val){
            this.config.defaultVal = null;
            this.config.defaultValHidden = null;
       },

       
       setSelectAsnVal(){
            let _obj = {};
            _obj.lgId = 0;
            _obj.scopeType = this.config.selectAsnType;
            _obj.dataId = '';
            _obj.dParent = "";
            _obj.dataVal = this.selectAsnOrgValHidden;
            _obj.orgLevel = this.selectAsnOrgLevel;
            this.config.selectAsnVal =  "0@"+JSON.stringify(_obj);
       },

       changeDefaultId(val){ //选项内容切换的时候变化
           
       },

        //选取机构
       selectOrg(){
             this.config.defaultValHidden = data.id;
           this.config.defaultVal = data.name; 
       },

        tagSelectCB(data){
            this.selectAsnOrgValHidden = data.id;
            this.setSelectAsnVal();
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

         delete window.ecoDesignGridOrgSelectVm;
  }

}

</script>
<style scoped>
.designOrgSelectSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designOrgSelectSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designOrgSelectSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designOrgSelectSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designOrgSelectSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designOrgSelectSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designOrgSelectSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designOrgSelectSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designOrgSelectSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designOrgSelectSettingVue  .addOptions{
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
.designOrgSelectSettingVue .el-select{
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
