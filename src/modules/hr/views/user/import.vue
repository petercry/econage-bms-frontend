<template>
<eco-content top="0px" bottom="0px" type="tool" class="userImport" style="background-color:#fff">   
    <div class="content">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <eco-content top="0px" height="105px" type="tool">
                <el-row class="toolbar">
                    <el-col :span="24" >
                        <eco-tool-title style="line-height: 34px;" :title="'人事导入'"></eco-tool-title>
                    </el-col>
                    <el-col :span="24" >
                    <el-row style="width:200px;margin-top:12px;">
                      <el-col :span="12">
                        <el-upload
                          ref="upload"
                          accept=".xlsx"
                          :headers="headers"
                          :file-list="fileList"
                          :show-file-list="false"
                          :action="orgExcelImport"
                          :auto-upload="false"
                          :on-change="onChange"
                          :on-error="onError"
                          :on-success="onSuccess">
                          <el-button style="height:34px;" size="small" type="primary">选择文件</el-button>
                          <!-- <i class="el-icon-upload"></i>
                          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> -->
                        </el-upload>
                      </el-col>
                      <el-col :span="12">
                        <el-button style="height:34px;" size="small" type="primary" :loading="isUpload" @click.native="imports">确认导入</el-button>
                      </el-col>
                    </el-row>
                    </el-col>
                </el-row>
      </eco-content>
  
      <eco-content  bottom="0" top="105px" ref="content" style="padding:10px 15px;">
        <el-table
              :data="listArray"
              :header-cell-style="{backgroundColor:'#eee'}"
              style="width: 100%;"
              height="100%"
              size="mini"
              class="styleTableDefault"
              stripe
              >
            <el-table-column
              label="所属组织（层级结构）"
              min-width="160"
              show-overflow-tooltip
              prop="fullDeptPath">
            </el-table-column>
            <el-table-column
              label="姓名"
              min-width="100"
              show-overflow-tooltip
              prop="mi">
            </el-table-column>
            <el-table-column
              label="手机"
              width="150"
              show-overflow-tooltip
              prop="mobile">
            </el-table-column>
            <el-table-column
              label="浙政钉2.0账号"
              width="120"
              show-overflow-tooltip
              prop="hrAccount">
            </el-table-column>
            <el-table-column
              label="浙政钉2.0uid"
              width="120"
              show-overflow-tooltip
              prop="hrLink">
            </el-table-column>
            <el-table-column
              label="编号"
              min-width="200"
              show-overflow-tooltip
              prop="userId">
            </el-table-column>
        </el-table>
      </eco-content>
    </div>
</eco-content>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {orgExcelImport} from '../../service/service.js'
// import EcoOrgPick from '@/components/orgPick/main.js'
import XLSX from "xlsx";
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
      orgExcelImport:orgExcelImport()
    }
  },
  mounted(){
  },
  methods: {
    onChange(file, fileList){
      if(file.status!="ready"){
        return;
      }
      let that = this;
      var reader = new FileReader();
      reader.onload = function(e) {
          var data = e.target.result;
          var wb;
          wb = XLSX.read(data, { type: "array" });
          let tableArr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          tableArr = tableArr.map(item=>{
            return {
              fullDeptPath:item['所属组织（层级结构）'],
              mi:item['姓名'],
              mobile:item['手机'],
              hrAccount:item['浙政钉2.0账号'],
              hrLink:item['浙政钉2.0uid'],
              userId:item['编号'],
            }
          }).filter(item=>item.fullDeptPath!='fullDeptPath');
          that.listArray = that.listArray.concat(tableArr);
      };
      reader.readAsArrayBuffer(file.raw);
    },
    onSuccess(){
      this.isUpload = false;
      this.$message.success('上传成功')
      this.listArray = [];
      try {
        let doObj = {}
        doObj.action = 'userImportCallBack';
        doObj.close = true;
        parent.window.sysvm.callBackDialogFunc(doObj);
      } catch (error) {}
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
    },
    toFormNumber($event,formVal,key){
      if (/^[0-9]*$/.test(formVal)){
      }else{
        this.$message.error('该输入框只能输入数字')
        let val = formVal.replace(/(\D+[\d\D]*)/,'')
        this.form[key] = val;
      }
    }
  },
  watch: {

  }
}
</script>
<style>
.userImport .content{
    position: relative;
    height: 100%;
    margin: 0 0px;
    overflow-y: hidden;
    border: 0px solid #ddd;
}

.userImport .toolbar{
  padding:12px 10px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}

</style>
