<template>
    <div class="dirctionAttr">
        <div class="btngroup">
            <el-button size="medium" @click="hideDialog">取消</el-button>
            <el-button size="medium" @click="save" type="primary">保存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!isCustomer">
            <el-tab-pane label="基本属性" name="first">
              <el-form  ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                 <div class="multipleformItem">
                    <el-form-item  size="medium" prop="taskName">
                      <span style="color: #262626;" slot="label">环节名称
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-input v-model="task_model.taskName"></el-input>
                      <div class="flowLevel">环节层级：<span>{{task_model.taskLevel}}</span></div>
                    </el-form-item>
                    <el-form-item  size="medium">
                      <span style="color: #262626;" slot="label">选择办理人员
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <div slot="content">当前环节办理人员的确定方式。有三<br/>种选择方式：1）环节动态选择；2）<br/>指定人员或角色；3）关联流程数据</div>
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-radio-group v-model="task_model.selectAssignee.type" @change="selectTypeChange">
                        <el-radio-button label="1" >环节动态选择</el-radio-button>
                        <el-radio-button label="2">指定人员或角色</el-radio-button>
                        <el-radio-button label="3">关联流程数据</el-radio-button>
                      </el-radio-group>
                      <div>
                          <div v-if="task_model.selectAssignee.type==1" >
                            选择范围
                          </div>
                           <el-select size="small" v-if="task_model.selectAssignee.type==1" v-model="select_assignee_1.scopeType">
                              <el-option
                                label="自定义"
                                :value="1">
                              </el-option>
                               <!-- <el-option
                                label="发起人所在"
                                :value="2">
                              </el-option> -->
                           </el-select>
                           <tag-select v-if="select_assignee_1.scopeType==1 && task_model.selectAssignee.type==1" :placeholder="'请选择机构或人员'" label="" style="width:250px;vertical-align: text-top;margin-top: -8px;" :initDataStr="select_assignee_1.dataVal" :initOptions="{selectType:'User-Role'}" @callBack="tagSelectCB($event)" :multiple="true" ></tag-select>
                           <el-select size="small" v-if="select_assignee_1.scopeType==2 && task_model.selectAssignee.type==1" v-model="select_assignee_1.orgLevel">
                              <el-option
                                v-show="item.text"
                                :key="index"
                                v-for="(item,index) in directionData.select_assigee_orglevelkv"
                                :label="item.text"
                                :value="item.id">
                              </el-option>
                           </el-select>
                          <!-- <tag-select v-if="task_model.select_asn_type==1" label="选择范围"></tag-select> -->
                          <cirle-select style="margin-top:20px;" v-if="task_model.selectAssignee.type==2" :initDataStr="selectOrgValue" :initOptions="{selectType:'User-Role'}" @callBack="selCallBack"></cirle-select>
                          <div v-if="task_model.selectAssignee.type==3" >
                            <div v-for="(item,index) in linkWFData" :key="index">
                              <div class="linkWFData">
                                <el-cascader

                                    size="medium"
                                    v-model="item.select_assignee_3.dParent"
                                    :options="directionData.select_assignee_3"
                                    style="width:200px;margin-top:20px;"
                                    @change="handleSelctAssignee($event,item,index)"
                                    :ref="'select_assignee_3_'+index"
                                    :props="{ disabled:'disabled1', label:'optionName',value:'optionId',children:'deriveItems'}"

                                  >
                                  <template slot-scope="{ node, data }">
                                    <span>{{ data.optionName }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                  </template>
                                </el-cascader>
                                <el-select  v-if="item.select_assignee_3.dParent && item.showOrgLevel" @change="orgLevelChange($event,item)" clearable size="medium" style="width: 160px;" v-model="item.select_assignee_3.orgLevel">
                                  <el-option
                                      :key="index"
                                      v-for="(item,index) in directionData.select_assigee_orglevelkv"
                                      :label="item.text?'所在'+item.text+'的':' '"
                                      :value="item.id">
                                      </el-option>
                                </el-select>
                                <el-select  v-if="( (item.select_assignee_3.orgLevel && item.select_assignee_3.orgLevel != '0') || !item.showOrgLevel)" size="medium" style="width: 160px;" v-model="item.select_assignee_3.roleNum" filterable>
                                  <el-option
                                      :key="index"
                                      v-for="(item,index) in directionData.select_assigee_rolekv"
                                      :label="item.text?item.text:' '"
                                      :value="item.id">
                                      </el-option>
                                </el-select>
                              </div>
                              <div class="deal">
                                  <i @click="addLinkWFData()" class="iconfont icon iconpluscircleo"></i>
                                  <i v-show="linkWFData.length > 1" @click="deleteLinkWFData(index)" class="iconfont icon iconclosecircleo"></i>
                              </div>
                            </div>
                        </div>
                      </div>
                    </el-form-item>
                 </div>
                  <el-form-item  class="formItem inline" size="medium">
                         <span style="color: #262626;" slot="label">环节审批人员必填
                            <el-tooltip class="item" effect="dark" placement="top">
                              <div slot="content">设置为审批环节时，该环节办理人员在办理时会出现是否同意选项和意见框，办理时需要给出审批决策及意见，并且需要关联对应的审批意见框用以显示意见信息，如果不是，则是个普通的填写表单的环节。</div>
                              <i class="iconfont icon iconbangzhu-kong"></i>
                            </el-tooltip>
                        </span>
                        <el-switch
                          v-model="task_model.asnNotnull" :active-value="1" :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item  class="formItem inline" size="medium">
                        <span style="color: #262626;" slot="label">是否审批环节
                          <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">设置为审批环节时，该环节办理人员在办理时会出现是否同意选项和意见框，办理时需要给出审批决策及意见，并且需要关联对应的审批意见框用以显示意见信息，如果不是，则是个普通的填写表单的环节。</div>
                            <i class="iconfont icon iconbangzhu-kong"></i>
                          </el-tooltip>
                      </span>
                      <el-switch
                        v-model="task_model.approvable" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item>
                  <el-form-item  v-show="task_model.approvable == 1" class="formItem" size="medium">
                        <div style="color: #262626;" slot="label">
                          显示该审批意见的审批意见框
                           <span class="xjspyj" style="display:none;">
                            <i class="iconfont icon iconxinjianwenjian"></i>
                            新建审批意见框
                          </span>
                        </div>
                        <el-select size="medium" v-model="task_model.apprDescItemId" style="width:100%;" clearable placeholder="--请选择意见框的位置--">
                             <el-option
                                :key="index"
                                v-for="(item,index) in directionData.approval_items"
                                :label="item.titleName"
                                :value="item.itemId">
                                </el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item  v-show="task_model.approvable == 1 && addCustomAppr" class="formItem" label="审批决策描述（选中为默认意见）" size="medium">
                       <div>
                          <label class="defaultAppr">
                            以下为同意的决策描述
                          </label>
                          <label class="defaultAppr">
                            以下为不同意的决策描述
                          </label>
                          <!-- <label v-for="(item,index) in defApprkv" :key="index" class="defaultAppr">
                            {{item.desc}}
                          </label> -->
                       </div>
                       <el-radio-group v-model="apprSelected">
                          <ul class="apprUl" v-show="agreeDesc.length>0 || disAgreeDesc.length>0">
                            <draggable :list="agreeDesc"  handle=".handle"  v-bind="dragOptions">
                              <transition-group type="transition" name="flip-list">

                                    <li class="apprLi" v-for="(item,index) in agreeDesc" :key="index+item.id">
                                        <el-radio :label="item.uuid">
                                          <el-input placeholder="请输入" v-model="item.text" size="medium">
                                            <template slot="append">
                                                <i class="icon iconfont icondelete1" @click="delAgreeItem(index)"></i>
                                                <i class="icon iconfont icondrag-handle handle"></i>
                                            </template>
                                          </el-input>
                                        </el-radio>

                                    </li>
                              </transition-group>
                            </draggable>
                          </ul>
                          <ul class="apprUl" v-show="disAgreeDesc.length>0 || agreeDesc.length>0 ">
                            <draggable :list="disAgreeDesc"  handle=".handle"  v-bind="dragOptions">
                                <transition-group type="transition" name="flip-list">
                                  <li class="apprLi" v-for="(item,index) in disAgreeDesc" :key="index+item.id">
                                      <el-radio :label="item.uuid">
                                        <el-input placeholder="请输入" v-model="item.text" size="medium">
                                          <template slot="append">
                                              <i class="icon iconfont icondelete1" @click="delDisAgreeItem(index)"></i>
                                              <i class="icon iconfont icondrag-handle handle"></i>
                                          </template>
                                        </el-input>
                                      </el-radio>

                                  </li>
                                </transition-group>
                            </draggable>
                          </ul>
                       </el-radio-group>
                       <div v-show="addCustomAppr">
                           <a class="apprBtn" @click="addAgreeBtn()">添加选项</a>
                           <a class="apprBtn" @click="addDisAgreeBtn()">添加选项</a>
                       </div>

                  </el-form-item>
                  <el-form-item  v-show="task_model.approvable == 1" class="formItem inline" label="允许意见征询" size="medium">
                      <el-switch
                        v-model="task_model.cosignable" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item>
                  <el-form-item  v-show="task_model.approvable == 1" class="formItem inline" label="允许转交办理" size="medium">
                      <el-switch
                        v-model="task_model.delegatable" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item>
                   <el-form-item  class="formItem" label="环节办理时限" size="medium">
                     <el-radio-group v-model="task_model.overtimeCat" >
                        <el-radio-button label="0" >自定义</el-radio-button>
                        <el-radio-button label="1">表单选择日期</el-radio-button>

                     </el-radio-group>
                     <div v-show="task_model.overtimeCat == 0" style="margin-top:15px;">
                        <label>流程到达后 </label>
                        <el-input style="display:inline-block;width:100px;" type="num" v-model="task_model.timeLimitNum"  :min=0 ></el-input>
                        <el-select v-model="task_model.timeLimitType" style="width:100px;">
                              <el-option
                                :key="index"
                                v-for="(item,index) in overTimeOp"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                        </el-select>
                      </div>
                      <div v-show="task_model.overtimeCat == 1" style="margin-top:15px;">
                        <el-select size="medium" v-model="task_model.overtimeItem" style="width:250px" clearable placeholder="请选择表单日期组件">
                            <el-option
                                :key="index"
                                v-for="(item,index) in directionData.datetime_items"
                                :label="item.titleName"
                                :value="item.itemId">
                                </el-option>
                        </el-select>
                      </div>
                  </el-form-item>

                  <!-- <el-form-item  class="formItem inline" label="允许抄送" size="medium">
                      <el-switch
                        v-model="task_model.duplicatable" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item> -->
                    <el-form-item  class="formItem" size="medium">
                     <div class="subItem">
                      <label style="display:inline-block;margin-right:20px;">催办提醒</label>
                      <el-switch
                        v-model="task_model.overtimeAlert" :active-value="1" :inactive-value="0" style="display:inline-block;">
                      </el-switch>
                     </div>
                      <div v-show="task_model.overtimeAlert == 1">
                          <div class="subItem">
                            <label>提醒方式</label>
                          </div>
                          <el-checkbox-group v-model="eventType_1.logicObj.alert_type">

                            <el-checkbox v-for="item in overtimeEventsOp" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
                          </el-checkbox-group>
                            <div class="subItem">
                              <label>提醒触发时间</label>
                            </div>
                            <div class="subItem">
                              <label>办理时限前</label>
                              <el-input style="display:inline-block;width:100px;" type="num" v-model="eventType_1.logicObj.alert_time.time_val"  :min=0 ></el-input>
                              <el-select v-model="eventType_1.logicObj.alert_time.time_unit" style="width:100px;">
                                    <el-option
                                      :key="index"
                                      v-for="(item,index) in overTimeOp"
                                      :label="item.name"
                                      :value="item.value">
                                      </el-option>
                              </el-select>
                              <div class="subItem">
                                <label>重复提醒</label>
                              </div>
                              <el-radio-group v-model="eventType_1.logicObj.alert_time.loop_type">

                                <el-radio v-for="item in overtimeLoopsOp" :label="item.value" :key="item.value">{{item.name}}</el-radio>
                              </el-radio-group>
                              <div class="subItem">
                                <div>
                                  <label>选择抄送人员</label>
                                </div>
                                <el-radio-group v-model="eventType_1.ccSetup.type">
                                  <el-radio-button label="2">指定人员或角色</el-radio-button>
                                  <el-radio-button label="3">关联流程数据</el-radio-button>
                                </el-radio-group>
                                <div>
                                    <cirle-select style="margin-top:20px;" v-if="eventType_1.ccSetup.type==2" :initDataStr="eventType_1.ccSetup.ccSetupOrgValue" :initOptions="{selectType:'User-Role'}" @callBack="eventType_1.ccSetup.ccSetupOrgValue = arguments[0].id"></cirle-select>
                                    <el-cascader
                                        v-if="eventType_1.ccSetup.type==3"
                                        size="medium"
                                        v-model="eventType_1.ccSetup.select_assignee_ccSetup.dParent"
                                        :options="directionData.select_assignee_3"
                                        style="width:200px;margin-top:20px;"
                                        @change="handleSelctAssigneeCCSetup($event,eventType_1.ccSetup,'select_assignee_eventType_1')"
                                        ref="select_assignee_eventType_1"
                                        :props="{ disabled:'disabled1', label:'optionName',value:'optionId',children:'deriveItems'}"

                                      >
                                      <template slot-scope="{ node, data }">
                                        <span>{{ data.optionName }}</span>
                                        <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                      </template>
                                    </el-cascader>
                                    <el-select  v-if="eventType_1.ccSetup.type==3 && eventType_1.ccSetup.select_assignee_ccSetup.dParent && eventType_1.ccSetup.showOrgLevel" @change="orgLevelSelctAssigneeCCSetupChange($event,'eventType_1')" clearable size="medium" style="width: 160px;" v-model="eventType_1.ccSetup.select_assignee_ccSetup.orgLevel">
                                      <el-option
                                          :key="'eventType_1'+index"
                                          v-for="(item,index) in directionData.select_assigee_orglevelkv"
                                        :label="item.text?item.id > 0?'所在'+item.text+'的':item.text:' '"
                                          :value="item.id">
                                          </el-option>
                                    </el-select>
                                      <el-select  v-if="eventType_1.ccSetup.type==3 && ((eventType_1.ccSetup.select_assignee_ccSetup.orgLevel && eventType_1.ccSetup.select_assignee_ccSetup.orgLevel != '0')|| !eventType_1.ccSetup.showOrgLevel)" size="medium" filterable style="width: 160px;" v-model="eventType_1.ccSetup.select_assignee_ccSetup.roleNum">
                                      <el-option
                                          :key="'eventType_1'+index"
                                          v-for="(item,index) in directionData.select_assigee_rolekv"
                                          :label="item.text?item.text:' '"
                                          :value="item.id">
                                          </el-option>
                                    </el-select>
                              </div>
                            </div>
                         </div>
                      </div>
                  </el-form-item>
                  <el-form-item  class="formItem" size="medium">
                      <div class="subItem">
                        <label style="display:inline-block;margin-right:20px;">超时处理</label>
                        <el-switch
                          v-model="task_model.overtimeAction" :active-value="1" :inactive-value="0">
                        </el-switch>
                      </div>
                      <div v-show="task_model.overtimeAction == 1">
                        <el-radio-group v-model="overtimeAction_type">

                          <el-radio v-for="item in overtimeActionTypeOp" :label="item.value" :key="item.value">{{item.name}}</el-radio>
                        </el-radio-group>
                        <div class="subItem" v-show="overtimeAction_type == 1">
                            <el-input type="textarea" :rows="4" placeholder="请填入自动办理意见，例如，因超时，系统默认同意。如果不填，那么流程办理时，办理意见文本是：超时自动同意" v-model="eventType_2.logicObj.appr_desc"></el-input>
                        </div>
                        <div class="subItem" v-show="overtimeAction_type == 2">
                           <el-select v-model="eventType_2.logicObj.target_task" style="width:200px;">
                                <el-option
                                    :key="index"
                                    v-for="(item,index) in taskList"
                                    :label="item.task_name?item.task_name:' '"
                                    :value="item.task_level">
                                    </el-option>
                           </el-select>
                        </div>
                        <div class="subItem">
                            <div>
                              <label>选择抄送人员</label>
                            </div>
                            <el-radio-group v-model="eventType_2.ccSetup.type">
                              <el-radio-button label="2">指定人员或角色</el-radio-button>
                              <el-radio-button label="3">关联流程数据</el-radio-button>
                            </el-radio-group>
                            <div>
                                <cirle-select style="margin-top:20px;" v-if="eventType_2.ccSetup.type==2" :initDataStr="eventType_2.ccSetup.ccSetupOrgValue" :initOptions="{selectType:'User-Role'}" @callBack="eventType_2.ccSetup.ccSetupOrgValue = arguments[0].id"></cirle-select>
                                <el-cascader
                                    v-if="eventType_2.ccSetup.type==3"
                                    size="medium"
                                    v-model="eventType_2.ccSetup.select_assignee_ccSetup.dParent"
                                    :options="directionData.select_assignee_3"
                                    style="width:200px;margin-top:20px;"
                                    @change="handleSelctAssigneeCCSetup($event,eventType_2.ccSetup,'select_assignee_eventType_2')"
                                    ref="select_assignee_eventType_2"
                                    :props="{ disabled:'disabled1', label:'optionName',value:'optionId',children:'deriveItems'}"

                                  >
                                  <template slot-scope="{ node, data }">
                                    <span>{{ data.optionName }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                  </template>
                                </el-cascader>
                                <el-select  v-if="eventType_2.ccSetup.type==3 && eventType_2.ccSetup.select_assignee_ccSetup.dParent && eventType_2.ccSetup.showOrgLevel" @change="orgLevelSelctAssigneeCCSetupChange($event,'eventType_2')" clearable size="medium" style="width: 160px;" v-model="eventType_2.ccSetup.select_assignee_ccSetup.orgLevel">
                                  <el-option
                                      :key="'eventType_2'+index"
                                      v-for="(item,index) in directionData.select_assigee_orglevelkv"
                                    :label="item.text?item.id > 0?'所在'+item.text+'的':item.text:' '"
                                      :value="item.id">
                                      </el-option>
                                </el-select>
                                  <el-select  v-if="eventType_2.ccSetup.type==3 && ((eventType_2.ccSetup.select_assignee_ccSetup.orgLevel && eventType_2.ccSetup.select_assignee_ccSetup.orgLevel != '0')|| !eventType_2.ccSetup.showOrgLevel)" size="medium" filterable style="width: 160px;" v-model="eventType_2.ccSetup.select_assignee_ccSetup.roleNum">
                                  <el-option
                                      :key="'eventType_2'+index"
                                      v-for="(item,index) in directionData.select_assigee_rolekv"
                                      :label="item.text?item.text:' '"
                                      :value="item.id">
                                      </el-option>
                                </el-select>
                            </div>
                          </div>
                      </div>
                  </el-form-item>
                   <!-- <el-form-item v-if="task_model.overtimeAlert == 1" class="formItem" label="超时提醒触发时间" size="medium">
                      <div>
                        <label>流程到达后 </label>
                        <el-input style="display:inline-block;width:100px;" type="num" v-model="task_model.timeLimitNum"  :min=0 ></el-input>
                        <el-select v-model="task_model.timeLimitType" style="width:100px;">
                              <el-option
                                :key="index"
                                v-for="(item,index) in overTimeOp"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                        </el-select>
                      </div>

                  </el-form-item>
                  <el-form-item  v-if="task_model.overtimeAlert == 1" class="formItem" label="超时提醒方式" size="medium">
                      <el-checkbox-group v-model="task_model.overtimeEvents_values">

                        <el-checkbox v-for="item in overtimeEventsOp" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item> -->
                  <el-form-item  class="formItem" label="经办方是角色时" size="medium">
                       <el-radio v-model="task_model.roleUserLogic" :label="0">不做额外处理</el-radio>
                       <el-radio v-model="task_model.roleUserLogic" :label="1" v-show="false">谁先点开谁跟进（抢单模式）</el-radio>
                       <el-radio v-model="task_model.roleUserLogic" :label="2">转为对应人员独立办理</el-radio>
                       <el-radio v-model="task_model.roleUserLogic" :label="3" v-show="false">由用户自主筛选对应人员</el-radio>
                  </el-form-item>
                  <el-form-item  class="formItem" label="审批人员为空时" size="medium">
                       <el-radio v-model="task_model.asnEmptyLogic" :label="1">交给系统管理员审批</el-radio>
                       <el-radio v-model="task_model.asnEmptyLogic" :label="2">流程启动者确认</el-radio>
                       <el-radio v-model="task_model.asnEmptyLogic" :label="3">自动进入下一环节</el-radio>
                       <el-radio v-model="task_model.asnEmptyLogic" :label="4">流程异常</el-radio>
                  </el-form-item>
                  <el-form-item  class="formItem" label="环节多人办理方式" size="medium">
                       <el-radio v-model="task_model.driveType" :label="2">或签（其中一人办理即可）</el-radio>
                       <el-radio v-model="task_model.driveType" :label="1">会签（同时到达办理）</el-radio>
                       <el-radio v-model="task_model.driveType" :label="3">顺序签（按选择人员顺序依次办理）</el-radio>
                       <el-radio v-model="task_model.driveType" :label="4">抢占签（谁先点开谁办理）</el-radio>
                  </el-form-item>
                  <!-- <el-form-item  class="formItem inline" label="调用UKEY印章批注" size="medium">
                      <el-switch
                        v-model="task_model.plgUkey" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item> -->
                  <el-form-item  class="formItem inline" label="允许附件盖章" size="medium">
                      <el-switch
                        v-model="task_model.fileSign" :active-value="1" :inactive-value="0">
                      </el-switch>
                  </el-form-item>
                  <el-form-item  class="formItem inline" label="附件在线编辑" size="medium">
                      <el-switch
                        v-model="task_model.editInfo.fileEditable" :active-value="1" :inactive-value="0">
                      </el-switch>
                      <div style="display:inline-block;" v-show="task_model.editInfo.fileEditable == 1">
                        <div class="switch-inline">
                          <label>
                              留痕
                          </label>
                        <el-switch
                          v-model="task_model.editInfo.editTrace" :active-value="1" :inactive-value="0">
                        </el-switch>
                        </div>
                        <div class="switch-inline">
                          <label>
                              套红印章
                          </label>
                          <el-switch
                            v-model="task_model.editInfo.editRedhead" :active-value="1" :inactive-value="0">
                          </el-switch>
                        </div>
                      </div>
                  </el-form-item>
                  <el-form-item  class="formItem" label="按钮显示" size="medium">
                    <el-checkbox-group v-model="extParam.showBtnGroup">

                        <el-checkbox v-for="item in btnGroupArray" :label="item.value" :key="item.value" style="font-weight: normal;">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item  class="formItem" label="业务标识" size="medium">
                      <el-select size="medium" v-model="task_model.bizTag" style="width:100%;" clearable placeholder="请选择">
                            <el-option
                              :key="index"
                              v-for="(item,index) in directionData.biz_tag"
                              :label="item.text"
                              :value="item.idString">
                              </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item class="formItem" label="备注" size="medium">
                    <el-input v-model="task_model.comments"></el-input>
                  </el-form-item>
                  <!-- <el-form-item class="formItem" label="操作提示" size="medium">
                    <el-input v-model="task_model.inst"></el-input>
                  </el-form-item> -->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="组件权限" name="second">
                 <div v-loading="loading">
                    <div class="quickItem">
                        <span style="margin-right:15px;color: #8b8b8b;">快速选择</span>
                        <el-checkbox-group @change="qxChange" v-model="itempvgqx">
                          <el-checkbox-button label="1" >操作</el-checkbox-button>
                          <el-checkbox-button label="2">只读</el-checkbox-button>
                          <el-checkbox-button label="3">隐藏</el-checkbox-button>
                        </el-checkbox-group>
                    </div>
                    <div class="hjItem" v-for="(item,index) in task_itempvg" :key="index">
                        <el-row>
                            <el-col :span=12>
                              <span style="color: #262626;">{{item.itemName}} <span style="font-size:12px;color:#8b8b8b;">[{{item.type_desc}}]</span></span>
                            </el-col>
                            <el-col :span=12 style="text-align:right;">
                              <el-checkbox-group @change="hjChange($event,item)" v-model="item.value">
                                  <el-checkbox-button label="1" >操作</el-checkbox-button>
                                  <el-checkbox-button label="2">只读</el-checkbox-button>
                                  <el-checkbox-button label="3">隐藏</el-checkbox-button>
                                </el-checkbox-group>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="环节选人权限" name="third">
                <div v-loading="loading">
                  <div class="quickItem">
                      <span style="margin-right:15px;color: #8b8b8b;">快速选择</span>
                      <el-checkbox-group @change="assigneqxChange" v-model="assigneqx">
                          <el-checkbox-button label="1" >操作</el-checkbox-button>
                          <el-checkbox-button label="2">只读</el-checkbox-button>
                      </el-checkbox-group>

                  </div>
                  <div class="hjItem" v-for="(item,index) in task_assigneepvg" :key="index">
                      <el-row>
                          <el-col :span=12>
                            <span style="color: #262626;">{{item.itemName}}</span>
                          </el-col>
                          <el-col :span=12 style="text-align:right;">
                            <el-checkbox-group @change="assignehjChange($event,item)" v-model="item.value">
                                <el-checkbox-button label="1" >操作</el-checkbox-button>
                                <el-checkbox-button label="2">只读</el-checkbox-button>
                              </el-checkbox-group>
                          </el-col>
                      </el-row>
                  </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="校验规则" name="fourth">
                <div v-loading="loading">
                    <div class="checkItem" v-for="(item,index) in checkItems" :key="index">
                        <p style="line-height: 40px;color: #262626;">校验规则 {{index+1}}  <i @click="deleteCheckItem(index)" class="iconfont icon iconclosecircleo" style="color:#1ba5fa;"></i>
                        </p>
                        <div class="checkOption">
                          <div>
                              <p style="line-height: 40px;"><span>校验条件</span></p>
                              <op-check :data="item.logicSet"></op-check>
                          </div>
                        </div>
                        <div>
                          <p style="line-height: 40px;color: #262626;">提示描述</p>
                          <div v-if="item.changeContent || item.cnModel != '0'" style="display:inline-block;">
                            <el-select size="medium" v-model="item.cnModel"  @change="contentFromSelect($event,item)">
                              <el-option v-for="(item,index) in contentFromOp" :key="index"

                                :label="item.optionName"
                                :value="item.mdId">

                              </el-option>
                            </el-select>
                            <el-input class="pointerCalss" size="medium" type="text" style="width: 200px;" readonly v-model="item.cnName" @click.native="needIngItem=item;selectConnector(3)">

                            </el-input>
                          </div>
                          <el-input v-else style="width:500px;" size="medium" v-model="item.content"></el-input>
                          <div class="qiehuan" @click="changeContentFrom(item)">
                              <i class="iconfont icon iconqiehuan"></i>
                          </div>
                        </div>
                    </div>
                    <div class="opCheck">
                        <div class="btn-line">
                              <el-button size="medium" @click="addCheckItem(checkItems)" type="text"><i class="iconfont icon iconicon-test"></i> 添加校验规则</el-button>
                          </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="isCustomer">
            <el-tab-pane label="基本属性" name="first">
              <el-form  ref="taskModelForm" :label-position="'top'" :rules="rules" :show-message="false" label-width="80px" :model="task_model">
                 <div class="multipleformItem">
                    <el-form-item  size="medium" prop="taskName">
                      <span style="color: #262626;" slot="label">环节名称
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-input v-model="task_model.taskName"></el-input>
                    </el-form-item>
                    <el-form-item  size="medium">
                      <span style="color: #262626;" slot="label">选择办理人员
                        <el-tooltip class="item" effect="dark" content="环节名称，最大限制50字" placement="top">
                          <div slot="content">当前环节办理人员的确定方式。有三<br/>种选择方式：1）环节动态选择；2）<br/>指定人员或角色；3）关联流程数据</div>
                          <i class="iconfont icon iconbangzhu-kong"></i>
                        </el-tooltip>
                      </span>
                      <el-radio-group v-model="task_model.selectAssignee.type" @change="selectTypeChange">
                        <el-radio-button label="1" >环节动态选择</el-radio-button>
                        <el-radio-button label="2">指定人员或角色</el-radio-button>
                        <el-radio-button label="3">关联流程数据</el-radio-button>
                      </el-radio-group>
                      <div>
                        <div v-if="task_model.selectAssignee.type==1" >
                          选择范围
                        </div>
                          <el-select size="small" v-if="task_model.selectAssignee.type==1" v-model="select_assignee_1.scopeType">
                            <el-option
                              label="自定义"
                              :value="1">
                            </el-option>
                              <!-- <el-option
                              label="发起人所在"
                              :value="2">
                            </el-option> -->
                          </el-select>
                          <tag-select v-if="select_assignee_1.scopeType==1 && task_model.selectAssignee.type==1" :placeholder="'请选择机构或人员'" label="" style="width:250px;vertical-align: text-top;margin-top: -8px;" :initDataStr="select_assignee_1.dataVal" :initOptions="{selectType:'User-Role'}" @callBack="tagSelectCB($event)" :multiple="true" ></tag-select>
                          <el-select size="small" v-if="select_assignee_1.scopeType==2 && task_model.selectAssignee.type==1" v-model="select_assignee_1.orgLevel">
                            <el-option
                              v-show="item.text"
                              :key="index"
                              v-for="(item,index) in directionData.select_assigee_orglevelkv"
                              :label="item.text"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        <!-- <tag-select v-if="task_model.select_asn_type==1" label="选择范围"></tag-select> -->
                        <cirle-select style="margin-top:20px;" v-if="task_model.selectAssignee.type==2" :initDataStr="selectOrgValue" :initOptions="{selectType:'User-Role'}" @callBack="selCallBack"></cirle-select>
                        <div v-if="task_model.selectAssignee.type==3" >
                            <div v-for="(item,index) in linkWFData" :key="index">
                              <div class="linkWFData">
                                <el-cascader

                                    size="medium"
                                    v-model="item.select_assignee_3.dParent"
                                    :options="directionData.select_assignee_3"
                                    style="width:200px;margin-top:20px;"
                                    @change="handleSelctAssignee($event,item,index)"
                                    :ref="'select_assignee_3_'+index"
                                    :props="{ disabled:'disabled1', label:'optionName',value:'optionId',children:'deriveItems'}"

                                  >
                                  <template slot-scope="{ node, data }">
                                    <span>{{ data.optionName }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.deriveItems.length }}) </span>
                                  </template>
                                </el-cascader>
                                <el-select  v-if="item.select_assignee_3.dParent && item.showOrgLevel" @change="orgLevelChange($event,item)" clearable size="medium" style="width: 160px;" v-model="item.select_assignee_3.orgLevel">
                                  <el-option
                                      :key="index"
                                      v-for="(item,index) in directionData.select_assigee_orglevelkv"
                                      :label="item.text?'所在'+item.text+'的':' '"
                                      :value="item.id">
                                      </el-option>
                                </el-select>
                                <el-select  v-if="( (item.select_assignee_3.orgLevel && item.select_assignee_3.orgLevel != '0') || !item.showOrgLevel)" size="medium" style="width: 160px;" filterable v-model="item.select_assignee_3.roleNum">
                                  <el-option
                                      :key="index"
                                      v-for="(item,index) in directionData.select_assigee_rolekv"
                                      :label="item.text?item.text:' '"
                                      :value="item.id">
                                      </el-option>
                                </el-select>
                              </div>
                              <div class="deal">
                                  <i @click="addLinkWFData()" class="iconfont icon iconpluscircleo"></i>
                                  <i v-show="linkWFData.length > 1" @click="deleteLinkWFData(index)" class="iconfont icon iconclosecircleo"></i>
                              </div>
                            </div>
                        </div>
                    </div>
                  </el-form-item>
                </div>
                <el-form-item  class="formItem" label="环节多人办理方式" size="medium">
                    <el-radio v-model="task_model.driveType" :label="2">或签（其中一人办理即可）</el-radio>
                    <el-radio v-model="task_model.driveType" :label="1">会签（同时到达办理）</el-radio>
                    <el-radio v-model="task_model.driveType" :label="3" v-show="false">顺序签（按选择人员顺序依次办理）</el-radio>
                </el-form-item>
                <el-form-item  class="formItem" label="业务标识" size="medium">
                    <el-select size="medium" v-model="task_model.bizTag" style="width:100%;" clearable placeholder="请选择">
                        <el-option
                          :key="index"
                          v-for="(item,index) in directionData.biz_tag"
                          :label="item.text"
                          :value="item.idString">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="formItem" label="备注" size="medium">
                  <el-input v-model="task_model.comments"></el-input>
                </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import tagSelect from './tagSelect.vue'
import opCheck from './opCheck.vue'
import {updateWorkTaskModel,getRenderTaskItempvg,getRenderTaskAssigneepvg,getRenderTaskInspectform,updateTaskItempvg,updateTaskInspectform} from '../../../service/service.js'
import cirleSelect from './cirleSelect.vue'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'
import draggable from "../../../assets/js/vuedraggable";
export default{
  name:'dirctionAttr',
  data(){
    return {
        activeName:"first",
        task_model:{

        },
        checkItems:[],
        task_itempvg:[],
        task_assigneepvg:[],
        rules: {
          taskName: [
            { required: true,  trigger: 'blur' },
            { max: 50, trigger: 'blur' }
          ],
        },
        itempvgqx:[],
        assigneqx:[],
        isEdit:false,
        loading:false,
        select_assignee_3:{
          lgId:"0",
          mdId:"",
          dataId:"",
          dParent:'',
          orgLevel:"0",
          roleNum:''
        },
        select_assignee_1:{
          lgId:"0",
          scopeType:1,
          dataId:"",
          dParent:"",
          dataVal:"",
          orgLevel:""
        },
        showOrgLevel:true,
        selectOrgValue:"",
         //选人属性
         overTimeOp:[
           {
             name:"天",
             value:1,
           },
           {
             name:"小时",
             value:2,
           },
           {
             name:"分钟",
             value:3,
           }
         ],
         overtimeEventsOp:[
           {
             name:"钉钉",
             value:"DINGDING"
           },
           {
             name:"SMS",
             value:"SMS"
           }
         ],
         btnGroupArray:[
           {
             name:"流程图",
             value:"flowChart"
           },
           {
             name:"历史列表",
             value:"history"
           },
           {
             name:"打印流程",
             value:"printWf"
           },
         ],
          overtimeLoopsOp:[
           {
             name:"永不",
             value:"0"
           },
            {
             name:"每天",
             value:"1"
           },
            {
             name:"每周",
             value:"2"
           },
            {
             name:"每月",
             value:"3"
           },{
             name:"每年",
             value:"4"
           },
         ],
         contentFromOp:[
           {
              mapType: 3,
              mdId: "3",
              modelType: "DATAMODEL_API",
              optionId: "3",
              optionName: "API关联",
              orderId: 0,
           }
         ],
         needIngItem:{},//当前api需要回写的项,
         defApprkv:[],
         addCustomAppr:false,
         agreeDesc:[],
         disAgreeDesc:[],
         dragOptions:{
             animation: 200,
             group: "description",
             disabled: false,
             ghostClass: "ghost",
        },
        apprSelected:"",
          eventType_1:{
          logicObj:{
            alert_type:['DINGDING'],
            alert_time:{
              time_unit:1,
              time_val:0,
              loop_type:"0"
            }
          },
          ccSetup:{
            type:"2",
            logicStr:"",
            showOrgLevel:true,
            select_assignee_ccSetup:{
                lgId:"0",
                mdId:"",
                dataId:"",
                dParent:'',
                orgLevel:'0',
                roleNum:''
            },
            ccSetupOrgValue:""
          }
        },
        eventType_2:{
          logicObj:{
            appr_code:"1#0",
            appr_desc:"",
            target_task:""
          },
          ccSetup:{
            type:"2",
            logicStr:"",
             showOrgLevel:true,
             select_assignee_ccSetup:{
                 lgId:"0",
                mdId:"",
                dataId:"",
                dParent:'',
                orgLevel:'0',
                roleNum:''
            },
            ccSetupOrgValue:""
          }
        },

        overtimeActionTypeOp:[{
             name:"自动处理",
             value:"1"
        },{
             name:"跳转指定环节",
             value:"2"
        },{
             name:"流程异常",
             value:"3"
        }],
        overtimeAction_type:"1",
        taskList:[],//任务环节列表
        extParam:{},
        linkWFData:[]//关联流程数据
    }
  },
  components:{
    tagSelect,
    cirleSelect,
    opCheck,
    draggable
  },
   props:{
        dialogVisible: {
            type: Boolean
        },
        roleObj: {
            type: Object

        }
    },
  created(){
      this.init();
  },
  mounted(){

       this.bindAction();
  },
  computed:{
      ...mapState([
        'directionData',
        'operate_id'
    ]),
    isCustomer(){
      return !this.roleObj.sysAdmin && this.roleObj.branchDeptEnabled;
    }
  },
  methods: {
    bindAction(){
        let this_ = this;
        let callBackDialogFunc = function(obj){
            if(obj && obj.action == 'selectConnector' ){
                if(obj.flag == 3){//左边选择
                    this_.needIngItem.cnName = obj.data.paramName;
                    this_.needIngItem.cnItem = obj.data.paramId?obj.data.paramId:obj.data.paramDataId?obj.data.paramDataId:"";
                }
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'workDirection');
      },
      init(){
        this.loading = true;
        this.getRenderTaskInspectformFunc();
        this.task_model = this.directionData.task_model;
        this.defApprkv = this.directionData.def_apprkv;
        this.selectOrgValue = this.task_model.selectAssignee.type==2 && this.task_model.selectAssignee.logicList.length>0? this.task_model.selectAssignee.logicList[0].target:"";
        if(typeof this.selectOrgValue != "string"){
          this.selectOrgValue = "";
        }
        if(!this.task_model.timeLimitNum){
          this.task_model.timeLimitNum = 2;
        }
        if(!this.task_model.timeLimitType){
          this.task_model.timeLimitType = 1;
        }
        // this.$set(this.task_model,"overtimeEvents_values",[]);
        // if(!this.task_model.overtimeEvents || (this.task_model.overtimeEvents.length>0 && this.task_model.overtimeEvents[0].logicDesc != "{}")){
        // this.$set(this.task_model,"overtimeEvents_values",['dingding']);
        // }
        this.task_model.apprDescItemId = this.task_model.apprDescItemId == 0? "":this.task_model.apprDescItemId;
        this.select_assignee_3.mdId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].mdId:"";
        this.select_assignee_3.dParent = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
        this.select_assignee_3.dataId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
        if( this.task_model.selectAssignee.type==3 && this.task_model.selectAssignee.logicList.length>0){
          this.task_model.selectAssignee.logicList.forEach(element => {
            let target = element.target;
            let select_assignee_3 = {
              lgId:"0",
              mdId:"",
              dataId:"",
              dParent:'',
              orgLevel:"0",
              roleNum:''
            }
            select_assignee_3.mdId = target.mdId;
            select_assignee_3.lgId = target.lgId;
            select_assignee_3.dataId = target.dataId;
            select_assignee_3.dParent = target.dParent.split(',');
            select_assignee_3.orgLevel = target.orgLevel;

            select_assignee_3.roleNum = target.roleNum;
            let item = {
              select_assignee_3:select_assignee_3,
              showOrgLevel:true
            }
            if(target.orgLevel == 0 && target.roleNum !=0){
                item.showOrgLevel = false;
            }
            this.linkWFData.push(item);
          });

        }else{
          let linkWF_obj = {
            showOrgLevel:this.showOrgLevel,
            select_assignee_3:this.select_assignee_3
          }
          this.linkWFData.push(linkWF_obj);
        }


         if( this.task_model.selectAssignee.type==1){
           let target = this.task_model.selectAssignee.logicList[0].target;
           if(target){
              this.select_assignee_1.lgId = target.lgId;
              this.select_assignee_1.dParent = "";
              if(target.orgLevel){
                  this.select_assignee_1.orgLevel = target.orgLevel;
              }else{
                this.select_assignee_1.orgLevel = this.directionData.select_assigee_orglevelkv.length>0?this.directionData.select_assigee_orglevelkv[0].id == 0 && this.directionData.select_assigee_orglevelkv.length>1?this.directionData.select_assigee_orglevelkv[1].id:"":"";
              }
              this.select_assignee_1.dataVal = target.dataVal;
              this.select_assignee_1.scopeType = target.scopeType == 0 ? 1:target.scopeType;
           }

         }
        ///超时规则
         this.initEventData('eventType_1');
         this.initEventData('eventType_2');
         this.task_model.overtimeItem = this.task_model.overtimeItem == 0? "": this.task_model.overtimeItem;
         if(this.task_model.overtimeEvents && this.task_model.overtimeEvents.length >0){
            this.task_model.overtimeEvents.forEach(element => {
                if(element.eventType == 1){
                  this.putEventData('eventType_1',element);
                }else {
                  this.putEventData('eventType_2',element);
                }
                if(element.eventType == 3){
                  this.overtimeAction_type = "2";
                }
            });
         }
         if(this.directionData.default_strategy){
           //超时规则
           if(this.directionData.default_strategy.overtimeTask){
              this.overtimeAction_type = (this.directionData.default_strategy.overtimeTask - 1) + "";
           }
         }
         this.taskList = this.directionData.task_list?JSON.parse(this.directionData.task_list):[];
         this.addCustomAppr = true;
         if(this.addCustomAppr && this.task_model.hasOwnProperty("apprKV")){
              let apprKV = this.task_model.apprKV;
              if(apprKV&& apprKV.length>0){
                  for(let i = 0;i<apprKV.length;i++){
                    let item = apprKV[i];
                    if(!item.hasOwnProperty("uuid")){
                      item.uuid = EcoUtil.getUID();
                    }
                    if(item.selected == 1){
                      this.apprSelected = item.uuid;
                    }
                    if(item.id == 1){
                        this.agreeDesc.push(item);
                    }else if (item.id == 0){
                        this.disAgreeDesc.push(item);
                    }
                  }
              }else{
                let agreeObj = {
                  id:1,
                  idString:"1#0",
                  text:this.defApprkv[0].text,
                  uuid:EcoUtil.getUID(),
                  comments:"0"
                }
                this.agreeDesc.push(agreeObj);
                let disAgreeObj = {
                  id:0,
                  idString:"0#0",
                  uuid:EcoUtil.getUID(),
                  text:this.defApprkv[1].text,
                  comments:"0"
                }
                this.disAgreeDesc.push(disAgreeObj);
              }
         }
         if(!this.task_model.extParam){
             //默认全部选中
             this.extParam = {};
             this.$set(this.extParam,'showBtnGroup',['flowChart','history','printWf']);

         }else{
           this.extParam = JSON.parse(this.task_model.extParam);
           if(!this.extParam.hasOwnProperty('showBtnGroup')){
             this.$set(this.extParam,'showBtnGroup',['flowChart','history','printWf']);
           }
         }
      },
       initEventData(key){
          this[key].ccSetup.select_assignee_ccSetup.mdId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].mdId:"";
          this[key].ccSetup.select_assignee_ccSetup.dParent = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
          this[key].ccSetup.select_assignee_ccSetup.dataId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
      },
      putEventData(key,item){
        if(item.logicDesc){
          this[key].logicObj = JSON.parse(item.logicDesc);
        }
        if(item.ccSetup){
          this[key].ccSetup = Object.assign({},this[key].ccSetup,item.ccSetup);
          this[key].ccSetup.ccSetupOrgValue = this[key].ccSetup.type==2  && this[key].ccSetup.logicList && this[key].ccSetup.logicList.length>0? this[key].ccSetup.logicList[0].target:"";
          if(this[key].ccSetup.type==3 && this[key].ccSetup.logicList && this[key].ccSetup.logicList.length>0){
            let target = this[key].ccSetup.logicList[0].target;
            this[key].ccSetup.select_assignee_ccSetup.mdId = target.mdId;
            this[key].ccSetup.select_assignee_ccSetup.lgId = target.lgId;
            this[key].ccSetup.select_assignee_ccSetup.dataId = target.dataId;
            this[key].ccSetup.select_assignee_ccSetup.dParent = target.dParent.split(',');
            this[key].ccSetup.select_assignee_ccSetup.orgLevel = target.orgLevel;

            this[key].ccSetup.select_assignee_ccSetup.roleNum = target.roleNum;
            if(target.orgLevel == 0 && target.roleNum !=0){
                 this[key].ccSetup.showOrgLevel = false;
            }
          }else{
             this[key].ccSetup.showOrgLevel = true;
             this[key].ccSetup.select_assignee_ccSetup = {
                lgId:"0",
                mdId:"",
                dataId:"",
                dParent:'',
                orgLevel:'0',
                roleNum:''
            };
            this.initEventData(key);
          }
        }
      },
      hideDialog(){
          this.$emit('hideDialog');
      },
       handleClick(tab, event) {
          if(tab.name === "second" &&  this.task_itempvg.length == 0 ){
              this.loading = true;
              this.getRenderTaskItempvgFunc();
          }else if(tab.name === "third" && this.task_assigneepvg.length == 0 ){
              this.loading = true;
              this.getRenderTaskAssigneepvgFunc();
          }else if(tab.name === "fourth" &&  this.checkItems.length == 0 ){
              // this.loading = true;
              // this.getRenderTaskInspectformFunc();
          }
      },
      selectTypeChange(value){
          if(value == 2){

          }
      },
      getRenderTaskItempvgFunc(){
        getRenderTaskItempvg(this.operate_id).then((response) => {
            this.loading = false;
            if(response.data.status<100){
                this.task_itempvg = response.data.remap.pvg;

                this.task_itempvg.forEach(item => {
                  let value = [];
                  if(item.editable == 1){
                      value.push("1");
                  }
                  if(item.isreadonly == 1){
                      value.push("2");
                  }
                  if(item.hidden == 1){
                      value.push("3");
                  }
                  this.$set(item,'value',value);
                });
              if(this.task_itempvg.every( item => item.value.indexOf("1")>-1)){
                  this.itempvgqx.push("1");
              }
              if(this.task_itempvg.every( item => item.value.indexOf("2")>-1)){
                    this.itempvgqx.push("2");

              }
              if(this.task_itempvg.every( item => item.value.indexOf("3")>-1)){
                    this.itempvgqx.push("3");
              }

            }
        }).catch((error) => {
          this.loading = false;
        });
      },
      getRenderTaskAssigneepvgFunc(){
          getRenderTaskAssigneepvg(this.operate_id).then((response) => {
            this.loading = false;
            if(response.data.status<100){
                this.task_assigneepvg = response.data.remap.pvg;
                // if(this.task_assigneepvg.every( item => item.value == 1)){
                //      this.assigneqx = 1;
                // }else if(this.task_assigneepvg.every( item => item.value == 2)){
                //      this.assigneqx = 2;
                // }else if(this.task_assigneepvg.every( item => item.value == 3)){
                //      this.assigneqx = 3;
                // }else{
                //      this.assigneqx = 0;
                // }
                this.task_assigneepvg.forEach(item => {
                  let value = [];
                  if(item.editable == 1){
                      value.push("1");
                  }
                  if(item.isreadonly == 1){
                      value.push("2");
                  }

                  this.$set(item,'value',value);
                });
              if(this.task_assigneepvg.every( item => item.value.indexOf("1")>-1)){
                  this.assigneqx.push("1");
              }
              if(this.task_assigneepvg.every( item => item.value.indexOf("2")>-1)){
                    this.assigneqx.push("2");

              }


            }
        }).catch((error) => {
          this.loading = false;
        });
      },
      getRenderTaskInspectformFunc(){
          getRenderTaskInspectform(this.operate_id).then((response) => {
            this.loading = false;
            if(response.data.status<100){
                this.checkItems = response.data.remap.inspectform;
            }
          }).catch((error) => {
            this.loading = false;
          });
      },
      hjChange(value,item){
        //  if(value == 1){
        //     item.editable = 1;
        //     item.isreadonly = 0;
        //     item.hidden = 0;
        //  }else if(value == 2){
        //     item.editable = 0;
        //     item.isreadonly = 1;
        //     item.hidden = 0;
        //  }else if(value == 3){
        //     item.editable = 0;
        //     item.isreadonly = 0;
        //     item.hidden = 1;
        //  }
        if(value.indexOf("1")==-1 && value.indexOf("2") == -1){
            item.value.push("2");
            this.$nextTick(() => {
              if(this.task_itempvg.every( item => item.value.indexOf("2")>-1)){
                  if(this.itempvgqx.indexOf("2") == -1){
                        this.itempvgqx.push("2");
                  }
              }
            });
        }
        if(this.task_itempvg.every( item => item.value.indexOf("1")>-1)){
               if(this.itempvgqx.indexOf("1") == -1){
                    this.itempvgqx.push("1");
               }
        }else{
              if(this.itempvgqx.indexOf("1")>-1){
                  this.itempvgqx.splice(this.itempvgqx.indexOf("1"),1);
              }
        }
        if(this.task_itempvg.every( item => item.value.indexOf("2")>-1)){
              if(this.itempvgqx.indexOf("2") == -1){
                    this.itempvgqx.push("2");
               }
        }else{
              if(this.itempvgqx.indexOf("2")>-1){
                  this.itempvgqx.splice(this.itempvgqx.indexOf("2"),1);
              }
        }
        if(this.task_itempvg.every( item => item.value.indexOf("3")>-1)){
              if(this.itempvgqx.indexOf("3") == -1){
                    this.itempvgqx.push("3");
               }
        }else{
              if(this.itempvgqx.indexOf("3")>-1){
                  this.itempvgqx.splice(this.itempvgqx.indexOf("3"),1);
              }
        }

      },
      qxChange(value){
          // console.log(value);
          // this.task_itempvg.forEach(item => {
          //   item.value = item.value.concat(value)
          // });
      },
      assignehjChange(value,item){

        if(this.task_assigneepvg.every( item => item.value.indexOf("1")>-1)){
               if(this.assigneqx.indexOf("1") == -1){
                    this.assigneqx.push("1");
               }
        }else{
              if(this.assigneqx.indexOf("1")>-1){
                  this.assigneqx.splice(this.assigneqx.indexOf("1"),1);
              }
        }

        if(this.task_assigneepvg.every( item => item.value.indexOf("2")>-1)){
              if(this.assigneqx.indexOf("2") == -1){
                    this.assigneqx.push("2");
               }
        }else{
              if(this.assigneqx.indexOf("2")>-1){
                  this.assigneqx.splice(this.assigneqx.indexOf("2"),1);
              }
        }

        // if(this.task_assigneepvg.every( item => item.value == 1)){
        //     this.assigneqx = 1;
        // }else if(this.task_assigneepvg.every( item => item.value == 2)){
        //     this.assigneqx = 2;
        // }else if(this.task_assigneepvg.every( item => item.value == 3)){
        //     this.assigneqx = 3;
        // }else{
        //     this.assigneqx = 0;
        // }
      },
      assigneqxChange(value){
          // this.task_assigneepvg.forEach(item => {
          //   item.value = value;
          // });
      },
      addCheckItem(){
          this.checkItems.push({content:"",cnModel:"0",logicSet:[]});
      },
      deleteCheckItem(index){
           this.checkItems.splice(index,1);
      },
      selCallBack(data){
          this.selectOrgValue = data.id;
      },
       async save(){
        let valid = true;
        this.$refs['taskModelForm'].validate((result) => {
          valid = result;
        });
        if(this.task_model.selectAssignee.type == 2 && !this.selectOrgValue){
           valid = false;
           this.$notify.error({
            title: '错误',
            message: '请选择人员'
          });
        }
        if(!valid) return;
        this.isEdit = false;
        this.task_model.operate_id = this.operate_id;
        this.task_model.select_asn_type = this.task_model.selectAssignee.type;
        this.task_model.select_asn_lg = 0; //暂时默认写死
        if(this.task_model.select_asn_type == 1){
            this.task_model.select_asn_val = "0@"+JSON.stringify(this.select_assignee_1);
        }
        if(this.task_model.select_asn_type == 2){
            this.task_model.select_asn_val =  this.selectOrgValue;
        }
        if(this.task_model.select_asn_type == 3){
            let select_asn_val_array = [];
            this.linkWFData.forEach(element => {
              if(typeof element.select_assignee_3.dParent == "object"){
                element.select_assignee_3.dParent = element.select_assignee_3.dParent.join(',');
              }
              if(!element.select_assignee_3.roleNum){
                  element.select_assignee_3.roleNum = '';
              }
              select_asn_val_array.push("0@"+JSON.stringify(element.select_assignee_3));
            });

            this.task_model.select_asn_val = select_asn_val_array.join('^');
        }
        this.$emit('saveLoading');

        let itempvgData = {
            operate_id:this.operate_id
        }
        this.task_itempvg.forEach(item => {
            let array  = ['0','0','0']
            if(item.value.indexOf('1')>-1){
               array[0] = '1';
            }
            if(item.value.indexOf('2')>-1){
               array[1] = '1';
            }
             if(item.value.indexOf('3')>-1){
               array[2] = '1';
            }
            let str_ = array.join('-');
            itempvgData[item.itemId] = str_;
        });
        this.task_assigneepvg.forEach(item => {
            let array  = ['0','0','0']
            if(item.value.indexOf('1')>-1){
               array[0] = '1';
            }
            if(item.value.indexOf('2')>-1){
               array[1] = '1';
            }
            let str_ = array.join('-');
            itempvgData[item.itemId] = str_;

        });
        // let overtimeEvents = {};
        // this.task_model.overtimeEvents_values.forEach(item => {
        //     overtimeEvents[item] = 1;
        // });
        // let overtime_events = [];
        // let overtimeEvents_all = {};
        // overtimeEvents_all.eventType = 1;
        // overtimeEvents_all.logicDesc = JSON.stringify(overtimeEvents);
        // overtime_events.push(overtimeEvents_all);
        // this.task_model.overtime_events = JSON.stringify(overtime_events);
        await updateTaskItempvg(itempvgData).then((response) => {
           if(response.data.status <100){

            }
        }).catch((error) => {
             this.$emit('closeSaveLoading');
        });
        for(let i=0;i<this.checkItems.length;i++){
            let logicSet = this.checkItems[i].logicSet;
            logicSet.forEach(item => {
              let logicConds = item.logicConds;
              EcoUtil.deleteAttrInObject(item,'');
              logicConds.forEach(element => {
                EcoUtil.deleteAttrInObject(element,'APPR_ITEMS,TASK_ITEMS,changeFormItem,formula,l_parent_temp,r_item_temp,r_parent_temp,R_TASK_ITEMS,APPrItemS,showRightApiInput,showLeftTaskItems,showRightTaskItems');
              });
          });
        }
        let InspectformData = {
            operate_id:this.operate_id,
            inspectform_conds: JSON.stringify(this.checkItems)
        }
        await updateTaskInspectform(InspectformData).then((response) => {


        }).catch((error) => {

        });
        if(this.addCustomAppr){
          let array_ = [];
          if(this.agreeDesc.length>0){
            for(let i =0;i<this.agreeDesc.length;i++){

               let item = this.agreeDesc[i];
               if(item.uuid == this.apprSelected){
                 item.selected = 1;
               }else{
                 item.selected = 0;
               }
               item.idString = "1#"+i;
               item.comments = i+"";
               array_.push(item);
            }
            for(let i =0;i<this.disAgreeDesc.length;i++){
               let item = this.disAgreeDesc[i];
               if(item.uuid == this.apprSelected){
                 item.selected = 1;;
               }else{
                 item.selected = 0;
               }
               item.idString = "0#"+i;
               item.comments = i+"";
               array_.push(item);
            }
          }
          this.task_model.appr_kv = array_.length>0?JSON.stringify(array_):undefined;
        }
        this.task_model.ext_param = JSON.stringify(this.extParam);
        let overtime_events = [];
        if(this.task_model.overtimeAlert == 1){
          let obj = {
            eventType:1,
            logicDesc:"",
            ccSetup:""
          }

          obj.logicDesc = this.eventType_1.logicObj;
          let ccSetup = {
            type:"",
            logicStr:""
          }
          ccSetup.type = this.eventType_1.ccSetup.type;
          if(ccSetup.type == 2){
            ccSetup.logicStr = this.eventType_1.ccSetup.ccSetupOrgValue;
          }else if(ccSetup.type == 3){
            if(typeof this.eventType_1.ccSetup.select_assignee_ccSetup.dParent == "object"){
              this.eventType_1.ccSetup.select_assignee_ccSetup.dParent = this.eventType_1.ccSetup.select_assignee_ccSetup.dParent.join(',');
            }
            if(!this.eventType_1.ccSetup.select_assignee_ccSetup.roleNum){
                this.eventType_1.ccSetup.select_assignee_ccSetup.roleNum = '';
            }
            ccSetup.logicStr = "0@"+JSON.stringify(this.eventType_1.ccSetup.select_assignee_ccSetup);

          }
          obj.ccSetup = ccSetup;
          overtime_events.push(obj);
        }
        if(this.task_model.overtimeAction == 1){
          let obj = {
            eventType:2,
            logicDesc:"",
            ccSetup:""
          }
          if(this.overtimeAction_type == 2){
            obj.eventType = 3;
          }
          if(this.overtimeAction_type == 3){
            obj.eventType = 4;
          }
          obj.logicDesc = this.eventType_2.logicObj;
          let ccSetup = {
            type:"",
            logicStr:""
          }
          ccSetup.type = this.eventType_2.ccSetup.type;
          if(ccSetup.type == 2){
            ccSetup.logicStr = this.eventType_2.ccSetup.ccSetupOrgValue;
          }else if(ccSetup.type == 3){
            if(typeof this.eventType_2.ccSetup.select_assignee_ccSetup.dParent == "object"){
              this.eventType_2.ccSetup.select_assignee_ccSetup.dParent = this.eventType_2.ccSetup.select_assignee_ccSetup.dParent.join(',');
            }
            if(!this.eventType_2.ccSetup.select_assignee_ccSetup.roleNum){
                this.eventType_2.ccSetup.select_assignee_ccSetup.roleNum = '';
            }
            ccSetup.logicStr = "0@"+JSON.stringify(this.eventType_2.ccSetup.select_assignee_ccSetup);

          }
          obj.ccSetup = ccSetup;
          overtime_events.push(obj);
        }

        this.task_model.overtime_events = JSON.stringify(overtime_events);
        await updateWorkTaskModel(this.task_model).then((response) => {
            this.$emit('closeSaveLoading');
            if(response.data.status <100){
                this.$emit('closeSaveLoading',this.task_model.taskName);
                this.$message({
                    showClose: true,
                    duration:2000,
                    message: '保存成功',
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.isEdit = false;

            }
        }).catch((error) => {
            this.$emit('closeSaveLoading');
        });

      },
      handleSelctAssignee(value,item,index){
          let node = this.$refs["select_assignee_3_"+index][0].getCheckedNodes()[0].data;
          item.select_assignee_3.mdId = node.mdId;
          item.select_assignee_3.roleNum = '';
          item.select_assignee_3.orgLevel = '0';
          item.select_assignee_3.dataId = value[value.length-1];
          item.showOrgLevel = true;
          if(node.hasOwnProperty('orgSelectStatement') && node.orgSelectStatement.catEnum == "DEPT"){
              item.showOrgLevel = false;
              item.select_assignee_3.roleNum = this.directionData.select_assigee_rolekv&& this.directionData.select_assigee_rolekv.length >0 ?this.directionData.select_assigee_rolekv[0].id:'';
          }
      },
      orgLevelChange(value,item){
          if(value){
              item.select_assignee_3.roleNum = this.directionData.select_assigee_rolekv&& this.directionData.select_assigee_rolekv.length >0 ?this.directionData.select_assigee_rolekv[0].id:'';
          }else{
              item.select_assignee_3.roleNum = '';
          }
      },
      changeContentFrom(item){

          this.$set(item,"cnItem","");
          this.$set(item,"cnName","");
          this.$set(item,"content","");
          this.$set(item,'changeContent',item.cnModel!='0'? false:true);
          if(item.changeContent){
              this.$set(item,"cnModel","");
          }else{
              this.$set(item,"cnModel","0");
          }
      },
      selectConnector(flag){
        let _url = '/flowform/index.html#/selectConnector/'+this.operate_id+'/0/0/'+flag;
        let _height = parent.window.document.getElementById("aside").offsetHeight-180;
        EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
     },
     contentFromSelect(value,item){
        this.$set(item,"cnItem","");
        this.$set(item,"cnName","");
        this.$set(item,"content","");
        if(value == 3){
          this.needIngItem = item;
          this.selectConnector(3);
        }
     },
     tagSelectCB(){
        this.select_assignee_1.dataVal = arguments[0].id;
      },
     addAgreeBtn(){
        let obj = {
          id:1,
          idString:"1#"+(this.agreeDesc.length),
          text:"",
          uuid:EcoUtil.getUID(),
          comments:this.agreeDesc.length+""
        }
        this.agreeDesc.push(obj);
     },
     addDisAgreeBtn(){
         let obj = {
          id:0,
          idString:"0#"+(this.disAgreeDesc.length),
          text:"",
          uuid:EcoUtil.getUID(),
          comments:this.disAgreeDesc.length+""
        }
        this.disAgreeDesc.push(obj);
     },
     delAgreeItem(index){
       this.agreeDesc.splice(index,1);
     },
     delDisAgreeItem(index){
       this.disAgreeDesc.splice(index,1);
     },
     handleSelctAssigneeCCSetup(value,item,refName){
          let node = this.$refs[refName].getCheckedNodes()[0].data;
          item.select_assignee_ccSetup.mdId = node.mdId;
          item.select_assignee_ccSetup.roleNum = '';
          item.select_assignee_ccSetup.orgLevel = '0';
          item.select_assignee_ccSetup.dataId = value[value.length-1];
          item.showOrgLevel = true;
          if(node.hasOwnProperty('orgSelectStatement') && node.orgSelectStatement.catEnum == "DEPT"){
              item.showOrgLevel = false;
              item.select_assignee_ccSetup.roleNum = this.directionData.select_assigee_rolekv&& this.directionData.select_assigee_rolekv.length >0 ?this.directionData.select_assigee_rolekv[0].id:'';
          }
      },
      orgLevelSelctAssigneeCCSetupChange(value,key){
          if(value){
              this[key].ccSetup.select_assignee_ccSetup.roleNum = this.directionData.select_assigee_rolekv&& this.directionData.select_assigee_rolekv.length >0 ?this.directionData.select_assigee_rolekv[0].id:'';
          }else{
              this[key].ccSetup.select_assignee_ccSetup.roleNum = '';
          }
      },
      addLinkWFData(){
        let select_assignee_3 = {
          lgId:"0",
          mdId:"",
          dataId:"",
          dParent:'',
          orgLevel:"0",
          roleNum:''
        }
        select_assignee_3.mdId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].mdId:"";
        select_assignee_3.dParent = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
        select_assignee_3.dataId = this.directionData.select_assignee_3.length>0? this.directionData.select_assignee_3[0].optionId:"";
        let item = {
          select_assignee_3:select_assignee_3,
          showOrgLevel:true
        }
        this.linkWFData.push(item);
      },
      deleteLinkWFData(index){
        this.linkWFData.splice(index,1)
      }
  },
  watch: {
     task_model:{
        handler(newValue, oldValue) {
            if(oldValue.taskName){
                this.isEdit = true;
            }
　　　　  },
　　　　  deep: true
     },
     itempvgqx:{
        handler(newValue,oldValue){
            if(newValue.length == oldValue.length) return;
            if(newValue.length>oldValue.length){//新增
                this.task_itempvg.forEach(item => {
                  for(var i=0;i<newValue.length;i++){
                      item.value.indexOf(newValue[i]) === -1 ?  item.value.push(newValue[i]) : 0;
                  }
                });
            }else{ //减少

                var str = '';//得到刚才点击的值
                for(let i=0;i<oldValue.length;i++){
                    if(newValue.indexOf(oldValue[i])==-1){
                      str = oldValue[i];
                      break;
                    }
                }
                this.task_itempvg.forEach(item => {
                  item.value.splice(item.value.indexOf(str),1);
                  if(item.value.indexOf("1")==-1 && item.value.indexOf("2") == -1){
                      item.value.push("2");
                      if(this.itempvgqx.indexOf('2') == -1){
                            this.itempvgqx.push("2");
                      }
                    }
                });
                 if(this.task_itempvg.every( item => item.value.indexOf("2") >-1)){
                      if(this.itempvgqx.indexOf('2') == -1){
                            this.itempvgqx.push("2");
                      }
                  }else{
                      if(this.itempvgqx.indexOf("2")>-1){
                          this.itempvgqx.splice(this.itempvgqx.indexOf("2"),1);
                      }
                  }
            }
        }
     },
     assigneqx:{
        handler(newValue,oldValue){
            if(newValue.length == oldValue.length) return;
            if(newValue.length>oldValue.length){//新增
                this.task_assigneepvg.forEach(item => {
                  for(var i=0;i<newValue.length;i++){
                      item.value.indexOf(newValue[i]) === -1 ?  item.value.push(newValue[i]) : 0;
                  }
                });
            }else{
               var str = '';//得到刚才点击的值
                for(let i=0;i<oldValue.length;i++){
                    if(newValue.indexOf(oldValue[i])==-1){
                      str = oldValue[i];
                      break;
                    }
                }
               this.task_assigneepvg.forEach(item => {
                  item.value.splice(item.value.indexOf(str),1);
               });
            }
        }
     }
  }
}
</script>
<style scoped>
.dirctionAttr{
    height: 100%;
}
.dirctionAttr .btngroup{
    position: absolute;
    right: 24px;
    height: 60px;
    line-height: 60px;
    z-index: 888;
}
.dirctionAttr .formItem,.dirctionAttr .multipleformItem{
    padding: 10px 24px 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    margin: 0px;
}
.dirctionAttr .multipleformItem .el-form-item{
    margin: 0px;
}
.dirctionAttr .quickItem{
    border-bottom: 1px solid #e8e8e8;
    padding: 12px 24px;
    background: #fafafa;
    text-align: right;
}
.dirctionAttr .hjItem{
    padding: 12px 24px;
    border-bottom: 1px solid #e8e8e8;
}
.dirctionAttr .hjItem:hover{
    background: #fafafa;
}
.dirctionAttr .el-row{
    line-height: 30px;
}
.iconbangzhu-kong{
    position: relative;
    left: 5px;
    top: 1px;
    float: none !important;
}
.dirctionAttr .xjspyj{
    position:absolute;
    right:24px;
    color: #595959;
    cursor: pointer;
}
.dirctionAttr .xjspyj:hover{
    color: #1ba5fa;
}
.dirctionAttr .xjspyj .icon{
    color: #1ba5fa;
    font-size: 18px;
    line-height: 18px;
}
.el-radio__label{
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
}
.dirctionAttr .checkItem {
  padding: 10px 24px 20px 24px;
   border-bottom: 1px solid #e8e8e8;
}
.dirctionAttr .checkItem .checkOption{
    padding: 16px;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
}
.dirctionAttr .checkItem .icon{
  cursor: pointer;
  position: relative;
  top: 1px;
}
.dirctionAttr .el-checkbox-group{
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
}
.qiehuan{
    height: 34px;
    line-height: 34px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 34px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 1px;
    cursor: pointer;
}
.switch-inline{
  display: inline-block;
  margin-left: 20px;
}
.switch-inline label{
  margin-right: 20px;
}
.defaultAppr{
    width: 160px;
    display: inline-block;
    text-align: center;
    margin-left: 9px;
    margin-right: 25px;
}
.apprBtn{
    width: 173px;
    display: inline-block;
    text-align: center;
    border: 1px dashed #409EFF;
    color: #1ba5fa;
    cursor: pointer;
    margin: 15px 7.5px 0 7.5px;
}
.apprUl{
    width: 150px;
    margin-left: 9px;
    margin-right: 25px;
    display: inline-block;
    vertical-align: top;
}
.apprUl li{
    margin-top:15px;
}
.apprUl li .icon{
  cursor: pointer;
}
.flowLevel{
  display: block;
  font-size: 12px;
  margin-top: 10px;
  line-height: 1;
}
.dirctionAttr .deal {
    display: inline;
    position: relative;
    top:3px;
    left:5px;
}
.dirctionAttr .deal .icon{
    font-size: 18px;
    color: #444;
    margin-right: 5px;
    cursor: pointer;
}
.dirctionAttr .linkWFData{
  display: inline-block;
}
</style>
