<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="selectCriteriaList">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style="overflow:hidden">
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>已选择清单</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='deleteCase'>移除</el-button>
                        <el-button type='primary' size='small' @click='importCase'>批量导入</el-button>
                        <el-button type='primary' size='small' @click='exportCase'>导出</el-button>
                        <el-button type='primary' size='small' @click='openPage'>选择标准</el-button>
                        <el-upload v-show='false' ref='selectCriteriaListUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                            :show-file-list='false'  accept='.xls,.xlsx'>
                        </el-upload>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='70px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>标准编号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.stdCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.stdName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' ref='criteriaTable'  stripe :data='tableData' header-row-class-name='tableHeader' @selection-change="handleSelectionChange"
                  border tooltip-effect='dark' height='100%'>
                  <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                  <el-table-column type='index' label='序号'>
                    <template slot-scope='scope'>
                      {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                    </template>
                  </el-table-column>
                  <el-table-column prop='stdCode' label='标准编号'></el-table-column>
                  <el-table-column prop='stdName' label='标准名称'></el-table-column>
                  <el-table-column  label='操作' align='center'  width='220'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP">权限设置</span>
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
    import {cooperateManageCategoryList,cooperateManageStdItemDel,cooperateManageUpload,cooperateManageStdItemDownload} from "../service/service.js";
    export default {
        name:'selectCriteriaList',
        data(){
            return {
                masterId:'',
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                multipleSelection:[],
                tableData:[],
                searchContent:{
                    stdName:'',
                    stdCode:''
                },
                isShowSearch:false
            }
        },
        computed:{
            contentTop() {
                return this.isShowSearch ? "120px" : "59px";
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
            callAction() {
                let callBackDialogFunc = function (obj) {
                   if(obj.action==='selectCriteriaCase'){
                       _self.restSearContent();
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'selectCriteriaList');
            },
            openPage(){
                let _width = "1200";
                let _height = "800";
                let  url ="/collaborativeManage/index.html#/selectCriteriaPage/"+this.masterId+'/true';
                let dialogTitle='选择标准界面';
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh",null,{showClose:false});
            },
            deleteCase(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("当前未选中行,请勾选要移除的行再进行操作。","提示");
                }
                let doit = function () {
                    var ids = _self.multipleSelection.map(item=>{
                        return item.id;
                    })
                    _self.$refs.refLoading.open();
                    cooperateManageStdItemDel(ids).then(res => {
                        _self.multipleSelection=[];
                        _self.$message.success('删除成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            beforeUpload(file) {
                var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                const extension = testmsg === "xls";
                const extension2 = testmsg === "xlsx";
                if (!extension && !extension2) {
                    this.$message({
                    message: "导入文件只能是.xls,.xlsx格式!",
                    type: "warning"
                    });
                }
                return extension || extension2;
            },
            uploadFile(params){
                this.$refs.refLoading.open();
                var fileObj = params.file;
                var form = new FormData();
                form.append('masterId',this.masterId);
                form.append('excel',fileObj);//file
                form.append('time',new Date().getTime());
                cooperateManageUpload(form).then(res=>{
                    this.$message.success('导入成功');
                    this.restSearContent();
                    this.$refs.refLoading.close();
                }).catch(err=>{
                    this.$message.error('导入失败');
                    this.$refs.refLoading.close();
                })
            },
            importCase(){
                // let doit = function(){
                   
                // }
                // EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
                _self.$refs.selectCriteriaListUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗       
             
            },
            exportCase(){
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],     // 排序字段列表
                    order: ['desc'],    // 排序方式列表，asc升序，desc降序
                    masterId:this.masterId
                };
                for (var key in this.searchContent) {
                    if (this.searchContent[key]) {
                        params[key] = this.searchContent[key];
                    }
                }
                cooperateManageStdItemDownload(params).then(res => {
                        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                            navigator.msSaveBlob(new Blob([res.data],'已选择清单.xlsx'));
                            this.$refs.refLoading.close();
                        }else{
                            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); // 为blob设置文件类型，这里以.xlsx为例
                            let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
                            let a = document.createElement("a");
                            a.href = url;
                            a.download = '已选择清单.xlsx';
                            this.$refs.refLoading.close();
                            a.click();
                            // 释放这个临时的对象url
                            window.URL.revokeObjectURL(url);
                        }
                    }).catch(err => {
                        this.$refs.refLoading.close();
                    })
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true,true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData("search",false,false);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            restSearContent(){
                this.searchContent = {
                    stdName:'',
                    stdCode:''
                }
                this.requestData('',true,true);
            },
            requestData(type,isFirstP,isClearS){
                this.$refs.refLoading.open();
                let params = {
                    sort: ["modDate"],
                    order: ["desc"],
                    rows: this.baseInfo.rows,
                    masterId:this.masterId
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
                    this.$refs.criteriaTable.clearSelection();
                }
                params.page = this.baseInfo.page;
                cooperateManageCategoryList(params).then(res=>{
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                });
            },
            changeSearchShow() {
                 this.isShowSearch = !this.isShowSearch;
            },
        }
    }
</script>
<style scoped>
 .selectCriteriaList {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .selectCriteriaList .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
        /* width: 90px;
        display: inline-block;
        text-align: right; */
    }

    .selectCriteriaList .searchRow {
        padding: 16px 10px 16px 10px;
        background: #fff;
    }

    .selectCriteriaList .searchRow .el-select,
    .selectCriteriaList .searchRow .el-input{
        width: 130px;
    }
</style>