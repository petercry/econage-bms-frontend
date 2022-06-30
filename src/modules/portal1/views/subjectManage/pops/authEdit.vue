<template>
  <div style="background-color:#fff;">
    <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
    <ecoContent top="0" bottom="0" style="padding:10px;">
      <span style="line-height:26px;color:#999;font-size:12px;">事项查看权限</span>
        <div class="display-input" style="margin-top:12px;min-height: 98px;" @click="openOrgChooser('selectList')">
          <el-tag
            v-for="(item, index) in selectList" 
            :key="index"
            closable
            type="info"
            @close="close('selectList',index)">
            {{item.orgPath}}<span v-if="item.role">({{item.roleName}})</span>
          </el-tag>
        </div>
      <span style="line-height:32px;color:#999;font-size:12px;">事项编辑权限</span>
      <div class="display-input" style="min-height: 98px;" @click="openOrgChooser('updateList')">
        <el-tag
          v-for="(item, index) in updateList" 
          :key="index"
          closable
          type="info"
          @close="close('updateList',index)">
            {{item.orgPath}}<span v-if="item.role">({{item.roleName}})</span>
        </el-tag>
      </div>
      <el-button type="primary" @click.native="save" style="margin-top:10px;">保存<i class="el-icon-check el-icon--right"></i></el-button>
    </ecoContent>
  </div>
</template>

<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getItemAuthConfig,saveItemAuthConfig} from '@/modules/portal1/service/service.js'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
export default{
  name:'authEdit',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      selectList:[],
      updateList:[],
      content:[]
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    close(listName,index){
      this[listName].splice(index,1);
      this.$forceUpdate();
    },
    getData(){
      var that = this;
      let id = this.$route.params.id; 
      that.selectList = [];
      that.updateList = [];
      getItemAuthConfig(id).then((response)=>{
        that.content = response.data;
        if (response.data&&Object.prototype.toString.call(response.data) === '[object Array]'){
          EcoOrgPick.loadByArr(that.content,'User-Dept-userGroup-Role',()=>{
            that.$forceUpdate();
          });
          for (let i = 0; i < that.content.length; i++) {
            const element = that.content[i];
            // element.linkId = element.deptId||element.orgId;
            // element.role = null;
            if (element.key =='selectAuth'){
              that.selectList.push(element);
            }
            if (element.key == 'updateAuth'){
              that.updateList.push(element);
            }
          }
        }
        
      }).catch((error)=>{
      });
    },
    openOrgChooser(listName){
      var that  = this;
      let options = {
          title:'选择组织',
          selectMulti:true,
          selectType:'User-Dept-userGroup-Role',
          selectObj:that[listName],
          deptScopeType:'BUSINESS',
      }
      let callBack = function(callObj){
        that[listName] = callObj;
        that.$forceUpdate();
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    save(){
      let id = this.$route.params.id; 
      this.$refs.ecoLoadingRef.open();
      let resultArr = this.selectList.map((item)=>{
        item.key = 'selectAuth';
        return item;
      })
      this.updateList.map((item)=>{
        item.key = 'updateAuth';
        resultArr.push(item)
        return item;
      })
      saveItemAuthConfig(id,resultArr).then((res)=>{
        this.$message({type: 'success',message: '保存成功！'});
        this.$refs.ecoLoadingRef.close();
        let doObj = {}
        doObj.action = 'itemUpdateCallBack';
        doObj.close = true;
        parent.window.sysvm.callBackDialogFunc(doObj);
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