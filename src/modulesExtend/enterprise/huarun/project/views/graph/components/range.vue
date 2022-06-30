<template>
    <div class="typeAttr">
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" @click="save"  type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本属性" name="baseInfo">
              <el-form v-loading="loading" ref="taskModelForm" :label-position="'top'" :show-message="false" label-width="80px" :model="form">
                <el-form-item class="formItem" label="类型">
                  <el-select size="medium" v-model="form.type" style="width:100%;" clearable placeholder="请选择">
                     <el-option
                      :key="index"
                      v-for="(item,index) in baseData['crp_standard_type']"
                      :label="item.text"
                      :value="item.id">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="formItem" size="medium" prop="taskName">
                  <span style="color: #262626;" slot="label">标准节点名称
                    <el-tooltip class="item" effect="dark" content="标准节点名称，最大限制50字" placement="top">
                      <i class="iconfont icon iconbangzhu-kong"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item class="formItem" label="前置标准节点">
                  <el-select size="medium" v-model="form.preId" style="width:100%;" filterable clearable placeholder="请选择">
                     <el-option
                      :key="index"
                      v-for="(item,index) in standardRows"
                      :label="item.name"
                      :value="item.id">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="formItem" label="重要性">
                  <el-select size="medium" v-model="form.important" style="width:100%;" filterable clearable placeholder="请选择">
                     <el-option
                      :key="index"
                      v-for="(item,index) in baseData['crp_important']"
                      :label="item.text"
                      :value="item.id">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="formItem" label="交付要求">
                  <el-select size="medium" v-model="form.require" style="width:100%;" filterable clearable placeholder="请选择">
                     <el-option
                      :key="index"
                      v-for="(item,index) in baseData['crp_require']"
                      :label="item.text"
                      :value="item.id">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="formItem">
                  <div class="mainTable">
                    <table>
                      <thead>
                        <tr>
                          <th width="8%">序号</th>
                          <th width="25%">名称</th>
                          <th width="20%">凭证代号</th>
                          <th width="25%">凭证模板</th>
                          <th width="22%">必要性</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in form.evList" :key="index">
                          <td>{{index + 1}}</td>
                          <td><el-input v-model="item.name"></el-input></td>
                          <td><el-input placeholder="选择模板" @click="selectEvidence(item)" readonly v-model="item.pzcode"></el-input></td>
                          <td><el-input placeholder="选择模板" @click="selectEvidence(item)" readonly v-model="item.pzname"></el-input></td>
                          <td>
                            <el-select v-model="item.need" style="width:100%;" clearable placeholder="请选择">
                              <el-option
                                :key="index"
                                v-for="(item,index) in baseData['crp_need']"
                                :label="item.text"
                                :value="item.id">
                                </el-option>
                            </el-select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="btn-line">
                        <el-button type="primary" @click="addSingleItem" round><i class="el-icon-plus"></i> 添加</el-button>
                        <el-button type="danger" @click="deleteItem" round><i class="el-icon-delete"></i> 删除</el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
        </el-tabs>
        
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getModelStandardRows, saveModelStandard,getModelStandardData} from '../../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
export default {
  name: 'typeAttr',
  data() {
    return {
        activeName: 'baseInfo',
        form: {
          id:"",
          modelId:"",
          type:"",
          name:"",
          preId:"",
          important:"",
          require:"",
          evList: [],
        },
        loading: false,
        standardRows: [],
        selectItem:{},
        isEdit:false
    }
  },
  props: {
    dialogVisible: {
      type: Boolean
    },
    cellId: String | Number
  },
  components: {

  },
  created() {
    this.init();
  },
  mounted() {

  },
  computed: {
    ...mapGetters([
       'baseData'
    ])
  },
  methods: {
      async init() {
        this.bindAction();
        this.loading = true;
        await this.getModelStandardRows();
        await this.getModelStandardData();
        this.loading = false;
      },
      bindAction(){
        let this_ = this;
        let callBackDialogFunc = function(obj){
          if(obj && obj.action === 'selectEvidence'){
            this_.selectItem.pzcode = obj.data.code;
            this_.selectItem.pzname = obj.data.name;
            this_.selectItem.evidenceId = obj.data.id;
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'type-range');
      },
      hideDialog() {
          // this.$emit('update:dialogVisible', false);
          this.$emit('hideDialog');
      },
      handleClick(tab, event) {

      },
      getModelStandardRows(){
        getModelStandardRows(this.$route.params.modelId).then(res=>{
          this.standardRows = res.data.rows;
        })
      },
      getModelStandardData(){
        let self = this;
        getModelStandardData(this.cellId).then(res => {
          if(res.data){
            this.form = res.data;
            setTimeout(function(){
              self.isEdit = false;
            },100)
          }
        })
      },
      addSingleItem(){
        let obj = {
          name:"",
          pzcode:"",
          pzname:"",
          evidenceId:"",
          need:""
        }
        this.form.evList.push(obj);
      },
      deleteItem(){
        this.form.evList.pop();
      },
      selectEvidence(item){
        this.selectItem = item;
        let _url = '/project/index.html#/selectEvidenceList';
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择凭证模板',_url,'800',_height,'50px');
      },
      save() {
        this.form.id = this.cellId;
        this.form.modelId = this.$route.params.modelId;
        this.$emit('saveLoading');
        saveModelStandard(this.form).then(res=>{
         
          if(res.data){
            this.isEdit = false;
           
             this.$emit('closeSaveLoading',this.form.name);
          }
        }).catch(e=>{
          this.$emit('closeSaveLoading');
        })
      }

  },
  watch: {
     form: {
        handler(newValue, oldValue) {
          
          this.isEdit = true;
　　　　  },
        deep: true
     }

  }
}
</script>
<style scoped lang="less">
.typeAttr{
    height: 100%;
}
.typeAttr .btngroup{
    position: absolute;
    right: 24px;
    height: 60px;
    line-height: 60px;
    z-index: 888;
}
.typeAttr .formItem{
    padding: 10px 24px 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    margin: 0px;
}

.typeAttr .quickItem{
    border-bottom: 1px solid #e8e8e8;
    padding: 12px 24px;
    background: #fafafa;
    text-align: right;
}
.typeAttr .hjItem{
   padding: 12px 24px;
    border-bottom: 1px solid #e8e8e8;
}
.typeAttr .hjItem:hover{
    background: #fafafa;
}
.typeAttr .el-row{
    line-height: 30px;
}
.typeAttr .checkItem {
  padding: 10px 24px 20px 24px;
   border-bottom: 1px solid #e8e8e8;
}
.typeAttr .checkItem .checkOption{
    padding: 16px;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
}
.typeAttr .checkItem .icon{
  cursor: pointer;
  position: relative;
  top: 1px;
}
.typeAttr .el-checkbox-group{
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
}
.typeAttr .el-tabs__content {
	overflow: auto;
	position: absolute;
	top: 60px;
	width: 100%;
	bottom: 0;
}
.typeAttr .el-tabs__header {
	margin: 0px;
}
@fontSize: 14px;
.table-th-td{
  border:1px solid #e8e8e8;
  padding: 20px 10px;
  text-align: center;
}
.mainTable {
  table{
    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    font-size: @fontSize;
      tr{
        height: 30px;
        line-height: 1;
      }
      th{
        background: #f0f0f0;
        .table-th-td;
        color: #0f1419 !important;
        position: relative;
      }
      td{
        background: #fafafa;
        .table-th-td;
        word-break: break-all;
        color: #666;
        .icon{
          margin-left: 5px;
        }
      }
      td.editable{

        padding: 0;

      }
      td.hidden{
        display: none;
      }
  }
}
.btn-line{
  background-color: #fff;
  cursor: pointer;
  text-align: right;
  border-radius: 4px;
  margin: 10px 0px;
}
</style>
