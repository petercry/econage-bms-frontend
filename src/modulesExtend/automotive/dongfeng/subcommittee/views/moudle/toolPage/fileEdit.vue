<template>
<div class="fileEdit" v-loading="loading">
    <!-- 编辑文档 -->
    <div v-show="data!=''">
        <standardsAdd :data='data' v-if="type==4"></standardsAdd>
        <foreignAdd :data='data' v-if="type==2"></foreignAdd>
        <guideAdd :data='data' v-if="type==3"></guideAdd>
        <commonAdd :data='data' v-if="type==1"></commonAdd>
    </div>
</div>
</template>

<script>
import { updateFile, getFileDetail } from '../../../api/knowledge.js'
import { selectCommon } from '../../../api/fileCard.js'
import { getItemFetchId } from '@/modules/knowledge/api/common.js'
import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
import { mapState, mapMutations } from 'vuex';
import commonAdd from './commonAdd.vue'
import standardsAdd from './standardsAdd.vue'
import guideAdd from './guideAdd.vue'
import foreignAdd from './foreignAdd.vue'

export default {
    name: 'fileEdit',
    components: {
        tagSelect,
        ecoFileUploadBtn,
        commonAdd,
        standardsAdd,
        guideAdd,
        foreignAdd
    },
    data() {
        return {
            form: {
                id: '',
                name: '',
                order: '',
                fileCode: '',
                model: 'KNOWLEDGE_LIB',
                keyword: '',
                summary: '',
                exposeMembers: [],
                comments: '',
                hideMembers: [],
                manageMembers: [],
                fileHeaderIds: [],
                // parentId: '',
                allowDownload: '',
                allowOnlineEdit: '',
            },
            
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            loading: false,
            modularInnerId: "",
            fileList: [],
            rules: {
                file: [
                    { required: true, message: '请选择文件', trigger: 'blur' },
                ],
            },
            id: '',
            baseId: '',
            fileObj: {},
            data: '',
            type:''
        }
    },
    computed: {
        ...mapState(['fileTableNode', 'fileTreeNode'])
       
    },
    created() {
        // this.getItemFetchId();
        // console.log(this.$route)
        this.form.id = this.$route.params.id
        this.baseId = this.$route.params.baseId
        this.type= this.$route.params.type
        // let entryId=this.$route.params.activeid
        // if(entryId=='-1'){
        //    this.form.parentId=""
        // }else{
        //    this.form.parentId=entryId
        // }
        this.getFileData()
    },
    mounted() {
    },
    methods: {
        getItemFetchId() {
            getItemFetchId().then(res => {
                this.modularInnerId = res;
                // this.form.id = this.modularInnerId;
                this.loading = false;
            })
        },
        // 获取文件详情
        getFileData() {
            selectCommon(this.form.id).then(res => {
                this.data = res
                // console.log(this.da,"xiugai")
                // this.fileObj = res.entity;
                const { fileHeaderId, name, fileCode, keyword, summary, comments, exposeMembers, hideMembers, manageMembers, allowDownload, allowOnlineEdit } = res.entity;
                this.form.allowDownload = allowDownload
                this.form.allowOnlineEdit = allowOnlineEdit
                this.form.fileCode = fileCode
                this.form.name = name
                this.form.keyword = keyword
                this.form.summary = summary
                this.form.comments = comments
                this.form.hideMembers = hideMembers
                this.form.exposeMembers = exposeMembers
                this.form.manageMembers = manageMembers
                // 选人
                let exposeArr = []
                let hideArr = []
                let manageArr = []
                this.handleSelect(exposeMembers, exposeArr)
                this.handleSelect(hideMembers, hideArr)
                this.handleSelect(manageMembers, manageArr)
                let exposeStr = exposeArr.join('|')
                let hideStr = hideArr.join('|')
                let manageStr = manageArr.join('|')
                this.exposeMembers = exposeStr
                this.hideMembers = hideStr
                this.manageMembers = manageStr
                this.data.exposeMembers = exposeStr
                this.data.hideMembers = hideStr
                this.data.manageMembers = manageStr
                // console.log(this.data,"11")
                // 文件
                // this.fileList.push({ 'id': fileHeaderId, 'name': name })
                // this.rules.file = []
                // this.$refs.ruleForm.clearValidate()
            })
        },
        // 选人数据处理
        handleSelect(arrType, arrAimType) {
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
        // // 查看用户
        // exposeMember(data) {
        //     if (data.itemArray.length > 0) {
        //         // let linkIds = [];
        //         // for (let i = 0; i < data.itemArray.length; i++) {
        //         //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        //         // }
        //         // this.form.exposeMembers = linkIds
        //         this.form.exposeMembers = data.itemArray
        //     } else {
        //         this.exposeMembers = ''
        //         this.form.exposeMembers = []
        //     }
        // },
        // // 隐藏用户
        // hideMember(data) {
        //     if (data.itemArray.length > 0) {
        //         // let linkIds = [];
        //         // for (let i = 0; i < data.itemArray.length; i++) {
        //         //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        //         // }
        //         // this.form.hideMembers = linkIds
        //         this.form.hideMembers = data.itemArray
        //     } else {
        //         this.hideMembers = ''
        //         this.form.hideMembers = []
        //     }
        // },
        // // 管理用户
        // manageMember(data) {
        //     if (data.itemArray.length > 0) {
        //         // let linkIds = [];
        //         // for (let i = 0; i < data.itemArray.length; i++) {
        //         //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        //         // }
        //         // this.form.manageMembers = linkIds
        //         this.form.manageMembers = data.itemArray
        //     } else {
        //         this.manageMembers = ''
        //         this.form.manageMembers = []
        //     }
        // },
        // fileChange(file, fileList) {
        //     this.loading = true;
        // },
        // fileOnSuccess(response, file, fileList) {
        //     this.loading = false;
        //     this.fileList.push(response)
        //     this.form.fileHeaderIds.push(response.id);
        //     this.form.name = response.name;
        //     this.rules.file = []
        //     this.$refs.ruleForm.clearValidate()
        // },
        // cancelFunc() {
        //     EcoUtil.getSysvm().closeDialog();
        // },
        // createFunc() {
        //     this.$refs.ruleForm.validate((valid) => {
        //         if (valid) {
        //             let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
        //             updateFile(this.form).then((res) => {
        //                 this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        //                     loadingInstance.close();
        //                     this.$message({ type: 'success', message: '更新成功！' });
        //                     let doObj = {}
        //                     doObj.action = 'addNewFileCallBack';
        //                     doObj.data = {};
        //                     doObj.data.queryObj = this.form;
        //                     doObj.close = true;
        //                     EcoUtil.getSysvm().callBackDialogFunc(doObj);
        //                 });

        //             });
        //         } else {
        //             return false
        //         }
        //     })
        // },
        // deleteFile(item, index) {
        //     this.$refs.fileUpload.handleRemove(item, index)
        //     this.fileList.splice(index, 1);
        // },

    },
    watch: {
        // fileList(val) {
        //     if (val.length == 0) {
        //         this.rules.file.push({ required: true, message: '请选择文件', trigger: 'blur' })
        //     }
        // }
    },
}
</script>

<style scoped>
.fileEdit {
    width: 468px;
    padding: 20px;
}

.ecoFileUploadBtn /deep/ .btn {
    margin-left: 0 !important;
}

.el-form .el-form-item /deep/ .fileBox:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    color: #409eff;
}
</style>
