<template>
    <div class="designBtnSettingVue designSettingVue" v-show="config.loaded1 && config.loaded2">
        <div class="itemVueName">按钮</div>
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
                    <el-col :span="12" ><span><el-color-picker size="mini" v-model="config.bgColor"  @active-change="onBgChange"></el-color-picker></span></el-col>
                </el-row>
            </div>


            <div class="ecoSettingBlock" >
                    <el-row class="ecoSettingDesc">
                            <el-col :span="24" class="switchDesc">
                                <el-switch  v-model="config.compFixed" size="mini"> </el-switch>
                                <span>固定组件宽度</span>
                            </el-col>
                    </el-row>
            </div>

            <div class="ecoSettingBlock" v-show="config.compFixed">
                <div class="ecoSettingDesc"><span class="title">组件宽度( % )</span></div>
                <div>
                    <el-slider v-model="config.compWidth"  :min="0" :max="100" :step="1" show-input input-size="mini" ></el-slider>
                </div>
            </div>

            <el-divider></el-divider>
        
            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title">
                         <el-button  @click="goBtnSetting" class="plainBtn" style="width:100%;">设置按钮({{config.apiSceneId?'1':'0'}})</el-button>
                    </el-col>
                </el-row>
            </div>

            <div class="ecoSettingBlock">
                <el-row class="ecoSettingDesc">
                    <el-col :span="24" class="title"><span>按钮名称</span> </el-col>
                </el-row>

                <div>
                    <el-input v-model="config.fileUploadbutton" > </el-input>
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

import {getItemModelCreateApplyAjax,createFormItemModelAjax,getItemModelUpdateApplyAjax} from'../../../service/service'
import {defaultTitleWidth}  from'../../../config/setting.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import {sysEnv} from '../../../config/env.js'


export default{
  name:'designBtnSettingVue',
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
            modelType:'BTN',
            changeLine:1,
            titleName:'流程关联', //标题名称
            titlePos:true,//标题位置
            titleAlign:'left',//标题对齐方式
            verticalAlign:'top',
            titleWidth:defaultTitleWidth,//标题宽度
            ftColor:null,//标题文字颜色
            bgColor:null,//标题背景颜色
            nullable:false, //必填
            visiable:false, //隐藏
            ispk:false, //主键
            itemWidth:10, //组件宽度 占比 整型
            inst:null,//操作提示
            defFieldId:null,//自定义表示
            defaultVal:'', //默认内容
            defaultValHidden:null,//默认内容

            apiSceneId:null,
            compFixed:false,
            compWidth:50,
            fileUploadbutton:'按钮'            
        },
        
     
 
     
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
            'SET_WF_FORM_DESIGN_CONFIG_CHANGE',
       ]),

         listAction(){
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'buttonSetting'){
                    window.ecoDesignSettingVm.setBtnCallBack(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'desingBtnSettingConfig');
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
                        this.initConfig(_itemOperateId,_itemId,null);
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
            
            let _config = {};
            _config.itemOperateId = _itemOperateId;
            _config.itemId = _itemId;
            _config.modelType = 'BTN';

            _config.apiSceneId = remap?remap.item_model.apiSceneId:null;
            _config.changeLine = remap?remap.item_model.changeLine:1; //默认换行
            _config.titleName = remap?remap.item_model.titleName:'按钮';
            _config.titleAlign = remap?remap.item_model.titleAlign:'left';
            _config.verticalAlign = remap?remap.item_model.verticalAlign:'top';
            _config.titleWidth = remap?remap.item_model.titleWidth:defaultTitleWidth;
            _config.titlePos = remap?(remap.item_model.titlePos=='n'?true:false):true;//隐藏标题 默认隐藏
            _config.itemWidth = remap?remap.item_model.itemWidth:10;

            _config.ftColor = remap?remap.item_model.ftColor:null;
            _config.bgColor = remap?remap.item_model.bgColor:null;
            _config.nullable = remap?(remap.item_model.nullable==0?true:false):false;
            _config.visiable = remap?(remap.item_model.visiable==0?true:false):false;
            _config.ispk = remap?(remap.item_model.ispk==1?true:false):false; //主键

            _config.defFieldId = remap?remap.item_model.defFieldId:null;
            _config.inst = remap?remap.item_model.inst:null;
            
            _config.defaultVal = remap?remap.item_model.defaultVal:null;//默认的内容
            _config.defaultValHidden = remap?remap.item_model.defaultValHidden:null;//默认的内容

            _config.compFixed = remap?remap.item_model.compFixed:false;
            try{
                _config.compWidth = remap?Number(remap.item_model.compWidth):50;
            }catch(e){}
            _config.fileUploadbutton = remap?remap.item_model.fileUploadbutton:'按钮';//默认的内容

          
            _config.loaded1 = true;
            _config.loaded2 = true;
            this.config = _config;
   
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

       goBtnSetting(){
                let _url = _url = '/flowform/index.html#/buttonSetting/'+this.config.itemOperateId;
                if(sysEnv == 1){
                    let _height = parent.window.document.getElementById("aside").offsetHeight-200;
                    EcoUtil.getSysvm().openDialog('按钮设置',_url,950,_height,'50px');
                }else{
                    this.$router.push({name:'buttonSetting',params:{operateId:this.config.itemOperateId}});
                }
       },

       setBtnCallBack(obj){
           this.config.apiSceneId = obj.apiSceneId;
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
.designBtnSettingVue .setting{
    margin:10px 20px 50px 20px;
}

.designBtnSettingVue .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 26px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.designBtnSettingVue .optionsDiv{
    font-size: 13px;
    line-height: 30px;
    height:30px;
    border:1px solid rgb(232, 232, 232);
    margin-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    vertical-align: middle;
}

.designBtnSettingVue .optionsDiv .iconfont{
    vertical-align: middle;
}

.designBtnSettingVue .optionsDiv .meixuanzhong{
    color:rgba(0, 0, 0, 0.65);
}

.designBtnSettingVue .optionsDiv .xuanzhong{
    color:#409eff;
}

.designBtnSettingVue .optionsDiv .handle{
    color:#409eff;
    cursor: move;
    font-size: 16px;
}
.designBtnSettingVue .optionsDiv .deleteicon{
    color:#409eff;
    cursor: pointer;
    font-size: 16px;
}
.designBtnSettingVue .optionsDiv input{
    vertical-align: middle;
    border:0px;
    outline:none;
    color:rgba(0, 0, 0, 0.65);
    height:26px;
    line-height: 26px;
    width:120px;
    font-size: 14px;
}
.designBtnSettingVue  .addOptions{
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
.designBtnSettingVue .el-select{
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


.designBtnSettingVue .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}

</style>
