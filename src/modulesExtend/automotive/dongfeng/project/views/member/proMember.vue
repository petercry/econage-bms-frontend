<template>
    <div class="proMember">
            <ecoLoading ref='proMemberLoading' text='加载中...'></ecoLoading>
            <div  class="toolbar">
                <el-button type="primary" v-show='initRole.PAGE_MEMBER.permission.CREATE'  @click="addFunc">新增</el-button>
                <el-button type="danger" v-show='initRole.PAGE_MEMBER.permission.DELETE' @click="delFunc">删除</el-button>
                <!-- <el-button type="primary">同步</el-button> -->
                <el-button type='primary' v-show='initRole.PAGE_MEMBER.permission.IMPORT' @click='openUploadDialog'>导入</el-button>
                <el-button type="primary" v-show='initRole.PAGE_MEMBER.permission.HISTORY' @click="historyFunc">历史记录</el-button>
                <el-upload v-show='false' ref='proMemberUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                    :show-file-list='false' accept='.xls,.xlsx'>
                </el-upload>
            </div>

            <div>
                <div class="searchBox">
                        <span>部门：</span>
                        <div class="itemInput">
                            <!-- <tag-select
                                    style="width: 100%;vertical-align: top;"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:1,selectType:'dept'}"
                                    @callBack="selectDept" >
                            </tag-select> -->
                            <el-input clearable style='width:135px' @keyup.enter.native="searchFunc" v-model='params.deptName' placeholder='请输入'>
                                <i class='el-icon-search el-input__icon' slot='suffix'></i>
                            </el-input>
                        </div>

                        <!-- <span>专业设计师：</span>
                        <div class="itemInput"> -->
                            <!-- <tag-select
                                    style="width: 100%;vertical-align: top;"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:1,selectType:'user'}"
                                    @callBack="selectProfessionDesigner" >
                            </tag-select> -->
                            <!-- <el-input clearable style='width:135px' @keyup.enter.native="searchFunc" v-model='params.professionDesignerName' placeholder='请输入'>
                                <i class='el-icon-search el-input__icon' slot='suffix'></i>
                            </el-input>
                        </div> -->

                        <span>专业负责人：</span>
                        <div class="itemInput">
                            <!-- <tag-select
                                    style="width: 100%;vertical-align: top;"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:1,selectType:'user'}"
                                    @callBack="selectProfessionLeader" >
                            </tag-select> -->
                            <el-input clearable style='width:135px' @keyup.enter.native="searchFunc" v-model='params.professionLeaderName' placeholder='请输入'>
                                <i class='el-icon-search el-input__icon' slot='suffix'></i>
                            </el-input>
                        </div>

                        <span>联络人：</span>
                        <div class="itemInput">
                            <!-- <tag-select
                                    style="width: 100%;vertical-align: top;"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:1,selectType:'user'}"
                                    @callBack="selectDeptContactUser" >
                            </tag-select> -->
                            <el-input clearable style='width:135px' @keyup.enter.native="searchFunc" v-model='params.deptContactUserName' placeholder='请输入'>
                                <i class='el-icon-search el-input__icon' slot='suffix'></i>
                            </el-input>
                        </div>

                        <el-button type="primary" @click="searchFunc">搜索</el-button>
                        <el-button type="plain" @click="restSearch">重置</el-button>
                </div>
            </div>

            <eco-content top="100px" bottom="42px" style="padding:0px 15px;">
                        <el-table
                            border
                            :data="memberList"
                            highlight-current-row
                            stripe
                            class="styleTableDefault"
                            style="width: 100%"
                            size="mini"
                            height="100%"
                            ref="multipleTable"
                            @selection-change="changeFun"
                        >

                        <el-table-column
                            align="center"
                            type="selection"
                            key="10"
                            width="50">
                        </el-table-column>

                        <el-table-column
                            align="center"
                            type="index"
                            label="序号"
                            width="60"
                        >
                        </el-table-column>

                        <el-table-column
                                    prop="deptId"
                                    show-overflow-tooltip
                                    label="部门"
                                    align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.deptName}}</span>
                                </template>
                        </el-table-column>

                        <el-table-column
                                    prop="profession"
                                    show-overflow-tooltip
                                    label="专业名称"
                                    align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{getKVName(baseData['1372459642503467009'],scope.row.profession)}}</span>
                                </template>
                        </el-table-column>

                        <!-- <el-table-column
                                    prop="professionDesignerId"
                                    show-overflow-tooltip
                                    label="专业设计师"
                                     align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.professionDesignerName}}</span>
                                </template>
                            </el-table-column> -->

                            <el-table-column
                                    prop="professionLeaderId"
                                    show-overflow-tooltip
                                    label="专业负责人"
                                     align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.professionLeaderName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="deptContactUserId"
                                    show-overflow-tooltip
                                    label="联络人"
                                     align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{scope.row.deptContactUserName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="type"
                                show-overflow-tooltip
                                label="类别"
                                align="center"
                            >
                                <template slot-scope="scope" >
                                    <span >{{getKVName(typeOptions,scope.row.type)}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                label="操作"
                                width="60"
                                v-if='initRole.PAGE_MEMBER.permission.EDIT'
                            >
                                    <template slot-scope="scope">
                                        <span class="editSpan" @click="editItem(scope.row.id)">编辑</span>
                                    </template>
                            </el-table-column>
                    </el-table>
            </eco-content>

            <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
                <el-row >
                    <el-col :span="24" style="text-align:right">
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="params.page"
                            :page-sizes="[10,30,50,100]"
                            :page-size="params.rows"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="params.total" style="margin-right:20px">
                            </el-pagination>
                    </el-col>
                </el-row>
        </eco-content>

    </div>
    
</template>
<script>
import {getProMemberList,deleteProMember,projectMemberUpload} from '../../service/service'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import { mapState,mapActions } from 'vuex';
import {EcoFile} from '@/components/file/main.js'
import {sysEnv} from '../../config/env.js'
 import tagSelect from '@/components/orgPick/tagSelect.vue'
 import ecoLoading from '@/components/loading/ecoLoading.vue'

  export default {
      components:{
          ecoContent,
          tagSelect,
          ecoLoading
      },
      data(){
          return{
              params:{
                    projectId:null,
                    page:1,
                    rows:10,
                    sort:'createDate',
                    order:'asc',
                    total:null,
                    deptName:'',
                    // professionDesignerName:'',
                    professionLeaderName:'',
                    deptContactUserName:''
                    // deptId:null,
                    // professionDesignerId:null,
                    // professionLeaderId:null
              },
              memberList:[],
              multipleSelection:[],
              typeOptions:[]
          }
      },
      
      created(){
            this.params.projectId = this.$route.params.proId;

            this.typeOptions.push({text:'部门',id:'dept'});
            this.typeOptions.push({text:'法规',id:'regulation'});
           

            window.proMemberVm = this;
            this.addMonitor(); //添加监听
      },

      mounted(){
        this.getProMemberListFunc();
      },
      computed:{
            ...mapState(['baseData','initRole'])
      },
      methods: {
        beforeUpload(file){
            var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
            const extension = testmsg === "xls";
            const extension2 = testmsg === "xlsx";
            if (!extension && !extension2) {
                this.$message({
                    message: "导入文件只能是.xls,.xlsx格式!",
                    type: "warning"
                });
            }
            return extension || extension2;
        },
        uploadFile(param) {
                this.$refs.proMemberLoading.open();
                var fileObj = param.file;
                var form = new FormData();
                form.append("file", fileObj); //key值为请求的参数名
                form.append('projectId',this.params.projectId)
                form.append('time', new Date().getTime());
                projectMemberUpload(form).then(res=>{
                    console.log(res);
                    this.restSearch();
                }).catch(err => { 
                    this.$refs.proMemberLoading.close();
                    // this.$message.error('导入失败');
                })   
            },
        openUploadDialog(){
            // let doit = function(){
               
            // }
            // EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
            window.proMemberVm.$refs.proMemberUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
        },
        addMonitor(){
            let callBackDialogFunc = function(obj){
                if(obj && (obj.action == 'proMemberAddCallBack')){ 
                    window.proMemberVm.getProMemberListFunc();
                }else if(obj && (obj.action == 'proMemberUpdateCallBack' )){
                    window.proMemberVm.getProMemberListFunc();
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'proMemberVm');
        },


        getProMemberListFunc(){
            this.$refs.proMemberLoading.open();
            getProMemberList(this.params).then((response)=>{
                this.memberList = response.data.rows;
                this.params.total = response.data.total;
                this.$refs.proMemberLoading.close();
            })
        },

        selectDept(data){
            if(data.itemArray.length > 0){
                this.params.deptId = data.itemArray[0].linkId;
            }else{
                this.params.deptId = null;
            }
            this.searchFunc();
        },

          //回写 专业设计师
        // selectProfessionDesigner(data){
        //     if(data.itemArray.length > 0){
        //         this.params.professionDesignerId = data.itemArray[0].linkId;
        //     }else{
        //         this.params.professionDesignerId = null;
        //     }
        //     this.searchFunc();
        // },

        //回写 部门联络人
        selectProfessionLeader(data){
            if(data.itemArray.length > 0){
                this.params.professionLeaderId = data.itemArray[0].linkId;
            }else{
                this.params.professionLeaderId = null;
            }
            this.searchFunc();
        },

        //回写 部门联络人
        selectDeptContactUser(data){
            if(data.itemArray.length > 0){
                this.params.deptContactUserId = data.itemArray[0].linkId;
            }else{
                this.params.deptContactUserId = null;
            }
            this.searchFunc();
        },
        restSearch(){
            this.params.page = 1;
            this.params.deptName='';
            // this.params.professionDesignerName='';
            this.params.professionLeaderName='';
            this.params.deptContactUserName='';
            this.getProMemberListFunc();
        },
        searchFunc(){
            this.params.page = 1;
            this.getProMemberListFunc();
        },

        addFunc(){
            if(sysEnv == 1){
                let url = '/project/index.html#/addProjectMember/'+this.params.projectId;
                EcoUtil.getSysvm().openDialog('新增成员',url,600,400,'12vh');
            }else{
                this.$router.push({name:'addProjectMember',params:{proId:this.params.projectId}})
            }
        },

        editItem(id){
            if(sysEnv == 1){
                let url = '/project/index.html#/editProjectMember/'+id;
                EcoUtil.getSysvm().openDialog('编辑成员',url,600,400,'12vh');
            }else{
                this.$router.push({name:'editProjectMember',params:{id:id}});
            }
        },

        editCBFunc(data){
            this.baseInfo.id = data.id;
            this.getProMemberListFunc();
            this.getFileListFunc();
        },

        delFunc(){
            if(this.multipleSelection.length == 0){
                EcoMessageBox.alert('请选择要删除的数据','提示');
            }
            let that  = this;
            let confirmYesFunc = function(){
                  let _ids = [];
                  for(let i = 0;i<that.multipleSelection.length;i++){
                       _ids.push(that.multipleSelection[i].id);
                  }
                  deleteProMember(_ids,that.params.projectId).then((response)=>{
                        that.$message({
                              showClose: true,
                              message:'删除成功',
                              type: 'success',
                              duration:2000
                        });
                        
                        that.getProMemberListFunc();
                  })
              }

              let options = { type:'warning',lockScroll:false}
              EcoMessageBox.confirm('确认删除？','提示',options,confirmYesFunc);
        },

        historyFunc(){
             this.$router.push({name:'proMemberHistory'});
        },

        //每页条数
        handleSizeChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.params.rows = val;
            this.params.page = 1;
            this.getProMemberListFunc();
        },

        //跳转页码
        handleCurrentChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.params.page = val;
            this.getProMemberListFunc();
        },

        changeFun(rows) {
           this.multipleSelection = rows;
        },

        getKVName(list,typeId){
            let _name = null;
            if(list && list.length > 0){
                for(let i = 0;i<list.length;i++){
                    if(list[i].id == typeId){
                        _name = list[i].text;
                        break;
                    }
                }
            }
            return _name;
        },
        
      }
  }
</script>

<style scoped>

.proMember{
    padding:0px 15px 20px 15px;
    background-color:#fff;
}

.proMember .toolbar{
    margin-top: 10px;
    margin-bottom:10px;
}

.proMember .editSpan{
    cursor: pointer;
    color:#409eff;
}

.proMember .searchBox{
      font-size: 14px;
      padding: 10px 20px;
      line-height: 30px;
      overflow-y:auto;
      background-color: #fafafa;
}

.proMember .itemInput{
    display: inline-block;
    width: 140px;
    margin-right: 10px;
}

</style>
