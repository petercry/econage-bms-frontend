<template>
    <eco-content top='0px' bottom='0px ' type='tool' style='background-color: #f5f5f5;'>
        <div class="flowHistory" v-loading='loading'>
            <!-- <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                   <el-col>
                       <strong>流程历史记录</strong>
                   </el-col>
                </el-row>
            </eco-content>  -->
            <eco-content top='0px' bottom='0px' style='padding:10px 15px;border:1px solid #ddd;' v-if='pageType==="flowList"'>
                <el-table ref='historyTab'  stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column label='序号' type='index'>
                        <!-- <template slot-scope='scope'>
                            {{(baseInfo.page-1*baseInfo.rows)+(scope.$index+1)}}
                        </template> -->
                    </el-table-column>
                    <el-table-column prop='taskName' label='流程环节'></el-table-column>
                    <el-table-column prop='taskAssigneeName' label='环节操作人'></el-table-column>
                    <el-table-column prop='actionTime' label='操作时间'></el-table-column>
                    <el-table-column prop='opinion' label='审批意见' width='250' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='approveDesc' label='审批结果'></el-table-column>
                </el-table> 
            </eco-content>
            <eco-content top='0px' bottom='0px' style='padding:10px 15px;' v-else>
                <el-form :model='formData' ref='regulatoryForm' :rules='rules'  label-position='right' label-width='130px'>
                    <div class='rowTitle'>法规信息</div>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='分类:' prop='category'>
                                <span class="viewContent">{{restData(formData.category,'category')}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='子类:' prop='subCategory'>
                                <span class="viewContent">{{restData(formData.subCategory,'subCategory')}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='法规编号:' prop='regulationCode'>
                                <span class="viewContent">{{formData.regulationCode}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='法规名称:' prop='regulationName'>
                                <span class="viewContent">{{formData.regulationName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='法规版本:' prop='regulationVersion'>
                                <span class='viewContent'>{{formData.regulationVersionName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='相关网址' prop='url'>
                                <span class='viewContent'>{{formData.url}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='23'>
                            <el-form-item label='标准简介:' prop='introduction'>
                                <span class="viewContent">{{formData.introduction||'暂无填写'}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style='margin-bottom:18px;'>
                        <el-col :span='3' class='tableRow'>
                            <span>实施时间:</span>
                        </el-col>
                        <el-col :span='20' style='padding-left:15px;box-sizing:border-box;'>
                            <el-table :data='infoList' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}" :cell-style="{textAlign:'center'}">
                                <el-table-column label='序号' type='index' width='50'></el-table-column>
                                <el-table-column prop='nt' label='NT' width='150'>
                                    <template slot-scope='scope'>
                                        <span class="viewContent">{{scope.row.nt}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop='ntComment' label='NT备注' width='200'>
                                    <template slot-scope='scope'>
                                        <span class="viewContent">{{scope.row.ntComment}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop='tt' label='TT' width='150'>
                                    <template slot-scope='scope'>
                                        <span class="viewContent">{{scope.row.tt}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop='ttComment' label='TT备注'>
                                    <template slot-scope='scope'>
                                        <span class="viewContent">{{scope.row.ttComment}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='法规状态:' prop='standardStatus'>
                                <span class="viewContent">{{restData(formData.standardStatus,'standardStatus')}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='性质:' prop='nature'>
                                <span  class="viewContent">{{restData(formData.nature,'nature')}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='适用整车/零部件:' prop='applicableType'>
                                <span  class="viewContent">{{restData(formData.applicableType,'applicableType')}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='认证管理分类:' prop='certificationTypeItems'>
                                <span  class="viewContent">{{restData(formData.certificationTypeItems,'certificationTypeItems')}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='23'>
                            <el-form-item label='适用车型:' prop='carModelItems'>
                                <span  class="viewContent">{{restData(formData.carModelItems,'carModelItems')}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='23'>
                            <el-form-item label='动力类型:' prop='powerTypeItems'>
                                <span  class="viewContent">{{restData(formData.powerTypeItems,'powerTypeItems')}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='23'>
                            <el-form-item label='气体燃料专用:' prop='gasFuelItems'>
                                <span class="viewContent">{{restData(formData.gasFuelItems,'gasFuelItems')}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='23'>
                            <el-form-item label='法规文档:'>
                                <upload :isEdit='false' :showList='true' :multiple="false" :modular="modular" :modularInnerId="regulatoryModularInnerId"
                                    @fileChange="fileChange" @preView='preView'  accept=''>
                                    <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                        <i class="el-icon-plus"></i> 上传附件</el-button>
                                </upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='23'>
                            <el-form-item label='相关文件(编制说明、解读材料等):'>
                                <upload :isEdit='false' style='margin-top:15px;' :showList='true' :multiple="false" :modular="modular2" :modularInnerId="regulatoryModularInnerId"
                                    @preView='preView' @fileChange="fileChange"  accept=''>
                                    <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                        <i class="el-icon-plus"></i> 上传附件</el-button>
                                </upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class='rowTitle'>法规政策起草单位信息</div>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='联系人:' prop='contactPerson'>
                                <span class='viewContent'>{{formData.contactPerson||'暂无填写'}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label='联系人单位:' ref='selectDept' prop='contactUnit'>
                                <span  class='viewContent'>{{formData.contactUnit||'暂无填写'}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='联系方式:' prop='contactDetails'>
                                <span  class='viewContent'>{{formData.contactDetails||'暂无填写'}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class='rowTitle'>RP-CFT</div>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label='法规负责人:' prop='regulationLeader' ref='selectRegulation'>
                                <span  class='viewContent'>{{formData.regulationLeaderName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='23' style='padding-left:40px;box-sizing: border-box;'>
                            <el-table :data='infoListTwo' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}" :cell-style="{textAlign:'center'}">
                                <el-table-column prop='deptInitDataStr' label='部门' width='160'>
                                    <template slot-scope='scope'>
                                        <tag-select disabled placeholder="选择部门" style="width:100%;vertical-align: top;" :initDataStr="scope.row.deptInitDataStr"
                                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{}">
                                        </tag-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop='contactInitDataStr' label='应对小组成员/联系人'>
                                    <template slot-scope='scope'>
                                        <tag-select disabled placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.contactInitDataStr"
                                            :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>{}">
                                        </tag-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop='ccInitDataStr' label='抄送人员'>
                                    <template slot-scope='scope'>
                                        <tag-select disabled placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.ccInitDataStr"
                                            :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>{}">
                                        </tag-select>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-form>
            </eco-content>
           <!-- <eco-content bottom='0px' type='tool' style='padding: 5px 0px;'>
                 <el-row>
                      <el-col>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                      </el-col>
                 </el-row>
           </eco-content> -->
        </div>
    </eco-content>
</template>
<script>
    var _self;
    import upload from './components/upload.vue'
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import {regulationtrackApprovalList,regulationtrackArchiveDetails,getUserInfoByOrgId} from '../service/service.js'
    export default {
        name:'flowHistory',
        data(){
            return {
                modular: 'regulatory_documents',
                modular2: 'related_documents',
                regulatoryModularInnerId: '',
                infoList:[],
                infoListTwo:[],
                formData: {
                    category: '',
                    subCategory: '',
                    regulationCode: '',
                    regulationName: '',
                    introduction: '',
                    standardStatus: '',
                    nature: '',
                    applicableType: '',
                    // trackMethod: '',
                    // trackFrequency: '',
                    contactPerson: '',
                    contactUnit: '',
                    contactDetails: '',
                    regulationLeader: '',
                    rpList: [],
                    certificationTypeItems: [],
                    carModelItems: [],
                    powerTypeItems: [],
                    gasFuelItems: [],
                    // initDataStr: '',
                    // deptInitDataStr: '',
                    regulationLeaderInitDataStr: '',
                    regulationVersion:'' ,//法规版本
                    url:'',//相关网址
                    content:''
                },
                rules: {
                    category: [{ required: true, message: '分类为必选项', trigger: 'change' }],
                    subCategory: [{ required: true, message: '分类为必选项', trigger: 'change' }],
                    regulationCode: [{ required: true, message: '法规编号为必填项', trigger: 'blur' }],
                    regulationName: [{ required: true, message: '法规名称为必填项', trigger: 'blur' }],
                    regulationVersion:[{required:true,message:'法规版本为必填项',trigger:'blur'}],
                    standardStatus: [{ required: true, message: '法规状态为必选项', trigger: 'change' }],
                    nature: [{ required: true, message: '性质为必选项', trigger: 'change' }],
                    applicableType: [{ required: true, message: '适用整车/零部件为必选项', trigger: 'change' }],
                    certificationTypeItems: [{ required: true, message: '认证管理分类为必选项', trigger: 'change' }],
                    carModelItems: [{ required: true, message: '适用车型为必选项', trigger: 'change' }],
                    // powerTypeItems: [{ required: true, message: '动力类型为必选项', trigger: 'change' }],
                    // gasFuelItems: [{ required: true, message: '气体燃料为必选项', trigger: 'change' }],
                    regulationLeader: [{ required: true, message: '法规责任人为必选项', trigger: 'blur' }]
                },
                loading:false,
                tableData:[],
                baseInfo:{
                    rows:30,
                    page:1,
                    total:0,
                }
            }
        },
        components:{
            ecoContent,
            upload,
            tagSelect
        },
        computed:{
            id(){
               return  this.$route.params.id
            },
            pageType(){
                return this.$route.params.pageType
            }
        },
        mounted(){
            _self = this;
            if(this.pageType === 'details'){
                this.loading = true;
                setTimeout(function(){
                    _self.getDetails();
                },500)
              
            }else{
                this.requestData();
            }
          
        },
        methods:{
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            initInfoListTwo() {
                let arr = [];
                if (this.formData.rpList) {
                    this.formData.rpList.forEach(item => {
                        var ccInitDataStr = '';
                        var contactInitDataStr = '';
                        var obj = {
                            department: item.department,
                            deptInitDataStr: `{"type":"DEPT","orgId":"${item.department}","linkId":"${item.department}"}`,
                            contactList: item.contactList || [],
                            ccList: item.ccList || [],
                        }
                        obj.contactList.forEach((item2, index2) => {
                            if (index2 == 0) {
                                contactInitDataStr = `{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            } else {
                                contactInitDataStr += `|{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            }
                        })
                        obj.ccList.forEach((item2, index2) => {
                            if (index2 == 0) {
                                ccInitDataStr = `{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            } else {
                                ccInitDataStr += `|{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                            }
                        })
                        if (!item.department) {
                            obj.department = '';
                            obj.deptInitDataStr = '';
                        }
                        obj.contactInitDataStr = contactInitDataStr;
                        obj.ccInitDataStr = ccInitDataStr;
                        arr.push(obj);
                    })
                }
                this.infoListTwo = arr;

            },
            getDetails(){
                regulationtrackArchiveDetails(this.id).then(res=>{
                    res.data.rpList = res.data.rpList||[];
                    res.data.certificationTypeItems = res.data.certificationTypeItems||[];
                    res.data.carModelItems = res.data.carModelItems||[];
                    res.data.powerTypeItems = res.data.powerTypeItems||[];
                    res.data.gasFuelItems = res.data.gasFuelItems||[];
                    this.formData = res.data;
                    this.$set(this.formData, 'regulationLeaderInitDataStr', '');
                    this.$set(this.formData, 'regulationLeaderName', '');
                    this.infoList = res.data.implTimeList;
                    this.regulatoryModularInnerId = res.data.id;
                    getUserInfoByOrgId(res.data.regulationLeader).then(response => {
                        this.$set(this.formData, 'regulationLeaderInitDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                        this.$set(this.formData, 'regulationLeaderName', response.data.mi);
                    })
                    this.initInfoListTwo();
                    this.loading = false;
                })
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData(true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            requestData(isFirstPage){
               this.loading = true;
               if(isFirstPage){
                   this.baseInfo.page = 1;
               }
             //    params.page = this.baseInfo.page;
              regulationtrackApprovalList(this.id).then(res=>{
                    this.tableData = res.data;
                    this.loading = false;
              }).catch(err=>{
                    this.tableData = [];
                    this.loading = false;
              })
            },
        }
    }
</script>
<style scoped>
    .flowHistory{
        position: relative;
        overflow-y: auto;
        height: 100%;
        color: #0f1419;
    }
    .flowHistory /deep/ .tableHeader th {
            background: #f5f7fa;
            color: #000;
    }
    .flowHistory .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
            background: #f5f7fa !important;
        }

    .flowHistory .standardizationTable /deep/ .tableHeader th {
            background: #f5f7fa;
            color: #000;
    }
    
    .flowHistory .rowTitle {
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: rgb(103, 112, 126);
        margin-bottom: 20px;
    }
    .mT2{
        margin-top: 20px;
    }
    .flowHistory .tableRow {
        text-align: right;
    }

    .flowHistory .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }
    .flowHistory .viewContent {
        color: #606266;
    }
</style>