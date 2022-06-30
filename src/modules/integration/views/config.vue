<template>
    <div class="config webLayout">
    <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
     <eco-content top="0px" height="60px" type="tool">
        <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
              <el-col :span="8" >
                  <eco-tool-title style="line-height: 34px;" :title="'Agent列表'+'（'+baseInfo.total+'）'"></eco-tool-title>
              </el-col>
              <el-col :span="16" style="text-align:right;padding-right:10px;">
                    <el-input
                         placeholder="搜索Agent名称"
                         v-model="baseInfo.name"
                         style="width:200px;margin-right:10px"
                         @keyup.enter.native="searchFunc"
                        >
                        <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button type="primary" class="btn" @click="addAgent"><i class="icon iconfont iconxinjianwenjian"></i>创建Agent</el-button>
             </el-col>
        </el-row>
    </eco-content>

    <eco-content bottom="42px" top="59px" ref="content" class="ecoContentClass"  style="padding:15px;">
         <el-table
         ref="multipleTable"
            :data="dataList"
            stripe
             class="flowlist"
            style="width: 100%"
             size="mini"
            height="100%"
            :default-sort = "{prop: 'createDate', order: 'descending'}"
            @sort-change="sortTablefunc"
          >

            <el-table-column
                label="名称"

                show-overflow-tooltip
                prop="name"
                :sort-orders="['ascending', 'descending']"
                sortable="custom"
              >
              <template slot-scope="scope">
                  <span class="pointerClass" >{{ scope.row.name }}</span>
              </template>
        </el-table-column>
         <el-table-column
                label="地址"
                width="180"
                show-overflow-tooltip
                prop="address"
              >
              <template slot-scope="scope">
                  <span >{{ scope.row.agentLinkSchema +"://" + scope.row.agentLinkHost + ":" + scope.row.agentLinkPort }}</span>
              </template>
        </el-table-column>

         <el-table-column
                label="ID"
                width="150"
                show-overflow-tooltip
                prop="id"
              >
        </el-table-column>
         <el-table-column
                label="密钥"
                width="150"
                show-overflow-tooltip
                prop="agentLinkSecret"
              >
        </el-table-column>
        <el-table-column
                label="备注"
                width="100"
                show-overflow-tooltip
                prop="comment"
              >
        </el-table-column>
         <el-table-column
                label="状态"
                width="100"
            >
            <template slot-scope="scope" >
              <span v-if="scope.row.active === 'ACTIVE'" class="status green">在线</span>
              <span v-if="scope.row.active === 'INACTIVE'" class="status grey">离线</span>
            </template>
         </el-table-column>
           <!-- <el-table-column
                label="最近通信主机"
                width="150"
                :sort-orders="['ascending', 'descending']"
                sortable="custom"
                prop="agentLinkHost"
            >
          </el-table-column> -->
           <!-- <el-table-column
                label="最近通信时间"
                width="160"
                :sort-orders="['ascending', 'descending']"
                sortable="custom"
                prop="heartBeatDateTime"
            >
             <template slot-scope="scope" ><span>{{scope.row.heartBeatDateTime?scope.row.heartBeatDateTime.substr(0,16):''}}</span></template>
          </el-table-column>
           <el-table-column
                label="创建人"
                width="150"
                :sort-orders="['ascending', 'descending']"
                sortable="custom"
                prop="createUser"
            >
          </el-table-column> -->
          <el-table-column
                label="创建时间"
                width="150"
                :sort-orders="['ascending', 'descending']"
                sortable="custom"
                prop="createDate"
              >
              <template slot-scope="scope" ><span>{{scope.row.createDate?scope.row.createDate.substr(0,16):''}}</span></template>
          </el-table-column>
          <!-- <el-table-column
                label="修改人"
                width="150"
                :sort-orders="['ascending', 'descending']"
                sortable="custom"
                prop="modUser"
            >
          </el-table-column>
          <el-table-column
                label="修改时间"
                width="200"
                :sort-orders="['ascending', 'descending']"
                sortable="custom"
                prop="modDate"
              >
              <template slot-scope="scope" ><span>{{scope.row.createDate?scope.row.createDate.substr(0,16):''}}</span></template>
          </el-table-column> -->
         <el-table-column
              label="操作"
              width="150"
              >
              <template slot-scope="scope" >
                  <div>
                    <span  class="pointerClass" @click="editAgent(scope.row.id)" style="color:#409EFF;">编辑</span>
                    <span class="split"></span>
                    <span  class="pointerClass" @click="goSetting(scope.row.id)" style="color:#409EFF;">配置</span>
                    <span class="split"></span>
                    <span  class="pointerClass" @click="deleteAgent(scope.row.id)" style="color:#F56C6C;">删除</span>
                 </div>
              </template>
            </el-table-column>
        </el-table>

    </eco-content>

   <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
       <el-row>
          <el-col :span="24" class="top-bottom" style="text-align:right;">
                <div >
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="baseInfo.page"
                    :page-sizes="[10,30,50,100]"
                    :page-size="baseInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="baseInfo.total">
                  </el-pagination>
                </div>
          </el-col>
        </el-row>
    </eco-content>
    <ecoDialog ref="ecoDialog1" :id="'ecoDialog1'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog2" :id="'ecoDialog2'" @closeDialog="closeDialogCallBack"></ecoDialog>
    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {getAgentList,deleteAgent,getUserInfoAjax} from '@/modules/integration/service/service.js'
  import ecoDialog from '@/modules/system2/views/components/ecoDialog.vue'

export default{
  name:'config',
  components:{
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    ecoDialog
  },
  data(){
    return {
        baseInfo:{
            total:0,
            page:1,
            rows:30,
            sort:'',
            order:'',
            name:"",
            agentLinkHost:""
        },
        openedDialog:0,
        dataList:[],
        mobilePhone:""
    }
  },
  mounted(){
      this.getUserInfoAjax();
      this.listAction();
       window.ecoTodoVm = this;
  },
  methods: {
     listAction(){
            window.tabClickFunc = function(){
                  window.ecoTodoVm.getListFunc();
            }
            let this_ = this;
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'editAgent' || obj.action == 'addAgent') ){
                    this_.$message({
                        message: '保存成功',
                        showClose: true,
                        duration:2000,
                        type: 'success'
                    });
                    window.ecoTodoVm.getListFunc(true);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'agent');
      },
    callBackDialogFunc(obj){

        if(obj && (obj.action == 'editAgent' || obj.action == 'addAgent') ){
            this.$message({
                message: '保存成功',
                showClose: true,
                duration:2000,
                type: 'success'
            });
            this.getListFunc(true);
        }
         if(obj && obj.close){
                    window.ecoTodoVm.closeDialog();
              }
    },
    getUserInfoAjax(){
        getUserInfoAjax().then((response)=>{
            if(response.data){
                this.mobilePhone = response.data.mobilePhone;
            }
            this.searchListFunc();
        }).catch((error)=>{

        });
    },
    //获取Agent列表
    getListFunc(flag){

        this.$refs.ecoLoadingRef.open();
        getAgentList(this.baseInfo).then((response)=>{
            this.$refs.ecoLoadingRef.close();
            this.dataList = response.data.rows;
            this.baseInfo.total = response.data.total;
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                if(!flag){
                     this.$refs.multipleTable.doLayout();
                }
            });
        }).catch((error)=>{
             this.$refs.ecoLoadingRef.close();
        });
    },

    searchListFunc(){
        this.$refs.multipleTable.bodyWrapper.scrollTop =0;
        this.baseInfo.page = 1;
        this.getListFunc();
    },

    changeFun(rows) {
        this.multipleSelection = rows;
    },

    //表格排序
    sortTablefunc(column,prop,order){
      if(column.prop && column.order){
          this.baseInfo.sort = column.prop;
          if(column.order == 'ascending'){
              this.baseInfo.order = 'asc'
          }else if(column.order == 'descending'){
              this.baseInfo.order = 'desc'
          }
      }
      this.$refs.multipleTable.bodyWrapper.scrollTop =0;
      this.getListFunc();
    },

    //每页条数
    handleSizeChange(val) {
          this.$refs.multipleTable.bodyWrapper.scrollTop =0;
          this.baseInfo.rows = val;
          this.baseInfo.page = 1;
          this.getListFunc();
    },

    //跳转页码
    handleCurrentChange(val) {
        this.$refs.multipleTable.bodyWrapper.scrollTop =0;
        this.baseInfo.page = val;
        this.getListFunc();
    },

    searchFunc(){
        this.$refs.multipleTable.bodyWrapper.scrollTop =0;
        this.getListFunc();

    },
    addAgent(){
        // this.$router.push({name:'addAgent'});

         if(window.parent.sysvm){
            window.parent.sysvm.openDialog('添加Agent',
                        '/integration/index.html#/addAgent/',500,250);
         }else{
            this.openDialog('添加Agent',
                        '/integration/index.html#/addAgent/',500,250);
         }
    },
    deleteAgent(id){
        var that  = this;
        let confirmYesFunc = function(){
            deleteAgent(id).then((response)=>{
              if(response.status == 200){
                    that.$message({
                        message: '删除成功',
                        showClose: true,
                        duration:2000,
                        type: 'success'
                    });
                    that.getListFunc(true);
              }
            });
        }
        let options = {
              type: 'warning',
              lockScroll:false
          }
        EcoMessageBox.confirm('确认删除此agent吗?','提示',options,confirmYesFunc);
    },
    editAgent(id){
        // this.$router.push({name:'editAgent',params:{id:id}});


        if(window.parent.sysvm){
            window.parent.sysvm.openDialog('编辑Agent',
                        '/integration/index.html#/editAgent/'+id,500,250);
        }else{
          this.openDialog('编辑Agent',
                        '/integration/index.html#/editAgent/'+id,500,250);
        }
    },
    openDialog(_title,url,_width,_height,_top,win_obj){
              let oneDialog = {};
              oneDialog.title = _title;
              try{
                  if(Number.isInteger(parseFloat(_width))){
                        oneDialog.width = _width;
                  }else{
                        oneDialog.width = 500;
                  }
              }catch(e){
                    oneDialog.width = 500;
              }
              try{
                  if(Number.isInteger(parseFloat(_height))){
                        oneDialog.height = _height;
                  }else{
                        oneDialog.height = 400-116;
                  }
              }catch(e){
                    oneDialog.height = 400-116;
              }
              if(_top){
                  oneDialog.top = _top;
              }else{
                  oneDialog.top = "15vh";
              }
              oneDialog.url = url;
              oneDialog.show = true;

              //获取弹出窗口的父窗口
              let _window = null;
              if(win_obj){
                  _window = win_obj;
              }else{
                  if(this.openedDialog == 0){
                        let activeTabKeyIframe = null;
                        activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
                        if(activeTabKeyIframe){
                            try{
                                _window = activeTabKeyIframe.contentWindow;
                            }catch(e){
                                console.log(e);
                            };
                        }
                  }else{
                      let activeIframe = null;
                      activeIframe = document.getElementById('ecoDialog'+(this.openedDialog));
                      if(activeIframe){
                          try{
                                _window = activeIframe.contentWindow ;
                          }catch(e){

                          };
                      }
                  }
              }
              this.openedDialog ++;
              this.$refs['ecoDialog'+this.openedDialog].open(oneDialog,_window);
      },

     closeDialogCallBack(callObj){
          this.openedDialog =   this.openedDialog -1;
      },
      closeDialog(){
            this.$refs['ecoDialog'+this.openedDialog].closeDialog();
      },
    goSetting(id){
      const params = {}
      params.scope = id;
      params.platform = "ee";
      params.username = this.mobilePhone || "econage";

      const ecoToken = sessionStorage.getItem('ecoToken')
      sessionStorage.setItem("platform", params.platform);
      sessionStorage.setItem("username", params.username);
      sessionStorage.setItem(params.username+'-ecoToken', ecoToken);
      sessionStorage.setItem(params.username+'-agentScope', params.scope);
      sessionStorage.setItem(params.username+'-agentStatus', "ACTIVE");
      //  const openwin = window.open("/static/api/index.html");
      let ngrooturl = EcoUtil.getNGRootUrl();
      const openwin = window.open(ngrooturl+"/apiPlatform/index.html");
       openwin.onload = function(e){
          openwin.postMessage(params, "*");
      }
    }
  },
  watch: {

  }
}
</script>
<style>
.config{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}
.config .title{
  color:#262626;
  font-size: 14px;
  line-height: 28px;
  height:28px;
}
.config .btn{
  font-size: 14px;
}
.config .btn i{
  margin-right:5px;
  font-size: 14px;
}
.split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}
.status{
    width: 64px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 2px;
    color: #fff;
    display:block;
}
.grey{
   background-color: #bebebe;
}
.green{
  background-color: #08cc15;
}
</style>
