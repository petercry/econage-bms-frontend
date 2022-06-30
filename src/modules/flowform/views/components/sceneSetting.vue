<template>
    <div class="sceneSetting">
        <el-form  v-loading="loading" :model="form" ref="form" label-position="top" :show-message="false" class="container" label-width="100px">
            <el-form-item>
                <div slot="label">
                    <label>{{name}} </label>
                    <el-button size="medium" type="text" @click="selectConnector"> 切换</el-button>
                </div>
            </el-form-item>
            <el-form-item label="操作方式">
                <el-radio-group v-model="form.sc_type">
                  <el-radio-button label="1">弹框选择</el-radio-button>
                  <el-radio-button label="2">下拉选择</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="弹框名称" v-show="form.sc_type == 1">
               <el-input v-model="form.sc_name" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="选择方式" v-show="form.sc_type == 1">
                <el-radio-group v-model="form.sc_select">
                  <el-radio-button label="1">单选</el-radio-button>
                  <el-radio-button label="2">多选</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <div slot="label">
                    <label>预加载</label>
                    <el-switch
                        v-model="form.is_preload" style="margin-left:15px" :active-value="1" :inactive-value="0">
                    </el-switch>
                </div>

            </el-form-item>
               <el-form-item>
                <div slot="label">
                    <label>高级搜索</label>
                    <el-switch
                        v-model="form.sc_inputsearch" style="margin-left:15px" :active-value="1" :inactive-value="0">
                    </el-switch>
                </div>

            </el-form-item>
            <el-form-item label="搜索参数配置" v-if="form.sc_inputsearch">
                <el-table
                    size="medium"
                    class="list"
                    :data="searchDataList"
                    style="width: 100%;">
                     <el-table-column

                        label="序号"
                        width="80"
                        >
                        <template slot-scope="scope">

                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="titleName"
                        label="描述名称"
                        width="220"
                        >
                         <template slot-scope="scope">
                           <el-input type="text" v-model="scope.row.titleName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="dataId"
                        label="输入参数"

                        >
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.dataId">
                                 <el-option
                                :key="index"
                                v-for="(item,index) in ref_inputlist"
                                :label="item.paramName"
                                :value="item.paramDataId">
                                </el-option>
                            </el-select>
                         </template>
                    </el-table-column>
                    <el-table-column
                        prop="defaultVal"
                        label="默认值"
                        width="220"
                        >
                        <template slot-scope="scope">
                           <el-input type="text" v-model="scope.row.defaultVal"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="scVisible"
                        label="是否显示"
                        width="150"
                        >
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.scVisible" style="width:70%;">
                                <el-option
                                :key="index"
                                v-for="(item,index) in serach_display_option"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                             <div class="deleteIcon" @click="deleteSearchFormItem(scope.$index)" style="color:rgb(245, 108, 108)">
                                <i class="iconfont icon iconshanchudelete30"></i>
                            </div>
                         </template>
                    </el-table-column>
                </el-table>
                 <div class="btn_line"><el-button @click="addSearchFormItem()" style="font-size:14px;" type="text"><i class="iconfont icon iconicon-test"></i> 添加搜索参数</el-button></div>
            </el-form-item>
            <el-form-item label="赋值参数配置">
                <el-table
                    size="medium"
                    class="list"
                    :data="listData"
                    style="width: 100%;">
                     <el-table-column
                        prop="paramName"
                        label="赋值参数"
                        width="160"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope">
                            <i class="iconfont icon-act iconhandright" v-if="scope.row.paramPath"></i>
                            {{scope.row.paramName}}
                        </template>
                    </el-table-column>
                       <el-table-column
                        prop="titleName"
                        label="参数名称"
                        width="160"
                        key="8"
                         v-if="form.sc_type==2"
                        >

                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="表格表头名称"
                        key="1"
                        v-if="form.sc_type==1"
                        width="150"
                        >
                        <template slot-scope="scope">
                            <el-input type="text" v-model="scope.row.titleName"></el-input>
                         </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="表单字段"
                        >
                        <template slot-scope="scope">
                            <div v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' ">
                                <el-cascader
                                style="width:170px;"
                                v-model="scope.row.targetParent_temp"
                                @change="modelSelect(scope.row,scope.$index)"
                                :options="modelData"
                                :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"

                                >
                                <template slot-scope="{ node, data }">
                                <span>{{ data.optionName }}</span>
                                <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="scVisible"
                        label="是否隐藏"
                        key="2"
                        v-if="form.sc_type==1"
                        width="100"
                        >
                        <template slot-scope="scope">
                            <el-select  v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' " v-model="scope.row.scVisible">
                                <el-option
                                :key="index"
                                v-for="(item,index) in visibleOption"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                         </template>
                    </el-table-column>
                    <el-table-column
                        prop="scOrder"
                        label="排序"
                        key="3"
                        v-if="form.sc_type==1"
                        width="95"
                        >
                         <template slot-scope="scope">
                            <el-input-number  v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' " style="width: 85px;" v-model="scope.row.scOrder" :min=0 :max=99 controls-position="right" ></el-input-number>
                         </template>
                    </el-table-column>
                    <el-table-column
                        prop="scSearchable"
                        label="搜索字段"
                        key="5"
                        v-if="form.sc_type==1"
                        width="100"
                        >
                        <template slot-scope="scope">
                            <el-select  v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' " v-model="scope.row.scSearchable">
                                <el-option
                                :key="index"
                                v-for="(item,index) in apprOption"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                         </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="主键"
                        key="4"
                        width="80"
                        >
                         <template slot-scope="scope">
                            <el-radio v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' " v-model="valAttr" :label="scope.$index">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div class="btn">
              <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
              <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import {loadSceneInfo,saveSceneInfo} from '../../service/service.js'

export default{
  data(){
    return {
      loading:true,
      name:"",
      listData:[],
      modelData:[],
      form:{
          operate_id:"",
          ref_id:"",
          sc_type:1,
          sc_select:1,
          is_preload:1,
          sc_inputsearch:0,
          sc_mapping:"",
          sc_search:"",
          sc_name:""
      },
     serach_display_option:[
        {
             name:"是",
             value:1
         },
         {
             name:"否",
             value:0
         }
      ],
      visibleOption:[
        {
             name:"是",
             value:0
         },
         {
             name:"否",
             value:1
         }
      ],
      apprOption:[
         {
             name:"是",
             value:1
         },
         {
             name:"否",
             value:0
         }
       ],
       valAttr:"",
       searchDataList:[],
       ref_inputlist:[]
    }
  },
  components: {
   ecoLoading,
  },
  created(){
    this.form.operate_id = this.$route.params.operateId;
    this.form.ref_id = this.$route.params.refId;
    if(this.$route.params.scId > 0){
         this.form.sc_id = this.$route.params.scId;
    }
    this.loadSceneInfo();
  },
  beforeDestroy() {

  },
  mounted(){
      this.bindAction();
  },
  computed:{

  },
  methods: {
        bindAction(){
            let that = this;
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'selectConnector'){
                    that.form.ref_id = obj.data.refId;
                    that.loadSceneInfo(true);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'sceneSetting');
       },

        loadSceneInfo(flag){
          let data = {
              operate_id:this.form.operate_id,
              ref_id:this.form.ref_id
          }


               data.sc_id = this.form.sc_id;


          loadSceneInfo(data).then((response)=>{
              this.loading = false;
              if(response.data.status <100){
                  this.listData = response.data.remap.scene_mapping;
                  this.searchDataList = response.data.remap.scene_searchlist?response.data.remap.scene_searchlist:[];
                  this.ref_inputlist = response.data.remap.ref_inputlist;
                  this.listData.forEach((item,index)=>{
                        if(item.targetParent){
                            this.$set(item,"targetParent_temp",item.targetParent.split(','));
                        }
                        if(item.valAttr == 1){
                            this.valAttr = index;
                        }
                  })
                  this.modelData = response.data.remap.form_item;
                  this.name = response.data.remap.ref_entity.refName;
                  if(response.data.remap.hasOwnProperty("sc_entity")){
                      let sc_entity = response.data.remap.sc_entity;
                      this.form.sc_type = sc_entity.scType;
                      this.form.sc_select = sc_entity.scSelect;
                      this.form.sc_name = sc_entity.scName;
                      this.form.is_preload = sc_entity.isPreload;
                      this.form.sc_inputsearch = sc_entity.scInputsearch;
                  }
              }
          })
      },
      modelSelect(item,index){
        this.$set(item,'targetParent',item.targetParent_temp.join(','));
        this.$set(item,'targetItem',item.targetParent_temp[item.targetParent_temp.length - 1]);
      },
      selectConnector(){
        let _url = '/flowform/index.html#/selectConnector/'+this.form.operate_id+'/0/0/1';
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
          if(this.form.sc_type == 1 && !this.form.sc_name){
            return EcoMessageBox.alert('请输入弹框名称！','提示');
          }
          (this.listData).forEach((element)=>{
              element.valAttr = 0;
          })

          if(this.valAttr === 0 || this.valAttr > 0){
            try{
                this.listData[this.valAttr].valAttr = 1;
            }catch(e){}
          }

          this.form.sc_mapping = JSON.stringify( this.listData);
          this.form.sc_search = JSON.stringify(this.searchDataList);

          this.loading = true;

          saveSceneInfo(this.form).then((response) => {
                this.loading = false;
                let doObj = {}
                doObj.action = 'sceneSetting';
                doObj.data = {
                    scId:response.data.remap.perform_sc.scId,
                    refId:this.form.ref_id
                };
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);

          });

      },
     addSearchFormItem(){
         let obj = {
             dataId:"",
             titleName:"",
             defaultVal:"",
             scOrder:this.searchDataList.length+1,
             scVisible:1
         }
         this.searchDataList.push(obj)
     },
     deleteSearchFormItem(index){
       this.searchDataList.splice(index,1);
     }

  },
  watch: {

  }
}
</script>
<style scoped>
.sceneSetting{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
.container{
    padding: 20px 12px 10px;
}
.sceneSetting .btn{
  text-align: right;
  margin:20px 10px;
}
.sceneSetting .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}
.icon-act {
    color: #1ba5fa;
    margin-right: 8px;
    margin-left: 15px;
    position: relative;
    top: 2px;
}
.btn_line{
      display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #fff;
    border: 1px dashed #409eff;
    border-radius: 2px;
    color: #1ba5fa;
    height: 32px;
    font-size:14px;
    cursor: pointer;
    margin-top: 10px;
}
.deleteIcon{
    height: 32px;
    line-height: 32px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 28px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 1px;
    cursor: pointer;
}
</style>
