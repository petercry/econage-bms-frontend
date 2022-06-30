<template>
    <eco-content top="0px" bottom="0px" class="addBaseInfo">
        <eco-content top="0px" bottom="50px">
            <el-form ref="form" :model="baseInfo" label-width="150px" label-position="right" style="padding-right:20px;">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="项目类别" prop="category"  >
                                <el-select
                                    style="width:100%"
                                    v-model="baseInfo.category"
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                            v-for="(item,index) in baseData['PRO_CATEGORY']"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="所属平台" prop="platform"  >
                            <el-select
                                    style="width:100%"
                                    v-model="baseInfo.platform"
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                            v-for="(item,index) in baseData['PRO_PLATFORM']"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="项目编号" prop="projectCode" :rules="[{required: true, message:'项目编号必须填写',trigger: 'blur'}]">
                            <el-input v-model="baseInfo.projectCode" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="项目名称" prop="projectName" :rules="[{required: true, message:'项目名称必须填写',trigger: 'blur'}]">
                            <el-input v-model="baseInfo.projectName"  ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="预计SOP时间" prop="sopTime">
                            <el-date-picker style="width:100%" type="date" v-model="baseInfo.sopTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="预计EOP时间" prop="eopTime">
                            <el-date-picker style="width:100%" type="date" v-model="baseInfo.eopTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="车型概述" prop="modelOverview">
                            <el-input v-model="baseInfo.modelOverview"  type="textarea"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="基本参数" prop="basicParameter">
                            <el-input v-model="baseInfo.basicParameter"  type="textarea"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="开发类型" prop="developmentType">
                            <el-input v-model="baseInfo.developmentType"  ></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :span="24">
                        <el-form-item label="预计搭载动力类型" prop="powerTypeItems">
                            <el-checkbox-group v-model="baseInfo.powerTypeItems">
                                   <el-checkbox :label="item.id" v-for="(item,idx) in baseData['1117']" :key="idx" >
                                        {{item.text}}
                                    </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="车辆类型" prop="carModelItems">
                            <el-checkbox-group v-model="baseInfo.carModelItems">
                                    <el-checkbox :label="item.id" v-for="(item,idx) in baseData['1116']" :key="idx" >
                                        {{item.text}}
                                    </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="气体燃料专用" prop="gasFuelItems">
                             <el-checkbox-group v-model="baseInfo.gasFuelItems">
                                    <el-checkbox :label="item.id" v-for="(item,idx) in baseData['1119']" :key="idx" >
                                        {{item.text}}
                                    </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="目标市场" prop="targetMarket">
                            <el-input v-model="baseInfo.targetMarket"  ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="商品目标" prop="commodityTarget">
                            <el-input v-model="baseInfo.commodityTarget"  ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="排放水平/续驶里程" prop="emissionLevel">
                            <el-input v-model="baseInfo.emissionLevel"  ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="外廓尺寸" prop="outsideDimension">
                            <el-input v-model="baseInfo.outsideDimension"  ></el-input>
                        </el-form-item>
                    </el-col>

                     <el-col :span="12">
                        <el-form-item label="车身型式(SUV,MPV,SEDAN)" prop="bodyType">
                            <el-input v-model="baseInfo.bodyType"  ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="整备质量" prop="curbQuality">
                            <el-input v-model="baseInfo.curbQuality"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                     <el-col :span="12">
                        <el-form-item label="最大总质量" prop="maxMass">
                            <el-input v-model="baseInfo.maxMass"  ></el-input>
                        </el-form-item>
                    </el-col>

                     <el-col :span="12">
                        <el-form-item label="乘坐人数" prop="passengerNum">
                            <el-input v-model="baseInfo.passengerNum"  ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="驾驶自动化" prop="driveAutomation">
                            <el-input v-model="baseInfo.driveAutomation"  ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="商品/平台/发动机预概念" prop="name">
                             <ecoFileUploadChunk
                                style="max-width:500px"
                                modular="PRO_CONCEPT"
                                :modularInnerId="baseInfo.id"
                                ref="ecoFileUploadRef"
                                :btnFlag=true
                            ></ecoFileUploadChunk>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="规格配置表" prop="name">
                             <ecoFileUploadChunk
                                style="max-width:500px"
                                modular="PRO_CONFIG"
                                :modularInnerId="baseInfo.id"
                                ref="ecoFileUploadRef"
                                :btnFlag=true
                            ></ecoFileUploadChunk>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="整车构成（CPV）" prop="name">
                             <ecoFileUploadChunk
                                style="max-width:500px"
                                modular="PRO_CPV"
                                :modularInnerId="baseInfo.id"
                                ref="ecoFileUploadRef"
                                :btnFlag=true
                            ></ecoFileUploadChunk>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="开发计划" prop="name">
                                   
                            <ecoFileUploadChunk
                                style="max-width:500px"
                                modular="PRO_PLAN"
                                :modularInnerId="baseInfo.id"
                                ref="ecoFileUploadRef"
                                :btnFlag=true
                            ></ecoFileUploadChunk>

                        </el-form-item>
                    </el-col>
                </el-row>
        </el-form> 
        </eco-content>

          <eco-content bottom="0px" height="50px" >
                <div class="btn">
                    <el-button @click="cancelFunc">取消</el-button>
                    <el-button type="primary" @click="updateFunc">保存</el-button>
                </div>
        </eco-content>

       
      

    </eco-content>
</template>
<script>

import {getProBaseInfo,updateProBaseInfo} from '../../service/service'
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'

import {Loading } from 'element-ui';
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import { mapState,mapActions } from 'vuex';

 

  export default {
      components:{
          ecoContent,
          ecoFileUploadChunk
      },
      data(){
          return{
              baseInfo:{
                    id:null,
                    category:null, //项目类别
                    platform:null,//所属平台
                    projectCode:null,//项目编号
                    projectName:null,//项目名称
                    sopTime:null,//预计sop时间
                    eopTime:null,//预计sop时间
                    modelOverview:null,//车型概述
                    basicParameter:null,//基本参数
                    developmentType:null,//开发类型
                    targetMarket:null,//目标市场
                    commodityTarget:null,//商品目标
                    emissionLevel:null,//排放水平/续驶里程
                    outsideDimension:null,//外廓尺寸
                    bodyType:null,//车身型式
                    maxMass:null,//最大总质量
                    curbQuality:null,//整备质量
                    driveAutomation:null,//驾驶自动化
                    passengerNum:null,//乘坐人数
                    carModelItems:[],//适用车型
                    powerTypeItems:[],//动力类型
                    gasFuelItems:[]//气体燃料专用
                },
          }
      },

      
      created(){
            this.init();
      },
      mounted(){
         
      },
      computed:{
            ...mapState(['baseData'])
      },
      methods: {
        ...mapActions([
            'initProjectBaseData',
        ]),

        init(){
            this.baseInfo.id = this.$route.params.proId;
            this.getProBaseInfoFunc();
            this.initProjectBaseData('create-enabled').then(() => { });
        },

        getProBaseInfoFunc(){
            getProBaseInfo(this.baseInfo.id).then((response)=>{
                for(let key in response.data){
                    this.baseInfo[key] = response.data[key];
                }
            })
        },

        updateFunc(){
                let that = this;
                this.$refs['form'].validate((valid) => {
                     if (valid) {
                        let loadingInstance = Loading.service({ fullscreen: true,text:'正在创建中...'});
                        updateProBaseInfo(that.baseInfo).then((response)=>{
                                that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                    loadingInstance.close();
                                });
                                if(response.data){
                                        let doObj = {}
                                        doObj.action = 'editProBaseInfoCallBack';
                                        doObj.data = {};
                                        doObj.data.oldId = this.baseInfo.id;
                                        doObj.data.id = response.data.id;
                                        doObj.close = true;
                                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                                }
                        }).catch((err)=>{
                            that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                            });
                        })
                     }else{
                         return false;
                     }
                })
          },

          cancelFunc(){
              EcoUtil.getSysvm().closeDialog();
          }
      }

  }

</script>

<style scoped>
.addBaseInfo{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}

.addBaseInfo .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.addBaseInfo .content{
    margin-top:5px;
    color:#8c8080
}

.addBaseInfo .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
