<template>
<div class="fileInfo" v-show="data!=''">
    <fileStandardsCard :data='data' v-if="type==4"></fileStandardsCard>
    <fileForeignCard :data='data' v-if="type==2"></fileForeignCard>
    <fileGuideCard :data='data' v-if="type==3"></fileGuideCard>
    <fileCommonCard :data='data' v-if="type==1"></fileCommonCard>
</div>
</template>

<script>
import fileCommonCard from './fileCommonCard.vue'
import fileForeignCard from './fileForeignCard.vue'
import fileGuideCard from './fileGuideCard.vue'
import fileStandardsCard from './fileStandardsCard.vue'
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'fileInfo',
    props: {
        entryobj: {}
    },
    data() {
        return {
            data: '',
            type:''
        }
    },
    components: {
        fileCommonCard,
        fileForeignCard,
        fileGuideCard,
        fileStandardsCard
    },
    computed: {
        ...mapState(['fileTableNode', 'fileTreeNode', 'type'])

    },
    mounted() {
        this.type= this.$route.params.type
        // console.log(this.$props)
        // for (const key in this.entryobj) {
        //   if (this.entryobj.hasOwnProperty(key)) {
        //    this.form[key] = this.entryobj[key];
        //   }
        // }
        if (this.$props.entryobj) {
            this.data = this.$props.entryobj
        }
    }
}
</script>

<style scoped>
.fileInfo {
    padding: 20px 20px;
}
</style>
