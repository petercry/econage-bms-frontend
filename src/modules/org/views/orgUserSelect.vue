<template>
  <div class="leagueOrgSelect">

      <div class="orgSelectAside">
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

                <div class="searchResultDiv" v-show="showSearch">
                    <div class="desc">
                            <el-row>
                                <el-col :span="12">搜索结果</el-col>
                                <el-col :span="12" style="text-align:right;"><i class="el-icon-close delSearchI" @click="hideSearchDiv"></i></el-col>
                            </el-row>
                    </div>

                    <div  v-for="(item,idx) in searchDeptItems" :key="'aa'+idx" class="selectItem pointerClass" @click="addItem(item)">
                             <i class="icon iconfont iconleimupinleifenleileibie" style="font-size:12px;"></i>
                            <span>{{ getOrgPathFilter(item.orgPath||item.name)}}</span>
                    </div>

                      <div  v-for="(item,idx) in searchUserItems" :key="'bb'+idx" class="selectItem pointerClass" @click="addItem(item)">
                             <i class="icon iconfont iconleimupinleifenleileibie" style="font-size:12px;"></i>
                            <span>{{ getOrgPathFilter(item.orgPath||item.name)}}</span>
                    </div>
                </div>
          

            <div class="tabDiv">
                <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'org'}" style="padding:0px;" @click="changeTab('org')" v-bind:style="{width:getTabWidth }">组织架构</div>
                <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'group'}" style="padding:0px;" @click="changeTab('group')" v-bind:style="{width:getTabWidth}"  v-if="options.selectTypeMap['USERGROUP'] == 1">用户组</div>
                <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'role'}" style="padding:0px;" @click="changeTab('role')" v-bind:style="{width:getTabWidth}"  v-if="options.selectTypeMap['ROLE'] == 1">全局角色</div>
                <div  class="el-tabs__item is-top " v-bind:class="{'is-active':tabActiveName == 'recent'}" style="padding:0px;" @click="changeTab('recent')" v-bind:style="{width:getTabWidth}">最近联系</div>
            </div>
          
           <div class="tabContent" v-show="tabActiveName == 'org'">
                  <!-- <el-scrollbar style="height:100%" > -->
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
                        >
                                    <span class="custom-tree-node" slot-scope="{ node, data }" >
                                            <!--部门-->
                                            <span class="custom-tree-node-dept"  v-if="data.orgType == 'DEPT'" >
                                                <i class="icon iconfont iconmeixuanzhong  menuIcon treeIcon" @click="toggleSelect(data)" v-show=" (options.selectTypeMap['DEPT'] == 1) && !ucIsSelected(data.orgId)"></i>
                                                <i class="icon iconfont iconxuanzhong menuIcon treeIcon" @click="toggleSelect(data)" v-show=" (options.selectTypeMap['DEPT'] == 1) && ucIsSelected(data.orgId) "></i>
                                                <span class="label" @click="handleNodeClick(data)">{{node.label}}</span>
                                            </span>

                                            <span  v-if="data.orgType == 'DEPT' &&  options.selectTypeMap['ROLE'] == 1">
                                             
                                                 <el-dropdown trigger="click" :hide-on-click="false" size="medium" >
                                                        <span class="el-dropdown-link">
                                                           <i class="icon iconfont iconjiaoseguanli" @click="setRoleNode(data)"></i>
                                                        </span>
                                                        <el-dropdown-menu slot="dropdown" style="max-height:250px;overflow:auto">
                                                            <el-dropdown-item v-for="item in orgRoleArray" :key="'cc'+item.code" @click.native="selectRole(item)" v-if="item.type !='GLOBAL'">{{item.name}}</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                 </el-dropdown>
                                            </span>

                                            <!--用户-->
                                            <span class="custom-tree-node-user"  v-if="data.orgType == 'USER'" @click="handleNodeClick(data)">
                                                <i class="icon iconfont iconmeixuanzhong  menuIcon treeIcon" v-show=" (!showCheck) &&  (options.selectTypeMap['USER'] == 1) && !ucIsSelected(data.orgId)"></i>
                                                <i class="icon iconfont iconxuanzhong menuIcon treeIcon" v-show=" (!showCheck) && (options.selectTypeMap['USER'] == 1 ) && ucIsSelected(data.orgId) "></i>
                                                <i class="icon iconfont iconnv treeIcon" v-if="data.sex=='w'"></i>
                                                <i class="icon iconfont iconnan treeIcon" v-else></i>
                                                {{node.label}}
                                            </span>
                                    </span>
                        </el-tree>
                <!-- </el-scrollbar> -->
        </div>

        <div class="tabContent" v-show="tabActiveName == 'group'">
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


         <div class="tabContent" v-show="tabActiveName == 'role'">
             
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
                     <el-button type="text" class="clearBtn" @click="deleteAll"><i class="icon iconfont iconshanchu"></i>&nbsp;清空所有</el-button>
                </el-col>
              </el-row>
          </div>

          <div class="selectResultDiv">
            
                    <div  v-for="(item,idx) in ucSelectedTags" :key="'dd'+idx" class="selectItem"  >
                         <i v-if="item.orgId != -1">{{getOrgPathFilter(item.orgPath||item.name)}}&nbsp;&nbsp;</i>
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
import {getOrgDeptSelectList,getOrgDeptSelectSearchList,getOrgsByOrgIds,getRoleList,getUserGroupList,getUserGroupMulti,searchOrgManageDept,searchOrgManageUser} from '../service/service.js'
import {sysEnv} from '../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import axios from 'axios'

export default {
     components:{
     
     },
     data(){
         return{
            tabActiveName:'org',
            hackReset:true,
            treeData: [],
            expandedKeys:[0],
            defaultProps: {
                children: 'children',
                label: 'orgText',
                isLeaf: 'isLeaf'
            },

            options:{
                selectNum:2,  //1为单选，2为多选
                selectType:'USER-ROLE-DEPT', //Dept-User-Role-userGroup 
                selectTypeMap:{'USER':1,'ROLE':1,'DEPT':1},
                maxOrgPathLevel:2 //显示的层级
            },
            searchKey:null,
            ucValueSelected:[],
            ucSelectedTags:[],

            searchUserItems:[],
            searchDeptItems:[],

            showSearch:false,
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
                'DEPT':'Dept',
                'PERSONNEL':'User',
                'ROLE':'Role',
                'USERGROUP':'userGroup'
            },
            
            orgAllRoleArray:[],
            orgRoleArray:[],
            orgGlobalRoleArray:[],
      
            orgRoleMap:{},

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

            globalKey:'GLOBAL'

         
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
                  return '22.5';
              }
                    
        },
         
     },
     created(){
         
        
     },
     mounted(){
         let _key = this.$route.params.key;
         if(sysEnv == 1){
              let _data  = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_key));
             
              EcoUtil.getSysvm().deleteTempStore(_key);
              for(let itemKey in _data.options){
                    this.options[itemKey] = _data.options[itemKey];
              }
              this.options.selectType =  this.options.selectType.toUpperCase();
              this.options.selectTypeMap = {}; 
              try{
                 (this.options.selectType.split("-")).forEach((item)=>{
                    this.options.selectTypeMap[item] = 1;
                 });
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
       
         if(this.options.selectType == 'USER'){
             this.showCheck = false;
             this.true = true;
         }

         this.getUserGroupListFunc();
         this.getOrgRecentData();

     },
     methods: {
         changeTab(val){
             this.tabActiveName  = val;
         },

        //用户组列表
        getUserGroupListFunc(){
            let _baseInfo = {page:1,rows:999999,total:0,sort:'createDate',order:'desc'};
            getUserGroupList(_baseInfo).then((response)=>{
                this.userGroupList = response.data.rows;
            }).catch((error)=>{
              
            });
        },

        //获取用户最近联系
        getOrgRecentData(){
            let _recentData = window.localStorage.getItem(this.orgRecentKey);
            let _recentDataArray = [];
            if(_recentData){
                try{
                    _recentDataArray = JSON.parse(_recentData);
                }catch(e){}
            }

            for(let i = 0;i<_recentDataArray.length;i++){
                let _item = EcoUtil.objDeepCopy(_recentDataArray[i]);
              
                if(this.options.selectTypeMap[_item.orgType ] == 1){
                    this.orgRecentData.push(_item);
                }
            }

        },

         loadNode(node,resolve) {
                if(node.level === 0){
              
                     getOrgDeptSelectList(-1,this.treeParam).then((response)=>{
                        if (response.data&&response.data.length){
                            let _treeData = response.data.map((item)=>{
                                    item.isLeaf = !item.haveSub;
                                    item.orgUserType = 'dept';
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
                    let data = response.data.map((item)=>{
                        item.isLeaf = !item.haveSub;
                        return item;
                    });
                    resolve(data);
                    this.setNodeInitChecked(EcoUtil.objDeepCopy(data));//初始化选中与否
            }).catch((error)=>{
                    resolve([]);
            });
        },

        //初始化选中的数据
        setOldSelectAndRole(initDataList){
            //初始化角色
            getRoleList().then((response)=>{
                this.orgAllRoleArray = response.data.rows; 
            

                (response.data.rows).forEach((item)=>{
                    this.orgRoleMap[item.code] = item;
                    if(item.type == this.globalKey){
                        this.orgGlobalRoleArray.push(item);
                    }else{
                        this.orgRoleArray.push(item);
                    }
                })

                let _ucValueSelected = [];
                let _ucSelectedTags = [];
                let _initOrgIdList = [];
                let _initOrgMap = {};
                let _orgDefMap  = {};
                let _orgGroupMap = {};
                let _that = this;
                
                if(initDataList && initDataList.length > 0){
                    (initDataList).forEach((item)=>{
                         _initOrgIdList.push(item.orgId);
                         _initOrgMap[item.orgId+(item.role?'-'+item.role:'')] = item; //存储已选择的数据
                    })
                    
                    if(_initOrgIdList.length > 0){

                        axios.all([getOrgsByOrgIds(_initOrgIdList), getUserGroupMulti(_initOrgIdList)])
                            .then(axios.spread(function (res1, res2) {
                                for(let i = 0;i<res1.data.length;i++){
                                     _orgDefMap[res1.data[i].orgId] = res1.data[i]; //存储节点的数据
                                }
                                for(let i = 0;i<res2.data.length;i++){
                                     _orgGroupMap[res2.data[i].id] = res2.data[i];
                                }
                                
                                (initDataList).forEach((item)=>{ //循环已选择的
                              
                                    let _initOneItem = null;
                                    if(item.type == "USERGROUP" || item.orgType == "USERGROUP"){
                                        _initOneItem = EcoUtil.objDeepCopy(_orgGroupMap[item.orgId]);
                                        _initOneItem.orgId = _initOneItem.id;
                                        _initOneItem.orgType = 'USERGROUP';
                                        _initOneItem.resourceId = _initOneItem.resourceId;
                                        _initOneItem.orgText = _initOneItem.name;
                                        _initOneItem.orgPath = _initOneItem.name;
                                    }else if(item.role && item.orgId == -1){ //全局角色组
                                        _initOneItem = {};
                                        _initOneItem.orgType = 'ROLE';
                                        _initOneItem.orgId = '-1';
                                        _initOneItem.resourceId = '-1';
                                        _initOneItem.orgText = _that.orgRoleMap[item.role].name;
                                        _initOneItem.orgPath = _that.orgRoleMap[item.role].name;
                                        _initOneItem.roleCode = item.role;
                                        _initOneItem.roleDef = _that.orgRoleMap[item.role].name;

                                    }else {
                                        _initOneItem = EcoUtil.objDeepCopy( _orgDefMap[item.orgId]); //拷贝节点数据
                                    }

                                    // let _initOneItem = EcoUtil.objDeepCopy( _orgDefMap[item.orgId]); //拷贝节点数据
                                    /*如果原数据有角色，填充角色*/
                                    if(_initOneItem){
                                        if(_initOrgMap[item.orgId+(item.role?'-'+item.role:'')] && _initOrgMap[item.orgId+(item.role?'-'+item.role:'')].role){
                                                let _oneRole =  _that.orgRoleMap[_initOrgMap[item.orgId+(item.role?'-'+item.role:'')].role];
                                                _initOneItem.roleCode = _oneRole.code;
                                                _initOneItem.roleDef = _oneRole.name;
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

                        }))
                    }
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
            if(node.orgType == 'DEPT'){
                let _node = this.$refs.orgTreeRef.getNode(node.orgId);
                if(_node.expanded){
                    _node.collapse();
                }else{
                    _node.expand();
                }
            }else if(node.orgType == 'USER'){
                if(this.options.selectTypeMap['USER'] == 1){
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
            if(_tempItem.orgType == 'DEPT' && _tempItem.roleCode){
                 _tempItem.orgType = 'ROLE';
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
            if (data.id!=0){
                _data.orgType = 'USERGROUP';
                _data.orgId = data.id;
                _data.resourceId = data.resourceId;
                _data.orgText = data.name;
                _data.orgPath = data.name;
                this.addItem(_data);
            }
           
        },

        selectOrgRole(data){
                let _data = {};
                _data.orgType = 'ROLE';
                _data.orgId = '-1';
                _data.resourceId = '-1';
                _data.orgText = data.name;
                _data.orgPath = data.name;
                _data.roleCode = data.code;
                _data.roleDef = data.name;
                this.addItem(_data);
            
        },

        setRoleNode(item){
            this.clickItem = item;
        },

       /*选择角色*/
       selectRole(roleItem){

            let _tempItem = EcoUtil.objDeepCopy(this.clickItem);
          
            _tempItem.orgType = 'ROLE'
           
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

        changeSearchFunc(val){
            if(val == null || val == ''){
                this.hideSearchDiv();
            }
        },

        searchFunc(){
            this.showSearch = true;
            if(this.searchKey !=null){
                 if(this.options.selectTypeMap['DEPT'] == 1){
                    getOrgDeptSelectSearchList(this.searchKey,'Dept').then((response)=>{
                            this.searchDeptItems = response.data;
                    }).catch((err)=>{
                            console.log(err);
                    })
                }

                if(this.options.selectTypeMap['USER'] == 1){
                    getOrgDeptSelectSearchList(this.searchKey,'User').then((response)=>{
                            this.searchUserItems = response.data;
                    }).catch((err)=>{
                            console.log(err);
                    })
                }
            }
        },

        onConfirmOrg(){
            let _idArray = [];
            let _nameStr = [];
            
            (this.ucSelectedTags).forEach((item)=>{
                    let _oneItem = {};
                    _oneItem.type = this.orgTypeToTypeMap[item.orgType.toUpperCase()];
                    _oneItem.orgId = item.orgId;
                    _oneItem.linkId = item.resourceId;
                    _oneItem.resourceId = item.resourceId;
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

       getOrgPathFilter(orgPath){
            if(orgPath){
                if(this.options.maxOrgPathLevel == -1){
                    return orgPath;
                }else{
                    let _orgPathArray = orgPath.split("-");
                    let _length = _orgPathArray.length;
                    
                    let _startLength = (_length <= this.options.maxOrgPathLevel)?0:( _length- (this.options.maxOrgPathLevel+1));
                
                    
                    let _reOrgPathArray = [];
                    for(let i = _startLength;i<_length;i++){
                        _reOrgPathArray.push(_orgPathArray[i]);
                    }
                    return _reOrgPathArray.join('-');
                }
            }else{
                return '';
            }
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
    top:0px;
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
    top:40px;
    background-color: #fff;
    z-index: 999;
    text-align: center;
    border:0px solid #e7e7e7;
}

.leagueOrgSelect .el-tabs__item{
    font-size: 12px !important;
}

.leagueOrgSelect .tabContent{
    top:90px;
    bottom:0px;
    position:absolute;
    left:0px;
    right:0px;
    /* border-right:1px solid #e7e7e7; */
    overflow-y:auto;
    overflow-x:hidden;
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
    top:50px;
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



</style>
<style>
.el-scrollbar__bar.is-horizontal{
    display: none !important;
}
</style>