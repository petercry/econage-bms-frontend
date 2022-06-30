<template>
    <div class="dirctionOption">
        <div class="btn_line" v-if="data.length==0"><el-button @click="addItem" type="text"><i class="iconfont icon iconicon-test"></i> 添加流转规则</el-button></div>
        <div class="options" v-if="data.length!=0">
            <div  v-for="(item,index) in data" :key="index">
                <div class="desc_line" v-if="data.length>1 && index>0" ><p>或者</p></div>
                <div class="item">
                    <div style="position: relative;margin:5px 0;" v-for="(item1,index1) in item.logicConds" :key="index1">
                        <div class="itemDesc_line" style="" v-if="item.logicConds.length>1 && index1>0" ><p>并且</p></div>
                        <div class="logicConds" >
                            <!-- <el-select size="mini" style="width: 155px;"  @change="modelSelect($event,item1)" v-model="item1.index">
                                <el-option
                                  v-for="(item,key,index) in directionData.model_options"
                                  :key="index"
                                  :label="item.model.mdName"
                                  :value="key">
                                </el-option>
                            </el-select>
                            <el-select v-if="item1.index !== '' && directionData.model_options[item1.index] && directionData.model_options[item1.index].items" size="mini" @change="itemsSelect($event,item1)" style="width: 155px;" v-model="item1.itemindex">
                                <el-option
                                  v-for="(item,key,index) in directionData.model_options[item1.index].items"
                                  :key="index"
                                  :label="item.dataName"
                                  :value="key">
                                </el-option>
                            </el-select> -->
                            <el-cascader
                              size="mini"
                              style="width:166px;"
                              v-model="item1.lParent_temp"
                              :options="model_options_temp"
                              @change="handleLeftChange(index,index1,item1)"
                              :ref="'modelOptions'+index+ '|' +index1"
                              :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"

                            >
                            <template slot-scope="{ node, data }">
                              <span>{{ data.optionName }}</span>
                              <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                            </template>
                            </el-cascader>
                            <el-select v-show="item1.showLeftTaskItems" @change="task_change($event,item1)" size="mini" style="width: 100px;" v-model="item1.taskValue">
                                <el-option
                                :key="index"
                                v-for="(item,index) in item1.TASK_ITEMS"
                                :label="item.optionName"
                                :value="index">
                                </el-option>
                            </el-select>
                             <el-select v-show="needAppr(item1) && item1.modelType != 'APPR_CODE,APPR_CODE_RATE'" size="mini" style="width: 100px;" v-model="item1.cSymbol">
                                <el-option
                                :key="index"
                                v-for="(item,index) in item1.formula"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                             </el-select>
                             <el-select v-show="needAppr(item1)" value-key="idString" @change="appr_change($event,item1)" size="mini" style="width: 100px;" v-model="item1.apprValue">
                                <el-option
                                :key="index"
                                v-for="(item,index) in item1.APPrItemS"
                                :label="item.text"
                                :value="item">
                                </el-option>
                            </el-select>
                             <el-input  class="pointerCalss" size="mini" type="text" style="width: 100px;" readonly v-model="item1.lParent" @click.native="selectConnector('3dirctionOption',item1)" v-if="item1.modelType =='DATAMODEL_API' ">

                              </el-input>

                            <el-select v-show="needFormula(item1)" size="mini" style="width: 100px;" v-model="item1.cSymbol" @change="formulaChange($event,item1)">
                                <el-option
                                :key="index"
                                v-for="(item,index) in item1.formula"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <div style="display:inline-block" v-if="!item1.changeFormItem">
                                <el-input size="mini" v-if="needInput(item1)" :type="inputType" style="width: 190px;" v-model="item1.rVal"></el-input>
                                <el-date-picker size="mini" v-if="needDate(item1)" style="width: 191px;" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" v-model="item1.rVal"></el-date-picker>
                                <el-input-number size="mini" v-if="needNumber(item1)" style="width: 190px;" v-model="item1.rVal" controls-position="right" ></el-input-number>
                                <el-input-number size="mini" v-if="needMinNumber(item1)" style="width: 100px;" v-model="item1.rVal" :max="1.0" :min=0 controls-position="right" ></el-input-number>
                                <el-select v-if=" item1.kvName &&  directionData.kvMap.hasOwnProperty(item1.kvName) && directionData.kvMap[item1.kvName].length>0" size="mini" v-show="needSelect(item1) && !formulaInOrNotIn(item1)" style="width: 190px;" v-model="item1.rVal">
                                    <el-option
                                    :key="index"
                                    v-for="(item,index) in directionData.kvMap[item1.kvName]"
                                    v-show="item.enableInCreate"
                                    :label="item.text"
                                    :value="item.text">
                                    </el-option>
                                </el-select>
                                <el-select  v-if=" item1.kvName &&  directionData.kvMap.hasOwnProperty(item1.kvName) && directionData.kvMap[item1.kvName].length>0"  size="mini" @change="MultSelect($event,item1)" v-show="needMultSelect(item1) || formulaInOrNotIn(item1)" :multiple="true" style="width: 190px;" v-model="item1.rItem_temp">
                                    <el-option
                                    :key="index"
                                    v-for="(item,index) in directionData.kvMap[item1.kvName]"
                                    v-show="item.enableInCreate"
                                    :label="item.text"
                                    :value="item.text">
                                    </el-option>
                                </el-select>
                                <tag-select v-if="needSelectPerson(item1) || needSelectOrg(item1)" style="width: 190px;vertical-align: top;"   :initDataStr="item1.rVal" :initOptions="item1.orgSelectStatement" @callBack="tagSelectCB($event,item1)" ></tag-select>
                            </div>
                            <el-cascader
                              size="mini"
                              style="width:166px;"
                              v-model="item1.rParent_temp"
                              :options="model_options_temp"
                              :ref="'modelRightOptions'+index+ '|' +index1"
                               @change="handleRightChange(index,index1,item1)"
                             :props="{disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"
                              v-show="item1.changeFormItem"
                            >

                            <template slot-scope="{ node, data }">
                              <span>{{ data.optionName }}</span>
                              <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                            </template>
                            </el-cascader>
                            <el-select v-show="item1.showRightTaskItems" @change="task_right_change($event,item1)" size="mini" style="width: 100px;" v-model="item1.rightTaskValue">
                                <el-option
                                :key="index"
                                v-for="(item,index) in item1.R_TASK_ITEMS"
                                :label="item.optionName"
                                :value="index">
                                </el-option>
                            </el-select>
                               <el-input  class="pointerCalss" size="mini" type="text" style="width: 100px;" readonly v-model="item1.rParent" @click.native="selectConnector('4dirctionOption',item1)" v-if="item1.showRightApiInput">

                                </el-input>

                            <div class="qiehuan" @click="changeFormItem(item1)" v-show="needFormula(item1) && !needAppr(item1)">
                                <i class="iconfont icon iconqiehuan"></i>
                            </div>
                            <div class="deal">
                                <i @click="addSingleOption(item.logicConds)" class="iconfont icon iconpluscircleo"></i>
                                <i @click="deleteItem(index,index1,item.logicConds)" class="iconfont icon iconclosecircleo"></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="btn_line" v-if="data.length>0"><el-button @click="addItem" type="text"><i class="iconfont icon iconicon-test"></i> 添加“或（OR）条件”</el-button></div>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import tagSelect from './tagSelect.vue'
import {EcoUtil} from '@/components/util/main.js'
export default{
  name:'dirctionOption',
  data(){
    return {
       GT:{
          value:"GT",
          label:"大于"
       },
       LT:{
          value:"LT",
          label:"小于"
       },
       GT_EQ:{
          value:"GT_EQ",
          label:"大于等于"
       },
       LT_EQ:{
          value:"LT_EQ",
          label:"小于等于"
       },
       EQ:{
          value:"EQ",
          label:"等于"
       },
       UNEQ:{
          value:"UNEQ",
          label:"不等于"
       },
       CONTAINS:{
          value:"CONTAINS",
          label:"包含"
       },
       UNCONTAINS:{
          value:"UNCONTAINS",
          label:"不包含"
       },
       IN:{
          value:"IN",
          label:"存在于集合"
       },
       NOT_IN:{
          value:"NOTIN",
          label:"不存在于集合"
       },
       CONTAINS_SEL:{
          value:"CONTAINS",
          label:"集合中存在"
       },
       UNCONTAINS_SEL:{
          value:"UNCONTAINS",
          label:"集合中不存在"
       },
       CONTAINS_CHILD:{
          value:"CONTAINS_CHILD",
          label:"包含子结点"
       },
       UNCONTAINS_CHILD:{
          value:"UNCONTAINS_CHILD",
          label:"不包含子结点"
       },
       IN_PARENT:{
          value:"IN_PARENT",
          label:"属于父结点"
       },
       NOTIN_PARENT:{
          value:"NOTIN_PARENT",
          label:"不属于父结点"
       },
       seletop:[{
         value:"1",
         label:"选项1"
       },
       {
         value:"2",
         label:"选项2"
       },
       {
         value:"3",
         label:"选项3"
       }],
       APPrItemS:[
         {
            id:"1",
            text:"同意"
         },
         {
            id:"0",
            text:"不同意"
         }
       ],
       value1:"",
       value2:"",
       value3:"1",
       value4:"",
       inputType:"text",
       model_options_temp:[],
       needIngItem:{},//当前需要回写的项
    }
  },
  components:{
    tagSelect
  },
   props:{
      data:Array
    },
  created(){
       window.directionVM = this;
  },
  mounted(){
     this.model_options_temp = this.copyDeep(this.directionData.model_options);
     this.init();
     this.bindAction();

  },
  computed:{
     ...mapState([
        'directionData',
        'operate_id'
    ]),
  },
  methods: {
      bindAction(){
        let this_ = this;
        let callBackDialogFunc = function(obj){
            console.log(obj);
            console.log(343434);
            if(obj && obj.action == 'selectConnector' ){

                if(obj.flag == '3dirctionOption'){//左边选择
                    window.directionVM.needIngItem.lParent = obj.data.paramName;
                    window.directionVM.needIngItem.lItem = obj.data.paramId?obj.data.paramId:obj.data.paramDataId?obj.data.paramDataId:"";
                    console.log( obj.data.paramName)
               }else if(obj.flag == '4dirctionOption'){//右边选择
                    window.directionVM.needIngItem.rParent = obj.data.paramName;
                    window.directionVM.needIngItem.rItem = obj.data.paramId?obj.data.paramId:obj.data.paramDataId?obj.data.paramDataId:"";
                }
                console.log(window.directionVM.needIngItem)
            }
            return;
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'dirctionOption');
      },
      modelSelect(index,item){
        item.lMd = this.directionData.model_options[index].model.mdId;
        this.$set(item,'itemindex','');
        item.lItem = '';
        item.formItem = '';
        item.modelType = '';
        item.rMd = 0;
        this.$set(item,'rVal',''); //添加属性或修改属性
        this.$set(item,'rItem',''); //添加属性或修改属性
        this.$set(item,'rItem_temp',''); //添加属性或修改属性
        this.$set(item,'cSymbol','GT'); //添加属性或修改属性
      },
      itemsSelect(index,item){
        item.lItem = this.directionData.model_options[item.index].items[index].dataId;
        item.formItem = this.directionData.model_options[item.index].items[index].kvName;
        item.modelType = this.directionData.model_options[item.index].items[index].modelType;
        item.rMd = 0;
        this.$set(item,'rVal',''); //添加属性或修改属性
        this.$set(item,'rItem',''); //添加属性或修改属性
        this.$set(item,'rItem_temp',''); //添加属性或修改属性
        this.$set(item,'cSymbol','GT'); //添加属性或修改属性


      },
      MultSelect(value,item){
         this.$set(item,'rVal',value.join('####'));
      },
      init(){
          this.data.forEach((element,index) => {
            element.logicConds.forEach((item,index1) => {
                if(item.lMd == "3"){
                    this.$set(item,'lParent_temp',item.lMd.split(','));
                }else{
                    this.$set(item,'lParent_temp',item.lParent.split(','));
                }
                if(item.rParent && !item.rVal){
                    this.$set(item,'changeFormItem',true);
                    this.$set(item,'rParent_temp',item.rParent.split(','));
                    if(item.rMd == "3"){
                         this.$set(item,'rParent_temp',item.rMd.split(','));
                         this.$set(item,'showRightApiInput',true);
                    }
                    if(item.rItem && item.rItem != item.rParent_temp[item.rParent_temp.length - 1]){
                        this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
                        this.$set(item,'showRightTaskItems',true);
                        let r_node = this.getCascaderObj(item.rParent_temp,this.directionData.model_options);
                        let r_data = r_node[r_node.length-1];
                        if(r_data.modelType == "DATAMODEL_API"){
                            this.$set(item,'showRightTaskItems',false);


                        }else{
                            item.R_TASK_ITEMS = r_data.taskItems;
                            r_data.taskItems.forEach((element,index) => {
                              if(element.optionId == item.rItem){
                                  this.$set(item,'rightTaskValue',index);
                              }
                            });
                        }
                    }
                }
                let node = this.getCascaderObj(item.lParent_temp,this.directionData.model_options);
                let data = node[node.length-1];
                if(data.hasOwnProperty("kvName")){
                  this.$set(item,'kvName',data.kvName);
                }
                this.$set(item,'formula',new Array); //添加属性或修改属性
                this.$set(item,'TASK_ITEMS',new Array); //添加属性或修改属性
                this.$set(item,'modelType',data.modelType);
               this.$set(item,'APPrItemS',new Array);
                 if(item.lItem != item.lParent_temp[item.lParent_temp.length-1] && data.modelType != "DATAMODEL_API"){

                    item.showLeftTaskItems = true;
                    item.TASK_ITEMS = data.taskItems;
                    data.taskItems.forEach((element,index) => {
                       if(element.optionId == item.lItem){
                           this.$set(item,'modelType',element.modelType);
                           this.$set(item,'taskValue',index);
                       }
                    });
                    if(item.modelType == "TASK_LEVEL"){
                      item.modelType = item.TASK_ITEMS[0].modelType;
                    }
                    if(item.modelType == "APPR_CODE"){

                      this.APPrItemS = this.directionData.kvMap[data.kvName];
                      console.log(this.APPrItemS);
                      let obj = {
                        id:item.TASK_ITEMS[0].apprRate.optionId,
                        idString:item.TASK_ITEMS[0].apprRate.optionId,
                        text:item.TASK_ITEMS[0].apprRate.optionName
                      }
                      item.APPrItemS = item.APPrItemS.concat(this.APPrItemS);
                      item.APPrItemS.push(obj);

                    }
                    if(item.TASK_ITEMS[0].hasOwnProperty("apprRate") && item.lItem == item.TASK_ITEMS[0].apprRate.optionId){
                        this.$set(item,'taskValue',0);
                        this.$set(item,'modelType',"APPR_CODE,APPR_CODE_RATE");
                        this.$set(item,'apprValue',item.TASK_ITEMS[0].apprRate.optionName);
                    }else{
                        if(item.rVal == 1){
                            item.rVal = item.APPrItemS[0].text;
                             this.$set(item,'apprValue',item.rVal);
                        }else if(item.rVal == 0){

                            for(let i = 0;i<item.APPrItemS.length;i++){
                                if(item.APPrItemS[i].id == 0){
                                    item.rVal = item.APPrItemS[i].text;
                                    break;
                                }
                            }
                             this.$set(item,'apprValue',item.rVal);
                        }else{
                             let flag = false;//判断之前保存的自定义决策内容是否在决策数据中
                             for(let i = 0;i<item.APPrItemS.length;i++){
                                if(item.rVal == item.APPrItemS[i].text){
                                    flag = true;
                                    break;
                                }
                             }
                             if(flag){
                                 this.$set(item,'apprValue',item.rVal);
                             }else{
                                 this.$set(item,'apprValue',"");
                             }
                        }


                    }

                }
                if((this.needSelect(item) || this.needMultSelect(item) || item.modelType == "USERSLT" || item.modelType == "ORGSLT") && (data.optionName === '名称' || data.optionName === '编码')){
                    //    item.formula.push(this.EQ);// =
                    //    item.formula.push(this.UNEQ);// <>
                    //    item.formula.push(this.CONTAINS);// in
                    //    item.formula.push(this.UNCONTAINS);// not in
                    item.modelType = "select_input";
                }
                 this.changeFormula(item);
                if(item.modelType == "CHECKBOX" || this.formulaInOrNotIn(item) ){
                  this.$set(item,'rItem_temp',item.rVal.split('####'));
                }
                //选人或组织逻辑处理
                if(item.modelType == "USERSLT" || item.modelType == "ORGSLT"){
                  if(data.hasOwnProperty("orgSelectStatement")){
                        let _options = {};
                        let _params = data.orgSelectStatement;
                        _options.selectType = _params.org_source;
                        _options.idType = _params.return_type;
                        _options.beginId = _params.begin_id;
                        _options.selectDefault = _params.dept_default;
                        _options.selectNum = _params.selectType;
                        if(_options.selectNum  == 0){
                           _options.selectNum = 1;
                        }else if(_options.selectNum == 1){
                           _options.selectNum = 2;
                        }
                        _options.selectType = item.modelType == 'ORGSLT' ? 'Dept':'User';
                        if(item.modelType == 'ORGSLT' && (item.cSymbol == "CONTAINS_CHILD" || item.cSymbol == "UNCONTAINS_CHILD")){
                            _options.selectType = 'Dept-User';
                            _options.selectNum = 2;
                        }
                        if(item.cSymbol == "IN_PARENT" || item.cSymbol == "NOTIN_PARENT"){
                            _options.selectType = 'Dept';
                            _options.selectNum = 2;
                        }
                        if(item.cSymbol == "IN" || item.cSymbol == "NOTIN"){
                            _options.selectNum = 2;
                        }
                        this.$set(item,'orgSelectStatement',_options);

                  }

                }

            });
          });

      },
      addItem(){
        let obj = {

           logicConds:[{

           }]
        }


        this.data.push(obj);

      },
      addSingleOption(logicConds){
        logicConds.push({})

      },
      deleteItem(index,index1,logicConds){
          if(logicConds.length == 1){
               this.data.splice(index, 1);
          }else{
              logicConds.splice(index1, 1);
          }
      },
      needFormula(item){
          if(item.modelType && item.modelType !="APPR_CODE" ){
            return true;
          }
          return false;
      },
      needAppr(item){
          if(item.modelType == "APPR_CODE" || item.modelType == "APPR_CODE,APPR_CODE_RATE"){
            return true;
          }
          return false;
      },
      needInput(item){
          if(item.modelType && !this.needDate(item) && !this.needNumber(item) && !this.needSelect(item) && !this.needMultSelect(item) && !this.needSelectPerson(item) && !this.needSelectOrg(item) && !this.needMinNumber(item) && item.modelType !="APPR_CODE"){
              return true;
          }else{
              return false;
          }
          // if(item.modelType === "TEXTFIELD" || item.modelType === "TEXTAREA"){
          //   return true;
          // }
          // return false;
      },
      needDate(item){
          if(item.modelType === "TIMEFIELD"){
            return true;
          }
          return false;
      },
      needNumber(item){
          if(item.modelType === "NUMFIELDQUERY" || item.modelType === "NUMFIELD"){
            return true;
          }
          return false;
      },
      needMinNumber(item){
          if(item.modelType =="APPR_CODE,APPR_CODE_RATE"){
            return true;
          }
          return false;
      },
      needSelect(item){
          if(item.modelType === "SLT" || item.modelType === "RADIO" || item.modelType === "SLT_CASCADE"){
              return true;
          }
          return false;
      },
      needMultSelect(item){
          if(item.modelType === "CHECKBOX"){
              return true;
          }
          return false;
      },
      needSelectPerson(item){
          if(item.modelType === "USERSLT"){
              return true;
          }
          return false;
      },
      needSelectOrg(item){
          if(item.modelType === "ORGSLT"){
              return true;
          }
          return false;
      },
      copyDeep(templateData) {
          return JSON.parse(JSON.stringify(templateData));
      },
      getCascaderObj(val,opt) {
        return val.map(function (value, index, array) {
          for (var itm of opt) {
            if (itm.optionId == value) { opt = itm.deriveItems; return itm; }
          }
          return null;
        });
      },
      appr_change(appr,item){
          if(!appr.hasOwnProperty("comments")){
              item.lItem = appr.id;
              item.rVal = 1;
              item.modelType = "APPR_CODE,APPR_CODE_RATE";
              this.$set(item,'cSymbol','EQ'); //添加属性或修改属性
          }else{
              item.rVal = appr.text;
              item.lItem = item.TASK_ITEMS[item.taskValue].optionId;
              item.modelType = "APPR_CODE";
          }
          this.changeFormula(item);
      },
      task_change(value,item){
          item.modelType = item.TASK_ITEMS[value].modelType;
          item.rVal = '';
          if(item.modelType == "APPR_CODE" ){
              item.apprValue = this.APPrItemS[0].text;
              this.$set(item,'showRightTaskItems',false);
              this.$set(item,'changeFormItem',false);
          }
          item.lItem = item.TASK_ITEMS[value].optionId;

      },
      task_right_change(value,item){
          this.$set(item,'rItem',item.R_TASK_ITEMS[value].optionId);

      },
      handleLeftChange(index,index1,item) {
          item.lMd = item.lParent_temp[0];
          item.lItem = item.lParent_temp[item.lParent_temp.length -1];
          item.formItem = '';
          item.showLeftTaskItems = false;
          this.$set(item,'rVal',''); //添加属性或修改属性
          this.$set(item,'rItem',''); //添加属性或修改属性
          this.$set(item,'rMd','0'); //添加属性或修改属性
          this.$set(item,'rItem_temp',''); //添加属性或修改属性
          this.$set(item,'cSymbol','EQ'); //添加属性或修改属性
          this.$set(item,'formula',new Array); //添加属性或修改属性
          this.$set(item,'TASK_ITEMS',new Array); //添加属性或修改属性
          this.$set(item,'modelType',"");
          this.$set(item,'taskValue',0);
          this.$set(item,'lParent',item.lParent_temp.join(','));
          let model = 'modelOptions'+index+ '|' +index1;
          let node = this.$refs[model][0].getCheckedNodes()[0].data;
          item.modelType = node.modelType;
          if(item.lParent_temp.length > 1){
              if(item.modelType == "USERSLT" || item.modelType == "ORGSLT"){
                  if(node.hasOwnProperty("orgSelectStatement")){

                       let _options = {};
                       let _params = node.orgSelectStatement;
                        _options.selectType = _params.org_source;
                        _options.idType = _params.return_type;
                        _options.beginId = _params.begin_id;
                        _options.selectDefault = _params.dept_default;
                        _options.selectNum = _params.selectType;
                        if(_options.selectNum  == 0){
                           _options.selectNum = 1;
                        }else if(_options.selectNum == 1){
                           _options.selectNum = 2;
                        }
                        _options.selectType = item.modelType == 'ORGSLT' ? 'Dept':'User';
                       this.$set(item,'orgSelectStatement',_options);
                  }
              }

              if(node.hasOwnProperty("kvName")){
                   item.kvName = node.kvName;
              }
              if(node.hasOwnProperty("taskItems") && item.modelType == "TASK_LEVEL"){
                    item.TASK_ITEMS = node.taskItems;
                    this.$set(item,'showLeftTaskItems',true);
                     this.$set(item,'APPrItemS',new Array());
                    item.modelType = item.TASK_ITEMS[0].modelType;
                    item.lItem = item.TASK_ITEMS[0].optionId;
                    if(item.modelType == "APPR_CODE"){

                        this.APPrItemS = this.directionData.kvMap[node.kvName];

                        this.$set(item,'apprValue',this.APPrItemS[0].text);
                        item.rVal = this.APPrItemS[0].text;
                        this.$set(item,'changeFormItem',false);
                        this.$set(item,'showRightTaskItems',false);
                      let obj = {
                        id:item.TASK_ITEMS[0].apprRate.optionId,
                        idString:item.TASK_ITEMS[0].apprRate.optionId,
                        text:item.TASK_ITEMS[0].apprRate.optionName
                      }
                      item.APPrItemS = item.APPrItemS.concat(this.APPrItemS);
                      item.APPrItemS.push(obj);
                    }
              }


          }
          if((this.needSelect(item) || this.needMultSelect(item)) && (node.optionName === '名称' || node.optionName === '编码')){
            //    item.formula.push(this.EQ);// =
            //    item.formula.push(this.UNEQ);// <>
            //    item.formula.push(this.CONTAINS);// in
            //    item.formula.push(this.UNCONTAINS);// not in
               item.modelType = "select_input";
           }
           this.changeFormula(item);


           if(item.lParent_temp.length == 1){


              if(item.modelType == 'DATAMODEL_API'){
                  this.$set(item,'lParent','');
                  //console.log(this.needIngItem)
                  // console.log( window.directionVM)
                 this.selectConnector('3dirctionOption',item);
              }

           }

      },
      handleRightChange(index,index1,item){
           this.$set(item,'rParent',item.rParent_temp.join(','));
           this.$set(item,'showRightTaskItems',false);
           this.$set(item,'showRightApiInput',false);
           this.$set(item,'rightTaskValue',0);
           this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
            if(item.rParent_temp.length > 1){
              let model = 'modelRightOptions'+index+ '|' +index1;
              let node = this.$refs[model][0].getCheckedNodes()[0].data;
              item.rMd = node.mdId;
              if(node.hasOwnProperty("taskItems") && node.modelType == "TASK_LEVEL"){
                  this.$set(item,'showRightTaskItems',true);
                  item.R_TASK_ITEMS = node.taskItems;
                  this.$set(item,'rItem',item.R_TASK_ITEMS[0].optionId);
              }else{
                  this.$set(item,'rItem',item.rParent_temp[item.rParent_temp.length - 1]);
              }
            }
            if(item.rParent_temp.length == 1){
              let model = 'modelRightOptions'+index+ '|' +index1;
              let node = this.$refs[model][0].getCheckedNodes()[0].data;
              item.rMd = node.mdId;
              if(node.modelType == "DATAMODEL_API"){
                   this.$set(item,'showRightApiInput',true);
                   this.$set(item,'rParent','');
                   this.selectConnector('4dirctionOption',item);

              }
            }

      },
      changeFormula(item){
          this.$set(item,'formula',new Array); //添加属性或修改属性
          if(this.needDate(item) || this.needNumber(item)){
              item.formula.push(this.GT);// >
              item.formula.push(this.LT);// <
              item.formula.push(this.GT_EQ);// >=
              item.formula.push(this.LT_EQ);// <=
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
          }else if(this.needSelectPerson(item)){
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
              item.formula.push(this.IN_PARENT);//属于父结点
              item.formula.push(this.NOTIN_PARENT);//不属于父结点
              item.formula.push(this.IN);// 存在于集合
              item.formula.push(this.NOT_IN);// 不存在于集合
          }else if(this.needSelectOrg(item)){
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
              item.formula.push(this.CONTAINS_CHILD);// 包含子结点
              item.formula.push(this.UNCONTAINS_CHILD);// 不包含子结点
              item.formula.push(this.IN_PARENT);//属于父结点
              item.formula.push(this.NOTIN_PARENT);//不属于父结点
              item.formula.push(this.IN);// 存在于集合
              item.formula.push(this.NOT_IN);// 不存在于集合
              item.formula.push(this.CONTAINS_SEL);// 集合中存在
              item.formula.push(this.UNCONTAINS_SEL);// 集合中不存在
          }else if(this.needSelect(item) ){
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
              item.formula.push(this.IN);// in
              item.formula.push(this.NOT_IN);// not in
          }else if(this.needMinNumber(item) ){
              item.formula.push(this.GT);// >
              item.formula.push(this.LT);// <
              item.formula.push(this.GT_EQ);// >=
              item.formula.push(this.LT_EQ);// <=
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
          }else if(this.needAppr(item) ){
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
          }else if(this.needMultSelect(item)){
              item.formula.push(this.CONTAINS_SEL);// 集合中存在
              item.formula.push(this.UNCONTAINS_SEL);// 集合中不存在
              item.formula.push(this.IN);// in
              item.formula.push(this.NOT_IN);// not in
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
          }else if(item.modelType == 'DATAMODEL_API'){
              item.formula.push(this.CONTAINS);// 包含
              item.formula.push(this.UNCONTAINS);// 不包含
              item.formula.push(this.GT);// >
              item.formula.push(this.LT);// <
              item.formula.push(this.GT_EQ);// >=
              item.formula.push(this.LT_EQ);// <=
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
          }else{
              item.formula.push(this.CONTAINS);// 包含
              item.formula.push(this.UNCONTAINS);// 不包含
              item.formula.push(this.EQ);// =
              item.formula.push(this.UNEQ);// <>
          }
      },
      changeFormItem(item){
          this.$set(item,'rVal',''); //添加属性或修改属性
          this.$set(item,'rItem',''); //添加属性或修改属性
          this.$set(item,'rItem_temp',''); //添加属性或修改属性
          this.$set(item,'rMd','0'); //添加属性或修改属性
          this.$set(item,'rParent',''); //添加属性或修改属性
          this.$set(item,'rParent_temp',''); //添加属性或修改属性
          this.$set(item,'rightTaskValue',0);
          this.$set(item,'showRightApiInput',false);
          this.$set(item,'R_TASK_ITEMS',new Array); //添加属性或修改属性
          if(!item.changeFormItem){
           this.$set(item,'showRightTaskItems',item.R_TASK_ITEMS && item.R_TASK_ITEMS.length>0? true:false);
          }else{
            this.$set(item,'showRightTaskItems',false);
          }
           this.$set(item,'changeFormItem',item.changeFormItem? false:true);
      },
      tagSelectCB(){
          arguments[1].rVal = arguments[0].id;
      },
      selectConnector(flag,item){
        window.directionVM.needIngItem = item;
        let _url = '/flowform/index.html#/selectConnector/'+this.operate_id+'/0/0/'+flag;
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
     },
     formulaChange(value,item){
          this.$set(item,'rVal','');
          this.$set(item,'rItem','');
          this.$set(item,'rItem_temp','');
          //选人表达式逻辑
          if(item.modelType == "USERSLT" || item.modelType == "ORGSLT"){
            item.orgSelectStatement.selectType = item.modelType == 'ORGSLT' ? 'Dept':'User';//默认方式
            if(item.modelType == 'ORGSLT' && (value == "CONTAINS_CHILD" || value == "UNCONTAINS_CHILD")){
                item.orgSelectStatement.selectType = 'Dept-User';
                item.orgSelectStatement.selectNum = 2;
            }
            if(value == "IN_PARENT" || value == "NOTIN_PARENT"){
                item.orgSelectStatement.selectType = 'Dept';
                item.orgSelectStatement.selectNum = 2;
            }
            if(value == "IN" || value == "NOTIN"){
                item.orgSelectStatement.selectNum = 2;
            }
            console.log(item.orgSelectStatement)
          }
     },
     formulaInOrNotIn(item){
         return (this.needSelect(item) || this.needMultSelect(item)) && (item.cSymbol == "IN" || item.cSymbol == "NOTIN");
     }
  },
  watch: {
    'data.length':{
        handler(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.data.forEach((element,index) => {
                    element.lgOrder = index+1;
                });
            }
        }
    }

  }
}
</script>
<style scoped>
.dirctionOption .options .item{
    border: 1px solid #e8e8e8;
    background-color: #d9d9d9;
    border-radius: 2px;
    padding: 16px 4px;
    margin-bottom: 8px;
    position: relative;
}
.dirctionOption .btn_line{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #f5f5f5;
    border: 1px dotted #e8e8e8;
    border-radius: 2px;
    color: #1ba5fa;
    height: 32px;
    cursor: pointer;
}
.dirctionOption .deal {
    display: inline;
    position: relative;
    top:3px;
}
.dirctionOption .item .logicConds{
      margin: 0 0 0 44px;
}
.dirctionOption .deal .icon{
    font-size: 16px;
    color: #1ba5fa;
    margin-right: 1px;
    cursor: pointer;
}
.dirctionOption .desc_line{
    width: 60px;
    height: 24px;
    margin: 8px 0;
    text-align: center;
    border-radius: 2px;
    background-color: #e8e8e8;
    color: #262626;
}
.dirctionOption .itemDesc_line{
    position: absolute;
    top: 7px;
    width: 40px;
    height: 26px;
    text-align: center;
    border-radius: 2px;
    background-color: #e8e8e8;
    color: #262626;
}
.dirctionOption .desc_line p{
    font-size: 12px;
    line-height: 24px;
}
.dirctionOption .itemDesc_line p{
    font-size: 12px;
    line-height: 26px;
}
.dirctionOption .qiehuan{
    height: 26px;
    line-height: 26px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 26px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 2px;
    cursor: pointer;
}


</style>
