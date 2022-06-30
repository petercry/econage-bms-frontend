<template>
    <eco-content top="0px" bottom="0px" class="roleMemberSortVue"  v-loading="loading">
        <eco-content top="0px" height="35px" type="tool" style="background-color:#fff">
                      <el-row class="toolbar" style="padding:0px 10px;line-height:35px;height:35px;">
                          <el-col :span="12" >
                                <eco-tool-title style="line-height: 34px;" :title=" params.roleName+' ('+dataList.length+')'"></eco-tool-title>
                          </el-col>
                          <el-col :span="12" class="tlr">
                                <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click="addMember">&nbsp;添加人员</el-button>
                                <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click="updateRoleMemberFunc">&nbsp;保存排序</el-button>
                          </el-col>
                      </el-row>
        </eco-content>
        <eco-content  top="35px" bottom="0px" ref="content" id="roleMemberContent">
                <div v-if="dataList.length == 0" class="noData">
                    <span >暂无数据</span>
                </div>

                <div v-else>
                    <el-row class="seqRowHead" >
                            <el-col :span="3">序号</el-col>
                            <el-col :span="params.roleType == 'GLOBAL'?18:4" >人员</el-col>
                            <el-col :span="14" v-if="params.roleType != 'GLOBAL'">角色范围</el-col>
                            <el-col :span="3">&nbsp;</el-col>
                    </el-row>

                    <draggable v-model="dataList" tag="div"   v-bind="dragOptions" >
                            <el-row v-for="(item,idx) in dataList" :key="idx" class="dataRow dragTr" style="width:100%">
                                <el-col :span="3">{{idx+1}}</el-col>
                                <el-col :span="params.roleType == 'GLOBAL'?18:4">
                                    <span class="title">{{item.userMi}}&nbsp;</span>
                                </el-col>
                                <el-col :span="14" v-if="params.roleType != 'GLOBAL'">
                                    <span class="title">{{item.roleScope == "-1"?'全局角色':item.roleScopePathI18n}}&nbsp;</span>
                                </el-col>
                                <el-col :span="3" style="" class="moveCol">
                                    <i class="del" @click="delFunc(idx)">删除</i>
                                    <i class="icon iconfont iconpaixu1" ></i>
                                </el-col>
                            </el-row>
                    </draggable>

                </div>
                
        </eco-content>

    </eco-content>
</template>

<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoUtil from '@/components/util/main.js'
import {getRoleMember,updateRoleMember} from '../../service/service.js'
import draggable from "@/components/util/vuedraggable";
import { Loading } from 'element-ui';
import {sysEnv} from '../../config/env.js'

export default {
  name:'roleMember',
  components:{
        ecoToolTitle,
        ecoContent,
        draggable,
  },
  props: {
 
  },
  data() {
    return {
        params:{
            roleCode:null,
            roleType:null,
            roleName:null,
            rows:99999,
            page:1
        },
        parentId:0,
        orgTypeArray:[],
        dataList:[],
        dragOptions:{
              animation: 150,
              group: "module",
              ghostClass: "ghost", 
              draggable:'.dragTr',
              handle:'.dragTr',
              scroll:true,
              forceFallback:true, 
        },
        dragging: false,
        loading:true
    };
  },
  mounted(){
    
  },
  created(){
      window.ecoMemberVm = this; //添加监听
      this.addMonitor(); //添加监听
      this.init();
  },
  computed:{
  
  },
  methods:{
    
    addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'roleMemberAddCallBack')){ //回调的唯一标识符
                    window.ecoMemberVm.getRoleMemberFunc('roleMemberAddCallBack');
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'ecoMemberVm');
    },
      
    init(){
        this.params.roleCode = this.$route.params.roleCode;
        this.params.roleType = this.$route.params.roleType;
        this.params.roleName = decodeURIComponent(this.$route.params.roleName);
        this.getRoleMemberFunc();
    },

    getRoleMemberFunc(action){
        getRoleMember(this.params).then((response)=>{
            this.dataList = response.data;
            this.loading = false;
            let $content = this.$refs.content.$el;
            let _scrollHeight = $content.scrollHeight;

            if(action == 'roleMemberAddCallBack'){
                setTimeout(function(){
                    document.getElementById("roleMemberContent").scrollTop = document.getElementById("roleMemberContent").scrollHeight;
                },300);
            }
        })
    },

    addMember(){
        if(sysEnv == 1){
            let url = '/hr/index.html#/roleMemberAdd/'+this.params.roleCode+'/'+ this.params.roleType +'/'+encodeURIComponent(this.params.roleName);
            EcoUtil.getSysvm().openDialog('添加角色人员绑定',url,600,400,'12vh');
        }else{
            this.$router.push({name:'roleMemberAdd',params:{roleCode:this.params.roleCode,roleType:this.params.roleType,roleName:encodeURIComponent(this.params.roleName)}});
        }
    },

    delFunc(index){
        this.dataList.splice(index,1);
        this.updateRoleMemberFunc();
    },

    updateRoleMemberFunc(){
        updateRoleMember(this.params.roleCode, this.dataList).then((response)=>{
              this.$message({type: 'success', message: '保存成功!'});
        }).catch((error)=>{
                this.$message({type: 'error', message: '保存失败!'});
        });
    }
  },
  destroyed(){
    
  },
  watch: {
     
   }
};

</script>

<style scoped>


.roleMemberSortVue{
    padding:0px 0px;
}

.roleMemberSortVue .noData{
    font-size: 14px;
    margin-top:10px;
    text-align: center;
}

.roleMemberSortVue .seqRowHead{
    line-height: 48px;
    height: 48px;
    background-color: #fff;
    color: #595959;
    font-size: 14px;
}

.roleMemberSortVue .dataRow{
    padding:5px;
    background-color: rgb(231,232,236);
    margin:0px 0px 10px 0px;
    font-size: 14px;
}

.roleMemberSortVue .dataRow .title{
    color:#0e152ccc
}

.roleMemberSortVue .moveCol{
    text-align:right;
    color:#194ce6;
}

.roleMemberSortVue .moveCol .del{
    color:#f56c6c;
    margin-right:5px;
    cursor: pointer;
}


.roleMemberSortVue .dragTr{
    cursor:move;
}

.roleMemberSortVue .sortable-drag {
    background-color: #fff;
}
</style>
