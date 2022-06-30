<template>
    <div class="sortVue"  v-loading="loading">
      
            <draggable v-model="dataList" tag="div"   v-bind="dragOptions" @change="change">
                    <el-row v-for="(item,idx) in dataList" :key="idx" class="dataRow dragTr" style="width:100%">
                        <el-col :span="20">
                            <span class="title">{{item.text}}</span>
                        </el-col>
                        <el-col :span="4" style="" class="moveCol">
                            <i class="icon iconfont iconpaixu1" ></i>
                        </el-col>
                    </el-row>
            </draggable>
        </div>
</template>

<script>

import EcoUtil from '@/components/util/main.js'
import {getTreeKvListByParentId,sortTreeKv} from '../../service/service.js'
import draggable from "@/components/util/vuedraggable";
import { Loading } from 'element-ui';

export default {
  name:'sortOrg',
  components:{
     draggable,
    
  },
  props: {
 
  },
  data() {
    return {
        parentId:0,
        orgTypeArray:[],
        dataList:[],
        dragOptions:{
              animation: 150,
              group: "module",
              ghostClass: "ghost", 
              draggable:'.dragTr',
              handle:'.dragTr',
              scroll:true,
              forceFallback:true, 
        },
        dragging: false,
        loading:true
    };
  },
  mounted(){
    
  },
  created(){
      this.init();
  },
  computed:{
  
  },
  methods:{
    init(){
       this.parentId = this.$route.params.parentId;
       this.getTreeKvListByParentIdFunc();
    },

    getTreeKvListByParentIdFunc(){
        getTreeKvListByParentId(this.parentId,'create-enabled').then((response) => {
              this.dataList = response.data;
              this.loading = false;
        });
    },

    change(evt){
     
        let _drgaId = evt.moved.element.id;
        let _action = null;
        let _targetId = null;
        let _newIndex = evt.moved.newIndex;
        let _oldIndex = evt.moved.oldIndex;

        if(_newIndex > _oldIndex){
            _targetId = this.dataList[_newIndex-1].id;
            _action = 'bottom';
        }else if(_newIndex< _oldIndex){
             _targetId = this.dataList[_newIndex+1].id;
            _action = 'top';
        }

        sortTreeKv(_drgaId,_targetId,_action).then((res)=>{
             
                let doObj = {}
                if(this.parentId == -1){
                    doObj.action = 'treeKvSortCallBack-root';
                }else{
                    doObj.action = 'treeKvSortCallBack';
                }
               
                doObj.data = {};
                doObj.data.dataList = EcoUtil.objDeepCopy(this.dataList);
                EcoUtil.getSysvm().callBackDialogFunc(doObj);

        }).catch((err)=>{
            this.$message({type: 'error',message: '排序失败！'});
        })
     
    },
   
    
    saveSort(){
        let doObj = {}
        doObj.action = 'sortOrgCB';
        doObj.data = {};
        doObj.data.dataList = EcoUtil.objDeepCopy(this.dataList);

        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
    }
    
  },
  destroyed(){
    
  },
  watch: {
     
   }
};

</script>

<style scoped>
.sortVue{
    padding:0px 0px;
}

.sortVue .dataRow{
    padding:5px;
    background-color: rgb(231,232,236);
    margin:0px 0px 10px 0px;
    font-size: 14px;
}

.sortVue .dataRow .title{
    color:#0e152ccc
}

.sortVue .moveCol{
    text-align:right;
    color:#194ce6;
}


.sortVue .dragTr{
    cursor:move;
}

.sortVue .sortable-drag {
    background-color: #fff;
}
</style>
