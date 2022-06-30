<template>
    <div class="liuchengtu" id='liuchengtu' v-loading='loading' :style="{height:pageInfo.height,width:pageInfo.width}"></div>
</template>
<script>
    import {programFlowGraph,planPublishFlowGraph,guidelineFlowGraph,guidelinePlanPublishFlowGraph} from '../service/service.js';
    export default {
        data(){
            return {
                loading:false,
                viewType:'',
                id:'',
                dataList:{},
                yBase:0,
                xBase:0,
                pageInfo:{
                    height:'300px',
                    width:'100%'
                }
            }
        },created(){
            this.viewType = this.$route.params.viewType;
            this.id = this.$route.params.id;
            this.loading = true ; 
            if(this.viewType==="programFlowGraph"){
                //企业标准规划
                programFlowGraph(this.id).then(res=>{
                    this.initCase(res.data);
                    this.loading = false; 
                })

            }else if(this.viewType==="planPublishFlowGraph"){
                // 企业标准计划发布
                planPublishFlowGraph(this.id).then(res=>{
                    this.initCase(res.data);
                    this.loading = false; 
                })
            }else if(this.viewType==="guidelineFlowGraph"){
                //业务指南规划
                guidelineFlowGraph(this.id).then(res=>{
                    this.initCase(res.data);
                    this.loading = false; 
                })
            }else if(this.viewType==="guidelinePlanPublishFlowGraph"){
                //业务指南计划发布
                guidelinePlanPublishFlowGraph(this.id).then(res=>{
                    this.initCase(res.data);
                    this.loading = false; 
                })
            }
          
        },methods:{
            initCase(data){ 
                let parser;
                let xmlDoc;
                let childName;
                if ("ActiveXObject" in window) {
                    // Internet Explorer
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;//'false'
                    xmlDoc.loadXML(data);
                    childName= 'childNodes';
                }else {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(data, "text/xml");
                    childName = 'children';
                }
                let mxGraphModel = xmlDoc.getElementsByTagName("mxGraphModel")[0];
                let dataArr = mxGraphModel.getElementsByTagName("root")[0][childName];//类数据
                let dataY = [];
                this.pageInfo.height = mxGraphModel.getAttribute("pageHeight")+'px';
                this.pageInfo.width = mxGraphModel.getAttribute("pageWidth")+'px';
                [...dataArr].forEach(item=>{
                        if(item.getAttribute('target') && item.getAttribute('source')){
                            //线
                            this.dataList[item.getAttribute('id')] = {
                                type:'line',
                                target:item.getAttribute('target'), //v1
                                source:item.getAttribute('source'), //v2
                                value:item.getAttribute('value')||'',
                                edgePass:item.getAttribute('edgePass')==="true",//是否通过
                            }
                        }
                        if(item[childName][0] && !item[childName][0].getAttribute('relative')){
                            //节点
                            let users = item.getAttribute('users')?item.getAttribute('users').split("&"):"";
                            this.dataList[item.getAttribute('id')] = {
                                type:'node',
                                id:item.getAttribute('id'),
                                value:item.getAttribute('value'),
                                height: +item[childName][0].getAttribute('height'),
                                width: +item[childName][0].getAttribute('width'),
                                x: +item[childName][0].getAttribute('x'),
                                y: +item[childName][0].getAttribute('y'),
                                users: users,//人员姓名
                                isPolUser:item.getAttribute('users')?(users.length>3):false,
                                nodeStatus:item.getAttribute('nodeStatus')
                            };
                            if((item.getAttribute('value').includes("开始") || item.getAttribute('value').includes("编制发起")) && (+item[childName][0].getAttribute('x'))<0){
                                this.xBase = -parseInt(item[childName][0].getAttribute('x')) + 120;
                            }
                            //<0
                            if(+item[childName][0].getAttribute('y')<=100){
                                dataY.push(+item[childName][0].getAttribute('y'));
                            }
                        }
                })
                if(dataY.length!==0){
                    this.yBase = (-Math.min(...dataY))+240; //20;180;280;
                }
                if(this.xBase!==0 || this.yBase!==0){
                    for(var key in this.dataList){
                        if(this.dataList[key].type == 'node'){
                            this.dataList[key].x+=this.xBase;
                            this.dataList[key].y+=this.yBase;
                        }
                    }
                }
                let strHtml = '';
                // let indexLine = 1;
                let lixObj={};
                let lixLineObj={};
                let qdObj= {};
                let bohuiLineArr =[];
                let bohuiObj = {};
                let bohuiInfo = {};
                for(var key in this.dataList){
                    if(this.dataList[key].type=="node"){
                        let usersHtml = '';
                        let iconfontClass = 'icon-yonghutianchong';//正常节点
                        let oclass = 'liuchengtuItem';
                        let heightValue = this.dataList[key].height;
                        let widthValue = this.dataList[key].width;
                        let leftValue = this.dataList[key].x;
                        let topValue = this.dataList[key].y;
                        if(this.dataList[key].value && (this.dataList[key].value.includes('判断') || ['立项','复审','确认'].includes(this.dataList[key].value))){
                                oclass += ' pand';
                                widthValue-=16;
                                heightValue-=15;
                                leftValue+=9;
                                topValue+=8;
                                iconfontClass='';
                        }else  if(this.dataList[key].value && (this.dataList[key].value.includes('开始') || this.dataList[key].value.includes('编制发起'))){
                            oclass += ' startNode';
                            iconfontClass='icon-yunhang';
                        }else if(this.dataList[key].value && (this.dataList[key].value.includes('结束'))){
                            oclass += ' endNode';
                            iconfontClass='icon-jieshu';
                        }
                        
                        if(['立项','确认'].includes(this.dataList[key].value)){
                            strHtml+=`<div style='width:40px;height:1px;background:#409EFF;position:absolute;top:${this.dataList[key].y+parseInt(this.dataList[key].height/2)}px;left:${this.dataList[key].x+this.dataList[key].width}px'></div>`
                            if(this.dataList[key].value=="确认"){
                             let qrTop =  this.dataList[key].y+parseInt(this.dataList[key].height/2);
                             strHtml+=`<div class='treeNodeLine' style="top:${lixLineObj.top}px;left:${lixLineObj.left}px;width:1px;height:${qrTop-lixLineObj.top}px"></div>`;

                            }else{
                                lixLineObj.top = this.dataList[key].y+parseInt(this.dataList[key].height/2);
                                lixLineObj.left = this.dataList[key].x+this.dataList[key].width+40;
                            }
                        }
                        if(this.dataList[key].users && Array.isArray(this.dataList[key].users)){
                            if(this.dataList[key].isPolUser){
                               //超出max限制
                                let userTArr = [...this.dataList[key].users].splice(0,3);
                                usersHtml = `
                                    <div class='tooltipBox'>
                                        <div>${userTArr.join('、')}...</div>
                                        <div class='tooltip'>${this.dataList[key].users.join('、')}</div>
                                    </div>
                                `  
                            }else{
                                usersHtml = `<div>${this.dataList[key].users.join('、')}</div>`;
                            }
                        }
                        if(this.dataList[key].nodeStatus=='1'){
                            //节点状态为空闲
                            oclass +=' nodeStatus1';
                        } 
                        strHtml+=`
                            <div class='${oclass}' id="${this.dataList[key].id}" style="height:${heightValue}px;width:${widthValue}px;left:${leftValue}px;top:${topValue}px">
                               <div class='liuchengtuItemLable'>${this.dataList[key].value}${usersHtml}</div>
                               <i class='iconfont icon ${iconfontClass}'></i>    
                            </div>`
                    }else{
                        let lineWidth;
                        let target = this.dataList[key].target;//v1
                        let source = this.dataList[key].source;//v2
                        lineWidth = (this.dataList[target].x-this.dataList[target].width) - this.dataList[source].x;
                        if(lineWidth<0 && (this.dataList[key].value.includes('退回') || this.dataList[key].value.includes('驳回'))){
                            // 驳回
                            // let topX;
                            // if(indexLine%2==0){
                            //     topX=220; //120
                            //     strHtml += `<div class='tuihuiLine bottom' style="border-top-width:0px;height:${(topX/2)+(indexLine*5)}px;width:${-lineWidth-parseInt(this.dataList[source].width)}px;top:${(this.dataList[target].y+this.dataList[target].height+10)}px;left:${this.dataList[target].x+parseInt(this.dataList[target].width/2)}px"}></div>`
                            // }else{
                            //     topX=-180; //80
                            //     strHtml += `<div class='tuihuiLine top' style="border-bottom-width:0px;height:${((-topX)/2)+(indexLine*5)}px;width:${-lineWidth-parseInt(this.dataList[source].width)}px;top:${(this.dataList[target].y+this.dataList[target].height)+topX-(indexLine*3)}px;left:${this.dataList[target].x+parseInt(this.dataList[target].width/2)}px"}></div>`
                            // }
                            // indexLine++;
                            bohuiLineArr.push({
                                value:this.dataList[key].value,
                                width:-lineWidth-parseInt(this.dataList[source].width),
                                top:this.dataList[target].y+this.dataList[target].height,
                                left:this.dataList[target].x+parseInt(this.dataList[target].width/2),
                                edgePass:this.dataList[key].edgePass
                            })
                        }else{
                            if(['立项','确认'].includes(this.dataList[target].value)){
                                if('立项'===this.dataList[target].value){
                                    lixObj.top = this.dataList[target].y+parseInt(this.dataList[target].height/2);
                                    lixObj.left = this.dataList[source].x+this.dataList[source].width+parseInt(lineWidth/2);
                                }else{
                                    qdObj={
                                        top : this.dataList[target].y+parseInt(this.dataList[target].height/2),
                                        left : this.dataList[source].x+this.dataList[source].width+parseInt(lineWidth/2)
                                    }
                                    strHtml+=`<div class='treeNodeLine' style="top:${lixObj.top}px;left:${lixObj.left}px;width:1px;height:${qdObj.top-lixObj.top}px"></div>`
                                }
                                strHtml += `
                                    <div class='liuchengtuLine${(this.dataList[key].edgePass?" edgePass":"")}' style="width:${parseInt(lineWidth/2)}px;top:${this.dataList[target].y+parseInt(this.dataList[target].height/2)}px;left:${this.dataList[source].x+this.dataList[source].width+parseInt(lineWidth/2)}px"}>
                                    </div>`
                            } else{
                                let lineLabel='';
                                if(this.dataList[key].value){
                                    lineLabel =  `<div class='liuchengtuLineLabel'>${this.dataList[key].value}</div>`
                                }
                                strHtml += `
                                    <div class='liuchengtuLine${(this.dataList[key].edgePass?" edgePass":"")}' style="width:${lineWidth}px;top:${this.dataList[target].y+parseInt(this.dataList[target].height/2)}px;left:${this.dataList[source].x+this.dataList[source].width}px"}>
                                        ${lineLabel}
                                    </div>`
                            }
                        }

                     
                    }
                } 
                console.log(this.dataList);
                bohuiLineArr.sort((a,b)=>{
                    //驳回排序
                    return a.left - b.left
                });
                let baseTop = 0;
                bohuiLineArr.forEach((item,index)=>{
                    baseTop = index*12;
                    //驳回线添加
                    let topX;
                    let classN = `tuihuiLine${item.edgePass?" edgePass":""}`;
                    if(bohuiObj[item.left]){
                            bohuiObj[item.left]++;
                        }else{
                            bohuiObj[item.left]=1;
                        }
                        if((index)%2==0){
                                topX=220; //120
                                if(bohuiObj[item.left]===1){
                                    bohuiInfo[item.left] = {class:'bottom',top:(item.top+10)};//-(bohuiObj[item.left]*5)
                                    classN += " bottom";
                                    strHtml += `
                                        <div class='${classN}' style="height:${(topX/2)+(bohuiObj[item.left]*8)+baseTop}px;width:${item.width}px;top:${(item.top+10)}px;left:${item.left}px"}>
                                            <div class='liuchengtuLineLabel bottom'>${item.value}</div>
                                        </div>`
                                }
                        }else{
                                topX=-160; //180
                                if(bohuiObj[item.left]===1){
                                    bohuiInfo[item.left] = {class:'top',top:item.top+topX-baseTop};
                                    classN += " top";
                                    strHtml += `
                                    <div class='${classN}' style="height:${((-topX)/2)+(bohuiObj[item.left]*8)+baseTop}px;width:${item.width}px;top:${item.top+topX-baseTop}px;left:${item.left}px"}>
                                        <div class='liuchengtuLineLabel top'>${item.value}</div>
                                    </div>`
                                }
                        }
                        if(bohuiObj[item.left]!==1){
                            classN += " borderNode "+bohuiInfo[item.left].class;
                            if(topX<0){topX=-topX}
                            if(bohuiInfo[item.left].class==="bottom"){
                                strHtml += `
                                    <div class='${classN}' style="height:${(topX/2)+baseTop-(bohuiObj[item.left]*8)}px;width:${item.width}px;top:${(bohuiInfo[item.left].top)}px;left:${item.left}px"}>
                                         <div class='liuchengtuLineLabel bottom'>${item.value}</div>
                                    </div>`
                            }else{
                                strHtml += `
                                    <div class='${classN}' style="border-left-width:0px;height:${(topX/2.7)+(bohuiObj[item.left]*8)+baseTop}px;width:${item.width}px;top:${(bohuiInfo[item.left].top)-(bohuiObj[item.left]*8)}px;left:${item.left}px"}>
                                        <div class='liuchengtuLineLabel top'>${item.value}</div>
                                        <div class='liuchengtuLineLeft'></div>
                                    </div>`
                            }
                                  
                       }
                })
                document.getElementById("liuchengtu").innerHTML = strHtml;
                this.$nextTick(function(){
                    let nodeList = document.getElementsByClassName('tooltipBox');
                    [...nodeList].forEach(item => {
                        item.addEventListener('mouseenter', function (e) {
                            let toolBox = e.target;
                            toolBox.getElementsByClassName('tooltip')[0].style.cssText = ' opacity: 1'
                        })
                        item.addEventListener('mouseleave', function (e) {
                            let toolBox = e.target;
                            toolBox.getElementsByClassName('tooltip')[0].style.cssText = ' opacity: 0'
                        })
                    })
                   
                })
                
            }
        }
    }
</script>
<style scoped>
.liuchengtu{
    position: relative;
    /* position: absolute;
    left:0px;
    right:0px;
    top:0px;
    bottom:0px;
    overflow: auto; */
}

</style>