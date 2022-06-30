<template>
<div class="meetingView" v-loading="loading">
        
        <div class="meetingTool" v-if="btnRoleMap && (btnRoleMap['oa.conference_graphical_DELETE_Conference']|| btnRoleMap['oa.conference_graphical_UPDATE_Conference']) ">
                <el-button type="primary" @click="updateFunc" v-if="btnRoleMap && (btnRoleMap['oa.conference_graphical_UPDATE_Conference'])">修改</el-button>
                <el-button type="danger" @click="deleteFunc" v-if="btnRoleMap && (btnRoleMap['oa.conference_graphical_DELETE_Conference'])">删除</el-button>
        </div>
        
        <table class="meetingTable">
                <tbody>
                        <tr>
                            <th>会议名称</th>
                            <td :colspan="3">{{baseInfo.name}}</td>
                        </tr>

                        <tr>
                            <th>开始日期</th>
                            <td>{{baseInfo.startTime}}</td>
                            <th>结束日期</th>
                            <td>{{baseInfo.endTime}}</td>
                        </tr>

                         <tr>
                            <th>会议地点</th>
                            <td>{{baseInfo.roomName}}</td>
                            <th>会议性质</th>
                            <td>{{getCharacterName(baseInfo.character)}}</td>
                        </tr>

                        <tr>
                            <th>主持人</th>
                            <td>{{baseInfo.hostName? ((baseInfo.hostName.split("|").length ==2)?baseInfo.hostName.split("|")[1]:''):''}}</td>
                            <th>通知方式</th>
                            <td>{{noticeWayMap[baseInfo.noticeWay]}}</td>
                        </tr>

                        <tr>
                            <th>会议内容</th>
                            <td :colspan="3">{{baseInfo.desc}}</td>
                        </tr>

                        <tr>
                            <th>与会人员</th>
                            <td :colspan="3">
                                <span v-for="(item,idx) in baseInfo.confereesName" :key="idx" class="userSpan">{{item}}</span>
                            </td>
                        </tr>

                        <tr>
                             <th>外部人员</th>
                             <td :colspan="3">
                                 <el-row v-for="(item,idx) in baseInfo.confereeExternals" :key="idx" style="line-height:25px;">
                                    <el-col :span="2">{{item.name}}</el-col>
                                    <el-col :span="22">{{item.emailAddr}}</el-col>
                                 </el-row>
                             </td>
                        </tr>


                         <tr>
                            <th>附件</th>
                            <td :colspan="3">
                                 <div  class="viewAttachments">
                                        <div class="fileTemplateDiv" >
                                                <div class="fileItem" v-for="(item,idx) in fileLists" :key="item.id">
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
                </tbody>
        </table>

        <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
          <input type="hidden" name="fileHeaderIds"/>
          <input type="hidden" name="expectedName"/>
      </form>

      <iframe name="docviewIframe" style="display:none"></iframe>
  
    </div>
 
</template>
<script>

  import {getMeetingSingleAjax,getNoticeFormEnum,getEnumSelectEnabled,getFileListByModular,getMemberTextShow,deleteMeetingAjax,getRoleBtnSetting} from '../../service/service'
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {EcoFile} from '@/components/file/main.js'
  import {mapState} from 'vuex';
  import {sysEnv} from '../../config/env.js'

  export default {
      components:{
          ecoContent,
      },
      data(){
          return{
                baseInfo:{
                    id:null,
                    fillFullInfo:true,
                    catId: 'CONFERENCE',
                    startTime:null,
                    endTime:null,
                    character:null, //会议性质
                    roomId:null,
                    roomName:null,
                    name:null, //会议名称
                    desc:null,
                    noticeWay:null,
                    noticeOrNot:false,
                    conferees:[],
                    confereesName:[],
                    hostLinkId:null,
                    hostName:null,
                    hostArray:[],
                    confereeExternals:[]
                },
                modular:'MEETING',
                modularInnerId: '',
                characterId:'oa.conference.character',
                characterArray:[],
                noticeWayMap:{},
                loading:true,
                fileLists:[],
                btnRoleMap:{}
          }
      },

      created(){
          this.baseInfo.id = this.$route.params.id;
          this.modularInnerId = this.$route.params.id;

          this.getRoleBtnSetting();
          this.getMeetingSingleFunc();
          this.getNoticeFormEnumFunc();
          this.getEnumSelectEnabledFunc();
          this.getFileListByModularFunc();
          this.listAction();

          window.meetingViewVm = this;
 
        
      },
      mounted(){
         
      },
      computed:{
          ...mapState(['typeImgList'])
      },
      methods: {
            listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'updateMeetingAddBack'){
                        window.meetingViewVm.getMeetingSingleFunc();
                        window.meetingViewVm.getFileListByModularFunc();
                    }
                }

                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'meetingViewVm');
            },

            getRoleBtnSetting(){
                const btn_array = ['oa.conference_graphical_VIEW_Conference',
                    'oa.conference_graphical_CREATE_Conference',
                    'oa.conference_graphical_UPDATE_Conference',
                    'oa.conference_graphical_DELETE_Conference'
                ];
                getRoleBtnSetting(btn_array).then((res)=>{
                        if(res.data){
                            this.btnRoleMap = res.data.authenticationMap;
                        }
                })
            },
          
            getMeetingSingleFunc(){
                getMeetingSingleAjax(this.baseInfo).then((response)=>{
                    this.baseInfo.startTime = response.data.startTime;
                    this.baseInfo.endTime = response.data.endTime;
                    this.baseInfo.character = response.data.character;
                    this.baseInfo.roomId = response.data.roomId;
                    this.baseInfo.roomName = response.data.roomName;

                    this.baseInfo.name = response.data.name;
                    this.baseInfo.desc = response.data.desc;
                    this.baseInfo.noticeWay = response.data.noticeWay;
                    this.baseInfo.noticeOrNot = response.data.noticeOrNot;
                    this.baseInfo.roomName = response.data.roomName;

                    this.baseInfo.hostLinkId = response.data.hostLinkId;
                    this.baseInfo.hostName = response.data.hostName;
                    
                    if(response.data.conferees){
                        this.baseInfo.conferees = response.data.conferees;
                    }
                    if(response.data.confereeExternals){
                        this.baseInfo.confereeExternals = response.data.confereeExternals;
                    }
                    if(this.baseInfo.hostLinkId){
                        try{
                             this.baseInfo.hostArray.push({type:"PERSONNEL",orgId:this.baseInfo.hostName.split("|")[0],linkId:this.baseInfo.hostLinkId,role:null});
                        }catch(e){}
                    }

                    this.getMemberTextShowFunc();
                    this.loading = false;
                })
            },

            getFileListByModularFunc(){
                getFileListByModular(this.modular,this.modularInnerId).then((response)=>{
                        if(response.data){
                            (response.data).forEach((item)=>{
                                item.fileSize = EcoUtil.getFileSize(item.size);
                            })
                        }
                        this.fileLists = response.data;
                })
            },

            getMemberTextShowFunc(){
                getMemberTextShow(this.baseInfo.conferees).then((response)=>{
                    this.baseInfo.confereesName = response.data;
                    
                })
            },

            //获取通知方式
            getNoticeFormEnumFunc(){
                getNoticeFormEnum().then((response)=>{
                    this.noticeWayMap = response.data;
                })
            },

            //获取会议性质基础数据
            getEnumSelectEnabledFunc(){
                getEnumSelectEnabled(this.characterId).then((response)=>{
                    this.characterArray = response.data
                })
            },

            getCharacterName(id){
               return EcoUtil.getCategoryName(this.characterArray,id,'id','text');
            },

            fileDownload(item){
                EcoFile.openFileHeaderByDownload(item.id,item.name);
            },

            filePreview(item){
                EcoFile.openFileHeaderByView(item.id,item.name);
            },

            deleteFunc(){
                let that  = this;
                let confirmYesFunc = function(){
                    let _ids = [];
                    _ids.push(that.baseInfo.id);
                    deleteMeetingAjax(_ids).then((response)=>{
                        that.$message({
                                showClose: true,
                                message:'删除成功',
                                type: 'success',
                                duration:2000
                            });

                            let doObj = {}
                            doObj.action = 'updateMeetingAddBack';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    })
                }

                let options = { type:'warning',lockScroll:false};
                EcoMessageBox.confirm('确认删除该会议？','提示',options,confirmYesFunc);
            },

            updateFunc(){
                if(sysEnv == 1){
                    let url = '/meeting/index.html#/meetingEdit/'+this.baseInfo.id;
                    EcoUtil.getSysvm().openDialog('会议修改',url,900,550,'8vh');
                }else{
                    this.$router.push({name:'meetingEdit',params:{id:this.baseInfo.id}});
                }
            }
           
      }

  }

</script>

<style scoped>
.meetingView{
    padding:0px;
    background-color:#fff;
}

.meetingView .meetingTool{
    text-align: right;
}


.meetingView .meetingTable{
    width:100%;
}

.meetingView .meetingTable tr{
    border-bottom: 1px solid #ebeef5;
 }

.meetingView .meetingTable th{
    font-size: 12px;
    line-height: 40px;
    width: 20%;
    background: #f8f8f8;
    text-align: center
 }

 .meetingView .meetingTable td{
    font-size: 12px;
    line-height: 40px;
    width:30%;
    background: #fff;
    text-align: left;
    padding: 0 12px;
 }


 .meetingView .meetingTable th:last-child:hover{
   background: #f8f8f8;
 }


 .meetingView .viewAttachments  .fileItem{
    color: #606266;
    margin-left:0px;
    line-height: 20px;
    margin-bottom:5px;
    margin-top:5px;
    font-size: 14px;
}

.meetingView .viewAttachments .fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}

.meetingView .viewAttachments .fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
}

.meetingView .viewAttachments .fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.meetingView .viewAttachments .fileItem .imgType{
    width:16px;
    height:16px;
}

.meetingView .userSpan{
    margin-right:10px;
}
</style>
