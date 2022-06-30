<template>
<div class="designGrid designItem gridItem" >
    
    <div class="eco-grid-title" v-bind:style="{textAlign:itemObj.titleAlign,backgroundColor:itemObj.bgColor}" v-if="!itemObj.titlePos">
         <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.display}}</span>
    </div>

     <div class="ecoGridDiv" style="overflow-x:auto;overflow-y:hidden" v-bind:style="{width:(Number(formWidth-2))+'px'}">
        <table class="ecoGridTable" v-bind:style="{width:itemObj.tableWidth+'px'}"> 
            
            <thead v-show="itemObj.showColTitle" v-bind:class="{'noBorderTop':( itemObj.titlePos  && itemObj.showColTitle)}">
                <tr >
                    <th class="eco-grid-th eco-grid-th-order" v-if="itemObj.showRowIdx"  v-bind:style="{backgroundColor:itemObj.bgColor,color:itemObj.ftColor}">序号</th>
                    <th class="eco-grid-th" v-for="(item,idx) in itemObj.crtls" :key="'th'+idx" v-bind:style="{backgroundColor:item.style.bgColor?item.style.bgColor:itemObj.bgColor,width:item.percentage?item.percentage+'%':item.style.titleWidth+'px',textAlign:item.style.titleAlign}">
                        <i v-if="item.attrs.required" class="el-form-required-i">*</i>
                        <span v-bind:style="{color:item.style.ftColor?item.style.ftColor:itemObj.ftColor}">{{item.display}}</span>
                        <el-tooltip class="item" effect="dark" :content="item.attrs.inst" placement="top" 
                            v-if="item.attrs.inst && item.attrs.inst !='' && (item.type == 'RADIO' || item.type == 'SLT' || item.type == 'CHECKBOX' )">
                            <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                        </el-tooltip>
                    </th>
                    <th class="eco-grid-th eco-grid-th-operation" v-if="itemObj.allowEditRow"  v-bind:style="{backgroundColor:itemObj.bgColor,color:itemObj.ftColor}">操作</th>
                </tr>
            </thead>

            <tbody v-bind:class="{'noBorderTop':(itemObj.titlePos && !itemObj.showColTitle ),'noBorderBottom':(!itemObj.allowEditRow )}">
                <tr v-for="rowIdx in itemObj.gridRow" :key="'tr'+rowIdx" >
                    <td class="eco-grid-td eco-grid-td-order" v-if="itemObj.showRowIdx">{{rowIdx}}</td>
                    <td class="eco-grid-td" v-for="item in itemObj.crtls" :key="item.itemId" >
                            <component 
                                    :is="item.gridColName" 
                                    :id="'gridColComponent'+item.uuid"
                                    :ref="'gridColComponent'+item.uuid"
                                    :item="item"
                                    :kvMap="kvMap[item.attrs.sysKeyValueOptionsValue]"
                            ></component>
                    </td>
                   
                    <td class="eco-grid-td eco-grid-td-operation" v-if="itemObj.allowEditRow"><span>删除</span></td>
                </tr>
                <tr v-if="itemObj.gridSum!=null">
                      <td :colspan="itemObj.crtls.length+(itemObj.showRowIdx==1?1:0)+(itemObj.allowEditRow==1?1:0)+1"><span class="girdSumText">总计</span></td>
                </tr>

                <tr v-if="itemObj.gridSum!=null" >
                         <td class="eco-grid-td eco-grid-td-order" v-if="itemObj.showRowIdx">&nbsp;</td>
                         <td class="eco-grid-td" v-for="(item,formIdx) in itemObj.crtls" :key="'formTotal'+formIdx">  
                              <div><span class="tdSum">&nbsp;</span></div>
                         </td>
                         <td class="eco-grid-td eco-grid-td-operation" v-if="itemObj.allowEditRow">&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="eco-grid-operation" v-if="itemObj.allowEditRow">
                <el-button type="primary"  size="mini" >{{itemObj.gridAddbutton}}</el-button>
                <el-button type="danger"  size="mini" >删除</el-button>
    </div>
</div>

</template>
<script>
import {getBasicKvGroupList} from'../../../../service/service'
import {defaultTitleWidth}  from '../../../../config/setting.js'
import {FormUtil} from  '../../../../config/util'
import {mapState,mapMutations} from 'vuex'
import designGridInput from "./designGridInput.vue";
import designGridTextarea from "./designGridTextarea.vue";
import designGridNumber from "./designGridNumber.vue";
import designGridDate from "./designGridDate.vue";
import designGridSelect from "./designGridSelect.vue";
import designGridRadio from "./designGridRadio.vue";
import designGridCheckbox from "./designGridCheckbox.vue";

// import designGridUserSelect from "./designGridUserSelect.vue";
// import designGridOrgSelect from "./designGridOrgSelect.vue";
// import designGridApi from "./designGridApi.vue";
// import designGridRelWF from "./designGridRelWF.vue";



export default{
  name:'designGrid',
  components:{
       designGridInput,
       designGridTextarea,
       designGridNumber,
       designGridDate,
       designGridSelect,
       designGridRadio,
       designGridCheckbox,
    //   designGridUserSelect,
    //   designGridOrgSelect,
    //   designGridApi,
    //   designGridRelWF
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
            kvMap:{}
           
        }
  },
  computed:{
        itemObj(){
            let _item = {};
            _item.tableWidth = 0;
            _item.display = this.mConfig?this.mConfig.display:this.mItem.display;//标题名称
            _item.titlePos = this.mConfig?(String(this.mConfig.attrs.titlePos)=='true'?true:false):(this.mItem.attrs?(String(this.mItem.attrs.titlePos)== 'true'?true:false):false);//隐藏标题
            _item.required = this.mConfig?(String(this.mConfig.attrs.required)=='true'?true:false):(this.mItem.attrs?(String(this.mItem.attrs.required) == 'true'?true:false):false);//必填
            _item.ftColor = this.mConfig?this.mConfig.style.ftColor:(this.mItem.style? this.mItem.style.ftColor:null); //字体颜色
            _item.bgColor = this.mConfig?this.mConfig.style.bgColor:(this.mItem.style? this.mItem.style.bgColor:null); //背景颜色
            _item.titleAlign = this.mConfig?this.mConfig.style.titleAlign:(this.mItem.style? this.mItem.style.titleAlign:'left'); //对齐方式
            if(_item.ftColor == null){
                 _item.ftColor = this.mFormConfig?this.mFormConfig.style.titleTextColor:this.mForm?this.mForm.titleTextColor:null;
            }
            if(_item.bgColor == null){
                _item.bgColor = this.mFormConfig?this.mFormConfig.style.titleBgColor:this.mForm?this.mForm.titleBgColor:null;
            }

            _item.defaultVal = this.mConfig?this.mConfig.attrs.defaultVal:(this.mItem.attrs? this.mItem.attrs.defaultVal:null);
            _item.inst = this.mConfig?this.mConfig.attrs.inst:(this.mItem.attrs? this.mItem.attrs.inst:null);
            _item.gridRow = this.mConfig?Number(this.mConfig.attrs.gridRow):(this.mItem.attrs?Number(this.mItem.attrs.gridRow):2);//默认行数
            _item.gridSum = this.mConfig?this.mConfig.attrs.gridSum:(this.mItem.attrs? this.mItem.attrs.gridSum:null);
            _item.showColTitle = this.mConfig?(String(this.mConfig.attrs.showColTitle)=='true'?true:false):(this.mItem.attrs?(String(this.mItem.attrs.showColTitle) == 'true'?true:false):true);//显示表头
            _item.showRowIdx = this.mConfig?(String(this.mConfig.attrs.showRowIdx)=='true'?true:false):(this.mItem.attrs?(String(this.mItem.attrs.showRowIdx) == 'true'?true:false):true);//显示行号
            if(_item.showRowIdx){
                _item.tableWidth += 50;
            }
            _item.allowEditRow = this.mConfig?(String(this.mConfig.attrs.allowEditRow)=='true'?true:false):(this.mItem.attrs?(String(this.mItem.attrs.allowEditRow) == 'true'?true:false):true);//显示行号
            if(_item.allowEditRow ){
                _item.tableWidth += 50;
            }

            _item.gridAddbutton = this.mConfig?this.mConfig.attrs.gridAddbutton:(this.mItem.attrs? this.mItem.attrs.gridAddbutton:'添加'); //对齐方式
            if(_item.gridAddbutton==null){
                _item.gridAddbutton = '添加';
            }


            _item.crtls = (this.mConfig && this.mConfig.crtls)? this.mConfig.crtls : ((this.mItem && this.mItem.crtls)?this.mItem.crtls:[]);
            if(_item.crtls){
                (_item.crtls).forEach((colItem)=>{
                        colItem.gridColName = FormUtil.getDesignGridModelName(colItem.type);
                        if(colItem.type == 'SLT' || colItem.type == 'RADIO' ){
                                this.initSelect(colItem);
                        }else if(colItem.type == 'CHECKBOX'){
                                this.initCheckbox(colItem);
                        }
                     
                        _item.tableWidth += Number(colItem.style.titleWidth);
                })
            }

            if(_item.tableWidth < this.formWidth-2){
                 let _tableWidth = _item.tableWidth-100;
                 _item.tableWidth = this.formWidth-2;
                 if(_item.crtls){
                    (_item.crtls).forEach((colItem)=>{
                        colItem.percentage = Math.ceil((Number(colItem.style.titleWidth)/_tableWidth)*100);
                    })
                 }
                 _item.needPercentage = true;
            }
         
            return _item;
        },      
  },

  created(){
     
  },
  mounted(){
      
   
  },
  methods: {

     initSelect(colItem){ 
           
            let _sysKeyValueOptionsValue = colItem?colItem.attrs.sysKeyValueOptionsValue:null; 
            let _sysKeyValueOptionsArr = [];
            if(_sysKeyValueOptionsValue){
                _sysKeyValueOptionsArr = _sysKeyValueOptionsValue.split(",");
            }else{
                _sysKeyValueOptionsArr = [];   
            }

            let _sysOptions = [];
            if(_sysKeyValueOptionsArr.length == 2){
                    if(!this.kvMap[_sysKeyValueOptionsValue]){
                        getBasicKvGroupList(_sysKeyValueOptionsArr[1]).then((response)=>{
                            _sysOptions = response.data;
                            this.$set(this.kvMap,_sysKeyValueOptionsValue,_sysOptions)
                        })
                    }
                    
            }
          
     },


     initCheckbox(colItem){ 
            let _sysOptionsDefaultValue = colItem?colItem.attrs.sysOptionsDefautl:null;  
            if(_sysOptionsDefaultValue){
                this.$set(colItem,'sysOptionsDefautlArr',_sysOptionsDefaultValue.split(","));
           
            }else{
                  this.$set(colItem,'sysOptionsDefautlArr',[]);
            }

            let _sysKeyValueOptionsValue = colItem?colItem.attrs.sysKeyValueOptionsValue:null; 
            let _sysKeyValueOptionsArr = [];
            if(_sysKeyValueOptionsValue){
                _sysKeyValueOptionsArr = _sysKeyValueOptionsValue.split(",");
            }else{
                _sysKeyValueOptionsArr = [];   
            }

            let _sysOptions = [];
            if(_sysKeyValueOptionsArr.length == 2){
                    if(!this.kvMap[_sysKeyValueOptionsValue]){
                        getBasicKvGroupList(_sysKeyValueOptionsArr[1]).then((response)=>{
                            _sysOptions = response.data;
                            this.$set(this.kvMap,_sysKeyValueOptionsValue,_sysOptions)
                        })
                    }
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
