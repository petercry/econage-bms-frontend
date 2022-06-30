<template>
    <div>
      <div style="line-height:26px;color:#999;font-size:12px;">选择角色</div>
      <el-input v-model="searchTxt"></el-input>
      <ul style="height:190px;overflow-y:auto;padding:10px 0;">
        <template v-for="(item, index) in roleList">
          <li style="line-height:20px;cursor:pointer;" :key="index+'1'" v-if="item.name.indexOf(searchTxt)>-1||searchTxt==''" @click="roleClick(item)">{{item.name}}</li>
        </template>
      </ul>
    </div>
</template>
<script>
import {getRoleList} from '../service/service.js'
export default{
  name:'roleSelect',
  components:{
  },
  props:{
    roleClick:{
      type:Function,
      default:function(value){
      
      }
    }
  },
  data(){
    return {
      searchTxt:'',
      roleList:[]
    }
  },
  mounted(){
    this.getRoleListFunc();
  },
  methods: {
      //角色列表
      getRoleListFunc(){
          getRoleList().then((response)=>{
              this.roleList = response.data.rows;
          }).catch((error)=>{
          });
      },
  },
  watch: {
  }
}
</script>
<style>

</style>
