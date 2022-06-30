<template>
    <div class="roomList">
          <eco-content bottom="42px" top="0px" ref="content" style="padding:15px;">
              <el-table
                    ref="multipleTable"
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    class="flowlist boldThClass"
                    height="100%"
                    stripe
                    @sort-change="sortTablefunc"
                >
                   <el-table-column
                      label="序号"
                      align="center"
                      width="60">
                       <template slot-scope="scope">
                        {{(params.page - 1) * params.rows + scope.$index + 1}}
                      </template>
                    </el-table-column>

                  <el-table-column
                        prop="name"
                        label="会议室名称"
                        align="center"
                        sortable='custom'
                        show-overflow-tooltip
                      >
                      <template slot-scope="scope">
                        {{scope.row.name}}
                      </template>
                  </el-table-column>

                  <el-table-column
                        prop="building"
                        label="位置"
                        width='150'
                        align="center"
                      >
                      <template slot-scope="scope">
                        {{scope.row.building}}
                      </template>
                  </el-table-column>

                   <el-table-column
                          prop="intention"
                          label="用途"
                          width='150'
                          align="center"
                      >
                      <template slot-scope="scope">
                        {{scope.row.intention}}
                      </template>
                  </el-table-column>

                   <el-table-column
                          prop="desc"
                          label="描述"
                          width='150'
                          align="center"
                          show-overflow-tooltip
                      >
                      <template slot-scope="scope">
                        {{scope.row.desc}}
                      </template>
                  </el-table-column>


                   <el-table-column
                          prop="comments"
                          label="备注"
                          width='200'
                          align="center"
                      >
                      <template slot-scope="scope">
                         {{scope.row.comments}}
                      </template>
                  </el-table-column>

                   
                   <el-table-column
                          label="操作"
                          width='100'
                          align="center"
                      >
                      <template slot-scope="scope">
                            <span @click="selectItem(scope.row)" class="alink ">可预约</span>
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
import {getRoomAvaiableSelectListAjax} from '../../service/service.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {rows,sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default {
     components:{
          ecoContent,
          ecoToolTitle,
     }, 
     data(){
         return{
            searchShow:true,
            dataList:[],
            params:{
                filterAvailable:true,
                catId4Available:'CONFERENCE',
                startTime4Available:null,
                endTime4Available:null,
                editId4Available:false,
                name:null,
                page:1,
                rows:rows,
                sort:'createDate',
                order:'desc',
                total:0
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
        this.params.startTime4Available = this.$route.params.startTime4Available;
        this.params.endTime4Available = this.$route.params.endTime4Available;
        this.params.editId4Available = this.$route.params.editId4Available == 1?true:false;
        this.getListFunc();
    },
    mounted(){
    
    },
    methods: {
        getListFunc(){
              getRoomAvaiableSelectListAjax(this.params).then((response)=>{
                  this.dataList = response.data.rows;
                  this.params.total = response.data.total;
              })
        },

        selectItem(item){
                let doObj = {}
                doObj.action = 'roomAvaiableSelectCB';
                doObj.data = {};
                doObj.data.roomName = item.name;
                doObj.data.roomId = item.id;
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
        },

        showAdvSearchDiv(){
              this.searchShow = !this.searchShow;
        },

        searchListFunc(){
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.params.page = 1;
              this.getListFunc();
        },

        refreshFunc(){
                this.params.name = null;
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
       }
    }

 }


</script>
<style>

  .roomList .searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #f5f5f5 ;
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
</style>
