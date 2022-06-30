<template>
    <div>test</div>
</template>
<script>
    export default {
        data(){
            return {

            }
        },created () {
            this.$router.replace({name:'index',params:{pageType:"finish"}}) //organization approve finish
        }
    }
</script>
