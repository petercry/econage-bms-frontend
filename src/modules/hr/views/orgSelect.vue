<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <eco-content style="right:auto;border-right: 1px solid #ccc;" :style="{width:leftWidth+'px'}" top="0" bottom="0">
        <!-- <div class="kn-header" > -->
          <!-- <div>
            部门机构
          </div> -->
          <el-tabs class="chooserTab" v-model="activeTab"  type="border-card">
            <el-tab-pane label="组织架构" name="1">
              <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  highlight-current
                  node-key="orgId"
                  :default-expanded-keys="expandedKeys"
                  :expand-on-click-node="false"
                  :load="loadNode"  lazy
                  @node-click="handleNodeClick"
                  :render-content="renderContent"
                  ref="treeRef"
                >
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="用户组" name="2" v-if="selectType.indexOf('userGroup')>-1">
              <el-tree
                  :data="groupData"
                  :props="{children: 'children',label: 'name',isLeaf: 'isLeaf'}"
                  highlight-current
                  node-key="id"
                  :default-expanded-keys="[0]"
                  @node-click="handleNodeGroupClick"
                  :render-content="renderContentGroup"
                  ref="treeRef2"
                >
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        <!-- </div> -->
        <!-- <eco-content top="30px" bottom="0">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              highlight-current
              node-key="orgId"
              :default-expanded-keys="expandedKeys"
              :load="loadNode"  lazy
              @node-click="handleNodeClick"
              :render-content="renderContent"
              ref="treeRef"
            >
          </el-tree>
        </eco-content> -->
      </eco-content>
      <eco-content style="padding:20px;" :style="{left:leftWidth+1+'px'}" top="0" bottom="0">
          <el-form ref="form" label-width="80px">
            <el-form-item label="搜索">
              <el-select
                :value="''"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading">
                <template v-if="isDept&&isUser">
                <el-option-group
                  v-for="group in options"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.orgId"
                    :label="item.orgText"
                    :value="item.orgId"
                    @click.native="searchItemClick(item)">
                  </el-option>
                </el-option-group>
                </template>
                <template v-else>
                <el-option
                  v-for="item in options"
                  :key="item.orgId"
                  :label="item.orgText"
                  :value="item.orgId"
                  @click.native="searchItemClick(item)">
                </el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="已选择" >
              <div class="choosedArea" v-if="selectMulti=='1'&&choosedObj" @dblclick="resultClick">
                {{choosedObj.orgPath}}<span v-if="choosedObj.role">({{choosedObj.roleName}})</span>
                <i class="el-icon-close"  @click="resultClick"></i>
              </div>
              <div class="choosedArea" v-if="selectMulti=='2'">
                <div v-for="(item, index) in choosedArr" :key="index" @dblclick="resultClick(item,index)">{{item.orgPath}}
                  <span v-if="item.role">({{item.roleName}})</span>
                  <i class="el-icon-close" @click="resultClick(item,index)"></i>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="">
              <el-button selectMulti="default" @click.native="save">
                保存
                <i class="el-icon-check el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>
      </eco-content>
      <div id="resize" class="resize" :style="{left:leftWidth+'px'}"></div>
    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoActionBtn from '../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getOrgDeptSelectList,getOrgDeptSelectSearchList,getUserGroupList} from '../service/service.js'
import {mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import roleSelect from './roleSelect.vue'
//Dept      ->type:'DEPT'
//User      ->type:'PERSONNEL'
//Role      ->type:'ROLE'
//userGroup ->type:'USERGROUP'
//返回 type，linkId，orgId，role，（orgPath，roleName）
export default{
  name:'user',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      leftWidth:200,
      isDept:false,
      isUser:false,
      activeTab:'1',
      selectMulti:'1',//1为单选，2为多选
      selectType:'Dept-userGroup',//Dept-User-Role-userGroup 
      hackReset:true,
      treeData: [],
      groupData: [],
      expandedKeys:[],
      loading:false,
      options:[],
      defaultProps: {
          children: 'children',
          label: 'orgText',
          isLeaf: 'isLeaf'
      },
      choosedObj:'',
      choosedArr:[],
      treeParam:{
          selectScope:[],
          deptScopeType:''
      }
    }
  },
  created(){
    this.selectMulti = this.$route.params.selectMulti;
    this.selectType = this.$route.params.selectType;
    this.isDept = this.selectType.indexOf('Dept')>-1;
    this.isUser = this.selectType.indexOf('User')>-1;
    this.setTreeParams();
  },
  mounted(){
    this.setMouseEvent();
    var that = this;
    this.getOrgDeptRoot();
    let selectDefault = this.$route.query.selectDefault;
    if (selectDefault){
      EcoOrgPick.loadByOrgIds(selectDefault).then(res=>{
        if (that.selectMulti=='1'){
          that.choosedObj = res.data[0]
        }else{
          that.choosedArr = res.data
        }
      }).catch(e=>{})
    }
    try {
      if (window.parent.sysvm.orgSelectObj){
        if (that.selectMulti=='1'){
          that.choosedObj = window.parent.sysvm.orgSelectObj
        }else{
          that.choosedArr = window.parent.sysvm.orgSelectObj
        }
      }
    } catch (error) {
      
    }
    
  },
  methods: {
    setMouseEvent(){
        var that = this;
        window.onload = function(){
        var resize = document.getElementById("resize");
        // var left = document.getElementById("left");
        // var right = document.getElementById("right");
        var box = document.getElementById("box");
        resize.onmousedown = function(e){
          var startX = e.clientX;
          // resize.left = resize.offsetLeft;
          that.leftWidth = startX;
          document.onmousemove = function(e){
            var endX = e.clientX;

            // var moveLen = resize.left + (endX - startX);
            // var maxT = box.clientWidth - resize.offsetWidth;
            // if(moveLen<150) moveLen = 150; 
            // if(moveLen>maxT-150) moveLen = maxT-150;

            // resize.style.left = moveLen;
            // left.style.width = moveLen + "px";
            // right.style.width = (box.clientWidth - moveLen - 5) + "px";
            
            that.leftWidth = endX;
          }
          document.onmouseup = function(evt){
            document.onmousemove = null;
            document.onmouseup = null; 
            // resize.releaseCapture && resize.releaseCapture();
          }
          // resize.setCapture && resize.setCapture();
          return false;
          }
        }
      },
      setTreeParams(){
        let obj = {
          selectScope:[],
          deptScopeType:this.$route.query.deptScopeType||''
        }
        if (this.isDept){
          obj.selectScope.push('DEPT')
        }
        if (this.isUser){
          obj.selectScope.push('USER')
        }
        this.treeParam = obj;
      },
      // 搜索内容点击
      searchItemClick(item){
        item.type = (item.orgType=='DEPT'?'DEPT':'PERSONNEL');
        item.linkId = item.resourceId;
        this.addItem(item);
        this.options = []
      },
      // 搜索内容
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          if (this.isDept+this.isUser == 1){
            let selectType = this.isDept?'Dept':'User';
            getOrgDeptSelectSearchList(query,selectType).then((response)=>{
              this.loading = false;
              this.options = response.data;
            }).catch((error)=>{
              this.loading = false;
              this.options = [];
            });
          }
          if (this.isDept+this.isUser == 0){}
          if (this.isDept&&this.isUser){//两个都搜索
            this.options = [];
            getOrgDeptSelectSearchList(query,'Dept').then((response)=>{
              this.loading = false;
              this.options.push({
                label: '部门',
                options: response.data
              });
            }).catch((error)=>{
              this.loading = false;
              // this.options = [];
            });
            getOrgDeptSelectSearchList(query,'User').then((response)=>{
              this.loading = false;
              this.options.push({
                label: '人员',
                options: response.data
              });
            }).catch((error)=>{
              this.loading = false;
              // this.options = [];
            });
          }
        } else {
          this.options = [];
        }
      },
      //添加区分单选双选
      addItem(item){
        if (this.selectMulti == '1'){
          this.choosedObj = item;
        }
        if (this.selectMulti == '2'){
          if (this.choosedArr.filter(item2=>{return item2.linkId == item.linkId&&item2.role == item.role;}).length==0){
            this.choosedArr.push(item);
          }
        }
      },
      //已选择的部分 点击删除数据
      resultClick(item,index){
        if (this.selectMulti == '1'){
          this.choosedObj = '';
        }
        if (this.selectMulti == '2'){
          this.choosedArr.splice(index,1);
        }
      },
      handleNodeClick(data,node) {
        if (this.selectType.toUpperCase().indexOf(data.orgType)>-1){
          data.type = (data.orgType=='DEPT'?'DEPT':'PERSONNEL');
          data.linkId = data.resourceId;
          this.addItem(data)
        }
      },
      //自定义节点渲染
      renderContent(h,{node,data,store}){
          let that = this;
          let text = '';
          return (
              <div class="menuitem">
                {
                  (data.orgType=='USER')?<span class="point">●</span>:null
                  // (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:(data.level=='keshi'||data.level=='bumen')?<i class="icon el-icon-success"></i>:null
                  // (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:null
                }
                {//<i class="el-icon-caret-bottom" slot="reference" onClick={(e)=>{e.stopPropagation();}} ></i>
                //<span  slot="reference" style="font-size:12px;" onClick={(e)=>{e.stopPropagation();}}>角 </span>
                  (data.orgType=='DEPT'&&this.selectType.indexOf('Role')>-1)?
                  <el-popover
                    placement="right-start"
                    width="100"
                    trigger="hover">
                    <i class="el-icon-zoom-in"  style="font-size:12px;margin-right:2px;"  slot="reference" onClick={(e)=>{e.stopPropagation();}} ></i>
                    {
                      h(roleSelect,{
                        props:{
                          roleClick:(item)=>{
                            let Obj= {
                              type :'DEPT',
                              linkId:data.resourceId,
                              orgId:data.orgId,
                              orgPath:data.orgPath,
                              role:item.code,
                              roleName:item.name
                            }
                            that.addItem(Obj);
                          }
                        }
                      })
                    }
                  </el-popover>
                  :null
                }
                <span style="font-size:12px;">{node.label}</span>
              </div>
          )
      },
      loadNode(node, resolve) {
        if(node.level === 0){
            return ;
        }
        setTimeout(() => {
          getOrgDeptSelectList(node.data.orgId,this.treeParam).then((response)=>{
            let data = response.data.map((item)=>{
              item.isLeaf = !item.haveSub;
              return item;
            });
            resolve(data);
          }).catch((error)=>{
            resolve([]);
          });
        }, 500);
      },
      getOrgDeptRoot(){
        getOrgDeptSelectList(-1,this.treeParam).then((response)=>{
          if (response.data&&response.data.length){
            this.treeData = response.data.map((item)=>{
              item.isLeaf = !item.haveSub;
              return item;
            });
          }
        }).catch((error)=>{
        })
      },
      getUserGroupList(){
        getUserGroupList({page:1,rows:9999,sort:'modDate',order:'desc'}).then((response)=>{
          if (response.data&&response.data.rows){
            this.groupData = [{id:0,name:'用户组',children:response.data.rows}];
          }
        }).catch((error)=>{
        })
      },
      handleNodeGroupClick(data,node) {
        if (this.selectType.toUpperCase().indexOf('USERGROUP')>-1){
          if (data.id!=0){
            data.type = 'USERGROUP'
            data.linkId = data.id;
            data.orgPath = data.name;
            this.addItem(data)
          }
        }
      },
      //自定义节点渲染
      renderContentGroup(h,{node,data,store}){
          return (
              <div class="menuitem">
                <span style="font-size:12px;">{node.label}</span>
              </div>
          )
      },
      save(){
        let doObj = {}
        doObj.action = 'userSelectCallBack';
        if (this.selectMulti == '1'){
          doObj.data = this.choosedObj;
        }
        if (this.selectMulti == '2'){
          doObj.data = this.choosedArr;
        }
        let parFrame = parent.parent?parent.parent:parent;
        parFrame.window.sysvm.callBackDialogFunc(doObj);
      }
  },
  watch: {
    'activeTab'(val){
      if (val=='1'){
        this.getOrgDeptRoot();
      }
      if (val=='2'){
        this.getUserGroupList();
      }
    }
  }
}
</script>
<style>
.menuitem{
  position: relative;
}
.menuitem .point{
  position: absolute;
  left: -16px;
  color: #888;
}
.menuitem .icon {
  font-size:12px;
  margin-right: 4px;
}
.chooserTab{
  height:100%;
  box-sizing: border-box;
  position: relative;
}
.chooserTab .el-tabs__content{
  position: absolute;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
}
.choosedArea{
  color: #409EFF;
}
.choosedArea .el-icon-close{
  cursor: pointer;
}
.choosedArea .el-icon-close:hover{
  color: #fff;
  background-color: #409EFF;
  border-radius: 8px;
  height: 16px;
  width: 16px;
  display: inline-block;
  text-align: center;
  line-height: 16px;
}
.resize{
  position: absolute;
  width: 2px;
  left: 200px;
  bottom: 0px;
  right: 0;
  background-color: #ddd;
  z-index: 99999;
  top: 0px;
  cursor: w-resize;
  border-left: 2px transparent;
  border-right: 2px transparent;
}

</style>
