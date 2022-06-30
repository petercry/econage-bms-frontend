<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="deliverList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                    <el-row style="padding:12px 10px;background-color:#fff;">
                        <el-col :span="24" >
                            <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'交付物（'+total+'）'"></eco-tool-title>
                            <el-button plain class="plainBtn toolBtn" @click.native="addDeliver" v-if="editable && (roleMap['admin'] || roleMap['add'])"><i class="icon el-icon-document-add"></i>&nbsp;添加</el-button>
                            <el-button plain  v-if="showInvaild && editable && (roleMap['admin'] || roleMap['edit'])" class="plainBtn toolBtn" @click.native="batchInvaild"><i class="icon el-icon-remove-outline"></i>&nbsp;批量失效</el-button>
                            <el-button plain class="plainBtn toolBtn" @click.native="searchShow = !searchShow"><i class="icon el-icon-search"></i>&nbsp;高级搜索</el-button>
                        </el-col>
                    </el-row>
            </eco-content>
            <eco-content top="61px" v-show="searchShow">
                <div class="searchBox">
                    <div>
                        <span style="width:70px;text-align:left;display:inline-block;">类型：</span>
                        <div class="state">
                            <el-select v-model="params.type" clearable>
                                <el-option
                                    v-for="(item,index) in deliverType" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                        <span>名称：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入名称" @keyup.enter.native="searchListFunc" v-model="params.name"></el-input>
                        </div>

                        <span>交付物文件：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入交付物文件" @keyup.enter.native="searchListFunc" v-model="params.fileName"></el-input>
                        </div>
                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

                    </div>
                    <div>
                        <span>关联流程：</span>
                        <div class="itemInput">
                            <link-wf style="width:420px;"></link-wf>
                        </div>
                    </div>
                </div>
            </eco-content>

            <eco-content bottom="0px" :top="getContentTop" ref="content" style="padding:10px 15px;">
                <el-table
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    class="ecoList"
                    height="100%"
                    stripe
                    border
                    row-key="id"
                    :highlight-current-row="!multiple"
                    :default-sort = "{prop: 'createDate', order: 'descending'}"
                    ref="multipleTable"
                    @sort-change="sortTablefunc"
                    @selection-change="changeFun"
                    @current-change="handleCurrentRow"
                >
                     <el-table-column
                        type="selection"
                        key="10"
                        v-if="editable && multiple"
                        :reserve-selection="true"
                        width="45">

                    </el-table-column>
                    <el-table-column
                        prop="index"
                        label="序号"
                        width='60'
                        >
                        <template slot-scope="scope">

                            {{scope.$index+(params.page-1)*params.rows+1}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        label="操作"
                        width="100"
                        v-if="editable"
                        >
                        <template slot-scope="scope" >
                            <div class="dealCol">
                                <span class="pointerClass primaryColor"  @click="updateDeliver(scope.row.id)" v-if="(roleMap['admin'] || roleMap['edit'])">编辑</span>
                                <span class="pointerClass redColor" @click="inValidDeliver(scope.row.id)" v-if="(roleMap['admin'] || roleMap['delete'])">失效</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="类型"
                        width="130"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope">
                            {{getDeliverTypeText(scope.row.type)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="关联流程"
                        width='150'
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="stage"
                        label="关联工作"
                        width='150'
                        show-overflow-tooltip
                        >

                    </el-table-column>
                     <el-table-column
                        prop="fileList"
                        label="交付文件"
                        width='150'
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope">
                            {{scope.row.fileList | fiterListToName('name',',')}}
                        </template>
                    </el-table-column>

                     <el-table-column
                        prop="comments"
                        label="备注"
                        width='150'
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="创建日期"
                        width='120'
                        sortable='custom'
                        :sort-orders="['ascending', 'descending']"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope">{{scope.row.createDate?scope.row.createDate.substring(0,10):''}}</template>
                    </el-table-column>

                </el-table>

            </eco-content>
            <!-- <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
                <el-row >
                    <el-col :span="24" style="text-align:right">
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="params.page"
                            :page-sizes="[10,30,50,100]"
                            :page-size="params.rows"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total" style="margin-right:20px">
                            </el-pagination>
                    </el-col>
                </el-row>
            </eco-content> -->
        </div>
    </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {mapState,mapActions,mapGetters} from 'vuex'
import {getDeliverInfoList,inValidDeliver} from '../../../api/deliver.js'
import {getPMModelRole} from '../../../api/common.js'
import linkWf from '../../components/linkWf.vue'
export default {
  name:'deliverList',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      linkWf
  },
  data() {
    return {
       dataList:[],
       total:0,
       multipleSelection:[],
       slectTableIds:[],
       params:{
           page:1,
           rows:999999,
           order:"desc",
           sort:"createDate",
           name:"",
           type:"",
           fileName:"",
           wfName:"",
       },
       searchShow:false,
       selectIds:[],
       showInvaild:true,
       roleMap:{
            admin:true
        }
    }
  },
  props:{
        editable: {
            type: Boolean,
            default(){
                return true
            }
        },
        multiple:{
            type: Boolean,
            default(){
                return true
            }
        }
  },
  created() {
      if(this.$route.params.modelId && this.$route.params.modelId > 0){
          this.params.modelId = this.$route.params.modelId;
      }
      if(this.$route.params.infoId && this.$route.params.infoId > 0){
          this.params.infoId = this.$route.params.infoId;
          this.getPMModelRole();
      }
      this.callAction();
      this.setDeliverType();
  },
  activated(){

  },

  mounted(){
      this.getListDataFunc();
  },

  computed: {
       ...mapGetters([
        'getDeliverTypeText',
        'deliverType'
      ]),
       getContentTop:function(){
           if(this.searchShow){
               return '162px';
           }else{
               return '61px';
           }
       },

  },

  methods: {
    ...mapActions([
        'setDeliverType',
    ]),
    callAction(){
        let this_ = this;
        window.tabClickFunc = function(){
            this_.getListDataFunc();
        }
        let callBackDialogFunc = function(obj){
            if(obj && (obj.action == 'addDeliver') ){
                this_.$message({
                    message: '添加成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this_.getListDataFunc();
            }
            if(obj && (obj.action == 'updateDeliver') ){
                this_.$message({
                    message: '修改成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this_.getListDataFunc();
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'deliverList');
    },
    changeFun(rows) {

        this.multipleSelection = rows;
    },
    getPMModelRole(){
        getPMModelRole(this.$route.params.infoId,'faw_pm_model_dev').then(res=>{
            this.roleMap = res;
        })
    },
    getListDataFunc(){
        this.$refs.ecoLoadingRef.open();
        getDeliverInfoList(this.params).then(res => {
            this.$refs.ecoLoadingRef.close();
            this.total = res.total;
            this.dataList = res.rows;
            //默认选中行
            // this.dataList.forEach(row => {
            //     let index_ = this.selectIds.indexOf(row.id);
            //     if(index_>-1){
            //         this.$refs.multipleTable.toggleRowSelection(row,true);
            //         this.selectIds.splice(index_,1);
            //     }else{
            //         this.$refs.multipleTable.toggleRowSelection(row,false);
            //     }
            // });

        })
    },
    addDeliver(){

            let _width = '800';
            let _height = '600';
            let moudleId = this.params.modelId || this.params.infoId || 0;
            let modules = "0";
            if(this.params.modelId && this.params.modelId > 0){
                modules = "templates"
            }
            if(this.params.infoId && this.params.infoId > 0){
                modules = "project"
            }
            let url = '/projectManager/index.html#/addOrUpdateDeliver/0/'+moudleId+'/'+modules;
            EcoUtil.getSysvm().openDialog('添加交付物',url,_width,_height,'15vh');

    },
    searchListFunc(){
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.params.page = 1;
        this.getListDataFunc();
    },
    //表格排序
    sortTablefunc(column,prop,order){
        if(column.prop && column.order){
            this.params.sort = column.prop;
            if(column.order == 'ascending'){
                this.params.order = 'asc'
            }else if(column.order == 'descending'){
                this.params.order = 'desc'
            }
        }
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.getListDataFunc();
    },

    //每页条数
    handleSizeChange(val) {
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.params.rows = val;
        this.params.page = 1;
        this.getListDataFunc();
    },

    //跳转页码
    handleCurrentChange(val) {
        this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        this.params.page = val;
        this.getListDataFunc();
    },
    //清空用户选择
    clearSelect(){
        this.$refs.multipleTable.clearSelection();
        //隐藏批量失效
        this.showInvaild = false;
    },
    //默认选中行
    selectRows(ids = []){
        this.selectIds = ids;
        this.clearSelect();
        this.dataList.forEach(row => {
            let index_ = ids.indexOf(row.id);
            if(index_>-1){
                this.$refs.multipleTable.toggleRowSelection(row,true);
                this.selectIds.splice(index_,1);
            }else{
                this.$refs.multipleTable.toggleRowSelection(row,false);
            }
        });

    },
    resetSearch(){
       this.params = {
           name:"",
           type:"",
           fileName:"",
           wfName:"",
       }
    },
    updateDeliver(id){
        let moudleId = this.params.modelId || this.params.infoId || 0;
        let _width = '800';
        let _height = '600';
        let modules = '0';
        if(this.params.modelId && this.params.modelId > 0){
            modules = "templates"
        }
        if(this.params.infoId && this.params.infoId > 0){
            modules = "project"
        }
        let url = '/projectManager/index.html#/addOrUpdateDeliver/'+id+'/'+moudleId+'/'+modules;
        console.log(url)
        EcoUtil.getSysvm().openDialog('编辑交付物',url,_width,_height,'15vh');

    },
    inValidDeliver(id){
        var that  = this;
        let confirmYesFunc = function(){

           that.inValidDeliverFunc(id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要失效吗?','提示',options,confirmYesFunc);
    },
    inValidDeliverFunc(id){
        inValidDeliver(id).then( res => {
            this.$message({
                message: '失效成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.getListDataFunc();
        })
    },
    batchInvaild(){
        var that  = this;
        let ids = [];
        ids = this.multipleSelection.map( item => {
            return item.id;
        })
        if(ids.length == 0){
            return EcoMessageBox.alert("请选择记录","提示");
        }
        let confirmYesFunc = function(){

           that.inValidDeliverFunc(ids);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要失效选中的记录吗?','提示',options,confirmYesFunc);
    },
    handleCurrentRow(row){
        this.multipleSelection = [];
        this.multipleSelection.push(row);
    }
  },
  watch:{

  },

};
</script>

<style scoped>
.deliverList{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.deliverList .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.deliverList .toolBtn{
    margin:0 10px;
}

</style>
