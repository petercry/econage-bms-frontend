<template>
<div class="knowLibAdd">
    <!-- 新增知识库 -->
    <div style="height:60px;marginBottom:10px">
        <div style="marginLeft:31px;float: left;">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item prop="name" label="名称">
                    <el-input v-model="form.name" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="form.summary" type="textarea" style="width:300px">
                    </el-input>
                </el-form-item>
                <el-form-item label="知识库类型" prop="category">
                    <el-select v-model="form.category" placeholder="请选择">
                        <el-option label="企业标准" value="4"></el-option>
                        <el-option label="外来标准" value="2"></el-option>
                        <el-option label="业务指南" value="3"></el-option>
                        <el-option label="通用文档" value="1"></el-option>
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
        </div>
        <div style="textAlign:center">
            <el-button @click="cancelFunc">取消</el-button>
            <el-button type="primary" @click="createKnowledgeLib">开始创建</el-button>
        </div>
    </div>
</div>
</template>

<script>
import { createKnowledgeLib } from '../../../api/knowledge.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
export default {
    name: 'knowLibAdd',
    components: {
        tagSelect
    },
    data() {
        return {
            form: {
                name: '',
                category: '',
                icon: '',
                code: '',
                summary: '',
                visibleToAll: false,
                exposeMembers: [],
                hideMembers: [],
                manageMembers: []
            },
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
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
    methods: {
        // 查看用户
        exposeMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.exposeMembers = data.itemArray
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
                // this.form.hideMembers = linkIds
                this.form.hideMembers = data.itemArray
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
                // this.form.manageMembers = linkIds
                this.form.manageMembers = data.itemArray
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
                console.log(valid)
                if (valid) {
                    // 创建
                    let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
                    createKnowledgeLib(this.form).then((res) => {
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                            this.$message({ type: 'success', message: '创建成功！' });
                            let doObj = {}
                            doObj.action = 'createKnowledgeLib';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        });
                    });
                } else {
                    return false;
                }
            });

        }
    },
}
</script>

<style scoped>

.knowLibAdd /deep/ .el-input__inner {
    width: 300px;
}
.knowLibAdd {
    width: 400px;
    padding: 20px;
    box-sizing: border-box;

}


</style>
