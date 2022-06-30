<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span >编辑节点</span>
          </div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="数字字段">
              <!-- <span style="color:#999;font-size:12px;">自动生成</span> -->
              <el-input v-model="form.number" @blur="toFormNumber($event,form.number,'number')"></el-input>
            </el-form-item>
            <el-form-item label="字符字段" prop="str" :rules="[
              { required: true, message: '字符字段不能为空'}
            ]">
              <el-input v-model="form.str"></el-input>
            </el-form-item>
            <el-form-item label="国际化键" prop="i18nKey">
              <el-input v-model="form.i18nKey"></el-input>
            </el-form-item>
            <el-form-item label="枚举字段" prop="enumData">
              <el-select style="width:100%;" v-model="form.enumData" placeholder="请选择部门等级">
                <el-option v-for="(item,key) in enumMap" :key="key" :label="item" :value="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                style="width:100%;"
                v-model="form.date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="日期时间">
              <el-date-picker
                style="width:100%;"
                v-model="form.dateTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="人员">
              <div class="display-input"  @click="openUserChooser">
                <el-tag
                  v-if="form.userObj.orgPath"
                  closable
                  type="info"
                  @close="form.userObj={orgPath:''};form.userId='';form.userOrgId=''">
                  {{form.userObj.orgPath}}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="部门">
              <div class="display-input"  @click="openDeptChooser">
                <el-tag
                  v-if="form.deptObj.orgPath"
                  closable
                  type="info"
                  @close="form.deptObj={orgPath:''};form.deptId='';">
                  {{form.deptObj.orgPath}}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="">
              <ecoFileUploadChunk style="max-width:500px" modular="treeDemo" :modularInnerId="modularInnerId" ref="ecoFileUploadRef" ></ecoFileUploadChunk>
            </el-form-item>
            <el-form-item label="">
              <el-button type="default" @click.native="save">
                保存
                <i class="el-icon-check el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {treeEditAjax,getTreeEnumMap} from '@/modules/demo/service/service.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'

export default{
  name:'treeEdit',
  components:{
    ecoLoading,
    ecoContent,
    ecoFileUploadChunk
  },
  data(){
    return {
      modularInnerId:'',
      enumMap:{},
      form:{
        deptObj:{
          orgPath:''
        },
        // userArr:[],
        date:'',
        dateTime:'',
        deptId:'',
        enumData:'',
        i18nKey:'',
        number:'',
        parentId:'-1',
        str:'',
        userObj:{
          orgPath:''
        },
        userId:'',
        userOrgId:'',
      }
    }
  },
  created(){
    this.modularInnerId = this.$route.params.id;
  },
  mounted(){
    this.getTreeEnumMap();
  },
  methods: {
    toFormNumber($event,formVal,key){
      if (/^[0-9]*$/.test(formVal)){
      }else{
        this.$message.error('该输入框只能输入数字')
        let val = formVal.replace(/(\D+[\d\D]*)/,'')
        this.form[key] = val;
      }
    },
    getData(){
      let that =this;
      let parantTree = this.$parent.$refs.treeRef;
      let id = this.$route.params.id;
      let node = parantTree.getNode(id);
      this.form.date = node.data.date;
      this.form.dateTime = node.data.dateTime;
      this.form.deptId = node.data.deptId;
      this.form.enumData = node.data.enumData;
      this.form.i18nKey = node.data.i18nKey;
      this.form.number = node.data.number;
      this.form.str = node.data.str;
      this.form.parentId = node.data.parentId;
      this.form.userId = node.data.userId;
      this.form.userOrgId = node.data.userOrgId;
      this.form.deptObj ={orgPath:''}
      this.form.userObj ={orgPath:''}
      if (node.data.deptId){
        EcoOrgPick.loadByOrgIds(node.data.deptId).then(res=>{
          that.form.deptObj = res.data[0]
        }).catch(e=>{})
      }
      if (node.data.userOrgId){
        EcoOrgPick.loadByOrgIds(node.data.userOrgId).then(res=>{
          that.form.userObj = res.data[0]
        }).catch(e=>{})
      }
    },
    openDeptChooser(){
      let options = {
          selectMulti:false,
          selectType:'Dept',
          selectDefault:'',
          deptScopeType:'BUSINESS',
      }
      options.selectDefault = this.form.deptId;
      var that  = this;
      let callBack = function(callObj){
        that.form['deptId'] = callObj.resourceId;
        that.form['deptObj'] = callObj;
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    openUserChooser(){
      let options = {
          selectMulti:false,
          selectType:'User',
          selectDefault:'',
          deptScopeType:'BUSINESS',
      }
      options.selectDefault = this.form.userOrgId;
      var that  = this;
      let callBack = function(callObj){
        that.form['userId'] = callObj.resourceId;
        that.form['userOrgId'] = callObj.orgId;
        that.form['userObj'] = callObj;
      }
      EcoOrgPick.searchReceiver(options,callBack);
    },
    getTreeEnumMap(){
      getTreeEnumMap().then((res)=>{
        this.enumMap = res.data;
      }).catch((error)=>{
      })
    },
    save(){
      let parantTree = this.$parent.$refs.treeRef;
      let id = this.$route.params.id;
      let node = parantTree.getNode(id);
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            this.form.fileHeaderId = this.$refs.ecoFileUploadRef.getAddFileHeaderIds();
            treeEditAjax(this.form,id).then((res)=>{
              try {
                if (res.data&&res.data.id){
                  this.$message({type: 'success',message: '编辑成功！'});
                  this.$refs.ecoLoadingRef.close();
                  node.data.date = res.data.date;
                  node.data.dateTime = res.data.dateTime;
                  node.data.deptId = res.data.deptId;
                  node.data.enumData = res.data.enumData;
                  node.data.i18nKey = res.data.i18nKey;
                  node.data.number = res.data.number;
                  node.data.str = res.data.str;
                  node.data.parentId = res.data.parentId;
                  node.data.userId = res.data.userId;
                  node.data.userOrgId = res.data.userOrgId;
                  node.data.i18nText = res.data.i18nText;
                }
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '编辑失败！'});
            })
          } else {
            return false;
          }
      });
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
      this.modularInnerId = this.$route.params.id;
      this.getData()
    }
  }
}
</script>
<style>

</style>
