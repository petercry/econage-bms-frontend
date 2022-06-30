<template>
    <div class='editStatistics'>
        <div class='addForm'>
            <el-form :model='formData' ref='statisticsForm' :rules='rules' v-loading='loading' label-position='right' label-width='130px'>
                <el-row>
                    <el-col :span='9'>
                        <el-form-item label='序号:' prop='seq'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.seq' ></el-input>
                            <span class="viewContent" v-else>{{formData.seq}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='14'>
                        <el-form-item label='检验项目' prop='testProject'>
                            <el-input style='width:100%' v-if='isEdit' placeholder="请输入" v-model='formData.testProject'></el-input>
                            <span class='viewContent' v-else>{{formData.testProject}}</span>
                        </el-form-item>   
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                         <el-form-item label='检验依据:' prop='testBasis'>
                            <el-input v-if='isEdit' v-model='formData.testBasis' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.testBasis}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='2' style='text-align:right;'>
                        <span class='viewContent leftText'>公告</span>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='是否适用:' prop='announcementApplicable'>
                            <el-select filterable v-if='isEdit' v-model='formData.announcementApplicable'>
                                <el-option v-for='(item) in isApplicable' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.announcementApplicable,'applicable')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='7'>
                        <el-form-item label='NT' prop='announcementNt'>
                            <el-date-picker v-if='isEdit' style='width:180px' v-model="formData.announcementNt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.announcementNt}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='7'>
                        <el-form-item label='TT' prop='annoucementTt'>
                            <el-date-picker v-if='isEdit' style='width:180px' v-model="formData.annoucementTt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.annoucementTt}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='2' style='text-align:right;'>
                        <span class='viewContent leftText'>CCC</span>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='是否适用:' prop='cccApplicable'>
                            <el-select filterable v-if='isEdit' v-model='formData.cccApplicable'>
                                <el-option v-for='(item) in isApplicable' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.cccApplicable,'applicable')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='7'>
                        <el-form-item label='NT' prop='cccNt'>
                            <el-date-picker v-if='isEdit' style='width:180px' v-model="formData.cccNt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.cccNt}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='7'>
                        <el-form-item label='TT' prop='cccTt'>
                            <el-date-picker v-if='isEdit' style='width:180px' v-model="formData.cccTt" value-format='yyyy-MM-dd' type="date" placeholder="选择日期"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.cccTt}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                         <el-form-item label='实施情况说明:' prop='implementDesciption'>
                            <el-input v-if='isEdit' v-model='formData.implementDesciption' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.implementDesciption}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='适用车型:' prop='modelList'>
                            <el-checkbox-group v-model="formData.modelList" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item) in applicableModels' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.modelList,'modelList')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='动力类型:' prop='powerList'>
                            <el-checkbox-group v-model="formData.powerList" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item) in powerType' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.powerList,'powerList')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="是否有效" prop='available'>
                            <el-select filterable v-if='isEdit' v-model='formData.available'>
                                <el-option v-for="(item) in available" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(formData.available,'available')}}</span>
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
    import { productioncarVehicleAdd,productioncarVehicleDetails,productioncarVehicleUpload } from '../service/service.js'
    import { mapState } from 'vuex'
    export default {
        name: 'editStatistics',
        data() {
            return {
                caseType: '',
                formData: {
                   seq:'',
                   testProject:'',
                   testBasis:'',
                   announcementApplicable:'',
                   announcementNt:'',
                   annoucementTt:'',
                   cccApplicable:'',
                   cccNt:'',
                   cccTt:'',
                   implementDesciption:'',
                   available:'',
                   modelList:[],
                   powerList:[]
                },
                loading: false,
            }
        },
        computed: {
            ...mapState(['isApplicable','applicableModels','powerType','available']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            id(){
                return this.$route.params.id;
            },
            rules(){
              let obj={
                   seq:'序号',
                   testProject:'检验项目',
                   testBasis:'检验依据',
                   announcementApplicable:'是否适用',
                   announcementNt:'NT',
                   annoucementTt:'TT',
                   cccApplicable:'是否适用',
                   cccNt:'NT',
                   cccTt:'TT',
                   implementDesciption:'实施情况说明',
                   available:'是否有效',
                   modelList:'适用车型',
                   powerList:'动力类型'
              }
              let newObj={}
              for(var key in obj){
                  var trigger = (key.search(/(List)|(Nt)|(Tt)|(Applicable)|(available)/g)!==-1)?'change':'blur'
                  newObj[key] = [{ required: true, message: `${obj[key]}为必填项`, trigger: trigger }];
              }
              return newObj;
            }
        },
        created() {
            _self = this;
            this.caseType = this.$route.params.caseType;
            if (this.id && this.id != 0) {
                this.getDetailsInfo();
            }
        },
        methods: {
            getDetailsInfo() {
                this.loading = true;
                productioncarVehicleDetails(this.id).then(res => {
                    res.data.modelList = res.data.modelList||[];
                    res.data.powerList = res.data.powerList||[];
                    this.formData = res.data;
                    this.loading = false;
                }).catch(err=>{
                    this.loading = false;
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.statisticsForm.validate((valid) => {
                    if (valid) {
                            this.loading = true;
                            let params = {
                                seq:this.formData.seq,
                                testProject:this.formData.testProject,
                                testBasis:this.formData.testBasis,
                                announcementApplicable:this.formData.announcementApplicable,
                                announcementNt:this.formData.announcementNt,
                                annoucementTt:this.formData.annoucementTt,
                                cccApplicable:this.formData.cccApplicable,
                                cccNt:this.formData.cccNt,
                                cccTt:this.formData.cccTt,
                                implementDesciption:this.formData.implementDesciption,
                                available:this.formData.available,
                                modelList:this.formData.modelList,
                                powerList:this.formData.powerList
                            }
                            if (this.caseType === 'editCase') {
                                params.id = this.id;
                                //修改
                                productioncarVehicleUpload(params).then(res=>{
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'edit';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err=>{
                                    this.loading = false;
                                })
                            } else if (this.caseType === 'addCase') {
                                productioncarVehicleAdd(params).then(res => {
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
    .editStatistics {
        background: #fff;
        height: 100%;
    }

    .editStatistics .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editStatistics .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editStatistics .addForm .el-input,
    .editStatistics .addForm .el-select {
        width: 150px;
    }

    .viewContent {
        color: #606266;
    }
    .viewContent.leftText{
        font-size:14px;
        line-height: 28px;
    }

    .editStatistics .tableRow {
        text-align: right;
    }

    .editStatistics .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }
</style>