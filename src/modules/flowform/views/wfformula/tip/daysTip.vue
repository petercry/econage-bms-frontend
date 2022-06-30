<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">DAYS</span> 天数计算函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">DAYS</span>( 开始时间 结束时间 )
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">DAYS</span>( 2018-01-01 ，2018-01-02) <br > 返回相差的天数“1”
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">注意：</span>
                </el-col>
                <el-col :span="21">
                     <p >只能选择日期时间类型的字段，或者输入格式为“yyyy-mm-dd”</p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default{
    name:'daysTip',
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
