<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="form.parentId==-1">添加根节点</span>
            <span v-else>添加子节点</span>
          </div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="数字字段">
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
              <ecoFileUploadChunk style="max-width:500px" modular="treeDemo" ref="ecoFileUploadRef" ></ecoFileUploadChunk>
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
import {treeAddAjax,getTreeEnumMap} from '@/modules/demo/service/service.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'

export default{
  name:'treeAdd',
  components:{
    ecoLoading,
    ecoContent,
    ecoFileUploadChunk
  },
  data(){
    return {
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
    this.form.parentId = this.$route.params.parentId;
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
      let parantNode = parantTree.getNode(this.form.parentId);
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            this.form.fileHeaderId = this.$refs.ecoFileUploadRef.getAddFileHeaderIds();
            treeAddAjax(this.form).then((res)=>{
              try {
                if (res.data&&res.data.id){
                  this.$message({type: 'success',message: '添加成功！'});
                  this.$refs.ecoLoadingRef.close();
                  res.data.isLeaf =true;
                  if (this.form.parentId==-1){
                    parantTree.data.push(res.data)
                  }else{
                    let parantNode = parantTree.getNode(this.form.parentId);
                    this.$nextTick(()=>{
                      if (parantNode.isLeaf){
                        parantNode.isLeaf = false;
                        parantNode.loadData();
                      }else{
                        parantTree.append(res.data,this.form.parentId);
                      }
                    })
                  }
                }
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '添加失败！'});
            })
          } else {
            return false;
          }
      });
    }
  },
  watch: {
   '$route'(val){
     this.form.parentId = this.$route.params.parentId;
   }
  }
}
</script>
<style>

</style>
