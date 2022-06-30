<template>
  <div class="wfSeqIndexEditVue setting">

       <el-form ref="form" :model="baseInfo" label-width="120px" label-position="left">
            
             <el-form-item label="序列名称" :required=true>
                    <el-input v-model="baseInfo.name" ref="wfSeqIndexName"></el-input>
             </el-form-item>

             <el-form-item label="位数" :required=true>
                  <el-input-number v-model="baseInfo.segSize"  :min="1" :max="9"></el-input-number>
             </el-form-item>

             <el-form-item label="位数溢出规则" :required=true>
                    <el-radio-group v-model="baseInfo.overflowLg" >
                        <el-radio-button  :key="item.id" :label="item.id" v-for="item in overflowLgArr">{{item.desc}}</el-radio-button>
                    </el-radio-group>
             </el-form-item>

             <el-form-item label="重置周期" :required=true>
                     <el-select v-model="baseInfo.resetCycl"  placeholder="请选择规则">
                        <el-option
                            v-for="item in resetCyclArr"
                            :key="item.id"
                            :label="item.desc"
                            :value="item.id">
                        </el-option>
                    </el-select>
             </el-form-item>

              <el-form-item label="当前序号" :required=true>
                 <el-input 
                    :value="baseInfo.currVal"
                    ref="wfSeqIndexCurrVal"
                    @input="defaultIdInput"
                    @keypress.native="defaultIdOnKeyPress"
                 ></el-input>
             </el-form-item>
          
       </el-form>
       
        <div class="btn">
                 <el-button @click="cancelFunc">取消</el-button>
                 <el-button type="primary" @click="editWFSeqIndexFunc">确认编辑</el-button>
        </div>

  </div>
</template>
<script>

  import {getWFSeqIndexDetailAjax,editWFSeqIndexAjax} from '@/flowform/service/service'
  import {sysEnv} from '@/flowform/config/env.js'
  import {Loading } from 'element-ui';
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  
  export default {
      components:{
          
      },
      data(){
          return{
             baseInfo:{
                name:'',
                segSize:4,
                overflowLg:0,
                resetCycl:1,
                currVal:1,
                id:"",
             },
             constraintType:2, //正整数
             overflowLgArr:[],
             resetCyclArr:[],
          }
      },

      created(){
          
      },
      mounted(){
            this.init();  
      },
      computed:{
         
      },
      methods: {
          init(){
              this.baseInfo.id = this.$route.params.id;
              this.overflowLgArr.push({id:0,desc:'全部显示'});
              this.overflowLgArr.push({id:1,desc:'自动截断'});
              this.resetCyclArr.push({id:1,desc:'基于前后缀自动重置'});
              this.resetCyclArr.push({id:2,desc:'每天重置（凌晨12点）'});
              this.resetCyclArr.push({id:3,desc:'每周重置（周天凌晨12点）'});
              this.resetCyclArr.push({id:4,desc:'每月重置（月末凌晨12点）'});
              this.resetCyclArr.push({id:5,desc:'每年重置（年末凌晨12点）'});
              this.getWFSeqIndexDetailFunc();
          },

        getWFSeqIndexDetailFunc(){
                getWFSeqIndexDetailAjax(this.baseInfo.id).then((response)=>{
                        if(response.data.success){
                            this.baseInfo.name = response.data.queryObj.name;
                            this.baseInfo.segSize = response.data.queryObj.segSize;
                            this.baseInfo.overflowLg = response.data.queryObj.overflowLg;
                            this.baseInfo.resetCycl = response.data.queryObj.resetCycl;
                            this.baseInfo.currVal = response.data.queryObj.currVal;
                        }
                })
        },

         defaultIdInput(val){
                if(EcoUtil.isNumber(val,this.constraintType)){
                    this.baseInfo.currVal = val; 
                }
         },

         defaultIdOnKeyPress(event){
            if(event.keyCode < 45 || event.keyCode > 57){
                    event.returnValue = false; 
            }else{
                if(event.keyCode == 45 || event.keyCode == 46){ //负号 小数点
                    event.returnValue = false; 
                }
            }              
        },

        editWFSeqIndexFunc(){
              let that = this;
              if(!this.baseInfo.name || this.baseInfo.name == ''){
                    EcoMessageBox.alert('序号名称 必须填写','提示',
                        {
                            callback: action => {
                                that.$refs.wfSeqIndexName.focus();
                            }
                        }
                    );
                    return;
              }

              if(!this.baseInfo.currVal || this.baseInfo.currVal == ''){
                    EcoMessageBox.alert('当前序号 必须填写','提示',
                        {
                            callback: action => {
                                that.$refs.wfSeqIndexCurrVal.focus();
                            }
                        }
                    );
                    return;
              }

              if(!EcoUtil.isNumber(this.baseInfo.currVal,2)){
                     EcoMessageBox.alert('当前序号 必须是正整数','提示',
                        {
                            callback: action => {
                                that.$refs.wfSeqIndexCurrVal.focus();
                            }
                        }
                    );
                    return;
              }     
         
          
              let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存中...'});
              editWFSeqIndexAjax(this.baseInfo).then((response)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });
                    if(response.data.success){
                            this.successMessage(); 
                            if(sysEnv == 1){
                                let doObj = {}
                                doObj.action = 'wfSeqIndexRefreshBack';
                                doObj.data = {};
                                doObj.close = true;
                                EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }
                    }else{
                         EcoMessageBox.alert(response.data.msgDesc);
                    }
              }).catch((err)=>{
                    this.cancelMessage();
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });
              })
          },

          cancelFunc(){
              EcoUtil.getSysvm().closeDialog();
          },

          successMessage(){
              this.$message({
                     showClose: true,
                     message:'修改成功',
                     type: 'success',
                     duration:2000
               });
          },

          cancelMessage(){
              this.$message({
                     showClose: true,
                     message:'修改失败',
                     type: 'error',
                     duration:2000
               });
          }
      }

  }

</script>

<style scoped>


.wfSeqIndexEditVue{
    padding:0px 20px 20px 20px;
    background-color:#fff;
     height: 310px;
    overflow: hidden;
}

.wfSeqIndexEditVue .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.wfSeqIndexEditVue .content{
    margin-top:5px;
    color:#8c8080
}

.wfSeqIndexEditVue .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
