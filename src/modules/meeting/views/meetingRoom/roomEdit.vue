<template>
    <eco-content top="0px" bottom="0px" class="roomEdit" v-loading="loading">
        
        <eco-content top="0px" bottom="50px" >
            <el-form ref="form" :model="baseInfo" label-width="120px" label-position="right" >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="会议室名称" prop="name" :rules="[{required: true, message:'名称必须填写',trigger: 'blur'}]">
                            <el-input v-model="baseInfo.name" ref="reqName"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="流程关联">
                            <el-switch v-model="baseInfo.wfRelated" @change="changeWFRelate"> </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="baseInfo.wfRelated">
                    <el-col :span="24">
                          <el-form-item label="流程模板" prop="wfTemplateId" :rules="[{required: true, message:'流程模板必须选中',trigger: 'blur'}]">
                               <el-select v-model="baseInfo.wfTemplateId"  filterable placeholder="请选择模板">
                                    <el-option
                                      v-for="item in templdateArray"
                                      :key="item.wfTempId"
                                      :label="item.name"
                                      :value="item.wfTempId">
                                    </el-option>
                              </el-select>
                          </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="描述">
                            <el-input v-model="baseInfo.desc"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="序号">
                            <el-input :value="baseInfo.sequence" @input="onInput" @keypress.native="onKeyPress"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="位置" >
                            <el-input v-model="baseInfo.building" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="用途" >
                            <el-input v-model="baseInfo.intention" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                        <el-form-item label="所属部门" >
                            <tag-select
                              style="width:100%;vertical-align: top;"
                              :initDataStr="departmentStr"
                              ref="tagSelect"
                              :initOptions="{selectNum:0,selectType:'dept'}"
                              @callBack="departmentBelongto"
                            >
                            </tag-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="备注" >
                            <el-input v-model="baseInfo.comments" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="会议室图片" style="width:98%">
                 
                   <ecoFileUploadChunk
                      style="max-width:500px"
                      :modular="modular"
                      :modularInnerId="modularInnerId"
                      ref="ecoFileUploadRef"
                      :btnFlag=true
                    ></ecoFileUploadChunk>
                </el-form-item>
                
        </el-form> 
        </eco-content>

          <eco-content bottom="0px" height="50px" >
                <div class="btn">
                    <el-button @click="cancelFunc">取消</el-button>
                    <el-button type="primary" @click="createFunc">保存</el-button>
                </div>
        </eco-content>
      

    </eco-content>
</template>
<script>

  import {getRoomSingleAjax,updateMeetRoomAjax,getWFTemplatesAjax} from '../../service/service'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  import tagSelect from '@/components/orgPick/tagSelect.vue'
  import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'

  export default {
      components:{
          ecoContent,
          tagSelect,
          ecoFileUploadChunk
      },
      data(){
          return{
                baseInfo:{
                    id:null,
                    catId: 'CONFERENCE',
                    name:'',
                    wfRelated:false,
                    wfTemplateId:null,
                    desc:null,
                    sequence:null,
                    building:null,
                    intention:null,
                    comments:null,
                    belongDepts:[]
                },
                modular:'MEETING',
                modularInnerId: '',
                departmentStr:null,
                templdateArray: [],
                loading:true,
          }
      },

      created(){
          this.baseInfo.id = this.$route.params.id;
          this.modularInnerId = this.$route.params.id;
          this.getRoomInfo();
          this.getWFTemplatesFunc();
      },
      mounted(){
         
      },
      computed:{
         
      },
      methods: {

          //获取流程模板
          getWFTemplatesFunc(){
              getWFTemplatesAjax(-1,-1).then((response)=>{
                    this.templdateArray = response.data.remap.list.list;
              }).catch((error)=>{

              });
          },

           //获取详情
           getRoomInfo(){
                getRoomSingleAjax(this.baseInfo.id).then(res=>{
                      this.baseInfo.name = res.data.name;
                      this.baseInfo.wfRelated = res.data.wfRelated;
                      this.baseInfo.wfTemplateId = res.data.wfTemplateId;
                      this.baseInfo.desc = res.data.desc;
                      this.baseInfo.sequence = res.data.sequence;
                      this.baseInfo.building = res.data.building;
                      this.baseInfo.intention = res.data.intention;
                      this.baseInfo.comments = res.data.comments;
                      this.baseInfo.belongDepts =  res.data.belongDepts;

                      let deptArr = []
                      let _belongDepts = res.data.belongDepts;
                      this.handleSelect(_belongDepts,deptArr)
                      let deptStr = deptArr.join('|')
                      this.departmentStr=deptStr;
                      this.loading = false;
                })
            },

            // 选人数据处理
            handleSelect(arrType, arrAimType) {
                if(arrType){
                    arrType.forEach(item => {
                      let obj = {}
                      obj.type = item.type
                      obj.orgId = item.orgId
                      obj.linkId = item.linkId
                      arrAimType.push(JSON.stringify(obj))
                    });
                }
            },

            // 所属部门
            departmentBelongto(data) {
                  if (data.itemArray.length > 0) {
                      this.baseInfo.belongDepts = data.itemArray
                  } else {
                      this.departmentStr = ''
                      this.baseInfo.depts = []
                  }
            },

            changeWFRelate(){
                if(!this.baseInfo.wfRelated){
                    this.baseInfo.wfTemplateId = null;
                }
            },

            createFunc(){
                  let that = this;
                  this.$refs['form'].validate((valid) => {
                      if (valid) {
                            
                            let loadingInstance = Loading.service({ fullscreen: true,text:'正在创建中...'});
                            updateMeetRoomAjax(that.baseInfo).then((response)=>{
                                    that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                        loadingInstance.close();
                                    });
                                      
                                    let doObj = {}
                                    doObj.action = 'updateRoomAddBack';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
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
            },

            onKeyPress(event){
               if(event.keyCode < 45 || event.keyCode > 57){
                    event.returnValue = false; 
                }else{
                    if(event.keyCode == 45 || event.keyCode == 46){ //负号 小数点
                          event.returnValue = false; 
                    }
                }             
            },
            
            onInput(val){
                if(EcoUtil.isNumber(val,2)){
                     this.baseInfo.sequence = val; 
                }
            },
      }

  }

</script>

<style scoped>
.roomEdit{
    padding:0px 20px 20px 20px;
    background-color:#fff;
    margin-left:10px;
    margin-right:10px;
}

.roomEdit .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.roomEdit .content{
    margin-top:5px;
    color:#8c8080
}

.roomEdit .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
