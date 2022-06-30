<template>
<div class="knowLibEdit">
    <!-- 编辑知识库 -->
    <div style="height:60px;marginBottom:10px">
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item prop="name" label="名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="简介">
                <el-input v-model="form.summary" type="textarea" style="width:300px">
                </el-input>
            </el-form-item>
            <el-form-item label="知识库类型" prop="category">
                <el-select v-model="form.category" placeholder="请选择">
                    <el-option label="企业标准" value="1"></el-option>
                    <el-option label="外来标准" value="2"></el-option>
                    <el-option label="业务指南" value="3"></el-option>
                    <el-option label="通用文档" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="form.code" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="全员可见">
                <el-switch v-model="form.visibleToAll" active-color="" inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item label="查看用户" v-if="!form.visibleToAll">
                <tag-select style="width: 300px;vertical-align: top;" :initDataStr="exposeMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="exposeMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="隐藏用户" v-else>
                <tag-select style="width: 300px;vertical-align: top;" :initDataStr="hideMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept' }" @callBack="hideMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="管理用户">
                <tag-select style="width: 300px;vertical-align: top;" :initDataStr="manageMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="manageMember">
                </tag-select>
            </el-form-item>
        </el-form>
        <el-col align="center">
            <el-button @click="cancelFunc">取消</el-button>
            <el-button type="primary" @click="createKnowledgeLib">确定</el-button>
        </el-col>
    </div>
</div>
</template>

<script>
import { updateKnowledgeLib, getKnowledgeLibDetail } from '../../../api/knowledge.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { LogLevel } from 'dingtalk-jsapi/lib/sdk'
export default {
    name: 'knowLibEdit',
    components: {
        tagSelect
    },
    data() {
        return {
            form: {
                id: '',
                name: '',
                category: '',
                summary: '',
                icon: '',
                code: '',
                visibleToAll: false,
                exposeMembers: [],
                hideMembers: [],
                manageMembers: []
            },
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            id: '',
            rules: {
                name: [
                    { required: true, message: '请输入知识库名称', trigger: 'blur' },
                ],
                category: [
                    { required: true, message: '知识库类型', trigger: 'change' }
                ]
            }
        }
    },
    created() {
        this.id = this.$route.params.id
        this.form.id = this.$route.params.id
    },
    mounted() {
        this.getInfo()
    },
    methods: {
        // 获取知识库信息
        getInfo() {
            getKnowledgeLibDetail(this.id).then(res => {
                console.log(res)
                const { name, summary, visibleToAll, exposeMembers, hideMembers, manageMembers, order, category, code } = res
                // console.log(exposeMembers, hideMembers, manageMembers, '选人')
                this.form.name = name
                this.form.category = category
                this.form.summary = summary
                this.form.visibleToAll = visibleToAll
                this.form.order = order
                this.form.code = code
                this.form.exposeMembers = exposeMembers
                this.form.hideMembers = hideMembers
                this.form.manageMembers = manageMembers
                let exposeArr = []
                let hideArr = []
                let manageArr = []
                this.handleSelect(exposeMembers, exposeArr)
                this.handleSelect(hideMembers, hideArr)
                this.handleSelect(manageMembers, manageArr)
                // console.log(exposeArr, hideArr, manageArr, '选人传递')
                let exposeStr = exposeArr.join('|')
                let hideStr = hideArr.join('|')
                let manageStr = manageArr.join('|')
                this.exposeMembers = exposeStr
                this.hideMembers = hideStr
                this.manageMembers = manageStr
                // console.log(this.exposeMembers,this.hideMembers,this.manageMembers,'总结果')
            })
        },
        // 选人数据处理
        handleSelect(arrType, arrAimType) {
            // console.log(arrType)
            if (arrType) {
                arrType.forEach(item => {
                    let obj = {}
                    obj.type = item.type
                    obj.orgId = item.orgId
                    obj.linkId = item.linkId
                    arrAimType.push(JSON.stringify(obj))
                });
            }
        },
        // 查看用户
        exposeMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds;
                this.form.exposeMembers = data.itemArray;
            } else {
                this.exposeMembers = ''
                this.form.exposeMembers = []
            }
        },
        // 隐藏用户
        hideMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.hideMembers = linkIds;
                this.form.hideMembers = data.itemArray;
            } else {
                this.hideMembers = ''
                this.form.hideMembers = []
            }
        },
        // 管理用户
        manageMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.manageMembers = linkIds;
                this.form.manageMembers = data.itemArray;
            } else {
                this.manageMembers = ''
                this.form.manageMembers = []
            }
        },
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
        createKnowledgeLib() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // 创建
                    updateKnowledgeLib(this.form).then(res => {
                        this.$message({
                            duration: 2000,
                            type: 'success',
                            message: '更新成功',
                            onClose: () => {
                                let doObj = {};
                                doObj.action = 'editKnowledgeLib';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }
                        })
                        //  EcoUtil.getSysvm().closeDialog();
                    })
                } else {
                    return false;
                }
            });

        }
    },
}
</script>

<style scoped>
.knowLibEdit {
    width: 400px;
    padding: 20px;
}
</style>
