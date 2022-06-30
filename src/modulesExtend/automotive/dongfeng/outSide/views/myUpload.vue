<template>
<div class="myUpload">
    <div class="content">
        <p>自行上传文档界面</p>
        <table>
            <tr>
                <td>文档名称</td>
                <td colspan="3">
                    <el-input></el-input>
                </td>
            </tr>
            <tr>
                <td>关键字</td>
                <td colspan="3">
                    <el-input></el-input>
                </td>
            </tr>
            <tr>
                <td>部门</td>
                <td>
                    <el-input></el-input>
                </td>
                <td>上传人</td>
                <td>
                    <el-input></el-input>
                </td>
            </tr>
            <tr>
                <td>上传日期</td>
                <td>
                    <el-input></el-input>
                </td>
            </tr>
            <tr>
                <td>文档</td>
                <td>
                    <el-link>上传文档</el-link>
                </td>
            </tr>
        </table>
        <div class="footer">
            <el-button type="primary">保存</el-button>
            <el-button type="primary" @click="cancelFunc">关闭</el-button>
        </div>
    </div>
    <eco-file-upload-btn :showList="false" :multiple="false" :modular="'knowledge'" ref="fileUpload" :modularInnerId="modularInnerId" @fileChange="fileChange" style="width:142px;display:inline-block;" @fileOnSuccess="fileOnSuccess"></eco-file-upload-btn>
</div>
</template>

<script>
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
export default {
    data() {
        return {
            form: {
                baseId: '',
                name: '',
                order: '',
                fileCode: '',
                model: 'KNOWLEDGE_LIB',
                keyword: '',
                summary: '',
                exposeMembers: [],
                hideMembers: [],
                manageMembers: [],
                fileHeaderIds: [],
                parentId: '',
                allowDownload: '',
            },
            allowOnlineEdit: '',
            fileList: [],
            loading: false,
            modularInnerId: "",
        }

    },
    components: {
        ecoFileUploadBtn
    },
    methods: {
        uploadAdd() {
            console.log(this.$refs['fileUpload'])
            this.$refs['fileUpload'].uploadclick()
        },
        fileChange(file, fileList) {
            this.loading = true;
        },
        fileOnSuccess(response, file, fileList) {
            this.loading = false;
            this.fileList.push(response)
            this.form.fileHeaderIds.push(response.id);
            // this.form.name = response.name;
            this.rules.file = []
            this.$refs.ruleForm.clearValidate()
        },
        createFunc() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
                    //   uploadFile(this.form).then((res) => {
                    //     this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    //       loadingInstance.close();
                    //       this.$message({ type: 'success', message: '创建成功！' });
                    //       let doObj = {}
                    //       doObj.action = 'addNewFileCallBack';
                    //       doObj.data = {};
                    //       doObj.data.queryObj = this.form;
                    //       doObj.close = true;
                    //       EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    //     });
                    //   });
                } else {
                    return false
                }
            })
        },
        deleteFile(item, index) {
            this.$refs.fileUpload.handleRemove(item, index)
            this.fileList.splice(index, 1);
        },
        cancelFunc() {
            EcoUtil.getSysvm().closeDialog();
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-link {
    margin-right: 10px;
    color: #0000ff;
    font-size: 16px;
}

/deep/ .el-button {
    width: 70px;
    height: 36px;
}

/deep/ .el-input__inner {
    height: 30px;
    border: 1px solid #797979;
}

.myUpload {
    width: 100%;
    height: 100%;

    .content {
        width: 800px;
        height: 100%;
        border: 1px solid #797979;
        margin: 20px auto;

        p {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            height: 100%;

            td {
                padding: 10px;
                box-sizing: border-box;
            }
        }

        .footer {
            width: 100%;
            height: 80px;
            line-height: 50px;
            text-align: center;
            margin-top: 10px;
        }
    }

}
</style>
