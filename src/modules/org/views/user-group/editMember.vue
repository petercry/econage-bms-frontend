<template>
    <div class="editMember">
            <span style="line-height:26px;color:#999;font-size:12px;">选择成员</span>
            <el-button type="primary" @click.native="save" style="float: right;">保存<i class="el-icon-check el-icon--right"></i></el-button>
            
            <tag-select 
                      style="width:100%;vertical-align:text-top;margin-top:10px;" 
                      :initDataArray="content" 
                      :initOptions="options" 
                      @callBack="cbMember" >
            </tag-select>
            
            <!-- <div class="display-input" style="margin-top:12px;min-height: 98px;" @click="openOrgChooser">
              <el-tag
                v-for="(item, index) in content" 
                :key="index"
                closable
                type="info"
                @close="close(index)">
                {{item.orgPath}}<span v-if="item.role">({{item.roleName}})</span>
              </el-tag>
            </div> -->
    </div>
</template>
<script>



import {getGroupMemberConfig,saveGroupMember} from '../../service/service.js'
import EcoUtil from '@/components/util/main.js'
import EcoOrgPick from '@/components/orgPick/main.js'
import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'

export default{
  name:'groupMember',
  components:{
        tagSelect
  },
  data(){
    return {
      content:[],
      options:{
          selectNum:0,
          maxOrgPathLevel:2,
          selectType:'user-dept'
      }
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    close(index){
        this.content.splice(index,1);
        this.$forceUpdate();
    },
    getData(){
      var that = this;
      let id = this.$route.params.id; 
      getGroupMemberConfig(id).then((response)=>{
          that.content = response.data;
      }).catch((error)=>{
      });
    },

    cbMember(data){
        this.content = data.itemArray;
    },

    save(){
        let id = this.$route.params.id; 
        saveGroupMember(id,this.content).then((res)=>{
              this.$message({type: 'success',message: '保存成功！'});
              let doObj = {}
              doObj.action = 'groupEditCallBack';
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
        }).catch((error)=>{
              this.$message({type: 'error',message: '保存失败！'});
        })
    }
  },
  watch: {

  }
}
</script>
<style scope>

.editMember .el-customDiv {
	min-height: 30px;
	line-height: 30px;
	-webkit-appearance: none;
	background-color: #fff;
	background-image: none;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	color: #606266;
	display: inline-block;
	font-size: inherit;
	outline: 0;
	padding: 0 5px;
	position: relative;
	-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
	transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
	width: 100%;
}
.editMember .el-customDiv {
	  height: auto;
    min-height: 330px;
    line-height: 30px;
}
</style>
