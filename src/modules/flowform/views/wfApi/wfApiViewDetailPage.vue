<template>
  <div class="wfAPIViewDetail">
    <ecoLoading ref='ecoLoadingRef' text='加载中...' ></ecoLoading>
    <eco-content bottom="0px" top="0px" ref="content" class="ecoContentClass"  style="padding:0px;">
            <div class="title">{{emitObj.eventValue}}</div>
            <el-form ref="form" label-width="120px">
                <el-form-item 
                        :label="item.titleName+':'"   
                        v-for="(item,idx) in columns"
                        :key="'col'+idx"
                        v-if="item.scVisible == 1"
                        style="border-bottom:1px solid #fafafa;margin:5px 0px;"
                        >
                        {{dataObj[item.paramName]}}
                </el-form-item>
            </el-form>
    </eco-content>
  </div>
</template>
<script>

  import {getViewApiSceneEvent} from '../../service/service'
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
              eventObj:{
                    ref_id:0,
                    sc_id:0,
                    scSelect:1,
                    operate_id:0
              },
              columns:[],
              dataObj:{},
              emitObj:{},
          }
      },

      created(){
            let _storeKey = this.$route.params.storeKey;       
            if( _storeKey){
                    try{
                            let _storeData = EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(_storeKey));
                            EcoUtil.getSysvm().deleteTempStore(_storeKey);
                            let _data =  _storeData.formData;
                            _data.ref_id = _storeData.event.eventSource.sceneEntity.refId;
                            _data.sc_id = _storeData.event.eventSource.sceneEntity.scId;
                            _data.scSelect = _storeData.event.eventSource.sceneEntity.scSelect;
                            _data.operate_id = _storeData.operateId;
                            _data.row_ind = 0;
                            if(_storeData.event.emitObj.emitStatus ){
                              try{
                                   _data.row_ind = _storeData.event.emitObj.emitStatus.gridRowIndex+1;
                              }catch(e){
                                  _data.row_ind = 0;
                              }
                            }
                            this.eventObj = _data;
                            this.emitObj = _storeData.event.emitObj;
                    }catch(e){
                            console.log(e);
                    }
            }
         
      },
      mounted(){
            this.getWFApiListFunc();
      },
      computed:{
        
      },
      methods: {

          getWFApiListFunc(){
                this.$refs.ecoLoadingRef.open();
                getViewApiSceneEvent(this.eventObj).then((response)=>{
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
                            }else{
                                if(response.data.remap.colmap && response.data.remap.colmap.self){
                                    this.columns = response.data.remap.colmap.self;
                                }
                                this.dataObj = response.data.remap.data;
                            }
                      }
                      this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                      this.$refs.ecoLoadingRef.close();
                });
          },

      }

  }

</script>

<style scoped>
.wfAPIViewDetail{
    position: relative;
    height: 100%;
    margin: 0 0px;
    top: 0%;
    overflow-y: hidden;
}

.wfAPIViewDetail .title{
  color:#606266;
  font-size: 14px;
  line-height: 28px;
  height:28px;
  text-align: center;
}

</style>
