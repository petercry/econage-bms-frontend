<template>
    <div class="addFile" v-loading='loading'>
        <div class='addForm'>
            <el-row>
                <el-col :span='24'>
                    <upload :isEdit='true' :showList='true' :multiple="false" :modular="modular" :modularInnerId="modularInnerId"
                        @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept=''
                        @beforeFileUpload="beforeFileUpload">
                        <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                            <i class="el-icon-plus"></i> 上传附件</el-button>
                    </upload>
                </el-col>
            </el-row>
        </div>
        <div class="btn">
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    import { EcoFile } from '@/components/file/main.js'
    import upload from "../components/upload.vue";
    import { EcoUtil } from '@/components/util/main.js'
    import {cooperateManageFileSave,getItemFetchId,fileDelete} from '../../service/service.js'
    export default {
        data(){
            return {
                modular:"collaborative_file_manage",
                masterId:"",
                modularInnerId:'',
                fileList:[],
                loading:false
            }
        },
        created(){
            this.loading = true;
            getItemFetchId().then(res=>{
                this.modularInnerId = res.data;
                this.loading = false;
            })
            this.masterId = this.$route.params.masterId;
        },
        components:{
            upload
        },
        methods:{
            onCancel() {
                this.loading=true;
                let arr=[];
                for(var i=0;i<this.fileList.length;i++){
                    arr.push(fileDelete(this.fileList[i].id));
                }
                Promise.all(arr).then(resList=>{
                    this.loading=false;
                    EcoUtil.getSysvm().closeDialog();
                })
            },
            onSubmit() {
                if(this.fileList.length===0){
                    this.$message.warning('无新增附件保存!');
                    return;
                }
                this.loading=true;
                let arr = this.fileList.map((item=>{
                    return item.id;
                }))
                cooperateManageFileSave(arr,this.masterId).then(res=>{
                    this.loading = false;
                    let doObj = {};
                    doObj.action = 'addFile';
                    doObj.data = {};
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                }).catch(err=>{
                    this.loading = false;
                })
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileOnSuccess(response) {},
            beforeFileUpload(file, callback) {
                callback(true);
            },
        }       
    }
</script>
<style scoped>
    .addFile .uploadBtn {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: 100%;
        background: transparent;
        color: #409EFF;
        border: 0;
        padding: 5px 20px;
    }
    .addFile {
        background: #fff;
        height: 100%;
    }

    .addFile .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .addFile .addForm {
        overflow: auto;
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }
</style>