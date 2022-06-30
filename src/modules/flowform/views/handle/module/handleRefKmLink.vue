<template>
    <div class="refKmList">
        <div class="kmItem" v-for="(option,index) in refKmArray" :key="index" @click="goKmLink(option)" >
            <span><i class="iconfont icon iconzhishi"></i>知识库：{{option.klgName}} /</span>
            <el-cascader
            v-model="option.klgdrPath"
            :options="option.kmFolder"
            :ref="'kmGroup'+index"
            style="width:500px;"
            disabled
            :props="{ disabled:'disabled1', label:'title',leaf:'1',value:'id',children:'children'}"
        >
            <template slot-scope="{ node, data }">
                <span v-if="data.title">{{ data.title }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
        </el-cascader> 
        </div>
    </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {getKMListInfo,getKMInfoByReqId} from '../../../service/service.js'

export default{
  name:'handleRefKmLink',
  components:{
      
  },
  props:{
        refKmArray:{
            type:Array,
            defulat:function(){
                return [];
            }
        }
       
  },
  data(){
    return {
       
    }
  },
  created(){
      
        this.getKMListInfo();
 
  },
  mounted(){
    
  },
  computed:{

  },
  methods: {
       goKmLink(item){
            let pathIds = [];
            pathIds.push(item.klg);
            if(item.klgdrPath && item.klgdrPath.length > 0){
                pathIds.concat(item.klgdrPath);
            }
            console.log(pathIds);
            EcoUtil.getSysvm().setTempStore("refKmLink",pathIds);

       },
       init(){
        this.refKmArray.forEach((element,index) => {
            if(element.klgdrPath){
                this.getKMInfoByReqId(element.klg,element,index);
            }
            for(let i = 0;i<this.kmList.length;i++){
                let item = this.kmList[i];
                if(item.requestId == element.klg){
                    this.$set(element,"klgName",item.name);
                    break;
                }
            }
               
           
        });
       },
       getKMListInfo(){
            getKMListInfo().then((response) => {
                if(response.data.success){
                    this.kmList = response.data.queryObj;
                     this.init();
                }
                
            }).catch((error) => {

            });
        },
         //获取知识库文件夹数据
        getKMInfoByReqId(reqId,item,index){
            getKMInfoByReqId(reqId).then((response) => {
                if(response.data.success){
                    
                      
                    this.$nextTick(()=>{
                        this.$set(item,"kmFolder",response.data.queryObj);
                    });
                }     
            }).catch((error) => {
                console.log(error)
            });
        },
  },
  watch: {
      "refKmArray.length":{
        handler(newValue, oldValue) {
           console.log(newValue)
                 this.init();
            
        }
      
      }
  }
}
</script>
<style scoped>

.refKmList{
    padding: 8px 10px;
}
.refKmList .kmItem{
    color:#1ba5fa;
    cursor:pointer;
    margin:5px 0;
}
.iconfont.iconzhishi{
    position: relative;
    margin-right: 6px;
    top: 1px;
}
</style>
