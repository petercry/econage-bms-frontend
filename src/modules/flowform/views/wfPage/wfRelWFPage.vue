<template>
  <div class="wfAPISelect">
    <ecoLoading ref='ecoLoadingRef' text='加载中...' ></ecoLoading>
    
    <eco-content top="0px" height="60px" type="tool">
          <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
              <el-col :span="8">
                  <eco-tool-title style="line-height: 34px;" :title="'流程关联选择 ('+baseInfo.total+')'"></eco-tool-title>
                  <el-button v-if="relSelect == 2" type="primary" size="mini"  @click.native="doSelectBallBack" style="margin-left:20px;">&nbsp;确定</el-button>
              </el-col>

              <el-col :span="16" style="text-align:right;padding-right:10px;">
                     <el-select v-model="baseInfo.scScope" placeholder="请选择" style="width:100px;margin-right:10px" @change="searchListFunc">
                          <el-option
                              v-for="item in scScopeList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                          </el-option>
                      </el-select>
                      <el-input
                            placeholder="请输入流程名称"
                            v-model="baseInfo.scName"
                            style="width:200px;margin-right:10px" 
                            @keyup.enter.native="searchListFunc"
                        >
                            <i slot="suffix" @click="searchListFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                      </el-input>
                      <el-button type="primary" class="addWFModule" @click="searchShowFunc"><i class="icon iconfont iconxinjianwenjian"></i>高级搜索</el-button>
              </el-col>
          </el-row>
    </eco-content>


   <eco-content top="59px" v-show="this.searchShow">
        <div class="searchBox">
            <div>

                <!-- <span style="width:56px;text-align:left;display:inline-block;">名称：</span>
                <div class="itemInput">
                    <el-input placeholder="请输入流程名称" @keyup.enter.native="searchListFunc" v-model="baseInfo.scName"></el-input>
                </div> -->

                <span style="width:56px;text-align:left;display:inline-block;">状态：</span>
                <div class="itemInput">
                     <el-select v-model="baseInfo.scStatus" placeholder="请选择" style="width:100px;margin-right:10px" @change="searchListFunc">
                          <el-option
                              v-for="item in refStatusKv"
                              :key="item.id"
                              :label="item.text"
                              :value="item.id">
                          </el-option>
                      </el-select>
                </div>

                <span>发起时间：</span>
                <div style="display:inline-block;">
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="baseInfo.sc_inittime_start" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
                    -
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="baseInfo.sc_inittime_end"  value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
                </div>

                <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>
            </div>


            <div>
                <span>发起人：</span>
                <div class="itemInput">
                     <tag-select 
                            style="width: 100%;vertical-align: top;" 
                            :initDataStr="baseInfo.sc_init_req_str" 
                            :initOptions="{selectNum:1,selectType:'User'}" 
                            @callBack="tagSelectCB" 
                    >
                    </tag-select>
                </div>

                <span>结束时间：</span>
                <div style="display:inline-block;">
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.sc_duetime_start"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                    -
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.sc_duetime_end"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                </div>
               
            </div>
         </div>
    </eco-content>

    <eco-content bottom="42px" :top="getContentTop1" ref="content" class="ecoContentClass"  style="padding:0px;">
        
      <el-table
          ref="multipleTable"
          :data="dataList"
          tooltip-effect="dark"
          style="width: 100%;"
          class="flowlist"
          size="mini"
          height="100%"
          stripe
          :default-sort = "{prop: 'assign_date', order: 'descending'}"
          @selection-change="doMoreRowSelect"
        >   

            <el-table-column type="selection" width="30" align="center" v-if="relSelect == 2"></el-table-column>           
            <el-table-column
                    label=""
                    :width="relSelect == 1?60:10"
                    >
                    <template slot-scope="scope"   v-if="relSelect == 1">
                        <span class="pointerClass selecBtn" @click="doOneRowSelect(scope.row)">选择</span>
                        </template>
            </el-table-column>
            <el-table-column
                prop="groupName"
                label="类别"
                width='150'
                show-overflow-tooltip
                >
                <template slot-scope="scope">{{scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName :"") }}</template>
            </el-table-column>

            <el-table-column
                prop="requestDesc"
                label="流程名称"
                min-width="110"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="pointerClass" style="display:block;" @click="openWF(scope.row.id)">{{scope.row.requestDesc}}</span>
                </template>
            </el-table-column>

            <el-table-column
                prop="statusName"
                label="状态"
                width='100'
                show-overflow-tooltip>
                 <template slot-scope="scope"><span class="circle" v-bind:class="scope.row.statusName == '已完成'?'green':scope.row.statusName == '进行中'?'blue':scope.row.statusName == '已取消'?'cancel':'red'"></span> {{ scope.row.statusName }}</template>
            </el-table-column>

            <el-table-column
                prop="delayDesc"
                label="目前环节"
                width='190'
                show-overflow-tooltip>
                 <template slot-scope="scope"><span v-html="scope.row.delayDesc"></span></template>
            </el-table-column>
           
            <el-table-column
                prop="initUserName"
                label="启动人员"
                width='100'
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.initUserName}}</template>
            </el-table-column>

            <el-table-column
                prop="startDate"
                label="启动时间"
                width='180'
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.startDate}}</template>
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

  </div>
</template>
<script>

  import {getWFSceneEventAjax,getWFSceneLoadAjax,getWFSceneFormDataAjax} from '../../service/service'
  import {rows,sysEnv} from '../../config/env.js'
  import {Loading } from 'element-ui';

  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import tagSelect from '../../views/direction/module/tagSelect.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  

  export default {
      components:{
          ecoContent,
          ecoToolTitle,
          ecoLoading,
          tagSelect
      },
      data(){
          return{ 
              
              baseInfo:{
                  page:1,
                  rows:rows,
                  sort:'start_date',
                  order:'desc',
                  
                  total:0,
                  operateId:null,
                  scId:0,
                  scScope:0, //选择范围 
                  wfTempId:0,
                  scStatus:null,
                  scName:null,
                  relData:0, //数据关联
                
                  sc_inittime_start:null,
                  sc_inittime_end:null,
                  sc_duetime_start:null,
                  sc_duetime_end:null,


                  sc_init_req:'',
                  sc_init_req_str:null, 
              },
              scScopeList:[],
              refStatusKv:[],
              searchShow: false,
              dataList:[],
              selectionList:[],
              outputParams:[],
              outputParamsObj:{},
              outputSelectionList:[],
              emitObj:{},

              relSelect:1,
          }
      },
      created(){

      },
      mounted(){
           let _storeKey = this.$route.params.storeKey;       
           if( _storeKey){
                try{
                        let _storeData = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_storeKey));
                        EcoUtil.getSysvm().deleteTempStore(_storeKey);
                        this.baseInfo.operateId = _storeData.operateId;
                        this.baseInfo.scId = _storeData.event.eventSource.sceneEntity.scId;
                        this.emitObj = _storeData.event.emitObj;
                     
                }catch(e){
                        console.log(e);
                }
           }

            //  this.baseInfo.operateId = '1300265709643370498';
            //  this.baseInfo.scId = '1300265651997929474';
            //  this.emitObj = {};
            //  this.emitObj.itemId = "1300265651997929473";

            this.getWFSceneEvent();
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
       
          getWFSceneEvent(){
                this.$refs.ecoLoadingRef.open();
                getWFSceneEventAjax(this.baseInfo).then((response)=>{
                      if(response.data.status <= 99){
                            let _refStatusKv =  response.data.remap.ref_status_kv;
                            if(_refStatusKv.length == 3){
                                _refStatusKv.unshift({id:'100',idString:"100",text: "全部"});
                            }
                            this.refStatusKv = _refStatusKv;

                            /*初始化选择范围*/
                            let _selScope = response.data.remap.ref_data.selScope;
                            if(_selScope){
                                this.scScopeList = [];
                                (_selScope.split(",")).forEach((item,idx)=>{
                                    if(item == '1'){
                                        if(idx == 0){this.baseInfo.scScope = 1;}
                                        this.scScopeList.push({name:'我发起的',id:1});
                                    }else if(item == '2'){
                                        if(idx == 0){this.baseInfo.scScope = 2;}
                                        this.scScopeList.push({name:'我经办的',id:2});
                                    }else if(item == '0'){
                                        if(idx == 0){this.baseInfo.scScope = 0;}
                                        this.scScopeList.push({name:'所有流程',id:0});
                                    }
                                })
                            }

                            this.baseInfo.wfTempId = response.data.remap.ref_data.wfTempId; //流程模版id
                            if(this.refStatusKv && this.refStatusKv.length > 0){
                                 this.baseInfo.scStatus = this.refStatusKv[0].id;
                            }

                            this.baseInfo.relData = response.data.remap.ref_data.relData; //是否 数据关联 0 否 ，1 是
                            this.relSelect = response.data.remap.rel_select;//单选 多选
                        
                            this.getWFSceneLoad();
                      }
                      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            this.$refs.multipleTable.doLayout();
                      });
                      this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                      this.$refs.ecoLoadingRef.close();
                });
         },


         getWFSceneLoad(){
                let _that = this;
                this.$refs.ecoLoadingRef.open();
                getWFSceneLoadAjax(this.baseInfo).then((response)=>{
                     _that.dataList = response.data.remap.result.list;
                     _that.baseInfo.total = response.data.remap.result.count;
                     _that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            _that.$refs.multipleTable.doLayout();
                     });
                     _that.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                     _that.$refs.ecoLoadingRef.close();
                });
        },

        tagSelectCB(data){
            this.baseInfo.sc_init_req_str = data.id
            if(data.itemArray.length > 0){
                this.baseInfo.sc_init_req = data.itemArray[0].linkId;
            }else{
                this.baseInfo.sc_init_req = '';
            }
        },

        resetSearch(){

            this.baseInfo.scName = null;
            this.baseInfo.sc_inittime_start = null;
            this.baseInfo.sc_inittime_end = null;
            this.baseInfo.sc_duetime_start = null;
            this.baseInfo.sc_duetime_end = null;

            this.baseInfo.sc_init_req = '';
            this.baseInfo.sc_init_req_str = null;
        },

        searchListFunc(){
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.baseInfo.page = 1;
            this.getWFSceneLoad();
        },

          // 分页
          handleSizeChange(val) {
              this.$refs.content.setScollTop(0);
              this.baseInfo.pageSize = val;
              this.baseInfo.page = 1;
              this.getWFSceneLoad();
          },

          handleCurrentChange(val) {
              this.$refs.content.setScollTop(0);
              this.baseInfo.page = val;
              this.getWFSceneLoad();
          },

          searchShowFunc(){
                if(this.searchShow){
                    this.searchShow = false;
                }else{
                    this.searchShow = true;
                }
           } ,

          doMoreRowSelect(rows) {
                this.selectionList = rows;
          },

          doOneRowSelect(item){
                this.selectionList = [];
                this.selectionList.push(item);
                this.doSelectBallBack();
          },

          doSelectBallBack(){
                let _selWf = '';
                if(this.selectionList && this.selectionList.length > 0){
                    let _selIdArray = [];
                    (this.selectionList).forEach((element)=>{
                        _selIdArray.push(element.id);
                    })
                    _selWf = _selIdArray.join(',');
                }
                this.getWFSceneFormData(_selWf);
          },


          getWFSceneFormData(_wfId){
                let outputParams = {};
                getWFSceneFormDataAjax(this.baseInfo,_wfId).then((response)=>{
                    if(response.data.status <= 99){
                        let _remap = response.data.remap;

                        let doObj = {}
                        doObj.action = 'relWFPageSelectCallBack';
                        doObj.data = {};
                        doObj.data.selectObj = {};

                        let _outputSelectionObj = {};
                        let _noRelOutputSelectionObj = {};
                        let _hasRelOutputSelectionObj = {};
                     
                        if(this.emitObj && this.emitObj.emitStatus && this.emitObj.emitStatus.parentItemId){ //grid组件
                                    _noRelOutputSelectionObj[String(this.emitObj.emitStatus.parentItemId)] = [];
                        }else{
                                    _noRelOutputSelectionObj[String(this.emitObj.itemId)] = [];
                        }

                       
                             
                        (this.selectionList).forEach((element)=>{
                                    if(this.emitObj && this.emitObj.emitStatus && this.emitObj.emitStatus.parentItemId){ //grid组件
                                         let _oneArray = [];
                                         let _one = {};
                                         _one.cells = {};
                                         _one.cells['1'] = {};
                                         _one.cells['1'].itemId = this.emitObj.itemId;
                                         _one.cells['1'].value = element.requestDesc;
                                         _one.cells['1'].hiddenValue = element.id;
                                         _one.cells['1'].parentItemId = this.emitObj.emitStatus.parentItemId;
                                         _oneArray.push(_one);
                                         _noRelOutputSelectionObj[String(this.emitObj.emitStatus.parentItemId)].push(_oneArray);
                                    }else{
                                         let _one = {};
                                         _one.itemId = this.emitObj.itemId;
                                         _one.value = element.requestDesc;
                                         _one.hiddenValue = element.id;
                                         _noRelOutputSelectionObj[String(this.emitObj.itemId)].push(_one);           
                                    }
                         })

                   

                          if( this.baseInfo.relData !=0){ //有数据关联
                                 _hasRelOutputSelectionObj =  this.initSelectItems(_remap);
                                 for(let key in _noRelOutputSelectionObj){
                                    if(this.emitObj && this.emitObj.emitStatus && this.emitObj.emitStatus.parentItemId){ //grid组件
                                        if( _hasRelOutputSelectionObj[key] ){
                                            (_hasRelOutputSelectionObj[key]).forEach((oneElement,oneIdx)=>{
                                              
                                                try{
                                                    oneElement[0].cells['eco99'] = _noRelOutputSelectionObj[key][oneIdx][0].cells['1'];
                                                }catch(e){
                                                    console.log(e);
                                                }
                                            })
                                        }else{
                                              _hasRelOutputSelectionObj[key] =  _noRelOutputSelectionObj[key];
                                        }
                                    }else{
                                           _hasRelOutputSelectionObj[key] =  _noRelOutputSelectionObj[key];
                                    }
                                 }
                                 _outputSelectionObj = _hasRelOutputSelectionObj;
                          }else{
                              _outputSelectionObj = _noRelOutputSelectionObj;
                          }
             

                         doObj.data.selectObj.selItems =  EcoUtil.objDeepCopy(_outputSelectionObj);
                         doObj.data.selectObj.action = 'PAGE-REL-WF';
                         doObj.data.selectObj.emitObj = EcoUtil.objDeepCopy(this.emitObj);
                         doObj.close = true;
    
                         EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }
                }).catch((error)=>{
                    console.log(error);
                });
         },


        initSelectItems(_remap){
              let _selectObj = {};
              for(let key in _remap){
                    let _outObj = _remap[key];
                    if(_outObj){
                        for(let itemKey in _outObj){
                            let item = _outObj[itemKey]; //回写的组件
                            if(!_selectObj[String(item.itemId)]){
                                _selectObj[String(item.itemId)] = [];
                            }
                            if(item.valType == 'DATAGRID'){//grid 组件
                                if(item.valRow && item.valRow.length > 0){
                                    // let _valRow = [];
                                    // _valRow.push(item.valRow[0]);
                                    let _valRow = item.valRow;
                                    _selectObj[String(item.itemId)].push(_valRow);
                                }
                                
                            }else if(item.valType == 'ATTACHMENT'){
                                _selectObj[String(item.itemId)].push(item);
                            }else{ //普通组件
                                let _one  = {};
                                _one.itemId = item.itemId;
                                _one.parentId = item.parentId;
                                _one.value = item.value;
                                _one.hiddenValue = item.hiddenValue;
                                _selectObj[String(item.itemId)].push(_one);
                            }
                        }
                    }
              }
              return  _selectObj ;
          },

          openWF(id){
            EcoUtil.getSysvm().showTopFormContent(id);
          }
      }

  }

</script>

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




  .wfAPISelect .itemInput{
      display: inline-block;
      width: 180px;
      margin-right: 10px;
  }

  .wfAPISelect .searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #f5f5f5 ;
      border-bottom: 1px solid #ddd;
      height:101px;
      overflow-y:auto;
  }
</style>
