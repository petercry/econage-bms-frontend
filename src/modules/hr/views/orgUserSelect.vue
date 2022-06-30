<template>
  <div class="leagueOrgSelect">
      <div class="orgSelectAside">

            <div class="tabDiv">
                    <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'org'}" style="padding:0px;" @click="changeTab('org')" v-bind:style="{width:getTabWidth }">组织架构</div>
                    <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'group'}" style="padding:0px;" @click="changeTab('group')" v-bind:style="{width:getTabWidth}"  v-if="options.selectTypeMap['USERGROUP'] == 1">用户组</div>
                    <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'role'}" style="padding:0px;" @click="changeTab('role')" v-bind:style="{width:getTabWidth}"  v-if="options.selectTypeMap['ROLE'] == 1">全局角色</div>
                    <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'recent'}" style="padding:0px;" @click="changeTab('recent')" v-bind:style="{width:getTabWidth}">最近联系</div>
            </div>

            <!--组织架构搜索-->
            <div class="searchResultDiv" v-show="tabActiveName == 'org' && showSearch">
                    <div class="desc">
                            <el-row>
                                <el-col :span="12">搜索结果</el-col>
                                <el-col :span="12" style="text-align:right;"><i class="el-icon-close delSearchI" @click="hideSearchDiv"></i></el-col>
                            </el-row>
                    </div>

                    <div  v-for="(item,idx) in searchDeptItems" :key="'aa'+idx" class="selectItem pointerClass" @click="addItem(item)">
                            <!-- <i class="icon iconfont iconleimupinleifenleileibie" style="font-size:12px;"></i> -->
                            <span>{{ getOrgPathFilter(item.orgPath||item.name,searchDeptShowLevel)}}</span>
                    </div>

                    <div  v-for="(item,idx) in searchUserItems" :key="'bb'+idx" class="selectItem pointerClass" @click="addItem(item)">
                            <!-- <i class="icon iconfont iconleimupinleifenleileibie" style="font-size:12px;"></i> -->
                            <span>
                                <i class="searchUserName">{{getOrgPathFilter(item.orgPath||item.name,0)}}</i>
                                <i class="searchUserDept" v-if="searchUserDeptShowLevel!=0">( {{getOrgPathOnlyFilter(item.orgPath||item.name,searchUserDeptShowLevel)}} )</i>
                            </span>
                    </div>
            </div>


            <!--用户组搜索-->
            <div class="searchResultDiv" v-show="tabActiveName == 'group' && showSearchGroup">
                    <div class="desc">
                        <el-row>
                            <el-col :span="12">搜索结果</el-col>
                            <el-col :span="12" style="text-align:right;"><i class="el-icon-close delSearchI" @click="hideSearchGroupDiv"></i></el-col>
                        </el-row>
                    </div>
                    <div  v-for="(item,idx) in searchGroupItems" :key="'aa'+idx" class="selectItem pointerClass"  @click="selectUserGroup(item)">
                            <i class="icon iconfont iconleimupinleifenleileibie" style="font-size:12px;"></i>
                            <span>{{ item.name}}</span>
                    </div>
            </div>

            <!--角色搜索-->
            <div class="searchResultDiv" v-show="tabActiveName == 'role' && showSearchRole">
                    <div class="desc">
                            <el-row>
                                <el-col :span="12">搜索结果</el-col>
                                <el-col :span="12" style="text-align:right;"><i class="el-icon-close delSearchI" @click="hideSearchRoleDiv"></i></el-col>
                            </el-row>
                    </div>

                    <div  v-for="(item,idx) in searchRoleItems" :key="'aa'+idx" class="selectItem pointerClass" @click="selectOrgRole(item)">
                            <i class="icon iconfont iconleimupinleifenleileibie" style="font-size:12px;"></i>
                            <span>{{ item.name}}</span>
                    </div>
            </div>

            <!--组织架构内容-->
            <div class="tabContent" v-show="tabActiveName == 'org'">
                        <div class="orgSearchBar">
                                <el-input
                                        placeholder="请输入内容"
                                        v-model="searchKey"
                                        @keyup.enter.native="searchFunc"
                                        clearable
                                        size="medium"
                                        @input="changeSearchFunc"
                                        style="width:95%"
                                    >
                                    <i slot="suffix" class="el-icon-search pointerClass" style="margin-top:10px" @click="searchFunc"></i>
                                </el-input>
                        </div>

                        <div class="tabContentTree">
                            <el-tree
                                :data="treeData"
                                :props="defaultProps"
                                highlight-current
                                node-key="orgId"
                                :default-expanded-keys="expandedKeys"
                                :load="loadNode"  lazy
                                ref="orgTreeRef"
                                size="mini"
                                :show-checkbox="showCheck"
                                :check-strictly=true
                                @check="checkChange"
                                :expand-on-click-node="expandClick"
                                v-if="treeDataShow"
                            >
                                        <span class="custom-tree-node" slot-scope="{ node, data }" >
                                                <!--部门-->
                                                <span class="custom-tree-node-dept"  v-if="data.type == 'DEPT'" >
                                                    <i class="icon iconfont iconmeixuanzhong  menuIcon treeIcon" @click="toggleSelect(data)" v-show=" (options.selectTypeMap['DEPT'] == 1) && !ucIsSelected(data.orgId)"></i>
                                                    <i class="icon iconfont iconxuanzhong menuIcon treeIcon" @click="toggleSelect(data)" v-show=" (options.selectTypeMap['DEPT'] == 1) && ucIsSelected(data.orgId) "></i>
                                                    <span class="label" @click="handleNodeClick(data)">{{node.label}}</span>
                                                </span>

                                                <span  v-if="data.type == 'DEPT' &&  options.selectTypeMap['ROLE'] == 1">
                                                    <el-dropdown trigger="click" :hide-on-click="false" size="medium" >
                                                            <span class="el-dropdown-link">
                                                            <i class="icon iconfont iconjiaoseguanli" @click="setRoleNode(data)"></i>
                                                            </span>
                                                            <el-dropdown-menu slot="dropdown" style="max-height:250px;overflow:auto" >
                                                                <div v-if="orgRoleMap[data.orgId]">
                                                                    <el-dropdown-item  v-for="item in orgRoleMap[data.orgId]" :key="'cc'+item.code" @click.native="selectRole(item)" v-if="item.type !='GLOBAL'">{{item.name}}</el-dropdown-item>
                                                                </div>
                                                            </el-dropdown-menu>
                                                    </el-dropdown>
                                                </span>

                                                <!--用户-->
                                                <span class="custom-tree-node-user"  v-if="data.type == 'PERSONNEL'" @click="handleNodeClick(data)">
                                                    <i class="icon iconfont iconmeixuanzhong  menuIcon treeIcon" v-show=" (!showCheck) &&  (options.selectTypeMap['USER'] == 1) && !ucIsSelected(data.orgId)"></i>
                                                    <i class="icon iconfont iconxuanzhong menuIcon treeIcon" v-show=" (!showCheck) && (options.selectTypeMap['USER'] == 1 ) && ucIsSelected(data.orgId) "></i>
                                                    <i class="icon iconfont iconnv treeIcon" v-if="data.sex=='w'"></i>
                                                    <i class="icon iconfont iconnan treeIcon" v-else></i>
                                                    {{node.label}}
                                                </span>
                                        </span>
                            </el-tree>
                    </div>
            </div>

            <!--用户组内容-->
            <div class="tabContent" v-show="tabActiveName == 'group'">
                    <div class="orgSearchBar" >
                            <el-input
                                    placeholder="请输入内容"
                                    v-model="searchGroupKey"
                                    @keyup.enter.native="searchGroupFunc"
                                    clearable
                                    size="medium"
                                    @input="changeSearchGroupFunc"
                                    style="width:95%"
                                >
                                <i slot="suffix" class="el-icon-search pointerClass" style="margin-top:10px" @click="searchGroupFunc"></i>
                            </el-input>
                    </div>

                    <div class="tabContentTree">
                        <el-tree
                            :data="userGroupList"
                            :props="{children: 'children',label: 'name',isLeaf: 'isLeaf'}"
                            highlight-current
                            node-key="id"
                            :default-expanded-keys="[0]"
                        >
                            <span class="custom-tree-node" slot-scope="{ node, data }" @click="selectUserGroup(data)">
                                {{node.label}}
                            </span>
                        </el-tree>
                    </div>

            </div>

            <!--角色内容-->
            <div class="tabContent" v-show="tabActiveName == 'role'">
                    <div class="orgSearchBar" >
                            <el-input
                                    placeholder="请输入内容"
                                    v-model="searchRoleKey"
                                    @keyup.enter.native="searchRoleFunc"
                                    clearable
                                    size="medium"
                                    @input="changeSearchRoleFunc"
                                    style="width:95%"
                                >
                                <i slot="suffix" class="el-icon-search pointerClass" style="margin-top:10px" @click="searchRoleFunc"></i>
                            </el-input>
                    </div>

                    <div class="tabContentTree" style="bottom:30px;">
                        <el-tree
                            :data="orgGlobalRoleArray"
                            :props="{children: 'children',label: 'name',isLeaf: 'isLeaf'}"
                            highlight-current
                            node-key="code"
                        >
                            <span class="custom-tree-node" slot-scope="{ node, data }" @click="selectOrgRole(data)">
                                {{node.label}}
                            </span>
                        </el-tree>
                    </div>

                    <div class="tabContentFooter">
                        <el-pagination
                            style="margin-top:2px;"
                            small
                            layout="prev, pager, next"
                            @current-change="roleCurrentChange"
                            :page-size="orgGlobalRoleParams.rows"
                            :total="orgGlobalRoleParams.total">
                        </el-pagination>
                    </div>

            </div>

            <!--最近联系-->
            <div class="tabContent" v-show="tabActiveName == 'recent'">
                    <el-tree
                            :data="orgRecentData"
                            :props="orgRecentProp"
                            highlight-current

                        >
                        <span class="custom-tree-node" slot-scope="{node, data }" @click="addSelect(data)">
                            {{node.label}}
                        </span>
                    </el-tree>
            </div>

      </div>

      <div class="orgSelectMain">

          <div class="selectResultTool">
              <el-row>
                 <el-col :span="12"><span class="desc">已选择（{{ucSelectedTags.length}}）</span></el-col>
                 <el-col :span="12" class="btn">
                    <el-button type="text" class="clearBtn" @click="addDept" v-if="options.btnDeptAdd">&nbsp;添加部门</el-button>
                    <el-button type="text" class="clearBtn" @click="deleteAll"><i class="icon iconfont iconshanchu"></i>&nbsp;清空所有</el-button>
                </el-col>
              </el-row>
          </div>

          <div class="selectResultDiv">
                <div  v-for="(item,idx) in ucSelectedTags" :key="'dd'+idx" class="selectItem"  >
                        <i v-if="item.orgId != -1">{{getOrgPathFilter(item.orgPath||item.name)}}</i>
                        <i v-if="item.orgId == -1 && item.roleDef">全局角色</i>
                        <i v-if="item.roleDef">( {{item.roleDef}} )</i>
                        <span class="close" @click="deleteSelect(item)"><i class="el-icon-close"></i></span>
                </div>

          </div>
      </div>

       <div class="operateTool">
             <div class="opeBtnRow">
                 <el-button  size="mini"  class="opBtn rightBtn" @click="onCancel">取消</el-button>
                 <el-button type="primary" size="mini" class="opBtn" @click="onConfirmOrg">确定</el-button>
             </div>
        </div>
    </div>
</template>
<script>

import {mapState,mapMutations} from 'vuex'
import {getOrgDeptSelectList,getOrgDeptSelectSearchList,getUserGroupList,getOrgsMemberByIds,getDepartmentRoleList} from '../service/service.js'
import {sysEnv} from '../config/env.js'
import {EcoUtil} from '@/components/util/main.js'

export default {
     components:{

     },
     data(){
         return{
            tabActiveName:'org',
            hackReset:true,
            treeData: [],
            treeDataShow:true,
            expandedKeys:[0],
            defaultProps: {
                children: 'children',
                label: 'orgText',
                isLeaf: 'isLeaf'
            },
            options:{
                selectNum:2,  //1为单选，2为多选
                selectType:'PERSONNEL-USER-DEPT', //Dept-User-Role-userGroup
                selectTypeMap:{'PERSONNEL':1,'USER':1,'DEPT':1},
                maxOrgPathLevel:2, //显示的层级
                treeUserHidden:false, //是否显示人员
                btnDeptAdd:false, //是否显示添加部门按钮
            },
            searchKey:null,
            searchRoleKey:null,
            searchGroupKey:null,
            ucValueSelected:[],
            ucSelectedTags:[],

            searchUserItems:[],
            searchDeptItems:[],
            searchRoleItems:[],
            searchGroupItems:[],

            showSearch:false,
            showSearchRole:false,
            showSearchGroup:false,

            treeParam:{
                selectScope:[],
                deptScopeType:''
            },

            orgTypeToTypeMap:{
                'DEPT':'DEPT',
                'USER':'PERSONNEL',
                'ROLE':'ROLE',
                'USERGROUP':'USERGROUP'
            },

            typeToOrgTypeMap:{
                'DEPT':'DEPT',
                'PERSONNEL':'USER',
                'ROLE':'ROLE',
                'USERGROUP':'USERGROUP'
            },

            orgAllRoleArray:[],
            orgRoleArray:[],
            orgRoleMap:{},
            orgGlobalRoleArray:[],
            orgGlobalRoleParams:{
                page:1,
                rows:30,
                total:0,
                sort:'createDate',
                order:'desc',
                name:null
            },

            showCheck:false,
            expandClick:false,
            userGroupList:[],
            orgRecentData:[],
            orgRecentKey:'ECO-ORG-RECENT-DATA',
            orgRecentProp:{
                children: 'children',
                label:function(data,node){
                    return data.orgText + (data.roleCode?' ( '+data.roleDef+' )':'');
                },
                isLeaf: 'isLeaf'
            },
            globalKey:'GLOBAL',
            searchUserDeptShowLevel:-1,
            searchDeptShowLevel:-1

         }
     },
     computed:{
        ...mapState([
              'ecoEventData',
              'ecoEvent'
        ]),

        getTabWidth:function(){
              let _num = 0;
              if(this.options.selectTypeMap['USERGROUP'] == 1){
                    _num++;
              }
              if(this.options.selectTypeMap['ROLE'] == 1){
                   _num++;
              }
              if(_num == 0){
                  return '45%';
              }else if(_num == 1){
                  return '30%';
              }else if(_num == 2){
                  return '22.5%';
              }
        },




     },
     created(){
            //人员搜索显示部门层级
            if(window.hrSetting && window.hrSetting.hasOwnProperty('searchUserDeptShowLevel')){
                this.searchUserDeptShowLevel = window.hrSetting.searchUserDeptShowLevel;
            }

            if(window.hrSetting && window.hrSetting.hasOwnProperty('searchDeptShowLevel')){
                this.searchDeptShowLevel = window.hrSetting.searchDeptShowLevel;
            }
     },
     mounted(){
         try{
            //根据项目名称 设置不同的最近联系
            if(window.parent && window.parent.sysSetting && window.parent.sysSetting.applicationId){
                this.orgRecentKey = window.parent.sysSetting.applicationId+'-'+this.orgRecentKey;
            }
         }catch(e){}

         let _key = this.$route.params.key;
         if(sysEnv == 1){
              let _data  = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_key));
              EcoUtil.getSysvm().deleteTempStore(_key);

              /*初始化配置信息*/
              for(let itemKey in _data.options){
                    this.options[itemKey] = _data.options[itemKey];
              }

              this.options.selectType =  this.options.selectType.toUpperCase();
              this.options.selectTypeMap = {};
              try{
                 (this.options.selectType.split("-")).forEach((item)=>{
                    this.options.selectTypeMap[item] = 1;
                 });

                 if(this.options.selectTypeMap['USER'] == 1){
                     this.options.selectTypeMap['PERSONNEL'] = 1;
                 }
              }catch(e){}

              if(_data.initDataType == 'STR'){//字符串初始化

                    let _initDataStr = _data.initDataStr;
                    let _initDataListStr = [];
                    let _initDataList = [];

                    if(_data.actionGroup && _initDataStr){
                        if(_initDataStr &&  _initDataStr.indexOf('|')>-1){
                            _initDataListStr = (_initDataStr.substring(_initDataStr.indexOf('|')+1)).split("|");
                        }else{
                            _initDataListStr = _initDataStr.split("|");
                        }
                        (_initDataListStr).forEach((element)=>{
                            _initDataList.push(JSON.parse(element));
                        })
                    }else{
                        if(_initDataStr){
                            _initDataListStr = _initDataStr.split("|");
                            (_initDataListStr).forEach((element)=>{
                                _initDataList.push(JSON.parse(element));
                            })
                        }
                    }
                    //初始化选中的数据
                    this.setOldSelectAndRole(_initDataList);
             }else{
                 //初始化选中的数据
                this.setOldSelectAndRole(_data.initDataList);
             }
         }else{
               this.setOldSelectAndRole([]);
         }

         if(this.options.selectType == 'USER' || this.options.selectType == 'PERSONNEL'){
             this.showCheck = false;
             this.true = true;
         }

         this.getGlobalRoleListFunc();  //获取全局角色
         this.getOrgRecentData();   //获取最近联系
         if(this.options.selectTypeMap['USERGROUP'] == 1){
                this.getUserGroupListFunc();
         }

        this.listAction();
        window.ecoOrgUserSelectVm = this;
     },
     methods: {


          listAction(){
            let callBackDialogFunc = function(obj){
                if(obj && obj.action == 'orgDeptAdd-callback'){
                        window.ecoOrgUserSelectVm.reload();
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'ecoOrgUserSelectVm');
        },


         changeTab(val){
             this.tabActiveName  = val;
         },

        //获取部门角色
        getDepartmentRoleListFunc(){
            if(this.orgRoleMap[String(this.clickItem.orgId)]){

            }else{
                getDepartmentRoleList(this.clickItem.orgId,'ORG',{}).then((response)=>{
                    let _data = [];
                    for(let i = 0;i< response.data.rows.length;i++){
                            response.data.rows[i].roleCategory = response.data.rows[i].type;
                            response.data.rows[i].type = 'ROLE';
                            // response.data.rows[i].orgId = '-1';
                            response.data.rows[i].orgText = response.data.rows[i].name;
                            response.data.rows[i].orgPath = response.data.rows[i].name;
                            response.data.rows[i].roleCode = response.data.rows[i].code;
                            response.data.rows[i].roleDef = response.data.rows[i].name;
                            _data.push(response.data.rows[i]);
                    }

                    this.$set(this.orgRoleMap,String(this.clickItem.orgId),_data);
                }).catch((error)=>{ });
            }
        },

        //获取全局角色
        getGlobalRoleListFunc(){
            getDepartmentRoleList(null,'GLOBAL',this.orgGlobalRoleParams).then((response)=>{
                this.orgGlobalRoleParams.total = response.data.total;
                let _data = [];
                for(let i = 0;i< response.data.rows.length;i++){
                        response.data.rows[i].roleCategory = response.data.rows[i].type;
                        response.data.rows[i].type = 'ROLE';
                        response.data.rows[i].orgId = '-1';
                        response.data.rows[i].linkId = '-1';
                        response.data.rows[i].orgText = response.data.rows[i].name;
                        response.data.rows[i].orgPath = response.data.rows[i].name;
                        response.data.rows[i].roleCode = response.data.rows[i].code;
                        response.data.rows[i].roleDef = response.data.rows[i].name;
                        _data.push(response.data.rows[i]);
                }
                this.orgGlobalRoleArray = _data;
            }).catch((error)=>{ });
        },

        roleCurrentChange(val){
            this.orgGlobalRoleParams.page = val;
            this.getGlobalRoleListFunc();
        },

        //用户组列表
        getUserGroupListFunc(){
            let _baseInfo = {page:1,rows:999999,total:0,sort:'createDate',order:'desc'};
            getUserGroupList(_baseInfo).then((response)=>{
                let _data = [];
                for(let i = 0;i< response.data.rows.length;i++){
                        response.data.rows[i].type = 'USERGROUP';
                        response.data.rows[i].orgId = response.data.rows[i].id;
                        response.data.rows[i].linkId = response.data.rows[i].id;
                        response.data.rows[i].orgText = response.data.rows[i].name;
                        response.data.rows[i].orgPath = response.data.rows[i].name;
                        _data.push(response.data.rows[i]);
                }
                this.userGroupList = _data;
            }).catch((error)=>{

            });
        },

        //获取用户最近联系
        getOrgRecentData(){
            let notClearRecent =  window.localStorage.getItem('notClearRecent');
            if(notClearRecent && notClearRecent == '1'){
                    let _recentData = window.localStorage.getItem(this.orgRecentKey);
                    let _recentDataArray = [];
                    if(_recentData){
                        try{
                            _recentDataArray = JSON.parse(_recentData);
                        }catch(e){}
                    }

                    for(let i = 0;i<_recentDataArray.length;i++){
                        let _item = EcoUtil.objDeepCopy(_recentDataArray[i]);
                        if(_item.linkId){

                        }else{
                            _item.linkId = _item.resourceId;
                        }

                        if(this.options.selectTypeMap[_item.type] == 1){
                            this.orgRecentData.push(_item);
                        }
                    }
            }else{
                window.localStorage.removeItem(this.orgRecentKey);
                window.localStorage.setItem('notClearRecent','1');
            }

        },

         loadNode(node,resolve) {
                if(node.level === 0){
                     getOrgDeptSelectList(-1,this.treeParam).then((response)=>{
                        if (response.data&&response.data.length){
                            let _treeData = response.data.map((item)=>{
                                item.isLeaf = !item.haveSub;
                                item.orgUserType = 'dept';
                                item.type = this.orgTypeToTypeMap[item.orgType];
                                item.linkId = item.resourceId;
                                return item;
                            });

                            resolve(_treeData);
                            this.setNodeInitChecked(EcoUtil.objDeepCopy(_treeData)); //初始化选中与否
                        }
                    }).catch((error)=>{
                            console.log(error);
                    });
                    return ;
                }

                getOrgDeptSelectList(node.data.orgId).then((response)=>{
                    let _data = [];
                    for(let i = 0; i<response.data.length; i++){
                        if(response.data[i].orgType == 'USER' &&  this.options.selectTypeMap['USER'] != 1 && this.options.treeUserHidden){

                        }else{
                            response.data[i].isLeaf = !(response.data[i].haveSub);
                            response.data[i].type = this.orgTypeToTypeMap[response.data[i].orgType];
                            response.data[i].linkId = response.data[i].resourceId;
                            _data.push(response.data[i]);
                        }
                    }
                    resolve(_data);
                    this.setNodeInitChecked(EcoUtil.objDeepCopy(_data));//初始化选中与否
            }).catch((error)=>{
                    resolve([]);
            });
        },

        //初始化选中的数据
        setOldSelectAndRole(initDataList){

            (initDataList).forEach((item)=>{
                if(item.type == 'USERGROUP'){
                    if(!item.linkId){
                        item.linkId = item.orgId;
                    }
                }
            })

            getOrgsMemberByIds(initDataList).then((response)=>{
                    for(let i = 0;i<response.data.length;i++){
                            initDataList[i].orgText = response.data[i];
                            initDataList[i].orgPath = response.data[i]
                    }

                    let _ucValueSelected = [];
                    let _ucSelectedTags = [];
                    let _initOrgMap = {};
                    let _orgDefMap  = {};
                    let _orgGroupMap = {};
                    let _that = this;

                    if(initDataList && initDataList.length > 0){
                        for(let i = 0;i<initDataList.length;i++){
                             _initOrgMap[initDataList[i].orgId+(initDataList[i].role?'-'+initDataList[i].role:'')] = initDataList[i]; //存储已选择的数据
                        }

                        (initDataList).forEach((item)=>{ //循环已选择的
                                        let _initOneItem = null;

                                        if(item.type == "USERGROUP"){
                                            _initOneItem = EcoUtil.objDeepCopy(item); //拷贝节点数据
                                            _initOneItem.orgText = item.orgText;
                                            _initOneItem.orgPath = item.orgPath;

                                        }else if(item.role && item.orgId == -1){ //全局角色组
                                            _initOneItem = {};
                                            _initOneItem.type = 'ROLE';
                                            _initOneItem.orgId = '-1';
                                            _initOneItem.linkId = '-1';
                                            _initOneItem.orgText = item.orgText;
                                            _initOneItem.orgPath = item.orgPath;
                                            _initOneItem.roleCode = item.role;
                                            _initOneItem.roleDef =  item.orgText;

                                        }else {
                                            _initOneItem = EcoUtil.objDeepCopy(item); //拷贝节点数据
                                        }

                                        /*如果原数据有角色，填充角色*/
                                        if(_initOneItem){
                                            if(_initOrgMap[item.orgId+(item.role?'-'+item.role:'')] && _initOrgMap[item.orgId+(item.role?'-'+item.role:'')].role){
                                                _initOneItem.roleCode = item.role;
                                                try{
                                                    if(item.orgId == -1){ //全局角色
                                                        _initOneItem.roleDef = item.orgText.indexOf('(')==0?item.orgText.substring(item.orgText.indexOf('(')+1,item.orgText.length-1):item.orgText;
                                                        _initOneItem.orgText = _initOneItem.roleDef;
                                                    }else{
                                                        _initOneItem.roleDef = item.orgText.substring(item.orgText.indexOf('(')+1,item.orgText.length-1);
                                                        _initOneItem.orgText = item.orgText.substring(0,item.orgText.indexOf('('));
                                                    }
                                                }catch(e){
                                                    console.log(e);
                                                }
                                                _initOneItem.orgPath = _initOneItem.orgText;
                                            }

                                            _that.ucValueSelected.push(_initOneItem.orgId+(_initOneItem.roleCode?'-'+_initOneItem.roleCode:''));
                                            _that.ucSelectedTags.push(_initOneItem);
                                            try{
                                                _that.$refs.orgTreeRef.setChecked(_initOneItem.orgId+(_initOneItem.roleCode?'-'+_initOneItem.roleCode:'',true));
                                            }catch(e){
                                                console.log(e);
                                            }
                                    }
                            })

                    }
            })
      },

      setNodeInitChecked(data){
          try{
                let _ucSelectMap = {};
                for(let i = 0;i<this.ucValueSelected.length;i++){
                    _ucSelectMap[this.ucValueSelected[i]] = 1;
                }

                (data).forEach((item)=>{
                        if(_ucSelectMap[item.orgId]){
                           this.$refs.orgTreeRef.setChecked(item.orgId,true);
                        }
                })
          }catch(e){
              console.log(e);
          }
      },

      handleNodeClick(node){
            if(node.type == 'DEPT'){
                let _node = this.$refs.orgTreeRef.getNode(node.orgId);
                if(_node.expanded){
                    _node.collapse();
                }else{
                    _node.expand();
                }
            }else if(node.type == 'PERSONNEL'){
                if(this.options.selectTypeMap['PERSONNEL'] == 1){
                        this.toggleSelect(node);
                }
           }

      },


      //是否已选
      ucIsSelected(value){
            return this.ucValueSelected.indexOf(value)>=0;
      },

      /*选中/不选中*/
      toggleSelect(item){
            let _tempItem = EcoUtil.objDeepCopy(item);
            let idx = this.ucValueSelected.indexOf(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:'') );

            if(idx == -1){ //之前没有
                    if(this.options.selectNum == 1){
                        let _checkKeys = EcoUtil.objDeepCopy(this.$refs.orgTreeRef.getCheckedKeys());
                        this.$refs.orgTreeRef.setCheckedKeys([]);
                        this.ucSelectedTags = [];
                        this.ucValueSelected = [];
                    }

                    this.ucValueSelected.push(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:''));
                    this.ucSelectedTags.push(_tempItem);
                    this.$refs.orgTreeRef.setChecked(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:''),true);

            }else{ //之前有
                    this.ucValueSelected.splice(idx,1);
                    this.ucSelectedTags.splice(idx,1);
                    this.$refs.orgTreeRef.setChecked(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:''),false);
            }



       },


        /*选中/不选中*/
        addSelect(item){

            let _tempItem = EcoUtil.objDeepCopy(item);
            if(_tempItem.type == 'DEPT' && _tempItem.roleCode){
                 _tempItem.type = 'ROLE';
            }

            let idx = this.ucValueSelected.indexOf(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:'') );
            if(idx == -1){ //之前没有
                    if(this.options.selectNum == 1){
                        let _checkKeys = EcoUtil.objDeepCopy(this.$refs.orgTreeRef.getCheckedKeys());
                        this.$refs.orgTreeRef.setCheckedKeys([]);
                        this.ucSelectedTags = [];
                        this.ucValueSelected = [];
                    }

                    this.ucValueSelected.push(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:''));
                    this.ucSelectedTags.push(_tempItem);
                    this.$refs.orgTreeRef.setChecked(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:''),true);

            }else{ //之前有

            }
        },

        selectUserGroup(data){
            let _data =  EcoUtil.objDeepCopy(data);
            this.addItem(_data);
        },

        selectOrgRole(data){
            let _data =  EcoUtil.objDeepCopy(data);
            this.addItem(_data);
        },

        setRoleNode(item){
            this.clickItem = item;
            this.getDepartmentRoleListFunc();
        },

        /*选择角色*/
        selectRole(roleItem){
                let _tempItem = EcoUtil.objDeepCopy(this.clickItem);
                _tempItem.type = 'ROLE';
                _tempItem.roleCode = roleItem.code;
                _tempItem.roleDef = roleItem.name;

                if(this.options.selectNum == 1){
                    this.ucSelectedTags = [];
                    this.ucValueSelected = [];
                }
                let idx = this.ucValueSelected.indexOf(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:''));
                if(idx ==-1){
                    this.ucValueSelected.push(_tempItem.orgId+(_tempItem.roleCode?'-'+_tempItem.roleCode:''));
                    this.ucSelectedTags.push(_tempItem);
                }else{
                    this.ucValueSelected.splice(idx,1);
                    this.ucSelectedTags.splice(idx,1);
                }
        },

        /*删除用户选择*/
        deleteSelect(item){
            this.toggleSelect(item);
        },

        deleteClickItem(){
            let _delItem = [];
            for(let i = 0;i<this.ucSelectedTags.length;i++){
                if(this.ucSelectedTags[i].hasClick){
                    _delItem.push(this.ucSelectedTags[i]);

                }
            }
            (_delItem).forEach((item)=>{
                 this.deleteSelect(item);
            })
        },

        deleteAll(){
            this.ucSelectedTags = [];
            this.ucValueSelected = [];
            this.$refs.orgTreeRef.setCheckedKeys([]);
        },

        addItem(item){
            if(!this.ucIsSelected(item.orgId)){
                this.toggleSelect(item);
            }
        },

        toggleClickSelectItem(item,idx){
            if(item.hasClick){
                this.$set(this.ucSelectedTags[idx],'hasClick',false);
            }else{
                this.$set(this.ucSelectedTags[idx],'hasClick',true);
            }
        },

        hideSearchDiv(){
            this.showSearch = false;
            this.searchKey = null;
            this.searchUserItems = [];
            this.searchDeptItems = [];
        },

        hideSearchRoleDiv(){
            this.showSearchRole = false;
            this.searchRoleKey = null;
            this.searchRoleItems = [];
        },

        hideSearchGroupDiv(){
            this.showSearchGroup = false;
            this.searchGroupKey = null;
            this.searchGroupItems = [];
        },

        changeSearchFunc(val){
            if(val == null || val == ''){
                this.hideSearchDiv();
            }
        },

         changeSearchRoleFunc(val){
            if(val == null || val == ''){
                this.hideSearchRoleDiv();
            }else{

            }
            this.searchRoleFunc();
        },

        changeSearchGroupFunc(val){
             if(val == null || val == ''){
                this.hideSearchGroupDiv();
            }else{
                this.searchGroupFunc();
            }
        },

        searchFunc(){
            this.showSearch = true;
            if(this.searchKey !=null){
                 if(this.options.selectTypeMap['DEPT'] == 1){
                    getOrgDeptSelectSearchList(this.searchKey,'Dept').then((response)=>{
                        let _data = [];
                        for(let i = 0;i< response.data.length;i++){
                            response.data[i].linkId = response.data[i].resourceId;
                            response.data[i].type = this.orgTypeToTypeMap[response.data[i].orgType];
                            _data.push(response.data[i]);

                        }
                        this.searchDeptItems = _data;
                    }).catch((err)=>{
                            console.log(err);
                    })
                }

                if(this.options.selectTypeMap['USER'] == 1){
                    getOrgDeptSelectSearchList(this.searchKey,'User').then((response)=>{
                        let _data = [];
                        for(let i = 0;i< response.data.length;i++){
                            response.data[i].linkId = response.data[i].resourceId;
                            response.data[i].type = this.orgTypeToTypeMap[response.data[i].orgType];
                            _data.push(response.data[i]);
                        }

                        this.searchUserItems = _data;
                    }).catch((err)=>{
                            console.log(err);
                    })
                }
            }
        },

        //搜索全局角色
        searchRoleFunc(){
            // this.showSearchRole = true;
            if(true || this.searchRoleKey !=null){
                    this.orgGlobalRoleParams.page = 1;
                    this.orgGlobalRoleParams.name = this.searchRoleKey;
                    this.getGlobalRoleListFunc();
                    // let _tempSearchRoleItem = [];
                    // for(let i = 0;i<this.orgGlobalRoleArray.length;i++){
                    //     let _name = this.orgGlobalRoleArray[i].name || this.orgGlobalRoleArray[i].i18nText;
                    //     if(_name.indexOf(this.searchRoleKey)>-1){
                    //         _tempSearchRoleItem.push(this.orgGlobalRoleArray[i]);
                    //     }
                    // }
                    // this.searchRoleItems =_tempSearchRoleItem;
            }else{
                this.searchRoleItems = [];
            }
        },

        //搜索用户组
        searchGroupFunc(){
            this.showSearchGroup = true;
            if(this.searchGroupKey !=null){
                    let _tempSearchGroupItem = [];
                    for(let i = 0;i<this.userGroupList.length;i++){
                        let _name = this.userGroupList[i].name || this.userGroupList[i].i18nText;
                        if(_name.indexOf(this.searchGroupKey)>-1){
                            _tempSearchGroupItem.push(this.userGroupList[i]);
                        }
                    }
                    this.searchGroupItems =_tempSearchGroupItem;
            }else{
                this.searchGroupItems = [];
            }
        },


        onConfirmOrg(){
            let _idArray = [];
            let _nameStr = [];
            (this.ucSelectedTags).forEach((item)=>{
                item.role = item.roleCode;

                let _oneItem = {};
                _oneItem.type = item.type;
                _oneItem.orgId = item.orgId;
                _oneItem.linkId = item.linkId;
                _oneItem.resourceId = item.linkId;
                _oneItem.role = item.roleCode;
                if(_oneItem.type == 'DEPT' && _oneItem.role){
                    _oneItem.type = 'ROLE'
                }
                _idArray.push(JSON.stringify(_oneItem));
                _nameStr.push(this.getOrgPathFilter(item.orgPath||item.name)+(item.roleDef?' ('+item.roleDef+')':''));
            })

             this.setRecentData();
             let doObj = {}
             doObj.action = 'userSelectCallBack';
             doObj.data = {};
             doObj.data.itemArray = this.ucSelectedTags;
             doObj.data.id = _idArray.join("|");
             doObj.data.name = _nameStr.join(",");
             doObj.close = true;


             EcoUtil.getSysvm().callBackDialogFunc(doObj);
       },

       setRecentData(){
            let _recentData = this.orgRecentData;
            let _newRecentData = [];
            let _newRecentDataMap = {};
            let i = 0;

            for(i = 0;i <this.ucSelectedTags.length && i<=20;i++){
                 let _item = EcoUtil.objDeepCopy(this.ucSelectedTags[i]);
                _newRecentData.push(_item);
                _newRecentDataMap[_item.orgId+(_item.roleCode?'-'+_item.roleCode:'')] = 1;
            }

            if(i<=20 && _recentData.length > 0){
                for(let j = 0;j<_recentData.length && (i+j+1)<=20 ;j++){
                     let _item = EcoUtil.objDeepCopy(_recentData[j]);
                     if(_newRecentDataMap[_item.orgId+(_item.roleCode?'-'+_item.roleCode:'')]!=1 ){
                        _newRecentData.push(_item);
                        _newRecentDataMap[_item.orgId+(_item.roleCode?'-'+_item.roleCode:'')] = 1;
                     }
                }
            }

            window.localStorage.setItem(this.orgRecentKey,JSON.stringify(_newRecentData));
       },

       onCancel(){
             let doObj = {}
             doObj.close = true;
             EcoUtil.getSysvm().callBackDialogFunc(doObj);
       },

       checkChange(data,data2){
            try{
                  if(this.options.selectNum == 1){
                      let _checkKeys = EcoUtil.objDeepCopy(this.$refs.orgTreeRef.getCheckedKeys());
                      this.$refs.orgTreeRef.setCheckedKeys([]);
                      this.ucSelectedTags = [];
                      this.ucValueSelected = [];
                      if(_checkKeys.length !=0){
                            this.$refs.orgTreeRef.setCheckedKeys([data.orgId]);
                            this.ucValueSelected.push(data.orgId);
                            this.ucSelectedTags.push(EcoUtil.objDeepCopy(data));
                      }
                  }else{
                      let _checkKeys = EcoUtil.objDeepCopy(this.$refs.orgTreeRef.getCheckedKeys());
                      let _currKey = data.orgId;
                      let _hasCheck = false;
                      for(let i = 0;i<_checkKeys.length;i++){
                          if(_checkKeys[i] == _currKey){
                              _hasCheck = true;
                              break;
                          }
                      }
                      if(_hasCheck){
                            this.ucValueSelected.push(data.orgId);
                            this.ucSelectedTags.push(EcoUtil.objDeepCopy(data));
                      }else{
                             let idx = this.ucValueSelected.indexOf(data.orgId);
                            this.ucValueSelected.splice(idx,1);
                            this.ucSelectedTags.splice(idx,1);
                      }
                  }
            }catch(e){
                console.log(e);
            }
      },

        getOrgPathFilter(orgPath,maxOrgPathLevel){
            let _maxOrgPathLevel = this.options.maxOrgPathLevel;
                 if(maxOrgPathLevel || maxOrgPathLevel == 0){
                            _maxOrgPathLevel = maxOrgPathLevel;
                        }

            if(orgPath){
                if(_maxOrgPathLevel == -1){
                    return orgPath;
                }else{
                    let _orgPathArray = orgPath.split("-");
                    let _length = _orgPathArray.length;
                    let _startLength = (_length <= _maxOrgPathLevel)?0:( _length- (_maxOrgPathLevel+1));
                    let _reOrgPathArray = [];
                    for(let i = _startLength;i<_length;i++){
                        _reOrgPathArray.push(_orgPathArray[i]);
                    }
                    return _reOrgPathArray.join('-');
                }
            }else{
                return '';
            }
       },

       getOrgPathOnlyFilter(orgPath,maxOrgPathLevel){
            let _maxOrgPathLevel = this.options.maxOrgPathLevel;
            if(maxOrgPathLevel || maxOrgPathLevel == 0){
                _maxOrgPathLevel = maxOrgPathLevel;
            }
            if(orgPath){
                if(_maxOrgPathLevel == -1){
                    let _orgPathArray = orgPath.split("-");
                    _orgPathArray.pop();
                    return _orgPathArray.join("-");
                }else{
                    let _orgPathArray = orgPath.split("-");
                    _orgPathArray.pop();

                    let _length = _orgPathArray.length;
                    let _startLength = (_length <= _maxOrgPathLevel)?0:( _length- (_maxOrgPathLevel));

                    let _reOrgPathArray = [];
                    for(let i = _startLength;i<_length;i++){
                        _reOrgPathArray.push(_orgPathArray[i]);
                    }
                    return _reOrgPathArray.join('-');
                }
            }else{
                return '';
            }
       },

       addDept(){
            let url = '/hr/index.html#/dept';
            EcoUtil.getSysvm().openMaxDialog('',url);
       },

       reload(){
           this.treeDataShow = false;
           let _that = this;
           setTimeout(function(){
               _that.treeDataShow = true;
           },100)
           this.treeData = [];
       }

     },

    watch: {

    }

 }
</script>

<style scope>



.leagueOrgSelect .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right:10px;
}

.leagueOrgSelect .custom-tree-node-dept{
    width:100%;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
}

.leagueOrgSelect .custom-tree-node-dept .label{
    display: inline-block;
    width:100%;
}

.leagueOrgSelect .custom-tree-node-user{
    width:100%;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
}





.leagueOrgSelect .el-tree-node__content{
    padding:3px 0px;
}


.leagueOrgSelect .orgSearchBar{
    top:00px;
    left:0px;
    right:0px;
    height:30px;
    position:absolute;
    background-color: #fff;
    z-index: 999;
}

.leagueOrgSelect .tabDiv{
    position:absolute;
    left:0px;
    right:0px;
    height:40px;
    top:0px;
    background-color: #fff;
    z-index: 999;
    text-align: center;
    border:0px solid #e7e7e7;
}

.leagueOrgSelect .el-tabs__item{
    font-size: 12px !important;
}

.leagueOrgSelect .tabContent{
    top:50px;
    bottom:0px;
    position:absolute;
    left:0px;
    right:0px;
    overflow-y:auto;
    overflow-x:hidden;
}

.leagueOrgSelect .tabContent .tabContentTree{
    top:45px;
    bottom:0px;
    position:absolute;
    left:0px;
    right:0px;
    overflow-y:auto;
    overflow-x:hidden;
}

.leagueOrgSelect .tabContent .tabContentFooter{
    bottom:0px;
    position:absolute;
    height:30px;
    left:0px;
    right:0px;
    overflow-y:hidden;
    overflow-x:hidden;
    text-align: right;
}



.leagueOrgSelect .is-active{
    border-bottom:2px solid #409EFF;
}

.leagueOrgSelect .el-tabs__nav{
    margin-left:30px;
}


.leagueOrgSelect{
  font-size: 12px;
}

.leagueOrgSelect .kn-header{
  position: absolute;
  left:0;
  right:0;
  top:0;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
}

.leagueOrgSelect .orgSelectAside{
  position: absolute;
  top: 0px;
  left: 0;
  width: 300px;
  bottom: 0px;
  background-color:#fff;
  overflow-x:hidden;
  overflow-y:hidden;
  /* border-right:1px solid #ccc; */
}

.leagueOrgSelect .treeIcon{
  margin-right:0px;
}

.leagueOrgSelect .iconnan{
  font-size: 13px;
}

.leagueOrgSelect .iconnv{
  font-size: 13px;
}

.leagueOrgSelect .orgSelectAside .menuIcon{
  font-size: 14px;
}

.leagueOrgSelect .orgSelectMain{
    position: absolute;
    top: 0px;
    left: 301px;
    bottom:50px;
    right:0;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
    border-left:1px solid #ccc;

}

.leagueOrgSelect .orgSelectMain .selectResultTool{
    line-height: 30px;
    height: 30px;
    position:absolute;
    height:30px;
    left:0px;
    right:0px;
}

.leagueOrgSelect .orgSelectMain .selectResultTool .desc{
    margin-left:10px;
}

.leagueOrgSelect .orgSelectMain .selectResultTool .btn{
    text-align: right;
}

.leagueOrgSelect .orgSelectMain .selectResultTool .clearBtn{
    margin-right:10px;
}


.leagueOrgSelect .searchResultDiv{
    top:90px;
    left:0px;
    right:0px;
    bottom:0px;
    padding:0px 10px;
    position:absolute;
    overflow: auto;
    background-color: #fafafa;
    z-index: 9999;
}



.leagueOrgSelect .searchResultDiv .desc{
    margin-top:3px;
    margin-bottom:5px;
}

.leagueOrgSelect .searchResultDiv .delSearchI{
    font-size: 12px;
    cursor: pointer;
}

.leagueOrgSelect .selectResultDiv{
    position:absolute;
    left:0px;
    right:0px;
    top:30px;
    bottom:0px;
    overflow-y:auto;
    padding:10px;

}

.leagueOrgSelect .selectResultDiv .desc{
    margin-top:3px;
    margin-bottom:5px;
}


.leagueOrgSelect  .selectItem{
    position: relative;
    font-size: 12px;
    line-height: 22px;
    color:#606266;
    padding-left:10px;
    padding:5px;
    background-color: #f1f1f3;
    margin-bottom:7px;
}

.leagueOrgSelect  .selectItem .close{
    position:absolute;
    right:10px;
    cursor: pointer;
}

.leagueOrgSelect  .selectItem .close:hover{
    color:#409EFF;
}

.leagueOrgSelect .selectItem:hover{
    background-color: #e7e8ea ;


}



.leagueOrgSelect .orgSelectMain .hasClick{
    background-color: #e8e3e3;
}


.leagueOrgSelect .iconxuanzhong{
    color:#1ba5fa;
}


.leagueOrgSelect .operateTool{
    position:absolute;
    right:0px;
    bottom:0px;
    height:50px;
    line-height: 50px;
    left:301px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    border-left:1px solid #ccc;
}

.leagueOrgSelect .opeBtnRow{
  text-align: right;

}

.leagueOrgSelect .opBtn{
  width:100px;
}

.leagueOrgSelect .rightBtn{
  margin-left:20px;
}

.leagueOrgSelect .searchUserName{

}

.leagueOrgSelect .searchUserDept{
    color:#777;
}



</style>
<style>
.el-scrollbar__bar.is-horizontal{
    display: none !important;
}
</style>

