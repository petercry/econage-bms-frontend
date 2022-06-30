<template>
    <div class="projectCard" v-loading="loading">
        <div class="header">
            <span class="info">项目名称:{{projectInfo.name}}</span>
            <span class="info">项目编号:{{projectInfo.code}}</span>
            <span class="info">PDT经理:{{projectInfo.pdtManagerName}}</span>
            <el-button type="text" class="backBtn" size="small" @click="goBack">
                <i class="el-icon-back" style="margin-right:2px"></i> {{isFromTaskList?'返回任务列表':'返回项目列表'}}
            </el-button>
        </div>
        <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
            <el-tab-pane label="项目卡片" name="card">
               <update-project @back="goBack" @callback="callback" ref="projectInfo"></update-project>
            </el-tab-pane>
            <el-tab-pane label="里程碑" name="miles" :lazy="true" v-if="projectRoleMap['faw_pm_model_miles'] && (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <keep-alive>
                    <router-view v-if="activeName == 'miles'" :editable="editable" @callback="callback"></router-view>
                </keep-alive>
            </el-tab-pane>
            <!-- <el-tab-pane label="角色" name="role" :lazy="true">
                <role v-if="activeName == 'role'"></role>
            </el-tab-pane> -->
            <el-tab-pane label="团队" name="group" :lazy="true" v-if="projectRoleMap['faw_pm_model_group'] && (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <group v-if="activeName == 'group'"></group>
            </el-tab-pane>
            <!-- <el-tab-pane label="专业" name="major" :lazy="true">
                <major v-if="activeName == 'major'"></major>
            </el-tab-pane> -->
            <el-tab-pane label="交付物" name="deliver" :lazy="true" v-if="projectRoleMap['faw_pm_model_div'] && (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <deliver-list :editable="editable"></deliver-list>
            </el-tab-pane>
            <el-tab-pane label="人力资源" name="hr" :lazy="true" v-if=" (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <hr-input :editable="editable"></hr-input>
            </el-tab-pane>
            <el-tab-pane label="权限" name="authority" :lazy="true" v-if="projectRoleMap['faw_pm_model_auth'] && (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <authority-list :editable="editable"></authority-list>
            </el-tab-pane>
            <el-tab-pane label="QTMS" name="qtms" v-if="projectRoleMap['faw_pm_model_qtms'] && (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <iframe style="height:100%;width:100%;" src="https://iamuat.fawjiefang.com.cn/oauth2/rest/authz?response_type=code&client_id=qakz5cr8r61gzzqq5sqioga8ulrfi483&domain=IdmDomain&state=xyz&scope=IdmResServer.UserProfile.me%20openid%20email%20phone%20profile&redirect_uri=http://10.60.215.18:8686/jiefang-admin/idm/validation"></iframe>
            </el-tab-pane>
            <el-tab-pane label="问题" name="question" :lazy="true" v-if="projectRoleMap['faw_pm_model_problem'] && (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <!-- <keep-alive> -->
                    <router-view v-if="activeName == 'question'" :editable="editable" @callback="callback"></router-view>
                <!-- </keep-alive> -->
            </el-tab-pane>
            <el-tab-pane label="风险" name="risk" :lazy="true" v-if="projectRoleMap['faw_pm_model_risk'] && (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <!-- <keep-alive> -->
                    <router-view v-if="activeName == 'risk'" :editable="editable" @callback="callback"></router-view>
                <!-- </keep-alive> -->
            </el-tab-pane>
            <el-tab-pane label="任务" name="task" :lazy="true" v-if="projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish'">

                    <router-view v-if="activeName == 'task'" :editable="editable" @callback="callback"></router-view>

            </el-tab-pane>
            <el-tab-pane label="计划" name="plan" :lazy="true" v-if=" (projectInfo.status !== 'faw_pm_status_draft' && projectInfo.status !== 'faw_pm_status_tobepublish')">
                <keep-alive>
                    <router-view v-if="activeName == 'plan'" :editable="editable" @callback="callback"></router-view>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
        <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
          <input type="hidden" name="fileHeaderIds"/>
          <input type="hidden" name="expectedName"/>
        </form>
        <iframe name="docviewIframe" style="display:none"></iframe>
    </div>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import { mapActions, mapGetters,mapMutations } from 'vuex'
  import {sysEnv} from '../../../config/env.js'
  import updateProject from './updateProject.vue'
  import deliverList from '../deliver/list.vue'
  import authorityList from '../authority/list.vue'
  import hrInput from '../hr/hr-input.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import major from '../major/index.vue'
  import group from '../group/index.vue'
  import role from '../role/index.vue'
  import {getPMRole} from '../../../api/common.js'
  export default{
      name:'templatesCard',
      data(){
          return {
              infoId:0,
              activeName:"card",
              editable:true,
              projectRoleMap:{},
              loading:true,
              isFromTaskList:false
          }
      },
      created(){
         window.projectCardVue=this;
         window.isInProjectCard = true;
         window.isFromTaskList = false;
         this.loading = true;
         //this.initProjectBaseData();
         this.infoId = this.$route.params.infoId;
         if(this.$route.name == 'taskInfoInProjectCard'){
             this.activeName = 'task';
             window.isFromTaskList = true;
             this.isFromTaskList = true;
         }
         if(this.$route.name == 'detailProblem'){
             this.activeName = 'question';
         }
         if(this.$route.name == 'detailRisk'){
             this.activeName = 'risk';
         }
         
         if(this.$route.name == 'planGantt'){
             this.activeName = 'plan';
         }
      },
      components:{
          updateProject,
          deliverList,
          authorityList,
          major,
          group,
          role,
          hrInput
      },
      computed:{
          ...mapGetters(['projectInfo']),

      },
      methods: {
          ...mapActions(['initProjectBaseData']),
          ...mapMutations([
            'SET_PROJECT_INFO',
          ]),
          handleClick(tab, event) {
              if(tab.name == "miles"){
                  this.$router.replace({name:'milesInfo'});
              }else if(tab.name == 'question'){
                  this.$router.replace({name:'problem-list',params:{id:this.infoId}});
              }else if(tab.name == 'risk'){
                    this.$router.replace({name:'risk-list',params:{id:this.infoId}});
              }else if(tab.name == 'plan'){
                    this.$router.replace({name:'planGantt'});
              }else if(tab.name == 'task'){
                    this.$router.replace({name:'taskListInProjectCard'});
              }else{
                  this.$router.push({name:'projectCard'});
              }
          },
          goBack(){
              delete window.isInProjectCard;
              delete window.editable;
              this.SET_PROJECT_INFO();
              if(window.isFromTaskList){
                delete window.isFromTaskList;
                this.$router.replace({name:'taskList'});
              }else{
                this.$router.replace({name:'project-list'});
              }

          },
          callback(data){
              if(data.name === 'handleTabClick'){
                  this.activeName = data.activeName;
                  return;
              }
              this.SET_PROJECT_INFO(data);
              getPMRole(data.id).then(res=>{
                  this.projectRoleMap = res;
                  if(!this.projectRoleMap['faw_pm_model_info']){
                      let that = this;
                      let options = {
                        callback(){
                            that.goBack();
                        }
                      }
                      EcoMessageBox.alert('无此项目权限','提示',options);
                  }else{
                      this.loading = false;
                  }
              })
              this.editable = this.projectInfo.status === 'faw_pm_status_draft' || this.projectInfo.status === 'faw_pm_status_tobepublish' || this.projectInfo.status === 'faw_pm_status_executing';
              if(this.editable){
                  this.initProjectBaseData('update-enabled');
              }
              window.editable = this.editable;
          }
      },
      watch: {

      }
  }

</script>
<style>
.projectCard{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.projectCard .el-tabs{
    height: 100%;
}
.projectCard .el-tabs__content{
    height: calc(100% - 101px);
    padding: 0;
    background: #f5f5f5;
}
.projectCard .el-tab-pane{
    height: 100%;
}
.projectCard .backBtn{
    float: right;
    margin-right: 20px;
    font-size: 16px;
    font-weight: 500;

    line-height: 60px;
    padding: 0;
}
.projectCard .header{
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    padding-left:15px;
    border-bottom:1px solid #e8e8e8;
}
.projectCard .header .info{
    font-size: 16px;
    font-weight: 500;
    color:#000;
    margin-right:100px;
}
</style>
