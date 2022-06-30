<template>
    <div class='deptLiaisionProof'>
        <div class='addForm' v-loading='loading'>
            <el-table :data='tableData' border
                :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}"
                :cell-style="{textAlign:'center'}" height='90%'>
                <el-table-column label='序号' type='index' width='50'></el-table-column>
                <el-table-column label='科室' prop='deptId'>
                    <template slot-scope='scope'>
                        <span v-if='!scope.row.isEdit'>{{scope.row.deptName}}</span>
                        <tag-select v-else placeholder="选择机构" style="width:100%;vertical-align: top;"
                            :initDataStr="scope.row.deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}"
                            @callBack="(data)=>{selectRoleDept(data,scope.$index)}">
                        </tag-select>
                    </template>
                </el-table-column>
                <el-table-column label='科室联络员' prop='userId'>
                    <template slot-scope='scope'>
                        <span  v-if='!scope.row.isEdit'>{{scope.row.userName}}</span>
                        <tag-select v-else placeholder="选择人员" style="width:100%;vertical-align: top;"
                            :initDataStr="scope.row.initDataStr" :initOptions="{selectNum:1,selectType:'User'}"
                            @callBack="(data)=>{selectRoleUser(data,scope.$index)}">
                        </tag-select>
                    </template>
                </el-table-column>
                <el-table-column label='员工ID' prop='id'></el-table-column>
                <el-table-column label="操作" width="100" min-width="100">
                    <template slot-scope='scope'>
                        <el-button type='text'  v-show='!scope.row.isEdit && !scope.row.isAdd'  @click.stop='editCase(scope.$index)'>修改</el-button>
                        <el-button type='text'  v-show='scope.row.isEdit && !scope.row.isAdd'  @click.stop='cancelCase(scope.$index)'>取消</el-button>
                        <el-button type='text' style='color:#F56C6C' @click.stop='deleteCase(scope.row.id,scope.$index)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class='caseBtn' @click='addRowItem'>
                <span><i class='el-icon-plus'></i>添加</span>
            </div>
        </div>
        <div class="btn">
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import { officeRoleList, officeRoleAdd, officeRoleEdit, deptLiaisonProofDel,getUserInfoByOrgId } from '../service/service.js'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    export default {
        name: 'deptLiaisionProof',
        data() {
            return {
                timer:null,
                loading: false,
                tableData: [],
                tableDataCopy:[]
            }
        },
        computed: {},
        components: {
            tagSelect
        },
        created() {
            _self = this;
            this.requestData();
        },
        methods: {
            cancelCase(index){
                this.tableData[index] = this.tableDataCopy[index];
            },
            editCase(index){
                this.loading = true ;
                getUserInfoByOrgId(this.tableData[index].userId).then(res=>{
                    this.$set(this.tableData[index],'initDataStr',`{"type":"PERSONNEL","orgId":"${res.data.departments[0].id}.${res.data.id}","linkId":"${res.data.id}"}`)
                    this.$set(this.tableData[index],'deptInitDataStr',`{"type":"DEPT","orgId":"${this.tableData[index].deptId}","linkId":"${this.tableData[index].deptId}"}`);
                    this.tableData[index].isEdit = !this.tableData[index].isEdit;
                    this.loading = false;
                })
            },
            deleteCase(id, index) {
                let doit = function () {
                    if (id) {
                        _self.loading = true;
                        deptLiaisonProofDel([id]).then(res => {
                            if (res.data.success) {
                                _self.tableData.splice(index, 1);
                                _self.tableDataCopy.splice(index, 1);
                                _self.loading = false;
                            }
                        })
                    } else {
                        _self.tableData.splice(index, 1);
                        _self.tableDataCopy.splice(index, 1);
                    }
                }
                EcoMessageBox.confirm(`您确定要删除此条数据?`, '提示', { type: 'warning', lockScroll: false }, doit)

            },
            requestData() {
                this.loading = true;
                officeRoleList().then(res => {
                    res.data.rows.forEach(item=>{
                        item.isEdit = false;
                    })
                    this.tableDataCopy = JSON.parse(JSON.stringify(res.data.rows));
                    this.tableData = res.data.rows;
                    this.loading = false;
                    console.log(res);
                })
            },
            addRowItem(type) {
                this.tableData.push({
                    id: '',
                    userId: '',
                    deptId: '',
                    deptInitDataStr: '',
                    initDataStr: '',
                    isEdit:true,
                    isAdd:true
                });
            },
            selectRoleDept(data, index) {
                //责任部门
                if (!data.id && data.itemArray.length === 0) {
                    this.tableData[index].deptInitDataStr = '';
                    this.tableData[index].deptId = '';
                } else {
                    this.tableData[index].deptId = data.orgId;
                }
            },
            selectRoleUser(data, index) {
                //选择人
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.tableData[index].initDataStr = '';
                    this.tableData[index].userId = '';
                } else {
                    this.tableData[index].userId = data.itemArray[0].linkId;
                }
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                let valid = true;
                this.tableData.forEach(item=>{
                    if(item.isEdit && (!item.userId || !item.deptId)){
                        valid =false;
                    } 
                })
                if (valid) {
                    if(this.tableData.length == 0){
                       this.$message.warning('暂无数据保存!');
                       return;   
                   }
                    this.loading = true;
                    this.tableData.forEach(item=>{
                        let params = {
                            userId: item.userId,
                            deptId: item.deptId,
                        }
                        if(item.isEdit){
                            if(item.id){
                                params.id = item.id;
                                //编辑
                                officeRoleEdit(params).then(res=>{
                                    if(this.timer){
                                        clearTimeout(this.timer);
                                        this.timer = null;
                                    }
                                    this.timer = setTimeout(()=>{
                                        this.loading = false;
                                        let doObj = {};
                                        doObj.action = 'deptLiaisionProof';
                                        doObj.data = {};
                                        doObj.close = true;
                                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                    },500)
                                })
                            }else{
                                 //新增
                                officeRoleAdd(params).then(res=>{
                                    if(this.timer){
                                        clearTimeout(this.timer);
                                        this.timer = null;
                                    }
                                    this.timer = setTimeout(()=>{
                                        this.loading = false;
                                        let doObj = {};
                                        doObj.action = 'deptLiaisionProof';
                                        doObj.data = {};
                                        doObj.close = true;
                                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                    })
                                })
                            }
                        }
                    })
                }else{
                    this.$message.warning('请完善数据再进行保存操作!')
                }
            }
        }
    }
</script>
<style scoped>
    .deptLiaisionProof {
        background: #fff;
        height: 100%;
    }

    .deptLiaisionProof .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
    }

    .deptLiaisionProof .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .deptLiaisionProof .caseBtn {
        margin-top: 10px;
        border: 1px dashed #409eff;
        background-color: #fff;
        cursor: pointer;
        text-align: center;
        color: #409eff;
        border-radius: 4px;
        font-size: 14px;
        padding: 5px 0px;
        user-select: none;
    }
</style>