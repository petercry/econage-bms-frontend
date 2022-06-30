<template>
  <div class="wfSeqIndexSetting">
    <eco-content bottom="42px" top="0px" ref="content" class="ecoContentClass"  style="padding:0px 10px;">

         <el-row class="seqRowHead" :gutter="20">
                <el-col :span="6">编号方式</el-col>
                <el-col :span="14">设置</el-col>
                <el-col :span="4">操作</el-col>
         </el-row>

          <draggable  :list="segList" class="list-group" handle=".handle"  v-bind="dragOptions">
               
                        
                        <el-row class="seqRow handle" v-for="(item,idx) in segList" :key="idx" :gutter="20">
                                <el-col :span="6">
                                       <el-select  v-if="item.segType == 1" readonly :value='1' placeholder="请选择编号方式">
                                            <el-option
                                                :label="'自动计数'"
                                                :value="1">
                                            </el-option>
                                        </el-select>

                                        <el-select v-else v-model="item.segType"  placeholder="请选择编号方式">
                                                <el-option
                                                    v-for="item in segTypeArr"
                                                    :key="item.id"
                                                    :label="item.desc"
                                                    :value="item.id">
                                                </el-option>
                                        </el-select>
                                </el-col>

                                <el-col :span="14">

                                    <div v-if="item.segType == 1">
                                        选择&nbsp;<el-input readonly :value="item.seqIdxName" class="pointerClass" style="width:200px;" @click.native="selectSeqIdx(idx)"></el-input>
                                    </div>

                                     <div v-else-if="item.segType == 2">
                                            格式&nbsp;
                                            <el-select v-model="item.dateType"  placeholder="请设置">
                                                    <el-option
                                                        v-for="item in dateKV"
                                                        :key="item.id"
                                                        :label="item.text+' ('+item.comments+')'"
                                                        :value="item.id">
                                                    </el-option>
                                            </el-select>
                                     </div>

                                     <div v-else-if="item.segType == 3">
                                         内容&nbsp;<el-input v-model="item.character" style="width:200px;"></el-input>
                                     </div>

                                     <div v-else-if="item.segType == 4">
                                            字段&nbsp;
                                              
                                            <el-cascader
                                                  v-model="item.itemCascaderId"
                                                  :options="itemList"
                                                  :props="casProps"
                                              >
                                            </el-cascader>
                                     </div>
                                     <span v-else>&nbsp;</span>
                                </el-col>

                                <el-col :span="4">
                                    <span @click="deleteOptions(idx)" class="delBtn" v-if=" item.segType != 1" >删除</span>
                                    <span v-else >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <i class="icon iconfont icondrag-handle handle"></i>
                                </el-col>
                            </el-row>

              
            </draggable>


            <div class="addOptions" @click="addOptions">+ 添加选项</div>

            <div class="preview">
                <div>编号预览</div>
                <div class="code">{{previewCode}}</div>
            </div>
    </eco-content>

   <eco-content  bottom="0px" type="tool" style="padding:5px 0px;background-color:#fff">
          <div class="btn">
                 <el-button @click="cancelFunc" >取消</el-button>
                 <el-button type="primary" @click="submitFunc" >确定</el-button>
         </div>
  </eco-content>

  </div>
</template>
<script>

  import {renderSeqGroupModelAjax,saveSeqgroupModelAjax} from '../../service/service'
  import {sysEnv} from '../../config/env.js'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  import draggable from "../../assets/js/vuedraggable";


  export default {
      components:{
          ecoContent,
          ecoToolTitle,
          ecoLoading,
          draggable
      },
      data(){
          return{
              itemOperateId:0,
              seqGroupId:0,
              segList:[],
              segTypeArr:[],
              dateKV:[],
              resetKv:[],
              itemList:[],
              itemMap:{},
              clickIdx:-1,
              drag:false,
              dragOptions:{
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost",  
              },
              casProps:{
                    children:'deriveItems',
                    label:'optionName',
                    value:'optionId',
                    disabled:false
              }
          }
      },
      created(){          

      },
      mounted(){
            this.listAction();
            this.itemOperateId = this.$route.params.itemOperateId;
            this.seqGroupId = this.$route.params.seqGroupId;
            this.segTypeArr.push({id:2,desc:'系统时间'});
            this.segTypeArr.push({id:3,desc:'固定字符'});
            this.segTypeArr.push({id:4,desc:'表单字段'});
            this.renderSeqGroupModelFunc();
            window.ecoSeqIdxSetVm = this;
      },
      computed:{
            previewCode(){
                let _code = '';
                (this.segList).forEach((item,idx)=>{
                    if(item.segType == 1){
                        if(item.logicEntity){
                             _code += EcoUtil.PrefixInteger(item.logicEntity.startIdx,item.logicEntity.length);
                        }
                    }else if(item.segType == 2){
                      for(let j = 0;j<this.dateKV.length;j++){
                            if(this.dateKV[j].id == item.dateType){
                                _code += this.dateKV[j].comments;
                                 break;
                            }   
                        }
                    }else if(item.segType == 3){
                        if(item.character){
                            _code += item.character;
                        }
                    }else if(item.segType == 4){
                        if(item.itemCascaderId && item.itemCascaderId.length > 0 ){
                             let _casId = item.itemCascaderId[item.itemCascaderId.length-1];
                             if(this.itemMap[_casId]){
                                  _code += this.itemMap[_casId].optionName;
                             }
                        }
                    }
                })
                return _code;
            }
      },
      methods: {
          
          listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'wfSeqIdxSelectBack'){
                          window.ecoSeqIdxSetVm.wfSeqIdxSelectBack(obj);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'ecoSeqIdxSet');
          },

          getOverflowLg(overflowLg){
              let _name = '';
              for(let i = 0;i<this.overflowLgArr.length;i++){
                  if(this.overflowLgArr[i].id == overflowLg){
                      _name = this.overflowLgArr[i].desc;
                      break;
                  } 
              }
              return _name;
          },

          getResetCycl(resetCycl){
              let _name = '';
              for(let i = 0;i<this.resetCyclArr.length;i++){
                  if(this.resetCyclArr[i].id == resetCycl){
                      _name = this.resetCyclArr[i].desc;
                      break;
                  } 
              }
              return _name;
          },

          renderSeqGroupModelFunc(){
               renderSeqGroupModelAjax(this.itemOperateId,this.seqGroupId).then((response)=>{
                   if(response.data.status <=99){
                        this.dateKV = response.data.remap.date_kv;
                        this.resetKv = response.data.remap.reset_kv;
                        if(response.data.remap.model_options){
                            for(let i =0;i<response.data.remap.model_options.length;i++){
                                if(response.data.remap.model_options[i].mapType == 1){
                                      this.itemList = response.data.remap.model_options[i].deriveItems;
                                      break;
                                }
                            }
                            
                            this.setItemMap(this.itemList);
                        }

                        (response.data.remap.seg_list).forEach((item)=>{
                                let _item = item;
                                if(_item.segType == 1){
                                    _item.seqIdxId = _item.segObj;
                                    _item.seqIdxName = _item.segObjName;
                                }else if(_item.segType == 2){
                                    _item.dateType = _item.segObj;
                                }else if(_item.segType == 3){
                                    _item.character = _item.segObj;
                                }else if(_item.segType == 4){
                                    let _segObj =  JSON.parse(_item.segObj);
                                    try{
                                        _item.itemOptionId =  _segObj.dataId;
                                    }catch(e){}

                                    try{
                                        if(_segObj.dparent){
                                            _item.itemCascaderId =  _segObj.dparent.split(",");
                                        }else if(_segObj.dataId){
                                            _item.itemCascaderId = _segObj.dataId.split(",");
                                        }
                                    }catch(e){}
                                }
                                this.segList.push(_item);
                        })
                   }
               })
          },

          setItemMap(list){
              for(let i = 0; i<list.length; i++){
                  let _item  = list[i];
                  if(this.itemMap[String(_item.optionId)]){

                  }else{
                      this.itemMap[String(_item.optionId)] = _item;
                  }
                  if(_item.deriveItems && _item.deriveItems.length > 0){
                        this.setItemMap(_item.deriveItems);
                  }
              }
          },


          addOptions(){
                 this.segList.push({segId:1})
          },

          deleteOptions(idx){
                this.segList.splice(idx,1);
          },

          cancelFunc(){
                EcoUtil.getSysvm().closeDialog();
          },

          /* 确定 */
          submitFunc(){

                /*检查*/
                for(let i =0;i<this.segList.length;i++){
                    if(!this.segList[i].segType){
                          EcoMessageBox.alert('请选择编码方式');
                          return ;
                    }

                    if(this.segList[i].segType == 1){
                        if(this.segList[i].seqIdxId == '0'){
                             EcoMessageBox.alert('请选择自动计数格式');
                            return ;
                        }
                    }

                    if(this.segList[i].segType == 2){
                        if(!this.segList[i].dateType){
                            EcoMessageBox.alert('请选择系统时间格式');
                            return ;
                        }
                    }else if(this.segList[i].segType == 3){
                        if(!this.segList[i].character ||this.segList[i].character == '' ){
                            EcoMessageBox.alert('请选择固定字符内容');
                            return ;
                        }
                    }else if(this.segList[i].segType == 4){
                         if(!this.segList[i].itemCascaderId){
                            EcoMessageBox.alert('请选择表单字段');
                            return ;
                        }
                    }
                }

                let _seqGroupList = [];
                (this.segList).forEach((item,idx)=>{
                    let _oneItem  = {};
                    _oneItem.gpId = this.seqGroupId;
                    _oneItem.orderId = (idx+1);
                    _oneItem.segType = item.segType;
                    if(item.segType == 1){
                        _oneItem.segObj = item.seqIdxId;
                    }else if(item.segType == 2){
                        _oneItem.segObj = item.dateType;
                    }else if(item.segType == 3){
                        _oneItem.segObj = item.character;
                    }else if(item.segType == 4){
                            let _itemObj = null;
                            if(item.itemCascaderId && item.itemCascaderId.length > 0 ){
                                let _casId = item.itemCascaderId[item.itemCascaderId.length-1];
                                if(this.itemMap[_casId]){
                                       _itemObj = this.itemMap[_casId];
                                }
                            }

                         
                            let _segObj = {};
                            if(_itemObj && _itemObj!=null){
                                _segObj.mdId = _itemObj.mdId;
                                _segObj.dataId = _itemObj.optionId;
                                if(item.itemCascaderId && item.itemCascaderId.length > 0 ){
                                    _segObj.dparent = item.itemCascaderId.join(",");
                                }
                            }
                            _oneItem.segObj = JSON.stringify(_segObj);
                    }
                    _seqGroupList.push(_oneItem);
                })

                let _data= {};
                _data.operateId = this.itemOperateId;
                _data.seqGroupId = this.seqGroupId;
                _data.seqGroupList = JSON.stringify(_seqGroupList);
               
            
                let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存中...'});
                saveSeqgroupModelAjax(_data).then((response)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });
                        if(response.data.status <=99){
                             this.successMessage();
                             EcoUtil.getSysvm().closeDialog();
                        }else{
                             this.cancelMessage();
                        }
                }).catch((err)=>{
                    this.cancelMessage();
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });
              })
          },

         successMessage(){
              this.$message({
                     showClose: true,
                     message:'操作成功',
                     type: 'success',
                     duration:2000
               });
          },

         cancelMessage(){
              this.$message({
                     showClose: true,
                     message:'操作失败',
                     type: 'error',
                     duration:2000
               });
          },

          selectSeqIdx(idx){
               this.clickIdx = idx;
               if(sysEnv == 1){
                     let url = '/flowform/index.html#/wfSeqIndexSelect';
                     EcoUtil.getSysvm().openDialog('选择编号序列',url,1000,500,'8vh');
               }else{
                    this.$router.push({name:'wfSeqIndexSelect'})
               }
          },

          wfSeqIdxSelectBack(obj){
               this.$set(this.segList[this.clickIdx],'seqIdxId',obj.data.lgId);
               this.$set(this.segList[this.clickIdx],'seqIdxName',obj.data.name);
               this.$set(this.segList[this.clickIdx],'logicEntity',obj.data.logicEntity);
          
          }
      }

  }

</script>

<style scoped>


.wfSeqIndexSetting .ecoContentClass{
      background-color:#fff;
}

.wfSeqIndexSetting .seqRowHead{
    line-height: 48px;
    height: 48px;
    
}

.wfSeqIndexSetting .seqRow{
    background-color:#f5f5f5;
    line-height: 48px;
    height: 48px;
    margin-bottom:10px;
}

.wfSeqIndexSetting  .addOptions{
    margin-top:20px;
    border: 1px dashed #e8e8e8;
    border-radius: 2px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #1ba5fa;
    vertical-align: middle;
    cursor: pointer !important;
}

.wfSeqIndexSetting .btn{
    text-align:right;
    margin-right:10px;
}

.wfSeqIndexSetting .delBtn{
    color:#e03a3a;
    cursor:pointer;
}

.wfSeqIndexSetting .handle{
    cursor:move;
}

.wfSeqIndexSetting .preview{
    margin-top:20px;
    background-color:#f5f5f5;
    text-align: center;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
    padding:10px 0px;
}

.wfSeqIndexSetting .preview .code{
    font-size: 16px;
}


   
</style>
