<template>
    <div class="sceneSetting">
        <el-form  v-loading="loading" :model="form" ref="form" label-position="top" :show-message="false" class="container" label-width="100px">
            <el-form-item>
                <div slot="label">
                    <label>{{name}} </label>
                    <el-button size="medium" type="text" @click="selectConnector"> 切换</el-button>
                </div>
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
                        width="300"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope">
                            <i class="iconfont icon-act iconhandright" v-if="scope.row.paramPath"></i>
                            {{scope.row.paramName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="表单字段"
                        width="300"
                        >
                        <template slot-scope="scope">
                            <div v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' ">
                                <el-cascader
                                style="width:170px;"
                                v-model="scope.row.targetParent_temp"
                                @change="modelSelect(scope.row,scope.$index)"
                                :options="modelData"
                                :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"
                                clearable
                                >
                                <template slot-scope="{ node, data }">
                                <span>{{ data.optionName }}</span>
                                <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                </template>
                                </el-cascader>
                            </div>
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
                  this.listData.forEach((item,index)=>{
                        if(item.targetParent){
                            this.$set(item,"targetParent_temp",item.targetParent.split(','));
                        }
                        if(item.valAttr == 1){
                            this.valAttr = index;
                        }

                        item.extParam = item.extParam?JSON.parse(item.extParam):{};
                        if(!item.extParam.hasOwnProperty("width")){
                            this.$set(item.extParam,"width",'');
                        }
                  })
                  this.modelData = response.data.remap.form_item;
                  this.name = response.data.remap.ref_entity.refName;
                  this.form.sc_name = this.name;
                  if(response.data.remap.hasOwnProperty("sc_entity") && !flag){
                      let sc_entity = response.data.remap.sc_entity;
                      this.form.sc_type = sc_entity.scType;
                      this.form.sc_name = sc_entity.scName;
                      this.form.sc_select = sc_entity.scSelect;
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
        let _url = '/wh/jsp/version3/flowform/index.html#/selectConnector/'+this.form.operate_id+'/0/0/1';
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){

          this.listData.forEach(element => {
              element.extParam =  JSON.stringify(element.extParam);
          });
          this.form.sc_mapping = JSON.stringify(this.listData);
          this.loading = true;

          saveSceneInfo(this.form).then((response) => {
                this.loading = false;
                let doObj = {}
                doObj.action = 'cancelApiSetting';
                doObj.data = {
                    scId:response.data.remap.perform_sc.scId,
                    refId:this.form.ref_id,
                    name:this.name
                };
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);

          });

      },

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
