<template>
    <div class='listMain'>
        <eco-content top='0' height='30px' type='tool' style='border-bottom:1px solid #ddd;padding: 10px;background-color: #fff;'>
            <el-row>
                <el-col :span='8'>
                    <eco-tool-title style='line-height:30px;' title='编辑'></eco-tool-title>
                </el-col>
                <el-col :span='16' style='text-align:right'>
                    <el-button type="danger" size="mini" @click="deleteCase" v-if="groupRoleDelete && editable && roleEdit">
                        删除
                        <i class="el-icon-close el-icon--right"></i>
                    </el-button>
                    <el-button type='primary' size='mini' @click='saveCase' v-if="groupRoleEdit && editable && roleEdit">
                        保存
                        <i class='el-icon-check el-icon--right'></i>
                    </el-button>
                </el-col>
            </el-row>
        </eco-content>
        <eco-content top='58px' bottom='0px' type='tool' style='background: #fff;'>
            <div class='content-box' v-loading='loading'>
                <table>
                    <thead>
                        <tr>
                            <th colspan="5">{{tableData.name}}</th>
                        </tr>
                        <tr>
                            <th>姓名</th>
                            <th>工号</th>
                            <th>部门</th>
                            <th>团队名称</th>
                            <th>角色</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='(item,index) in roleLinkUser' :key="'link'+index">
                            <td>
                                <tag-select placeholder="请选择人员" :disabled="!groupRoleEdit || !editable || !roleEdit" :showPopover="true" style="width:80%;vertical-align: top;text-align:left;"
                                    :initDataStr="item.initDataStr" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>selectRoleUser(data,index)">
                                </tag-select>
                            </td>
                            <td>{{item.orgId}}</td>
                            <td>{{item.deptName}}</td>
                            <td>{{projectInfo.name+tableData.name}}</td>
                            <td>
                                {{item.roleName}}
                                <span class='addUser' v-if="groupRoleEdit && editable && roleEdit" @click='addRoleUser(item,index)'>+</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </eco-content>
    </div>
</template>
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { getGroupInfo, saveGroupLinkUser, deleteGroup, getGroupRole } from '@/modules/projectManager/api/group.js'
    import { getUserInfoByOrgId } from '@/modules/projectManager/api/common.js'
    import { mapGetters } from 'vuex'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    export default {
        name: 'listMain',
        data() {
            return {
                id: '',
                loading: false,
                tableData: [],
                roleLinkUser: [],
                projectInfo: {},
                roleEdit: false
            }
        }
        , components: {
            tagSelect,
            ecoToolTitle,
            ecoContent
        }
        , computed: {
            ...mapGetters([
                'groupRoleEdit', 'groupRoleAdd', 'groupRoleDelete'
            ]),
        }
        , props: {
            editable: {
                type: Boolean,
                default() {
                    return true
                }
            }
        }
        , created() {
            _self = this;
            this.projectInfo = window.projectCardVue.projectInfo;
            this.id = this.$route.params.id;

            this.initData();
        }, methods: {
            deleteCase() {
                let doit = function () {
                    deleteGroup(_self.id).then(res => {
                        _self.$message({
                            message: '删除成功',
                            showClose: true,
                            duration: 2000,
                            customClass: 'design-from-el-message',
                            type: 'success'
                        });
                        _self.$emit("callBack", "deleteGroup", _self.id);
                        if (window.isInCard) {
                            _self.$router.push({ name: 'templatesCard' });
                        } else if (window.isInProjectCard) {
                            _self.$router.push({ name: 'projectCard' });
                        } else {
                            _self.$router.push({ name: 'roleSetting' });
                        }
                    })
                }
                EcoMessageBox.confirm('确定要删除吗?', '提示', {
                    type: 'warning',
                    lockScroll: false
                }, doit);

            },
            addRoleUser(item, index) {
                let len = this.roleLinkUser.length;
                if (len === 1 || index === (len - 1)) {
                    this.roleLinkUser.push({ userId: '', userName: '', roleId: item.roleId, roleName: item.roleName, initDataStr: '', deptName: '', orgId: '' });
                } else {
                    this.roleLinkUser.splice((index + 1), 0, { userId: '', userName: '', roleId: item.roleId, roleName: item.roleName, initDataStr: '', deptName: '', orgId: '' });
                }
            },
            restData() {
                // let keyArr = Object.keys(this.tableData.roleLinkUser);
                let keyArr = [];
                this.roleLinkUser = [];
                let obj = {};
                this.tableData.links.forEach((item, index) => {
                    obj[item.roleId] = item.roleName;
                    keyArr.push(item.roleId);
                });
                keyArr.forEach((key, index) => {
                    if (_self.tableData.roleLinkUser[key]) {
                        _self.tableData.roleLinkUser[key].forEach((item2, index2) => {
                            var data = { userId: item2.userId, userName: item2.userName, roleId: item2.roleId, roleName: obj[item2.roleId], initDataStr: '', deptName: '', orgId: '' }
                            if (item2.userId) {
                                getUserInfoByOrgId(item2.userId).then(res => {
                                    data.initDataStr = `{"type":"PERSONNEL","orgId":"${res.departments[0].id}.${res.id}","linkId":"${res.id}"}`
                                    data.deptName = res.departments[0].orgPathDeptList ? res.departments[0].orgPathDeptList[res.departments[0].orgPathDeptList.length - 1].i18nText : '';
                                    data.orgId = res.emId
                                })
                            }
                            _self.roleLinkUser.push(data);
                        })
                    } else {
                        _self.roleLinkUser.push({ userId: '', userName: '', roleId: key, roleName: obj[key], initDataStr: '', deptName: '', orgId: '' });
                    }
                })
            },
            selectRoleUser(data, index) {
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    this.roleLinkUser[index].deptName = '';
                    this.roleLinkUser[index].orgId = '';
                    this.roleLinkUser[index].initDataStr = '';
                    this.roleLinkUser[index].userId = '';
                    this.roleLinkUser[index].userName = '';

                } else {
                    let linkId = data.itemArray[0].linkId;
                    getUserInfoByOrgId(linkId).then(res => {
                        this.roleLinkUser[index].deptName = res.departments[0].orgPathDeptList ? res.departments[0].orgPathDeptList[res.departments[0].orgPathDeptList.length - 1].i18nText : '';
                        this.roleLinkUser[index].orgId = res.emId;
                    })
                    this.roleLinkUser[index].initDataStr = data.id;
                    this.roleLinkUser[index].userId = linkId;
                    this.roleLinkUser[index].userName = data.name;
                }
            },
            initData() {
                this.loading = true;
                getGroupInfo(this.id).then(res => {
                    this.tableData = res;
                    console.log(res, 'data');
                    this.restData(res);
                    this.loading = false;
                })

                getGroupRole(this.id, this.$route.params.infoId).then(res => {
                    this.roleEdit = res.flag;
                })

            },
            saveCase() {
                let isFirstNull;
                let links = [];
                let roleLinkUser = {};
                this.tableData.links.forEach((item, index) => {
                    links.push({ roleId: item.roleId });
                })
                this.roleLinkUser.forEach((item, index) => {
                    if (roleLinkUser[item.roleId]) {
                        if (item.userId && item.userName) {
                            roleLinkUser[item.roleId].push({ userId: item.userId, userName: item.userName });
                        } else if (isFirstNull) {
                            isFirstNull = false;
                            roleLinkUser[item.roleId].push({ userId: item.userId, userName: item.userName });
                        }
                    } else {
                        //每个角色都有一次 添加空行机会
                        isFirstNull = true;
                        if (item.userId && item.userName) {
                            roleLinkUser[item.roleId] = [{ userId: item.userId, userName: item.userName }];
                        } else if (isFirstNull) {
                            isFirstNull = false;
                            roleLinkUser[item.roleId] = [{ userId: item.userId, userName: item.userName }];
                        }
                    }

                })
                //判断是否已经关联人员后 有空行
                for (var key in roleLinkUser) {
                    var len = roleLinkUser[key].length;
                    if (len !== 1) {
                        for (var i = (len - 1); i >= 0; i--) {
                            var v1 = roleLinkUser[key][i].userId;
                            var v2 = roleLinkUser[key][i].userName;
                            if (!v1 && !v2) {
                                roleLinkUser[key].splice(i, 1);
                            }
                        }
                    }
                }
                //过滤重复行信息
                for (var key in roleLinkUser) {
                    var len = roleLinkUser[key].length;
                    if (len !== 1) {
                        for (var i = (len - 1); i >= 1; i--) {
                            var v1 = roleLinkUser[key][i].userId;
                            var v2 = roleLinkUser[key][i].userName;
                            for (var j = (i - 1); j >= 0; j--) {
                                var v3 = roleLinkUser[key][j].userId;
                                var v4 = roleLinkUser[key][j].userName;
                                if (v1 === v3 && v2 === v2) {
                                    roleLinkUser[key].splice(i, 1);
                                    break;
                                }
                            }
                        }
                    }
                }
                // console.log(roleLinkUser);
                let params = {
                    id: this.tableData.id,
                    type: this.tableData.type,
                    name: this.tableData.name,
                    links,
                    roleLinkUser
                }
                saveGroupLinkUser(params).then(res => {
                    this.initData();
                })
            }
        }, watch: {
            $route: {
                handler(n) {
                    this.projectInfo = window.projectCardVue.projectInfo
                    this.id = this.$route.params.id;
                    this.initData();
                },
                deep: true
            }
        }
    }
</script>
<style scoped>
    .listMain {
        position: relative;
        height: 100%;
    }

    .listMain .content-box {
        background: #fff;
        position: relative;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .listMain table {
        width: 80%;
        min-width: 800px;
        border: 1px solid;
        border-collapse: collapse;
        border-spacing: 0;
        table-layout: fixed;
        font-size: 14px;
        margin: 30px auto;
    }

    .listMain table tr {
        height: 50px;
        line-height: 1.5;
    }

    .listMain table th,
    .listMain table td {
        text-align: center;
    }

    .listMain table thead tr:first-of-type {
        background: #f0f0f0;
    }

    .listMain table th {
        border: 1px solid #e8e8e8;
        color: #0f1419 !important;
    }

    .listMain table td {
        background: #fafafa;
        border: 1px solid #e8e8e8;
        word-break: break-all;
        color: #666;
    }

    .listMain .addUser {
        border: 1px solid;
        border-radius: 3px;
        background: #003b90;
        color: #fff;
        padding: 0 4px;
        cursor: pointer;
    }
</style>
