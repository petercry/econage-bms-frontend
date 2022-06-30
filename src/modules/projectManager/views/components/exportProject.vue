<template>
  <div class="exportProject">
        <el-table
            size="medium"
            :data="listData"
            style="width: 100%;">
            <el-table-column
                prop="name"
                label="模板名称"
                >
            </el-table-column>
            <el-table-column
                label="操作"
                width="80"
                 prop="id"
            >
            <template slot-scope="scope" >
                <el-button type="text" @click="download(scope.row)">下载</el-button>
             </template>
            </el-table-column>
        </el-table>
        <div class="uploadBtn">
          <el-upload
            class="upload"
            :action="upload_action"
            :show-file-list="false"
            :limit="1"
            :on-error="uploadError"
            :on-progress="uploading"
            :on-success="uploadSuccess"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
            <el-button plain class="plainBtn toolBtn"><i class="icon el-icon-upload2"></i>&nbsp;上 传</el-button>
          </el-upload>
        </div>
  </div>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import {downloadProjectTemplate,getPmTemplist} from '../../api/common.js'
  export default{
      name:'exportProject',
      data(){
        return {
            listData:[
              {
                name:"项目主表导入模板.xlsx",
                id:"1"
              }
            ],
            flag:"project",
            infoId:""
        }
      },
      created(){
        this.flag = this.$route.params.flag || "project";
        this.infoId = this.$route.params.infoId;
      },
      mounted(){
        this.getPmTemplist();
      },
      computed:{
        upload_action(){
          if(this.flag == "project"){
            return "/api/extend/faw/pm/info-imp"
          }else if(this.flag == "plan"){
            return "/api/extend/faw/pm//work-imp?infoId=" + this.infoId;
          }else{
            return '';
          }
        },
        url(){
          if(this.flag == "project"){
            return "/extend/temp/pm/pm-temp-info"
          }else if(this.flag == "plan"){
            return "/extend/temp/pm/pm-temp-work";
          }else{
            return '';
          }
        }
      },  
      methods: {
          getPmTemplist(){
            getPmTemplist(this.url).then(res=>{
              this.listData = res.rows;
            })
          },
          download({name,url}){
           
              downloadProjectTemplate(url).then(res=>{
                if(res){
                  var blob = new Blob([res], {type: "application/vnd.ms-excel"})
                  var fileName = name+".xlsx";
                  if(window.navigator.msSaveOrOpenBlob){			// IE浏览器下
                      navigator.msSaveBlob(blob, fileName);
                  } else {
                      var  link = document.createElement("a");
                      link.href = window.URL.createObjectURL(blob);
                      link.download = fileName;
                      link.click();
                      window.URL.revokeObjectURL(link.href);
                  }
                }
              })
            
          },
          uploading(){
              EcoUtil.getSysvm().showLoadingDiv('正在导入中... 请稍等');
          },
          uploadSuccess(){
              EcoUtil.getSysvm().hideLoadingDiv();
              let doObj = {}
              doObj.action = 'uploadProject';
              doObj.data = {};
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
          },
          uploadError(error){
              error = error || '导入失败！';
              EcoUtil.getSysvm().hideLoadingDiv();
              EcoUtil.getSysvm().$message({
                  message: error,
                  showClose: true,
                  duration:2000,
                  type: 'error'
              })
          },

      },
      watch: {

      }
  }

</script>
<style scope>
 .exportProject{
    height: 100%;
    overflow: auto;
    background: #fff;
 }
.uploadBtn{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
