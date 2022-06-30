<template>
    <div class='editPage'>
        <div class='addForm' v-loading='loading'>
            <el-table ref='editPage2Table' @selection-change="handleSelectionChange" @row-click="rowClick" highlight-current-row  :data='tableData' style='width:97%;margin:0 auto 20px;' header-row-class-name='tableHeader' height='150px' tooltip-effect='dark'>
               <el-table-column type="selection" width="55" v-if='ids.length>1'></el-table-column>
               <el-table-column label='序号' type='index'></el-table-column>
               <el-table-column label='标准法规号' prop='standardRegulationNo'></el-table-column>
               <el-table-column label='标准法规名称' prop='nameStandardsRegulations'></el-table-column>
               <el-table-column label='车型型号' prop='carModel'></el-table-column>
               <el-table-column label='项目代号' prop='projectCode'></el-table-column>
               <el-table-column label='符合性' prop='accordWith'>
                    <template slot-scope='scope'>
                        <span>{{restData(scope.row.accordWith,'accordWith')}}</span>
                    </template>
               </el-table-column>
            </el-table>
            <el-form v-show='tableData.length!==0' :model='formData' ref='editPageForm' :rules='rules'  label-position='right' label-width='130px'>
                <div class='rowTitle'>基本信息</div>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='标准法规号:' prop='standardRegulationNo'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.standardRegulationNo' ></el-input>
                            <span class="viewContent" v-else>{{formData.standardRegulationNo}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='标准法规名称:' prop='nameStandardsRegulations'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.nameStandardsRegulations' ></el-input>
                            <span class="viewContent" v-else>{{formData.nameStandardsRegulations}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='车型型号:' prop='carModel'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.carModel' ></el-input>
                            <span class="viewContent" v-else>{{formData.carModel}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='项目代号:' prop='projectCode'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.projectCode' ></el-input>
                            <span class="viewContent" v-else>{{formData.projectCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='部门:' prop='deptName'>
                            <el-input disabled v-if='isEdit' placeholder='请输入' v-model='formData.deptName' ></el-input>
                            <span class="viewContent" v-else>{{formData.deptName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='专业:' prop='major'>
                            <el-select disabled style='width: 100%;' v-model='formData.major' clearable v-if='isEdit'>
                                <el-option v-for='(item,index) in professionList' :value='item.id' :label='item.text' :key='"professionList"+index'></el-option>
                            </el-select>
                            <span class="viewContent" v-else>{{formData.major}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='设计师:' prop='designer'>
                            <tag-select disabled class='disabled' v-if='isEdit' ref='designerTag' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.initDataStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'designer')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.designerName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-form-item label='部门负责人:' prop='deptLeader'>
                            <tag-select class='disabled' disabled ref='deptLeaderTag' v-if='isEdit' placeholder="选择人员" style="width:100%;vertical-align: top;" :initDataStr="formData.deptLeaderStr"
                                :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'deptLeader')}">
                            </tag-select>
                            <span class="viewContent" v-else>{{formData.deptLeaderPerson}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>点检结果</div>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label='符合性:' prop='accordWith'>
                            <el-select filterable  v-model='formData.accordWith' clearable v-if='isEdit'>
                                <el-option v-for='(item,key) in dfHandlingInterfaceList' :value='key' :label='item' :key='key'></el-option>
                             </el-select>
                            <span class="viewContent" v-else>{{formData.accordWith}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                   <el-col :span='22'>
                        <el-form-item label='说明:' prop='explain'>
                            <el-input  v-if='isEdit' v-model='formData.explain' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.explain}}</span>
                        </el-form-item>
                   </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='支撑材料:' class='is-required'>
                            <upload :isEdit='true'  :showList='true' :multiple="false" :modular="modular"
                                :modularInnerId="copingoutcomesModularInnerId" @fileChange="fileChange"
                                @preView='preView' @fileOnSuccess="fileOnSuccess"
                                accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件
                                </el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class='rowTitle'>审批结果</div>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='专业部门科长:' prop='deptStatusText'>
                            <el-input disabled v-if='isEdit' v-model='formData.deptStatusText' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                 placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.deptStatusText}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='法规责任人:' prop='standardRegulationStatusText'>
                            <el-input disabled v-if='isEdit' v-model='formData.standardRegulationStatusText' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                 placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.standardRegulationStatusText}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='22'>
                        <el-form-item label='标准法规室总师:' prop='engineerStatusText'>
                            <el-input disabled v-if='isEdit' v-model='formData.engineerStatusText' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                 placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.engineerStatusText}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {dfHandlingInterfaceUpdatedesignerStatus,dfHandlingInterfaceIds,getUserInfoByOrgId,dfHandlingInterfaceSelectbyupdate,dfHandlingInterfaceUpdatey} from '../../service/service.js'
    import upload from '../components/upload.vue'
    import { EcoFile } from '@/components/file/main.js'
    import tagSelect from '@/components/orgPick/tagSelect.vue'
    export default {
        name:'editPage2',
        data(){
            return {
                multipleSelection:[],
                tableData:[],
                fileList:[],
                modular:"copingoutcomes_document",
                copingoutcomesModularInnerId:'',
                formData:{
                    standardRegulationNo:'',
                    nameStandardsRegulations:'',
                    carModel:'',
                    projectCode:'',
                    deptName:'',
                    major:'',
                    designer:'',
                    designerName:'',
                    accordWith:'',
                    explain:'',
                    deptStatus:'',
                    deptStatusText:'',
                    standardRegulationStatus:'',
                    standardRegulationStatusText:'',
                    engineerStatus:'',
                    engineerStatusText:'',
                    initDataStr:'',
                    deptLeaderStr:''
                },
                loading:false
            }
        },
        created(){
            // this.getDetails();
        },
        activated(){
            console.log('editpage2')
            this.getDetails();
        },
        components:{
            upload,
            tagSelect
        },
        computed:{
            isEdit(){
                return this.$route.params.caseType !== 'viewCase'
            },
            ...mapState(['dfHandlingInterfaceList','professionList']), 
            ids(){
                return this.$route.params.ids?JSON.parse(this.$route.params.ids):[];
            },
            rules(){
                var list={
                    deptName:'部门',
                    major:'专业',
                    designer:'设计师',
                    deptLeader:'部门责任人',
                    // standardRegulationNo:'标准法规编号',
                    // nameStandardsRegulations:'标准法规名称',
                    // carModel:'车型型号',
                    // projectCode:'项目代号', 
                    accordWith:'符合性',
                    // explain:'说明',
                    // deptStatus:'专业部门审核',
                    // standardRegulationStatus:'法规负责人审核',
                    // engineerStatus:'标准法规室总师审核'
                }
                var obj={};
                for(var key in list){
                    var trigger = (key.search(/(accordWith)|(major)/g)!==-1)?'change':'blur'
                    obj[key] = [{ required: true, message: `${list[key]}为必填项`, trigger: trigger }];
                }
                return obj;
            },
            selectionIds(){
              var ids = this.multipleSelection.map(item=>{
                     return item.id
               })
               return ids;
            } 
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            updatenCase(){
                if(this.ids.length>1 && this.selectionIds.length===0){
                    this.$message.warning('请选择要退回数据！');
                    return;
                }
                this.loading = true;
                let data = this.ids.length>1?(this.selectionIds):(this.ids);
                dfHandlingInterfaceUpdatedesignerStatus(data).then(res=>{
                    this.loading = false;
                    this.$message.success('退回成功!');
                    this.$parent.$parent.goBack(false);
                }).catch(err=>{
                    this.loading = false;
                    this.$message.success('退回失败!');
                })
            },
            rowClick(row){
                if(this.formData.id == row.id){
                    return;
                }
                this.loading = true;
                this.copingoutcomesModularInnerId = row.id;
                this.formData = row;
                this.initDesigner();

                this.$set(this.formData,'deptStatusText',''); 
                this.$set(this.formData,'standardRegulationStatusText',''); 
                this.$set(this.formData,'engineerStatusText',''); 
                this.initStatus('deptStatus');
                this.initStatus('standardRegulationStatus');
                this.initStatus('engineerStatus');  
            },
            selectRoleUser(data,type) {
                //设计师
                if (!data.id && data.itemArray.length === 0) {
                    //人员删除
                    if(type==='designer'){
                        this.formData.designer = '';
                        this.formData.designerName ='';
                        this.formData.initDataStr = '';
                    }else{
                        this.formData.deptLeader = '';
                        this.formData.deptLeaderStr='';
                    }
                } else {
                    if(type=='designer'){
                        this.formData.designer = data.itemArray[0].linkId;
                        this.formData.designerName = data.itemArray[0].name;
                        //部门带出
                        if (this.formData.deptName) {
                            return;
                        }
                        let orgId = data.orgId.split('.')[0];
                        getUserInfoByOrgId(data.itemArray[0].linkId).then(res => {
                            var len = 0;
                            if (res.data.departments && res.data.departments.length > 1) {
                                res.data.departments.forEach((item, i) => {
                                    if (item.id == orgId) {
                                        len = i;
                                    }
                                })
                            }
                            this.formData.deptName = res.data.departments[len].name;//部门
                        })
                    }else{
                        this.formData.deptLeader = data.itemArray[0].linkId;
                    }

                }
            },
            initDesigner(){
                this.$set(this.formData,'initDataStr',''); 
                this.$set(this.formData,'deptLeaderStr','');
                if(this.formData.deptLeader){
                    getUserInfoByOrgId(this.formData.deptLeader).then(response=>{
                        this.$set(this.formData,'deptLeaderStr',`{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`)
                    })
                }
                // else{
                       // this.$refs.deptLeaderTag.initDataStrFunc('');     
                // }
                if(this.formData.designer){
                    getUserInfoByOrgId(this.formData.designer).then(response=>{
                        this.$set(this.formData, 'initDataStr', `{"type":"PERSONNEL","orgId":"${response.data.departments[0].id}.${response.data.id}","linkId":"${response.data.id}"}`);
                        this.loading = false;
                    }).catch(err=>{
                        this.loading = false;
                    })
                }else{
                    // this.$refs.designerTag.initDataStrFunc('');
                    this.loading = false;
                }
            },
            getDetails(){
                this.loading = true;
                dfHandlingInterfaceIds(this.ids).then(res=>{
                    this.tableData = res.data.rows;
                    if(res.data.rows.length!==0){
                        this.copingoutcomesModularInnerId = this.tableData[0].id;
                        this.formData = res.data.rows[0];      
                        this.initDesigner();
                        this.$set(this.formData,'deptStatusText',''); 
                        this.$set(this.formData,'standardRegulationStatusText',''); 
                        this.$set(this.formData,'engineerStatusText',''); 
                        this.initStatus('deptStatus');
                        this.initStatus('standardRegulationStatus');
                        this.initStatus('engineerStatus');
                        this.$nextTick(function(){
                            this.$refs.editPage2Table.setCurrentRow(this.tableData[0]);
                        })
                    }else{
                        this.$set(this.formData,'initDataStr',''); 
                        this.$set(this.formData,'deptLeaderStr','');
                        this.loading = false;
                    }
                })
            },
            beforeFileUpload(file, callback) {
                // var testmsg = (file.name.substring(file.name.lastIndexOf('.') + 1)).toLocaleLowerCase();
                // const extension = testmsg === 'doc';
                // const extension2 = testmsg === 'docx';
                // const extension3 = testmsg === 'xls';
                // const extension4 = testmsg === 'xlsx';
                // const extension5 = testmsg === 'ppt';
                // const extension6 = testmsg === 'pptx';
                // const extension7 = testmsg === 'txt';
                // const extension8 = testmsg === 'pdf';
                // if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8) {
                //     this.$message({
                //         message: '上传文件只能是.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf格式!',
                //         type: 'warning',
                //         customClass: 'message',
                //         offset: 160
                //     });
                // }
                // callback((extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8));
                callback(true);
            },
            fileOnSuccess(response) {

            },
            preView(item) {
                EcoFile.openFileHeaderByView(item.id, item.name);
            },
            fileChange(file, fileList) {
                this.fileList = fileList;
            },
            onSubmit(){
                if(this.tableData.length===0){
                    return;
                }
                this.$refs.editPageForm.validate((valid) => {
                    if (valid) {
                        if(this.fileList.length==0){
                            this.$message.warning('支撑材料未上传');
                            return;
                        }
                        if(this.ids.length>1 && this.selectionIds.length===0){
                            this.$message.warning('请选择要提交数据！');
                            return;
                        }
                        this.loading = true;
                        let data2 = this.ids.length>1?(this.multipleSelection):(this.tableData);
                        dfHandlingInterfaceUpdatey(data2).then(res2=>{
                            this.loading = false;
                            this.$message.success('提交成功!');
                            this.$parent.$parent.goBack(false);
                        }).catch(err=>{
                            this.loading = false;
                            this.$message.success('提交失败!');
                        })
                        // let data =this.ids.length>1?(this.selectionIds):(this.ids);
                        // dfHandlingInterfaceSelectbyupdate(data).then(res=>{
                        //     if(res.data){
                        //     }else{
                        //         this.$message.warning('符合选中,才能提交！');
                        //         this.loading = false;
                        //     }
                        // })
                    }else{
                        return false;
                    }
                })
                
            }
        }
         
    }
</script>
<style scoped>

</style>