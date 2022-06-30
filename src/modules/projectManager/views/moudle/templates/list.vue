<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="templatesList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                    <el-row style="padding:12px 10px;background-color:#fff;">
                        <el-col :span="24" >
                            <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'模型列表（'+total+'）'"></eco-tool-title>
                            <el-button plain class="plainBtn toolBtn" @click.native="addTemplates"><i class="icon el-icon-document-add"></i>&nbsp;添加</el-button>
                            <el-button plain class="plainBtn toolBtn" @click.native="searchShow = !searchShow"><i class="icon el-icon-search"></i>&nbsp;高级搜索</el-button>
                        </el-col>
                    </el-row>
            </eco-content>
            <eco-content top="61px" v-show="searchShow" style="overflow:hidden">
                <div class="searchBox">
                    <div>

                        <span>名称：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入名称" @keyup.enter.native="searchListFunc" v-model="params.name"></el-input>
                        </div>

                        <span>编码：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入编号" @keyup.enter.native="searchListFunc" v-model="params.code"></el-input>
                        </div>

                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

                    </div>
                    <div>
                        <span>分类：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.pmSort"  style="width:100%" clearable>
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_sort']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                        <span>类型：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.type" clearable style="width:100%">
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_type']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </eco-content>

            <eco-content bottom="42px" :top="getContentTop" ref="content" style="padding:10px 15px;">
                <el-table
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    class="ecoList"
                    height="100%"
                    stripe
                    border
                    @header-dragend="changeColWidth"
                    @row-dblclick="updateTemplates"
                    row-key="id"
                    :default-sort = "{prop: 'createDate', order: 'descending'}"
                    ref="multipleTable"
                    @sort-change="sortTablefunc"
                >

                    <el-table-column
                        prop="index"
                        label="序号"
                        width='60'
                        min-width="60"
                        >
                        <template slot-scope="scope">

                            {{scope.$index+(params.page-1)*params.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="60"
                        min-width="60"
                        >
                        <template slot-scope="scope" >
                            <div class="dealCol">
                                <span class="pointerClass primaryColor"  @click="updateTemplates(scope.row)">编辑</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="编码"
                        width="130"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="模型名称"
                        min-width="100"
                        >
                    </el-table-column>


                     <el-table-column
                        prop="type"
                        label="项目类型"
                        width='120'
                        min-width="100"
                        >
                        <template slot-scope="scope">
                             {{getBaseDataTextByKey(scope.row.type,"faw_pm_type")}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="模型状态"
                        width='120'
                        min-width="100"
                        >
                        <template slot-scope="scope">
                             {{getBaseDataTextByKey(scope.row.status,"faw_pm_model_status")}}
                        </template>
                    </el-table-column>

                </el-table>

            </eco-content>
            <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
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
            </eco-content>
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
import {getTemplatesInfoList,inValidTemplates} from '../../../api/templates.js'
import linkWf from '../../components/linkWf.vue'
export default {
  name:'templatesList',
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
       params:{
           page:1,
           rows:10,
           order:"desc",
           sort:"createDate",
           name:"",
           type:"",
           code:"",
           pmSort:"",
       },
       searchShow:false,
       selectIds:[]
    }
  },
  props:{

  },
  created() {
      this.callAction();
      this.initSomeBaseData({array:['faw_pm_sort','faw_pm_type','faw_pm_model_status']})
  },
  activated(){

  },

  mounted(){
      this.getListDataFunc();
  },

  computed: {
       ...mapGetters([
           'getBaseDataTextByKey',
           'baseData'
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
        'initSomeBaseData',
    ]),
    callAction(){
        let this_ = this;
        window.tabClickFunc = function(){
            this_.getListDataFunc();
        }
        let callBackDialogFunc = function(obj){
            if(obj && (obj.action == 'addTemplates') ){
                this_.$message({
                    message: '添加成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this_.getListDataFunc();
            }
            if(obj && (obj.action == 'updateTemplates') ){
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
       console.log(21313)
    },
    getListDataFunc(){
        getTemplatesInfoList(this.params).then(res => {
            this.total = res.total;
            this.dataList = res.rows;
            //默认选中行

        })
    },
    addTemplates(){
        if(sysEnv == 0){
            let _width = '900';
            let _height = '600';
            let url = window.location.origin+'/#/addOrUpdateTemplates/0';
            EcoUtil.getSysvm().openDialog('添加模型',url,_width,_height,'15vh');
        }else{
            let _width = '900';
            let _height = '600';
            let url = '/projectManager/index.html#/addOrUpdateTemplates/0';
            EcoUtil.getSysvm().openDialog('添加模型',url,_width,_height,'15vh');
        }
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
    },
    //默认选中行
    selectRows(ids = []){
        this.selectIds = ids;
        this.clearSelect();
        this.dataList.forEach(row => {
            if(ids.indexOf(row.id)>-1){
                this.$refs.multipleTable.toggleRowSelection(row,true);
            }else{
                this.$refs.multipleTable.toggleRowSelection(row,false);
            }
        });

    },
    resetSearch(){
       this.params.name = "";
       this.params.type = "";
       this.params.code = "";
       this.params.pmSort = "";
    },
    updateTemplates({id}){
         this.$router.push({name:'templatesCard',params:{modelId:id}});
    },
    inValidTemplates(id){
        var that  = this;
        let confirmYesFunc = function(){

           that.inValidTemplatesFunc(id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要失效吗?','提示',options,confirmYesFunc);
    },
    inValidTemplatesFunc(id){
        inValidTemplates(id).then( res => {
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

           that.inValidTemplatesFunc(ids);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要失效选中的记录吗?','提示',options,confirmYesFunc);
    },
     changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    }
  },
  watch:{

  },

};
</script>

<style scoped>
.templatesList{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.templatesList .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.templatesList .toolBtn{
    margin:0 10px;
}

</style>
