<template>
    <div>
        <el-form model="formData" style="margin: 20px 0px">
            <el-form-item label="发布日期" class="form">
                <el-date-picker>
                </el-date-picker>
                <div style="color:red;margin:15px 0px 30px 0px;">注：请输入日期，生成初始化清单</div>
                <el-button style="margin: 0 auto;display: block;" type="primary">生成</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
export default {
    name:"",
    data() {
        return {

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
    width: 300px;
    padding: 10px 0px;
}
/* @import url(); 引入css类 */

</style>
