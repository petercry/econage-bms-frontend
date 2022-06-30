<template>
  <div class="">
    <div class="kn-header" >
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <div>
        修改菜单
        <ecoActionBtn :ecoActionBtnFunc="updateCustomSysMenuItem">
          <i slot="icon" class="el-icon-circle-check-outline"/>
          保存
        </ecoActionBtn>
      </div>
    </div>
    <div class="page-main">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="mini">
        <el-form-item label="菜单id">
          {{form.id}}
        </el-form-item>
        <el-form-item label="对应模块类型">
          <el-select style="width:100%;" v-model="form.type" placeholder="请选择对应模块类型">
            <el-option v-for="(item,key) in menuTypeList" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type=='SYS_COMPONENT'" label="对应模块">
          <el-select style="width:100%;" filterable v-model="form.component" placeholder="请选择对应模块">
            <!-- <el-option v-for="item in modularList" :key="item.id" :label="item.i18nText||'null'" :value="item.id" @click.native="moduleClick(item)"></el-option> -->
            <el-option-group
              v-for="group in modularList"
              :key="group.id"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="item.i18nText||'null'"
                :value="item.id"
                @click.native="moduleClick(item)">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type=='EXTERNAL_LINK'" label="链接路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name" :rules="[
            { required: true, message: '菜单名称不能为空'}
          ]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="国际化编码">
          <el-input v-model="form.i18nKey"></el-input>
        </el-form-item>
        <el-form-item label="图片名称">
          <el-input v-model="form.iconCls"></el-input>
          <!-- <el-input v-model="form.iconCls" placeholder="点击选择图标" @click.native="openIconChoose"></el-input> -->
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ecoActionBtn from '@/modules/menuFacade/views/components/ecoActionBtn.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import EcoUtil from '@/components/util/main.js'
import {getMenuType,getModularList,getI18nList,updateCustomSysMenuItem} from '@/modules/menuFacade/service/service.js'
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
      menuTypeList:{},
      modularList:[],
      form:{
        name:'',   //菜单名称
        i18nKey:'', //国际化key
        parentId:'', //上级节点
        type:'', //对应模块类型
        component:0,    //对应模块类型ID
        href:'',          //链接路径
        iconCls:'',   //图片名称
        desc:'',    //备注
      },
      rules:{
        
      }
    };
  },
  mounted(){
    window.ecoVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.$nextTick(()=>{
      this.init(500);
    })
   
  },
  created(){
      this.getMenuType();
      this.getModularList();
      
  },
  computed:{
    ...mapState(['sysSelected','sysTree'])
  },
  methods:{
    getMenuType(){
      getMenuType().then((res)=>{
        if (res.data){
          this.menuTypeList = res.data;
        }
      }).catch((error)=>{
      })
    },
    getModularList(){
      getModularList().then((res)=>{
        if (res.data){
          this.modularList = res.data;
        }
      }).catch((error)=>{
      })
    },
    moduleClick(item){
      this.form.name = item.i18nText;
      this.form.i18nKey = item.i18nKey;
      this.form.href = item.menuHref;
      this.form.iconCls = item.menuIcon;
    },
    addMonitor(){
      let callBackDialogFunc = function(obj){
          if(obj && obj.action == 'iconChooseCallBack'){ //回调的唯一标识符
            window.ecoVm.form.img_name=obj.data;
          }
      }
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    init(val){
      let sysSelected = this.sysSelected;
      let id = this.$route.params.id;
      setTimeout(()=>{
        try {
          let sysTreeS = this.sysTree.getNode(id);
          if (sysTreeS.data){
            this.form.id = sysTreeS.data.id;
            this.form.name = sysTreeS.data.name;
            this.form.i18nKey = sysTreeS.data.i18nKey;
            this.form.parentId = sysTreeS.data.parentId;
            this.form.type = sysTreeS.data.type;
            this.form.component = sysTreeS.data.component;
            this.form.href = sysTreeS.data.href;
            this.form.iconCls = sysTreeS.data.iconCls;
            this.form.desc = sysTreeS.data.desc;
          }
        } catch (error) {
          
        }
      },val)
    },
    updateCustomSysMenuItem(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            let form = this.form;
            form.id = this.$route.params.id;
            updateCustomSysMenuItem(form).then((res)=>{
              if (res.data&&res.data.id){
                this.$message({type: 'success',message: '修改成功！'});
                this.sysTree.$parent.getCustomMenuTree(this.$route.params.id);
              }else{
                this.$message({type: 'error',message: '修改失败！'});
              }
              this.$refs.ecoLoadingRef.close();
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '修改失败！'});
            })
          } else {
            return false;
          }
      });
    },
    openIconChoose(){
      window.parent.sysvm.openDialog('图标选择',
      '/wh/jsp/version3/system/index.html#/iconChoose',700,450);
    },
  },
  watch:{
    '$route'(){
      this.init(0);
    }
  },
  destroyed(){

  }

};

</script>

<style scoped>

</style>
