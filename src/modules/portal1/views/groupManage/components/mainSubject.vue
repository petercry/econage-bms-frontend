<template>
  <el-card v-show="baseData" style="position:relative">
    <div slot="header" class="clearfix">
      <span>{{baseData&&baseData.name}}&nbsp;&nbsp;&nbsp;({{length}})</span>
      <el-button style="float: right; padding: 3px 5px" type="text" @click.native="sort"><i class="el-icon-sort"></i>主项排序</el-button>
      <el-button v-if="userRole['portal1-item-group_create']" style="float: right; padding: 3px 5px" type="text" @click.native="add"><i class="el-icon-plus"></i>添加主项</el-button>
    </div>
    <ecoContent class="groupList" top="78px" bottom="0" style="padding:0 24px;">
      <el-table
        :header-cell-style="{backgroundColor:'#E9EAEF'}"
        :data="tableData"
        height="100%"
        style="width: 100%;">
        <el-table-column
          label="名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="操作"
          width="88"
          >
        <template slot-scope="scope">
          <div>
            <el-button type="text" v-if="userRole['portal1-item-group_mod']" @click.native.stop="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="userRole['portal1-item-group_delete']" style="color:#E37087;" @click.native.stop="del(scope.row)">删除</el-button>
          </div>
        </template>
        </el-table-column>
      </el-table>
    </ecoContent>
  </el-card>
</template>
<script>
import {getGroupByTitle,delGroup} from '@/modules/portal1/service/service.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {mapMutations,mapState} from 'vuex'
  export default{
      name:'mainSubject',
      components:{
        ecoContent
      },
      data() {
        return {
          baseData:null,
          length:0,
          tableData: []
        }
      },
      mounted(){
      },
      computed: {
        ...mapState(['userRole'])
      },
      methods: {
        getBase(item){
          this.baseData = item;
          this.length = 0;
          this.tableData = [];
          this.getList();
        },
        getList(){
          getGroupByTitle(this.baseData.id).then(res=>{
            if (res.data){
              this.tableData = res.data;
              this.length = res.data.length;
            }
          }).catch(e=>{})
        },
        add(){
          // this.$router.push({
          //   name:'groupAdd',
          //   params:{
          //     theme:this.baseData.id
          //   }
          // })
          // return ;
          window.parent.sysvm.openDialog('添加主项',
          '/portal1/index.html#/groupAdd/'+this.baseData.id,700,450);
        },
        sort(){
          // this.$router.push({
          //   name:'groupSort',
          //   params:{
          //     theme:this.baseData.id
          //   }
          // })
          // return ;
          window.parent.sysvm.openDialog('主项排序',
          '/portal1/index.html#/groupSort/'+this.baseData.id,700,450);
        },
        del(item){
          parent.window.sysvm.$confirm('是否确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delGroup(item.id).then(res=>{
              this.getList();
            }).catch(e=>{})
          }).catch(() => {});
        },
        edit(item){
          // this.$router.push({
          //   name:'groupEdit',
          //   params:{
          //     id:item.id
          //   }
          // })
          // return ;
          window.parent.sysvm.openDialog('主项编辑',
          '/portal1/index.html#/groupEdit/'+item.id,700,450);
        }
      }
  }
</script>
<style scoped>
.groupList .item{
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid #EBEEF5;
  font-size: 14px;
  position: relative;
  padding-right: 70px;
}
.groupList .operate{

}
</style>
