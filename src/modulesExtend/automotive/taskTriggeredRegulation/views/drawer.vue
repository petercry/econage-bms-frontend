<template>
    <el-drawer custom-class='taskDrawer' :wrapperClosable='false' :destroy-on-close='true'  :before-close='drawerBeforeClose' size='1100px' :modal='false' :append-to-body='true' :visible.sync="drawerShow"
    :with-header="true">
    <div slot='title' class='drawerHeader'>
        <span>{{drawerTitle}}</span>
        <el-button class='saveBtn' type="primary"  size="mini" @click="onSubmit">保存</el-button>
    </div>
    <div class="content" v-if='isShowDrawer'>
        <transition name="router-fade" mode="out-in" >
            <router-view ref='routeChi' v-on='$listeners'></router-view>
            <!-- <keep-alive>
                
            </keep-alive> -->
        </transition>
    </div>
   
   </el-drawer>


</template>
<script>
    var _self;
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    export default {
        data(){
            return {
               drawerShow: false,
               keyArr:{ 'editCase': '编辑', 'viewCase': '查看', 'addCase': '新增' }
            }
        },
        props: {
            caseType: {
                type: String,
                default: ''
            },
            isShowDrawer: {
                type: Boolean,
                default: false
            },
            drawerTitle: {
                type: String,
                default: ''
            },
            goRoute: {
                type: String,
                default: ''
            },
            paramsValue: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        created(){
            _self=this;
        },
        computed:{
            isEdit() {
                return this.caseType !== 'viewCase'
            },
        },
        methods:{
            onSubmit() {
                this.$refs.routeChi.onSubmit();
            },
            initDrawerInfo(bool) {
                this.$emit('initDrawerInfo', bool);
            },
            drawerBeforeClose(done) {
                if (this.isEdit) {
                    let doit = function () {
                        _self.initDrawerInfo(false);
                        done();
                    }
                    EcoMessageBox.confirm(`您确定要放弃${_self.keyArr[this.caseType]}操作吗?`, '提示', { type: 'warning', lockScroll: false }, doit)
                } else {
                    this.initDrawerInfo(false);
                    done();
                }
            },
        },
        watch:{
            isShowDrawer(n) {
                this.drawerShow = n;
            },
            goRoute(n) {
                if (n) {
                    if (JSON.stringify(this.paramsValue) === '{}') {
                        this.$nextTick(function () {
                            this.$router.push({ name: this.goRoute });
                        })
                    } else {
                        console.log(this.paramsValue,'this.paramsValue');
                        this.$nextTick(function () {
                            this.$router.push({ name: this.goRoute, params: this.paramsValue});
                        })  
                    }
                }else{
                        this.$router.replace({name:'regulatoryChangePoints'})
                }
            }
        }
    }
</script>
<style>
    .taskDrawer .drawerHeader {
        display: flex;
        position: relative;
    }

    .taskDrawer .drawerHeader>span {
        color: #000;
        font-weight: 700;
        font-size: 15px;
    }

    .taskDrawer .drawerHeader .saveBtn {
        position: absolute;
        background: rgb(75, 150, 238);
        top: 50%;
        transform: translateY(-50%);
        right: 20px;
    }
    .taskDrawer .content {
        position: absolute;
        left: 0;
        right: 0;
        /* top: 50px; */
        top: 62px;
        bottom: 0px;
        background-color: #fff;
        z-index: 100;
        overflow-y: auto;
    }
</style>