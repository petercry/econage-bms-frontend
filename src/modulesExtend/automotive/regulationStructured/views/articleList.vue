<template>
    <eco-content top='51px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='articleList'>
            <ecoLoading ref='articleRefLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' :height='(approveColumn?"90px":"60px")' type='tool' style=' background:#fff;'>
                <el-row style='padding: 14px;border-top: 1px solid #ddd;'>
                    <el-col :span='15'>
                        <el-row>
                              <el-col style='height:30px;line-height: 30px;' v-if='progressInfo.status && !progressInfo.complete'>
                                    <span class='progressText'>{{progressInfo.progressDesc}}</span>
                              </el-col>
                              <el-col v-else-if='approveColumn' style='line-height:20px;'>
                                <el-checkbox  v-model="checkAll" @change="handleCheckAllChange" style='float: left;margin-right:15px'>全选</el-checkbox>
                                <el-checkbox-group v-model="checkCloumnList" @change='checkCloumnChange'>
                                    <el-checkbox :label="key" v-for='(val,key) in checkColumnData' :key='key'>{{val}}</el-checkbox>
                                </el-checkbox-group>
                              </el-col>
                              <el-col v-else-if  style='height:30px;line-height: 30px;'></el-col>
                          </el-row>
                    </el-col>
                    <el-col :span='9' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow' v-show='fromPage!=="finishList"'>高级查询</el-button>
                        <el-button type='primary' size='small' v-show='caseType!=="viewCase"' @click='editCase({},"addCase")'>新增</el-button>
                        <el-button type='primary' size='small' v-show='caseType!=="viewCase"' @click='openUploadDialog("articleUpload")'>导入</el-button>
                        <el-button type='primary' size='small' @click='exportCase'>导出</el-button>
                        <el-button type='primary' :disabled='progressInfo.status && !progressInfo.complete' size='small' @click='openUploadDialog("articleImport")' v-show='caseType!=="viewCase"'>拆解</el-button>
                        <el-upload v-show='false' ref='articleImport' :auto-upload='false' :http-request="(param)=>{uploadFile(param,'articleImport')}" action="" :before-upload='beforeUpload'
                          :on-change='onFileChange'  :show-file-list='false' accept='.pdf'>
                        </el-upload>
                        <el-upload v-show='false' ref='articleUpload' :auto-upload='true' :http-request="(param)=>{uploadFile(param,'articleUpload')}" action="" :before-upload='beforeUpload2'
                            :show-file-list='false' accept='.xls,.xlsx'>
                        </el-upload>
                        <el-button type='primary' v-show='(progressInfo.status && !progressInfo.complete) && caseType!=="viewCase"'  size='small' @click='reshProgressInfo(true)'>刷新</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' :top='approveColumn?"89px":"59px"' height='120px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow out'>
                    <el-col>
                        <span class='searchInputLabel'>&emsp;条文号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.articleCode' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>条文标题:</span>
                        <el-input clearable style='width:170px' @keyup.enter.native="requestData('search')" v-model='searchContent.articleTitle'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class="searchInputLabel">法规要求类型:</span>
                        <el-select filterable v-model='searchContent.requestType' style='width:150px'>
                            <el-option v-for='(item) in RegulatoryRequirementsType' :value='item.id' :label='item.text' :key='item.id'></el-option>
                        </el-select>
                        <span class="searchInputLabel">&emsp;条文分类:</span>
                        <el-select filterable v-model='searchContent.articleCategory' style='width: 150px'>
                            <el-option v-for='(item) in articleType' :value='item.id' :label='item.text' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span class="searchInputLabel">&emsp;&emsp;专业:</span>
                        <el-select filterable v-model='searchContent.profession' style='width:150px'>
                            <el-option v-for='(item) in professionList' :value='item.id' :label='item.text' :key='item.id'></el-option>
                        </el-select>
                        <span class="searchInputLabel">功能分组:</span>
                        <el-select filterable :filter-method='filterMethod' @change='functionGroupChange' style='width:170px' v-model="searchContent.funcGroupCode" multiple collapse-tags
                            placeholder="请选择">
                            <div class='select searchRow'></div>
                            <div class='select pageContent' v-loading='loading'>
                                <el-option v-for="(item,key) in selectGroupMap.selectData" :key="key" :label="key" :value="key+'&'+item">
                                </el-option>
                            </div>
                            <div class='select pageBar'>
                                <el-pagination @current-change="selectHandleCurrentChange" :current-page.sync="selectGroupMap.baseInfo.page"
                                    :page-size="selectGroupMap.baseInfo.rows" layout="total , prev, pager, next, jumper"   :total='selectGroupMap.baseInfo.total'
                                   >
                                </el-pagination>
                            </div>
                        </el-select>
                        <span class="searchInputLabel">&emsp;零部件编号:</span>
                        <el-select filterable style='width:150px' v-model="searchContent.partCode" multiple collapse-tags placeholder="请选择">
                            <el-option v-for="(item,key) in partCodeSelList" :key="key" :label="key" :value="key">
                            </el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;适用车型:</span>
                        <el-select filterable style='width:150px' v-model="searchContent.carModel" placeholder="请选择">
                            <el-option v-for="(item) in applicableModels" :key="item.id" :label="item.text" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span class='searchInputLabel'>动力类型:</span>
                        <el-select filterable style='width:150px' v-model="searchContent.powerType" placeholder="请选择">
                            <el-option v-for="(item) in powerType" :key="item.id" :label="item.text" :value="item.id">
                            </el-option>
                        </el-select>
                        <span class='searchInputLabel'>责任部门:</span>
                        <tag-select placeholder="选择机构" style="width:170px;vertical-align: top;" :initDataStr="deptInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}"
                            @callBack="(val)=>selectRoleDept(val,'responsibleDepartment')">
                        </tag-select>
                        <span class='searchInputLabel'>&emsp;&emsp;责任科室:</span>
                        <tag-select placeholder="选择机构" style="width:150px;vertical-align: top;" :initDataStr="officeInitDataStr" :initOptions="{selectNum:1,selectType:'Dept'}"
                            @callBack="(val)=>selectRoleDept(val,'responsibleOffice')">
                        </tag-select>
                        <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:0px 15px 10px;border:1px solid #ddd;'>
                <el-row class='modelBox'>
                    <el-col :span='5' class="splitLine">
                        <el-scrollbar style='height:300px;'>
                            <div class='noDataTree' v-if='treeData.length==0'>
                                <span>暂无数据</span>
                            </div>
                            <el-tree v-else :node-key='id' :default-expand-all='true' highlight-current ref='artTree' :data="treeData" empty-text='无标题' :props="defaultProps" @node-click="handleNodeClick">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <el-tooltip v-if='node.label.length>=9'  effect="dark" :content="node.label" placement="right-start">
                                        <span class="nodeText">{{ node.label }}</span>
                                    </el-tooltip>
                                    <span class="nodeText" v-else>{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </el-scrollbar>
                    </el-col>
                    <el-col :span='19'>
                        <el-table :span-method="arraySpanMethod" border ref='articleTable' stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%'
                            class='standardizationTable'>
                            <!-- <el-table-column type="selection" width="55" :reserve-selection='true'>
                            </el-table-column>
                            <el-table-column type='index' label='序号'>
                                <template slot-scope='scope'>
                                    {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                                </template>
                            </el-table-column> -->
                            <el-table-column prop='articleCode' label='条文号' v-if='checkCloumnShow["articleCode"]'></el-table-column>
                            <el-table-column prop='articleTitle' label='条文标题' v-if='checkCloumnShow["articleTitle"]' width='140'></el-table-column>
                            <el-table-column prop='articleContent' label='条文内容' width='230' v-if='checkCloumnShow["articleContent"]'>
                                <template slot-scope='scope'>
                                    <div class='articleContentBox' v-ckeditor='scope.row.articleContent' @click='preImgShow(scope.row)'></div>
                                </template>
                            </el-table-column>
                            <el-table-column prop='requestType' label='法规要求类型' width='160' v-if='checkCloumnShow["requestType"] && approveColumn'>
                                <template slot-scope='scope'>
                                    <span>{{restData(scope.row.requestType,'requestType')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip min-width='160' label='责任部门' prop='responsibleDepartment' align='center' v-if='checkCloumnShow["responsibleDepartment"]'></el-table-column>
                            <el-table-column prop='articleCategory' align='center' label='分类' width='100' v-if='checkCloumnShow["articleCategory"]'>
                                <template slot-scope='scope'>
                                    <span>{{restData2(scope.row.articleCategory,'articleCategory')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop='articleInterpretation' label='条文释义' width='250' show-overflow-tooltip v-if='checkCloumnShow["articleInterpretation"]&&approveColumn'></el-table-column>
                            <el-table-column show-overflow-tooltip label='适用车型' prop='carModelItems' align='center' min-width='120' v-if='checkCloumnShow["carModelItems"]'>
                                <template slot-scope='scope'>
                                    <!-- <span>{{scope.row.carModelItems?scope.row.carModelItems.join(','):''}}</span> -->
                                    <span>{{restData(scope.row.carModelItems,'carModelItems')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label='动力类型' prop='powerTypeItems' align='center' min-width='120' v-if='checkCloumnShow["powerTypeItems"]'>
                                <template slot-scope='scope'>
                                    <!-- <span>{{scope.row.powerTypeItems?scope.row.powerTypeItems.join(','):''}}</span> -->
                                    <span>{{restData(scope.row.powerTypeItems,'powerTypeItems')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  show-overflow-tooltip label='专业' prop='profession' align='center' min-width='120' v-if='checkCloumnShow["profession"]&&approveColumn'>
                                 <template slot-scope='scope'>
                                    <span  class="viewContent">{{restData(scope.row.profession,'profession')}}</span>
                                 </template>
                            </el-table-column>
                            <el-table-column  label='P0前' prop='priorP0'  align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["priorP0"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.priorP0,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column  label='P0-P1' prop='p0P1'  align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["p0P1"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.p0P1,'pJView')}} 
                                </template>
                            </el-table-column>
                            <el-table-column label='P1-P2' prop='p1P2' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["p1P2"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.p1P2,'pJView')}}
                                </template>
                            </el-table-column> 
                            <el-table-column label='P2-P3' prop='p2P3' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["p2P3"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.p2P3,'pJView')}}
                                </template>
                            </el-table-column> 
                            <el-table-column label='P3-P4' prop='p3P4' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["p3P4"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.p3P4,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J0前' prop='priorJ0' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["priorJ0"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.priorJ0,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J0-J1' prop='j0J1' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j0J1"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j0J1,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J1-J2' prop='j1J2' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j1J2"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j1J2,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J2-J3' prop='j2J3' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j2J3"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j2J3,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J3-J4' prop='j3J4' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j3J4"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j3J4,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J4-J5' prop='j4J5' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j4J5"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j4J5,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J5-J6' prop='j5J6' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j5J6"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j5J6,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J6-J7' prop='j6J7' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j6J7"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j6J7,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='J7-J8' prop='j7J8' align='center' show-overflow-tooltip  min-width='120' v-if='checkCloumnShow["j7J8"]&&approveColumn'>
                                <template slot-scope='scope'>
                                    {{restData(scope.row.j7J8,'pJView')}}
                                </template>
                            </el-table-column>
                            <el-table-column label='操作' align='center' width='120' fixed='right'>
                                <template slot-scope='scope'>
                                    <el-button type='text' @click.stop='editCase(scope.row,"viewCase")'>查看</el-button>
                                    <el-button type='text' @click.stop='editCase(scope.row,"editCase")' v-if='caseType!=="viewCase"'>修改</el-button>
                                    <el-button type='text' @click.stop='deleteCase(scope.row.id)' v-if='caseType!=="viewCase"'>删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
        <viewer :images='preImages' @inited='inited' ref='viewer' class='viewer images clearfix'>
            <template slot-scope='scope'>
                <img :src="src" alt="" v-for='(src,index) in scope.images' :key='index' style='display: none'>
            </template>
        </viewer>
        <!-- <form name="docviewform"  method="get" >
            <input type="hidden" name="fileHeaderId"/>
            <input type="hidden" name="fileName"/>
            <input type="hidden" name="fileHeaderIds"/>
            <input type="hidden" name="expectedName"/>
          </form>
        <iframe name="docviewIframe" style="display:none"></iframe> -->
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { mapState } from 'vuex'
    import {EcoFile} from '@/components/file/main.js'
    import { downloadFile,fileDelete,articleExpandList,structurebaseFuncGroupList,disassembleProgress,structurebaseSingle,articleUpload,articleTree, articleList,articleDel, structurebasePartList, disassembleUpload, downloadExcel,articleExport } from '../service/service.js'
    export default {
        name: 'articleList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            tagSelect
        },
        computed: {
            ...mapState(['powerType', 'applicableModels', 'functionGroupMap', 'articleType', 'RegulatoryRequirementsType', 'professionList']),
            isEdit(){
                return  this.caseType!=="viewCase";
            },
            approveColumn(){
                return this.fromPage==="approveList";
            },
            contentTop() {
                var data1 = this.approveColumn?"210px":"180px";
                var data2 = this.approveColumn?"89px":"59px"
                return this.isShowSearch ? data1 : data2;
            },
        },
        data() {
            return {
                checkAll:true,
                checkAllList:[],
                rowspanMap: new Map(),
                checkColumnData:{
                    'articleCode':'条文号',
                    'articleTitle':'条文标题',
                    'articleContent':'条文内容',
                    'requestType':'法规要求类型',
                    'articleCategory':'分类',
                    'responsibleDepartment':'责任部门',
                    'articleInterpretation':'条文释义',
                    'carModelItems':'适用车型',
                    'powerTypeItems':'动力类型',
                    'profession':'专业',
                    'priorP0':'P0前',
                    'p0P1':'P0-P1',
                    'p1P2':'P1-P2',
                    'p2P3':'P2-P3',
                    'p3P4':'P3-P4',
                    'priorJ0':'J0前',
                    'j0J1':'J0-J1',
                    'j1J2':'J1-J2',
                    'j2J3':'J2-J3',
                    'j3J4':'J3-J4',
                    'j4J5':'J4-J5',
                    'j5J6':'J5-J6',
                    'j6J7':'J6-J7',
                    'j7J8':'J7-J8'
                },
                checkCloumnList: [],
                checkCloumnShow:{},
                timer:null,
                loading:false,
                canClick:true,
                masterId:'',
                uploadParams: {},
                officeInitDataStr: '',
                deptInitDataStr: '',
                partCodeSelList: [],
                isShowSearch: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent: {
                    articleCode: '',//条文号
                    articleTitle: '',//条文标题
                    requestType: '',//法规要求类型（基础数据）
                    articleCategory: '',//条文分类（基础数据）
                    responsibleDepartment: '',//责任部门
                    responsibleOffice: '',//责任科室
                    profession: '', //专业
                    funcGroupCode: [],//功能分组
                    partCode: [],//零部件
                    carModel: '',//适用车型
                    powerType: '',//动力类型
                    orderFrom:'',//tree
                },
                treeData: [],
                tableData: [],
                preImages: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                progressInfo:{},
                selectGroupMap:{
                    baseInfo:{
                        page: 1,
                        rows: 10,
                        total: 0 //this.functionGroupMap.total||
                    },
                    selectData :[], //this.functionGroupMap.data||
                    searchCode:''
                }
            }
        },
        created() {
            _self = this;
            this.selectGroupMap.baseInfo.total = this.functionGroupMap.total;
            this.selectGroupMap.selectData = this.functionGroupMap.data;
            let obj = {};
            for(var key in  this.checkColumnData){
                this.checkCloumnList.push(key);
                this.checkAllList.push(key);
                obj[key] = true
            }
            this.checkCloumnShow = obj;
            this.callAction();//监听窗口的回调函数
        },
        mounted() {
            this.masterId = this.id;
            this.initCase();
        },
        props: {
            id: {
                type: String,
                default: '0'
            },
            caseType: {
                type: String,
                default: ''
            },fromPage:{
                type:String,
                default:''
            }
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkCloumnList = val ? this.checkAllList : [];
                this.checkCloumnChange(this.checkCloumnList);
            },
            putRowspan(array=[]){
                return new Promise((resolve,reject)=>{
                    try {
                       if(array.length === 0){
                           resolve();
                       }
                       let id = '';
                       let item = {};
                       array.forEach((element,index)=>{
                           if(element.id == id){
                                item.rowspan++;
                           }else{
                               this.rowspanMap.set(element.id,{
                                   rowIndex : index,
                                   rowspan :1
                               })
                               item = this.rowspanMap.get(element.id);
                               id = element.id;
                           }
                           if (index === array.length - 1) {
                                resolve()
                            }
                       })

                    }catch(e){
                        reject(e)
                    }
                })
            },
            arraySpanMethod({row, rowIndex, columnIndex}){
               if(this.approveColumn && ([0,1,2,3,4,5,6,7,8].includes(columnIndex)) && !this.isEdit){
                    let item = this.rowspanMap.get(row.id);
                    if(item && item.rowIndex === rowIndex){
                        return {
                            rowspan:item.rowspan || 1,
                            colspan :1
                        }
                    }else{
                        return [0,0]
                    }
               }else{
                   return [1,1]
               }
            },
            checkCloumnChange(val){
                console.log(val);
                for(var key in this.checkCloumnShow){
                     this.checkCloumnShow[key] = val.indexOf(key)!=-1;
                }
                this.$nextTick(function(){
                    this.$refs.articleTable.doLayout();
                })
            },
            filterMethod(val){
                if(this.timer){
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout(function(){
                   _self.selectGroupMap.searchCode = val;
                   _self.selectHRequestData("search",true);
                },300)
            },
            reshProgressInfo(isShowLoading){
                if(this.canClick){
                    this.canClick = false;
                    if(isShowLoading){
                      this.$refs.articleRefLoading.open();
                    }
                    disassembleProgress(this.masterId).then(res2=>{
                        this.canClick = true;
                        this.progressInfo =res2.data;
                        if(res2.data.complete){
                            this.$message.success(this.progressInfo.statusDesc);
                            this.initTree();
                            this.restSearContent();
                        }else{
                            this.$refs.articleRefLoading.close();
                        }
                    }).catch(err=>{
                        this.canClick = true;
                    })
                }
            },
            onFileChange(file,fileList){
                // "ready" | "loading" | "success" | "error"
                if(file.status==='ready'){
                    let url = '/regulationStructured/index.html#/uploadDialog';
                    EcoUtil.getSysvm().openDialog('提示', url, '450', '180', '35vh');
                }
            },
            initCase(){
                disassembleProgress(this.masterId).then(res=>{
                    this.progressInfo = res.data;
                })
                this.initTree();
                this.requestData();
            },
            exportCase(){
                this.$refs.articleRefLoading.open();
                articleExport(this.masterId,this.fromPage,this.isEdit).then(res=>{
                    if(window.navigator && window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(new Blob([res.data],'条文.xlsx'));
                        this.$refs.articleRefLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); // 为blob设置文件类型，这里以.xlsx为例
                        let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '条文.xlsx';
                        this.$refs.articleRefLoading.close();
                        a.click();
                        // 释放这个临时的对象url
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err=>{
                    this.$refs.articleRefLoading.close();
                })
            },
            uploadFile(param,type) {
                this.$refs.articleRefLoading.open();
                //自定义上传方法 param文件信息
                var fileObj = param.file;
                // FormData 对象
                var form = new FormData();
                // 文件对象
                form.append("file", fileObj); //key值为请求的参数名
                form.append('time', new Date().getTime())
                if(type==='articleUpload'){
                    //条文导入
                    form.append('masterId',this.masterId);
                    articleUpload(form,this.fromPage).then(res=>{
                        if(res.data.success){
                            //导入成功
                            this.initTree();
                            this.restSearContent();
                        }else{
                            //失败 下载附件
                            // EcoFile.openFileHeaderByDownload(res.data.fileHeaderId,res.data.fileName);
                            downloadFile(res.data.fileHeaderId).then(response=>{
                                let blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                                let url = window.URL.createObjectURL(blob);
                                let a = document.createElement("a");
                                a.href = url;
                                a.download = res.data.fileName+'.xlsx';
                                a.click();
                                window.URL.revokeObjectURL(url);
                                //删除文件服务器文件
                                fileDelete(res.data.fileHeaderId).then(()=>{
                                    // this.$refs.articleRefLoading.close();
                                    this.initTree();
                                    this.restSearContent();
                                })
                            })
                        }
                    }).catch(err => {
                        this.$refs.articleRefLoading.close();
                        this.$message.error('导入失败');
                    })
                }else{
                    form.append('firstPage', this.uploadParams.firstPage);
                    form.append('endPage', this.uploadParams.endPage);
                    form.append('masterId', this.uploadParams.masterId);
                    disassembleUpload(form,this.fromPage).then(res => {
                        //获取状态信息
                        this.reshProgressInfo(false);
                        this.$refs.articleImport.clearFiles();//清除上次选取文件
                        // downloadExcel(encodeURIComponent(res.data.excel),this.fromPage).then(response => {
                        //     let blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                        //     let url = window.URL.createObjectURL(blob);
                        //     let a = document.createElement("a");
                        //     a.href = url;
                        //     a.download = '拆解文件.xlsx';
                        //     a.click();
                        //     window.URL.revokeObjectURL(url);
                        // })
                    }).catch(err => {
                        this.$refs.articleRefLoading.close();
                        this.$message.error('导入失败');
                    })
                }
            },
            selectRoleDept(data, type) {
                //责任部门
                if (!data.id && data.itemArray.length === 0) {
                    if (type === 'responsibleDepartment') {
                        this.searchContent.responsibleDepartment = '';
                        this.deptInitDataStr = ''
                    } else {
                        this.searchContent.responsibleOffice = '';
                        this.officeInitDataStr = '';
                    }

                } else {
                    if (type === 'responsibleDepartment') {
                        this.searchContent.responsibleDepartment = data.orgId;
                        this.deptInitDataStr = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`
                    } else {
                        this.searchContent.responsibleOffice = data.orgId;
                        this.officeInitDataStr = `{"type":"DEPT","orgId":"${data.orgId}","linkId":"${data.orgId}"}`
                    }
                }
            },
            functionGroupChange(val) {
                this.searchContent.partCode = [];
                if (val.length === 0) {
                    this.partCodeSelList = [];
                } else {
                    let str = '';
                    let arr = [];
                    val.forEach(item => {
                        arr.push(item.split('&')[1]);
                    })
                    structurebasePartList(arr).then(res => {
                        this.partCodeSelList = res.data;
                    }).catch(err => {
                        this.partCodeSelList = [];
                    })
                }
            },
            beforeUpload(file) {
                var testmsg = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLocaleLowerCase();
                const extension = testmsg === 'pdf';
                if (!extension) {
                    this.$message({
                        message: '导入文件只能是.pdf格式!',
                        type: 'warning',
                    });
                }
                return extension;
            },
            beforeUpload2(file){
                var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                const extension = testmsg === "xls";
                const extension2 = testmsg === "xlsx";
                if (!extension && !extension2) {
                    this.$message({
                    message: "导入文件只能是.xls,.xlsx格式!",
                    type: "warning"
                    });
                }
                return extension || extension2;
            },
            openUploadDialog(type) {
                if(type==='articleUpload'){
                   //导入
                    let doit = function(){
                        _self.$refs.articleUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
                    }
                     EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
                }else{
                    //拆解
                    this.$refs.articleImport.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
                }
            },
            dismantlingCase(firstPage, endPage) {
                this.uploadParams = {
                    firstPage: firstPage,
                    endPage: endPage,
                    masterId: this.masterId
                };
                this.$refs.articleImport.submit();
            },
            restData2(data, type) {
                var str = '';
                if (type === 'articleCategory') {
                    this.articleType.forEach(item => {
                        if (data === item.id) {
                            str = item.text;
                        }
                    })
                }
                return str;
            },
            deleteCase(id) {
                let doit = function () {
                    _self.$refs.articleRefLoading.open();
                    articleDel(id,_self.fromPage).then(res => {
                        _self.$message.success('删除成功!');
                        _self.requestData('search');
                        _self.initTree();
                    }).catch(err => {
                        _self.$refs.articleRefLoading.close();
                    })
                }
                EcoMessageBox.confirm('您确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            handleNodeClick(data) {
                if(data.order){
                    this.searchContent.orderFrom = data.order;
                    this.requestData('search');
                }
            },
            inited(viewer) {
                this.$viewer = viewer
            },
            preImgShow(row) {
                var arr = [];
                let mtToken = this.$ecoToken.fileManager.getTempToken();
                if (row.articleContent) {
                    row.articleContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*/ig, function (a, b) {
                        arr.push(`/api/file-manager/safe/preview?mt-token=${mtToken}&file-header-Id=${b}`);
                    })
                }
                this.preImages = arr;
                if (this.preImages.length > 0) {
                    this.$nextTick(function () {
                        this.$viewer.show();
                    })
                }
            },
            initTree() {
                articleTree(this.masterId,this.fromPage,this.isEdit).then(res => {
                    this.treeData = res.data.children || [];
                }).catch(err => {
                    this.treeData = [];
                })
            },
            editCase(row, type) {
                let _width = '1100';
                let _height = '650';
                let url = '/regulationStructured/index.html#/articleEdit/' + row.id + '/' + type + '/' + this.masterId + '/'+ this.fromPage +'/' +this.isEdit;
                let dialogTitle = '查看';
                if (type === 'viewCase') {
                    dialogTitle = '查看'
                } else if (type === 'editCase') {
                    dialogTitle = '修改'
                } else {
                    dialogTitle = '新增'
                    url = '/regulationStructured/index.html#/articleEdit/' + 0 + '/' + type + '/' + this.masterId+ '/'+ this.fromPage +'/'+this.isEdit;
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            restSearContent() {
                this.searchContent = {
                    articleCode: '',//条文号
                    articleTitle: '',//条文标题
                    requestType: '',//法规要求类型（基础数据）
                    articleCategory: '',//条文分类（基础数据）
                    responsibleDepartment: '',//责任部门
                    responsibleOffice: '',//责任科室
                    profession: '', //专业
                    funcGroupCode: [],//功能分组
                    partCode: [],//零部件
                    carModel: '',//适用车型
                    powerType: '',//动力类型
                    orderFrom:''
                };
                this.selectGroupMap={
                    baseInfo:{
                        page: 1,
                        rows: 10,
                        total: this.functionGroupMap.total
                    },
                    selectData :this.functionGroupMap.data,
                    searchCode:''
                };
                if(this.$refs.artTree && this.$refs.artTree.getCurrentNode()){
                    this.$refs.artTree.setCurrentKey();
                }
                this.deptInitDataStr = '';
                this.officeInitDataStr = '';
                this.partCodeSelList = [];
                this.requestData('search');
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'add')) {
                        _self.$message.success('新增成功!');
                        _self.initTree();
                        _self.restSearContent();
                    } else if (obj && (obj.action === 'edit')) {
                        _self.$message.success('修改成功!');
                        _self.initTree();
                        _self.requestData();
                    } else if (obj && (obj.action === 'uploadDialog')) {
                        _self.dismantlingCase(obj.firstPage, obj.endPage);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'articleList');
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search')
            },
            selectHandleCurrentChange(val){
                this.selectGroupMap.baseInfo.page = val;
                this.selectHRequestData('search',false);
            },
            selectHRequestData(type,isFirstP){
                this.loading = true;
                var params = {
                    rows:this.selectGroupMap.baseInfo.rows,
                }
                if(type==='search' && this.selectGroupMap.searchCode){
                     params.code =  this.selectGroupMap.searchCode;
                }
                if(isFirstP){
                    this.selectGroupMap.baseInfo.page = 1;
                }
                params.page=this.selectGroupMap.baseInfo.page;
                structurebaseFuncGroupList(params).then(res=>{
                    this.selectGroupMap.selectData = res.data.rows;
                    this.selectGroupMap.baseInfo.total = res.data.total;
                    this.loading = false;
                }).catch(err=>{
                    this.selectGroupMap.baseInfo.page = 1;
                    this.selectGroupMap.selectData = this.functionGroupMap.data;
                    this.selectGroupMap.baseInfo.total = this.functionGroupMap.total;
                    this.loading = false;
                })
            },

            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData();
            },
            requestData(type) {
                this.$refs.articleRefLoading.open();
                let params = {
                    masterId: this.masterId,
                    sort: ['order'], //articleCode
                    order: ['asc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
                    this.baseInfo.page = 1;
                    for (var key in this.searchContent) {
                        if (Array.isArray(this.searchContent[key])) {
                            if (key === 'funcGroupCode') {
                                var arr = [];
                                this.searchContent[key].forEach(item => {
                                    arr.push(item.split('&')[0]);
                                })
                                params[key] = arr;
                            } else if (this.searchContent[key].length > 0) {
                                params[key] = this.searchContent[key];
                            }
                        } else if (this.searchContent[key]) {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                params.page = this.baseInfo.page;
                if(this.approveColumn){
                    articleExpandList(params).then(res=>{
                        this.baseInfo.total = res.data.total;
                        if(!this.isEdit){
                            //查看
                            this.putRowspan(res.data.rows).then(()=>{
                                this.tableData = res.data.rows;
                                this.$refs.articleRefLoading.close();           
                            })
                           
                        }
                    }).catch(err => {
                        this.baseInfo.total = 0;
                        this.tableData = [];
                        this.$refs.articleRefLoading.close();
                    })
                }else{
                    articleList(params,this.fromPage,this.isEdit).then(res => {
                        this.baseInfo.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.$refs.articleRefLoading.close();
                    }).catch(err => {
                        this.baseInfo.total = 0;
                        this.tableData = [];
                        this.$refs.articleRefLoading.close();
                    })
                }
            }
        },
        watch: {

        }
    }
</script>
<style scoped>
    .articleList {
        color: #0f1419;
        position: relative;
        height: 100%;
        overflow-y: auto;
        color: #0f1419;
    }

    .articleList .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .articleList .searchInputLabel {
        font-size: 14px;
        margin-left: 8px;
    }

    .articleList .noDataTree {
        text-align: center;
        line-height: 100px;
        color: #909399;
        font-size: 12px;
    }

    .articleList .splitLine {
        /* position: absolute; */
        height: 100%;
        border-right: 1px solid rgb(221, 221, 221);
        padding-top: 10px;
        box-sizing: border-box;

    }
    .articleList  .custom-tree-node .nodeText{
        width:150px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .articleList .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

    .standardizationTable /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
        /* border-bottom-width: 0px; */
    }

    /* .standardizationTable /deep/ .el-table__row td {
        border-bottom-width: 0px;
    }

    .standardizationTable /deep/ .el-table__row td,
    .standardizationTable /deep/ .tableHeader th {
        border: 0px;
    } */

    .articleList /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .articleList .modelBox {
        height: 100%;
    }

    .articleList .modelBox .el-col {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 230px;
    }

    .articleList .modelBox .el-col:last-child {
        padding: 10px 10px 0px 0px;
        box-sizing: border-box
    }

    .articleList .modelBox .splitLine {
        left: 0px;
    }

    .articleContentBox {
        cursor: pointer;
        overflow: hidden;
    }

    .articleContentBox /deep/ img {
        width: 100px !important;
        height: auto !important;
    }

    .searchRow.out {
        padding: 15px 10px 16px 10px;
        background: #fff
    }

    .searchRow.out .el-col+.el-col {
        margin-top: 5px;
    }
    .progressText{
        font-size:13px;
        color:#e6a23c;
    }
</style>
