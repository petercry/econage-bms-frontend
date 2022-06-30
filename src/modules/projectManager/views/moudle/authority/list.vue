<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="authorityList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="24">
                        <eco-tool-title style="line-height: 34px;margin-right:50px;" title="权限管理"></eco-tool-title>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content bottom="0px" top="61px" style="padding:10px 15px;">
                <el-table @header-dragend="changeColWidth" :data="dataList" border tooltip-effect="dark" style="width: 100%;" size="mini" class="ecoList" height="100%" stripe>
                    <el-table-column prop="index" label="序号" width='50'>
                        <template slot-scope="scope">
                           {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="60" v-if="editable && (roleMap['admin'] || roleMap['edit'])">
                        <template slot-scope="scope">
                            <div>
                                <span class="pointerClass primaryColor" @click="editAuthority(scope.row.roleType)">编辑</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="roleTypeName" label="角色类型"  min-width="150" align='center'>
                    </el-table-column>
                    <!-- <el-table-column prop="faw_pm_model_activity" label="专业" width="170" show-overflow-tooltip align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_activity)}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="faw_pm_model_info" label="项目卡片" width='170' min-width="150" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_info)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="faw_pm_model_miles" label="里程碑" width='170' min-width="130" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_miles)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="faw_pm_model_group" label="团队" width='170'  min-width="120" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_group)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="faw_pm_model_plan" label="项目计划" width='170' min-width="150" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_plan)}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="faw_pm_model_contract" label="项目合同" width='170' min-width="150" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_contract)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="faw_pm_model_problem" label="问题" width='140' min-width="120" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_problem)}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="faw_pm_model_risk" label="风险" width='140' min-width="120" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_risk)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="faw_pm_model_auth" label="权限" width='140' min-width="120" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_auth)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="faw_pm_model_qtms" label="QTMS" width='140' min-width="120" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_qtms)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="faw_pm_model_div" label="交付物" width='140' min-width="120" align='center'>
                        <template slot-scope="scope">
                            {{reastData(scope.row.faw_pm_model_div)}}
                        </template>
                    </el-table-column>
                </el-table>
            </eco-content>
        </div>
    </eco-content>
</template>
<script>
    let _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { sysEnv } from '../../../config/env.js'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { mapGetters } from 'vuex'
    import { getAuthorityList } from '../../../api/authority.js'
    import { getEnumSelectEnabled,getPMModelRole } from '../../../api/common.js'
    export default {
        name: 'authorityList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        data() {
            return {
                columnList: ['faw_pm_model_activity', 'faw_pm_model_info', 'faw_pm_model_group', 'faw_pm_model_plan', 'faw_pm_model_miles', 'faw_pm_model_contract', 'faw_pm_model_risk', 'faw_pm_model_problem','faw_pm_model_auth','faw_pm_model_qtms','faw_pm_model_div'],
                dataList: [],
                faw_pm_authority_operate_type: [],//基础数据
                modelId:null,
                infoId:null,
                roleMap:{
                    admin:true
                }
            }
        },
        props:{
            editable: {
                type: Boolean,
                default(){
                    return true
                }
            }
        },
        created() {
            _self = this;
            if(this.$route.params.modelId && this.$route.params.modelId >0){
                this.modelId = this.$route.params.modelId;
            }
            if(this.$route.params.infoId && this.$route.params.infoId >0){
                this.infoId = this.$route.params.infoId;
                this.getPMModelRole();
            }
            this.callAction();
        },
        mounted() {
            getEnumSelectEnabled('faw_pm_authority_operate_type','update-enabled').then(res => {
                this.faw_pm_authority_operate_type = res;
                this.getListDataFunc();
            })
        },
        methods: {
            reastData(arr) {
                let str=[];
                if (arr.length === 0) {
                    return '';
                }
                arr.forEach((item, index) => {
                    _self.faw_pm_authority_operate_type.forEach((item2,index2)=>{
                         if(item.type===item2.id){
                             str.push(item2.text);
                         }
                    })
                })
                return str.join(',');
            },
            getPMModelRole(){
                getPMModelRole(this.$route.params.infoId,'faw_pm_model_auth').then(res=>{
                    this.roleMap = res;
                })
            },
            callAction() {
                let this_ = this;
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action == 'editAuthority')) {
                        this_.$message({
                            message: '修改成功！',
                            showClose: true,
                            duration: 2000,
                            type: 'success'
                        });
                        this_.getListDataFunc();
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'authorityList');
            },
            getListDataFunc() {
                //获取数据
                this.$refs.ecoLoadingRef.open();
                getAuthorityList(this.modelId,this.infoId).then(res => {
                    let arr = [];
                    res.rows.forEach((item, index) => {
                        var obj = { roleTypeName: item.roleTypeName, roleType: item.roleType };
                        for (var key in item.modelMap) {
                            obj[item.modelMap[key].modelType] = item.modelMap[key].operateType;
                        }
                        arr.push(obj);
                    })
                    arr.forEach((item, index) => {
                        _self.columnList.forEach((key) => {
                            if (!item[key]) {
                                item[key] = [];
                            }
                        })
                    })
                    this.dataList = arr;
                    this.$refs.ecoLoadingRef.close();
                })
            },
            editAuthority(roleType) {

                let _width = '800';
                let _height = '400';
                let moudleId = this.modelId || this.infoId || 0;
                let modules = "0";
                if(this.modelId && this.modelId > 0){
                    modules = "templates"
                }
                if(this.infoId && this.infoId > 0){
                    modules = "project"
                }
                let url = '/projectManager/index.html#/editAuthority/' + roleType + '/' + moudleId + '/' + modules;

                EcoUtil.getSysvm().openDialog('编辑权限', url, _width, _height, '15vh');


            },
            changeColWidth(nw,ow,col,evt){
                if(nw < col.minWidth){
                    col.width = col.minWidth;
                }
            }
        }
    };
</script>

<style scoped>
    .authorityList {
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: hidden;
        min-width: 1131px;
        border: 1px solid #ddd;
        color: #0f1419;
    }

    .authorityList .plainBtn {
        border-color: #003b90;
        color: #003b90;
        font-size: 14px;
    }

    .authorityList .toolBtn {
        margin: 0 10px;
    }
</style>
