<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="knowLedgeList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="55px" type="tool" style="border-bottom:1px solid #ddd;overflow: hidden;">
                <el-row style="padding:14px 10px;background-color:#fff;">
                    <el-col :span="24">
                        <el-input v-model="srchTxt" type="text" style="width:200px;marginLeft:10px;verticalAlign:middle" placeholder="搜索知识库名称" @keyup.enter.native="handleSearchClick"> <i class="el-icon-search el-input__icon" slot="suffix" style="cursor:pointer" @click="handleSearchClick"></i></el-input>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content bottom="0" top="56px" id="contentList" style="padding:10px 15px;">
                <div class="list-content">
                    <el-row :gutter="60">
                        <el-col :span="8" v-for="item in itemList" :id="'d_'+item.id" :key="item.key" style="margin-bottom: 30px;cursor:pointer">
                            <el-card class="box-card" shadow="never" @click.native="goDetail(item)">
                                <div slot="header" class="clearfix">
                                    <i class="el-icon-folder" style="color:#26a3da;fontWeight:700;fontSize:24px;verticalAlign:middle"></i>
                                    <span style="marginLeft:8px;verticalAlign:middle" v-bind:class="searchList.indexOf(item.id)>-1?'searchItem':''">{{item.name}}</span>
                                </div>
                                <div class="text item" style="fontSize:16px;height: 60px;overflow: hidden;box-sizing: border-box;" v-if="item.summary!=null">
                                    {{item.summary}}
                                </div>
                                <div v-else class="text item" style="fontSize:16px;height: 60px;overflow: hidden;box-sizing: border-box;">
                                    暂无简介
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </eco-content>
        </div>
        <!-- <transition name="slide" mode='out-in'>
           
        </transition>-->
         <router-view></router-view>
    </eco-content>
    </template>
    
    <script>
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { sysEnv } from '../config/env.js'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { getKnowledgeLibCard } from '../service/service.js'
    export default {
        name: 'knowLedgeList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        data() {
            return {
                itemList: [],
                oldSrchTxt: '',
                searchList: [],
                srchTxt: '',
                currtId: "",
                params: {
                    sort: 'createDate',
                    order: 'desc',
                    category: '4',
                }
            }
        },
        created() {
        },
        mounted() {
            this.getKnowledgeList()
        },
        methods: {
            getKnowledgeList() {
                this.$refs.ecoLoadingRef.open();
                getKnowledgeLibCard(this.params).then(res => {
                    this.$refs.ecoLoadingRef.close();
                    this.itemList = res.data
                })
            },
            // 搜索
            handleSearchClick() {
                if (this.oldSrchTxt != this.srchTxt) {
                    this.searchList = (this.srchTxt) ? this.itemList.filter(item => {
                        return item.name.indexOf(this.srchTxt) > -1;
                    }).map(item => item.id) : [];
                    this.$nextTick(() => {
                        if (this.searchList.length == 0) {
                            this.$message({
                                // message: this.$t('msg.srchResultNone'),
                                message: "没有搜索到任何知识库",
                                type: 'error'
                            });
                        } else {
                            this.currtId = this.searchList[0];
                            let firstElem = document.getElementById('d_' + this.currtId);
                            if (firstElem.offsetTop > window.innerHeight) {
                                document.getElementById('contentList').scrollTo(0, firstElem.offsetTop - window.innerHeight / 2)
                            } else {
                                document.getElementById('contentList').scrollTo(firstElem.offsetTop - window.innerHeight / 2, 0)
                            }
                        }
                    });
                    this.oldSrchTxt = this.srchTxt;
                } else {
                    let index = this.searchList.indexOf(this.currtId);
                    this.currtId = this.searchList[index];
                    let moveElem = document.getElementById('d_' + this.currtId);
                    if (moveElem.offsetTop > window.innerHeight) {
                        document.getElementById('contentList').scrollTo(0, moveElem.offsetTop - window.innerHeight / 2)
                    } else {
                        document.getElementById('contentList').scrollTo(moveElem.offsetTop - window.innerHeight / 2, 0)
                    }
                }
            },
            goDetail(item) {
                this.$router.push({name:'knowLibDetail',params:{id:item.id,category:'4'}})
            },
        },
    };
    </script>
    
    <style>
    .knowLedgeList {
        position: absolute;
        top:0px;
        bottom: 0px;
        left:0px;
        right:0px;
        z-index:2;
        overflow-y: hidden;
        /* min-width: 1131px; */
        border: 1px solid #ddd;
        color: #0f1419;
    }
    
    .knowLedgeList .plainBtn {
        border-color: #003b90;
        color: #003b90;
        font-size: 14px;
    }
    
    .knowLedgeList .toolBtn {
        margin: 0 10px;
        float: right;
    }
    
    .knowLedgeList .el-card /deep/ .el-card__body {
        height: 100px;
    }
    
    .knowLedgeList .el-card {
        border: 1px solid #ddd;
    }
    
    .knowLedgeList .el-card /deep/ .el-card__header {
        border-bottom: 1px solid #ddd;
    }
    
    .knowLedgeList .searchItem {
        color: #f56c6c;
    }
    
    .card-edit:hover {
        color: #409eff;
    }
    
    .card-delete:hover {
        color: #f56c6c;
    }
    
    .el-popover {
        min-width: 30px;
    }
    
    .list-content {
        overflow-x: hidden;
    }
    </style>
    