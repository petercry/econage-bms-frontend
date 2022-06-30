<template>
    <eco-content top="0px" bottom="0px" class="regionDet">

            <eco-content top="0px" height="60px" type="tool">
                        <el-row  class="toolbar">
                            <el-col :span="6">
                                <eco-tool-title style="line-height: 38px;" :title="getKVName(params.region,'crp_region')"></eco-tool-title>
                            </el-col>

                            <el-col :span="18" style="text-align:right;padding-right:10px;">
                                <el-button type="text" size="medium" @click="addFunc"><i class="icon iconfont icontianjia"></i> 添加数据</el-button>
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
                >

                <el-table-column
                    type="index"
                    min-width="40"
                    max-width="50"
                    >
                </el-table-column>

                <el-table-column
                        prop="region"
                        show-overflow-tooltip
                        label="大区"
                    >
                        <template slot-scope="scope" >
                            <span >{{getKVName(scope.row.region,'crp_region')}}</span> 
                        </template>
                </el-table-column>

                <el-table-column
                        prop="area"
                        show-overflow-tooltip
                        label="省份"
                    >
                        <template slot-scope="scope" >
                            <span >{{getKVName(scope.row.area,'crp_area')}}</span> 
                        </template>
                </el-table-column>

                <el-table-column
                        prop="location"
                        show-overflow-tooltip
                        label="坐标"
                        width="200"
                    >
                </el-table-column>

                <el-table-column
                        label="操作"
                        width="120"
                        >
                        <template slot-scope="scope" >
                            <div>
                                    <span @click="editItem(scope.row.id)" class="alink ">编辑</span>&nbsp;|&nbsp;
                                    <span @click="deleteItem(scope.row)" class="delLink">删除</span>
                            </div>
                        </template>
                </el-table-column>

            </el-table>
      </ecoContent>
    </eco-content>
</template>
<script>


import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getRegionList,delRegion} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv,rows} from '../../config/env.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoKVUtil} from '@/components/util/kv.js'


export default{
    name:'regionDet',
    components:{
        ecoContent,
        ecoToolTitle
    },
    data(){
      return {
            params:{
                area:null,
                region:null,
                page:1,
                rows:999999,
                sort:'createDate',
                order:'asc',
                total:0
            },
            dataList:[],
            kvMap:{
                crp_region:[], //大区
                crp_area:[] //省份
            }
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
              if(obj && (obj.action == 'regionAddCallBack')){ 
                  window.ecoFrameVm.addCBFunc(obj.data);
              }else if(obj && (obj.action == 'regionUpdateCallBack')){
                  window.ecoFrameVm.editCBFunc(obj.data);
              }else if(obj && (obj.action == 'treeKvSortCallBack')){
                  window.ecoFrameVm.sortCBFunc(obj.data);
              }
          }

          EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'regionDet');
    },

    getKVName(id,array){
            let _idArray = null;
            if(id instanceof Array){
                _idArray = id;
            }else{
                _idArray = [];
                _idArray.push(id);
            }
            return EcoKVUtil.getCategoryNameMutile(this.kvMap[array],_idArray,'id','text');
    },

    init(){
        this.params.region = this.$route.params.region;
        this.params.area = (this.$route.params.area=='undefined')?null:this.$route.params.area;
        this.getListFunc();
        EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);
    },


    getListFunc(){
        getRegionList(this.params).then((response) => {
            this.dataList = response.data.rows;
            this.params.total = response.data.total;
        });
    },

    addFunc(){
       if(sysEnv == 1){
              let url = '/project/index.html#/regionAdd/'+this.params.region;
              EcoUtil.getSysvm().openDialog('添加区域划分',url,500,300,'18vh');
        }else{
              this.$router.push({name:'regionAdd',params:{region:this.params.region}});
        }
    },

    addCBFunc(data){
          this.getListFunc();

          this.SET_ECO_EVENT({action:'addNode',key: EcoUtil.getUID()});
          this.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(data.queryObj));
    },

    editItem(id){
        if(sysEnv == 1){
              let url = '/project/index.html#/regionEdit/'+id;
              EcoUtil.getSysvm().openDialog('修改数据',url,500,300,'18vh');
        }else{
              this.$router.push({name:'regionEdit',params:{id:id}});
        }
    },

    editCBFunc(data){
          if(this.params.area){
                this.params.region = data.queryObj.region;
          }
          this.getListFunc();
          if(data.queryObj.region != data.oldRegion){
               this.SET_ECO_EVENT({action:'editNode',key: EcoUtil.getUID()});
               this.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(data));
          }
    },

    deleteItem(item){
            let that  = this;
            let confirmYesFunc = function(){
                  delRegion(item.id).then((response)=>{
                        that.$message({
                              showClose: true,
                              message:'删除成功',
                              type: 'success',
                              duration:2000
                        });

                        if(that.params.area == null){ //区域里面删除
                            that.getListFunc();
                        }
                        
                        that.SET_ECO_EVENT({action:'delNode',key: EcoUtil.getUID()});
                        that.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(item));
                  })
            }
            let options = { type:'warning',lockScroll:false}
            EcoMessageBox.confirm('确认删除？','提示',options,confirmYesFunc);
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
.regionDet .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.regionDet .blue{
    color:#409EFF;
}

.regionDet .red{
    color:#f56c6c;
}

.regionDet  .signSpan{
    cursor: pointer;
    color:#409EFF;
}

.regionDet .disableSpan{
    color:#ccc;
}

 .regionDet .alink{
    cursor: pointer;
    color: #409eff;
  }

  .regionDet .delLink{
    cursor: pointer;
    color: red;
  }
</style>
