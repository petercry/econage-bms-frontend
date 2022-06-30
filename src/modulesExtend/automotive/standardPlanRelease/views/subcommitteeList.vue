<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="subcommitteeList" :class="{isOpenDia:!isOpenDia}">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style='background-color: #fff;'>
                <el-row class="toolbar">
                    <el-col :span="12">
                        <eco-tool-title style="line-height: 38px;" title="分标委"></eco-tool-title>
                        <span class='searchInputLabel'>分标委名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true)" style='width:150px;' v-model='searchContent.name'placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col :span="12" style="text-align:right;padding-right:10px;" v-if='!isOpenDia'>
                        <el-button type="text" size="medium" @click="editCase({},'addCase')"><i class="el-icon-plus"></i> 添加数据</el-button>
                        <el-button type="text" size="medium"  @click="deleteCase"><i class="el-icon-delete" style="color:#f56c6c;"></i><span style="color:#f56c6c;">删除</span></el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <ecoContent top="60px" bottom="45px" style="padding:15px;">
                <el-table :data="tableData" highlight-current-row stripe class="styleTableDefault" style="width: 100%"
                    size="mini" height="100%" @header-dragend="changeColWidth" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index"  min-width="40px" max-width="50"></el-table-column>
                    <el-table-column prop="name" show-overflow-tooltip label="名称" min-width="100"></el-table-column>
                    <el-table-column prop='order' label='序号'></el-table-column>
                    <el-table-column prop="responsibleUserName" show-overflow-tooltip label="责任人" min-width="100"></el-table-column>
                    <el-table-column label="操作" width="100" min-width="100" v-if='!isOpenDia'>
                        <template slot-scope="scope" >
                            <div>
                                <span class="linkB cursorP" @click="editCase(scope.row,'editCase')" >编辑</span>
                                <!-- <span class="split" ></span>
                                <span  class="cursorP" @click="deleteCase(scope.row)"  style="color:#f56c6c;">删除</span>  -->
                            </div>
                        </template>
                   </el-table-column>
                </el-table>
            </ecoContent>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px;background: #f5f5f5">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
        <div class='btn' v-if='isOpenDia'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
        </div>
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import {subStdCommitteeList,subStdCommitteeDel} from '../service/service.js'
    export default {
        data() {
            return {
                multipleSelection:[],
                searchContent: {
                    name:''
                },
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                tableData: []
            }
        },
        computed:{
            isOpenDia(){
                return this.$route.params.isOpenDia=='true';
            }
        },
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        created() {
            _self = this;
            this.callAction();
        },
        mounted(){
            this.requestData('',false);
        },
        methods: {
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                if (this.multipleSelection.length === 0 || this.multipleSelection.length>1) {
                    this.$message.warning('请选择一条数据!');
                    return;
                }
                let doObj = {};
                doObj.action = this.$route.query.action;//'selectSubcommittee'
                doObj.dataArr = this.multipleSelection[0];
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            },
            restSearContent(){
                this.searchContent =  {
                    name:''
                };
                this.requestData('',true);
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'addSubcommittee')) {
                        //新增刷新
                        _self.$message.success('新增成功!');
                        _self.restSearContent();
                    } else if (obj.action === 'editSubcommittee') {
                        //编辑刷新
                        _self.$message.success('编辑成功!');
                        _self.requestData('search',false);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'planIndex');
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false);
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',false)
            },
            requestData(type,isFirstP) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['order'],
                    order: ['asc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                if(isFirstP){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                subStdCommitteeList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
            },
            deleteCase(){
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
                }
                let doit = function () {
                    _self.$refs.refLoading.open();
                    let ids = _self.multipleSelection.map(item=>{
                        return item.id;
                    })
                    subStdCommitteeDel(ids).then(res=>{
                        _self.multipleSelection = [];
                        _self.$message.success('删除成功!');
                        _self.restSearContent();        
                    }).catch(err=>{
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm(`您确定要删除此条数据?`, '提示', { type: 'warning', lockScroll: false }, doit)
            },
            changeColWidth(nw, ow, col, evt) {
                if (nw < col.minWidth) {
                    col.width = col.minWidth;
                }
            },
            editCase(row, type) {
                let _width = "600";
                let _height = "300";
                let url;
                let dialogTitle;
                if (type === "editCase") {
                    url = "/standardPlanRelease/index.html#/editSubcommittee/" + row.id + "/editCase";
                    dialogTitle = "编辑";
                } else if (type === "viewCase") {
                    url = "/standardPlanRelease/index.html#/editSubcommittee/" + row.id + "/viewCase";
                    dialogTitle = "查看";
                    _height = "500";
                } else {
                    url = "/standardPlanRelease/index.html#/editSubcommittee/" + 0 + "/addCase";
                    dialogTitle = "新增";
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
            },
        }

    }
</script>
<style scoped>
.subcommitteeList{
    position: relative;
    height: 94%;
    overflow-y: auto;
    color: #0f1419;
}
.subcommitteeList.isOpenDia{
    min-width: 1000px;
    margin: 0 24px;
    top: 2%;
    height: 96%;
}
.subcommitteeList .toolbar{
    padding: 10px 10px;
    border-bottom: 1px solid #ddd;
}
.subcommitteeList .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
        width: 90px;
        display: inline-block;
        text-align: right;
    }
.btn {
    position: absolute;
    bottom: 0px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }

</style>