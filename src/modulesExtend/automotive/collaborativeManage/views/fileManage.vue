<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="fileManage">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden;'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='12'>
                        <el-button type='primary' size='small' @click='fileAdd'>文件上传</el-button>
                        <el-button type='danger' size='small' @click='deleteCase'>删除</el-button>
                    </el-col>
                    <el-col :span='12' style="text-align:right" class="searchRow">
                        <span class='searchInputLabel'>文件名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.fileName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content top='59px' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' ref='fileTable'  stripe :data='tableData' header-row-class-name='tableHeader' @selection-change="handleSelectionChange"
                  border tooltip-effect='dark' height='100%'>
                  <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                  <el-table-column type='index' label='序号'>
                    <template slot-scope='scope'>
                      {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                    </template>
                  </el-table-column>
                  <el-table-column prop='projectName' label='协同项目'></el-table-column>
                  <el-table-column prop='fileName' label='文件名称'></el-table-column>
                  <el-table-column prop='createDate' label='上传时间'></el-table-column>
                  <el-table-column prop='createUserName' label='上传人'></el-table-column>
                  <el-table-column  label='操作' align='center'  width='220'>
                    <template slot-scope='scope'>
                        <span class="linkB cursorP" @click='preView(scope.row)'>预览</span>
                        <span class="linkB cursorP" @click='fileDownLoad(scope.row)'>下载</span>
                    </template>
              </el-table-column>  
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import {cooperateManageFileList,cooperateManageFileDel,fileDelete} from "../service/service.js";
    import { EcoFile } from '@/components/file/main.js'
    export default {
        name:'fileManage',
        data(){
            return{
                masterId:'',
                tableData:[],
                searchContent:{
                    fileName:""
                },
                multipleSelection:[],
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },

            }
        },
        components: {
            ecoContent,
            ecoLoading
        },
        created(){
            _self = this;
            this.masterId = this.$route.params.masterId;
            this.callAction();
        },
        mounted(){
            this.requestData('',false,false);
        },
        methods:{
            fileDownLoad(item) {
                EcoFile.openFileHeaderByDownload(item.fileHeaderId, item.fileName);
            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.fileHeaderId, item.fileName);
            },
            restSearContent(){
                this.searchContent = {
                    fileName:""
                }
                this.requestData('',true,true);  
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                   if(obj.action==='addFile'){
                       _self.$message.success("上传成功!");
                       _self.restSearContent();        
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'fileManage');
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true,true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData("search",false,false);
            },
            fileAdd(){
                var url =  "/collaborativeManage/index.html#/addFile/" +this.masterId;
                EcoUtil.getSysvm().openDialog('文件上传', url, 500, 400, "15vh",null,{showClose:false});
            },
            deleteCase(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("请至少选择一条数据。","提示");
                }
                let doit = function () {
                    _self.$refs.refLoading.open();
                    let fileHeaderId = [];
                    let ids = [];
                     _self.multipleSelection.forEach(item=>{
                        ids.push(item.id);
                        fileHeaderId.push(item.fileHeaderId);
                    })
                    let len = fileHeaderId.length;
                    cooperateManageFileDel(ids).then(res => {
                        for(let i=0;i<len;i++){
                            fileDelete(fileHeaderId[i]).then(res=>{
                                if(i===len-1){
                                    _self.multipleSelection=[];
                                    _self.$message.success('删除成功!');
                                    _self.restSearContent();
                                }
                            })
                        }
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            requestData(type,isFirstP,isClearS){
                this.$refs.refLoading.open();
                let params = {
                    masterId:this.masterId,
                    sort: ["modDate"],
                    order: ["desc"],
                    rows: this.baseInfo.rows,
                }
                if (type === "search") {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                if(isFirstP){
                    this.baseInfo.page = 1;
                }
                if(isClearS){
                    this.$refs.fileTable.clearSelection();
                }
                params.page = this.baseInfo.page;
                cooperateManageFileList(params).then(res=>{
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                });
            }
        }
    }
</script>
<style scoped>
  .fileManage {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .fileManage .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
        /* width: 90px;
        display: inline-block;
        text-align: right; */
    }

    .fileManage .searchRow {
        background: #fff;
    }

    .fileManage .searchRow .el-select,
    .fileManage .searchRow .el-input{
        width: 250px;
    } 
</style>