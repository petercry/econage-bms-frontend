<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="collaborativeIndex">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden;'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>协同管理</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='editCase({},"addCase")'>新增</el-button>
                        <el-button type='danger' size='small' @click='deleteCase'>删除</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='70px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>编号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.code'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>协同项目:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.projectName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>状态:</span>
                        <el-select filterable v-model='searchContent.status' clearable>
                            <el-option :value='key' :label='val' v-for='(val,key) in statusList' :key='key'></el-option>
                        </el-select>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' ref='collTable'  stripe :data='tableData' header-row-class-name='tableHeader' @selection-change="handleSelectionChange"
                  border tooltip-effect='dark' height='100%'>
                  <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                  <el-table-column type='index' label='序号'>
                    <template slot-scope='scope'>
                      {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                    </template>
                  </el-table-column>
                  <el-table-column prop='code' label='编号'></el-table-column>
                  <el-table-column prop='projectName' label='协同项目'></el-table-column>
                  <el-table-column prop='startDate' label='开始时间'></el-table-column>
                  <el-table-column prop='endDate' label='结束时间'></el-table-column>
                  <el-table-column prop='statusName' label='状态'></el-table-column>
                  <el-table-column  label='操作' align='center'  width='220'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='editCase(scope.row,"editCase")'>编辑</span>
                            <span class="linkB cursorP" @click='openPage("typeA",scope.row)'>选择标准</span>
                            <span class="linkB cursorP" @click='openPage("typeB",scope.row)'>协同范围</span>
                            <span class="linkB cursorP" @click='openPage("typeC",scope.row)'>文件管理</span>
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
    import {cooperateManageList,cooperateManageDelete} from "../service/service.js";
    import { mapState } from "vuex";
    export default {
        name:"collaborativeIndex",
        data(){
            return {
                searchContent:{
                    code:'',
                    projectName:'',
                    status:''
                },
                tableData:[],
                multipleSelection:[],
                isShowSearch:false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
            }
        },
        computed:{
            ...mapState(['statusList']),
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
            this.callAction();
        },
        mounted(){
           this.requestData();
        },
        methods:{
            openPage(type,row){
                let tabObj = {};
                let goPage;
                if (type === "typeA") {
                   //选择标准
                   tabObj.desc = row.projectName+'-选择标准';
                   goPage = "collaborativeManage/index.html#/selectCriteriaList/"+row.id;
                   tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'selectCriteriaList-" + row.id + "',href_link:'" + goPage + "'}"
                } else if (type === "typeB") {
                  //协同范围
                  tabObj.desc = row.projectName+'-协同范围';
                  goPage = "collaborativeManage/index.html#/selectedStaff/"+row.id;
                  tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'selectedStaff-" + row.id + "',href_link:'" + goPage + "'}"
                } else {
                  //文件管理
                  tabObj.desc = row.projectName+'-文件管理';
                  goPage = "collaborativeManage/index.html#/fileManage/"+row.id;
                  tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'fileManage-" + row.id + "',href_link:'" + goPage + "'}"
                }
                tabObj.reload = true;
                tabObj.clearIframe = true;
                EcoUtil.getSysvm().doTab(tabObj);
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                   if(obj.action==='editColl'){
                       _self.$message.success("修改成功!");
                       _self.requestData('search',false,true);
                        
                    }else if(obj.action==="addColl"){
                        _self.$message.success("新增成功!");
                        _self.restSearContent();

                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'collaborativeIndex');
            },
            editCase(row,type){
                let _width = "700";
                let _height = "400";
                let url;
                let dialogTitle;
                if (type === "editCase") {
                    url ="/collaborativeManage/index.html#/editColl/" +row.id +"/editCase";
                    dialogTitle = "编辑";
                } else if (type === "viewCase") {
                    url ="/collaborativeManage/index.html#/editColl/" + row.id +"/viewCase";
                    dialogTitle = "查看";
                    _height = "500";
                } else {
                    url ="/collaborativeManage/index.html#/editColl/" +0 +"/addCase";
                    dialogTitle = "新增";
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
            },
            deleteCase(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("当前未选中行,请勾选要删除的行再进行操作。","提示");
                }
                let doit = function () {
                    var ids = _self.multipleSelection.map(item=>{
                        return item.id;
                    })
                    _self.$refs.refLoading.open();
                    cooperateManageDelete(ids).then(res => {
                        _self.multipleSelection=[];
                        _self.$message.success('删除成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            restSearContent(){
                this.searchContent = {
                    code:'',
                    projectName:'',
                    status:''
                }
                this.requestData('',true,true);
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
            changeSearchShow() {
                 this.isShowSearch = !this.isShowSearch;
            },
            requestData(type,isFirstP,isClearS){
                this.$refs.refLoading.open();
                let params = {
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
                    this.$refs.collTable.clearSelection();
                }
                params.page = this.baseInfo.page;
                cooperateManageList(params).then(res=>{
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
    .collaborativeIndex {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .collaborativeIndex .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
        /* width: 90px;
        display: inline-block;
        text-align: right; */
    }

    .collaborativeIndex .searchRow {
        padding: 16px 10px 16px 10px;
        background: #fff;
    }

    .collaborativeIndex .searchRow .el-select,
    .collaborativeIndex .searchRow .el-input{
        width: 130px;
    } 
</style>