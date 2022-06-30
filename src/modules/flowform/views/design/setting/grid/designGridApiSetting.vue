<template>
    <div class="designInputSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName"><span @click="goBack" class="pointerCalss"><i class="icon iconfont iconback back"></i></span> 明细:API关联</div>
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
                    <el-slider v-model="config.titleWidth"  :min="0" :max="500" show-input input-size="mini" ></el-slider>
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
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title">
                         <el-button  @click="goApiSetting" class="plainBtn" style="width:100%;">设置API关联 ({{sc_entity?1:0}})</el-button>
                    </el-col>
                </el-row>
            </div>

             <div class="ecoSettingBlock">
                <div class="ecoSettingDesc"><span class="title">查看关联</span></div>
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title">
                         <el-button  @click="goViewApiSetting" class="plainBtn" style="width:100%;">查看API关联设置({{view_entity?1:0}})</el-button>
                    </el-col>
                </el-row>
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
                                <el-input 
                                    v-model="config.defaultVal" 
                                >
                                </el-input>
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

import {getItemModelUpdateApplyAjax} from'../../../../service/service'
import {defaultTitleWidth,defaultFTColor}  from'../../../../config/setting.js'
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
        sc_entity:null,
        view_entity:null,
        config:{
            loaded1:false,
            loaded2:false,
            itemId:0,
            parentId:this.$route.params.parentItemId,
            itemOperateId:0,
            modelType:'REL_API',
            changeLine:1,
            titleName:'API关联', //标题名称
            titlePos:'l',//标题位置
            titleAlign:'left',//标题对齐方式
            titleWidth:defaultTitleWidth,//标题宽度
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
            nullable:false, //必填
            visiable:false, //隐藏
            itemWidth:160, //组件宽度 占比 整型
            inst:null,//操作提示

            defFieldId:null,//自定义表示

            defaultId:'0', //默认内容 自定义/当前时间
            defaultVal:null, //默认内容
            defaultValHidden:null,//默认内容
            apiSceneId:0,
            viewSceneId:0
        },
        defaultIdArray:[],
     
    }
  },
 computed:{
      
  },
  created(){
      this.listAction();
      this.initItem();
      window.ecoDesignGridInputVm = this;

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
                if(obj && obj.action == 'sceneSetting'){
                    window.ecoDesignGridInputVm.setSceneCallBack(obj.data);
                }else if(obj && obj.action == 'viewApiSetting'){
                    window.ecoDesignGridInputVm.setViewSceneCallBack(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'ecoDesignGridAPIVmCallBack');
        },

       /*初始化组件*/
       initItem(){
            this.uuid = this.$route.params.childUUID;
            this.itemId = this.$route.params.childItemId;
            this.formOperateId = this.$route.params.formOperateId;

            this.sc_entity = null;
            this.view_entity = null;

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
                        this.sc_entity = response.data.remap.sc_entity;
                         if(response.data.remap.view_scene){
                             this.view_entity = response.data.remap.view_scene.sc_entity;
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
            this.defaultIdArray.push({value:'0',label:'暂无'});
            this.defaultIdArray.push({value:'17',label:'自定义赋值'});
            
            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;
            _config.parentId = this.$route.params.parentItemId; //grid的id
            _config.modelType = 'REL_API',

            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'API关联';
           _config.titleAlign = remap?remap.item_model.titleAlign:'left';
            _config.titleWidth = remap?remap.item_model.titleWidth:defaultTitleWidth;
            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
         
            _config.defaultId = remap?remap.item_model.defaultId:'0'; //缺省项 默认自定义
            if(_config.defaultId == '-1'){
                _config.defaultId = '0';
            }
            _config.defaultVal = remap?remap.item_model.defaultVal:null;//默认的内容
            _config.defaultValHidden = remap?remap.item_model.defaultValHidden:null;//默认的内容
            _config.inst = remap?remap.item_model.inst:null;
            _config.apiSceneId = remap?(remap.item_model.apiSceneId?remap.item_model.apiSceneId:0):0; 
            _config.viewSceneId = remap?(remap.item_model.viewSceneId?remap.item_model.viewSceneId:0):0; 

            _config.defFieldId = remap?remap.item_model.defFieldId:null;
            
            _config.loaded1 = true;
            _config.loaded2 = true;
            this.config = _config;
          
       },

       changeDefaultId(val){ //选项内容切换的时候变化
           
       },
       

        setSceneCallBack(obj){
           this.config.apiSceneId = obj.scId;
           this.sc_entity = {};
           this.sc_entity.refId = obj.refId;
           this.sc_entity.scId = obj.scId;
       },

        setViewSceneCallBack(obj){
           this.config.viewSceneId = obj.scId;
           this.view_entity = {};
           this.view_entity.refId = obj.refId;
           this.view_entity.scId = obj.scId;
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

        goApiSetting(){
                    let _url = '';
                    if(null == this.sc_entity){
                        _url = '/flowform/index.html#/selectConnector/'+this.config.itemOperateId+'/0/0/0';
                    }else{
                        _url = '/flowform/index.html#/sceneSetting/'+this.config.itemOperateId+'/'+this.sc_entity.refId+'/'+this.config.apiSceneId;
                    }
                    let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                    EcoUtil.getSysvm().openDialog('API关联设置',_url,950,_height,'50px');
       },

        goViewApiSetting(){
                let _url = '';
                if(null == this.view_entity){
                     _url = '/flowform/index.html#/selectConnector/'+this.config.itemOperateId+'/0/0/6';
                }else{
                     _url = '/flowform/index.html#/viewApiSetting/'+this.config.itemOperateId+'/'+this.view_entity.refId+'/'+this.config.viewSceneId;
                }
                let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                EcoUtil.getSysvm().openDialog('API关联查看设置',_url,950,_height,'50px');
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
         delete window.ecoDesignGridInputVm;
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


.ecoSettingDesc .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}


</style>
