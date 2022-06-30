<template>
  <div class="knowLibEdit">
    <!-- 编辑知识库 -->
    <div style="height:60px;marginBottom:10px">
      <div style="float:left;height:60px;width:40px;line-height:60px"><i
          class="el-icon-folder"
          style="color:#26a3da;fontWeight:700;fontSize:30px;verticalAlign:middle"
        ></i></div>
      <div style="marginLeft:31px;float: left;">
        <p style="marginBottom:6px"><span style="color:red;">*</span>名称</p>
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item prop="name">
            <el-input
              v-model="form.name"
              style="width:300px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <el-form
        label-width="70px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="简介">
          <el-input
            v-model="form.summary"
            type="textarea"
            style="width:300px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="全员可见">
          <el-switch
            v-model="form.visibleToAll"
            active-color=""
            inactive-color="#ff4949"
          >
          </el-switch>
          </el-input>
        </el-form-item>
        <el-form-item
          label="查看用户"
          v-if="!form.visibleToAll"
        >
          <tag-select
            style="width: 300px;vertical-align: top;"
            :initDataStr="exposeMembers"
            ref="tagSelect"
            :initOptions="{selectNum:0,selectType:'user-dept'}"
            @callBack="exposeMember"
          >
          </tag-select>
        </el-form-item>
        <el-form-item
          label="隐藏用户"
          v-else
        >
          <tag-select
            style="width: 300px;vertical-align: top;"
            :initDataStr="hideMembers"
            ref="tagSelect"
            :initOptions="{selectNum:0,selectType:'user-dept' }"
            @callBack="hideMember"
          >
          </tag-select>
        </el-form-item>
        <el-form-item label="管理用户">
          <tag-select
            style="width: 300px;vertical-align: top;"
            :initDataStr="manageMembers"
            ref="tagSelect"
            :initOptions="{selectNum:0,selectType:'user-dept'}"
            @callBack="manageMember"
          >
          </tag-select>
        </el-form-item>
        <el-form-item label="序号">
          <el-input
            v-model="form.order"
            style="width:300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-col align="center">
        <el-button @click="cancelFunc">取消</el-button>
        <el-button
          type="primary"
          @click="createKnowledgeLib"
        >确定</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import { updateKnowledgeLib, getKnowledgeLibDetail } from '@/modules/knowledge/api/knowledge.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import EcoUtil from '@/components/util/main.js'
import { LogLevel } from 'dingtalk-jsapi/lib/sdk'
export default {
  name: 'knowLibEdit',
  components: {
    tagSelect
  },
  data() {
    return {
      form: {
        id:'',
        name: '',
        icon: '',
        summary: '',
        visibleToAll: false,
        exposeMembers: [],
        hideMembers: [],
        manageMembers: []
      },
      exposeMembers: '',
      hideMembers: '',
      manageMembers: '',
      id: '',
      rules: {
        name: [
          { required: true, message: '请输入知识库名称', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.form.id=this.$route.params.id
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取知识库信息
    getInfo() {
      getKnowledgeLibDetail(this.id).then(res => {
        const { name, summary, visibleToAll, exposeMembers, hideMembers, manageMembers, order } = res
        this.form.name = name
        this.form.summary = summary
        this.form.visibleToAll = visibleToAll
        this.form.order = order
        this.form.exposeMembers = exposeMembers
        this.form.hideMembers = hideMembers
        this.form.manageMembers = manageMembers
        let exposeArr = []
        let hideArr = []
        let manageArr = []
        this.handleSelect(exposeMembers, exposeArr)
        this.handleSelect(hideMembers, hideArr)
        this.handleSelect(manageMembers, manageArr)
        let exposeStr = exposeArr.join('|')
        let hideStr = hideArr.join('|')
        let manageStr = manageArr.join('|')
        this.exposeMembers = exposeStr
        this.hideMembers = hideStr
        this.manageMembers = manageStr
      })
    },
    // 选人数据处理
    handleSelect(arrType, arrAimType) {
      arrType.forEach(item => {
        let obj = {}
        obj.type = item.type
        obj.orgId = item.orgId
        obj.linkId = item.linkId
        arrAimType.push(JSON.stringify(obj))
      });
    },
    // 查看用户
    exposeMember(data) {
      if (data.itemArray.length > 0) {
        // let linkIds = [];
        // for (let i = 0; i < data.itemArray.length; i++) {
        //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        // }
        // this.form.exposeMembers = linkIds;
        this.form.exposeMembers = data.itemArray;
      } else {
        this.exposeMembers = ''
        this.form.exposeMembers = []
      }
    },
    // 隐藏用户
    hideMember(data) {
      if (data.itemArray.length > 0) {
        // let linkIds = [];
        // for (let i = 0; i < data.itemArray.length; i++) {
        //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        // }
        // this.form.hideMembers = linkIds;
        this.form.hideMembers = data.itemArray;
      } else {
        this.hideMembers = ''
        this.form.hideMembers = []
      }
    },
    // 管理用户
    manageMember(data) {
      if (data.itemArray.length > 0) {
        // let linkIds = [];
        // for (let i = 0; i < data.itemArray.length; i++) {
        //   linkIds.push({ 'memberId': data.itemArray[i].linkId });
        // }
        // this.form.manageMembers = linkIds;
        this.form.manageMembers = data.itemArray;
      } else {
        this.manageMembers = ''
        this.form.manageMembers = []
      }
    },
    cancelFunc() {
      EcoUtil.getSysvm().closeDialog();
    },
    createKnowledgeLib() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 创建
          updateKnowledgeLib(this.form).then(res => {
            this.$message({
              duration: 2000,
              type: 'success',
              message: '更新成功',
              onClose: () => {
                let doObj = {};
                doObj.action = 'editKnowledgeLib';
                doObj.data = {};
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }
            })
          })
        } else {
          return false;
        }
      });

    }
  },
}
</script>

<style scoped>
.knowLibEdit {
  width: 400px;
  padding: 20px;
}
</style>
