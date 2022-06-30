<template>
  <div  class="container">
    <el-timeline style="position:fixed;top:150px;right:0;width:180px;z-index:999;" size="mini">
      <el-timeline-item
        v-for="item in activities"
        :key="item.id"
        hide-timestamp>
        <div slot="dot" :class="{dot:currentLineKey==item.id}"></div>
        <div class="cpoint timeLineText" :style="{color:currentLineKey==item.id?'#ED9440':'#333'}" @click="timeLineClick(item)">{{item.name}}</div>
      </el-timeline-item>
    </el-timeline>
    <ecoContent top="0" style="padding:0 20px 10px;box-sizing:border-box;">
      <ecoBreadList></ecoBreadList>
      <div class="subjectItem" style="border-bottom:none;">
        <div class="subjectItem-left">
            <div class="title ellipsis">{{obj.name}}</div>
            <p class="ellipsis">办理部门&nbsp;:&nbsp;{{obj.deptName||obj.dept}}</p>
        </div>
        <div class="subjectItem-right">
          <el-button type="primary" v-if="obj.enableHandleOnline" size="mini" @click.native="handleOnline(obj)">在线办理</el-button>
          <el-button type="primary" v-if="obj.enableHandleOnMobile" size="mini" @click.native="handleOnMobile(obj)">掌上办理</el-button>
        </div>
      </div>
    </ecoContent>
    <ecoContent ref="content" top="100px" bottom="0" style="padding:20px 200px 20px 20px;">
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
                  <!-- {{getEnumText(TIME_LIMIT,obj.extPropsObj.appLimitTime)}} -->
                  <div class="dtHasLabel"><label>承诺期限：</label>{{obj.extPropsObj.appLimitTime}}</div>
                  <div class="dtHasLabel"><label>法定期限：</label>{{obj.extPropsObj.lawLimitTime}}</div>
                </td>
                <th>送达方式</th>
                <td>
                  <!-- {{getEnumText(RESULT_DELIVERY,obj.extPropsObj.resultType)}} -->
                  <div class="dtHasLabel"><label>送达时限：</label>{{obj.extPropsObj.resultLimit}}</div>
                  <div class="dtHasLabel"><label>送达方式：</label>{{getEnumText(RESULT_DELIVERY,obj.extPropsObj.resultType)}}</div>
                </td>
              </tr> 
              <tr>
                <th>申请方式</th>
                <td colspan="3">
                  <!-- {{obj.extPropsObj.appType}} -->
                  {{getEnumText(APP_METHOD,obj.extPropsObj.appType)}}
                </td>
              </tr>
              <tr>
                <th>咨询电话</th>
                <td>{{obj.extPropsObj.askPhone}}</td>
                <th>监督电话</th>
                <td>{{obj.extPropsObj.complaintPhone}}</td>
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
                      <span v-if="obj.extPropsObj.isRunOne=='Y'">√</span>
                      <span v-else>×</span>
                    </td>
                    <th>是否属于跑零次事项</th>
                    <td>
                      <span v-if="obj.extPropsObj.isRunZero=='Y'">√</span>
                      <span v-else>×</span>
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
                  style="width: 100%">
                  <el-table-column label="材料名称" min-width="140px">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.fileDesc}}<a class="download colorTheme" v-if="scope.row.fileHeaderIds.length>0" @click.prevent="handleDownload(scope.row)">{{scope.row.butDesc||'下载'}}</a>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="材料出具描述" min-width="140px" prop="materialIssueDesc">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.materialIssueDesc}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="材料形式" width="108px">
                    <template slot-scope="scope"> 
                      {{getEnumText(MATERIAL_FORM,scope.row.extPropsObj.materialType)}}
                    </template>
                  </el-table-column>
                  <el-table-column label="材料详细要求" min-width="140px" prop="materialRequirements">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.materialRequirements}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="材料数量" width="100px" prop="commitmentNum">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.commitmentNum}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="法定份数" width="100px" prop="legalNum">
                    <template  slot-scope="scope" >
                       <div>
                        {{scope.row.extPropsObj.legalNum}}
                      </div>
                    </template>
                  </el-table-column>
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
    </ecoContent>
    <div id="qrCode" ref="qrCodeDiv" v-show="false"></div>
  </div>
</template>
<script>
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import QRCode from 'qrcodejs2' 
  import {mapMutations} from 'vuex'
  import {getDetailEntry,getItemSingle,getItemOnlineUrl,getItemMobileUrl,getEnumSelectEnabled} from '@/modules/portal1/service/service.js'
  import {baseUrl} from '@/modules/portal1/config/env'
  import ecoBreadList from '@/modules/portal1/views/components/ecoBreadList.vue'
  export default{
      name:'guidePage',
      components: {
        ecoContent,
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
        this.setScroll();
      },
      methods: {
        getEnumText(list,id){
          return list.filter(item=>{return item.id == id}).map(item=>item.text).join('');
        },
        setScroll(){
          let that = this;
          let $content = this.$refs.content.$el;
          let h3s =  document.getElementsByTagName('h3');
          $content.onscroll=(e)=>{
            let elem = e.target||e.srcElement;
            let pageBottomY = elem.scrollTop+elem.clientHeight;
            let index=0;
            for (let i=0;i<h3s.length;i++){
              let elH3 = h3s[i];
              let elemBottomY = elH3.offsetTop+elH3.clientHeight;
              if (elemBottomY<pageBottomY){
                index = i
              }else{
                break;
              }
            }
            that.currentLineKey = that.activities[index].id;
          }
        },
        timeLineClick(item){
          let $content = this.$refs.content.$el;
          let h3s =  document.getElementsByClassName('h3');
          let elH3 = Array.prototype.filter.call(h3s, function(node){
            return item.name==node.innerText;
          });
          if (elH3[0]){
            let elem = elH3[0];
            let elemBottomY = elem.offsetTop+elem.clientHeight-50;
            $content.scrollTo(0,elemBottomY);
          }
          this.$nextTick(()=>{
            this.currentLineKey=item.id;
          })
        },
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
              this.obj.detailTexts = res.data.detailTexts;
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
            }
          }).catch(e=>{})
        },
        getEnumSelectEnabled(id){
          getEnumSelectEnabled(id).then(res=>{
            this[id] = res.data;
          }).catch(e=>{})
        },
        handleOnline(item){
          getItemOnlineUrl(item.id).then(res=>{
            window.open(res.data)
          }).catch(e=>{})
        },
        handleOnMobile(item){
          getItemMobileUrl(item.id).then(res=>{
            document.getElementById("qrCode").innerHTML=""
            let qrcode = new QRCode('qrCode', {
              width: 280,  
              height: 280,
              text: res.data, // 二维码地址
              colorDark : "#000",
              colorLight : "#fff",
              correctLevel : QRCode.CorrectLevel.L
            })
            setTimeout(()=>{
              window.parent.sysvm.$confirm('<div style="display:inline-block;">'+qrcode._el.innerHTML+'</div>', '使用钉钉扫码',{
                dangerouslyUseHTMLString:true,
                showConfirmButton:false,
                showCancelButton:false,
                center:true,
              }).then(() => {}).catch(() => {});
            },200)
          }).catch(e=>{})
        },
        handleDownload(item){
          var token = sessionStorage.getItem("ecoToken");
          let ids = item.fileHeaderIds;
          let id = ids[ids.length-1];//下载最后一个文件
          let url = baseUrl+'/file-manager/download/'+id+"?eco-auth-token="+token;
          window.open(url)
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
  padding-bottom: 20px;
}
.formblock>h3{
  line-height: 14px;
  height: 14px;
  padding-left: 12px;
  border-left: 6px solid #ED9440;
  color: #ED9440;
  font-weight: 500;
  margin: 16px 0;
}
.detailBlock .text{
  padding-left: 20px;
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
</style>
