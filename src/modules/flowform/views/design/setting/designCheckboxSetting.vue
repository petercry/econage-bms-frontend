<template>
    <div class="designCheckboxSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName">多选框</div>
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
                    <el-slider v-model="config.titleWidth"  :min="10" :max="500" :step="5" show-input input-size="mini" ></el-slider>
                </div>
            </div>

            <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">列数</span></div>
                <div>
                    <el-slider v-model="config.optionGrid"  :min="0" :max="5" :step="1" show-input input-size="mini" ></el-slider>
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
                <el-row class="ecoSettingDesc">
                    <el-col :span="12" class="title"><span>选项内容</span> </el-col>
                    <el-col :span="12" class="note2" >

                        <span @click="refreshBasicKV"><i class="icon iconfont iconicon_huifu"></i></span>  
                        &nbsp;
                        <span @click="goBasicKVPage"><i class="icon iconfont iconicon-test"></i></span> 
                    </el-col>
                </el-row>
                <div>

                        <el-select v-model="config.sysKeyValueOptionsValue"  filterable  placeholder="请选择" @change="onSysKeyValueOptionsChange">
                                <el-option-group
                                            v-for="group in sysKeyValueOptions"
                                            :key="group.id"
                                            :label="group.name"
                                >
                                        <el-option
                                                v-for="item in group.basicKvGroups"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                </el-option-group>
                        </el-select>

                        <el-row class="ecoSettingDesc" style="margin-top:10px;">
                                <el-col :span="24" class="title"><span>默认选中</span> </el-col>
                        </el-row>

                            <el-select v-model="config.sysOptionsDefautl" clearable multiple  filterable placeholder="请选择">
                                    <el-option
                                        v-show="item.enableInCreate"
                                        v-for="item in config.sysOptions"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                        </el-select>
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

import {getItemModelCreateApplyAjax,createFormItemModelAjax,getItemModelUpdateApplyAjax,getBasicKvCategoryList,getBasicKvGroupList} from'../../../service/service'
import {defaultTitleWidth}  from'../../../config/setting.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'


export default{
  name:'designCheckboxSettingVue',
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
            modelType:'CHECKBOX',
            changeLine:1,
            titleName:'多选框', //标题名称
            titlePos:false,//标题位置
            titleAlign:'left',//标题对齐方式
            verticalAlign:'top',
            titleWidth:defaultTitleWidth,//标题宽度
            optionGrid:0,//列数
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
            formula:null,
            nullable:false, //必填
            visiable:false, //隐藏
            ispk:false, //主键
            ispn:false, //记录名称
            itemWidth:160, //组件宽度 占比 整型
            inst:null,//操作提示
            defFieldId:null,//自定义表示
          
            sysOptions:[],
            sysOptionsDefautl:[],
            sysKeyValueOptionsValue:null,
        },
        
        keyValueArray:[],
        sysKeyValueOptions:[],
      
     

    }
  },
 computed:{
        ...mapState([
            'wfFormDesignConfig',
            'viewTabActiveKey'
        ]),
  },
  created(){
      this.getBasicKvCategoryListFunc();
      this.initItem();
  },
  methods: {
        ...mapMutations([
            'SET_WF_FORM_DESIGN_CONFIG',
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE'
       ]),

        getBasicKvCategoryListFunc(){
            getBasicKvCategoryList().then((response)=>{
                this.sysKeyValueOptions = response.data;
            }).catch((error)=>{ })
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
            
            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;

            _config.modelType = 'CHECKBOX',
            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'多选框';
            _config.titleAlign = remap?remap.item_model.titleAlign:'left';
            _config.verticalAlign = remap?remap.item_model.verticalAlign:'top';
            _config.titleWidth = remap?remap.item_model.titleWidth:defaultTitleWidth;
            _config.optionGrid = remap?remap.item_model.optionGrid:0;
            _config.titlePos = remap?(remap.item_model.titlePos=='n'?true:false):false;//隐藏标题 默认隐藏
            
            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
            _config.ispk = remap?(remap.item_model.ispk==1?true:false):false;
            _config.defFieldId = remap?remap.item_model.defFieldId:null;
            _config.inst = remap?remap.item_model.inst:null;

            _config.sysOptions = [];
            _config.sysOptionsDefautl = [];

            /*系统基础设置默认值*/
            if(remap && remap.item_model){
                  _config.sysKeyValueOptionsValue = remap.item_model.keyValueList;
                  if(_config.sysKeyValueOptionsValue == 0){
                      _config.sysKeyValueOptionsValue = null;
                  }
            }else{
                  _config.sysKeyValueOptionsValue = null;
            }
            
            if(!remap){ //没有remap
                /*初始化选项内容 自定义*/
                _config.loaded1 = true;
                _config.loaded2 = true;
                this.config = _config;
            }else{ //更新数据
                _config.loaded1 = true;
                _config.loaded2 = false;
                this.config = _config;

                /*获取系统基础数据*/
                getBasicKvGroupList(_config.sysKeyValueOptionsValue).then((response)=>{ 
                        this.config.sysOptions = response.data;
                        if(remap && remap.item_model.defaultId && remap.item_model.defaultId!=''){
                            this.config.sysOptionsDefautl = remap.item_model.defaultId.split(',');
                         }

                        this.config.loaded2 = true;
                }).catch((error)=>{})

            }
       },
   

       onSysKeyValueOptionsChange(val){ //系统基础数据改变
            this.config.sysOptions = [];
            this.config.sysOptionsDefautl = [];
            getBasicKvGroupList(val).then((response)=>{
                this.config.sysOptions = response.data;
            })
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

        goBasicKVPage(){
            let _url = '/manage/index.html#/basicKv';
            let _height = parent.window.document.getElementById("aside").offsetHeight-120;
            EcoUtil.getSysvm().openDialog('',_url,1200,_height,'50px');
       },

        refreshBasicKV(){
           this.getBasicKvCategoryListFunc();
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
.designCheckboxSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designCheckboxSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designCheckboxSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designCheckboxSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designCheckboxSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designCheckboxSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designCheckboxSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designCheckboxSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designCheckboxSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designCheckboxSettingVue  .addOptions{
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
.designCheckboxSettingVue .el-select{
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

.ecoSettingDesc .note2{
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    color: #409EFF;
    font-weight: normal;
    text-align: right;
    cursor: pointer;
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
