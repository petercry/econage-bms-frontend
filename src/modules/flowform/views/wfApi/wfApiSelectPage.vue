<template>
  <div class="wfAPISelect">
    <ecoLoading ref='ecoLoadingRef' text='加载中...' ></ecoLoading>

    <div  v-show="showPage">
        <eco-content top="0px" height="60px" type="tool">
            <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="12">
                        <eco-tool-title style="line-height: 34px;" :title="(dialogTitle?dialogTitle:'API数据列表选择')+(baseInfo.total?' ('+baseInfo.total+')':' (0)')"></eco-tool-title>
                        <el-button v-if="eventObj.scSelect == 2" type="primary" size="mini"  @click.native="doSelectBallBack" style="margin-left:20px;">&nbsp;确定</el-button>
                    </el-col>
                    <el-col :span="12" style="text-align:right;padding-right:10px;">
                        <el-button type="primary"  @click.native="searchHasSelectFunc" v-if="eventObj.scSelect == 2 && keyColumns!=null"><i class="icon " style="margin-right:10px;"></i>&nbsp;已选择（{{apiSelectSelectedTags.length}}）</el-button>
                        <el-button type="primary"  @click.native="getWFApiListFunc(1)" v-if="eventObj.scSelect == 2 && keyColumns!=null"><i class="icon " style="margin-right:10px;"></i>&nbsp;全部（{{baseInfo.total}}）</el-button>
                        <el-button plain class="plainBtn searchBtn" @click.native="searchShowFunc" ><i class="icon el-icon-search" style="margin-right:10px;"></i>&nbsp;高级检索</el-button>
                    </el-col>
            </el-row>
        </eco-content>

        <eco-content top="59px" v-show="this.searchShow">
            <div class="searchBox">

                    <div v-for="item in search_columns" :key="item.dataId" class="item">
                        <span v-show="item.scVisible" style="text-align:left;display:inline-block;">
                            {{item.titleName}}:
                        </span>
                        <div class="itemInput">
                            <el-input :placeholder="'请输入'+item.titleName" @keyup.enter.native="getWFApiListFunc(1)" v-model="item.defaultVal"></el-input>
                        </div>
                    </div>
                    <div class="btnItem">
                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="reestSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="getWFApiListFunc(1)">搜索</el-button>
                    </div>
            </div>
        </eco-content>

        <eco-content  :bottom="baseInfo.ispage == 1?'42px':'0px'" :top="getContentTop1" ref="content" class="ecoContentClass"  style="padding:0px;">

            <el-table
                ref="multipleTable"
                :data="dataList"
                stripe
                class="flowlist"
                style="width: 100%;min-width:auto"
                size="mini"
                height="100%"
                :default-sort = "{prop: 'create_date', order: 'descending'}"
                @selection-change="doMoreRowSelect"
                border
                v-if="loaded"
            >

                <el-table-column
                        label="操作"
                        width="100"
                        v-if="eventObj.scSelect == 1"
                        >
                        <template slot-scope="scope"><span class="pointerClass selecBtn" @click="doOneRowSelect(scope.row)">选择</span></template>
                </el-table-column>

                <el-table-column type="selection" width="50" align="center" v-if="eventObj.scSelect == 2 && keyColumns == null"></el-table-column>
                <el-table-column  width="50" label="" v-if="eventObj.scSelect == 2 && keyColumns!=null">
                     <template slot-scope="scope">
                            <i class="icon iconfont iconmeixuanzhong1 checkIcon"  v-show="!apiSelectIsSelected(scope.row[String(keyColumns)])"   @click="apiSelectUpdateSelection(scope.row[String(keyColumns)],scope.$index)"></i>
                            <i class="icon iconfont iconicon49 checkIcon"   v-show="apiSelectIsSelected(scope.row[String(keyColumns)])"  @click="apiSelectUpdateSelection(scope.row[String(keyColumns)],scope.$index)"></i>
                    </template>
                </el-table-column>


                <el-table-column
                        class="font"
                        :label="item.titleName"
                        show-overflow-tooltip
                        v-for="(item,idx) in columns"
                        :key="'col'+idx"
                        v-if="item.scVisible == 1"
                    >
                    <template slot-scope="scope">
                        <span class="pointerClass" >{{ scope.row[String(item.paramName)] }}</span>
                    </template>
                </el-table-column>

            </el-table>
        </eco-content>

    <eco-content bottom="0px" type="tool" style="padding:5px 0px" v-show="baseInfo.ispage == 1">
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

    </div>
  </div>
</template>
<script>

  import {getFormApiSceneEvent} from '../../service/service'
  import {rows,sysEnv} from '../../config/env.js'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'


  export default {
      components:{
          ecoContent,
          ecoToolTitle,
          ecoLoading
      },
      data(){
          return{
            baseInfo:{
                  ispage:0,
                  page:1,
                  pageSize:rows,
                  sortCol:'create_date desc',
                  schName:null,
                  total:0,
            },
            searchInfo:{
                schName:null,
            },
            eventObj:{
                    ref_id:0,
                    sc_id:0,
                    scSelect:1,
                    operate_id:0
            },
            searchShow: false,
            columns:[],
            dataList:[],
            selectionList:[],
            outputParams:[],
            emitObj:{},
            search_columns:[],
            searchData:{},
            showPage:false,
            keyColumns:null,
            loaded:false,

            apiSelectSelectedTags:[],
            apiSelectValueSelected:[],
            dialogTitle:null
          }
      },

      created(){
           this.columns = [];
           this.columns.push({titleName:'暂无',scVisible:1});
           let _storeKey = this.$route.params.storeKey;
           if(  _storeKey){
                try{
                        let _storeData = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_storeKey));
                        EcoUtil.getSysvm().deleteTempStore(_storeKey);


                        let _data =  _storeData.formData;
                        _data.ref_id = _storeData.event.eventSource.sceneEntity.refId;
                        _data.sc_id = _storeData.event.eventSource.sceneEntity.scId;
                        _data.scSelect = _storeData.event.eventSource.sceneEntity.scSelect;
                        _data.operate_id = _storeData.operateId;
                        _data.row_ind = 0;
                        if(_storeData.event.emitObj.emitStatus){
                              try{
                                   _data.row_ind = _storeData.event.emitObj.emitStatus.gridRowIndex+1;
                              }catch(e){
                                  _data.row_ind = 0;
                              }
                        }
                        this.eventObj = _data;
                        this.emitObj = _storeData.event.emitObj;
                        if(_storeData.event.eventSource && _storeData.event.eventSource.sceneEntity){
                            this.dialogTitle = _storeData.event.eventSource.sceneEntity.scName;
                        }
                }catch(e){
                        console.log(e);
                }
           }





      },
      mounted(){
             this.getWFApiListFunc(0);
      },
      computed:{
           getContentTop1:function(){
                if(this.searchShow){
                    return '161px';
                }else{
                    return '59px';
                }
            }
      },
      methods: {

          getWFApiListFunc(flag){

                this.$refs.ecoLoadingRef.open();
                getFormApiSceneEvent(this.eventObj,this.baseInfo,this.searchData).then((response)=>{
                      if(response.data.status <= 99){
                            if(response.data.remap.url_info){ //url显示
                                    let _url = response.data.remap.url_info.url;
                                    let _urlObj = JSON.parse(_url);
                                    let _pcUrl = _urlObj.pc_url;

                                    let _params = response.data.remap.url_info.params;
                                    if(_url.indexOf('?')==-1){
                                        _pcUrl+='?ecoUuid='+new Date().getTime();
                                    }else{
                                        _pcUrl+='&ecoUuid='+new Date().getTime();
                                    }
                                    for(let key in _params){
                                        _pcUrl+='&'+key+'='+ encodeURIComponent(_params[key]);
                                    }

                                    window.location.href = _pcUrl;
                                    this.loaded = true;
                            }else{

                                this.columns = response.data.remap.columns;
                                if(flag == 0){
                                    if(response.data.remap.sc_inputsearch == 1){
                                        this.search_columns = response.data.remap.search_columns;
                                    }else{
                                        this.columns.forEach(element => {
                                            if(element.scSearchable == 1){
                                                this.$set(element,'defaultVal',"");
                                                this.search_columns.push(element);
                                            }
                                        });
                                    }

                                    if(this.search_columns.length > 0){
                                        this.searchShow = true;
                                    }

                                    (this.columns).forEach((element)=>{
                                        if(element.valAttr == 1){
                                            this.keyColumns = element.paramName;
                                        }
                                    })
                                }
                                this.dataList = response.data.remap.data;
                                this.baseInfo.total = response.data.remap.total;
                                this.baseInfo.ispage = response.data.remap.ispage;
                                this.initOutputItems();
                                this.transSearchData(this.search_columns);
                                this.showPage = true;
                                if(flag == 1){
                                    if(this.selectionList.length > 0){
                                        for(let i = 0;i<this.selectionList.length;i++){
                                            this.$refs.multipleTable.toggleRowSelection();
                                        }
                                    }
                                }
                                this.loaded = true;
                            }
                      }
                      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            this.$refs.multipleTable.doLayout();

                      });
                      this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                      this.$refs.ecoLoadingRef.close();
                });
          },

          // 分页
          handleSizeChange(val) {
              this.$refs.content.setScollTop(0);
              this.baseInfo.pageSize = val;
              this.baseInfo.page = 1;
              this.getWFApiListFunc(1);
          },

          handleCurrentChange(val) {
              this.$refs.content.setScollTop(0);
              this.baseInfo.page = val;
              this.getWFApiListFunc(1);
          },

          searchShowFunc(){
                if(this.searchShow){
                    this.searchShow = false;
                }else{
                    this.searchShow = true;
                }
           } ,

          searchFunc(){
              this.baseInfo.schName = this.searchInfo.schName;
              this.getWFApiListFunc(1);
          },

          doMoreRowSelect(rows) {
                this.selectionList = rows;
          },

          doOneRowSelect(item){
                this.selectionList = [];
                this.selectionList.push(item);
                this.doSelectBallBack();
          },

          doSelectBallBack(){
                let doObj = {}
                doObj.action = 'apiPageSelectCallBack';
                doObj.data = {};
                doObj.data.outputParams = EcoUtil.objDeepCopy(this.outputParams);
                doObj.data.selectObj = {};

                if(this.eventObj.scSelect == 2 && this.keyColumns!=null){
                     doObj.data.selectObj.selItems =  EcoUtil.objDeepCopy(this.apiSelectSelectedTags);
                }else{
                     doObj.data.selectObj.selItems =  EcoUtil.objDeepCopy(this.selectionList);
                }
                doObj.data.selectObj.action = 'APIPAGE';
                doObj.data.selectObj.emitObj = EcoUtil.objDeepCopy(this.emitObj);

                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
          },

          initOutputItems(){
              let _outputParams = [];
              let _outputParamsObj = {};
              (this.columns).forEach((item)=>{
                    if(item.targetItemParent==0){
                        _outputParams.push({item:item.targetItem,parentItem:item.targetItemParent,name:item.paramName});
                    }else{
                        if(_outputParamsObj[String(item.targetItemParent)]){
                                _outputParamsObj[String(item.targetItemParent)].push({item:item.targetItem,parentItem:item.targetItemParent,name:item.paramName});
                        }else{
                                _outputParamsObj[String(item.targetItemParent)] = [];
                                _outputParamsObj[String(item.targetItemParent)].push({item:item.targetItem,parentItem:item.targetItemParent,name:item.paramName});
                        }
                    }
              })
              for(let parentItem in _outputParamsObj) {
                  _outputParams.push({parentItem:parentItem,children:_outputParamsObj[parentItem]});
              }

              this.outputParams = _outputParams;
          },
          transSearchData(array){
              array.forEach(element => {
                this.searchData["#"+element.fullName] = element.defaultVal;

              });


          },
          reestSearch(){
               this.search_columns.forEach(element => {
                   element.defaultVal = '';

              });
          },





        //判断是否被选中
        apiSelectIsSelected(value){
            return this.apiSelectValueSelected.indexOf(value)>=0;
        },

        apiSelectUpdateSelection(value,index){
            let action = (this.apiSelectIsSelected(value)?'remove':'add');
            this.apiSelectUpdateDo(action,value,index);
        },

        apiSelectRemoveSelection(value){
            let action = 'remove';
            this.apiSelectUpdateDo(action,value);
        },

        apiSelectUpdateDo(action,value,index){
            if(action == 'add' && this.apiSelectValueSelected.indexOf(value) == -1){
                this.apiSelectSelectedTags.push(this.dataList[index]);
                this.apiSelectValueSelected.push(value);
            }

            if(action == 'remove' && this.apiSelectValueSelected.indexOf(value)!=-1){
                    let idx = this.apiSelectValueSelected.indexOf(value);
                    this.apiSelectSelectedTags.splice(idx,1);
                    this.apiSelectValueSelected.splice(idx,1);
            }
        },

        searchHasSelectFunc(){
            this.dataList = EcoUtil.objDeepCopy(this.apiSelectSelectedTags);
        }


      },
      watch:{
          search_columns:{
              handler(newValue,oldValue){
                  this.transSearchData(newValue);
              },
              deep:true
          }
      }

  }

</script>
<style>
.body{
    background-color: #fff !important;
}
</style>
<style scoped>
.wfAPISelect{
    position: relative;
    height: 99%;
    margin: 0 0px;
    top: 0%;
    overflow-y: hidden;
}

.wfAPISelect .title{
  color:#262626;
  font-size: 14px;
  line-height: 28px;
  height:28px;
}

.wfAPISelect .addWFModule i{
  margin-right:5px;
  font-size: 12px;
}

.wfAPISelect .selecBtn{
    color:#409EFF;
}


.wfAPISelect .plainBtn{
    border-color: #409EFF;
    color: #409EFF;
    font-size:14px;
}
.searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #f5f5f5 ;
      border-bottom: 1px solid #ddd;
      height:101px;
      overflow-y:auto;
  }
 .itemInput{
      display: inline-block;
      width: 180px;
      margin-right: 10px;
  }
  .searchBox .item{
      float:left;
      margin-right:10px;
  }
  .searchBox .btnItem{
      float:left;
  }

  .wfAPISelect .checkIcon{
    cursor: pointer;
  }

  .wfAPISelect .iconicon49{
      color:#409eff;
  }

  .wfAPISelect .iconmeixuanzhong1{
      color:#dcdfe6;
  }




</style>
