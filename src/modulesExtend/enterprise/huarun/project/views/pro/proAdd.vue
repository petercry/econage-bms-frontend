<template>
    <eco-content top="0px" bottom="0px" class="proAdd" >
        <eco-content top="0px" bottom="50px" >
            <el-form ref="form" :model="baseInfo" label-width="140px" label-position="right" style="margin-left:10px;margin-right:10px;">
                
                <el-form-item label="建设业态" prop="business"  :rules="[{required: true, message:'建设业态必须填写'}]">
                        <el-select
                            style="width:100%"
                            v-model="baseInfo.business"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option
                                    v-for="(item,index) in kvMap['crp_business']"
                                    :key="index"
                                    :label="item.text"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                </el-form-item>

                <el-row >
                    
                    <el-col :span="12">
                        <el-form-item label="项目编号" prop="code" :rules="[{required: true, message:'项目编号必须填写',trigger: 'blur'}]">
                            <el-input v-model="baseInfo.code" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="项目名称" prop="name" :rules="[{required: true, message:'项目名称必须填写',trigger: 'blur'}]">
                            <el-input v-model="baseInfo.name" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="大区名称" prop="region">
                                <el-select
                                    style="width:100%"
                                    v-model="baseInfo.region"
                                    placeholder="请选择"
                                    clearable
                                    @change="changeRegion" 
                                 
                                >
                                    <el-option
                                            v-for="(item,index) in regionList"
                                            :key="index"
                                            :label="item.typeName"
                                            :value="item.type"
                                    >
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="区域公司名称" prop="regionCompany">
                                <el-select
                                    style="width:100%"
                                    v-model="baseInfo.regionCompany"
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                            v-for="(item,index) in areaList"
                                            :key="index"
                                            :label="item.areaName"
                                            :value="item.area"
                                    >
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
             
                <el-form-item label="项目容量（ MW ）" prop="capacity">
                    <el-input :value="baseInfo.capacity" @input="onInput" @keypress.native="onKeyPress"></el-input>
                </el-form-item>

                         
                <el-form-item label="">
                        <el-table style="width:100%;marginBottom:10px" :data="baseInfo.fanList" border class="addExtendTable">
                                <el-table-column
                                    align="center"
                                    type="index"
                                    label="序号"
                                    width="50">
                                </el-table-column>

                                <el-table-column prop="name" label="风机号/组号" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.code"></el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="email" label="单台/主容量（ WM ）" align="center">
                                    <template slot-scope="scope">
                                            <el-input :value="scope.row.capacity" @input="onInputFan($event,scope.$index)"  @keypress.native="onKeyPress"></el-input>
                                    </template>
                                </el-table-column>

                                  <el-table-column prop="email" label="风机坐标" align="center">
                                    <template slot-scope="scope">
                                            <el-input v-model="scope.row.location"></el-input>
                                    </template>
                                </el-table-column>

                                 <el-table-column  width="70">
                                            <template slot-scope="scope">
                                                    <el-button icon="el-icon-minus" type="primary" @click="deleteTableLine(scope.$index)"></el-button>
                                            </template>
                                        </el-table-column>
                                </el-table>

                                <div style="text-align:right">
                                    <el-button icon="el-icon-plus" type="primary" class="fl-right" @click="addTableLine" style="margin-right:15px">添加行</el-button>
                                </div>

                                
                </el-form-item>
                      
            
         </el-form> 
        </eco-content>

        <eco-content bottom="0px" height="50px" >
                <div class="btn">
                    <el-button @click="cancelFunc">取消</el-button>
                    <el-button type="primary" @click="createFunc">保存</el-button>
                </div>
        </eco-content>

    </eco-content>
</template>
<script>

  import {getRegionVO,addPro} from '../../service/service'
  import {Loading } from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import {EcoUtil} from '@/components/util/main.js'
  import {EcoKVUtil} from '@/components/util/kv.js'

  export default {
      components:{
          ecoContent,
      },
      data(){
          return{
                baseInfo:{
                    business:null,
                    code:null,
                    name:null,
                    region:null,
                    regionCompany:null,
                    capacity:null,
                    fanList:[],
                },
                kvMap:{
                    crp_business:[], //建设业态
                },
                regionList:[],
                areaList:[],
           
                loading:true,
          }
      },

      created(){
            this.getReginArea();
            EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);
            this.addTableLine();
      },
      mounted(){
         
      },
      computed:{
         
      },
      methods: {

            getReginArea(){
                getRegionVO().then((response) => {
                       this.regionList = response.data;
                })
            },

            changeRegion(){
                this.baseInfo.regionCompany = null;
                for(let i = 0;i<this.regionList.length;i++){
                    if(this.baseInfo.region == this.regionList[i].type){
                        this.areaList = this.regionList[i].list || [];
                        break;
                    }
                }
            },

            addTableLine(){
                this.baseInfo.fanList.push({code:'',capacity:'',location:''})
            },

            deleteTableLine(index){
                this.baseInfo.fanList.splice(index, 1);
            },

            createFunc(){
                  let that = this;
                  this.$refs['form'].validate((valid) => {
                      if (valid) {
                            let loadingInstance = Loading.service({ fullscreen: true,text:'正在创建中...'});
                            addPro(that.baseInfo).then((response)=>{
                                    that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                        loadingInstance.close();
                                    });
                                    let doObj = {}
                                    doObj.action = 'upProAddBack';
                                    doObj.data = {};
                                    doObj.close = true;
                                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
                            }).catch((err)=>{
                                    that.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                        loadingInstance.close();
                                    });
                            })
                        }else{
                            return false;
                        }
                    })
            },

            cancelFunc(){
                  EcoUtil.getSysvm().closeDialog();
            },

            onKeyPress(event){
               if(event.keyCode < 45 || event.keyCode > 57){
                    event.returnValue = false; 
                }else{
                    
                }             
            },
            
            onInput(val){
                if(EcoUtil.isNumber(val,0)){
                    this.baseInfo.capacity = val; 
                }
            },

            onInputFan(val,idx){
                 if(EcoUtil.isNumber(val,0)){
                    this.baseInfo.fanList[idx].capacity = val; 
                }
            }
      }

  }

</script>

<style scoped>
.proAdd{
    padding:0px 20px 20px 20px;
    background-color:#fff;
    margin-right:20px;
    margin-left:20px;
    position: fixed !important;
}

.proAdd .title{
    font-size: 14px;
    line-height: 32px;
    color: #262626;
    margin-top:15px;
}

.proAdd .content{
    margin-top:5px;
    color:#8c8080
}

.proAdd .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
