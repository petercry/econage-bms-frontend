<template>
    <div class='editRole'>
        <div class='addForm'>
            <el-form :model='formData' ref='editRoleForm' :rules='rules' v-loading='loading' label-position='right' label-width='145px'>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='查看用户:' prop='a'>
                            <tag-select :disabled='!isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.InitDataStr"
                                :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>selectUser(data,'typeA')">
                            </tag-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label='下载用户:' prop='a'>
                            <tag-select :disabled='!isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.InitDataStr"
                                :initOptions="{selectNum:2,selectType:'User'}" @callBack="(data)=>selectUser(data,'typeB')">
                            </tag-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn" v-if='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    import {} from '../../service/service.js'
    import { EcoUtil } from '@/components/util/main.js'
    export default {
        name:'editRole',
        data(){
            return {
                loading:false,
                formData:{},
                rules:{}
            }
        },
        components:{
            tagSelect
        },
        computed:{
            id(){
                return this.$route.params.id;
            },
            caseType(){
                return this.$route.params.caseType
            },
            isEdit() {
                return this.caseType !== 'viewCase'
            }
        },
        created(){
            if (this.id && this.id != 0) {
                this.getDetailsInfo(); 
            }
        },
        methods:{
            selectUser(data,type){
                if (!data.id && data.itemArray.length === 0) {
                       if(type){
                        // this.infoListTwo[index].contactInitDataStr = '';
                        // this.infoListTwo[index].contactList = [];
                       }else{
                           
                       }
                }else{
                        if(type){
                            this.infoListTwo[index].contactList = data.itemArray;
                        }else{
                            
                        }
                   
                }


            },
            getDetailsInfo(){
                this.loading = true;
                // (this.id).then(res=>{
                //     this.loading = false;
                    //    obj.contactList.forEach((item2, index2) => {
                    //         if (index2 == 0) {
                    //             contactInitDataStr = `{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                    //         } else {
                    //             contactInitDataStr += `|{"type":"${item2.type}","orgId":"${item2.orgId}","linkId":"${item2.linkId}"}`;
                    //         }
                    //     })
                // })

            },
            onCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            onSubmit() {
                this.$refs.editRoleForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = {
                            id:this.id,

                        }
                        // ().then(res=>{
                        //     this.loading = false;
                        //     let doObj = {};
                        //     doObj.action = 'editRole';
                        //     doObj.data = {};
                        //     doObj.close = true;
                        //     EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        // })
                    }else{
                        return false
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .editRole {
        background: #fff;
        height: 100%;
    }

    .editRole .btn {
        text-align: center;
        padding: 10px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
    }

    .editRole .addForm {
        overflow: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        padding: 0 10px;
    }
    .editRole .viewContent {
        color: #606266;
    }

</style>