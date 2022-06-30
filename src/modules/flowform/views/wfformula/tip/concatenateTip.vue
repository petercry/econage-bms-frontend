<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">CONCATENATE</span> 字符串拼接
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">CONCATENATE</span> (分隔符，文本1，文本2......)
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">CONCATENATE</span> (#，土木三班，陈同学) <br > 返回“土木三班#陈同学”
                </el-col>
            </el-row>

         
        </div>
    </div>
</template>

<script>
export default{
    name:'concatenateTip',
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
