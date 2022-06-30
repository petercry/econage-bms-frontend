<template>
    <div class='rideHailingEdit'>
        <div class='editForm'>
            <el-form :model='formData' ref='rideHailingForm' :rules='rules' v-loading='loading' label-width='200px' label-position='right'>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='城市:' prop='city'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.city'></el-input>
                            <span class="viewContent" v-else>{{formData.city}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='牌照:' prop='license'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.license'></el-input>
                            <span class="viewContent" v-else>{{formData.license}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='排量:' prop='displacement'>
                            <el-input v-if='isEdit' placeholder='请输入' @blur="numberInput('displacement')" v-model='formData.displacement'></el-input>
                            <span class="viewContent" v-else>{{formData.displacement}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='车龄:' prop='carAge'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.carAge'></el-input>
                            <span class="viewContent" v-else>{{formData.carAge}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='轴距:' prop='wheelBase'>
                            <el-input v-if='isEdit' placeholder='请输入'  v-model='formData.wheelBase'></el-input>
                            <span class="viewContent" v-else>{{formData.wheelBase}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='车价:' prop='price'>
                            <el-input v-if='isEdit' placeholder='请输入'  v-model='formData.price'></el-input>
                            <span class="viewContent" v-else>{{formData.price}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='车身尺寸(mm):' prop='bodySize'>
                            <el-input v-if='isEdit' placeholder='请输入' @blur="numberInput('bodySize')" v-model='formData.bodySize'></el-input>
                            <span class="viewContent" v-else>{{formData.bodySize}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='发动机/电机功率(kw):' prop='motorPower'>
                            <el-input v-if='isEdit' placeholder='请输入' @blur="numberInput('motorPower')" v-model='formData.motorPower'></el-input>
                            <span class="viewContent" v-else>{{formData.motorPower}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='发动机/电机扭矩(N.m):' prop='motorTorque'>
                            <el-input v-if='isEdit' placeholder='请输入' @blur="numberInput('motorTorque')" v-model='formData.motorTorque'></el-input>
                            <span class="viewContent" v-else>{{formData.motorTorque}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='综合工况油耗(L/100km):' prop='fuelConsumption'>
                            <el-input v-if='isEdit' placeholder='请输入' @blur="numberInput('fuelConsumption')" v-model='formData.fuelConsumption'></el-input>
                            <span class="viewContent" v-else>{{formData.fuelConsumption}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='纯电动续驶里程(km):' prop='drivingRange'>
                            <el-input v-if='isEdit' placeholder='请输入' @blur="numberInput('drivingRange')" v-model='formData.drivingRange'></el-input>
                            <span class="viewContent" v-else>{{formData.drivingRange}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='ABS:' prop='abs'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.abs'></el-input>
                            <span class="viewContent" v-else>{{formData.abs}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='安全气囊:' prop='airbag'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.airbag'></el-input>
                            <span class="viewContent" v-else>{{formData.airbag}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='卫星定位装置:' prop='satellitePosition'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.satellitePosition'></el-input>
                            <span class="viewContent" v-else>{{formData.satellitePosition}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='应急报警装置:' prop='alarmDevice'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.alarmDevice'></el-input>
                            <span class="viewContent" v-else>{{formData.alarmDevice}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='前雾灯:' prop='frontFogLights'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.frontFogLights'></el-input>
                            <span class="viewContent" v-else>{{formData.frontFogLights}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='电子制动力分配系统(EBD):' prop='ebd'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.ebd'></el-input>
                            <span class="viewContent" v-else>{{formData.ebd}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='车身电子稳定系统(ESP):' prop='esp'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.esp'></el-input>
                            <span class="viewContent" v-else>{{formData.esp||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='牵引力控制系统(TCS):' prop='tcs'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.tcs'></el-input>
                            <span class="viewContent" v-else>{{formData.tcs}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='刹车辅助系统(BA):' prop='ba'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.ba'></el-input>
                            <span class="viewContent" v-else>{{formData.ba}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='车载终端设备:' prop='terminalEquipment'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.terminalEquipment'></el-input>
                            <span class="viewContent" v-else>{{formData.terminalEquipment}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='行李厢容积(L):' prop='compartmentVolume'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.compartmentVolume' @blur="numberInput('compartmentVolume')"></el-input>
                            <span class="viewContent" v-else>{{formData.compartmentVolume}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='有效日期' prop='expirationDate'>
                            <el-date-picker v-if='isEdit' v-model="formData.expirationDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
                            </el-date-picker>
                            <span class='viewContent' v-else>{{formData.expirationDate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='其他:' prop='other'>
                            <el-input v-if='isEdit' v-model='formData.other' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.other||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='法规文档:'>
                            <upload :isEdit='isEdit' :showList='true' :multiple="false" :modular="modular" :modularInnerId="rideHailingModularInnerId"
                                @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn" v-if='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { ridehailingAdd, getItemFetchId, ridehailingDeatils, ridehailingUpdate,ridehailingApplyUpdate } from '../service/service.js'
    import upload from './components/upload.vue'
    import { mapState } from 'vuex'
    export default {
        name: 'rideHailingEdit',
        data() {
            return {
                formData: {
                    city: '',
                    license: '',
                    wheelBase:'', //轴距
                    price:'', //车价
                    displacement: '',
                    carAge: '',
                    bodySize: '',
                    motorPower: '',
                    motorTorque: '',
                    fuelConsumption: '',
                    drivingRange: '',
                    expirationDate: '',
                    abs: '',
                    airbag: '',
                    satellitePosition: '',
                    alarmDevice: '',
                    frontFogLights: '',
                    ebd: '',
                    esp: '',
                    tcs: '',
                    ba: '',
                    terminalEquipment: '',
                    compartmentVolume: '',
                    other: '',
                },
                loading: false,
                modular: 'rideHailing_documents',
                rideHailingModularInnerId: '',
                fileList: []
            }
        },
        computed: {
            id() {
                return this.$route.params.id;
            },
            caseType() {
                return this.$route.params.caseType;
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            fromPage() {
                return this.$route.params.fromPage;
            },
            ruleKeys() {
                return {
                    city: '城市',
                    license: '牌照',
                    displacement: '排量',
                    carAge: '车龄',
                    wheelBase:'轴距',
                    price:'车价',
                    bodySize: '车身尺寸',
                    motorPower: '发动机/电机功率',
                    motorTorque: '发动机/电机扭矩',
                    fuelConsumption: '综合工况油耗',
                    drivingRange: '纯电动续驶里程',
                    abs: 'ABS',
                    airbag: '安全气囊',
                    satellitePosition: '卫星定位装置',
                    alarmDevice: '应急报警装置',
                    frontFogLights: '前雾灯',
                    ebd: '电子制动力分配系统',
                    tcs: '牵引力控制系统',
                    ba: '刹车辅助系统',
                    terminalEquipment: '车载终端设备',
                    compartmentVolume: '行李厢容积',
                    expirationDate: '有效日期'
                }
            },
            rules() {
                // var obj = {};
                // var validateLicense = (rule, value, callback) => {
                //     if (!value) {
                //         callback(new Error('车牌为必填项'))
                //     } else if (/^[\u4e00-\u9fa5]{1}[A-Za-z]{1}([·-]|\s+)?[A-Z0-9]{5}$/g.test(value)) {
                //         callback();
                //     } else {
                //         callback(new Error('车牌格式不正确'))
                //     }
                // }
                // for (var key in this.ruleKeys) {
                //     var trigger = (key == 'expirationDate' ? 'change' : 'blur');
                //     if (key === 'license') {
                //         obj[key] = [{ required: true, validator: validateLicense, trigger: trigger }];
                //     } else {
                //         obj[key] = [{ required: true, message: `${this.ruleKeys[key]}为必填项`, trigger: trigger }];
                //     }
                // }
                // return obj;

                var validateLicense = (rule, value, callback) => {
                    if(value){
                        if (/^[\u4e00-\u9fa5]{1}[A-Za-z]{1}([·-]|\s+)?[A-Z0-9]{5}$/g.test(value)) {
                            callback();
                        } else {
                            callback(new Error('车牌格式不正确'))
                        }
                    }else{
                        callback();
                    }
                }
                // return {license:[{ required: false, validator: validateLicense, trigger: 'blur' }]};
                return {}
            }
        },
        components: {
            upload
        }, created() {
            _self = this;
            if (this.id && this.id != '0') {
                this.getDetailsInfo();
            } else {
                getItemFetchId().then(res => {
                    this.rideHailingModularInnerId = res.data;
                })
            }
        }, methods: {
            numberInput(key) {
                if (this.formData[key]) {
                    if (/^\d+(\.(\d+)?)?$/.test(this.formData[key])) {
                        var len = (this.formData[key].length-1);
                        if (this.formData[key].indexOf('.') == -1) {
                            this.formData[key] = this.formData[key] + '.00';
                        } else if (this.formData[key].indexOf('.') === len) {
                            this.formData[key] = this.formData[key] + '00';
                        } else if (this.formData[key].indexOf('.') === (len - 1)) {
                            this.formData[key] = this.formData[key] + '0';
                        }
                        //开头为0
                        if (this.formData[key][0] == '0' && this.formData[key][1] !== '.') {
                            this.formData[key] = this.formData[key].slice(1);
                        }
                    }else{
                        this.formData[key] = this.formData[key].replace(/[^\d]/g,'');
                    }
                }
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.rideHailingForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            city: this.formData.city,
                            license: this.formData.license,
                            wheelBase:this.formData.wheelBase, //轴距
                            price:this.formData.price, //车价
                            displacement: this.formData.displacement,
                            carAge: this.formData.carAge,
                            bodySize: this.formData.bodySize,
                            motorPower: this.formData.motorPower,
                            motorTorque: this.formData.motorTorque,
                            fuelConsumption: this.formData.fuelConsumption,
                            drivingRange: this.formData.drivingRange,
                            expirationDate: this.formData.expirationDate||'',
                            abs: this.formData.abs,
                            airbag: this.formData.airbag,
                            satellitePosition: this.formData.satellitePosition,
                            alarmDevice: this.formData.alarmDevice,
                            frontFogLights: this.formData.frontFogLights,
                            ebd: this.formData.ebd,
                            esp: this.formData.esp,
                            tcs: this.formData.tcs,
                            ba: this.formData.ba,
                            terminalEquipment: this.formData.terminalEquipment,
                            compartmentVolume: this.formData.compartmentVolume,
                            other: this.formData.other,
                        }
                        if (this.caseType === 'editCase') {
                            params.id = this.id;
                            if(this.fromPage=='finishList'){
                                ridehailingApplyUpdate(params).then(res=>{
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'applyEdit';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err => {
                                    this.loading = false;
                                })
                            }else{
                                ridehailingUpdate(params).then(res => {
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
                        } else {
                            //新增
                            params.id = this.rideHailingModularInnerId;
                            ridehailingAdd(params).then(res => {
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
                        return false
                    }
                })
            },
            getDetailsInfo() {
                this.loading = true;
                ridehailingDeatils(this.id).then(res => {
                    this.formData = res.data;
                    this.rideHailingModularInnerId = res.data.id;
                    this.loading = false;
                })
            },
            fileOnSuccess(response) {

            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            beforeFileUpload(file, callback) {
                // var testmsg = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLocaleLowerCase();
                // const extension = testmsg === 'doc';
                // const extension2 = testmsg === 'docx';
                // const extension3 = testmsg === 'xls';
                // const extension4 = testmsg === 'xlsx';
                // const extension5 = testmsg === 'ppt';
                // const extension6 = testmsg === 'pptx';
                // const extension7 = testmsg === 'txt';
                // const extension8 = testmsg === 'pdf';
                // if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8) {
                //     this.$message({
                //         message: '上传文件只能是.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf格式!',
                //         type: 'warning',
                //         customClass: 'message',
                //         offset: 160
                //     });
                // }
                // callback((extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8));
                callback(true);
            },
        }
    }
</script>
<style scoped>
.rideHailingEdit {
  background: #fff;
  height: 100%;
}

.rideHailingEdit .editForm {
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
  padding: 0 10px;
}

.rideHailingEdit .editForm .el-input,
.rideHailingEdit .editForm .el-select,
.rideHailingEdit .editForm .el-date-editor {
  width: 200px;
}

.rideHailingEdit .viewContent {
  color: #606266;
}

.rideHailingEdit .uploadBtn {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
  background: transparent;
  color: #409eff;
  border: 0;
  padding: 5px 20px;
}

.rideHailingEdit .btn {
  text-align: center;
  padding: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #ddd;
}
</style>
