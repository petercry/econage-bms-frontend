<template>
    <el-dialog  :title="dialog.title" :visible.sync="show" :width="dialog.width+'px'" :top="dialog.top"  :append-to-body="true" @close="clear" @closed="closedDialog" :close-on-click-modal="false" :show-close="true"  :close-on-press-escape="false">
        <iframe ref="openIframe"  v-bind:src="dialog.url" frameborder="0" style="width:100%;"  v-bind:style="{'height':dialog.height+'px'}"/>
   </el-dialog>
</template>
<script>
    export default {
        data(){
            return {
                show :false
            }
        },
        props:{
            dialog:{
                type:Object,
                default(){return {}}
            }
        },
        methods:{
            clear(){
                this.show = false;
            },
            closedDialog(){
                 window.portalIndex.changeDialog({
                    title:'',
                    show:false,
                    width:'',
                    height:'',
                    top:'',
                    url:''
                 })
            }
        },
         created(){
             this.show = this.dialog.show;
         },watch:{
            ['dialog.show']:{
                handler(n){
                    this.show = n;
                },
                immediate:false
            }
        }
    }
</script>
<style scoped>

</style>