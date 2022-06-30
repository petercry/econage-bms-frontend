<template>
    <div class="proBaseInfo">
            <div  class="toolbar">
                <el-button type="primary" @click="editFunc" v-show='initRole["PAGE_PROJECT_BASE"]["permission"]["EDIT"]'>编辑</el-button>
                <!-- <el-button type="primary" >同步</el-button> -->
                <el-button type="primary" @click='historyFunc' v-show='initRole.PAGE_PROJECT_BASE.permission.HISTORY'>历史记录</el-button>
            </div>

            <table class="mainTable" border="0" cellspacing="0">
                <tr>
                    <th>项目类别</th>
                    <td>{{getKVName(baseData['PRO_CATEGORY'],baseInfo.category)}}</td>
                    <th>所属平台</th>
                    <td>{{getKVName(baseData['PRO_PLATFORM'],baseInfo.platform)}}</td>
                </tr>

                <tr>
                    <th>项目编号</th>
                    <td>{{baseInfo.projectCode}}</td>
                    <th>项目名称</th>
                    <td>{{baseInfo.projectName}}</td>
                </tr>

                <tr>
                    <th>预计SOP时间</th>
                    <td>{{baseInfo.sopTime}}</td>
                    <th>预计EOP时间</th>
                    <td>{{baseInfo.eopTime}}</td>
                </tr>

                <tr>
                    <th>车型概述</th>
                    <td :colspan="3">
                        {{baseInfo.modelOverview}}
                    </td>
                </tr>
                <tr>
                    <th>基本参数</th>
                    <td :colspan="3">
                        {{baseInfo.basicParameter}}
                    </td>
                </tr>

                <tr>
                    <th>开发类型</th>
                    <td :colspan="3">
                        {{baseInfo.developmentType}}
                    </td>
                </tr>

                <tr>
                    <th>预计搭载动力类型</th>
                    <td :colspan="3">
                        <el-checkbox-group disabled v-model="baseInfo.powerTypeItems" >
                            <el-checkbox :label="item.id" v-for="(item,idx) in baseData['1117']" :key="idx" >
                                {{item.text}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>

                <tr>
                    <th>车辆类型</th>
                    <td :colspan="3">
                        <el-checkbox-group disabled v-model="baseInfo.carModelItems" >
                            <el-checkbox :label="item.id" v-for="(item,idx) in baseData['1116']" :key="idx" >
                                {{item.text}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>

                <tr>
                    <th>气体燃料专用</th>
                    <td :colspan="3">
                        <el-checkbox-group disabled v-model="baseInfo.gasFuelItems" >
                            <el-checkbox :label="item.id" v-for="(item,idx) in baseData['1119']" :key="idx" >
                                {{item.text}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>

                <tr>
                    <th>目标市场</th>
                    <td>{{baseInfo.targetMarket}}</td>
                    <th>商品目标</th>
                    <td>{{baseInfo.commodityTarget}}</td>
                </tr>

                <tr>
                    <th>排放水平/续驶里程</th>
                    <td>{{baseInfo.emissionLevel}}</td>
                    <th>外廓尺寸</th>
                    <td>{{baseInfo.outsideDimension}}</td>
                </tr>

                 <tr>
                    <th>车身型式(SUV,MPV,SEDAN)</th>
                    <td>{{baseInfo.bodyType}}</td>
                    <th>整备质量</th>
                    <td>{{baseInfo.curbQuality}}</td>
                </tr>

                 <tr>
                    <th>最大总质量</th>
                    <td>{{baseInfo.maxMass}}</td>
                    <th>乘坐人数</th>
                    <td>{{baseInfo.passengerNum}}</td>
                </tr>

                <tr>
                    <th>驾驶自动化</th>
                    <td>{{baseInfo.driveAutomation}}</td>
                    <th></th>
                    <td></td>
                </tr>

                 <tr>
                    <th>商品/平台/发动机预概念</th>
                    <td :colspan="3">
                        <div  class="viewAttachments">
                            <div class="fileTemplateDiv" >
                                <div class="fileItem" v-for="(item,idx) in fileMap['PRO_CONCEPT']" :key="item.id">
                                     <div>
                                         <span class="imgType">
                                                <img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;
                                        </span>
                                        <span style="cursor:pointer;">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                        <span class="download" @click="fileDownload(item)">下载</span>|<span class="preview" @click="filePreview(item)">预览</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>

                 <tr>
                    <th>规格配置表</th>
                    <td :colspan="3">
                       <div  class="viewAttachments">
                            <div class="fileTemplateDiv" >
                                <div class="fileItem" v-for="(item,idx) in fileMap['PRO_CONFIG']" :key="item.id">
                                     <div>
                                         <span class="imgType">
                                                <img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;
                                        </span>
                                        <span style="cursor:pointer;">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                        <span class="download" @click="fileDownload(item)">下载</span>|<span class="preview" @click="filePreview(item)">预览</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <th>整车构成（CPV）</th>
                    <td :colspan="3">
                        <div  class="viewAttachments">
                            <div class="fileTemplateDiv" >
                                <div class="fileItem" v-for="(item,idx) in fileMap['PRO_CPV']" :key="item.id">
                                     <div>
                                         <span class="imgType">
                                                <img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;
                                        </span>
                                        <span style="cursor:pointer;">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                        <span class="download" @click="fileDownload(item)">下载</span>|<span class="preview" @click="filePreview(item)">预览</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </td>
                </tr>

                 <tr>
                    <th>开发计划</th>
                    <td :colspan="3">
                        <div  class="viewAttachments">
                            <div class="fileTemplateDiv" >
                                <div class="fileItem" v-for="(item,idx) in fileMap['PRO_PLAN']" :key="item.id">
                                     <div>
                                         <span class="imgType">
                                                <img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;
                                        </span>
                                        <span style="cursor:pointer;">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                        <span class="download" @click="fileDownload(item)">下载</span>|<span class="preview" @click="filePreview(item)">预览</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </td>
                </tr>
            </table>

             
    </div>
    
</template>
<script>

import {getProBaseInfo,getFileListByModular} from '../../service/service'
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'
import {Loading } from 'element-ui';
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import { mapState,mapActions } from 'vuex';
import {EcoFile} from '@/components/file/main.js'
import {sysEnv} from '../../config/env.js'
 

  export default {
      components:{
          ecoContent,
          ecoFileUploadChunk
      },
      data(){
          return{
              baseInfo:{
                    id:null,
                    category:null, //项目类别
                    platform:null,//所属平台
                    projectCode:null,//项目编号
                    projectName:null,//项目名称
                    sopTime:null,//预计sop时间
                    eopTime:null,//预计sop时间
                    modelOverview:null,//车型概述
                    basicParameter:null,//基本参数
                    developmentType:null,//开发类型
                    targetMarket:null,//目标市场
                    commodityTarget:null,//商品目标
                    emissionLevel:null,//排放水平/续驶里程
                    outsideDimension:null,//外廓尺寸
                    bodyType:null,//车身型式
                    maxMass:null,//最大总质量
                    curbQuality:null,//整备质量
                    driveAutomation:null,//驾驶自动化
                    passengerNum:null,//乘坐人数
                    carModelItems:[],//适用车型
                    powerTypeItems:[],//动力类型
                    gasFuelItems:[]//气体燃料专用
                },

                fileMap:{
                    PRO_CONCEPT:[],
                    PRO_CONFIG:[],
                    PRO_CPV:[],
                    PRO_PLAN:[]
                },
               
          }
      },
      
      created(){
            this.baseInfo.id = this.$route.params.proId;
            this.getProBaseInfoFunc();
            this.getFileListFunc();
            window.proBaseInfoVm = this;
            this.addMonitor(); //添加监听
      },

      mounted(){
         
      },
      computed:{
            ...mapState(['baseData','typeImgList','initRole'])
      },
      methods: { 
        historyFunc(){
             this.$router.push({name:"proBaseInfoHistory",params:{proId:this.baseInfo.id}});
        },
        addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'editProBaseInfoCallBack')){ 
                    window.proBaseInfoVm.editCBFunc(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'proBaseInfoVm');
        },

        getProBaseInfoFunc(){
            getProBaseInfo(this.baseInfo.id).then((response)=>{
                for(let key in response.data){
                    this.baseInfo[key] = response.data[key];
                }
            })
        },

        getKVName(list,typeId){
            let _name = null;
            if(list && list.length > 0){
                for(let i = 0;i<list.length;i++){
                    if(list[i].id == typeId){
                        _name = list[i].text;
                        break;
                    }
                }
            }
            return _name;
        },

        getFileListFunc(){
            for(let key in this.fileMap){
                this.getFileListByModularFunc(key);
            }
        },

        getFileListByModularFunc(key){
            getFileListByModular(key,this.baseInfo.id).then((response)=>{
                    if(response.data){
                        (response.data).forEach((item)=>{
                            item.fileSize = EcoUtil.getFileSize(item.size);
                         })
                    }
                    this.fileMap[key] = response.data || [];
             })
        },

        fileDownload(item){
                EcoFile.openFileHeaderByDownload(item.id,item.name);
        },

        filePreview(item){
                EcoFile.openFileHeaderByView(item.id,item.name);
        },

        editFunc(){
            if(sysEnv == 1){
                let url = '/project/index.html#/editProjectBaseInfo/'+this.baseInfo.id;
                EcoUtil.getSysvm().openDialog('编辑项目',url,800,500,'12vh');
            }else{
                this.$router.push({name:'editProjectBaseInfo',params:{proId:this.baseInfo.id}})
            }
        },

        

        editCBFunc(data){
            // this.$router.push({name:'proBaseInfo',params:{proId:data.id}});
            this.getProBaseInfoFunc();
            this.getFileListFunc();  
        }
        
      },

        watch: {
            $route(){
                this.baseInfo.id = this.$route.params.proId;
                this.getProBaseInfoFunc();
                this.getFileListFunc();
            }
        },
  }
</script>

<style scoped>

.proBaseInfo{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}

.proBaseInfo .toolbar{
    width:900px;
    margin:auto;
    margin-top: 10px;
}

.proBaseInfo .mainTable{
    width:900px;
    margin:auto;
    margin-top:10px;
}

.proBaseInfo .mainTable th,.proBaseInfo .mainTable td{
    border:1px solid red;
    font-size: 14px;
    padding:10px;
}

.proBaseInfo .mainTable th{
    background: rgb(250,250,250);
    padding-left: 15px;
    width: 130px;
    border: 1px solid #e7e7e7;
    color: rgb(103,106,108)!important;
    position: relative;
}

.proBaseInfo .mainTable td{
    width:200px;
    background: #fff;
    padding-left: 15px;
    border: 1px solid #e7e7e7;
    word-break: break-all;
    color: #666;
}


.proBaseInfo .viewAttachments  .fileItem{
    color: #606266;
    margin-left:0px;
    line-height: 20px;
    margin-bottom:5px;
    margin-top:5px;
    font-size: 14px;
}

.proBaseInfo .viewAttachments .fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}

.proBaseInfo .viewAttachments .fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
}

.proBaseInfo .viewAttachments .fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.proBaseInfo .viewAttachments .fileItem .imgType{
    width:16px;
    height:16px;
}
.proBaseInfo /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
}
.proBaseInfo /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label{
    color:#606266;
}
.proBaseInfo /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color:#fff;
}


</style>
