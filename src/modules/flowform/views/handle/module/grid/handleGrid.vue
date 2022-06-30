<template>
  <div class="handleGridVue designItem gridItem" v-show="isVisible">

      <div v-if="mItem.titlePos!='n'" class="eco-grid-title" v-bind:style="{textAlign:mItem.titleAlign,backgroundColor:mItem.bgColor}">
            &nbsp;<span v-bind:style="{color:mItem.ftColor}">{{mItem.itemName}}</span>&nbsp;
      </div>

      <div class="ecoGridDiv" style="overflow-x:auto;overflow-y:hidden" v-bind:style="{width:(Number(formWidth-2))+'px'}"  :id="'handleItem'+mItem.itemId">
        <table class="ecoGridTable" v-bind:style="{width:tableWidth+'px'}"> 
            <thead v-show="mItem.showColTitle == 1" v-bind:class="{'noBorderTop':(mItem.titlePos =='n' && mItem.showColTitle == 1)}">
                <tr >
                    <th class="eco-grid-th eco-grid-th-order" v-if="mItem.showRowIdx==1" v-bind:style="{backgroundColor:mForm?mForm.titleBgColor:null,color:mForm?mForm.titleTextColor:null}">序号</th>
                    <th class="eco-grid-th" v-show="formItem.visiable == 1" v-for="formItem in formGrids" :key="formItem.itemId" v-bind:style="{backgroundColor:formItem.bgColor?formItem.bgColor:mForm?mForm.titleBgColor:null,width:getFormItemWidth(formItem),textAlign:formItem.titleAlign}">
                        <i v-if="formItem.nullable == 0" class="el-form-required-i">*</i>
                        <span v-bind:style="{color:formItem.ftColor?formItem.ftColor:mForm?mForm.titleTextColor:null}">{{formItem.itemName}}</span>
                        <el-tooltip class="item" effect="dark" :content="formItem.inst" placement="top" 
                            v-if="formItem.inst && formItem.inst !='' && (formItem.modelType == 'RADIO' || formItem.modelType == 'SLT' || formItem.modelType == 'CHECKBOX' ||  formItem.modelType == 'ATTACHEMENT')">
                            <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                        </el-tooltip>
                    </th>
                    <th class="eco-grid-th eco-grid-th-operation" v-if="mItem.allowEditRow== 1 && isEditable" v-bind:style="{backgroundColor:mForm?mForm.titleBgColor:null,color:mForm?mForm.titleTextColor:null}">操作</th>
                </tr>
            </thead>

            <tbody v-bind:class="{'noBorderTop':(mItem.titlePos =='n' && mItem.showColTitle == 0),'noBorderBottom':!(mItem.allowEditRow== 1 && isEditable)}">
                <tr v-for="(rowItem,rowIdx) in dataGrids.valRow" :key="'row'+rowIdx">
                    <td class="eco-grid-td eco-grid-td-order" v-if="mItem.showRowIdx==1" style="width:50px;">{{rowIdx+1}}</td>
                    <td class="eco-grid-td" v-show="formItem.visiable == 1" v-for="(formItem,formIdx) in formGrids" :key="formItem.itemId+'_'+rowIdx+'_'+formIdx" v-bind:style="{width:formItem.titleWidth+'px'}">
                            <component 
                                    :is="formItem.gridColName" 
                                    :id="'gridCol'+formItem.itemId+'_'+rowIdx+'_'+formIdx"
                                    :ref="'gridCol'+formItem.itemId+'_'+rowIdx+'_'+formIdx"
                                    :mItem="formItem"
                                    :mValue="rowItem.cells[formItem.orderId]"
                                    :valHeader="dataGrids.valHeader[formIdx]"
                                    :rowIdx="rowIdx"
                                    :formIdx="formIdx"
                                    @emitEvent="emitEvent"
                                    v-model="rowItem.cells[formItem.orderId].value"
                            ></component>
                    </td>
                    <td class="eco-grid-td eco-grid-td-operation" v-if="mItem.allowEditRow== 1 && isEditable">
                        <span  @click="deleteGridRow(rowIdx)" v-if="dataGrids.valRow.length > 0 && !isReadonly && (mItem.allowEditRow == 1)">删除</span>
                    </td>
                </tr>

              
                  <tr v-if="dataGrids.valTotalRow.length > 0">
                      <td :colspan="formShowColNum+(mItem.showRowIdx==1?1:0)+((mItem.allowEditRow == 1 &&isEditable) ?1:0)"><span class="girdSumText">总计</span></td>
                  </tr>

                  <tr v-if="dataGrids.valTotalRow.length > 0" v-for="(rowItems,rowIdx) in dataGrids.valTotalRow" :key="'rowTotal'+rowIdx" class="ecoZJVue">
                         <td class="eco-grid-td eco-grid-td-order" v-if="mItem.showRowIdx==1">&nbsp;</td>
                         <td class="eco-grid-td" v-show="formItem.visiable == 1"  v-for="(formItem,formIdx) in formGrids" :key="'formTotal'+formIdx">  
                              <span class="tdSum">{{rowItems.cells[formItem.orderId].value}}</span>
                         </td>
                        <td class="eco-grid-td eco-grid-td-operation" v-if="mItem.allowEditRow== 1 && isEditable">&nbsp;</td>
                  </tr>

            </tbody>
        </table>
    </div>

     <div class="eco-grid-operation" v-if="(mItem.allowEditRow == 1 ||mItem.gridImport == 1 || mItem.gridExport == 1) && isEditable">
            <el-button type="success"  size="mini" @click="exlExp" v-if="(isEditable && (mItem.gridExport == 1))">导出数据</el-button>
            <el-button type="success"  size="mini" @click="exlImp" v-if="(isEditable && !isReadonly && (mItem.gridImport == 1))">导入数据</el-button>
            <el-button type="primary"  size="mini" @click="addGridRow" v-if="(mItem.allowEditRow == 1) && isEditable && !isReadonly">{{mItem.gridAddbutton}}</el-button>
            <el-button type="danger"  size="mini" @click="deleteGridBtn" v-if="(mItem.allowEditRow == 1) && isEditable && !isReadonly">删除</el-button>
     </div>
 

  </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import {FlowFormUtil} from '../../../../config/util.js'

import handleGridInput from "./handleGridInput.vue";
import handleGridNumber from "./handleGridNumber.vue";
import handleGridDate from "./handleGridDate.vue";
import handleGridCheckbox from "./handleGridCheckbox.vue";
import handleGridRadio from "./handleGridRadio.vue";
import handleGridSelect from "./handleGridSelect.vue";
import handleGridUserSelect from "./handleGridUserSelect.vue";
import handleGridTextarea from "./handleGridTextarea.vue";
import handleGridOrgSelect from "./handleGridOrgSelect.vue";
import handleGridApi from "./handleGridApi.vue";
import handleGridRelWF from "./handleGridRelWF.vue";
import handleGridAttachment from "./handleGridAttachment.vue";

import {doGridExlExpAjax} from '../../../../service/service'
import {EcoFile} from '@/components/file/main.js'

export default{
  name:'ecoGrid',
  components:{
      handleGridInput,
      handleGridDate,
      handleGridCheckbox,
      handleGridRadio,
      handleGridSelect,
      handleGridUserSelect,
      handleGridTextarea,
      handleGridOrgSelect,
      handleGridNumber,
      handleGridApi,
      handleGridRelWF,
      handleGridAttachment
  },
  props:{
        mItem:{
            type:Object
        },
        mValue:{
            type:Object
        },
        formWidth:{
            type:Number
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
            valHeader:[],
            valRow:[],
            formHeader:[],
            value:'',

            formGrids:[], //头信息
            dataGrids:{
                defField:null,
                itemId:0,
                valHeader:[],
                valRow:[],
                valTotalRow:[]
            },

            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
            readonly:false,
            formShowColNum:0,
            decimal:100
        }
  },
  created(){
       
  },
  mounted(){
        if(this.mItem && this.mItem.visiable == 0){
           this.isVisible = false;
        }
        if(this.mItem && this.mItem.isReadonly == 1 ){
           this.isReadonly = true;
        }
        if(this.mItem && this.mItem.editable == 0){
           this.isEditable = false;
        }

       /*初始化赋值*/
        let _formGrids  = this.mValue.formGrids;
        if(_formGrids){
             (_formGrids).forEach((colItem)=>{
                colItem.gridColName = FlowFormUtil.getModelNameByModelType(colItem.modelType,'handle');
                if(colItem.visiable == 1){
                    this.formShowColNum++;
                }
                colItem.viewId = this.mItem.viewId;
            })
        }

        this.formGrids = _formGrids;

        let _temp = EcoUtil.objDeepCopy(this.mValue.dataGrids);
        if(_temp && _temp!=null){
            this.dataGrids.defField = _temp.defField;
            this.dataGrids.itemId = _temp.itemId;
            this.dataGrids.valHeader = _temp.valHeader;

            let _tempRowArray = [];
            let _tempRowTotal = [];

            if(_temp && _temp.valRow ){
                (_temp.valRow).forEach((element)=>{
                    if(element.isTotal == 'Y'){
                        _tempRowTotal.push(element)
                    }else{
                        _tempRowArray.push(element);
                    }
                })
            }

            this.dataGrids.valRow = _tempRowArray;
            this.dataGrids.valTotalRow = _tempRowTotal;

            if(_tempRowArray.length !=0){
                 this.valRow = EcoUtil.objDeepCopy(_tempRowArray);
            }else{  
                    let _ecoTempRow = [];
                    let _ecoTempRowObj = {};
                    _ecoTempRowObj.isTotal = 'N';
                    _ecoTempRowObj.rowInd = 0;
                    _ecoTempRowObj.cells = {};
                    for(let i = 0;i<this.dataGrids.valHeader.length;i++){
                         _ecoTempRowObj.cells[String(i+1)] = EcoUtil.objDeepCopy(this.dataGrids.valHeader[i]);
                    }
                    _ecoTempRow.push(_ecoTempRowObj);
                    this.valRow = _ecoTempRow;
            }
        }
            
        let _decimal = 0;
        for(let i = 0;i< this.mValue.precision;i++){
            if(i == 0){
                _decimal = 10;
            }else{
                _decimal = _decimal * 10;
            }
        }
        
        if(_decimal == 0){
            _decimal == 100;
        }
        this.decimal = _decimal;

       
  },
  computed:{
       ...mapState([
            'wfKvMap',
        ]),

        tableWidth:function(){
                let _tableWidth = 0;
                if(this.mItem.showRowIdx == 1){
                    _tableWidth += 50;
                }
                if(this.mItem.allowEditRow == 1){
                    _tableWidth += 50;
                 }
                 if(this.formGrids){
                     (this.formGrids).forEach((item)=>{
                         if(item.visiable == 1){
                              _tableWidth += item.titleWidth;
                         }
                     })
                 }

                 if(_tableWidth < this.formWidth-2){
                    _tableWidth = this.formWidth-2;
                 }
                 return _tableWidth;
        }
  },
  methods: {

       /* 获取到 列组件 冒泡的事件 做转发*/
       emitEvent(emitObj){
            emitObj.data.parentItemId = this.mItem.itemId; //添加grid的组件id 为列组件的父组件
            emitObj.data.emitStatus.parentItemId = this.mItem.itemId; //添加grid的组件id 为列组件的父组件
            
            if(emitObj.action == 'onMirrorEmitAction'){//镜像事件
                if(this.mValue.itemIdToViewList && this.mValue.itemIdToViewList.length > 0){
                    let _emitViewItemMap = [];
                    for(let i = 0;i<this.mValue.itemIdToViewList.length;i++){
                        if(this.mItem.viewId != this.mValue.itemIdToViewList[i]){
                            _emitViewItemMap[String(this.mValue.itemIdToViewList[i])] = 1;
                        }
                    }
                    emitObj.data.mirrorViewItem = _emitViewItemMap;
                }else{
                    return ;
                }
            }
         
            this.$emit('emitEvent',emitObj);  //在向上冒泡
       },


      onblurEvent(rowIdx,formIdx){ //失去焦点事件
            try{
                        this.$refs['gridCol'+this.dataGrids.valHeader[formIdx].itemId+'_'+rowIdx+'_'+formIdx][0].onblurEvent();
            }catch(e){}
            // (this.dataGrids.valHeader[formIdx].onblurEvents).forEach((eventKey)=>{
            //       /*调用列组件里面的失去焦点事件*/
            // })
      },

      onChangeEvent(rowIdx,formIdx){ //chang事件
            try{
                this.$refs['gridCol'+this.dataGrids.valHeader[formIdx].itemId+'_'+rowIdx+'_'+formIdx][0].onChangeEvent();
            }catch(e){}
            // (this.dataGrids.valHeader[formIdx].onchangeEvents).forEach((eventKey)=>{
            //       /*调用列组件里面的change事件*/
            //        try{
            //             this.$refs['gridCol'+this.dataGrids.valHeader[formIdx].itemId+'_'+rowIdx+'_'+formIdx][0].onChangeEvent();
            //        }catch(e){}
            // })
      },

      onClickEvent(rowIdx,formIdx){ //点击事件，并向上抛出
            if(this.formGrids[formIdx].editable == 1){
                    (this.dataGrids.valHeader[formIdx].onclickEvents).forEach((eventKey)=>{
                        /*调用列组件里面的change事件*/
                        try{
                            this.$refs['gridCol'+this.dataGrids.valHeader[formIdx].itemId+'_'+rowIdx+'_'+formIdx][0].onClickEvent();
                        }catch(e){}
                    })
            }
      },


        /*相关性*/
       onInteraction(action){
            if(this.mValue.hasInteraction){
                let _emit = {};
                _emit.action = 'onInteractionAction'
                _emit.data = {};
                _emit.data.itemId = this.mItem.itemId;
                if(action){
                    _emit.data.emitStatus = {};
                    _emit.data.emitStatus.action  = action;
                }
                this.$emit('emitEvent',_emit);
            }
        },
        

       /*添加行*/
      addGridRow(dataItem,children,from,mirrorType){
       //   let _rowData =  EcoUtil.objDeepCopy(this.dataGrids.valRow[0]);
            let _rowData = EcoUtil.objDeepCopy(this.valRow[0]);
    
            for(let item in _rowData.cells){
                 let _colOrder2 = this.getColIdxByFormGridItemId( _rowData.cells[item].itemId);
                 let _value = this.dataGrids.valHeader[_colOrder2].value;
                 let _hiddenValue = this.dataGrids.valHeader[_colOrder2].hiddenValue;

                 _rowData.cells[item].value = _value;
                 _rowData.cells[item].hiddenValue = _hiddenValue;
                 _rowData.cells[item].attachments = [];
                 
       
                if(from && from == 'API'){
                    if(dataItem && children && children.length > 0){
                        for(let j = 0;j< children.length;j++){
                            if(children[j].item == _rowData.cells[item].itemId){
                                _rowData.cells[item].value = dataItem[children[j].name];

                                let _ttFormIdx = this.getColIdxByFormGridItemId(_rowData.cells[item].itemId);
                                let _ttValType = this.dataGrids.valHeader[_ttFormIdx].valType;
                                let _ttKVName = this.dataGrids.valHeader[_ttFormIdx].kvName;

                                if(_ttValType == 'SLT' || _ttValType == 'RADIO'){
                                    if(this.wfKvMap[_ttKVName]){
                                            for(let z = 0;z<this.wfKvMap[_ttKVName].length;z++){
                                                if(this.wfKvMap[_ttKVName][z].desc == dataItem[children[j].name]){
                                                    _rowData.cells[item].value  = String(this.wfKvMap[_ttKVName][z].id);
                                                    break;
                                                }
                                            }
                                    }
                                }

                                break;
                            }
                        }
                    }
                }else if(from && from == 'RELWF'){
                   for(let key in children){
                        let _oneItem =  children[key];
                        if(_oneItem.itemId == _rowData.cells[item].itemId){
                                _rowData.cells[item].value = _oneItem.value;
                                _rowData.cells[item].hiddenValue = _oneItem.hiddenValue;
                                break;
                        }
                    }
                }else if(from && from == 'GridExlImp'){
                    
                     for(let key in children){
                        let _oneItem =  children[key];

                        if(_oneItem.itemId == _rowData.cells[item].itemId){
                                _rowData.cells[item].value = _oneItem.value;
                                _rowData.cells[item].hiddenValue = _oneItem.hiddenValue;

                                let _ttFormIdx = this.getColIdxByFormGridItemId(_rowData.cells[item].itemId);
                                let _ttValType = this.dataGrids.valHeader[_ttFormIdx].valType;
                                let _ttKVName = this.dataGrids.valHeader[_ttFormIdx].kvName;

                                if(_ttValType == 'SELECT' || _ttValType == 'RADIO'){
                                    if(this.wfKvMap[_ttKVName]){
                                            for(let z = 0;z<this.wfKvMap[_ttKVName].length;z++){
                                                if(this.wfKvMap[_ttKVName][z].desc == _oneItem.value){
                                                    _rowData.cells[item].value  = String(this.wfKvMap[_ttKVName][z].id);
                                                    break;
                                                }
                                            }
                                    }
                                }

                                break;
                        }
                    }
                }
            }
            
            this.dataGrids.valRow.push(_rowData);
            let _lastRolIndex = 0;
            if(from && (from == 'GridExlImp' || from == 'API')){
                _lastRolIndex = this.dataGrids.valRow.length; 
                if(_lastRolIndex > 0 ){
                    _lastRolIndex = _lastRolIndex - 1;
                }
            }

            if(mirrorType){

            }else{
                this.emitMirrorEvent('addRow');
                let that = this;
                let doEvent = function(_lastRolIndex){
                    (that.dataGrids.valHeader).forEach((headerElement,formIdx)=>{
                            that.onblurEvent(_lastRolIndex,formIdx);
                            that.onChangeEvent(_lastRolIndex,formIdx);
                    })
                    that.onInteraction('addRow');
                }
                /* 重新触发change事件*/
                setTimeout(doEvent,300,_lastRolIndex);
            }
            
       },
    
       /*删除行*/
       deleteGridBtn(){
            if(this.dataGrids.valRow.length > 0){
                this.deleteGridRow(this.dataGrids.valRow.length-1);
            }
       },

       /*删除行*/
      deleteGridRow(rowIdx,mirrorType){   
            this.dataGrids.valRow.forEach((rowItem,rowIdx)=>{
                /*遍历grid里面的每个组件，获取组件的值*/
                this.formGrids.forEach((formItem,formIdx) =>{
                        let _valueObj = {value:null,hiddenValue:null};
                        try{
                                _valueObj = this.$refs['gridCol'+formItem.itemId+'_'+rowIdx+'_'+formIdx][0].getItemInputParamsValue();
                        }catch(e){
                                    console.log(e)
                        }
                  
                        this.dataGrids.valRow[rowIdx].cells[formItem.orderId.toString()].value = _valueObj.value;
                        this.dataGrids.valRow[rowIdx].cells[formItem.orderId.toString()].hiddenValue = _valueObj.hiddenValue;
                        this.dataGrids.valRow[rowIdx].cells[formItem.orderId.toString()].attachments  = _valueObj.attachments;
                })     
            })
           
            this.dataGrids.valRow.splice(rowIdx,1);
            this.dataGrids.valRow.forEach((rowItem,rowIdx)=>{
                /*遍历grid里面的每个组件，获取组件的值*/
                this.formGrids.forEach((formItem,formIdx) =>{
                        let _value =  this.dataGrids.valRow[rowIdx].cells[formItem.orderId.toString()].value;
                        let _hiddenValue =  this.dataGrids.valRow[rowIdx].cells[formItem.orderId.toString()].hiddenValue;
                        let _attachments =  this.dataGrids.valRow[rowIdx].cells[formItem.orderId.toString()].attachments;

                        try{
                              this.$refs['gridCol'+formItem.itemId+'_'+rowIdx+'_'+formIdx][0].setItemOutputParamsValue(_value,_hiddenValue,formItem.itemId,_attachments);
                        }catch(e){
                              console.log(e)
                        }
                })     
            })

            if(mirrorType){
         
            }else{
                this.emitMirrorEvent('deleteGridRow',{rowIdx:rowIdx});
                /* 重新触发change事件*/
                let that = this;
                (this.dataGrids.valHeader).forEach((headerElement,formIdx)=>{
                    that.onblurEvent(0,formIdx);
                    that.onChangeEvent(0,formIdx);
                })
                
                that.onInteraction('deleteRow');
            }
            
      },
    
        
      /*设置相关性*/
      setItemInteraction(event,emitStatus){
                if(event.eventSource && event.eventSource.parentId == '0'){ //grid 自身相关性
                        this.setItemInteractionGridSelf(event);
                }else{
                        let _formId = this.getColIdxByFormGridItemId(event.eventSource.itemId);
                        if(event.eventType == 'SET_VISIBALE'){
                                if(event.eventSource.val == 0){
                                    this.$set(this.formGrids[_formId],'visiable',false);
                                }else{
                                    this.$set(this.formGrids[_formId],'visiable',true);
                                }
                        }else if(event.eventType == 'SET_NULLABLE'){
                            if(event.eventSource.val == 0){
                                this.$set(this.formGrids[_formId],'nullable',0);
                            }else{
                                    this.$set(this.formGrids[_formId],'nullable',1);
                            }
                        }
                    
                        if(emitStatus && emitStatus.action == 'addRow'){
                            //触发最后一行
                            this.$refs['gridCol'+this.formGrids[_formId].itemId+'_'+ (this.dataGrids.valRow.length-1) +'_'+_formId][0].setItemInteraction(event);    
                        }else{
                            if(emitStatus && emitStatus.gridRowIndex!=null){
                                  this.$refs['gridCol'+this.formGrids[_formId].itemId+'_'+ emitStatus.gridRowIndex +'_'+_formId][0].setItemInteraction(event);    
                            }else{
                                 for(let i = 0;i<this.dataGrids.valRow.length;i++){
                                    this.$refs['gridCol'+this.formGrids[_formId].itemId+'_'+i+'_'+_formId][0].setItemInteraction(event);    
                                }
                            }
                        }
                }
        },


        /*设置相关性*/
        setItemInteractionGridSelf(event){
            if(event.eventType == 'SET_VISIBALE'){
                 if(event.eventSource.val == 0){
                     this.isVisible = false;
                 }else{
                     this.isVisible = true;
                 }
                
                 this.emitItemVisibleAction(event.eventSource.val);
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
            let _rowIdx = obj.emitStatus.gridRowIndex;
            let _colIdx = obj.emitStatus.gridColIndex;
            console.log('调用grid的 callevent');
            try{
                 this.$refs['gridCol'+this.dataGrids.valHeader[_colIdx].itemId+'_'+_rowIdx+'_'+_colIdx][0].callEvent(obj);
            }catch(e){
                console.log(e);
            }  
        },

        apiCallEvent(obj,outputParams){
          
             let _rowIdx = 0;
             let _colIdx = 0;
             if(obj.emitObj && obj.emitObj.emitStatus && obj.emitObj.emitStatus.parentItemId == this.mItem.itemId){
                 _rowIdx = obj.emitObj.emitStatus.gridRowIndex;
                 _colIdx = obj.emitObj.emitStatus.gridColIndex;
             }

             (obj.selItems).forEach((dataItem,idx)=>{
                    let _rowLength = (this.dataGrids.valRow).length; //当前grid的 行数
                    if( _rowIdx >= _rowLength){
                         this.addGridRow(dataItem,outputParams.children,'API',false);
                    }else{
                         if(outputParams && outputParams.children && outputParams.children.length > 0){
                                (outputParams.children).forEach((outparams)=>{ //循环输出参数
                                        let _colOrder = this.getColOrderIdByItemId(outparams.item);      
                                        if(_colOrder !=-1){
                                            let _formIdx = this.getColIdxByFormGridItemId(outparams.item);
                                            if(_formIdx!=-1){
                                                try{
                                                    this.$refs['gridCol'+this.formGrids[_formIdx].itemId+'_'+_rowIdx+'_'+_formIdx][0].setItemOutputParamsValue(dataItem[outparams.name],null,null,'API');
                                                }catch(e){}
                                            }
                                        }
                                })  
                        }
                    }
                    _rowIdx++;
            })
        },


        callRelWFEvent(selItems,emitObj){

         let _rowIdx = 0;
         let _colIdx = 0;
         if(emitObj && emitObj.emitStatus && emitObj.emitStatus.parentItemId == this.mItem.itemId){
            _rowIdx = emitObj.emitStatus.gridRowIndex;
            _colIdx = emitObj.emitStatus.gridColIndex;
         }

         (selItems).forEach((element)=>{

                for(let i = 0;i<element.length;i++){
                       
                       let _rowLength = (this.dataGrids.valRow).length; //当前grid的 行数
                        if( _rowIdx >= _rowLength){
                            this.addGridRow(null,element[i].cells,'RELWF',false);
                        }else{

                            for(let key in element[i].cells){
                                let _item = element[i].cells[key];
                                let _colOrder = this.getColOrderIdByItemId(_item.itemId);      
                                if(_colOrder !=-1){
                                        let _formIdx = this.getColIdxByFormGridItemId(_item.itemId);
                                        if(_formIdx!=-1){
                                            try{
                                                this.$refs['gridCol'+this.formGrids[_formIdx].itemId+'_'+_rowIdx+'_'+_formIdx][0].setItemOutputParamsValue(_item.value,_item.hiddenValue,null);
                                            }catch(e){}
                                        }
                                }
                            }
                        }

                        _rowIdx++;
                }
         })             
        },




     callGridExlImpEvent(selItems,emitObj){

            let _rowIdx = 0;
            let _colIdx = 0;
            if(emitObj && emitObj.emitStatus){
                _rowIdx = emitObj.emitStatus.gridRowIndex;
                _colIdx = emitObj.emitStatus.gridColIndex;
            }

            (selItems).forEach((element)=>{
         
                    let _rowLength = (this.dataGrids.valRow).length; //当前grid的 行数
                    if( _rowIdx >= _rowLength){
                            this.addGridRow(null,element.cells,'GridExlImp',false);
                    }else{
                        
                            for(let key in element.cells){
                                let _item = element.cells[key];
                                let _colOrder = this.getColOrderIdByItemId(_item.itemId);    
                                if(_colOrder !=-1){
                                        let _formIdx = this.getColIdxByFormGridItemId(_item.itemId);
                                        if(_formIdx!=-1){
                                            try{
                                                this.$refs['gridCol'+this.formGrids[_formIdx].itemId+'_'+_rowIdx+'_'+_formIdx][0].setItemOutputParamsValue(_item.value,_item.hiddenValue,null);
                                            }catch(e){}
                                        }
                                }
                            }
                    }
                    _rowIdx++;
            })
            
            let _nowLength = (this.dataGrids.valRow).length; 
            let _maxLength =  (emitObj.emitStatus.gridRowIndex+ (selItems.length));
            for(let i = _nowLength ; i > _maxLength;i--){
                this.deleteGridBtn();
            }
     },


     /*page 弹窗 选择之后的回写*/
     eventHandle(eventObj,dataObj){ //接受事件的回写
            let _rowIdx = eventObj.rowIdx;
            let _notfindOutputParams = []; //找不到要处理的事件item，组件不在grid里面的事件
            (dataObj.selItems).forEach((dataItem,idx)=>{
                    if(idx!=0){ //不是第一行 动态添加行
                        this.addGridRow();
                        _rowIdx = (this.dataGrids.valRow.length-1);
                    }
                    (eventObj.eventSource.outputParams).forEach((outparams)=>{ //循环输出参数
                            let _colOrder = this.getColOrderIdByItemId(outparams.item);
                            if(_colOrder == -1){ //没有找到想要的item向上冒泡，交给上层处理
                                _notfindOutputParams.push(outparams);
                            }else{
                                /*触发回写组件的chang事件*/
                                let _colOrder2 = this.getColIdxByFormGridItemId(outparams.item);
                                /*调用子组件的赋值*/
                                try{
                                     this.$refs['gridCol'+this.dataGrids.valHeader[_colOrder2].itemId+'_'+_rowIdx+'_'+_colOrder2][0].setItemOutputParamsValue(dataItem[outparams.name],null,null);    
                                }catch(e){}
                                // this.dataGrids.valRow[_rowIdx].cells[_colOrder].value = dataItem[outparams.name];
                                /*触发回写组件的chang事件*/
                               //this.onChangeEvent(_rowIdx,_colOrder2,null);
                            }
                    })  

                    if(_notfindOutputParams.length > 0){ //没有找到想要的item 向上冒泡，交给上层处理
                        let _emitObj = {};
                        _emitObj.outputParams = _notfindOutputParams;
                        _emitObj.dataObj = dataObj;
                        this.$emit('eventHandleOtherItem',_emitObj);
                    }
            })
       },

        
        /*判断itemId在第几列*/
        getColIdxByFormGridItemId(itemId){ 
            let _colIdx = -1;
            for(let i = 0;i < this.formGrids.length;i++){
                if(this.formGrids[i].itemId == itemId){
                    _colIdx = i;
                    break;
                }
            }
            return _colIdx;
      },


       /*根据列组件的itemid 获取列的位置*/
       getColOrderIdByItemId(itemId){ 
           let colOrder = -1;
           for(let i = 0;i< this.formGrids.length ;i++){
               if(this.formGrids[i].itemId == itemId){
                   colOrder =  this.formGrids[i].orderId;
                   break;
               }
           }
           return colOrder;
       },

       /*获取某个item的值*/
       getItemInputParamsValue(colItemId,action,rowIdx){ 
            let _obj = null;
            if(action && action == 'GRIDSUM'){ //合计取值 获取某列的合计
                 let _re = 0;
                 let _colOrder = this.getColIdxByFormGridItemId(colItemId);
                 for(let i = 0;i<this.dataGrids.valRow.length;i++){
                    let _refValue = this.$refs['gridCol'+this.formGrids[_colOrder].itemId+'_'+i+'_'+_colOrder][0].getItemInputParamsValue();    
                      let _v1 = _refValue.hiddenValue?_refValue.hiddenValue:_refValue.value;
                      try{
                        _re =  EcoUtil.addFloat(_re,_v1);
                      }catch(e){console.log(e)}
                }
                _obj = {};

                let _tempDecimal = this.getColDecimal(this.formGrids[_colOrder]);
                if(_tempDecimal == 0){
                     _obj.value =  Math.round(_re);
                }else{
                     _obj.value =  (Math.round(_re * _tempDecimal) / _tempDecimal).toFixed(this.formGrids[_colOrder].precision) ;
                }
               
            }else{
                let _colOrder = this.getColIdxByFormGridItemId(colItemId);
                let _rowIdx = rowIdx;
                if(_colOrder!=-1){ 
                        /*调用子组件的赋值*/
                        try{
                            _obj =  this.$refs['gridCol'+this.formGrids[_colOrder].itemId+'_'+_rowIdx+'_'+_colOrder][0].getItemInputParamsValue();    
                        }catch(e){}
                }
            }
            return _obj;
       },
    

      /*设置列组件的值*/
      setItemOutputParamsValue(colItemId,value,hiddenValue,fromParentItemId,fromItemId,fromRowIndex,fromFormIndex,action){ //设置某个item的值

            let _obj = null;
            let _rowIdx = fromRowIndex;
            let _formIdx = this.getColIdxByFormGridItemId(colItemId);
            if(_formIdx!=-1){
                try{
                    this.$refs['gridCol'+this.formGrids[_formIdx].itemId+'_'+_rowIdx+'_'+_formIdx][0].setItemOutputParamsValue(value,hiddenValue,fromItemId);    
                }catch(e){}
            }

            if(this.mValue.itemId == fromParentItemId){
                if(action == 'NUM_ZHCN'){ //grid里面的小写转大写
                    if( this.gridSumDXObj && this.gridSumDXObj[String(fromItemId)]){

                    }else{
                        this.gridSumDXObj[String(fromItemId)] = colItemId;
                        this.setGridSumToDx(fromItemId);
                    }
                }
            }
      },

      setItemOutputParamsAction(colItemId,action){
          
          if(action == 'GRIDSUM'){ //grid 计算合计
                let _re = 0;
                let _colOrder = this.getColOrderIdByItemId(colItemId);
                let _formId = this.getColIdxByFormGridItemId(colItemId);

                for(let i = 0;i<this.dataGrids.valRow.length;i++){
                    let _refValue = this.$refs['gridCol'+this.formGrids[_formId].itemId+'_'+i+'_'+_formId][0].getItemInputParamsValue();  
                    let _v1 = _refValue.hiddenValue?_refValue.hiddenValue:_refValue.value;
                     try{
                        _re =  EcoUtil.addFloat(_re,_v1);
                     }catch(e){console.log(e)}
                }

                this.dataGrids.valTotalRow.forEach((element)=>{
                    let _tempDecimal = this.getColDecimal(this.formGrids[_formId]);
                    if(_tempDecimal == 0){
                         element.cells[_colOrder].value = Math.round(_re) ;
                    }else{
                         element.cells[_colOrder].value = (Math.round(_re * _tempDecimal) / _tempDecimal).toFixed(this.formGrids[_formId].precision) ;
                    }
                })

                this.emitMirrorEvent('gridSum');
                /*如果grid 合计里面有大写转小写*/
                this.setGridSumToDx(colItemId);
            }
        },

        setGridSumToDx(sumItemId){
               /*如果grid 合计里面有大写转小写*/
                if(this.gridSumDXObj && this.gridSumDXObj[String(sumItemId)]){
                    let _colOrder = this.getColOrderIdByItemId(sumItemId);

                    let _dxColItemId = this.gridSumDXObj[String(sumItemId)];
                    let _dxColOrder = this.getColOrderIdByItemId(_dxColItemId);

                    this.dataGrids.valTotalRow.forEach((element)=>{
                        let _dxStrign =  EcoUtil.DX(element.cells[_colOrder].value);
                        element.cells[_dxColOrder].value = _dxStrign;
                    })

                    this.emitMirrorEvent('gridSum');
                }
        },

        
        getRefValue(){  //提交的时候，获取
                let that = this;
                let _array = [];
                let _rowInd = 0;
                this.dataGrids.valRow.forEach((rowItem,rowIdx)=>{
                        _rowInd++;
                        let _rowObj = {};
                        _rowObj.rowInd = _rowInd;
                        _rowObj.isTotal = 'N';
                        _rowObj.cells = {};
                        /*遍历grid里面的每个组件，获取组件的值*/
                        that.formGrids.forEach((formItem,formIdx) =>{
                                let _valueObj = {value:''};
                                try{
                                    _valueObj = this.$refs['gridCol'+formItem.itemId+'_'+rowIdx+'_'+formIdx][0].getRefValue();
                                }catch(e){
                                    console.log(e)
                                }
                                if(_valueObj && _valueObj!=null){
                                     _rowObj.cells[formItem.orderId.toString()] = _valueObj.value;
                                }
                        
                        })
                        _array.push(_rowObj);
                })

                this.dataGrids.valTotalRow.forEach((rowItem,rowIdx)=>{
                        _rowInd++;
                        let _rowObj = {};
                        _rowObj.rowInd = _rowInd;
                        _rowObj.isTotal = 'Y';
                        _rowObj.cells = {};
                      
                        that.formGrids.forEach((formItem,formIdx) =>{
                            _rowObj.cells[formItem.orderId.toString()] = rowItem.cells[formItem.orderId].value;
                        })
                        _array.push(_rowObj);
                })
           
                
                return _array;
        },

        getRefCheck(){ //检查 是否可以提交
             let that = this;
             let statusRefCheck = {status:0};

            for(let rowIdx = 0;rowIdx<this.dataGrids.valRow.length;rowIdx++){
                let rowItem = this.dataGrids.valRow[rowIdx];
                for(let formIdx = 0;formIdx < that.formGrids.length;formIdx++){
                    let formItem = that.formGrids[formIdx];
                    let _status = {status:0};
                    try{
                            _status = this.$refs['gridCol'+formItem.itemId+'_'+rowIdx+'_'+formIdx][0].getRefCheck();
                    }catch(e){
                            console.log(e)
                    }
                    if(_status.status == 1){
                            statusRefCheck =  _status;
                            statusRefCheck.itemId = this.mItem.itemId;
                            break;
                    }
                }
                if(statusRefCheck.status == 1){
                    break;
                }
            }

            //  this.dataGrids.valRow.forEach((rowItem,rowIdx)=>{
            //         that.formGrids.forEach((formItem,formIdx) =>{
            //                 let _status = {status:0};
            //                 try{
            //                      _status = this.$refs['gridCol'+formItem.itemId+'_'+rowIdx+'_'+formIdx][0].getRefCheck();
            //                 }catch(e){
            //                         console.log(e)
            //                 }
            //                 if(_status.status == 1){
            //                       statusRefCheck =  _status;
            //                       statusRefCheck.itemId = this.mItem.itemId;
            //                 }
            //             })
            //  })

             return statusRefCheck;
        },

        doRefCheck(obj){
            try{
                   document.getElementById('handleItem'+this.mItem.itemId).scrollIntoView(true);
                   let _checkId = obj.checkId;
                   let _colItemId = 'gridCol'+_checkId.substring(10);
                    try{ 
                        let _checkRef = this.$refs[_colItemId][0];
                        if(_checkRef){
                            if(_checkRef.doRefCheck){
                                _checkRef.doRefCheck(obj);
                            }
                        }
                    }catch(e){console.log(e);}
            }catch(e){
                console.log(e);
            }
      },


      getFormItemWidth(formItem){
             let _tableWidth = 0;
             if(this.mItem.showRowIdx == 1){
                    _tableWidth += 50;
             }
             if(this.mItem.allowEditRow == 1){
                    _tableWidth += 50;
             }
             if(this.formGrids){
                (this.formGrids).forEach((item)=>{
                    if(item.visiable == 1){
                        _tableWidth += item.titleWidth;
                    }
                })
            }
            if(_tableWidth < this.formWidth-2){
                let _newTableWidth = _tableWidth-100;
                return   Math.ceil((formItem.titleWidth/_newTableWidth)*100)+'%';
            }else{
                return formItem.titleWidth+'px';
            }
      },

      getColDecimal(item){
            let _precision = 0;
            if(item.modelType == 'NUMFIELD'){ 
                _precision = item.precision;
            }else{
                _precision = this.mValue.precision;
            }
           
            let _decimal = 0;
            for(let i = 0;i< _precision;i++){
                if(i == 0){
                    _decimal = 10;
                }else{
                    _decimal = _decimal * 10;
                }
            }
            return _decimal;
      },

      formatNum(val){
          return EcoUtil.formatNumberThousandthPercentile(val);
      },

      exlImp(){
            let _storeObj = {};
            _storeObj.key = EcoUtil.getUID();

            _storeObj.data = {};
            _storeObj.data.operateId = this.operateId;
            _storeObj.data.itemId = this.mItem.itemId;
            _storeObj.data.gridData = this.getRefValue();

            EcoUtil.getSysvm().setTempStore(_storeObj.key,_storeObj.data);
            let _url = '/flowform/index.html?v='+new Date().getTime()+'#/wfGridExlImportPage/'+ _storeObj.key;
            EcoUtil.getSysvm().openDialog('数据方阵数据导入',_url,800,350,'12vh');
      },

      exlExp(){
          let _data = {};
          _data.operateId = this.operateId;
          _data.gridData = JSON.stringify(this.getRefValue());
          _data.itemId = this.mItem.itemId;
          doGridExlExpAjax(_data).then((response)=>{
                var blob = new Blob([response.data], { type: 'application/octet-stream' });
                EcoFile.downloadFile(blob, this.mItem.itemName+".xlsx");
          })
         
      },


         /*chang事件*/
        emitMirrorEvent(subAction,subData){
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
                    _emit.data.subAction = subAction;
                    _emit.data.subData = subData;
                    _emit.data.itemId = this.mItem.itemId;
                    _emit.data.mirrorViewItem = _emitViewItemMap;
                    _emit.data.mirrorData = {};


                    _emit.data.mirrorData.valTotalRow = EcoUtil.objDeepCopy(this.dataGrids.valTotalRow);
                    this.$emit('emitEvent',_emit); 
                }
        },

        callMirror(data){
            if(data.emitStatus){
                let _rowIdx = data.emitStatus.gridRowIndex;
                let _colIdx = data.emitStatus.gridColIndex;
                try{
                    this.$refs['gridCol'+this.dataGrids.valHeader[_colIdx].itemId+'_'+_rowIdx+'_'+_colIdx][0].callMirror(data);
                }catch(e){
                    console.log(e);
                }  
            }else{
                if(data.subAction == 'addRow'){
                    this.addGridRow(null,null,null,true);
                }else if(data.subAction == 'deleteGridRow'){
                    this.deleteGridRow(data.subData.rowIdx,true);
                }else if(data.subAction == 'gridSum'){
                    this.$set( this.dataGrids,'valTotalRow',data.mirrorData.valTotalRow);
                }
            }
        }

  },
  watch: {

  }
}
</script>
<style scoped>

.gridItem .eco-grid-title{
    line-height: 22px;
    padding:5px 10px;
    vertical-align: middle;
}



.gridItem .ecoGridDiv{
    margin:0px 0px 0px 0px;
    background-color: #fff;
}

.gridItem .ecoGridTable{
    width: 100%;
    margin:0px 0px; 
    table-layout: fixed;
}

.gridItem .ecoGridTable th,.gridItem .ecoGridTable td{
    padding:5px;
    color:#606266;
}


.designTable .gridItem .eco-grid-th-order{
    width:50px;
}

.designTable .gridItem .eco-grid-td-order{
    text-align: center;
    vertical-align: middle;
    width:50px;
}


.designTable .gridItem .eco-grid-th-operation{
    width:50px;
}

.designTable .gridItem .eco-grid-td-operation{
    text-align: center;
    vertical-align: middle;
    color:#e03a3a;
    cursor: pointer;
    width:50px;
}

.designTable .gridItem  .eco-grid-operation{
    text-align:right;
    padding:10px 10px;
    
}

.designTable .gridItem .ecoGridTable th,.designTable .gridItem .ecoGridTable td{
    border:1px solid #e7e7e7;
}

.designTable .gridItem .ecoGridTable th:first-child ,.designTable .gridItem .ecoGridTable td:first-child {
    border-left-width: 0px;
}

.designTable .gridItem .ecoGridTable th:last-child ,.designTable .gridItem .ecoGridTable td:last-child {
    border-right-width: 0px;
}


.styleNone .gridItem .ecoGridTable th,.styleNone .gridItem .ecoGridTable td{
    border:1px solid #ccc;
}


.gridItem .eco-grid-th{
    text-align: center;
    line-height: 32px;
}

.gridItem .eco-grid-td{
    vertical-align: top;
}


.gridItem .noBorderTop tr .eco-grid-th{
    border-top-width: 0px;
}

.gridItem .noBorderTop tr:first-child .eco-grid-td{
    border-top-width: 0px;
}

.gridItem .noBorderBottom tr:last-child .eco-grid-td{ 
    border-bottom-width: 0px;
}

.gridItem .girdSumText{
    margin:5px;
    
}

.gridItem .tdSum{
    margin-left:5px;
    line-height:30px;
   
}

</style>
