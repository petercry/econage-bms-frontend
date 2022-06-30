<template>
    <eco-content top="0px" bottom="0px" class="eviAdd" >
        <eco-content top="0px" bottom="50px" >
            <el-form ref="form" :model="baseInfo" label-width="100px" label-position="right" style="margin-left:10px;margin-right:10px;">
                <el-form-item label="建设业态" prop="business"  :rules="[{required: true, message:'建设业态必须填写'}]">
                        <el-select
                            style="width:100%"
                            v-model="baseInfo.business"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option
                                    v-for="(item,index) in kvMap['crp_business']"
                                    :key="index"
                                    :label="item.text"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                </el-form-item>
             
                <el-form-item label="模板名称" prop="name" :rules="[{required: true, message:'模板名称必须填写',trigger: 'blur'}]">
                    <el-input v-model="baseInfo.name" ></el-input>
                </el-form-item>

                 <el-form-item label="备注" prop="comments">
                    <el-input v-model="baseInfo.comments" type="textarea" rows="4"></el-input>
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

  import {addModelNode} from '../../service/service'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoUtil} from '@/components/util/main.js'
  import {EcoKVUtil} from '@/components/util/kv.js'

  export default {
      components:{
          ecoContent,
      },
      data(){
          return{
                baseInfo:{
                    business:null,
                    name:null,
                    comments:null
                },
                kvMap:{
                    crp_business:[], //建设业态
                },
                loading:true,
          }
      },

      created(){
            EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);
      },
      mounted(){
         
      },
      computed:{
         
      },
      methods: {
            createFunc(){
                  let that = this;
                  this.$refs['form'].validate((valid) => {
                      if (valid) {
                            let loadingInstance = Loading.service({ fullscreen: true,text:'正在创建中...'});
                            addModelNode(that.baseInfo).then((response)=>{
                                    that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                        loadingInstance.close();
                                    });
                                    let doObj = {}
                                    doObj.action = 'upModelNodeAddBack';
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
      }

  }

</script>

<style scoped>
.eviAdd{
    padding:0px 20px 20px 20px;
    background-color:#fff;
    margin-right:20px;
    margin-left:20px;
    position: fixed !important;
}

.eviAdd .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.eviAdd .content{
    margin-top:5px;
    color:#8c8080
}

.eviAdd .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
