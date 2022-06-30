<template>
  <div class="container">
    <mainTab></mainTab>
    <div style="padding:0 30px 20px;">
      <el-card style="position:relative">
        <div slot="header" class="clearfix">
          <!--  -->
          <!-- <el-dropdown>
            <span class="colorTheme">
              {{form.titleId?titleList.filter(item=>{return form.titleId==item.id}).map(item=>item.name).join(''):'全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="titleClick()">全部</el-dropdown-item>
              <el-dropdown-item v-for="item in titleList" :key="item.id" @click.native="titleClick(item)">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <div class="titleList">
            <span :class="{active:form.titleId==''}" class="ellipsis" @click="titleClick()">全部</span>
            <span v-for="item in titleList" :key="item.id" class="ellipsis" :class="{active:form.titleId==item.id}"  @click="titleClick(item)">{{item.name}}</span>
          </div>
          <!--  -->
          <el-input style="float: right;width:200px;margin-left:10px;" placeholder="请输入事项名" v-model="form.name" suffix-icon="el-icon-search"></el-input>
          <!-- <el-input style="float: right;width:200px;margin-left:10px;" placeholder="选择部门" :value="form.deptName||form.dept" @click.native="openDeptChooser"></el-input> -->
          <!--  -->
          <el-radio-group style="float: right;" v-model="isOnline" size="mini" @change="isOnlineChange">
            <el-radio-button label="ALL">全部</el-radio-button>
            <el-radio-button label="Online">可在线办理</el-radio-button>
            <!-- <el-radio-button label="OnMobile">可掌上办理</el-radio-button> -->
          </el-radio-group>
          <!-- <el-button style="float: right; padding: 3px 5px" type="text"><i class="el-icon-sort"></i>主题排序</el-button> -->
          <!-- <el-button style="float: right; padding: 3px 5px" type="text"><i class="el-icon-plus"></i>添加主题</el-button> -->
        </div>
        <div class="count">
          主项{{countObj.groupCount}}项，
          子项{{countObj.itemCount}}项，
          可在线办理{{countObj.enableHandleOnlineCount}}项，
          可掌上办理{{countObj.enableHandleOnMobileCount}}项
        </div>
        <el-collapse class="subjectList" v-model="activeNames" @change="handleChange">
          <template v-for="item in list">
            <div :key ="item.id">
              <el-collapse-item :name="item.id" v-if="item.enabledShow" :class="{hasChild:item.items&&item.items.length>0}">
                <template slot="title">
                  <span class="colorTheme">{{item.name}}</span>
                </template>
                <div class="subjectItem" v-for="item in item.items" :key="item.id" @click="goGuidePage(item)">
                  <div class="subjectItem-icon"><i class="el-icon-document"></i></div>
                  <div class="subjectItem-left">
                    <div>
                      <div class="title ellipsis">{{item.name}}</div>
                      <p class="ellipsis">办理部门&nbsp;:&nbsp;{{item.deptName||item.dept}}</p>
                    </div>
                  </div>
                  <div class="subjectItem-right">
                    <el-button type="primary" :class="{hidden:!item.enableHandleGuide}" size="mini" @click.native.stop="goGuidePage(item)">办理指南</el-button>
                    <el-button type="primary" :class="{hidden:!item.enableHandleOnline}" size="mini" @click.native.stop="handleOnline(item)">在线办理</el-button>
                    <el-button type="primary" :class="{hidden:!item.enableHandleOnMobile}" size="mini" @click.native.stop="handleOnMobile(item)">掌上办理</el-button>
                  </div>
                </div>
              </el-collapse-item>
              <div v-if="!item.enabledShow">
                <template v-for="item in item.items">
                  <div class="subjectItem" :key="item.id" @click="goGuidePage(item)">
                    <div class="subjectItem-icon">
                      <i class="el-icon-document"></i>
                    </div>
                    <div class="subjectItem-left">
                      <div>
                        <div class="title ellipsis">{{item.name}}</div>
                        <p class="ellipsis">办理部门&nbsp;:&nbsp;{{item.deptName||item.dept}}</p>
                      </div>
                    </div>
                    <div class="subjectItem-right">
                      <el-button type="primary" :class="{hidden:!item.enableHandleGuide}" size="mini" @click.native.stop="goGuidePage(item)">办理指南</el-button>
                      <el-button type="primary" :class="{hidden:!item.enableHandleOnline}" size="mini" @click.native.stop="handleOnline(item)">在线办理</el-button>
                      <el-button type="primary" :class="{hidden:!item.enableHandleOnMobile}" size="mini" @click.native.stop="handleOnMobile(item)">掌上办理</el-button>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-collapse>
        <el-pagination
          style="text-align:right;margin-top:6px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.rows"
          layout="prev, pager, next, sizes, jumper"
          :total="form.total">
        </el-pagination>
      </el-card>
    </div>
    <div id="qrCode" ref="qrCodeDiv" v-show="false"></div>
  </div>
</template>
<script>
  import {getTitleList4select,getGroupItemSelectViewList,getItemCount,getItemOnlineUrl,getItemMobileUrl} from '@/modules/portal1/service/service.js'
  import {mapMutations} from 'vuex'
  import mainTab from './components/mainTab.vue'
  import EcoOrgPick from '@/components/orgPick/main.js'
  import QRCode from 'qrcodejs2' 
  export default{
      name:'serviceList',
      components: {
        mainTab
      },
      data() {
        return {
          countObj:{
            enableHandleOnMobileCount: 0,
            enableHandleOnlineCount: 0,
            groupCount: 0,
            itemCount: 0,
          },
          form:{
            page:1,
            rows:10,
            total:0,
            dept:'',
            titleId:'',
            enableHandleOnline:null,
            enableHandleOnMobile:null,
            name:''
          },
          titleList: [],
          list: [],
          activeNames:[],
          isOnline:'ALL',//全部，可在线办理，可掌上办理
        }
      },
      mounted(){
        this.getTitleList4select();
        this.getData();
        this.getItemCount();
      },
      methods: {
        ...mapMutations(['ADD_BREAD']),
        getData(){
          this.form.page=1;
          this.form.total=0;
          this.list=[];
          this.getList();
        },
        getList(){
          getGroupItemSelectViewList(this.form).then(res=>{
            if (res.data&&res.data.rows){
              this.list = res.data.rows;
              this.form.total = res.data.total;
              this.activeNames = res.data.rows.map(item=>{
                return item.id;
              })
            }
          }).catch(e=>{})
        },
        getTitleList4select(){
          getTitleList4select().then((res)=>{
            if (res.data&&res.data.rows){
              this.titleList = res.data.rows;
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
            label:'办理指南——'+item.name,
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
            window.parent.sysvm.$confirm(item.handleTips, '提示',{
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
                window.parent.sysvm.$confirm('<div style="display:inline-block;">'+qrcode._el.innerHTML+'</div>', '使用钉钉扫码',{
                  dangerouslyUseHTMLString:true,
                  showConfirmButton:false,
                  showCancelButton:false,
                  center:true,
                }).then(() => {}).catch(() => {});
              },200)
            } catch (error) {}
          }).catch(e=>{})
        },
        handleChange(val){
          // console.log(val)
        },
      },
      watch: {
        'form.name'(){
          this.getData();
        }
      },
  }
</script>
<style scoped>
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
  flex-basis: 260px;
  justify-content: flex-start;
}
.hidden{
  visibility: hidden;
}
</style>
