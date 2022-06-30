<template>
    <div class="designWFSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        
        <div class="itemVueName">流程关联</div>
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
                            <el-radio-button label="l" >左对齐</el-radio-button>
                            <el-radio-button label="c" >居中</el-radio-button>
                            <el-radio-button label="r" >右对齐</el-radio-button>
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
                    <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.bgColor"  @active-change="onBgChange"></el-color-picker></span></el-col>
                </el-row>
            </div>

            <el-divider></el-divider>
        
            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title">
                         <el-button  @click="goRelWFSetting" class="plainBtn" style="width:100%;">设置流程关联({{config.wfSceneId == 0?0:1}})</el-button>
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
                  

                    <div v-show="config.defaultId == 17">
                                <el-input 
                                    v-model="config.defaultVal" 
                                    
                                >
                                <!-- <i slot="suffix" class="icon iconfont iconrenyuan selectUserIcon" ></i> -->
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
                 <el-row class="ecoSettingDesc">
                        <el-col :span="12" class="switchDesc">
                            <el-switch  v-model="config.ispk" size="mini"> </el-switch>
                            <span>主键</span>
                        </el-col>
                        <el-col :span="12" class="switchDesc" v-show="false">
                            <el-switch  v-model="config.isfk" size="mini"> </el-switch>
                            <span>外键</span>
                        </el-col>
                 </el-row>

                <el-row class="ecoSettingDesc" v-show="false">
                        <el-col :span="12" class="switchDesc">
                            <el-switch  v-model="config.ispn" size="mini"> </el-switch>
                            <span>记录名称</span>
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

            <div class="ecoSettingBlock" v-show="false">
                <div class="ecoSettingDesc"><span class="title">输出列</span></div>
                <div>
                        <el-select v-model="config.outputCol" filterable placeholder="请选择">
                                <el-option
                                    v-for="item in outputColOptions"
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

import {getItemModelCreateApplyAjax,createFormItemModelAjax,getItemModelUpdateApplyAjax} from'@/flowform/service/service'
import {defaultTitleWidth,defaultFTColor}  from'@/flowform/config/setting.js'

import {Loading} from 'element-ui';
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import {sysEnv} from '@/flowform/config/env.js'

export default{
  name:'designWFSettingVue',
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
            modelType:'REL_WF',
            changeLine:1,
            titleName:'流程关联', //标题名称
            titlePos:false,//标题位置
            titleAlign:'l',//标题对齐方式
            titleWidth:defaultTitleWidth,//标题宽度
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
          
            nullable:false, //必填
            visiable:false, //隐藏
            ispk:false, //主键
            isfk:false, //外健
            ispn:false, //记录名称
            itemWidth:160, //组件宽度 占比 整型
            inst:null,//操作提示
            defFieldId:null,//自定义表示
            outputCol:null,//输出列

            defaultId:0, //默认内容 自定义/当前时间
            defaultVal:null, //默认内容
            defaultValHidden:null,//默认内容
            wfSceneId:0
          
        },
        
        outputColOptions:[],
        defaultIdArray:[],
     
    }
  },
 computed:{
        ...mapState([
            'wfFormDesignConfig',
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
                if(obj && obj.action == 'relWFSetting'){
                    window.ecoDesignSettingVm.setRelWFCallBack(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'desingRelWFSettingConfig');
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
                   //   let _wfSceneId = response.data.remap.wf_scene_id;
                        let _wfSceneId = 0;
                        /*初始化配置信息*/
                        this.initConfig(_itemOperateId,_itemId,null,_wfSceneId);
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
       initConfig(_itemOperateId,_itemId,remap,_wfSceneId){

            /*初始化缺省项*/
            this.defaultIdArray = [];
            this.defaultIdArray.push({value:0,label:'暂无'});
            this.defaultIdArray.push({value:17,label:'自定义赋值'});
            
            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;
            _config.modelType = 'REL_WF';

            if(_wfSceneId){
                _config.wfSceneId = _wfSceneId;
            }else{
                _config.wfSceneId = remap?(remap.item_model.wfSceneId?remap.item_model.wfSceneId:0):0; 
            }

            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'流程关联';
            _config.titleAlign = remap?remap.item_model.titleAlign:'l';
            _config.titleWidth = remap?remap.item_model.titleWidth:defaultTitleWidth;
            _config.titlePos = remap?(remap.item_model.titlePos=='n'?true:false):false;//隐藏标题 默认隐藏

            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
            _config.ispk = remap?(remap.item_model.ispk==1?true:false):false; //主键
            _config.isfk = remap?(remap.item_model.isfk==1?true:false):false; //外键
            _config.ispn = remap?(remap.item_model.ispn==1?true:false):false; //记录名称

            _config.defFieldId = remap?remap.item_model.defFieldId:null;
            _config.inst = remap?remap.item_model.inst:null;
            _config.outputCol = remap?remap.item_model.outputCol:null;
         
            _config.defaultId = remap?remap.item_model.defaultId:0; //缺省项 默认自定义
            _config.defaultVal = remap?remap.item_model.defaultVal:null;//默认的内容
            _config.defaultValHidden = remap?remap.item_model.defaultValHidden:null;//默认的内容
            
           
            
            _config.loaded1 = true;
            _config.loaded2 = true;
            this.config = _config;
   
       },

       changeDefaultId(val){ //选项内容切换的时候变化
           
       },

        /* 申请创建操作 保存数据库数据*/
       createItem(){
            createFormItemModelAjax(this.config).then((response)=>{
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

        goRelWFSetting(){
                let _url = '';
                if(this.config.wfSceneId == 0){
                        _url = '/wh/jsp/version3/flowform/index.html#/linkWfSetting/'+this.config.itemOperateId+'/0';
                }else{
                        _url = '/wh/jsp/version3/flowform/index.html#/linkWfSetting/'+this.config.itemOperateId+'/'+this.config.wfSceneId;
                }

                let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                EcoUtil.getSysvm().openDialog('流程关联设置',_url,950,_height,'50px');
              
       },

       setRelWFCallBack(obj){

           this.config.wfSceneId = obj.scId;

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
         console.log('销毁组件前调用');
         if(this.changed){
             this.onEmitHandle('saveUpdateConfig',true);
         }
  }

}

</script>
<style scoped>
.designWFSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designWFSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designWFSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designWFSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designWFSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designWFSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designWFSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designWFSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designWFSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designWFSettingVue  .addOptions{
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
.designWFSettingVue .el-select{
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


.designWFSettingVue .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}

</style>
