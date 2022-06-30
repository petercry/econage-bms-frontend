<template>
    <div class="editAuthority">
        <el-form :model="formData" ref='authorityForm' :rules='rules' v-loading="loading" class="addForm" label-position="right"
            label-width="120px">
            <el-row>
                <el-col :span='21'>
                    <el-form-item label="角色类型:">
                        <el-input v-model="formData.roleTypeName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12' v-for='(label,key) in columnList' :key='key'>
                    <el-form-item :label="label" :prop="key" v-if="key != 'faw_pm_model_activity'">
                        <el-select multiple v-model="formData[key]" style="width:70%" collapse-tags>
                            <el-option v-for='(item2,index2) in optionList' :key='index2' :label="item2.text" :value="item2.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="btn">
            <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { mapActions, mapGetters } from 'vuex'
    import { getAuthorityListSingle, editAuthority } from '../../../api/authority.js'
    import { getEnumSelectEnabled } from '../../../api/common.js'
    export default {
        name: 'editAuthority',
        data() {
            return {
                roleType: '',
                loading: false,
                formData: {
                    "roleTypeName": '',
                    'faw_pm_model_activity': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_info': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_group': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_plan': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_miles': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_contract': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_risk': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_problem': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_auth': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_qtms': ['faw_pm_authority_operate_no'],
                    'faw_pm_model_div':['faw_pm_authority_operate_no'],
                },
                form: {},
                optionList: [],
                columnList: {
                    faw_pm_model_activity: '专业:', faw_pm_model_info: '项目卡片:', faw_pm_model_group: '团队:', faw_pm_model_plan: '项目计划:',
                    faw_pm_model_miles: '里程牌:', faw_pm_model_contract: '项目合同:', faw_pm_model_risk: '风险:', faw_pm_model_problem: '问题:',
                    faw_pm_model_auth: '权限', faw_pm_model_qtms:'QTMS',faw_pm_model_div:'交付物'
                },
                rules: {
                    faw_pm_model_activity: [{ required: false, message: '专业权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_info: [{ required: true, message: '项目卡片权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_group: [{ required: true, message: '团队权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_plan: [{ required: true, message: '项目计划权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_miles: [{ required: true, message: '里程碑权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_contract: [{ required: true, message: '项目合同权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_risk: [{ required: true, message: '风险权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_problem: [{ required: true, message: '问题权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_auth: [{ required: true, message: '权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_qtms: [{ required: true, message: 'QTMS权限为必填项!', trigger: 'blur' }],
                    faw_pm_model_div: [{ required: true, message: '交付物权限为必填项!', trigger: 'blur' }]
                },
                modelId:null,
                infoId:null
            }
        },
        created() {
            _self = this;
            if(this.$route.params.moudleId && this.$route.params.moudleId > 0){
                if(this.$route.params.moudle == "templates"){
                    this.modelId = this.$route.params.moudleId;
                }
                if(this.$route.params.moudle == "project"){
                    this.infoId = this.$route.params.moudleId;
                }

            }
            getEnumSelectEnabled('faw_pm_authority_operate_type','update-enabled').then(res => {
                this.optionList = res;
                this.roleType = this.$route.params.roleType;
                this.getAuthorityListSingle();
            })
        },
        methods: {
            resastData(data){
                var arr=[];
                data.forEach((item,index)=>{
                    arr.push({"type":item});
                })
                return arr;
            },
            getAuthorityListSingle() {
                getAuthorityListSingle({ roleType: this.roleType,modelId:this.modelId,infoId:this.infoId },this.$route.params.moudle).then(res => {
                    this.formData.roleTypeName = res.roleTypeName;
                    for (var key in res.modelMap) {
                        var arr = [];
                        res.modelMap[key].operateType.forEach((item, index) => {
                            arr.push(item.type);
                        })
                        this.formData[key] = arr;
                    }
                })
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.loading = true;
                this.$refs.authorityForm.validate((valid) => {
                    if (valid) {
                        this.form = {
                            roleTypeName: this.formData.roleTypeName,
                            roleType: this.roleType,
                            modelMap: {},
                        }
                        if(this.modelId){
                            this.form.modelId = this.modelId;
                        }
                        if(this.infoId){
                            this.form.infoId = this.infoId;
                        }
                        for(var key in this.columnList){
                            if(this.formData[key].length!==0){
                                this.form.modelMap[key]={
                                    modelType:key,
                                    operateType:this.resastData(this.formData[key])
                                }
                            }
                        }
                        editAuthority(this.form,this.$route.params.moudle).then(res => {
                            this.loading = false;
                            let doObj = {}
                            doObj.action = 'editAuthority';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        })
                    } else {
                        this.loading = false;
                        return false;
                    }
                });

            }
        }

    };
</script>

<style scoped>
    .editAuthority {
        background: #fff;
        height: 100%;
    }

    .editAuthority .btn {
        text-align: right;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editAuthority .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
        padding-top: 20px;
    }

    .editAuthority .addForm .allItem {
        width: auto;
    }

    .fileMain {
        padding: 16px;
        border: 1px solid #e8e8e8;
        background-color: #fafafa;
    }

    .btn-line {
        border: 1px dashed #003b90;
        background-color: #fff;
        color: #003b90;
        cursor: pointer;
        text-align: center;
        border-radius: 4px;
        margin: 10px 0px;
    }

    .iconclosecircleo {
        font-size: 16px;
        color: #003b90;
        margin-left: 5px;
        cursor: pointer;
    }
</style>
