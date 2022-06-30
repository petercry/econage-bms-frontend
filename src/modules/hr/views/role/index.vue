<template>

 <eco-content top="0px" bottom="0px" type="tool" class="roleIndex" style="background-color:#f5f5f5">   
          <div class="content webLayout">
              <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
              <eco-content top="0px"  type="tool" >
                      <el-row class="toolbar" style="padding:0px 10px;line-height:60px;height:60px;">
                          <el-col :span="9" >
                              <eco-tool-title style="line-height: 34px;" :title="'角色定义'+' ('+params.total+') '"></eco-tool-title>
                          </el-col>
                          <el-col :span="6" style="text-align:center;">
                                &nbsp;
                                <div  v-for="item in roleTypeArray" :key="item.id" class="el-tabs__item is-top " v-bind:class="{'is-active':tabActive == item.id}" style="padding:0px;line-height:58px;height:58px;margin:0px 20px;" @click="handleTabClick(item.id)">{{item.name}}</div>
                                &nbsp;
                          </el-col>
                          <el-col :span="9" class="tlr">
                              <el-button  type="primary" :disabled="disStatus" v-if="rsRoleBtnShow"  @click.native="roleSync">角色同步</el-button>

                               <el-input
                                        placeholder="按名称搜索"
                                        v-model="searchParams.name"
                                        style="width:150px;margin-right:10px;line-height:50px" 
                                        @keyup.enter.native="searchFunc"
                                    >
                                      <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                                </el-input>
                              <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="addRole" ><i class="icon iconfont iconpiliang" style="margin-right:10px;font-size: 14px;"></i>&nbsp;添加</el-button>
                          </el-col>
                      </el-row>
              </eco-content>

              <eco-content bottom="42px" top="60px" ref="content" style="padding:10px 15px;">
                    <el-table
                        :data="roleArray"
                        style="width: 100%"
                        size="mini"
                        height="100%"
                        highlight-current-row
                        class="styleTableDefault"
                        stripe
                        ref="multipleTable"
                      >
                      <!-- <el-table-column
                          type="index"
                          width="45"
                          show-overflow-tooltip
                        >
                      </el-table-column> -->

                      <el-table-column
                          prop="code"
                          show-overflow-tooltip
                          label="编号"
                          width="110"
                        >
                      </el-table-column>

                      <el-table-column
                          prop="name"
                          show-overflow-tooltip
                          label="名称"
                        >
                      </el-table-column>

                        <el-table-column
                          prop="branchDept"
                          show-overflow-tooltip
                          label="所属分支机构"
                          width="110"
                          v-if="roleObj.branchDeptEnabled"
                        >
                           <template slot-scope="scope" >
                              <div>
                                 <span>{{scope.row.branchDept?( scope.row.branchDept.i18nText):((scope.row.branchDeptId=='-public')?'跨机构通用':'无') }}</span>
                              </div>
                          </template>

                      </el-table-column>

                      <el-table-column
                          prop="i18nKey"
                          show-overflow-tooltip
                          label="国际化键"
                          width="90"
                        >
                      </el-table-column>

                      <el-table-column
                        prop="i18nText"
                        show-overflow-tooltip
                        label="国际化文本"
                        >
                      </el-table-column>

                      <el-table-column
                         label="类型"
                         width="80"
                      >
                          <template slot-scope="scope" >
                              <div>
                                 <span>{{roleTypeMap[String(scope.row.type)]}}</span>
                              </div>
                          </template>
                      </el-table-column>

                      <el-table-column
                        prop="order"
                        show-overflow-tooltip
                        label="排序"
                        width="50"
                        >
                      </el-table-column>
                      <!-- <el-table-column
                        prop="createUser"
                        show-overflow-tooltip
                        label="创建人"
                        width="80"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="createDate"
                        show-overflow-tooltip
                        label="创建时间"
                        width="170"
                        >
                      </el-table-column> -->
                      <!-- <el-table-column
                        prop="modUser"
                        show-overflow-tooltip
                        label="修改人"
                        width="80"
                        >
                      </el-table-column> -->
                      <el-table-column
                        prop="modDate"
                        show-overflow-tooltip
                        label="修改时间"
                        width="150"
                        >
                        <template slot-scope="scope" >
                               {{ scope.row.modDate?scope.row.modDate.substring(0,16):''}}
                          </template>
                      </el-table-column>

                       <el-table-column
                         label="操作"
                         width="150"
                      >
                            <template slot-scope="scope" >
                                <div>
                                    <span class="pointerClass"  style="color:#409EFF;" @click="editRole(scope.row)">编辑</span> 
                                    <span class="split"></span>
                                    <span class="pointerClass"  style="color:#409EFF;" @click="memberRole(scope.row)" >数据详情</span> 
                                </div>
                            </template>
                       </el-table-column>
                    </el-table>
              </eco-Content>

               <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
                    <el-row >
                        <el-col :span="24" style="text-align:right">
                                <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="params.page"
                                    :page-sizes="[10,30,50,100]"
                                    :page-size="params.rows"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="params.total" style="margin-right:20px">
                                </el-pagination>
                        </el-col>
                    </el-row>
                </eco-content>
          </div>
  
    </eco-content>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../config/env.js'
import {getRoleListByPage,deleteRole,getRoleTypeEnum,getRoleSync} from '@/modules/hr/service/service.js'
import EcoUtil from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'


export default{
  name:'role',
  components:{
  
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
        roleArray:[],
        roleTypeArray:[],
        roleTypeMap:{},
        tabActive:'ORG',
        roleObj:{
            branchDeptEnabled:false
        },
        params:{
            page:1,
            rows:30,
            total:0,
            sort:'code',
            order:'desc',
            name:null
        },
        searchParams:{
            name:null,
        },
        rsRoleBtnShow:true, 
        disStatus:false
    }
  },
  created() {
      if(window.hrSetting && window.hrSetting.rsRoleBtnShow) {
          this.rsRoleBtnShow = window.hrSetting.rsRoleBtnShow
      }
  },
  mounted(){
      window.ecoFrameVm = this; //添加监听
      this.addMonitor(); //添加监听
      this.getRoleListFunc();
      this.getRoleTypeEnumFunc();
      try {
          this.roleObj = EcoUtil.getSysvm().getEcoSettingObj() || {};
      } catch (error) {
          this.roleObj = {branchDeptEnabled:false };
      }
  },
  methods: {
      roleSync() {
        //   关闭
          this.disStatus = true
            if(this.disStatus) { 
                this.$message({
                      duration:6000,
                      showClose:true,
                     message:'角色同步中，请稍等！'})
            }
          getRoleSync().then(res => {
              console.log(res);
              if(res.data) {
                  this.$message({
                        type: 'success',
                        showClose: true,
                        duration:0,
                        message: '总条数：' + res.data.totalCount + '  ' +
                                '成功条数：' + res.data.successCount  + '  ' +
                                '失败条数：' + res.data.errorCount
                        })
                    }
                    // 开启
                this.disStatus = false
          }).catch(error => {
              if(error) {
                 this.$message({
                     type:'error',
                     duration:0,
                     showClose: true,
                     message: error.message
                    })
              }
            //   开启
                this.disStatus = false
          })
      },
        addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'roleAddCallBack')){ //回调的唯一标识符
                    window.ecoFrameVm.getRoleListFunc();
                }else if(obj && (obj.action =='roleEditCallBack')){
                    window.ecoFrameVm.getRoleListFunc();
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
        },

        addRole(){
            if(sysEnv == 1){
                let url = '/hr/index.html#/roleAdd/'+this.tabActive;
                EcoUtil.getSysvm().openDialog('角色添加',url,600,400,'12vh');
            }else{
                this.$router.push({name:'roleAdd',params:{type:this.tabActive}});
            }
        },

        editRole(item){
            if(sysEnv == 1){
                let url = '/hr/index.html#/roleEdit/'+item.code;
                EcoUtil.getSysvm().openDialog('角色编辑',url,600,400,'12vh');
            }else{
                this.$router.push({name:'roleEdit',params:{code:item.code}});
            }
        },

 
        delRole(item){
            let _that  = this;
            let confirmYesFunc = function(){
                deleteRole(item.code).then((response)=>{
                    _that.$message({type: 'success', message: '删除成功!'});
                    _that.getRoleListFunc();
                }).catch((error)=>{
                    _that.$message({type: 'error', message: '删除失败!'});
                });
            }

            let options = {
                type: 'warning',
                lockScroll:false
            }

            EcoMessageBox.confirm('删除角色定义，会连带删除已经配置的关联角色信息，是否删除角色定义？','提示',options,confirmYesFunc);
        },

        memberRole(item){
            
            if(sysEnv == 1){
                let url = '/hr/index.html#/roleMember/'+item.code+'/'+item.type+'/'+item.name;
                EcoUtil.getSysvm().openDialog('数据详情',url,900,500,'12vh');
            }else{
                this.$router.push({name:'roleMember',params:{roleCode:item.code,roleType:item.type,roleName:encodeURIComponent(item.name)}});
            }
            
        },

        //列表
        getRoleListFunc(){
                this.$refs.ecoLoadingRef.open();
                let _data = EcoUtil.objDeepCopy(this.params);
                _data.type = this.tabActive;
                getRoleListByPage(_data).then((response)=>{
                        this.roleArray = response.data.rows;
                        this.params.total = response.data.total;
                        this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                        this.$refs.ecoLoadingRef.close();
                });
        },

     
        getRoleTypeEnumFunc(){
            getRoleTypeEnum().then((response)=>{
                let _roleTypeObj = response.data;
                for(let key in _roleTypeObj){
                    this.roleTypeArray.push({id:key,name:_roleTypeObj[key]});
                    this.roleTypeMap[String(key)] = _roleTypeObj[key];
                }
            })
        },

        searchFunc(){
              this.params.page = 1;
              this.params.name = this.searchParams.name;
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.getRoleListFunc();
        },

        handleTabClick(tab){
            this.tabActive = tab;
            this.params.page = 1;
            this.params.name = null;
            this.searchParams.name = null;
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.getRoleListFunc();
        },

        //每页条数
        handleSizeChange(val) {
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.params.rows = val;
              this.params.page = 1;
              this.getRoleListFunc();
        },

        //跳转页码
        handleCurrentChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.params.page = val;
            this.getRoleListFunc();
        },

  },
  watch: {

  }
}
</script>
<style scope>


.roleIndex .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.roleIndex .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.roleIndex .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}

.roleIndex .is-active{
    border-bottom:2px solid #409EFF;
}
</style>
