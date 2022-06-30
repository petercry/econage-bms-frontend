<template>
    <div  class="funcTip">

        <p  class="funcTip-title">
            <span class="funcTip-text-color">RMBUPPER</span> 大写金额函数
        </p>

        <div class="funcTip-item">
            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">用法：</span>
                </el-col>
                <el-col :span="21">
                     <span class="funcTip-text-color">RMBUPPER</span> ( 数字 )
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">示例：</span>
                </el-col>
                <el-col :span="21">
                    <span class="text-color">RMBUPPER</span> (34567.567) <br > 返回“叁万伍仟肆佰伍拾柒元伍角陆分柒厘”
                </el-col>
            </el-row>

            <el-row class="funcTip-name">
                <el-col :span="3">
                     <span class="funcTip-tit">注意：</span>
                </el-col>
                <el-col :span="21">
                     <p >最多保留三位小数”</p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default{
    name:'rmbupperTip',
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
