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
            :header-cell-style="{textAlign:'center'}"
            :cell-style="{textAlign:'center'}"
            >
            <el-table-column
              type="index"
              min-width="40"
              max-width="50"
              >
            </el-table-column>
            <el-table-column
              prop="modularI18nText"
              show-overflow-tooltip
              label="模块国际化名称"
              width="110"
              >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="新增权限"
              min-width="70"
              >
              <template slot-scope="scope" >
                <div style="text-align:center">
                  <el-checkbox v-model="scope.row.canInsert"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="删除权限"
              min-width="70"
              >
              <template slot-scope="scope" >
                <div style="text-align:center">
                  <el-checkbox v-model="scope.row.canDelete"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="修改权限"
              min-width="70"
              >
              <template slot-scope="scope" >
                <div style="text-align:center">
                  <el-checkbox v-model="scope.row.canUpdate"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="查询权限"
              min-width="70"
              >
              <template slot-scope="scope" >
                <div style="text-align:center">
                  <el-checkbox v-model="scope.row.canSelect"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="createUser"
              show-overflow-tooltip
              label="创建人"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="createDate"
              show-overflow-tooltip
              label="创建时间"
              width="144"
              >
            </el-table-column>
            <el-table-column
              prop="modUser"
              show-overflow-tooltip
              label="修改人"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="modDate"
              show-overflow-tooltip
              label="修改时间"
              width="144"
              >
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
import {saveGroupModularConfig,getUserGroupModularConfig} from '../../../service/service.js'
export default{
  name:'menuConfig',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      listArray:[]
    }
  },
  mounted(){
    this.getUserGroupModularConfig();
  },
  methods: {
    getUserGroupModularConfig(){
      let id = this.$route.params.id; 
      getUserGroupModularConfig(id).then(res=>{
        if (res.data&&res.data.rows){
          this.listArray = res.data.rows;
        }
      }).catch((error)=>{
      })
    },
    save(){
      let id = this.$route.params.id;
      let resultArr = this.listArray.filter(item=>{
        return (item.canDelete || item.canInsert || item.canSelect || item.canUpdate)
      }).map(item=>{
        item.modularDef=undefined
        return item;})
      console.log(resultArr)
      this.$refs.ecoLoadingRef.open();
      saveGroupModularConfig(id,resultArr).then((res)=>{
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
