<template>
    <div class="proMember">
            <div  class="toolbar">
                <el-row>
                    <el-col :span="12">
                        <eco-tool-title style="line-height: 34px;" title="历史记录"></eco-tool-title>
                    </el-col>
                    <el-col :span="12" style="text-align:right">
                         <el-button type="primary" @click="goBack">返回</el-button>
                    </el-col>
                </el-row>
            </div>

            <eco-content top="60px" bottom="42px" style="padding:0px 15px;">
                        <el-table
                            :data="memberList"
                            highlight-current-row
                            stripe
                            class="styleTableDefault"
                            style="width: 100%"
                            size="mini"
                            height="100%"
                            ref="multipleTable"
                            @selection-change="changeFun"
                        >

                        <el-table-column
                            align="center"
                            type="index"
                            label="序号"
                            width="60"
                        >
                        </el-table-column>

                        <el-table-column
                                    prop="deptId"
                                    show-overflow-tooltip
                                    label="部门"
                                    align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.dept}}</span>
                                </template>
                        </el-table-column>

                        <el-table-column
                                    prop="profession"
                                    show-overflow-tooltip
                                    label="专业名称"
                                    align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.profession}}</span>
                                </template>
                        </el-table-column>

                        <el-table-column
                                    prop="professionDesignerId"
                                    show-overflow-tooltip
                                    label="专业设计师"
                                     align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.professionDesigner}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="professionLeaderId"
                                    show-overflow-tooltip
                                    label="专业负责人"
                                     align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.professionLeader}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="deptContactUserId"
                                    show-overflow-tooltip
                                    label="联络人"
                                     align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.deptContactUser}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="type"
                                show-overflow-tooltip
                                label="类别"
                                align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.type}}</span>
                                </template>
                            </el-table-column>

                           
                    </el-table>
            </eco-content>


            <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
                <el-row >
                    <el-col :span="24" style="text-align:right">
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="params.page"
                            :page-sizes="[10,30,50,100]"
                            :page-size="params.rows"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="params.total" style="margin-right:20px">
                            </el-pagination>
                    </el-col>
                </el-row>
        </eco-content>


    </div>
    
</template>
<script>

import {getProMemberHistoryList} from '../../service/service'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {mapState,mapActions } from 'vuex';
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'

 

  export default {
      components:{
          ecoContent,
         
          ecoToolTitle
      },
      data(){
          return{
              params:{
                    projectId:null,
                    page:1,
                    rows:10,
                    sort:'createDate',
                    order:'asc',
                    total:null,
              },
              memberList:[],
              multipleSelection:[],
              typeOptions:[]
          }
      },
      
      created(){
            this.params.projectId = this.$route.params.proId;
            this.typeOptions.push({text:'部门',id:'dept'});
            this.typeOptions.push({text:'法规',id:'regulation'});
            this.getProMemberHistoryListFunc();
      },

      mounted(){
         
      },
      computed:{
            ...mapState(['baseData'])
      },
      methods: {
       
        getProMemberHistoryListFunc(){
            getProMemberHistoryList(this.params).then((response)=>{
                this.memberList = response.data.rows;
                this.params.total = response.data.total;
            })
        },

        goBack(){
             this.$router.push({name:'proMember'});
        },

        //每页条数
        handleSizeChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.params.rows = val;
            this.params.page = 1;
            this.getProMemberHistoryListFunc();
        },

        //跳转页码
        handleCurrentChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.params.page = val;
            this.getProMemberHistoryListFunc();
        },

        changeFun(rows) {
           this.multipleSelection = rows;
        },

        getKVName(list,typeId){
            let _name = null;
            if(list && list.length > 0){
                for(let i = 0;i<list.length;i++){
                    if(list[i].id == typeId){
                        _name = list[i].text;
                        break;
                    }
                }
            }
            return _name;
        },
        
      }
  }
</script>

<style scoped>

.proMember{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}

.proMember .toolbar{
    margin-top: 10px;
    margin-bottom:10px;
}

.proMember .toolbar .title{
    font-size: 14px;
    border-left:5px solid red;
    padding-left:5px;
}

.proMember .editSpan{
    cursor: pointer;
    color:#409eff;
}








</style>
