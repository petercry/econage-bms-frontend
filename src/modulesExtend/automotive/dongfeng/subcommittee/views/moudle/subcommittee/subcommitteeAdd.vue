<template>
<div class="subcommitteeAdd">
    <el-form label-width="120px" class="demo-ruleForm" label-position="left" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item prop="name" label="名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="order" label="序号">
            <el-input v-model="form.order"></el-input>
        </el-form-item>
        <el-form-item label="责任人">
            <tag-select style="width:400px;vertical-align: top;" :initDataStr="exposeMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="exposeMember"></tag-select>
        </el-form-item>
    </el-form>
    <div style="textAlign:center;margin-top:20px">
        <el-button @click="cancelFunc">取消</el-button>
        <el-button type="primary" @click="createFunc" >确定</el-button>
    </div>
</div>
</template>

<script>
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { Loading } from 'element-ui'
import { subcommitteeAdd, subcommitteeDetail, subcommitteeEdit } from '../../../api/fileCard.js'
import EcoUtil from '@/components/util/main.js'
export default {
    data() {
        return {
            form: {
                id: '',
                name: '',
                order: '',
                responsibleUser: '',
                responsibleUserName:''
            },
            id: '',
            exposeMembers: '',
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                order: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],

            },
        }
    },
    components: {
        tagSelect
    },
    created() {
    },
    methods: {
        // 查看用户
        exposeMember(data) {
            console.log(data)
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.responsibleUser = data.itemArray[0].linkId
                console.log(this.form.responsibleUser,data.itemArray[0])
            } else {
                this.exposeMembers = ''
                this.form.responsibleUser = ''
            }
        },
        createFunc() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
                    subcommitteeAdd(this.form).then((res) => {
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                            this.$message({ type: 'success', message: '创建成功！' });
                            let doObj = {}
                            doObj.action = 'addSubcommittee';
                            doObj.data = {};
                            doObj.data.queryObj = this.form;
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        });
                    });
                } else {
                    return false
                }
            })
        },
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
    }
}
</script>

<style lang="less" scoped>
.subcommitteeAdd {
    width: 600px;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    /deep/ .el-input {
        width: 400px;
    }
}
</style>
