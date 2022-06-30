<template>
  <div class="wfSeqIndexAddVue setting">

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

              <el-form-item label="初始值" :required=true>
                 <el-input 
                    :value="baseInfo.initVal"
                    ref="wfSeqIndexInitVal"
                    @input="defaultIdInput"
                    @keypress.native="defaultIdOnKeyPress"
                 ></el-input>
             </el-form-item>
          
       </el-form>
       
        <div class="btn">
                 <el-button @click="cancelFunc">取消</el-button>
                 <el-button type="primary" @click="createWFSeqIndexFunc">开始创建</el-button>
        </div>

  </div>
</template>
<script>

  import {createWFSeqIndexAjax} from '@/flowform/service/service'
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
                initVal:1,
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
              this.overflowLgArr.push({id:0,desc:'全部显示'});
              this.overflowLgArr.push({id:1,desc:'自动截断'});

              this.resetCyclArr.push({id:1,desc:'基于前后缀自动重置'});
              this.resetCyclArr.push({id:2,desc:'每天重置（凌晨12点）'});
              this.resetCyclArr.push({id:3,desc:'每周重置（周天凌晨12点）'});
              this.resetCyclArr.push({id:4,desc:'每月重置（月末凌晨12点）'});
              this.resetCyclArr.push({id:5,desc:'每年重置（年末凌晨12点）'});
          },

         defaultIdInput(val){
                if(EcoUtil.isNumber(val,this.constraintType)){
                    this.baseInfo.initVal = val; 
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

          createWFSeqIndexFunc(){
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

              if(!this.baseInfo.initVal || this.baseInfo.initVal == ''){
                    EcoMessageBox.alert('初始值 必须填写','提示',
                        {
                            callback: action => {
                                that.$refs.wfSeqIndexInitVal.focus();
                            }
                        }
                    );
                    return;
              }


              if(!EcoUtil.isNumber(this.baseInfo.initVal,2)){
                     EcoMessageBox.alert('初始值 必须是正整数','提示',
                        {
                            callback: action => {
                                that.$refs.wfSeqIndexInitVal.focus();
                            }
                        }
                    );
                    return;
              }     
         
              let loadingInstance = Loading.service({ fullscreen: true,text:'正在创建中...'});
              createWFSeqIndexAjax(this.baseInfo).then((response)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });
                    if(response.data.success){
                            let doObj = {}
                            doObj.action = 'wfSeqIndexRefreshBack';
                            doObj.data = {};
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }else{
                         EcoMessageBox.alert(response.data.msgDesc);
                    }
              }).catch((err)=>{
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });
              })
          },

          cancelFunc(){
              EcoUtil.getSysvm().closeDialog();
          }
      }

  }

</script>

<style scoped>


.wfSeqIndexAddVue{
    padding:0px 20px 20px 20px;
    background-color:#fff;
    height: 310px;
    overflow: hidden;
}

.wfSeqIndexAddVue .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.wfSeqIndexAddVue .content{
    margin-top:5px;
    color:#8c8080
}

.wfSeqIndexAddVue .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
