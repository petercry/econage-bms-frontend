<template>
<div class="standarduploadMult">
    <div class="first">
        <el-button type="primary" @click="getmoban">标准条目导入模板下载</el-button>
        <p>第一步：导入标准条目清单，并确认导入数据是否准确</p>
        <!-- <el-button type="primary">导入</el-button> -->
        <el-upload :action="address" accept=".xls,.xlsx" :headers="token" :file-list="fileList" :on-success="success" :show-file-list='false' name="excel" :before-upload="beforeUpload">
            <el-button ref="upload" class="export" size="small" @click='importWage' type="primary">导入</el-button>
        </el-upload>
        <el-table :data="firstList" border style="width: 100%;font-size: 12px">
            <el-table-column prop="date" label="序号" width="" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index +1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="stdCategoryName" label="标准大类" width="" align="center"></el-table-column>
            <el-table-column prop="stdSubCategoryName" label="标准小类" align="center"></el-table-column>
            <el-table-column prop="categoryNum" label="分类号" align="center"></el-table-column>
            <el-table-column prop="stdCode" label="标准编号" align="center"></el-table-column>
            <el-table-column prop="stdName" label="标准名称" align="center"></el-table-column>
            <el-table-column prop="enName" label="英文名称" align="center"></el-table-column>
            <el-table-column prop="systemCode" label="体系码" align="center"></el-table-column>
            <el-table-column prop="supplementaryCode" label="补充码" align="center"></el-table-column>
            <el-table-column prop="effectivenessName" label="有效性" align="center"></el-table-column>
            <el-table-column prop="publishDate" label="发布日期" align="center"></el-table-column>
            <el-table-column prop="implementDate" label="实施日期" align="center"></el-table-column>
            <el-table-column prop="internationalCode" label="采用国际标准编号" align="center"></el-table-column>
            <el-table-column prop="adoptStdRelationship" label="采标关系" align="center"></el-table-column>
        </el-table>
    </div>
    <div class="second">
        <p>第二步：上传标准文档，文档的名称需要与标准编号对应</p>
        <!-- <el-button type="primary">批量上传</el-button> -->
        <eco-file-upload-btn :modular="'standardMaintenance'" :modularInnerId="modularInnerId" @fileChange="fileChange" style="width:400px;display:inline-block;" @fileOnSuccess="fileOnSuccess" ref="fileUpload"></eco-file-upload-btn>
        <el-table :data="secondList" border style="width: 20%">
            <el-table-column prop="date" label="序号" width="" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index +1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="文档名称" width="" align="center"></el-table-column>
            <el-table-column prop="" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="deleteFile(scope.row,scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="third">
        <p>第三步：标准条目清单与标准文档关系对应</p>
        <el-button type="primary" @click="getmatch">关系匹配</el-button>
        <el-button type="primary" v-show="thirdList!=''" @click="getResult">导出结果</el-button>
        <el-table :data="thirdList" border style="width: 35%">
            <el-table-column prop="date" label="序号" width="" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index +1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="stdCode" label="标准编号" width="" align="center"></el-table-column>
            <el-table-column prop="stdName" label="标准名称" align="center"></el-table-column>
            <el-table-column prop="name" label="文档名称" align="center"></el-table-column>
            <el-table-column prop="" label="匹配标识" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.flag?'成功':'失败'}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="fourth">
        <p>第四步：确认匹配正确，数据存档入库</p>
        <el-button type="primary" @click="goUpload">保存</el-button>
        <!-- <el-upload :action="address1" accept=".xls,.xlsx" :headers="token" :file-list="fileList" :on-success="success" :show-file-list='false' :before-upload="beforeUpload" name="excel" :data="{'files': thirdList}" >
            <el-button ref="upload" class="export" size="small" @click='importWage1' type="primary">保存</el-button>
        </el-upload> -->
        <el-button type="primary" @click="cancelFunc">关闭</el-button>
    </div>
</div>
</template>

<script>
import { Loading } from 'element-ui';
import { outsideExcel, orgExcelImport, uploadMul, downloadExcel, orgExcelImport1, downloadTemplate, downloadResult } from '../api/standard.js'
import { EcoFile } from '@/components/file/main.js'
import { sysEnv } from '../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
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
                allowOnlineEdit: '',
            },
            fileInfo: {
                fileHeaderId: '',
                fileName: ''
            },
            modularInnerId: '',
            token: {
                ["eco-auth-token"]: sessionStorage.getItem("ecoToken")
            },
            address: '',
            address1: '',
            fileList: [],
            firstList: [], //第一步
            secondList: [], //第二部
            thirdList: [], //第三步
            uploadFile: [],
            excelFile: '',
            resultList: [] //匹配结果

        }
    },
    components: {
        ecoFileUploadBtn
    },
    created() {
        this.callAction()
    },
    methods: {
        callAction() {
            let this_ = this
            let callBackDialogFunc = function (obj) {
                if (obj && (obj.action === 'selectKnowLib')) {
                    this_.doitKnowCase(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'editPlanPage');
        },
        doitKnowCase(data) {
            //归档
            let loadingInstance = Loading.service({ fullscreen: true });
            uploadMul(this.excelFile, this.uploadFile, data.parentId).then(res => {
                // console.log(res)
                if (res == 'ok') {
                    this.$message({
                        message: '导入成功',
                        type: 'success',
                    });
                    setTimeout(function () {
                        loadingInstance.close();
                        window.parent.window.sysvm.removeTab('standarduploadMult');
                    }, 1000)
                }
            })
        },
        fileDownLoad() {
            EcoFile.openFileHeaderByDownload(this.fileInfo.fileHeaderId, this.fileInfo.fileName);
        },
        fileEditOnline() {
            EcoFile.openFileHeaderByEdit(this.fileInfo.fileHeaderId, this.fileInfo.fileName)
        },
        fileChange(file, fileList) {
            this.loading = true;
            this.uploadFile = fileList
            // console.log(this.uploadFile)
        },
        fileOnSuccess(response, file, fileList) {
            // console.log(response,file,fileList)
            this.loading = false;
            this.secondList.push(response)
            this.form.fileHeaderIds.push(response.id);
            // this.rules.file = []
            // console.log(this.fileList)
        },
        deleteFile(item, index) {
            // console.log(item.index)
            this.$refs.fileUpload.handleRemove(item, index)
            this.secondList.splice(index, 1);
        },
        // 导入
        importWage() {
            this.address = orgExcelImport();
        },
        // 导入1
        importWage1() {
            this.address1 = orgExcelImport1();
        },
        //导入成功
        success(response, file, fileList) {
            // console.log(response, file, fileList)
            this.firstList = response
            console.log(this.firstList)
        },
        //导入前
        beforeUpload(params) {
            // console.log(params)
            this.excelFile = params
            // console.log(this.excelFile)
        },
        //关系匹配
        getmatch() {
            // console.log(this.secondList)
            if (this.firstList.length > this.secondList.length) {
                this.thirdList = this.firstList.map((item, index) => {
                    return { ...item, ...this.secondList[index] }
                })
            } else {
                this.thirdList = this.secondList.map((item, index) => {
                    return { ...item, ...this.firstList[index] }
                })
            }
            this.thirdList.map(item => {
                let index = ''
                if (item.name) {
                    index = item.name.indexOf('.')
                    // console.log(item.stdCode, item.name.substring(0, index))
                }
                // console.log(item.name.substring(0, index), item.stdName)
                if (item.name && (item.name.substring(0, index) == item.stdCode)) {
                    // console.log(item.name.substring(0, index), item.stdName)
                    item.flag = true
                } else {
                    item.flag = false
                }
                return item
            })
            // console.log(this.thirdList)
        },
        //导出匹配结果 
        getResult() {
            let nameList = this.secondList.map(item => {
                return item.name
            })
            console.log(nameList)
            downloadResult(this.firstList, nameList).then(res => {
                // console.log(res)
                // let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                EcoFile.downloadFile(res, "匹配结果.xls");
            })
        },
        goUpload() {
            console.log(this.excelFile,this.uploadFile)
            if (this.excelFile && this.uploadFile) {
                this.openKnow()
            } else {
                this.$message({ type: 'warning', message: '请导入或上传文件文件！' });
                return ''
            }
        },
        openKnow() {
            // this.$router.push({ name: 'knowLedgeIndex' })
            let url = "/standardMaintenance/index.html#/knowLedgeIndex";
            EcoUtil.getSysvm().openDialog('知识库', url, '900', '600', "15vh");
        },
        getmoban() {
            downloadTemplate().then(res => {
                // console.log(res)
                let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                EcoFile.downloadFile(blob, "标准条目模板.xls");
            })
        },
        cancelFunc() {
            window.parent.window.sysvm.removeTab('standarduploadMult');
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-table__row:nth-of-type(even) {
    background: #f5f7fa;
}

/deep/ .el-table th {
    font-weight: 600;
    background: #f5f7fa;
}

/deep/ .el-table {
    font-size: 12px;
}

/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
    background-color: #f5f7fa;
}

/deep/ .el-table--border,
/deep/ .el-table--group {
    border-color: #f5f7fa;
}

/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    color: #4f334f;
    font-size: 14px;
}

/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #ebeef5;
}

/deep/ .el-table--border td,
/deep/ .el-table--border th {
    border-right: 1px solid #ebeef5;
}

/deep/ .el-table--border {
    border: 1px solid #ebeef5;
}

/deep/ .el-button {
    // width: 90px;
    // height: 36px;
    font-size: 16px;
    margin-bottom: 20px;
}

/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    color: #4f334f;
    font-size: 12px;
}

.standarduploadMult {
    width: 98%;
    height: 100%;
    border: 1px solid rgb(221, 221, 221);
    ;
    margin: 10px auto;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;

    .first {
        width: 100%;
        margin-top: 20px;

        p {
            color: #ff0000;
            margin-bottom: 20px;
        }
    }

    .second {
        width: 100%;
        margin-top: 20px;

        p {
            color: #ff0000;
            margin-bottom: 20px;
        }

        /deep/.upload-demo .el-button {
            background: #409EFF;
            color: #fff;
            height: 32px;
            margin-left: 0px;
            width: 110px;

            span {
                margin-left: -5px;
            }
        }
    }

    .third {
        width: 100%;
        margin-top: 20px;

        p {
            color: #ff0000;
            margin-bottom: 20px;
        }
    }

    .fourth {
        width: 100%;
        margin-top: 20px;

        p {
            color: #ff0000;
            margin-bottom: 20px;
        }
    }
}
</style>
