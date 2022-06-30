<template>
  <div style="padding-bottom:72px;">
    <iHeader></iHeader>
    <div class="pageTitle">
      <div class="container">
        <ecoBreadList></ecoBreadList>
        <div class="clearfix">
          <div class="fl ellipsis title" style="max-width:40%;">{{obj.name}}</div>
          <div class="fl ellipsis desc" style="width:35%;">办理部门&nbsp;:&nbsp;{{obj.deptName||obj.dept}}</div>
          <div class="fr"></div>
        </div>
      </div>
    </div>
    <div class="container" id="container" style="margin-top:12px">
      <el-card shadow="never" style="min-height:600px;position:relative;">
        <div class="formblock inputBlock">
          <h3 class="h3">基本信息</h3>
          <table class="service-table"> 
            <tbody>
              <tr>
                <th>办事对象</th>
                <td colspan="3">{{obj.extPropsObj.appObj}}</td>
              </tr>
              <tr>
                <th style="min-width:120px">受理机构</th>
                <td>{{obj.extPropsObj.workComp}}</td>
                <th style="min-width:120px">经办科室</th>
                <td>{{obj.extPropsObj.workDept}}</td>
              </tr> 
              <tr>
                <th>决定机构</th>
                <td colspan="3">{{obj.extPropsObj.resultDept}}</td>
              </tr>
              <tr>
                <th>办结时限</th>
                <td>
                  {{obj.extPropsObj.lawLimitTime}}
                  <!-- {{getEnumText(TIME_LIMIT,obj.extPropsObj.appLimitTime)}} -->
                  <!-- <div class="dtHasLabel"><label>承诺期限：</label>{{obj.extPropsObj.appLimitTime}}</div> -->
                  <!-- <div class="dtHasLabel"><label>法定期限：</label>{{obj.extPropsObj.lawLimitTime}}</div> -->
                </td>
                <th>送达方式</th>
                <td>
                  {{obj.extPropsObj.resultType}}
                  <!-- {{getEnumText(RESULT_DELIVERY,obj.extPropsObj.resultType)}} -->
                  <!-- <div class="dtHasLabel"><label>送达时限：</label>{{obj.extPropsObj.resultLimit}}</div> -->
                  <!-- <div class="dtHasLabel"><label>送达方式：</label>{{getEnumText(RESULT_DELIVERY,obj.extPropsObj.resultType)}}</div> -->
                </td>
              </tr> 
              <!-- <tr>
                <th>申请方式</th>
                <td colspan="3">
                  {{getEnumText(APP_METHOD,obj.extPropsObj.appType)}}
                </td>
              </tr> -->
              <tr>
                <th>咨询电话</th>
                <td>{{obj.extPropsObj.askPhone}}</td>
                <th>监督电话</th>
                <td>{{'0571-82812345 转最多跑一次专席'}}</td>
              </tr>
              <!-- <tr>
                  <th>办公地址</th>
                  <td colspan="3">{{obj.extPropsObj.workPlace}}</td>
              </tr>
              <tr>
                  <th>办公时间</th>
                  <td colspan="3">{{obj.extPropsObj.workTime}}</td>
              </tr> -->
              <tr>
                  <th>办公地址、时间</th>
                  <td colspan="3">
                    <div style="margin-bottom:6px;" v-for="(item, index) in obj.extPropsObj.workPlaceArr" :key="index">
                      <div class="dtHasLabel"><label>办公地址:</label>{{item.place}}</div>
                      <div class="dtHasLabel"><label>办公时间:</label>{{item.time}}</div>
                    </div>
                  </td>
              </tr>
              <tr>
                    <th>是否属于跑一次事项</th>
                    <td>
                      <span v-if="obj.extPropsObj.isRunOne=='Y'">是</span>
                      <span v-else>否</span>
                    </td>
                    <th>是否属于跑零次事项</th>
                    <td>
                      <span v-if="obj.extPropsObj.isRunZero=='Y'">是</span>
                      <span v-else>否</span>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
        <template v-for="item in activities" >
          <div class="formblock detailBlock" v-if="item.id!='0'" :key="item.id">
            <h3 class="h3">{{item.name}}</h3>
            <div class="text">
              <template v-for="detailText in obj.detailTexts" >
                <div :key="detailText.entryId" v-if="item.enableText&&detailText.entryId==item.id" v-html="detailText.text">
                </div>
              </template>
              <div v-if="item.enableFile">
                <el-table
                  :data="obj.detailFiles.filter(detailFile=>{return detailFile.entryId==item.id})"
                  :show-header="true"
                  border
                  :header-cell-style="{backgroundColor:'#FAFAFA'}"
                  style="width: 100%">
                  <el-table-column label="材料名称" min-width="140px">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.fileDesc}}<a class="download colorTheme" v-if="scope.row.fileHeaderIds.length>0" @click.prevent="handleDownload(scope.row)">{{scope.row.butDesc||'下载'}}</a>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="材料出具描述" min-width="140px" prop="materialIssueDesc">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.materialIssueDesc}}
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column label="材料形式" width="108px">
                    <template slot-scope="scope"> 
                      {{getEnumText(MATERIAL_FORM,scope.row.extPropsObj.materialType)}}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="材料详细要求" min-width="140px" prop="materialRequirements">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.materialRequirements}}
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column label="材料数量" width="100px" prop="commitmentNum">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.commitmentNum}}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="法定份数" width="100px" prop="legalNum">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.legalNum}}
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column label="备注" min-width="140px" prop="comments">
                  </el-table-column>
                </el-table>
              </div>
              <!-- <template v-for="detailFile in obj.detailFiles" >
                <div :key="detailFile.id" v-if="item.enableFile&&detailFile.entryId==item.id">
                  <div>
                    {{detailFile.fileDesc}}<a class="download colorTheme" v-if="detailFile.fileHeaderIds.length>0" @click.prevent="handleDownload(detailFile)">{{detailFile.butDesc||'下载'}}</a>
                  </div>
                </div>
              </template> -->
            </div>
          </div>
        </template>
      </el-card>
    </div>
    <div class="iBottom">
      <el-button v-if="!obj.favorite" size="mini" @click.native="favoriteControl(obj)"><i class="icon iconfont iconturnedinnot"></i>收藏</el-button>
      <el-button v-if="obj.favorite" size="mini" @click.native="favoriteControl(obj)"><i class="icon iconfont iconturnedin"></i>已收藏</el-button>
      <el-button type="primary" v-if="obj.enableHandleOnline" size="mini" @click.native="handleOnline(obj)">在线办理</el-button>
      <el-button type="primary" v-if="obj.enableHandleOnMobile" size="mini" @click.native="handleOnMobile(obj)">掌上办理</el-button>
    </div>
    <div id="qrCode" ref="qrCodeDiv" v-show="false"></div>
  </div>
</template>
<script>
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import iHeader from './components/iHeader.vue'
  import QRCode from 'qrcodejs2' 
  import {mapMutations} from 'vuex'
  import {getDetailEntry,getItemSingle,getItemOnlineUrl,getItemMobileUrl,getEnumSelectEnabled,addItemFavorite,delItemFavorite} from '@/modules/portalIndex/service/service.js'
  import {baseUrl} from '@/modules/portalIndex/config/env'
  import ecoBreadList from '@/modules/portalIndex/views/components/ecoBreadList.vue'
  export default{
      name:'guidePage',
      components: {
        ecoContent,
        iHeader,
        ecoBreadList
      },
      data() {
        return {
          activities: [],
          currentLineKey:'0',
          obj:{
            name:'', 
            dept:'', 
            deptName:'', 
            // deptObj:{
            //   orgPath:''
            // },
            titleId:'', 
            linkAppId:'', 
            linkAppCode:'', 
            handleUrl4Pc:'', 
            handleUrl4Mobile:'', 
            enableHandleGuide:true, 
            enableHandleOnline:false, 
            enableHandleOnMobile:false, 
            groupId:'', 
            desc:'', 
            handleMethod:'',
            handleTips:'',
            favorite:false,
            detailTexts:[], 
            detailFiles:[],
            extProps:[],
            extPropsObj:{
              appObj:'',
              workComp:'',
              workDept:'',
              resultDept:'',
              appLimitTime:'',
              lawLimitTime:'',
              resultLimit:'',
              resultType:'',
              appType:'',
              askPhone:'',
              complaintPhone:'',
              workPlaceArr:[],
              workPlace:'',
              workTime:'',
              isRunOne:'N',
              isRunZero:'N',
            },
            extOrgs:[],
          },
          APP_METHOD:[],//申请方式
          MATERIAL_FORM:[],//材料形式
          RESULT_DELIVERY:[],//送达方式
          TIME_LIMIT:[],//办结时限
        }
      },
      created(){
        this.getDetailEntry();
        this.getItemSingle();

        this.getEnumSelectEnabled('APP_METHOD');
        this.getEnumSelectEnabled('MATERIAL_FORM');
        this.getEnumSelectEnabled('RESULT_DELIVERY');
        this.getEnumSelectEnabled('TIME_LIMIT');
      },
      computed: {
      },
      mounted(){
        // this.setShowPic();
      },
      methods: {
        // setShowPic(){
        //   let func = (e)=>{
        //       let elem  = e.target || e.srcElement;
        //       let imgurl = elem.dataset.src;
        //       if (elem.className.indexOf('showPicture')>-1){
        //         this.$alert('<img src="'+imgurl+'" style="max-width: 100%;max-height: 100%;display: block; margin: 0 auto;"/>', '', {
        //           dangerouslyUseHTMLString: true
        //         });
        //       }
        //   }
        //   // document.getElementById('container').addEventListener("click", func);
        // },
        getEnumText(list,id){
          return list.filter(item=>{return item.id == id}).map(item=>item.text).join('');
        },
        // setScroll(){
        //   let that = this;
        //   let $content = this.$refs.content.$el;
        //   let h3s =  document.getElementsByTagName('h3');
        //   $content.onscroll=(e)=>{
        //     let elem = e.target||e.srcElement;
        //     let pageBottomY = elem.scrollTop+elem.clientHeight;
        //     let index=0;
        //     for (let i=0;i<h3s.length;i++){
        //       let elH3 = h3s[i];
        //       let elemBottomY = elH3.offsetTop+elH3.clientHeight;
        //       if (elemBottomY<pageBottomY){
        //         index = i
        //       }else{
        //         break;
        //       }
        //     }
        //     that.currentLineKey = that.activities[index].id;
        //   }
        // },
        // timeLineClick(item){
        //   let $content = this.$refs.content.$el;
        //   let h3s =  document.getElementsByClassName('h3');
        //   let elH3 = Array.prototype.filter.call(h3s, function(node){
        //     return item.name==node.innerText;
        //   });
        //   if (elH3[0]){
        //     let elem = elH3[0];
        //     let elemBottomY = elem.offsetTop+elem.clientHeight-50;
        //     $content.scrollTo(0,elemBottomY);
        //   }
        //   this.$nextTick(()=>{
        //     this.currentLineKey=item.id;
        //   })
        // },
        getDetailEntry(){
          getDetailEntry().then((res)=>{
            if (res.data){
              this.activities = [{id:"0",name:'基本信息'}].concat(res.data);
              // this.currentLineKey = res.data[0]&&res.data[0].id;
            }
          }).catch(e=>{})
        },
        getItemSingle(){
          let id = this.$route.params.id;
          getItemSingle(id).then(res=>{
            if (res.data){
              this.obj.id = res.data.id;
              this.obj.name = res.data.name;
              this.obj.dept = res.data.dept;
              this.obj.deptName = res.data.deptName;
              this.obj.titleId = res.data.titleId;
              this.obj.linkAppId = res.data.linkAppId;
              this.obj.linkAppCode = res.data.linkAppCode;
              this.obj.handleUrl4Pc = res.data.handleUrl4Pc;
              this.obj.handleUrl4Mobile = res.data.handleUrl4Mobile;
              this.obj.enableHandleGuide = res.data.enableHandleGuide;
              this.obj.enableHandleOnline = res.data.enableHandleOnline;
              this.obj.enableHandleOnMobile = res.data.enableHandleOnMobile;
              this.obj.groupId = res.data.groupId;
              this.obj.desc = res.data.desc;
              this.obj.favorite = res.data.favorite;
              this.obj.handleMethod = res.data.handleMethod;
              this.obj.handleTips = res.data.handleTips;
              this.obj.detailTexts = res.data.detailTexts.map(item=>{
                try {
                  item.text = item.text.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
                '<div type="button" class="showPictureButton"><i class="el-icon-picture-outline"></i> 查看流程图<img src="$1" preview="'+item.id+'" preview-text="流程图"/></div>');
                } catch (error) {
                  
                }
                return item;
              });
              this.obj.detailFiles = (res.data.detailFiles||[]).map(item=>{
                let extPropsObj = {
                  materialIssueDesc:'',
                  materialType:'',
                  materialRequirements:'',
                  commitmentNum:'',
                  legalNum:'',
                }
                for (let j=0;j<item.extProps.length;j++){
                  let prop = item.extProps[j];
                  extPropsObj[prop.key] = prop.val;
                }
                item.extPropsObj = extPropsObj;
                return item;
              });
              this.obj.extProps = res.data.extProps;
              for (let j=0;j<res.data.extProps.length;j++){
                let item = res.data.extProps[j];
                if (item.key=='workPlaceArr'){
                  try {
                    this.obj.extPropsObj[item.key] = JSON.parse(item.val);
                  } catch (error) {}
                }else{
                  this.obj.extPropsObj[item.key] = item.val;
                }
              }
              this.$previewRefresh()
            }
          }).catch(e=>{})
        },
        getEnumSelectEnabled(id){
          getEnumSelectEnabled(id).then(res=>{
            this[id] = res.data;
          }).catch(e=>{})
        },
        handleOnline(item){
          if(item.handleMethod=='HANDLE_DIRECTLY'){
            this.getItemOnlineUrl(item)
          }
          if(item.handleMethod=='SHOW_TIPS'||item.handleMethod=='SHOW_TIPS_AND_HANDLE'){
            window.parent.sysvm.$confirm(item.handleTips, '提示',{
              dangerouslyUseHTMLString:true,
              showConfirmButton:item.handleMethod=='SHOW_TIPS_AND_HANDLE',
              showCancelButton:false,
              // center:true,
            }).then(() => {
              this.getItemOnlineUrl(item);
            }).catch(() => {});
          }
        },
        getItemOnlineUrl(item){
          getItemOnlineUrl(item.id).then(res=>{
            try {
              let url = res.data.replace(/^\s*|\s*$/g,"");
              window.open(url)
            } catch (error) {}
          }).catch(e=>{})
        },
        handleOnMobile(item){
          if(item.handleMethod=='HANDLE_DIRECTLY'){
            this.getItemMobileUrl(item)
          }
          if(item.handleMethod=='SHOW_TIPS'||item.handleMethod=='SHOW_TIPS_AND_HANDLE'){
            this.$confirm(item.handleTips, '提示',{
              dangerouslyUseHTMLString:true,
              showConfirmButton:item.handleMethod=='SHOW_TIPS_AND_HANDLE',
              showCancelButton:false,
              // center:true,
            }).then(() => {
              this.getItemMobileUrl(item);
            }).catch(() => {});
          }
        },
        getItemMobileUrl(item){
          getItemMobileUrl(item.id).then(res=>{
            try {
              let url = res.data.replace(/^\s*|\s*$/g,"");
              document.getElementById("qrCode").innerHTML=""
              let qrcode = new QRCode('qrCode', {
                width: 180,  
                height: 180,
                text: url, // 二维码地址
                colorDark : "#000",
                colorLight : "#fff",
                correctLevel : QRCode.CorrectLevel.L
              })
              setTimeout(()=>{
                this.$confirm('<div style="display:inline-block;">'+qrcode._el.innerHTML+'</div>', '使用钉钉扫码',{
                  dangerouslyUseHTMLString:true,
                  showConfirmButton:false,
                  showCancelButton:false,
                  center:true,
                }).then(() => {}).catch(() => {});
              },200)
            } catch (error) {}
          }).catch(e=>{})
        },
        handleDownload(item){
          var token = sessionStorage.getItem("ecoToken");
          let ids = item.fileHeaderIds;
          let id = ids[ids.length-1];//下载最后一个文件
          let url = baseUrl+'/file-manager/download/'+id+"?eco-auth-token="+token;
          window.open(url)
        },
        favoriteControl(item){
          if (item.favorite){//已收藏要 取消收藏
            delItemFavorite(item.id).then(res=>{
              item.favorite = false;
              this.$message.success('取消成功！')
            }).catch(e=>{})
          }else{//未收藏要 收藏
            addItemFavorite(item.id).then(res=>{
              item.favorite = true;
              this.$message.success('收藏成功！')
            }).catch(e=>{})
          }
        }
      },
      watch:{
        '$route.params.id'(val){
          this.getItemSingle();
        }
      }
  }
</script>
<style scoped>
.dot{
  height: 10px;
  width: 10px;
  border-radius: 5px;
  border: 2px solid #ED9440;
  background-color: #fff;
  box-sizing: border-box;
}
.timeLineText:hover{
  color: #ED9440;
}
.itemForm .el-form-item__label{
  padding: 4px 0 0;
}
.formblock{
  position: relative;
  padding:16px 0 32px 120px;
  border-bottom: 1px solid #F6F6F6;
}
.formblock>h3{
  position: absolute;
  left: 0;
  line-height: 20px;
  height: 14px;
  padding-left: 12px;
  font-weight: bold;
  width: 110px;
}
.detailBlock .text{
  /* padding-left: 20px; */
}
.download{
  margin-left: 12px;
}
.dtHasLabel{
  font-size: 13px;
}
.dtHasLabel label{
  color: #aaa;
  padding-right: 10px;
}
.pageTitle{
  width: 100%;
  min-width: 1180px;
  height: 80px;
  background-color: #fff;
}
.pageTitle .title{
  height:30px;
  line-height:30px;
  font-size:16px;
  font-weight:bold;
  padding-right:20px;
}
.pageTitle .desc{
  height:30px;
  line-height:40px;
  font-size:12px;
  color: #ccc;
}
.iBottom{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #fff;
  border-top: 1px solid #eee;
}
.iBottom .icon{
  vertical-align: middle;
  color: #2F87F3;
}
</style>
<style>
.showPictureButton {
    position: relative;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
}
.showPictureButton:hover{
  border: 1px solid #409EFF;
  color: #409EFF;
}
.showPictureButton img{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
