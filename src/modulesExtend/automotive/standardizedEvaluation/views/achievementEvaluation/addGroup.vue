<template>
    <div>
        <el-form model="formData" style="margin: 20px 0px">
            <el-form-item label="组号" class="form">
                <el-input type="text" style="width:175px"></el-input>
            </el-form-item>
            <el-form-item label="说明" class="form">
                <el-input type="textarea" style="width:350px"></el-input>
            </el-form-item>
            <el-form-item label="评委" class="form">
                <el-input type="textarea" style="width:350px"></el-input>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button type="primary">保存</el-button>
        </div>
    </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
export default {
    name:"",
    data() {
        return {
            groupList: [
                {text: '帅气男人A组', val: 'A'},
                {text: '帅气男人B组', val: 'B'},
                {text: '帅气男人C组', val: 'C'},
            ]
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
    width: 400px;
    padding: 10px 0px;
}
/* @import url(); 引入css类 */
.btn {
    text-align: center;
}
</style>
