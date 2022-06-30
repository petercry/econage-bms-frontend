<template>
    <div class="layoutOutDiv meetingList">
      <div class="layoutInnerAbsoluteDiv">

          <eco-content top="0px" height="60px" type="tool">
              <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="8" >
                        <eco-tool-title style="line-height: 34px;" :title="'会议室预约（'+params.total+'）'"></eco-tool-title>
                    </el-col>
                    <el-col :span="16" style="text-align:right">
                        <el-button @click="showAdvSearchDiv">复合查询</el-button>
                        <el-button @click="goAddPage" v-if="btnRoleMap['oa.conference_CREATE_Conference']" type="primary">添加</el-button>
                  </el-col>
              </el-row>
          </eco-content>


          <eco-content top="59px" v-show="this.searchShow">
              <div class="searchBox">
                    <span>&nbsp;&nbsp;&nbsp;会议名称：</span>
                    <div class="itemInput">
                        <el-input  @keyup.enter.native="searchListFunc" v-model="params.name"></el-input>
                    </div>
                    <span>开始日期：</span>
                        <el-date-picker
                            v-model="params.startDateFrom"
                            type="date"
                            value-format="yyyy-MM-dd"
                            style="width:140px"
                            placeholder="选择日期时间">
                        </el-date-picker>
                            -
                        <el-date-picker
                            v-model="params.startDateTo"
                            type="date"
                            value-format="yyyy-MM-dd"
                            style="width:140px"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    <br/>

                        <span>会议室名称：</span>
                        <div class="itemInput">
                            <el-input  @keyup.enter.native="searchListFunc" v-model="params.roomName"></el-input>
                        </div>
                        <span >结束日期：</span>
                        <el-date-picker
                            v-model="params.endDateFrom"
                            type="date"
                            value-format="yyyy-MM-dd"
                            style="width:140px"
                            placeholder="选择日期时间">
                        </el-date-picker>
                                -
                        <el-date-picker
                            v-model="params.endDateTo"
                            type="date"
                            value-format="yyyy-MM-dd"
                            style="width:140px"
                            placeholder="选择日期时间">
                        </el-date-picker>

                        <el-button @click="refreshFunc" style="margin-left:20px;">重置</el-button>
                        <el-button @click="searchListFunc" type="primary">搜索</el-button>
              </div>

          </eco-content>

          <eco-content bottom="42px" :top="getContentTop1" ref="content" style="padding:15px;">
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
                        label="会议名称"
                        align="center"
                        sortable='custom'
                        show-overflow-tooltip
                        :sort-orders="['ascending', 'descending']"
                      >
                        <template slot-scope="scope">
                            {{scope.row.name}}
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="startTime"
                        label="开始时间"
                        width='150'
                        align="center"
                        sortable='custom'
                        :sort-orders="['ascending', 'descending']"
                      >
                        <template slot-scope="scope">
                            {{scope.row.startTime}}
                        </template>
                  </el-table-column>

                    <el-table-column
                          prop="endTime"
                          label="结束时间"
                          width='150'
                          align="center"
                          sortable='custom'
                          :sort-orders="['ascending', 'descending']"
                      >
                      <template slot-scope="scope">
                        {{scope.row.endTime}}
                      </template>
                  </el-table-column>

                   <el-table-column
                          prop="roomName"
                          label="会议地点"
                          width='140'
                          align="center"
                          show-overflow-tooltip
                           sortable='custom'
                          :sort-orders="['ascending', 'descending']"
                      >
                      <template slot-scope="scope">
                        {{scope.row.roomName}}
                      </template>
                  </el-table-column>

                   <el-table-column
                          prop="desc"
                          label="会议内容"
                          width='150'
                          align="center"
                      >
                      <template slot-scope="scope">
                         {{scope.row.desc}}
                      </template>
                  </el-table-column>

                   <el-table-column
                          prop="ownerName"
                          label="预约人"
                          width='90'
                          align="center"
                          sortable='custom'
                          :sort-orders="['ascending', 'descending']"
                      >
                      <template slot-scope="scope">
                         {{scope.row.ownerName}}
                      </template>
                  </el-table-column>

                  <el-table-column
                          prop="phoneNumber"
                          label="工作电话"
                          width='110'
                          align="center"
                      >
                      <template slot-scope="scope">
                         {{scope.row.phoneNumber}}
                      </template>
                  </el-table-column>

                   <!-- <el-table-column
                          prop="createDate"
                          label="创建日期"
                          width='170'
                          align="center"
                          sortable='custom'
                          show-overflow-tooltip
                      >
                      <template slot-scope="scope">
                        {{scope.row.createDate}}
                      </template>
                  </el-table-column> -->

                   <el-table-column
                          label="操作"
                          width='100'
                          align="center"
                          v-if="(btnRoleMap['oa.conference_DELETE_Conference']|| btnRoleMap['oa.conference_UPDATE_Conference'])"
                      >
                      <template slot-scope="scope">
                            <span @click="editItem(scope.row.id)" class="alink" v-if="btnRoleMap['oa.conference_UPDATE_Conference']">编辑</span>
                            <span v-if="(btnRoleMap['oa.conference_DELETE_Conference'] &&  btnRoleMap['oa.conference_UPDATE_Conference'])">&nbsp;|&nbsp;</span>
                            <span @click="deleteItem(scope.row.id)" class="delLink" v-if="btnRoleMap['oa.conference_DELETE_Conference']">删除</span>
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
import {getMeetingOrderAjax,deleteMeetingAjax,getRoleBtnSetting} from '../../service/service.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {rows,sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoDate} from '@/components/date/main.js'

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
                name:null,
                roomName:null,
                ownerName:null,
                startDateFrom:null,
                startDateTo:null,
                endDateFrom:null,
                endDateTo:null,
         
                page:1,
                rows:rows,
                sort:'createDate',
                order:'desc',
                total:0
            },
        
            btnRoleMap:{}
         }
     },

     computed:{
          getContentTop1:function(){
                if(this.searchShow){
                    return '171px';
                }else{
                    return '59px';
                }
          }
    },
    created(){
        this.getListFunc();
        this.getRoleBtnSetting();
        this.listAction();
        window.roomListVm = this;
    },
    mounted(){
    
    },
    methods: {

        listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'updateMeetingAddBack'){
                        window.roomListVm.onActionCallBack(obj.data);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'roomListVm');
        },

        onActionCallBack(){
            this.getListFunc();
        },


        getRoleBtnSetting(){
              const btn_array = ['oa.conference_VIEW_Conference',
                'oa.conference_CREATE_Conference',
                'oa.conference_UPDATE_Conference',
                'oa.conference_DELETE_Conference'
              ];
              getRoleBtnSetting(btn_array).then((res)=>{
                    if(res.data){
                        this.btnRoleMap = res.data.authenticationMap;
                    }
              })
        },

        getListFunc(){
              let _params = EcoUtil.objDeepCopy(this.params);
              if(_params.startDateTo){
                  try{
                      _params.startDateTo = EcoDate.formatDateDefault( new Date (new Date( EcoDate.convertDateFromString(_params.startDateTo) ).getTime() + 24*60*60*1000));
                  }catch(e){
                      console.log(e);
                  }
              }
              if(_params.endDateTo){
                  try{
                       _params.endDateTo = EcoDate.formatDateDefault( new Date( new Date( EcoDate.convertDateFromString(_params.endDateTo) ).getTime() + 24*60*60*1000 ));
                  }catch(e){
                       console.log(e);
                  }
              }
              getMeetingOrderAjax(_params).then((response)=>{
                  this.dataList = response.data.rows;
                  this.params.total = response.data.total;
              })
        },

        goAddPage(){
            if(sysEnv == 1){
                let url = '/meeting/index.html#/meetingAdd/'+EcoUtil.getUID();
                EcoUtil.getSysvm().openDialog('会议新增',url,900,550,'8vh');
            }else{
                this.$router.push({name:'meetingAdd',params:{storeKey:EcoUtil.getUID()}});
            }
        },

        editItem(id){
            if(sysEnv == 1){
                    let url = '/meeting/index.html#/meetingEdit/'+id;
                    EcoUtil.getSysvm().openDialog('会议修改',url,900,550,'8vh');
            }else{
                    this.$router.push({name:'meetingEdit',params:{id:id}});
            }
        },

        deleteItem(id){
              let that  = this;
              let confirmYesFunc = function(){
                  let _ids = [];
                  _ids.push(id);
                  deleteMeetingAjax(_ids).then((response)=>{
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
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.params.page = 1;
              this.getListFunc();
          },

          refreshFunc(){
                this.params.name = null;
                this.params.roomName = null;

                this.params.startDateFrom = null;
                this.params.startDateTo = null;
                this.params.endDateFrom = null;
                this.params.endDateTo = null;
              
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

  .meetingList .searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #fafafa ;
      border-bottom: 1px solid #ddd;
      height:101px;
      overflow-y:hidden;
  }

 .meetingList .itemInput{
      display: inline-block;
      width: 120px;
      margin-right: 10px;
  }

  .meetingList .alink{
    cursor: pointer;
    color: #409eff;
  }

 .meetingList .delLink{
    cursor: pointer;
    color: red;
  }

  
</style>
