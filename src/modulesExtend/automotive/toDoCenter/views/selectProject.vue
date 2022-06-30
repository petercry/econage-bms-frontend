<template>
    <eco-content top='0px' bottom='0px' type='tool'>
        <div class='selectIdPage'>
            <ecoLoading ref='refSelLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='selectIdTab' @selection-change="handleSelectionChange" highlight-current-row stripe
                    :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号'></el-table-column>
                    <el-table-column prop='name' v-if="typePage =='selectProjectId'" label='项目名称' align='center'></el-table-column>
                    <el-table-column prop='standardRegulationNo' label='法规编号' align='center' v-else></el-table-column>
                </el-table>
            </eco-content>
        </div>
        <div class='btn'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
        </div>
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { projectListSelectId,dfHandlingInterfaceSendMap} from '../service/service.js'
    export default {
        name: 'selectIdPage',
        components: {
            ecoContent,
            ecoLoading
        },
        computed: {
            typePage(){
                return this.$route.params.typePage;
            }
        },
        data() {
            return {
                tableData: [],
                multipleSelection: [],
            }
        },
        created() {
            _self = this;
        },
        mounted() {
            this.requestData();
        },
        methods: {
            onCancel() {
                console.log(this.$route.query.isPoralto);
                if(this.$route.query.isPoralto){
                    //门户跳转
                    window.parent.window.portalIndex.changeDialog({
                        title:'',
                        show:false,
                        width:'',
                        height:'',
                        top:'',
                        url:''
                    })
                }else{
                    EcoUtil.getSysvm().closeDialog();
                }
            },
            onSubmit() {
                if(this.multipleSelection.length === 0){
                    this.$message.warning('请选择一条数据!');
                    return;
                }
                let doObj = {};
                if(this.typePage =='selectProjectId'){
                    doObj.data = this.multipleSelection[0].id;
                    doObj.action = 'selectProjectId';
                }else{
                    doObj.data = {
                        id:this.multipleSelection[0].id,
                        step:this.typePage,
                        standardRegulationNo:this.multipleSelection[0].standardRegulationNo
                    }
                    doObj.action = 'selectStandardRegulationNo';   
                }
                doObj.close = true;
                if(this.$route.query.isPoralto){
                    window.parent.window.portalIndex.callBack(doObj);
                }else{
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                }
              
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            requestData() {
                this.$refs.refSelLoading.open();
                if(this.typePage =='selectProjectId'){
                    //选择项目编号
                    projectListSelectId(this.$route.params.id).then(res => {
                        this.tableData = res.data;
                        this.$refs.refSelLoading.close();
                    }).catch(err => {
                        this.tableData = [];
                        this.$refs.refSelLoading.close();
                    })
                }else{
                    dfHandlingInterfaceSendMap(this.typePage).then(res=>{
                        this.tableData = res.data.rows;
                        this.$refs.refSelLoading.close();
                    }).catch(err => {
                        this.tableData = [];
                        this.$refs.refSelLoading.close();
                    })
                }
            }
        },
        watch: {

        }
    }
</script>
<style scoped>
    .selectIdPage {
        color: #0f1419;
        /* min-width: 1200px; */
        position: relative;
        height: 94%;
        /* margin: 0 24px; */
        /* top: 2%; */
        overflow-y: auto;
        color: #0f1419;
    }

    .selectIdPage .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .selectIdPage .searchInputLabel {
        font-size: 14px;
        margin-left: 8px;
    }

    .selectIdPage /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

    .selectIdPage /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
        border-bottom-width: 0px;
    }

    .selectIdPage /deep/ .el-table__row td {
        border-bottom-width: 0px;
    }

    .selectIdPage /deep/ .el-table__row td,
    .selectIdPage /deep/ .tableHeader th {
        border: 0px;
    }

    .btn {
        position: absolute;
        bottom: 10px;
        text-align: center;
        left: 50%;
        transform: translateX(-50%);
    }
</style>