<template>

    <div class="treeKvEdit">

         <el-form ref="form" :model="form" label-width="120px" label-position="left">
            
                <el-form-item label="ID">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>

                <el-form-item label="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                
                <el-form-item label="名称" prop="text" :rules="[{ required: true, message: '名称不能为空'}]">
                    <el-input v-model="form.text"></el-input>
                </el-form-item>

                <el-form-item label="简称">
                    <el-input v-model="form.shortName"></el-input>
                </el-form-item>

                <el-form-item label="国际化编码">
                    <el-input v-model="form.i18nKey"></el-input>
                </el-form-item>

                <el-form-item label="类别">
                   <el-input v-model="form.groupText" readonly @click.native="selectGroupFunc"></el-input>

                   <div v-show="groupShow">
                    <el-select v-model="selCategory"  filterable  placeholder="请选择" @change="onCategoryOptionsChange">
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

                        <el-select v-model="selGroup" clearable  placeholder="请选择" >
                                        <el-option
                                            v-for="item in groupOptions"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                        </el-select>

                        <el-button type="text" size="medium" @click="addGroupFunc">&nbsp;<i class="icon iconfont iconqueding"></i>确定</el-button>
                    </div>
                </el-form-item>

                <el-form-item label="添加可用" prop="enableInCreate">
                    <el-checkbox v-model="form.enableInCreate" disabled></el-checkbox>
                </el-form-item>
                
                <el-form-item label="更新可用" prop="enableInUpdate">
                    <el-checkbox v-model="form.enableInUpdate" disabled></el-checkbox>
                </el-form-item>
                
                <el-form-item label="查询可用" prop="enableInSelect">
                    <el-checkbox v-model="form.enableInSelect" disabled></el-checkbox>
                </el-form-item>
          
          </el-form>

          <div class="btn">
              <el-button @click="cancelFunc">取消</el-button>
              <el-button type="primary" @click="saveFunc">保存 <i class="el-icon-check el-icon--right"></i></el-button>
          </div>
    </div>

</template>

<script>

import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {getTreeKvSingleById,updateTreeKv,getBasicKvCategoryList,getBasicKvGroupDetail} from '../../service/service.js'

export default {
  name:'treeKvEdit',
  components:{
    
  },
  props: {
 
  },
  data() {
    return {
      form:{
            text:null,   //菜单名称
            shortName:null,
            i18nKey:null, //国际化key
            id:null, //ID
            code:'',
            description:null,    //备注
            order:1,    //序号，

           
            group:null,
            groupText:null,
            enableInCreate:true,
            enableInUpdate:true,
            enableInSelect:true
      },
      rules:{},
      categoryOptions:[],
      groupOptions:[],

      groupShow:false,
      selCategory:null,
      selGroup:null,
    };
  },
  mounted(){
            this.form.id = this.$route.params.id;
            this.getData();
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

      

        getData(){
                getTreeKvSingleById(this.form.id).then((response)=>{
                        this.text = response.data.text;
                        this.i18nKey = response.data.i18nKey;
                        this.form.text = response.data.text;
                        this.form.code = response.data.code;
                        this.form.shortName = response.data.shortName;
                        this.form.i18nKey = response.data.i18nKey;
                        this.form.order = response.data.order;
                        this.form.group = response.data.group;
                        this.form.groupText = response.data.groupText;
                        this.form.enableInCreate = response.data.enableInCreate;
                        this.form.enableInUpdate = response.data.enableInUpdate;
                        this.form.enableInSelect = response.data.enableInSelect;
                      
                    
                }).catch((error)=>{ });
        },

        selectGroupFunc(){
            this.selCategory = null;
            this.selGroup = null;
            this.groupShow = true;
        },

        addGroupFunc(){
            this.form.group = this.selGroup;
            let _groupText = null;
            for(let i = 0;i<this.groupOptions.length;i++){
                if(this.form.group == this.groupOptions[i].id){
                    _groupText = this.groupOptions[i].text;
                    break;
                }
            }
            this.form.groupText = _groupText;
            this.groupShow = false;
        },

        saveFunc(){
       
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true,text:'正在更新...'});
                    updateTreeKv(this.form).then((res)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                              loadingInstance.close();
                        });

                        if (res.data && res.data.id){
                            this.$message({type: 'success',message: '更新成功！'});
                            let doObj = {}
                            if(res.data.parentId == -1){
                                doObj.action = 'treeKvEidtCallBack-root';
                            }else{
                                doObj.action = 'treeKvEditCallBack';
                            }
                            doObj.data = {};
                            doObj.data.queryObj = res.data;
                            doObj.close = true;
                            EcoUtil.getSysvm().callBackDialogFunc(doObj);
                        }else{
                            this.$message({type: 'error',message: '更新失败！'});
                        }
                  }).catch((error)=>{
                         this.$message({type: 'error',message: '更新失败！'});
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

.treeKvEdit .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
