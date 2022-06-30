<!--处理方式组件 -->
<template>
  <div class="ecoHandleVue ecoZJVue" v-show="showflag">
       <!-- <ecoField :titleWidth="80" >
            <div slot="label">处理方式</div>
            <div slot="content"> 
                    <el-radio-group v-model="adValue" size="mini">
                        <el-radio size="mini" :label="item.value+''" v-for="item in pickerArray" :key="item.id">{{item.text}}</el-radio>
                    </el-radio-group>
            </div>
       </ecoField> -->
        <div class="ecoHandleDiv">
                <el-radio-group v-model="adValue" size="mini">
                        <el-radio size="mini" :label="item.value+''" v-for="item in pickerArray" :key="item.id">{{item.text}}</el-radio>
                </el-radio-group>
        </div>
        <ecoField :titleWidth="80" v-show="this.adValue == '5' || this.adValue == '2' || this.adValue == '1'">
            <div slot="label">接收人</div>
            <div slot="content"> 
                 <el-input :value="orgValue" readonly  @click.native="showUserPicker"    ></el-input>
                <input type="hidden" v-model="orgHiddenValue" :id="'ecoOrg_EcoHandle'" actionGroup=true/>
                <input type="hidden" v-model="orgValue" :id="'ecoOrg_EcoHandle_text'" actionGroup=true/>
            </div>
        </ecoField>
     
        
  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {mapState,mapMutations} from 'vuex'
import ecoField from '../../components/ecoField'
export default{
  name:'ecoInput',
  components:{
     ecoField
  },
  props:{
         mTask:{
            type:Object,
            default:function(){
                return {};
            }
        }
  },
  data(){
      return {
            adValue:'0',
            adText:'',
            orgValue:'',
            orgHiddenValue:'',
            pickerArray:[],
            required:false,
            itemId:'EcoHandle',
            showflag:false,
      }
  },
  created(){
      
  },
  mounted(){

      this.pickerArray.push({text:'直接处理',value:'0'});
      this.pickerArray.push({text:'内部会签',value:'5'});
      this.pickerArray.push({text:'委托办理',value:'2'});
      this.pickerArray.push({text:'意见征询',value:'1'});
      
   
      this.showflag = (this.mTask.actionGroupId !=0);
    
  },
  computed:{
   
  },
  methods: {

       showUserPicker(){
                
                let emitObj = {};
                emitObj.action = 'onCustomOrgSelectAction';
                emitObj.data = {};
                emitObj.data.itemId = this.itemId;
                emitObj.data.orgId = 'ecoOrg_EcoHandle';
                emitObj.data.orgTextId = 'ecoOrg_EcoHandle_text';
                emitObj.data.options = {
                        selectType:0,
                        idType:3,
                        selectNum:0,
                        selectDeafult:10
                };
                this.$emit('emitEvent',emitObj);
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
            let _value = '';
            let _text = '';
            if(callBackObj.data && callBackObj.data.ucSelectedTags){
                (callBackObj.data.ucSelectedTags).forEach((element,idx) => {
                    if(_value !=''){
                        _value +='|';
                    }
                    if(_text!=''){
                        _text+=',';
                    }
                    _value += element.value;
                    _text += element.desc;
                });
          }
            
            this.orgHiddenValue = _value;
            this.orgValue = _text;
      },

      clearOrgSelect(){
                    this.orgValue = '';
                    this.orgHiddenValue = '';
      },

       getRefValue(){  //提交的时候，获取
            let _obj  = {};
            _obj.a_d_flag = this.adValue;
            _obj.a_d_assignee = this.orgHiddenValue;
            return _obj;
        }
  
      
  },
  watch: {

  }
}
</script>
<style scoped>

.ecoHandleVue .icon-shanchu1{
    font-size: 13px;
    padding-left:5px;
    padding-right:5px;
}

.ecoHandleVue .ecoHandleDiv{
    line-height: 32px;
    margin:10px 0px;
}
</style>
