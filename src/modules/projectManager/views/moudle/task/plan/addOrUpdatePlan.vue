<template>
    <div class="addOrUpdatePlan" v-loading="loading">
        <el-row class="toolbar" v-show="!viewStatus">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="ifEdit? '编辑计划':'计划任务定义'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;" v-if="form.edit || !ifEdit">
                <el-button type="danger" size="mini" v-show="ifEdit && editStatus"  @click="deletePlan">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" v-show="editStatus" @click="onSave">保存<i class="el-icon-check el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" v-show="form.publishStatus == 'faw_pm_work_publish_status3' && !startUpdate" @click="startUpdate = true">变更<i class="el-icon-edit el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" v-show="startUpdate" @click="updateApprove">变更<i class="el-icon-edit el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" v-show="form.publishStatus == 'faw_pm_work_publish_status3'" @click="showUpdateRecord">变更记录<i class="el-icon-finished el-icon--right"></i></el-button>

            </el-col>
        </el-row>
        <div class="main" v-bind:class="{view:viewStatus}">
            <el-form ref="form" :model="form" :inline="true" :disabled="!(editStatus || startUpdate)" label-width="120px" class="addForm">
                <el-form-item label="关联计划" class="allWidth" :key="cascaderKey_plan">
                    <el-cascader ref="linkPlans" v-model="linkPlans" @change="linkPlansChange" :props="planProps"  style="width:100%" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="驱动类型" required >
                    <el-select v-model="form.driveType" :disabled="startUpdate" placeholder="请选择" filterable>
                        <el-option
                        v-for="(item,index) in baseData['faw_pm_work_drive']" :key="index"
                        :label="item.text"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型" required>
                    <el-select v-model="form.type" :disabled="startUpdate"  placeholder="请选择" filterable @change="typeChange">
                        <el-option
                            v-for="(item,index) in milesType" :key="index"
                            :label="item.text"
                            :value="item.id"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" required v-bind:class="{allWidth:isInTemplateCard}">
                    <el-input v-model.trim="form.name" ></el-input>
                </el-form-item>
                 <el-form-item label="角色" required v-show="isInTemplateCard || isInProjectCard">
                    <el-select v-model="form.workRole" filterable @change="workRoleChange" placeholder="请选择">
                        <el-option v-for="(item,index) in roleList" :key="index"

                        :label="item.name"
                        :value="item.id">

                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="责任人"  v-show="isInProjectCard" required>
                    <el-select value-key="id" filterable v-model="liableUser" @change="liableUserChange" placeholder="请选择">
                        <el-option v-for="(item,index) in userList" :key="index"

                        :label="item.userName"
                        :value="item">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="关联里程碑" :key="cascaderKey">
                    <el-cascader ref="miles"  :props="props" v-model="milesItem" style="width:100%" @change="linkMilesChange($event,'miles')" :show-all-levels="false" clearable></el-cascader>
                </el-form-item>
                 <!-- <el-form-item label="关联业务类型">
                    <el-select v-model="form.businessType"  placeholder="请选择">
                        <el-option
                        v-for="(item,index) in activityList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>

                    </el-select>
                </el-form-item> -->
                <el-form-item label="计划开始时间" required v-show="isInProjectCard" >
                    <el-date-picker type="date" value-format="yyyy-MM-dd" @change="startDeviationDay"  placeholder="选择日期" v-model="form.planStartDate" style="width: 100%;" :clearable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="计划完成时间" required v-show="isInProjectCard" >
                    <el-date-picker type="date" value-format="yyyy-MM-dd" @change="endDeviationDay" placeholder="选择日期" v-model="form.planEndDate" style="width: 100%;" :clearable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间里程碑关联" :key="cascaderKey_start_miles">
                    <el-cascader ref="startMiles" :props="props" v-model="startMilesItem" style="width:100%" @change="linkMilesChange($event,'startMiles')" :show-all-levels="false" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="结束时间里程碑关联" :key="cascaderKey_end_miles">
                   <el-cascader ref="endMiles" :props="props" v-model="endMilesItem" style="width:100%" @change="linkMilesChange($event,'endMiles')" :show-all-levels="false" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="开始时间里程碑偏移天数">
                    <el-input v-model="form.startDeviationDay" @input="startDeviationDayInput"  type="number"></el-input>
                </el-form-item>
                <el-form-item label="结束时间里程碑偏移天数">
                    <el-input v-model="form.endDeviationDay" @input="endDeviationDayInput"  type="number"></el-input>
                </el-form-item>
                <el-form-item label="父工作开始时间"  v-show="isInProjectCard" >
                    <el-input v-model="parentData.planStartDate" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="父工作结束时间"  v-show="isInProjectCard" >
                    <el-input v-model="parentData.planEndDate" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="父工作责任人"  v-show="isInProjectCard" >
                    <el-input v-model="parentData.liableUserName" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="状态" v-show="isInProjectCard">
                    <el-select v-model="form.status" readonly disabled>
                         <el-option
                        v-for="(item,index) in baseData['faw_pm_work_status']" :key="index"
                        :label="item.text"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布状态" v-show="isInProjectCard">
                    <el-select readonly disabled v-model="form.publishStatus">
                        <el-option
                        v-for="(item,index) in baseData['faw_pm_work_publish_status']" :key="index"
                        :label="item.text"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实际结束时间" v-show="isInProjectCard">
                    <el-input readonly disabled v-model="form.actualEndDate"></el-input>
                </el-form-item>
                <el-form-item label="交付物信息" class="allWidth">
                    <link-deliver @callBack="selectDeliver" placeholder="请选择交付物" :disabled="!(editStatus || startUpdate)" :initData="deliverList"></link-deliver>
                </el-form-item>

            </el-form>

            <div class="btnGroup" v-if="form.edit || !ifEdit">
                <el-button type="primary" size="mini" @click="onSave" v-show="editStatus" >保存<i class="el-icon-check el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" v-show="startUpdate" @click="updateApprove">变更审核<i class="el-icon-finished el-icon--right"></i></el-button>
            </div>
        </div>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { mapActions,mapGetters,mapState } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {getMilesTreeList} from '../../../../api/miles.js'
import linkDeliver from '../../../components/linkDeliver.vue'
import {getItemFetchId,getUserListByRole,getWFOperateId} from '../../../../api/common.js'
import {EcoDate} from '@/components/date/main.js'
import {EcoUtil} from '@/components/util/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {addPlan,getPlanTreeList,getPlanInfo,deletePlan,updatePlan,getPlanDeliverRows,getPlanRoleList,changePlan,getMainMiles} from '../../../../api/plan.js'
export default {
  name:'addMiles',
  components: {
    ecoToolTitle,
    linkDeliver,
    tagSelect
  },
  data() {
    let modelId = this.$route.params.modelId;
    let infoId = this.$route.params.infoId;
    return {
        form:{
            modelId:"",
            infoId:"",
            id:null,
            parentId:"-1",
            parentIdPath:"",
            parentName:"",
            milesName:"",
            startMilesName:"",
            endMilesName:"",
            name:"",
            milesId:"",
            milesIdPath:"",
            driveType:"",
            type:"",
            businessType:"",
            startMilesId:"",
            startMilesIdPath:"",
            endMilesId:"",
            endMilesIdPath:"",
            startDeviationDay:"",
            endDeviationDay:"",
            delivList:[],
            liableUserId:"",
            liableUserName:"",
            planStartDate:"",
            planEndDate:"",
            status:"faw_pm_work_status1",
            edit:true,
            publishStatus:"faw_pm_work_publish_status1",
        },
        parentData:{

        },
        ifEdit:false,
        loading:false,
        planProps:{
          lazy: true,
          checkStrictly:true,
          lazyLoad (node, resolve) {
            const { level } = node;
            if(level == 0){
                getPlanTreeList(-1,modelId,infoId).then((response) =>{
                    const dataList = response.rows.map(item=>{
                        item.leaf = !item.subTotal > 0;
                        return item;
                    })
                    resolve(dataList);
                })


            }else{
                getPlanTreeList(node.data.id,modelId,infoId).then((response) => {
                    const dataList = response.rows.map(item=>{
                        item.leaf = !item.subTotal > 0;
                        return item;
                    })
                    setTimeout(() => {
                        resolve(dataList);
                    }, 200);
                })
            }
          },
          label:"name",
          value:"id",
        },
        props: {
          lazy: true,
          checkStrictly:true,
          lazyLoad (node, resolve) {
            const { level } = node;
            if(level == 0){
                getMilesTreeList(-1,modelId,infoId).then((response) =>{
                    const dataList = response.rows.map(item=>{
                        item.leaf = !item.subTotal > 0;
                        return item;
                    })
                    resolve(dataList);
                })


            }else{
                getMilesTreeList(node.data.id,modelId,infoId).then((response) => {
                    const dataList = response.rows.map(item=>{
                        item.leaf = !item.subTotal > 0;
                        return item;
                    })
                    setTimeout(() => {
                        resolve(dataList);
                    }, 200);
                })
            }
          },
          label:"name",
          value:"id",
        },
        deliverList:[],
        milesItem:[],
        startMilesItem:[],
        endMilesItem:[],
        isInProjectCard:false,
        cascaderKey:1,
        defaultStatus:"",
        cascaderKey_plan:EcoUtil.getUID(),
        isInTemplateCard:false,
        cascaderKey_start_miles:EcoUtil.getUID(),
        cascaderKey_end_miles:EcoUtil.getUID(),
        userList:[],
        liableUser:{},
        linkPlans:[],
        roleList:[],
        startUpdate:false,
        viewStatus:false
    }
  },
  beforeMount() {
      if(this.$route.params.id == '-1'){
          this.initSomeBaseData({array:['faw_pm_work_drive','faw_pm_work_status','faw_pm_work_publish_status']})
          this.getPlanRoleList();
      }
  },


  created() {
      this.setActivityList()
      this.setMilesType();
  },
  activated(){

  },

  mounted(){
      if(this.$route.params.modelId && this.$route.params.modelId >0){
          this.form.modelId = this.$route.params.modelId;
          this.isInTemplateCard = true;
          this.getPlanRoleList();
      }
      if(this.$route.params.infoId && this.$route.params.infoId >0){
          this.form.infoId = this.$route.params.infoId;
          this.isInProjectCard = true;
          this.getPlanRoleList();
      }

      if(this.$route.params.id > 0){
          this.ifEdit = true;
          this.getPlanInfo(this.$route.params.id);
          this.initSomeBaseData({array:['faw_pm_work_drive','faw_pm_work_status','faw_pm_work_publish_status'],action:"update-enabled"})
      }else if(this.$route.params.id == '-1'){
            this.loading = true;
            //this.initSomeBaseData({array:['faw_pm_work_drive','faw_pm_work_status','faw_pm_work_publish_status']})
            let res = EcoUtil.getSysvm().getTempStore('update-record-info');
            //this.getPlanRoleList();
            this.isInProjectCard = true;
            this.form = res || {};
            this.viewStatus = true;
            // this.$refs['linkPlans'].inputValue = res.parentName;
            // this.$refs['endMiles'].inputValue = res.endMilesName;
            // this.$refs['startMiles'].inputValue = res.startMilesName
            // this.$refs['miles'].inputValue = res.milesName;
            this.linkPlans = res.parentIdPath?res.parentIdPath.split('.'):[];
            this.endMilesItem = res.endMilesIdPath?res.endMilesIdPath.split('.'):[];
            this.startMilesItem = res.startMilesIdPath?res.startMilesIdPath.split('.'):[];
            this.milesItem = res.milesIdPath?res.milesIdPath.split('.'):[];
            EcoUtil.getSysvm().removeTempStore('update-record-info');
             this.loading = false;
            if(this.form.workRole){
                this.loading = true;
                getUserListByRole(this.$route.params.infoId,this.form.workRole).then(res=>{
                    this.userList = res.rows;
                    this.loading = false;
                    for(let item of this.userList){
                        if(item.userId = this.form.liableUserId){
                            this.liableUser = item;
                            break;
                        }
                    }
                })
            }
            if(this.form.delivList && this.form.delivList.length > 0){
                this.pushDataForDeliverList();
            }


      }else if(this.$route.params.id == '-2'){
          this.getPlanRoleList();
          let res = EcoUtil.getSysvm().getTempStore('task-info');
            //this.getPlanRoleList();
          EcoUtil.getSysvm().removeTempStore('task-info');
          this.ifEdit = true;
          this.isInProjectCard = true;
          this.getPlanInfo(res.id);
          this.initSomeBaseData({array:['faw_pm_work_drive','faw_pm_work_status','faw_pm_work_publish_status'],action:"update-enabled"})
      }else{
           this.getItemFetchId();
           if(this.$route.params.parentId && this.$route.params.parentId >0){

                this.getParentPlanInfo(this.$route.params.parentId);
            }
           this.initSomeBaseData({array:['faw_pm_work_drive','faw_pm_work_status','faw_pm_work_publish_status'],action:"create-enabled"})
      }
  },
  filters:{

  },
  computed: {
      ...mapGetters(['projectInfo','baseData','milesType','activityList']),
      editStatus(){
          if(this.$route.params.id == -1){
              return false;
          }else if(this.$route.params.id == 0){
              return true;
          }
          if(!this.form.edit && this.ifEdit){
              return false;
          }
          return this.form.publishStatus == 'faw_pm_work_publish_status1' || !this.isInProjectCard;
      }
  },

  methods: {
    ...mapActions([
        'setMilesType','setActivityList','initSomeBaseData',
    ]),
    getPlanRoleList(){
        getPlanRoleList(this.form.infoId).then(res => {
            this.roleList = res.rows;
        })
    },
    getPlanInfo(id){
        this.loading = true;
        getPlanInfo(id).then(res=>{
            this.loading = false;
            this.form = res;
            // this.$refs['linkPlans'].inputValue = res.parentName;
            // this.$refs['endMiles'].inputValue = res.endMilesName;
            // this.$refs['startMiles'].inputValue = res.startMilesName
            // this.$refs['miles'].inputValue = res.milesName;
             // this.$refs['miles'].inputValue = res.milesName;
            this.linkPlans = res.parentIdPath?res.parentIdPath.split('.'):[];
            this.endMilesItem = res.endMilesIdPath?res.endMilesIdPath.split('.'):[];
            this.startMilesItem = res.startMilesIdPath?res.startMilesIdPath.split('.'):[];
            this.milesItem = res.milesIdPath?res.milesIdPath.split('.'):[];
            if(this.form.workRole){
                getUserListByRole(this.$route.params.infoId,this.form.workRole).then(res=>{
                    this.userList = res.rows;
                    for(let item of this.userList){
                        if(item.userId == this.form.liableUserId ){
                            this.liableUser = item;
                            break;
                        }
                    }
                })
            }
            if(this.form.parentWork){
                this.parentData = this.form.parentWork;
            }
            if(this.form.delivList && this.form.delivList.length > 0){
                this.pushDataForDeliverList();
            }
        })
    },
    getParentPlanInfo(id){
        this.loading = true;
        getPlanInfo(id).then(res=>{
            this.loading = false;
            this.parentData = res;
            this.form.parentId = res.id;
            this.form.parentName = res.name;
            if(res.parentIdPath && res.parentIdPath != '-1'){
                this.linkPlans =  res.parentIdPath.split('.');
                this.linkPlans.push(res.id);
            }else{
                this.linkPlans.push(res.id,);
            }
            this.form.parentIdPath = this.linkPlans.join('.');

        });
    },
     pushDataForDeliverList(){
        this.deliverList = this.form.delivList.map(item => {
            return item.delivId;
        })
     },
     getItemFetchId(){
          getItemFetchId().then(res => {
              this.form.id = res;
              this.loading = false;
          })
     },
     selectDeliver(data = []){
         this.form.delivList = [];
         if(data.length > 0){
            this.form.delivList = data.map((item,index) => {
                let obj = {};
                obj.milestoneId = this.form.id;
                obj.delivId = item.id;
                return obj;
            })
         }
     },
     linkPlansChange(value){
         if(value.length == 0){
              this.cascaderKey_plan = EcoUtil.getUID();
         }
        this.form.parentId = value.length > 0 ? value[value.length-1] : -1;
        this.form.parentIdPath = value.join('.');
        if(this.form.parentId == this.$route.params.id){
            this.form.parentId = -1;
            this.form.parentName = "";
            this.linkPlans = [];
            return EcoMessageBox.alert('无法选择节点本身','提示')
        }
        try{
            this.form.parentName = this.$refs['linkPlans'].getCheckedNodes()[0].label;
            let node =  this.$refs['linkPlans'].getCheckedNodes()[0].data;
            this.parentData = node;
        }catch(e){
            this.form.parentName = '';
        }

     },
     linkMilesChange(value,ref,name){
        let node = this.$refs[ref].getCheckedNodes()[0];
        if(ref == 'miles'){
            if(value.length == 0){
                this.cascaderKey++;
            }
            this.form.milesId = value.length > 0 ? value[value.length-1] : -1;
            this.form.milesIdPath = value.join('.');
            //this.getPlanDeliverRows(this.form.type);
        }else if(ref == 'startMiles'){
            if(value.length == 0){
                this.cascaderKey_start_miles = EcoUtil.getUID();
            }
            this.form.startMilesId = value.length > 0 ? value[value.length-1] : -1;
            this.form.startMilesIdPath = value.join('.');
            this.startDeviationDay();
        }else if(ref == 'endMiles'){
            if(value.length == 0){
                this.cascaderKey_end_miles = EcoUtil.getUID();
            }
            this.form.endMilesId = value.length > 0 ? value[value.length-1] : -1;
            this.form.endMilesIdPath = value.join('.');
            this.endDeviationDay()
        }
        try{
            this.form[ref+"Name"] = node.label;
        }catch(e){
            this.form[ref+"Name"] = '';
        }
        if(value.length == 0){
            this.form[ref+"Name"] = '';
        }
        if(name){
            this.form[ref+"Name"] = name;
        }
     },
     startDeviationDay(){
         try {
            let node = this.$refs['startMiles'].getCheckedNodes()[0];
            if(node && this.form.planStartDate && node.data.planDate){
                let planStartDate =  EcoDate.convertDateFromString(this.form.planStartDate);
                let milesPlanDate = EcoDate.convertDateFromString(node.data.planDate);
                this.form.startDeviationDay = (planStartDate.getTime() - milesPlanDate.getTime())/(24*60*60*1000)
            }
         } catch (error) {
             this.form.startDeviationDay = "";
         }

     },
     endDeviationDay(){
         try {
            let node = this.$refs['endMiles'].getCheckedNodes()[0];
            if(node && this.form.planEndDate && node.data.planDate){
                let planEndDate =  EcoDate.convertDateFromString(this.form.planEndDate);
                let milesPlanDate = EcoDate.convertDateFromString(node.data.planDate);
                this.form.endDeviationDay = (planEndDate.getTime() - milesPlanDate.getTime())/(24*60*60*1000)
            }
         } catch (error) {
             this.form.endDeviationDay = "";
         }

     },
     onSave(){

         if(!this.form.name){
             return  EcoMessageBox.alert('计划名称 不能为空','提示')
         }
         if(!this.form.driveType){
             return  EcoMessageBox.alert('请选择驱动类型','提示')
         }
         if(!this.form.type){
             return  EcoMessageBox.alert('请选择任务类型','提示')
         }
         if(!this.form.workRole && (this.isInTemplateCard || this.isInProjectCard)){
             return  EcoMessageBox.alert('请选择关联角色','提示')
         }
         if(!this.form.liableUserId && this.isInProjectCard){
             return  EcoMessageBox.alert('请选择责任人','提示')
         }
         if(!this.form.planStartDate && this.isInProjectCard){
             return  EcoMessageBox.alert('请选择计划开始时间','提示')
         }
         if(!this.form.planEndDate && this.isInProjectCard){
             return  EcoMessageBox.alert('请选择计划完成时间','提示')
         }
         if(this.isInProjectCard && EcoDate.convertDateFromString(this.form.planEndDate).getTime() < EcoDate.convertDateFromString(this.form.planStartDate).getTime()){
             return  EcoMessageBox.alert('计划完成时间需大于计划开始时间','提示')
         }
        //  if(!this.form.planDate && this.isInProjectCard){
        //      return  EcoMessageBox.alert('计划完成时间 不能为空','提示')
        //  }

         this.loading = true;
         if(this.ifEdit){
            if(this.$route.params.parentId != this.form.parentId){
                this.cascaderKey_plan = EcoUtil.getUID();
            }
            updatePlan(this.form).then((res)=>{
                this.loading = false;
                this.$message({
                message: '修改成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","updatePlan",res);
            }).catch(e=>{
                this.loading = false;
            });
         }else{
             addPlan(this.form).then((res)=>{
                this.loading = false;
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addPlan",res);
                if(this.isInProjectCard){
                    this.$router.push({name:'addOrUpdatePlanInProjectCard',params:{id:res.id}});
                }else if(this.isInTemplateCard){
                    this.$router.push({name:'addOrUpdatePlanInCard',params:{id:res.id}});
                }else{
                    this.$router.push({name:'addOrUpdatePlan',params:{id:res.id}});
                }
                // let doObj = {}
                // doObj.action = 'addPlan';
                // doObj.data = res;
                // doObj.close = true;
                // EcoUtil.getSysvm().callBackDialogFunc(doObj)
                // if(window.isInCard){
                //     this.$router.push({name:'addOrUpdateMilesInCard',params:{id:res.id}});
                // }else if(window.isInProjectCard){
                //     this.$router.push({name:'addOrUpdateMilesInProjectCard',params:{id:res.id}});
                // }else{
                //     this.$router.push({name:'addOrUpdateMiles',params:{id:res.id}});
                // }
            }).catch(e=>{
                this.loading = false;
            })
         }

     },

     deletePlan(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deletePlanFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deletePlanFunc(id){
         deletePlan(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deletePlan",id);
            if(this.isInTemplateCard){
                 this.$router.push({name:'templatesCard'});
            }else if(this.isInProjectCard){
                 this.$router.push({name:'planSettingInProjectCard'});
            }else{
                 this.$router.push({name:'planSetting'});
            }

        })
     },
     workRoleChange(value){
         this.liableUser = {};
         this.form.liableUserId = "";
         this.form.liableUserName = "";
         getUserListByRole(this.$route.params.infoId,value).then(res=>{
             this.userList = res.rows;

         })
     },
     liableUserChange(item){
         this.form.liableUserId = item.userId;
         this.form.liableUserName = item.userName;
     },
     typeChange(type){
         this.getPlanDeliverRows(type);
         if(this.form.infoId>0){//项目卡片里
             this.getMainMiles(type);
         }

     },
     getMainMiles(type){
         if(!type || type == 'faw_pm_milestone_type12') {
             this.milesItem = [];
             this.linkMilesChange(this.milesItem,'miles');
             return;
         }
         getMainMiles(this.form.infoId,type).then(res=>{
             this.milesItem = [];
             this.milesItem.push(res.id);
             this.linkMilesChange(this.milesItem,'miles',res.name);
         });
     },
     getPlanDeliverRows(type){
         this.deliverList = [];
         this.form.delivList = [];
         if(!type) return;
         getPlanDeliverRows(type,this.form.infoId,this.form.modelId).then(res=>{
            if(res.rows && res.rows.length > 0){
                let array =  res.rows.map((item,index) => {
                    let obj = {};
                    obj.milestoneId = this.form.id;
                    obj.delivId = item.id;
                    return obj;
                })
                if(this.form.delivList && this.form.delivList.length > 0){
                    this.form.delivList = this.form.delivList.concat(array);
                }else{
                    this.form.delivList = array;
                }
                this.form.delivList = this.unique(this.form.delivList);
                this.pushDataForDeliverList();
            }
         })
     },
     unique(array = []){
        const res = new Map();
        return array.filter((item) => !res.has(item.delivId) && res.set(item.delivId, 1))
     },
     startDeviationDayInput(value){
        try {
            let node = this.$refs['startMiles'].getCheckedNodes()[0];
            if(node.data.planDate){
                this.form.planStartDate = EcoDate.formatDateDefault(new Date(EcoDate.convertDateFromString(node.data.planDate).getTime() + value*24*60*60*1000));
            }
        } catch (error) {
            this.form.planStartDate = "";
        }

     },
     endDeviationDayInput(value){
        try {
            let node = this.$refs['endMiles'].getCheckedNodes()[0];
            if(node && node.data.planDate){
                this.form.planEndDate = EcoDate.formatDateDefault(new Date(EcoDate.convertDateFromString(node.data.planDate).getTime() + value*24*60*60*1000));
            }
        } catch (error) {
            this.form.planEndDate = "";
        }

     },
     updateApprove(){
         if(!this.form.name){
             return  EcoMessageBox.alert('计划名称 不能为空','提示')
         }
         if(!this.form.driveType){
             return  EcoMessageBox.alert('请选择驱动类型','提示')
         }
         if(!this.form.type){
             return  EcoMessageBox.alert('请选择任务类型','提示')
         }
         if(!this.form.workRole && (this.isInTemplateCard || this.isInProjectCard)){
             return  EcoMessageBox.alert('请选择关联角色','提示')
         }
         if(!this.form.liableUserId && this.isInProjectCard){
             return  EcoMessageBox.alert('请选择责任人','提示')
         }
         if(!this.form.planStartDate && this.isInProjectCard){
             return  EcoMessageBox.alert('请选择计划开始时间','提示')
         }
         if(!this.form.planEndDate && this.isInProjectCard){
             return  EcoMessageBox.alert('请选择计划完成时间','提示')
         }
         EcoUtil.getSysvm().showLoadingDiv('正在初始化... 请稍等');

         changePlan(this.form).then(res=>{
            if(!res || res == 'null'){
                this.$message({
                    message: '变更成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.startUpdate = false;
                EcoUtil.getSysvm().hideLoadingDiv();
            }else{
                getWFOperateId(res.startTaskId).then(response=>{
                    if(response.status == 0){
                        EcoUtil.getSysvm().hideLoadingDiv();
                        let operateId = response.operate_id;
                        let tabObj = {};
                        let goPage = "flowform/index.html#/wfDetail/"+res.startTaskId+"/"+operateId;
                        tabObj.desc = '待办流程';
                        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+res.startTaskId+"',href_link:'"+goPage+"',fullScreen:true}";
                        EcoUtil.getSysvm().doTab(tabObj);
                    }else{
                        EcoUtil.getSysvm().hideLoadingDiv();
                        EcoMessageBox.alert(response.msg);
                        this.closeFullWindow();
                    }
                }).catch(e=>{
                    EcoUtil.getSysvm().hideLoadingDiv();
                })
            }

        }).catch(e=>{
            EcoUtil.getSysvm().hideLoadingDiv();
        })
     },
     closeFullWindow(){
        let _closeObj = {};
        _closeObj.clearIframe = true;
        _closeObj.tabClick = true;
        EcoUtil.getSysvm().closeFullScreen(_closeObj);
     },
     showUpdateRecord(){
         if(sysEnv == 0){
            let _width = '600';
            let _height = '500';
            let url = window.location.origin + "/#" +'/updateRecord/'+this.$route.params.id;
            EcoUtil.getSysvm().openDialog('变更记录',url,_width,_height,'15vh');
        }else{
            let _width = '600';
            let _height = '500';
            let url = 'projectManager/index.html#/updateRecord/'+this.$route.params.id;
            EcoUtil.getSysvm().openDialog('变更记录',url,_width,_height,'15vh');
        }
     }
  },
  watch:{
     $route:{
         deep:true,
         handler(){
            this.cascaderKey_plan = EcoUtil.getUID();
            this.cascaderKey_start_miles = EcoUtil.getUID();
            this.cascaderKey_end_miles = EcoUtil.getUID();
            this.cascaderKey++;
            this.deliverList = [];
            this.milesItem = [];
            this.startMilesItem = [];
            this.endMilesItem = [];
            this.$refs['linkPlans'].inputValue = "";
            this.$refs['endMiles'].inputValue = "";
            this.$refs['startMiles'].inputValue = "";
            this.$refs['miles'].inputValue = "";
            this.linkPlans = [];
            this.liableUser = {};
            this.parentData = {};
            this.userList = [];
            this.startUpdate = false;
            if(this.$route.params.id > 0){
                this.form.id = this.$route.params.id;
                this.ifEdit = true;
                this.getPlanInfo(this.form.id)
            }else{
                this.form = {
                    modelId:"",
                    infoId:"",
                    id:null,
                    parentId:"-1",
                    parentIdPath:"",
                    parentName:"",
                    milesName:"",
                    startMilesName:"",
                    endMilesName:"",
                    name:"",
                    milesId:"",
                    milesIdPath:"",
                    driveType:"",
                    type:"",
                    businessType:"",
                    startMilesId:"",
                    startMilesIdPath:"",
                    endMilesId:"",
                    endMilesIdPath:"",
                    startDeviationDay:"",
                    endDeviationDay:"",
                    delivList:[],
                    liableUserId:"",
                    liableUserName:"",
                    planStartDate:"",
                    planEndDate:"",
                    status:"faw_pm_work_status1",
                    edit:true,
                    publishStatus:"faw_pm_work_publish_status1",
                },
                this.ifEdit = false;

                if(this.$route.params.parentId && this.$route.params.parentId >0){

                    this.getParentPlanInfo(this.$route.params.parentId);
                }
            }

            if(this.$route.params.modelId && this.$route.params.modelId >0){
                this.form.modelId = this.$route.params.modelId;
            }
            if(this.$route.params.infoId && this.$route.params.infoId >0){
                this.form.infoId = this.$route.params.infoId;
            }


         }
     }
  },

};
</script>

<style scoped>
.addOrUpdatePlan{
    position: relative;
    height: 100%;
}
.addOrUpdatePlan .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addOrUpdatePlan .main{
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
    overflow: auto;
}
.addOrUpdatePlan .main.view{
    top:0px;
}
.addOrUpdatePlan .addForm{
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 0px;
    color: #0f1419 !important;
}
.addOrUpdatePlan .addForm .el-form-item{
    width:48%;
}
.addOrUpdatePlan .addForm .el-form-item.allWidth{
    width:98%;
}
.addOrUpdatePlan .addForm .el-form-item__content{
    width:calc(100% - 120px);
}
.addOrUpdatePlan .addForm .el-select{
    width:100%;
}
.btn-line {
	border: 1px dashed #003b90;
	background-color: #fff;
	color: #003b90;
	cursor: pointer;
    text-align: center;
    border-radius: 4px;
	margin: 10px 0px;
}
.btnGroup{
    text-align: center;
    padding-left: 20px;
    padding-bottom: 20px;
}
</style>
