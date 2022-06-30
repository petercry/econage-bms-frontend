<template>
    <div class="addMiles" v-loading="loading">
        <el-row class="toolbar">
            <el-col :span="8" >
                <eco-tool-title style="line-height: 30px;" :title="ifEdit? '编辑里程碑':'新建里程碑'"></eco-tool-title>
            </el-col>
            <el-col :span="16" style="text-align: right;">
                <el-button type="danger" size="mini" v-show="ifEdit && milesRoleDelete" @click="deleteMiles">删除<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary" size="mini" v-show="(ifEdit && milesRoleEdit) || (!ifEdit && milesRoleAdd)" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <div class="main">
            <el-form ref="form" :model="form" label-width="120px" class="addForm" :disabled="(!(ifEdit && milesRoleEdit && editStatus) && (!ifEdit && !milesRoleAdd) )">
                <el-form-item label="里程碑名称" required>
                    <el-input v-model.trim="form.name" :disabled="trType || dcpType"></el-input>
                </el-form-item>
                <el-form-item label="里程碑类型" required>
                    <el-select v-model="form.type" :disabled="trType || dcpType" style="width:40%" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in milesType" :key="index"
                            :label="item.text"
                            :value="item.id"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联里程碑" :key="cascaderKey">
                    <el-cascader ref="linkMiles" @blur="linkMilesBlur" :props="props" v-model="milesItem" @change="linkMilesChange" :show-all-levels="false" style="width:40%" clearable></el-cascader>
                </el-form-item>

                <el-form-item label="计划完成时间" required v-show="isInProjectCard">
                    <el-date-picker type="date" :disabled="trType" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.planDate" @change="planDateChange" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="GA偏移天数">
                    <el-input v-model="form.gaDay" @input="gaInput" type="number"></el-input>
                </el-form-item>

                <el-form-item label="交付物信息">
                    <link-deliver @callBack="selectDeliver" placeholder="请选择交付物" :initData="deliverList"></link-deliver>
                </el-form-item>

            </el-form>
            <div class="pinshen">
                <el-row>
                    <el-col :span="8" class="rightBorder">
                        <span>评审维度</span>
                    </el-col>
                    <el-col :span="16">
                        <span>评审要素</span>
                    </el-col>
                </el-row>
                <el-row v-for="(item,index) in assessList" :key="index" v-bind:style="{minHeight:item.elements.length * 50 + 'px'}">
                    <el-col :span="8" class="dimension">
                        <el-input :disabled="!(ifEdit && milesRoleEdit) && (!ifEdit && !milesRoleAdd)" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" v-model="item.dimension" style="font-size: 16px;"></el-input>

                    </el-col>
                    <el-col :span="16" class="leftBorder">
                        <div v-for="(single,num) in item.elements " :key="num">
                            <el-input :disabled="!(ifEdit && milesRoleEdit) && (!ifEdit && !milesRoleAdd)" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" v-model="single.element" style="width:calc(100% - 60px);font-size: 16px;"></el-input>
                            <div class="delbtn">
                                <i v-show="num == item.elements.length - 1 && (ifEdit && milesRoleEdit) || (!ifEdit && milesRoleAdd)" @click="addElement(item.elements)" class="iconfont icon iconpluscircleo pointerClass"></i>
                                <i v-show="(ifEdit && milesRoleEdit) || (!ifEdit && milesRoleAdd)" @click="deleteElement(num,index,item.elements)" class="iconfont icon iconclosecircleo pointerClass"></i>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <div class="btn-line">
                    <el-button size="medium" v-show="(ifEdit && milesRoleEdit) || (!ifEdit && milesRoleAdd)" @click="addAssessItem" type="text"><i class="iconfont icon iconicon-test"></i> 添加</el-button>
                </div>
            </div>
            <div class="btnGroup">
                <el-button type="primary" size="mini" @click="onSubmit" v-show="(ifEdit && milesRoleEdit) || (!ifEdit && milesRoleAdd)">保存<i class="el-icon-check el-icon--right"></i></el-button>
            </div>
        </div>
    </div>
</template>
<script>
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {addMiles,updateMiles,getMilesInfo,getMilesInfoList,getMilesTreeList,deleteMiles} from '../../../api/miles.js'
import { mapActions,mapGetters,mapState } from 'vuex'
import {getItemFetchId} from '../../../api/common.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import linkDeliver from '../../components/linkDeliver.vue'
import {EcoDate} from '@/components/date/main.js'

export default {
  name:'addMiles',
  components: {
    ecoToolTitle,
    linkDeliver
  },
  data() {
    let modelId = this.$route.params.modelId;
    let infoId = this.$route.params.infoId;
    return {
        form:{
            modelId:"",
            infoId:"",
            id:null,
            parentId:"-1",
            parentName:"",
            name:"",
            gaDay:"",
            status:"",
            planDate:"",
            typeSign:"",
            mainWork:{},
            assessList:[],
            delivList:[]
        },
        ifEdit:false,
        loading:false,
        props: {
          lazy: true,
          checkStrictly:true,
          lazyLoad (node, resolve) {
            const { level } = node;
            if(level == 0){
                getMilesTreeList(-1,modelId,infoId).then((response) =>{
                    const dataList = response.rows.map(item=>{
                        item.leaf = !item.subTotal > 0;
                        return item;
                    })
                    resolve(dataList);
                })
            }else{
                getMilesTreeList(node.data.id,modelId,infoId).then((response) => {
                    const dataList = response.rows.map(item=>{
                        item.leaf = !item.subTotal > 0;
                        return item;
                    })
                    setTimeout(() => {
                        resolve(dataList);
                    }, 200);
                })
            }
          },
          label:"name",
          value:"id",
        },
        assessList:[],
        deliverList:[],
        milesItem:[],
        isInProjectCard:false,
        cascaderKey:1,
        defaultStatus:""

    }
  },
  created() {

      this.setMilesType();
  },
  activated(){

  },

  mounted(){
      if(this.$route.params.modelId && this.$route.params.modelId >0){
          this.form.modelId = this.$route.params.modelId;
      }
      if(this.$route.params.infoId && this.$route.params.infoId >0){
          this.form.infoId = this.$route.params.infoId;
          let params = {
            infoId:this.form.infoId,
            order:"asc",
            sort:"planDate"
          }

      }
      if(this.$route.params.id > 0){
          this.ifEdit = true;
          this.getMilesInfo(this.$route.params.id)
      }else{
          this.getItemFetchId();
      }
      //在项目卡片里
      this.isInProjectCard = window.isInProjectCard;
  },
  filters:{

  },
  computed: {
      ...mapGetters(['projectInfo','baseData','milesRoleEdit','milesRoleAdd','milesRoleDelete','milesType']),
      editStatus(){
          if(this.form.mainWork && this.form.typeSign !== 'tr' && this.form.typeSign !== 'dcp'){
              return false;
          }
          return true;
      },
      trType(){
          if(this.form.mainWork && this.form.typeSign == 'tr'){
              return true;
          }else{
              return false;
          }
      },
      dcpType(){
          if(this.form.mainWork && this.form.typeSign == 'dcp'){
              return true;
          }else{
              return false;
          }
      }
  },

  methods: {
       ...mapActions([
        'setMilesType',
      ]),
     getMilesInfo(id){
         this.loading = true;
         this.assessList = [];
         this.deliverList = [];
         this.milesItem = [];

         getMilesInfo(id).then((res)=>{
            this.loading = false;
            this.form.name = res.name;
            this.form.gaDay = res.gaDay;
            this.form.id = res.id;
            this.form.type = res.type;
            this.form.parentId = res.parentId;
            this.form.parentName = res.parentName;
            this.form.planDate = res.planDate;
            this.form.mainWork = res.mainWork;
            this.form.typeSign = res.typeSign;
            if(this.form.planDate){
                this.planDateChange(this.form.planDate)
            }
            if(this.form.gaDay || this.form.gaDay == '0'){
                this.gaInput(this.form.gaDay);
            }
            this.$refs['linkMiles'].inputValue = res.parentName;
            this.form.assessList = res.assessList;
            if(this.form.assessList.length > 0){
                this.pushDataForAssessList();
            }
            this.form.delivList = res.delivList;
            if(this.form.delivList.length > 0){
                this.pushDataForDeliverList();
            }

         }).catch(e=>{
             this.loading = false;
         })
     },
     pushDataForAssessList(){
          let dimensionArray = [];
          for(let item of this.form.assessList){
              let index = dimensionArray.indexOf(item.dimension);
              let child = {};
              child.element = item.element;
              if(index > -1){
                  this.assessList[index].elements.push(child);
              }else{
                dimensionArray.push(item.dimension)
                let obj = {
                    dimension:item.dimension,
                    elements:[]
                }
                obj.elements.push(child);
                this.assessList.push(obj);
              }
          }
     },
     pushDataForDeliverList(){
        this.deliverList = this.form.delivList.map(item => {
            return item.delivId;
        })
     },
     getItemFetchId(){
          getItemFetchId().then(res => {
              this.form.id = res;
              this.loading = false;
          })
      },
     addAssessItem(){
         let obj = {
             dimension:"",
             elements:[
                 {
                     element:""
                 }
             ]
         }
         this.assessList.push(obj);
     },
     deleteAssessItem(index){
         this.assessList.splice(index,1);
     },
     addElement(items){
         let obj = {
             element:""
         }
         items.push(obj);
     },
     deleteElement(num,index,items){
         if(items.length == 1){
             this.deleteAssessItem(index);
         }else{
             items.splice(num,1);
         }

     },
     selectDeliver(data = []){
         this.form.delivList = [];
         if(data.length > 0){
            this.form.delivList = data.map((item,index) => {
                let obj = {};
                obj.milestoneId = this.form.id;
                obj.delivId = item.id;
                return obj;
            })
         }
     },
     linkMilesChange(value){
        this.form.parentId = value.length > 0 ? value[value.length-1] : -1;
        if(this.form.parentId == this.$route.params.id){
            this.form.parentId = -1;
            this.form.parentName = "";
            this.milesItem = [];
            return EcoMessageBox.alert('无法选择节点本身','提示')
        }
        try{
            this.form.parentName = this.$refs['linkMiles'].getCheckedNodes()[0].label;
        }catch(e){
            this.form.parentName = '';
        }
     },
     onSubmit(){
         if(!this.form.name){
             return  EcoMessageBox.alert('里程碑名称 不能为空','提示')
         }
         if(!this.form.type){
             return  EcoMessageBox.alert('里程碑类型 不能为空','提示')
         }
         if(!this.form.planDate && this.isInProjectCard){
             return  EcoMessageBox.alert('计划完成时间 不能为空','提示')
         }
        //  if(!this.form.type){
        //      return  EcoMessageBox.alert('请选择团队类型','提示')
        //  }
        this.form.assessList = [];
         for(let item of this.assessList){
            if(!item.dimension){
                return  EcoMessageBox.alert('评审维度 不能为空','提示')
            }else{
                item.elements.forEach(data => {
                    if(data.element){
                        let obj = {};
                        obj.dimension = item.dimension;
                        obj.element = data.element;
                        this.form.assessList.push(obj);
                     }

                 });
            }
         }
         this.loading = true;
         if(this.ifEdit){
             updateMiles(this.form).then((res)=>{
                 this.loading = false;
                 this.$message({
                    message: '修改成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","updateMiles",res);
             }).catch(e=>{
                this.loading = false;
             });
         }else{
             addMiles(this.form).then((res)=>{
                this.loading = false;
                this.$message({
                    message: '添加成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
                this.$emit("callBack","addMiles",res);
                if(window.isInCard){
                    this.$router.push({name:'addOrUpdateMilesInCard',params:{id:res.id}});
                }else if(window.isInProjectCard){
                    this.$router.push({name:'addOrUpdateMilesInProjectCard',params:{id:res.id}});
                }else{
                    this.$router.push({name:'addOrUpdateMiles',params:{id:res.id}});
                }
            }).catch(e=>{
                this.loading = false;
            });
         }

     },
     deleteMiles(){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteMilesFunc(that.form.id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);

     },
     deleteMilesFunc(id){
         deleteMiles(id).then((res)=>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.$emit("callBack","deleteMiles",id);
            if(window.isInCard){
                 this.$router.push({name:'templatesCard'});
            }else if(window.isInProjectCard){
                 this.$router.push({name:'milesSettingInProjectCard'});
            }else{
                 this.$router.push({name:'milesSetting'});
            }

        })
     },
     linkMilesBlur(){
         setTimeout(()=>{
             this.$refs['linkMiles'].inputValue = this.form.parentName;
         },500)
     },
     gaInput(value){
         if(this.isInProjectCard){
             this.form.planDate = EcoDate.formatDateDefault(new Date(EcoDate.convertDateFromString(this.projectInfo.planGa).getTime() + value*24*60*60*1000));
         }
     },
     planDateChange(value){
         this.form.gaDay = (EcoDate.convertDateFromString(value).getTime() - EcoDate.convertDateFromString(this.projectInfo.planGa).getTime())/(24*60*60*1000)
     }
  },
  watch:{
     $route:{
         deep:true,
         handler(){
             this.cascaderKey++;
             if(this.$route.params.id > 0){
                this.form.id = this.$route.params.id;
                this.ifEdit = true;
                this.getMilesInfo(this.form.id)
            }else{
                this.form = {
                    id:null,
                    modelId:"",
                    infoId:"",
                    parentId:"-1",
                    name:"",
                    gaDay:"",
                    planDate:"",
                    assessList:[],
                    delivList:[]
                },
                this.ifEdit = false;
                this.assessList = [];
                this.deliverList = [];
                this.milesItem = [];
                this.$refs['linkMiles'].inputValue = "";

            }
            if(this.$route.params.modelId && this.$route.params.modelId >0){
                this.form.modelId = this.$route.params.modelId;
            }
            if(this.$route.params.infoId && this.$route.params.infoId >0){
                this.form.infoId = this.$route.params.infoId;
            }
         }
     }
  },

};
</script>

<style scoped>
.addMiles{
    position: relative;
    height: 100%;
}
.addMiles .toolbar{
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.addMiles .main{
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
    overflow: auto;
}
.addMiles .addForm{
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 0px;
    color: #0f1419 !important;
}
.btn-line {
	border: 1px dashed #003b90;
	background-color: #fff;
	color: #003b90;
	cursor: pointer;
    text-align: center;
    border-radius: 4px;
	margin: 10px 0px;
}
.pinshen{
    padding: 20px;
    padding-top: 0;
}
.pinshen .el-row{
    text-align: center;
    border-bottom: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    border-left: 1px solid #DCDFE6;

}
.pinshen .el-row:first-of-type{
    border-top: 1px solid #DCDFE6;
}
.pinshen .el-col{
    line-height: 40px;
    height: 100%;
    padding: 10px 10px;
}
.pinshen .rightBorder{
    border-right: 1px solid #DCDFE6;
}
.pinshen .leftBorder{
    border-left: 1px solid #DCDFE6;
}
.pinshen .delbtn{
    display: inline-block;
    width:40px;
    height: 40px;
}
.pinshen textarea{
    font-family: "PingFang SC","Lantinghei SC","Microsoft YaHei","HanHei SC","Helvetica Neue","Open Sans",Arial,"Hiragino Sans GB","\5FAE\8F6F\96C5\9ED1",STHeiti,"WenQuanYi Micro Hei",SimSun,sans-serif;
}
.btnGroup{
    padding-left: 20px;
}
</style>
