<template>
    <eco-content top="0px" bottom="0px" class="basicKvDetailList">

        <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                            <eco-tool-title style="line-height: 38px;" :title="parentName"></eco-tool-title>
                        </el-col>

                        <el-col :span="18" style="text-align:right;padding-right:10px;">
                            <el-checkbox v-model="viewEnabled" @change="changeAction">全部</el-checkbox>
                            &nbsp;&nbsp;
                            <el-button type="text" size="medium" @click="addFunc"><i class="icon iconfont icontianjia"></i> 添加选项</el-button>
                            <el-button type="text" size="medium" @click="sortFunc" v-if="false"><i class="icon iconfont iconpaixu"></i> 排序</el-button>
                        </el-col>
                    </el-row>
        </eco-content>


       <ecoContent top="60px" bottom="0" style="padding:15px;">
            <el-table
                  :data="dataList"
                  highlight-current-row
                  stripe
                  class="styleTableDefault"
                  style="width: 100%"
                  size="mini"
                  height="100%"
                  @header-dragend="changeColWidth"
                  border
              >

              <el-table-column
                  type="index"
                  min-width="40"
                  max-width="50"
                >
              </el-table-column>

            <el-table-column
                    prop="id"
                    show-overflow-tooltip
                    label="ID"
                    width="120"
                    min-width="120"
                >
              </el-table-column>

              <el-table-column
                    prop="text"
                    show-overflow-tooltip
                    label="名称"
                    min-width="120"
                >
                    <template slot-scope="scope" >
                        <span >{{scope.row.text}}</span>
                    </template>
              </el-table-column>

              <el-table-column
                    prop="shortName"
                    show-overflow-tooltip
                    label="简称"
                    width="120"
                    min-width="120"
                >
              </el-table-column>

              <el-table-column
                    prop="code"
                    show-overflow-tooltip
                    label="编码/备注"
                    width="120"
                    min-width="120"
                >
              </el-table-column>

              <el-table-column
                    prop="i18nKey"
                    show-overflow-tooltip
                    label="国际化"
                    width="100"
                    min-width="100"
                >
              </el-table-column>

              <el-table-column
                    prop="order"
                    show-overflow-tooltip
                    label="序号"
                    width="80"
                    min-width="80"
                >
              </el-table-column>

                <el-table-column
                    show-overflow-tooltip
                    label="状态"
                    width="60"
                    min-width="60"
                >
                     <template slot-scope="scope" >
                         <span v-if="scope.row.enableInCreate" class="blue">有效</span>
                         <span v-else class="red">失效</span>
                     </template>
              </el-table-column>

               <el-table-column
                    label="操作"
                    width="120"
                    min-width="120"
                    >
                    <template slot-scope="scope" >
                        <div>

                            <span class="signSpan" @click="editFunc(scope.row)" v-if="scope.row.enableInCreate">编辑</span>
                            <span class="split" v-if="scope.row.enableInCreate"></span>
                            <span  class="pointerClass" @click="delFunc(scope.row)"  style="color:#f56c6c;" v-if="scope.row.enableInCreate">删除</span>
                            <span  class="pointerClass" @click="recoveryFunc(scope.row)"  style="color:#67c23a;" v-if="!scope.row.enableInCreate">恢复</span>

                        </div>
                    </template>
                </el-table-column>

        </el-table>
      </ecoContent>
    </eco-content>
</template>
<script>


import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoUtil from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../../config/env.js'
import {updateBasicKv,getBasicKvGroupDetail} from '../../../service/service.js'
import {mapMutations} from 'vuex'


export default{
    name:'basicKvDetailList',
    components:{
        ecoContent,
        ecoToolTitle
    },
    data(){
        return {
            parentId:null,
            parentName:null,
            dataList:[],
            listAction:'select-enabled',
            viewEnabled:true
        }
    },

    mounted(){
        this.init();
        window.ecoFrameVm = this; //添加监听
        this.addMonitor(); //添加监听
    },
    methods: {
      ...mapMutations([
            'SET_ECO_EVENT',
            'SET_ECO_EVENT_DATA'
    ]),

    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'basicKvDetailAddCallBack')){
                  window.ecoFrameVm.addCBFunc(obj.data);
              }else if(obj && (obj.action == 'basicKvDetailEditCallBack')){
                  window.ecoFrameVm.editCBFunc(obj.data);
              }else if(obj && (obj.action == 'treeKvSortCallBack')){
                  window.ecoFrameVm.sortCBFunc(obj.data);
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'basicKvDetailList');
    },

    init(){
            this.parentId = this.$route.params.parentId;
            this.parentName = decodeURIComponent(this.$route.params.parentName);
            this.getBasicKvListByParentIdFunc();
    },

    //列表
    getBasicKvListByParentIdFunc(){
            getBasicKvGroupDetail(this.parentId).then((response)=>{
                let _dataList = [];
                (response.data).forEach((item)=>{
                    if(this.viewEnabled || item.enableInCreate){
                        _dataList.push(item);
                    }
                })
                this.dataList = _dataList;
            }).catch((error)=>{});
    },

    addFunc(){
       if(sysEnv == 1){
              let url = '/manage/index.html#/basicKvDetailAdd/'+this.parentId;
              EcoUtil.getSysvm().openDialog('添加数据',url,600,500,'12vh');
        }else{
              this.$router.push({name:'basicKvDetailAdd',params:{group:this.parentId}});
        }
    },

    addCBFunc(data){
         this.reloadAndDoEventAction();
    },

    sortFunc(){
        return ;
        if(sysEnv == 1){
              let url = '/manage/index.html#/treeKvSort/'+this.parentId;
              EcoUtil.getSysvm().openDialog('数据排序',url,600,400,'12vh');
        }else{
              this.$router.push({name:'treeKvSort',params:{parentId:this.parentId}});
        }
    },

    sortCBFunc(data){
            this.reloadAndDoEventAction('sortNode');
    },

    editFunc(item){
            let _key = EcoUtil.getUID();
            let _keyData = {};
            _keyData.item = EcoUtil.objDeepCopy(item);
            EcoUtil.getSysvm().setTempStore(_key,_keyData);

            let url = '/manage/index.html#/basicKvDetailEdit/'+_key;
            EcoUtil.getSysvm().openDialog('修改数据',url,600,500,'12vh');
    },

    editCBFunc(data){
        this.reloadAndDoEventAction('editNode');
    },


    delFuncConfirm(data){
        let that  = this;
        let confirmYesFunc = function(){
            that.delFunc(data);
        }
        let options = {
                type: 'warning',
                lockScroll:false
        }
        EcoMessageBox.confirm('确认删除数据？','提示',options,confirmYesFunc);
    },

    delFunc(data){
        let _data = EcoUtil.objDeepCopy(data);
        _data.enableInCreate = false;
        _data.enableInUpdate = false;
        _data.enableInSelect = true;

        updateBasicKv(_data).then((response)=>{
            this.reloadAndDoEventAction('editNode');
        });

    },

    recoveryFuncConfirm(data){
        let that  = this;
        let confirmYesFunc = function(){
            that.recoveryFunc(data);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确认恢复数据？','提示',options,confirmYesFunc);
    },

    recoveryFunc(data){
            let _data = EcoUtil.objDeepCopy(data);
            _data.enableInCreate = true;
            _data.enableInUpdate = true;
            _data.enableInSelect = true;
            updateBasicKv(_data).then((response)=>{
                this.reloadAndDoEventAction('editNode');
            });
    },


    reloadAndDoEventAction(){
        this.getBasicKvListByParentIdFunc();
    },

    changeAction(val){
        this.getBasicKvListByParentIdFunc();
    },
    changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    }

  },
  watch: {
      $route(){
          this.init();
      }
  },
  destroyed(){
      delete window.ecoFrameVm;
  }
}
</script>
<style scope>
.basicKvDetailList .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.basicKvDetailList .blue{
    color:#409EFF;
}

.basicKvDetailList .red{
    color:#f56c6c;
}

.basicKvDetailList  .signSpan{
    cursor: pointer;
    color:#409EFF;
}

.basicKvDetailList .disableSpan{
    color:#ccc;
}
</style>
