<template>
<div class="designGrid designItem gridItem" >
    
    <div class="eco-grid-title" v-bind:style="{textAlign:itemObj.titleAlign,backgroundColor:itemObj.bgColor}" v-if="itemObj.titlePos!='n'">
         <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.titleName}}</span>
    </div>

     <div class="ecoGridDiv" style="overflow-x:auto;overflow-y:hidden" v-bind:style="{width:(Number(formWidth-2))+'px'}">
        <table class="ecoGridTable" v-bind:style="{width:itemObj.tableWidth+'px'}"> 
            <thead v-show="itemObj.showColTitle == 1" v-bind:class="{'noBorderTop':(itemObj.titlePos =='n' && itemObj.showColTitle == 1)}">
                <tr >
                    <th class="eco-grid-th eco-grid-th-order" v-if="itemObj.showRowIdx==1"  v-bind:style="{backgroundColor:itemObj.bgColor,color:itemObj.ftColor}">序号</th>
                    
                    <th class="eco-grid-th" v-for="item in itemObj.formGrid" :key="item.itemId" v-bind:style="{backgroundColor:item.bgColor?item.bgColor:itemObj.bgColor,width:item.percentage?item.percentage+'%':item.titleWidth+'px',textAlign:item.titleAlign}">
                       <i v-if="item.nullable == 0" class="el-form-required-i">*</i>
                        <span v-bind:style="{color:item.ftColor?item.ftColor:itemObj.ftColor}">{{item.titleName}}</span>

                        <el-tooltip class="item" effect="dark" :content="item.inst" placement="top" 
                            v-if="item.inst && item.inst !='' && (item.modelType == 'RADIO' || item.modelType == 'SLT' || item.modelType == 'CHECKBOX' || item.modelType == 'ATTACHEMENT' )">
                            <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                        </el-tooltip>
                    </th>

                    <th class="eco-grid-th eco-grid-th-operation" v-if="itemObj.allowEditRow== 1"  v-bind:style="{backgroundColor:itemObj.bgColor,color:itemObj.ftColor}">操作</th>
                </tr>
            </thead>

            <tbody v-bind:class="{'noBorderTop':(itemObj.titlePos =='n' && itemObj.showColTitle == 0),'noBorderBottom':(itemObj.allowEditRow != 1)}">
                <tr v-for="rowIdx in itemObj.gridRow" :key="'tr'+rowIdx" >
                    <td class="eco-grid-td eco-grid-td-order" v-if="itemObj.showRowIdx==1">{{rowIdx}}</td>
                    <td class="eco-grid-td" v-for="item in itemObj.formGrid" :key="item.itemId" >
                            <component 
                                    :is="item.gridColName" 
                                    :id="'gridColComponent'+item.uuid"
                                    :ref="'gridColComponent'+item.uuid"
                                    :itemObj="item"
                            ></component>
                    </td>
                   
                    <td class="eco-grid-td eco-grid-td-operation" v-if="itemObj.allowEditRow== 1"><span>删除</span></td>
                </tr>

                <tr v-if="itemObj.gridSum!=null">
                      <td :colspan="itemObj.formGrid.length+(itemObj.showRowIdx==1?1:0)+(itemObj.allowEditRow==1?1:0)+1"><span class="girdSumText">总计</span></td>
                </tr>

                <tr v-if="itemObj.gridSum!=null" >
                         <td class="eco-grid-td eco-grid-td-order" v-if="itemObj.showRowIdx==1">&nbsp;</td>
                         <td class="eco-grid-td" v-for="(item,formIdx) in itemObj.formGrid" :key="'formTotal'+formIdx">  
                              <div><span class="tdSum">&nbsp;</span></div>
                         </td>
                     
                         <td class="eco-grid-td eco-grid-td-operation" v-if="itemObj.allowEditRow== 1">&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="eco-grid-operation" v-if="itemObj.allowEditRow== 1 || itemObj.allowGridExport ==1 || itemObj.allowGridImport == 1">
            
             <el-button type="success"  size="mini" v-if="itemObj.allowGridExport==1">导出数据</el-button>
            <el-button type="success"   size="mini" v-if="itemObj.allowGridImport==1">导入数据</el-button>

            <el-button type="primary"  size="mini"  v-if="itemObj.allowEditRow==1">{{itemObj.gridAddbutton}}</el-button>
            <el-button type="danger"  size="mini"  v-if="itemObj.allowEditRow==1">删除</el-button>
    </div>
</div>

</template>
<script>
import {defaultTitleWidth}  from'../../../../config/setting.js'
import {FlowFormUtil} from '../../../../config/util.js'
import {mapState,mapMutations} from 'vuex'
import designGridInput from "./designGridInput.vue";
import designGridTextarea from "./designGridTextarea.vue";
import designGridDate from "./designGridDate.vue";
import designGridSelect from "./designGridSelect.vue";
import designGridRadio from "./designGridRadio.vue";
import designGridCheckbox from "./designGridCheckbox.vue";
import designGridUserSelect from "./designGridUserSelect.vue";
import designGridOrgSelect from "./designGridOrgSelect.vue";
import designGridNumber from "./designGridNumber.vue";
import designGridApi from "./designGridApi.vue";
import designGridRelWF from "./designGridRelWF.vue";
import designGridAttachment from "./designGridAttachment.vue";


export default{
  name:'designGrid',
  components:{
      designGridInput,
      designGridTextarea,
      designGridDate,
      designGridSelect,
      designGridRadio,
      designGridCheckbox,
      designGridUserSelect,
      designGridOrgSelect,
      designGridNumber,
      designGridApi,
      designGridRelWF,
      designGridAttachment
  },
  props:{
        mItem:{
            type:Object
        },
        mValue:{
            type:Object
        },
        mConfig:{
            type:Object,
        },
        formWidth:{
            type:Number
        },
        mForm:{
            type:Object
        },
        mFormConfig:{
            type:Object,
        },
  },
  data(){
        return {
            value:'',
           
        }
  },
  computed:{
        itemObj(){
            let _item = {};
            _item.tableWidth = 0;
            _item.itemId = this.mItem.itemId;
            _item.titleName = this.mConfig?this.mConfig.titleName:this.mItem.titleName;//标题名称
            _item.titleWidth = this.mConfig?this.mConfig.titleWidth:this.mItem.titleWidth;//标题宽度
            _item.titlePos =  this.mConfig?(this.mConfig.titlePos?'n':'l'):this.mItem.titlePos;//显示表头

            _item.nullable =  this.mConfig?(this.mConfig.nullable?0:1):this.mItem.nullable;//必填
            _item.ftColor = this.mConfig?this.mConfig.ftColor:this.mItem.ftColor; //字体颜色
            _item.bgColor = this.mConfig?this.mConfig.bgColor:this.mItem.bgColor;
            
            if(_item.ftColor == null || _item.ftColor == ""){
                 _item.ftColor = this.mFormConfig?this.mFormConfig.titleTextColor:this.mForm?this.mForm.titleTextColor:null;
            }
            if(_item.bgColor == null || _item.bgColor == ""){
                _item.bgColor = this.mFormConfig?this.mFormConfig.titleBgColor:this.mForm?this.mForm.titleBgColor:null;
            }

            _item.subTypeId = this.mConfig?this.mConfig.subTypeId:this.mItem.subTypeId;
            _item.defaultVal = this.mConfig?this.mConfig.defaultVal:this.mItem.defaultVal;
            _item.inst = this.mConfig?this.mConfig.inst:this.mItem.inst;
            _item.gridRow = this.mConfig?this.mConfig.gridRow:this.mItem.gridRow; //默认行数
            _item.gridSum = this.mConfig?this.mConfig.gridSum:this.mItem.gridSum; //合计

            _item.showColTitle =  this.mConfig?(this.mConfig.showColTitle?1:0):this.mItem.showColTitle;//显示表头
            _item.showRowIdx =  this.mConfig?(this.mConfig.showRowIdx?1:0):this.mItem.showRowIdx;//显示行号

            if(_item.showRowIdx == 1){
                _item.tableWidth += 50;
            }
            _item.allowEditRow =  this.mConfig?(this.mConfig.allowEditRow?1:0):this.mItem.allowEditRow;//允许增删行
             if(_item.allowEditRow == 1){
                _item.tableWidth += 50;
            }

            _item.gridAddbutton = this.mConfig?this.mConfig.gridAddbutton:this.mItem.gridAddbutton; //添加的文本描述
            if(_item.gridAddbutton==null){
                _item.gridAddbutton = '添加';
            }

            /*对齐方式*/
            _item.titleAlign = this.mConfig?this.mConfig.titleAlign:this.mItem.titleAlign;

            if(_item.titleWidth){
                _item.titleWidth = _item.titleWidth;
            }else{
                _item.titleWidth = defaultTitleWidth;
            }

            _item.formGrid = this.mConfig?this.mConfig.childItems:this.mItem.formGrid;
            if(_item.formGrid){
                (_item.formGrid).forEach((colItem)=>{
                        colItem.gridColName = FlowFormUtil.getDesignGridModelName(colItem.modelType);
                        if(typeof colItem.nullable == 'boolean'){
                            colItem.nullable = colItem.nullable?0:1;
                        }

                        if(colItem.modelType == 'TIMEFIELD'){ //时间格式的初始化
                            this.initDate(colItem);
                        }else if(colItem.modelType == 'SLT' || colItem.modelType == 'RADIO' ){
                            this.initSelect(colItem);
                        }else if(colItem.modelType == 'CHECKBOX'){
                            this.initCheckbox(colItem);
                        }

                     
                        _item.tableWidth += colItem.titleWidth;
                })
            }

            if(_item.tableWidth < this.formWidth-2){
                 let _tableWidth = _item.tableWidth-100;
                 _item.tableWidth = this.formWidth-2;
                 if(_item.formGrid){
                    (_item.formGrid).forEach((colItem)=>{
                  
                        colItem.percentage = Math.ceil((colItem.titleWidth/_tableWidth)*100);
                    })
                 }
                 _item.needPercentage = true;
            }

            _item.allowGridImport =  this.mConfig?(this.mConfig.allowGridImport?1:0):this.mItem.gridImport;//允许增删行
            _item.allowGridExport =  this.mConfig?(this.mConfig.allowGridExport?1:0):this.mItem.gridExport;//允许增删行
            return _item;
        },      
  },
  created(){
   
  },
  mounted(){
   
  },
  methods: {

     initDate(colItem){
            if(colItem.subTypeId == 14){
                colItem.dateType = 'date';
                colItem.dateFormaterStr = 'yyyy-MM-dd';
            }else if(colItem.subTypeId == 19 ){
                colItem.dateType = 'datetime';
                colItem.dateFormaterStr = 'yyyy-MM-dd HH';
            }else if(colItem.subTypeId == 15){
                colItem.dateType = 'datetime';
                colItem.dateFormaterStr = 'yyyy-MM-dd HH:mm';
            }else if(colItem.subTypeId == 26){
                colItem.dateType = 'month';
                colItem.dateFormaterStr = 'yyyy-MM';
            }else if(colItem.subTypeId == 27){
                colItem.dateType = 'time';
                colItem.dateFormaterStr = 'HH:mm'
            }else{
                colItem.dateType = 'date'
                colItem.dateFormaterStr = 'yyyy-MM-dd';
            }
     },
     
     initSelect(colItem){ 
            if(colItem.changedFlag){
                colItem.KVMap = colItem.sysOptions;
                colItem.value = colItem.sysOptionsDefautl;
            }else{
                 if(colItem.KVMap){
                    colItem.value = colItem.defaultId;
                 }else{
                      colItem.value = null;
                 }
            }
     },


     initCheckbox(colItem){ 
            try{
                if(colItem.changedFlag){
                    colItem.KVMap = colItem.sysOptions;
                    colItem.value = colItem.sysOptionsDefautl;
                }else{


                    if(colItem.defaultId){
                         colItem.value = colItem.defaultId.split(",");
                    }else{
                        colItem.value = [];
                    }
                }
            }catch(e){
                console.log(e);
            }
            
     },

    

    
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
    margin-left:10px;
    line-height:30px;
 
}


</style>
