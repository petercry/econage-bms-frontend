<template>
    <div class="liuchengtu" id='liuchengtu'>
    </div>
</template>
<script>
    import {data} from './data.js';
    export default {
        data(){
            return {
                dataList:{},
                yBase:0,
                xBase:0
            }
        },created(){
            this.initCase();
        },methods:{
            initCase(){
                let parser;
                let xmlDoc;
                if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(data, "text/xml");
                }else {
                    // Internet Explorer
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = "false";
                    xmlDoc.loadXML(data);
                }
                let mxGraphModel = xmlDoc.getElementsByTagName("mxGraphModel")[0];
                let dataArr = mxGraphModel.getElementsByTagName("root")[0].children;
                let list = Array.prototype.slice.call(dataArr)
                dataArr = list
                let dataY = [];
                dataArr.forEach(item=>{
                        if(item.getAttribute('target') && item.getAttribute('source')){
                            //线
                            this.dataList[item.getAttribute('id')] = {
                                type:'line',
                                target:item.getAttribute('target'), //v1
                                source:item.getAttribute('source'), //v2
                                value:item.getAttribute('value')
                            }
                        }
                        if(item.children[0] && !item.children[0].getAttribute('relative')){
                            //节点
                            this.dataList[item.getAttribute('id')] = {
                                type:'node',
                                id:item.getAttribute('id'),
                                value:item.getAttribute('value'),
                                height: +item.children[0].getAttribute('height'),
                                width: +item.children[0].getAttribute('width'),
                                x: +item.children[0].getAttribute('x'),
                                y: +item.children[0].getAttribute('y'),
                            };
                            if((item.getAttribute('value').includes("开始") || item.getAttribute('value').includes("编制发起")) && (+item.children[0].getAttribute('x'))<0){
                                this.xBase = -parseInt(item.children[0].getAttribute('x')) + 20;
                            }
                            if(+item.children[0].getAttribute('y')<0){
                                dataY.push(+item.children[0].getAttribute('y'));
                            }
                        }
                })
                if(dataY.length!==0){
                    this.yBase = (-Math.min(...dataY))+20;
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
                        strHtml+=`
                            <div class='${oclass}' id="${this.dataList[key].id}" style="height:${heightValue}px;width:${widthValue}px;left:${leftValue}px;top:${topValue}px">
                               <div class='liuchengtuItemLable'>${this.dataList[key].value}</div>
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
                                left:this.dataList[target].x+parseInt(this.dataList[target].width/2)
                            })
                            console.log(bohuiLineArr)
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
                                    <div class='liuchengtuLine' style="width:${parseInt(lineWidth/2)}px;top:${this.dataList[target].y+parseInt(this.dataList[target].height/2)}px;left:${this.dataList[source].x+this.dataList[source].width+parseInt(lineWidth/2)}px"}>
                                    </div>`
                            } else{
                                let lineLabel='';
                                if(this.dataList[key].value){
                                    lineLabel =  `<div class='liuchengtuLineLabel'>${this.dataList[key].value}</div>`
                                }
                                strHtml += `
                                    <div class='liuchengtuLine' style="width:${lineWidth}px;top:${this.dataList[target].y+parseInt(this.dataList[target].height/2)}px;left:${this.dataList[source].x+this.dataList[source].width}px"}>
                                        ${lineLabel}
                                    </div>`
                            }
                        }


                    }
                }
                bohuiLineArr.sort((a,b)=>{
                    //驳回排序
                    return a.left - b.left
                });
                let baseTop = 0;
                bohuiLineArr.forEach((item,index)=>{
                    baseTop = index*12;
                    //驳回线添加
                    let topX;
                    let classN = 'tuihuiLine';
                    try{
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
                                topX=-180; //80
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
                                    <div class='${classN}' style="border-left-width:0px;height:${(topX/2)+(bohuiObj[item.left]*8)+baseTop}px;width:${item.width}px;top:${(bohuiInfo[item.left].top)-(bohuiObj[item.left]*8)}px;left:${item.left}px"}>
                                        <div class='liuchengtuLineLabel top'>${item.value}</div>
                                        <div class='liuchengtuLineLeft'></div>
                                    </div>`
                            }

                       }
                    }catch(err){
                        console.log(err)
                    }
                })
                this.$nextTick(function(){
                    document.getElementById("liuchengtu").innerHTML = strHtml;
                })

            }
        }
    }
</script>
<style scoped>
.liuchengtu{
    position: relative;
    width:1000px;
    /* overflow: auto; */
    height:1000px;
    top: 40vh;
    left: 5%;
    right: 5%;
}

</style>
