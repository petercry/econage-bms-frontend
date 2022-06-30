<template>
        <div class="opsymbolParams">
                <div class="itemVueName">运算符 参数设置</div>
                <div class="setting">
                    <span>暂无</span>
                </div>
        </div>
</template>

<script>

import EcoUtil from '@/components/util/main';
import {mapState,mapMutations} from 'vuex'

export default{
    name:'opsymbolSetting',
    components: {},
    data() {
        return {
            
        };
    },

    computed: {
       
    },
    created(){
      
    },
    methods: {

    },
    watch: {
       
    }
}

</script>
<style scope>


.opsymbolParams .setting{
    margin:10px 10px 50px 20px;
}

.opsymbolParams .itemVueName{
    Font-weight: bold;
    padding: 0 16px 0px 20px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
}

.opsymbolParams .ecoSettingBlock{
    margin-bottom:10px;
}

.opsymbolParams .ecoSettingDesc .title{
    font-size: 14px;
    color: #606266;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: left;
}
.opsymbolParams .ecoSettingDesc .del{
    font-size: 12px;
    color: #f56c6c;
    height: 32px;
    line-height: 32px;
    font-weight: bold;
    text-align: right;
    cursor: pointer;
}


.opsymbolParams .ecoSettingDesc .note{
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    color: #8b8b8b;
    font-weight: normal;
    text-align: right;
}


.opsymbolParams .funcItem{
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    position: relative;
}

.opsymbolParams .funcItem:hover{
    background-color:rgb(233,250,255);
}

.opsymbolParams .plainBtn{
    border-color: #409eff;
    color: #409eff;
    font-size: 14px;
    margin-right:10px;
}

</style>
