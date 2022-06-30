<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">GRIDINDX</span> 数据方阵取值函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">GRIDINDX</span>( 数据方阵，行序号，列序号)
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">GRIDINDX</span>([数据方阵] ，1，2) <br > 返回 数据方阵的第1行第2列
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">注意：</span>
                </el-col>
                <el-col :span="21">
                     <p >参数一选取数据方阵</p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default{
    name:'indxTip',
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
