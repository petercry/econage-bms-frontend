<template>
    <el-drawer custom-class='spotCheckDrawer' :wrapperClosable='false' :destroy-on-close='true'
        :before-close='drawerBeforeClose' size='1100px' :modal='false' :append-to-body='true' :visible.sync="drawerShow"
        :with-header="true">
        <div slot='title' class='drawerHeader' v-if='goRoute == "vehicleInfoList" || goRoute == "spotCheckPage"'>
            <span>{{drawerTitle}}</span>
            <div class='planBox'>
                <span class='plan-item' @click='changePlanActive(0)' :class='{active:activeIndex==0}'>车型信息</span>
                <!-- <span class='plan-item' @click='changePlanActive(1)' :class='{active:activeIndex==1}'>法规点检</span> -->
            </div>
        </div>
        <div slot='title' class='drawerHeader' v-if='goRoute == "editCopingoutcomes" || (goRoute.includes("editPage"))'>
            <span class='goBtn' @click='goBack(true)'><&ensp;返回</span>
            <span>&ensp;|<span>&ensp;{{drawerTitle}}</span></span>
            <el-button class='saveBtn updateN' @click='updatenCase'  size="mini" type='plain' v-show='(goRoute=="editPage2" || goRoute=="editPage3")'>退回</el-button>
            <el-button class='saveBtn' type="primary" :style="{right:((goRoute=='editPage2'||goRoute=='editPage3')?'85px':'20px')}" size="mini" @click="onSubmit">{{saveTitle[goRoute]}}</el-button>
        </div>
        <div class="content" v-if='isShowDrawer'>
            <transition name="router-fade" mode="out-in">
                <keep-alive>
                     <router-view ref='routeChi' @changeDrawerInfo='changeDrawerInfo'></router-view>
                </keep-alive>
            </transition>
        </div>
    </el-drawer>
</template>
<script>
    var _self;
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    export default {
        data() {
            return {
                activeIndex: 0,
                drawerShow: false,
                saveTitle:{'editPage1':'保存','editPage2':'提交','editPage3':'同意','editCopingoutcomes':'保存'}
            }
        },
        created() {
            _self = this;
        },
        computed: {
            isEdit() {
                return this.caseType !== 'viewCase'
            },
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
        methods: {
            updatenCase(){
                this.$refs.routeChi.updatenCase();
            },
            onSubmit() {
                this.$refs.routeChi.onSubmit();
            },
            goBack(isShowBox) {
                if (this.goRoute == 'editCopingoutcomes') {
                    var doit = function () {
                        _self.changeDrawerInfo({
                            caseType: 'viewCase',
                            goRoute: 'vehicleInfoList',
                            drawerTitle: '',
                            paramsValue: {
                                standardRegulationNo: _self.paramsValue.standardRegulationNo
                            }
                        })
                    }
                }else if(this.goRoute.includes('editPage')){
                    // this.goRoute == 'editPage1'
                    var doit = function (){
                        _self.changeDrawerInfo({
                            goRoute:'spotCheckPage',
                            caseType:'viewCase',
                            drawerTitle:"",
                            paramsValue:{
                                standardRegulationNo: _self.paramsValue.standardRegulationNo
                            }
                        })
                    }
                }
                if (isShowBox) {
                    EcoMessageBox.confirm(`您确定要返回上一级吗?`, '提示', { type: 'warning', lockScroll: false }, doit)
                } else {
                    doit();
                }
            },
            changeDrawerInfo(obj) {
                this.$emit('changeDrawerInfo', obj);
            },
            initDrawerInfo(bool) {
                this.$emit('initDrawerInfo', bool);
            },
            changePlanActive(active) {
                if (this.activeIndex == active) {
                    return;
                }
                let obj = {
                    caseType: 'viewCase',
                    goRoute: '',
                    drawerTitle: '',
                    paramsValue: {
                        standardRegulationNo: this.paramsValue.standardRegulationNo
                    }
                }
                this.activeIndex = active;
                if (this.activeIndex == '0') {
                    obj.goRoute = 'vehicleInfoList'
                    this.changeDrawerInfo(obj)
                } else {
                    obj.goRoute = 'spotCheckPage'
                    this.changeDrawerInfo(obj)
                }
            },
            drawerBeforeClose(done) {
                // && this.activeIndex == 0
                if (this.isEdit) {
                    let keyArr = { 'editCase': '编辑', 'viewCase': '查看', 'addCase': '新增' };
                    let doit = function () {
                        _self.initDrawerInfo(false);
                        _self.activeIndex = 0;
                        done();
                    }
                    EcoMessageBox.confirm(`您确定要放弃${keyArr[this.caseType]}操作吗?`, '提示', { type: 'warning', lockScroll: false }, doit)
                } else {
                    this.initDrawerInfo(false);
                    this.activeIndex = 0;
                    done();
                }
            },
        },
        watch: {
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
                        if(this.paramsValue.toDoStep){
                            //待办
                            this.$nextTick(function () {
                                this.$router.push({ name: this.goRoute, params: this.paramsValue,query:{toDoStep:this.paramsValue.toDoStep}});
                            })  
                        }else{
                            this.$nextTick(function () {
                                this.$router.push({ name: this.goRoute, params: this.paramsValue });
                            })  
                        }
                      
                    }
                } else {
                    this.$router.replace({ name: 'taskMaintenance' });
                }
            }
        }
    }
</script>
<style scoped>
    .spotCheckDrawer .drawerHeader {
        display: flex;
        position: relative;
    }

    .spotCheckDrawer .drawerHeader>span {
        color: #000;
        font-weight: 700;
        font-size: 15px;
    }

    .spotCheckDrawer .drawerHeader .planBox {
        margin-left: 20px;
    }

    .spotCheckDrawer .drawerHeader .plan-item {
        border-radius: 5px 5px 0px 0px;
        display: inline-block;
        background: transparent;
        font-size: 13px;
        color: #000;
        padding: 12px 20px;
        border: 1px solid #f0f0f0;
        border-bottom: 0px;
        cursor: pointer;
        user-select: none;
    }

    .spotCheckDrawer .drawerHeader .plan-item+.plan-item {
        margin-left: 10px;
    }

    .spotCheckDrawer .drawerHeader .plan-item.active {
        background: rgb(75, 150, 238);
        color: #fff;
    }

    .spotCheckDrawer .drawerHeader .saveBtn {
        position: absolute;
        background: rgb(75, 150, 238);
        top: 50%;
        transform: translateY(-50%);
    }
    .spotCheckDrawer .drawerHeader .updateN.saveBtn{
        right: 20px;
        background-color: #fff;
    }

    .spotCheckDrawer .content {
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

    .spotCheckDrawer .drawerHeader .goBtn {
        font-weight: 500;
        cursor: pointer;
    }
</style>