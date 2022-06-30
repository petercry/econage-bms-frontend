<template>
    <eco-content top="0px" bottom="0px" class="addMember">
        <eco-content top="0px" bottom="50px" >
            <el-form ref="form" :model="baseInfo" label-width="150px" label-position="right" style="padding-right:20px;" size="small">
                    
                    <el-form-item label="部门" prop="deptId" :rules="[{required: true, message:'部门必须填写',trigger: 'change'}]">
                            <tag-select 
                                disabled
                                placeholder="请选择部门"  
                                style="width: 100%;vertical-align: top;"
                                :initDataArray="initDataMap.deptId"
                                :initOptions="{selectNum:1,selectType:'dept'}" 
                                @callBack="selectDept" >
                            </tag-select>
                    </el-form-item>
                  
                    <el-form-item label="专业名称" prop="profession" :rules="[{required: true, message:'专业名称为必选项',trigger: 'change'}]">
                           <el-select
                                    style="width:100%"
                                    v-model="baseInfo.profession"
                                    placeholder="请选择"
                                    clearable
                                    :disabled="flag"
                                >
                                    <el-option
                                            v-for="(item,index) in baseData['1372459642503467009']"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                    >
                                    </el-option>
                            </el-select>
                    </el-form-item>
                    
                    <!-- <el-form-item label="专业设计师" prop="professionDesignerId">
                            <tag-select
                                    :disabled="flag" 
                                    placeholder="请选择人员"  
                                    style="width: 100%;vertical-align: top;"
                                    :initDataArray="initDataMap.professionDesignerId"
                                    :initOptions="{selectNum:1,selectType:'user'}" 
                                    @callBack="selectProfessionDesigner" >
                            </tag-select>
                    </el-form-item> -->

                     <el-form-item label="专业负责人" prop="professionLeaderId" :rules="[{required: true, message:'专业负责人必须填写',trigger: 'change'}]">
                            <tag-select 
                                placeholder="请选择人员"  
                                style="width: 100%;vertical-align: top;"
                                :initDataArray="initDataMap.professionLeaderId"
                                :initOptions="{selectNum:1,selectType:'user'}" 
                                @callBack="selectProfessionLeader" >
                            </tag-select>
                    </el-form-item>
                   
                    <el-form-item label="联络人" prop="deptContactUserId" :rules="[{required: true, message:'部门联络人必须填写',trigger: 'change'}]">
                            <tag-select 
                                placeholder="请选择人员"  
                                style="width: 100%;vertical-align: top;"
                                :initDataArray="initDataMap.deptContactUserId"
                                :initOptions="{selectNum:1,selectType:'user'}" 
                                @callBack="selectDeptContactUser" >
                            </tag-select>
                    </el-form-item>

                    <el-form-item label="类型" prop="type" :rules="[{required: true, message:'类型必须填写',trigger: 'change'}]">
                           <el-select
                                    style="width:100%"
                                    v-model="baseInfo.type"
                                    placeholder="请选择"
                                    clearable
                                    @change='changeselectFun'
                                >
                                    <el-option
                                            v-for="(item,index) in typeOptions"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                    >
                                    </el-option>
                            </el-select>
                    </el-form-item>
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

import tagSelect from '@/components/orgPick/tagSelect.vue'
import {updateProMember,getProMemberSingle} from '../../service/service'
import {Loading } from 'element-ui';
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import { mapState,mapActions } from 'vuex';

 

  export default {
      components:{
          ecoContent,
          tagSelect
      },
      data(){
          return{
                baseInfo:{
                    id:null,
                    projectId:null,
                    deptId:null,
                    profession:null,
                    // professionDesignerId:null,
                    professionLeaderId:null,
                    deptContactUserId:null,
                    type:null
                },
                initDataMap:{
                    deptContactUserId:[],
                    deptId:[],
                    // professionDesignerId:[],
                    professionLeaderId:[]

                },
                typeOptions:[],
                flag:false
          }
      },
      created(){
            this.baseInfo.id = this.$route.params.id;
            this.typeOptions.push({text:'部门',id:'dept'});
            this.typeOptions.push({text:'法规',id:'regulation'});

            this.getProMemberSingleFunc();
            this.initProjectBaseData('create-enabled').then(() => { });
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

        changeselectFun(val) {
            if(val == 'regulation') {
                this.flag = true
            } else {
                this.flag = false
            }
        },

        getProMemberSingleFunc(){
            getProMemberSingle(this.baseInfo.id).then((response)=>{
                
                this.baseInfo.projectId = response.data.projectId;
                this.baseInfo.deptId = response.data.deptId;
                this.baseInfo.profession = response.data.profession;
                // this.baseInfo.professionDesignerId = response.data.professionDesignerId;
                this.baseInfo.professionLeaderId = response.data.professionLeaderId;
                this.baseInfo.deptContactUserId = response.data.deptContactUserId;
                this.baseInfo.type = response.data.type;


                this.initDataMap.deptId.push(response.data.deptVO);
                // this.initDataMap.professionDesignerId.push(response.data.professionDesignerVO);
                this.initDataMap.professionLeaderId.push(response.data.professionLeaderVO);
                this.initDataMap.deptContactUserId.push(response.data.deptContactUserVO);
            })
        },

        //回写部门
        selectDept(data){
            if(data.itemArray.length > 0){
                this.baseInfo.deptId = data.itemArray[0].linkId;
            }else{
                this.baseInfo.deptId = null;
            }
        },
        //回写 专业设计师
        // selectProfessionDesigner(data){
        //     if(data.itemArray.length > 0){
        //         this.baseInfo.professionDesignerId = data.itemArray[0].linkId;
        //     }else{
        //         this.baseInfo.professionDesignerId = null;
        //     }
        // },
        //回写 部门联络人
        selectProfessionLeader(data){
            if(data.itemArray.length > 0){
                this.baseInfo.professionLeaderId = data.itemArray[0].linkId;
            }else{
                this.baseInfo.professionLeaderId = null;
            }
        },
        //回写 部门联络人
        selectDeptContactUser(data){
            if(data.itemArray.length > 0){
                this.baseInfo.deptContactUserId = data.itemArray[0].linkId;
            }else{
                this.baseInfo.deptContactUserId = null;
            }
        },

        updateFunc(){
                if(this.baseInfo.type == 'dept') {
                    // !this.baseInfo.professionDesignerId 专业设计师、
                    if(!this.baseInfo.profession) {
                        this.$message.error('专业负责人、联络人不能为空');
                        return
                    }
                }                                                                         
                let that = this;
                this.$refs['form'].validate((valid) => {
                     if (valid) {
                        let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存...'});
                        updateProMember(that.baseInfo).then((response)=>{
                                that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                    loadingInstance.close();
                                });
                                if(response.data){
                                    let doObj = {}
                                    doObj.action = 'proMemberUpdateCallBack';
                                    doObj.data = {};
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

<style>
.addMember .el-customDiv{
	min-height: 32px;
	line-height: 32px;
	-webkit-appearance: none;
	background-color: #fff;
	background-image: none;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	color: #606266;
	display: inline-block;
	font-size: inherit;
	outline: 0;
	padding: 0 5px;
	position: relative;
	-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
	transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
	width: 100%;
}
</style>

<style scoped>
.addMember{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}



.addMember .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.addMember .content{
    margin-top:5px;
    color:#8c8080
}

.addMember .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
