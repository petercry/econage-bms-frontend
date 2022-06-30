<template>
    <div>
        <el-form model="formData" style="margin: 20px 0px">
            <el-form-item label="组号" class="form">
                <el-select v-model="groupNum" style="margin-bottom:30px">
                    <el-option v-for="(item,index) in groupList" :key="index" :label="item.text" :value="item.val"></el-option>
                </el-select>
                <el-button style="margin: 0 auto;display: block;" type="primary">保存</el-button>
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
    width: 300px;
    padding: 10px 0px;
}
/* @import url(); 引入css类 */

</style>
