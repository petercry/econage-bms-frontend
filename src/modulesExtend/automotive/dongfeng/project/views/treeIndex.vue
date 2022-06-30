<template>
    <div class="basicKvIndex webLayout" v-loading='isLoading'>
        <div class="treeKvAside">

            <el-row  class="toolBar">
                    <el-col :span="24">
                        <eco-tool-title style="line-height: 38px;" :title="'项目开发点检'"></eco-tool-title>
                    </el-col>
            </el-row>
           
            <div class="treeContent">
                
                <el-scrollbar style="height:100%" >
                      <el-tree
                          :data="treeData"
                          :props="defaultProps"
                          highlight-current
                          node-key="key"
                          :default-expanded-keys="expandedKeys"
                          :default-checked-keys="checkedKeys"
                          ref="treeRef"
                          show-checkbox
                          @check-change="handleCheckChange"
                          v-if="treeLoaded"
                      > 
                          <div class="custom-tree-node"   slot-scope="{ node, data }">
                              <span class="type-name">{{ node.label }}</span>
                          </div>
                    </el-tree>
              </el-scrollbar>
          </div>
        </div>

        <div class="treeKvMain">
                    <eco-content top="0px" height="60px" type="tool">
                                <el-row  class="toolbar">
                                    <el-col :span="18">
                                        <span class="desc">所属平台：</span>
                                        <el-select
                                                v-model="searchParams.platform"
                                                placeholder="请选择"
                                                clearable
                                                multiple
                                                collapse-tags
                                                @change="searchListFunc"
                                            >
                                                <el-option
                                                    v-for="(item,index) in baseData['PRO_PLATFORM']"
                                                    :key="index"
                                                    :label="item.text"
                                                    :value="item.id"
                                                >
                                                </el-option>
                                        </el-select>

                                        <span class="desc">项目编号：</span>
                                        <el-input v-model="searchParams.projectCode" style="width:150px;" @keyup.enter.native="searchListFunc"></el-input>
                                        <el-button type="primary" @click="searchListFunc">搜索</el-button>
                                    </el-col>
                                    <el-col :span="6" style="text-align:right;padding-right:10px;">
                                        <el-button v-show='initRole.PAGE_LIST.permission.INIT' type="text" size="medium" @click="addFunc"><i class="icon iconfont icontianjia"></i> 新增项目</el-button>
                                        <el-button v-show='initRole.PAGE_LIST.permission.INIT' type="text" size="medium" @click="syncCase">同步</el-button>
                                        <el-button type="text" size="medium" @click="sortFunc" v-if="false"><i class="icon iconfont iconpaixu"></i> 排序</el-button>
                                    </el-col>
                                </el-row>
                    </eco-content>

                    <eco-content top="60px" bottom="0" style="padding:15px;">
                                <el-table
                                    :data="proList"
                                    highlight-current-row
                                    stripe
                                    class="styleTableDefault"
                                    style="width: 100%"
                                    size="mini"
                                    height="100%"
                                    border
                                >

                                <el-table-column
                                    type="index"
                                    width="40"
                                    >
                                </el-table-column>

                                <el-table-column
                                        prop="platform"
                                        show-overflow-tooltip
                                        label="所属平台"
                                        width="120"
                                        min-width="120"
                                >
                                    <template slot-scope="scope" >
                                        <span >{{getKVName(baseData['PRO_PLATFORM'],scope.row.platform)}}</span>
                                    </template>

                                </el-table-column>

                                <el-table-column
                                        prop="projectName"
                                        show-overflow-tooltip
                                        label="项目名称"
                                        min-width="100"
                                    >
                                        <template slot-scope="scope" >
                                            <span class="detail" @click="goDetail(scope.row)">{{scope.row.projectName}}</span>
                                        </template>
                                </el-table-column>

                                <el-table-column
                                        prop="commodityTarget"
                                        show-overflow-tooltip
                                        label="商品目标"
                                        width="100"
                                    >
                                </el-table-column>

                                <el-table-column
                                        prop="carModelItems"
                                        show-overflow-tooltip
                                        label="车辆类型"
                                        width="120"
                                    >
                                       <template slot-scope="scope" >
                                            <span>{{scope.row.carModelItemNames?scope.row.carModelItemNames.join('/'):''}}</span>
                                        </template>
                                    
                                </el-table-column>

                                <el-table-column
                                        prop="powerTypeItems"
                                        show-overflow-tooltip
                                        label="动力类型"
                                        width="100"
                                    >
                                     <template slot-scope="scope" >
                                        <span>{{scope.row.powerTypeItemNames?scope.row.powerTypeItemNames.join('/'):''}}</span>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                        prop="sopTime"
                                        show-overflow-tooltip
                                        label="预计SOP时间"
                                        width="120"
                                    >
                                </el-table-column>

                                <el-table-column
                                        prop="eopTime"
                                        show-overflow-tooltip
                                        label="预计EOP时间"
                                        width="120"
                                    >
                                </el-table-column>


                                <el-table-column
                                        label="操作"
                                        width="50"
                                    >
                                    <template slot-scope="scope">
                                        <span v-if='scope.row.owner' class="del" @click="deleteItem(scope.row.id,scope.row.key)">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                    </eco-content>

        </div>
     </div>
</template>
<script>
import axios from 'axios'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getEnumSelectEnabled,getProList,deleteProBaseInfo,projectSyncCase} from '../service/service.js'
import {mapState,mapActions,mapMutations} from 'vuex'
import {sysEnv} from '../config/env.js'
import EcoUtil from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default {
  name:'proTreeIndex',
  components:{
      ecoToolTitle,
      ecoContent
  },
  data(){
    return {
      isLoading:false,
      treeLoaded:false,
      treeData:[],
      allProList:[],
      proList:[],
      expandedKeys:[],
      checkedKeys:[],
      checkedKeysMap:{},  
      defaultProps: {
            label(data,node){
                return data.text ;
            },
            children:'children'
      },
      listAction:'create-enabled',
      clickType:null,
      proParams:{
            page:1,
            rows:999999,
            sort:'createDate',
            order:'asc'
      },
      searchParams:{
          platform:[],
          projectCode:null
      },
       searchFlag:false,

       proKey2IdMap:{}
    }
  },
  computed:{
        ...mapState([
              'baseData',
              'initRole'
        ])
        
  },
  created(){
      this.initProjectBaseData('create-enabled').then(() => { });
      this.setRole().then(()=>{
        // console.log(this.initRole);
      })
    
  },
  mounted(){
      this.getProListFunc();
      window.treeKvVm = this; //添加监听
      this.addMonitor(); //添加监听
  },
  methods: {
        ...mapActions([
            'initProjectBaseData',
            'setRole'
        ]),
        syncCase(){
            if(!this.isLoading){
                this.isLoading=true;
                projectSyncCase().then(res=>{
                    this.isLoading=false;
                    this.$message.success('同步成功');
                }).catch(err=>{
                    this.isLoading=false;
                    this.$message.error('同步失败');
                })
            }
        },
        addMonitor(){
            
            window.tabClickFunc = function(){
                window.treeKvVm.reload();
            }

            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'proBaseInfoAddCallBack')){ 
                    obj.data.entity.memberPermission = true;
                    window.treeKvVm.addCBFunc(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'basicKvIndex');
        },

        getProListFunc(){
            let _that = this;
            axios.all([getEnumSelectEnabled('PRO_PLATFORM'), getProList(this.proParams)])
                  .then(axios.spread(function (res1, res2) {
                        let _treeMap = {};
                        (res2.data.rows).map((item)=>{
                              item.text = item.projectCode;
                              if(!(_treeMap[item.platform])){
                                  _treeMap[item.platform] = [];
                              }
                              _treeMap[item.platform].push(item);
                              _that.allProList.push(item);
                              _that.proKey2IdMap[item.key] = item.id;

                        })
                        
                        let _treeData = [];
                        (res1.data).map((item)=>{
                            item.key = item.id;
                            if(_treeMap[item.id]){
                                item.children = _treeMap[item.id];
                            }else{
                                item.children = [];
                            }
                            _treeData.push(item);
                            _that.checkedKeys.push(item.id);
                            _that.expandedKeys.push(item.id)
                        })

                        _that.treeData = _treeData;
                        _that.treeLoaded = true;

                        setTimeout(()=>{
                            _that.handleCheckChange();
                        },100)
            }))
        },

        handleCheckChange() {
                let _map = {};
                let _keys = this.$refs.treeRef.getCheckedKeys();
                (_keys).forEach((item)=>{
                    _map[item] = 1;
                })
                this.checkedKeysMap = _map;
                this.searchFlag = false;
                this.filterProList();
        },

        filterProList(){
            let _proList = [];
            (this.allProList).map((item)=>{
                if(this.checkedKeysMap[item.key]){
                    _proList.push(item);
                }
            })
            this.proList = _proList;
        },

        searchListFunc(){
            let _proList = [];
            let _searchPlatformMap = {};
            for(let i = 0;i< this.searchParams.platform.length;i++){
                _searchPlatformMap[this.searchParams.platform[i]] = 1;
            }
            
            (this.allProList).map((item)=>{

                let _hasItem = true;
                if(this.searchParams.projectCode && this.searchParams.projectCode!=''){
                    if(item.projectCode.indexOf(this.searchParams.projectCode)== -1 ){
                        _hasItem = false;
                    }
                }

                if(this.searchParams.platform.length > 0){
                    if(!_searchPlatformMap[item.platform]){
                        _hasItem = false; 
                    }
                }

                if(_hasItem){
                    _proList.push(item);
                }
            })

            this.proList = _proList;
            this.searchFlag = true;
        },

        goDetail(item){
            let _id = this.proKey2IdMap[item.key];
            if(sysEnv == 1){
                if(item.memberPermission){
                    let tabObj = {};
                    tabObj.desc = item.projectName;
                    let goPage= "project/index.html#/proIndex/"+_id+"/proBaseInfo";
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'proDetail" + item.key + "',href_link:'" + goPage + "'}"
                    tabObj.reload = true;
                    tabObj.clearIframe = true;
                    EcoUtil.getSysvm().doTab(tabObj);
                }else{
                    this.$message.warning('无权限')
                }   
                  
            }else{
                if(item.memberPermission){
                    this.$router.push({name:'proBaseInfo',params:{proId:_id}});
                }
            }
        },

        //添加类别 root层级
        addFunc(){
                if(sysEnv == 1){
                    let url = '/project/index.html#/addProjectBaseInfo';
                    EcoUtil.getSysvm().openDialog('新增项目',url,800,500,'12vh');
                }else{
                    this.$router.push({name:'addProjectBaseInfo'});
                }
        },

        addCBFunc(data){
            let _currentNode = this.$refs.treeRef.getNode(data.entity.platform);
            data.entity.text = data.entity.projectCode;
            let _appendData = EcoUtil.objDeepCopy(data.entity);
         
            this.$refs.treeRef.append(_appendData,_currentNode);
            this.allProList.push(EcoUtil.objDeepCopy(data.entity));

            this.proKey2IdMap[data.entity.key] = data.entity.id;


        },

       deleteItem(id,key){
              let that  = this;
              let confirmYesFunc = function(){
                  let _ids = [];
                  _ids.push(id);
                  deleteProBaseInfo(_ids).then((response)=>{
                        that.$message({
                              showClose: true,
                              message:'删除成功',
                              type: 'success',
                              duration:2000
                        });

                        let _node = null;
                        for(let i = 0;i<that.proList.length;i++){
                            if(that.proList[i].id == id){
                                _node = EcoUtil.objDeepCopy(that.proList[i]);
                                that.proList.splice(i,1);
                                break;
                            }
                        }
                        for(let i = 0;i<that.allProList.length;i++){
                            if(that.allProList[i].id == id){
                                that.allProList.splice(i,1);
                            }
                        }
                        that.$refs.treeRef.remove(_node);
                  })
              }

              let options = { type:'warning',lockScroll:false}
              EcoMessageBox.confirm('确认删除？','提示',options,confirmYesFunc);
          },


        reload(){
            getProList(this.proParams).then((response) =>{
                let _proList = [];
                for(let i = 0;i<response.data.rows.length;i++){
                    _proList.push(response.data.rows[i]);
                    this.proKey2IdMap[response.data.rows[i].key] = response.data.rows[i].id;
                }

                this.allProList = _proList;
                if(this.searchFlag){
                    this.searchListFunc();
                }else{
                    this.filterProList();
                }
            });
            
        },

        getKVName(list,typeId){
            let _name = '';
            if(list && list.length > 0){
                for(let i = 0;i<list.length;i++){
                    if(list[i].id == typeId){
                        _name = list[i].text;
                        break;
                    }
                }
            }
            return _name;
        },

         getKVNameArray(list,typeIdArray){
            let _nameArray = [];
            if(typeIdArray && typeIdArray.length > 0){
                for(let j = 0;j<typeIdArray.length;j++){
                    _nameArray.push(this.getKVName(list,typeIdArray[j]));
                }
            }
            return _nameArray.join(" / ");
        },

        
  },
  watch: {
        
  },
  destroyed(){
        delete window.treeKvVm;
  }
}
</script>
<style scope>
.basicKvIndex{
  position:fixed;
  top:0px;
  left:0px;
  bottom:0px;
  right:0px;
  background-color: rgb(245, 245, 245);
}

.basicKvIndex .treeKvAside{
   position:absolute;
   top:2%;
   left:20px;
   bottom:2%;
   width:230px;
   background-color: #fff;
}

.basicKvIndex .treeKvAside .toolBar{
    padding:10px 10px 10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;   
}




.basicKvIndex .treeKvAside .title{
    border-left: 5px solid #409eff;
    font-size: 16px;
    padding-left: 10px;
}

.basicKvIndex .treeKvAside .btn{
    font-size: 14px;
}

.basicKvIndex .treeKvAside .treeContent{
    position:absolute;
    top:60px;
    bottom:0px;
    left:0px;
    right:0px;
}

.basicKvIndex .el-tree-node__content{
    padding:4px 0px;
}




.basicKvIndex .treeKvAside .treeContent .type-name{
   font-size: 14px;
}

.basicKvIndex .treeKvAside .treeContent  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}



.basicKvIndex .treeKvMain{
  position:absolute;
  left:265px;
  right:20px;
  top:2%;
  bottom:2%;
  background-color:#fff ;
  font-size: 14px;
}

.basicKvIndex .treeKvMain .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.basicKvIndex .treeKvMain .toolbar .desc{
    color:rgb(89,89,89);
    margin-left:10px;
    margin-right:5px;
}

.basicKvIndex .treeKvMain .detail{
    cursor:pointer;
    color:#409EFF
}

.basicKvIndex .del{
    cursor: pointer;
    color:red;
}



</style>
