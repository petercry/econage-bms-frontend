<template>
  <div class="kn-mainTable">
    <el-table
      ref="fileTable"
      :data="knowledgeList"
      border
      style="width: 100%"
      :header-cell-style="{color:'#000',fontWeight:700}"
      :cell-style="{padding:'4px 0'}"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="类型"
        width="80"
      >
        <template slot-scope="scope">
          <div>
            <img
              style="vertical-align: middle;"
              :src="scope.row.fileTypeImage&&typeImgList[scope.row.fileTypeImage.replace(/([\s\S]+)\.[\s\S]*/g,'$1')]"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        show-overflow-tooltip
      > <template slot-scope="scope">
          <span
            style="cursor:pointer"
            @click="goDetail(scope.row)"
          >{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createUser"
        width="140"
        label="创建人"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        width="180"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        width="120"
        label="操作"
        v-if="showTool"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click.native="fileOrfolder(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
        <el-row >
          <el-col :span="24" style="text-align:right">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="info.page"
                  :page-sizes="[10,30,50,100]"
                  :page-size="info.rows"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="info.total" style="margin-right:20px">
                </el-pagination>
          </el-col>
      </el-row>
          <form name="docviewform"  method="get" >
          <input type="hidden" name="fileHeaderId"/>
          <input type="hidden" name="fileName"/>
          <input type="hidden" name="fileHeaderIds"/>
          <input type="hidden" name="expectedName"/>
        </form>
        <iframe name="docviewIframe" style="display:none"></iframe>
    </eco-content>
  </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import { sysEnv } from '../../../config/env.js'
import {EcoFile} from '@/components/file/main.js'
import { EcoUtil } from '@/components/util/main.js'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { getKnowledgeLibList,addReadRecord,getFileDetail } from '@/modules/knowledge/api/knowledge.js'
export default {
  name: 'mainTable',
  components: {
    ecoContent,
  },
  data() {
    return {
      baseId: '',
      parentId: '',
      knowledgeList: [],
      info: {
        page: 1,
        rows: 10,
        total:0
      },
      treeClickId:''
    }
  },
  props:{
    showTool:{
      type:Boolean,
      default:true
    },
    fullScreen:{
      type:Boolean,
      default:false
    },
  },
  computed: {
    ...mapState(['typeImgList', 'fileHeaderNode', 'fileTreeNode', 'activeId'])
  },
  created() {
    this.baseId = this.$route.params.id;
    this.treeClickId=this.activeId;
    let checkNode = this.activeId;
    if (checkNode == '-1') {
      this.parentId = "";
    } else {
      this.parentId = this.checkNode;
    }
  },
  mounted() {
    this.SET_FILETABLENODE(this.$refs.fileTable);
    this.getData(this.baseId, this.parentId, this.info);
  },
  methods: {
    ...mapMutations(['SET_FILETABLENODE', 'SET_FILEMAINTABLENODE', 'SET_ACTIVEID']),
    getData(baseId, parentId, info) {
      getKnowledgeLibList(baseId, parentId, info).then(res => {
        this.knowledgeList = res.rows;
        this.info.total=res.total;
        this.treeClickId=parentId
      })
    },
    getFileInfo(id){
      getFileDetail(id).then(res=>{
        const {fileHeaderId,name}=res.entry
        EcoFile.openFileHeaderByView(fileHeaderId,name)
      })
    },
    goDetail({ id, type, name }) {
      // 单独打开
      if(this.fullScreen){
          this.getFileInfo(id)
      }else {
          this.addReadRecord(id)
          if (type == 'FILE') {
            if (sysEnv !== 1) {
              this.$router.push({ name: 'fileCard', params: { id } })
            } else {
              //  打开tab
              let tabObj = {};
              tabObj.desc = name;
              let goPage = "knowledge/index.html#/fileCard" + '/' + id;
              tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'fileCard',href_link:'" + goPage + "'}";
              tabObj.reload = true;
              tabObj.clearIframe = true;
              EcoUtil.getSysvm().doTab(tabObj);
            }
          } else {
            //  去下一层
            this.SET_ACTIVEID(id)
            this.$emit('callBack', 'expandedFolder', id);
      }
      }
    },
    fileOrfolder({id,type}) {
      if (type == "FOLDER") {
        if (sysEnv !== 1) {
          this.$router.push({ name: 'folderEdit',params:{id:id} })
        } else {
          let url = '/knowledge/index.html#/folderEdit'+'/'+id;
          EcoUtil.getSysvm().openDialog('编辑文件夹', url, 500, 600, '12vh');
        }
      }else{
        if (sysEnv !== 1) {
          this.$router.push({ name: 'fileEdit',params:{id }})
        } else {
          let url = '/knowledge/index.html#/fileEdit/'+id;
          EcoUtil.getSysvm().openDialog('编辑文件', url, 600, 600, '12vh');
        }
      }
    },

    // 添加阅读记录
    addReadRecord(id){
      addReadRecord(id).then(res=>{
      })
    },
    handleSizeChange(val){
      this.info.rows=val;
      this.getData(this.baseId,this.treeClickId,this.info);
    },
    handleCurrentChange(val){
     this.info.page=val;
     this.getData(this.baseId, this.treeClickId,this.info)
    }

  },
}
</script>

<style scoped >
/* .el-table /deep/ th.gutter {
  display: table-cell !important;
}

.el-table /deep/ colgroup.gutter {
  display: table-cell !important;
} */
</style>
