<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent ref="content" top="0" bottom="0" style="padding:40px 200px 10px 20px;">
        <el-timeline style="position:fixed;top:100px;right:0;width:180px;" size="mini">
          <el-timeline-item
            v-for="item in activities"
            :key="item.id"
            hide-timestamp>
            <div slot="dot" :class="{dot:currentLineKey==item.id}"></div>
            <div class="cpoint timeLineText" :style="{color:currentLineKey==item.id?'#ED9440':'#333'}" @click="timeLineClick(item)">{{item.name}}</div>
          </el-timeline-item>
        </el-timeline>
        <el-button style="position:fixed; right:82px;" type="primary" @click.native="save">
          保存
          <i class="el-icon-check el-icon--right"></i>
        </el-button>
        <el-form class="itemForm" ref="form" :model="form" label-position="top">
          <div class="formblock inputBlock">
            <h3 class="h3">事项信息</h3>
            <el-form-item label="事项名称" prop="name" :rules="[
              { required: true, message: '事项名称不能为空'}
              ]">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="部门名称" prop="dept" :rules="[
                  { required: true, message: '部门为必选项'}
                  ]">
                  <div class="display-input ellipsis"  @click="openDeptChooser">
                    {{form.deptName||form.dept}}
                    <!-- <el-tag
                      v-if="form.deptObj.orgPath"
                      closable
                      type="info"
                      @close="form.deptObj={orgPath:''};form.dept='';">
                      {{form.deptObj.orgPath}}
                    </el-tag> -->
                  </div>
                  <!-- <el-input v-model="form.dept"></el-input> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主题" prop="titleId" :rules="[
                  { required: true, message: '主题为必选项'}
                  ]">
                  <el-select style="width:100%" v-model="form.titleId" placeholder="请选择主题">
                    <el-option
                      v-for="item in titleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="接入代码">
                  <el-input v-model="form.linkAppCode"></el-input>
                </el-form-item> -->
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="是否接入自有模块">
                  <el-radio v-model="form.innerInteraction" :label="true">是</el-radio>
                  <el-radio v-model="form.innerInteraction" :label="false">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="!form.innerInteraction" label="接入系统">
                  <el-select style="width:100%" v-model="form.linkAppId" placeholder="请选择系统">
                    <el-option
                      v-for="item in appList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="form.innerInteraction" label="内部可用模块">
                  <el-select style="width:100%" v-model="form.interactionModularId" placeholder="请选择系统">
                    <el-option
                      v-for="item in interactionModularList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="PC端办理标识">
              <el-input v-model="form.handleUrl4Pc"></el-input>
            </el-form-item>
            <el-form-item label="移动端办理标识">
              <el-input v-model="form.handleUrl4Mobile"></el-input>
            </el-form-item>
            <!-- <el-form-item label="是否属于多部门联办事项">
                <el-radio v-model="form.extPropsObj.MULTI_DEPT" label="Y">是</el-radio>
                <el-radio v-model="form.extPropsObj.MULTI_DEPT" label="N">否</el-radio>
            </el-form-item> -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="是否属于常用事项">
                  <!-- <el-checkbox-group v-model="form.aaa"> -->
                    <el-radio v-model="form.attr2" label="Y">是</el-radio>
                    <el-radio v-model="form.attr2" label="N">否</el-radio>
                  <!-- </el-checkbox-group> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否属于多部门联办事项">
                  <!-- <el-checkbox-group v-model="form.aaa"> -->
                    <el-radio v-model="form.attr6" label="Y">是</el-radio>
                    <el-radio v-model="form.attr6" label="N">否</el-radio>
                  <!-- </el-checkbox-group> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="操作方式">
                  <!-- <el-checkbox-group v-model="form.aaa"> -->
                    <el-checkbox v-model="form.enableHandleGuide">办事指南</el-checkbox>
                    <el-checkbox v-model="form.enableHandleOnline">在线办理</el-checkbox>
                    <el-checkbox v-model="form.enableHandleOnMobile">掌上办理</el-checkbox>
                  <!-- </el-checkbox-group> -->
                </el-form-item>    
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <span slot="label">&nbsp;</span>
                    <el-select style="width:100%" v-model="form.handleMethod" placeholder="请选择">
                      <el-option
                        v-for="(item,key) in HandleMethodEnum"
                        :key="key"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item v-if="form.handleMethod == 'SHOW_TIPS'||form.handleMethod == 'SHOW_TIPS_AND_HANDLE'" label="提示内容">
              <editor-bar :content="form.handleTips" @on-change="contentChange($event,form,'tip')"></editor-bar>
            </el-form-item>
            <el-form-item label="主项" prop="groupId" :rules="[
                  { required: true, message: '主项为必选项'}
                  ]">
              <div style="position:relative;padding-right:120px;">
                <el-select style="width:100%" clearable v-model="form.groupId" placeholder="请选择主项">
                  <el-option
                    v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button style="position:absolute;right:0;bottom:0;" type="primary" plain @click.native="addGroup">
                  <i class="el-icon-plus"></i>
                  添加主项
                </el-button>
              </div>
            </el-form-item>
            <!-- <el-form-item label="其他">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="form.desc">
              </el-input>
            </el-form-item> -->
          </div>
          <div class="formblock inputBlock">
            <h3 class="h3">基本信息</h3>
            <table class="service-table"> 
              <tbody>
                <tr>
                  <th>办事对象</th>
                  <td colspan="3">
                    <el-input placeholder="请输入内容" v-model="form.extPropsObj.appObj" clearable></el-input>
                  </td>
                </tr>
                <tr>
                  <th style="min-width:120px">受理机构</th>
                  <td><el-input placeholder="请输入内容" v-model="form.extPropsObj.workComp" clearable></el-input></td>
                  <th style="min-width:120px">经办科室</th>
                  <td><el-input placeholder="请输入内容" v-model="form.extPropsObj.workDept" clearable></el-input></td>
                </tr> 
                <tr>
                  <th>决定机构</th>
                  <td colspan="3"><el-input placeholder="请输入内容" v-model="form.extPropsObj.resultDept" clearable></el-input></td>
                </tr>
                <tr>
                  <th>办结时限</th>
                  <td>
                    <!-- <el-input placeholder="请输入内容" v-model="form.extPropsObj.appLimitTime" clearable>
                        <template slot="prepend">承诺期限：</template>
                    </el-input> -->
                    <el-input placeholder="请输入内容" v-model="form.extPropsObj.lawLimitTime" clearable>
                        <!-- <template slot="prepend">法定期限：</template> -->
                    </el-input>
                     <!-- <el-select v-model="form.extPropsObj.appLimitTime" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in TIME_LIMIT" :key="item.id" :label="item.text" :value="item.id"></el-option>
                      </el-select> -->
                  </td>
                  <th>送达方式</th>
                  <td>
                    <!-- <el-input placeholder="请输入内容" v-model="form.extPropsObj.resultLimit" clearable>
                        <template slot="prepend">送达时限：</template>
                    </el-input> -->
                    <el-input style="margin-top:10px;" placeholder="请输入内容" v-model="form.extPropsObj.resultType" clearable>
                        <!-- <template slot="prepend">送达方式：</template> -->
                    </el-input>
                    <!-- <el-select v-model="form.extPropsObj.resultType" placeholder="请选择" style="width:100%">
                      <el-option v-for="item in RESULT_DELIVERY" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select> -->
                    <!-- <div class="el-input el-input--mini el-input-group el-input--suffix s-selectHasLabel" style="margin-top:10px;"> -->
                      <!-- <div class="el-input-group__prepend">送达方式：</div> -->
                      <!-- <el-select v-model="form.extPropsObj.resultType" placeholder="请选择" style="width:100%;">
                        <el-option v-for="item in RESULT_DELIVERY" :key="item.id" :label="item.text" :value="item.id"></el-option>
                      </el-select> -->
                    <!-- </div> -->
                  </td>
                </tr> 
                <!-- <tr>
                  <th>申请方式</th>
                  <td colspan="3">
                    <el-select v-model="form.extPropsObj.appType" placeholder="请选择" style="width:100%">
                      <el-option v-for="item in APP_METHOD" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                  </td>
                </tr> -->
                <tr>
                  <th>咨询电话</th>
                  <td><el-input placeholder="请输入内容" v-model="form.extPropsObj.askPhone" clearable></el-input></td>
                  <th>监督电话</th>
                  <td><el-input placeholder="请输入内容" :value="'0571-82812345 转最多跑一次专席'" disabled></el-input></td>
                </tr>
                <!-- <tr>
                    <th>办公地址</th>
                    <td colspan="3"><el-input placeholder="请输入内容" v-model="form.extPropsObj.workPlace" clearable></el-input></td>
                </tr>
                <tr>
                    <th>办公时间</th>
                    <td colspan="3"><el-input placeholder="请输入内容" v-model="form.extPropsObj.workTime" clearable></el-input></td>
                </tr> -->
                <tr>
                    <th >办公地址、时间</th>
                    <td colspan="3">
                      <!-- <el-input placeholder="请输入内容" v-model="form.extPropsObj.workPlaceArr" clearable></el-input> -->
                      <el-table
                        :data="form.extPropsObj.workPlaceArr"
                        :show-header="true"
                        style="width: 100%"
                        >
                        
                        <el-table-column label="办公地址" min-width="140px">
                          <template  slot-scope="scope" >
                            <el-input type="textarea" v-model="scope.row.place" placeholder="请输入"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="办公时间" min-width="100px">
                          <template  slot-scope="scope" >
                            <el-input type="textarea" v-model="scope.row.time" placeholder="请输入"></el-input>
                          </template>
                        </el-table-column>
                        
                        <el-table-column width="100">
                        <template slot-scope="scope">
                          <div>
                            <div style="text-align:center;">
                            <el-button type="text" style="color:#E37087;" @click.native="delPlace(scope.row,form.extPropsObj.workPlaceArr)">删除行<i class="el-icon-delete"></i></el-button>
                            </div>
                          </div>
                        </template>
                        </el-table-column>
                        <div slot="append" style="text-align:center;">
                          <el-button type="text" @click.native="addPlace(form.extPropsObj.workPlaceArr)">添加 <i class="el-icon-circle-plus-outline"></i></el-button>
                        </div>
                      </el-table>
                    </td>
                </tr>
                <tr>
                    <th>是否属于跑一次事项</th>
                    <td>
                      <el-select v-model="form.extPropsObj.isRunOne" placeholder="请选择" style="width:100%">
                        <el-option label="是" value="Y"></el-option>
                        <el-option label="否" value="N"></el-option>
                      </el-select>
                      <!-- <el-radio v-model="form.extPropsObj.isRunOne" label="Y">是</el-radio> -->
                      <!-- <el-radio v-model="form.extPropsObj.isRunOne" label="N">否</el-radio> -->
                    </td>
                    <th>是否属于跑零次事项</th>
                    <td>
                      <el-select v-model="form.extPropsObj.isRunZero" placeholder="请选择" style="width:100%">
                        <el-option label="是" value="Y"></el-option>
                        <el-option label="否" value="N"></el-option>
                      </el-select>
                      <!-- <el-radio v-model="form.extPropsObj.isRunZero" label="Y">是</el-radio> -->
                      <!-- <el-radio v-model="form.extPropsObj.isRunZero" label="N">否</el-radio> -->
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
          <template v-for="item in activities" >
            <div class="formblock inputBlock" v-if="item.id!='0'&&item.id!='-1'" :key="item.id">
              <h3 class="h3">{{item.name}}</h3>
              <template v-for="detailText in form.detailTexts" >
                <el-form-item :key="detailText.entryId" v-if="item.enableText&&detailText.entryId==item.id">
                  <editor-bar :content="detailText.textIn" @on-change="contentChange($event,detailText)"></editor-bar>
                </el-form-item>
              </template>
              <template v-for="detailFile in fileList" >
                <el-form-item label="附件信息" :key="detailFile.entryId" v-if="item.enableFile&&detailFile.entryId==item.id">
                  <div class="formlabel" slot="label">附件信息<span class="desc">(如不上传附件，则为纯文本)</span></div>
                  <!-- <el-button style="position:absolute;right: 40px;top: -26px;" type="text" @click.native="addFile(null,detailFile)"><i class="el-icon-circle-plus-outline"></i></el-button> -->
                  <el-table
                    :data="detailFile.list"
                    :show-header="true"
                    style="width: 100%">
                    <el-table-column label="材料名称" min-width="140px">
                      <template  slot-scope="scope" >
                        <el-input v-model="scope.row.fileDesc" placeholder="请输入"></el-input>
                        <ecoFileUploadSingle style="margin-top:10px;" :modularInnerId="scope.row.id" modular="PORTAL1_ITEM_DETAIL_FILE" ref="ecoFileUploadRef"></ecoFileUploadSingle>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="材料出具描述" min-width="140px">
                      <template  slot-scope="scope" >
                        <el-input type="textarea" v-model="scope.row.extPropsObj.materialIssueDesc" placeholder="请输入"></el-input>
                      </template>
                    </el-table-column> -->
                    <el-table-column label="材料形式" width="108px">
                      <template slot-scope="scope"> 
                        <el-select v-model="scope.row.extPropsObj.materialType" placeholder="请选择" style="width:100%">
                          <el-option v-for="item in MATERIAL_FORM" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                       </template>
                    </el-table-column>
                    <!-- <el-table-column label="材料详细要求" min-width="140px">
                      <template  slot-scope="scope" >
                        <el-input type="textarea" v-model="scope.row.extPropsObj.materialRequirements" placeholder="请输入"></el-input>
                      </template>
                    </el-table-column> -->
                    <el-table-column label="材料数量" width="100px">
                      <template  slot-scope="scope" >
                        <el-input v-model="scope.row.extPropsObj.commitmentNum"></el-input>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="法定份数" width="100px">
                      <template  slot-scope="scope" >
                        <el-input v-model="scope.row.extPropsObj.legalNum"></el-input>
                      </template>
                    </el-table-column> -->
                    <el-table-column label="备注" min-width="140px">
                      <template  slot-scope="scope" >
                        <el-input type="textarea" v-model="scope.row.comments" placeholder="请输入"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column width="160">
                    <template slot-scope="scope">
                      <div>
                        <el-input v-model="scope.row.butDesc" placeholder="请输入下载按钮描述"></el-input>
                        <!-- <el-button type="text" @click.native="addFile(scope.row,detailFile)"><i class="el-icon-circle-plus-outline"></i></el-button> -->
                        <div style="text-align:center;">
                        <el-button type="text" style="color:#E37087;" @click.native="delFile(scope.row,detailFile.list)">删除行<i class="el-icon-delete"></i></el-button>
                        </div>
                      </div>
                    </template>
                    </el-table-column>
                    <div slot="append" style="text-align:center;">
                      <el-button type="text" @click.native="addFile(null,detailFile)">添加 <i class="el-icon-circle-plus-outline"></i></el-button>
                    </div>
                  </el-table>
                </el-form-item>
              </template>
            </div>
          </template>
          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
              <i class="el-icon-check el-icon--right"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getDetailEntry,getTitleList4create,getGroupList4createByTitle,updateItem,getAppList,getItemInnerInteractionModList,getItemFileFetchId,getItemSingle,getEnumUpdateEnabled,getItemHandleMethodEnum} from '@/modules/portal1/service/service.js'
import {mapMutations} from 'vuex'
import EcoOrgPick from '@/components/orgPick/main.js'
import EcoUtil from '@/components/util/main.js'
import EditorBar from '@/components/wangeditor/EditorBar.vue'
import ecoFileUploadSingle from '@/components/file/ecoFileUploadSingle.vue'
export default{
  name:'itemEdit',
  components:{
    ecoLoading,
    ecoContent,
    EditorBar,
    ecoFileUploadSingle
  },
  data(){
    return {
      activities: [],
      currentLineKey:'-1',
      titleList:[],
      groupList:[],
      appList:[],
      fileList:[],
      form:{
        name:'', 
        dept:'', 
        deptName:'', 
        // deptObj:{
        //   orgPath:''
        // },
        titleId:'', 
        linkAppId:'', 
        linkAppCode:'', 
        handleUrl4Pc:'', 
        handleUrl4Mobile:'', 
        enableHandleGuide:true, 
        enableHandleOnline:false, 
        enableHandleOnMobile:false, 
        groupId:'', 
        handleMethod:'',
        handleTips:'',
        innerInteraction:false,
        interactionModularId:'',
        desc:'', 
        attr2:'N',
        attr6:'N',
        detailTexts:[], 
        detailFiles:[],
        extProps:[],
        extPropsObj:{
          appObj:'',
          workComp:'',
          workDept:'',
          resultDept:'',
          appLimitTime:'',
          lawLimitTime:'',
          resultLimit:'',
          resultType:'',
          appType:'',
          askPhone:'',
          complaintPhone:'',
          workPlaceArr:[],
          workPlace:'',
          workTime:'',
          isRunOne:'N',
          isRunZero:'N',
          MULTI_DEPT:'N',
        },
        extOrgs:[],
      },
      APP_METHOD:[],//申请方式
      MATERIAL_FORM:[],//材料形式
      RESULT_DELIVERY:[],//送达方式
      TIME_LIMIT:[],//办结时限
      interactionModularList:[],
      HandleMethodEnum:{},
    }
  },
  mounted(){
    this.getDetailEntry();
    this.getTitleList4create();
    this.getAppList();

    this.getItemInnerInteractionModList();
    this.getItemHandleMethodEnum();
    this.getEnumUpdateEnabled('APP_METHOD');
    this.getEnumUpdateEnabled('MATERIAL_FORM');
    this.getEnumUpdateEnabled('RESULT_DELIVERY');
    this.getEnumUpdateEnabled('TIME_LIMIT');

    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.setScroll();
  },
  methods: {
    getItemHandleMethodEnum(){
      getItemHandleMethodEnum().then(res=>{
        this.HandleMethodEnum = res.data;
        this.form.handleMethod = 'HANDLE_DIRECTLY';
      }).catch(e=>{})
    },
    getItemInnerInteractionModList(){
      getItemInnerInteractionModList().then(res=>{
        if (res.data){
          this.interactionModularList = res.data;
        }
      }).catch(e=>{})
    },
    getItemSingle(){//在获取分块后再执行
      let id = this.$route.params.id;
      getItemSingle(id).then(res=>{
          console.log(res.data)
        if (res.data){
          this.form.name = res.data.name;
          this.form.dept = res.data.dept;
          this.form.deptName = res.data.deptName;
          this.form.titleId = res.data.titleId;
          this.form.linkAppId = res.data.linkAppId;
          this.form.linkAppCode = res.data.linkAppCode;
          this.form.handleUrl4Pc = res.data.handleUrl4Pc;
          this.form.handleUrl4Mobile = res.data.handleUrl4Mobile;
          this.form.enableHandleGuide = res.data.enableHandleGuide;
          this.form.enableHandleOnline = res.data.enableHandleOnline;
          this.form.enableHandleOnMobile = res.data.enableHandleOnMobile;
          this.form.groupId = res.data.groupId;
          this.form.desc = res.data.desc;
          this.form.handleMethod = res.data.handleMethod;
          this.form.handleTips = res.data.handleTips;
          this.form.innerInteraction = res.data.innerInteraction;
          this.form.interactionModularId = res.data.interactionModularId;
          this.form.attr2 = res.data.attr2;
          this.form.attr6 = res.data.attr6;
          try {
            this.form.detailTexts = this.form.detailTexts.map(item=>{
              for (let i = 0;i<res.data.detailTexts.length;i++){
                if (res.data.detailTexts[i].entryId == item.entryId){
                  res.data.detailTexts[i].textIn = res.data.detailTexts[i].text;
                  return res.data.detailTexts[i];
                }
              }
              return item;
            })
          } catch (error) {
            
          }
          // res.data.detailTexts.map(item=>{
          //   item.createDate=null;
          //   item.modDate=null;
          //   return item;
          // });
          this.form.detailFiles = (res.data.detailFiles||[]).map(item=>{
            item.createDate=null;
            item.modDate=null;
            return item;
          });
          this.fileList = this.activities.map(item=>{
            let obj = {};
            obj.list = (res.data.detailFiles||[]).filter(item2=>{
              if (item2.entryId==item.id){
                return true;
              }
              return false;
            }).map(item=>{
              item.createDate=null;
              item.modDate=null;
              let obj = {
                id:item.id,
                entryId:item.entryId,
                // materialIssueDesc:'',
                // materialType:'',
                // materialRequirements:'',
                // commitmentNum:'',
                // legalNum:'',
                comments:item.comments,
                fileDesc:item.fileDesc,
                butDesc:item.butDesc,
                extProps:item.extProps,
                extPropsObj:{
                  materialIssueDesc:'',
                  materialType:'',
                  materialRequirements:'',
                  commitmentNum:'',
                  legalNum:'',
                }
              }
              for (let j=0;j<item.extProps.length;j++){
                let Prop = item.extProps[j];
                obj.extPropsObj[Prop.key] = Prop.val;
              }
              return obj;
            });
            obj.entryId = item.id;
            return obj;
          })

          this.form.extProps = res.data.extProps;
          for (let j=0;j<res.data.extProps.length;j++){
            let item = res.data.extProps[j];
            if (item.key=='workPlaceArr'){
              try {
                this.form.extPropsObj[item.key] = JSON.parse(item.val);
              } catch (error) {}
            }else{
              this.form.extPropsObj[item.key] = item.val;
            }
          }
        }
      }).catch(e=>{})
    },
    getEnumUpdateEnabled(id){
      getEnumUpdateEnabled(id).then(res=>{
        this[id] = res.data;
      }).catch(e=>{})
    },
    contentChange(content,item,key){
      if (key&&key=='tip'){
      item.handleTips = content;
      }else{
      item.text = content;  
      }
    },
    setScroll(){
      let that = this;
      let $content = this.$refs.content.$el;
      let h3s =  document.getElementsByClassName('h3');
      $content.onscroll=(e)=>{
        let elem = e.target||e.srcElement;
        let pageBottomY = elem.scrollTop+elem.clientHeight;
        let index=0;
        for (let i=0;i<h3s.length;i++){
          let elH3 = h3s[i];
          let elemBottomY = elH3.offsetTop+elH3.clientHeight;
          if (elemBottomY<pageBottomY){
            index = i
          }else{
            break;
          }
        }
        that.currentLineKey = that.activities[index].id;
      }
    },
    timeLineClick(item){
      let $content = this.$refs.content.$el;
      let h3s =  document.getElementsByTagName('h3');
      let elH3 = Array.prototype.filter.call(h3s, function(node){
        return item.name==node.innerText;
      });
      if (elH3[0]){
        let elem = elH3[0];
        let elemBottomY = elem.offsetTop+elem.clientHeight-50;
        $content.scrollTo(0,elemBottomY);
      }
      this.$nextTick(()=>{
        this.currentLineKey=item.id;
      })
    },
    addMonitor(){
      let callBackDialogFunc = function(obj){
          if(obj && (obj.action == 'groupUpdateCallBack')){ //回调的唯一标识符
            window.ecoFrameVm.getGroupList4createByTitle()
          }
      }
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    getDetailEntry(){
      getDetailEntry().then((res)=>{
        if (res.data){
          this.activities = [{id:"-1",name:'事项信息'},{id:"0",name:'基本信息'}].concat(res.data);
          this.form.detailTexts = res.data.map(item=>{
            let obj = {};
            obj.text = '';
            obj.textIn = '';
            obj.entryId = item.id;
            return obj;
          })
          this.getItemSingle();
          // this.fileList = res.data.map(item=>{
          //   let obj = {};
          //   obj.list = [];
          //   obj.entryId = item.id;
          //   return obj;
          // })
        }
      }).catch(e=>{})
    },
    getTitleList4create(){
      getTitleList4create().then((res)=>{
        if (res.data&&res.data.rows){
          this.titleList = res.data.rows;
        }
      }).catch(e=>{})
    },
    getGroupList4createByTitle(){
      let titleId = this.form.titleId;
      getGroupList4createByTitle(titleId).then(res=>{
        if (res.data){
          this.groupList = res.data;
        }
      }).catch(e=>{})
    },
    getAppList(){
      getAppList().then(res=>{
        if (res.data){
          this.appList = res.data;
        }
      }).catch(e=>{})
    },
    openDeptChooser(){
      var that  = this;
      let options = {
          selectMulti:false,
          selectType:'Dept',
          selectDefault:that.form['dept'],
          deptScopeType:'BUSINESS',
      }

      
      let callBack = function(callObj){
        that.form['dept'] = callObj.resourceId;
        that.form['deptName'] = callObj.orgPath;
        // that.form['deptObj'] = callObj;
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    addFile(item,fileObj){
      getItemFileFetchId().then(res=>{
        if (res.data){
          let obj = {
            id:res.data+'',
            entryId:fileObj.entryId,
            // materialIssueDesc:'',
            // materialType:'',
            // materialRequirements:'',
            // commitmentNum:'',
            // legalNum:'',
            comments:'',
            fileDesc:'',
            butDesc:'',
            extProps:[],
            extPropsObj:{
              materialIssueDesc:'',
              materialType:'',
              materialRequirements:'',
              commitmentNum:'',
              legalNum:'',
            }
            // fileName:''
          }
          if (item==null){
            fileObj.list.push(obj);
          }else{
            let index = 0;
            for (let i = 0; i < fileObj.list.length; i++) {
              const element = fileObj.list[i];
              index = i+1;
              if (element.id==item.id){
                break;
              }
            }
            fileObj.list.splice(index,0,obj)
          }
        }
      }).catch(e=>{})
    },
    delFile(item,list){
      let index = 0;
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        index = i;
        if (element.id==item.id){
          break;
        }
      }
      list.splice(index,1);
    },
    addPlace(list){
      list.push({
        place:'',
        time:''
      });
    },
    delPlace(item,list){
      let index = 0;
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        index = i;
        if (element.place==item.place){
          break;
        }
      }
      list.splice(index,1);
    },
    addGroup(){
      if (this.form.titleId){
        // this.$router.push({
        //   name:'groupAdd',
        //   params:{
        //     theme:this.form.titleId
        //   }
        // })
        // return ;
        window.parent.sysvm.openDialog('添加主项',
        '/portal1/index.html#/groupAdd/'+this.form.titleId,700,450);
      }else{
        this.$message({
          type:"info",
          message:'请先选择主题'
        })
      }
    },
    setDetailFiles(){
      let arr = [];
      this.fileList.map(item=>{
        arr = arr.concat(item.list.map(item=>{
          let obj = item.extPropsObj;
          let arr2 = [];
          for(var i in obj) {
            arr2.push({
              key:i,
              val:obj[i]
            })
          }
          item.extProps = arr2;
          return item;
        }))
        return item;
      })
      this.form.detailFiles = arr;
    },
    setExtProps(){
      let obj = this.form.extPropsObj;
      let arr = [];
      for(var i in obj) {
        if ((typeof obj[i])=='string' ){
          arr.push({
            key:i,
            val:obj[i]
          })
        }else{
          arr.push({
            key:i,
            val:JSON.stringify(obj[i]) 
          })
        }
      }
      this.form.extProps = arr;
    },
    save(){
      let id = this.$route.params.id;
      this.setDetailFiles();
      this.setExtProps();
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            updateItem(id,this.form).then((res)=>{
              if (res.data&&res.data.id){
                try {
                  this.$message({type: 'success',message: '编辑成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'itemUpdateCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
                } catch (error) {
                }
              }else{
                this.$refs.ecoLoadingRef.close();
                this.$message({type: 'error',message: '编辑失败！'});
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '编辑失败！'});
            })
          } else {
            return false;
          }
      });
    }
  },
  watch: {
    'form.titleId'(val,oldval){
      if (oldval!=''){
        this.form.groupId = '';
      }
      this.getGroupList4createByTitle();
    }
  }
}
</script>
<style>
.dot{
  height: 10px;
  width: 10px;
  border-radius: 5px;
  border: 2px solid #ED9440;
  background-color: #fff;
  box-sizing: border-box;
}
.timeLineText:hover{
  color: #ED9440;
}
.itemForm .el-form-item__label{
  padding: 4px 0 0;
}
.formblock{
  padding-bottom: 20px;
}
.formblock>h3{
  line-height: 14px;
  height: 14px;
  padding-left: 12px;
  border-left: 6px solid #ED9440;
  color: #ED9440;
  font-weight: 500;
  margin: 16px 0;
}
.formlabel>.desc{
  font-size: 12px;
  color: #aaa;
}
</style>
