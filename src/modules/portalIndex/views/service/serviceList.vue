<template>
  <div>
    <iHeader></iHeader>
    <iBanner></iBanner>
    <div class="container" style="margin-top:12px;padding-bottom: 12px;">
      <el-row :gutter="12">
        <el-col :span="18">
          <el-card :body-style="{ padding: '0 0 0 200px' }" shadow="never" style="min-height:600px;position:relative;">
            <div class="sLeft">
              <ul class="cardNav clearfix">
                <!-- <li>机构</li> -->
                <li class="active">主题</li>
              </ul>
              <ul class="cList">
                <div class="searchBox">
                  <el-input 
                    size="small" 
                    placeholder="请输入内容" 
                    suffix-icon="el-icon-search" 
                    v-model="titleSearchText"></el-input>
                </div>
                <div style="position:absolute;top:82px;left:0;right:0;bottom:0;overflow:auto;">
                  <li class="ellipsis" :class="{active:form.titleId==''}"  @click="titleClick()">全部</li>
                  <li v-for="item in titleList" class="ellipsis" :class="{active:form.titleId==item.id}" :key="item.id" @click="titleClick(item)">{{item.name}}</li>
                </div>
              </ul>
            </div>
            <div class="smain">
              <ul class="cardNav clearfix">
                <li :class="{active:mainActiveName=='All'}" @click="mainActiveName = 'All'">全部</li>
                <li :class="{active:mainActiveName=='Depts'}" @click="mainActiveName = 'Depts'">多部门联办</li>
              </ul>
              <div style="padding: 12px 12px 0;">
                <div style="text-align:right;line-height:40px;">
                  <el-input style="float: none;width:473px;" placeholder="请输入事项名" v-model="form.name" suffix-icon="el-icon-search"></el-input>
                  <!-- <el-input style="float: right;width:200px;margin-left:10px;" placeholder="选择部门" :value="form.deptName||form.dept" @click.native="openDeptChooser"></el-input> -->
                  <!--  -->
                  <el-radio-group style="float: none;margin:0 10px;" v-model="isOnline" size="mini" @change="isOnlineChange">
                    <el-radio-button label="ALL">全部</el-radio-button>
                    <el-radio-button label="Online">可在线办理</el-radio-button>
                    <!-- <el-radio-button label="OnMobile">可掌上办理</el-radio-button> -->
                  </el-radio-group>
                </div>
                <!-- <div class="count">
                  主项{{countObj.groupCount}}项，
                  子项{{countObj.itemCount}}项，
                  可在线办理{{countObj.enableHandleOnlineCount}}项，
                  可掌上办理{{countObj.enableHandleOnMobileCount}}项
                </div> -->
                <div class="noContent" v-if="list.length==0">暂无事项</div>
                <el-collapse v-else class="subjectList" v-model="activeNames" @change="handleChange">
                  <template v-for="item in list">
                    <div :key ="item.id">
                      <el-collapse-item :name="item.id" v-if="item.enabledShow" :class="{hasChild:item.items&&item.items.length>0}">
                        <template slot="title">
                          <!-- <span class="colorTheme">{{item.name}}</span> -->
                          <div class="serviceCollapseTitle ellipsis">{{item.name}}</div>
                        </template>
                        <!-- <div class="subjectItem" v-for="item in item.items" :key="item.id" @click="goGuidePage(item)">
                          <div class="subjectItem-icon"><i class="el-icon-document"></i></div>
                          <div class="subjectItem-left">
                            <div>
                              <div class="title ellipsis">{{item.name}}</div>
                              <p class="ellipsis">办理部门&nbsp;:&nbsp;{{item.deptName||item.dept}}</p>
                            </div>
                          </div>
                          <div class="subjectItem-right">
                            <el-button type="primary" :class="{hidden:!item.enableHandleGuide}" size="mini" @click.native.stop="goGuidePage(item)">办理指南</el-button>
                            <el-button type="primary" :class="{hidden:!item.enableHandleOnline}" size="mini" @click.native.stop="handleOnline(item)">网上办理</el-button>
                            <el-button type="primary" :class="{hidden:!item.enableHandleOnMobile}" size="mini" @click.native.stop="handleOnMobile(item)">掌上办理</el-button>
                          </div>
                        </div> -->
                        <div class="serviceBox" v-for="item in item.items" :key="item.id">
                          <div class="serviceItem">
                            <div class="serviceItem-icon">
                              <div class="wrap">
                                <i class="el-icon-document"></i>
                              </div>
                            </div>
                            <div class="serviceItem-left">
                              <div>
                                <div class="title ellipsis">{{item.name}}</div>
                                <p class="ellipsis">办理部门&nbsp;:&nbsp;{{item.deptName||item.dept}}</p>
                              </div>
                            </div>
                            <div class="serviceItem-right">
                                <i class="el-icon-star-on icon" :style="{color:item.favorite?'#f8cd29':'#ccc'}" @click="favoriteControl(item)"></i>
                            </div>
                          </div>
                          <div class="serviceBtnGroup">
                            <div class="serviceBtn" :class="{active:item.enableHandleOnline}" @click.stop="item.enableHandleOnline&&handleOnline(item)">网上办理</div>
                            <div class="serviceBtn" :class="{active:item.enableHandleOnMobile}" @click.stop="item.enableHandleOnMobile&&handleOnMobile(item)">掌上办理</div>
                            <div class="serviceBtn" :class="{active:item.enableHandleGuide}" @click.stop="item.enableHandleGuide&&goGuidePage(item)">办事指南</div>
                          </div>
                        </div>
                      </el-collapse-item>
                      <div v-if="!item.enabledShow">
                        <template v-for="item in item.items">
                          <div class="serviceBox" :key="item.id">
                            <div class="serviceItem">
                              <div class="serviceItem-icon">
                                <div class="wrap">
                                  <i class="el-icon-document"></i>
                                </div>
                              </div>
                              <div class="serviceItem-left">
                                <div>
                                  <div class="title ellipsis">{{item.name}}</div>
                                  <p class="ellipsis">办理部门&nbsp;:&nbsp;{{item.deptName||item.dept}}</p>
                                </div>
                              </div>
                              <div class="serviceItem-right">
                                  <i class="el-icon-star-on icon" :style="{color:item.favorite?'#f8cd29':'#ccc'}" @click="favoriteControl(item)"></i>
                              </div>
                            </div>
                            <div class="serviceBtnGroup">
                              <div class="serviceBtn" :class="{active:item.enableHandleOnline}" @click.stop="item.enableHandleOnline&&handleOnline(item)">网上办理</div>
                              <div class="serviceBtn" :class="{active:item.enableHandleOnMobile}" @click.stop="item.enableHandleOnMobile&&handleOnMobile(item)">掌上办理</div>
                              <div class="serviceBtn" :class="{active:item.enableHandleGuide}" @click.stop="item.enableHandleGuide&&goGuidePage(item)">办事指南</div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </el-collapse>
                <div class="more" v-if="form.total>list.length"><span @click="nextPage">查看更多</span></div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div class="cardTitle">常用事项</div>
            <div  style="height:160px;overflow-y:auto;">
              <div class="iItem ellipsis" v-for="(item, index) in hotService.list" :key="index" @click="goGuidePage(item)">{{item.name}}</div>
              <div class="noContent" v-if="hotService.list.length==0">暂无常用事项</div>
            </div>
          </el-card>
          <el-card :body-style="{ padding: '0px' }" shadow="never" style="margin-top:12px;">
            <div class="cardTitle">收藏事项</div>
            <div  style="height:160px;overflow-y:auto;">
              <div class="iItem ellipsis" v-for="(item, index) in favService.list" :key="index" @click="goGuidePage(item)">{{item.name}}</div>
              <div class="noContent" v-if="favService.list.length==0">暂无收藏事项</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div id="qrCode" ref="qrCodeDiv" v-show="false"></div>
    </div>
  </div>
</template>
<script>
  import {getTitleList4select,getGroupItemSelectViewList,getItemCount,getItemOnlineUrl,getItemMobileUrl,getItemList,delItemFavorite,addItemFavorite} from '@/modules/portalIndex/service/service.js'
  import {mapMutations} from 'vuex'
  import iHeader from './components/iHeader.vue'
  import iBanner from './components/list/iBanner.vue'
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import EcoOrgPick from '@/components/orgPick/main.js'
  import QRCode from 'qrcodejs2' 
  export default{
      name:'serviceList',
      components: {
        ecoContent,
        iHeader,
        iBanner,
      },
      data() {
        return {
          countObj:{
            enableHandleOnMobileCount: 0,
            enableHandleOnlineCount: 0,
            groupCount: 0,
            itemCount: 0,
          },
          titleSearchText:'',//主题筛选
          mainActiveName:'All',//Depts
          form:{
            page:1,
            rows:10,
            total:0,
            dept:'',
            titleId:'',
            enableHandleOnline:null,
            enableHandleOnMobile:null,
            name:'',
            multiDept:'',
            attr6:'',
          },
          titleListAll: [],
          titleList: [],
          list: [],
          activeNames:[],
          isOnline:'ALL',//全部，可在线办理，可掌上办理
          hotService:{
            titleGroupId:'',
            attr2:'Y',
            rows:9999,
            page:1,
            sort:'clickNum',
            order:'desc',
            list:[]
          },
          favService:{
            myFavoriteQuery:true,
            rows:9999,
            page:1,
            sort:'clickNum',
            order:'desc',
            list:[]
          },
        }
      },
      mounted(){
        this.getTitleList4select();
        this.getData();
        // this.getItemCount();
        this.getItemList(this.hotService)
        this.getItemList(this.favService)
        this.SET_BREAD([{
          label:'首页',
          to:{
            name:'serviceList'
          }
        }])
      },
      methods: {
        ...mapMutations(['ADD_BREAD','SET_BREAD']),
        getItemList(mod){
          getItemList(mod).then(res=>{
            mod.list = res.data.rows;
          }).catch(e=>{})
        },
        getData(){
          this.form.page=1;
          this.form.total=0;
          this.list=[];
          this.activeNames = [];
          this.getList();
        },
        getList(){
          getGroupItemSelectViewList(this.form).then(res=>{
            if (res.data&&res.data.rows){
              this.list = this.list.concat(res.data.rows);
              this.form.total = res.data.total;
              this.activeNames = this.activeNames.concat(res.data.rows.map(item=>{
                return item.id;
              }))
            }
          }).catch(e=>{})
        },
        nextPage(){
          this.form.page = this.form.page + 1;
          this.getList();
        },
        getTitleList4select(){
          getTitleList4select().then((res)=>{
            if (res.data&&res.data.rows){
              let titleList = res.data.rows.filter(item=>{
                if (item.id=='1178258596133470210'){
                  return false;
                }
                return true;
              });
              this.titleList = titleList
              this.titleListAll= titleList;
            }
          }).catch(e=>{})
        },
        getItemCount(){
          getItemCount().then(res=>{
            if (res.data){
              this.countObj = res.data;
            }
          }).catch(e=>{})
        },
        titleClick(item){ //选择主题
          if (item){
            this.form.titleId = item.id;
          }else{
            this.form.titleId = '';
          }
          this.getData();
        },
        isOnlineChange(label){//筛选 全部 可在线 可掌上
          switch (label) {
            case 'ALL':
                this.form.enableHandleOnline=null;
                this.form.enableHandleOnMobile=null;
              break;
            case 'Online':
                this.form.enableHandleOnline=true;
                this.form.enableHandleOnMobile=null;
              break;
            case 'OnMobile':
                this.form.enableHandleOnline=null;
                this.form.enableHandleOnMobile=true;
              break;
            default:
              break;
          }
          this.getData();
        },
        openDeptChooser(){
          let options = {
              selectMulti:false,
              selectType:'Dept',
              selectDefault:'',
              deptScopeType:'BUSINESS',
          }
          
          var that  = this;
          let callBack = function(callObj){
            that.form['dept'] = callObj.resourceId;
            that.form['deptName'] = callObj.orgPath;
            that.getData();
            // that.form['deptObj'] = callObj;
          }
          EcoOrgPick.searchReceiver(options,callBack);
        },
        handleSizeChange(val) {
            this.form.rows = val;
            this.form.page = 1;
            this.getList();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.getList();
        },
        goGuidePage(item){
          this.ADD_BREAD({
            // label:'办理指南——'+item.name,
            label:'事项详情',
            to:{name:'guidePage',params:{id:item.id}}
          })
          this.$router.push({
            name:'guidePage',
            params:{
              id:item.id
            }
          })
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
        favoriteControl(item){
          if (item.favorite){//已收藏要 取消收藏
            delItemFavorite(item.id).then(res=>{
              item.favorite = false;
              this.getItemList(this.favService)
            }).catch(e=>{})
          }else{//未收藏要 收藏
            addItemFavorite(item.id).then(res=>{
              item.favorite = true;
              this.getItemList(this.favService)
            }).catch(e=>{})
          }
        },
        handleChange(val){
          // console.log(val)
        },
      },
      watch: {
        'form.name'(){
          this.getData();
        },
        'mainActiveName'(val){
          if (val=='All'){
            // this.form.multiDept=''
            this.form.itemAttr6='';
            this.getData();
          }
          if (val=='Depts'){
            // this.form.multiDept='Y'
            this.form.itemAttr6='Y';
            this.getData();
          }
        },
        'titleSearchText'(val){
          if (val==''){
            this.titleList = this.titleListAll;
          }else{
            this.titleList = this.titleListAll.filter(item=>{
              if (item.name.indexOf(val)>-1){
                return true;
              }
              return false;
            })
          }
        }
      },
  }
</script>
<style>
.count{
  text-align: right;
  color: #999;
}
.titleList{
  display: inline-block;
  height: 28px;
  line-height: 28px;
  margin-bottom: 2px;
  font-size: 0;
}
.titleList span{
  display: inline-block;
  padding: 0 10px;
  font-size: 14px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  width: 140px;
  text-align: center;
  background-color: #f4f4f4;
  margin-bottom: 4px;
}
.titleList span.active{
  background-color: #5373C8;
  color: #fff;
}
.subjectItem-right{
  flex-basis: 180px;
  justify-content: flex-start;
}
.hidden{
  visibility: hidden;
}
.noContent{
  padding-top: 12px;
  text-align: center;
  font-size: 12px;
  color: #ccc;
}
.cardTitle{
  height: 50px;
  line-height: 50px;
  padding: 0 12px;
  font-size: 16px;
}
.cardNav{
  height: 50px;
  line-height: 49px;
  border-bottom: 1px solid #F6F6F6;
  list-style: none;
  font-size: 16px;
  text-align: right;
}
.cardNav li{
  float: left;
  padding: 0 12px;
  cursor: pointer;
}
.cardNav li.active{
  border-bottom: 2px solid #2F87F3;
}
.sLeft{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
}
.cList li{
  border-bottom: 1px solid #F6F6F6;
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  cursor: pointer;
}
.cList li.active ,.cList li:hover{
  background-color: #F0F7FF;
  color: #2F87F3;
}
.searchBox .el-input__inner{
  border: none;
  border-bottom: 1px solid #F6F6F6;
}
.smain{
  border-left: 1px solid #F6F6F6;
  min-height: 600px;
}
.more{
  text-align: center;
  line-height: 30px;
  font-size: 13px;
  padding: 12px 0;
}
.more span{
  cursor: pointer;
  color: #2F87F3;
}

.iItem{
  padding: 0 10px;
  line-height: 40px;
  height: 40px;
  cursor: pointer;
}
.iItem:hover{
  color: #5373C8;
}
</style>
