<template>
    <div class="sortVue"  v-loading="loading">
    
          <eco-content  top="0px" bottom="50px" >
                <draggable v-model="dataList" tag="div"   v-bind="dragOptions">
                        <el-row v-for="(item,idx) in dataList" :key="idx" class="dataRow dragTr" style="width:100%">
                            <el-col :span="20">
                                <span class="title">{{item.name}}</span>
                            </el-col>
                            <el-col :span="4" style="" class="moveCol">
                                <i class="icon iconfont iconpaixu1" ></i>
                            </el-col>
                        </el-row>
                </draggable>
        </eco-content>

            <eco-content  bottom="0px" height="50px" class="wfCategoryDet">
                 <div class="btn">
                    <el-button @click="cancelFunc">取消</el-button>
                    <el-button type="primary" @click="change">保存 <i class="el-icon-check el-icon--right"></i></el-button>
                </div>
            </eco-content>
    </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoUtil from '@/components/util/main.js'
import {getWFGroupList,sortWFCategory} from '../../service/service.js'
import draggable from "@/components/util/vuedraggable";
import { Loading } from 'element-ui';

export default {
  name:'sortOrg',
  components:{
     draggable,
     ecoContent,
    
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
       this.getWFGroupListFunc();
    },

    getWFGroupListFunc(){
        getWFGroupList(this.parentId).then((response) => {
              let _dataList = [];
              (response.data).forEach((item)=>{
                    if(item.isActiveFlag == 'y'){
                        _dataList.push(item);
                    }
              })
              this.dataList = _dataList;
              this.loading = false;
        });
    },

    change(evt){
        let _groups = [];
        (this.dataList ).forEach((item)=>{
            _groups.push(item.id);
        })

        sortWFCategory(_groups).then((res)=>{
                let doObj = {}
                if(this.parentId == 0){
                    doObj.action = 'wfCategorySortCallBack-root';
                }else{
                    doObj.action = 'wfCategorySortCallBack';
                }

                doObj.data = {};
                doObj.close = true;
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
    },

    cancelFunc(){
        let doObj = {}
        doObj.data = {};
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

.sortVue .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
