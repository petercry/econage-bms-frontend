<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">TONUMBER</span> 文本转数值
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">TONUMBER</span> ( 文本内容 )
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">TONUMBER</span> ("2020") <br > 返回数字格式2020
                </el-col>
            </el-row>
         
        </div>
    </div>
</template>

<script>
export default{
    name:'tonumberTip',
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
