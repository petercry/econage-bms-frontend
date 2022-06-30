<template>
    <div  style="margin:0px 20px;" class="baInfo">
      <eco-content top="0px" bottom="0px">
        <el-row style="padding:6px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="16" >
            <eco-tool-title style="line-height: 34px;" :title="baName"></eco-tool-title>
            <el-tag
              :key="tag.id"
              v-for="(tag, i) in selectedBaTags"
              class="infoTagForView"
            >
              {{ tag.text }}
            </el-tag>
          </el-col>
          <el-col :span="8" style="text-align:right;padding-top:2px;">
            <el-button type="warning" class="btn"  size="mini"  @click.native="editBa" v-if="isAdminRole"><i class="fa fa-pencil-square-o fa-lg" ></i> 编辑客户</el-button>
            <el-button type="warning" class="btn"  size="mini"  @click.native="addEvent" v-if="isAdminRole"><i class="fa fa-plus-square-o fa-lg" ></i> 添加动态</el-button>
            <el-dropdown v-if="isAdminRole">
              <el-button size="mini" class="dropDownBtn">...</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="addContact"><i class="fa fa-user-o  fa-lg" ></i>添加联系人</el-dropdown-item>
                <el-dropdown-item  @click.native="addFile"><i class="fa fa-file-o  fa-lg" ></i>上传文档</el-dropdown-item>
                <el-dropdown-item  @click.native="addTeamMember"><i class="fa fa-user-secret  fa-lg" ></i>添加团队成员</el-dropdown-item>
                <el-dropdown-item  @click.native="deleteBa" v-if="opRoleList['deleteCustomer'].flag"><i class="fa fa-trash-o fa-lg" ></i>删除客户</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <div class="topTipDiv">
          <div class="topTipNodeDiv">
            <span class="topTipTitle">最后联系时间</span>
            <div class="topTipContent">{{baInfoObj.lastContactTime}}</div>
          </div>
          <div class="topTipNodeDiv">
            <span class="topTipTitle">下次联系时间</span>
            <div class="topTipContent" style="font-weight:bold;">{{baInfoObj.nextContactTime}}</div>
          </div>
          <div class="topTipNodeDiv">
            <span class="topTipTitle">商机时间</span>
            <div class="topTipContent" >{{formatDateToMinute(baInfoObj.bizOppoTime)}}</div>
          </div>
        </div>
        <div style="width:calc(100% - 40px);margin:2px 20px 0px 20px;">
          <template v-for="(nodeEl,key,i) in briefInfo" >
            <div :key="i" :style="{'width':(nodeEl.isWholeRow ? '100%' : '49%')}" class="detRowDiv devDiv">
              <div class="devTitleDiv" :style="{'width':(nodeEl.isWholeRow ? '10%' : '20%')}"><span class="titleSpan" >{{nodeEl.desc}}</span></div>
              <div class="devInfoDiv" :style="{'width':(nodeEl.isWholeRow ? '87%' : '77%')}">
                <span class="infoSpan" v-if="nodeEl.kvGroupDesc!=''">{{getEnumText(baInfoObj[nodeEl.paramName],nodeEl.kvGroupDesc)}}</span>
                <span class="infoSpan" v-else>{{baInfoObj[nodeEl.paramName]}}</span>
              </div>
            </div>
          </template>
        </div>
         <el-row  style="padding:10px 10px 0px 10px;height: calc(100% - 263px);">
             <el-col :span="24" >
                 <el-tabs v-model="focusPanelName" @tab-click="setTabPanel">
                    <el-tab-pane label="详细信息" name="detailInfo">
                      <div style="width:calc(100% - 60px);padding:0px 30px;">
                        <template v-for="(nodeEl,key,i) in detInfo" >
                          <div :key="i" :style="{'width':(nodeEl.isWholeRow ? '100%' : '49%')}" class="detRowDiv devDiv">
                            <div class="devTitleDiv" :style="{'width':(nodeEl.isWholeRow ? '10%' : '20%')}"><span class="titleSpan" >{{nodeEl.desc}}</span></div>
                            <div class="devInfoDiv" :style="{'width':(nodeEl.isWholeRow ? '87%' : '77%')}">
                              <span class="infoSpan" v-if="nodeEl.kvGroupDesc!=''">{{getEnumText(baInfoObj[nodeEl.paramName],nodeEl.kvGroupDesc)}}</span>
                              <span class="infoSpan" v-else-if="nodeEl.paramName=='address'">
                                <span v-if="getAreaDesc()!=''">{{getAreaDesc()}}<br></span>
                                {{baInfoObj[nodeEl.paramName]}}
                              </span>
                              <span class="infoSpan" v-else>{{baInfoObj[nodeEl.paramName]}}</span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'跟进动态 ('+(this.baEventListArray==null?0:this.baEventListArray.length)+')'" name="eventInfo">
                        <div style="padding:2px 20px;">
                          {{noEventInfoToShow}}
                          <el-timeline v-if="eventDataMounted">
                              <el-timeline-item v-for="(item,index) in baEventListArray" :key="index" v-bind:timestamp="formatDateToMinute(item.actionDate)" placement="top">
                                  <el-card>
                                      <h4>{{item.subject}}</h4>
                                      <h4>{{item.comments}}</h4>
                                      <div v-if="item.dataJournalId!=null&&item.extContent!=null">
                                        <el-popover placement="top" width="800" trigger="click" popper-class="wfViewPop" >
                                          <wfViewFromAf :jsonStr="item.extContent"  ></wfViewFromAf>
                                          <el-button class="eventRelatedWfBtn" type="text" slot="reference">关联流程</el-button>
                                        </el-popover>
                                      </div>
                                      <div v-for="(fileNode , fileNodeIdx) in item.checkEventFileList" :key="fileNodeIdx" ><i class="el-icon-paperclip"></i> {{fileNode.name}}<el-button type="text" @click.native="doFilePreviewAction(fileNode)" v-if="_isPreviewFile(fileNode.fileType)" class="fileBtn" >预览</el-button><el-button type="text" @click.native="doFileDownloadAction(fileNode)" class="fileBtn" >下载</el-button></div>
                                      <el-row >
                                        <el-col :span="4" ><span class="eventTitleSpan" >事件时间：</span></el-col>
                                        <el-col :span="6" ><span class="tinyInfoSpan" >{{formatDateToMinute(item.actionDate)}}</span></el-col>
                                        <el-col :span="3" ><span class="eventTitleSpan" >联系方式：</span></el-col>
                                        <el-col :span="11" ><span class="tinyInfoSpan">{{getEnumText(item.typeId,"baEventType")}}</span></el-col>
                                      </el-row>
                                      <el-row >
                                        <el-col :span="4" ><span class="eventTitleSpan" >客户方联系人：</span></el-col>
                                        <el-col :span="6" ><span class="tinyInfoSpan">{{item.contactPerson}}</span></el-col>
                                        <el-col :span="3" ><span class="eventTitleSpan" >经办人：</span></el-col>
                                        <el-col :span="11"><span class="tinyInfoSpan">{{item.actionUser}}</span></el-col>
                                      </el-row>
                                      <el-row v-if="item.nextContactDate!=null && item.nextContactDate!=''">
                                        <el-col :span="4" ><span class="eventTitleSpan" >下次联系时间：</span></el-col>
                                        <el-col :span="20" ><span class="tinyInfoSpan">{{item.nextContactDate}}</span></el-col>
                                      </el-row>
                                      <el-row v-if="item.nextPlan!=null && item.nextPlan!=''">
                                        <el-col :span="4" ><span class="eventTitleSpan" >下一步计划：</span></el-col>
                                        <el-col :span="20" ><span class="tinyInfoSpan">{{item.nextPlan}}</span></el-col>
                                      </el-row>
                                      <p class="eventTinyTip">{{item.senderName}} 录入于 {{formatDateToMinute(item.createDate)}}</p>
                                      <div class="eventBtn" style="position:absolute;right:10px;bottom:10px;" v-if="isAdminRole&&checkEventBtnByDate(item.createDate)">
                                        <el-button type="primary" icon="el-icon-edit" circle @click.native="editEvent(item.id)"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" circle @click.native="deleteEvent(item.id)"></el-button>
                                      </div>
                                  </el-card>
                              </el-timeline-item>
                          </el-timeline>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'联系人 (' + (this.baContactListArray==null?0:this.baContactListArray.length) + ')'" name="contactor">
                      <div class="rtBtnDiv" v-if="isAdminRole"><el-button type="warning" icon="el-icon-plus" size="mini" circle @click.native="addContact"></el-button></div>
                      <div style="padding:35px 15px;">
                        {{noContactInfoToShow}}
                        <el-card class="box-card contactCard" v-for="(item,index) in baContactListArray" :key="index" style="margin-bottom:10px;">
                          <div slot="header" class="clearfix">
                            <span>
                              <i v-if="item.sex=='w'" class="fa fa-female fa-lg female_icon" title="女"></i>
                              <i v-else-if="item.sex=='m'" class="fa fa-male fa-lg male_icon" title="男"></i>
                              <i v-else class="fa fa-question-circle-o fa-lg unknown_icon" title="性别未知"></i>
                              &nbsp;{{item.name}}
                            </span>
                            <el-button style="float: right; padding: 3px 0;color:red;margin-left:5px;" type="text" v-if="isAdminRole" @click.native="deleteContact(item.id)">删除</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" v-if="isAdminRole" @click.native="editContact(item.id)">修改</el-button>
                          </div>
                          <el-row class="infoCardRow">
                            <el-col :span="3"  v-if="item.valueCode!=null"><span class="eventTitleSpan">价值：</span></el-col>
                            <el-col :span="9"  v-if="item.valueCode!=null"><span class="tinyInfoSpan" >{{getEnumText(item.valueCode,"baContactValueCode")}}</span></el-col>
                            <el-col :span="3" v-if="item.title!=null"><span class="eventTitleSpan">职务：</span></el-col>
                            <el-col :span="9" v-if="item.title!=null"><span class="tinyInfoSpan" >{{item.title}}</span></el-col>
                          </el-row>
                          <el-row class="infoCardRow">
                            <el-col :span="3" v-if="item.workPhone!=null"><span class="eventTitleSpan">工作电话：</span></el-col>
                            <el-col :span="9" v-if="item.workPhone!=null"><span class="tinyInfoSpan" >{{item.workPhone}}</span></el-col>
                            <el-col :span="3" v-if="item.mobilePhone!=null"><span class="eventTitleSpan" >移动电话：</span></el-col>
                            <el-col :span="9" v-if="item.mobilePhone!=null"><span class="tinyInfoSpan" >{{item.mobilePhone}}</span></el-col>
                          </el-row>
                          <el-row class="infoCardRow" v-if="item.email!=null">
                            <el-col :span="3"><span class="eventTitleSpan">电子邮件：</span></el-col>
                            <el-col :span="21" ><span class="tinyInfoSpan" >{{item.email}}</span></el-col>
                          </el-row>
                          <el-row class="infoCardRow" v-if="item.workAddr!=null">
                            <el-col :span="3"><span class="eventTitleSpan">工作地址：</span></el-col>
                            <el-col :span="21"><span class="tinyInfoSpan" >{{item.workAddr}}</span></el-col>
                          </el-row>
                          <el-row class="infoCardRow"  v-if="item.homeAddr!=null">
                            <el-col :span="3"><span class="eventTitleSpan">家庭地址：</span></el-col>
                            <el-col :span="21"><span class="tinyInfoSpan" >{{item.homeAddr}}</span></el-col>
                          </el-row>
                          <el-row class="infoCardRow" v-if="item.comments!=null">
                            <el-col :span="3"><span class="eventTitleSpan">备注：</span></el-col>
                            <el-col :span="21"><span class="tinyInfoSpan" >{{item.comments}}</span></el-col>
                          </el-row>
                          <p class="eventTinyTip">{{item.createUserName}} 录入于 {{formatDateToMinute(item.createDate)}}</p>
                        </el-card>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="财务相关" name="fin" v-if="opRoleList['customerFinAdmin'].flag">
                      <div style="padding:2px 40px;">
                        <el-card class="box-card detCard" style="margin-top:10px;">
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >成本支出记录 ( 当前合计{{expenseSum}}元 ) </span>
                          </div>
                          <div style="width:100%;padding:0px 0px;" ref="baExpenseListDiv">
                            <el-table class="tableInTab" :data="baExpenseList"  stripe style="width: 100%;" height="300" v-if="expenseDataMounted && baExpenseList!=null && baExpenseList.length > 0" size="mini">
                              <el-table-column v-for="(colEl,index) in expenseTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                  <div v-if="colEl.paramName=='op'">
                                    <el-popover placement="top" width="800" trigger="click" v-if="isAdminRole&&(scope.row.funcFlag==1||scope.row.funcFlag==2||scope.row.funcFlag==3||scope.row.funcFlag==4)" >
                                      <div v-html="handleDataJournalExtContent(scope.row.extContent)">
                                      </div>
                                      <el-button class="infoTableBtn" type="text" slot="reference">查看详情</el-button>
                                    </el-popover>
                                    <el-popover placement="top" width="800" trigger="click" v-else-if="isAdminRole" popper-class="wfViewPop" >
                                      <wfViewFromAf :jsonStr="scope.row.extContent"  ></wfViewFromAf>
                                      <el-button class="infoTableBtn" type="text" slot="reference">查看详情</el-button>
                                    </el-popover>
                                  </div>
                                  <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-pagination v-if="expenseDataMounted && baExpenseList!=null && baExpenseList.length > 0"
                              layout="total,prev, pager, next"
                              @current-change="handleExpenseListPageChange"
                              :current-page.sync="expenseListPaginationInfo.page"
                              :page-size="expenseListPaginationInfo.rows"
                              :total="expenseListPaginationInfo.total">
                            </el-pagination>
                          </div>
                        </el-card>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'关联数据 ('+ (this.relatedDataList==null?0:this.relatedDataListPaginationInfo.total) + ')'" name="relatedData" >
                      <div style="padding:2px 40px;">
                        <el-card class="box-card detCard" style="margin-top:10px;" >
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >关联流程数据</span>
                          </div>
                          <div style="border-bottom:1px solid #dee2e6;padding:0px 0px 5px 0px;" >
                              <el-select v-model="relatedDataFuncFlagStr" style="width:250px;font-size:14px;" size="mini" filterable @change="getRelatedDataListFunc">
                                <el-option label="全部" value="ALL"></el-option>
                                <el-option
                                  v-for="rItem in relatedDataFuncFlagWfForBa"
                                  :key="rItem.id"
                                  :label="rItem.desc"
                                  :value="rItem.id">
                                </el-option>
                              </el-select>
                          </div>
                          <div style="width:100%;padding:0px 0px;" ref="relatedDataListDiv" >
                            {{noRelatedDataInfoToShow}}
                            <el-table class="tableInTab" :data="relatedDataList"  stripe style="width: 100%;" height="600" v-if="relatedDataListDataMounted && relatedDataList!=null && relatedDataList.length > 0" size="mini">
                              <el-table-column v-for="(colEl,index) in relatedDataTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                  <div v-if="colEl.paramName=='op'">
                                    <el-popover placement="top" width="800" trigger="click" v-if="isAdminRole" popper-class="wfViewPop" >
                                      <wfViewFromAf :jsonStr="scope.row.extContent"  ></wfViewFromAf>
                                      <el-button class="infoTableBtn" type="text" slot="reference">查看详情</el-button>
                                    </el-popover>
                                  </div>
                                  <div v-if="colEl.paramName=='dataText'">
                                    <div v-html="scope.row.dataText">
                                    </div>
                                  </div>
                                  <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-pagination v-if="relatedDataListDataMounted && relatedDataList!=null && relatedDataList.length > 0"
                              layout="total,prev, pager, next"
                              @current-change="handleRelatedDataListPageChange"
                              :current-page.sync="relatedDataListPaginationInfo.page"
                              :page-size="relatedDataListPaginationInfo.rows"
                              :total="relatedDataListPaginationInfo.total">
                            </el-pagination>
                          </div>
                        </el-card>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'相关文档 (' + (this.baFileList==null?0:this.baFileList.length) + ')'" name="file">
                      <div style="padding:0px 15px;">
                        {{noFileInfoToShow}}
                        <el-table :data="baFileList"  stripe style="width: 100%" v-if="baFileList!=null && baFileList.length > 0" class="detTable" size="mini">
                          <el-table-column v-for="(colEl,index) in fileTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                            <template slot-scope="scope"  >
                              <div v-if="colEl.paramName=='op'">
                                <el-button type="text" @click.native="doFilePreviewAction(scope.row)" v-if="_isPreviewFile(scope.row.fileType)" class="fileBtn" >预览</el-button>
                                <span v-else style="padding-left:31px;">&nbsp;</span>
                                <el-button type="text" @click.native="doFileDownloadAction(scope.row)" class="fileBtn" >下载</el-button>
                                <el-button type="text" @click.native="deleteFile(scope.row.id , scope.row.name)" style="color:red;" class="fileBtn" v-if="isAdminRole">删除</el-button>
                              </div>
                              <div v-else>
                                {{scope.row[colEl.paramName]}}
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'团队成员 (' + (this.baTeamList==null?0:this.baTeamList.length) + ')'" name="team">
                      <div style="padding:0px 15px;">
                        {{noTeamInfoToShow}}
                        <el-table :data="baTeamList"  stripe style="width: 100%" :default-sort = "{prop: 'createDate', order: 'descending'}" v-if="baTeamList!=null && baTeamList.length > 0" size="mini">
                          <el-table-column v-for="(colEl,index) in teamMemberTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth" :sortable="colEl.isSortable">
                            <template slot-scope="scope"  >
                              <div v-if="colEl.paramName=='op'">
                                <el-button type="text" @click.native="deleteMember(scope.row.id , scope.row.memberName)" style="color:red;" v-if="isAdminRole">删除</el-button>
                              </div>
                              <div v-else>
                                {{scope.row[colEl.paramName]}}
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-tab-pane>
                </el-tabs>
             </el-col>
         </el-row>
      </eco-content>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="false" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
        <editBa v-show="dialogTab=='editBa'" ref="editBaWin"></editBa>
        <addEvent v-show="dialogTab=='addEvent'" ref="addEventWin"></addEvent>
        <addContact v-show="dialogTab=='addContact'" ref="addContactWin"></addContact>
        <editEvent v-show="dialogTab=='editEvent'" ref="editEventWin"></editEvent>
        <editContact v-show="dialogTab=='editContact'" ref="editContactWin"></editContact>
        <ecoFileUploadPopup v-show="dialogTab=='addFile'" modular="bmsBa" :modularInnerId="this.baId" ref="addFileWin"></ecoFileUploadPopup>
        <addTeamMember v-show="dialogTab=='addTeamMember'" ref="addTeamMemberWin"></addTeamMember>
        <div slot="footer" class="dialog-footer" v-if="dialogTab!='addFile'">
          <el-button @click.native="dialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click.native="dialogSave()" size="mini">保 存</el-button>
        </div>
        <div slot="footer" class="dialog-footer" v-else>
          <el-button @click.native="dialogVisible = false" size="mini">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import {doFilePreviewAction,doFileDownloadAction,getDataJournalList,formatDateToDay,handleDataJournalExtContent,relatedDataFuncFlagWfForBa,getTagOption,getDataJournalSumByNoFinalRelatedProjectJustBa,getDataJournalListByNoFinalRelatedProjectIdJustBa} from "@/modules/bmsMmm/util/utility.js";
import {baseUrl,ecoPubAuthToken} from '@/modules/bmsMmm/config/env';
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import { getBaDetail,getBaEventList,getBaContactList,getEnumText,deleteBaAjax,openLoading,closeLoading,deleteBaEventAjax,deleteBaContactAjax,getBaFileList,formatFileSize,deleteFileDataServer,getBaTeamMemberList,getRoleDescByKey,deleteTeamMemberAjax,_isPreviewFile,getEventFileList } from "@/modules/bmsBa/service/service.js";
import { initOpRoleList } from "@/modules/bmsMmm/service/service.js";
import {mapMutations} from 'vuex';
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { DetShowEl } from "@/modules/bmsBa/util/DetShowEl.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import editBa from "@/modules/bmsBa/views/editBa.vue";
import addEvent from "@/modules/bmsBa/views/addEvent.vue";
import addContact from "@/modules/bmsBa/views/addContact.vue";
import editEvent from "@/modules/bmsBa/views/editEvent.vue";
import editContact from "@/modules/bmsBa/views/editContact.vue";
import ecoFileUploadPopup from '@/modules/bmsMmm/component/ecoFileUploadPopup.vue';
import addTeamMember from "@/modules/bmsBa/views/addTeamMember.vue";
import wfViewFromAf from "@/modules/bmsMmm/util/wfViewFromAf.vue";
export default{
  name:'',
  components:{
    ecoContent,
    ecoToolTitle,
    editBa,
    addEvent,
    addContact,
    editEvent,
    editContact,
    ecoFileUploadPopup,
    addTeamMember,
    wfViewFromAf
  },
  data(){
    return {
      tokenNameInStore: "eco-auth-token",
      loading:true,
      baInfoObj:{},
      baId:'',
      baName:'',
      focusPanelName:'',
      dialogTitle:'',
      dialogTab:'',
      dialogVisible:false,
      baEventListArray:[],
      baContactListArray:[],
      baFileList:[],
      baTeamList:[],
      baEventPaginationInfo: {
        //sort: "order_seq_",
        //order: "desc",
        page: 1,
        rows: 1000,
        total: 0
      },
      baContactPaginationInfo: {
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 1000,
        total: 0
      },
      noEventInfoToShow:'',
      noContactInfoToShow:'',
      noRelatedDataInfoToShow:'',
      noFileInfoToShow:'',
      noTeamInfoToShow:'',
      noInfoMsg:'　暂无数据 ...',
      kvInfo:new KvGroup(),
      briefInfo:new DetShowEl()
        .add("客户名称","baName",'',true)
        .add("协作要求","relationCode",'relationCode',false)
        .add("来源","sourceCode",'sourceCode',false)
        .add("数据状态","firstStatus",'firstStatus',false)
        .add("规模","scaleCode",'scaleCode',false)
        .add("排名","posCode",'posCode',false)
        .add("价值","valueCode",'valueCode',false)
        .add("行业","industryCode",'industryCode',false)
        .add("当前阶段","currentPhase",'currentPhase',false)
        .add("产品方向","productDirectionStr",'',false)
        .add("项目预算(万元)","projectBudget",'',false)
        .add("预期定标时间","expectTenderTime",'',false),

        //.add("所在城市","city",'',false)
      detInfo:new DetShowEl()
        .add("简称","shortName",'',false)
        .add("销售额(亿)","revenue",'',false)
        .add("员工人数","numOfEmp",'',false)
        .add("所有制","ownershipCode",'ownershipCode',false)
        .add("目前软件","currentSoftware",'',false)
        .add("网址","webUrl",'',false)
        .add("地址","address",'',true)
        .add("联系人状态","contactsStatus",'contactsStatus',false)
        .add("联系人","clientContactPerson",'',false)
        .add("电话","phoneNo",'',false)
        .add("传真","faxNo",'',false)
        .add("电子邮件","emailAddr",'',true)
        .add("开户银行","bankName",'',false)
        .add("帐号","bankAccount",'',false)
        .add("税号","taxId",'',false)
        .add("备注","comments",'',true)
        .add("竞争情况","competitiveSituation",'',true),
       /**
       * @param {string} desc  描述
       * @param {string} paramName  属性名
       * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
       * @param {boolean} isWholeRow  是否占满整行，为“否”则默认两个元素一行
       */
      focusEventId:'',
      focusContactId:'',
      fileTableColEl: new TableColEl()
        .add("文档名称","name",'300','',false,false,false)
        .add("大小","size",'100',"",false,false,false)
        .add("上传人","createUserName",'80',"",false,false,false)
        .add("上传时间","createDate",'180',"",false,false,false)
        .add("操作","op",'150',"",false,false,false),
/*
     * @param {string} desc  描述
     * @param {string} paramName  值
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
*/
      teamMemberTableColEl: new TableColEl()
        .add("姓名","memberName",'300','',false,false,false)
        .add("团队角色","key",'100',"",false,false,true)
        .add("录入人","createUserName",'80',"",false,false,false)
        .add("录入时间","createDate",'140',"",false,false,true)
        .add("操作","op",'150',"",false,false,false),
      eventDataMounted :  false,
      relatedDataList:[],
      relatedDataListDataMounted : false,
      relatedDataTableColEl: new TableColEl()
        .add("经办时间","createDate",'140','',false,false,false)
        .add("经办人","createUserDesc",'80',"",false,false,false)
        .add("相关流程","sourceDesc",'170',"",false,false,false)
        .add("数据内容","dataText",'450',"",false,false,false)
        .add("操作","op",'90',"",false,false,false),
      relatedDataListPaginationInfo: {
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      relatedDataFuncFlagStr:"ALL",
      relatedDataFuncFlagWfForBa,
      expenseSum:'',
      baExpenseList:[],
      expenseDataMounted : false,
      expenseTableColEl: new TableColEl()
        .add("时间","createDate",'100','',false,false,false)
        .add("经办人","createUserDesc",'130',"",false,false,false)
        .add("开支原因","sourceDesc",'170',"",false,false,false)
        .add("金额","dataNumber",'80',"",false,false,false)
        .add("操作","op",'90',"",false,false,false),
      expenseListPaginationInfo: {
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      opRoleList:null,
      myUserId:'',
      isAdminInThisCustomer:false,
      dynamicTags: [], //多选标签
      selectedBaTags: [],
      TAG_GROUP_ID: "BMS_BA_TAG"
    }
  },
  created(){
    this.initOpRoleList();
    this.kvInfo = this.$parent.$parent.kvInfo;
  },
  mounted(){
    this.baId = this.$route.query.ba_id;
    this.focusPanelName = 'eventInfo';
    this.getBaInfo(this.baId);
  },
  methods: {
    isAdminRole(){
      return this.opRoleList['customerAdmin'].flag||this.isAdminInThisCustomer;
    },
    async initDynamicTags(){
      this.dynamicTags = await getTagOption(this.TAG_GROUP_ID);
    },
    getBaInfo(baId){
      this.$parent.$parent.openLoading();
      this.initDynamicTags();
      this.eventDataMounted = false;
      this.baId = baId;
      console.log("getBaInfo baId:" + baId);
      getBaDetail(baId).then((response)=>{
        if (response.data&&response.data.id){
            this.baInfoObj = response.data;
            this.baName = response.data.baName;
            console.log("getBaInfo baName:" + response.data.baName);
            if(this.baInfoObj.expectTenderTime!=null && this.baInfoObj.expectTenderTime!='' && this.baInfoObj.expectTenderTime.length == 10){
              this.baInfoObj.expectTenderTime = this.baInfoObj.expectTenderTime.substring(0,7);
            }
            this.selectedBaTags = [];
            for(let i = 0; i< this.baInfoObj.baTag.length; i++) {
              for(let j = 0; j< this.dynamicTags.length; j++) {
                if(this.baInfoObj.baTag[i].tagKeyId == this.dynamicTags[j].id) {
                  let tagobj = {};
                  tagobj.text = this.dynamicTags[j].name;
                  tagobj.id = this.dynamicTags[j].id;
                  this.selectedBaTags.push(tagobj);
                }
              }
            }
            console.log("111");
            this.getBaEventListFunc();
            this.getBaContactListFunc();
            this.getExpenseSum();
            this.getExpenseListFunc();
            this.getBaFileListFunc();
            this.getBaTeamMemberListFunc();
            this.getRelatedDataListFunc();

        }
      }).catch((error)=>{
         this.$parent.$parent.closeLoading();
      });
    },
    getAreaDesc(){
      let areaDesc = '';
      if(this.baInfoObj.stateAreaDesc!=null&&this.baInfoObj.stateAreaDesc!=''){
        areaDesc = this.baInfoObj.stateAreaDesc;
      }else{
        if(this.baInfoObj.state!=null&&this.baInfoObj.state!=''){
          if(areaDesc=='')areaDesc=this.baInfoObj.state;
          else areaDesc += "/"+this.baInfoObj.state;
        }
        if(this.baInfoObj.city!=null&&this.baInfoObj.city!=''){
          if(areaDesc=='')areaDesc=this.baInfoObj.city;
          else areaDesc += "/"+this.baInfoObj.city;
        }
      }
      return areaDesc;
    },
    formatDateToMinute(time_str){
        if(typeof time_str=="undefined") return "";
        if(time_str == null) return "";
        var return_str = time_str;
        if(return_str.length==19&&return_str.indexOf(":")>0){
            return_str = return_str.substring(0,return_str.lastIndexOf(":"));
        }
        return return_str;
    },
    async getBaEventListFunc() {
      this.$parent.$parent.openLoading();
      this.eventDataMounted = false;
      this.noEventInfoToShow='';
      await getBaEventList(this.baId , this.baEventPaginationInfo).then(response => {
            this.baEventListArray = response.data.rows;
            //console.log("#####this.baEventListArray:" + this.baEventListArray);
            if(this.baEventListArray.length==0){
              this.noEventInfoToShow=this.noInfoMsg;
            }
            this.$parent.$parent.closeLoading();
        })
        .catch(error => {
            this.$parent.$parent.closeLoading();
        });
        //console.log("@@@this.baEventListArray.length:"+this.baEventListArray.length);
        //以下取文件暂时关闭，太慢了
        /*
        if(this.baEventListArray!=null&&this.baEventListArray.length>0){
          for(let i in this.baEventListArray){
            this.baEventListArray[i].checkEventFileList = await this.getEventFileListFunc(this.baEventListArray[i].id);
            //console.log("@@@this.baEventListArray[i].checkEventFileList.length:"+this.baEventListArray[i].checkEventFileList.length);
          }
          this.$forceUpdate();
        }*/
        this.eventDataMounted = true;
    },
    getBaContactListFunc(){
      this.$parent.$parent.openLoading();
      this.noContactInfoToShow='';
      getBaContactList(this.baId , this.baContactPaginationInfo).then(response => {
            this.baContactListArray = response.data.rows;
            if(this.baContactListArray.length==0){
              this.noContactInfoToShow=this.noInfoMsg;
            }
            this.$parent.$parent.closeLoading();
        })
        .catch(error => {
            this.$parent.$parent.closeLoading();
        });
    },
    cleanInfo(){
        this.baName='';
        this.baInfoObj={};
        this.baEventListArray=null;
        this.baContactListArray=null;
        this.baFileList=null;
        this.relatedDataList=null;
        this.baEventPaginationInfo.page = 1;
        this.baContactPaginationInfo.page = 1;
        this.relatedDataListPaginationInfo.page = 1;
        this.expenseListPaginationInfo.page = 1;
    },
    setTabPanel(){
      //console.log("trigger setTabPanel:"+this.focusPanelName);
      if(this.focusPanelName == 'eventInfo'){
        this.$parent.$parent.closeLoading();
        this.getBaEventListFunc();
      }else if(this.focusPanelName == 'contactor'){
        this.$parent.$parent.closeLoading();
        this.getBaContactListFunc();
      }else if(this.focusPanelName == 'fin'){
        this.$parent.$parent.closeLoading();
        this.getExpenseSum();
        this.getExpenseListFunc();
      }else if(this.focusPanelName == 'relatedData'){
        this.$parent.$parent.closeLoading();
        this.getRelatedDataListFunc();
      }else if(this.focusPanelName == 'file'){
        this.$parent.$parent.closeLoading();
        this.getBaFileListFunc();
      }else if(this.focusPanelName == 'team'){
        this.$parent.$parent.closeLoading();
        this.getBaTeamMemberListFunc();
      }
    },
    editBa(){
      this.dialogTitle="编辑客户信息";
      this.dialogTab = 'editBa';
      this.dialogVisible = true;
      //console.log("##########typeof this.$refs.editBaWin:"+typeof this.$refs.editBaWin  );
      if(typeof this.$refs.editBaWin=="undefined"){
      }else{
        //console.log("##########have editBaWin!!!!"  );
        this.$refs.editBaWin.getBaInfo(this.baId);
      }

    },
    deleteBa(){
      this.$confirm('确定要删除客户“'+this.baName+'”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBaAjax(this.baId).then((res)=>{
          //console.log("submit  done!!");
          this.$message({type: 'success',message: '删除成功！'});
          this.$parent.$parent.trivialDialogVisible = false;
          this.$parent.$parent.hideDialog();
          this.$parent.$parent.getBaListFunc();
        }).catch((error)=>{
          this.$parent.$parent.closeLoading();
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    addEvent(){
      this.dialogTitle="添加动态";
      this.dialogTab = 'addEvent';
      this.dialogVisible = true;
    },
    editEvent(eventId){
      this.focusEventId = eventId;
      this.dialogTitle="修改动态";
      this.dialogTab = 'editEvent';
      this.dialogVisible = true;
      //console.log("this.$refs.editEventWin:"+this.$refs.editEventWin);
      if(typeof this.$refs.editEventWin=="undefined"){
      }else{
        this.$refs.editEventWin.getEventInfo(this.focusEventId);
      }
    },
    deleteEvent(eventId){
      //console.log("delete eventId:"+eventId);
      this.$confirm('确定要删除此条动态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBaEventAjax(eventId).then((res)=>{
          //console.log("submit  done!!");
          this.$message({type: 'success',message: '删除成功！'});
          this.focusPanelName = "eventInfo";
          this.setTabPanel();
        }).catch((error)=>{
          this.$parent.$parent.closeLoading();
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    addContact(){
      this.dialogTitle="添加联系人";
      this.dialogTab = 'addContact';
      this.dialogVisible = true;
    },
    editContact(contactId){
      this.focusContactId = contactId;
      this.dialogTitle="修改联系人";
      this.dialogTab = 'editContact';
      this.dialogVisible = true;
      if(typeof this.$refs.editContactWin=="undefined"){
      }else{
        this.$refs.editContactWin.getContactInfo(this.focusContactId);
      }
    },
    deleteContact(contactId){
      //console.log("delete contactId:"+contactId);
      this.$confirm('确定要删除此联系人吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBaContactAjax(contactId).then((res)=>{
          //console.log("submit  done!!");
          this.$message({type: 'success',message: '删除成功！'});
          this.focusPanelName = "contactor";
          this.setTabPanel();
        }).catch((error)=>{
          this.$parent.$parent.closeLoading();
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    addFile(){
      this.dialogTitle="上传文档";
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    getBaFileListFunc(){
      this.$parent.$parent.openLoading();
      this.noFileInfoToShow='';
      getBaFileList(this.baId ).then(response => {
            this.baFileList = response.data;
            let tmp_baFileList = [];
            for (let i in this.baFileList) {
              let checkNode = this.baFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_baFileList.unshift(checkNode);
            }
            this.baFileList = tmp_baFileList;
            if(this.baFileList.length==0){
              this.noFileInfoToShow=this.noInfoMsg;
            }
            this.$parent.$parent.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.$parent.$parent.closeLoading();
        });
    },
    deleteFile(fileId,fileName){
      this.$confirm('确定要删除文档“'+fileName+'”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("fileId"+fileId);
        deleteFileDataServer(fileId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.focusPanelName = "file";
          this.setTabPanel();
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    dialogSave(){
      if(this.dialogTab == 'editBa'){
        this.$refs.editBaWin.save();
      }else if(this.dialogTab == 'addEvent'){
        this.$refs.addEventWin.save();
      }else if(this.dialogTab == 'addContact'){
        this.$refs.addContactWin.save();
      }else if(this.dialogTab == 'editEvent'){
        this.$refs.editEventWin.save();
      }else if(this.dialogTab == 'editContact'){
        this.$refs.editContactWin.save();
      }else if(this.dialogTab == 'addTeamMember'){
        this.$refs.addTeamMemberWin.save();
      }
    },
    cleanDialog(){
      if(typeof this.$refs.addEventWin!="undefined"){
        this.$refs.addEventWin.cleanInfo();
        this.$refs.addEventWin.setBaId(this.baId);
      }
      if(typeof this.$refs.addContactWin!="undefined"){
        this.$refs.addContactWin.cleanInfo();
        this.$refs.addContactWin.setBaId(this.baId);
      }
      if(typeof this.$refs.editEventWin!="undefined"){
        this.$refs.editEventWin.cleanInfo();
        this.$refs.editEventWin.setBaId(this.baId);
        this.$refs.editEventWin.getEventInfo(this.focusEventId);
      }
      if(typeof this.$refs.editContactWin!="undefined"){
        this.$refs.editContactWin.cleanInfo();
        this.$refs.editContactWin.setBaId(this.baId);
      }
      if(typeof this.$refs.addTeamMemberWin!="undefined"){
        this.$refs.addTeamMemberWin.cleanInfo();
        this.$refs.addTeamMemberWin.setBaId(this.baId);
      }
    },
    checkEventBtnByDate(checkCreateDate){
      //console.log("checkCreateDate:"+checkCreateDate);
      let s1 = new Date(checkCreateDate.replace(/-/g, '/'));
      let ms = new Date() - s1.getTime()
      ms = ms / 1000 / 60 / 60;
      //console.log("ms:"+ms);
      if(ms < 24 ) return true;
      else return false;
    },
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
    addTeamMember(){
      this.dialogTitle="添加团队成员";
      this.dialogTab = 'addTeamMember';
      this.dialogVisible = true;
    },
    async getBaTeamMemberListFunc(){
      this.$parent.$parent.openLoading();
      this.noTeamInfoToShow='';
      if(!this.opRoleList['customerAdmin'].flag){         //当前用户没有客户模块全管理权限，则要判断其对当前客户是否有管理权限
        await axios.get(baseUrl+'/bms/public/myUserInfo',{
          params:{
            time:new Date().getTime()
          }
        }).then(response => {
          let userData = response.data;
          this.myUserId = userData.id;
        }).catch(error => {
            dealException(error);
        });
      }
      await getBaTeamMemberList(this.baId ).then(response => {
            this.baTeamList = response.data.rows;
            for (let i in this.baTeamList) {
              let checkNode = this.baTeamList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.key = getRoleDescByKey(checkNode.key);
              if(!this.opRoleList['customerAdmin'].flag){    //当前用户没有客户模块全管理权限，则要判断其对当前客户是否有管理权限
                if(checkNode.linkId = this.myUserId && (checkNode.key == 'owner' || checkNode.key == 'collabrator' || checkNode.key == 'flowup')){
                  this.isAdminInThisCustomer = true;
                }
              }
            }
            if(this.baTeamList.length==0){
              this.noTeamInfoToShow=this.noInfoMsg;
            }
            this.$parent.$parent.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.$parent.$parent.closeLoading();
        });
    },
    deleteMember(memberId,memberName){
      this.$confirm('确定要删除团队成员“'+memberName+'”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("memberId:"+memberId);
        deleteTeamMemberAjax(memberId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.focusPanelName = "team";
          this.setTabPanel();
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    async getEventFileListFunc(checkEventId){
      let checkEventFileList = [];
      console.log("#####checkEventId:" + checkEventId);
      await getEventFileList(checkEventId).then(response => {
            checkEventFileList = response.data;
            let tmp_eventFileList = [];

            for (let i in checkEventFileList) {
              let checkNode = checkEventFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_eventFileList.unshift(checkNode);
            }
            checkEventFileList = tmp_eventFileList;
        }).catch(error => {
          console.log("error:"+error);
        });
        return checkEventFileList;
    },
    async getRelatedDataListFunc(){
      this.relatedDataListDataMounted = false;
      this.noRelatedDataInfoToShow='';
      let checkFuncFlag = this.relatedDataFuncFlagStr;
      if(checkFuncFlag == "ALL"){
        checkFuncFlag = "21,22,52,23,46,25,29,31,38,40,41,43,8,9,10,11,54";
      }
      await getDataJournalList(this.relatedDataListPaginationInfo ,'ba' , this.baId , checkFuncFlag ).then(response => {
          this.relatedDataList = response.data.rows;
          if(this.relatedDataList.length==0){
            this.noRelatedDataInfoToShow=this.noInfoMsg;
          }
          this.relatedDataListPaginationInfo.total = response.data.total;
          //console.log("this.projectPaymentList.length:"+this.projectPaymentList.length);
      }).catch(error => {
        console.log("error:"+error);
      });
      if(this.relatedDataList!=null&&this.relatedDataList.length>0){
        for(let i in this.relatedDataList){
          this.relatedDataList[i].createDate = this.formatDateToMinute(this.relatedDataList[i].createDate);
          let extContent = this.relatedDataList[i].dataText;
          extContent = extContent.replace(/\r\n/g,"<br>");
          extContent = extContent.replace(/\n/g,"<br>");
          this.relatedDataList[i].dataText = extContent;
          //console.log("checkEventFileList.length:"+this.projectPaymentList[i].checkEventFileList.length);
        }
        this.relatedDataListDataMounted = true;
      }
    },
    handleRelatedDataListPageChange(val) {
        //this.$refs.projectExpenseListDiv.setScollTop(0);
        this.relatedDataListPaginationInfo.page = val;
        this.getRelatedDataListFunc();
    },
    isAdminRole(){
      return true;
    },

    getExpenseSum(){
      getDataJournalSumByNoFinalRelatedProjectJustBa( this.baId , '3,4,32,34,35,45,48').then((response)=>{
        this.expenseSum = response.data;
      }).catch((error)=>{
        console.log("error:" + error);
      });
    },
    async getExpenseListFunc(){
      this.expenseDataMounted = false;
      await getDataJournalListByNoFinalRelatedProjectIdJustBa(this.expenseListPaginationInfo , this.baId , '3,4,32,34,35,45,48' ).then(response => {
          this.baExpenseList = response.data.rows;
          this.expenseListPaginationInfo.total = response.data.total;
          //console.log("this.projectPaymentList.length:"+this.projectPaymentList.length);
      }).catch(error => {
        console.log("error:"+error);
      });
      if(this.baExpenseList!=null&&this.baExpenseList.length>0){
        for(let i in this.baExpenseList){
          this.baExpenseList[i].createDate = formatDateToDay(this.baExpenseList[i].createDate);
          //console.log("checkEventFileList.length:"+this.projectPaymentList[i].checkEventFileList.length);
        }
        this.expenseDataMounted = true;
      }
    },
    handleExpenseListPageChange(val) {
        //this.$refs.projectExpenseListDiv.setScollTop(0);
        this.expenseListPaginationInfo.page = val;
        this.getExpenseListFunc();
    },
    getEnumText,
    openLoading,
    closeLoading,
    handleDataJournalExtContent,
    initOpRoleList
  },
  watch: {

  }
}
</script>

