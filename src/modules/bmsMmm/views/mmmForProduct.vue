<template>
  <el-container style="height:100%;" v-if="dataMountedFlag">
    <el-header style="height:100px;">
      <div class="pageTop">
        <div style="display:inline-block;">
          <div class="pageTitle">
              <i class="fa fa-product-hunt" style="vertical-align:middle;line-height:40px;"></i> 
              <template v-if="getPageViewOptions().length>1">
              <el-select v-model="pageViewFlag" @change="jumpPage" class="pageViewSel">
                  <el-option
                    v-for="item in getPageViewOptions()"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              </template>
              <template v-else-if="getPageViewOptions().length==1">
                <span style="vertical-align:middle;">{{getPageViewOptions()[0].label}}</span>
              </template>
          </div>
          <div class="toolbarDiv">
            <el-select v-model="productId" @change="getRequireListFunc" style="width:170px;vertical-align:top;" v-if="productDataMount">
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="prioritySearchDiv">
              <el-checkbox-group v-model="priorityList" @change="getRequireListFunc" >
                <el-checkbox label="1" class="priority1"></el-checkbox>
                <el-checkbox label="2" class="priority2"></el-checkbox>
                <el-checkbox label="3" class="priority3"></el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button type="primary" size="medium" icon="el-icon-plus" @click.native="toAddRequire">新建需求</el-button>
            <el-dropdown>
              <el-button size="medium" class="dropDownBtn">...</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="allTaskCardFold">全部折叠/展开</el-dropdown-item>
                <el-dropdown-item  @click.native="jumpToRequireListView">列表模式查看</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>  
        <div class="pageViewChangeDiv" >
          <div class="head_tag blue_bg" >
            <div class="tagDiv">
                <div class="title">已关闭需求数</div>
                <div >
                  <span class="num">{{this.close_require_num}}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </el-header>
    <el-main >
      <div class="colDiv" :style="'width:'+taskColWidth+'px;'" v-for="(item,index) in requireList" :key="index">
        <div class="colTitle">{{item.colName}} ({{item.taskList==null?0:item.taskList.getLength()}})</div>
        <div class="colContent">
          <taskCard v-for="(taskCardItem) in item.taskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="totalTaskFoldFlag?1:0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :cardTypeProp="taskCardItem.cardTypeProp" :childrenCount="taskCardItem.childrenCount" :priority="''+taskCardItem.priority" :ref="taskCardItem.seq_num"/>
        </div>
      </div>
    </el-main>
    <el-dialog width="90%" :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="true" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
        <addRequire v-if="dialogTab=='addRequire'" :productIdProp="productId" ref="addRequireWin"></addRequire>
        <addTask v-if="dialogTab=='addTask'" ref="addTaskWin"></addTask>
        <div slot="footer" class="dialog-footer" >
            <el-button @click.native="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
        </div>
    </el-dialog>
  </el-container>
</template>
<script>
import headTag from "@/modules/bmsMmm/component/headTag.vue";
import taskCard from "@/modules/bmsMmm/component/taskCard.vue";
import addRequire from "@/modules/bmsMmm/component/addRequire.vue";
import { TaskCard } from "@/modules/bmsMmm/util/TaskCard.js";
import { TaskCol } from "@/modules/bmsMmm/util/TaskCol.js";
import { getRequireListByProduct,openLoading,closeLoading,dealException,getPageViewOptions,jumpPage,getProductList,putObjToMap,initOpRoleList,jumpToRequireListView,getRequreNumByProduct } from "@/modules/bmsMmm/service/service.js";
import {mapMutations} from 'vuex';
export default{
  name:'mmmForProduct',
  components:{
    headTag,
    taskCard,
    TaskCol,
    addRequire
  },
  data(){
    return {
      loading:true,
      taskColWidth:345,//显示任务卡片列表的列的宽度
      dataMountedFlag: false ,//数据加载完后再渲染页面
      productId: "10",
      priorityList:["1","2","3"],
      totalTaskFoldFlag:false,
      close_require_num:0,
      requireList:new TaskCol(),
      pageViewFlag:'forProduct',
      productList:[],
      productDataMount:false,      
    /**
     * @param {string} seq_num  编号
     * @param {string} content  内容
     * @param {string} status_id  状态
     * @param {string} date  日期
     * @param {string} manHour  工时
     * @param {string} percent  完成百分比
     */  
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      cardObjMap:new Map(),
      opRoleList:null,
    }
  },
  created(){
    //console.log(" this.$route.params.productIdProp:"+ this.$route.params.productIdProp);
    if(typeof this.$route.params.productIdProp!="undefined"){
      this.productId = this.$route.params.productIdProp;
    }
    this.getProductListFunc();
    this.getRequireListFunc();
  },
  methods: {
    getCloseRequireCount(){
      getRequreNumByProduct(this.productId,'70').then(response => {
        this.close_require_num = response.data;
        //let dataList = response.data.rows;
        //console.log("#####dataList" + dataList.length);
      }).catch(error => {
        dealException(error);
        this.closeLoading();
      });
    },
    allTaskCardFold(){
      this.totalTaskFoldFlag = !this.totalTaskFoldFlag;
      for (let i in this.requireList) {
        let nodeTaskList = this.requireList[i].taskList;
        for(let j in nodeTaskList){
          this.$refs[nodeTaskList[j].seq_num][0].setFoldFlag(this.totalTaskFoldFlag);
        }
      }
    },
    async getRequireListFunc() {
      this.initOpRoleList();
      if(this.priorityList.length == 0){
        this.priorityList = ["1","2","3"];
      }
      this.openLoading();
      this.cardObjMap = new Map();
      this.requireList = new TaskCol().add("r-1","未开始",null)
      .add("r10","已立项",null)
      .add("r20","研发中",null)
      .add("r30","研发完毕",null)
      .add("r40","测试中",null)
      .add("r50","测试完毕",null)
      .add("r60","已发布",null);
      //console.log("##this.productId:"+this.productId+"####this.priorityList.length:" + this.priorityList.length);
      getRequireListByProduct(this.productId,this.priorityList ).then(response => {
        let dataList = response.data.rows;
        this.getCloseRequireCount();
        //console.log("#####dataList" + dataList.length);
        for (let i in dataList) {
          putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
          let checkStatus = "r" + dataList[i].status;
          //console.log("#####checkStatus：" + checkStatus);
          let checkNode = this.requireList[checkStatus];
          if(typeof checkNode == "undefined" || checkNode == null) continue;
          if(typeof checkNode.taskList == "undefined" || checkNode.taskList == null) checkNode.taskList = new TaskCard();
          //if(checkStatus == 'r-1'){
          //  console.log("#####" + dataList[i].id +"##"+ dataList[i].title);
          //}
          //console.log("#####" + dataList[i].id +"##"+ dataList[i].manHour);
          (checkNode.taskList).add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].manHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'R',dataList[i].childrenCount,'',dataList[i].priority);
        }
        this.dataMountedFlag = true;
        this.closeLoading();
        })
        .catch(error => {
          dealException(error);
          this.closeLoading();
        });
    },
    getProductListFunc() {
      getProductList().then(response => {
        this.productList = response.data.rows;
        this.productDataMount = true;
      })
      .catch(error => {
          dealException(error);
      });
    },
    toAddRequire(){
      this.dialogTitle="添加需求";
      this.dialogTab = 'addRequire';
      this.dialogVisible = true;
    },
    cleanDialog(){
      //console.log("#####cleanDialog:");
      if(typeof this.$refs.addRequireWin!="undefined"){
        this.$refs.addRequireWin.cleanInfo();
      }
      if(typeof this.$refs.addTaskWin!="undefined"){
        this.$refs.addTaskWin.cleanInfo();
      }
    },
    dialogSave(){
        if(this.dialogTab == 'addRequire'){
            this.$refs.addRequireWin.save();
        }
    },
    openLoading,
    closeLoading,
    jumpPage,
    initOpRoleList,
    getPageViewOptions,
    jumpToRequireListView
  },
  watch: {

  }
}
</script>
<style scoped>
body,html{
  height:100%;
  overflow-y: hidden;
}
body {
   font-family: "Microsoft YaHei";
}

.red_bg{
  background-color: #d05a56;
}
.green_bg{
  background-color: #369a8e;
}
.blue_bg{
  background-color: #3a76d6;
}

.el-main{
  height:calc(100vh - 100px);
  overflow-y:hidden;
  padding:10px 20px 0px 30px;
  white-space: nowrap;
}
.el-main .colDiv{
  display: inline-block;
  vertical-align: top;
}
.el-divider {
    display: inline-block;
    width: 1px;
    height: 45px;
    margin: 10px 30px 0px 30px;
    padding-top: 5px;
    vertical-align: top;
    background-color: #b9b9bd;
}
.colDiv .colTitle{
  font-family: "Microsoft YaHei",PingFangSC-Medium, sans-serif;
  font-weight: bold;
  color: #323234;
  font-size: 14px;
  padding:15px 0px 0px 20px;
}
.colDiv .colContent{
  overflow-x:hidden;
  height:calc(100% - 49px);
  overflow-y: auto;
  padding: 0px 17px 0px 13px;
  margin:10px 10px 0px 0px;
  background-color: #f5f5f9;
}
.colDiv{
  height:100%;
  overflow-y: auto;
  overflow-x: hidden;
}
/*整体部分*/ 
.colContent::-webkit-scrollbar
{
	width: 10px;
	height: 10px;
}
/*滑动轨道*/ 
.colContent::-webkit-scrollbar-track
{
	border-radius: 0px;
	background: #f1f1f1;
}
/*滑块*/
.colContent::-webkit-scrollbar-thumb
{
	border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
	background-color:#d3d1d1;
}
.loadingClass{
  background-color: rgba(0, 0, 0, 0.411) !important;
}
.loadingClass .el-loading-spinner .el-loading-text {
  color: rgb(32, 87, 141);
  margin: 3px 0;
  font-size: 24px;
}
.loadingClass .el-loading-spinner .el-icon-loading{
  color: rgb(32, 87, 141);
  margin: 3px 0;
  font-size: 64px;
}
</style>