<template>
  <div class="portal">
    <div class="m-header">
      <span class="m-header-tip"></span>
      <span class="m-title">工时报表查看</span>
    </div>
    <div class="mainBody" style="padding:20px;">
      <!-- <ul>
        <li class="item pointerClass" v-for="(item,index) in itemList" :key="index">
          <span>{{item.label}}</span>
          <span><i class=""></i></span>
          <ul class="childList">
             <li class="child" v-for="(child,index) in item.children" :key="index">
              <span @click="goDetail(item)">{{child}}</span>
             </li>
          </ul>
        </li>
      </ul> -->
      <el-collapse v-model="activeNames">
        <el-collapse-item class="item" v-for="(item,index) in itemList" :key="index" :title="item.label" :name="item.name">
          <ul class="childList" v-if="index <= 1">
             <li class="child pointerClass" v-for="(child,index) in roles" :key="index">
              <span @click="goDetail(item,child.id)">{{child.name}}</span>
             </li>
          </ul>
          <ul class="childList" v-else>
             <li class="child pointerClass" v-for="(child,index) in item.children" :key="index">
              <span @click="goDetail(item,child.id)">{{child.name}}</span>
             </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import {getRoleByUser} from '../../../api/workHours.js'
  export default{
      name:'forView',
      data(){
        return {

          itemList:[
            {
              name:"workHour-forView-user",
              label:"项目成员工时报表",

            },
            {
              name:"workHour-forView-user-fixed",
              label:"项目成员工时报表(换算后)",


            },
            {
              name:"workHour-forView-project",
              label:"项目工时报表",
              children:[ {
                      name: '财经代表',
                      id:""
                    }]
            }
          ],
          roles:[],
          activeNames:[''],
        }
      },
      created(){
          this.getRoleByUser();
          // this.roles = [
          //   {
          //     name:"普通员工",
          //     id:"user"
          //   },
          //   {
          //     name:"领域代表",
          //     id:"linyu"
          //   },
          //   {
          //     name:"PDT经理+POP",
          //     id:"roles"
          //   },
          //   {
          //     name:"部长",
          //     id:"minister"
          //   }
          // ]
      },
      methods: {
         getRoleByUser(){
            getRoleByUser().then(res => {

              if(res && res.length > 0){
                res.forEach(element => {
                  if(element.sign == 'role_user'){
                    this.roles.push(
                      {
                        name:"普通员工",
                        id:"user"
                      }
                    )
                  }else if(element.sign == 'role_field'){
                    this.roles.push(
                      {
                        name:"领域代表",
                        id:"linyu"
                      }
                    )
                  }else if(element.sign == 'role_pdt'){
                    this.roles.push(
                      {
                        name:"PDT经理+POP",
                        id:"roles"
                      }
                    )
                  }else if(element.sign == 'role_minister'){
                    this.roles.push(
                      {
                        name:"部长",
                        id:"minister"
                      }
                    )
                  }else if(element.sign == 'role_finance'){
                    this.itemList[this.itemList.length - 1].children.push(
                    {
                      name: '财经代表',
                      id:""
                    })
                  }

                });
              }
            });
         },
         goDetail({name},id){
            if(id){
                this.$router.push({name:name,params:{flag:id}});
            }else{
                this.$router.push({name:name});
            }
         }
      },
      watch: {

      }
  }

</script>
<style scoped>
.portal{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
    background: #fff;
}
.mainBody{
  height: calc(100% - 82px);
  overflow: auto;
}
.plainBtn{
  vertical-align: middle;
  border-color: #409EFF;
  color:#409EFF;
  float:right;
  margin-right: 20px;
}
.itemBtn{
  color:#409EFF;
  float: right;
}
.itemBtn i{
  margin-right: 5px;
}
.m-header{
  padding:12px 0 12px 20px;
  /* height: 30px; */
  line-height: 0;
  font-size: 0;
  background-color: #f8f9fb;
}
.m-header span{
  vertical-align: middle;
}
.m-header-tip{
  display: inline-block;
  height: 30px;
  width: 5px;
  margin-right: 12px;
  background-color: #003b90;
}
.m-header .m-title{
  line-height: 30px;
  color: #4a4a4a;
  font-size: 16px;
}
.childList{
  padding-left: 30px;
  font-size: 15px;
}
.childList .child:hover{
  color:#003b90;
}
</style>
