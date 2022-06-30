<template>
<div class="folderEdit">
    <!-- 新建文件夹 -->
    <div>
        <el-form label-width="70px" class="demo-ruleForm" label-position="left" :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" style="width:300px">
                </el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.comments" type="textarea" style="width:300px">
                </el-input>
            </el-form-item>
            <el-form-item label="查看用户">
                <tag-select style="width: 300px;vertical-align: top;" :initDataStr="exposeMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="exposeMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="隐藏用户">
                <tag-select style="width: 300px;vertical-align: top;" :initDataStr="hideMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="hideMember">
                </tag-select>
            </el-form-item>
            <el-form-item label="管理用户">
                <tag-select style="width: 300px;vertical-align: top;" :initDataStr="manageMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="manageMember">
                </tag-select>
            </el-form-item>
        </el-form>
        <el-col align="center">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="create">确定</el-button>
        </el-col>
    </div>
</div>
</template>

<script>
import { getFolderDetail, updateFolder } from '../../../api/knowledge.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { mapState, mapMutations } from 'vuex';
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
export default {
    name: 'folderEdit',
    components: {
        tagSelect
    },
    data() {
        return {
            form: {
                name: '',
                comments: '',
                exposeMembers: [],
                hideMembers: [],
                manageMembers: [],
                id: '',
                baseId: '',
                parentId: ''
            },
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
            }
        }
    },
    computed: {
        ...mapState(['fileTableNode', 'fileTreeNode', 'activeId'])
    },
    created() {
        this.form.id = this.$route.params.id
    },
    mounted() {
        this.getFolderData()
        // let entryId = this.$route.params.activeid
        // let entryId = this.activeId
        // if (entryId == '-1') {
        //   this.form.parentId = ""
        // } else {
        //   this.form.parentId = entryId
        // }
    },
    methods: {
        // 获取文件夹信息
        getFolderData() {
            getFolderDetail(this.form.id).then(res => {
                // console.log(res)
                const { name, comments, exposeMembers, hideMembers, manageMembers, baseId, parentId } = res;
                this.form.name = name
                this.form.baseId = baseId
                this.form.parentId = parentId
                this.form.comments = comments
                this.form.hideMembers = hideMembers
                this.form.exposeMembers = exposeMembers
                this.form.manageMembers = manageMembers
                let exposeArr = []
                let hideArr = []
                let manageArr = []
                this.handleSelect(exposeMembers, exposeArr)
                this.handleSelect(hideMembers, hideArr)
                this.handleSelect(manageMembers, manageArr)
                // console.log(exposeArr, hideArr, manageArr, 'xuanren')
                let exposeStr = exposeArr.join('|')
                let hideStr = hideArr.join('|')
                let manageStr = manageArr.join('|')
                this.exposeMembers = exposeStr
                this.hideMembers = hideStr
                this.manageMembers = manageStr
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
        cancel() {
            EcoUtil.getSysvm().closeDialog();
        },
        //新建文件夹
        create() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // 创建
                    this.createFolder()
                } else {
                    return false;
                }
            });
        },
        createFolder() {
            let this_ = this
            let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
            updateFolder(this.form).then((res) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                    this.$message({ type: 'success', message: '更新成功！' });
                    let doObj = {}
                    doObj.action = 'updateFolderCallBack';
                    doObj.data = {
                        baseId: this_.form.baseId,
                        parentId: this_.form.parentId,
                        editName : this_.form.name
                    };
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                });
            });
            // createFolder(this.form).then(res => {
            //   this.$message({
            //     duration: 1000,
            //     type: 'success',
            //     message: '创建成功',
            //     onClose: () => {
            //       let doObj = {}
            //       doObj.action = 'createFolderCallBack';
            //       doObj.data = {};
            //       doObj.close = true;
            //       EcoUtil.getSysvm().callBackDialogFunc(doObj);
            //     }
            //   })
            // })
        }
    },
}
</script>

<style scoped>
.folderEdit {
    width: 400px;
    padding: 20px;
}
</style>
