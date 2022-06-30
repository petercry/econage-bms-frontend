<template>
    <div>
      <div class="kn-header" >
        <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
        <div>
          分级管控-部门授权
          <ecoActionBtn :ecoActionBtnFunc="save">
            <i slot="icon" class="el-icon-circle-check-outline"/>
            保存
          </ecoActionBtn>
        </div>
      </div>
      <eco-content top="30px" height="40px" style="overflow-y:hidden;">
        <el-tabs class="centerTab themeStrong" v-model="tabName">
          <el-tab-pane label="授权查看" name="watch" ></el-tab-pane>
          <el-tab-pane label="授权管理" name="manage" ></el-tab-pane>
        </el-tabs>
      </eco-content>
      <ecoContent top="70px" bottom="0">
        <div class="mainContent">
          <div class="dept_user_box">
            <div class="dept_user_item" v-for="(item, index) in itemList" :key="index">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="display-input oneTag" @click="openOrgChooser(item,'Dept')">
                    <el-tag
                      v-if="item.Dept"
                      closable
                      type="info"
                      @close="close(item,'Dept')">
                      <div class="ellipsis" :title="item.Dept&&item.Dept.orgPath">{{item.Dept&&item.Dept.orgPath}}</div>
                    </el-tag>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="display-input oneTag" @click="openOrgChooser(item,'User')">
                    <el-tag
                      v-if="item.User"
                      closable
                      type="info"
                      @close="close(item,'User')">
                      <div class="ellipsis" :title="item.User&&item.User.orgPath">{{item.User&&item.User.orgPath}}</div>
                    </el-tag>
                  </div>
                </el-col>
              </el-row>
              <i class="icon el-icon-circle-close-outline" @click="del(index)"></i>
            </div>
          </div>
          <div class="dept_user_add" @click="add">
            <i class="el-icon-plus"/> 添加
          </div>
          <div class="dept_user_add" style="margin-top:10px;" v-if="itemList.length>0" @click="itemList = []">
            <i class="el-icon-minus"/> 清空
          </div>
        </div>
      </ecoContent>
    </div>
</template>
<script>
import ecoActionBtn from '../../views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import {getDeptWatcher,editDeptWatcher} from '../../service/service.js'
import {mapMutations} from 'vuex'
export default{
  name:'dept',
  components:{
    ecoActionBtn,
    ecoLoading,
    ecoContent
  },
  data(){
    return {
      tabName:'watch',
      hackReset:true,
      itemList:[]
    }
  },
  mounted(){
    this.getDeptWatcher();
  },
  methods: {
      getDeptWatcher(){
        getDeptWatcher().then(res=>{
          if (res.data&&res.data.rows){
            this.itemList = res.data.rows.map(item=>{
              let userDept;
              if (item.userDetail.departments&&item.userDetail.departments.length>0){
                userDept = item.userDetail.departments[0].orgPathI18nText;
                if (userDept) userDept+='-'
              }
              item.User={orgPath:userDept+item.userDetail.mi};
              if (item.deptDetail){
                item.Dept={orgPath:item.deptDetail.orgPathI18nText};
              }else{
                item.Dept=null;
              }
              return item;
            })
          }
          console.log(res)
        }).catch(e=>{})
      },
      openOrgChooser(item,selectType){
        var that  = this;
        let options = {
            title:selectType=='User'?'选择人员':'选择部门',
            selectMulti:false,
            selectType:selectType,
            // selectType:'User-Dept-userGroup-Role',
            selectObj:item[selectType],
            deptScopeType:'MANAGE',
        }
        let callBack = function(callObj){
          if (selectType=='Dept'){
            item[selectType] = callObj;
            item.deptId = callObj.linkId;
          }
          if (selectType=='User'){
            item[selectType] = callObj;
            item.userId = callObj.linkId;
          }
            that.$forceUpdate();
          }
        EcoOrgPick.searchReceiver(options,callBack);
      },
      close(item,selectType){
        if (selectType=='Dept'){
          item[selectType] = null;
          item.deptId = null;
        }
        if (selectType=='User'){
          item[selectType] = null;
          item.userId = null;
        }
      },
      add(){
        this.itemList.push({
          deptId:null ,
          userId: null,
          Dept:null,
          User:null
        })
      },
      del(index){
        this.itemList.splice(index,1);
      },
      save(){
        let arr = this.itemList.map(item=>{
          return {
            deptId:item.deptId,
            userId:item.userId,
          }
        })
        editDeptWatcher(arr).then(res=>{
          this.$message.success('保存成功！')
        }).catch(e=>{
          this.$message.error('保存失败！')
        })
      },
      reload(){
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
      }
  },
  watch: {
    'tabName'(val){
      if (val=='manage'){
        this.$router.push({name:'deptManager'});
      }
    }
  }
}
</script>
<style scoped>
.mainContent{
  width: 1080px;
  margin: 0 auto;
  padding: 20px;
}
.dept_user_item{
  position: relative;
  margin-bottom: 12px;
}
.dept_user_item .icon{
  position: absolute;
  right: -32px;
  font-size: 22px;
  top: 7px;
  color: #1b5293;
  cursor: pointer;
}
.oneTag{
  padding: 6px;
  line-height: 0;
}
.oneTag .el-tag{
  position: relative;
  display: inline-block;
  max-width: 516px;
  padding-right: 25px;
}
.dept_user_add{
  height: 30px;
  line-height: 30px;
  width: 100%;
  text-align: center;
  color: #1b5293;
  border: 1px dashed #ccc;
  cursor: pointer;
}
</style>
<style>
.oneTag .el-tag .el-icon-close{
  position: absolute;
  right: 2px;
  top: 2px;
}
.centerTab .el-tabs__nav{
  margin-left: 50%;
  right: 55px;
}
</style>