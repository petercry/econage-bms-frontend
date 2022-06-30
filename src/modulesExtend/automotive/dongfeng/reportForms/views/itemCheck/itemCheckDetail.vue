<template>
<div class="itemCheckDetail">
    <el-table :data="itemList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable">
        <el-table-column prop="stripe" label="条文号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="" label="J0" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j0Compliance" label="符合性" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="info.j0File" label="支撑材料" align="center" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j0File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J1" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j1Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j1File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j1File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J2" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j2Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j2File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j2File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J3" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j3Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j3File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j3File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J4" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j4Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j4File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j4File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J5" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j5Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j5File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j5File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J6" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j6Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j6File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j6File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J7" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j7Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j7File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j7File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="J8" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.j8Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.j8File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.j8File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="p0" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.p0Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.p0File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.p0File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="p1" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.p1Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.p1File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.p1File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="p2" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.p2Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.p2File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.p2File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="p3" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.p3Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.p3File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.p3File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="" label="p4" align="center" :show-overflow-tooltip="true">
            <el-table-column prop="info.p4Compliance" label="符合性" align="center"></el-table-column>
            <el-table-column prop="info.p4File" label="支撑材料" align="center" width="200">
                <template slot-scope="scope">
                    <el-link v-for="item in scope.row.info.p4File" :key="item.id" type="primary" @click="getFile(item)">
                        {{item.name}}
                    </el-link>
                </template>
            </el-table-column>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import { getItemDetailList } from '../../api/report';
import { EcoFile } from '@/components/file/main.js'
export default {
    data() {
        return {
            itemList: []
            // itemList: {
            //     : '',
            //     info: []
            // }
        }
    },
    props: {
        projectId: {
            type: String
        },
        profession: {
            type: String
        },
        regulationCode: {
            type: String
        },
    },
    created() {
        // console.log(this.$route.params)
        this.getItemDetailList()
    },
    methods: {
        getItemDetailList() {
            getItemDetailList(this.projectId, this.profession, this.regulationCode).then(res => {
                console.log(res)
                let arr = []
                for (let key in res) {
                    arr.push({ 'stripe': key, 'info': res[key] })
                }
                this.itemList = arr
                console.log(this.itemList)
            })
        },
        getFile(item) {
            // console.log(item)
            EcoFile.openFileHeaderByView(item.id, item.name);
        }
    }
}
</script>

<style lang="less" scoped>
.itemCheckDetail {
    width: 100%;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;

    /deep/ .el-table th {
        font-weight: 600;
        background: #f5f7fa;
    }

    /deep/ .el-table--border:after,
    /deep/ .el-table--group:after,
    /deep/ .el-table:before {
        background-color: #f5f7fa;
    }

    /deep/ .el-table--border,
    /deep/ .el-table--group {
        border-color: #f5f7fa;
    }

    /deep/ .el-table--border {
        border: 1px solid #ebeef5;
    }

    /deep/ .el-table td,
    /deep/ .el-table th.is-center {
        border-bottom: 1px solid #ebeef5;
        color: #4f334f;
        font-size: 12px;
    }

    /deep/ .el-table--border th,
    /deep/ .el-table--border th.gutter:last-of-type {
        border-bottom: 1px solid #ebeef5;
    }

    /deep/ .el-table--border td,
    /deep/ .el-table--border th {
        border-right: 1px solid #ebeef5;
    }
}
</style>
