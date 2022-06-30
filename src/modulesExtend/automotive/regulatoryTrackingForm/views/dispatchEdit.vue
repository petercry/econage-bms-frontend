<template>
    <div class='dispatchEdit'>
        <div class='editForm'>
            <h1>法规动态提醒通知书</h1>
            <div class='codeBox'>
                <span>通知书编号:</span>
                <span>{{formData.notificationCode}}</span>
            </div>
            <el-form :model='formData' ref='dispatchForm' v-loading='loading' label-position='right' label-width='0px'>
                <table class='dispatchTable'>
                    <tr>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>解读材料版本</td>
                        <td colspan='6'>
                            <el-form-item prop='explainVersion'>
                                <el-input disabled  placeholder='请输入' v-model='formData.explainVersion' clearable></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>法规编号</td>
                        <td colspan='2'>
                            <el-form-item prop='code'>
                                <el-input disabled placeholder='请输入' v-model='formData.code' clearable></el-input>
                            </el-form-item>
                        </td>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>法规名称</td>
                        <td colspan='2'>
                            <el-form-item prop='name'>
                                <el-input disabled placeholder='请输入' v-model='formData.name' clearable></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="2" class='tdTitle'>预计实施时间</td>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>新认证车型</td>
                        <td colspan='4' style="text-align: left;padding-left:10px;">
                            <span>{{this.formData.implDateNew}}</span>
                            <!-- <el-date-picker style='width:100%' v-model="formData.implDateNew" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker> -->
                        </td>
                    </tr>
                    <tr>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>已认证车型</td>
                        <td colspan='4' style="text-align: left;padding-left:10px;">
                            <span>{{this.formData.implDateOld}}</span>
                            <!-- <el-date-picker style='width:100%' v-model="formData.implDateOld" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker> -->
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="2" class='tdTitle'>适用范围</td>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>1)适用车辆</td>
                        <td colspan='4' style="text-align:left;padding-left:10px;">
                            <el-checkbox-group disabled v-model="formData.usageScopeCar">
                                <el-checkbox :label="item.id" v-for='(item,index) in applicableModels' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </td>
                    </tr>
                    <tr>
                        <!-- <i class='requiredI'>*</i> -->
                        <td class='tdTitle'>2)动力类型</td>
                        <td colspan='4' style="text-align:left;padding-left:10px;">
                            <el-form-item prop='usageScopePower'>
                                <el-checkbox-group disabled v-model="formData.usageScopePower">
                                    <el-checkbox :label="item.id" v-for='(item,index) in powerType' :key='item.id'>{{item.text}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>法规状态</td>
                        <td :colspan='5' style="text-align:left">
                            <el-select disabled v-model='formData.status' clearable>
                                <el-option :value='item.id' :label='item.text' v-for='(item,index) in standardState' :key='item.id'></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr class='userRow'>
                        <td class='tdTitle'>法规文档</td>
                        <td colspan="2">
                            <upload :isShowDownBtn='false' :isEdit='false' :showList='true' :multiple="false" :modular="modular" :modularInnerId="regulatoryModularInnerId"
                                @preView='preView'  accept=''>
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </td>
                        <td class='tdTitle'>相关文档</td>
                        <td  colspan="2">
                            <upload :isShowDownBtn='false' :isEdit='false'  :showList='true' :multiple="false" :modular="modular2" :modularInnerId="regulatoryModularInnerId"
                                @preView='preView'  accept=''>
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </td>
                    </tr>
                    <tr class='userRow'>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>法规动态更新简介</td>
                        <td :colspan='5'>
                            <el-input :disabled='!isEdit' v-model='formData.updateIntroduction' type='textarea' :rows='4' resize='none' placeholder='请输入'></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>编制</td>
                        <td>
                            <!-- <tag-select disabled placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.planningUserInitUserStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>selectRoleUserType(data,'1')">
                            </tag-select> -->
                            <span>{{formData.planningAssigneeName}}</span>
                        </td>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>校对</td>
                        <td style='min-width:150px'>
                            <span>{{formData.proofreadingAssigneeName}}</span>
                        </td>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>审核</td>
                        <td>
                            <!-- <tag-select disabled placeholder="选择人员" style="width:220px;vertical-align: top;" :initDataStr="formData.approvalUserInitUserStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>selectRoleUserType(data,'2')">
                            </tag-select> -->
                            <span>{{formData.approvingAssigneeName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>日期</td>
                        <td>
                            <!-- <el-date-picker disabled v-model="formData.planningDate" value-format='yyyy-MM-dd HH:mm:ss' type="datetime" placeholder="选择日期">
                            </el-date-picker> -->
                            <span>{{formData.planCompleteTime}}</span>
                        </td>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>日期</td>
                        <td>
                            <!-- <el-date-picker disabled v-model="formData.approvalDate" value-format='yyyy-MM-dd HH:mm:ss' type="datetime" placeholder="选择日期">
                            </el-date-picker> -->
                            <span>{{formData.proofreadCompleteTime}}</span>
                        </td>
                        <td class='tdTitle'>
                            <i class='requiredI'>*</i>日期</td>
                        <td>
                            <!-- <el-date-picker disabled v-model="formData.approvalDate" value-format='yyyy-MM-dd HH:mm:ss' type="datetime" placeholder="选择日期">
                            </el-date-picker> -->
                            <span>{{formData.approveCompleteTime}}</span>
                        </td>
                    </tr>
                    <tr class='userRow'>
                        <td>
                            <i class='requiredI'>*</i>接收人员</td>
                        <td colspan='5'>
                            <tag-select placeholder="选择人员" :disabled='!isEdit' style="width:100%;vertical-align: top;" :initDataStr="formData.initUserDataStr"
                                :initOptions="{selectNum:2,selectType:'User'}" @callBack="selectRoleUser">
                            </tag-select>
                        </td>
                    </tr>
                    <tr class='userRow' v-if='(!isEdit && fromPage!=="finish" && fromPage!=="noticeList" && formData.approveStatus==="PENDING")'>
                        <td class='tdTitle'>审批意见</td>
                        <td :colspan='5'>
                            <el-input :disabled='(fromPage==="approve" && !publicRole.noticeApprove["regulation-notification.approving_agree"] && !publicRole.noticeApprove["regulation-notification.approving_reject"]) || (fromPage==="proofreading" && !publicRole.noticeProofreading["regulation-notification.proofreading_agree"] && !publicRole.noticeProofreading["regulation-notification.proofreading_reject"])' v-model='formData.content' type='textarea' :rows='4' resize='none' placeholder='请输入'></el-input>
                        </td>
                    </tr>
                </table>
            </el-form>
        </div>
        <div class="btn" v-show='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
            <el-button type="primary" size="medium" @click='submitCase' v-if='(fromPage==="noticeList" && publicRole.noticeList["regulation-notification.planning_dispatch"])'>发放</el-button>  
        </div>
        <div class="btn" v-show='(!isEdit && fromPage!=="finish" && fromPage!=="noticeList" && formData.approveStatus==="PENDING")'> 
            <el-button type="primary" size="medium" @click='appropeCase(true)' v-show='(fromPage==="approve" && publicRole.noticeApprove["regulation-notification.approving_agree"]) || (fromPage==="proofreading" && publicRole.noticeProofreading["regulation-notification.proofreading_agree"])'>同意</el-button>  
            <el-button type="primary" size="medium" @click='appropeCase(false)'v-show='(fromPage==="approve" && publicRole.noticeApprove["regulation-notification.approving_reject"]) || (fromPage==="proofreading" && publicRole.noticeProofreading["regulation-notification.proofreading_reject"])' >驳回</el-button>  
        </div>
    </div>
</template>
<script>
    import { EcoFile } from '@/components/file/main.js'
    import { mapState,mapMutations } from 'vuex'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { getRoleBtnSetting,regulationtrackFlowApprove,regulationtrackFlowProofread,regulationNotificationUpdateCommit,regulationNotificationUpdate,getUserInfoByOrgId, regulationtrackDispatch, regulationtrackSelectSingle, notification, regulationNotificationDetails } from '../service/service.js'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import upload from './components/upload.vue'
    export default {
        data() {
            return {
                fromPage:'',
                modular: 'regulatory_documents',
                modular2: 'related_documents',
                regulatoryModularInnerId: '',
                keyObj: {
                    // explainVersion:'解读材料版本',
                    // code: '法规编号',
                    // name: '法规名称',
                    // usageScopeCar: '适用车辆',
                    // usageScopePower: '动力类型',
                    // status: '法规状态',
                    updateIntroduction: '法规动态更新简介',
                    // planningUser: '编制',
                    // approvalUser: '审核',
                    // planningDate: '编制日期',
                    // approvalDate: '审核日期',
                    members: '接收人员'
                },
                formData: {
                    explainVersion:'',
                    notificationCode: '',
                    code: '',
                    name: '',
                    status: '',
                    implDateNew: '',
                    implDateOld: '',
                    usageScopeCar: [],
                    usageScopePower: [],
                    updateIntroduction: '',
                    // planningUser: '',
                    // approvalUser: '',
                    // planningDate: '',
                    // approvalDate: '',
                    initUserDataStr: '',
                    members: [],
                    content:''
                },
                loading: false,
                casingType: ''
                // rules: {
                //     code: [{ required: true, message: '法规编号为必填项', trigger: 'blur' }],
                //     name: [{ required: true, message: '法规编号为必填项', trigger: 'blur' }],
                // }
            }
        },
        components: {
            tagSelect,
            upload
        },
        computed: {
            ...mapState(['powerType', 'standardState', 'applicableModels','publicRole']),
            isEdit() {
                return this.casingType === 'editCase'
            },
        },
        created() {
            this.casingType = this.$route.params.type;
            this.fromPage = this.$route.query.fromPage;
            this.initRole();
            if(this.$route.params.id && this.$route.params.id != 0){
                this.viewGetDetails();
            }
            // if (this.casingType === 'viewCase') {
            //     this.viewGetDetails();
            // } else {
            //     this.regulatoryModularInnerId = this.$route.params.id;
            //     this.getDeatils();
            // }

        },
        mounted(){
            this.callAction();
        },
        methods: {
            ...mapMutations(['SET_PUBLIC_ROLE']),
            initRole() {
                let btn_array=[
                    'regulation-notification.approving_agree',
                    'regulation-notification.approving_reject'   
                ];
                let btn_array2 = [
                    'regulation-notification.planning_dispatch',
                ];
                let btn_array3 = [
                  'regulation-notification.proofreading_agree',
                  'regulation-notification.proofreading_reject'
                ];
                Promise.all([
                    getRoleBtnSetting(btn_array),
                    getRoleBtnSetting(btn_array2),
                    getRoleBtnSetting(btn_array3)
                ]).then((resArr) => {
                    if (resArr[0].data) {
                         this.SET_PUBLIC_ROLE({name:'noticeApprove',obj:resArr[0].data.authenticationMap})
                    }
                    if(resArr[1].data){
                         this.SET_PUBLIC_ROLE({name:'noticeList',obj:resArr[1].data.authenticationMap})
                    }
                    if(resArr[2].data){
                         this.SET_PUBLIC_ROLE({name:'noticeProofreading',obj:resArr[2].data.authenticationMap});
                    }
                })
            },
            appropeCase(type){
                // let title = type?"同意":"驳回"
                // var url = '/regulatoryTrackingForm/index.html#/withdrawPage/' + type;
                // EcoUtil.getSysvm().openDialog(title, url, 700, 200, '15vh');
                if((!type) && !this.formData.content){
                    return EcoMessageBox.alert('请填写审批意见!', '提示');
                }
                this.doApproveCase(type,this.formData.content);
            },
            doApproveCase(type,content){
                this.loading = true;         
                let params ={
                        id:this.$route.params.id,
                        accept:type,
                        opinion:content
                }
                let actionVal = type?"onlyApprope":"onlyWithdraw";
                if(this.fromPage=='noticeList'){

                }else  if(this.fromPage=='proofreading'){
                    regulationtrackFlowProofread(params).then(res=>{
                        this.loading = false;         
                        let doObj = {};
                        doObj.action = actionVal;
                        doObj.data = {};
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    })
                }else if(this.fromPage=='approve'){
                    regulationtrackFlowApprove(params).then(res=>{
                        this.loading = false;         
                        let doObj = {};
                        doObj.action = actionVal;
                        doObj.data = {};
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    })
                }

            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'noticeSelectUser')) {
                        _self.flowCommit(obj.data);
                    }else if(obj && (obj.action === 'apprope')){
                        _self.doApproveCase(true,obj.data.content);
                    }else if(obj && (obj.action === 'withdraw')){
                        _self.doApproveCase(false,obj.data.content);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'dispatchEdit');
            },
            flowCommit(obj){
                this.loading = true;
                let params = {
                     id:this.$route.params.id,
                    //  explainVersion:this.formData.explainVersion,
                     updateIntroduction:this.formData.updateIntroduction,
                     members:this.formData.members
                }
                regulationNotificationUpdateCommit(params,obj.proofreadingAssignee,obj.approvingAssignee).then(res=>{
                    let doObj = {};
                    doObj.action = 'flowCommit';
                    doObj.data = {};
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                })
            },
            submitCase(){
                for (var key in this.keyObj) {
                    var bool = false;
                    if (key === 'members') {
                        if (this.formData[key].length == 0) {
                            bool = true;
                        }
                    } else if (!this.formData[key]) {
                        bool = true;
                    }
                    if (bool) {
                        EcoMessageBox.alert(`${this.keyObj[key]}为必填项`, '提示');
                        return;
                    }
                }
                //提交 打开选择审批页面
                var url ;
                if((this.formData.flowStatus==='PROOFREAD_REJECT' || this.formData.flowStatus==="APPROVE_REJECT")){
                    url = '/regulatoryTrackingForm/index.html#/noticeSelectUser?proofreadingAssignee='+this.formData.proofreadingAssignee+'&approvingAssignee='+this.approvingAssignee;
                }else{
                    url = '/regulatoryTrackingForm/index.html#/noticeSelectUser'
                }
                EcoUtil.getSysvm().openDialog('选择人员', url, 700, 200, '15vh');
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            viewGetDetails() {
                regulationNotificationDetails(this.$route.params.id,this.fromPage).then(res => {
                    let initUserDataStr;
                    if(res.data.members){
                        res.data.members.forEach((item, index) => {
                            if (index === 0) {
                                initUserDataStr = `{"type":"${item.type}","orgId":"${item.orgId}","linkId":"${item.linkId}"}`;
                            } else {
                                initUserDataStr += `|{"type":"${item.type}","orgId":"${item.orgId}","linkId":"${item.linkId}"}`;
                            }
                        })
                    }
                    this.regulatoryModularInnerId = res.data.masterId;
                    this.formData = {
                        approveStatus:res.data.approveStatus,//办理状态
                        explainVersion:res.data.explainVersion,
                        notificationCode: res.data.notificationCode,
                        code: res.data.code,
                        name: res.data.name,
                        status: res.data.status,
                        implDateNew: res.data.implDateNew,
                        implDateOld: res.data.implDateOld,
                        usageScopeCar: res.data.usageScopeCarList || (res.data.usageScopeCar.split('|')),//1
                        usageScopePower: res.data.usageScopePowerList || (res.data.usageScopePower.split('|')),//1
                        updateIntroduction: res.data.updateIntroduction,
                        // planningUser: res.data.planningUser,
                        // planningUserInitUserStr: '',
                        // approvalUserInitUserStr: '',
                        // approvalUser: res.data.approvalUser,
                        // planningDate: res.data.planningDate,
                        // approvalDate: res.data.approvalDate,
                        planningAssigneeName:res.data.planningAssigneeName,
                        planCompleteTime:res.data.planCompleteTime,
                        proofreadingAssigneeName:res.data.proofreadingAssigneeName,
                        proofreadingAssignee:res.data.proofreadingAssignee,
                        proofreadCompleteTime:res.data.proofreadCompleteTime,
                        approvingAssigneeName:res.data.approvingAssigneeName,
                        approvingAssignee:res.data.approvingAssignee,
                        approveCompleteTime:res.data.approveCompleteTime,
                        initUserDataStr: initUserDataStr,
                        members: res.data.members,
                        content:""
                    }
                    // Promise.all([
                    //     getUserInfoByOrgId(this.formData.planningUser),
                    //     getUserInfoByOrgId(this.formData.approvalUser)
                    // ]).then(responseList => {
                    //     this.formData.planningUserInitUserStr = `{"type":"PERSONNEL","orgId":"${responseList[0].data.departments[0].id}.${this.formData.planningUser}","linkId":"${this.formData.planningUser}"}`;
                    //     this.formData.approvalUserInitUserStr = `{"type":"PERSONNEL","orgId":"${responseList[1].data.departments[0].id}.${this.formData.approvalUser}","linkId":"${this.formData.approvalUser}"}`
                    // })
                })
            },
            // selectRoleUserType(data, type) {
            //     if (!data.id && data.itemArray.length === 0) {
            //         if (type === '1') {
            //             this.formData.planningUser = '';
            //         } else {
            //             this.formData.approvalUser = '';
            //         }
            //     } else {
            //         if (type === '1') {
            //             this.formData.planningUser = data.itemArray[0].linkId;
            //         } else {
            //             this.formData.approvalUser = data.itemArray[0].linkId;
            //         }
            //     }
            // },
            initNotificationCode() {
                let date = window.localStorage.getItem('regulatoryTrackingForm-date');
                let submitNum = window.localStorage.getItem('regulatoryTrackingForm-submitNum');
                return date + (submitNum.length === 1 ? ('0' + submitNum) : submitNum);
            },
            setNotificationCode() {
                let submitNum = +window.localStorage.getItem('regulatoryTrackingForm-submitNum');
                let submitNumNext = ++submitNum;
                let str = (submitNumNext < 10 ? ('0' + submitNumNext) : submitNumNext);
                window.localStorage.setItem('regulatoryTrackingForm-submitNum', str);
            },
            // getDeatils() {
            //     regulationtrackSelectSingle(this.$route.params.id).then(res => {
            //         let userObj = {};
            //         let userArr = [];
            //         let initUserDataStr = '';
            //         res.data.rpList.forEach(item => {
            //             var arr = [].concat(item.ccList, item.contactList);
            //             arr.forEach((item2) => {
            //                 if (!userObj[item2.linkId]) {
            //                     userObj[item2.linkId] = item2;
            //                     userArr.push(item2);
            //                 }
            //             })
            //         })
            //         userArr.forEach((item, index) => {
            //             if (index === 0) {
            //                 initUserDataStr = `{"type":"${item.type}","orgId":"${item.orgId}","linkId":"${item.linkId}"}`;
            //             } else {
            //                 initUserDataStr += `|{"type":"${item.type}","orgId":"${item.orgId}","linkId":"${item.linkId}"}`;;
            //             }
            //         })
            //         this.formData = {
            //             notificationCode: this.initNotificationCode(),
            //             code: res.data.regulationCode,
            //             name: res.data.regulationName,
            //             status: res.data.standardStatus,
            //             implDateNew: res.data.implTimeNt,
            //             implDateOld: res.data.implTimeTt,
            //             usageScopeCar: res.data.carModelItems,
            //             usageScopePower: res.data.powerTypeItems,
            //             updateIntroduction: res.data.introduction,
            //             planningUser: res.data.extInfo.planningUser,
            //             approvalUser: res.data.extInfo.approvalUser,
            //             planningUserInitUserStr: '',
            //             approvalUserInitUserStr: '',
            //             planningDate: res.data.extInfo.planningDate,
            //             approvalDate: res.data.extInfo.approvalDate,
            //             initUserDataStr: initUserDataStr,
            //             members: userArr
            //         }
            //         Promise.all([
            //             getUserInfoByOrgId(this.formData.planningUser),
            //             getUserInfoByOrgId(this.formData.approvalUser)
            //         ]).then(responseList => {
            //             this.formData.planningUserInitUserStr = `{"type":"PERSONNEL","orgId":"${responseList[0].data.departments[0].id}.${this.formData.planningUser}","linkId":"${this.formData.planningUser}"}`;
            //             this.formData.approvalUserInitUserStr = `{"type":"PERSONNEL","orgId":"${responseList[1].data.departments[0].id}.${this.formData.approvalUser}","linkId":"${this.formData.approvalUser}"}`
            //         })
            //     })
            // },
            selectRoleUser(data) {
                //接收人员
                if (!data.id && data.itemArray.length === 0) {
                    this.formData.members = [];
                } else {
                    this.formData.members = data.itemArray;
                }
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit(){
                for (var key in this.keyObj) {
                    var bool = false;
                    if (key === 'members') {
                        if (this.formData[key].length == 0) {
                            bool = true;
                        }
                    } else if (!this.formData[key]) {
                        bool = true;
                    }
                    if (bool) {
                        EcoMessageBox.alert(`${this.keyObj[key]}为必填项`, '提示');
                        return;
                    }
                }
                let params = {
                     id:this.$route.params.id,
                    //  explainVersion:this.formData.explainVersion,
                     updateIntroduction:this.formData.updateIntroduction,
                     members:this.formData.members
                }
                regulationNotificationUpdate(params).then(res=>{
                    let doObj = {};
                    doObj.action = 'editCase';
                    doObj.data = {};
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                })
            },
            // onSubmit() {
            //     for (var key in this.keyObj) {
            //         var bool = false;
            //         if (key === 'members' || key === 'usageScopeCar' || key === 'usageScopePower') {
            //             if (this.formData[key].length == 0) {
            //                 bool = true;
            //             }
            //         } else if (!this.formData[key]) {
            //             bool = true;
            //         }
            //         if (bool) {
            //             EcoMessageBox.alert(`${this.keyObj[key]}为必填项`, '提示');
            //             return;
            //         }
            //     }
            //     let params = {
            //         module: 'regulatory_tracking',
            //         masterId: this.$route.params.id,
            //         notificationCode: this.formData.notificationCode,
            //         code: this.formData.code,
            //         name: this.formData.name,
            //         status: this.formData.status,
            //         implDateNew: this.formData.implDateNew,
            //         implDateOld: this.formData.implDateOld,
            //         // usageScopeCar: this.formData.usageScopeCar,
            //         // usageScopePower: this.formData.usageScopePower,
            //         updateIntroduction: this.formData.updateIntroduction,
            //         planningUser: this.formData.planningUser,
            //         approvalUser: this.formData.approvalUser,
            //         planningDate: this.formData.planningDate,
            //         approvalDate: this.formData.approvalDate,
            //         members: this.formData.members,
            //         usageScopeCarList: this.formData.usageScopeCar,
            //         usageScopePowerList: this.formData.usageScopePower
            //     }
            //     Promise.all([
            //         notification(params),
            //         regulationtrackDispatch(this.$route.params.id)
            //     ]).then(resList => {
            //         this.setNotificationCode();
            //         let doObj = {};
            //         doObj.action = 'dispatch';
            //         doObj.data = {};
            //         doObj.close = true;
            //         EcoUtil.getSysvm().callBackDialogFunc(doObj);
            //     })
            // }
        }
    }
</script>
<style scoped>
    .dispatchEdit {
        background: #fff;
        height: 100%;
    }

    .dispatchEdit .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .dispatchEdit .codeBox {
        margin: 15px 0px;
        font-size: 14px;
        text-align: right;
    }

    .dispatchEdit .editForm h1 {
        text-align: center;
        font-size: 20px;
    }

    .dispatchEdit .editForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .dispatchEdit table {
        width: 100%;
        border: 1px solid;
    }

    .dispatchEdit table td {
        border: 1px solid;
        font-size: 14px;
        border: 1px solid #dcdfe6;
        color: #606266;
        height: 40px;
        text-align: center;
        min-width: 165px;
    }

    .dispatchEdit .userRow td {
        height: 80px;
        line-height: 80px;
    }

    .dispatchEdit /deep/ .el-customDiv {
        border: 0px;
    }

    .dispatchEdit .tdTitle {
        background: rgb(250, 250, 250);
        width: 130px;
        min-width: 130px;
    }

    .dispatchEdit .requiredI {
        color: #f44;
        margin-right: 2px;
    }

    .dispatchEdit /deep/ .el-input.is-disabled .el-input__inner,
    .dispatchEdit /deep/ .el-textarea.is-disabled .el-textarea__inner {
        background: transparent !important;
    }

    .dispatchTable /deep/ .el-form-item--mini.el-form-item {
        margin-bottom: 0px;
    }

    .dispatchTable /deep/ .el-input--mini .el-input__inner,
    .dispatchTable /deep/ .el-range-editor--mini.el-input__inner,
    .dispatchTable /deep/ .el-textarea__inner {
        /* height:40px;
        line-height: 40px; */
        border: 0px;
    }

    .dispatchEdit /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background-color: #409EFF;
        border-color: #409EFF;
    }
    .dispatchEdit /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label{
        color:#606266;
    }
    .dispatchEdit /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
        border-color:#fff;
    }
</style>
