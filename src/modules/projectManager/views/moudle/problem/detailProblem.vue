<template>
 <div class="detailProblem">
      <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
            <el-row style="padding:12px 10px;background-color:#fff;">
                <el-col :span="24" >
                    <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'问题详情'"></eco-tool-title>
                    <!-- <el-button plain class="plainBtn toolBtn"  @click.native="SaveProblem"><i class="icon el-icon-remove-outline"></i>&nbsp;保存</el-button> -->
                    <el-button plain class="plainBtn toolBtn"  @click.native="closeProblem" v-if="editable && problemStatus && (roleMap['admin'] || roleMap['edit']||createAuth)" v-show="!editableStatus"><i class="icon el-icon-circle-close"></i>&nbsp;关闭问题</el-button>
                    <!-- 草稿状态显示保存 -->
                    <el-button type="primary" v-if="editableStatus"  size="medium" @click="saveDraft">保存</el-button>
                    <el-button  type="primary" size="medium" @click="onSubmit" v-if="editable && problemStatus && (roleMap['admin'] || roleMap['edit']||createAuth)">
                      {{editableStatus?'提交':'保存'}}
                    </el-button>
                    <el-button  type="primary" size="medium" @click="delProblem" v-if="editable && editableStatus && (roleMap['admin'] || roleMap['edit']||createAuth)">删除</el-button>
                    <el-button class="plainBtn toolBtn" type="primary" style="color:#fff" @click="startDelayFlow" v-if="editable && !editableStatus && (roleMap['admin'] || roleMap['edit']||createAuth)&&problemStatus" >申请延期</el-button>
                    <el-button plain class="plainBtn toolBtn"  @click.native="goback" style="float:right"><i class="icon el-icon-back"></i>&nbsp;返回问题列表</el-button>
                </el-col>
            </el-row>
        </eco-content>
          <eco-content top="61px" bottom="60px" type="tool" style="padding:20px 0;background-color:#fff">
            <div class="mainTable">
                <table width="100%">
                    <tr>
                        <th>问题编号</th>
                        <td colspan="2">{{form.code}}</td>
                        <th>问题名称</th>
                        <td colspan="2" :class="{editable:editableStatus}">
                          <el-input v-if="editableStatus" v-model="form.name"></el-input>
                          <span v-else>{{form.name}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>提出人</th>
                        <td colspan="2">{{form.proposerName}}</td>
                        <th>提出时间</th>
                        <td colspan="2" :class="{editable:editableStatus}">
                        <el-date-picker type="date" v-if="editableStatus" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.startDate" style="width: 100%;"></el-date-picker>
                        <span v-else>{{form.startDate}}</span>
                          </td>
                    </tr>
                    <tr>
                        <th>计划完成时间</th>
                        <td colspan="2" :class="{editable:editableStatus}">
                          <el-date-picker type="date" v-if="editableStatus" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.planEndDate" style="width: 100%;"></el-date-picker>
                          <span v-else>{{form.planEndDate}}</span>
                        </td>
                        <th>问题状态</th>
                        <td colspan="2">{{getBaseDataTextByKey(form.status,"faw_pm_pro_status")}}</td>
                    </tr>
                    <tr>
                        <th>责任人</th>
                        <td colspan="2" :class="{editable:editableStatus}">
                            <tag-select
                              v-if="editableStatus"
                              style="width: 100%;vertical-align: top;"
                              ref="tagSelect"
                              :initDataStr="initDataStr_Person"
                              :initOptions="{selectNum:1,selectType:'USER'}"
                              @callBack="selectDutyPerson" >
                          </tag-select>
                          <span v-else>{{form.dutyUserName}}</span>
                         </td>
                        <th>责任部门</th>
                        <td colspan="2"  :class="{editable:editableStatus}">
                          <el-input v-if="editableStatus" v-model="form.dutyDeptName" placeholder="选择责任人后回填"></el-input>
                          <span v-else>{{form.dutyDeptName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>重要性</th>
                        <td colspan="2" :class="{editable:editableStatus}">
                          <el-select v-if="editableStatus" v-model="form.importantLevel" style="width:95%" placeholder="请选择" clearable>
                            <el-option
                            v-for="(item,index) in baseData['faw_pm_pro_important']" :key="index"
                            :label="item.text"
                            :value="item.id"
                            >
                            </el-option>
                        </el-select>
                          <span v-else>{{getBaseDataTextByKey(form.importantLevel,"faw_pm_pro_important")}}</span>
                        </td>
                        <th>紧急度</th>
                        <td colspan="2" :class="{editable:editableStatus}">
                          <el-select
                          v-model="form.urgent"
                          style="width:95%"
                          placeholder="请选择"
                          clearable
                          v-if="editableStatus"
                          >
                          <el-option
                          v-for="(item,index) in baseData['faw_pm_pro_urgent']" :key="index"
                          :label="item.text"
                          :value="item.id"
                          >
                          </el-option>
                      </el-select>
                         <span v-else>
                           {{getBaseDataTextByKey(form.urgent,"faw_pm_pro_urgent")}}
                           </span>
                        </td>
                    </tr>
                    <tr>
                    <th>关注级别</th>
                  <td colspan="2" :class="{editable:editableStatus}">
                    <el-select v-model="form.attention" placeholder="请选择" clearable v-if="editableStatus" style="width:95%" @change="changeAttention">
                      <el-option
                      v-for="(item,index) in baseData['faw_pm_pro_attention']" :key="index"
                      :label="item.text"
                      :value="item.id"
                      >
                      </el-option>
                  </el-select>
                      <span v-else>
                        {{getBaseDataTextByKey(form.attention,"faw_pm_pro_attention")}}
                      </span>
                  </td>
                  <th v-show="attentionType">所属领域</th>
                  <td colspan="2" :class="{editable:editableStatus}" v-show="attentionType">
                  <el-select v-model="form.field" clearable v-if="editableStatus" style="width:95%">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_field_type']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
                <span v-else>{{getBaseDataTextByKey(form.field,"faw_pm_field_type")}}</span>
                </td>
                  <th v-show="!attentionType">实际关闭时间</th>
                  <td colspan="2" v-show="!attentionType">
                      <span>{{form.closeDate}}</span>
                  </td>
                </tr>
                <tr v-show="attentionType">
                  <th>实际关闭时间</th>
                  <td colspan="5">
                      <span>{{form.closeDate}}</span>
                  </td>
                </tr>
                    <tr>
                        <th>问题描述</th>
                        <td colspan="5" :class="{editable:editableStatus}" >
                          <el-input v-if="editableStatus" v-model="form.describe"></el-input>
                          <span v-else>{{form.describe}}</span>
                        </td>
                    </tr>
                    <tr >
                        <th :rowspan="form.pmInfoProblemMeasuresEntityList&&form.pmInfoProblemMeasuresEntityList.length+1" >解决措施</th>
                        <td width="60px">序号</td>
                        <td>措施描述</td>
                        <td>责任人</td>
                        <td v-if="!editableStatus">是否完成</td>
                        <td v-if="!editableStatus">措施维护</td>
                        <td v-if="editableStatus">
                          <span style="float:left;marginTop:6.9px">操作</span>
                        <el-button
                          type="text"
                          style="display:inline-block;float:right;marginRight:22px"
                          v-if="editable && (roleMap['admin'] || roleMap['edit']||createAuth)"
                          @click="addLine(form.pmInfoProblemMeasuresEntityList)"
                        >添加</el-button>
                        </td>
                    </tr>
                    <tr v-for="(item,index) in form.pmInfoProblemMeasuresEntityList">
                       <td>{{index+1}}</td>
                        <td :class="{editable:editableStatus}">
                        <el-input
                          v-if="editableStatus"
                          v-model="item.text"
                        ></el-input>
                        <span v-else>{{item.text}}</span>
                      </td>
                        <td :class="{editable:editableStatus}">
                        <tag-select
                          v-if="editableStatus"
                          style="width: 100%;vertical-align: top;"
                          ref="tagSelect"
                          :initDataStr="item.initDataStr"
                          :initOptions="{selectNum:1,selectType:'USER'}"
                          @callBack="(data)=>selectMeasurePerson(data,item)"
                        >
                        </tag-select>
                      <span v-else>{{item.userName}}</span>
                      </td>
                       <td v-if="!editableStatus">{{item.completeStatus==false?'否':'是'}}</td>
                       <td :class="{editable:true}" style="padding-left:15px"               v-if="!editableStatus">
                         <el-button type="text" v-if="editable && (roleMap['admin'] || roleMap['edit']||createAuth)" v-show="createAuth" @click="maintenance(item.id)">维护</el-button>
                       </td>
                    <td
              :class="{editable:true}"
              style="padding-left:15px"
              v-if="editableStatus"
            >
              <el-button
                type="text"
                style="color:red !important"
                v-if="editable && (roleMap['admin'] || roleMap['edit']||createAuth)"
                @click="delLine(form.pmInfoProblemMeasuresEntityList,index)"
              >删除</el-button>
            </td>
                    </tr>
                    <tr>
                       <th>备注</th>
                       <td colspan="5" :class="{editable:editableStatus||goOnStatus}">
                         <el-input v-if="editableStatus||goOnStatus" v-model="form.comments"></el-input>
                        <span v-else>{{form.comments}}</span>
                       </td>
                    </tr>
                    <tr>
                       <th>文档</th>
                       <td colspan="5" :class="{editable:editableStatus||goOnStatus}"  style="padding-left:15px">
                          <span @click="goAttachementPage"
                           v-if="editableStatus||goOnStatus"
                           class="pointerClass"><i class="el-icon-paperclip"></i>上传文件（上传文件大小限制为2G）</span>
                         <ul class="fileList">
                                <li v-for="(item,index) in fileLists" :key="index" class="fileItem">
                                    <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span>
                                    <span style="cursor:pointer;" v-bind:class="item.operateFlag?'deleted':''">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.size | sizeTostr}}&nbsp;)</span>
                                    <span class="download" @click="fileDownload(item)">下载</span>
                                    |<span class="preview" @click="filePreview(item)">预览</span>
                                    <span class="delete" v-show="!item.operateFlag&&(editableStatus||goOnStatus)" @click="fileDelete(item,index)">[ 点击删除 ]</span>
                                    <span class="recovery" v-show="item.operateFlag&&(editableStatus||goOnStatus)" @click="fileRecovery(item,index)">[ 点击恢复 ]</span>
                                </li>
                            </ul></td>
                    </tr>
                </table>
            </div>
          <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
          <input type="hidden" name="fileHeaderIds"/>
          <input type="hidden" name="expectedName"/>
        </form>
        <iframe name="docviewIframe" style="display:none"></iframe>
        </eco-content>
 </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {getProblemInfo,closeProblem,delProblem,updateProblemInfo,startProblemDelayFlow} from '../../../api/problem.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {mapState,mapGetters,mapActions} from 'vuex'
import {getFileListByModular,batchDeleteFiles,getPMModelRole,getUserInfoByOrgId,getWFOperateId} from '../../../api/common.js'
import {EcoFile} from '@/components/file/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
 name: 'detailProblem',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      tagSelect
  },
 data () {
 return {
   id:"",
   form:{},
   problemStatus:true,
   fileLists:[],
   modular:'project_manager',
   modularInnerId:'',
   roleMap:{},
   editable:window.editable,
   projectId:'',
   initDataStr_Person:'',
   editableStatus:true,
   goOnStatus:true,
   createAuth:false,
   attentionType:false
 }
 },
  computed: {
      ...mapGetters([
          'baseData',
          'getBaseDataTextByKey',
           'typeImgList'
      ]),
      getContentTop:function(){
           if(this.searchShow){
               return '113px';
           }else{
               return '61px';
           }
       },
  },
  filters:{
      sizeTostr(value){
          if(!value) return "0KB";
          return EcoUtil.getFileSize(value);
      }
  },
 created() {
    this.callAction();
    this.bindAction()
    this.id=this.$route.params.prId
    this.modularInnerId=this.id
    this.getFileListByModular()
    this.getInfo()
    this.getPMModelRole();
 },
 methods: {
    callAction(){
        let this_ = this;
        window.tabClickFunc = function(){
            this_.getInfo();
        }
        let callBackDialogFunc = function(obj){
            if(obj && (obj.action == 'updateProblem') ){
              this_.getInfo();
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'projectlistvue');
    },
    // 附件上传回写
      bindAction(){
          let that = this;
          let callBackDialogFunc = function(obj){
              if(obj && obj.action == 'onFileUploadActionCallBack'){ //附件上传回写
                    that.onFileUploadActionCallBack(obj.data);
                    that.getFileListByModular()
              }
          }
           EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'detailProblemVue');
      },
   getInfo(){
     this.getFileListByModular()
     getProblemInfo(this.id).then(res=>{
        this.form=res
        this.projectId=res.infoId
        this.attentionType=this.getBaseDataTextByKey(this.form.attention,'faw_pm_pro_attention')=='领域级'?true:false
        this.createAuth=res.oneSelf
        if(this.form.pmInfoProblemMeasuresEntityList!=null){
            this.form.pmInfoProblemMeasuresEntityList.forEach(item=>{
              this.$set(item,'initDataStr','')
              if(item.userId!=''){
                    this.tagSelectMeasureEcho(item,item.userId)
              }
        })
        }else{
          this.form.pmInfoProblemMeasuresEntityList=[]
        }
        if(this.form.status=='faw_pm_pro_status1'){
           this.editableStatus=true
        }else if(this.form.status=='faw_pm_pro_status2'||this.form.status=='faw_pm_pro_status4'){
           this.editableStatus=false
           this.goOnStatus=true
        }else{
           this.editableStatus=false
           this.goOnStatus=false
        }
        (this.form.status=='faw_pm_pro_status3'||this.form.status=='faw_pm_pro_status5')?this.problemStatus=false:this.problemStatus=true
        let orgArr=[]
        let obj={}
        obj.type = 'PERSONNEL',
        getUserInfoByOrgId(res.dutyUserId).then(response=>{
           response.departments.forEach(item => {
                  orgArr.push(item.id)
              });
          orgArr.push(res.dutyUserId)
          obj.orgId=orgArr.join('.')
          obj.linkId=res.dutyUserId
          this.initDataStr_Person =JSON.stringify(obj)
          this.form.dutyUserId =res.dutyUserId;
          this.form.dutyUserName = res.dutyUserName;
        })
     })
   },
    // 解决措施选人回显
    tagSelectMeasureEcho(item,id){
      let obj={}
      let orgArr=[]
      obj.type = 'PERSONNEL',
      getUserInfoByOrgId(id).then(res=>{
        res.departments.forEach(item => {
            orgArr.push(item.id)
        });
        orgArr.push(id)
        obj.orgId=orgArr.join('.')
        obj.linkId=id
        item.initDataStr=JSON.stringify(obj)
      })
    },
    // 责任人
    selectDutyPerson(data){
         if(data.itemArray.length > 0){
            this.form.dutyUserId = data.itemArray[0].linkId;
            this.form.dutyUserName = data.itemArray[0].name;
            this.getDpetBylinkId(this.form.dutyUserId)
         }else{
            this.form.dutyUserId = "";
            this.form.dutyUserName = "";
            this.initDataStr_Person = "";
            this.form.dutyDeptId="";
            this.form.dutyDeptName=""
         }
      },
    getDpetBylinkId(id){
        getUserInfoByOrgId(id).then(res=>{
            this.form.dutyDeptId = res.departments[0].orgPathDeptList?res.departments[0].orgPathDeptList[res.departments[0].orgPathDeptList.length - 1].id:'';
            this.form.dutyDeptName =res.departments[0].orgPathDeptList?res.departments[0].orgPathDeptList[res.departments[0].orgPathDeptList.length - 1].i18nText:''
        })
    },
   maintenance(id){
       if(sysEnv == 0){
            let _width = '600';
            let _height = '320';
            let url = window.location.origin + "/#" +'/updateProblem/'+id+'/'+this.id;
            EcoUtil.getSysvm().openDialog('问题维护',url,_width,_height,'15vh');
        }else{
            let _width = '600';
            let _height = '320';
            let url = '/projectManager/index.html#/updateProblem/'+id+'/'+this.id;
            EcoUtil.getSysvm().openDialog('问题维护',url,_width,_height,'15vh');
        }
   },
      getFileListByModular(){
           this.loading = true;
           getFileListByModular(this.modular,this.modularInnerId).then(res => {
               this.fileLists = res;
           })
      },
      getPMModelRole(){
            getPMModelRole(this.projectId,'faw_pm_model_problem').then(res=>{
                this.roleMap = res;
            })
        },
      goAttachementPage(){
        let data = {};
        data.modular = this.modular;
        data.modularInnerId = this.id;
        if(window.sysEnv == 1){
            EcoUtil.getSysvm().onFileUpload(data);
        }else{
            EcoUtil.getSysvm().onFileUploadForEnv(data);
        }
      },
      updateFiles(){
          if(this.fileLists.length == 0) return;
          this.loading = true;
          let deleteIds = this.fileLists.map(item =>
              item.operateFlag?item.id:""
          )
          batchDeleteFiles(deleteIds).then(res => {
              this.loading = false;
              this.getFileListByModular();
          })
      },
      onFileUploadActionCallBack(data){
          this.fileLists.push.apply(this.fileLists,data.fileLists);
      },
      fileChange(file, fileList){
          this.loading = true;
      },
      fileOnSuccess(response, file, fileList){
          this.loading = false;
          this.fileHeardId = response.id;
      },
      fileDownload(item){
           EcoFile.openFileHeaderByDownload(item.id,item.name);
      },
      filePreview(item){

        if(item.fileType && item.fileType.toLowerCase()== 'pdf'){
            EcoFile.openFileByPdfJs(item.id,item.modular);
        }else{
            EcoFile.openFileHeaderByView(item.id,item.name);
        }
      },
      fileDelete(item,idx){
        this.$set(item,'operateFlag',true);
      },

      fileRecovery(item,idx){
        this.$set(item,'operateFlag',false);
      },
      goback(){
          this.$router.push({name:'problem-list',params:{id:this.projectId}})
      },
      startDelayFlow(){
          EcoUtil.getSysvm().showLoadingDiv('正在初始化... 请稍等');
          startProblemDelayFlow(this.id,this.projectId).then(res =>{
              this.loading = false;
              getWFOperateId(res.startTaskId).then(response=>{
                   if(response.status == 0){
                        EcoUtil.getSysvm().hideLoadingDiv();
                        let operateId = response.operate_id;
                        let tabObj = {};
                        let goPage = "flowform/index.html#/wfDetail/"+res.startTaskId+"/"+operateId;
                        tabObj.desc = '待办流程';
                        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+res.startTaskId+"',href_link:'"+goPage+"',fullScreen:true}";
                        EcoUtil.getSysvm().doTab(tabObj);
                   }else{
                        EcoUtil.getSysvm().hideLoadingDiv();
                        EcoMessageBox.alert(response.msg);
                        this.closeFullWindow();
                   }
              })

          })
      },
      closeFullWindow(){
        let _closeObj = {};
        _closeObj.clearIframe = true;
        _closeObj.tabClick = true;
        EcoUtil.getSysvm().closeFullScreen(_closeObj);
      },
      delProblem(){
        var that  = this;
          let confirmYesFunc = function(){
            delProblem(that.id).then(res => {
                that.$message({
                    message: '删除成功',
                    showClose: true,
                    duration:1000,
                    customClass:'design-from-el-message',
                    type: 'success',
                    onClose:(()=>{
                        that.$router.push({name:'problem-list',params:{id:that.projectId}})
                    })
                });
            })
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除该草稿吗?','提示',options,confirmYesFunc);
      },
      // 措施选人
      selectMeasurePerson(data,item){
        if(data.itemArray.length > 0){
              item.userId = data.itemArray[0].linkId;
              item.userName = data.itemArray[0].name;
          }else{
              item.userId = "";
              item.userName = "";
              item.initDataStr =""
          }
      },
      addLine(list) {
      let obj={
        id:'',
        text:'',
        userId:'',
        userName:'',
        initDataStr:'',
      }
      list.push(obj)
    },
      delLine(list,index){
          list.splice(index, 1);
      },
      // 草稿状态保存
      saveDraft(){
        if(!this.attentionType){
          this.form.field=''
        }

        updateProblemInfo(this.form).then(res=>{
                    this.$message({
                    message: '更新成功',
                    showClose: true,
                    duration:1000,
                    customClass:'design-from-el-message',
                    type: 'success',
                });
                this.getInfo()
                this.updateFiles()
          })
      },
      onSubmit(){
        if(this.form.name==''){
           this.$message.error('请填写问题名称')
           return
        }
        if(this.form.startDate==''){
           this.$message.error('请填写提出时间')
           return
        }
        if(this.form.planEndDate==''){
           this.$message.error('请填写计划完成时间')
           return
        }
        if(this.form.dutyUserId==''){
           this.$message.error('请选择责任人')
           return
        }
        if(this.form.dutyDeptName==''){
           this.$message.error('请填写责任部门(选择责任人后自动回填)')
           return
        }
        if(this.form.importantLevel==''){
           this.$message.error('请选择重要性')
           return
        }
        if(this.form.urgent==''){
           this.$message.error('请选择紧急度')
           return
        }
        if(this.form.attention==''){
           this.$message.error('请选择关注级别')
           return
        }
        if(this.getBaseDataTextByKey(this.form.attention,"faw_pm_pro_attention")=='领域级'&&this.form.field==''){
            this.$message.error('请选择所属领域')
           return
        }
        if(this.form.describe==''){
           this.$message.error('请填写问题描述')
           return
        }
        // if(this.form.pmInfoProblemMeasuresEntityList.length==0){
        //    this.$message.error('解决措施至少填写一行,责任人和措施描述必填')
        //    return
        // }
          let measuresList=this.form.pmInfoProblemMeasuresEntityList
        // if(measuresList[0].text==''||measuresList[0].userId===''){
        //   this.$message.error('解决措施描述或负责人不能为空')
        //   return
        // }
        if(measuresList.length!=0){
             for (let index = 0; index < measuresList.length; index++) {
            if(measuresList[index].text==''||measuresList[index].userId==''){
            this.$message.error('解决措施描述或负责人不能为空')
            return
          }
        }
        }else{
           this.$message.error('解决措施至少填写一行')
           return
        }
        if(!this.attentionType){
          this.form.field=''
        }
        // if(this.getBaseDataTextByKey(this.form.status,"faw_pm_pro_status")=='草稿'){
        //   this.form.status='faw_pm_pro_status2'
        // }
        if(this.form.status=='faw_pm_pro_status1'){
          // 提交操作
          var that  = this;
          let confirmYesFunc = function(){
              that.form.status='faw_pm_pro_status2'
              updateProblemInfo(that.form).then(res=>{
                    that.$message({
                    message: '提交成功',
                    showClose: true,
                    duration:1000,
                    customClass:'design-from-el-message',
                    type: 'success',
                });

                that.getInfo()

                that.updateFiles()
          })
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要提交吗?','提示',options,confirmYesFunc);
        }else {
          // 进行保存操作
              updateProblemInfo(this.form).then(res=>{
                    this.$message({
                    message: '更新成功',
                    showClose: true,
                    duration:1000,
                    customClass:'design-from-el-message',
                    type: 'success',
                });
                this.getInfo()
                this.updateFiles()
          })
        }

      },
      changeAttention(val){
        let selectType=this.getBaseDataTextByKey(val,'faw_pm_pro_attention')
        if(selectType=='领域级'){
          this.attentionType=true
        }else{
          this.attentionType=false
        }
    },
      closeProblem(){
          var that  = this;
          let confirmYesFunc = function(){
            closeProblem(that.id).then(res => {
                that.$message({
                    message: '关闭成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                that.getInfo();
            })
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要关闭该问题吗?','提示',options,confirmYesFunc);
   }
 },
}
</script>

<style scoped >
.detailProblem .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.detailProblem .toolBtn{
    margin:0 10px;
}
.detailProblem .mainTable{
    min-width: 800px;
    width: 60%;
    margin: 0 auto;
}
.detailProblem .mainTable table{
    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
    /* table-layout: fixed; */
    font-size: 14px;
}
.detailProblem .mainTable table tr{
    height: 50px;
    line-height: 1.5;
}
.detailProblem .mainTable table th{
    background: #f0f0f0;
    padding-left: 15px;
    width: 130px;
    border:1px solid #e8e8e8;
    color: #0f1419 !important;
}
.detailProblem .mainTable table td{
    background: #fafafa;
    padding-left: 15px;
    border:1px solid #e8e8e8;
    word-break: break-all;
    color: #666;
}
.detailProblem .mainTable table td.editable{
    background: #fff;
    padding: 0;
}
.detailProblem table.neiqianTable th{
    border: none;
    border-right:1px solid #e8e8e8


}
.fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}
.fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
    margin-right:5px;
}
.fileItem .delete{
    margin-left:5px;
    cursor: pointer;
    color:#67c23a;
}

.fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.fileItem .imgType{
    width:16px;
    height:16px;
}
.fileItem .deleted{
    text-decoration: line-through;
}
.tagSelect /deep/  .el-customDiv{
    border: none;
}
</style>
