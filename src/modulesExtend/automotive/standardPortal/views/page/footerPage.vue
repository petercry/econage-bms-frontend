<template>
    <div class="footerPage">
        <div class='footerContent'>
            <el-select v-model="selectLink.typeA" size='medium'  placeholder="标准化技术委员会" @change='selectChange'>
                <el-option v-for='(item,index) in linkData.typeA' :key="index+'typeA'" :label='item.label' :value='item.id'></el-option>
            </el-select>
            <el-select v-model="selectLink.typeB" size='medium'  placeholder="国际/外标准化组织"  @change='selectChange'>
                <el-option  v-for='(item,index) in linkData.typeB' :key="index+'typeB'" :label='item.label' :value='item.id'></el-option>
            </el-select>
            <el-select v-model="selectLink.typeD" size='medium'  placeholder="国内行业主管机构网站"  @change='selectChange'>
                <el-option v-for='(item,index) in linkData.typeD' :key="index+'typeD'" :label='item.label' :value='item.id'></el-option>
            </el-select>
            <el-select v-model="selectLink.typeE" size='medium'  placeholder="国外行业主管机构网站"  @change='selectChange'>
                <el-option v-for='(item,index) in linkData.typeE' :key="index+'typeE'" :label='item.label' :value='item.id'></el-option>
            </el-select>
            <el-select v-model="selectLink.typeF" size='medium'  placeholder="相关网站"  @change='selectChange'>
                <el-option v-for='(item,index) in linkData.typeF' :key="index+'typeF'":label='item.label' :value='item.id'></el-option>
            </el-select>
            <div class="lineCenter">
                <span>系统总访问量:&emsp;3000</span>
                <span>当前在线人数:&emsp;3000</span>
            </div>
            <div class="lineBottom">
                <span>Copyright c 2021东风汽车集团有限公司技术中心.All Rights Reserved.</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                linkData:{
                    typeA:[
                        {label:'全国汽车标准化委员会',id:'http://www.catarc.org.cn'},
                        {label:'全国燃料电池及液流电池标准化技术委员会',id:'http://www.sactc342.org'}
                    ],
                    typeB:[
                        {label:'IEC',id:'http://www.iec.ch/'},
                        {label:'ISO',id:'https://www.iso.org/home.html'},
                        {label:'SAE',id:'http://www.sae.org/'},
                        {label:'ASTM',id:'https://www.astm.org/'},
                        {label:'欧洲标准化委员会',id:'https://www.cen.eu/Pages/default.aspx'}
                    ],
                    typeD:[
                        {label:'国标委',id:'http://www.sac.gov.cn'},
                        {label:'生态环境部',id:'http://www.mee.gov.cn/'},
                        {label:'市场监管总局',id:'http://www.samr.gov.cn/'},
                        {label:'交通部',id:'http://www.moc.gov.cn/'},
                        {label:'工信部',id:'http://www.miit.gov.cn/'},
                        {label:'北京生态环境局',id:'http://sthjj.beijing.gov.cn/'},
                        {label:'国家能源局',id:'http://www.nea.gov.cn/'},
                        {label:'财政部',id:'http://www.mof.gov.cn/index.htm'}
                    ],
                    typeE:[
                        {label:'欧盟委员会',id:''},
                        {label:'联合国欧洲经济委员会',id:''},
                        {label:'NHTSA',id:'https://www.nhtsa.gov/'},
                        {label:'美国环保署',id:'https://www.epa.gov/'}
                    ],
                    typeF:[
                        {label:'机动车环保网',id:'https://www.vecc.org.cn/'},
                        {label:'中国WTO/TBT-SPS通报咨询网',id:'http://www.tbt-sps.gov.cn/'},
                        {label:'汽车技术情报研究所',id:'http://www.atiri.com.cn/'},
                        {label:'节能与新能源汽车网',id:'http://www.chinaev.org/'},
                        {label:'数据资源中心',id:'http://www.catarc.info/'},
                        {label:'公安部交通管理科学研究所',id:'http://www.tmri.cn/'},
                        {label:'中汽测评',id:'http://www.c-ncap.org/'},
                        {label:'欧盟新车安全评鉴协会官方网站（Euro-NCAP）',id:'http://www.euroncap.com/'},
                        {label:'国家标准全文公开系统',id:'http://www.gb688.cn/SLMgk/gb/index'},
                        {label:'标准网',id:'http://www.standardcn.com'},
                        {label:'中国汽车图书馆',id:'http://www.autolib.org.cn/'},
                    ],
                },
                selectLink:{
                    typeA:'',
                    typeB:'',
                    typeD:'',
                    typeE:'',
                    typeF:'',
                },
            }
        },
        methods:{
            selectChange(id){
                console.log(id)
                if(id){
                    window.open(id,'_blank');
                }
            }
        },
    }
</script>
<style scoped>
    .footerPage{
        position: relative;
        width: 100%;
        min-width: 1300px;
        background-color: #409EFF;
        padding: 0px 80px;
        box-sizing: border-box;
        color:#fff;
        overflow: hidden;
    }
    .footerPage .footerContent{
         height:180px;
         margin-top:20px;
         text-align: center;
    }
    .footerPage::before{
        content:'';
        display: table;
    }
    .footerPage .el-select{
        width:180px;
    }
    .footerPage .el-select+.el-select{
        margin-left:40px;
    }
    .footerPage .el-select /deep/ .el-input__inner{
        background-color:rgb(151 194 249 / 60%);
        border-width:0px;
        border-radius: 1px;
        color:#fff;
    }
    .footerPage  .el-select /deep/ .el-select__caret{
        color:#fff;
    }
  .footerPage .lineCenter,
  .footerPage .lineBottom{
      text-align: center;
  }
  .lineCenter{
      margin:40px 0 20px;
      height:50px;
      line-height: 50px;
      border-bottom:1px solid #ddd; 
  }
</style>