<template>
  <el-card style="position:relative">
    <div slot="header" class="clearfix">
      <span>事项主题</span>
      <el-button style="float: right; padding: 3px 5px" type="text" @click.native="sort"><i class="el-icon-sort"></i>主题排序</el-button>
      <el-button v-if="userRole['portal1-title_create']" style="float: right; padding: 3px 5px" type="text" @click.native="add"><i class="el-icon-plus"></i>添加主题</el-button>
    </div>
    <ecoContent class="themeList" top="58px" bottom="0" style="padding:0 24px;">
      <el-table
        :data="tableData"
        :show-header="false"
        @row-click="rowClick"
        style="width: 100%">
        <el-table-column
          prop="name">
        </el-table-column>
        <el-table-column
          width="88"
          >
        <template slot-scope="scope">
          <div>
            <el-button v-if="userRole['portal1-title_mod']" type="text" @click.native.stop="edit(scope.row)">编辑</el-button>
            <el-button v-if="userRole['portal1-title_delete']" type="text" style="color:#E37087;" @click.native.stop="del(scope.row)">删除</el-button>
          </div>
        </template>
        </el-table-column>
      </el-table>
    </ecoContent>
  </el-card>
</template>
<script>
  import {getTitleAll,delTitle} from '@/modules/portal1/service/service.js'
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {mapMutations,mapState} from 'vuex'
  export default{
      name:'mainSubject',
      components:{
        ecoContent
      },
      data() {
        return {
          tableData: []
        }
      },
      mounted(){
        this.getList();
      },
      computed: {
        ...mapState(['userRole'])
      },
      methods: {
        getList(){
          getTitleAll().then(res=>{
            if (res.data&&res.data.rows){
              this.tableData = res.data.rows;
              if (res.data.rows&&res.data.rows.length>0){
                let $page = this.$parent.$parent.$parent;
                let $mainSubject = $page.$refs.mainSubject;
                $mainSubject.getBase(res.data.rows[0]);
              }
            }
          }).catch(e=>{})
        },
        add(){
          // this.$router.push({
          //   name:'themeAdd'
          // })
          // return ;
          window.parent.sysvm.openDialog('添加主题',
          '/portal1/index.html#/themeAdd',700,450);
        },
        sort(){
          // this.$router.push({
          //   name:'themeSort'
          // })
          // return ;
          window.parent.sysvm.openDialog('主题排序',
          '/portal1/index.html#/themeSort',700,450);
        },
        rowClick(row, column, event){
          let $page = this.$parent.$parent.$parent;
          let $mainSubject = $page.$refs.mainSubject;
          $mainSubject.getBase(row);
        },
        del(item){
          parent.window.sysvm.$confirm('是否确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delTitle(item.id).then(res=>{
              this.getList();
            }).catch(e=>{})
          }).catch(() => {});
        },
        edit(item){
          // this.$router.push({
          //   name:'themeEdit',
          //   params:{
          //     id:item.id
          //   }
          // })
          // return ;
          window.parent.sysvm.openDialog('主题编辑',
          '/portal1/index.html#/themeEdit/'+item.id,700,450);
        }
      }
  }
</script>
<style scoped>
.themeList .item{
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid #EBEEF5;
  font-size: 14px;
  position: relative;
  padding-right: 70px;
}
.themeList .operate{

}
</style>
