<template>
<div class="kn-header">
    <el-row style="padding:12px 10px;background-color:#fff;">
        <el-col :span="24">
            <eco-tool-title style="line-height: 34px;margin-right:50px;fontWeight:700;verticalAlign:middle" :title="name"></eco-tool-title>
            <el-input v-model="keyWords" type="text" style="width:200px;marginLeft:10px;verticalAlign:middle" placeholder="搜索名称"> <i class="el-icon-search el-input__icon" slot="suffix" style="cursor:pointer" >
                </i></el-input>
            <el-button type="primary" size="small" class="left-float" @click.native="addNewFolder">新建文件夹</el-button>
            <el-button type="primary" size="small" class="left-float" @click.native="uploadFile">上传文档</el-button>
            <!-- <el-button type="primary" size="small" class="left-float" @click.native="uploadMulti">批量上传</el-button> -->
            <el-button type="primary" size="small" class="left-float" @click.native="handleSort">排序</el-button>
            <el-button size="small" class="left-float" style="border-color: red;color: red;" @click.native="delMulti">删除</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { EcoUtil } from '@/components/util/main.js'
import { sysEnv } from '../../../config/env.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapState, mapMutations } from 'vuex';
import { deleteFolderOrFile } from '../../../api/knowledge.js'
export default {
    name: 'knHeader',
    components: {
        ecoToolTitle
    },
    data() {
        return {
            keyWords: '',
            id: '',
            info: {
                page: 1,
                rows: 10
            },
            type:''
        }
    },
    props: ['data'],
    computed: {
        ...mapState(['fileTableNode', 'activeId', 'fileMainTableNode', 'fileTreeNode'])
    },
    created() {
        this.id = this.$route.params.id
        this.type = this.$route.params.type
    },
    methods: {
        ...mapMutations(['SET_FILETREENODE', 'SET_ACTIVEID']),
        // handleSearchClick() {
        //     getListDataByName(this.id, this.activeId, this.info, this.keyWords).then(res => {
        //         this.fileMainTableNode.info.total = res.total
        //         this.fileMainTableNode.knowledgeList = res.rows
        //     })
        // },
        delMulti() {
            let delItems = this.fileTableNode.selection;
            if (delItems.length === 0) { //表格选择数为0
                this.$message({ message: '您所选对象数为0,请选择表格对象', type: 'warning' });
                return false
            }
            let ids = delItems.map(item => {
                return item.id
            })

            let options = { type: 'warning', lockScroll: false }
            let confirmYesFunc = () => {
                deleteFolderOrFile(ids).then(res => {
                    this.$message.success('删除成功')
                    // foreach
                    ids.forEach((i, j) => {
                        this.fileMainTableNode.knowledgeList.forEach((item, index) => {
                            if (i == item.id) {
                                this.fileTreeNode.remove(i)
                                this.fileMainTableNode.knowledgeList.splice(index, 1)
                            }
                        })
                    });
                    // 基础for循环
                    //  for (let i = 0; i < this.fileMainTableNode.knowledgeList.length; i++) {
                    //    for (let j = 0; j< ids.length; j++) {
                    //      if(this.fileMainTableNode.knowledgeList[i].id==ids[j]){
                    //          this.fileTreeNode.remove(ids[j])
                    //         this.fileMainTableNode.knowledgeList.splice(i,1)
                    //      }
                    //    }
                    //  }
                }).catch(() => {

                })
            }
            EcoMessageBox.confirm('确定要删除选中的记录吗?', '提示', options, confirmYesFunc);
        },
        handleSort() {
            if (this.activeId == '') {
                this.SET_ACTIVEID('-1')
            }
            if (sysEnv !== 1) {
                this.$router.push({ name: 'fileListSort', params: { id: this.id, activeid: this.activeId } })
            } else {
                let url = '/knowledge/index.html#/fileListSort' + '/' + this.id + '/' + this.activeId;
                EcoUtil.getSysvm().openDialog('排序', url, 600, 600, '12vh');
            }
        },
        uploadMulti() {
            if (this.activeId == '') {
                this.SET_ACTIVEID('-1')
            }
            if (sysEnv !== 1) {
                this.$router.push({ name: 'fileUploadMulti', params: { id: this.id, activeid: this.activeId } })
            } else {
                let url = '/knowledge/index.html#/fileUploadMulti' + '/' + this.id + '/' + this.activeId;
                EcoUtil.getSysvm().openDialog('批量上传文档', url, 560, 480, '12vh');
            }
        },
        uploadFile() {
            // console.log(this.type,'type')
            if (this.activeId == '') {
                this.SET_ACTIVEID('-1')
            }
            if (this.type == '4') {
                if (sysEnv !== 1) {
                    this.$router.push({ name: 'standardsAdd', params: { id: this.id, activeid: this.activeId } })
                } else {
                    let url = '/knowledge/index.html#/standardsAdd' + '/' + this.id + '/' + this.activeId;
                    EcoUtil.getSysvm().openDialog('企业标准', url, 800, 800, '12vh');
                }
            } else if (this.type == '2') {
                if (sysEnv !== 1) {
                    this.$router.push({ name: 'foreignAdd', params: { id: this.id, activeid: this.activeId } })
                } else {
                    let url = '/knowledge/index.html#/foreignAdd' + '/' + this.id + '/' + this.activeId;
                    EcoUtil.getSysvm().openDialog('外来标准', url, 800, 800, '12vh');
                }
            }else if (this.type == '3') {
                if (sysEnv !== 1) {
                    this.$router.push({ name: 'guideAdd', params: { id: this.id, activeid: this.activeId } })
                } else {
                    let url = '/knowledge/index.html#/guideAdd' + '/' + this.id + '/' + this.activeId;
                    EcoUtil.getSysvm().openDialog('业务指南', url, 800, 800, '12vh');
                }
            } else {
                if (sysEnv !== 1) {
                    this.$router.push({ name: 'commonAdd', params: { id: this.id, activeid: this.activeId } })
                } else {
                    let url = '/knowledge/index.html#/commonAdd' + '/' + this.id + '/' + this.activeId;
                    EcoUtil.getSysvm().openDialog('通用标准', url, 800, 800, '12vh');
                }
            }
        },
        addNewFolder() {
            if (this.activeId == '') {
                this.SET_ACTIVEID('-1')
            }
            if (sysEnv !== 1) {
                this.$router.push({ name: 'newFolderAdd', params: { id: this.id, activeid: this.activeId } })
            } else {
                let url = '/knowledge/index.html#/newFolderAdd' + '/' + this.id + '/' + this.activeId;
                EcoUtil.getSysvm().openDialog('新建文件夹', url, 500, 450, '12vh');
            }
        }
    },
}
</script>

<style>
.kn-header .plainBtn {
    border-color: red;
    color: red;
    font-size: 14px;
    margin-right: 10px;
}

.left-float {
    float: right;
    margin-right: 16px;
}
</style>
