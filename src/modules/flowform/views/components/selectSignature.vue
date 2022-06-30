<template>
    <div class="selectSignature">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <el-scrollbar class="page-component__nav" style="height: 100%;">
          <el-table
              v-loading="loading"
              size="medium"
              class="list"
              :data="listData"
              style="width: 100%;">
              <el-table-column
                  prop="groupName"
                  label="印章类型"
                  width="200"
                  >
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="印章名称"
                   show-overflow-tooltip
                  >
              </el-table-column>

              <el-table-column
                    label="创建时间"
                    width="150"
                    :sort-orders="['ascending', 'descending']"
                    sortable="custom"
                    prop="create_date_"
                  >
                    <template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate.substr(0,16):''}}</template>
              </el-table-column>
              <el-table-column
                  label="缩略图"
                  prop="thumbnailBase64"
                  width="120"
              >
                 <template slot-scope="scope" >
                    <el-image
                    style="width: 50px;height:50px"
                    :src="scope.row.smallSrc"
                    :preview-src-list="scope.row.bigSrc"
                    fit="cover"
                    :zIndex=2910
                    >
                        <div slot="placeholder" class="image-slot">
                            加载中<span class="dot">...</span>
                        </div>
                    </el-image>
                  </template>
              </el-table-column>
              <el-table-column
                  label="操作"
                  prop="id"
                  width="60"
              >
              <template slot-scope="scope" >
                  <el-button type="text" size="medium" @click="choose(scope.row)">选中</el-button>
              </template>
              </el-table-column>
          </el-table>
        </el-scrollbar>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {rows,sysEnv,baseFileDownloadServletUrl} from '../../config/env.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import {getSignatureList} from '../../service/service.js'
export default{
  data(){
    return {
        listData:[],
        loading:true,
        orgId:"",
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
      this.orgId = this.$route.params.linkId;
  },
  beforeDestroy() {
     
  },
  mounted(){
      this.getSignatureList();
  },
  computed:{

  },
  methods: {
      getSignatureList(){
          this.loading = true;
          getSignatureList(this.orgId).then((response) => {
                this.loading = false;
                this.listData = response.data.rows;
                this.listData.forEach((element)=>{
                    this.$set(element,"smallSrc","data:image/png;base64,"+element.thumbnailBase64)
                    this.$set(element,"bigSrc",new Array);
                    element.bigSrc.push("data:image/png;base64,"+element.imgBase64);
                });
          }).catch((error) => {
              this.loading = false;
          });
      },  
      choose(item){
          let doObj = {}
          doObj.action = 'selectSignature';
          doObj.data = {
              id:item.id,
              name:item.name,
              smallSrc:item.smallSrc,
              bigSrc:item.bigSrc
          };
          doObj.close = true;
          EcoUtil.getSysvm().callBackDialogFunc(doObj);
      }
  },
  watch: {
     
  }
}
</script>
<style>
.selectSignature{
   height: 100%;
    overflow: auto;
    background: #fff;
  }
  


</style>
