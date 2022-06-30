<template>
<div class="fileContent">
    <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
    <iframe style="height:100%;width:100%;" :src="'/fileManager/file_preview.html?fileHeaderId='+fileHeaderId+'&fileName='+encodeURIComponent(fileName)"></iframe>
</div>
</template>

<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default {
    name: 'fileContent',
    components: {
        ecoLoading
    },
    props: {
        fileHeaderId: '',
        fileName: ''
    },
    data() {
        return {

        }
    },
    mounted() {

    },
    // watch: {
    //     fileHeaderId(nv, ov) {},
    //     fileName(nv, ov) {}
    // }
}
</script>

<style scoped>
.fileContent {
    padding: 20px;
    height: 100%;
}
</style>
