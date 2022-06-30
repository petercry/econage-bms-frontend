<template>
    <div>
        <!-- 页签列 -->
    <div class="pages">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in routeList" :key="index"></el-tab-pane>
        </el-tabs>
    </div>
    <!-- 展现内容 -->
    <div class="content">
        <router-view></router-view>
    </div>

    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            activeName: '',
            routeList: [{label: '初评', name: 'initialEvaluation'}, {label: '盲评及评比结论', name: 'evaluationConclusion'}, {label: '盲审分组', name: 'blindtrialGrouping'}]
        }
    },
    created() {
    },
    mounted() {
        this.activeName = this.routeList[0].name
        this.$router.push({name: this.activeName})
    },
    methods: {
        handleClick(e) {
            if (e.name != '') {
                this.$router.push({name: e.name})
            }
        }
    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.pages {
    padding: 0px 24px;
}
.content {
}
</style>
