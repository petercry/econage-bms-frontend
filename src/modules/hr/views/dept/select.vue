<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <eco-content style="right:auto;width:200px;border-right: 1px solid #ccc;" width="200px" top="0" bottom="0">
        <div class="kn-header" >
          <div>
            部门机构
          </div>
        </div>
        <eco-content top="30px" bottom="0">
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
        </eco-content>
      </eco-content>
      <eco-content style="left:201px;padding:20px;"  top="0" bottom="0">
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
                <el-option
                  v-for="item in options"
                  :key="item.orgId"
                  :label="item.orgText"
                  :value="item.orgId"
                  @click.native="searchItemClick(item)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="已选择">
              <div v-if="type=='1'&&choosedObj" @click="resultClick">
                {{choosedObj.orgPath}}
              </div>
              <div v-if="type=='2'">
                <div v-for="(item, index) in choosedArr" :key="index" @click="resultClick(item,index)">{{item.orgPath}}</div>
              </div>
            </el-form-item>
            <el-form-item label="">
              <el-button type="default" @click.native="save">
                保存
                <i class="el-icon-check el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>
      </eco-content>
    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoActionBtn from '../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getOrgDeptSelectList,getOrgDeptSelectSearchList} from '../../service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'user',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      type:'1',//1为单选，2为多选
      hackReset:true,
      treeData: [],
      expandedKeys:[],
      loading:false,
      options:[],
      defaultProps: {
          children: 'children',
          label: 'orgText',
          isLeaf: 'isLeaf'
      },
      choosedObj:'',
      choosedArr:[]
    }
  },
  created(){
    this.type = this.$route.params.type;
  },
  mounted(){
    this.getOrgDeptRoot();
  },
  methods: {
      searchItemClick(item){
        this.addItem(item);
        this.options = []
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          getOrgDeptSelectSearchList(query,'Dept').then((response)=>{
            this.loading = false;
            this.options = response.data;
          }).catch((error)=>{
            this.loading = false;
            this.options = [];
          });
        } else {
          this.options = [];
        }
      },
      addItem(item){
        if (this.type == '1'){
          this.choosedObj = item;
        }
        if (this.type == '2'){
          if (this.choosedArr.filter(item2=>{return item2.orgId == item.orgId;}).length==0){
            this.choosedArr.push(item);
          }
        }
      },
      resultClick(item,index){
        if (this.type == '1'){
          this.choosedObj = '';
        }
        if (this.type == '2'){
          this.choosedArr.splice(index,1);
        }
      },
      handleNodeClick(data,node) {
        if (data.orgType == 'DEPT'){
          this.addItem(data)
        }
      },
      //自定义节点渲染
      renderContent(h,{node,data,store}){
          return (
              <div class="menuitem">
                {
                  (data.orgType=='USER')?<span class="point">●</span>:null
                  // (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:(data.level=='keshi'||data.level=='bumen')?<i class="icon el-icon-success"></i>:null
                  // (data.status=='INACTIVE')?<i class="icon el-icon-warning"></i>:null
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
          getOrgDeptSelectList(node.data.orgId).then((response)=>{
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
        getOrgDeptSelectList(-1).then((response)=>{
          if (response.data&&response.data.length){
            this.treeData = response.data.map((item)=>{
              item.isLeaf = !item.haveSub;
              return item;
            });
          }
        }).catch((error)=>{
        })
      },
      save(){
        let doObj = {}
        doObj.action = 'deptChooseCallBack';
        doObj.close = true;
        if (this.type == '1'){
          doObj.data = this.choosedObj;
        }
        if (this.type == '2'){
          doObj.data = this.choosedArr;
        }
        let parFrame = parent.parent?parent.parent:parent;
        parFrame.window.sysvm.callBackDialogFunc(doObj);
      }
  },
  watch: {

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
</style>
