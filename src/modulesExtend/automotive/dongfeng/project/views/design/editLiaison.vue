<template>
    <eco-content top="0px" bottom="0px" class="editLiaison">
        <eco-content top="20px" bottom="50px">
            <el-form ref="form" :model="baseInfo" label-width="70px" label-position="right"
                style="padding-right:20px;">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="设计师" ref='designer' prop="designerId"  :rules="[{required: true, message:'设计师必选项',trigger: 'change'}]">
                            <tag-select placeholder="请选择人员" style="width: 100%;vertical-align: top;"
                                :initOptions="{selectNum:1,selectType:'user'}" @callBack="selectUser">
                            </tag-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </eco-content>
        <eco-content bottom="0px" height="50px">
            <div class="btn">
                <el-button @click="cancelFunc">取消</el-button>
                <el-button type="primary" @click="saveFun">保存</el-button>
            </div>
        </eco-content>

    </eco-content>
</template>
<script>
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { projectDesignerUpdate } from "../../service/service";
    import tagSelect from "@/components/orgPick/tagSelect.vue";
    export default {
        components: {
            ecoContent,
            tagSelect,
        },
        data() {
            return {
                taskId: [],
                baseInfo: { designerId:''},
                projectId: ''
            };
        },
        created() {
            this.taskId = JSON.parse(this.$route.params.taskId);
            this.projectId = this.$route.params.proId;
        },
        methods: {
            selectUser(data) {
                if (data.itemArray.length > 0) {
                    this.baseInfo.designerId= data.itemArray[0].linkId;
                    this.$refs.designer.clearValidate();
                } else {
                    this.baseInfo.designerId = '';
                    this.$refs.form.validateField('designer');
                }
            },
            cancelFunc() {
                EcoUtil.getSysvm().closeDialog();
            },
            saveFun() {
                this.$refs.form.validate((valid) => {
                   if(valid){
                        let params = {
                        projectId: this.projectId,
                        ids: this.taskId,
                        designerId: this.baseInfo.designerId
                    }
                    projectDesignerUpdate(params).then(res => {
                        console.log(res.data);
                        if(res.data){
                            let doObj = {};
                            doObj.action = "editLiaison";
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        }
                    })
                   }else{
                       return false
                   }

                })
            },
        },
    };
</script>
<style scoped>
    .editLiaison {
        padding: 0px 20px 20px 20px;
        background-color: #fff;
    }

    .editLiaison .btn {
        text-align: right;
        margin-right: 10px;
        margin-top: 10px;
    }

    .editLiaison .content {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #E4E7ED;
        border-radius: 4px;
        background-color: #F5F7FA;
        color: #C0C4CC;
        padding: 0 15px;
    }
</style>