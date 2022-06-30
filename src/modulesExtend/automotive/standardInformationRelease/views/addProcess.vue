<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="接收人" prop="title" :rules="[{ required: true, message: '请填写接收人'}]">
            <!-- <el-input v-model="form.recipientId"></el-input> -->
            <!-- <tag-select class="el-customDiv" placeholder="选择人员" style="vertical-align: top;border: 1px solid #dcdfe6;" :initDataStr="form.recipientStr"
                :initOptions="{selectNum:2,selectType:'Dept'}" @callBack="selectRegulationLeader">
            </tag-select> -->
            <tag-select
              class="el-customDiv"
              style="vertical-align: top;border: 1px solid #dcdfe6;"
              :initDataArray="form.recipientList"
              :initOptions="options"
              @callBack="selectRegulationLeader" >
            </tag-select>
          </el-form-item>
          <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '标题不能为空'}]">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          </el-form>

        <el-form :inline="true" :model="form" label-width="120px">
          <el-form-item label="类别" required>
            <el-select v-model="form.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否置顶" required>
            <el-select v-model="form.topFlag" placeholder="请选择">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否可留言" required>
            <el-select v-model="form.canMessageFlag" placeholder="请选择">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可留言时间" required>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.allowMessageStart" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.allowMessageEnd" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <el-form :model="form" label-width="120px">
          <el-form-item label="内容" required>
            <ckeditor ref="articleEditor" :content="form.content" height='200px' style='margin-bottom:23px'></ckeditor>
          </el-form-item>


          <!-- <el-form-item label="" v-if="form.id" style="margin-top:10px;">
            <ecoFileUploadSingle  style="max-width:500px" modular="modularPrint" limitDocFiles :modularInnerId="form.id"  ref="ecoFileUploadRef" ></ecoFileUploadSingle>
          </el-form-item> -->

           <el-form-item label="" prop="name">
                  <ecoFileUploadChunk
                    style="max-width:500px"
                    :modular="module"
                    :modularInnerId="form.id"
                    ref="ecoFileUploadRef"
                    :btnFlag=true
                  ></ecoFileUploadChunk>
            </el-form-item>


          <el-form-item label="" style="text-align:right">
              <el-button type="primary" @click.native="submitHandle">
                提交
              </el-button>
              <el-button type="primary" @click.native="save">
                保存
              </el-button>
          </el-form-item>
        </el-form>
      </ecoContent>
      <!-- <div class="kn-main">

      </div> -->
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ckeditor from './components/ckeditor.vue'
// import EcoOrgPick from '@/components/orgPick/main.js'
import {EcoUtil} from '@/components/util/main.js'
import { getGroupList,sendProcess,getItemFetchId,draftProcess,getExamineView } from '../service/service.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'

export default{
  name:'commonAdd',
  components:{
    ecoLoading,
    ecoContent,
    ckeditor,
    ecoFileUploadChunk,
    tagSelect
  },
  data(){
    return {
      form:{
        recipientId: [], //人员/部门 id
        title:'', //标题
        content:'',  //内容
        type:'',  //类型
        topFlag:'', //是否指定
        canMessageFlag:'', //是否留言
        allowMessageStart:'', //留言开始日期
        allowMessageEnd:'', //留言结束日期
        id:null, //需要生成的id
        recipientList: null
      },
      module:'addProcess',
      typeData: [],
      options:{
          selectNum:0,
          maxOrgPathLevel:2,
          selectType:'user-dept-usergroup-role'
      },
    }
  },
  created() {
    this.form.id = this.$route.params.id
    if(this.form.id != '1') {
      getExamineView(this.form.id).then(res => {
        var dataStr = []
        res.data.standardMessageEntity.recipientList.forEach((item,index) => {
          dataStr.push({type:item.type,orgId:item.orgId,linkId:item.linkId})
        });
        this.form.recipientList = dataStr
        this.form.title = res.data.standardMessageEntity ? res.data.standardMessageEntity.title :null
        this.form.content = res.data.standardMessageEntity ? res.data.standardMessageEntity.content :null
        this.form.type = res.data.standardMessageEntity ? res.data.standardMessageEntity.type :null
        this.form.topFlag = res.data.standardMessageEntity ? res.data.standardMessageEntity.topFlag :null
        this.form.canMessageFlag = res.data.standardMessageEntity ? res.data.standardMessageEntity.canMessageFlag :null
        this.form.allowMessageStart = res.data.standardMessageEntity ? res.data.standardMessageEntity.allowMessageStart :null
        this.form.allowMessageEnd = res.data.standardMessageEntity ? res.data.standardMessageEntity.allowMessageEnd :null
      })
    }
    this.getTypeData()
  },
  mounted(){
    this.getItemFetchId()
  },
  methods: {
    //生成id
    getItemFetchId(){
      if(this.form.id == '1') {
        getItemFetchId().then(res => {
          this.form.id = res.data
        })
      }
    },
    selectRegulationLeader(data) {
        //责任人
        if (!data.id && data.itemArray.length === 0) {
            //人员删除
            this.form.recipientId = '';
        } else {
            this.form.recipientList = data.itemArray.map(x=> {
              return {
                type: x.type,
                orgId: x.orgId,
                linkId: x.orgId,
                standardMessageId: ''
              }
            })
            data.itemArray.forEach(x => {
              if (x.type == "DEPT") {
                this.form.recipientId.push(x.linkId)
              } else if (x.type == "PERSONNEL") {
                var personId = x.orgId.split('.')
                this.form.recipientId.push(personId[1])
              }
            })
            this.form.recipientId = this.form.recipientId.toString()
        }
    },
    //获取类型数据
    getTypeData() {
      getGroupList().then(res => {
        this.typeData = res.data
      })
    },
    save(){
      this.form.content = this.$refs.articleEditor.getCkeditorData();
      draftProcess(this.form).then(res => {
        this.$message.success('保存草稿成功')
        let doObj = {}
        doObj.action = 'addProcess';
        doObj.data = []
        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
      })
    },
    //提交
    submitHandle() {
      this.form.content = this.$refs.articleEditor.getCkeditorData();
      sendProcess(this.form).then(res => {
        this.$message.success('发布成功')
        let doObj = {}
        doObj.action = 'addProcess';
        doObj.data = []
        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
      })
    }
  },
  watch: {

  }
}
</script>
<style>
  .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

</style>
