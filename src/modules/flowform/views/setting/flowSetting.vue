<template>
    <div class="setting">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <div class="page-header">
             <flowFormStep  :step="2" :title="flowName" @close="closeDialog" :checkSave="saveExtConfig">
                    <span slot="rightDiv">
                         <el-button size="medium" @click="saveExtConfig" type="primary">保存</el-button>
                    </span>
            </flowFormStep>
        </div>
        <div class="page-content">
            <div class="content"> 
                <el-form ref="form" :model="data" label-width="120px" label-position="left">
                    <el-form-item size="medium" label="打印模板">
                        <el-radio-group v-model="data.type">
                            <!-- <el-radio-button label="1" >系统默认</el-radio-button> -->
                            <el-radio-button label="2">自定义</el-radio-button>
                        </el-radio-group>
                        <div v-if="data.type == 2" class="printTemplateLine"> 
                            <div class="pt-item" @click="choseItem(item,index)" @dblclick="editItem(item,$event,'read')" @mouseenter="itemEnter(item)"  @mouseleave="item.showIcon = false" v-bind:class="chosePrintItems.indexOf(item.id)>-1?'active':''" v-for="(item,index) in printItems" :key="index">
                                <el-tooltip :disabled="!item.comments" class="item" effect="dark" placement="left">
                                    <div slot="content" >{{item.comments}}</div>
                                    <span  style="display:block;">{{item.setName}}</span>
                                 </el-tooltip>
                                 <div v-show="item.showIcon">
                                     <i class="icon iconfont iconshanchu1" @click="deleteItem(item,index,$event)"></i>
                                     <i class="icon iconfont iconbianji1" @click="editItem(item,$event,'edit')"></i>
                                 </div>
                            </div>
                            <div class="addPrintTemplate">
                                <el-button size="medium" type="text" @click="showPrintTemplateDialog" ><i class="iconfont icon iconicon-test"></i> 添加打印模板</el-button>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
         <el-dialog class="printTemplate" width="100%" top="0" :visible.sync="dymbDialogVisible" :before-close="dymbClose">
            <div slot="title" class="title">
                <span v-text="printSetId?'编辑':'添加'"></span>打印模板
            </div>
           
                <div class="dialog-body" v-loading="loading">
                     <el-scrollbar class="page-component__nav" style="height: 100%;">
                    <div class="subTitle">
                        打印模板设置
                        <div class="rightbox">
                            <el-input size="medium"  style="margin-right:15px;color: #000;width: 200px;" :disabled="true" :value="flowName"></el-input>
                            <el-button size="medium" type="danger" v-if="printSetId" @click="deleteItemByEdit">删除</el-button>
                            <el-button size="medium" type="primary" @click="printTemplateSave">保存</el-button>
                        </div>
                    </div>
                    <div class="items">
                        <label>打印模板名称 <span style="color: #f56c6c;">*</span></label>
                        <el-input style="width:50%;" :disabled="isRead" placeholder="请输入模版名称"  v-model="printForm.setName"></el-input>
                    </div>
                    <div class="items">
                        <label>备注</label>
                        <el-input type="textarea"  :disabled="isRead" style="width:50%;" :autosize="{ minRows: 2}" v-model="printForm.comments"></el-input>
                    </div>
                    <div class="items">
                        <label>模板上传 <span class="description">支持扩展名：.doc .docx</span></label>
                        <el-input :readonly="true" size="medium" placeholder="请选择文件" style="width:50%;"  v-model="printForm.fileName"></el-input>
                        <!-- <el-upload
                        ref="my-upload"
                        name="upfile"
                        :disabled="isRead" 
                        :action="'/api/wh/servlet/MainServletV3TestAjaxServlet?cmd=EccmFileManagerSingle&_method=create&set_token_flag=N&model=workflow'"
                        :show-file-list = false
                        :on-change="fileChange"
                        :before-upload="beforeFileUpload"
                        :on-success="fileOnSuccess" style="display:inline-block;">
                        <el-button size="medium" class="btn" plain><i class="iconfont icon iconshangchuanfujian"></i> 上传文件</el-button>
                        </el-upload> -->
                        <!-- <el-upload
                        ref="my-upload"
                        name="upfile"
                        :disabled="isRead" 
                        :action="'/wh/servlet/MainServer?cmd=EccmFileManagerSingle&_method=create&set_token_flag=N&model=workflow'"
                        :show-file-list = false
                        :on-change="fileChange"
                        :before-upload="beforeFileUpload"
                        :on-success="fileOnSuccess" style="display:inline-block;">
                        <el-button size="medium" class="btn" plain><i class="iconfont icon iconshangchuanfujian"></i> 上传文件</el-button>
                        </el-upload> -->
                       <eco-file-upload-btn :isRead="isRead" :modular="'workflow_print_temp'" :modularInnerId="reqId" @fileChange="fileChange" style="display:inline-block;" @beforeFileUpload="beforeFileUpload" @fileOnSuccess="fileOnSuccess"></eco-file-upload-btn>
                        <!-- <el-button size="medium" class="btn" plain><i class="iconfont icon iconshangchuanfujian"></i> 下载文件</el-button> -->
                    </div>
                    <div class="items">
                        <el-table
                            size="medium"
                            :data="printTagsData"
                            style="width: 100%;">
                            <el-table-column
                                prop="tItem"
                                label="书签名"
                                >
                            </el-table-column>
                            <el-table-column
                                label="对应数据"
                            >
                            <template slot-scope="scope" >
                                <el-cascader
                                    size="medium" 
                                    style="width:220px;"
                                    clearable
                                    :disabled="isRead" 
                                    v-model="scope.row.parent_temp"
                                    :options="model_options"
                                    @change="modelSelect(scope)"
                                    :ref="'modelOptions'+scope.$index"
                                    :props="{ disabled:'disabled1', label:'optionName',leaf:'1',value:'optionId',children:'deriveItems'}"
                                    
                                    >
                                    <template slot-scope="{ node, data }">
                                    <span>{{ data.optionName }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                    </template>
                                </el-cascader>
                            </template>
                            </el-table-column>
                        </el-table>
                    </div>
                      </el-scrollbar>
                </div>
            
         </el-dialog>
    </div>
</template>
<script>
import flowFormStep from "../../views/components/flowFormStep.vue";
import {Loading } from 'element-ui';
import {EcoUtil} from '@/components/util/main.js'
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import {getApplyUpdateWFModel,resolvePrintTemplate,savePrintTemplate,getPrintSetList,getPrintSetInfo,deletePrintSet,saveWfExtConfig} from '../../service/service.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {mapState,mapMutations} from 'vuex'
export default{
  data(){
    return {
       operate_id:"",
       flowName:"",
       dymbDialogVisible:false,
       data:{
           type:2,
       },
       tagsItem:[],
       printForm:{
           setName:"",
           comments:"",
           dataMap:""
       },
       isRead:false,
       loading:false,
       reqId:"",
       printTagsData:[],
       printItems:[],
       fileHeaderId:"",
       model_options:[],
       mpId:"",
       printSetId:"",
       chosePrintItems:[],
       activeClass:-1,
       loadingInstance:"",
       noItems:false,
    }
  },
  components: {
    ecoFileUploadBtn,
    ecoLoading,
    flowFormStep
  },
  created(){
    this.reqId = this.$route.params.templateId;
  },
  beforeDestroy() {
     
  },
  mounted(){
    this.getApplyUpdateWFModelFunc();
  },
  computed:{

  },
  methods: {
      getApplyUpdateWFModelFunc(){
           this.$refs.ecoLoadingRef.open();
           getApplyUpdateWFModel(this.$route.params.templateId).then((response) => {
              
              if(response.data.status <100){
                  this.operate_id = response.data.operate_id;
                  this.flowName = response.data.remap.workflow_model.name;
                  this.getPrintSetListFunc();
              }
          }).catch((error) => {
              this.$refs.ecoLoadingRef.close();
          });
      },
      getPrintSetListFunc(flag){
            getPrintSetList(this.reqId).then((response) => {
                 this.loading = false;
                this.$refs.ecoLoadingRef.close();
                this.dymbDialogVisible = false;
                if(this.loadingInstance){
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                }
                if(response.data.status <100){
                    this.printItems = response.data.remap.set_list;
                    if(!flag){//删除 编辑的时候不执行
                        for(let i=0;i<this.printItems.length;i++){
                            let item = this.printItems[i];
                            if(item.isSelected == 1){
                                // this.activeClass = i;
                                if(this.chosePrintItems.indexOf(item.id) == -1){
                                    this.chosePrintItems.push(item.id);
                                }
                            }
                        }
                    }
                    if(flag=="add" && this.printItems.length == 1 && this.noItems){
                        this.chosePrintItems.push(this.printItems[0].id);
                        
                        this.noItems = false;
                    }
                    
                    
                }
            }).catch((error) => {
                this.loading = false;
                this.dymbDialogVisible = false;
                this.$refs.ecoLoadingRef.close();
                if(this.loadingInstance){
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                }
            });
      },
      copyDeep(templateData) {
          return JSON.parse(JSON.stringify(templateData));
      },
      closeDialog(){
          let _closeObj = {};
          _closeObj.clearIframe = true;
          _closeObj.tabClick = true;
          EcoUtil.getSysvm().closeFullScreen(_closeObj);

      },
      initPrintData(){
        this.printForm = {
            setName:this.flowName,
            comments:"",
            dataMap:""
        }
        this.printSetId = "";
        this.tagsItem = [];
        this.model_options = [];
        this.printTagsData = [];
        this.fileHeaderId = "";
        this.mapId = "";
      },
     showPrintTemplateDialog(){
        this.dymbDialogVisible = true;
        this.initPrintData();
    },
     dymbClose(){
          this.$confirm('确定关闭吗？')
          .then(_ => {
            this.dymbDialogVisible = false;
            
          })
          .catch(_ => {});
     },
     fileChange(file, fileList){
          this.loading = true;
     },
     fileOnSuccess(response, file, fileList){
         

         this.printForm.fileName = response.name;
         this.fileHeaderId = response.id;
         if(response.id){
            resolvePrintTemplate(this.$route.params.templateId,this.fileHeaderId).then((response) => {
                this.loading = false;
                if(response.data.status <100){
                    this.printTagsData = response.data.remap.bookmarkList;
                    this.tagsItem = [];
                    this.model_options = response.data.remap.dataModelList;
                    this.mpId = response.data.remap.mpId;
                    this.printTagsData.forEach((element,index) => {
                        let obj = {
                            tCat:element.mdId,
                            tItem:element.optionId,
                            tType:element.mapType,
                            orderId:index+1,
                            mpId:response.data.remap.mpId,
                            fCat:"",
                            fType:"",
                            fParent:"",
                            fItem:""
                        }
                        this.$set(element,'parent_temp',new Array);
                        this.$set(element,'tItem',element.optionId);
                        this.model_options.forEach(item => {
                            item.deriveItems.forEach(single => {
                                if(single.optionName == element.optionName){
                                    let array = [];
                                    array.push(item.optionId);
                                    array.push(single.optionId);
                                    this.$set(obj,'fType',item.mapType);
                                    this.$set(obj,'fCat',item.optionId);
                                    this.$set(obj,'fParent',array.join(','));
                                    this.$set(obj,'fItem',single.optionId);
                                    this.$set(element,'parent_temp',array);
                                }
                            });
                        });
                       
                        this.tagsItem.push(obj);
                    });
                    
                    
                }
            }).catch((error) => {
                this.loading = false;
            });
         }
        
     },
     printTemplateSave(){
     
         if(!this.printForm.setName){
            this.$message({
              type: 'error',
              message: `请输入模板名称`,
              showClose: true,
              duration:2000,
              customClass:'design-from-el-message',
            });
            return;
         }
         if(!EcoUtil.filterSpecialCodeFix(this.printForm.setName)){
            this.$message({
              type: 'error',
              message: `模板名称不能含有特殊字符`,
              showClose: true,
              duration:2000,
              customClass:'design-from-el-message',
            });
            return;
         }
         if(!this.fileHeaderId){
            this.$message({
              type: 'error',
              message: `请上传打印模板文件`,
             showClose: true,
              duration:2000,
              customClass:'design-from-el-message',
            });
            return;
         }
         if(!this.checkName()) return;
         this.loading = true;
         this.printForm.reqId = this.$route.params.templateId;
         this.printForm.fileHeaderId = this.fileHeaderId;
         this.printForm.dataMap = JSON.stringify(this.tagsItem);
         this.printForm.bookmarkList = JSON.stringify(this.printTagsData);
         this.printForm.mapId = this.mpId;
         this.printForm.setId = this.printSetId;
         savePrintTemplate(this.printForm).then((response) => {
             this.loading = false;
             if(response.data.status< 100){
                this.loading = true;
                if(this.printItems.length == 0){
                    this.noItems = true;
                }
                if(this.printSetId){
                    this.getPrintSetListFunc('edit');
                }else{
                    this.getPrintSetListFunc('add');
                }
                
             }
         
         }).catch((error) => {
            this.loading = false;
         });
         
     },
     checkName(){
         try{
            this.printItems.forEach(element => {
                if(element.setName == this.printForm.setName && this.printSetId != element.id){
                    this.$message({
                        type: 'error',
                        message: `模板名称已存在，请重新输入`, 
                        showClose: true,
                        duration:2000,
                        customClass:'design-from-el-message',
                    });
                    foreach.break=new Error("StopIteration");  
                }
            });

         }catch(e){ 
             if(e.message==="foreach is not defined") {  
                return false;  
            }else return false;
         
         }
        return true;
     },
     beforeFileUpload(file){
        let fileExt = file.name.replace(/.+\./, "");       
        const isDoc = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === "application/msword" || ['doc','docx'].indexOf(fileExt.toLowerCase()) !== -1 ;
        if (!isDoc) {
            this.$message({
                type: 'error',
                message: `请上传.doc或者.docx格式的文件作为打印模板`, 
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
            });
          this.loading = false;
        }
        return isDoc;
     },
     choseItem(item,index){
        let ix = this.chosePrintItems.indexOf(item.id);
        if( ix > -1){ //选中
            this.chosePrintItems.splice(ix,1);
        }else{//没选中
             this.chosePrintItems.push(item.id);
        }
        // let classList = e.target.classList;
        // if(classList.value.indexOf('active') > -1 || e.target.parentNode.classList.value.indexOf('active')>-1){
        //     this.activeClass = -1;
        //     this.chosePrintItems = {};
        // }
        
        

     },
     modelSelect(item){
        let row = this.tagsItem[item.$index];
        row.fCat = item.row.parent_temp[0];
        let model = 'modelOptions'+item.$index; 
        if(this.$refs[model].getCheckedNodes().length>0){
            let node = this.$refs[model].getCheckedNodes()[0].data;
            row.fType = node.mapType;
        }else{
            row.fType = "";
        }
        this.$set(row,'fParent',item.row.parent_temp.join(','));
        this.$set(row,'fItem',item.row.parent_temp[item.row.parent_temp.length-1]);
     },
     itemEnter(item){
         this.$set(item,'showIcon',true);
     },
     deleteItemByEdit(){
         this.$confirm('确定删除吗？')
          .then(_ => {
               this.dymbDialogVisible = false;;
                this.loadingInstance = Loading.service({ fullscreen: true,text:"删除中...."});
                deletePrintSet(this.printSetId).then((response) => {
                    if(response.data.status < 100){
                        let ix = this.chosePrintItems.indexOf(this.printSetId);
                        if(ix>-1){
                            this.chosePrintItems.splice(ix,1);
                        }
                        this.getPrintSetListFunc('delete');
                    }
                   
                }).catch((error) => {
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                });
          })
          .catch(_ => {});
       
     },
     deleteItem(item,index,e){
         e.stopPropagation();
        this.$confirm('确定删除吗？')
        .then(_ => {
            e.stopPropagation();
            
            let loadingInstance = Loading.service({ fullscreen: true,text:"删除中...."});
            deletePrintSet(item.id).then((response) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
                if(response.data.status < 100){
                    let ix = this.chosePrintItems.indexOf(item.id);
                    if(ix>-1){
                        this.chosePrintItems.splice(ix,1);
                    }
                    this.printItems.splice(index,1);
                    // if(index == this.activeClass){
                    //     this.activeClass = -1;
                    // }else if(index < this.activeClass){
                    //     this.activeClass = this.activeClass-1;
                    // }
                }
            }).catch((error) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
            });
        })
          .catch(_ => {});   
     },
     editItem(item,e,type){
        e.stopPropagation();
        this.initPrintData();
        if(type=="read"){
            this.isRead = true;
        }else{
            this.isRead = false;
        }
        this.dymbDialogVisible = true;
        this.loading = true;
        this.printSetId = item.id;
        
        getPrintSetInfo(this.reqId,item.id).then((response) => {
            this.loading = false;
            if(response.data.status < 100){
                let remap = response.data.remap;
                this.printForm = {
                    setName:remap.setName,
                    comments:remap.comments,
                    fileName:remap.fileName,
                }
                this.printTagsData = JSON.parse(remap.bookmarkList);
                if(remap.dataMapItem && remap.dataMapItem.length > 0){
                    
                    this.tagsItem =  remap.dataMapItem;
                }
                this.model_options = remap.dataModelList;
                this.fileHeaderId = remap.fileHeaderId;
                this.mpId = remap.mapId;
              
                
            }
         }).catch((error) => {
            this.loading = false;
         });
     },
     saveExtConfig(){
        let saveloadingInstance = Loading.service({ fullscreen: true,text:"保存中...."});
        let ids = this.chosePrintItems.join('####');
        saveWfExtConfig(this.reqId,ids).then((response) => {
           this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                saveloadingInstance.close();
            });
            if(response.data.status<100){
                this.$message({
                    showClose: true,
                    duration:2000,
                    message: '保存成功',
                    customClass:'design-from-el-message',
                    type: 'success'
                }); 
            }
        }).catch((error) => {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                saveloadingInstance.close();
            });
        });
     }
   
  },
  watch: {
     
  }
}
</script>
<style scoped>
  .page-header{
      position: absolute;
      left:0;
      right:0;
      top:0;
      height:55px;
      vertical-align: middle;
      background-color: #fff;
  }

.page-content{
    position: absolute;
    left:0px;
    top:65px;
    bottom:0px;
    right:0px;
    background-color: #f5f5f5;
    overflow:auto;
}

.page-content .content{
    padding: 40px 40px;
    background-color: #ffffff;
    width: 520px;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 14px;
    position: relative;
}
.content .printTemplateLine{
    margin-top:15px;
}
.content .printTemplateLine .addPrintTemplate{
    cursor: pointer;
    display: inline-block;
    border: 1px dashed #e8e8e8;
    border-radius: 2px;
    padding: 0 8px;
}
.content .el-button--text{
    font-weight: normal;
}
.content .pt-item{
    cursor: pointer;
    border: 1px solid #e8e8e8;
    color: #595959;
    height: 38px;
    line-height: 38px;
    border-radius: 2px;
    margin: 0 10px 10px 0;
    display: inline-block;
    padding: 0 8px;
    position: relative;
}
.content .pt-item.active{
    border-color: #409EFF;
    color: #409EFF;
}
.printTemplate .title{
    margin: 0;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
}
.printTemplate .rightbox{
    float: right;
}
.printTemplate .dialog-body{
    width: 1000px;
    margin: 0 auto;
    background: #fff;
    height: 100%;
}
.printTemplate .subTitle{
    height: 60px;
    line-height: 60px;
    padding: 0 12px;
    color: #000;
    font-weight: 500;
    font-size: 16px;
    border-bottom: 1px solid #e8e8e8;
}
.printTemplate .btn{
    background: #FFF;
    border-color: #409EFF;
    color: #409EFF;
    margin-left: 15px;
    padding: 9px 20px;
}
.printTemplate .items{
    padding: 0 12px;
    margin-top: 24px;
}
.printTemplate .items label{
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #262626;
    word-break: break-all;
}
.printTemplate .items label .description{
    color: #bebebe;
    font-size: 12px;
    margin-left: 20px;
}
.content .pt-item .iconshanchu1{
    position: absolute;
    top: -12px;
    right: -12px;
    /* height: 16px; */
    line-height: 16px;
    color: #F56C6C;
    z-index: 1000;
    font-size: 18px;
}
.content .pt-item .iconbianji1{
    position: absolute;
    bottom: -12px;
    right: -12px;
    line-height: 16px;
    font-size: 20px;
    color: #409EFF;
}
</style>
