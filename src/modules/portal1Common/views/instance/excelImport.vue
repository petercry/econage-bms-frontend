<template>
    <div class="content">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <el-row class="toolbar">
            <el-col :span="24" >
            <el-row style="width:200px;margin-top:12px;padding-left:20px;">
              <el-col :span="12">
                <el-upload
                  ref="upload"
                  accept=".xls"
                  :headers="headers"
                  :file-list="fileList"
                  :show-file-list="false"
                  :action="instanceExcelImport"
                  :on-error="onError"
                  :on-success="onSuccess"
                  :before-upload="onBeforeUpload">
                  <el-button style="height:34px;" size="small" type="primary" :loading="isUpload">选择文件</el-button>
                </el-upload>
              </el-col>
            </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {instanceExcelImport} from '@/modules/portal1Common/service/service.js'
// import EcoOrgPick from '@/components/orgPick/main.js'
// import XLSX from "xlsx";
export default{
  name:'userImport',
  components:{
    ecoToolTitle,
    ecoLoading,
    ecoContent,
  },
  data(){
    return {
      fileList:[],
      listArray:[],
      headers:{
        ['eco-auth-token']:sessionStorage.getItem('ecoToken')
      },
      isUpload:false,
      instanceExcelImport:instanceExcelImport()
    }
  },
  mounted(){
  },
  methods: {
    onBeforeUpload(){
      this.isUpload = true;
    },
    // onChange(file, fileList){
    //   if(file.status!="ready"){
    //     return;
    //   }
    //   let that = this;
    //   var reader = new FileReader();
    //   reader.onload = function(e) {
    //       var data = e.target.result;
    //       var wb;
    //       wb = XLSX.read(data, { type: "array" });
    //       let tableArr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    //       tableArr = tableArr.map(item=>{
    //         return {
    //           fullDeptPath:item['所属组织（层级结构）'],
    //           mi:item['姓名'],
    //           mobile:item['手机'],
    //           hrAccount:item['浙政钉2.0账号'],
    //           hrLink:item['浙政钉2.0uid'],
    //           userId:item['编号'],
    //         }
    //       }).filter(item=>item.fullDeptPath!='fullDeptPath');
    //       that.listArray = that.listArray.concat(tableArr);
    //   };
    //   reader.readAsArrayBuffer(file.raw);
    // },
    onSuccess(response){
      if (response.success){
        this.isUpload = false;
        this.listArray = [];
        try {
          parent.window.sysvm.$message.success('上传成功')
          // let doObj = {}
          // doObj.action = 'instanceExcelImportCallBack';
          // doObj.close = true;
          // parent.window.sysvm.callBackDialogFunc(doObj);
        } catch (error) {
          this.$message.success('上传成功');
        }
      }else{
        this.isUpload = false;
        this.$message.error(response.errorInfos&&response.errorInfos.join('\n')||'上传失败，请上传正确的文件')
      }
    },
    onError(err, file, fileList){
      this.isUpload = false;
      // console.log(err)
      // console.log(file)
      // console.log(fileList)
      this.$message.error('上传失败，请上传正确的文件')
    },
    imports(){
      this.isUpload = true;
      this.$refs.upload.submit();
    }
  },
  watch: {

  }
}
</script>
<style>
.userImport .content{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    border: 1px solid #ddd;
}

.userImport .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

</style>
