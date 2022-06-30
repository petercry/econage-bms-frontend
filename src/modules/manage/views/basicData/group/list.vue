<template>
    <div>
      <div class="kn-header" >
        <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
        <div>
          枚举列表
        </div>
      </div>
      <ecoContent top="30px" bottom="0">
        <el-table
        :data="listArray"
        style="width: 100%"
        size="mini"
        height="100%"
        highlight-current-row
        @row-dblclick="rowDblclick"
        @header-dragend="changeColWidth"
        border
        >
          <el-table-column
            type="index"
            min-width="40"
            max-width="50"
            >
          </el-table-column>
          <el-table-column
            prop="id"
            show-overflow-tooltip
            label="ID"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="i18nText"
            show-overflow-tooltip
            label="名称"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="i18nKey"
            show-overflow-tooltip
            label="国际化编码"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="order"
            show-overflow-tooltip
            label="序号"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="description"
            show-overflow-tooltip
            label="备注"
            min-width="120"
            >
          </el-table-column>
        </el-table>
      </ecoContent>
      <!-- <div class="kn-main">

      </div> -->
    </div>
</template>
<script>
import ecoActionBtn from '@/modules/menu/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getBasicKvGroupList} from '@/modules/manage/service/service.js'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
export default{
  name:'groupList',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      listArray:[],
      currentRow:null
    }
  },
  mounted(){
    this.getBasicKvGroupListFunc();
  },
  methods: {
    rowDblclick(row, column, event){
      this.$router.push({
        name: 'basicDataDetailList',
        params: {
          group:row.id
        }
      });
    },
    //列表
    getBasicKvGroupListFunc(){
      let id = this.$route.params.categoryId;
      this.$refs.ecoLoadingRef.open();
      getBasicKvGroupList(id).then((response)=>{
          this.listArray = response.data;
          this.$refs.ecoLoadingRef.close();
      }).catch((error)=>{
          this.$refs.ecoLoadingRef.close();
      });
    },
    changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    }
  },
  watch:{
    '$route'(val){
      this.getBasicKvGroupListFunc();
    }
  }
}
</script>
<style>

</style>
