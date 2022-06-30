<template>

    <div class="treeKvAdd">

         <el-form ref="form" :model="form" label-width="120px" label-position="left">
          
            
            <el-form-item label="名称" prop="text" :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model="form.text"></el-input>
            </el-form-item>

            <el-form-item label="简称" prop="shortName" >
                <el-input v-model="form.shortName"></el-input>
            </el-form-item>

            <el-form-item label="ID">
                  <el-input v-model="form.id"></el-input>
            </el-form-item>

            <el-form-item label="code">
                <el-input v-model="form.code"></el-input>
            </el-form-item>

            <!-- <el-form-item label="排序">
                <el-input-number v-model="form.order" :min="0"></el-input-number>
            </el-form-item> -->

            <el-form-item label="国际化编码">
                <el-input v-model="form.i18nKey"></el-input>
            </el-form-item>

                <el-form-item label="类别">
                <el-select v-model="form.category"  filterable  placeholder="请选择" @change="onCategoryOptionsChange">
                                <el-option-group
                                            v-for="group in categoryOptions"
                                            :key="group.id"
                                            :label="group.name"
                                >
                                        <el-option
                                                v-for="item in group.basicKvGroups"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                </el-option-group>
                    </el-select>

                    <el-select v-model="form.group" clearable  placeholder="请选择">
                                    <el-option
                                        v-for="item in groupOptions"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                    </el-select>

                </el-form-item>
            
            <!-- <el-form-item label="备注">
                <el-input v-model="form.description"></el-input>
            </el-form-item> -->

            <el-form-item label="添加可用" prop="enableInCreate">
                <el-checkbox v-model="form.enableInCreate" disabled></el-checkbox>
            </el-form-item>
            
            <el-form-item label="更新可用" prop="enableInUpdate">
                <el-checkbox v-model="form.enableInUpdate" disabled></el-checkbox>
            </el-form-item>
            
            <el-form-item label="查询可用" prop="enableInSelect" >
                <el-checkbox v-model="form.enableInSelect" disabled></el-checkbox>
            </el-form-item>

          
          </el-form>

          <div class="btn">
              <el-button @click="cancelFunc">取消</el-button>
              <el-button type="primary" @click="addFunc">保存 <i class="el-icon-check el-icon--right"></i></el-button>
          </div>
    </div>

</template>

<script>

import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {addTreeKv,getBasicKvCategoryList,getBasicKvGroupDetail} from '../../service/service.js'
import { mapState } from 'vuex';
export default {
  name:'editSysMenu',
  components:{
 
    
  },
  props: {
 
  },
  data() {
    return {
    
      form:{
            text:'',   //菜单名称
            i18nKey:'', //国际化key
            parentId:null,
            id:'', //ID
            code:'',
            description:'',    //备注
            order:1,    //序号，
            shortName:'',
            category:null,
            group:null,
            groupText:null,

            enableInCreate:true,
            enableInUpdate:true,
            enableInSelect:true
      },
      
      rules:{
        
      },

      categoryOptions:[],
      groupOptions:[],
    };
  },
  mounted(){
      this.form.parentId = this.$route.params.parentId;
      this.getBasicKvCategoryListFunc();
  },
  created(){
  
  },
  computed:{
  
  },
  methods:{
       getBasicKvCategoryListFunc(){
            getBasicKvCategoryList().then((response)=>{
                    this.categoryOptions = response.data;
            }).catch((error)=>{ })
        },

        onCategoryOptionsChange(val){ //系统基础数据改变
                this.groupOptions = [];
                this.form.group = null;
                getBasicKvGroupDetail(val).then((response)=>{
                    this.groupOptions = response.data;
                })
       },

        addFunc(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});
                    addTreeKv(this.form).then((res)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                        });

                        if (res.data && res.data.id){
                            this.$message({type: 'success',message: '添加成功！'});
                            let doObj = {}
                            if(this.form.parentId == -1){
                                doObj.action = 'treeKvAddCallBack-root';
                            }else{
                                doObj.action = 'treeKvAddCallBack';
                            }
                            doObj.data = {};
                            doObj.data.queryObj = res.data;
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        }else{
                            this.$message({type: 'error',message: '添加失败！'});
                        }
                  }).catch((error)=>{
                         this.$message({type: 'error',message: '添加失败！'});
                  })
                } else {
                    return false;
                }
            });
        },


        cancelFunc(){
              EcoUtil.getSysvm().closeDialog();
        }
  },

  destroyed(){

  }

};

</script>

<style scoped>

.treeKvAdd .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
