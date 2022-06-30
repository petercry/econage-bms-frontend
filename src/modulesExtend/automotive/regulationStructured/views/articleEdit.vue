<template>
    <div class='editArticle'>
        <div class='addForm'>
            <el-form :model='formData' ref='articleForm' :rules='rules' v-loading='loading' label-position='right' label-width='130px'>
                <div class='rowTitle'>法规原文</div>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='条文号:' prop='articleCode'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.articleCode'></el-input>
                            <span class="viewContent" v-else>{{formData.articleCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='条文标题:' prop='articleTitle'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.articleTitle'></el-input>
                            <span class="viewContent" v-else>{{formData.articleTitle}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='条文内容:' prop='articleContentInput' ref='articleContent'>
                            <!-- <editor-bar v-if='isEdit' :content="formData.articleContent" @on-change="contentChange"></editor-bar> -->
                            <ckeditor v-if='isEdit' ref="articleEditor" :content="formData.articleContent" height='200px' style='margin-bottom:43px'></ckeditor>
                            <div class="viewContent" v-else v-ckeditor='formData.articleContent' ></div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='法规要求类型' prop='requestType'>
                            <el-select filterable v-if='isEdit' v-model='formData.requestType' style='width:250px'>
                                <el-option v-for='(item) in RegulatoryRequirementsType' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.requestType,'requestType')}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='分类' prop='articleCategory'>
                            <el-select filterable v-if='isEdit' v-model='formData.articleCategory'>
                                <el-option v-for='(item) in articleType' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{restData(formData.articleCategory,'articleCategory')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>法规解读</div>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='条文释义:' prop='articleInterpretation'>
                            <el-input v-if='isEdit' v-model='formData.articleInterpretation' type='textarea' :rows='4' resize='none' show-word-limit
                                maxlength='1000' placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.articleInterpretation||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='条文释义[文档]:'>
                            <upload ref='articleUpload' :isEdit='isEdit' :showList='true' :multiple="false" :modular="modular" :modularInnerId="articleModularInnerId"
                                @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='法规咨询案例:' prop='consultingCase'>
                            <el-input v-if='isEdit' v-model='formData.consultingCase' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.consultingCase||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='再发防止案例:' prop='preventionCase'>
                            <el-input v-if='isEdit' v-model='formData.preventionCase' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.preventionCase||'暂无填写'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='适用车型:' prop='carModelItems'>
                            <el-checkbox-group v-model="formData.carModelItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item) in applicableModels' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.carModelItems,'carModelItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='动力类型:' prop='powerTypeItems'>
                            <el-checkbox-group v-model="formData.powerTypeItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item) in powerType' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.powerTypeItems,'powerTypeItems')}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='23'>
                        <el-form-item label='气体燃料专用:' prop='gasFuelItems'>
                            <el-checkbox-group v-model="formData.gasFuelItems" v-if='isEdit'>
                                <el-checkbox :label="item.id" v-for='(item) in gasList' :key='item.id'>{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else class="viewContent">{{restData(formData.gasFuelItems,'gasFuelItems')||'暂无选项'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle' v-if='caseType!=="addCase"'>法规专业关联关系</div>
                <el-row v-if='caseType!=="addCase"'>
                    <el-col :span='12'>
                        <el-form-item label='责任部门:' ref='selectDept' prop='responsibleDepartment'>
                            <el-input v-if='isEdit' v-model='formData.responsibleDepartment' disabled></el-input>
                            <span v-else class='viewContent'>{{formData.responsibleDepartment||'暂无'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>条文与专业、节点关系</div>
                <el-table class='platListTab' :data='platList' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}"
                    :cell-style="{textAlign:'center'}" :height='!isEdit?(platList.length>=10?((10*45+80)+"px"):((platList.length===0?"150px":(platList.length*45+80)+"px"))):""'>
                    <el-table-column prop='functionGroupCode' label='功能分组编码' width='200'>
                        <template slot-scope='scope'>
                            <el-select filterable :filter-method='(val)=>{filterMethod(val,scope.$index)}'  v-if='isEdit' @change='(val)=>functionGroupChange(scope.$index,val,"platList")' style='width:100%' v-model="scope.row.functionGroupCode"
                                multiple collapse-tags placeholder="请选择">
                                <div class='select searchRow'>
                                    <!-- <span class='searchInputLabel'>编码:</span>
                                    <el-input clearable style='width:150px' v-model='scope.row.searchCode' placeholder='请输入'>
                                      <i class='el-icon-search el-input__icon' slot='suffix'></i>
                                    </el-input>
                                    <el-button  type='primary' style='margin-left:5px;' @click='requestData("search",true,scope.$index)'>查询</el-button> -->
                                </div>
                                <div class='select pageContent'>
                                    <el-option v-for="(item,key) in scope.row.selectData" :key="key" :label="key" :value="key+'&'+item">
                                        <span style='float: left;'>{{key}}</span>
                                        <span style='float: right;'>{{item}}</span>
                                    </el-option>
                                </div>
                                <div class='select pageBar'>  
                                    <el-pagination @current-change="(val)=>{handleCurrentChange(val,scope.$index)}" :current-page.sync="scope.row.baseInfo.page" 
                                        :page-size="scope.row.baseInfo.rows" layout="total , prev, pager, next, jumper"   :total='scope.row.baseInfo.total'
                                       >
                                    </el-pagination>
                                </div>
                            </el-select>
                            <span class='viewContent' v-else>{{scope.row.functionGroupCodeView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='functionGroupName' label='功能分组名称' width='200'>
                        <template slot-scope='scope'>
                            <el-input v-if='isEdit' disabled v-model='scope.row.functionGroupName' placeholder='请输入' style='width:100%'></el-input>
                            <span class='viewContent' v-else>{{scope.row.functionGroupNameView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='partCode' label='零部件编号' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' @change='(val)=>partCodeChange(scope.$index,val,"platList")' v-if='isEdit' v-model="scope.row.partCode"
                                multiple collapse-tags placeholder="请选择">
                                <el-option v-for="(item,key) in scope.row.partCodeSelList" :key="key" :label="key" :value="key+'&'+item">
                                    <span style='float: left;'>{{key}}</span>
                                    <span style='float: right;'>{{item}}</span>
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{scope.row.partCodeView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='partName' width='240' label='零部件名称'>
                        <template slot-scope='scope'>
                            <el-input v-if='isEdit' disabled v-model='scope.row.partName' placeholder='请输入' style='width:100%'></el-input>
                            <span v-else class='viewContent'>{{scope.row.partNameView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='responsibleDepartment' label='责任部门' width='170'>
                        <template slot-scope='scope'>
                            <tag-select :disabled='!isEdit' placeholder="选择部门" style="width:100%;vertical-align: top;" :initDataStr="scope.row.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRow(data,scope.$index,'dept')">
                            </tag-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop='responsibleOffice' label='责任科室' width='170'>
                        <template slot-scope='scope'>
                            <tag-select :disabled='!isEdit' placeholder="选择部门" style="width:100%;vertical-align: top;" :initDataStr="scope.row.officeInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRow(data,scope.$index,'office')">
                            </tag-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop='profession' label='专业' width='150'>
                        <template slot-scope='scope'>
                            <el-select filterable v-if='isEdit' v-model='scope.row.profession' style='width:100%'>
                                <el-option v-for='(item) in professionList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                            </el-select>
                            <span v-else class="viewContent">{{restData(scope.row.profession,'profession')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='priorP0' label='P0前' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model="scope.row.priorP0" multiple collapse-tags placeholder="请选择">
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.priorP0,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='p0P1' label='P0-P1' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.p0P1' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.p0P1,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='p1P2' label='P1-P2' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.p1P2' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.p1P2,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='p2P3' label='P2-P3' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.p2P3' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.p2P3,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='p3P4' label='P3-P4' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.p3P4' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.p3P4,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='priorJ0' label='J0前' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.priorJ0' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.priorJ0,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j0J1' label='J0-J1' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j0J1' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j0J1,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j1J2' label='J1-J2' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j1J2' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j1J2,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j2J3' label='J2-J3' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j2J3' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j2J3,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j3J4' label='J3-J4' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j3J4' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j3J4,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j4J5' label='J4-J5' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j4J5' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j4J5,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j5J6' label='J5-J6' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j5J6' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j5J6,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j6J7' label='J6-J7' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j6J7' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j6J7,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j7J8' label='J7-J8' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j7J8' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j7J8,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='操作' v-if='isEdit' fixed='right'>
                        <template slot-scope='scope'>
                            <el-button @click.native.prevent="delRowItem(scope.$index,'platList')" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-if='isEdit' class='caseBtn' @click='addRowItem("platList")'>
                    <span>
                        <i class='el-icon-plus'></i>添加</span>
                </div>
                <!-- <div class='rowTitle'>条文与专业、节点关系[车型]</div>
                <el-table class='modelListTab' :data='modelList' border :header-cell-style="{background:'#f5f7fa',color:'#000',textAlign:'center'}"
                    :cell-style="{textAlign:'center'}">
                    <el-table-column prop='functionGroupCode' label='功能分组编码' width='170'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' @change='(val)=>functionGroupChange(scope.$index,val,"modelList")' v-if='isEdit' v-model="scope.row.functionGroupCode"
                                multiple collapse-tags placeholder="请选择">
                                <el-option v-for="(item,key) in functionGroupMap" :key="key" :label="key" :value="key+'&'+item">
                                </el-option>
                            </el-select>
                            <span class='viewContent' v-else>{{scope.row.functionGroupCodeView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='functionGroupName' label='功能分组名称' width='150'>
                        <template slot-scope='scope'>
                            <el-input v-if='isEdit' disabled v-model='scope.row.functionGroupName' placeholder='请输入' style='width:100%'></el-input>
                            <span class='viewContent' v-else>{{scope.row.functionGroupNameView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='partCode' label='零部件编号' width='170'>
                        <template slot-scope='scope'>
                            <el-select filterable @change='(val)=>partCodeChange(scope.$index,val,"modelList")' style='width:100%' v-if='isEdit' v-model="scope.row.partCode"
                                multiple collapse-tags placeholder="请选择">
                                <el-option v-for="(item,key) in scope.row.partCodeSelList" :key="key" :label="key" :value="key+'&'+item">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{scope.row.partCodeView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='partName' label='零部件名称' width='150'>
                        <template slot-scope='scope'>
                            <el-input v-if='isEdit' v-model='scope.row.partName' placeholder='请输入' style='width:100%'></el-input>
                            <span v-else class='viewContent'>{{scope.row.partNameView}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='responsibleDepartment' label='责任部门' width='170'>
                        <template slot-scope='scope'>
                            <tag-select :disabled='!isEdit' placeholder="选择部门" style="width:100%;vertical-align: top;" :initDataStr="scope.row.deptInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRow2(data,scope.$index,'dept')">
                            </tag-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop='responsibleOffice' label='责任科室' width='170'>
                        <template slot-scope='scope'>
                            <tag-select :disabled='!isEdit' placeholder="选择部门" style="width:100%;vertical-align: top;" :initDataStr="scope.row.officeInitDataStr"
                                :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>selectRow2(data,scope.$index,'office')">
                            </tag-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop='profession' label='专业' width='150'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.profession'>
                                <el-option v-for="item in professionList" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class="viewContent">{{restData(scope.row.profession,'profession')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='priorJ0' label='j0前' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.priorJ0' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.priorJ0,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j0J1' label='j0-j1' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j0J1' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j0J1,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j1J2' label='j1-j2' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j1J2' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j1J2,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j2J3' label='j2-j3' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j2J3' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j2J3,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j3J4' label='j3-j4' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j3J4' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j3J4,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j4J5' label='j4-j5' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j4J5' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j4J5,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j5J6' label='j5-j6' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j5J6' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j5J6,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j6J7' label='j6-j7' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j6J7' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j6J7,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='j7J8' label='j7-j8' width='240'>
                        <template slot-scope='scope'>
                            <el-select filterable style='width:100%' v-if='isEdit' v-model='scope.row.j7J8' multiple collapse-tags placeholder='请选择'>
                                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else class='viewContent'>{{restData(scope.row.j7J8,'pJView')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='操作' v-if='isEdit' fixed='right'>
                        <template slot-scope='scope'>
                            <el-button @click.native.prevent="delRowItem(scope.$index,'modelList')" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-if='isEdit' class='caseBtn' @click='addRowItem("modelList")'>
                    <span>
                        <i class='el-icon-plus'></i>添加</span>
                </div> -->
            </el-form>
        </div>
        <div class="btn" v-if='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    var _self;
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoFile } from '@/components/file/main.js'
    import { structurebaseFuncGroupList,structurebaseSingle,structurebasePartList, articleAdd, getItemFetchId, articleDetails, articleUpdate } from '../service/service.js'
    import upload from './components/upload.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { mapState } from 'vuex'
    import ckeditor from './components/ckeditor.vue'
    // import EditorBar from './components/editorBar.vue'
    export default {
        name: 'editArticle',
        data() {
            return {
                timer:null,
                fileList: [],
                modular: 'article_documents',
                articleModularInnerId: '',
                id: "",
                masterId:'',
                caseType: '',
                // modelList: [],
                platList: [],
                formData: {
                    articleCode: '',
                    articleTitle: '',
                    articleContent: '',
                    articleContentInput: '',
                    requestType: '',
                    articleCategory: '',
                    articleInterpretation: '',
                    consultingCase: '',
                    preventionCase: '',
                    carModelItems: [],
                    powerTypeItems: [],
                    gasFuelItems: []
                },
                rules: {
                    articleCode: [{ required: true, message: '条文号为必填项', trigger: 'blur' }],
                    articleTitle: [{ required: true, message: '条文标题为必填项', trigger: 'blur' }],
                    articleContentInput: [{ required: true, message: '条文内容为必填项', trigger: 'blur' }],
                    requestType: [{ required: true, message: '法规要求类型为必选项', trigger: 'change' }],
                    articleCategory: [{ required: true, message: '分类为必选项', trigger: 'change' }],
                    // articleInterpretation: [{ required: true, message: '条文释义为必填项', trigger: 'blur' }],
                    carModelItems: [{ required: true, message: '适用车型为必选项', trigger: 'change' }],
                    // powerTypeItems: [{ required: true, message: '动力类型为必选项', trigger: 'change' }],
                },
                loading: false,
                fromPage:''
            }
        },
        computed: {
            ...mapState(['professionList', 'functionGroupMap', 'deliverable', 'RegulatoryRequirementsType', 'gasList', 'articleType', 'applicableModels', 'powerType']),
            isEdit() {
                return this.caseType !== 'viewCase'
            },
            parentIsEdit(){
                return this.$route.params.parentIsEdit=='true'?true:false;
            }
        },
        components: {
            upload,
            tagSelect,
            // EditorBar,
            ckeditor
        },
        created() {
            _self = this;
            this.id = this.$route.params.id;
            this.masterId = this.$route.params.masterId;
            this.caseType = this.$route.params.caseType;
            this.fromPage = this.$route.params.fromPage;
            if (this.id && this.id != 0) {
                this.getDetailsInfo();
            } else {
                structurebaseSingle(this.masterId,'organizationList',false).then(res=>{
                     this.formData.carModelItems = res.data.carModelItems ||[];
                     this.formData.powerTypeItems = res.data.powerTypeItems ||[];
                     this.formData.gasFuelItems = res.data.gasFuelItems ||[];
                })
                getItemFetchId().then(res => {
                    this.articleModularInnerId = res.data;
                })
            }
        },
        methods: {
            filterMethod(val,index){
                if(this.timer){
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout(function(){
                   _self.platList[index].searchCode = val;
                   _self.requestData("search",true,index);
                },300)
            },
            requestData(type,isFirstP,index){
                this.loading = true;
                var params = {
                    rows:this.platList[index].baseInfo.rows,
                }
                if(type==='search' && this.platList[index].searchCode){
                     params.code =  this.platList[index].searchCode;
                }
                if(isFirstP){
                    this.platList[index].baseInfo.page = 1;
                }
                params.page=this.platList[index].baseInfo.page;
                structurebaseFuncGroupList(params).then(res=>{
                    this.platList[index].selectData = res.data.rows;
                    this.platList[index].baseInfo.total = res.data.total;
                    this.loading = false;
                }).catch(err=>{
                    this.platList[index].baseInfo.page = 1;
                    this.platList[index].selectData = this.functionGroupMap.data;
                    this.platList[index].baseInfo.total = this.functionGroupMap.total;
                    this.loading = false;
                })
            },
            handleCurrentChange(val,index) {
                  this.platList[index].baseInfo.page = val;
                  this.requestData('search',false,index)    
            },
            partCodeChange(index, val, type) {
                if (val.length === 0) {
                    if (type === 'platList') {
                        this.platList[index].partName = '';
                    } else {
                        this.modelList[index].partName = '';
                    }
                } else {
                    let str = '';
                    val.forEach((item, index) => {
                        if (index != 0) {
                            str += ('|' + item.split('&')[1]);
                        } else {
                            str += item.split('&')[1];
                        }
                    })
                    if (type === 'platList') {
                        this.platList[index].partName = str;
                    } else {
                        this.modelList[index].partName = str;
                    }
                }
            },
            functionGroupChange(index, val, type) {
                if (type === 'platList') {
                    this.platList[index].partCode = [];
                    this.platList[index].partName = '';
                } else {
                    this.modelList[index].partCode = [];
                    this.modelList[index].partName = '';
                }
                if (val.length === 0) {
                    if (type === 'platList') {
                        this.platList[index].partCodeSelList = [];
                        this.platList[index].functionGroupName = '';
                    } else {
                        this.modelList[index].partCodeSelList = [];
                        this.modelList[index].functionGroupName = '';
                    }
                } else {
                    let str = '';
                    let arr = [];
                    val.forEach(item => {
                        arr.push(item.split('&')[0]); //1
                    })
                    structurebasePartList(arr).then(res => {
                        if (type === 'platList') {
                            this.platList[index].partCodeSelList = res.data;
                        } else {
                            this.modelList[index].partCodeSelList = res.data;
                        }

                    }).catch(err => {
                        if (type === 'platList') {
                            this.platList[index].partCodeSelList = [];
                        } else {
                            this.modelList[index].partCodeSelList = [];
                        }

                    })
                    val.forEach((item, index) => {
                        if (index != 0) {
                            str += ('|' + item.split('&')[1]);
                        } else {
                            str += item.split('&')[1];
                        }
                    })
                    if (type === 'platList') {
                        this.platList[index].functionGroupName = str;
                    } else {
                        this.modelList[index].functionGroupName = str;
                    }
                }
            },
            delRowItem(index, type) {
                if ((type == 'platList' && this.platList.length === 0) || (type == 'modelList' && this.modelList.length === 0)) {
                    return;
                }
                if (type === 'platList') {
                    this.platList.splice(index, 1);
                } else {
                    this.modelList.splice(index, 1);
                }
            },
            addRowItem(type) {
                if (type === 'platList') {
                    this.platList.push({
                        functionGroupCode: [],
                        functionGroupName: '',
                        partCode: [],
                        partCodeSelList: [],//基础数据
                        partName: '',
                        responsibleDepartment: '',
                        deptInitDataStr: '',
                        responsibleOffice: '',
                        officeInitDataStr: '',
                        profession: '',
                        priorP0: [],
                        p0P1: [],
                        p1P2: [],
                        p2P3: [],
                        p3P4: [],
                        priorJ0: [],
                        j0J1: [],
                        j1J2: [],
                        j2J3: [],
                        j3J4: [],
                        j4J5: [],
                        j5J6: [],
                        j6J7: [],
                        j7J8: [],
                        baseInfo:{ //功能分组页码
                            page: 1,
                            rows: 10,
                            total: this.functionGroupMap.total
                        },
                        selectData:this.functionGroupMap.data, //功能分组选择数据
                        searchCode:''
                    });
                } else {
                    this.modelList.push({
                        functionGroupCode: [],
                        functionGroupName: '',
                        partCode: [],
                        partCodeSelList: [],//基础数据
                        partName: '',
                        responsibleDepartment: '',
                        deptInitDataStr: '',
                        responsibleOffice: '',
                        officeInitDataStr: '',
                        profession: '',
                        priorJ0: [],
                        j0J1: [],
                        j1J2: [],
                        j2J3: [],
                        j3J4: [],
                        j4J5: [],
                        j5J6: [],
                        j6J7: [],
                        j7J8: []
                    })
                }
            },
            selectRow(data, index, type) {
                if (!data.id && data.itemArray.length === 0) {
                    //删除
                    if (type === 'dept') {
                        this.platList[index].deptInitDataStr = '';
                        this.platList[index].responsibleDepartment = '';
                    } else if (type === 'office') {
                        this.platList[index].officeInitDataStr = '';
                        this.platList[index].responsibleOffice = '';
                    }
                } else {
                    if (type === 'dept') {
                        this.platList[index].responsibleDepartment = data.orgId;
                    } else if (type === 'office') {
                        this.platList[index].responsibleOffice = data.orgId;
                    }
                }
            },
            // selectRow2(data, index, type) {
            //     if (!data.id && data.itemArray.length === 0) {
            //         //删除
            //         if (type === 'dept') {
            //             this.modelList[index].deptInitDataStr = '';
            //             this.modelList[index].responsibleDepartment = '';
            //         } else if (type === 'office') {
            //             this.modelList[index].officeInitDataStr = '';
            //             this.modelList[index].responsibleOffice = '';
            //         }
            //     } else {
            //         if (type === 'dept') {
            //             this.modelList[index].responsibleDepartment = data.orgId;
            //         } else if (type === 'office') {
            //             this.modelList[index].responsibleOffice = data.orgId;
            //         }
            //     }
            // },
            // contentChange(html) {
            //     this.formData.articleContentInput = html;
            //     if (html) {
            //         this.$refs.articleContent.clearValidate();
            //     }
            // },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            beforeFileUpload(file, callback) {
                // var testmsg = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLocaleLowerCase();
                // // const isLt2M = file.size/1024/1024<6
                // const extension = testmsg === 'doc';
                // const extension2 = testmsg === 'docx';
                // const extension3 = testmsg === 'xls';
                // const extension4 = testmsg === 'xlsx';
                // const extension5 = testmsg === 'ppt';
                // const extension6 = testmsg === 'pptx';
                // const extension7 = testmsg === 'txt';
                // const extension8 = testmsg === 'pdf';
                // if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8) {
                //     this.$message({
                //         message: '上传文件只能是.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf格式!',
                //         type: 'warning',
                //         customClass: 'message',
                //         offset: 160
                //     });
                // }
                // // if(!isLt2M){
                // //     this.$message({
                // //         message: '上传文件不能超过6MB!',
                // //         type: 'warning',
                // //         customClass: 'message',
                // //         offset: 160
                // //     })
                // // }
                // callback((extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8));
                callback(true);
            },
            fileOnSuccess(response) {

            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            restDetailsInfo(data,type) {
                data.forEach(item => {
                    item.partList = item.partList||[];
                    item.funcGroupList = item.funcGroupList||[];
                    var functionGroupCode = [];
                    var partCode = [];
                    var arr = [];
                    if(this.caseType==='viewCase'){
                        this.$set(item,'functionGroupCodeView',item.functionGroupCode);
                        this.$set(item,'functionGroupNameView',item.functionGroupName);
                        this.$set(item,'partCodeView',item.partCode);
                        this.$set(item,'partNameView',item.partName);
                    }
                    this.$set(item, 'partCodeSelList', {});
                    item.funcGroupList.forEach(item2 => {
                        functionGroupCode.push(item2.code + '&' + item2.name);
                        arr.push(item2.code);//name
                    })
                    item.functionGroupCode = functionGroupCode;
                    if (arr.length > 0) {
                        structurebasePartList(arr).then(res => {
                            item.partCodeSelList = res.data;
                        })
                    }
                    item.partList.forEach(item2 => {
                        partCode.push(item2.code + '&' + item2.name);
                    })
                    item.partCode = partCode;
                    item.deptInitDataStr = item.responsibleDepartment ? `{"type":"DEPT","orgId":"${item.responsibleDepartment}","linkId":"${item.responsibleDepartment}"}` : '';
                    item.officeInitDataStr = item.responsibleOffice ? `{"type":"DEPT","orgId":"${item.responsibleOffice}","linkId":"${item.responsibleOffice}"}` : '';
                    if(type==='platList'){
                        item.priorP0 = item.priorP0?item.priorP0.split(','):[];
                        item.p0P1 = item.p0P1?item.p0P1.split(','):[];
                        item.p1P2 = item.p1P2?item.p1P2.split(','):[];
                        item.p2P3 = item.p2P3?item.p2P3.split(','):[];
                        item.p3P4 = item.p3P4?item.p3P4.split(','):[];
                        item.priorJ0 = item.priorJ0?item.priorJ0.split(','):[];
                        item.j0J1 = item.j0J1?item.j0J1.split(','):[];
                        item.j1J2 = item.j1J2?item.j1J2.split(','):[];
                        item.j2J3 = item.j2J3?item.j2J3.split(','):[];
                        item.j3J4 = item.j3J4?item.j3J4.split(','):[];
                        item.j4J5 = item.j4J5?item.j4J5.split(','):[];
                        item.j5J6 = item.j5J6?item.j5J6.split(','):[];
                        item.j6J7 = item.j6J7?item.j6J7.split(','):[];
                        item.j7J8 = item.j7J8?item.j7J8.split(','):[];
                        item.baseInfo = { //功能分组页码
                            page: 1,
                            rows: 10,
                            total: this.functionGroupMap.total
                        };
                        item.selectData=this.functionGroupMap.data; //功能分组选择数据
                        item.searchCode='';
                    }
                })
                return data;
            },
            getDetailsInfo() {
                this.loading = true;
                articleDetails(this.id,this.fromPage,this.parentIsEdit).then(res => {
                    res.data.articleCode = res.data.articleCode||'';
                    res.data.articleInterpretation = res.data.articleInterpretation||'';
                    res.data.articleTitle = res.data.articleTitle || '';
                    res.data.carModelItems = res.data.carModelItems ||[];
                    res.data.consultingCase = res.data.consultingCase ||'';
                    res.data.gasFuelItems = res.data.gasFuelItems||[];
                    res.data.powerTypeItems = res.data.powerTypeItems||[];
                    res.data.preventionCase = res.data.preventionCase||'';
                    res.data.requestType = res.data.requestType||"";
                    // res.data.modelList =  res.data.modelList||[];
                    res.data.platList = res.data.platList||[]
                    this.formData = res.data;
                    this.$set(this.formData,'articleContentInput',res.data.articleContent);
                    // this.modelList = this.restDetailsInfo(res.data.modelList,'modelList');
                    this.platList = this.restDetailsInfo(res.data.platList,'platList');
                    this.articleModularInnerId = res.data.id;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })

            },
            validetorForm() {
                let bool = true;
                // if (this.fileList.length === 0) {
                //     this.$message.warning('条文释义[文档]未上传！');
                //     return false;
                // }
                for (var i = 0; i < this.platList.length; i++) {
                    var isBreak = true;
                    for (var key in this.platList[i]) {
                        //非空判断
                        if ((Array.isArray(this.platList[i][key]) && this.platList[i][key].length > 0) || (!Array.isArray(this.platList[i][key]) && this.platList[i][key])) {
                            isBreak = false;
                        }
                    }
                    if (isBreak) {
                        break;
                    }
                    if (!(this.platList[i].profession)) {
                        // !(this.platList[i].responsibleDepartment) || !(this.platList[i].responsibleOffice) ||
                        this.$message.warning('请完善条文与专业、节点关系子表,专业为必填项');//责任部门、科室、
                        return false;
                    }
                }
                // for (var i = 0; i < this.modelList.length; i++) {
                //     var isBreak = true;
                //     for (var key in this.modelList[i]) {
                //         //非空判断
                //         if ((Array.isArray(this.modelList[i][key]) && this.modelList[i][key].length > 0) || (!Array.isArray(this.modelList[i][key]) && this.modelList[i][key])) {
                //             isBreak = false;
                //         }
                //     }
                //     if (isBreak) {
                //         break;
                //     }
                //     if (!(this.modelList[i].responsibleDepartment) || !(this.modelList[i].responsibleOffice) || !(this.modelList[i].profession)) {
                //         this.$message.warning('请完善条文与专业、节点关系[平台]子表,责任部门、科室、专业为必填项');
                //         return false;
                //     }
                // }
                return bool;
            },
            dataBefore(data, type) {
                let arr = [];
                data.forEach((item, index) => {
                    var isAdd = false;
                    for (var key in item) {
                        //非空判断
                        if ((Array.isArray(item[key]) && item[key].length > 0) || (!Array.isArray(item[key]) && item[key])) {
                            isAdd = true;
                        }
                    }
                    if (isAdd) {
                        var obj = {
                            funcGroupList: [],
                            partList: [],
                            functionGroupName: item.functionGroupName,
                            functionGroupCode: '',
                            partCode: '',
                            partName: item.partName,
                            responsibleDepartment: item.responsibleDepartment,
                            responsibleOffice: item.responsibleOffice,
                            profession: item.profession
                        }
                        if (type === 'platList') {
                            obj.priorP0 = item.priorP0.join(',');
                            obj.p0P1 = item.p0P1.join(',');
                            obj.p1P2 = item.p1P2.join(',');
                            obj.p2P3 = item.p2P3.join(',');
                            obj.p3P4 = item.p3P4.join(',');
                            obj.priorJ0 = item.priorJ0.join(',');
                            obj.j0J1 = item.j0J1.join(',');
                            obj.j1J2 = item.j1J2.join(',');
                            obj.j2J3 = item.j2J3.join(',');
                            obj.j3J4 = item.j3J4.join(',');
                            obj.j4J5 = item.j4J5.join(',');
                            obj.j5J6 = item.j5J6.join(',');
                            obj.j6J7 = item.j6J7.join(',');
                            obj.j7J8 = item.j7J8.join(',');
                        }
                        item.functionGroupCode.forEach((item2, index2) => {
                            var obj2 = {
                                code: item2.split('&')[0],
                                name: item2.split('&')[1]
                            }
                            if (index2 != 0) {
                                obj.functionGroupCode += ('|' + item2.split('&')[0]);
                            } else {
                                obj.functionGroupCode += item2.split('&')[0];
                            }
                            obj.funcGroupList.push(obj2);
                        })
                        item.partCode.forEach((item2, index2) => {
                            //零部件
                            var obj2 = {
                                code: item2.split('&')[0],
                                name: item2.split('&')[1]
                            }
                            if (index2 != 0) {
                                obj.partCode += ('|' + item2.split('&')[0]);
                            } else {
                                obj.partCode += item2.split('&')[0];
                            }
                            obj.partList.push(obj2);
                        })
                        arr.push(obj);
                    }
                })
                return arr;
            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.formData.articleContentInput = this.$refs.articleEditor.getCkeditorData();
                this.$refs.articleForm.validate((valid) => {
                    if (valid) {
                        if (this.validetorForm()) {
                            this.loading = true;
                            let platList = this.dataBefore(this.platList, 'platList');
                            // let modelList = this.dataBefore(this.modelList, 'modelList');
                            let params = {
                                masterId: this.masterId,
                                articleCode: this.formData.articleCode,
                                articleTitle: this.formData.articleTitle,
                                articleContent: this.formData.articleContentInput,
                                requestType: this.formData.requestType,
                                articleCategory: this.formData.articleCategory,
                                articleInterpretation: this.formData.articleInterpretation,
                                consultingCase: this.formData.consultingCase,
                                preventionCase: this.formData.preventionCase,
                                carModelItems: this.formData.carModelItems,
                                powerTypeItems: this.formData.powerTypeItems,
                                gasFuelItems: this.formData.gasFuelItems,
                                platList: platList,
                                // modelList: modelList
                            }
                            if (this.caseType === 'editCase') {
                                params.id = this.id;
                                params.key = this.formData.key;
                                articleUpdate(params,this.fromPage).then(res => {
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'edit';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err => {
                                    this.loading = false;
                                })
                            } else {
                                params.id = this.articleModularInnerId;
                                articleAdd(params,this.fromPage).then(res => {
                                    this.loading = false;
                                    let doObj = {};
                                    doObj.action = 'add';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }).catch(err => {
                                    this.loading = false;
                                })
                            }
                        }
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .editArticle {
        background: #fff;
        height: 100%;
    }

    .editArticle .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editArticle .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }

    .editArticle .addForm .el-input,
    .editArticle .addForm .el-select {
        width: 200px;
    }

    .viewContent {
        color: #606266;
    }

    .editArticle .tableRow {
        text-align: right;
    }

    .editArticle .tableRow span {
        margin-right: 2px;
        font-size: 14px;
        color: #0f1419;
    }

    .editArticle .uploadBtn {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: 100%;
        background: transparent;
        color: #409EFF;
        border: 0;
        padding: 5px 20px;
    }

    .rowTitle {
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: rgb(103, 112, 126);
        margin-bottom: 20px;
    }

    .caseBtn {
        margin-bottom: 20px;
    }
    .modelListTab /deep/ .el-table__empty-block,
    .platListTab /deep/ .el-table__empty-block {
        width: 1000px !important;
    }
</style>
