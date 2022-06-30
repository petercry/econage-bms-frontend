<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">DATEDELTA</span> 日期加减计算函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">DATEDELTA</span>( 基准日期 加减天数 )
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">DATEDELTA</span>( 2018-01-01 ，2) <br > 返回计算后的日期“2018-01-03”
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">注意：</span>
                </el-col>
                <el-col :span="21">
                     <p >需要加减天数，正数为增加，负数为减少</p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default{
    name:'datedeltaTip',
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
