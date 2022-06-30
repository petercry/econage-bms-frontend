<template>
    <eco-content top="0px" bottom="0px" class="deptEdit">

      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                             <eco-tool-title style="line-height: 38px;" :title="'部门编辑'"></eco-tool-title>
                        </el-col>
                        <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                             <el-button type="danger"  size="mini" @click="disableSingle" class="disableBtn">失效 <i class="icon iconfont iconshixiao"></i></el-button>
                             <el-button type="success" size="mini" @click="enableSingle" class="ableBtn">生效 <i class="icon iconfont iconshengxiao"></i></el-button>
                             <el-button type="primary" size="mini" @click="save">保存  <i class="el-icon-check el-icon--right"></i></el-button>
                        </el-col>
                    </el-row>
      </eco-content>

      <ecoContent top="60px" bottom="0" style="padding:20px 20px 10px;">
          
          <div slot="header" class="clearfix">
                <span >部门编辑</span>
          </div>

          <el-form ref="form" :model="form" label-width="110px">
              <el-form-item label="编号">
                <!-- <span style="color:#999;font-size:12px;">自动生成</span> -->
                <el-input v-model="form.code"></el-input>
              </el-form-item>
            
              <el-form-item label="名称" prop="name" :rules="[ { required: true, message: '名称不能为空'} ]">
                <el-input v-model="form.name"></el-input>
              </el-form-item>

              <el-form-item label="国际化键" prop="i18nKey">
                <el-input v-model="form.i18nKey"></el-input>
              </el-form-item>
            
              <el-form-item label="部门等级" prop="levelV2">
                  <el-select style="width:100%;" v-model="form.levelV2" placeholder="请选择部门等级">
                      <el-option v-for="(item,idx) in deptLevelList" :key="idx" :label="item.text" :value="item.id"></el-option>
                  </el-select>
              </el-form-item>

              <el-form-item label="是否为分支机构" prop="branch">
                  <el-select style="width:100%;" v-model="form.branch" >
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
              </el-form-item>

              <el-form-item label="忽略同步" prop="ignoreHrSync">
                <el-select style="width:100%;" v-model="form.ignoreHrSync" placeholder="请选择">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="简拼" prop="pyIdx">
                  <el-input v-model="form.pyIdx"></el-input>
              </el-form-item>

              <el-form-item label="全拼" prop="pyFull">
                  <el-input v-model="form.pyFull"></el-input>
              </el-form-item>

              <el-form-item label="联系人" prop="contactName">
                  <el-input v-model="form.contactName"></el-input>
              </el-form-item>

              <el-form-item label="电话" prop="telephone">
                  <el-input v-model="form.telephone"></el-input>
              </el-form-item>

              <el-form-item label="地址" prop="address">
                  <el-input v-model="form.address"></el-input>
              </el-form-item>

              <el-form-item label="详细" prop="comments">
                  <el-input type="textarea" rows="6" v-model="form.comments"></el-input>
              </el-form-item>

              <el-form-item label="是否在组织架构弹出框中隐藏" prop="hiddenInDialog">
                  <el-select style="width:100%;" v-model="form.hiddenInDialog" >
                      <el-option label="是" :value="true"></el-option>
                      <el-option label="否" :value="false"></el-option>
                  </el-select>
              </el-form-item>


              <el-form-item label="">
                  <el-button type="primary" @click.native="save">
                      保存
                      <i class="el-icon-check el-icon--right"></i>
                  </el-button>
              </el-form-item>
          </el-form>
      </ecoContent>
    </eco-content>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import EcoUtil from '@/components/util/main.js'
import {getOrgSingleDept,editDept,getBasicKvGroupDetail} from '../../service/service.js'
import {mapMutations} from 'vuex'


export default{
  name:'deptEdit',
  components:{
      ecoLoading,
      ecoContent,
      ecoToolTitle
  },
  data(){
    return {
      deptLevelMap:{},
      deptLevelList:[],
      form:{
          address: "",
          code: "",
          comments: "",
          contactName: "",
          i18nKey: "",
          levelV2: "",
          branch:false,
          ignoreHrSync:false,
          name: "",
          parentId: "-1",
          pyFull: "",
          pyIdx: "",
          telephone: "",
          hiddenInDialog:false,
      },
      deptLevelId:'ORG_DEPT_LEVEL'
    }
  },
  mounted(){
    this.getOrgDeptLevel();
  },
  methods: {
    ...mapMutations([
            'SET_ECO_EVENT',
            'SET_ECO_EVENT_DATA'
    ]),

    getData(){
        let id = this.$route.params.id;
        getOrgSingleDept(id).then((response)=>{
              this.form.code = response.data.code;
              this.form.name = response.data.name;
              this.form.comments = response.data.comments;
              this.form.address = response.data.address;
              this.form.contactName = response.data.contactName;
              this.form.i18nKey = response.data.i18nKey;
              this.form.levelV2 = response.data.levelV2;
              this.form.branch = response.data.branch;
              this.form.ignoreHrSync = response.data.ignoreHrSync;
              this.form.parentId = response.data.parentId;
              this.form.pyFull = response.data.pyFull;
              this.form.pyIdx = response.data.pyIdx;
              this.form.telephone = response.data.telephone;
              this.form.hiddenInDialog = response.data.hiddenInDialog;
        })
    },

    getOrgDeptLevel(){
         getBasicKvGroupDetail(this.deptLevelId).then((response)=>{
                let _dataList = [];
                (response.data).forEach((item)=>{
                    if(item.enableInCreate){
                        _dataList.push(item);
                    }
                })
                this.deptLevelList =_dataList;
          }).catch((error)=>{});
    },

    save(){
  
          let parantTree = this.$parent.$refs.treeRef;
          let id = this.$route.params.id;
          let node = parantTree.getNode(id);
          this.$refs['form'].validate((valid) => {
              if (valid) {
                  this.$refs.ecoLoadingRef.open();
                  editDept(this.form,id).then((res)=>{
                    try {
                            if (res.data && res.data.id){
                                this.$message({type: 'success',message: '编辑成功！'});
                                this.$refs.ecoLoadingRef.close();

                                this.SET_ECO_EVENT({action:'editNode',key: EcoUtil.getUID()});
                                this.SET_ECO_EVENT_DATA(EcoUtil.objDeepCopy(res.data));
                            }
                      } catch (error) {}
                  }).catch((error)=>{
                      this.$refs.ecoLoadingRef.close();
                      this.$message({type: 'error',message: '编辑失败！'});
                  })
              } else {
                return false;
              }
          });
      },

      disableSingle(){
          this.SET_ECO_EVENT({action:'disableSingle',key: EcoUtil.getUID()});
          this.SET_ECO_EVENT_DATA({id:this.$route.params.id});
      },

      enableSingle(){
          this.SET_ECO_EVENT({action:'enableSingle',key: EcoUtil.getUID()});
          this.SET_ECO_EVENT_DATA({id:this.$route.params.id});
      }
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      if (from.name){
        vm.getData();
      }else{
        setTimeout(()=>{
            vm.getData();
        },600)
      }
    })
  },
  watch: {
    '$route'(){
      this.getData()
    }
  }
}
</script>
<style>
.deptEdit .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.deptEdit .disableBtn i{
  font-size: 12px;
}

.deptEdit .ableBtn i{
  font-size: 12px;
}
</style>
