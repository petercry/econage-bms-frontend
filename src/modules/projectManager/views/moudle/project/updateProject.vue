<template>
    <div class="updateProject" v-loading="loading">
        <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
            <el-row style="padding:12px 10px;background-color:#fff;">
                <el-col :span="24" >
                    <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'项目卡片'"></eco-tool-title>
                    <el-button plain class="plainBtn toolBtn" v-show="!loading && editable && form.status == 'faw_pm_status_executing'" @click.native="stopProject"><i class="icon el-icon-remove-outline"></i>&nbsp;终止项目</el-button>
                    <el-button plain class="plainBtn toolBtn" v-show="!loading && editable && form.status == 'faw_pm_status_executing'" @click.native="closeProject"><i class="icon el-icon-circle-close"></i>&nbsp;关闭项目</el-button>
                    <el-button class="plainBtn toolBtn" type="primary" v-show="!loading && editable && form.status == 'faw_pm_status_draft'" style="color:#fff " @click.native="submitProject('tobepublish')"><i class="icon el-icon-document"></i>&nbsp;提 交</el-button>
                    <el-button class="plainBtn toolBtn" type="primary" v-show="!loading && editable && form.status == 'faw_pm_status_tobepublish'" style="color:#fff " @click.native="submitProject('executing')"><i class="icon el-icon-document"></i>&nbsp;发 布</el-button>
                </el-col>
            </el-row>
        </eco-content>
        <eco-content top="61px" bottom="60px" type="tool" style="padding:20px 0;background-color:#fff">
            <div class="mainTable">
                <table>
                    <tr>
                        <th>项目编码</th>
                        <td>{{form.code}}</td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'name') && form.status == 'faw_pm_status_tobepublish'">*</i>项目名称</th>
                        <td v-bind:class="{editable:editable && disabledItems.indexOf('name') == -1}">
                            <el-input v-if="editable && disabledItems.indexOf('name') == -1"  v-model.trim="form.name" style="width:100%;"></el-input>
                            <span v-else>{{form.name}}</span>
                        </td>
                    </tr>
                    <tr v-show="form.status == 'faw_pm_status_draft'">
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'rdType') && form.status == 'faw_pm_status_tobepublish'">*</i>研发项目类型</th>
                        <td v-bind:class="{editable:editable}">
                            <el-select v-if="editable" v-model="form.rdType" @change="getProductType" placeholder="请选择" style="width:98%;">
                                <el-option
                                v-for="(item,index) in baseData['faw_pm_rd_type']" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{getBaseDataTextByKey(form.rdType,"faw_pm_rd_type")}}</span>
                        </td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'industry') && form.status == 'faw_pm_status_tobepublish'">*</i>产业</th>
                        <td v-bind:class="{editable:editable}">
                            <el-select v-if="editable" v-model="form.industry" placeholder="请选择" @change="getProductType" style="width:98%;">
                                <el-option
                                v-for="(item,index) in baseData['faw_pm_industry']" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{getBaseDataTextByKey(form.industryItem,"faw_pm_industry")}}</span>

                        </td>
                    </tr>
                    <tr v-show="form.status == 'faw_pm_status_draft'">
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'productType') && form.status == 'faw_pm_status_tobepublish'">*</i>产品类别</th>
                        <td v-bind:class="{editable:editable}">
                            <el-select v-if="editable" v-model="form.productType" placeholder="请选择" style="width:98%;">
                                <el-option
                                v-for="(item,index) in productTypeItems" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{getBaseDataTextByKey(form.productType,"faw_pm_rd_type")}}</span>
                        </td>
                        <th>年份</th>
                        <td v-bind:class="{editable:editable}">
                            <el-date-picker v-if="editable" type="year" value-format="yyyy"  placeholder="选择年份" v-model="form.year" style="width: 100%;"></el-date-picker>
                            <span v-else>{{form.year}}</span>
                        </td>
                    </tr>
                    <tr>

                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'platform') && form.status == 'faw_pm_status_tobepublish'">*</i>产品平台</th>
                        <td v-bind:class="{editable:editable && disabledItems.indexOf('platform') == -1}">
                            <el-select filterable v-if="editable && disabledItems.indexOf('platform') == -1" v-model="form.platform" placeholder="请选择" style="width:98%;">
                                <el-option
                                v-for="(item,index) in baseData['faw_pm_platform']" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{getBaseDataTextByKey(form.platform,"faw_pm_platform")}}</span>
                        </td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'productionBase') && form.status == 'faw_pm_status_tobepublish'">*</i>项目所在地</th>
                        <td v-bind:class="{editable:editable && disabledItems.indexOf('productionBase') == -1}">
                            <el-select v-if="editable && disabledItems.indexOf('productionBase') == -1" v-model="form.productionBase" placeholder="请选择" style="width:98%;">
                                <el-option
                                v-for="(item,index) in baseData['faw_pm_production']" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{getBaseDataTextByKey(form.productionBase,"faw_pm_production")}}</span>
                        </td>
                    </tr>
                    <tr>

                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'type') && form.status == 'faw_pm_status_tobepublish'">*</i>项目类型</th>
                        <td v-bind:class="{editable:editable && disabledItems.indexOf('type') == -1}">
                            <el-select v-if="editable && disabledItems.indexOf('type') == -1" v-model="form.type" placeholder="请选择" style="width:98%;">
                                <el-option
                                v-for="(item,index) in baseData['faw_pm_type']" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{getBaseDataTextByKey(form.type,"faw_pm_type")}}</span>
                        </td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'pdtManagerId') && form.status == 'faw_pm_status_tobepublish'">*</i>PDT经理</th>
                        <td v-bind:class="{editable:editable}">
                            <tag-select
                                v-if="editable"
                                style="width: 98%;vertical-align: top;"
                                ref="tagSelect"
                                :initDataStr="initDataStr_PDT"
                                :initOptions="{selectNum:1,selectType:'USER'}"
                                @callBack="selectPDT" >
                            </tag-select>
                            <span v-else>{{form.pdtManagerName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'popId') && form.status == 'faw_pm_status_tobepublish'">*</i>POP</th>
                        <td v-bind:class="{editable:editable && disabledItems.indexOf('pop') == -1}">
                            <tag-select
                                v-if="editable &&disabledItems.indexOf('pop') == -1"
                                style="width: 98%;vertical-align: top;"
                                ref="tagSelect"

                                :initDataStr="initDataStr_POP"
                                :initOptions="{selectNum:1,selectType:'USER'}"
                                @callBack="selectPOP" >
                            </tag-select>
                            <span v-else>{{form.popName}}</span>
                        </td>
                        <th>项目创建人</th>
                        <td>{{form.createUserName}}</td>
                    </tr>
                    <tr>
                        <th>项目状态</th>
                        <td >

                            <span >{{getBaseDataTextByKey(form.status,"faw_pm_status")}}</span>
                        </td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'planGa') && form.status == 'faw_pm_status_tobepublish'">*</i>计划GA时间</th>
                         <td v-bind:class="{editable:editable}">
                            <el-date-picker v-if="editable" type="date" :clearable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.planGa" style="width: 100%;"></el-date-picker>
                            <span v-else>{{form.planGa}}</span>
                        </td>

                    </tr>
                    <tr>

                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'actualGa') && form.status == 'faw_pm_status_tobepublish'">*</i>实际GA时间</th>
                        <td v-bind:class="{editable:editable}">
                            <el-date-picker v-if="editable" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.actualGa" style="width: 100%;"></el-date-picker>
                            <span v-else>{{form.actualGa}}</span>
                        </td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'starting') && form.status == 'faw_pm_status_tobepublish'">*</i>首发车型</th>
                        <td v-bind:class="{editable:editable}">
                            <!-- <el-input v-if="editable" v-model.trim="form.starting" style="width:100%;"></el-input> -->
                            <el-select v-if="editable" clearable v-model="form.starting" placeholder="请选择" style="width:98%;">
                                <el-option
                                v-for="(item,index) in form.products" :key="index"
                                :label="item.name"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{form.starting}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>项目关闭时间</th>
                        <td>
                            {{form.closeDate}}
                        </td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'stage') && form.status == 'faw_pm_status_tobepublish'">*</i>项目阶段</th>
                        <td v-bind:class="{editable:editable}" >
                            <el-select v-if="editable" clearable v-model="form.stage" placeholder="请选择" style="width:98%;">
                                <el-option
                                v-for="(item,index) in baseData['faw_pm_stage']" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{getBaseDataTextByKey(form.stage,"faw_pm_stage")}}</span>
                        </td>
                    </tr>
                    <tr>

                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'ipd') && form.status == 'faw_pm_status_tobepublish'">*</i>是否为IPD项目</th>
                        <td v-bind:class="{editable:editable && form.status == 'faw_pm_status_draft'}" style="padding-left:15px;">
                            <el-radio-group v-if="editable && form.status == 'faw_pm_status_draft'" v-model="form.ipd">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>

                            </el-radio-group>
                            <span v-else>{{form.ipd?'是':'否'}}</span>
                        </td>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'costCode') && form.status == 'faw_pm_status_tobepublish'">*</i>项目费用号</th>
                        <td v-bind:class="{editable:editable && disabledItems.indexOf('costCode') == -1}">
                            <el-input v-if="editable && disabledItems.indexOf('costCode') == -1" v-model.trim="form.costCode" style="width:100%;"></el-input>
                            <span v-else>{{form.costCode}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'viewRange') && form.status == 'faw_pm_status_tobepublish'">*</i>项目查看范围</th>
                        <td colspan="3" v-bind:class="{editable:editable && disabledItems.indexOf('viewRange') == -1}" style="padding-left:15px;">
                            <el-checkbox-group :disabled="!editable || disabledItems.indexOf('viewRange') > -1" v-model="viewRangeArray" @change="viewRangeChange">
                                <el-checkbox v-for="(item,index) in baseData['faw_pm_view_range']" :key="index" :label="item.id">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </td>
                    </tr>
                    <tr v-show="form.status == 'faw_pm_status_draft' || form.status == 'faw_pm_status_tobepublish' ">
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'linkModel') && form.status == 'faw_pm_status_tobepublish'">*</i>关联基础模型</th>
                        <td colspan="3" v-bind:class="{editable:editable}">
                            <el-select v-if="editable" v-model="form.linkModel" placeholder="请选择" filterable clearable style="width:98%;">
                                <el-option
                                v-for="(item,index) in linkModelItems" :key="index"
                                :label="item.name"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <span v-else>{{linkModelItems.find(item=>item.id == form.linkModel)?linkModelItems.find(item=>item.id == form.linkModel).name:''}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th><i class="required" v-show="Object.prototype.hasOwnProperty.call(rules,'describe') && form.status == 'faw_pm_status_tobepublish'">*</i>项目描述</th>
                        <td colspan="3" v-bind:class="{editable:editable && disabledItems.indexOf('describe') == -1}">
                            <el-input  v-if="editable && disabledItems.indexOf('describe') == -1" type="textarea" v-model.trim="form.describe" placeholder="请输入描述" rows="3"></el-input>
                            <span v-else>{{form.describe}}</span>
                        </td>

                    </tr>
                    <tr style="width:100%" v-show="form.products && form.products.length>0">
                        <td colspan="4" style="padding:0;border:0">
                            <table class="neiqianTable">
                                <tr>
                                    <th witdh="33%" style="border-left:1px solid #e8e8e8">开发产品编号</th>
                                    <th witdh="33%">开发产品名称</th>
                                    <th witdh="33%">分摊比例</th>
                                </tr>
                                <tr v-for="(item,index) in form.products" :key="index" >
                                    <td v-bind:class="{editable:editable && false}">
                                        <el-input v-if="editable && false" v-model.trim="item.code"></el-input>
                                        <span v-else>{{item.code}}</span>
                                    </td>
                                    <td v-bind:class="{editable:editable && false }">
                                        <el-input v-if="editable && false " v-model.trim="item.name"></el-input>
                                        <span v-else>{{item.name}}</span>
                                    </td>
                                    <td v-bind:class="{editable:editable}">
                                        <el-input v-if="editable" v-model.trim="item.ratio"></el-input>
                                        <span v-else>{{item.ratio}}</span>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td colspan="3" v-bind:class="{editable:editable}">
                             <el-input v-if="editable" v-model.trim="form.comments"></el-input>
                             <span v-else>{{form.comments}}</span>
                        </td>

                    </tr>
                    <tr>
                        <th>文件上传</th>
                        <td colspan="3" class="editable" style="padding:10px 0 10px 15px;">
                            <span @click="goAttachementPage" v-if="editable" class="pointerClass"><i class="el-icon-paperclip"></i>上传文件（上传文件大小限制为2G）</span>
                            <ul class="fileList">
                                <li v-for="(item,index) in fileLists" :key="index" class="fileItem">
                                    <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span>
                                    <span style="cursor:pointer;" v-bind:class="item.operateFlag?'deleted':''">{{item.name}}&nbsp;</span><span>(&nbsp;{{item.size | sizeTostr}}&nbsp;)</span>
                                    <span class="download" @click="fileDownload(item)">下载</span>
                                    |<span class="preview" @click="filePreview(item)">预览</span>
                                    <span class="delete" v-show="!item.operateFlag && editable" @click="fileDelete(item,index)">[ 点击删除 ]</span>
                                    <span class="recovery" v-show="item.operateFlag && editable" @click="fileRecovery(item,index)">[ 点击恢复 ]</span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
        </eco-content>
        <div class="btn" style="text-align:center" >

            <el-button type="primary" size="medium"  @click="onSubmit">保 存</el-button>
        </div>

    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapGetters ,mapActions ,mapMutations} from 'vuex'
import {getEnumSelectEnabled,getFileListByModular,batchDeleteFiles,startBHWorkFlow,getWFOperateId,getPMModelRole} from '../../../api/common.js'
import {updateProject,getProjectInfo,closeProject,stopProject,getProductType} from '../../../api/project.js'
// import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import {getTemplatesInfoList} from '../../../api/templates.js'
import {EcoFile} from '@/components/file/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
  name:'updateProject',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      tagSelect
      //ecoFileUploadBtn
  },
  data() {
    return {
        form:{
            id:"",
            code:"",
            name:"",
            rdType:"",
            industry:"",
            productType:"",
            linkModel:"",
            platform:"",
            productionBase:"",
            type:"",
            //pdtManagerId:"1172011677126791169",
            //pdtManagerName:"产品技术中心-iBpm研发事业部-高文众",
            //popId:"1172011677126791169",
            //popName:"产品技术中心-iBpm研发事业部-高文众",
            pdtManagerId:"",
            pdtManagerName:"",
            popId:"",
            popName:"",
            budget:"",
            status:"",
            stage:"",
            product:"",
            starting:"",
            planGa:"",
            actualGa:"",
            closeDate:"",
            cancelDate:"",
            describe:"",
            comments:"",
            fileHeardId:"",
            products:[]
        },
        initDataStr_PDT:"",
        initDataStr_POP:"",
        fileName:"",
        modularInnerId:"",
        linkModelItems:[],
        productTypeItems:[],
        modular:"project_manager",
        fileLists:[],
        loading:true,
        roleMap:{},
        rules: {
           name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          rdType: [
            { required: true, message: '请选择研发项目类型', trigger: 'change' }
          ],
          industry: [
            { required: true, message: '请选择产业', trigger: 'change' }
          ],
          productType: [
            { required: true, message: '请选择产品类别', trigger: 'change' }
          ],
          platform: [
            { required: true, message: '请选择产品平台', trigger: 'change' }
          ],
          productionBase: [
            { required: true, message: '请选择项目所在地', trigger: 'change' }
          ],
          ipd:[
            { required: true, message: '请选择是否为IPD项目', trigger: 'change' }
          ],
          year:[
            { required: true, message: '请选择年份', trigger: 'change' },
            { required: true, message: '请选择年份', trigger: 'blur' }
          ],
          viewRangeArray:[
              { required: true, message: '请选择项目查看范围', trigger: 'change' }
          ]
        },
        viewRangeArray:[],
        disabledItems:[]
    }
  },
  created() {
      this.bindAction();
      this.getLinkModelItems();
      if(this.$route.params.infoId > 0){
        this.getProjectInfo();
        this.getFileListByModular();
        this.getPMModelRole();
     }
  },
  activated(){

  },

  mounted(){

  },

  computed: {
     ...mapGetters([
        'baseData',
        'getBaseDataTextByKey',
        'typeImgList'
      ]),
      editable(){
          if(this.roleMap.admin || this.roleMap.edit){
              if(this.form.status === 'faw_pm_status_draft' || this.form.status === 'faw_pm_status_tobepublish' || this.form.status === 'faw_pm_status_executing'){
                  return true;
              }else{
                  return false;
              }
          }else{
              return false;
          }
      },

  },
  filters:{
      sizeTostr(value){
          if(!value) return "0KB";
          return EcoUtil.getFileSize(value);
      }
  },
  methods: {
       ...mapMutations([
        'SET_PROJECT_INFO',
       ]),
      bindAction(){
          let that = this;
          let callBackDialogFunc = function(obj){
              if(obj && obj.action == 'onFileUploadActionCallBack'){ //附件上传回写
                    that.onFileUploadActionCallBack(obj.data);
              }
          }
           EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'updateProjectVue');
      },
      getProjectInfo(){
          this.loading = true;
          this.form.id = this.$route.params.infoId;
          getProjectInfo(this.form.id).then( res => {
              this.loading = false;
              this.form = res;
            //   if(!this.form.products) this.$set(this.form,"products",new Array);
            //     while(this.form.products.length < 3){
            //         let obj = {
            //             code:"",
            //             name:"",
            //             ratio:""
            //         }
            //         this.form.products.push(obj)
            //     }
            if(this.form.viewRange){
                if(this.form.viewRange.indexOf('faw_pm_view_range1') > -1){
                    this.$set(this.rules,"costCode",[{required:true,message:'请输入项目费用号',trigger:'blur'}]);
                }else{
                    this.$delete(this.rules,'costCode')
                }
                this.viewRangeArray = this.form.viewRange.split(',');
            }
            if(this.form.pdtManagerId){
                this.initDataStr_PDT = `{"type":"PERSONNEL","orgId":"${this.form.pdtOrgId}","linkId":"${this.form.pdtManagerId}"}`
            }
            if(this.form.popId){
                this.initDataStr_POP = `{"type":"PERSONNEL","orgId":"${this.form.popOrgId}","linkId":"${this.form.popId}"}`
            }
            this.form.year = this.form.year + "";
            this.getProductType();
            this.$emit('callback',res);
            //添加规则根据状态
            this.setRules();
          }).catch(e => {
              this.loading = false;
              console.log(e);
          })
      },
      getFileListByModular(){
           this.loading = true;
           getFileListByModular(this.modular,this.$route.params.infoId).then(res => {
               this.fileLists = res;
           })
      },
      getPMModelRole(){
          getPMModelRole(this.$route.params.infoId,'faw_pm_model_info').then(res=>{
              this.roleMap = res;
          })
      },
      selectPDT(data){
         if(data.itemArray.length > 0){
            this.form.pdtManagerId = data.itemArray[0].linkId;
            this.form.pdtManagerName = data.itemArray[0].name;
         }else{
            this.form.pdtManagerId = "";
            this.form.pdtManagerName = "";
            this.initDataStr_PDT = "";
         }
      },
      selectPOP(data){
         if(data.itemArray.length > 0){
            this.form.popId = data.itemArray[0].linkId;
            this.form.popName = data.itemArray[0].name;
         }else{
            this.form.popId = "";
            this.form.popName = "";
            this.initDataStr_POP = "";
         }
      },
      setRules(){
          if(this.form.status == 'faw_pm_status_tobepublish'){
              this.rules["planGa"] = [{required:true,message:'请选择计划GA时间',trigger:'change'}]
              this.rules["describe"] = [{required:true,message:'请输入项目描述',trigger:'blur'}]
              this.rules["stage"] = [{required:true,message:'请选择项目阶段',trigger:'change'}]
              this.rules["pdtManagerId"] = [{required:true,message:'请选择pdt经理',trigger:'change'}]
              this.rules["popId"] = [{required:true,message:'请选择pop',trigger:'change'}]
              this.rules["type"] = [{required:true,message:'请选择项目类型',trigger:'change'}]
          }else if(this.form.status == 'faw_pm_status_executing'){
              this.disabledItems = ['viewRange','costCode','pop','platform','name','productionBase','type','describe','platform']
          }

      },
      getLinkModelItems(){
          getTemplatesInfoList().then(res => {
              this.linkModelItems = res?res.rows:[];
          })
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        this.updateProject()
        this.updateFiles();
        //this.loading = true;

      },
      updateProject(){
        //   for(let key in this.form){
        //        if(this.rules.hasOwnProperty(key) && !this.form[key]){
        //            return EcoMessageBox.alert(this.rules[key][0].message,'提示');
        //        }
        //   }
          this.loading = true;
          let status = 'draft';
          if(this.form.status == 'faw_pm_status_tobepublish'){
              status = 'tobepublish';
          }else if(this.form.status == 'faw_pm_status_executing'){
              status = 'executing';
          }
          updateProject(this.form,status).then(res => {
            this.loading = false;
            this.$message({
                message: '保存成功！',
                showClose: true,
                duration:2000,
                type: 'success'
            });
          }).catch(e=>{
               this.loading = false;
          })
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
      fileChange(file, fileList){
          this.loading = true;
      },
      fileOnSuccess(response, file, fileList){
          this.loading = false;
          this.form.fileHeardId = response.id;
      },
      stopProject(){
        var that  = this;
        if(!this.fileLists || this.fileLists.length == 0) return EcoMessageBox.alert('请先上传文件','提示');
        let confirmYesFunc = function(){

            stopProject(that.form.id).then(res => {
                that.$message({
                    message: '停止成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                that.$emit("back");
            })
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要停止该项目吗?','提示',options,confirmYesFunc);

      },
      closeProject(){
        var that  = this;
        if(!this.fileLists || this.fileLists.length == 0) return EcoMessageBox.alert('请先上传文件','提示');
        if(!this.form.actualGa) return EcoMessageBox.alert('需填写实际GA时间','提示');
        let confirmYesFunc = function(){

            closeProject(that.form.id).then(res => {
                that.$message({
                    message: '关闭成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                that.$emit("back");
            })
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要关闭该项目吗?','提示',options,confirmYesFunc);
      },
      goAttachementPage(){
        let data = {};
        data.modular = this.modular;
        data.modularInnerId = this.form.id;
        if(window.sysEnv == 1){
            EcoUtil.getSysvm().onFileUpload(data);
        }else{
            EcoUtil.getSysvm().onFileUploadForEnv(data);
        }
      },
      onFileUploadActionCallBack(data){
          this.fileLists.push.apply(this.fileLists,data.fileLists);

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
      startWorkflow(){
          EcoUtil.getSysvm().showLoadingDiv('正在初始化... 请稍等');
          startBHWorkFlow(this.form.id).then(res =>{
              this.loading = false;
              this.form.status = 'faw_pm_status_approvaing';
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
      getProductType(){
          if(!this.form.industry || !this.form.rdType) return;
          getProductType(this.form).then(res => {
              this.productTypeItems = res;
          })
      },
      viewRangeChange(values){
          if(values.indexOf('faw_pm_view_range1') > -1){
              this.$set(this.rules,"costCode",[{required:true,message:'请输入项目费用号',trigger:'blur'}]);
          }else{
              this.$delete(this.rules,'costCode')
          }
          this.form.viewRange = values.join(',');
      },
      submitProject(status){
          for(let key in this.form){
               if(this.rules.hasOwnProperty(key) && !this.form[key]){
                   return EcoMessageBox.alert(this.rules[key][0].message,'提示');
               }
          }
          this.loading = true;
          updateProject(this.form,status).then(res=>{
            this.loading = false;
            this.form = res;
            let message = status == 'executing'?'发布成功!':'提交成功!';
            this.$message({
                message: message,
                showClose: true,
                duration:2000,
                type: 'success'
            });
            //添加规则
            this.SET_PROJECT_INFO(res);
            this.setRules();
          }).catch(e=>{
               this.loading = false;
          })
      }

  },
  watch:{

  },

};
</script>

<style scoped>
.updateProject{
    background: #fff;
    height:100%;
}
.updateProject .btn{
    text-align: right;
    padding: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ddd;
}
.updateProject .addForm{
    min-width: 800px;
    width: 60%;
    margin: 0 auto;
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    top: 90px;
    font-size: 0;
}
.updateProject .addForm .el-form-item{
    width:378px;
    border: 1px solid #ddd;
    margin: 0;
    line-height: 50px;
}
.updateProject .addForm .allItem{
    width: auto;
}
.updateProject .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.updateProject .toolBtn{
    margin:0 10px;
}
.updateProject .mainTable{
    min-width: 800px;
    width: 60%;
    margin: 0 auto;
}
.updateProject .mainTable table{
    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    font-size: 14px;
}
.updateProject .mainTable table tr{
    height: 50px;
    line-height: 1.5;
}
.updateProject .mainTable table th{
    background: #f0f0f0;
    padding-left: 15px;
    width: 130px;
    border:1px solid #e8e8e8;
    color: #0f1419 !important;
    position: relative;
}
.updateProject .mainTable table td{
    background: #fafafa;
    padding-left: 15px;
    border:1px solid #e8e8e8;
    word-break: break-all;
    color: #666;
}
.updateProject .mainTable table td.editable{
    background: #fff;
    padding: 0;
}
.updateProject table.neiqianTable th{
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
.updateProject i.required{
    color:red;
    position: absolute;
    top: 15px;
    left: 5px;
}
</style>
