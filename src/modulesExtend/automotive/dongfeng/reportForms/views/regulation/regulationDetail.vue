<template>
<div class='editRegulatory'>
    <div class='addForm'>
        <el-form :model='formData' ref='regulatoryForm' v-loading='loading' label-position='right' label-width='130px'>
            <div class='rowTitle'>法规信息</div>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='分类:'>
                        <el-input v-model='formData.category' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label='子类:'>
                        <el-input v-model='formData.subCategory' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='法规编号:'>
                        <el-input v-model='formData.regulationCode' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label='法规名称:'>
                        <el-input v-model='formData.regulationName' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='法规版本:'>
                        <el-input v-model='formData.regulationVersion' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label='相关网址'>
                        <el-input v-model='formData.url' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='23'>
                    <el-form-item label='标准简介:'>
                        <el-input v-model='formData.introduction' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000' :disabled='true'></el-input>
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
                        <!-- <el-table-column label='操作' fixed='right'>
                            <template slot-scope='scope'>
                                <el-button @click.native.prevent="delRowItem(scope.$index,'infoList')" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='法规状态:'>
                        <el-input v-model='formData.standardStatus' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label='性质:'>
                        <el-input v-model='formData.nature' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='适用整车/零部件:'>
                        <el-input v-model='formData.applicableType' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label='认证管理分类:'>
                        <el-select v-model="formData.certificationTypeItems" multiple :disabled='true'>
                            <el-option v-for="item in formData.certificationTypeItems" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <!-- <el-input v-model='formData.certificationTypeItems' :disabled='true'></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='23'>
                    <el-form-item label='适用车型:'>
                        <el-select v-model="formData.carModelItems" multiple :disabled='true'>
                            <el-option v-for="item in formData.carModelItems" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <!-- <el-input v-model='formData.carModelItems' :disabled='true'></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='23'>
                    <el-form-item label='动力类型:'>
                        <el-select v-model="formData.powerTypeItems" multiple :disabled='true'>
                            <el-option v-for="item in formData.powerTypeItems" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <!-- <el-input v-model='formData.powerTypeItems' :disabled='true'></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='23'>
                    <el-form-item label='气体燃料专用:'>
                        <el-select v-model="formData.gasFuelItems" multiple :disabled='true'>
                            <el-option v-for="item in formData.gasFuelItems" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <!-- <el-input v-model='formData.gasFuelItems' :disabled='true'></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <div class='rowTitle'>法规政策起草单位信息</div>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='联系人:'>
                        <el-input v-model='formData.contactPerson' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label='联系人单位:' ref='selectDept'>
                        <el-input v-model='formData.contactUnit' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='联系方式:'>
                        <el-input v-model='formData.contactDetails' :disabled='true'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class='rowTitle'>RP-CFT</div>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label='法规负责人:' ref='selectRegulation'>
                        <!-- <tag-select placeholder="选择人员" style="width:200px;vertical-align: top;" :initDataStr="formData.regulationLeaderInitDataStr" :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRegulationLeader">
                        </tag-select> -->
                        <span class='viewContent'>{{formData.regulationLeaderName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='23' style='padding-left:40px;box-sizing: border-box;'>
                    <el-table :data='infoListTwo' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}" :cell-style="{textAlign:'center'}">
                        <el-table-column prop='deptInitDataStr' label='部门' width='160'>
                            <template slot-scope='scope'>
                                <tag-select placeholder="选择部门" style="width:100%;vertical-align: top;" :initDataStr="scope.row.deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRow(data,scope.$index,'dept')">
                                </tag-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop='contactInitDataStr' label='应对小组成员/联系人'>
                            <template slot-scope='scope'>
                                <tag-select placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.contactInitDataStr" :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>selectRow(data,scope.$index,'contact')">
                                </tag-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop='ccInitDataStr' label='抄送人员'>
                            <template slot-scope='scope'>
                                <tag-select placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="scope.row.ccInitDataStr" :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>selectRow(data,scope.$index,'cc')">
                                </tag-select>
                            </template>
                        </el-table-column>
                        <el-table-column label='操作' width='100'>
                            <template slot-scope='scope'>
                                <el-button @click.native.prevent="delRowItem(scope.$index,'infoListTwo')" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

        </el-form>
    </div>
</div>
</template>

<script>
var _self;
import { EcoUtil } from '@/components/util/main.js'
import { EcoFile } from '@/components/file/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { EcoMessageBox } from "@/components/messageBox/main.js";
import { getRegulationDetail } from '../../api/report'
import { getUserInfoByOrgId } from '../../service/service'

export default {
    name: 'editRegulatory',
    data() {
        return {
            btnRoleObj: {},
            fileList: [],
            fileList2: [],
            modular: 'regulatory_documents',
            modular2: 'related_documents',
            regulatoryModularInnerId: '',
            id: "",
            caseType: '',
            infoList: [],
            infoListTwo: [],
            formData: {
                // category: '',
                // subCategory: '',
                // regulationCode: '',
                // regulationName: '',
                // introduction: '',
                // standardStatus: '',
                // nature: '',
                // applicableType: '',
                // // trackMethod: '',
                // // trackFrequency: '',
                // contactPerson: '',
                // contactUnit: '',
                // contactDetails: '',
                // regulationLeader: '',
                // rpList: [],
                // certificationTypeItems: [],
                // carModelItems: [],
                // powerTypeItems: [],
                // gasFuelItems: [],
                // // initDataStr: '',
                // // deptInitDataStr: '',
                // regulationLeaderInitDataStr: '',
                // regulationVersion: '', //法规版本
                // url: '', //相关网址
                // content: ''
            },
            loading: false,
        }
    },
    components: {
        tagSelect
    },
    created() {
        this.id = this.$route.params.id
        this.getRegulationDetail()
    },
    mounted() {

    },
    methods: {
        getRegulationDetail() {
            getRegulationDetail(this.id).then(res => {

                // console.log(res)
                this.formData = res
                this.infoList = res.implTimeList;

                getUserInfoByOrgId(res.regulationLeader).then(response => {
                    // this.formData.regulationLeaderInitDataStr = `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`;
                    // this.formData.regulationLeaderName = response.data.mi;
                    this.$set(this.formData, 'regulationLeaderInitDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                    this.$set(this.formData, 'regulationLeaderName', response.data.mi);
                })
                this.initInfoListTwo()
            })
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
    }
}
</script>

<style scoped>
.editRegulatory {
    background: #fff;
    height: 100%;
}

.editRegulatory .btn {
    text-align: center;
    padding: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ddd;
}

.editRegulatory .addForm {
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
    padding: 0 10px;
}

.editRegulatory .addForm .el-input,
.editRegulatory .addForm .el-select {
    width: 200px;
}

.viewContent {
    color: #606266;
}

.editRegulatory .tableRow {
    text-align: right;
}

.editRegulatory .tableRow span {
    margin-right: 2px;
    font-size: 14px;
    color: #0f1419;
}

.editRegulatory .uploadBtn {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
    background: transparent;
    color: #409EFF;
    border: 0;
    padding: 5px 20px;
}

.rowTitle {
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background: rgb(103, 112, 126);
    margin-bottom: 20px;
}

.mT2 {
    margin-top: 20px;
}
</style>
