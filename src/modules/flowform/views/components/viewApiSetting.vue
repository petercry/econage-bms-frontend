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
                        label="显示名称"
                        key="1"
                        v-if="form.sc_type==1"
                        width="150"
                        >
                        <template slot-scope="scope">
                            <el-input type="text" v-model="scope.row.titleName"></el-input>
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
          sc_mapping:""
      },
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
       valAttr:""
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
                    that.form.sc_type = 1;
                    that.form.sc_select = 1;
                    that.form.is_preload = 1;
                    that.valAttr = "";
                    that.loadSceneInfo(true);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'viewApiSetting');
       },
        
        loadSceneInfo(flag){
          let data = {
              operate_id:this.form.operate_id,
              ref_id:this.form.ref_id
          }

          if(this.form.sc_id!=0 && !flag){
               data.sc_id = this.form.sc_id;
          }

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
                  })
                  this.modelData = response.data.remap.form_item;
                  this.name = response.data.remap.ref_entity.refName;
                  if(response.data.remap.hasOwnProperty("sc_entity")){
                      let sc_entity = response.data.remap.sc_entity;
                      this.form.sc_type = sc_entity.scType;
                      this.form.sc_select = sc_entity.scSelect;
                      this.form.is_preload = sc_entity.isPreload;
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
          if(this.valAttr === 0 || this.valAttr > 0){
               this.listData[this.valAttr].valAttr = 1;
          }
          this.form.sc_mapping = JSON.stringify( this.listData);
          this.loading = true;

          saveSceneInfo(this.form).then((response) => {
                this.loading = false;
                let doObj = {}
                doObj.action = 'viewApiSetting';
                doObj.data = {
                    scId:response.data.remap.perform_sc.scId,
                    refId:this.form.ref_id
                };
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
          
          });
          
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
</style>
