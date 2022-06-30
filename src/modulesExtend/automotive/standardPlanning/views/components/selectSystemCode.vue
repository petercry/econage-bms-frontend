<template>
    <div class="selectSystemCode" v-loading='loading'>
        <div class="treeBox">
            <div class="treeContent">
                <!-- @node-click="handleNodeClick"  -->
                <!-- @check="checkChange" -->
                <!-- highlight-current -->
                <el-tree
                    :props="defaultProps"
                    node-key="id"
                    :load="loadNode"
                    lazy
                    :default-expanded-keys = "defaultExpanded"
                    ref="systemCodeTree"
                    size="mini"
                    :show-checkbox="showCheck"
                    :check-strictly="true"
                    icon-class='el-icon-myTreeIcon'
                    :expand-on-click-node="expandClick">
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="custom-tree-node-dept" @click="toggleSelect(data)">
                            <i class="icon iconfont iconmeixuanzhong  menuIcon treeIcon" v-if='!data.isMore'  v-show="(!ucIsSelected(data.id))"></i>
                            <i class="icon iconfont iconxuanzhong menuIcon treeIcon" v-if='!data.isMore'  v-show="(ucIsSelected(data.id))"></i>
                            <span class="label">{{node.label}}</span>
                        </span>
                    </div>
                </el-tree>
            </div>
        </div>
        <div class="btn">
            <el-button type="primary" @click="submitCase" size='small'>确 定</el-button>
            <el-button @click="onClose" size='small'>取 消</el-button>
        </div>
    </div>
</template>
<script>
    import { technicalStandardTree,getSystemCode } from '../../service/service.js'
    import {EcoUtil} from '@/components/util/main.js'
    export default {
        data() {
            return {
                defaultExpanded:[],
                loading:false,
                expandClick:false,
                showCheck:false,
                treeData: [],
                defaultProps: {
                    label(data, node) {
                        return data.name || data.text;
                    },
                    isLeaf(data, node) {
                        return !data.isMore;
                        // return valid;
                    },
                },
                treeSelect:[],
                rootResolve:null,
                rootNode:null,
                queryParams:{},
                promiseList:[]
            }
        },created(){
            if(this.$route.query.classification){
                this.queryParams.classification = this.$route.query.classification;
            }
           
            if(this.$route.query.type){
                this.queryParams.type = this.$route.query.type;
            }
        }, methods: {
            submitCase(){
                if(this.treeSelect.length==0){
                    this.$message.warning('请选择一条数据!')
                    return ;
                }
                this.loading = true;
                let data ={
                    id:this.treeSelect[0],
                    read: true
                }
                getSystemCode(data).then(res=>{
                    this.loading = false;
                    let doObj = {};
                    if(this.$route.query.pageType=='flowform'){
                        //流程页面
                        let outputParams = [];
                        outputParams.push({item:'systemCode',name:'code'});//出生年月"
                        let selectionList = [];
                        selectionList.push({code:res.data.code});
                        doObj.action = 'apiSelfPageSelectCallBack';
                        doObj.data = {};
                        doObj.data.outputParams = outputParams;
                        doObj.data.selectObj = {};
                        doObj.data.selectObj.selItems =  selectionList;
                        doObj.data.selectObj.action = 'APIPAGE';
                        doObj.close = true;
                    }else{
                        doObj.action = "selectSystemCode";
                        doObj.close = true;
                        doObj.data = res.data //{code:res.data}
                    }
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                })

            },
            onClose() {
                EcoUtil.getSysvm().closeDialog();
            },
            ucIsSelected(value){
                 return this.treeSelect.indexOf(value)>=0;
            },
            toggleSelect(data){
                if(data.isMore){
                    return;
                }
                let tempItem = EcoUtil.objDeepCopy(data);
                let idx = this.treeSelect.indexOf(tempItem.id);
                if(idx==-1){
                    //勾选
                    // let _checkKeys = EcoUtil.objDeepCopy(this.$refs.systemCodeTree.getCheckedKeys());
                    // this.$refs.systemCodeTree.setCheckedKeys([]);
                    this.treeSelect = [];
                    this.treeSelect.push(tempItem.id);
                    // this.$refs.systemCodeTree.setChecked(tempItem.id,true);
                }else{
                    this.treeSelect.splice(idx,1);
                    // this.$refs.systemCodeTree.setChecked(tempItem.id,false);
                }
                console.log(this.treeSelect,'勾选');
            },
            // checkChange(data,data2){
            //     console.log(data,data2,'checkChange')
            // },
            loadNode(node, resolve) {
                this.rootNode = node;//保留根节点
                this.rootResolve = resolve;//保留根节点方法
                this.rootNode.childNodes = [];
                // console.log(node.level,'loadNode')
                if (node.level == 0) {
                    technicalStandardTree(-1).then((response) => {
                        this.treeData = response.data.rows.map(x => {
                            return {
                                ...x,
                                isMore: x.subTotal > 0 ? true : false
                            }
                        });
                        if(this.queryParams.classification){
                             let isContinue = true;
                             for(var key in this.treeData){
                                  if(this.treeData[key].name.includes(this.queryParams.classification)){
                                        isContinue = false;
                                        this.defaultExpanded = [this.treeData[key].id];
                                        break;
                                  }
                             }
                             if(isContinue){
                                this.defaultExpanded = [];
                                this.loading = true;
                                this.getData(this.treeData).then((res2)=>{
                                        // console.log('end',this.defaultExpanded);
                                        resolve(this.treeData);
                                        this.loading = false;
                                })                           
                             }else{
                                resolve(this.treeData);
                             }
                        }else{
                            resolve(this.treeData);
                        }
                      
                    })
                } else {
                    technicalStandardTree(node.data.id).then((response) => {
                        let dataList = response.data.rows.map(x => {
                            return {
                                ...x,
                                isMore: x.subTotal > 0 ? true : false
                            }
                        });
                        setTimeout(() => {
                            resolve(dataList);
                        }, 200);
                    })
                }
            },
            async getData(nodes){
                // console.log('递归',JSON.stringify(nodes));
                return new Promise(async(resolve,reject)=>{
                    this.promiseList.push(resolve);
                    let requeArr= [];
                    // nodes.forEach(item=>{
                    //      if(item.subTotal > 0){
                    //         requeArr.push(technicalStandardTree(item.id));
                    //      }
                    // })
                    for(let j=0;j<nodes.length;j++){
                        if(nodes[j].subTotal > 0){
                            requeArr.push(technicalStandardTree(nodes[j].id));
                        }
                    }
                    // console.log(JSON.stringify(requeArr),requeArr,'待请求数组')
                    Promise.all(requeArr).then(resList=>{
                        let nodeData = [] ;
                        // for(let i=0;i<resList.length-1;i++){
                        //     console.log('---------------');
                        //      if(resList[i].data.rows){
                        //          console.log(resList[i].data.rows,i,' 第一层 总数：',resList.length);
                        //         for(let j=0;j<resList[i].data.rows.length-1;j++){
                        //             console.log(resList[i].data.rows[j].name,"第二层 总数：",resList[i].data.rows.length);
                        //             if(resList[i].data.rows[j].name.includes(this.queryParams.classification) || resList[i].data.rows[j].name.includes(this.queryParams.type)){
                        //                 if(!this.defaultExpanded.includes(resList[i].data.rows[j].parentId)){
                        //                     this.defaultExpanded.push(resList[i].data.rows[j].parentId);
                        //                 }
                        //                 this.defaultExpanded.push(resList[i].data.rows[j].id);
                        //                 console.log(this.defaultExpanded);
                        //             }
                        //             if(resList[i].data.rows[j].subTotal>0){
                        //                 nodeData.push(resList[i].data.rows[j]);
                        //             }  
                        //         }
                        //      }
                        // }
                        resList.forEach(item=>{
                             if(item.data.rows){
                                item.data.rows.forEach(item2=>{
                                    if((item2.name.includes(this.queryParams.classification) || item2.name.includes(this.queryParams.type)) && item2.subTotal>0){
                                        if(!this.defaultExpanded.includes(item2.parentId)){
                                            this.defaultExpanded.push(item2.parentId);
                                        }
                                        this.defaultExpanded.push(item2.id);
                                    }
                                    if(item2.subTotal>0){
                                        nodeData.push(item2);
                                    }  
                                }) 
                             }

                        })
                        if(nodeData.length==0){
                            for(var x=0;x<this.promiseList.length;x++){
                                this.promiseList[x]();
                            }
                        }else{
                            // this.getData([...nodeData]);
                            this.getData(JSON.parse(JSON.stringify(nodeData)));
                        }
                    })

                })
            },
            reloadNode() {
                //刷新树
                this.loadNode(this.rootNode, this.rootResolve)
            }
            // handleNodeClick(data) {
            //     console.log(data,'handleNodeClick');
            // },
        }
    }
</script>
<style scoped>
    .selectSystemCode {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
    .selectSystemCode .treeBox{
       position: absolute;
       top:0px;
       bottom:40px;
       right:0px;
       left: 0px;;
       overflow-y:auto ;
    }
    .selectSystemCode .btn{
        position: absolute;
        bottom:5px;
        width:100%;
        text-align: right;
    }
    .selectSystemCode .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right:10px;
    }
    .selectSystemCode .treeContent{
        width:max-content;
        min-width:200px;
        margin: auto;
    }
    .selectSystemCode .treeIcon{
        margin-right:0px;
    }
    .selectSystemCode .menuIcon{
        font-size:14px;
    }
    .selectSystemCode  .iconxuanzhong{
        color:#1ba5fa;
    }
</style>
