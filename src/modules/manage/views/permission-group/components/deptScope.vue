<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:10px;">
        <span style="line-height:26px;color:#999;font-size:12px;">部门范围（业务）</span>
        <el-button type="primary" @click.native="save" style="float: right;">保存<i class="el-icon-check el-icon--right"></i></el-button>
        <div class="display-input" style="margin-top:12px;min-height: 98px;" @click="openOrgChooser('businessList')">
          <el-tag
            v-for="(item, index) in businessList" 
            :key="index"
            closable
            type="info"
            @close="close('businessList',index)">
            {{item.orgPath}}
          </el-tag>
        </div>
        <span style="line-height:32px;color:#999;font-size:12px;">部门范围（管理）</span>
        <div class="display-input" style="min-height: 98px;" @click="openOrgChooser('manageList')">
          <el-tag
            v-for="(item, index) in manageList" 
            :key="index"
            closable
            type="info"
            @close="close('manageList',index)">
            {{item.orgPath}}
          </el-tag>
        </div>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {getPermissionDeptScopeConfig,savePermissionDeptScope} from '@/modules/manage/service/service.js'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
export default{
  name:'deptScope',
  components:{
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      businessList:[],
      manageList:[],
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
      that.businessList = [];
      that.manageList = [];
      getPermissionDeptScopeConfig(id).then((response)=>{
        console.log(response)
        that.content = response.data.map((item =>{
          if (!item.orgId){
            item.orgId = item.deptId
          }
          return item;
        }));
        if (response.data&&Object.prototype.toString.call(response.data) === '[object Array]'){
          EcoOrgPick.loadByArr(that.content,'Dept',()=>{
            that.$forceUpdate();
            for (let i = 0; i < that.content.length; i++) {
              const element = that.content[i];
              element.linkId = element.deptId||element.orgId;
              element.role = null;
              if (element.type =='BUSINESS'){
                that.businessList.push(element);
              }
              if (element.type == 'MANAGE'){
                that.manageList.push(element);
              }
            }
          });
        }
        
      }).catch((error)=>{
      });
    },
    openOrgChooser(listName){
      var that  = this;
      let options = {
          title:'选择组织',
          selectMulti:true,
          selectType:'Dept',
          selectObj:that[listName],
          deptScopeType:listName=='businessList'?'BUSINESS':'MANAGE',
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
      let resultArr = this.businessList.map((item)=>{
        item.type = 'BUSINESS';
        item.deptId = item.orgId;
        return item;
      })
      this.manageList.map((item)=>{
        item.type = 'MANAGE';
        item.deptId = item.orgId;
        resultArr.push(item)
        return item;
      })
      console.log(resultArr)
      savePermissionDeptScope(id,resultArr).then((res)=>{
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
