<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">MID</span> 字符串截取函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">MID</span> ( 文本内容，起始位置，截取长度 )
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">MID</span> ( 出差申请单,3,3 ) <br > 返回截取后的文本“申请单”
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">注意：</span>
                </el-col>
                <el-col :span="21">
                     <p >第二个参数需要为正整数,第三个参数需要为正数</p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default{
    name:'midTip',
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
