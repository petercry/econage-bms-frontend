<template>
  <div class="detailRisk">
    <eco-content
      top="0px"
      height="60px"
      type="tool"
      style="border-bottom:1px solid #ddd;overflow:hidden;"
    >
      <el-row style="padding:12px 10px;background-color:#fff;">
        <el-col :span="24">
          <eco-tool-title
            style="line-height: 34px;margin-right:50px;"
            :title="'风险详情'"
          ></eco-tool-title>
          <!-- <el-button plain class="plainBtn toolBtn"  @click.native="SaveProblem"><i class="icon el-icon-remove-outline"></i>&nbsp;保存</el-button> -->
          <el-button
            plain
            class="plainBtn toolBtn"
            @click.native="closeRisk"
            v-if="editable && riskStatus && (roleMap['admin'] || roleMap['edit']||createAuth)"
            v-show="!editableStatus"
          ><i class="icon el-icon-circle-close"></i>&nbsp;关闭风险</el-button>
            <!-- 草稿状态显示保存 -->
            <el-button type="primary" v-if="editableStatus"  size="medium" @click="saveDraft">保存</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="onSubmit"
            v-if="editable && riskStatus && (roleMap['admin'] || roleMap['edit']||createAuth)"
          >{{editableStatus?'提交':'保存'}}</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="delRisk"
            v-if="editable && editableStatus && (roleMap['admin'] || roleMap['edit']||createAuth)"
          >删除</el-button>
          <el-button
            class="plainBtn toolBtn"
            type="primary"
            style="color:#fff"
            @click="startDelayFlow"
            v-if="editable && !editableStatus && (roleMap['admin'] || roleMap['edit']||createAuth)&&riskStatus"
          >申请延期</el-button>
          <el-button
            plain
            class="plainBtn toolBtn"
            style="float:right"
            @click.native="goback"
          ><i class="icon el-icon-back"></i>&nbsp;返回风险列表</el-button>
        </el-col>
      </el-row>
    </eco-content>
    <eco-content
      top="61px"
      bottom="60px"
      type="tool"
      style="padding:20px 0;background-color:#fff"
    >
      <div class="mainTable">
        <table>
          <tr>
            <th>风险名称</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <el-input
                v-if="editableStatus"
                v-model="form.name"
              ></el-input>
              <span v-else>{{form.name}}</span>
            </td>
            <th>开始时间</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <el-date-picker
                type="date"
                v-if="editableStatus"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="form.startDate"
                style="width: 100%;"
              ></el-date-picker>
              <span v-else>{{form.startDate}}</span>
            </td>
          </tr>
          <tr>
            <th>提出人</th>
            <td colspan="2">{{form.proposerName}}</td>
            <th>风险状态</th>
            <td colspan="2">{{getBaseDataTextByKey(form.status,"faw_pm_risk_status")}}</td>
          </tr>
          <tr>
            <th>发生概率</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <el-select
                v-if="editableStatus"
                v-model="form.chanceLevel"
                style="width:100%"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in baseData['faw_pm_risk_chance']"
                  :key="index"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <span v-else>{{getBaseDataTextByKey(form.chanceLevel,"faw_pm_risk_chance")}}</span>
            </td>
            <th>风险类型</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <!-- <el-select
                v-if="editableStatus"
                v-model="form.category"
                style="width:100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item,index) in baseData['faw_pm_risk_category']"
                  :key="index"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select> -->
              <el-input v-if="editableStatus" v-model.trim="form.categoryText"></el-input>
              <span v-else>{{form.categoryText}}</span>
            </td>
          </tr>
          <tr>
            <th>影响程度</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <el-select
                v-if="editableStatus"
                v-model="form.effect"
                style="width:100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item,index) in baseData['faw_pm_risk_effect']"
                  :key="index"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <span v-else>{{getBaseDataTextByKey(form.effect,"faw_pm_risk_effect")}}</span>
            </td>
    <th>风险等级</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <el-select
                v-if="editableStatus"
                v-model="form.level"
                style="width:100%"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in baseData['faw_pm_risk_important']"
                  :key="index"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <span v-else>{{getBaseDataTextByKey(form.level,"faw_pm_risk_important")}}</span>
            </td>
          </tr>
          <tr>

            <th>计划结束时间</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <el-date-picker
                type="date"
                v-if="editableStatus"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="form.planCloseDate"
                style="width: 100%;"
              ></el-date-picker>
              <span v-else>{{form.planCloseDate}}</span>
            </td>
                  <th>负责人</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <tag-select
                v-if="editableStatus"
                style="width: 100%;vertical-align: top;"
                ref="tagSelect"
                :initDataStr="initDataStr_Person"
                :initOptions="{selectNum:1,selectType:'USER'}"
                @callBack="selectDutyPerson"
              >
              </tag-select>
              <span v-else>{{form.dutyUserName}}</span>
            </td>
          </tr>
          <tr>

            <th>应急措施负责人</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <tag-select
                v-if="editableStatus"
                style="width: 100%;vertical-align: top;"
                ref="tagSelect"
                :initDataStr="initDataStr_UrgentPerson"
                :initOptions="{selectNum:1,selectType:'USER'}"
                @callBack="selectDutyUrgentPerson"
              >
              </tag-select>
              <span v-else>{{form.measuresName}}</span>
            </td>
                 <th>实际关闭时间</th>
             <td colspan="2">
                <span>{{form.actualCloseDate}}</span>
             </td>
          </tr>
          <tr>

              <th>关注级别</th>
            <td
              colspan="2"
              :class="{editable:editableStatus}"
            >
              <el-select
                v-if="editableStatus"
                v-model="form.attention"
                style="width:100%"
                placeholder="请选择"
                clearable
                @change="changeAttention"
              >
                <el-option
                  v-for="(item,index) in baseData['faw_pm_risk_attention']"
                  :key="index"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <span v-else>{{getBaseDataTextByKey(form.attention,"faw_pm_risk_attention")}}</span>
            </td>
              <th v-show="attentionType">所属领域</th>
              <td colspan="2" v-show="attentionType" :class="{editable:editableStatus}">
                <el-select v-model="form.field" clearable v-if="editableStatus" style="width:100%">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_field_type']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
                <span v-else>{{getBaseDataTextByKey(form.field,"faw_pm_field_type")}}</span>
              </td>
              <th v-if="!attentionType">风险描述</th>
                <td
              colspan="2"
              v-if="!attentionType"
              :class="{editable:editableStatus}"
            >
              <el-input
                v-if="editableStatus"
                v-model="form.describe"
              ></el-input>
              <span v-else>{{form.describe}}</span>
            </td>
          </tr>
          <tr  v-show="attentionType">
            <th>风险描述</th>
            <td
              colspan="5"
              :class="{editable:editableStatus}"
            >
              <el-input
                v-if="editableStatus"
                v-model="form.describe"
              ></el-input>
              <span v-else>{{form.describe}}</span>
            </td>
          </tr>
            <tr>
            <th :rowspan="riskMeasuresPreventList&&riskMeasuresPreventList.length+1">预防措施</th>
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
                @click="addLine(riskMeasuresPreventList,'riskMeasuresPreventList')"
              >添加</el-button>
            </td>
          </tr>
          <tr v-for="(item,index) in riskMeasuresPreventList">
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
            <td
              :class="{editable:true}"
              style="padding-left:15px"
              v-if="!editableStatus"
            >
              <el-button
                type="text"
                v-if="editable && (roleMap['admin'] || roleMap['edit']||createAuth)"
                @click="maintenance(item.id)"
              >维护</el-button>
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
                @click="delLine(riskMeasuresPreventList,index)"
              >删除</el-button>

            </td>
          </tr>
          <tr>
            <th :rowspan="riskMeasuresUrgentList&&riskMeasuresUrgentList.length+1">应急措施</th>
            <td width="60px">序号</td>
            <td>措施描述</td>
            <td>责任人</td>
            <td v-if="!editableStatus">是否完成</td>
            <td v-if="!editableStatus">措施维护</td>
            <td v-if="editableStatus"> <span style="float:left;marginTop:6.9px">操作</span>
              <el-button
                type="text"
                style="display:inline-block;float:right;marginRight:22px"
                v-if="editable && (roleMap['admin'] || roleMap['edit']||createAuth)"
                @click="addLine(riskMeasuresUrgentList,'riskMeasuresUrgentList')"
              >添加</el-button>
            </td>
          </tr>
          <tr v-for="(item,index) in riskMeasuresUrgentList">
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
            <td
              :class="{editable:true}"
              style="padding-left:15px"
              v-if="!editableStatus"
            >
              <el-button
                v-if="editable && (roleMap['admin'] || roleMap['edit']||createAuth)"
                type="text"
                @click="maintenance(item.id)"
              >维护</el-button>
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
                @click="delLine(riskMeasuresUrgentList,index)"
              >删除</el-button>

            </td>
          </tr>
          <tr>
            <th>备注</th>
            <td
              colspan="5"
              :class="{editable:editableStatus||goOnStatus}"
            >
              <el-input
                v-if="editableStatus||goOnStatus"
                v-model="form.comments"
              ></el-input>
              <span v-else>{{form.comments}}</span>
            </td>
          </tr>
          <tr>
            <th>文档</th>
            <td
              colspan="5"
              style="padding-left:15px"
              :class="{editable:editableStatus||goOnStatus}"
            >
              <span
                @click="goAttachementPage"
                v-if="editableStatus||goOnStatus"
                class="pointerClass"
              ><i class="el-icon-paperclip"></i>上传文件（上传文件大小限制为2G）</span>
              <ul class="fileList">
                <li
                  v-for="(item,index) in fileLists"
                  :key="index"
                  class="fileItem"
                >
                  <span class="imgType"><img
                      style="vertical-align: middle;"
                      :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"
                    />&nbsp;</span>
                  <span
                    style="cursor:pointer;"
                    v-bind:class="item.operateFlag?'deleted':''"
                  >{{item.name}}&nbsp;</span><span>(&nbsp;{{item.size | sizeTostr}}&nbsp;)</span>
                  <span
                    class="download"
                    @click="fileDownload(item)"
                  >下载</span>
                  |<span
                    class="preview"
                    @click="filePreview(item)"
                  >预览</span>
                  <span
                    class="delete"
                    v-show="!item.operateFlag&&(editableStatus||goOnStatus)"
                    @click="fileDelete(item,index)"
                  >[ 点击删除 ]</span>
                  <span
                    class="recovery"
                    v-show="item.operateFlag&&(editableStatus||goOnStatus)"
                    @click="fileRecovery(item,index)"
                  >[ 点击恢复 ]</span>
                </li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
      <form
        name="docviewform"
        method="get"
      >
        <input
          type="hidden"
          name="fileHeaderId"
        />
        <input
          type="hidden"
          name="fileName"
        />
        <input
          type="hidden"
          name="fileHeaderIds"
        />
        <input
          type="hidden"
          name="expectedName"
        />
      </form>
      <iframe
        name="docviewIframe"
        style="display:none"
      ></iframe>
    </eco-content>
  </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { sysEnv } from '../../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { getRiskInfo, closeRisk,delRisk,updateRiskInfo,startPiskDelayFlow} from '../../../api/risk.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import { getFileListByModular, batchDeleteFiles, getPMModelRole,getUserInfoByOrgId,getWFOperateId} from '../../../api/common.js'
import { EcoFile } from '@/components/file/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
  name: 'detailRisk',
  components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    tagSelect
  },
  data() {
    return {
      id: "",
      projectId: '',
      form: {},
      riskStatus: true,
      fileLists: [],
      modular: 'project_manager',
      modularInnerId: '',
      riskMeasuresPreventList: [],
      riskMeasuresUrgentList: [],
      roleMap: {},
      editable: window.editable,
      initDataStr_Person: '',
      initDataStr_UrgentPerson: '',
      editableStatus: true,
      goOnStatus: true,
      createAuth:false,
      loading:true,
      attentionType:false
    }
  },
  computed: {
    ...mapGetters([
      'baseData',
      'getBaseDataTextByKey',
      'typeImgList'
    ]),
    getContentTop: function () {
      if (this.searchShow) {
        return '113px';
      } else {
        return '61px';
      }
    },
  },
  filters: {
    sizeTostr(value) {
      if (!value) return "0KB";
      return EcoUtil.getFileSize(value);
    }
  },
  created() {
    this.callAction();
    this.bindAction()
    this.id = this.$route.params.riskId
    this.modularInnerId = this.id
    this.getFileListByModular()
    this.getInfo()
    this.getPMModelRole();

  },
  methods: {
    callAction() {
      let this_ = this;
      window.tabClickFunc = function () {
        this_.getInfo();
      }
      let callBackDialogFunc = function (obj) {
        if (obj && (obj.action == 'updateRisk')) {
          this_.getInfo();
        }
      }
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'projectlistvue');
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
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'detailRiskVue');
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
    getInfo() {
      getRiskInfo(this.id).then(res => {
        this.form = res
        this.projectId = res.infoId
        this.createAuth=res.oneSelf
        this.attentionType=this.getBaseDataTextByKey(this.form.attention,'faw_pm_risk_attention')=='领域级'?true:false
        let measureList = res.riskMeasuresEntityList
        this.tagSelectEcho(res.dutyUserId)
        this.tagSelectUrgentEcho(res.measuresId)
        if(measureList!=null){
          this.riskMeasuresUrgentList = measureList.filter(item => item.type === 'urgent')
          this.riskMeasuresPreventList = measureList.filter(item => item.type === 'prevent')
          this.riskMeasuresPreventList.forEach(item=>{
              this.$set(item,'initDataStr','')
              if(item.userId!=''){
                this.tagSelectMeasureEcho(item,item.userId)
              }
          })
          this.riskMeasuresUrgentList.forEach(item=>{
              this.$set(item,'initDataStr','')
              if(item.userId!=''){
                 this.tagSelectMeasureEcho(item,item.userId)
              }
          })
        }else{
          measureList=[]
        }

   if (this.form.status== 'faw_pm_risk_status1') {
          this.editableStatus = true
        } else if (this.form.status== 'faw_pm_risk_status2' ||this.form.status== 'faw_pm_risk_status4') {
          this.editableStatus = false
          this.goOnStatus = true
        } else {
          this.editableStatus = false
          this.goOnStatus = false
        }
    (this.form.status=='faw_pm_risk_status3'||this.form.status=='faw_pm_risk_status5')?this.riskStatus=false:this.riskStatus=true})
    },
    // 选人组件回显
    tagSelectEcho(id){
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
        this.initDataStr_Person=JSON.stringify(obj)
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
    tagSelectUrgentEcho(id){
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
        this.initDataStr_UrgentPerson=JSON.stringify(obj)
      })
    },
    // 负责人
    selectDutyPerson(data) {
      if (data.itemArray.length > 0) {
        this.form.dutyUserId = data.itemArray[0].linkId;
        this.form.dutyUserName = data.itemArray[0].name;
      } else {
        this.form.dutyUserId = "";
        this.form.dutyUserName = "";
        this.initDataStr_Person = "";

      }
    },
    // 应急措施负责人
    selectDutyUrgentPerson(data) {
      if (data.itemArray.length > 0) {
        this.form.measuresId = data.itemArray[0].linkId;
        this.form.measuresName = data.itemArray[0].name;
      } else {
        this.form.measuresId = "";
        this.form.measuresName = "";
        this.initDataStr_UrgentPerson = "";

      }
    },
      startDelayFlow(){
          EcoUtil.getSysvm().showLoadingDiv('正在初始化... 请稍等');
          startPiskDelayFlow(this.id,this.projectId).then(res =>{
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
    maintenance(id) {
      if (sysEnv == 0) {
        // let _width = '600';
        // let _height = '320';
        // let url = window.location.origin + "/#" +'/updateRisk/'+id+'/'+this.id;
        // EcoUtil.getSysvm().openDialog('风险维护',url,_width,_height,'15vh');
        this.$router.push({ name: 'updateRisk', params: { measureId: id, riskId: this.id } })
      } else {
        let _width = '600';
        let _height = '320';
        let url = '/projectManager/index.html#/updateRisk/' + id + '/' + this.id;
        EcoUtil.getSysvm().openDialog('风险维护', url, _width, _height, '15vh');
      }
    },
    getFileListByModular() {
      this.loading = true;
      getFileListByModular(this.modular, this.modularInnerId).then(res => {
        this.fileLists = res;
      })
    },
    getPMModelRole() {
      getPMModelRole( this.projectId, 'faw_pm_model_risk').then(res => {
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
    fileChange(file, fileList) {
      this.loading = true;
    },
    fileOnSuccess(response, file, fileList) {
      this.loading = false;
      this.fileHeardId = response.id;
    },
    fileDownload(item) {
      EcoFile.openFileHeaderByDownload(item.id, item.name);
    },
    filePreview(item) {

      if (item.fileType && item.fileType.toLowerCase() == 'pdf') {
        EcoFile.openFileByPdfJs(item.id, item.modular);
      } else {
        EcoFile.openFileHeaderByView(item.id, item.name);
      }
    },
    fileDelete(item, idx) {
      this.$set(item, 'operateFlag', true);
    },

    fileRecovery(item, idx) {
      this.$set(item, 'operateFlag', false);
    },
    goback() {
      this.$router.push({ name: 'risk-list', params: { id: this.projectId } })
    },
    closeRisk() {
      var that = this;
      let confirmYesFunc = function () {
        closeRisk(that.id).then(res => {
          that.$message({
            message: '关闭成功',
            showClose: true,
            duration: 2000,
            customClass: 'design-from-el-message',
            type: 'success'
          });
          that.getInfo();
        })
      }
      let options = {
        type: 'warning',
        lockScroll: false
      }
      EcoMessageBox.confirm('确定要关闭该风险吗?', '提示', options, confirmYesFunc);
    },
     // 草稿状态保存
    saveDraft(){
        if(!this.attentionType){
          this.form.field=''
        }

        this.form.riskMeasuresEntityList=[...this.riskMeasuresUrgentList,...this.riskMeasuresPreventList]
        updateRiskInfo(this.form).then(res=>{
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
    changeAttention(val){
        let selectType=this.getBaseDataTextByKey(val,'faw_pm_risk_attention')
        if(selectType=='领域级'){
          this.attentionType=true
        }else{
          this.attentionType=false
        }
    },
    onSubmit() {
        if(this.form.name==''){
           this.$message.error('请填写风险名称')
           return
        }
        if(this.form.startDate==''){
           this.$message.error('请填写开始时间')
           return
        }
        if(this.form.chanceLevel==''){
           this.$message.error('请选择发生概率')
           return
        }
        // if(this.form.category==''){
        //    this.$message.error('请选择风险类别')
        //    return
        // }
        if(this.form.effect==''){
           this.$message.error('请选择影响程度')
           return
        }
        if(this.form.level==''){
           this.$message.error('请选择风险等级')
           return
        }
        if(this.form.planCloseDate==''){
           this.$message.error('请填写计划结束时间')
           return
        }
        if(this.form.dutyUserId==''){
           this.$message.error('请填写负责人')
           return
        }
        if(this.form.measuresId==''){
           this.$message.error('请填写应急措施负责人')
           return
        }
        if(this.form.attention==''){
           this.$message.error('请选择关注级别')
           return
        }
        if(this.attentionType&&this.form.field==''){
          this.$message.error('请选择所属领域')
           return
        }
        if(this.form.describe==''){
           this.$message.error('请填写风险描述')
           return
        }
        if(!this.attentionType){
          this.form.field=''
        }
        if(this.riskMeasuresPreventList.length==0){
            this.$message.error('预防措施至少填写一行,责任人和措施描述必填')
            return
        }else{
          for (let index = 0; index < this.riskMeasuresPreventList.length; index++) {
          if(this.riskMeasuresPreventList[index].text==''||this.riskMeasuresPreventList[index].userId==''){
            this.$message.error('预防措施描述或负责人不能为空')
            return
          }
        }
        }
        // for (let index = 0; index < this.riskMeasuresPreventList.length; index++) {
        //   if(this.riskMeasuresPreventList[index].text==''||item.userId==''){
        //     this.$message.error('预防措施描述或负责人不能为空')
        //     return
        // }
        // }
         if(this.riskMeasuresUrgentList.length==0){
            this.$message.error('应急措施至少填写一行,责任人和措施描述必填')
            return
        }else{
            for (let index = 0; index < this.riskMeasuresUrgentList.length; index++) {
            if(this.riskMeasuresUrgentList[index].text==''||this.riskMeasuresUrgentList[index].userId==''){
            this.$message.error('应急措施描述或负责人不能为空')
            return
            }
        }
        }
        this.form.riskMeasuresEntityList=[...this.riskMeasuresUrgentList,...this.riskMeasuresPreventList]
       if(this.form.status=='faw_pm_risk_status1'){

          var that  = this;
          let confirmYesFunc = function(){
            that.form.status='faw_pm_risk_status2'
            updateRiskInfo(that.form).then(res=>{

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
        }else{
            updateRiskInfo(this.form).then(res=>{
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
    delRisk() {
          var that  = this;
          let confirmYesFunc = function(){
            delRisk(that.id).then(res => {
                that.$message({
                    message: '删除成功',
                    showClose: true,
                    duration:1000,
                    customClass:'design-from-el-message',
                    type: 'success',
                    onClose:(()=>{
                        that.$router.push({name:'risk-list',params:{id:that.projectId}})
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

    addLine(list,str) {
      let obj={
        id:'',
        text:'',
        userId:'',
        userName:'',
        type:'',
        initDataStr:'',
      }
      if(str=='riskMeasuresPreventList'){
        obj.type='prevent'
      }else{
        obj.type='urgent'
      }
      list.push(obj)
    },
    delLine(list,index){
        list.splice(index, 1);
    }
  },
}
</script>

<style scoped >
.detailRisk .plainBtn {
  border-color: #003b90;
  color: #003b90;
  font-size: 14px;
}
.detailRisk .toolBtn {
  margin: 0 10px;
}
.detailRisk .mainTable {
  min-width: 800px;
  width: 60%;
  margin: 0 auto;
}
.detailRisk .mainTable table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  /* table-layout: fixed; */
  font-size: 14px;
}
.detailRisk .mainTable table tr {
  height: 50px;
  line-height: 1.5;
}
.detailRisk .mainTable table th {
  background: #f0f0f0;
  padding-left: 15px;
  width: 130px;
  border: 1px solid #e8e8e8;
  color: #0f1419 !important;
}
.detailRisk .mainTable table td {
  background: #fafafa;
  padding-left: 15px;
  border: 1px solid #e8e8e8;
  word-break: break-all;
  color: #666;
}
.detailRisk .mainTable table td.editable {
  background: #fff;
  padding: 0;
}
.detailRisk table.neiqianTable th {
  border: none;
  border-right: 1px solid #e8e8e8;
}
.fileItem .download {
  margin-right: 5px;
  cursor: pointer;
  color: #3891eb;
}
.fileItem .preview {
  margin-left: 5px;
  cursor: pointer;
  color: #3891eb;
  margin-right: 5px;
}
.fileItem .delete {
  margin-left: 5px;
  cursor: pointer;
  color: #67c23a;
}

.fileItem .recovery {
  margin-left: 5px;
  cursor: pointer;
  color: #e03a3a;
}

.fileItem .imgType {
  width: 16px;
  height: 16px;
}
.fileItem .deleted {
  text-decoration: line-through;
}
.tagSelect /deep/  .el-customDiv{
    border: none;
    padding-left: 6px;
}
</style>
