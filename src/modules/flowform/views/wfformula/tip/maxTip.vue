<template>
    <div  class="funcTip">

        <p class="funcTip-title">
            <span class="funcTip-text-color">MAX</span> 最大值函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">MAX</span> ([列表]) 或
                     <span class="funcTip-text-color">MAX</span> (数据1，数据2...)
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">MAX</span> ([1,2,3])  返回3 <br/>
                    <span class="text-color">MAX</span> (1,2,3)  返回3
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">注意：</span>
                </el-col>
                <el-col :span="21">
                     <p >有两种参数的形式，直接选取数据方阵某列，或者多个普通数据(普通组件)</p>
                </el-col>
            </el-row>

         
        </div>
    </div>
</template>

<script>
export default{
    name:'maxTip',
    components: {},
    props: {
       
    },
    data() {
        return {
            
        };
    },
    created(){
        
    },
    computed:{
         
    },
    methods: {
      

       
    },
    watch: {

    }
}

</script>
<style scope>

</style>
