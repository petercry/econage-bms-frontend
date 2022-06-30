<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>模块权限</span>
            <el-button style="float: right;" type="default" @click.native="save">保存配置</el-button>
          </div>
          <el-table
            :data="listArray"
            style="width: 100%"
            size="mini"
            row-key="modularDef"
            >
            <!-- <el-table-column
              type="index"
              min-width="40"
              max-width="50"
              >
            </el-table-column> -->
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
                  <el-checkbox-group v-model="scope.row.modularPermissions">
                  <el-checkbox v-for="item in scope.row.modularPermissionItems" :label="item.def" :key="item.def">{{item.i18nText}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {savePermissionGroupModularConfig,getPermissionGroupModularConfig} from '@/modules/manage/service/service.js'
export default{
  name:'modPermission',
  components:{
    ecoLoading,
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
      this.$refs.ecoLoadingRef.open();
      savePermissionGroupModularConfig(id,resultArr).then((res)=>{
        try {
          // if (res.data&&res.data.id){
            this.$message({type: 'success',message: '保存成功！'});
            this.$refs.ecoLoadingRef.close();
            // let doObj = {}
            // doObj.action = 'groupEditCallBack';
            // doObj.close = true;
            // parent.window.sysvm.callBackDialogFunc(doObj);
          // }
        } catch (error) {
          
        }
      }).catch((error)=>{
        this.$refs.ecoLoadingRef.close();
        this.$message({type: 'error',message: '保存失败！'});
      })
    }
  },
  watch: {

  }
}
</script>
<style>

</style>
