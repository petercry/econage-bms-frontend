<template>
      <div class="handleApprovalDescVue designItem" v-show="isVisible">
        <ecoField :titleWidth="mItem.titleWidth?mItem.titleWidth:defaultTitleWidth"  :bgColor="mItem.bgColor?mItem.bgColor:mForm?mForm.titleBgColor:null" 
            :titlePos="mItem.titlePos" class="handleField" :required="isRequired"
            :textAlign="mItem.titleAlign"
            :verticalAlign="mItem.verticalAlign?mItem.verticalAlign:'top'"
        >
           
           <div slot="label"  v-bind:style="{textAlign:mItem.titleAlign}">
                    <div class="labelTitle" :id="'handleItem'+mItem.itemId">
                        <i v-if="isRequired && mItem.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                        <span v-bind:style="{color:mItem.ftColor?mItem.ftColor:mForm?mForm.titleTextColor:null}">{{mItem.itemName}}</span>
                         <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                                <span></span>
                        </el-tooltip>
                    </div>
            </div>
           
            <div slot="content" class="ecoContent" >
                <div v-for="(oneGroupItem,onekey,idx) in actionGroupApprovalObj" :key="'actionG'+onekey"  v-bind:class="{appBorder: ( (idx+1)!=getObjNum(actionGroupApprovalObj)) }">
                          
                          <div v-if="oneGroupItem.approvalObj && getObjNum(oneGroupItem.approvalObj)>1" style="padding-top:0px;" class="approvalRunMore">
                                
                                <div v-for="(item,key,index) in oneGroupItem.approvalObj" :key="'g'+key" class="oneApprovalDesc">
                                    <div v-if="oneGroupItem.approvalLength>1" class="roundClass pointerClass" @click="toggleCollapse(onekey,index)">
                                        <span  >第{{index+1}}轮</span>
                                        <i class="icon iconfont iconicon_right" v-show="!oneGroupItem.activeName[(index+1)+'']"></i>
                                        <i class="icon iconfont iconbottom" v-show="oneGroupItem.activeName[(index+1)+'']"></i>
                                    </div>
                                    
                                    <div style="line-height:0px;">&nbsp;</div>
                                    <el-collapse-transition >
                                        <div v-show="oneGroupItem.activeName[(index+1)+'']" style="margin-top:10px;margin-bottom:10px;">
                                            <descCollapse :inputArr="item" class="descCollapsel1">
                                                <template slot-scope="slotProps">
                                                    <descCollapse :inputArr ="slotProps.child" class="descCollapsel2">
                                                        <template slot-scope="slotProps">
                                                            <descCollapse :inputArr ="slotProps.child" class="descCollapsel3">
                                                                <template slot-scope="slotProps">
                                                                    <descCollapse :inputArr ="slotProps.child" class="descCollapsel4">
                                                                        <template slot-scope="slotProps">
                                                                            <descCollapse :inputArr ="slotProps.child" class="descCollapsel5">
                                                                                <template slot-scope="slotProps">
                                                                                    <descCollapse :inputArr ="slotProps.child" class="descCollapsel6"></descCollapse>
                                                                                </template>
                                                                            </descCollapse>
                                                                        </template>
                                                                    </descCollapse>
                                                                </template>
                                                            </descCollapse>
                                                        </template>
                                                    </descCollapse>
                                                </template>
                                            </descCollapse>
                                        </div>
                                    </el-collapse-transition>
                                </div>
                            </div>


                            <div v-else-if="oneGroupItem.approvalObj && getObjNum(oneGroupItem.approvalObj) == 1" style="padding-top:10px;" class="approvalRun1">
                                <descCollapse v-for="(item, key,index) in oneGroupItem.approvalObj" :key="index" :inputArr="item" class="oneApprovalDesc2">
                                    <template slot-scope="slotProps">
                                        <descCollapse :inputArr ="slotProps.child" class="descCollapsel2">
                                            <template slot-scope="slotProps">
                                                <descCollapse :inputArr ="slotProps.child" class="descCollapsel3">
                                                    <template slot-scope="slotProps">
                                                        <descCollapse :inputArr ="slotProps.child" class="descCollapsel4">
                                                            <template slot-scope="slotProps">
                                                                <descCollapse :inputArr ="slotProps.child" class="descCollapsel5">
                                                                    <template slot-scope="slotProps">
                                                                        <descCollapse :inputArr ="slotProps.child" class="descCollapsel6"></descCollapse>
                                                                    </template>
                                                                </descCollapse>
                                                            </template>
                                                        </descCollapse>
                                                    </template>
                                                </descCollapse>
                                            </template>
                                        </descCollapse>
                                    </template>
                                </descCollapse>
                            </div>


                            <div v-if="oneGroupItem.approval0 &&  getObjNum(oneGroupItem.approval0) >= 1"  v-show="!oneGroupItem.approvalOrgDescShow" style="padding-top:10px;">
                                <descCollapse v-for="(item, key,index) in oneGroupItem.approval0" :key="index" :inputArr="item" class="oneApprovalDesc2">
                                    <template slot-scope="slotProps">
                                        <descCollapse :inputArr ="slotProps.child">
                                            <template slot-scope="slotProps">
                                                <descCollapse :inputArr ="slotProps.child">
                                                    <template slot-scope="slotProps">
                                                        <descCollapse :inputArr ="slotProps.child">
                                                            <template slot-scope="slotProps">
                                                                <descCollapse :inputArr ="slotProps.child">
                                                                    <template slot-scope="slotProps">
                                                                        <descCollapse :inputArr ="slotProps.child"></descCollapse>
                                                                    </template>
                                                                </descCollapse>
                                                            </template>
                                                        </descCollapse>
                                                    </template>
                                                </descCollapse>
                                            </template>
                                        </descCollapse>
                                    </template>
                                </descCollapse>
                            </div>


                        <div class="approvalOrgDesc" v-show="oneGroupItem. approvalOrgDescShow">{{ oneGroupItem.appprovalOrgSelectDesc}}</div>
                        <div class="approvalOrgSelectDo" v-show="oneGroupItem.approvalOrgSelectDoShow"><span @click="selectApprovalOrg(oneGroupItem.actionGroup)">点击编辑{{oneGroupItem.actionGroupItemName}}</span></div>
                </div>
             

            </div>



        </ecoField>   


        <div v-for="(item,itemIdx) in sealList" :key="itemIdx" class="sealDiv" v-bind:style="getSealStyle(item,itemIdx)">
             <el-image
                   :src="getSealSmallSrc(item)"
                    fit="contain"
                    :zIndex=3910>
                  <div slot="error" class="image-slot"></div>
            </el-image>
         </div> 

  </div>

</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import descCollapse from '../../components/descCollapse.vue'
import ecoField from '../../components/ecoField'
import {baseMainServerUrl} from '../../../config/env.js'

export default{
  name:'handleApprovalDesc',
  components:{
      descCollapse,
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
        },
        mForm:{
            type:Object
        }
  },
  data(){
        return {

            value:'',
            hiddenValue:'',
            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台

            approvalObj:{},
            approval0:{},
            approvalLength:0,
            appprovalOrgSelectDesc:'',
            approvalOrgDescShow:false,
            approvalOrgSelectDoShow:false,

            errTip:false,
            errMsg:'', 
            sealList:[],

            actionGroupApprovalObj:{},

        }
  },
  created(){
      
  },
  mounted(){
   
        if(this.mValue && this.mValue.approvalObj){
            for(let key in this.mValue.approvalObj){

                if(this.mValue.approvalObj[key]){
                        let _approvalObj = EcoUtil.objDeepCopy(this.mValue.approvalObj[key]);
                        let _approval0  = {};
                        let _objNum = this.getObjNum(_approvalObj);

                        if(!this.actionGroupApprovalObj[String(key)]){
                            this.$set(this.actionGroupApprovalObj,String(key),{});
                            this.$set(this.actionGroupApprovalObj[String(key)],'approvalObj',{});
                            this.$set(this.actionGroupApprovalObj[String(key)],'approval0',{});
                        }


                        if(_objNum>0){
                            if(_approvalObj['0']){
                                    _approval0 = EcoUtil.objDeepCopy(_approvalObj['0']);
                                  
                                    this.$set(this.actionGroupApprovalObj[String(key)],'approval0',{});
                                    this.$set(this.actionGroupApprovalObj[String(key)].approval0,'0',_approval0);
                                    delete _approvalObj['0'];
                            }
                        }

                       

                        this.$set(this.actionGroupApprovalObj[String(key)],'approvalObj',_approvalObj);
                }

            }
        }

        if(this.mItem && this.mItem.nullable == 0){
           this.isRequired = true;
       }

        if(this.mItem && this.mItem.visiable == 0){
            this.isVisible = false;
        }
       
        this.init();
        /*向上冒出签章事件*/
        if(this.mValue && this.mValue.sealCode && this.mValue.sealCode!=''){
             this.sealList = this.mValue.sealCode.split(",");
        }

     
      
  },
  computed:{
  },
  methods: {
        init(){
            if(this.mValue && this.mValue.approvalObj){
                for(let onekey in this.mValue.approvalObj){
                     let _tempKey = '';
                     let _index = 0;
            
                     this.$set(this.actionGroupApprovalObj[String(onekey)],'activeName',{});
                     this.$set(this.actionGroupApprovalObj[String(onekey)],'approvalLength',0);

                     for (let [key,item] in this.mValue.approvalObj[onekey]){
                            _tempKey = key;
                            _index++;
                            this.$set(this.actionGroupApprovalObj[String(onekey)].activeName,_index+'', false);
                            this.actionGroupApprovalObj[String(onekey)].approvalLength++
                     }
                     this.$set(this.actionGroupApprovalObj[String(onekey)].activeName,_index+'', true);
                }
            }
             
        },

        getObjNum(obj){
            if(obj){
                  return Object.keys(obj).length
            }else{
                  return 0;
            }
          
        },

        onClickEvent(){
            let emitEvent = {};
            emitEvent.action = 'approvalDescItemClick'
            emitEvent.data = {};
            emitEvent.data.actionGroup = this.mItem.actionGroup;
            this.$emit('emitEvent',emitEvent);
        },

        toggleCollapse(key,index){
             this.actionGroupApprovalObj[key].activeName[(index+1)+''] = !this.actionGroupApprovalObj[key].activeName[(index+1)+''];
        },

        callEvent(callObj){
          
         
            if(callObj && callObj.action == "approvalSelectOrgCallBack"){
                this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'appprovalOrgSelectDesc',callObj.value);
                this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'approvalOrgDescShow',true);
            }else if(callObj && callObj.action == "approvalOrgSelectDoShow"){
         
                if(!this.actionGroupApprovalObj[String(callObj.actionGroup)]){
                    this.$set(this.actionGroupApprovalObj,String(callObj.actionGroup),{});
                    this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'approvalObj',{});
                    this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'approval0',{});
                }

              

                this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'actionGroup',callObj.actionGroup);
                this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'appprovalOrgSelectDesc',callObj.value);
                this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'approvalOrgSelectDoShow',callObj.approvalOrgSelectDoShow);
                this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'actionGroupItemName',callObj.actionGroupItemName);

                if(this.actionGroupApprovalObj[String(callObj.actionGroup)].approvalObj){
                    if( Object.keys( this.actionGroupApprovalObj[String(callObj.actionGroup)].approvalObj ).length == 0){
                        if(Object.keys(this.actionGroupApprovalObj[String(callObj.actionGroup)].approval0).length == 0){
                                this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'approvalOrgDescShow',true);
                        }else if(Object.keys(this.actionGroupApprovalObj[String(callObj.actionGroup)].approval0).length == 1){
                            if(this.actionGroupApprovalObj[String(callObj.actionGroup)].approval0['0'].length > 0){
                                if(this.actionGroupApprovalObj[String(callObj.actionGroup)].approval0['0'][0].assigneeName == null){
                                     this.$set(this.actionGroupApprovalObj[String(callObj.actionGroup)],'approvalOrgDescShow',true);
                                }
                            }
                        }
                    }
                }

            }else if(callObj && callObj.action == 'doRefCheck'){
                this.doRefCheck(callObj.msgObj);
            }else if(callObj && callObj.action == "approvalOrgInteractionSetVisibale"){
                for(let key in this.actionGroupApprovalObj){
                    this.$set(this.actionGroupApprovalObj[String(key)],'approvalOrgSelectDoShow',callObj.approvalOrgSelectDoShow);
                }
            }
        },


        callRelWFEvent(selItems){
             (selItems).forEach((element,idx)=>{
                    this.value = element.value;
                    this.hiddenValue = element.hiddenValue;
              })
        },

        selectApprovalOrg(actionGroup){
             let _emit = {};
             _emit.action = 'approvalActGroupEvent';
             _emit.data = {};
      
             _emit.data.actionGroup = actionGroup;
             _emit.data.targetGroupItemName = 'approverItem';
             

             _emit.data.action = 'callApprovalSelectOrgAction';
             this.$emit('emitEvent',_emit); 
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
            }catch(e){
                console.log(e);
            }
        },

        /*获取缩略图地址*/
        getSealSmallSrc(sealCode){
            return baseMainServerUrl+'?cmd=sealImgController&_method=getSealThumbnailImgInfo&id='+sealCode;
        },


        getSealStyle(item,num){
            let _style = {};
            if(this.isVisible){
                let _num = num+1;
                let _top = 0;
                let _right = 10+(80*(_num-1));
             //   let _left = (this.mItem.titleWidth?this.mItem.titleWidth:defaultTitleWidth)+(80*(_num-1));
                _style.top = _top+'px';
                _style.right= _right+'px';
            }else{
                _style.display = 'none';
            }
            return _style;
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


  },
  watch: {

  }
}
</script>
<style scoped>
.handleApprovalDescVue{
    position:relative;
}

.handleApprovalDescVue .ecoTextLabel{
    font-size:14px;
    padding:10px 15px 0px 17px;
    line-height:20px;
}

.handleApprovalDescVue .ecoContent{
    min-height:40px;
    padding-bottom:10px;
    /* padding-top:10px; */
}

.DescBox .DescBoxItem:last-child{
    border: 2px solid #FF0000;
}

.handleApprovalDescVue .oneApprovalDesc{
    margin-top:0px;
}

.handleApprovalDescVue .descCollapsel1{
    padding-left:38px;
}
.handleApprovalDescVue .descCollapsel2{
    padding-left:15px;
}
.handleApprovalDescVue .descCollapsel3{
    padding-left:25px;
}
.handleApprovalDescVue .descCollapsel4{
    padding-left:35px;
}
.handleApprovalDescVue .descCollapsel5{
    padding-left:45px;
}
.handleApprovalDescVue .descCollapsel6{
    padding-left:55px;
}

.handleApprovalDescVue .approvalOrgDesc{
    
    margin-left:10px;
    color:rgb(96, 98, 102);
    margin-bottom:10px;
}

.handleApprovalDescVue .approvalOrgSelectDo{
   
    color:#1ba5fa;
    margin-left:10px;
    line-height:20px;
    margin-top:10px;
}
.handleApprovalDescVue .approvalOrgSelectDo span{
    cursor: pointer;
}

.handleApprovalDescVue .roundClass{
    line-height:32px;
    text-align: center;
    background-color: rgb(250, 250, 250);
    border-left:6px solid #1ba5fa;
    border-bottom:1px solid #e8e8e8
}

.handleApprovalDescVue .appBorder{
    border-bottom: 1px solid #f8f8f8;
    padding-bottom:10px;
}


</style>
