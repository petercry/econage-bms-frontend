<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue" style="background-color:#f5f5f5">
        <div class="roleGroupMain">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="border-bottom:1px solid #ddd;overflow:hidden;">
                <el-row style="padding:12px 10px;background-color:#fff;">
                    <el-col :span="8" >
                        <eco-tool-title style="line-height: 34px;" :title="'角色组（'+total+'）'"></eco-tool-title>
                    </el-col>
                    <el-col :span="16">
                        <el-button plain class="plainBtn toolBtn" @click.native="addRoleGroup" ><i class="icon el-icon-circle-plus-outline"></i>&nbsp;新增角色组</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content bottom="0" top="61px" ref="content" style="padding:10px 15px;">
                <el-table
                    :data="dataList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    class="ecoList"
                    height="100%"
                    border
                    @header-dragend="changeColWidth"
                    stripe
                >
                    <el-table-column
                        label="操作"
                        width="100"
                        min-width="100"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope" >
                            <span class="pointerClass"  @click="deleteRoleGroup(scope.row.id)" style="color:#F56C6C;">删除</span>

                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sign"
                        label="标识"
                        width='200'
                        min-width="200"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="comments"
                        label="备注"
                        width="220"
                        min-width="220"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                </el-table>

            </eco-content>
        </div>
    </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import {sysEnv} from '../../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {getRoleGroupList,deleteRoleGroup} from '../../../api/roleGroup.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
export default {
  name:'baseData',
  components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
  },
  data() {
    return {
       dataList:[],
       total:0
    }
  },
  created() {
      this.callAction();
  },
  activated(){

  },

  mounted(){
      this.getListDataFunc();
  },

  computed: {

  },

  methods: {
    callAction(){
        let this_ = this;
        window.tabClickFunc = function(){
            this_.getListDataFunc();
        }
        let callBackDialogFunc = function(obj){
            if(obj && (obj.action == 'addRoleGroup') ){
                this_.$message({
                    message: '添加成功！',
                    showClose: true,
                    duration:2000,
                    type: 'success'
                });
                this_.getListDataFunc();
            }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'projectRoleGroup');
    },
    addRoleGroup(){
        if(sysEnv == 0){
            let _width = '600';
            let _height = '500';
            let url = window.location.origin + "/#" +'/addRoleGroupForm';
            EcoUtil.getSysvm().openDialog('新增角色组',url,_width,_height,'15vh');
        }else{
            let _width = '600';
            let _height = '500';
            let url = '/projectManager/index.html#/addRoleGroupForm';
            EcoUtil.getSysvm().openDialog('新增角色组',url,_width,_height,'15vh');
        }
    },
    getListDataFunc(){
        getRoleGroupList().then(res => {
            this.dataList = res.rows;
            this.total = res.total;
        })
    },
    deleteRoleGroup(id){
        var that  = this;
        let confirmYesFunc = function(){

           that.deleteRoleGroupFunc(id);
        }
        let options = {
            type: 'warning',
            lockScroll:false
        }
        EcoMessageBox.confirm('确定要删除吗?','提示',options,confirmYesFunc);
    },
    deleteRoleGroupFunc(id){
        deleteRoleGroup(id).then(res =>{
            this.$message({
                message: '删除成功',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'success'
            });
            this.getListDataFunc();
        })
    },
    changeColWidth(nw,ow,col,evt){
        if(nw < col.minWidth){
            col.width = col.minWidth;
        }
    },
  },
  watch:{

  },

};
</script>

<style scoped>
  .roleGroupMain{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.roleGroupMain .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
    float: right;
}
</style>
