<template>
  <div class="handleOrgSelectVue designItem" v-show="isVisible">

        <ecoField :titleWidth="mItem.titleWidth?mItem.titleWidth:defaultTitleWidth" :bgColor="mItem.bgColor?mItem.bgColor:mForm?mForm.titleBgColor:null" 
                     :titlePos="mItem.titlePos" v-bind:class="{'iptReadonly':(!isEditable || isReadonly)}" :required="isRequired"
                     :textAlign="mItem.titleAlign"
                     :verticalAlign="mItem.verticalAlign?mItem.verticalAlign:'top'"
                >
                
                <div slot="label"  v-bind:style="{textAlign:mItem.titleAlign}">
                    <div class="labelTitle" >
                        <i v-if="isRequired && mItem.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                        
                        <span v-bind:style="{color:mItem.ftColor?mItem.ftColor:mForm?mForm.titleTextColor:null}">{{mItem.itemName}}</span>
                        <el-tooltip class="item" effect="dark" :content="mItem.inst" placement="top" v-if="mItem.inst && mItem.inst !=''">
                             <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                        </el-tooltip>

                         <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                                <span></span>
                        </el-tooltip>
                    </div>
                </div>

                 <div slot="content"> 


                     <el-popover
                                    ref="userPopover"
                                    width="288"
                                    placement="bottom-start"
                                    trigger="manual"
                                    v-if="false && (isEditable && !isReadonly)"
                                    v-model="searchPopover"
                                    popper-class="ecoUserOrgSearchPop"
                                    >
                                    <el-row style="background-color:#fafafa">
                                            <el-col :span="9" style="background-color:#ffff">
                                                    <div style="height:200px;width:108px">
                                                        <el-scrollbar style="height:100%" ref="searchScroll">
                                                            <ul class="pop-result-ul"   v-if="searchResult.length > 0">
                                                                <li :ref="'searchLi'+idx"
                                                                    v-for="(item,idx) in searchResult" :key="idx" 
                                                                    v-bind:class="{highlighted:idx == searchResultIdx}" 
                                                                    @mouseover="mouseOver(item,idx)"
                                                                    @click="clickOneUser(idx)"
                                                                >
                                                                    {{item.name}}
                                                                </li>
                                                            </ul>
                                                            <div v-else> 暂无数据 </div>
                                                        </el-scrollbar>
                                                    </div>
                                            </el-col>
                                            <el-col :span="15" >
                                                <div style="height:200px;width:180px">
                                                        <el-scrollbar style="height:100%" >
                                                              <div v-if="searchResult.length > 0" class="userPopoverDet">
                                                                    <table style="width:100%">
                                                                        <tr >
                                                                            <td style="width:50px" class="title">部门</td>
                                                                            <td class="det">{{searchResult[searchResultIdx].name}}</td>
                                                                        </tr>
                                                                        <tr v-for="(item,key) in searchResult[searchResultIdx].info" :key="key">
                                                                            <td style="width:50px" class="title">{{item.desc}}</td>
                                                                            <td class="det">{{item.value}}</td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                        </el-scrollbar>
                                                </div>
                                            </el-col>
                                    </el-row>
                         </el-popover>
                     
                         <div style="line-height:30px;margin:5px;" @click="clickDivUser" v-if="false && (isEditable && !isReadonly)">
                                <el-tag style="border:0px;color:rgb(96,98,102);" type="info" v-for="(item,idx) in valueArray" :key="idx" class="userTag" color="#fff" :closable=true  @close="deleteOneUser(item,idx)" @click="clickTagOneUser">{{item}}</el-tag>
                                <el-input 
                                        v-popover:userPopover
                                        v-model="searchKey"
                                        style="width:100px"
                                        @blur="blurSearchKey"
                                        @input="changeSearchKey"
                                        @keydown.down.native="keyDown"
                                        @keydown.up.native="keyUp"
                                        @keydown.enter.native="selectOneUser"
                                        :ref="'handleItem'+mItem.itemId"
                                    >
                                </el-input>
                                <i slot="suffix" class="icon iconfont iconrenyuan pointerClass userIcon" @click="onClickEvent"></i>
                         </div>


                        <el-input 
                            v-show="true||(!isEditable) || isReadonly"
                            :value="getFilterValue(value)" 
                            readonly 
                            v-bind:class="{'iptReadonly':(!isEditable || isReadonly),'pointerCalss':isEditable}"
                            @click.native="onClickEvent" 
                            :id="'handleItem-'+mItem.viewId+'-'+mItem.itemId"
                            type="textarea" 
                            :autosize="{minRows:1,maxRows:5}" 
                        >
                            <i slot="suffix" class="icon iconfont iconyusherenyuan pointerClass"></i>
                        </el-input>

                        <input type="hidden" v-model="hiddenValue" :id="'ecoOrg_'+mItem.itemId" actionGroup=true/>
                        <input type="hidden" v-model="value" :id="'ecoOrg_'+mItem.itemId+'_text'" actionGroup=true/>
                 </div>
        </ecoField>

    
  </div>
</template>
<script>
import {searchOrg} from'../../../service/service'
import {EcoUtil} from '@/components/util/main.js'
import ecoField from '../../components/ecoField'
import {defaultTitleWidth,defaultFTColor}  from'../../../config/setting.js'


export default{
  name:'ecoOrgSelectVue',
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
        mForm:{
            type:Object
        },
        operateId:{
            type:String
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
            errTip:false,
            errMsg:'',
            searchKey:null,
            valueArray:[],
            searchPopover:false,
            searchResult:[],
            searchResultIdx:0,
            searchBlurFlag:true,
            handleOrgShowLevel:2
        }
  },
  created(){
        if(window.flowformSetting && window.flowformSetting.hasOwnProperty('handleOrgShowLevel')){
            this.handleOrgShowLevel = window.flowformSetting.handleOrgShowLevel;
        }
  },
  mounted(){

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
       this.hiddenValue = this.mValue.hiddenValue;
       this.value = this.mValue.value;   
       this.setValueArray();
    
  },
  computed:{
      
  },
  methods: {
       /*失去焦点事件*/ 
        onblurEvent(event){ 
             if(this.isEditable && (!this.isReadonly)){
                (this.mValue.onblurEvents).forEach((eventKey)=>{
                        let _emit = {};
                        _emit.action = 'onEventKeyAction'
                        _emit.data = {};
                        _emit.data.itemId = this.mItem.itemId;
                        _emit.data.eventKey = eventKey;
                        this.$emit('emitEvent',_emit); 
                 })
             }
         },

         /*chang事件*/
         onChangeEvent(event){ 
            (this.mValue.onchangeEvents).forEach((eventKey)=>{
                   let _emit = {};
                    _emit.action = 'onEventKeyAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    _emit.data.eventKey = eventKey;
                    this.$emit('emitEvent',_emit); 
            });

            this.onInteraction();
         },

         /*触发点击焦点事件*/
         onClickEvent(event){  //点击事件 向上抛出选人事件
                if(this.isEditable && (!this.isReadonly)){
                    (this.mValue.onclickEvents).forEach((element)=>{
                            let emitObj = {};
                            emitObj.action = 'onEventKeyAction';
                            emitObj.data = {};
                            emitObj.data.itemId = this.mItem.itemId;
                            emitObj.data.eventKey = element;

                            emitObj.data.initData = {};
                            emitObj.data.initData.initDataType = 'STR';
                            emitObj.data.initData.initDataStr = this.hiddenValue; 
                            emitObj.data.initData.actionGroup = true;
                            emitObj.data.initData.maxOrgPathLevel = this.handleOrgShowLevel;
                           
                            this.$emit('emitEvent',emitObj);
                    });
                }
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

    

        /*Override 获取某个item的值*/
        getItemInputParamsValue(){  //Override 获取某个item的值
            let _obj = {};
             _obj.value = this.value;
             _obj.hiddenValue = this.hiddenValue;
            return _obj;
        },

         /*Override 设置item的值*/
        setItemOutputParamsValue(value,hiddenValue,fromItemId){ //Override 设置item的值
            this.value = value;
            this.hiddenValue = hiddenValue;

            this.setValueArray();
            if(this.mItem.itemId != fromItemId){ //如果触发元不是本组件，接着触发本组件的chang事件
                this.onChangeEvent();
            }
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

                 this.setValueArray();
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

     /*接受事件的回写*/
       callEvent(callObj){
            if(callObj && callObj.action == "orgSelectPopupConfirm"){
                    this.orgSelectPopupConfim(callObj);//选人组件确定回写
                    this.onChangeEvent(); //触发改变事件
                    this.onblurEvent(); //触发失去焦点事件
            }
        },

        callRelWFEvent(selItems){
             (selItems).forEach((element,idx)=>{
                    this.value = element.value;
                    this.hiddenValue = element.hiddenValue;
              })
             
             this.setValueArray();
             this.onblurEvent();
             this.onChangeEvent();
        },

        orgSelectPopupConfim(callBackObj){ //选人组件确定回写
                let _value = callBackObj.data.id;
                let _text = callBackObj.data.name;
                 if((this.mItem.actionGroup || this.mItem.actionGroup == 0 ) && (_value && _value !='' )){
                     _value =  this.mItem.actionGroup + '|'+_value;
                }
                this.hiddenValue = _value;
                this.value = _text;

                this.setValueArray();
        },

         /*提交的时候，获取*/
        getRefValue(){  //提交的时候，获取
             let _obj = null;
             if(this.isEditable ){ //isEditable 提交
                 _obj  = {};
                 _obj.value = this.hiddenValue;
             }
            return _obj;
        },

       getRefCheck(){ //检查 是否可以提交
            if(this.isEditable ){
                if(this.isRequired ){
                    if(!this.hiddenValue || this.hiddenValue == ''){
                        return {status:1,msg:this.mItem.itemName+' 必须选择',checkType:'ORGSLT',checkId:'handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId,itemId:this.mItem.itemId} ;
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

                   document.getElementById('handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId).scrollIntoView(true);

                   this.onClickEvent();

            }catch(e){
                console.log(e);
            }
        },



          changeSearchKey(){
            if(this.searchKey && this.searchKey !=''){
                 this.searchPopover = true;
                 this.searchOrgFunc(this.searchKey);
            }else{
                 this.searchPopover = false;
                 this.searchResultIdx = 0;
             //    this.searchResult = [];
            }
        },

        blurSearchKey(){
                console.log(2);

                let _that = this;
                setTimeout(function(){
                    if(_that.searchBlurFlag){
                         _that.searchKey = null;
                        _that.searchPopover = false;
                        _that.searchResultIdx = 0;
                  //      _that.searchResult = [];
                    }
                },300);
        },


        keyDown(e){
                if(this.searchResultIdx< this.searchResult.length-1){
                    this.searchResultIdx++;
                } 
                let _focTop = this.$refs['searchLi'+this.searchResultIdx][0].offsetTop;
                let _h = 200;
                let _scTop = this.$refs['searchScroll'].$refs['wrap'].offsetTop;
                if(_focTop > _h +_scTop-34){
                    let _div = this.$refs['searchScroll'].$refs['wrap'];
                    this.$nextTick(() => {
                        _div.scrollTop  += 34;
                    })
                }    
        },

        keyUp(event){
            if(this.searchResultIdx!=0){
                  this.searchResultIdx--;
            } 
            
            let _focTop = this.$refs['searchLi'+this.searchResultIdx][0].offsetTop;
            let _scTop = this.$refs['searchScroll'].$refs['wrap'].scrollTop;
            if(_focTop < _scTop){
                let _div = this.$refs['searchScroll'].$refs['wrap'];
                this.$nextTick(() => {
                    _div.scrollTop  -= 34;
                })
            }

            event.preventDefault();
        },

    
        mouseOver(item,idx){
             this.searchResultIdx = idx;
        },


        setValueArray(){
            if(this.value){
                this.valueArray = this.value.split(",");
            }else{
                this.valueArray = [];
            }
        },
   
        searchOrgFunc(){
                searchOrg(this.operateId,this.mItem.itemId,this.searchKey).then((response)=>{
                        if(response.data.remap.options){
                             this.searchResult = response.data.remap.options;
                        }else{
                             this.searchResult = [];
                        }
                       this.searchResultIdx = 0;
                }).catch((err)=>{
                    console.log(err);
                })
        },

        clickOneUser(idx){
            console.log(1);
            this.searchResultIdx = idx;
            this.selectOneUser();
        },

        selectOneUser(){
            this.searchBlurFlag = false;
            if(this.searchResult && this.searchResult.length > 0){
                let _item = this.searchResult[this.searchResultIdx];
                let _hiddenValue = _item.value;
                let _value = _item.name;
                if(this.hiddenValue && this.hiddenValue.indexOf(_hiddenValue)> -1){

                }else{
                   if(this.mItem.extrSource && this.mItem.extrSource.select_type == "0"){ //单选
                        this.value = '';
                        this.hiddenValue = '';
                        if((this.mItem.actionGroup || this.mItem.actionGroup == 0 )){
                            this.hiddenValue =  this.mItem.actionGroup + '|';
                        }
                    }else{
                        if(this.value && this.value !=""){
                                this.value +=",";
                                this.hiddenValue+="|";
                            }else{
                                if((this.mItem.actionGroup || this.mItem.actionGroup == 0 )){
                                    this.hiddenValue =  this.mItem.actionGroup + '|';
                                }
                            }
                    }

                    this.value += _value;
                    this.hiddenValue +=_hiddenValue;
                    this.setValueArray();
                }
            }


            this.searchPopover = false;
            this.searchKey  = null;
            this.searchResultIdx = 0;
            this.searchBlurFlag = true;

            this.searchResult = [];
        },

        deleteOneUser(item,idx){
                this.valueArray.splice(idx,1);
                let _hiddenValueArray = this.hiddenValue.split("|");
                if((this.mItem.actionGroup || this.mItem.actionGroup == 0 )){
                        _hiddenValueArray.splice(idx+1,1);
                        if(_hiddenValueArray.length == 1){
                            _hiddenValueArray = [];
                        }
                }else{
                        _hiddenValueArray.splice(idx,1);
                }
                this.value = this.valueArray.join(",");
                this.hiddenValue = _hiddenValueArray.join("|");
        },

        clickDivUser(){
            if(event.target.className.indexOf('userTag')>-1){ //点击删除
                return ;
            }else{
                  try{
                    this.$refs['handleItem'+this.mItem.itemId].focus();
                }catch(e){}  
            }
        },

        clickTagOneUser(event){
                try{
                    this.$refs['handleItem'+this.mItem.itemId].focus();
                }catch(e){}  
        },

        getFilterValue(value){
            let _valueArray = [];
            let _valueName = [];
            if(value){
                _valueArray = value.split(",");
                for(let i = 0;i<_valueArray.length;i++){
                    _valueName.push(this.getOrgPathFilter(_valueArray[i]));
                }
            }
            return _valueName.join(",");
        },

        filterName(item){
            if(item && item.lastIndexOf('-')>-1){
                return item.substring(item.lastIndexOf('-')+1);
            }else{
                return item;
            }
        },


        getOrgPathFilter(orgPath){
            let _maxOrgPathLevel = this.handleOrgShowLevel;
            if(orgPath){
                if(_maxOrgPathLevel == -1){
                    return orgPath;
                }else{
                    let _orgPathArray = orgPath.split("-");
                    let _length = _orgPathArray.length;
                    let _startLength = (_length <= _maxOrgPathLevel)?0:( _length- (_maxOrgPathLevel+1));
                    let _reOrgPathArray = [];
                    for(let i = _startLength;i<_length;i++){
                        _reOrgPathArray.push(_orgPathArray[i]);
                    }
                    return _reOrgPathArray.join('-');
                }
            }else{
                return '';
            }
       },


        /*镜像映射 开始*/
        emitMirrorEvent(){ 
            if(this.mValue.itemIdToViewList && this.mValue.itemIdToViewList.length > 0){
                let _emitViewItemMap = [];
                for(let i = 0;i<this.mValue.itemIdToViewList.length;i++){
                    if(this.mItem.viewId != this.mValue.itemIdToViewList[i]){
                        _emitViewItemMap[String(this.mValue.itemIdToViewList[i])] = 1;
                    }
                }
                let _emit = {};
                _emit.action = 'onMirrorEmitAction'
                _emit.data = {};
                _emit.data.itemId = this.mItem.itemId;
                _emit.data.mirrorViewItem = _emitViewItemMap;

                _emit.data.mirrorData = {};
                _emit.data.mirrorData.value = this.value;
                _emit.data.mirrorData.hiddenValue = this.hiddenValue;
                _emit.data.mirrorData.isRequired = this.isRequired;
                _emit.data.mirrorData.isVisible = this.isVisible;
                _emit.data.mirrorData.isReadonly = this.isReadonly;
                _emit.data.mirrorData.isEditable = this.isEditable;
                _emit.data.mirrorData.valueArray = EcoUtil.objDeepCopy(this.valueArray);
                this.$emit('emitEvent',_emit); 
            }
        },

        callMirror(data){
            if(data.mirrorData){
                this.value = data.mirrorData.value;
                this.hiddenValue = data.mirrorData.hiddenValue;
                this.isRequired = data.mirrorData.isRequired;
                this.isVisible = data.mirrorData.isVisible;
                this.isReadonly = data.mirrorData.isReadonly;
                this.isEditable = data.mirrorData.isEditable;
                this.valueArray = data.mirrorData.valueArray;
            }
        }
        /*镜像映射 结束*/





  },
  watch: {

  }
}
</script>

<style scoped>
.handleOrgSelectVue .userTag{
    margin-right:1px;
    margin-top:5px;
    padding-left:4px;
    padding-right:4px;
    font-size: 14px;
}

.handleOrgSelectVue .userIcon{
    position: absolute;
    right:10px;
    color:rgb(192, 196, 204);
}

</style>
