<template>
    <div class="layoutOutDiv roomList">
      <div class="layoutInnerAbsoluteDiv">

          <eco-content top="0px" height="60px" type="tool">
              <el-row style="padding:12px 10px;background-color:#fff;">
                    
                    <el-col :span="8" >
                        <eco-tool-title style="line-height: 34px;" :title="'项目列表（'+params.total+'）'"></eco-tool-title>
                    </el-col>

                    <el-col :span="16" style="text-align:right">
                        <el-button @click="showAdvSearchDiv" >复合查询</el-button>
                        <el-button @click="goAddPage" v-if="isManageRole" type="primary">添加</el-button>                       
                        <el-button v-if="false">批量删除</el-button>
                  </el-col>
              </el-row>
          </eco-content>


          <eco-content top="59px" v-show="this.searchShow">
              <div class="searchBox">
                    <span>建设业态：</span>
                    <el-select
                        style="width:150px"
                        v-model="searchParams.business"
                        placeholder="请选择"
                        clearable
                        size="mini"
                        @change="searchListFunc"
                    >
                        <el-option
                                    v-for="(item,index) in kvMap['crp_business']"
                                    :key="index"
                                    :label="item.text"
                                    :value="item.id"
                        >
                        </el-option>
                  </el-select>
                   &nbsp;&nbsp;

                  <span>项目编号：</span>
                  <div class="itemInput">
                      <el-input   v-model="searchParams.code" @keyup.enter.native="searchListFunc"></el-input>
                  </div>

                  <span>项目名称：</span>
                  <div class="itemInput">
                      <el-input   v-model="searchParams.name" @keyup.enter.native="searchListFunc"></el-input>
                  </div>

                  <el-button @click="refreshFunc">重置</el-button>
                  <el-button @click="searchListFunc" type="primary">搜索</el-button>
              </div>

          </eco-content>

          <eco-content bottom="42px" :top="getContentTop1" ref="content" style="padding:15px;">
              <el-table
                    ref="multipleTable"
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    class="styleTableDefault boldThClass"
                    height="100%"
                    stripe
                    @sort-change="sortTablefunc"
                >

                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="50">
                    </el-table-column>

                  <el-table-column
                        prop="business"
                        label="建设业态"
                        align="center"
                        show-overflow-tooltip
                        sortable='custom'
                        :sort-orders="['ascending', 'descending']"
                      >
                      <template slot-scope="scope">
                            {{getKVName(scope.row.business,'crp_business')}}
                      </template>
                  </el-table-column>

                  <el-table-column
                          prop="code"
                          label="项目编号"
                          align="center"
                          sortable='custom'
                        :sort-orders="['ascending', 'descending']"
                      >
                        <template slot-scope="scope">
                            {{scope.row.code}}
                        </template>
                  </el-table-column>

                   <el-table-column
                          prop="name"
                          label="项目名称"
                          align="center"
                          sortable='custom'
                         :sort-orders="['ascending', 'descending']"
                      >
                        <template slot-scope="scope">
                            {{scope.row.name}}
                        </template>
                  </el-table-column>

                   <el-table-column
                          prop="createUser"
                          label="创建人"
                          width='100'
                          align="center"
                          show-overflow-tooltip
                      >
                      <template slot-scope="scope">
                         {{scope.row.createUserName}}
                      </template>
                  </el-table-column>

                   <el-table-column
                          prop="createDate"
                          label="创建日期"
                          width='180'
                          align="center"
                          sortable='custom'
                          show-overflow-tooltip
                      >
                      <template slot-scope="scope">
                        {{scope.row.createDate}}
                      </template>
                  </el-table-column>

                   <el-table-column
                          label="操作"
                          width='100'
                          align="center"
                          v-if="isManageRole"
                      >
                      <template slot-scope="scope">
                        <span @click="editItem(scope.row.id)" class="alink ">编辑</span>&nbsp;|&nbsp;
                        <span @click="deleteItem(scope.row.id)" class="delLink">删除</span>
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
  </div>
</template>
<script>
import {getProList,delPro} from '../../service/service.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {rows,sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {EcoKVUtil} from '@/components/util/kv.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default {
     components:{
          ecoContent,
          ecoToolTitle,
     }, 
     data(){
         return{
            searchShow:false,
            dataList:[],
            params:{
                business:null,
                code:null,
                name:null,
                page:1,
                rows:rows,
                sort:'createDate',
                order:'desc',
                total:0
            },
            searchParams:{
                code:null,
                name:null
            },
            isManageRole:true,
            kvMap:{
                crp_business:[] //建设业态
            }
         }
     },

     computed:{
          getContentTop1:function(){
            if(this.searchShow){
                return '110px';
            }else{
                return '59px';
            }
          }
    },
    created(){
        EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);
        this.getListFunc();
        this.listAction();
        window.modelNodeVm = this;
    },
    mounted(){
    
    },
    methods: {

        listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'upProAddBack'){
                        window.modelNodeVm.onActionCallBack(obj.data);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'modelNodeVm');
        },

        onActionCallBack(){
            this.getListFunc();
        },

        getKVName(id,array){
            let _idArray = null;
            if(id instanceof Array){
                _idArray = id;
            }else{
                _idArray = [];
                _idArray.push(id);
            }
            return EcoKVUtil.getCategoryNameMutile(this.kvMap[array],_idArray,'id','text');
        },
       

        getListFunc(){
              getProList(this.params).then((response)=>{
                  this.dataList = response.data.rows;
                  this.params.total = response.data.total;
              })
        },

        goAddPage(){
            if(sysEnv == 1){
                let url = '/project/index.html#/proAdd';
                EcoUtil.getSysvm().openDialog('新增项目',url,900,500,'8vh');
            }else{
                this.$router.push({name:'proAdd'});
            }
        },

        editItem(id){
               if(sysEnv == 1){
                  let url = '/project/index.html#/proEdit/'+id;
                  EcoUtil.getSysvm().openDialog('编辑项目',url,900,500,'8vh');
              }else{
                  this.$router.push({name:'proEdit',params:{id:id}});
              }
        },

          deleteItem(id){
              let that  = this;
              let confirmYesFunc = function(){
                  delPro(id).then((response)=>{
                      that.$message({
                              showClose: true,
                              message:'删除成功',
                              type: 'success',
                              duration:2000
                          });
                          that.getListFunc();
                  })
              }
              let options = { type:'warning',lockScroll:false}
              EcoMessageBox.confirm('确认删除？','提示',options,confirmYesFunc);
          },

          showAdvSearchDiv(){
              this.searchShow = !this.searchShow;
          },

          searchListFunc(){
              this.params.code = this.searchParams.code;
              this.params.name = this.searchParams.name;
              this.params.business = this.searchParams.business;

              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.params.page = 1;
              this.getListFunc();
          },

          refreshFunc(){
                this.params.name = null;
       
                this.params.createDateTo = null;
                this.params.rows = rows;
                this.params.page = 1;
                this.searchListFunc();
               
          },

          //每页条数
          handleSizeChange(val) {
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.params.rows = val;
              this.params.page = 1;
              this.getListFunc();
         },

        //跳转页码
        handleCurrentChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.params.page = val;
            this.getListFunc();
        },

        //表格排序
       sortTablefunc(column,prop,order){
          if(column.prop && column.order){
              this.params.sort = column.prop;
              if(column.order == 'ascending'){
                  this.params.order = 'asc'
              }else if(column.order == 'descending'){
                  this.params.order = 'desc'
              }
          }
          this.$refs.multipleTable.bodyWrapper.scrollTop =0;
          this.getListFunc();
       },

      
    
      
    }


 }


</script>
<style>
  .roomList .searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #fafafa ;
      border-bottom: 1px solid #ddd;
      height:101px;
      overflow-y:auto;
  }

 .roomList .itemInput{
      display: inline-block;
      width: 120px;
      margin-right: 10px;
  }

  .roomList .alink{
    cursor: pointer;
    color: #409eff;
  }

  .roomList .delLink{
    cursor: pointer;
    color: red;
  }
</style>
