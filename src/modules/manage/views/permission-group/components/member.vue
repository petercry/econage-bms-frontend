<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:10px;">
        <span style="line-height:26px;color:#999;font-size:12px;">选择成员</span>
        
        <el-button type="primary" @click.native="save" style="float: right;">保存<i class="el-icon-check el-icon--right"></i></el-button>
        
          <div class="display-input" style="margin-top:12px;min-height: 98px;" @click="openOrgChooser">
              <el-tag
                v-for="(item, index) in content" 
                :key="index"
                closable
                type="info"
                @close="close(index)">
                {{item.orgPath}}<span v-if="item.role">({{item.roleName}})</span>
              </el-tag>
          </div>

        </ecoContent>

    </div>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getPermissionGroupMemberConfig,savePermissionGroupMember} from '@/modules/manage/service/service.js'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
export default{
  name:'permissionMember',
  components:{
    ecoLoading,
    ecoContent,
   
  },
  data(){
    return {
      content:[]
    }
  },
  mounted(){
      this.getData();
  },
  methods: {
    close(index){
        this.content.splice(index,1);
        this.$forceUpdate();
    },

    getData(){
        var that = this;
        let id = this.$route.params.id; 
        getPermissionGroupMemberConfig(id).then((response)=>{
            that.content = response.data;
            EcoOrgPick.loadByArr(that.content,'User-Dept-userGroup-Role',()=>{
                that.$forceUpdate();
            });
        }).catch((error)=>{});
    },

    openOrgChooser(){
        var that  = this;
        let options = {
            title:'选择人员',
            selectMulti:true,
            // selectType:'User-userGroup',
            selectType:'User-Dept-userGroup-Role',
            selectObj:that.content,
            deptScopeType:'MANAGE',
        }
        let callBack = function(callObj){
          that.content = callObj;
          that.$forceUpdate();
        }
        EcoOrgPick.searchReceiver(options,callBack);
    },
    save(){
      let id = this.$route.params.id; 
      this.$refs.ecoLoadingRef.open();
      savePermissionGroupMember(id,this.content).then((res)=>{
          this.$message({type: 'success',message: '保存成功！'});
          this.$refs.ecoLoadingRef.close();
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
