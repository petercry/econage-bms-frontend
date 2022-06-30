<template>
    <div class="addOrUpdateProject">
       <el-form :inline="true" :model="form" v-loading="loading" :rules="rules" ref="addForm" class="addForm" label-width="120px">
            <el-form-item label="项目编码">
                <el-input v-model="form.code" readonly disabled></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="name" >
                <el-input v-model.trim="form.name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="研发项目类型" prop="rdType" required>
                <el-select v-model="form.rdType" placeholder="请选择" @change="getProductType">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_rd_type']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产业" prop="industry" required>
                <el-select value-key="id" v-model="form.industry" placeholder="请选择" @change="getProductType">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_industry']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品类别" prop="productType" required>
                <el-select v-model="form.productType" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in productTypeItems" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年份" prop="year" required>
                <el-date-picker type="year" value-format="yyyy" format="yyyy" placeholder="选择年份" v-model="form.year" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="关联基础模型" prop="linkModel">
                <el-select v-model="form.linkModel" placeholder="请选择" filterable clearable>
                    <el-option
                    v-for="(item,index) in linkModelItems" :key="index"
                    :label="item.name"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品平台" prop="platform" required>
                <el-select v-model="form.platform" filterable placeholder="请选择">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_platform']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目所在地" prop="productionBase" required>
                <el-select v-model="form.productionBase" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_production']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目类型">
                <el-select v-model="form.type" clearable placeholder="请选择">
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_type']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="PDT经理">
                <tag-select
                    style="width: 100%;vertical-align: top;"
                    ref="tagSelect"
                    :initDataStr="initDataStr_PDT"
                    :initOptions="{selectNum:1,selectType:'USER'}"
                    @callBack="selectPDT" >
                </tag-select>
            </el-form-item>
           <el-form-item label="POP">
                <tag-select
                    style="width: 100%;vertical-align: top;"
                    ref="tagSelect"
                    :initDataStr="initDataStr_POP"
                    :initOptions="{selectNum:1,selectType:'USER'}"
                    @callBack="selectPOP" >
                </tag-select>
            </el-form-item>

            <!-- <el-form-item label="项目概算">
                <el-input v-model="form.budget" placeholder="请输入项目概算"></el-input>
            </el-form-item> -->
            <el-form-item label="项目状态">
                <el-select v-model="form.status" placeholder="请选择" disabled readonly>
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_status']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目阶段">
                <el-select v-model="form.stage" placeholder="请选择" clearable>
                    <el-option
                    v-for="(item,index) in baseData['faw_pm_stage']" :key="index"
                    :label="item.text"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="开发产品">
                <el-input v-model="form.product" placeholder="请输入开发产品"></el-input>
            </el-form-item>
            <el-form-item label="首发车型">
                <el-input v-model="form.starting" placeholder="请输入首发车型"></el-input>
            </el-form-item> -->
            <el-form-item label="是否为IPD项目" prop="ipd" required>
                <el-radio-group v-model="form.ipd">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="计划GA时间">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.planGa" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="项目查看范围" prop="viewRangeArray" required>
                <el-checkbox-group v-model="form.viewRangeArray" @change="viewRangeChange">
                    <el-checkbox v-for="(item,index) in baseData['faw_pm_view_range']" :key="index" :label="item.id">{{item.text}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="项目费用号" prop="costCode" :rules="[{required:form.viewRangeArray.indexOf('faw_pm_view_range1')>-1,message:'请输入项目费用号',trigger:'blur'}]">
                <el-input v-model.trim="form.costCode" placeholder="请输入项目费用号"></el-input>
            </el-form-item>
            <!-- <el-form-item label="实际GA时间">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.actualGa" style="width: 100%;"></el-date-picker>
            </el-form-item> -->
            <!-- <el-form-item label="项目关闭时间">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.closeDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="项目取消时间">
                <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.cancelDate" style="width: 100%;"></el-date-picker>
            </el-form-item> -->
            <el-form-item class="allItem" label="项目描述">
                <el-input type="textarea" v-model.trim="form.describe" placeholder="请输入描述" rows="3"></el-input>
            </el-form-item>
            <!-- <el-form-item class="allItem" label="立项报告" required prop="fileHeardId">
                <eco-file-upload-btn :showList="true" :modular="'project_manager'" :modularInnerId="modularInnerId" @fileChange="fileChange" style="width:600px;display:inline-block;"  @fileOnSuccess="fileOnSuccess"></eco-file-upload-btn>
            </el-form-item> -->
        </el-form>
        <div class="btn">
            <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
            <el-button type="primary" size="medium"  @click="onSubmitAndApprove">保存并提交</el-button>
        </div>
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapGetters ,mapActions} from 'vuex'
import {getItemFetchId,getEnumSelectEnabled,startBHWorkFlow,getWFOperateId} from '../../../api/common.js'
import {addProject,getProductType} from '../../../api/project.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
// import ecoFileUploadBtn from '@/components/file/ecoFileUploadBtn.vue'
import {getTemplatesInfoList} from '../../../api/templates.js'

export default {
  name:'addOrUpdateProject',
  components: {
      tagSelect,
      //ecoFileUploadBtn
  },
  data() {
    return {
        loading:true,
        form:{
            id:"",
            code:"",
            name:"",
            rdType:"",
            industry:"",
            productType:"",
            linkModel:"",
            platform:"",
            productionBase:"",
            type:"",
            //pdtManagerId:"1172011677126791169",
            //pdtManagerName:"产品技术中心-iBpm研发事业部-高文众",
            //popId:"1172011677126791169",
            //popName:"产品技术中心-iBpm研发事业部-高文众",
            pdtManagerId:"",
            pdtManagerName:"",
            popId:"",
            popName:"",
            budget:"",
            status:"faw_pm_status_draft",
            stage:"faw_pm_stage1",
            product:"",
            starting:"",
            planGa:"",
            actualGa:"",
            closeDate:"",
            cancelDate:"",
            describe:"",
            fileHeardId:"",
            costCode:"",
            ipd:true,
            viewRange:"",
            viewRangeArray:[],
            year:""
        },
        rules: {
           name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          rdType: [
            { required: true, message: '请选择研发项目类型', trigger: 'change' }
          ],
          industry: [
            { required: true, message: '请选择产业', trigger: 'change' }
          ],
          productType: [
            { required: true, message: '请选择产品类别', trigger: 'change' }
          ],
          platform: [
            { required: true, message: '请选择产品平台', trigger: 'change' }
          ],
          productionBase: [
            { required: true, message: '请选择项目所在地', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择项目类型', trigger: 'change' }
          ],
          pdtManagerId: [
            { required: true, message: '请选择PDT经理', trigger: 'change' }
          ],
          popId: [
            { required: true, message: '请选择POP', trigger: 'change' }
          ],

          fileHeardId:[
            { required: true, message: '请上传立项报告', trigger: 'change' }
          ],
          ipd:[
            { required: true, message: '请选择是否为IPD项目', trigger: 'change' }
          ],
          year:[
            { required: true, message: '请选择年份', trigger: 'change' },
            { required: true, message: '请选择年份', trigger: 'blur' }
          ],
          viewRangeArray:[
              { required: true, message: '请选择项目查看范围', trigger: 'change' }
          ]
        },
        initDataStr_PDT:"",
        initDataStr_POP:"",
        fileName:"",
        modularInnerId:"",
        linkModelItems:[],
        productTypeItems:[]
    }
  },
  created() {
      this.getItemFetchId();
      this.getLinkModelItems();
      this.initProjectBaseData('create-enabled').then(()=>{
            // this.form.stage =  this.baseData['faw_pm_stage'].find(item => item.text === '概念阶段').id || '';
            // this.form.status = this.baseData['faw_pm_status'].find(item => item.text === '草稿').id || '';
            this.loading = false;
      });
  },
  activated(){

  },

  mounted(){
  },

  computed: {
     ...mapGetters([
        'baseData',
      ]),
  },

  methods: {
      ...mapActions([
        'initProjectBaseData',
      ]),
      selectPDT(data){
         if(data.itemArray.length > 0){
            this.form.pdtManagerId = data.itemArray[0].linkId;
            this.form.pdtManagerName = data.itemArray[0].name;
            this.initDataStr_PDT = data.id;
         }else{
            this.form.pdtManagerId = "";
            this.form.pdtManagerName = "";
            this.initDataStr_PDT = "";
         }
      },
      selectPOP(data){
         if(data.itemArray.length > 0){
            this.form.popId = data.itemArray[0].linkId;
            this.form.popName = data.itemArray[0].name;
            this.initDataStr_POP = data.id;
         }else{
            this.form.popId = "";
            this.form.popName = "";
            this.initDataStr_POP = "";
         }
      },
      getItemFetchId(){
          getItemFetchId().then(res => {
              this.modularInnerId  = res;
              this.form.id = this.modularInnerId;

          })
      },
      getLinkModelItems(){
          getTemplatesInfoList().then(res => {
              this.linkModelItems = res.rows;
          })
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
        this.$refs['addForm'].validate((valid) => {
            if (valid) {
                this.addProject();
            } else {

                return false;
            }
       });

        //this.loading = true;

      },
      onSubmitAndApprove(){
        this.$refs['addForm'].validate((valid) => {
            if (valid) {
                var that  = this;
                let confirmYesFunc = function(){

                    that.loading = true;
                    addProject(that.form,"tobepublish").then(res => {
                        //this.startWorkflow(this.form.id);

                        let doObj = {}
                        doObj.action = 'addProject';
                        doObj.data = {};
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        that.loading = false;
                    }).catch(e=>{
                        that.loading = false;
                    })
                }
                let options = {
                    type: 'warning',
                    lockScroll:false
                }
                EcoMessageBox.confirm('确定要提交项目吗?','提示',options,confirmYesFunc);

            } else {

                return false;
            }
        });

      },
      startWorkflow(id){
          startBHWorkFlow(id).then(res =>{

              getWFOperateId(res.startTaskId).then(response=>{
                   if(response.status == 0){
                        EcoUtil.getSysvm().hideLoadingDiv();
                        let operateId = response.operate_id;
                        let tabObj = {};
                        let goPage = "flowform/index.html#/wfDetail/"+res.startTaskId+"/"+operateId;
                        tabObj.desc = '待办流程';
                        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+res.startTaskId+"',href_link:'"+goPage+"',fullScreen:true}";
                        EcoUtil.getSysvm().doTab(tabObj);
                   }else{
                        EcoUtil.getSysvm().hideLoadingDiv();
                        EcoMessageBox.alert(response.msg);
                        this.closeFullWindow();
                   }
                    let doObj = {}
                    doObj.action = 'addProject';
                    doObj.data = {};
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }).catch(e=>{
                    EcoUtil.getSysvm().hideLoadingDiv();
                    let doObj = {}
                    doObj.action = 'addProject';
                    doObj.data = {};
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
              })

          }).catch(e =>{
              EcoUtil.getSysvm().hideLoadingDiv();
              let doObj = {}
              doObj.action = 'addProject';
              doObj.data = {};
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
          })
      },
      closeFullWindow(){
        let _closeObj = {};
        _closeObj.clearIframe = true;
        _closeObj.tabClick = true;
        EcoUtil.getSysvm().closeFullScreen(_closeObj);
      },
      addProject(){
          this.loading = true;
          addProject(this.form,'draft').then(res => {
            this.loading = false;
            let doObj = {}
            doObj.action = 'addProject';
            doObj.data = {};
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
          })
      },
      fileChange(file, fileList){
          this.loading = true;
      },
      fileOnSuccess(response, file, fileList){
          this.loading = false;
          this.form.fileHeardId = response.id;
      },
      getProductType(){
          this.form.productType = "";
          if(!this.form.industry || !this.form.rdType) return;

          getProductType(this.form).then(res => {
              this.productTypeItems = res;
          })
      },
      viewRangeChange(values){
          if(values.indexOf('faw_pm_view_range1') == -1){
              this.$refs['addForm'].clearValidate(['costCode'])
          }
          this.form.viewRange = values.join(',');
      }
  },
  watch:{

  },

};
</script>

<style scoped>
.addOrUpdateProject{
    background: #fff;
    height:100%;
}
.addOrUpdateProject .btn{
    text-align: right;
    padding: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ddd;
}
.addOrUpdateProject .addForm{
    padding-top: 20px;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
}
.addOrUpdateProject .addForm .el-form-item{
    width:400px;
}
.addOrUpdateProject .addForm .allItem{
    width: auto;
}
</style>
