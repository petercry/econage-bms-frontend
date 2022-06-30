<template>
  <div class="container">
    <div style="padding:40px 30px 20px;">
      <div style="position:absolute;top:12px;left:30px;">
        <ecoBreadList></ecoBreadList>
      </div>
      <el-card style="position:relative" :body-style="{padding:0}">
        <div slot="header" class="clearfix">
          事项管理列表
          <!-- <el-button style="float: right; padding: 3px 5px;color:#E37087;" type="text" @click.native="delMuit"><i class="el-icon-delete"></i>批量删除</el-button> -->
          <el-button v-if="userRole['portal1-item_create']" style="float: right; padding: 3px 5px" type="text" @click.native="add"><i class="el-icon-plus"></i>添加事项</el-button>
        </div>
        <el-card style="position:relative;box-shadow:none;border:none;">
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
                <el-collapse-item style="position:relative;" :name="item.id" v-if="item.enabledShow">
                  <template slot="title">
                    <span class="colorTheme">{{item.name}}</span>
                    <el-button style="position:absolute;right:30px;top:12px" type="text" @click.native="sort($event,item)"><i class="el-icon-sort"></i>事项排序</el-button>
                  </template>
                  <div class="subjectItem" v-for="item in item.items" :key="item.id" @click="goGuidePage(item)">
                    <div class="subjectItem-icon"><i class="el-icon-document"></i></div>
                    <div class="subjectItem-left">
                      <div><p class="title ellipsis">{{item.name}}</p><p class="ellipsis">办理部门&nbsp;:&nbsp;{{item.deptName||item.dept}}</p></div>
                    </div>
                    <div class="subjectItem-right">
                      <el-button size="mini" @click.native.stop="setAuth(item)">权限</el-button>
                      <el-button v-if="userRole['portal1-item_mod']" type="primary" size="mini" @click.native.stop="edit(item)">编辑</el-button>
                      <el-button v-if="userRole['portal1-item_delete']" type="danger" size="mini" @click.native.stop="del(item)">删除</el-button>
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
                          <p class="title ellipsis">{{item.name}}</p>
                          <p class="ellipsis">办理部门&nbsp;:&nbsp;{{item.deptName||item.dept}}</p>
                        </div>
                      </div>
                      <div class="subjectItem-right">
                        <el-button size="mini" @click.native.stop="setAuth(item)">权限</el-button>
                        <el-button v-if="userRole['portal1-item_mod']" type="primary" size="mini" @click.native.stop="edit(item)">编辑</el-button>
                        <el-button v-if="userRole['portal1-item_delete']" type="danger" size="mini" @click.native.stop="del(item)">删除</el-button>
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
      </el-card>
    </div>
  </div>
</template>
<script>
import {getTitleList4select,getGroupItemUpdateViewList,getItemCount,delItem} from '@/modules/portal1/service/service.js'
import {mapMutations,mapState} from 'vuex' 
import EcoOrgPick from '@/components/orgPick/main.js'
import EcoUtil from '@/components/util/main.js'
import ecoBreadList from '@/modules/portal1/views/components/ecoBreadList.vue'
  export default{
      name:'serviceList',
      components: {
        ecoBreadList
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
        window.ecoFrameVm = this; //添加监听
        this.addMonitor(); //添加监听
      },
      computed: {
        ...mapState(['userRole'])
      },
      methods: {
        ...mapMutations(['ADD_BREAD']),
        addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'itemUpdateCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.getList();
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
        },
        getData(){
          this.form.page=1;
          this.form.total=0;
          this.list=[];
          this.getList();
        },
        getList(){
          getGroupItemUpdateViewList(this.form).then(res=>{
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
          getTitleList4select('MODIFY').then((res)=>{
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
        
        handleChange(val){
          // console.log(val)
        },
        //批量删除
        delMuit(){

        },
        del(item){
          parent.window.sysvm.$confirm('是否确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delItem(item.id).then(res=>{
              this.getList();
            }).catch(e=>{})
          }).catch(() => {});
        },
        edit(item){
          // this.$router.push({
          //   name:'itemEdit',
          //   params:{
          //     id:item.id
          //   }
          // })
          // return ;
          window.parent.sysvm.openDialog('编辑事项',
          '/portal1/index.html#/itemEdit/'+item.id,window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
        },
        setAuth(item){
          // this.$router.push({
          //   name:'itemAuthEdit',
          //   params:{
          //     id:item.id
          //   }
          // })
          // return ;
          window.parent.sysvm.openDialog('事项权限设置',
          '/portal1/index.html#/itemAuthEdit/'+item.id,window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
        },
        add(){
          // this.$router.push({
          //   name:'itemAdd'
          // })
          // return ;
          window.parent.sysvm.openDialog('添加事项',
          '/portal1/index.html#/itemAdd',window.parent.innerWidth-100,(window.parent.innerHeight-120-100),'50px');
        },
        sort(e,item){
          e.stopPropagation();
          // this.$router.push({
          //   name:'itemSort',
          //   params:{
          //     group:item.id
          //   }
          // })
          // return ;
          window.parent.sysvm.openDialog('事项排序',
          '/portal1/index.html#/itemSort/'+item.id,700,450);
        }
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
</style>
