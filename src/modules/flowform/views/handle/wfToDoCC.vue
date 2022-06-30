<template>
    <div class="wfToDoCCVue">

        <el-form  :model="baseInfo" label-width="80px" >
                <el-form-item label="接收人">
                        <tag-select 
                                style="width:100%;" 
                                :placeholder="'请选择人员'" 
                                :initDataStr="baseInfo.assignHiddenValue" 
                                :initOptions="assignOptions" 
                                @callBack="selectUser" >
                        </tag-select>
                </el-form-item>

                 <el-form-item label="内容">
                    <el-input v-model="baseInfo.content" ref="content" type="textarea"  :autosize="{ minRows:3,maxRows:15}"  ></el-input>
                </el-form-item>

        </el-form>

         <div class="btn">
                 <el-button @click="onCancel">取消</el-button>
                 <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>

    </div>
</template>
<script>

import {doWFToDoCCSend} from '../../service/service.js'
import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import {Loading} from 'element-ui';
import tagSelect from '../../views/direction/module/tagSelect.vue'

 export default {
     components:{
         tagSelect
     },
     data(){
         return{
             baseInfo:{
                 operateId:'',
                 assignValue:'',
                 assignHiddenValue:'',
                 title:'',
                 content:'',
             },
             assignOptions:{
                 selectNum:0,
                 selectType:'Dept-User',
                 maxOrgPathLevel:0
             }
         }
     },
     computed:{
         
     },
     created(){

     },
     mounted(){
            this.baseInfo.operateId = this.$route.params.operateId;
     },
     methods: {
            selectUser(data){
                this.baseInfo.assignHiddenValue = data.id;
                this.baseInfo.assignValue = data.name;
            },

            onSubmit(){
                   
                    if(this.baseInfo.assignValue == ''){
                            EcoMessageBox.alert('接收人必须选择','',{
                                callback: action => {
                                    this.selectUser();
                                }
                            });
                            return ;
                    }
                    let loadingInstance = Loading.service({ fullscreen: true,text:'正在提交...'});
                    doWFToDoCCSend(this.baseInfo).then((response)=>{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                            });
                            if(response.data.status <=99){
                                    this.$message({
                                            message: '保存成功',
                                            type: 'success'
                                    });
                                    setTimeout(function(){
                                          EcoUtil.getSysvm().closeDialog();
                                    },1000)
                                   
                           }else{
                                EcoMessageBox.alert(response.data.msg);
                           }
                    }).catch((err)=>{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                            });
                    })

            },
            
            onCancel(){
                     EcoUtil.getSysvm().closeDialog();
            }
       
     },
     watch: {

    },
    filters:{
       
    }

 }
</script>

<style scope>
.wfToDoCCVue{
    background-color:#fff;
    padding:10px;
    min-height:380px;
}

.wfToDoCCVue .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
