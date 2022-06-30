<template>


  <eco-content top="0px" bottom="0px" type="tool" class="deptManage" style="background-color:#f5f5f5"> 
    
    <div class="content webLayout">
      <eco-content top="0px" height="60px" type="tool" >
                      <el-row class="toolbar" style="padding:0px 10px;line-height:60px;height:60px;">
                          <el-col :span="8" >
                              <eco-tool-title style="line-height: 34px;" :title="'分级管控-部门授权'"></eco-tool-title>
                          </el-col>

                          <el-col :span="8" style="text-align:center;">
                                &nbsp;
                                <div class="el-tabs__item is-top " v-bind:class="{'is-active':tabName == 'watch'}" style="padding:0px;line-height:58px;height:58px;margin:0px 20px;" @click="handleTabClick('watch')">授权查看</div>
                                <div class="el-tabs__item is-top " v-bind:class="{'is-active':tabName == 'manage'}" style="padding:0px;line-height:58px;height:58px;margin:0px 20px;" @click="handleTabClick('manage')">授权管理</div>
                                &nbsp;
                          </el-col>

                          <el-col :span="8" class="tlr">
                              <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="save" ><i class="icon iconfont iconpiliang" style="margin-right:10px;font-size: 14px;"></i>&nbsp;保存</el-button>
                          </el-col>
                      </el-row>
        </eco-content>

        <eco-content bottom="0px" top="60px" ref="content" style="padding:10px 15px;">

             <div class="mainContent" v-show="loaded">
                <div class="dept_user_box">
                    <div class="dept_user_item" v-for="(item, index) in itemList" :key="index">
                      <el-row :gutter="20">
                            <el-col :span="12">
                                
                                <el-select v-model="item.deptId"  style="width:100%;"  class="select">
                                      <el-option
                                              v-for="item in departments"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id"
                                            >
                                      </el-option>
                                </el-select>
                            </el-col>

                            <el-col :span="12">
                                  <el-input class="ipt" :value="item.User && item.User.orgPath" readonly placeholder="请选择要授权的人员"  @click.native="openOrgChooser(item,'User')" ></el-input>
                            </el-col>

                        </el-row>
                        <i class="icon el-icon-delete" @click="del(index)"></i>
                    </div>
                </div>

                <div class="footerBar">
                      <el-button type="danger"  @click="delAll">清空</el-button>
                      <el-button type="primary" @click="add">添加</el-button>
                </div>
            </div>
      </eco-content>

    </div>
 </eco-content>


</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoUtil from '@/components/util/main.js'
import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
import {getDeptWatcher,editDeptWatcher,getDetpAllBranchDepView} from '../../service/service.js'
import {mapMutations} from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'


export default{
  name:'deptWatch',
  components:{
        ecoToolTitle,
        ecoLoading,
        ecoContent
  },
  data(){
    return {
        tabName:'watch',
        hackReset:true,
        itemList:[],
        departments:[],
        loaded:false
    }
  },
  mounted(){
      this.getDeptWatcher();
      this.getDetpAllBranchDepViewFunc();
  },
  methods: {
        getDetpAllBranchDepViewFunc(){
              getDetpAllBranchDepView().then((response)=>{
                  let _departments = [];
                  (response.data).forEach(element => {
                        _departments.push(element);
                  });
                  this.departments = _departments;
              })
        },


      
      handleTabClick(val){
            if(val == 'manage'){
                this.$router.push({name:'deptManager'});
            }
      },

      getDeptWatcher(){
          getDeptWatcher().then(res=>{
                if (res.data&&res.data.rows){
                  this.itemList = res.data.rows.map(item=>{
                      let userDept;
                      if (item.userDetail.departments&&item.userDetail.departments.length>0){
                          userDept = item.userDetail.departments[0].orgPathI18nText;
                          if (userDept) userDept+='-'
                      }
                      item.User={orgPath:userDept+item.userDetail.mi};
                      if (item.deptDetail){
                        item.Dept={orgPath:item.deptDetail.orgPathI18nText};
                      }else{
                        item.Dept=null;
                      }
                      return item;
                  })
                }

                this.loaded = true;
          }).catch(e=>{})
      },


      openOrgChooser(item,selectType){

                let _options = {};
                _options.selectType = 'USER';
                _options.selectNum = 1;
                _options.maxOrgPathLevel = 6;

                let that = this;
                let callBack = function(callObj){
                    item.User = callObj.itemArray[0];
                    item.userId = callObj.itemArray[0].resourceId;
                }
                
                let _key = EcoUtil.getUID();
                let _keyData = {};
                
                if(item.userId && item.userDetail){
                    let _initItem = {};
                    _initItem.type = 'PERSONNEL';
                    _initItem.orgId =  item.userDetail.departments[0].id+'.'+item.userId;
                    _keyData.initDataList = [];
                    _keyData.initDataList.push(_initItem);
                }


                _keyData.options = _options;

                EcoUtil.getSysvm().setTempStore(_key,_keyData);
                EcoUserPick.searchReceiver(_key,callBack); 
      },

    
      add(){
          this.itemList.push({
              deptId:null ,
              userId: null,
              Dept:null,
              User:null
          })
      },

       delAll(){
              let _that  = this;
              let confirmYesFunc = function(){
                  _that.itemList = [];
              }
              let options = {
                  type: 'warning',
                  lockScroll:false
              }
              EcoMessageBox.confirm('确定要清空数据？','提示',options,confirmYesFunc);
      },
        

      del(index){
        this.itemList.splice(index,1);
      },

      save(){
        let arr = this.itemList.map(item=>{
          return {
              deptId:item.deptId,
              userId:item.userId,
          }
        })

        for(let i = 0;i<arr.length;i++){
              if(arr[i].deptId == null  ){
                  EcoMessageBox.alert('请选择第'+(i+1)+'行部门');
                  return ;
              }else if(arr[i].userId == null){
                  EcoMessageBox.alert('请选择第'+(i+1)+'行授权人员');
                  return ;
              }
        }

      
        editDeptWatcher(arr).then(res=>{
            this.$message.success({
                showClose: true,
                message: '保存成功！'
            } )
        }).catch(e=>{
            this.$message.error('保存失败！')
        })
      },
    
  },

}
</script>
<style scoped>
.deptManage .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}

.deptManage .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

.deptManage .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
}

.deptManage .is-active{
    border-bottom:2px solid #409EFF;
}

.deptManage .mainContent{
  width: 1080px;
  margin: 0 auto;
  padding: 20px;
}


.deptManage .footerBar{
    text-align: right;
}






.dept_user_item{
  position: relative;
  margin-bottom: 12px;
}



.dept_user_item .icon{
    position: absolute;
    right: -32px;
    font-size: 22px;
    top: 7px;
    color: #1b5293;
    cursor: pointer;
    font-size: 18px;
}
.deptManage .oneTag{
  padding: 0px 6px;
  line-height: 0;
}

.deptManage .oneTag .el-tag{
  position: relative;
  display: inline-block;
  max-width: 516px;
  padding-right: 25px;
}



</style>
<style>
.deptManage .ipt .el-input__inner{
  line-height: 34px;
  height: 34px;
  cursor: pointer;
}


.deptManage .select .el-input--mini .el-input__inner{
  line-height: 34px;
  height: 34px;
}

.oneTag .el-tag .el-icon-close{
  position: absolute;
  right: 2px;
  top: 2px;
}
</style>