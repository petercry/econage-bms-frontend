<template>
    <div class='editVehicleAnnounceCar'>
        <div class='planBox' v-if="caseType!='addCase'">
            <span class='plan-item' @click='changePlanActive(0)' :class='{active:activeIndex==0}'>基本信息</span>
            <span class='plan-item' @click='changePlanActive(1)' :class='{active:activeIndex==1}'>车型认证符合性管控</span>
        </div>
        <!-- 基本信息 -->
        <div class='addForm' v-show='activeIndex==0' :style="{top:(caseType=='addCase'?'0px':'60px')}">
            <el-form :model='formData' ref='vehicleAnnounceCarForm' :rules='rules' v-loading='loading'
                label-position='right' label-width='100px'>
                <el-row>
                    <el-col :span='8' v-if='caseType!=="addCase" '>
                        <el-form-item label='申请单编号:' prop='applicationCode'>
                            <el-input v-if='isEdit' disabled placeholder='请输入' v-model='formData.applicationCode'></el-input>
                            <span class="viewContent" v-else>{{formData.applicationCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='车型型号' prop='carModelCode'>
                            <el-input v-if='isEdit' placeholder="请输入" v-model='formData.carModelCode'></el-input>
                            <span class='viewContent' v-else>{{formData.carModelCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='排量(ml)' prop='displacement'>
                            <el-input v-if='isEdit' @blur="numberInput('displacement')" placeholder="请输入"
                                v-model='formData.displacement'></el-input>
                            <span class='viewContent' v-else>{{formData.displacement}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8' class="mB0">
                        <el-form-item :inline-message='true' label='发动机/动力电池型号:' prop='engineModel'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.engineModel'></el-input>
                            <span class="viewContent" v-else>{{formData.engineModel}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='外形尺寸:' prop='shapeSize'>
                            <el-input v-if='isEdit' placeholder="请输入"
                                v-model='formData.shapeSize'></el-input>
                            <span class='viewContent' v-else>{{formData.shapeSize}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='轴距(mm)' prop='wheelbase'>
                            <el-input @blur="numberInput('wheelbase')" v-if='isEdit' placeholder="请输入"
                                v-model='formData.wheelbase'></el-input>
                            <span class='viewContent' v-else>{{formData.wheelbase}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='VIN:' prop='vin'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.vin'></el-input>
                            <span class="viewContent" v-else>{{formData.vin}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='16'>
                        <el-form-item label='单位:' prop='unit'>
                            <el-input v-if='isEdit' placeholder="请输入" v-model='formData.unit'></el-input>
                            <span class='viewContent' v-else>{{formData.unit}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='备注(商品名称):' prop='remarks'>
                            <el-input v-if='isEdit' v-model='formData.remarks' type='textarea' :rows='4' resize='none'
                                show-word-limit maxlength='1000' placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.remarks}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='项目代号:' prop='projectCode'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.projectCode'></el-input>
                            <span class="viewContent" v-else>{{formData.projectCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='排放阶段:' prop='dischargeStage'>
                            <el-select filterable v-if='isEdit' v-model='formData.dischargeStage'>
                                <el-option v-for='(item) in dischargeStageList' :value='item.id' :label='item.text'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent"
                                v-else>{{restData(formData.dischargeStage,'dischargeStage')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='车型名称:' prop='modelName'>
                            <el-select filterable v-if='isEdit' v-model='formData.modelName'>
                                <el-option v-for='(item) in modelNameList' :value='item.id' :label='item.text'
                                    :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.modelName,'modelName')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='双积分配置ID:' prop='dualPointConfigId'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.dualPointConfigId'></el-input>
                            <span class="viewContent" v-else>{{formData.dualPointConfigId}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='16'>
                        <el-form-item label='配置说明:' prop='configInstruction'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.configInstruction'></el-input>
                            <span class="viewContent" v-else>{{formData.configInstruction}}</span>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='整备质量:' prop='curbWeight'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.curbWeight'></el-input>
                            <span class="viewContent" v-else>{{formData.curbWeight}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='最大总质量:' prop='maxTotalWeight'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.maxTotalWeight'></el-input>
                            <span class="viewContent" v-else>{{formData.maxTotalWeight}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='油耗/续航:' prop='fuelConsumption'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.fuelConsumption'></el-input>
                            <span class="viewContent" v-else>{{formData.fuelConsumption}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='适用车型:' prop='modelList'>
                            <el-checkbox-group v-model="formData.modelList" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item) in applicableModels' :key='item.id'>
                                    {{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.modelList,'modelList')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='动力类型:' prop='powerList'>
                            <el-checkbox-group v-model="formData.powerList" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item) in powerType' :key='item.id'>{{item.text}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.powerList,'powerList')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8' class='mB0'>
                        <el-form-item label='首次公告日期及批次:' prop='firstAnnouncementInfo'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.firstAnnouncementInfo'>
                            </el-input>
                            <span class="viewContent" v-else>{{formData.firstAnnouncementInfo}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='认证负责人:' prop='certResponsible'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.certResponsible'></el-input>
                            <span class="viewContent" v-else>{{formData.certResponsible}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="是否有效:" prop='available'>
                            <el-select filterable v-if='isEdit' v-model='formData.available'>
                                <el-option v-for="(item) in available" :key="item.id" :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{restData(formData.available,'available')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='EOS日期:' prop='eosDate'>
                            <el-date-picker v-if='isEdit' v-model="formData.eosDate" value-format='yyyy-MM-dd'
                                type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.eosDate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span='24'>
                        <el-form-item label='依据:' prop='according'>
                            <el-input v-if='isEdit' class='selectAccording' :readonly='true'
                                v-model='formData.according' type='textarea' :rows='4' resize='none' show-word-limit
                                maxlength='1000' placeholder='请输入' @click.native='selectAccordingFunction'></el-input>
                            <div class="tag-group" v-else>
                                <el-tag size='small' v-for="(tab,tabIndex) in formData.according.split('-')"
                                    @click='tagClick(tabIndex)' :key="tab+tabIndex" effect="plain">
                                    {{ tab }}
                                </el-tag>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row> -->
            </el-form>
        </div>
        <div class="btn" v-if='isEdit' v-show='activeIndex==0'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
            <el-button type='primary' size='medium' @click='submitCase' v-if='(fromPage=="organizationList")'>提交</el-button>
        </div>
        <!-- 车型认证符合性管控 -->
        <vehicleTypeCertification v-if="caseType!='addCase'" :tempId='tempId' :isEdit='isEdit' :masterId='id' :fromPage='fromPage' v-show='activeIndex==1'>
        </vehicleTypeCertification> 

    </div>
</template>
<script>
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { productioncarTempInit,announcementModelApplyModify,announcementModelSaveSubmit,vehicleAnnounceCarAdd, vehicleAnnounceCarDetails, vehicleAnnounceCarUpdate } from '../service/service.js'
    import { mapState } from 'vuex'
    import vehicleTypeCertification from './vehicleTypeCertification.vue'
    export default {
        name: 'editVehicleAnnounceCar',
        data() {
            return {
                tempId:'',
                fromPage:'',
                activeIndex: 0,
                caseType: '',
                formData: {
                    applicationCode: '',
                    carModelCode: '',
                    displacement: '',
                    engineModel: '',
                    shapeSize: '',
                    wheelbase: '',
                    vin: '',
                    unit: '',
                    remarks: '',
                    projectCode: '',
                    dischargeStage: '',
                    modelName: '',
                    dualPointConfigId: '',
                    configInstruction: '',
                    curbWeight: '',
                    maxTotalWeight: '',
                    fuelConsumption: '',
                    modelList: [],
                    powerList: [],
                    firstAnnouncementInfo: '',
                    certResponsible: '',
                    available: '',
                    eosDate: '',
                    // according: '',
                    carRelateInstEntityList: [],//关联实例化车型信息
                    rectificationId: ''
                },
                loading: false,
            }
        },
        components: {
            vehicleTypeCertification
        },
        computed: {
            ...mapState(['applicableModels', 'powerType', 'available', 'dischargeStageList', 'modelNameList']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            id() {
                return this.$route.params.id;
            },
            rules() {
                let obj = {
                    // applicationCode: '申请单编号',
                    carModelCode: '车型型号',
                    // displacement: '排量',
                    // engineModel: '发动机/动力电池型号',
                    // shapeSize: '外形尺寸',
                    // wheelbase: '轴距(mm)',
                    // vin: 'VIN',
                    // unit: '单位',
                    // remarks: '备注(商品名称)',
                    // projectCode: '项目代号',
                    // dischargeStage: '排放阶段',
                    // modelName: '车型名称',
                    // dualPointConfigId: '双积分配置ID',
                    // configInstruction: '配置说明',
                    // curbWeight: '整备质量',
                    // maxTotalWeight: '最大总质量',
                    // fuelConsumption: '油耗/续航',
                    modelList: '适用车型',
                    powerList: '动力类型',
                    // firstAnnouncementInfo: '首次公告日期及批次',
                    // certResponsible: '认证责任人',
                    available: '是否有效',
                    eosDate: 'EOS日期',
                    // according: '依据'
                }
                let newObj = {}
                // |(according)
                for (var key in obj) {
                    var trigger = (key.search(/(List)|(Nt)|(Tt)/g) !== -1) ? 'change' : 'blur'
                    newObj[key] = [{ required: true, message: `${obj[key]}为必填项`, trigger: trigger }];
                }
                return newObj;
            }
        },
        created() {
            _self = this;
            this.caseType = this.$route.params.caseType;
            this.fromPage = this.$route.params.fromPage
            
        },
        mounted(){
            if (this.id && this.id != 0) {
                if(this.fromPage ==='finishList' && this.caseType ==='editCase'){
                    this.loading = true;
                    productioncarTempInit(this.id).then(res=>{
                        this.tempId = res.data;
                        this.getDetailsInfo();
                    })
                }else{
                    this.getDetailsInfo();
                }
            }
            if (this.caseType == 'addCase' || this.caseType == 'editCase') {
                this.callAction();
            }
        },
        methods: {
            doSubmit(assigneeId){
                //提交并保存
                this.$refs.vehicleAnnounceCarForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            applicationCode: this.formData.applicationCode,
                            carModelCode: this.formData.carModelCode,
                            displacement: this.formData.displacement,
                            engineModel: this.formData.engineModel,
                            shapeSize: this.formData.shapeSize,
                            wheelbase: this.formData.wheelbase,
                            vin: this.formData.vin,
                            unit: this.formData.unit,
                            remarks: this.formData.remarks,
                            projectCode: this.formData.projectCode,
                            dischargeStage: this.formData.dischargeStage,
                            modelName: this.formData.modelName,
                            dualPointConfigId: this.formData.dualPointConfigId,
                            configInstruction: this.formData.configInstruction,
                            curbWeight: this.formData.curbWeight,
                            maxTotalWeight: this.formData.maxTotalWeight,
                            fuelConsumption: this.formData.fuelConsumption,
                            modelList: this.formData.modelList,
                            powerList: this.formData.powerList,
                            firstAnnouncementInfo: this.formData.firstAnnouncementInfo,
                            certResponsible: this.formData.certResponsible,
                            available: this.formData.available,
                            eosDate: this.formData.eosDate,
                            // according: this.formData.according,
                            rectificationId: this.formData.rectificationId
                        }
                        if (this.caseType === 'editCase') {
                            params.id = this.id;
                        } 
                        announcementModelSaveSubmit(params,assigneeId).then(res=>{
                            this.loading = false;
                            let doObj = {}
                            doObj.action = 'submitCase';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        }).catch(err => {
                            this.loading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            submitCase(){
                //提交 打开选择审批页面
                var url;
                if(this.caseType ==='editCase' && this.formData.status==='APPROVE_REJECT'){
                    url = '/modelInProduction/index.html#/appropeUser?assigneeId='+this.formData.approvingAssignee;
                }else{
                    url = '/modelInProduction/index.html#/appropeUser';
                }
                EcoUtil.getSysvm().openDialog('选择审批人', url, 700, 200, '15vh');
            },
            tagClick(index) {
                if (this.formData.rectificationId) {
                    return;
                }
                let idArr = this.formData.rectificationId.split(';');
                let _width = '800';
                let _height = '350';
                let url = '/modelInProduction/index.html#/editManagement/' + idArr[index] + '/viewCase';
                let dialogTitle = '查看';
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'selectAccording')) {
                        let arr = [];
                        let rectificationId = [];
                        obj.dataArr.forEach(item => {
                            arr.push(item.certPolicyCode + '/' + item.certPolicyName);
                            rectificationId.push(item.id);
                        })
                        _self.formData.according = arr.join('-');
                        _self.formData.rectificationId = rectificationId.join(';');
                    }else if(obj && (obj.action === 'appropeUser')){
                        _self.doSubmit(obj.data.assigneeId);
                    } 
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'editVehicleAnnounceCar');
            },
            selectAccordingFunction() {
                var url = '/modelInProduction/index.html#/rectificationManagementList/' + true
                EcoUtil.getSysvm().openDialog('选择依据', url, 1100, 600, '15vh');
            },
            changePlanActive(active) {
                if (this.activeIndex == active) {
                    return;
                }
                this.activeIndex = active;
            },
            numberInput(key) {
                if (this.formData[key]) {
                    if (/^\d+(\.(\d+)?)?$/.test(this.formData[key])) {
                        var len = this.formData[key].length - 1;
                        if (this.formData[key].indexOf(".") == -1) {
                            this.formData[key] = this.formData[key] + ".00";
                        } else if (this.formData[key].indexOf(".") === len) {
                            this.formData[key] = this.formData[key] + "00";
                        } else if (this.formData[key].indexOf(".") === len - 1) {
                            this.formData[key] = this.formData[key] + "0";
                        }
                        //开头为0
                        if (this.formData[key][0] == "0" && this.formData[key][1] !== ".") {
                            this.formData[key] = this.formData[key].slice(1);
                        }
                        //精度为2位
                        if(key === 'wheelbase'){
                            var indexO = this.formData[key].indexOf('.')+3;
                            this.formData[key] = this.formData[key].slice(0,indexO);
                        }
                    } else {
                        this.formData[key] = this.formData[key].replace(/[^\d]/g, "");
                    }
                }
            },
            getDetailsInfo() {
                this.loading = true;
                vehicleAnnounceCarDetails(this.tempId||this.id).then(res => {
                    res.data.modelList = res.data.modelList || [];
                    res.data.powerList = res.data.powerList || [];
                    res.data.rectificationId = res.data.rectificationId || '';
                    // res.data.according = res.data.according || '';
                    this.formData = res.data;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.vehicleAnnounceCarForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            applicationCode: this.formData.applicationCode,
                            carModelCode: this.formData.carModelCode,
                            displacement: this.formData.displacement,
                            engineModel: this.formData.engineModel,
                            shapeSize: this.formData.shapeSize,
                            wheelbase: this.formData.wheelbase,
                            vin: this.formData.vin,
                            unit: this.formData.unit,
                            remarks: this.formData.remarks,
                            projectCode: this.formData.projectCode,
                            dischargeStage: this.formData.dischargeStage,
                            modelName: this.formData.modelName,
                            dualPointConfigId: this.formData.dualPointConfigId,
                            configInstruction: this.formData.configInstruction,
                            curbWeight: this.formData.curbWeight,
                            maxTotalWeight: this.formData.maxTotalWeight,
                            fuelConsumption: this.formData.fuelConsumption,
                            modelList: this.formData.modelList,
                            powerList: this.formData.powerList,
                            firstAnnouncementInfo: this.formData.firstAnnouncementInfo,
                            certResponsible: this.formData.certResponsible,
                            available: this.formData.available,
                            eosDate: this.formData.eosDate,
                            // according: this.formData.according,
                            rectificationId: this.formData.rectificationId
                        }
                        if (this.caseType === 'editCase') {
                            params.id = this.id;
                            if(this.fromPage==='finishList'){
                                //申请修改
                                announcementModelApplyModify(params).then(res=>{
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'applyEdit';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                })
                            }else{
                                //修改
                                vehicleAnnounceCarUpdate(params).then(res => {
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'edit';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err => {
                                    this.loading = false;
                                })
                            }

                        } else if (this.caseType === 'addCase') {
                            vehicleAnnounceCarAdd(params).then(res => {
                                this.loading = false;
                                let doObj = {}
                                doObj.action = 'add';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch(err => {
                                this.loading = false;
                            })
                        }
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .editVehicleAnnounceCar {
        background: #fff;
        height: 100%;
    }

    .editVehicleAnnounceCar .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editVehicleAnnounceCar .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editVehicleAnnounceCar .addForm .el-input,
    .editVehicleAnnounceCar .addForm .el-select {
        /* width: 150px; */
        width: 100%;
    }

    .viewContent {
        color: #606266;
    }

    .viewContent.leftText {
        font-size: 14px;
        line-height: 28px;
    }

    .editVehicleAnnounceCar .tableRow {
        text-align: right;
    }

    .editVehicleAnnounceCar .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }

    .editVehicleAnnounceCar .mB0 .el-form-item {
        margin-bottom: 10px;
    }

    .editVehicleAnnounceCar .planBox {
        /* margin-left: 20px; */
        border-bottom: 1px solid #f0f0f0;
    }

    .editVehicleAnnounceCar .plan-item {
        border-radius: 5px 5px 0px 0px;
        display: inline-block;
        background: transparent;
        font-size: 13px;
        color: #000;
        padding: 12px 20px;
        border: 1px solid #f0f0f0;
        border-bottom: 0px;
        cursor: pointer;
        user-select: none;
    }

    .editVehicleAnnounceCar .plan-item+.plan-item {
        margin-left: 10px;
    }

    .editVehicleAnnounceCar .plan-item.active {
        background: rgb(75, 150, 238);
        color: #fff;
    }

    .editVehicleAnnounceCar .selectAccording.el-textarea /deep/ textarea {
        cursor: pointer !important;
    }
    .editVehicleAnnounceCar .el-tag.el-tag{
        margin-left:4px;
        user-select: none;
        cursor: pointer;
    }
</style>