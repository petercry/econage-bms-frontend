<template>
  <div  >
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue webLayout wfStart" style="background-color:#f5f5f5" v-if="wfStartView == 'card'">
         <div  v-bind:class="{relevanceFlowVue:(wfStartView == 'card')}">
                <div>
                    <el-card class="quickCard" :body-style="{ padding: '0 20px'}" shadow='never' style="border:0px;">
                            <div class="quickHeader clearfix">
                                <span class="title" @click="activeType=''">快捷启动</span>
                                <ul class="quicklist">
                                    <li v-for="item in quickItem" :key="item.templateId" @click="itemClick(item,$event)">
                                            <i class="icon iconfont" v-bind:class="[item.iconCard?item.iconCard:'iconshezhi']"></i>
                                            <span>{{item.templateName}}</span>
                                    </li>
                                </ul>
                            </div>
                    </el-card>
                </div>

                <div style="height:20px;background-color:#f4f4f4;">&nbsp;</div>

                <div class="searchDiv" >
                    <el-button type="primary" @click="changeWfStartView" >九宫格视图</el-button>
                    <el-input class="searchIpt"   suffix-icon="el-icon-search" v-model="srchTxt" size="small" @input="searchItemFunc"  clearable  placeholder="请输入模板名称"></el-input>
                </div>
            
         <div style="padding:20px;overflow:auto">
            <el-tabs v-model="tabName">
                <el-tab-pane label="全部流程" name="all">
                    
                    <div v-for="(item,index) in itemList" :key="'g'+item.groupId" v-show="!allSearch">
                          
                          <!--类别 子类别-->
                          <div class="cardTitle">
                              <span class="mainTitle"  v-bind:class="{'active':groupShowTab[item.groupId] == '0'}" @click="setActiveTab(item.groupId,0)">{{item.groupName}} ({{getTopLevelTemplateLength(item)}})</span>
                              <span class="subTitle" v-for="(fgroup, index) in item.child" v-if="fgroup.child" :key="'g'+item.groupId+index" 
                                  @click="setActiveTab(item.groupId,fgroup.subGroupId)" 
                                  v-bind:class="{'active':groupShowTab[item.groupId] == fgroup.subGroupId}"
                                >
                                  {{fgroup.name}} ({{fgroup.child.length}})
                              </span>
                          </div>

                          <div class="cardBody">
                              <!-- 第一层数据  获取没有child的直接 子数据-->
                              <el-row :gutter="20" v-show="(groupShowTab[item.groupId] === '0') ">
                                  <el-col class="cardCol"  :span="6" v-for="fitem2 in item.child" v-if="!fitem2.child" :key="fitem2.wfTempId" :title="fitem2.name">
                                        <el-card @click.native = "itemClick(fitem2,$event)" shadow="hover"  :body-style="{textOverflow:'ellipsis',overflow:'hidden',wordBreak:'break-all',whiteSpace:'nowrap',position:'relative'}">
                                              <span class="cardIcon"><i class="icon iconfont" v-bind:class="[fitem2.iconCard?fitem2.iconCard:'iconshezhi']"></i></span>
                                              <span class="cardDesc"><i>{{fitem2.name}}</i></span>
                                              <span v-bind:class="{'collection':fitem2.collected,'uncollection':!fitem2.collected}"></span>
                                              <span class="collectionIcon">
                                                <i class="icon iconfont iconCollection" v-bind:class="{'iconshoucangdianjihou1':fitem2.collected,'iconshoucang':!fitem2.collected}"></i>
                                              </span>
                                        </el-card>
                                  </el-col>  
                              </el-row>

                              <!-- 第二层数据  获取有child的 子类别-->
                              <el-row v-show="(groupShowTab[item.groupId] && groupShowTab[item.groupId] == fgroup.subGroupId) " :gutter="20" 
                                  v-for="(fgroup, index) in item.child" v-if="fgroup.child" :key="'g'+item.groupId+'-'+fgroup.subGroupId"
                                >
                                  <el-col class="cardCol"  :span="6" v-for="fitem2 in fgroup.child"  :key="fitem2.wfTempId" :title="fitem2.name">
                                        <el-card  @click.native = "itemClick(fitem2,$event)" shadow="hover"  :body-style="{textOverflow:'ellipsis',overflow:'hidden',wordBreak:'break-all',whiteSpace:'nowrap',position:'relative'}">
                                              <span class="cardIcon"><i class="icon iconfont" v-bind:class="[fitem2.iconCard?fitem2.iconCard:'iconshezhi']"></i></span>
                                              <span class="cardDesc">{{fitem2.name}}</span>
                                              <span v-bind:class="{'collection':fitem2.collected,'uncollection':!fitem2.collected}"></span>

                                              <span class="collectionIcon">
                                                  <i class="icon iconfont iconCollection" v-bind:class="{'iconshoucangdianjihou1':fitem2.collected,'iconshoucang':!fitem2.collected}"></i>
                                              </span>
                                        </el-card>
                                  </el-col>
                              </el-row>
                        </div>
                  </div>

                  <div v-show="allSearch">
                      <!-- 搜索的结果-->
                      <el-row :gutter="20">
                          <el-col class="cardCol"  :span="6" v-for="fitem2 in searchItems"  :key="fitem2.wfTempId"  :title="fitem2.name">
                                <el-card  @click.native = "itemClick(fitem2,$event)" shadow="hover"  :body-style="{textOverflow:'ellipsis',overflow:'hidden',wordBreak:'break-all',whiteSpace:'nowrap',position:'relative'}">
                                      <span class="cardIcon" style="top:20px"><i class="icon iconfont" v-bind:class="[fitem2.iconCard?fitem2.iconCard:'iconshezhi']"></i></span>
                                      <span class="cardDesc">{{fitem2.name}}</span>
                                      <div class="cardSubDesc">{{groupNameKV[String(fitem2.group)]}} {{fitem2.subGroup!='0'?' - '+groupNameKV[String(fitem2.subGroup)]:''}}</div>
                                      <span v-bind:class="{'collection':fitem2.collected,'uncollection':!fitem2.collected}"></span>
                                      <span class="collectionIcon">
                                                <i class="icon iconfont iconCollection" v-bind:class="{'iconshoucangdianjihou1':fitem2.collected,'iconshoucang':!fitem2.collected}"></i>
                                      </span>
                                </el-card>
                              </el-col>
                      </el-row>
                  </div>

                </el-tab-pane>

                <el-tab-pane label="流程收藏" name="collection">
                    <el-row  :gutter="20" >
                        <template v-for="(item,index) in itemList" >
                            <!-- 第一层数据  收藏-->
                            <el-col class="cardCol"  :span="6" v-for="fitem2 in item.child"  :key="fitem2.wfTempId" v-if="!fitem2.child && fitem2.collected && (srchTxt == '' || fitem2.name.indexOf(srchTxt)>-1)" :title="fitem2.name">
                                    <el-card  @click.native = "itemClick(fitem2,$event)" shadow="hover"  :body-style="{textOverflow:'ellipsis',overflow:'hidden',wordBreak:'break-all',whiteSpace:'nowrap',position:'relative'}">
                                          <span class="cardIcon" style="top:20px"><i class="icon iconfont" v-bind:class="[fitem2.iconCard?fitem2.iconCard:'iconshezhi']"></i></span>
                                          <span class="cardDesc">{{fitem2.name}}</span>
                                          <div class="cardSubDesc">{{groupNameKV[String(fitem2.group)]}} {{fitem2.subGroup!='0'?' - '+groupNameKV[String(fitem2.subGroup)]:''}}</div>
                                                  
                                          <span v-bind:class="{'collection':fitem2.collected,'uncollection':!fitem2.collected}"></span>
                                          <span class="collectionIcon">
                                              <i class="icon iconfont iconCollection" v-bind:class="{'iconshoucangdianjihou1':fitem2.collected,'iconshoucang':!fitem2.collected}"></i>
                                          </span>
                                    </el-card>
                            </el-col>
                            <!-- 第二层数据  收藏-->
                            <template v-for="(fgroup, index) in item.child" v-if="fgroup.child" >
                                <el-col class="cardCol"  :span="6" v-for="fitem2 in fgroup.child"  v-if="fitem2.collected && (srchTxt == '' || fitem2.name.indexOf(srchTxt)>-1) " :key="fitem2.wfTempId" :title="fitem2.name">
                                    <el-card  @click.native = "itemClick(fitem2,$event)" shadow="hover"  :body-style="{textOverflow:'ellipsis',overflow:'hidden',wordBreak:'break-all',whiteSpace:'nowrap',position:'relative'}">
                                                  <span class="cardIcon" style="top:20px"><i class="icon iconfont" v-bind:class="[fitem2.iconCard?fitem2.iconCard:'iconshezhi']"></i></span>
                                                  <span class="cardDesc">{{fitem2.name}}</span>
                                                  <div class="cardSubDesc">{{groupNameKV[String(fitem2.group)]}} {{fitem2.subGroup!='0'?' - '+groupNameKV[String(fitem2.subGroup)]:''}}</div>
                                                  <span v-bind:class="{'collection':fitem2.collected,'uncollection':!fitem2.collected}"></span>
                                                  <span class="collectionIcon">
                                                      <i class="icon iconfont iconCollection" v-bind:class="{'iconshoucangdianjihou1':fitem2.collected,'iconshoucang':!fitem2.collected}"></i>
                                                  </span>
                                    </el-card>
                                </el-col>
                            </template>
                        </template>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>


      
    </div>

 </eco-content>

    <div style="padding:0px 10px" v-else class="webLayout">

                    <div class="m-header" style="padding-left:0px;">
                          <span class="m-header-tip themeB"></span>
                          <span class="m-title">启动流程</span>
                          <el-input style="width: 200px;vertical-align: middle;margin-left:20px;" v-model="srchTxt" size="mini" @keyup.enter.native="search"></el-input>
                          <div class="h-button themeB" style="background-color:#43a4e0;" @click="search"><i class="icon el-icon-search"></i>搜索</div>

                          <div class="h-button themeB" style="background-color:#409EFF;" @click="changeWfStartView">卡片视图</div>
                    </div>


                    <el-row :gutter="20">
                      <el-col :xs="24" :sm="8" :md="8" v-for="(item,index) in itemList" :style="{clear:index%3==0?'left':'none'}" :key="'g'+item.groupId" >
                          
                          <div class="flow-card">
                          <div class="title">{{item.groupName}}</div>
                            <el-collapse v-model="openCollapseItems">

                                <el-collapse-item v-for="(fgroup, index) in item.child" v-if="fgroup.child" :style="{maxHeight:fgroup.child.length*26+32+'px'}" :key="'g'+item.groupId+index" :title="fgroup.name" :name="item.groupId+fgroup.subGroupId">
                                      <div class="flow-item" v-for="fitem1 in fgroup.child" :key="fitem1.wfTempId">
                                        <div class="flow-wrap ellipsis" @click="itemClick(fitem1,$event)" :id="'f'+fitem1.wfTempId" :style="{backgroundColor:choosedItems.indexOf(fitem1.wfTempId)>-1?'#cce8d3':'inherit'}" :title="fitem1.name">{{fitem1.name}}</div>
                                      </div>
                                </el-collapse-item>
                            
                                <div class="flow-item" v-for="fitem2 in item.child" v-if="!fitem2.child" :key="fitem2.wfTempId">
                                    <div class="flow-wrap ellipsis" @click="itemClick(fitem2,$event)" :id="'f'+fitem2.wfTempId" :style="{backgroundColor:choosedItems.indexOf(fitem2.wfTempId)>-1?'#cce8d3':'inherit'}" :title="fitem2.name">{{fitem2.name}}</div>
                                </div>

                            </el-collapse>
                          </div>
                      </el-col>
            </el-row>
        </div>

  </div>


</template>
<script>

import {getWFStartInfo,initWFAjax,setTemplateCollection,getWorkflowInitCount} from'../../service/service'
import {sysEnv} from '../../config/env.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {EcoUtil} from '@/components/util/main.js'
import {Loading } from 'element-ui';
export default{
   components:{
        ecoContent,
   },
  name:'start',
  data(){
    return {
        isMultiWs:false,
        itemList:[],
        fitems:[],
        srchTxt:"",
        choosedItems:[],
        openCollapseItems:[],
        
        wfStartView:'tree',
        tabName:'all',
        groupShowTab:{},
        allSearch:false,
        quickItem:[],
        searchItems:[],
        groupNameKV:{}
    }
  },
  created(){
      if(window.flowformSetting && window.flowformSetting.wfStartView == 'card' ){
          this.wfStartView = window.flowformSetting.wfStartView;
      }
  },
  mounted(){
        this.getWFStartInfo();
        this.getWorkflowInitCountFunc();
  },
  computed:{
      
  },
  methods: {
    getWorkflowInitCountFunc(){
        getWorkflowInitCount(5).then((response)=>{
            (response.data).map(item => {
                    item.wfTempId = item.templateId
            })
            this.quickItem = response.data;
        })
    },


    searchItemFunc(){
        if (this.srchTxt==''){
            this.allSearch = false;
            return false;
        }

        this.allSearch = true;
        let that = this;
        let _allItem = EcoUtil.objDeepCopy(this.fitems);
        this.searchItems = _allItem.filter(item=>{
            if (item.name.indexOf(that.srchTxt)>-1){
                return true;
            }else{
              return false;
            }
        });
    },
  

    search(){
        if (this.srchTxt==''){
            this.$message({
                message:"搜索内容不为空",
                type: 'error'
            });
            return false;
        }
        let that = this;
        let choosedItems = this.fitems.filter(item=>{
            if (item.name.indexOf(that.srchTxt)>-1){
                that.openCollapseItems.indexOf(item.group+item.subGroup)>-1?null:
                that.openCollapseItems.push(item.group+item.subGroup);
                return true;
            }else{
                return false;
            }
        }).map(item=>item.wfTempId);

        this.choosedItems = choosedItems;
        this.$nextTick(()=>{
            if (choosedItems.length==0){
                this.$message({
                    // message: this.$t('msg.srchResultNone'),
                    message:"没有搜索到任何流程",
                    type: 'error'
                });
            }else{
                let firstId = choosedItems[0];
                let firstElem = document.getElementById('f'+firstId);

                firstElem.focus();
          
                if (firstElem.offsetTop > window.innerHeight){
                    window.scrollTo(0,firstElem.offsetTop - window.innerHeight/2)
                }
            }
        });
    },
    
    /*获取初始化数据*/
    getWFStartInfo(){
          getWFStartInfo().then((res)=>{
              if(res.data.status<100){
                    this.isMultiWs = res.data.remap.grid.isMultiWs;
                    this.itemList = res.data.remap.grid.info;

                    res.data.remap.grid.info.map(item=>{

                        this.$set(this.groupShowTab,String(item.groupId),'0');
                        this.$set(this.groupNameKV,String(item.groupId),item.groupName);
                        
                        return item.child.map(item=>{
                              if (item.child) {
                                  this.fitems = this.fitems.concat(item.child);
                                  this.$set(this.groupNameKV,String(item.subGroupId),item.name);
                              }else{
                                  this.fitems.push(item)
                              }
                        })
                    })
              }
          }).catch((error)=>{});
    },

    itemClick(fitem,event){
        
          if(event.toElement && (event.toElement.className == 'collectionIcon' || event.toElement.className.indexOf('iconCollection') > -1)){
              this.setTemplateCollectionFunc(fitem);
          }else{
              let loadingInstance = Loading.service({ fullscreen: true,text:"启动中...."});
              initWFAjax(fitem.wfTempId).then((response)=>{
                    this.$nextTick(() => { 
                      loadingInstance.close();
                    })

                    if(response.data.status == 0){
                        if(sysEnv ==1){
                            let tabObj = {};
                            let goPage = 'flowform/index.html#/wfDetail/'+response.data.remap.task_id+'/'+response.data.operate_id;
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wftask_info_"+response.data.operate_id+"',href_link:'"+goPage+"',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                        }else{
                            this.$router.push({name:'wfDetail',params:{taskId:response.data.remap.task_id,operateId:response.data.operate_id}});
                        }
                    }

              })
          }
    },

    setTemplateCollectionFunc(item ){
        setTemplateCollection(item.wfTempId).then((response)=>{
              this.$set(item,'collected',response.data.remap.status);
        })
    },


    setActiveTab(groupId,subGroupId){
        this.$set(this.groupShowTab,String(groupId),String(subGroupId));
    },

    getTopLevelTemplateLength(item){

        let _length = 0;
        for(let i = 0;i<item.child.length;i++){
            if(!item.child[i].child){
                _length++;
            }
        }

        return _length;
    },

    changeWfStartView(){
        this.srchTxt = '';
        if(this.wfStartView!='card'){
            this.allSearch = false;
            this.wfStartView = 'card';
        }else{
            this.wfStartView = 'tree';
        }
    }



   
  },
  watch: {

  }
}
</script>
<style scoped>

.wfStart .relevanceFlowVue{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: auto;
    min-width: 1131px;
    border: 1px solid #ddd;
    background-color:#fff;
}

.wfStart .quickHeader{
    position: relative;
    height: 62px;
    line-height: 62px;
    cursor: pointer;
}

.wfStart .quickHeader .title{
    font-weight: 700;
}

.wfStart .quicklist{
  margin-left: 20px;
  display: inline;
  font-size: 14px;
}

.wfStart .quicklist li{
    display: inline;
    margin-right: 24px;
    max-width: 150px;
    overflow: hidden;
   
}
.wfStart .quicklist li i{
    margin-right: 2px;
}

.wfStart .quicklist li span{
    color:#262626;
}

.wfStart .searchDiv{
  position:absolute;
  top:95px;
  right:20px;
  z-index: 999;
}

.wfStart .searchIpt{
  width: 200px;
  vertical-align: middle;
  margin-left:20px;
}


.wfStart .cardCol{
    margin-bottom:20px;
    cursor: pointer;
}

.wfStart .cardCol .cardDesc{
   margin-left:30px;
    /* height:20px;
    line-height: 20px;
    vertical-align: middle;
    margin-left:30px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical; */
}

.wfStart .cardCol .cardSubDesc{
    font-size: 12px;
    color:#ccc;
    margin-left:30px;
}

.wfStart .cardIcon{
    margin-top: 0px;
    margin-right: 20px;
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    vertical-align: middle;
    line-height: 30px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    background-color: #009af4;
    position: absolute;
    left:10px;
    top:14px;
}

.wfStart .cardTitle{
   font-size: 16px;
   margin-bottom: 20px;
}



.wfStart .cardTitle .mainTitle{
  cursor: pointer;
}

.wfStart .cardTitle .mainTitle.active{
  font-weight: 700;
}

.wfStart .cardTitle .subTitle{
    margin-left:10px;
    font-size: 14px;
    cursor: pointer;
}

.wfStart .cardTitle .subTitle.active{
  color:#009af4;
}

.wfStart .cardTitle .subTitle:hover{
    color: #009af4;
}

.wfStart .cardBody{
  margin-bottom:20px;
}

.wfStart .cardCol .uncollection{
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 28px solid #f3f3f3;
    border-left: 28px solid transparent;
    border-right: 28px solid transparent;
    transform: rotate(45deg);
    right: -20px;
    top: -5px;
}

.wfStart .cardCol .collection{
  position: absolute;
  width: 0;
  height: 0;
  border-bottom: 28px solid #faeee0;
  border-left: 28px solid transparent;
  border-right: 28px solid transparent;
  transform: rotate(45deg);
  right: -20px;
  top: -5px;
}

.wfStart .cardCol .collectionIcon{
    position: absolute;
    right:2px;
    top: 3px;
}

.wfStart .cardCol .collectionIcon .iconshoucang{
  color:#ccc;
}

.wfStart .cardCol .collectionIcon .iconshoucangdianjihou1{
  color:#ffa46f;
}




.flow-card{
  margin-bottom: 20px;
}
.flow-card>.title{
  position: relative;
  height: 34px;
  line-height: 34px;
  color: #fff;
  padding-left: 12px;
  font-size: 14px;
}
.flow-card>.title::before{
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 34px;
  width: 2px;
  background-color: #fff9;
}
@media screen and (min-width: 768px){
  .flow-card{
    min-height: 300px;
  }
}
</style>
