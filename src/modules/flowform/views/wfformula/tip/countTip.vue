<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">COUNT</span> 计数函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">COUNT</span> ([列表])
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">COUNT</span> (数据方阵) <br > 返回 数据方阵的行数
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default{
    name:'countTip',
    components: {},
    props: {
       
    },
    data() {
        return {
            
        };
    },
    created(){
        
    },
   
    methods: {
       
    },
    
}

</script>
<style scope>

</style>
