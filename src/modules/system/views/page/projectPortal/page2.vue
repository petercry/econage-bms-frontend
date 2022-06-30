<template>
    <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5;overflow:hidden;">
        <div class="projectPortal">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <!-- <eco-content class="contentSetStaticMG20" top="0px" height="60px" type='tool'>
                <el-row style='padding:12px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='24'>
                        <eco-tool-title title='工时'></eco-tool-title>
                        <el-button class='plainBtn' size='small' @click='goPage("forInput")'>
                            <i class='el-icon-edit' style='margin-right:5px;'></i>填报</el-button>
                        <el-button class='plainBtn' size='small' @click='goPage("forView")'>
                            <i class='el-icon-tickets' style='margin-right:5px;'></i>查看</el-button>
                    </el-col>
                </el-row>
            </eco-content> -->
            <projectPlanComp></projectPlanComp>
            <projectRiskComp style="margin-top:16px;"></projectRiskComp>
            <projectProblemComp style="margin-top:16px;"></projectProblemComp>
            <taskListComp style="margin-top:16px;"></taskListComp>
        </div>
    </eco-content>
</template>
<script>
    let _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import {  } from '@/modules/system/service/service.js'
    import { getEnumSelectEnabled, getKVSingleInfo } from '@/modules/projectManager/api/common.js'
    import projectPlanComp from './components/projectPlan.vue'
    import taskListComp from './components/taskList.vue'
    import projectProblemComp from './components/projectProblem.vue'
    import projectRiskComp from './components/projectRisk.vue'
    export default {
        name: 'page1',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            projectPlanComp,
            taskListComp,
            projectRiskComp,
            projectProblemComp,
        },
        data() {
            return {
                
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            goProjectDetail(item) {
                let tabObj = {};
                let goPage = 'projectManager/index.html#/projectCard/' + item.id;
                tabObj.desc = item.name + '项目详情';
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + (item.name + '项目详情') + "',href_link:'" + goPage + "',fullScreen:false}";
                window.sysvm.doTab(tabObj);
            },
            cellClick(row, column, cell, event){
              if (column.property=='projectName'){
                this.goProjectDetail(row)
              }else{
                event.preventDefault();
              }
            },
            goTaskDetail(item) {
                let tabObj = {};
                let goPage = 'projectManager/index.html#/projectCard/' + item.id;
                tabObj.desc = item.name + '任务详情';
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + (item.name + '任务详情') + "',href_link:'" + goPage + "',fullScreen:false}";
                window.sysvm.doTab(tabObj);
            },
            goPage(type) {
                let tabObj = {};
                let goPage;
                if (type === 'forView') {
                    goPage = 'workHours/index.html#/workHour-forView';
                    tabObj.desc = '工时查看';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'workHour-forView-user',href_link:'" + goPage + "',fullScreen:false}";
                } else  if (type === 'forInput'){
                    goPage = 'workHours/index.html#/workHour-forInput';
                    tabObj.desc = '工时填报';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'workHour-forInput',href_link:'" + goPage + "',fullScreen:false}";
                }else if (type === "taskMore"){
                    goPage = 'flowform/index.html#/wfToDo';
                    tabObj.desc = '待办任务';
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfToDo',href_link:'" + goPage + "',fullScreen:false}";
                }
                if (window.sysvm) {
                    window.sysvm.doTab(tabObj);
                } else {
                    window.parent.window.sysvm.doTab(tabObj);
                }
            },
        }
    };
</script>

<style scoped>
    .projectPortal {
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: hidden;
        min-width: 800px;
        color: #0f1419;
    }

    .projectPortal .plainBtn {
        border-color: #003b90;
        color: #003b90;
        font-size: 12px;
        padding: 8px 25px;
    }

    .projectPortal .plainBtn:first-of-type {
        margin-left: 80px;
    }

    .projectPortal .toolBtn {
        margin: 0 10px;
    }

    .projectPortal .el-table /deep/ .tableHeader th {
        background: #FAFAFA;
        height: 50px;
        color: #000;
    }

    .projectPortal .el-table /deep/ .tableHeader .cell {
        color: #000;
    }
    /* @media screen and (max-height:900px){ */
        .projectPortal .contentSetStatic{
            position:static;
        }
        .projectPortal .contentSetStaticMG20{
            position:static;
            margin-bottom: 20px;
        }
        .projectPortal{
            overflow-y: auto;
            margin: 0;
            padding: 0 24px;
            top: 0;
            padding-top: 2%;
        }
    /* } */
</style>