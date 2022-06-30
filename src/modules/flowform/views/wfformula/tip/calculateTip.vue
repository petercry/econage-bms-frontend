<template>
    <div  class="funcTip">

        <p class="funcTip-title">
            <span class="funcTip-text-color">CALCULATE</span> 四则运算函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">CALCULATE</span> (四则表达式)
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">CALCULATE</span> ((1+2)x3) <br > 返回9
                </el-col>
            </el-row>

         
        </div>
    </div>
</template>

<script>
export default{
    name:'calculateTip',
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
