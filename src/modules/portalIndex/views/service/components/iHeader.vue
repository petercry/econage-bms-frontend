<template>
  <div class="iHeader clearfix">
    <span class="fl cpoint" @click="toIndex"></span>
    <span class="fr cpoint" @click="toManageSys" v-if="userRole['portal_link_item_manage']">事项管理后台</span>
    <span class="fr cpoint" style="margin-right:28px;" @click="toAF">
      <el-badge :value="todoNum" :hidden="todoNum==0" :max="99" class="afBadgeItem">
        事项审批
      </el-badge>
    </span>
    <div class="iHeader-center">
      <el-select
        class="headSearch"
        v-model="searchItemText"
        filterable
        remote
        reserve-keyword
        placeholder="请输入事项关键字"
        :remote-method="getItemAjax"
        :loading="loading">
        <template  v-for="group in options">
          <div :key ="group.id">
            <el-option
              v-for="item in group.items"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @click.native="goGuidePage(item)">
            </el-option>
          </div>
        </template>
      </el-select>
    </div>
  </div>
</template>
<script>
  import {mapMutations,mapState} from 'vuex'
  import {getGroupItemSelectViewList,getOauth2Url,getTodoAssigneeList} from '@/modules/portalIndex/service/service.js'
  export default{
      name:'iHeader',
      computed: {
      },
      data() {
        return {
          todoNum:0,
          searchItemText:'',
          options:[],
          loading:false,
        }
      },
      created(){
        this.getTodoAssigneeList();
      },
      computed: {
        ...mapState(['userRole'])
      },
      mounted(){
      },
      methods: {
        ...mapMutations(['SET_BREAD']),
        toIndex(){
          this.$router.push({
            name:'serviceList'
          })
        },
        toManageSys(){
          location.href="/#/nonePage"
        },
        toAF(){
          getOauth2Url('1200976635890610177').then(res=>{//'AF'
            if (res.data){
              window.open(res.data)
            }
          }).catch(e=>{})
        },
        goGuidePage(item){
          this.SET_BREAD([{
            label:'首页',
            to:{
              name:'serviceList'
            }
          },{
            label:'事项详情',
            to:{name:'guidePage',params:{id:item.id}}
          }])
          this.$router.push({
            name:'guidePage',
            params:{
              id:item.id
            }
          })
        },
        getItemAjax(query) {
          if (query !== '') {
            this.loading = true;
            getGroupItemSelectViewList({page:1,rows:9999, name:query}).then(res=>{
              this.loading = false;
              console.log(res);
              this.options = res.data.rows;
            }).catch(e=>{
              this.loading = false;
            })
            // setTimeout(() => {
            //   this.loading = false;
            //   this.options = this.list.filter(item => {
            //     return item.label.toLowerCase()
            //       .indexOf(query.toLowerCase()) > -1;
            //   });
            // }, 200);
          } else {
            this.options = [];
          }
        },
        getTodoAssigneeList(){
          getTodoAssigneeList('DOING').then(res=>{
            this.todoNum = res.data.total;
          }).catch(e=>{})
        },
      },
      watch:{
      
      }
  }
</script>
<style scoped>
.afBadgeItem{
  display: block;
}
</style>
<style>
.iHeader{
  position: relative;
  min-width: 1180px;
  padding: 0 20px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #2F87F3;
  color: #fff;
  box-sizing: border-box;
}
.iHeader-center{
  position: absolute;
  width: 200px;
  left: 0;
  right: 0;
  top: 0;
  height: 60px;
  margin: 0 auto;
}
.headSearch input{
  background-color: #2E7AE1;
  border-color: #2E7AE1;
  color: #fff;
  border-radius: 14px;
}
.headSearch .el-input__inner:hover{
  border-color: #2E7AE1;
}
.headSearch .el-input__icon:before {
    content: "\E619";
}
.headSearch.el-select .el-input .el-input__icon{
  transform:none;
}
.afBadgeItem .el-badge__content.is-fixed{
  top: 16px;
}
</style>
