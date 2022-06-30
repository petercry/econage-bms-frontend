<template>
<div class="filePower" v-show="form!=''">
    <p style="font-size:14px;margin-left:10px;margin-bottom:20px">用户权限：
        <el-button type="primary" @click="editFunc">保存</el-button>
    </p>
    <el-form label-width="80px" :model="form">
        <el-form-item label="查看用户">
            <tag-select style="width:400px;" :initDataStr="exposeMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="exposeMember"></tag-select>
        </el-form-item>
        <el-form-item label="查看用户安全设置">
            <div style="margin-top:20px">
                <el-checkbox v-model="form.attr.allowDownload">允许下载</el-checkbox>
                <el-checkbox v-model="form.attr.allowOnlineEdit">允许在线编辑</el-checkbox>
            </div>
        </el-form-item>
        <el-form-item label="隐藏用户">
            <tag-select style="width:400px;vertical-align: top;" :initDataStr="hideMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="hideMember"></tag-select>
        </el-form-item>
        <el-form-item label="管理用户">
            <tag-select style="width:400px;vertical-align: top;" :initDataStr="manageMembers" ref="tagSelect" :initOptions="{selectNum:0,selectType:'user-dept'}" @callBack="manageMember"></tag-select>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { editCommon } from '../../../api/fileCard.js'
import EcoUtil from '@/components/util/main.js'
import { Loading } from 'element-ui'
export default {
    props: {
        data: {}
    },
    data() {
        return {
            form:'',
            exposeMembers: '',
            hideMembers: '',
            manageMembers: '',
            loading: false,
            modularInnerId: "",
            fileList: [],
        }
    },
    components: {
        tagSelect
    },
    mounted() {
        // console.log(this.$props, "11")
        if (this.$props) {
            this.form = this.$props.data
            // console.log("11")
            this.getFileData()
        }
    },
    methods: {
        // 获取文件详情
        getFileData() {
            // 选人
            let exposeArr = []
            let hideArr = []
            let manageArr = []
            this.handleSelect(this.data.entity.exposeMembers, exposeArr)
            this.handleSelect(this.data.entity.hideMembers, hideArr)
            this.handleSelect(this.data.entity.manageMembers, manageArr)
            let exposeStr = exposeArr.join('|')
            let hideStr = hideArr.join('|')
            let manageStr = manageArr.join('|')

            this.exposeMembers = exposeStr
            this.hideMembers = hideStr
            this.manageMembers = manageStr
            // // 文件
            // this.fileList.push({ 'id': fileHeaderId, 'name': name })
            // this.rules.file = []
            // this.$refs.ruleForm.clearValidate()

        },
        // 查看用户
        exposeMember(data) {
            if (data.itemArray.length > 0) {
                // let linkIds = [];
                // for (let i = 0; i < data.itemArray.length; i++) {
                //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
                // }
                // this.form.exposeMembers = linkIds
                this.form.entity.exposeMembers = data.itemArray
            } else {
                this.exposeMembers = ''
                this.form.entity.exposeMembers = []
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
                this.form.entity.hideMembers = data.itemArray
            } else {
                this.hideMembers = ''
                this.form.entity.hideMembers = []
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
                this.form.entity.manageMembers = data.itemArray
            } else {
                this.manageMembers = ''
                this.form.entity.manageMembers = []
            }
        },
        // 选人数据处理
        handleSelect(arrType, arrAimType) {
            if(arrType ){
                arrType.forEach(item => {
                    let obj = {}
                    obj.type = item.type
                    obj.orgId = item.orgId
                    obj.linkId = item.linkId
                    arrAimType.push(JSON.stringify(obj))
                });
            }
        },
        editFunc() {
            let loadingInstance = Loading.service({ fullscreen: true, text: '正在创建...' });
            editCommon(this.data.entity.baseId, this.form).then((res) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                    this.$message({ type: 'success', message: '创建成功！' });
                    let doObj = {}
                    doObj.action = 'addNewFileCallBack';
                    doObj.data = {};
                    doObj.data.queryObj = this.form;
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                });
            });
        },
    },
    watch: {
        data(nv,ov){
            // console.log(nv)
            // this.form=nv
        }
    }
}
</script>

<style lang="less" scoped>
.filePower {
    width: 100%;
    height: 100%;

}
</style>
