<template>
<div class="fileCard">
    <!-- 正文 -->
    <ecoLoading ref='ecoLoadingRef' text="加载中"></ecoLoading>
    <eco-content top="0" ref="cardTitle" style="padding:20px">
        <div class="top-content" style="border-bottom: 1px solid #eee;">
            <p>{{this.pathUrl}}</p>
            <p style="fontWeight:700">{{entryInfo['name']}}</p>
            <p><span><span style="marginRight:4px">{{entryInfo.createUserName}}上传于</span>{{entryInfo.createDate}}</span><span style="margin:0 20px">|</span><span>{{attrInfo.downloadCount}}次下载</span><span style="margin:0 20px">|</span><span></span>{{attrInfo.readCount}}次点击
                <el-button type="text" style="marginLeft:24px" @click="fileDownLoad" v-show="attrInfo.allowDownload">下载</el-button>
                <el-button type="text" @click="fileEditOnline">预览</el-button>
                <el-button type="text" @click="getLink">复制链接</el-button>
            </p>
        </div>
    </eco-content>
    <eco-content bottom="60px" top="110px" ref="cardContent">
        <fileInfo v-show="activeTab=='info'" :entryobj="extInfo"></fileInfo>
        <fileOpHistory v-show="activeTab=='history'"> </fileOpHistory>
        <filePower v-show="activeTab=='filePower'" :data="infoObj"> </filePower>
    </eco-content>
    <eco-content bottom="0px" height="60px" style="overflow:hidden;padding:0 6px">
        <div class="file-card-bottom">
            <el-button @click="showTab('info')"><i class="el-icon-view" style="color:#409eff;fontSize:18px;marginRight:3px"></i>文档信息</el-button>
            <el-button @click="showTab('history')" v-show="!single"><i class="el-icon-view" style="color:#409eff;fontSize:18px;marginRight:3px"></i>操作历史</el-button>
            <el-button @click="showTab('filePower')" v-show="!single"><i class="el-icon-view" style="color:#409eff;fontSize:18px;marginRight:3px"></i>权限设置</el-button>
        </div>
    </eco-content>
    <form name="docviewform" method="get">
        <input type="hidden" name="fileHeaderId" />
        <input type="hidden" name="fileName" />
        <input type="hidden" name="fileHeaderIds" />
    </form>
    <iframe name="docviewIframe" style="display:none"></iframe>
</div>
</template>

<script>
import { getFileDetail, addDownloadRecord } from '../../../api/knowledge.js'
import { selectCommon, addUpLoad } from '../../../api/fileCard.js'
import { EcoFile } from '@/components/file/main.js'
// import fileContent from './fileContent'
import fileInfo from './fileInfo'
import fileOpHistory from './fileOpHistory'
import filePower from './filePower'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default {
    name: 'fileCard',
    components: {
        // fileContent,
        fileInfo,
        fileOpHistory,
        filePower,
        ecoContent,
        ecoLoading,
    },
    data() {
        return {
            activeTab: 'info',
            fileInfo: {
                fileHeaderId: '',
                fileName: ''
            },
            infoObj: {},
            extInfo: {},
            entryInfo: {},
            id: '',
            pathUrl: '',
            baseId: '',
            type: '',
            attrInfo: {
                downloadCount: '',
                readCount: ''
            },
            single: false
        }
    },
    created() {
        console.log(this.$route)
        if (this.$route.params.single) {
            this.single = true
        }
        this.id = this.$route.params.id
        this.type = this.$route.params.type
        this.getFileInfo()
    },
    methods: {
        showTab(flag) {
            this.activeTab = flag
        },
        getLink() {
            // let _url = '/page/ssoToE10Sys.html?request-source=knowledgeView&targetUrl=' + this.extInfo.id + 'type' + this.type;+ '&target=' + encodeURIComponent(_url)
            let url = this.entryInfo.docLink
            let oInput = document.createElement('input');
            oInput.value = url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display = 'none';
            console.log(url)
        },
        getFileInfo() {
            selectCommon(this.id).then(res => {
                console.log(res)
                let pathArr = []
                // res.path.forEach(item => {
                //     pathArr.push(item.name)
                // });
                // this.pathUrl = pathArr.join(' > ')
                this.infoObj = res
                this.attrInfo = res.attr
                this.extInfo = res.data
                this.entryInfo = res.entity
                this.fileInfo.fileHeaderId = res.attr.fileHeaderId
                this.fileInfo.fileName = res.attr.fileName
                this.baseId = res.entity.baseId
            })
        },
        fileDownLoad() {
            // this.addDownloadRecord()
            // if (attrInfo.uploadIp.startsWith('172')) {
            //     }
            addUpLoad(this.id).then(res => {
                console.log(res)
            })
            EcoFile.openFileHeaderByDownload(this.fileInfo.fileHeaderId, this.fileInfo.fileName);
        },
        fileEditOnline() {
            // let url = this.$router.resolve({
            //     name: 'fileContent',
            //     params: {
            //         fileHeaderId: this.fileInfo.fileHeaderId,
            //         fileName: this.fileInfo.fileName
            //     }
            // })
            // window.open(url.href, '_blank')

            EcoFile.openFileHeaderByView(this.fileInfo.fileHeaderId, this.fileInfo.fileName);
        },
        // // 添加点击记录
        // addDownloadRecord() {
        //     addDownloadRecord(this.id).then(res => {
        //         this.extInfo.downloadCount++
        //     })
        // }
    },
}
</script>

<style>
.fileCard {
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color: #0f1419;
}

.bread-brumbs {
    padding: 20px;
    font-size: 14px;
}

.file-card-bottom {
    border-top: 1px solid #eee;
    /* padding-left: 50px; */
    line-height: 60px;
}

/* .file-card-bottom .iconfont{
  color: #1188ff;
} */
.file-card-bottom .el-button {
    border: none;
    outline: 0;
}

.top-content p {
    line-height: 40px;
}
</style>
