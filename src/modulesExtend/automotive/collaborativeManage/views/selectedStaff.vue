<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="selectedStaff">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style="overflow:hidden">
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>已选人员列表</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='selectOrgPick'>选择人员</el-button>
                        <el-button type='primary' size='small' @click='deleteCase'>批量取消</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='70px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>工号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.workCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>姓名:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.userName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>机构:</span>
                        <tag-select placeholder="选择机构" style="width:200px;vertical-align: top;" initDataStr="" ref='selectDept'
                            :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="selectRoleDept">
                        </tag-select>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table row-key='id' ref='selectedStaffTag'  stripe :data='tableData' header-row-class-name='tableHeader' @selection-change="handleSelectionChange"
                  border tooltip-effect='dark' height='100%'>
                  <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                  <el-table-column type='index' label='序号'>
                    <template slot-scope='scope'>
                      {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                    </template>
                  </el-table-column>
                  <el-table-column prop='userName' label='姓名'></el-table-column>
                  <el-table-column prop='orgName' label='机构'></el-table-column>
                  <el-table-column prop='workCode' label='工号'></el-table-column>
                  <el-table-column prop='email' label='邮箱'></el-table-column>
                  <el-table-column prop='mobilePhone' label='手机号'></el-table-column>
                  <el-table-column  label='操作' align='center'  width='220'>
                        <template slot-scope='scope'>
                            <span class="linkB cursorP" @click='deleteSignal(scope.row.id)'>取消</span>
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
    import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import {cooperateManageSelectList,cooperateManageAddStaff,cooperateManageDelStaff} from "../service/service.js";
    export default {
        data(){
            return {
                searchContent:{
                    workCode:'',
                    userName:'',
                    orgId:''
                },
                options:{
                    selectNum:2,
                    selectType:'User',
                    maxOrgPathLevel:0, //显示的层级
                    idSplit:'|',
                    begin_id:null
                },
                masterId:'',
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                tableData:[],
                isShowSearch:false,
                multipleSelection:[]
            }
        },
        computed:{
            contentTop() {
                return this.isShowSearch ? "120px" : "59px";
            }
        },
        components: {
            ecoContent,
            ecoLoading,
            tagSelect
        },
        created(){
            this.masterId = this.$route.params.masterId;
            _self = this;
        },
        mounted(){
            this.requestData('',false,false)
        },
        methods:{
            deleteSignal(id){
                //单个取消
                let doit = function () {
                    _self.$refs.refLoading.open();
                    cooperateManageDelStaff([id],_self.masterId).then(res => {
                        _self.multipleSelection = [];
                        _self.$message.success('取消成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                } 
                EcoMessageBox.confirm('确定要取消此数据?', '提示', { type: 'warning', lockScroll: false }, doit)

            },
            selectRoleDept(data){
                if (!data.id && data.itemArray.length === 0) {
                    this.searchContent.orgId = '';
                } else {
                    this.searchContent.orgId = data.orgId;
                }
            },
            deleteCase(){
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
                }
                let doit = function () {
                    _self.$refs.refLoading.open();
                    let ids= [];
                    _self.multipleSelection.forEach(item=>{
                        ids.push(item.id);
                    })
                    cooperateManageDelStaff(ids,_self.masterId).then(res => {
                        _self.multipleSelection = [];
                        _self.$message.success('取消成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                } 
                EcoMessageBox.confirm('确定要批量取消数据?', '提示', { type: 'warning', lockScroll: false }, doit)

            },
            restSearContent(){
                this.$refs.selectDept.initDataStrFunc();
                this.searchContent = {
                    workCode:'',
                    userName:'',
                    orgId:''
                };
                this.requestData('',true,true);
            },
            selectOrgPick(){
                let _key = EcoUtil.getUID();
                let _keyData = {};
                _keyData.options = EcoUtil.objDeepCopy(this.options);
                _keyData.initDataList = [];

                EcoUtil.getSysvm().setTempStore(_key,_keyData); //设置临时数据
                let callBack = function(callObj){
                    _self.emitFunc(callObj.itemArray);
                }
                if(window.sysEnv === 0){
                    EcoUserPick.searchReceiverByEnv(_key,callBack);
                }else{
                    EcoUserPick.searchReceiver(_key,callBack);
                }
            },
            emitFunc(data){
                if(data.length!==0){
                    let dataArr = data.map((item=>{
                       return {
                         orgId:item.orgId,
                         linkId:item.linkId,
                         type:item.type,
                         role:item.role
                       }
                    }))
                    cooperateManageAddStaff(dataArr,this.masterId).then(res=>{
                        this.$message.success('添加成功!');
                        this.restSearContent();
                    })
                }
               
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
                    masterId:this.masterId,
                    sort: ["createDate"],
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
                    this.$refs.selectedStaffTag.clearSelection();
                }
                params.page = this.baseInfo.page;
                cooperateManageSelectList(params).then(res=>{
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                });
            },
        }
    }
</script>
<style scoped>
 .selectedStaff {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .selectedStaff .searchInputLabel {
        font-size: 14px;
        margin: 0px 5px 0px 8px;
        /* width: 90px;
        display: inline-block;
        text-align: right; */
    }

    .selectedStaff .searchRow {
        padding: 16px 10px 16px 10px;
        background: #fff;
    }

    .selectedStaff .searchRow .el-select,
    .selectedStaff .searchRow .el-input{
        width: 130px;
    }
</style>