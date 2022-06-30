<template>
   <eco-content top="0px" bottom="0px" class="deptAdd">
      <ecoLoading ref='ecoLoadingRef' :text="'添加中...'"></ecoLoading>
       <eco-content top="0px" height="60px" type="tool">
                    <el-row  class="toolbar">
                        <el-col :span="6">
                             <eco-tool-title style="line-height: 38px;" :title="form.parentId == -1?'添加根部门':'添加子部门'"></eco-tool-title>
                        </el-col>

                        <el-col :span="18" style="text-align:right;padding-right:10px;padding-top:5px;">
                             <el-button type="primary" size="mini" @click="save" >保存  <i class="el-icon-check el-icon--right"></i></el-button>
                        </el-col>
                    </el-row>
      </eco-content>

      <ecoContent top="60px" bottom="0" style="padding:20px 20px 10px;">
          
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
              <el-select style="width:100%;" v-model="form.branch" placeholder="请选择部门等级">
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
import {addDept,getBasicKvGroupDetail} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
export default{
  name:'deptAdd',
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
        status:"ACTIVE"
      },
      deptLevelId:'ORG_DEPT_LEVEL'
    }
  },
  created(){
    this.form.parentId = this.$route.params.parentId;
  },
  mounted(){
      this.getOrgDeptLevel();
  },
  methods: {
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
      let parantNode = parantTree.getNode(this.form.parentId);
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            addDept(this.form).then((res)=>{
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


                      let doObj = {}
                      doObj.action = 'orgDeptAdd-callback';
                      doObj.data = {};
                      EcoUtil.getSysvm().callBackDialogFunc(doObj);

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
.deptAdd .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}
</style>
