<template>
  <div class="ecoApprovalSuggestVue ecoZJVue" v-show="showflag">
        <div class="ecoApprovalSuggestDiv">
            <el-radio-group v-model="value" size="mini" :disabled="!isEditable"  @change="onChangeEvent" :id="'handleItem'+mItem.itemId">
                <el-radio v-bind:class="{argee:(item.id=='1'),disagree:(item.id=='0'),}" v-show="item.valid !='N' && item.idString" size="mini" :label="String(item.idString)" v-for="item in mValue.KVMap" :key="item.idString">{{item.text}}</el-radio>
                <el-radio size="mini" :label="item.id" v-for="item in pickerArray" :key="item.id">{{item.desc}}</el-radio>
            </el-radio-group>
        </div>

        <div class="ecoApprovalSuggestDiv" 
            v-if="showflag" v-show="this.value == 'ecoHandle5'">    
                <el-input :value="huiqianValue" readonly @click.native="showHuiqianPicker" 
                 style="border:1px solid #dcdfe6"
                placeholder="请选择接收人"
                ></el-input>
                <input type="hidden" v-model="huiqianHiddenValue" :id="'huiqian_EcoHandle'" />
                <input type="hidden" v-model="huiqianValue" :id="'huiqian_EcoHandle_text'" />
        </div>

         <div class="ecoApprovalSuggestDiv" 
            v-if="showflag" v-show=" this.value == 'ecoHandle2'">    
                <el-input :value="weituoValue" readonly @click.native="showWeituoPicker" 
                 style="border:1px solid #dcdfe6"
                placeholder="请选择接收人"
                ></el-input>
                <input type="hidden" v-model="weituoHiddenValue" :id="'weituo_EcoHandle'" />
                <input type="hidden" v-model="weituoValue" :id="'weituo_EcoHandle_text'" />
        </div>

         <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                    <span></span>
         </el-tooltip>
      
  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {mapState,mapMutations} from 'vuex'
import ecoField from '../../components/ecoField'

export default{
  name:'ecoApprovalSuggest',
  components:{
     ecoField
  },
  props:{
        mItem:{
            type:Object
        },
        mValue:{
            type:Object
        },
        mTask:{
            type:Object,
            default:function(){
                return {};
            }
        }
  },
  data(){
      return {
            value:'',
            text:'',
            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
            showflag:false,
            pickerArray:[],

            huiqianValue:'',
            huiqianHiddenValue:'',

            weituoValue:'',
            weituoHiddenValue:'',


            errTip:false,
            errMsg:'',
      }
  },
  created(){
     
  },
  computed:{
     
  },
  mounted(){

        this.value = this.mValue.value;
        if(this.mItem && this.mItem.nullable == 0){
           this.isRequired = true;
        }
        if(this.mItem && this.mItem.visiable == 0){
           this.isVisible = false;
        }
        if(this.mItem && this.mItem.isReadonly == 1 ){
           this.isReadonly = true;
        }
        if(this.mItem && this.mItem.editable == 0){
           this.isEditable = false;
        }

       
        this.showflag = (this.mTask.actionGroupId == this.mItem.actionGroup);
        if(this.mTask.actionGroupId == this.mItem.actionGroup){
            if(this.mTask.cosignFlag == '1'){
                    this.pickerArray.push({desc:'意见征询',id:'ecoHandle5'});
            }
            if(this.mTask.delegateFlag == '1'){
                    this.pickerArray.push({desc:'转交办理',id:'ecoHandle2'});
            }
        }

      
        if(!this.showflag){
           let _emit = {};
           _emit.action = 'approvalRowShowFlag'
           _emit.data = {};
           this.$emit('emitEvent',_emit); 
        }

     
        
  },
 
  methods: {

        onClickEvent(){
            /*触发点击焦点事件*/
            (this.mValue.onclickEvents).forEach((eventKey)=>{
                 let _emit = {};
                 _emit.action = 'onEventKeyAction'
                 _emit.data = {};
                 _emit.data.itemId = this.mItem.itemId;
                 _emit.data.eventKey = eventKey;
                 this.$emit('emitEvent',_emit); 
            })
       },

       onblurEvent(event){ //失去焦点事件
            (this.mValue.onblurEvents).forEach((eventKey)=>{
                        let _emit = {};
                        _emit.action = 'onEventKeyAction'
                        _emit.data = {};
                        _emit.data.itemId = this.mItem.itemId;
                        _emit.data.eventKey = eventKey;
                        this.$emit('emitEvent',_emit); 
            })
        },

        onChangeEvent(event){ //chang事件
            /*触发 同意不同意 到textarea*/
            let _desc = null;
            let _allDesc = '#';
            (this.mValue.KVMap).forEach((element,idx)=>{
                _allDesc+=element.text;
                 _allDesc+='#'
                if(element.idString == event){
                    _desc = element.text;
                   
                }
            })

             let _emit = {};
             _emit.action = 'approvalSuggestChange';
             _emit.data = {};
             _emit.data.itemId = this.mItem.itemId;
             _emit.data.desc = _desc;
             _emit.data.allDesc = _allDesc;
             _emit.data.actionGroup = this.mItem.actionGroup;
             _emit.data.action = 'approvalSuggestChange';
             this.$emit('emitEvent',_emit); 


            (this.mValue.onchangeEvents).forEach((eventKey)=>{
                    let _emit = {};
                    _emit.action = 'onEventKeyAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    _emit.data.eventKey = eventKey;
                    this.$emit('emitEvent',_emit); 
            });

            if(this.value == 'ecoHandle5'){
                this.showHuiqianPicker();
            }else if(this.value == 'ecoHandle2'){
                this.showWeituoPicker();
            }


            this.onInteraction();

         },

          /*相关性*/
        onInteraction(){
            if(this.mValue.hasInteraction){
                    let _emit = {};
                    _emit.action = 'onInteractionAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    this.$emit('emitEvent',_emit);
            }
        },

    
        getItemInputParamsValue(){  //Override 获取某个item的值
            let _obj = {};
             _obj.value = this.value
            return _obj;
        },

        setItemOutputParamsValue(value,hiddenValue,fromItemId){ //Override 设置item的值
            this.value = value;
            if(this.mItem.itemId != fromItemId){ //如果触发元不是本组件，接着触发本组件的chang事件
                this.onChangeEvent();
            }
       },

       showHuiqianPicker(){

                let emitObj = {};
                emitObj.action = 'onCustomOrgSelectAction';
                emitObj.data = {};
                emitObj.data.itemId = this.mItem.itemId;
                emitObj.data.orgId = 'huiqian_EcoHandle';
                emitObj.data.orgTextId = 'huiqian_EcoHandle_text';

                emitObj.data.initData = {};
                emitObj.data.initData.initDataType = 'STR';
                emitObj.data.initData.initDataStr = this.huiqianHiddenValue; 
                emitObj.data.initData.actionGroup = false;
                emitObj.data.initData.maxOrgPathLevel = 2;

                emitObj.data.options = {
                    selectNum:0,
                    selectType:'user-role',
                };

                this.$emit('emitEvent',emitObj);
      },


        showWeituoPicker(){
                let emitObj = {};
                emitObj.action = 'onCustomOrgSelectAction';
                emitObj.data = {};
                emitObj.data.itemId = this.mItem.itemId;
                emitObj.data.orgId = 'weituo_EcoHandle';
                emitObj.data.orgTextId = 'weituo_EcoHandle_text';

                emitObj.data.initData = {};
                emitObj.data.initData.initDataType = 'STR';
                emitObj.data.initData.initDataStr = this.weituoHiddenValue; 
                emitObj.data.initData.actionGroup = false;
                emitObj.data.initData.maxOrgPathLevel = 2;

                emitObj.data.options = {
                    selectType:'user-role',
                    selectNum:1
                };
                this.$emit('emitEvent',emitObj);
      },

      /*设置相关性*/
        setItemInteraction(event){
            if(event.eventType == 'SET_VISIBALE'){
                 if(event.eventSource.val == 0){
                     this.isVisible = false;
                 }else{
                     this.isVisible = true;
                 }

                  this.emitItemVisibleAction(event.eventSource.val);
            }else if(event.eventType == 'SET_NULLABLE'){
                if(event.eventSource.val == 0){
                    this.isRequired = true;
                }else{
                    this.isRequired = false;
                }
            } else if(event.eventType == 'SET_READONLY'){
                if(event.eventSource.val == 1){
                    this.isReadonly = true;
                }else{
                    this.isReadonly = false;
                }
           }else if(event.eventType == 'SET_VAL'){
                 this.value = event.eventSource.val.value;
                 this.hiddenValue = event.eventSource.val.hiddenValue;

                 this.onChangeEvent(); //触发改变事件
                 this.onblurEvent(); //触发失去焦点事件
            }
        },

        emitItemVisibleAction(visiable){
             let _emit = {};
             _emit.action = 'onItemVisibleAction'
             _emit.data = {};
             _emit.data.itemId = this.mItem.itemId;
             _emit.data.visiable = visiable;
             this.$emit('emitEvent',_emit); 
        },

     callEvent(obj){
           if(obj && obj.action == "orgSelectPopupConfirm"){
                this.orgSelectPopupConfim(obj);//选人组件确定回写
           }
      },

      callRelWFEvent(selItems){
             (selItems).forEach((element,idx)=>{
                    this.value = element.value;
                    this.hiddenValue = element.hiddenValue;
              })
             
             this.onblurEvent();
             this.onChangeEvent();
        },


      orgSelectPopupConfim(callBackObj){ //选人组件确定回写

                let _value = callBackObj.data.id;
                let _text = callBackObj.data.name;
                
                if(this.value == 'ecoHandle5'){
                    this.huiqianHiddenValue = _value;
                    this.huiqianValue = _text;
                }else if(this.value == 'ecoHandle2'){
                    this.weituoHiddenValue = _value;
                    this.weituoValue = _text;
                }

               
     },

      getRefValue(){  //提交的时候，获取
             let _obj = null;
             if(this.isEditable ){ //isEditable 提交
                 _obj  = {};
                 _obj.value = this.value;
               
                 if(this.showflag && this.mTask.cosignFlag == '1'){
                        if(this.value == 'ecoHandle5'){
                            _obj.a_d_flag = 5;
                            _obj.a_d_assignee = this.huiqianHiddenValue;
                        }
                 }
                 
                 if(this.showflag && this.mTask.delegateFlag == '1'){
                        if(this.value == 'ecoHandle2'){
                            _obj.a_d_flag = 2;
                            _obj.a_d_assignee = this.weituoHiddenValue;
                        }
                 }

             }
            
             
             return _obj;
        },

        getRefCheck(){ //检查 是否可以提交
            if(this.isEditable ){
                if(this.isRequired ){
                    if(!this.value || this.value == ''){
                        return {status:1,msg:this.mItem.itemName+'决策 必须选择',checkId:'handleItem'+this.mItem.itemId,itemId:this.mItem.itemId} ;
                    }
                }

                 if(this.value == 'ecoHandle5'){
                         if(!this.huiqianHiddenValue || this.huiqianHiddenValue == ''){
                              return {status:1,msg:this.mItem.itemName+'会签人员 必须选择',checkId:'handleItem'+this.mItem.itemId,itemId:this.mItem.itemId} ;
                         }
                 }
                
                 if(this.value == 'ecoHandle2'){
                         if(!this.weituoHiddenValue || this.weituoHiddenValue == ''){
                              return {status:1,msg:this.mItem.itemName+'委托人员 必须选择',checkId:'handleItem'+this.mItem.itemId,itemId:this.mItem.itemId} ;
                         }
                    }
            }
            return {status:0}
        },


        doRefCheck(obj){
            try{
                   this.errTip = true;
                   this.errMsg = obj.msg;
                   let that = this;
                   setTimeout(function(){
                        that.errTip = false;
                   },2000);

                   document.getElementById('handleItem'+this.mItem.itemId).scrollIntoView(true);

                   if(this.value == 'ecoHandle5'){
                       this.showHuiqianPicker();
                   }else if(this.value == 'ecoHandle2'){
                       this.showWeituoPicker();
                   }
            }catch(e){
                console.log(e);
            }
        }


      
  },
  watch: {

  }
}
</script>
<style scoped>


.ecoApprovalSuggestVue .icon-shanchu1{
    font-size: 13px;
    padding-left:5px;
    padding-right:5px;
}

.ecoApprovalSuggestVue .ecoApprovalSuggestDiv{
    line-height: 32px;
    margin:10px 0px;
}



</style>
