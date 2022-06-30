<template>
    <div class="editModual">

      <ecoContent top="0" height="65px" style="line-height:45px;height:45px;text-align:right;">
             <el-button type="primary" @click.native="save" style="margin-right:20px;">保存配置</el-button>
      </ecoContent>

       <ecoContent top="45px" bottom="0px">
          <el-table
              :data="listArray"
              style="width: 100%"
              size="mini"
              row-key="modularDef"
            >
            <el-table-column
              prop="modularDefI18nText"
              show-overflow-tooltip
              label="模块名称"
              width="140"
              >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="操作"
              min-width="200"
              >
              <template slot-scope="scope" >
                <div>
                  <el-checkbox-group v-model="scope.row.modularPermissions" >
                      <el-checkbox  v-for="item in scope.row.modularPermissionItems" :label="item.def" :key="item.def">{{item.i18nText}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
      </ecoContent>
 
    </div>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import {savePermissionGroupModularConfig,getPermissionGroupModularConfig} from '../../service/service.js'
import {Loading } from 'element-ui';
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'modPermission',
  components:{
    ecoContent
  },
  data(){
    return {
      listArray:[],
      // expandRowKeys:[]
    }
  },
  mounted(){
    this.getPermissionGroupModularConfig();
  },
  methods: {
    getPermissionGroupModularConfig(){
      let id = this.$route.params.id; 
      getPermissionGroupModularConfig(id).then(res=>{
        if (res.data&&res.data){
          this.listArray = res.data.map(item=>{
            // this.expandRowKeys.push(item.id)
            item.modularDef = item.id;
            item.modularDefI18nText = item.label;
            item.children = item.options.map(item=>{
              if (!item.modularPermissions){
                item.modularPermissions = []
              }
              return item;
            });
            return item;
          });
        }
      }).catch((error)=>{
      })
    },
    save(){
      let id = this.$route.params.id;
      let resultArr = [];//{modular:'',action:''}
      this.listArray.map(item=>{
        item.children.map(item=>{
          let modular = item.modularDef;
          for (let index = 0; index < item.modularPermissions.length; index++) {
            const element = item.modularPermissions[index];
            const obj = {
              modular:modular,
              action:element
            }
            resultArr.push(obj)
          }
          return item;
        })
        return item;
      })

      let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
      savePermissionGroupModularConfig(id,resultArr).then((res)=>{
             this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
              });

            try {
              // if (res.data&&res.data.id){
                this.$message({type: 'success',message: '保存成功！'});
              
                let doObj = {}
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            } catch (error) {
              
            }
      }).catch((error)=>{
              this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
              });
      
            this.$message({type: 'error',message: '保存失败！'});
      })
    }
  },
  watch: {

  }
}
</script>
<style>
.editModual .el-checkbox__label{
  font-size: 12px;
}
</style>
