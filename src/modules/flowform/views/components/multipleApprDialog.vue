<template>
    <div class="multipleApprDialog">
        <div class="container" v-show="!checking && !submitError">
            <el-row>
                <p class="">办理操作</p>
                <el-radio-group v-model="apprCode"  @change="apprCodeChange">
                  <el-radio v-bind:class="{argee:(item.id=='1'),disagree:(item.id=='0'),}" v-for="(item,index) in apprKV" :key="index" :label="item.id">{{item.text}}</el-radio>
                </el-radio-group>
            </el-row>
            <el-row>
                <p>审批意见</p>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4}"
                  placeholder="请输入审批意见"
                  v-model="apprDesc">
                </el-input>
            </el-row>
        </div>
        <div class="container" v-show="checking || submitError">
              <p class="tip" v-show="checking"><i class="iconfont icon iconbangzhu-kong"></i> 存在流程不符合审批条件，是否继续批量审批其他流程？</p>
              <div>
                <p>以下流程审批时，存在异常</p>
                <div class="wfNames" v-for="(value, key, index) in wfNames" :key="index" v-show="key.indexOf('submit') == -1 || key.indexOf('total')">
                    <p>{{key | filterWFName}}</p>
                    <p>{{value.init_user}} {{value.time?value.time.substr(0,16):''}}</p>
                    <p v-if="value.hasOwnProperty('not_null')">存在必填项 [<span style="color:#67C23A">{{value.not_null}}</span>] 为空</p>
                    <p v-if="value.hasOwnProperty('inspect_form')">校验规则：<span v-for="(item,index) in value['inspect_form']" :key="index">{{item}}<i v-if="index>0">,</i></span> </p>
                    <p v-if="value.hasOwnProperty('msg')">异常信息：{{value.msg}}</p>
                    
                </div>
              </div>
        </div>
         <div class="btn">
                <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
                <el-button type="primary" v-show="!submitError" :disabled="submitDisabled" size="medium"  @click="onSubmit" v-text="checking?'继续审批':'批量审批'"></el-button>
          </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getWorkFlowApprKv,checkBatchAppr,submitBatchAppr} from '../../service/service.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
export default{
  data(){
    return {
      apprCode:'1',
      apprDesc:"",
      batchTasks:"",
      apprKV:[],
      checking:false,
      wfNames:{},
      loadingInstance:null,
      submitTasks:[],
      submitError:false
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
     this.batchTasks = decodeURI(this.$route.params.batchTasks);
     this.getWorkFlowApprKv();
  },
  beforeDestroy() {
     
  },
  mounted(){

  },
  computed:{
      submitDisabled(){
          if(this.submitTasks.length == 0 && this.checking){
             return true;
          }else{
             return false;
          }
      }
  },
  methods: {
      getWorkFlowApprKv(){
          getWorkFlowApprKv().then((res) =>{
            if(res.data.status < 100){
               this.apprKV = res.data.remap.appr_kv;
               for(let i=0;i<this.apprKV.length;i++){
                    //默认取id为1的描述
                    if(this.apprKV[i].id == this.apprCode){
                        this.apprDesc = this.apprKV[i].text;
                    }
               }
            }
          })
      },
      apprCodeChange(value){
            let str_ = JSON.stringify(this.apprKV);
             for(let i=0;i<this.apprKV.length;i++){
                if(value == this.apprKV[i].id){
                   //审批意见框为空或者为系统默认的审批描述才可被赋值
                   if(!this.apprDesc || str_.indexOf(this.apprDesc)>-1){
                       this.apprDesc = this.apprKV[i].text;
                   }
                   break;
                }
             }
          
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
          if(!this.checking){
              this.checkBatchAppr(); 
          }else{
              this.batchAppr(0);
          }
      },
      checkBatchAppr(){
        this.loadingInstance = Loading.service({ fullscreen: true,text:'正在审批中...'});
        let data = {
            batchTasks:this.batchTasks,
            apprDesc:this.apprDesc,
            apprCode:this.apprCode
        }
        checkBatchAppr(data).then((response) => {

                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                    if(response.data.status <=99){
                         this.batchAppr(1);
                    }else{
                         this.checking = true;
                         this.wfNames = response.data.remap;
                         let obj = response.data.remap;
                          for(let key in obj){
                             if(key.indexOf('submit')>-1){
                                this.submitTasks.push(obj[key]);
                             }
                          }
                    }

              }).catch((error) => {
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
              });
      },
      batchAppr(flag){
        if(flag == 0){
            this.loadingInstance = Loading.service({ fullscreen: true,text:'正在审批中...'});
        }
        let data = {
            batchTasks:this.submitTasks.length>0?this.submitTasks.join(','):this.batchTasks,
            apprDesc:this.apprDesc,
            apprCode:this.apprCode
        }
        this.checking = false;
        submitBatchAppr(data).then((response) => {
               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.loadingInstance.close();
                });

                if(response.data.status <=99){
                    
                    let doObj = {}
                      doObj.action = 'batchAppr';
                      doObj.data = {};
                      doObj.data.msg = response.data.remap["total#"];
                      doObj.close = true;
                      EcoUtil.getSysvm().callBackDialogFunc(doObj);
                }else{
                    this.submitError = true;
                    this.wfNames = response.data.remap;
                }
        }).catch((error) => {
              this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                  this.loadingInstance.close();
              });
        });
      }
  },
  watch: {
     
  },
  filters:{
    filterWFName(value){
        console.log(value);
        if(!value) return '';
        if(value.indexOf('submit')>-1){
          return '';
        }
         if(value.indexOf('#')>-1){
           let index = value.indexOf("#");
           return value.substr(index+1);
        }
    }
  }
}
</script>
<style scoped>
 
   .multipleApprDialog{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
  }
  .container{
     padding: 0px 12px 10px;
  }
  .multipleApprDialog p{
    color: #444;
    margin:10px 0;
  }
  .multipleApprDialog .btn{
    text-align: right;
    margin:10px;
  }
  .multipleApprDialog .plainBtn{
      border-color: #409eff;
      color: #409eff;
      font-size: 14px;
      margin-right:10px;
  }
  .tip{
    font-size: 16px;
    font-weight: 500;
  }
  .wfNames{
     border: 1px solid #e8e8e8;
    background-color: #f5f5f5;
    border-radius: 2px;
    padding: 0px 10px;
    margin-bottom: 8px;
    position: relative;
  }
</style>
