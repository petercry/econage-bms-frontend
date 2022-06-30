<template>
    <div class="alphaBotAttr">
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" v-show="currentItem.id" @click="save" type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName">
            <el-tab-pane :label="currentItem.name?title+'·'+currentItem.name:title" name="first">
              <div v-if="!currentItem.id">


                <div class="alphabot-list-container">
                    <div class="wrap">
                        <label v-text="'自定义 ('+botData.customer.length+')'"></label>
                        <div style="margin-bottom:20px;">
                            <span>
                                选择Agent
                            </span>
                            <el-select placeholder="请选择Agent" v-model="form.performer_agent"  @change="agentChange" style="margin-right:10px;width:250px;" >
                                <el-option
                                    :key="index"
                                    v-for="(item,index) in agentOp"
                                    :label="item.desc"
                                    :value="item.identification">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="item-container">
                            <div class="item" @click="editItem(item)" v-for="(item,index) in botData.customer" :key="index">
                                <div class="item-icon red">
                                    <i class="iconfont icon" v-bind:class="item.icon"></i>
                                </div>
                                <p class="item-desc" v-text="item.name+'('+item.connectorNum+')'"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="alphabot-list-container">
                    <div class="wrap">
                        <label v-text="'标准 ('+botData.stander.length+')'"></label>
                        <div class="item-container">
                            <div class="item"  @click="editItem(item)"  v-for="(item,index) in botData.stander" :key="index">
                                <div class="item-icon red">
                                    <i class="iconfont icon" v-bind:class="item.icon"></i>
                                </div>
                                <p class="item-desc" v-text="item.name"></p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
              <el-form ref="taskModelForm" v-if="currentItem.id" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="form">
                  <el-form-item  class="formItem" size="medium" prop="taskName">
                      <span style="color: #262626;" slot="label">环节名称
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-input v-model="form.taskName"></el-input>
                  </el-form-item>
                   <el-form-item  class="formItem" label="接口标签" size="medium">
                      <div class="item-container">
                          <div class="edit-item">
                               <div class="item-icon orange">
                                    <i class="iconfont icon" v-bind:class="currentItem.icon"></i>
                                </div>
                                <p class="item-desc" v-text="currentItem.name"></p>
                                <el-button style="margin-left:16px;" type="text" @click="changeItem" >修改</el-button>
                          </div>
                      </div>
                   </el-form-item>
                    <el-form-item  class="formItem" l size="medium">
                      <span style="color: #262626;" slot="label">执行方式
                        <el-tooltip class="item" effect="dark" content="Alphabot有两种执行方式:1)自动流转,本接口调用完成就继续流转;2)挂起,需要调用API驱动流程;" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-radio-group v-model="form.dosuspend">
                          <el-radio :label="0">自动流转</el-radio>
                          <el-radio :label="1" >挂起</el-radio>
                      </el-radio-group>
                   </el-form-item>
                  <el-form-item  class="formItem" v-if="currentItem.id !='1'" label="接口选择" size="medium">
                        <el-button size="medium" class="plainBtn" @click="selectConnector" v-if=" connectorObj.refId == 0">选择执行器</el-button>
                        <div v-if=" connectorObj.refId > 0">
                            <span>{{connectorObj.refName}}</span> <el-button size="medium" type="text" @click="selectConnector">切换</el-button>
                        </div>
                  </el-form-item>
                  <el-form-item  class="formItem" v-if="currentItem.id !='1' && connectorObj.refId > 0" label="赋值参数配置" size="medium">
                        <el-table
                            size="medium"
                            class="list"
                            :data="form.listData"
                            style="width: 100%;">
                            <el-table-column
                                prop="paramName"
                                label="赋值参数"
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
                                >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' ">
                                        <el-cascader
                                        style="width:220px;"
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

                            <el-table-column
                                prop="name"
                                label="主键"
                                width="80"
                                >
                                <template slot-scope="scope">
                                    <el-radio v-if="scope.row.paramValType !='JSON_OBJECT' && scope.row.paramValType !='JSON_ARRAY' " v-model="valAttr" :label="scope.$index">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                        </el-table>
                  </el-form-item>
                  <el-form-item  class="formItem" v-if="currentItem.id=='1'" label="印章设置" size="small">
                      <div style="height: 50px;line-height: 50px;">
                            <el-select placeholder="请选择类型" style="width:130px;margin-right:10px;font-size: 14px;" v-model="form.relAssignee">
                                <el-option
                                    :key="index"
                                    v-for="(item,index) in typeList"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-show="form.relAssignee!=3" placeholder="请选择部门" style="width:130px;margin-right:10px;" v-model="form.relOrgLevel">
                                <el-option
                                    :key="index"
                                    v-for="(item,index) in directionData.system_orglevel"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select  v-show="form.relAssignee!=3 " placeholder="请选择印章类型" style="width:150px;" v-model="form.sealCat">
                                <el-option
                                    :key="index"
                                    v-for="(item,index) in directionData.seal_cats"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <tag-select v-show="form.relAssignee==3" placeholder="点击选择机构" style="width:185px;margin-right:10px;" :type="'org'" :data="form.selOrgName" @callBack="tagSelectCB($event)" :idType=0></tag-select>
                            <div class="el-customDiv"   style="width:185px;cursor: pointer;"  @click="selectSignature" v-show="form.relAssignee==3">
                                <div class="selectDiv">
                                    <span v-show="tags.length==0" class="placeholder">点击选择签章</span>
                                <el-tag
                                    v-for="(tag,index) in tags"
                                    :key="tag.name"
                                    closable
                                    size="mini"
                                    class="ellipsis"
                                    @close="removeTag($event,index)"
                                    :type="tag.type">
                                    {{tag.name}}
                                </el-tag>
                                </div>
                                <i class="iconfont icon iconseal"></i>
                            </div>
                            <el-image
                                v-show="form.relAssignee==3 && form.smallSrc"
                                style="width: 50px;height:50px;vertical-align: middle;margin-left:10px"
                                :src="form.smallSrc"
                                :zIndex=2910
                                >
                                    <div slot="placeholder" class="image-slot">
                                        加载中<span class="dot">...</span>
                                    </div>
                                </el-image>
                        </div>
                  </el-form-item>
                  <el-form-item  class="formItem" v-if="currentItem.id=='1'" label="签章位置" size="medium">
                      <el-select style="width:100%;" placeholder="请选择" v-model="form.posItem">
                            <el-option
                                :key="index"
                                v-for="(item,index) in directionData.seal_items"
                                :label="item.titleName"
                                :value="item.itemId">
                            </el-option>
                      </el-select>
                  </el-form-item>
              </el-form>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>
<script>
import dirctionOption from './dirctionOption.vue'
import {updateAlphaTaskModel,loadSceneInfo,getConnectorTypeList,saveSceneInfo,getAgentList} from '../../../service/service.js'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import tagSelect from './tagSelect.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default{
  name:'alphaBotAttr',
  data(){
    return {
        activeName:"first",
        title:"AlphaBot",
        typeList:[
        {
          name:"发起人所在",
          value:1
        },
        {
          name:"环节办理人",
          value:2
        },
        {
          name:"选择机构",
          value:3
        }
      ],
        currentItem:{
          id:"",
          name:"",
          icon:""
        },
        botData:{
          stander:[{
              id:"1",
              name:"签章",
              icon:"iconabt_0_1",
          },{
              id:"9",
              name:"内部模块",
              desc:"inner",
              icon:"iconabt_inner",
          }],
          customer:[{
              id:"2",
              name:"SAP",
              catName:"SAP",
              icon:"iconabt_1_0",
              connectorNum:0
          },
          {
              id:"3",
              name:"WSDL",
              catName:"WEBSERVICE",
              icon:"iconabt_2_0",
              connectorNum:0
          },
          {
              id:"4",
              name:"rest",
              catName:"REST",
              icon:"iconabt_4_0",
              connectorNum:0

          },
          {
              id:"5",
              name:"smtp",
              catName:"SMTP",
              icon:"iconabt_5_0",
              connectorNum:0
          },
          {
              id:"6",
              name:"Oracle",
              catName:"ORACLE",
              icon:"iconabt_3_1",
              connectorNum:0,
          },
          {
              id:"7",
              name:"Mysql",
              catName:"MYSQL",
              icon:"iconabt_3_2",
              connectorNum:0,
          },
          {
              id:"8",
              name:"SqlServer",
              catName:"SQL_SERVER",
              icon:"iconabt_3_3",
              connectorNum:0,
          }],
        },
        rules: {
          taskName: [
            { required: true,  trigger: 'blur' },
            { max: 50, trigger: 'blur' }
          ],
        },
        form:{
            taskName:"",
            pf_type:"",
            relAssignee:1,
            relOrgLevel:"",
            sealCat:"",
            sealId:"",
            selOrgId:"",
            selOrgName:"",
            posItem:"",
            sealName:"",
            smallSrc:"",
            performer_agent:"",
            listData:[],
            dosuspend:0,
        },
        isEdit:false,
        tags:[],
        connectorList:[],
        apiList:[],
        connectorObj:{
           refId:0,
           refName:""
        },
        agentOp:[],
        modelData:{},
        valAttr:"",
    }
  },
  components:{
    dirctionOption,
    tagSelect
  },
   props:{
        dialogVisible: {
            type: Boolean
        }
    },
  created(){

  },
  mounted(){
        this.getAgentList();
        this.init();


        this.bindAction();
        // this.getConnectorTypeList();
  },
  computed:{
     ...mapState([
        'directionData',
        'operate_id'
    ]),
  },
  methods: {
      init(){

        if(!this.directionData.task_model.performer){
            this.form.sealCat = this.directionData.hasOwnProperty("seal_cats") &&  this.directionData.seal_cats.length>0?this.directionData.seal_cats[0].id:"";
            this.form.relOrgLevel = this.directionData.system_orglevel.length>0?this.directionData.system_orglevel[0].id:"";
        }else{
            if(this.directionData.task_model.performerType == 1){
                this.form = this.directionData.task_model.performer;
            }
        }
        this.$set(this.form,"taskName",this.directionData.task_model.taskName);
        this.form.modelType = this.directionData.task_model.modelType;
        this.form.taskLevel = this.directionData.task_model.taskLevel;
        this.form.taskId = this.directionData.task_model.taskId;
        this.form.pf_type =  this.directionData.task_model.performerType? this.directionData.task_model.performerType : 1;
        if(this.directionData.task_model.hasOwnProperty("performer_agent")){
            this.form.performer_agent = this.directionData.task_model.performer_agent;
        }
        if(this.directionData.task_model.performerType == 1){
            this.currentItem = this.botData.stander[0];
        }
        this.form.dosuspend = this.directionData.task_model.dosuspend || 0;
        if(this.form.sealId){
            let obj = {
                name:this.form.sealName,
                type:""
            }
            this.tags.push(obj);
        }
        if(this.form.relAssignee == 3){
            this.form.sealCat = this.directionData.seal_cats.length>0?this.directionData.seal_cats[0].id:"";
            this.form.relOrgLevel = this.directionData.system_orglevel.length>0?this.directionData.system_orglevel[0].id:"";
        }
        //连接器
        if(this.directionData.task_model.sc_id){
            this.form.scId = this.directionData.task_model.sc_id;
        }
        if(this.directionData.task_model.performerType > 1){
            if(this.directionData.task_model.performerType == 9){
                this.currentItem = this.botData.stander[1];
            }else{
                this.currentItem = this.botData.customer[this.directionData.task_model.performerType-2];
            }
            this.connectorObj = this.directionData.ref_entity?this.directionData.ref_entity:this.connectorObj;
            this.form.listData =  this.directionData.scene_mapping;
            if(this.form.listData && this.form.listData.length > 0){
                this.form.listData.forEach((item,index)=>{
                    if(item.targetParent){
                        this.$set(item,"targetParent_temp",item.targetParent.split(','));
                    }
                    if(item.valAttr == 1){
                        this.valAttr = index;
                    }
                })
            }

            this.modelData = this.directionData.form_item;
        }
      },
       bindAction(){
            let that = this;
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'selectSignature'){
                    that.tags = [];
                    that.form.smallSrc = "";
                    that.tags.push(obj.data);
                    that.form.sealId = obj.data.id;
                    that.form.sealName = obj.data.name;
                    that.form.smallSrc = obj.data.smallSrc;

                }
                if(obj && obj.action == 'selectConnector'){
                    that.connectorObj = obj.data;
                    that.loadSceneInfo();
                }
            }

            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'signatureAlphaBot');
      },
    getConnectorTypeList(){
        getConnectorTypeList(this.form.performer_agent).then((response)=>{
             if(response.data.status < 100){
                 let connector_type_list = response.data.remap.connector_type_list;
                 connector_type_list.forEach((element,index) => {
                      if(element.identification == "REST"){
                          this.botData.customer[2].connectorNum = element.connectorNum;
                      }else if(element.identification == "ORACLE"){
                          this.botData.customer[4].connectorNum = element.connectorNum;
                      }else if(element.identification == "MYSQL"){
                          this.botData.customer[5].connectorNum = element.connectorNum;
                      }else if(element.identification == "WEBSERVICE"){
                          this.botData.customer[1].connectorNum = element.connectorNum;
                      }else if(element.identification == "SAP"){
                          this.botData.customer[0].connectorNum = element.connectorNum;
                      }else if(element.identification == "SMTP"){
                          this.botData.customer[3].connectorNum = element.connectorNum;
                      }else if(element.identification == "SQL_SERVER"){
                          this.botData.customer[6].connectorNum = element.connectorNum;
                      }

                });
             }
        }).catch((error)=>{

        })
      },
      loadSceneInfo(){
          let data = {
              operate_id:this.operate_id,
              ref_id:this.connectorObj.refId,
          }

          loadSceneInfo(data).then((response)=>{
              if(response.data.status <100){
                  this.form.listData = response.data.remap.scene_mapping;
                  this.modelData = response.data.remap.form_item;
              }
          })
      },
      selectSignature(){
            if(!this.form.selOrgId && this.form.relAssignee == 3){
              this.$notify.error({
                title: '错误',
                message: '请选择机构'
                });
              return;
            }
            let _width = '1000';
            let _height = '500';
            let url = '/flowform/index.html#/selectSignature/'+this.form.selOrgId;
            EcoUtil.getSysvm().openDialog('选择印章',url,_width,_height,'15vh');
      },
      tagSelectCB(){
          this.form.selOrgId = arguments[0].id;
          this.form.selOrgName = arguments[0].name;
          if(!this.form.selOrgId){
              this.tags = [];
              this.form.sealId = "";
              this.form.sealName = "";
              this.form.smallSrc = "";
          }
      },
      removeTag(e,index){
          e.stopPropagation();
          this.tags.splice(index, 1);
          this.form.sealId = "";
          this.form.sealName = "";
          this.form.smallSrc = "";
      },
      hideDialog(){
        //   this.$emit('update:dialogVisible', false);
        this.$emit('hideDialog');
      },
      getAgentList(){
          getAgentList().then((response)=>{
             if(response.data.status < 100){
                this.agentOp = response.data.remap.agentList;
             }
          }).catch((error)=>{

            })
      },
      agentChange(){
          this.getConnectorTypeList();
      },
      editItem(item){
         if(!this.form.performer_agent && item.id != 1 && item.id != 9){
            this.$notify.error({
              title: '错误',
              message: '请先选择Agent'
            });
            return;
         }
         if(item.connectorNum <=0){
             this.$notify.error({
              title: '错误',
              message: '此类型下暂未定义任何连接器'
            });
            return;
         }
         this.currentItem = item;
         this.form.pf_type = item.id;
         if(this.form.pf_type == 1 && this.directionData.task_model.performerType > 1 ){
            this.form.sealCat = this.directionData.hasOwnProperty("seal_cats") &&  this.directionData.seal_cats.length>0?this.directionData.seal_cats[0].id:"";
            this.form.relOrgLevel = this.directionData.system_orglevel.length>0?this.directionData.system_orglevel[0].id:"";
         }
      },
      save(){

        let valid = true;
        this.$refs['taskModelForm'].validate((result) => {
          valid = result;
        });
        if( this.form.pf_type == 1 && !this.form.selOrgId && this.form.relAssignee == 3){
            valid = false;
            this.$notify.error({
              title: '错误',
              message: '请选择机构'
            });
            return;
        }
        if( this.form.pf_type == 1 && !this.form.sealId && this.form.relAssignee == 3){
            valid = false;
            this.$notify.error({
              title: '错误',
              message: '请选择签章'
            });
            return;
        }
        if( this.form.pf_type >1 && this.connectorObj.refId<=0){
            valid = false;
            this.$notify.error({
              title: '错误',
              message: '请选择执行器'
            });
            return;
        }
        if(!valid) return;
        this.isEdit = false;
        this.form.operate_id = this.operate_id;
        if(this.form.relAssignee == 3){
            this.form.sealCat = "";
            this.form.relOrgLevel = "";
        }else{
            this.form.sealId = "";
            this.form.sealName = "";
            this.form.selOrgName = "";
            this.form.selOrgId = "";
            this.form.smallSrc = "";
        }
        this.$emit('saveLoading');
        if(this.form.pf_type == 1){
            this.form.scId = "";
            this.updateAlphaTaskModel();
        }else{
            this.saveSceneInfo();
        }
       },
       updateAlphaTaskModel(){
           updateAlphaTaskModel(this.form).then((response) => {
                this.$emit('closeSaveLoading');
                if(response.data.status <100){
                    this.$emit('closeSaveLoading',this.form.taskName,this.getWorkFlowImg());

                    this.$message({
                        showClose: true,
                        duration:2000,
                        customClass:'design-from-el-message',
                        message: '保存成功',
                        type: 'success'
                    });
                }
            }).catch((error) => {
                this.$emit('closeSaveLoading');
            });
       },
       getWorkFlowImg(){
           let style = "image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/afbot.svg;";
           if(this.form.pf_type >=1){
               style = "image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/abt_"+this.form.pf_type +".svg;";
           }
           return style;
       },
       saveSceneInfo(){
           if(this.valAttr === 0 || this.valAttr > 0){
               this.form.listData[this.valAttr].valAttr = 1;
           }
           let data = {
               operate_id:this.operate_id,
               ref_id:this.connectorObj.refId,
               sc_type:3,
               sc_select:0,
               is_preload:0,
               sc_mapping:JSON.stringify( this.form.listData)
           }
           if(this.form.scId!=0){
               data.sc_id = this.form.scId;
           }
           saveSceneInfo(data).then((response) => {
                if(response.data.status <100){
                    if(response.data.remap.hasOwnProperty("perform_sc")){
                        this.form.scId = response.data.remap.perform_sc.scId;
                    }
                    //初始化印章信息
                    this.form.relAssignee = 1;
                    this.form.relOrgLevel = "" ;
                    this.form.sealCat = "";
                    this.form.sealId = "";
                    this.form.selOrgId = "";
                    this.form.selOrgName = "";
                    this.form.posItem = "";
                    this.form.sealName = "";
                    this.form.smallSrc= "";
                    this.updateAlphaTaskModel();
                }
            }).catch((error) => {
                this.$emit('closeSaveLoading');
            });
       },
     modelSelect(item,index){
        this.$set(item,'targetParent',item.targetParent_temp.join(','));
        this.$set(item,'targetItem',item.targetParent_temp[item.targetParent_temp.length - 1]);
     },
     selectConnector(){
        let _url = '/flowform/index.html#/selectConnector/'+this.operate_id+'/'+this.currentItem.name+"/"+this.form.performer_agent+"/1_"+this.connectorObj.refId;
        if(this.currentItem.id == '9'){
            _url = '/flowform/index.html#/selectConnector/'+this.operate_id+"/INNER/"+this.form.performer_agent+"/1_"+this.connectorObj.refId;
        }
        console.log(_url)
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
     },
     changeItem(){
           var that  = this;
           let confirmYesFunc = function(){
                that.currentItem = {
                    id:"",
                    name:"",
                    icon:""
                }
                that.connectorObj = {
                    refId:0,
                    refName:""
                }
                that.valAttr = "";
                
                that.getConnectorTypeList();
           }
          let options = {
                type: 'warning',
                lockScroll:false
           }
          EcoMessageBox.confirm('确定要切换接口标签吗?','提示',options,confirmYesFunc);
     }
  },
  watch: {

  }
}
</script>
<style scoped>
.alphaBotAttr{
    height: 100%;
}
.alphaBotAttr .formItem,.alphaBotAttr .multipleformItem{
    padding: 10px 24px 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    margin: 0px;
}
.alphaBotAttr .btngroup{
    position: absolute;
    right: 24px;
    height: 60px;
    line-height: 60px;
    z-index: 888;
}
.alphaBotAttr .alphabot-list-container{
    padding: 10px 24px;
}
.alphaBotAttr .alphabot-list-container .wrap{
    margin-bottom: 8px;
}
.alphaBotAttr .alphabot-list-container .wrap label{
    line-height: 32px;
    font-size: 15px;
    color: #262626;
    font-weight: bold;
    position: relative;
    margin-bottom: 8px;
    display: block;
}
.item-container{
    background-color: #fafafa;
    border: 1px solid #e8e8e8;
}
.wrap .item-container .item{
    display: inline-block;
    cursor: pointer;
    text-align: center;
    padding: 24px;
}
.item-container .item .item-icon {
    transition: box-shadow .1s ease-in-out;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
}
.item-container .item-icon .icon{
    color: #ffffff;
    font-size: 44px;
}
.alphaBotAttr .red{
   background-color: #e03a3a;
}
.alphaBotAttr .orange{
   background-color: #fa8e1b;
}
.item-container .item .item-desc{
    font-size: 14px;
    color: #595959;
    max-width: 86px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.item-container .edit-item{
    display: flex;
    align-items: center;
    text-align: center;
    padding: 8px 16px;
}
.item-container .edit-item  .item-icon{
    transition: box-shadow .1s ease-in-out;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.item-container .edit-item .item-desc{
    font-size: 14px;
    color: #595959;
    max-width: 56px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 8px;
}
.alphaBotAttr .el-customDiv .selectDiv{
    padding-right: 28px;
    display: inline-block;
}
.alphaBotAttr .el-customDiv .el-tag--mini{
    height: 22px;
    padding: 0 3px;
    line-height: 22px;
    margin-right: 3px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fafafa;
    border-color:#e8e8e8;
    max-width: 110px;
    position: relative;
    padding-right: 15px;
    top: 5px;
}
.alphaBotAttr .el-customDiv .iconfont{
    position: absolute;
    color: #1ba5fa;
    right: 8px;
    top: 6px;
    font-size: 20px;
    line-height: 20px;
    cursor: unset;
}
.alphaBotAttr .selectDiv .placeholder{
    margin-left: 10px;
    font-size: 13px;
    display: inline-block;
    position: absolute;
    top: 0px;
}
.alphaBotAttr .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}
.qiehuan{
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
.icon-act {
    color: #1ba5fa;
    margin-right: 8px;
    margin-left: 15px;
    position: relative;
    top: 2px;
}
</style>
