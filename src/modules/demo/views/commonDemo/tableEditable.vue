<template>
  <div style="position:relative;padding-top:30px;">
    <div class="kn-header" >
      <div>
        
        <ecoActionBtn :ecoActionBtnFunc="addItem">
          <i slot="icon" class="el-icon-circle-plus"/>
          添加
        </ecoActionBtn>
        <ecoActionBtn :ecoActionBtnFunc="deleteItem">
          <i slot="icon" class="el-icon-delete"/>
          删除
        </ecoActionBtn>
      </div>
    </div>
    <el-table
      :data="listArray"
      style="width: 100%;"
      height="200px"
      border
      size="mini"
      cell-class-name="tableInput"
      :cell-style="{padding:'2px 0'}"
      highlight-current-row
      @current-change="handleCurrentChangeTable"
      >
      <el-table-column
        type="index"
        min-width="40"
        max-width="50"
        >
      </el-table-column>
      <el-table-column
        prop="number"
        show-overflow-tooltip
        label="数字字段"
        width="110"
        >
        <template  slot-scope="scope" >
          <el-input v-if="currentRow==scope.row"  @blur="toFormNumber($event,scope.row,'number')" v-model="scope.row.number"></el-input>
          <div style="padding:0 4px;" v-else>{{scope.row.number}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="str"
        show-overflow-tooltip
        label="字符字段"
        min-width="123"
        >
        <template  slot-scope="scope" >
          <el-input v-if="currentRow==scope.row" v-model="scope.row.str"></el-input>
          <div style="padding:0 4px;" v-else>{{scope.row.str}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="i18nKey"
        show-overflow-tooltip
        label="国际化键"
        min-width="123"
        >
        <template  slot-scope="scope" >
          <el-input v-if="currentRow==scope.row" v-model="scope.row.i18nKey"></el-input>
          <div style="padding:0 4px;" v-else>{{scope.row.i18nKey}}</div>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="enumDataText"
        show-overflow-tooltip
        label="枚举字段"
        width="140"
        >
        <template  slot-scope="scope" >
          <el-select  v-if="currentRow==scope.row" style="width:100%;" v-model="scope.row.enumData" placeholder="请选择枚举字段">
            <el-option v-for="(item,key) in enumMap" :key="key" :label="item" :value="key" @click.native="scope.row.enumDataText=item"></el-option>
          </el-select>
          <div style="padding:0 4px;" v-else>{{scope.row.enumDataText||enumMap[scope.row.enumData]}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        show-overflow-tooltip
        label="日期"
        width="140"
        >
        <template  slot-scope="scope" >
          <el-date-picker
            v-if="currentRow==scope.row"
            style="width:100%;"
            v-model="scope.row.date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="">
          </el-date-picker>
          <div style="padding:0 4px;" v-else>{{scope.row.date}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="dateTime"
        show-overflow-tooltip
        label="日期时间"
        width="190"
        >
        <template  slot-scope="scope" >
          <el-date-picker
            v-if="currentRow==scope.row" 
            style="width:100%;"
            v-model="scope.row.dateTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="">
          </el-date-picker>
          <div style="padding:0 4px;" v-else>{{scope.row.dateTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="dateTime"
        show-overflow-tooltip
        label="人员"
        min-width="160"
        >
        <template  slot-scope="scope" >
          <div v-if="currentRow==scope.row" class="display-input"  style="min-height: 28px;line-height: 26px;" @click="openUserChooser(scope.row)">
            <el-tag
              v-if="scope.row.userObj.orgPath"
              closable
              type="info"
              @close="scope.row.userObj={orgPath:''};scope.row.userId='';scope.row.userOrgId=''">
              {{scope.row.userObj.orgPath}}
            </el-tag>
          </div>
          <div style="padding:0 4px;" v-else>{{scope.row.userObj.orgPath}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="dateTime"
        show-overflow-tooltip
        label="部门"
        min-width="160"
        >
        <template  slot-scope="scope" >
          <div v-if="currentRow==scope.row" class="display-input" style="min-height: 28px;line-height: 26px;" @click="openDeptChooser(scope.row)">
            <el-tag
              v-if="scope.row.deptObj.orgPath"
              closable
              type="info"
              @close="scope.row.deptObj={orgPath:''};scope.row.deptId='';">
              {{scope.row.deptObj.orgPath}}
            </el-tag>
          </div>
          <div style="padding:0 4px;" v-else>{{scope.row.deptObj.orgPath}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import ecoActionBtn from '@/modules/menu/views/components/ecoActionBtn.vue'
import {getTreeEnumMap} from '@/modules/demo/service/service.js'
import EcoOrgPick from '@/components/orgPick/main.js'
export default{
  name:'tableEditable',
  components:{
    ecoActionBtn,
  },
  data(){
    return {
      enumMap:{},
      listArray:[],
      currentRow:null
    }
  },
  props:{
    inputData:{
      type:Array,
      default:function () {
        return []
      }
    }
  },
  mounted(){
    this.getTreeEnumMap();
  },
  methods: {
    toFormNumber($event,form,key){
      let formVal = form[key];
      if (/^[0-9]*$/.test(formVal)){
      }else{
        this.$message.error('该输入框只能输入数字')
        let val = formVal.replace(/(\D+[\d\D]*)/,'')
        form[key] = val;
      }
    },
    getData(){
      return this.listArray;
    },
    addItem(){
     this.listArray.push({
        deptObj:{
          orgPath:''
        },
        date:'',
        dateTime:'',
        deptId:'',
        enumDataText:'',
        enumData:'',
        i18nKey:'',
        number:'',
        str:'',
        userObj:{
          orgPath:''
        },
        userId:'',
        userOrgId:'',
     })
    },
    openDeptChooser(obj){
      let options = {
          selectMulti:false,
          selectType:'Dept',
          selectDefault:'',
          deptScopeType:'BUSINESS',
      }
      options.selectDefault = obj.deptId;
      var that  = this;
      let callBack = function(callObj){
        obj['deptId'] = callObj.resourceId;
        obj['deptObj'] = callObj;
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    openUserChooser(obj){
      let options = {
          selectMulti:false,
          selectType:'User',
          selectDefault:'',
          deptScopeType:'BUSINESS',
      }
      options.selectDefault = obj.userOrgId;
      var that  = this;
      let callBack = function(callObj){
        obj['userId'] = callObj.resourceId;
        obj['userOrgId'] = callObj.orgId;
        obj['userObj'] = callObj;
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    deleteItem(){
      if (this.currentRow){//选择了行
        this.listArray =this.listArray.filter(item=>{
          return this.currentRow!==item;
        })
      }else{
        this.$message({type: 'warning',message: '请选择行'});
      }
    },
    handleCurrentChangeTable(val) {
      this.currentRow = val;
    },
    getTreeEnumMap(){
      getTreeEnumMap().then((res)=>{
        this.enumMap = res.data;
      }).catch((error)=>{
      })
    },
  },
  watch: {
    'inputData'(val){
      if (Object.prototype.toString.call(val) === '[object Array]'){
        this.listArray = val.map((item)=>{
          item.userObj={orgPath:item.userName}
          item.deptObj={orgPath:item.deptName}
          return item;
        });
      }else{
        this.listArray = []; 
      }
    }
  }
}
</script>
<style>
.tableInput .cell{
  padding: 0 2px;
}
</style>

