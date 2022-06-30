<template>
    <div>
        <el-form model="formData" style="margin: 20px 0px">
            <el-form-item label="填写意见" class="form">
                <el-input style="width:400px;margin-bottom:50px;height:200px;" type="textarea" v-model="formData.val"></el-input>
            </el-form-item>
            <el-button style="margin: 0 auto;display: block;" type="primary">保存</el-button>
        </el-form>
    </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
export default {
    name:"",
    data() {
        return {
            formData: {
                val: "456"
            }
        }
    },
    components:{
        ecoContent
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>
<style scoped>
.form {
    margin: 0 auto;
    width: 500px;
    padding: 10px 0px;
}
/* @import url(); 引入css类 */
</style>
<style>
.el-textarea__inner {
    height: 100%;
}
</style>
