<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='comparisonStandards'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <strong>标准法规对比</strong>
          </el-col>
          <el-col :span='19' style='text-align:right'>
            <!-- class="plainBtn" -->
            <el-button  type='primary' size='small' @click='dualCase'>对比</el-button>
            <el-button  type='primary' size='small' @click='restCase'>重置</el-button>
            <el-button type='primary' size='small' @click='exportCase(1)'>导出相同</el-button>
            <el-button type='primary' size='small' @click='exportCase(2)'>导出不同</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top='59px' bottom='0px' style='padding:10px 15px;border:1px solid #ddd;'>
        <div class='comparisonStandardsBox'>
          <div class='comparisonStandardsSelect'>
            <div class='selectCol'>
              <span>法规选择</span>
              <div @click='selectRegulationCode("leftId")' class='selectBox'>
                <span :class='{"placeholder":!(leftObj.selectRegulationCode)}'>{{leftObj.selectRegulationCode||"请选择法规号"}}</span>
              </div>
            </div>
            <div class='selectCol'>
              <span>法规选择</span>
              <div @click='selectRegulationCode("rightId")' class='selectBox'>
                <span class='placeholder'></span> 
                <span :class='{"placeholder":!(rightObj.selectRegulationCode)}'>{{rightObj.selectRegulationCode||"请选择对比的法规号"}}</span>
              </div>
            </div>
          </div>
          <div class='defContent'>
            <span v-if='isdual'>{{leftObj.selectRegulationCode}}与{{rightObj.selectRegulationCode}}相同<span class="linkB" @click='filterCase(1)'>{{defInfo}}</span>处,不同<span class="linkB" @click='filterCase(2)'>{{leftListLength-defInfo}}</span>处</span>
          </div>
          <div class='comparisonStandardsContent'>
            <div class='comparisonStandardsCol'>
              <div class='comparisonStandardsColText'>{{leftObj.selectRegulationCode}}</div>
              <div class='comparisonStandardsColHead'>
                <div class='col1'>条文号</div>
                <div class='col2'>条文内容</div>
              </div>
              <div class='comparisonStandardsColContent' v-for='(item,index) in leftObj.listData' :key='"left-"+index'>
                <div class='col1'>{{item.articleCode}}</div>
                <div class='col2 cursorP' @click='clickRowCase(item)' v-ckeditor='item.articleContent' :class='{noMatched:(!(item.matched) && isdual),pointHeight:(item.pointHeight && isdual)}'></div>
              </div>
              <div class='emptyBox' v-show='leftObj.listData.length===0'>
                  <span>暂无数据</span>
              </div>
            </div>
            <div class='comparisonStandardsCol'>
              <div class='comparisonStandardsColText'>{{rightObj.selectRegulationCode}}</div>
              <div class='comparisonStandardsColHead'>
                <div class='col1'>条文号</div>
                <div class='col2'>条文内容</div>
              </div>
              <div class='comparisonStandardsColContent' v-for='(item,index) in rightObj.listData' :key='"right-"+index'> 
                <div class='col1'>{{item.articleCode}}</div>
                <div class='col2' v-ckeditor='item.articleContent' :class='{noMatched:(!(item.matched) && isdual),pointHeight:(item.pointHeight && isdual)}'></div>
              </div>
              <div class='emptyBox' v-show='rightObj.listData.length===0'>
                  <span> 暂无数据</span>
              </div>
            </div>
          </div>

        </div>
      </eco-content>
    </div>
  </eco-content>
</template>
<script>
  var _self;
  import ecoContent from "@/components/pageAb/ecoContent.vue";
  import ecoLoading from "@/components/loading/ecoLoading.vue";
  import { EcoUtil } from "@/components/util/main.js";
  import { EcoMessageBox } from "@/components/messageBox/main.js";
  import { articleCompareSelect, articleCompareDual,articleCompareExcel } from "../service/service.js";
  export default {
    name: "comparisonStandards",
    components: {
      ecoContent,
      ecoLoading
    },
    computed: {

    },
    data() {
      return {
        defInfo:0,
        leftListLength:0,
        canClick:true,
        isdual:false,
        leftObj:{
          selectRegulationCode:'',
          regulationName:'',
          listData:[],
          leftId:''
        },
        rightObj:{
          selectRegulationCode:'',
          regulationName:'',
          listData:[],
          rightId:''
        }
      };
    },
    created() {
      _self = this;
      this.callAction();
    },
    mounted() {

    },
    methods: {
      filterCase(type){
        this.$refs.refLoading.open();
          articleCompareDual(this.leftObj.leftId,this.rightObj.rightId).then(res=>{
            let dataList1 = [];
            let dataList2 = [];
            if(type===1){
              //相同项
              dataList1=res.data.leftList.filter(item=>{
                item.pointHeight = false;
                return item.matched
              })
              dataList2=res.data.rightList.filter(item=>{
                item.pointHeight = false;
                return item.matched
              })
            }else{
              //不同项
              dataList1=res.data.leftList.filter(item=>{
                item.pointHeight = false;
                return !(item.matched)
              })
              dataList2=res.data.rightList.filter(item=>{
                item.pointHeight = false;
                return !(item.matched)
              })
            }
            this.leftObj.listData = dataList1;
            this.rightObj.listData = dataList2;
            this.$refs.refLoading.close();
         })
      },
      exportCase(filter){
        if(this.leftObj.leftId && this.rightObj.rightId){
          this.$refs.refLoading.open();
          let params = {
            leftId:this.leftObj.leftId,
            rightId:this.rightObj.rightId,
            filter //(1相同的项，2不同的项)   
          };
          articleCompareExcel(params).then(res => {
            if(window.navigator && window.navigator.msSaveOrOpenBlob ) {
              navigator.msSaveBlob(new Blob([res.data],'标准法规对比.xlsx'));
              this.$refs.refLoading.close();
            }else{
              let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement("a");
              a.href = url;
              a.download = '标准法规对比.xlsx';
              this.$refs.refLoading.close();
              a.click();
              // 释放这个临时的对象url
              window.URL.revokeObjectURL(url);
            }
          }).catch(err => {
            this.$refs.refLoading.close();
          })
        }else{
          this.$message.warning('请选择对比的数据!');
        }
      },
      restCase(){
         this.leftObj = {
            selectRegulationCode:'',
            regulationName:'',
            listData:[],
            leftId:''
         };
         this.rightObj ={
            selectRegulationCode:'',
            regulationName:'',
            listData:[],
            rightId:''
         }
         this.leftListLength = 0;
         this.isdual = false;
         this.defInfo=0;
      },
      clickRowCase(row){
        // row.matchId
         if(row.matched && this.isdual && this.canClick){
            this.canClick= false;
            this.leftObj.listData.forEach(item=>{
              item.pointHeight=false;
            })
            row.pointHeight = true;
            this.rightObj.listData.forEach(item=>{
                if(item.matchId == row.matchId){
                  item.pointHeight =true;
                }else{
                  item.pointHeight =false;
                }
            })
            setTimeout(function(){
              _self.canClick= true;
            },500)
            // this.rightObj.listData = [...this.rightObj.listData];
            // this.leftObj.listData = [...this.leftObj.listData]
            // this.$forceUpdate();
         }
         
      },
      dualCase(){
        if(this.leftObj.leftId && this.rightObj.rightId){
          this.$refs.refLoading.open();
          articleCompareDual(this.leftObj.leftId,this.rightObj.rightId).then(res=>{
             let count=0;
             this.isdual=true;
             res.data.leftList.forEach(item=>{
                item.pointHeight = false;
                if(item.matched){
                  count++
                }
             })
             res.data.rightList.forEach(item=>{
                item.pointHeight = false;
             })
             this.leftListLength = res.data.leftList.length;
             this.leftObj.listData = res.data.leftList;
             this.rightObj.listData = res.data.rightList;
            //  this.defInfo=`${this.leftObj.selectRegulationCode}与${this.rightObj.selectRegulationCode}相同${count}处,不同${this.leftObj.listData.length-count}处`;
            this.defInfo = count ;
            this.$refs.refLoading.close();
          }).catch(err=>{
            this.$refs.refLoading.close();
            this.isdual=false;
            // this.defInfo='';
            this.defInfo=0;
          })
        }else{
          this.$message.warning('请选择对比的数据!');
        }
      },
      callAction() {
        let callBackDialogFunc = function (obj) {
          //选择标准法规编号
          if (obj && (obj.action === 'selectRegulationCode')) {
            _self.$refs.refLoading.open();
            if(obj.data.idType==='leftId'){
              _self.leftObj.selectRegulationCode = obj.data.regulationCode;
              _self.leftObj.regulationName = obj.data.regulationName;
              _self.leftObj.leftId = obj.data.id;
            }else{
              _self.rightObj.selectRegulationCode = obj.data.regulationCode;
              _self.rightObj.regulationName = obj.data.regulationName;
              _self.rightObj.rightId = obj.data.id;
            }
            _self.isdual=false;
            articleCompareSelect(obj.data.id).then(res=>{
               if(obj.data.idType==='leftId'){
                _self.leftObj.listData = res.data;
               }else{
                _self.rightObj.listData = res.data;
               }
               _self.$refs.refLoading.close();
            }).catch(err=>{
                if(obj.data.idType==='leftId'){
                  _self.leftObj.listData = [];
                }else{
                  _self.rightObj.listData = [];
                }
                _self.$refs.refLoading.close();
            })
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'generateTaskList');
      },
      selectRegulationCode(type) {
        var url = '/comparisonStandards/index.html#/structuredLIst/' + type;
        EcoUtil.getSysvm().openDialog('选择标准法规编号', url, 1100, 600, '15vh');
      }
    },
    watch: {}
  };
</script>
<style scoped>
  .comparisonStandards {
    color: #0f1419;
    min-width: 1000px;
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: auto;
    color: #0f1419;
  }

  .comparisonStandards .plainBtn:first-of-type {
    margin-left: 20px;
  }

  .comparisonStandards .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

  .comparisonStandardsBox {
    position: relative;
    width: 1000px;
    margin: 0 auto;
  }

  .comparisonStandardsSelect {
    display: flex;
    justify-content: space-between;
  }

  .selectCol {
    height: 60px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  .selectBox {
    margin-left: 10px;
    width: 400px;
    height: 35px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    padding-left: 15px;
    font-size: 12px;
    color: rgb(150, 148, 148);
    line-height: 32px;
  }
  .selectBox .placeholder{
    color:#c0c4cc;
  }

  .defContent {
    height: 43px;
    line-height: 43px;
    background-color: rgb(245, 245, 245);
    text-align: center;
    font-size: 14px;
    font-weight: 600;
  }

  .comparisonStandardsContent {
    display: flex;
    margin-top: 25px;
    justify-content: space-between;
  }

  .comparisonStandardsCol {
    width: 475px;
  }

  .comparisonStandardsColText {
    height: 30px;
    line-height:30px;
    font-size:14px;
    color: #fff;
    text-align: center;
    background: rgb(102, 112, 126);
  }

  .comparisonStandardsColHead,
  .comparisonStandardsColContent {
    display: flex;
  }

  .comparisonStandardsColHead .col1,
  .col2,
  .comparisonStandardsColContent .col1,
  .col2 {
    text-align: center;
    height: auto;
    min-height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
    background: rgb(250, 250, 250);
    border: 1px solid #e7e6e6;
    border-top-width: 0px;
  }

  .comparisonStandardsColHead .col1,
  .comparisonStandardsColContent .col1 {
    width: 100px;
    border-right-width: 0px;
  }

  .comparisonStandardsColHead .col2,
  .comparisonStandardsColContent .col2 {
    width: 375px;
    padding: 0px 10px;
  }

  .comparisonStandardsColContent .col2,
  .comparisonStandardsColContent .col1 {
    color: #555;
  }
  .comparisonStandardsColContent .col2.noMatched{
    background-color: rgb(253, 223, 223);
  }
  .comparisonStandardsColContent .col1{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .emptyBox{
    height:100px;
    border: 1px solid #e7e6e6;
    border-top-width:0px;
    background: rgb(250, 250, 250);
    text-align:center;
    line-height: 100px;
    color:#5e6d82;
    font-size:14px;
    overflow: hidden;
  }
  .comparisonStandardsColContent .col2 /deep/ img {
      width: 340px !important;
      height: auto !important;
  }
  .comparisonStandardsColContent .col2.cursorP{
    user-select: none;
    cursor: pointer;
  }
  .comparisonStandardsColContent .col2.pointHeight{
    border:1px solid rgb(167, 193, 231);
  }
  .linkB{
    color:#409eff;
    cursor: pointer;
    margin:0px 3px;
  }
  /* .emptyBox span{
    text-shadow: 1px 1px  rgb(240, 238, 238);
  } */
</style>