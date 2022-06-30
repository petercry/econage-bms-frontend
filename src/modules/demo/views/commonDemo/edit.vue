<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
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
          <tableEditable ref="editTable" :inputData="form.demoItems"></tableEditable>
          <el-form-item label="" style="margin-top:10px;">
              <ecoFileUploadChunk style="max-width:500px" modular="commonDemo" :modularInnerId="modularInnerId" ref="ecoFileUploadRef" ></ecoFileUploadChunk>
            </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click.native="save">
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </ecoContent>
      <!-- <div class="kn-main">
        
      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {tableEditAjax,getTableItem,getTreeEnumMap} from '@/modules/demo/service/service.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import tableEditable from './tableEditable.vue'
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'
export default{
  name:'baseInfo',
  components:{
    ecoLoading,
    ecoContent,
    tableEditable,
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
    this.getData();
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
      var that = this;
      let id = this.$route.params.id; 
      this.form.deptObj ={orgPath:''}
      this.form.userObj ={orgPath:''}
      getTableItem(id).then((response)=>{
        if (response.data&&response.data.id){
          that.form.date = response.data.date;
          that.form.dateTime = response.data.dateTime;
          that.form.deptId = response.data.deptId;
          that.form.enumData = response.data.enumData;
          that.form.i18nKey = response.data.i18nKey;
          that.form.number = response.data.number;
          that.form.str = response.data.str;
          that.form.demoItems = response.data.demoItems;
          that.form.userId = response.data.userId;
          that.form.userOrgId = response.data.userOrgId;
          if (response.data.deptId){
            EcoOrgPick.loadByOrgIds(response.data.deptId).then(res=>{
              that.form.deptObj = res.data[0]
            }).catch(e=>{})
          }
          if (response.data.userOrgId){
            EcoOrgPick.loadByOrgIds(response.data.userOrgId).then(res=>{
              that.form.userObj = res.data[0]
            }).catch(e=>{})
          }
        }
      }).catch((error)=>{
      });
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
      this.$refs['form'].validate((valid) => {
          if (valid) {
            let id = this.$route.params.id;
            let demoItems = this.$refs.editTable.getData();
            this.form.demoItems=demoItems;
            this.form.fileHeaderId = this.$refs.ecoFileUploadRef.getAddFileHeaderIds();
            this.$refs.ecoLoadingRef.open();
            tableEditAjax(id,this.form).then((res)=>{
              try {
                // if (res.data&&res.data.id){
                  this.$message({type: 'success',message: '编辑成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'commonEditCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
                // }
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
  watch: {
    '$route'(){
      this.modularInnerId = this.$route.params.id;
    }
  }
}
</script>
<style>
</style>
