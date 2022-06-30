<template>
<div class="iframe">
    <iframe style="height:100%;width:100%;" :src="'/fileManager/file_preview.html?fileHeaderId='+form.attr.fileHeaderId+'&fileName='+encodeURIComponent(form.attr.fileName)"></iframe>
</div>
</template>

<script>
import { outSideDetails } from '../api/standard.js'
export default {
    data() {
        return {
            form: {
                entity: { //节点信息
                    exposeMembers: [],
                    hideMembers: [],
                    manageMembers: [],
                    baseId: '',
                    id: '',
                    parentId: '',
                    fileName: '',
                    fileType: ''
                },
                attr: { //文件属性
                    entryId: '',
                    fileHeaderId: '',
                    fileName: '',
                    name: '',
                    fileType: '',
                    fileCode: '',
                    keyword: '',
                    summary: '',
                    uploadIp: '',
                    uploadIntranet: false,
                    allowDownload: false,
                    allowOnlineEdit: false
                },
                data: { //卡片信息
                    id: '',
                    stdCategory: '', //标准大类
                    stdSubCategory: '', //标准小类
                    categoryNum: '', //分类号
                    systemCode: '', //标准编号
                    stdName: '', //标准名称
                    enName: '', //英文名称
                    systemCode: '', //体系码
                    supplementaryCode: '', //补充码
                    substituteId: '', //替代标准id
                    substituteCode: '', //替代标准
                    effectiveness: '', //有效性
                    stdContent: '', //标准内容简介
                    publishDate: '', //发布日期
                    implementDate: '', //实施时间
                    internationalCode: '', //采用国际标准编号
                    adoptStdRelationship: '', //采标关系
                }
            },
            id: ''
        }
    },
    created() {
        // console.log(this.$route.params)
        if (this.$route.params) {
            this.id = this.$route.params.id
        }
        this.getOutSideDetails()
    },
    methods: {
        getOutSideDetails() {
            outSideDetails(this.id).then(res => {
                console.log(res)
                this.form = res
            })
        },
    }
}
</script>

<style lang="less" scoped>
.iframe {
    width: 100%;
    height: 100vh;
}
</style>
