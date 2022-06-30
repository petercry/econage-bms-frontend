<template>
    <div class="regionAdd">
         <el-form ref="form" :model="form" label-width="120px" label-position="left" style="margin-left:10px;margin-right:10px;">
                <el-form-item label="大区" prop="region"  :rules="[{required: true, message:'大区必须填写'}]">
                            <el-select
                                style="width:100%"
                                v-model="form.region"
                                placeholder="请选择"
                                clearable
                            >
                                <el-option
                                        v-for="(item,index) in kvMap['crp_region']"
                                        :key="index"
                                        :label="item.text"
                                        :value="item.id"
                                >
                                </el-option>
                            </el-select>
                </el-form-item>

                <el-form-item label="省份" prop="area"  :rules="[{required: true, message:'省份必须填写'}]">
                            <el-select
                                style="width:100%"
                                v-model="form.area"
                                placeholder="请选择"
                                clearable
                                filterable
                                disabled
                            >
                                <el-option
                                        v-for="(item,index) in kvMap['crp_area']"
                                        :key="index"
                                        :label="item.text"
                                        :value="item.id"
                                >
                                </el-option>
                            </el-select>
                </el-form-item>

                <el-form-item label="坐标" prop="location" :rules="[{required: true, message:'坐标必须填写',trigger: 'blur'}]">
                        <el-input v-model="form.location" ></el-input>
                </el-form-item>
          </el-form>

          <div class="btn">
              <el-button @click="cancelFunc">取消</el-button>
              <el-button type="primary" @click="updateFunc">保存 <i class="el-icon-check el-icon--right"></i></el-button>
          </div>
    </div>

</template>

<script>

import {Loading } from 'element-ui';
import EcoUtil from '@/components/util/main.js'
import {updateRegion,getRegionSingle} from '../../service/service.js'
import {EcoKVUtil} from '@/components/util/kv.js'

export default {
  name:'regionAdd',
  components:{
      
  },
  props: {
 
  },
  data() {
    return {
        form:{
            id:null,
            region:null,
            area:null,
            location:null,
        },
        kvMap:{
            crp_region:[], //大区
            crp_area:[] //省份
        },
        oldRegion:null
    };
  },
  created(){
        this.form.id = this.$route.params.id;

        this.getRegionSingleFunc();
        EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);
  },
  mounted(){
     
  },
  computed:{
  
  },
  methods:{
        getRegionSingleFunc(){
            getRegionSingle(this.form.id).then((response)=>{
                    this.form.region = response.data.region;
                    this.form.area = response.data.area;
                    this.form.location = response.data.location;

                    this.oldRegion = response.data.region;
            })
        },
        

        updateFunc(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});
                    updateRegion(this.form).then((res)=>{
                            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                loadingInstance.close();
                            });

                            if (res.data && res.data.id){
                                this.$message({type: 'success',message: '添加成功！'});
                                let doObj = {}
                                doObj.action = 'regionUpdateCallBack';
                                doObj.data = {};
                                doObj.data.queryObj = res.data;
                                doObj.data.oldRegion = this.oldRegion;
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

.regionAdd .btn{
    margin-top:30px;
    text-align: right;
    margin-right:10px;
}
</style>
