<template>
    <div class="fileView">
        <el-row>
            <el-col :span='3'>
                <span>附件:</span>
            </el-col>
            <el-col :span='21'>
                <upload :isEdit='false'  :showList='true' :multiple="false" :modular="modular" :modularInnerId="modularInnerId"
                    @fileChange="fileChange" @preView='preView' accept=''>
                    <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                        <i class="el-icon-plus"></i> 上传附件</el-button>
                </upload>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import upload from './upload.vue'
    import { EcoFile } from '@/components/file/main.js'
    export default {
        data(){
            return {

            }
        },
        computed:{
            modular(){
                return this.$route.params.modular;
            },
            modularInnerId(){
                return this.$route.params.modularInnerId;
            }
        },
        components:{
            upload
        },
        methods:{
            fileChange(file,fileList){

            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
        }
    }
</script>
<style scoped>
.fileView{
    height:auto;
    font-size:14px;
}
</style>