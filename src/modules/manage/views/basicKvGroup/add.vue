<template>
  <div class="">
    <div class="kn-header" >
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <div>
        添加基础数据分组
        <!-- <ecoActionBtn :ecoActionBtnFunc="addBasicKvGroup">
          <i slot="icon" class="el-icon-circle-check-outline"/>
          保存
        </ecoActionBtn> -->
      </div>
    </div>
    <div class="page-main">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="ID">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[
            { required: true, message: '名称不能为空'}
          ]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="国际化编码">
          <el-input v-model="form.i18nKey"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click.native="addBasicKvGroup">
            保存
            <i class="el-icon-check el-icon--right"></i>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ecoActionBtn from '@/modules/menu/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import EcoUtil from '@/components/util/main.js'
import {addBasicKvGroup} from '@/modules/manage/service/service.js'
import { mapState } from 'vuex';
export default {
  name:'editSysMenu',
  components:{
    ecoActionBtn,
    ecoLoading
  },
  props: {
 
  },
  data() {
    return {
      form:{
        name:'',   //菜单名称
        i18nKey:'', //国际化key
        parentId:'', //上级节点
        id:'', //ID
        description:'',    //备注
        order:'',    //序号
      },
      rules:{
        
      }
    };
  },
  mounted(){
    this.$nextTick(()=>{
      this.init();
    })
  },
  created(){
  },
  computed:{
    ...mapState(['sysTree'])
  },
  methods:{
    init(){
      this.form.type='';
      let treeSelected = this.sysTree&&this.sysTree.getCurrentNode();
      this.form.parentId=treeSelected?treeSelected.id:-1;
      this.form.name='';
      this.form.component='';
      this.form.desc='';
      this.form.iconCls='';
      this.form.i18nKey='';
      this.form.href='';
    },
    addBasicKvGroup(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            addBasicKvGroup(this.form).then((res)=>{
              if (res.data&&res.data.id){
                this.$message({type: 'success',message: '添加成功！'});
                let obj =res.data;
                if (obj){
                  if (obj.parentId=='-1'){
                    this.sysTree.$parent.$parent.$parent.getBasicKvGroupRoot()
                  }else{
                    obj.isLeaf =true;
                    let parantNode = this.sysTree.getNode(this.form.parentId);
                    this.$nextTick(()=>{
                      if (parantNode.isLeaf){
                        parantNode.isLeaf = false;
                        parantNode.loadData();
                      }else{
                        this.sysTree.append(obj,this.form.parentId);
                      }
                    })
                  }
                  this.$nextTick(function(){
                    this.sysTree.setCurrentKey(obj.id);
                    // this.$nextTick(()=>{
                    //   this.$router.push({
                    //     name: 'editSysMenu',
                    //     params: {
                    //       id:obj.id
                    //     }
                    //   })
                    // })
                  })
                }
                // this.sysTree.$parent.getCustomMenuTree(this.form.parent_id);
              }else{
                this.$message({type: 'error',message: '添加失败！'});
              }
              this.$refs.ecoLoadingRef.close();
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '添加失败！'});
            })
          } else {
            return false;
          }
      });
    },
  },

  destroyed(){

  }

};

</script>

<style scoped>

</style>
