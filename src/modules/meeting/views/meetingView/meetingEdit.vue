<template>


    <eco-content top="0px" bottom="0px" v-loading="loading">

   

        <eco-content top="0px" bottom="60px" class="meetingAdd" >
                <el-form ref="form" :model="baseInfo" label-width="120px" label-position="right" style="margin-top:10px;" size="small" class="meetingAddForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开始日期" prop="startTime" :rules="[{required: true, message:'开始时间必须填写',trigger: 'blur'}]">
                                    <el-date-picker
                                        style="width:100%"
                                        v-model="baseInfo.startTime"
                                        type="datetime"
                                        placeholder="选择开始时间"
                                        format="yyyy-MM-dd HH:mm"
                                        value-format="yyyy-MM-dd HH:mm"
                                    >
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="结束日期" prop="endTime" :rules="[{required: true, message:'结束时间必须填写',trigger: 'blur'}]">
                                    <el-date-picker
                                        style="width:100%"
                                        v-model="baseInfo.endTime"
                                        type="datetime"
                                        placeholder="选择结束时间"
                                        format="yyyy-MM-dd HH:mm"
                                        value-format="yyyy-MM-dd HH:mm"
                                    >
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                             <el-form-item label="会议性质">
                                <el-select
                                        v-model="baseInfo.character"
                                        placeholder="请选择"
                                        style="width:100%"
                                    >
                                        <el-option
                                            v-for="item in characterArray"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="会议室地点" prop="roomName" :rules="[{required: true, message:'会议室地点必须填写',trigger: 'change'}]">
                                <el-input v-model="baseInfo.roomName" readonly @click.native="selectMeetingRoom"  >
                                     <i slot="suffix" class="el-input__icon el-icon-circle-close" style="cursor:pointer" @click="clearRoomName"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="主持人" >
                                <tag-select
                                    :initDataArray="baseInfo.hostArray"
                                    style="width:100%;vertical-align: top;"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:1,selectType:'user'}"
                                    @callBack="hostSelectCallBack"
                                >
                                </tag-select>
                            </el-form-item>
                        </el-col>

                         <el-col :span="24">
                            <el-form-item label="会议名称" prop="name" :rules="[{required: true, message:'名称必须填写',trigger: 'blur'}]">
                                <el-input v-model="baseInfo.name" ></el-input>
                            </el-form-item>
                        </el-col>

                         <el-col :span="24">
                            <el-form-item label="会议内容" >
                                <el-input v-model="baseInfo.desc" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>

                         <el-col :span="12">
                             <el-form-item label="通知方式">
                                    <el-select
                                        v-model="baseInfo.noticeWay"
                                        placeholder="请选择"
                                        style="width:100%"
                                        clearable 
                                    >
                                        <el-option
                                            v-for="(value,key) in noticeWayMap"
                                            :key="key"
                                            :label="value"
                                            :value="key"
                                        >
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="是否提醒">
                                <el-switch v-model="baseInfo.noticeOrNot"> </el-switch>
                            </el-form-item>
                        </el-col>

                         <el-col :span="24">
                            <el-form-item label="参会人员" >
                                <tag-select
                                    :initDataArray="baseInfo.conferees"
                                    style="width:100%;vertical-align: top;"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:0,selectType:'user'}"
                                    @callBack="canhuiMemberFunc"
                                >
                                </tag-select>
                            </el-form-item>
                        </el-col>

                         <el-col>
                            <el-form-item label="外部人员">
                                    <el-table style="width:100%;marginBottom:10px" :data="externalPersonData" border class="meetingAddExtendTable">
                                        <el-table-column prop="name" label="姓名" width="140">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.name"></el-input>
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="emailAddr" label="邮箱">
                                            <template slot-scope="scope">
                                                    <el-input v-model="scope.row.emailAddr"></el-input>
                                            </template>
                                        </el-table-column>

                                        <el-table-column  width="70">
                                            <template slot-scope="scope">
                                                    <el-button icon="el-icon-minus" type="primary" @click="deleteTableLine(scope.$index,externalPersonData)"></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>

                                    <el-button icon="el-icon-plus" type="primary" class="fl-right" @click="addTableLine" style="margin-right:15px"></el-button>
                                </el-form-item>
                            </el-col>

                    </el-row>
                  

                    <el-form-item label="会议附件" style="width:98%">
                        <ecoFileUploadChunk
                            style="max-width:500px"
                            :modular="modular"
                            :modularInnerId="modularInnerId"
                            ref="ecoFileUploadRef"
                            :btnFlag=true
                            ></ecoFileUploadChunk>
                    </el-form-item>

                </el-form>

            </eco-content>

            <eco-content bottom="0px" height="60px" type="tool" style="background-color:#fff;">
                <el-row style="padding:12px 10px;">
                    <el-col :span="24" style="text-align:right">
                            <el-button @click="cancelFunc">返回</el-button>
                            <el-button type="primary" @click="createFunc">保存</el-button>
                     </el-col>
                 </el-row>
            </eco-content>
    
    </eco-content>
</template>
<script>

  import {updateMeetingAjax,getMeetingSingleAjax,getNoticeFormEnum,getEnumSelectEnabled} from '../../service/service'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  import tagSelect from '@/components/orgPick/tagSelect.vue'
  import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'
  import {sysEnv} from '../../config/env.js'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'

  export default {
      components:{
          ecoContent,
          tagSelect,
          ecoFileUploadChunk,
          ecoToolTitle
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
                    hostLinkId:null,
                    hostName:null,
                    hostArray:[]
                },
                modular:'MEETING',
                modularInnerId: '',
                characterId:'oa.conference.character',
                characterArray:[],
                noticeWayMap:[],
                externalPersonData:[],
                loading:true,
          }
      },

      created(){
          this.baseInfo.id = this.$route.params.id;
          this.modularInnerId = this.$route.params.id;
          this.getMeetingSingleFunc();
          this.getNoticeFormEnumFunc();
          this.getEnumSelectEnabledFunc();
          this.listAction();
          window.meetingAddVm = this;
      },
      mounted(){
         
      },
      computed:{
         
      },
      methods: {
            listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'roomAvaiableSelectCB'){
                         window.meetingAddVm.selectMeetingRoomCallBack(obj.data);
                    }
                }

                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'meetingAddVm');
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
                        this.externalPersonData = response.data.confereeExternals;
                    }
                    if(this.baseInfo.hostLinkId){
                        try{
                             this.baseInfo.hostArray.push({type:"PERSONNEL",orgId:this.baseInfo.hostName.split("|")[0],linkId:this.baseInfo.hostLinkId,role:null});
                        }catch(e){}
                    }
                   
                    this.loading = false;
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

          

            selectMeetingRoom(event){
                if(event.target.className != 'el-input__icon el-icon-circle-close'){
                        if(this.baseInfo.startTime == null){
                            EcoMessageBox.alert('开始时间不能为空','提示');
                            return;
                        }

                        if(this.baseInfo.endTime == null){
                            EcoMessageBox.alert('结束时间不能为空','提示');
                            return;
                        }

                        if(sysEnv == 1){
                            let url = '/meeting/index.html#/roomAvaiableSelectList/'+encodeURIComponent(this.baseInfo.startTime)+'/'+encodeURIComponent(this.baseInfo.endTime)+'/'+0;
                            EcoUtil.getSysvm().openDialog('可预约会议室',url,1050,500,'8vh');
                        }else{
                            this.$router.push({name:'roomAvaiableSelectList',params:{
                                    startTime4Available:this.baseInfo.startTime,
                                    endTime4Available:this.baseInfo.endTime,
                                    editId4Available:1
                            }});
                        }
                }
            },

            selectMeetingRoomCallBack(data){
                this.baseInfo.roomName = data.roomName;
                this.baseInfo.roomId = data.roomId;
            },

            clearRoomName(){
                this.baseInfo.roomName = null;
                this.baseInfo.roomId = null;
            },

            // 所属部门
            hostSelectCallBack(data) {
                  if (data.itemArray.length > 0) {
                       this.baseInfo.hostName =  data.itemArray[0].orgId+'|'+data.name;
                       this.baseInfo.hostLinkId = data.itemArray[0].linkId;
                  } else {
                       this.baseInfo.hostName = null;
                       this.baseInfo.hostLinkId = null;
                  }
            },

             // 参会人员
            canhuiMemberFunc(data){
                if (data.itemArray.length > 0) {
                    this.baseInfo.conferees = data.itemArray
                } else {
                    this.baseInfo.conferees = []
                }
            },

            // 表格添加行
            addTableLine(){
                this.externalPersonData.push({name:'',emailAddr:''})
            },

            // 表格删除行
            deleteTableLine(index,data){
                data.splice(index, 1);
            },

            createFunc(){
                  let that = this;
                  this.$refs['form'].validate((valid) => {
                      if (valid) {

                            if(this.baseInfo.endTime<= this.baseInfo.startTime){
                                EcoMessageBox.alert('开始时间不能小于结束时间','提示');
                                return;
                            }

                            let loadingInstance = Loading.service({ fullscreen: true,text:'正在创建中...'});
                            let _confereeExternals = [];
                            for(let i =0;i<this.externalPersonData.length;i++){
                                _confereeExternals.push({
                                    conferenceId:this.baseInfo.id,
                                    name:this.externalPersonData[i].name,
                                    emailAddr:this.externalPersonData[i].emailAddr
                                })
                            }
                            
                            updateMeetingAjax(that.baseInfo,_confereeExternals).then((response)=>{
                                    that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                        loadingInstance.close();
                                    });
                                      
                                    let doObj = {}
                                    doObj.action = 'updateMeetingAddBack';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);

                            }).catch((err)=>{
                                    that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                        loadingInstance.close();
                                    });
                            })
                        }else{
                            return false;
                        }
                    })
            },

            cancelFunc(){
                 this.$router.replace({name:'meetingList'});
            }
           
      }

  }

</script>

<style scoped>
.meetingAdd{
    padding:20px;
    background-color:#fff;
}


.meetingAdd .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.meetingAdd .content{
    margin-top:5px;
    color:#8c8080
}

.meetingAdd .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}

.meetingAdd .meetingAddForm{
    max-width: 1200px;
    margin:auto;
}
</style>
