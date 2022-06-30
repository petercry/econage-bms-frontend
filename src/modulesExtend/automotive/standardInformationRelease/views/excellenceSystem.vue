<template>
  <div class="layoutOutDiv confirm">
    <div class="layoutInnerAbsoluteDiv">
      <eco-content
        top="0px"
        height="55px"
        type="tool"
        style="border-bottom: 1px solid #ddd; background-color: #fff"
      >
        <el-row style="padding: 12px 20px; background-color: #fff">
          <el-col :span="12">
            <eco-tool-title
              style="font-weight: 700; line-height: 30px"
              :title="'卓越体系'"
            ></eco-tool-title>
          </el-col>
          <el-col :span="12">
            <div style="float: right; margin-right: 20px; line-height: 30px">
              <el-button type="primary" class="export" @click.stop="addNode">新增</el-button>
              <el-button type="primary" class="export" @click.stop="editNode">编辑</el-button>
              <el-button type="danger" class="export" @click.stop="delNode">删除</el-button>
              <!-- <el-button type="primary" class="export">全部提交</el-button>
              <el-button type="primary" class="export">操作记录</el-button> -->
            </div>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="56px" bottom="0px" type="tool">
        <div class="contentLeft">
          <el-tree
            :props="defaultProps"
            highlight-current
            node-key="id"
            :load="loadNode"
            @node-click="handleNodeClick"
            lazy
            ref="tree"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div class="type-name">{{ node.label }}</div>
              <!-- <div style="font-size:12px;line-height:23px">
                <span class="addBtn" @click.stop="addNode(data)">新增</span>
                <span class="delBtn" @click.stop="delNode(data)">删除</span>
              </div> -->
            </div>
          </el-tree>
        </div>
        <div class="contentRight">
          <el-col style="margin-top:40px">
            <el-row span="24" class="flex">
              <span class="leftText">上级节点名称</span>
              <span class="inputBox">
                <el-input disabled v-model="params.parentName" size="mini" style="width:100%"></el-input>
                <!-- <el-input disabled v-model="params.parentName" size="mini" style="width:100%"></el-input> -->
              </span>
            </el-row>
            <el-row span="24" class="flex">
              <span class="leftText">编码</span>
              <span class="inputBox">
                <el-input :disabled='!buttonStatus' v-model="params.code" size="mini"></el-input>
                <!-- <el-input v-else disabled v-model="params.code" size="mini"></el-input> -->
              </span>
            </el-row>
            <el-row span="24" class="flex">
              <span class="leftText">名称</span>
              <span class="inputBox">
                <el-input :disabled='!buttonStatus' v-model="params.name" size="mini"></el-input>
                <!-- <el-input v-else disabled v-model="params.name" size="mini"></el-input> -->
              </span>
            </el-row>
            <el-row span="24" class="flex">
              <span class="leftText">类别</span>
              <span class="inputBox">
                <el-select v-model="params.category" v-if="buttonStatus">
                  <el-option v-for="item in kvMap.zytx_lb" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="params.category" v-else disabled>
                  <el-option v-for="item in kvMap.zytx_lb" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <!-- <el-input v-if="buttonStatus" v-model="params.category" size="mini"></el-input>
                <el-input v-else disabled v-model="params.category" size="mini"></el-input> -->
              </span>
            </el-row>
            <el-row span="24" class="flex">
              <span class="leftText">关联部门</span>
              <span class="inputBox">
                <tag-select
                    :disabled='!buttonStatus'
                    style="width:100%;"
                    :placeholder="'请选择机构'"
                    :initDataStr="params.relDeptId"
                    :initOptions="{selectNum:0,selectType:'dept'}"
                    @callBack="tagSelectCB" >
                </tag-select>
                <!-- <el-input :disabled='!buttonStatus' v-model="params.relDeptId" size="mini"></el-input> -->
                <!-- <el-input v-else disabled v-model="params.relDeptId" size="mini"></el-input> -->
              </span>
            </el-row>
            <el-row span="24" class="btnBox" v-show="buttonStatus">
              <el-button type="primary" @click="saveCase">保存</el-button>
              <el-button type="submit">取消</el-button>
            </el-row>
          </el-col>
        </div>
      </eco-content>
    </div>
  </div>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
import { getExcellenceTree,getExcellenceTable,delExcellenceTable,addExcellenceTable,updataExcellenceTable } from "../service/service.js";
import {EcoKVUtil} from '@/components/util/kv.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'

export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        label(data, node) {
          return data.name || data.text;
        },
        isLeaf(data, node) {
          return !data.isMore;
        },
      },
      params:{
        parentId:null,
        parentName:null,
        code: null,
        name: null,
        category: null,
        relDeptName:null,
        relDeptId:null
      },
      buttonStatus: false,
      kvMap: {
          'zytx_lb': []
      },
      rootResolve:null,
      rootNode:null,
      currentNode: null, //当前选中节点
      addStatus: false,  //false为编辑 true为新增
    };
  },
  components: {
    ecoContent,
    ecoToolTitle,
    tagSelect
  },
  created() {
  },
  mounted() {
   EcoKVUtil.getEnumSelectEnabledFunc(this.kvMap);
  },
  methods: {
    tagSelectCB(data){
        this.params.relDeptId = data.itemStr;
    },
    loadNode(node, resolve) {
      this.rootNode = node;//保留根节点
      this.rootResolve = resolve;//保留根节点方法
      this.rootNode.childNodes = [];
      if(node.level == 0){
          getExcellenceTree(-1).then((response) =>{
            this.treeData = response.data.rows.map(x => {
              return {
                ...x,
                isMore: x.subTotal > 0 ? true : false
              }
            });
            resolve(this.treeData);
          })
      }else{
        getExcellenceTree(node.data.id).then((response) => {
          let dataList = response.data.rows.map(x => {
            return {
              ...x,
              isMore: x.subTotal > 0 ? true : false
            }
          });
          setTimeout(() => {
            resolve(dataList);
          }, 200);
        })
      }
    },
    reloadNode(){
        this.loadNode(this.rootNode,this.rootResolve)
    },
    saveCase() {
      if(this.addStatus) {
        addExcellenceTable(this.params).then(res => {
          this.$message.success("保存成功")
          this.addStatus = false
          this.reloadNode()
        })
      } else {
        updataExcellenceTable(this.params).then(res => {
          this.$message.success("保存成功")
          this.editStatus = false
          this.reloadNode()
        })
      }

    },
    editNode() {
      this.buttonStatus = true
      this.params.id = this.currentNode.id
      this.params.parentId = this.currentNode.parentId
      // updataExcellenceTable(this.params).then(res => {
      //   this.$message.success("保存成功")
      // })
    },
    addNode(data) {
      this.addStatus = true
      this.params.id = null
      this.buttonStatus = true
      this.params.name = null
      this.params.code = null
      this.params.category = null
      this.params.relDeptName = null
      this.params.parentName = this.currentNode ? this.currentNode.name : ' '
      this.params.parentId = this.currentNode ? this.currentNode.id : -1
      // getExcellenceTable(data.id).then(res => {
      //   this.params.parentName = res.data.parentName
      //   this.params.parentId = res.data.parentId
      // })
    },
    delNode() {
      // console.log(this.$refs['tree'])
      delExcellenceTable(this.currentNode.id).then(res => {
        this.$refs.tree.remove(this.currentNode.id);
        this.setCurrentHighlight(this.currentNode.parentId)
        this.$message.success("删除成功")
      })
    },
    // 设置当前选中高亮
    setCurrentHighlight (id) {
        this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(id);
        });
    },
    handleNodeClick(data) {
      this.currentNode = data
      this.buttonStatus = false
      getExcellenceTable(data.id).then(res => {
        this.params.parentName = res.data.parentName
        this.params.code = res.data.code
        this.params.name = res.data.name
        this.params.category = res.data.category
        this.params.relDeptId = res.data.relDeptId
      })
    },
  },
};
</script>
<style scoped>
.export {
  /* color: #409eff;
  border: 1px solid #409eff; */
}
.contentLeft {
  background-color: white;
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: 20px;
  width: 300px;
}
.contentRight {
  background-color: white;
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: 335px;
  right: 20px;
}
.custom-tree-node {
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
.delBtn {
  color: #409eff;
  margin-right: 10px;
}
.addBtn {
  color: #409eff;
  margin-right: 10px;
}
.flex {
  display: flex;
  align-content: center;
  padding: 25px 0;
  position: relative;
  left: 10px;
  right: 10px;
}
.inputBox{
  position: absolute;
  right: 150px;
  left: 190PX;
}
.leftText {
  position: absolute;
  left: 50px;
  font-size: 15px;
}
.btnBox {
  position: absolute;
  bottom: 150px;
  left: 25%;
  right: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-select {
  width: 100% !important;
}
</style>
