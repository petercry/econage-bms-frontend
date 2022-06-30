<template>
    <div  style="margin:0px 20px;" class="projectInfo">
      <eco-content top="0px" bottom="0px">
        <el-row style="padding:5px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="16" >
            <eco-tool-title style="line-height: 30px;" :title="projectName"></eco-tool-title>
            <el-tooltip class="item" effect="dark" content="活跃项目" placement="right" v-if="projectInfoObj.activeFlag">
              <i class="el-icon-star-on starOnSpan"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="非活跃项目" placement="right" v-if="!projectInfoObj.activeFlag">
              <i class="el-icon-star-off starOffSpan"></i>
            </el-tooltip>
          </el-col>
          <el-col :span="8" style="text-align:right;padding-top:2px;">
            <el-button type="warning" class="btn"  size="mini"  @click.native="editProject" v-if="isAdminRole"><i class="fa fa-pencil-square-o fa-lg" ></i> 编辑项目</el-button>
            <el-button type="warning" class="btn"  size="mini"  @click.native="addCommonEvent" v-if="isAdminRole"><i class="fa fa-plus-square-o fa-lg" ></i> 添加动态</el-button>
            <el-dropdown v-if="isAdminRole">
              <el-button size="mini" class="dropDownBtn" >...</el-button>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item  @click.native="addPayment" ><i class="fa fa-cny  fa-lg" ></i>添加收付款记录</el-dropdown-item>
                <el-dropdown-item  @click.native="addFile" ><i class="fa fa-file-o  fa-lg" ></i>上传文档</el-dropdown-item>
                <el-dropdown-item  @click.native="addProjectTeamMember"><i class="fa fa-user-secret  fa-lg" ></i>添加团队成员</el-dropdown-item>
                <el-dropdown-item  @click.native="deleteProject" v-if="opRoleList['deleteProject'].flag"><i class="fa fa-trash-o fa-lg" ></i>删除项目</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <div class="topTipDiv">
          <div class="topTipNodeDiv">
            <span class="topTipTitle">项目合同总额</span>
            <div class="topTipContent">{{projectInfoObj.contractAmt==null||projectInfoObj.contractAmt==''?'0':projectInfoObj.contractAmt}}</div>
          </div>
          <div class="topTipNodeDiv">
            <span class="topTipTitle">已收款金额</span>
            <div class="topTipContent" >{{projectInfoObj.receivedPaymtAmt==null||projectInfoObj.receivedPaymtAmt==''?'0':projectInfoObj.receivedPaymtAmt}}</div>
          </div>
          <div class="topTipNodeDiv">
            <span class="topTipTitle">待回款金额</span>
            <div class="topTipContent" style="font-weight:bold;">{{projectInfoObj.restPaymtAmt==null||projectInfoObj.restPaymtAmt==''?'0':projectInfoObj.restPaymtAmt}}</div>
          </div>
          <div class="topTipNodeDiv">
            <span class="topTipTitle">已耗费成本(含税)</span>
            <div class="topTipContent" >{{parseFloat(this.expenseSum+this.projectInfoObj.taxSum).toFixed(2)}}</div>
          </div>
        </div>
        <div style="width:calc(100% - 40px);margin:2px 20px 0px 20px;">
          <template v-for="(nodeEl,key,i) in briefInfo" >
            <div :key="i" :style="{'width':(nodeEl.isWholeRow ? '100%' : '49%')}" class="detRowDiv devDiv">
              <div class="devTitleDiv" :style="{'width':(nodeEl.isWholeRow ? '10%' : '20%')}"><span class="titleSpan" >{{nodeEl.desc}}</span></div>
              <div class="devInfoDiv" :style="{'width':(nodeEl.isWholeRow ? '87%' : '77%')}">
                <span class="infoSpan" v-if="nodeEl.paramName=='priority'">{{getValueByV(projectInfoObj[nodeEl.paramName],projectPriorityV)}}</span>
                <span class="infoSpan" v-else-if="nodeEl.paramName=='projectType'">{{getValueByV(projectInfoObj[nodeEl.paramName],projectTypeV)}}</span>
                <span class="infoSpan" v-else-if="nodeEl.paramName=='contractNature'">{{getEnumText(projectInfoObj[nodeEl.paramName],nodeEl.kvGroupDesc)}}<span v-if="(projectInfoObj.contractNature!=null && (projectInfoObj.contractNature=='1499698890439356417'||projectInfoObj.contractNature=='1499698945393127426'||projectInfoObj.contractNature=='1499698972526080001'))&&projectInfoObj.contractValidDateFrom!=null && projectInfoObj.contractValidDateFrom!=''">&nbsp;&nbsp;(&nbsp;{{projectInfoObj.contractValidDateFrom}}&nbsp;至&nbsp;{{projectInfoObj.contractValidDateTo}}&nbsp;)</span></span>
                <span class="infoSpan" v-else-if="nodeEl.kvGroupDesc!=''">{{getEnumText(projectInfoObj[nodeEl.paramName],nodeEl.kvGroupDesc)}}</span>
                <span class="infoSpan" v-else>{{projectInfoObj[nodeEl.paramName]}}</span>
              </div>
            </div>
          </template>
        </div>
         <el-row  style="padding:10px 10px 0px 10px;height: calc(100% - 360px);">
             <el-col :span="24" >
                 <el-tabs v-model="focusPanelName" @tab-click="setTabPanel">
                    <el-tab-pane label="扩展信息" name="detailInfo">
                      <div style="width:calc(100% - 60px);padding:0px 30px;">
                        <el-divider content-position="left" class="tinyMarginLine">产品技术相关</el-divider>
                        <template v-for="(nodeEl,key,i) in devInfo" >
                          <div :key="i" :style="{'width':(nodeEl.isWholeRow ? '100%' : '49%')}" class="detRowDiv devDiv">
                            <div class="devTitleDiv" :style="{'width':(nodeEl.isWholeRow ? '13%' : '26%')}"><span class="titleSpan" >{{nodeEl.desc}}</span></div>
                            <div class="devInfoDiv" :style="{'width':(nodeEl.isWholeRow ? '84%' : '71%')}">
                              <span class="infoSpan" v-if="nodeEl.kvGroupDesc!=''">{{getEnumText(projectInfoObj[nodeEl.paramName],nodeEl.kvGroupDesc)}}</span>
                              <span class="infoSpan" v-else-if="nodeEl.paramName=='address'">
                                <span v-if="getAreaDesc()!=''">{{getAreaDesc()}}<br></span>
                                {{projectInfoObj[nodeEl.paramName]}}
                              </span>
                              <span class="infoSpan" v-else>{{projectInfoObj[nodeEl.paramName]}}</span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'项目动态 ('+(this.projectCommonEventList==null?0:this.projectCommonEventList.length)+')'" name="eventInfo" >
                        <div class="rtBtnDiv" v-if="isAdminRole"><el-button type="warning" icon="el-icon-plus" size="mini" circle @click.native="addCommonEvent"></el-button></div>
                        <div style="padding:7px 20px;">
                          {{noEventInfoToShow}}
                          <el-timeline>
                              <el-timeline-item v-for="(item,index) in projectCommonEventList" :key="index" v-bind:timestamp="formatDateToMinute(item.actionDate)" placement="top" >
                                  <el-card>
                                      <h4>{{item.subject}}</h4>
                                      <div  v-for="(fileNode , fileNodeIdx) in item.checkEventFileList" :key="fileNodeIdx" ><i class="el-icon-paperclip"></i> {{fileNode.name}}<el-button type="text" @click.native="doFilePreviewAction(fileNode)" v-if="_isPreviewFile(fileNode.fileType)" class="fileBtn" >预览</el-button><el-button type="text" @click.native="doFileDownloadAction(fileNode)" class="fileBtn" >下载</el-button></div>
                                      <el-row >
                                        <el-col :span="4" ><span class="eventTitleSpan" >事件时间：</span></el-col>
                                        <el-col :span="6" ><span class="tinyInfoSpan" >{{formatDateToMinute(item.actionDate)}}</span></el-col>
                                        <el-col :span="3" ><span class="eventTitleSpan" >联系方式：</span></el-col>
                                        <el-col :span="11" ><span class="tinyInfoSpan">{{getEnumText(item.typeId,"eventContactType")}}</span></el-col>
                                      </el-row>
                                      <el-row >
                                        <el-col :span="4" ><span class="eventTitleSpan" >客户方联系人：</span></el-col>
                                        <el-col :span="6" ><span class="tinyInfoSpan">{{item.contactPerson}}</span></el-col>
                                        <el-col :span="3" ><span class="eventTitleSpan" >经办人：</span></el-col>
                                        <el-col :span="11"><span class="tinyInfoSpan">{{item.actionUser}}</span></el-col>
                                      </el-row>
                                      <p class="eventTinyTip">{{item.createUserName}} 录入于 {{formatDateToMinute(item.createDate)}}</p>
                                      <div class="eventBtn" style="position:absolute;right:10px;bottom:10px;" v-if="isAdminRole&&checkEventBtnByDate(item.createDate)">
                                        <el-button type="primary" icon="el-icon-edit" circle @click.native="editCommonEvent(item.id)"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" circle @click.native="deleteCommonEvent(item.id)"></el-button>
                                      </div>
                                  </el-card>
                              </el-timeline-item>
                          </el-timeline>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="项目财务" name="fin" >
                      <div style="width:calc(100% - 60px);padding:0px 30px;">
                        <el-card class="box-card detCard">
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >财务概览</span>
                            <el-button style="float: right; padding: 5px 10px" type="primary" @click="editFinSummary" v-if="isAdminRole" size="mini"><i class="el-icon-edit"></i> 编辑</el-button>
                          </div>
                          <div style="width:100%;padding:0px 0px;">
                            <template v-for="(nodeEl,key,i) in finInfo" >
                              <div :key="i" :style="{'width':(nodeEl.isWholeRow ? '100%' : '49%')}" class="detRowDiv devDiv">
                                <div class="devTitleDiv" :style="{'width':(nodeEl.isWholeRow ? '12%' : '25%')}"><span class="titleSpan" >{{nodeEl.desc}}</span></div>
                                <div class="devInfoDiv" :style="{'width':(nodeEl.isWholeRow ? '87%' : '72%')}">
                                  <span class="infoSpan" v-if="nodeEl.kvGroupDesc!=''">{{getEnumText(projectInfoObj[nodeEl.paramName],nodeEl.kvGroupDesc)}}</span>
                                  <span class="infoSpan" v-else-if="nodeEl.paramName=='address'">
                                    <span v-if="getAreaDesc()!=''">{{getAreaDesc()}}<br></span>
                                    {{projectInfoObj[nodeEl.paramName]}}
                                  </span>
                                  <span class="infoSpan" v-else>{{projectInfoObj[nodeEl.paramName]}}</span>
                                </div>
                              </div>
                            </template>
                              <div style="font-weight:bold;line-height:30px;color:#504f4f;font-size:16px;padding:10px 0px 10px 0px;">当前税费共计 {{parseFloat(projectInfoObj.taxSum).toFixed(2)}} 元</div>
                          </div>
                        </el-card>
                        <el-card class="box-card detCard" style="margin-top:10px;">
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >收付款记录</span>
                            <el-button style="float: right; padding: 5px 10px" type="primary" @click="addPayment" v-if="isAdminRole" size="mini"><i class="el-icon-plus" ></i> 添加</el-button>
                          </div>
                          <div style="width:100%;padding:0px 0px;">
                            <el-table class="tableInTab" :data="projectPaymentList"  stripe style="width: 100%;height:100%" v-if="paymentDataMounted && projectPaymentList!=null && projectPaymentList.length > 0" size="mini">
                              <el-table-column v-for="(colEl,index) in paymentTableColEl" :key="index"  :fixed="(colEl.paramName=='op')?'right':null" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                  <div v-if="colEl.paramName=='op'">
                                    <el-button class="infoTableBtn" type="text" @click.native="editPayment(scope.row.id)" v-if="isAdminRole">编辑</el-button>
                                    <el-button class="infoTableBtn" type="text" @click.native="deletePayment(scope.row.id)" style="color:red;margin-left:2px;" v-if="isAdminRole">删除</el-button>
                                  </div>
                                  <div v-else-if="colEl.paramName=='taxInfo'&&scope.row.taxType!=null" >
                                    类别：{{getEnumText(scope.row.taxType,'taxType') }}; 增值税：{{scope.row.valueAddedTaxAmt}}元; 附加税：{{scope.row.superTaxAmt}}元; 印花税：{{scope.row.stampTaxAmt}}元
                                  </div>
                                  <div v-else-if="colEl.paramName=='attachment'">
                                    <el-dropdown trigger="click" v-if="scope.row.checkEventFileList.length > 0">
                                      <span class="el-dropdown-link" style="font-weight:bold;">
                                        <el-link type="primary"><i class="el-icon-paperclip"></i>{{scope.row.checkEventFileList.length}}</el-link>
                                      </span>
                                      <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item icon="el-icon-paperclip" v-for="(fileNode , fileNodeIdx) in scope.row.checkEventFileList" :key="fileNodeIdx" >
                                            {{fileNode.name}}<el-button type="text" @click.native="doFilePreviewAction(fileNode)" v-if="_isPreviewFile(fileNode.fileType)" class="fileBtn" >预览</el-button><el-button type="text" @click.native="doFileDownloadAction(fileNode)" class="fileBtn" >下载</el-button>
                                        </el-dropdown-item>
                                      </el-dropdown-menu>
                                    </el-dropdown>
                                  </div>
                                  <div v-else-if="colEl.kvGroupDesc!=''">
                                    {{getEnumText(scope.row[colEl.paramName],colEl.kvGroupDesc)}}
                                  </div>
                                  <div v-else-if="colEl.paramName=='paymtType'">
                                    {{getValueByV(scope.row[colEl.paramName],projectPaymentTypeV)}}
                                  </div>
                                  <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </el-card>
                        <el-card class="box-card detCard" style="margin-top:10px;" v-if="opRoleList['projectFinAdmin'].flag">
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >成本支出记录 ( 当前合计{{expenseSum}}元 ) </span>
                          </div>
                          <div style="width:100%;padding:0px 0px;" ref="projectExpenseListDiv">
                            <el-table class="tableInTab" :data="projectExpenseList"  stripe style="width: 100%;" height="300" v-if="expenseDataMounted && projectExpenseList!=null && projectExpenseList.length > 0" size="mini">
                              <el-table-column v-for="(colEl,index) in expenseTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                  <div v-if="colEl.paramName=='oriRelated'">
                                    {{scope.row.modular=='project'?"当前项目":"客户："+scope.row.relatedBaName}}
                                  </div>
                                  <div v-else-if="colEl.paramName=='op'">
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
                            <el-pagination v-if="expenseDataMounted && projectExpenseList!=null && projectExpenseList.length > 0"
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
                    <el-tab-pane label="技术任务" name="dev" >
                      <div style="padding:2px 40px;">
                        <el-button type="primary" @click="goKanban" size="mini">进入技术任务看板 <i class="el-icon-right"></i></el-button>
                        <el-card class="box-card detCard" style="margin-top:10px;" v-if=" devList!=null && devList.length > 0">
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >技术任务列表</span>
                          </div>
                          <div style="width:100%;padding:0px 0px;" ref="devListDiv">
                            <el-table :data="devList" border stripe style="width: 100%" :height="500" :default-sort = "{prop: 'createDate', order: 'descending'}" size="mini">
                              <el-table-column v-for="(colEl,index) in devTableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                  <div v-if="colEl.isLinkStyle" class="taskListBtnDiv">
                                  <el-button class="taskListBtn" @click="showDevTaskInfoDetWin(scope.row.id)" type="text" >{{scope.row[colEl.paramName]}}</el-button>
                                  </div>
                                  <div v-else-if="colEl.paramName=='status'">
                                    {{getTaskStatusDesc(scope.row[colEl.paramName])}}
                                  </div>
                                  <div v-else-if="colEl.paramName=='createDate'">
                                    {{formatDateToMinute(scope.row[colEl.paramName])}}
                                  </div>
                                  <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-pagination v-if="devDataMounted && devList!=null && devList.length > 0"
                              layout="total,prev, pager, next"
                              @current-change="handleDevListPageChange"
                              :current-page.sync="devListPaginationInfo.page"
                              :page-size="devListPaginationInfo.rows"
                              :total="devListPaginationInfo.total">
                            </el-pagination>
                          </div>
                        </el-card>
                        <el-card class="box-card detCard" style="margin-top:10px;" v-if=" hisDevList!=null && hisDevList.length > 0">
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >老平台历史二开工作</span>
                          </div>
                          <div style="width:100%;padding:0px 0px;" ref="hisDevListDiv">
                            <el-table class="tableInTab" :data="hisDevList"  stripe style="width: 100%;" height="300" v-if="hisDevDataMounted && hisDevList!=null && hisDevList.length > 0" size="mini">
                              <el-table-column v-for="(colEl,index) in hisDevTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                  <div v-if="colEl.paramName=='op'">
                                    <el-popover placement="top" width="800" trigger="click" v-if="isAdminRole" >
                                      <div v-html="handleDataJournalExtContent(scope.row.extContent)">
                                      </div>
                                      <el-button class="infoTableBtn" type="text" slot="reference">查看详情</el-button>
                                    </el-popover>
                                  </div>
                                  <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-pagination v-if="hisDevDataMounted && hisDevList!=null && hisDevList.length > 0"
                              layout="total,prev, pager, next"
                              @current-change="handleHisDevListPageChange"
                              :current-page.sync="hisDevListPaginationInfo.page"
                              :page-size="hisDevListPaginationInfo.rows"
                              :total="hisDevListPaginationInfo.total">
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
                              <el-select v-model="relatedDataFuncFlagStr" style="width:250px;" size="mini" filterable @change="getRelatedDataListFunc">
                                <el-option label="全部" value="ALL"></el-option>
                                <el-option
                                  v-for="rItem in relatedDataFuncFlagWfForProject"
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

                        <el-card class="box-card detCard" style="margin-top:10px;" v-if="hisServiceFlowList!=null && hisServiceFlowList.length > 0">
                          <div slot="header" class="clearfix">
                            <span class="cardHeader" >老平台历史实施服务流程</span>
                          </div>
                          <div style="width:100%;padding:0px 0px;" ref="hisServiceFlowListDiv">
                            <el-table class="tableInTab" :data="hisServiceFlowList"  stripe style="width: 100%;" height="300" v-if="hisServiceFlowDataMounted && hisServiceFlowList!=null && hisServiceFlowList.length > 0" size="mini">
                              <el-table-column v-for="(colEl,index) in hisServiceFlowTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                  <div v-if="colEl.paramName=='op'">
                                    <el-popover placement="top" width="800" trigger="click" v-if="isAdminRole" >
                                      <div v-html="handleDataJournalExtContent(scope.row.extContent)">
                                      </div>
                                      <el-button class="infoTableBtn" type="text" slot="reference">查看详情</el-button>
                                    </el-popover>
                                  </div>
                                  <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-pagination v-if="hisServiceFlowDataMounted && hisServiceFlowList!=null && hisServiceFlowList.length > 0"
                              layout="total,prev, pager, next"
                              @current-change="handleHisServiceFlowListPageChange"
                              :current-page.sync="hisServiceFlowListPaginationInfo.page"
                              :page-size="hisServiceFlowListPaginationInfo.rows"
                              :total="hisServiceFlowListPaginationInfo.total">
                            </el-pagination>
                          </div>
                        </el-card>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'相关文档 (' + (this.projectFileList==null?0:this.projectFileList.length) + ')'" name="file">
                      <div class="rtBtnDiv" v-if="isAdminRole"><el-button type="warning" icon="el-icon-plus" size="mini" circle @click.native="addFile"></el-button></div>
                      <div style="padding:0px 40px;">
                        {{noFileInfoToShow}}
                        <el-table :data="projectFileList"  stripe style="width: 100%" v-if="projectFileList!=null && projectFileList.length > 0" class="detTable" size="mini">
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
                    <el-tab-pane :label="'团队成员 (' + (this.projectTeamList==null?0:this.projectTeamList.length) + ')'" name="team">
                      <div class="rtBtnDiv" v-if="isAdminRole"><el-button type="warning" icon="el-icon-plus" size="mini" circle @click.native="addProjectTeamMember"></el-button></div>
                      <div style="padding:0px 40px;">
                        {{noTeamInfoToShow}}
                        <el-table :data="projectTeamList"  stripe style="width: 100%" :default-sort = "{prop: 'createDate', order: 'descending'}" v-if="projectTeamList!=null && projectTeamList.length > 0" class="detTable" size="mini">
                          <el-table-column v-for="(colEl,index) in teamMemberTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth" :sortable="colEl.isSortable">
                            <template slot-scope="scope"  >
                              <div v-if="colEl.paramName=='op'">
                                <el-button type="text" @click.native="deleteMember(scope.row.id , scope.row.memberName)" style="color:red;" v-if="isAdminRole" size="mini">删除</el-button>
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
        <addCommonEvent v-show="dialogTab=='addCommonEvent'" ref="addCommonEventWin"></addCommonEvent>
        <editCommonEvent v-show="dialogTab=='editCommonEvent'" ref="editCommonEventWin"></editCommonEvent>
        <editFinSummary v-show="dialogTab=='editFinSummary'" ref="editFinSummaryWin"></editFinSummary>
        <editProject v-show="dialogTab=='editProject'" ref="editProjectWin"></editProject>
        <ecoFileUploadPopup v-show="dialogTab=='addFile'" modular="bmsProject" :modularInnerId="this.projectId" ref="addFileWin"></ecoFileUploadPopup>
        <addProjectTeamMember v-show="dialogTab=='addProjectTeamMember'" ref="addProjectTeamMemberWin"></addProjectTeamMember>
        <addPayment v-show="dialogTab=='addPayment'" ref="addPaymentWin"></addPayment>
        <editPayment v-show="dialogTab=='editPayment'" ref="editPaymentWin"></editPayment>
        <div slot="footer" class="dialog-footer" v-if="dialogTab!='addFile'">
          <el-button @click.native="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
        </div>
        <div slot="footer" class="dialog-footer" v-else>
          <el-button @click.native="dialogVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="fullScreenDialogTitle" :visible.sync="fullScreenDialogVisible" :destroy-on-close="true" ref="fullScreenDialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="fullScreenDialog">
         <router-view style="height:100%;position:relative;" :key="$route.query.t">
         </router-view>
      </el-dialog>
      <el-drawer :title="devTaskInfoDetDialogTitle" :with-header="false" :visible.sync="devTaskInfoDetDialogVisible" direction="rtl" size="70%" :destroy-on-close="true" ref="devTaskInfoDetDialog" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
            <br>
            <taskInfo :taskId="focusDevTaskId" ></taskInfo>
      </el-drawer>
    </div>
</template>
<script>
import {doFilePreviewAction,doFileDownloadAction,getDataJournalSumByFinalRelatedProject , getDataJournalList ,getDataJournalListByFinalRelatedProjectId ,formatDateToDay,handleDataJournalExtContent,relatedDataFuncFlagWfForProject} from "@/modules/bmsMmm/util/utility.js";
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import { getEnumText,openLoading,closeLoading,formatFileSize,deleteFileDataServer,_isPreviewFile } from "@/modules/bmsBa/service/service.js";
import { getProjectDetail,deleteProjectAjax,getValueByV,projectPriorityV,projectTypeV,deleteTeamMemberAjax,getProjectTeamMemberList,getRoleDescByKey,getProjectFileList,getProjectEventList,projectPaymentTypeV,deleteProjectEventAjax,getEventFileList } from "@/modules/bmsProject/service/service.js";
import { formatDateToMinute,initOpRoleList,searchTaskList,getTaskStatusDesc } from "@/modules/bmsMmm/service/service.js";
import {mapMutations} from 'vuex';
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { DetShowEl } from "@/modules/bmsBa/util/DetShowEl.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import editProject from "@/modules/bmsProject/views/editProject.vue";
import addCommonEvent from "@/modules/bmsProject/views/addCommonEvent.vue";
import editCommonEvent from "@/modules/bmsProject/views/editCommonEvent.vue";
import ecoFileUploadPopup from '@/modules/bmsMmm/component/ecoFileUploadPopup.vue';
import addProjectTeamMember from "@/modules/bmsProject/views/addProjectTeamMember.vue";
import addPayment from "@/modules/bmsProject/views/addPayment.vue";
import editPayment from "@/modules/bmsProject/views/editPayment.vue";
import editFinSummary from "@/modules/bmsProject/views/editFinSummary.vue";
import mmmForProject from "@/modules/bmsMmm/views/mmmForProject.vue";
import TaskList from '../../bmsMmm/views/taskList.vue';
import taskInfo from "@/modules/bmsMmm/component/taskInfo.vue";
import wfViewFromAf from "@/modules/bmsMmm/util/wfViewFromAf.vue";
export default{
  name:'projectInfo',
  components:{
    editProject,
    addCommonEvent,
    editCommonEvent,
    editFinSummary,
    ecoFileUploadPopup,
    addProjectTeamMember,
    addPayment,
    editPayment,
    mmmForProject,
    ecoContent,
    ecoToolTitle,
    TaskList,
    taskInfo,
    wfViewFromAf
  },
  data(){
    return {
      tokenNameInStore: "eco-auth-token",
      loading:true,
      projectInfoObj:{},
      projectId:'',
      projectName:'',
      focusPanelName:'',
      focusEventId:'',
      dialogTitle:'',
      dialogTab:'',
      dialogVisible:false,
      fullScreenDialogTitle:'',
      fullScreenDialogVisible:false,
      projectCommonEventList:[],
      projectPaymentList:[],
      projectFileList:[],
      projectTeamList:[],
      noEventInfoToShow:'',
      noFileInfoToShow:'',
      noTeamInfoToShow:'',
      noRelatedDataInfoToShow:'',
      noInfoMsg:'　暂无数据 ...',
      kvInfo:new KvGroup(),
      briefInfo:new DetShowEl()
        .add("项目名称","projectName",'',true)

        .add("客户全称","customerDesc",'',false)
        .add("合同编号","contractNo",'',false)
        .add("签约时间","contractSignDate",'',false,'date')
        .add("合同状态","contractStatus",'contractStatus',false,'')
        .add("合同性质","contractNature",'contractNature',false,'')
        .add("项目结算状态","totalStatus",'totalStatus',false,'')

        .add("优先级","priority",'',false)
        .add("项目类别","projectType",'',false)
        .add("当前阶段","projectPhaseName",'',false)
        .add("项目状态","projectStatus",'projectStatus',false)
        .add("产品类别","productType",'productType',false)
        .add("开始时间","startDate",'',false)
        .add("销售经理","salesManagerName",'',false)
        .add("项目地点","location",'',false)
        .add("关联客户","customerName",'',true)
        .add("备注","comments",'',true),
      devInfo:new DetShowEl()
        .add("是否需要产品团队关注","productFocusFlagName",'',true)
        .add("内部平台URL","devPlatformUrl",'',true)
        .add("登录用户名","devPlatformUserid",'',false)
        .add("密码","devPlatformPwd",'',false)
        .add("数据库IP","devPlatformDbIp",'',false)
        .add("数据库SID","devPlatformDbSid",'',false)
        .add("版本库地址","devVersionLib",'',true)
        .add("其他内部环境相关备注","devComments",'',true)
        .add("钉钉项目群助手令牌","dingGroupAccessToken",'',true)
        .add("钉钉项目群助手密钥","dingGroupSecret",'',true),
      finInfo:new DetShowEl()
        .add("总金额","contractAmt",'',false)
        .add("已开票比例","invoicedPct",'',false)
        .add("下次付款比例","nextPaymtPct",'',false)
        .add("下次付款时间","nextPaymtDate",'',false)
        .add("下次付款条件","nextPaymtCond",'',true)
        .add("已收款比例","receivedPaymtPct",'',false)
        .add("已收款金额","receivedPaymtAmt",'',false)
        .add("剩余金额","restPaymtAmt",'',true),
       /**
       * @param {string} desc  描述
       * @param {string} paramName  属性名
       * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
       * @param {boolean} isWholeRow  是否占满整行，为“否”则默认两个元素一行
       */
      fileTableColEl: new TableColEl()
        .add("文档名称","name",'300','',false,false,false)
        .add("大小","size",'100',"",false,false,false)
        .add("上传人","createUserName",'80',"",false,false,false)
        .add("上传时间","createDate",'140',"",false,false,false)
        .add("操作","op",'150',"",false,false,false),
      paymentTableColEl: new TableColEl()
        .add("时间","paymtDate",'100','',false,false,false)
        .add("类型","paymtType",'50',"",false,false,false)
        .add("款项种类","stage",'80',"paymentStage",false,false,false)
        .add("金额","paymtAmt",'80',"",false,false,false)
        .add("税费类别","taxType",'80',"taxType",false,false,false)
        .add("增值税","valueAddedTaxAmt",'85',"",false,false,false)
        .add("附加税","superTaxAmt",'85',"",false,false,false)
        .add("印花税","stampTaxAmt",'80',"",false,false,false)
        .add("备注","subject",'250',"",false,false,false)
        .add("录入人员","createUserName",'80',"",false,false,false)
        .add("录入时间","createDate",'150',"",false,false,false)
        .add("附件","attachment",'55',"",false,false,false)
        .add("操作","op",'90',"",true,false,false),
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
      paymentDataMounted : false,
      commonEventDataMounted : false,
      opRoleList:null,
      myUserId:'',
      isAdminInThisProject:false,
      expenseSum:'',
      projectExpenseList:[],
      expenseDataMounted : false,
      expenseTableColEl: new TableColEl()
        .add("时间","createDate",'100','',false,false,false)
        .add("经办人","createUserDesc",'130',"",false,false,false)
        .add("开支原因","sourceDesc",'170',"",false,false,false)
        .add("金额","dataNumber",'80',"",false,false,false)
        .add("原始关联","oriRelated",'300',"",false,false,false)
        .add("操作","op",'90',"",false,false,false),
      expenseListPaginationInfo: {
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      hisDevList:[],
      hisDevDataMounted : false,
      hisDevTableColEl: new TableColEl()
        .add("时间","createDate",'100','',false,false,false)
        .add("经办人","dataText4",'130',"",false,false,false)
        .add("对接人","dataText3",'170',"",false,false,false)
        .add("工时","dataNumber",'80',"",false,false,false)
        .add("操作","op",'90',"",false,false,false),
      hisDevListPaginationInfo: {
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      hisServiceFlowList:[],
      hisServiceFlowDataMounted : false,
      hisServiceFlowTableColEl: new TableColEl()
        .add("服务时间","dataText2",'100','',false,false,false)
        .add("经办人","createUser",'130',"",false,false,false)
        .add("服务内容","dataText1",'450',"",false,false,false)
        .add("操作","op",'90',"",false,false,false),
      hisServiceFlowListPaginationInfo: {
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      devList:[],
      devDataMounted : false,
      devTableColEl: new TableColEl()
        .add("任务名称","title",'450','','left',true,true)
        .add("经办人","dealerName",'80',"",false,false,false)
        .add("优先级","priority",'65',"",false,false,false)
        .add("状态","status",'110',"",false,false,false)
        .add("要求完成时间","expectFinishDate",'108',"",false,false,false)
        .add("实际完成时间","actualFinishDate",'108',"",false,false,false)
        .add("预估工时","estimateManHour",'80',"",false,false,false)
        .add("实际工时","actualManHour",'80',"",false,false,false)
        .add("绩效工时","performManHour",'80',"",false,false,false)
        .add("关联日程","calendarCount",'80',"",false,false,false)
        .add("对接人","followuperName",'80',"",false,false,false)
        .add("录入人员","createUserName","80",'',false,false,false)
        .add("录入时间","createDate","143",'',false,false,true),
      devListPaginationInfo: {
        projectId:'',
        proType:'1',
        title:'',
        userIdStr:'',
        priorityList:["1","2","3"],
        statusList:[],
        fromToExpectFinishDateArray:[],//存放日期区间选择组件的值，数组等式存放viewDateFrom和viewDateTo
        fromToCreateDateArray:[],//存放日期区间选择组件的值，数组等式存放viewDateFrom和viewDateTo
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      devTaskInfoDetDialogTitle:'',
      devTaskInfoDetDialogVisible:false,
      focusDevTaskId:'',
      projectPriorityV,projectTypeV,projectPaymentTypeV,
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
      relatedDataFuncFlagWfForProject
    }
  },
  created(){
    this.initOpRoleList();
    this.kvInfo = this.$parent.$parent.kvInfo;
  },
  mounted(){
    this.projectId = this.$route.query.project_id;
    this.focusPanelName = 'detailInfo';
    this.getProjectInfo(this.projectId);
  },
  methods: {
    getExpenseSum(){
      getDataJournalSumByFinalRelatedProject( this.projectId , '1,2,3,4,32,33,34,35,36,37,45,48,51,53,55').then((response)=>{
        this.expenseSum = response.data;
      }).catch((error)=>{
        console.log("error:" + error);
      });
    },
    isAdminRole(){
      return this.opRoleList['projectAdmin'].flag||this.isAdminInThisProject;
    },
    getProjectInfo(projectId){
      this.$parent.$parent.openLoading();
      this.commonEventDataMounted = false;
      this.paymentDataMounted = false;
      this.expenseDataMounted = false;
      this.projectId = projectId;
      this.devListPaginationInfo.projectId = projectId;
      console.log("getProjectInfo projectId:" + projectId);
      getProjectDetail(projectId).then((response)=>{
        if (response.data&&response.data.id){
            this.projectInfoObj = response.data;
            this.projectName = response.data.projectName;
            if(this.projectInfoObj.productFocusFlag){
                this.projectInfoObj.productFocusFlagName='是';
            }else{
                this.projectInfoObj.productFocusFlagName='否';
            }
            this.projectInfoObj = {...this.projectInfoObj};
            console.log("getProjectInfo projectName:" + response.data.projectName);
            this.getProjectCommonEventListFunc();
            this.getProjectFileListFunc();
            this.getProjectTeamMemberListFunc();
            this.getProjectPaymentListFunc();
            this.getExpenseSum();
            this.getExpenseListFunc();
            this.getHisDevListFunc();
            this.getHisServiceFlowListFunc();
            this.getDevTaskListFunc();
            this.getRelatedDataListFunc();
            this.$parent.$parent.closeLoading();
        }
      }).catch((error)=>{
         this.$parent.$parent.closeLoading();
      });
    },
    cleanInfo(){
        this.projectName='';
        this.projectInfoObj={};
        this.projectCommonEventList={};
        this.projectPaymentList=[];
        this.projectExpenseList=[];
        this.devList=[];
        this.hisDevList=[];
        this.hisServiceFlowList=[];
        this.relatedDataList=[];
        this.expenseSum = '';
        this.expenseSumIncludeTax = 0;
        this.hisDevListPaginationInfo.page = 1;
        this.expenseListPaginationInfo.page = 1;
        this.hisServiceFlowListPaginationInfo.page = 1;
        this.devListPaginationInfo.page = 1;
        this.relatedDataListPaginationInfo.page = 1;
    },
    setTabPanel(){
      //console.log("trigger setTabPanel:"+this.focusPanelName);
      if(this.focusPanelName == 'eventInfo'){
        this.$parent.$parent.closeLoading();
        this.getProjectCommonEventListFunc();
      }else if(this.focusPanelName == 'fin'){
        this.$parent.$parent.closeLoading();
        this.getProjectInfo(this.projectId);
        //this.getProjectPaymentListFunc();
      }else if(this.focusPanelName == 'dev'){
        this.getDevTaskListFunc();
        this.getHisDevListFunc();
      }else if(this.focusPanelName == 'relatedData'){
        this.getRelatedDataListFunc();
        this.getHisServiceFlowListFunc();
      }else if(this.focusPanelName == 'file'){
        this.$parent.$parent.closeLoading();
        this.getProjectFileListFunc();
      }else if(this.focusPanelName == 'team'){
        this.$parent.$parent.closeLoading();
        this.getProjectTeamMemberListFunc();
      }
    },
    editProject(){
      this.dialogTitle="编辑项目信息";
      this.dialogTab = 'editProject';
      this.dialogVisible = true;
      //console.log("##########typeof this.$refs.editProjectWin:"+typeof this.$refs.editProjectWin  );
      if(typeof this.$refs.editProjectWin=="undefined"){
      }else{
        //console.log("##########have editProjectWin!!!!"  );
        this.$refs.editProjectWin.getProjectInfo(this.projectId);
      }

    },
    deleteProject(){
      this.$confirm('确定要删除项目“'+this.projectName+'”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProjectAjax(this.projectId).then((res)=>{
          //console.log("submit  done!!");
          this.$message({type: 'success',message: '删除成功！'});
          this.$parent.$parent.trivialDialogVisible = false;
          this.$parent.$parent.hideDialog();
          this.$parent.$parent.getProjectListFunc();
        }).catch((error)=>{
          this.$parent.$parent.closeLoading();
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    dialogSave(){
      //console.log("dialogSave!!:" + this.dialogTab);
      if(this.dialogTab == 'editProject'){
        this.$refs.editProjectWin.save();
      }else if(this.dialogTab == 'addCommonEvent'){
        this.$refs.addCommonEventWin.save();
      }else if(this.dialogTab == 'editCommonEvent'){
        this.$refs.editCommonEventWin.save();
      }else if(this.dialogTab == 'editFinSummary'){
        this.$refs.editFinSummaryWin.save();
      }else if(this.dialogTab == 'addProjectTeamMember'){
        this.$refs.addProjectTeamMemberWin.save();
      }else if(this.dialogTab == 'addPayment'){
        this.$refs.addPaymentWin.save();
      }else if(this.dialogTab == 'editPayment'){
        this.$refs.editPaymentWin.save();
      }
    },
    cleanDialog(){
      if(typeof this.$refs.addCommonEventWin!="undefined"){
        this.$refs.addCommonEventWin.cleanInfo();
        this.$refs.addCommonEventWin.setProjectId(this.projectId);
      }
      if(typeof this.$refs.editCommonEventWin!="undefined"){
        this.$refs.editCommonEventWin.cleanInfo();
        this.$refs.editCommonEventWin.getCommonEventInfo(this.focusEventId);
      }
      if(typeof this.$refs.addProjectTeamMemberWin!="undefined"){
        this.$refs.addProjectTeamMemberWin.cleanInfo();
        this.$refs.addProjectTeamMemberWin.setProjectId(this.projectId);
      }
      if(typeof this.$refs.addPaymentWin!="undefined"){
        this.$refs.addPaymentWin.cleanInfo();
        this.$refs.addPaymentWin.setProjectId(this.projectId);
      }
      if(typeof this.$refs.editPaymentWin!="undefined"){
        this.$refs.editPaymentWin.cleanInfo();
        this.$refs.editPaymentWin.getPaymentInfo(this.focusEventId);
      }
    },
    addProjectTeamMember(){
      this.dialogTitle="添加团队成员";
      this.dialogTab = 'addProjectTeamMember';
      this.dialogVisible = true;
    },
    async getProjectTeamMemberListFunc(){
      //console.log("getProjectTeamMemberListFunc");
      this.$parent.$parent.openLoading();
      this.noTeamInfoToShow='';
      if(!this.opRoleList['projectAdmin'].flag){         //当前用户没有项目模块全管理权限，则要判断其对当前项目是否有管理权限
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
      await getProjectTeamMemberList(this.projectId ).then(response => {
          this.projectTeamList = response.data.rows;
          for (let i in this.projectTeamList) {
            let checkNode = this.projectTeamList[i];
            if(checkNode.createDate.length == 19){
              checkNode.createDate = checkNode.createDate.substring(0,16);
            }
            checkNode.key = getRoleDescByKey(checkNode.key);
            if(!this.opRoleList['projectAdmin'].flag){    //当前用户没有项目模块全管理权限，则要判断其对当前项目是否有管理权限
              if(checkNode.linkId = this.myUserId && (checkNode.key == 'owner' || checkNode.key == 'collabrator' || checkNode.key == 'flowup')){
                this.isAdminInThisProject = true;
              }
            }
          }
          if(this.projectTeamList.length==0){
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
    getProjectFileListFunc(){
      this.$parent.$parent.openLoading();
      this.noFileInfoToShow='';
      getProjectFileList(this.projectId ).then(response => {
            this.projectFileList = response.data;
            let tmp_projectFileList = [];
            for (let i in this.projectFileList) {
              let checkNode = this.projectFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_projectFileList.unshift(checkNode);
            }
            this.projectFileList = tmp_projectFileList;
            if(this.projectFileList.length==0){
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
    addFile(){
      this.dialogTitle="上传文档";
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    async getEventFileListFunc(checkEventId){
      let checkEventFileList = [];
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
    async getProjectPaymentListFunc(){
      this.paymentDataMounted = false;
      await getProjectEventList(this.projectId , 5 ).then(response => {
          this.projectPaymentList = response.data.rows;
          //console.log("this.projectPaymentList.length:"+this.projectPaymentList.length);
      }).catch(error => {
        console.log("error:"+error);
      });
      if(this.projectPaymentList!=null&&this.projectPaymentList.length>0){
        for(let i in this.projectPaymentList){
          this.projectPaymentList[i].createDate = formatDateToMinute(this.projectPaymentList[i].createDate);
          //console.log("this.projectPaymentList[i]:"+this.projectPaymentList[i]);
          this.projectPaymentList[i].checkEventFileList = await this.getEventFileListFunc(this.projectPaymentList[i].id);
          //console.log("checkEventFileList.length:"+this.projectPaymentList[i].checkEventFileList.length);
        }
        this.paymentDataMounted = true;
      }
    },
    addPayment(){
      this.dialogTitle="添加项目收付款记录";
      this.dialogTab = 'addPayment';
      this.dialogVisible = true;
    },
    editPayment(eventId){
      this.focusEventId = eventId;
      this.dialogTitle="编辑收付款记录";
      this.dialogTab = 'editPayment';
      this.dialogVisible = true;
      //console.log("this.$refs.editEventWin:"+this.$refs.editEventWin);
      if(typeof this.$refs.editPaymentWin=="undefined"){
      }else{

      }
    },
    deletePayment(eventId){
      this.$confirm('确定要删除此收付款记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("eventId:"+eventId);
        deleteProjectEventAjax(eventId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.focusPanelName = "fin";
          this.setTabPanel();
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    editFinSummary(){
      this.dialogTitle="编辑财务概览";
      this.dialogTab = 'editFinSummary';
      this.dialogVisible = true;
      //console.log("this.$refs.editEventWin:"+this.$refs.editEventWin);
      if(typeof this.$refs.editFinSummaryWin=="undefined"){
      }else{
        this.$refs.editFinSummaryWin.getFinSummaryInfo(this.projectId);
      }
    },
    async getProjectCommonEventListFunc(){
      this.commonEventDataMounted = false;
      this.$parent.$parent.openLoading();
      this.noEventInfoToShow='';
      await getProjectEventList(this.projectId , 6 ).then(response => {
          this.projectCommonEventList = response.data.rows;
          //console.log("this.projectCommonEventList.length:"+this.projectCommonEventList.length);
          if(this.projectCommonEventList.length==0){
            this.noEventInfoToShow=this.noInfoMsg;
          }
      }).catch(error => {
        console.log("error:"+error);
        this.$parent.$parent.closeLoading();
      });
      if(this.projectCommonEventList!=null&&this.projectCommonEventList.length>0){
        for(let i in this.projectCommonEventList){
          this.projectCommonEventList[i].createDate = formatDateToMinute(this.projectCommonEventList[i].createDate);
          //console.log("this.projectCommonEventList[i]:"+this.projectCommonEventList[i]);
          this.projectCommonEventList[i].checkEventFileList = await this.getEventFileListFunc(this.projectCommonEventList[i].id);
        }
        this.$forceUpdate();
        this.commonEventDataMounted = true;
      }
      this.$parent.$parent.closeLoading();
    },
    addCommonEvent(){
      this.dialogTitle="添加动态";
      this.dialogTab = 'addCommonEvent';
      this.dialogVisible = true;
    },
    editCommonEvent(eventId){
      this.focusEventId = eventId;
      this.dialogTitle="编辑动态";
      this.dialogTab = 'editCommonEvent';
      this.dialogVisible = true;
      if(typeof this.$refs.editCommonEventWin=="undefined"){
      }else{
        this.$refs.editCommonEventWin.getCommonEventInfo(this.focusEventId);
      }
    },
    deleteCommonEvent(eventId){
      this.$confirm('确定要删除此动态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("eventId:"+eventId);
        deleteProjectEventAjax(eventId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.focusPanelName = "eventInfo";
          this.setTabPanel();
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    checkEventBtnByDate(checkCreateDate){
      let s1 = new Date(checkCreateDate.replace(/-/g, '/'));
      let ms = new Date() - s1.getTime()
      ms = ms / 1000 / 60 / 60;
      //console.log("ms:"+ms);
      if(ms < 24 ) return true;
      else return false;
    },
    goKanban(){
      //console.log("##########this.projectName:"+this.projectName  );
      this.fullScreenDialogTitle = "项目任务"
      this.fullScreenDialogVisible = true;
      this.$router.push({
        name:"mmmForProjectInDialog" ,
        query:{
          t: Date.now(),
        },
        params: {
          projectIdProp: this.projectId,
          projectNameProp: this.projectName ,
          proTypeProp: '1' ,    //默认项目类别
          isProjectExclusiveProp: true ,   //是否仅针对某项目（从项目模块过来的）
          pageViewFlagProp: 'forProject',                     //从某个看板切过来的
          t: Date.now()
        }
      });
    },
    async getExpenseListFunc(){
      this.expenseDataMounted = false;
      await getDataJournalListByFinalRelatedProjectId(this.expenseListPaginationInfo , this.projectId , '1,2,3,4,32,33,34,35,36,37,45,48,51,53,55' ).then(response => {
          this.projectExpenseList = response.data.rows;
          this.expenseListPaginationInfo.total = response.data.total;
          //console.log("this.projectPaymentList.length:"+this.projectPaymentList.length);
      }).catch(error => {
        console.log("error:"+error);
      });
      if(this.projectExpenseList!=null&&this.projectExpenseList.length>0){
        for(let i in this.projectExpenseList){
          this.projectExpenseList[i].createDate = formatDateToDay(this.projectExpenseList[i].createDate);
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
    async getHisDevListFunc(){
      this.hisDevDataMounted = false;
      await getDataJournalList(this.hisDevListPaginationInfo ,'project' , this.projectId , '5,6' ).then(response => {
          this.hisDevList = response.data.rows;
          this.hisDevListPaginationInfo.total = response.data.total;
          //console.log("this.projectPaymentList.length:"+this.projectPaymentList.length);
      }).catch(error => {
        console.log("error:"+error);
      });
      if(this.hisDevList!=null&&this.hisDevList.length>0){
        for(let i in this.hisDevList){
          this.hisDevList[i].createDate = formatDateToDay(this.hisDevList[i].createDate);
          //console.log("checkEventFileList.length:"+this.projectPaymentList[i].checkEventFileList.length);
        }
        this.hisDevDataMounted = true;
      }
    },
    handleHisDevListPageChange(val) {
        //this.$refs.projectExpenseListDiv.setScollTop(0);
        this.hisDevListPaginationInfo.page = val;
        this.getHisDevListFunc();
    },
    async getHisServiceFlowListFunc(){
      this.hisServiceFlowDataMounted = false;
      await getDataJournalList(this.hisServiceFlowListPaginationInfo ,'project' , this.projectId , '7' ).then(response => {
          this.hisServiceFlowList = response.data.rows;
          this.hisServiceFlowListPaginationInfo.total = response.data.total;
          //console.log("this.projectPaymentList.length:"+this.projectPaymentList.length);
      }).catch(error => {
        console.log("error:"+error);
      });
      if(this.hisServiceFlowList!=null&&this.hisServiceFlowList.length>0){
        for(let i in this.hisServiceFlowList){
          this.hisServiceFlowList[i].createDate = formatDateToDay(this.hisServiceFlowList[i].createDate);
          //console.log("checkEventFileList.length:"+this.projectPaymentList[i].checkEventFileList.length);
        }
        this.hisServiceFlowDataMounted = true;
      }
    },
    handleHisServiceFlowListPageChange(val) {
        //this.$refs.projectExpenseListDiv.setScollTop(0);
        this.hisServiceFlowListPaginationInfo.page = val;
        this.getHisServiceFlowListFunc();
    },
    async getDevTaskListFunc(){
      this.devDataMounted = false;
      searchTaskList(this.devListPaginationInfo).then(response => {
        this.devList = response.data.rows;
        this.devListPaginationInfo.total = response.data.total;
        this.devDataMounted = true;
      }).catch(error => {
        console.log("error:"+error);
        this.devDataMounted = true;
      });
    },
    handleDevListPageChange(val){
      this.devListPaginationInfo.page = val;
      this.getDevTaskListFunc();
    },
    showDevTaskInfoDetWin(taskId){
      this.focusDevTaskId=taskId;
      this.devTaskInfoDetDialogTitle="任务详情";
      this.devTaskInfoDetDialogVisible = true;
    },
    async getRelatedDataListFunc(){
      this.relatedDataListDataMounted = false;
      this.noRelatedDataInfoToShow='';
      let checkFuncFlag = this.relatedDataFuncFlagStr;
      if(checkFuncFlag == "ALL"){
        checkFuncFlag = "26,27,28,30,39,42,44,49,50";
      }
      await getDataJournalList(this.relatedDataListPaginationInfo ,'project' , this.projectId , checkFuncFlag ).then(response => {
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
    getEnumText,
    openLoading,
    closeLoading,
    getValueByV,
    _isPreviewFile,doFilePreviewAction,
    doFileDownloadAction,formatDateToMinute,initOpRoleList,handleDataJournalExtContent,getTaskStatusDesc
  },
  watch: {

  }
}
</script>

