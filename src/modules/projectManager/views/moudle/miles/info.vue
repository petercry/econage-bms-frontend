<template>
    <div class="milesInfo" v-loading="loading">
        <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
            <el-row style="padding:12px 10px;background-color:#fff;">
                <el-col :span="24" >
                    <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'里程碑'"></eco-tool-title>
                    <el-button plain class="plainBtn toolBtn" v-if="editable && milesRoleAdd" @click.native="goMilesSetting"><i class="icon el-icon-edit-outline"></i>&nbsp;编写里程碑计划</el-button>
                </el-col>
            </el-row>
        </eco-content>
        <eco-content top="61px" height="101px" style="border-bottom:1px solid #ddd;overflow:hidden;">

                <div class="graph">
                    <el-scrollbar style="height:auto;">
                        <div class="item pointerClass" v-for="(item,index) in dataList" :key="index" v-bind:class="item.color + (item.id == form.id?' active':'') " @click="qiehuanData(item)">
                            <span class="top">{{item.name}}</span>
                            <span class="bottom">{{item.actualDate || item.planDate || '&nbsp;'}}</span>
                        </div>
                    </el-scrollbar>
                </div>

        </eco-content>
        <eco-content top="163px" bottom="0px" type="tool" style="padding:20px 0;background-color:#fff">
            <div class="main">
                <el-form ref="form" :model="form" label-width="120px" class="updateForm" :inline="true" :disabled="!(editStatus && milesRoleEdit)">
                    <el-form-item label="里程碑名称" required >
                        <el-input v-model.trim="form.name" :disabled="dcpType || trType"></el-input>
                    </el-form-item>
                    <el-form-item label="里程碑类型" required>
                        <el-select v-model="form.type"  style="width:100%" :disabled="dcpType || trType" placeholder="请选择">
                            <el-option
                            v-for="(item,index) in milesType" :key="index"
                            :label="item.text"
                            :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="allItem" label="关联里程碑">
                        <el-cascader ref="linkMiles" @blur="linkMilesBlur" :props="props" v-model="milesItem" @change="linkMilesChange" :show-all-levels="false" style="width:100%" clearable></el-cascader>
                    </el-form-item>
                    <el-form-item label="计划完成时间" required>
                       <el-date-picker type="date" :disabled="dcpType || trType" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.planDate" @change="planDateChange" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="实际完成时间" :required="form.status?true:false">
                       <el-date-picker type="date" :disabled="trType" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.actualDate" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="GA偏移天数">
                        <el-input v-model="form.gaDay" @input="gaInput" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="审批状态">
                        <el-select value-key="id" :disabled="trType" v-model="statusItem" style="width:100%;" placeholder="请选择" @change="statusChange" clearable>
                            <el-option
                            v-for="(item,index) in baseData['faw_pm_miles_status']" :key="index"
                            :label="item.text"
                            :value="item"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="颜色状态">
                        <el-select v-model="form.color" style="width:100%;" :disabled="form.status>0" :readonly="form.status>0" placeholder="请选择" clearable>
                            <el-option
                            v-for="(item,index) in colorItems" :key="index"
                            :label="item.text"
                            :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item> -->

                    <el-form-item class="allItem" label="备注">
                        <el-input type="textarea" v-model="form.comments" placeholder="请输入描述" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item class="allItem"  label="交付物信息">
                        <link-deliver @callBack="selectDeliver" :disabled="!editStatus || !milesRoleEdit" placeholder="请选择交付物" :initData="deliverList" style="width:100%"></link-deliver>
                    </el-form-item>
                    <el-form-item class="allItem pinshenItem">
                        <div class="pinshen">
                            <el-row>
                                <el-col :span="8" class="rightBorder header">
                                    <span >评审维度</span>
                                </el-col>
                                <el-col :span="16" class="header">
                                    <span>评审要素</span>
                                </el-col>
                            </el-row>
                            <el-row v-for="(item,index) in assessList" :key="index" v-bind:style="{minHeight:item.elements.length * 48 + 'px'}">
                                <el-col :span="8" class="dimension">
                                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" v-model="item.dimension"></el-input>

                                </el-col>
                                <el-col :span="16" class="leftBorder">
                                    <div v-for="(single,num) in item.elements " :key="num">
                                        <el-input  type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" v-model="single.element" style="width:calc(100% - 60px);margin:5px 0;"></el-input>
                                        <div class="delbtn" v-if="editStatus && milesRoleEdit">
                                            <i v-show="num == item.elements.length - 1" @click="addElement(item.elements)" class="pointerClass iconfont icon iconpluscircleo"></i>
                                            <i @click="deleteElement(num,index,item.elements)" class="pointerClass iconfont icon iconclosecircleo"></i>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <div class="btn-line" v-if="editStatus && milesRoleEdit">
                                <el-button size="medium" @click="addAssessItem" type="text"><i class="iconfont icon iconicon-test"></i> 添加</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item class="allItem pinshenItem" v-if="editStatus && milesRoleEdit">
                        <div class="btnGroup">
                            <el-button type="primary" size="medium" @click="onSubmit">保存<i class="el-icon-check el-icon--right"></i></el-button>
                        </div>
                    </el-form-item>
                </el-form>


            </div>
        </eco-content>
    </div>

</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {updateMiles,getMilesInfo,getMilesInfoList,getMilesTreeList,deleteMiles} from '../../../api/miles.js'
import {EcoUtil} from '@/components/util/main.js'
import {getPMModelRole} from '../../../api/common.js'
import {EcoDate} from '@/components/date/main.js'
import linkDeliver from '../../components/linkDeliver.vue'
import { mapActions,mapGetters } from 'vuex'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default{
    name:'milesInfo',
    components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      linkDeliver
    },
    data() {
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
                planDate:"",
                assessList:[],
                delivList:[],
            },
            statusItem:{},
            loading:false,
            props: {
                lazy: true,
                checkStrictly:true,
                lazyLoad (node, resolve) {
                    const { level } = node;
                    if(level == 0){
                        getMilesTreeList(-1,"",infoId).then((response) =>{
                            const dataList = response.rows.map(item=>{
                                item.leaf = !item.subTotal > 0;
                                return item;
                            })
                            resolve(dataList);
                        })
                    }else{
                        getMilesTreeList(node.data.id,"",infoId).then((response) => {
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
            colorItems:[
                {
                    text:"红",
                    id:"red"
                },
                {
                    text:"黄",
                    id:"yellow"
                },
                {
                    text:"绿",
                    id:"green"
                }
            ],
            params:{
                infoId:infoId,
                order:"asc",
                sort:"planDate"
            },
            dataList:[],

        }
    },
    props:{
        editable: {
            type: Boolean,
            default(){
                return true
            }
        }
    },
    created(){

        //  this.getMilesList();
        //  this.initSomeBaseData(['faw_pm_miles_status'])

    },
    activated(){
         this.getMilesList();
         this.setMilesRole(this.$route.params.infoId);
         this.setMilesType();
         //this.initSomeBaseData(['faw_pm_miles_status'])
    },
    mounted() {
        if(this.$route.params.infoId && this.$route.params.infoId >0){
            this.form.infoId = this.$route.params.infoId;

        }
    },
    computed: {
     ...mapGetters([
        'baseData',
        'projectInfo',
        'milesRoleEdit',
        'milesRoleAdd',
        'milesType'
      ]),
      editStatus(){
          if((this.form.mainWork && this.form.typeSign !== 'tr' && this.form.typeSign !== 'dcp')|| !this.editable){
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
            'setMilesRole',
            'setMilesType'
        ]),
        getMilesList(){
            this.loading = true
            getMilesInfoList(this.params).then(res => {
                this.dataList = res.rows;
                if(this.dataList.length == 0){
                    if(this.editable && this.milesRoleAdd){
                        let that = this;
                        let options = {
                            callback(){
                                that.goMilesSetting();
                            }
                        }
                        EcoMessageBox.alert("请先添加里程碑","提示",options);
                    }else{
                        this.loading = false;
                    }

                }else{
                    this.loading = false;
                    this.form = this.dataList[0];//默认显示第一个
                    this.fixedForm();
                }
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
        qiehuanData(item){
            this.form = item;
            this.fixedForm();
        },
        fixedForm(){
            this.statusItem = {};
            if(this.form.status){
                this.statusItem = this.baseData['faw_pm_miles_status'].find(single => single.id == this.form.status);
                if( this.statusItem){
                    if( this.statusItem.id === 'faw_pm_miles_status_go'){
                        this.form.color = 'green';
                    }else if(this.statusItem.id === 'faw_pm_miles_status_no_go'){
                        this.form.color = 'red';
                    }else if( this.statusItem.id === 'faw_pm_miles_status_redirect'){
                        this.form.color = 'yellow';
                    }
                }
            }else if(this.form.planDate){

                this.planDateChange(this.form.planDate)
            }
            if(this.form.gaDay || this.form.gaDay == '0'){
                this.gaInput(this.form.gaDay);
            }
            this.$refs['linkMiles'].inputValue =  this.form.parentName;
            this.deliverList = [];
            this.assessList = [];
            if(this.form.assessList.length > 0){
                this.pushDataForAssessList();
            }
            if(this.form.delivList.length > 0){
                this.pushDataForDeliverList();
            }
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
        linkMilesBlur(){
            setTimeout(()=>{
                this.$refs['linkMiles'].inputValue = this.form.parentName;
            },500)
        },
        linkMilesChange(value){
            this.form.parentId = value.length > 0 ? value[value.length-1] : -1;
            if(this.form.parentId == this.form.id){
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
        goMilesSetting(){
            this.$router.push({name:"milesSettingInProjectCard"})
        },
        onSubmit(){
            if(!this.form.name){
                return  EcoMessageBox.alert('里程碑名称 不能为空','提示')
            }
            if(!this.form.planDate){
                return  EcoMessageBox.alert('计划完成时间 不能为空','提示')
            }
            if(this.form.status && !this.form.actualDate){
                return  EcoMessageBox.alert('实际完成时间 不能为空','提示')
            }
            for(let item of this.assessList){
                if(!item.dimension){
                    return  EcoMessageBox.alert('评审维度 不能为空','提示')
                }else{
                    this.form.assessList = [];
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
            updateMiles(this.form).then((res)=>{
                this.loading = false;
                this.$message({
                    message: '修改成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
            }).catch(e=>{
                this.loading = false;
            });
        },
        statusChange(item){
            this.form.status = item.id;
            if(item.id === 'faw_pm_miles_status_go'){
                this.form.color = 'green';
            }else if(item.id === 'faw_pm_miles_status_no_go'){
                this.form.color = 'red';
            }else if(item.id === 'faw_pm_miles_status_redirect'){
                this.form.color = 'yellow';
            }else{
                this.form.color = '';
            }
        },
        gaInput(value){
            this.form.planDate = EcoDate.formatDateDefault(new Date(EcoDate.convertDateFromString(this.projectInfo.planGa).getTime() + value*24*60*60*1000));
        },
        planDateChange(value){
            let planDate = EcoDate.convertDateFromString(value);
            if(planDate.getTime() - Date.now() < 0){
                this.form.color = 'red';
            }else if(planDate.getTime() - Date.now() <= 7*24*60*60*1000){
                this.form.color = 'yellow';
            }
            this.form.gaDay = (planDate.getTime() - EcoDate.convertDateFromString(this.projectInfo.planGa).getTime())/(24*60*60*1000)
        }


    },
    watch: {

    }
}

</script>
<style>
.milesInfo{
    background: #fff;
    height:100%;
}
.milesInfo .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.milesInfo .toolBtn{
    margin:0 10px;
}
.milesInfo .graph{
    height: 100%;
    overflow-y:hidden;
    overflow-x:auto;
    background-color: #fafafa;
    white-space: nowrap;
}
.milesInfo .graph .item{
    display: inline-block;
    height: 60px;
    width: 100px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    margin: 20px 0;
    background: #fff;
    color:#595959;
    font-size: 12px;
    position: relative;
    margin-left: 26px;
}
.milesInfo .graph .item:first-of-type{
    margin-left: 20px;
}
.milesInfo .graph .item:last-of-type{
    margin-right: 20px;
}
.milesInfo .graph .item span{
    display: block;
    line-height: 30px;
    height: 30px;
}
.milesInfo .graph .item:not(:first-of-type):before{
    content: "";
    border-top: 1px solid #ddd;
    width: 26px;
    position: absolute;
    left: -27px;
    top: 30px;
}
.milesInfo .graph .item.green{
    background-color: green;
    color:#fff;
}
.milesInfo .graph .item.yellow{
    background-color: yellow;
}
.milesInfo .graph .item.red{
    background-color: red;
    color:#fff;
}
.milesInfo .graph .item.active{
    box-shadow: 0 4px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #003b90;
}
.milesInfo .main{
    min-width: 800px;
    width: 60%;
    margin: 0 auto;
}
.milesInfo .main .updateForm{
    background-color: #f5f5f5;
    padding: 0 40px;
    padding-top: 20px;
}
.milesInfo .updateForm .el-form-item{
    width: 48%;
}
.milesInfo .updateForm .el-form-item .el-form-item__content{
    width: calc(100% - 120px);
}
.milesInfo .updateForm .allItem{
    width: 98%;
}
.milesInfo .updateForm .pinshenItem .el-form-item__content{
    width:100%;
}
.pinshen{
    padding-left: 20px;
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
    padding: 0px 10px;
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
    height: 33px;
}
.pinshen textarea{
    font-family: "PingFang SC","Lantinghei SC","Microsoft YaHei","HanHei SC","Helvetica Neue","Open Sans",Arial,"Hiragino Sans GB","\5FAE\8F6F\96C5\9ED1",STHeiti,"WenQuanYi Micro Hei",SimSun,sans-serif;
}
.pinshen .header{
    background: #e8e8e8;
}
.pinshen .icon{
    color: #003b90;
}
.pinshenItem .btn-line {
	border: 1px solid #ddd;
	background-color: #fff;
	color: #003b90;
	cursor: pointer;
    text-align: center;
    border-radius: 4px;
	margin: 10px 0px;
}
.btnGroup{
    padding-left: 20px;
    text-align: center;
}
</style>
