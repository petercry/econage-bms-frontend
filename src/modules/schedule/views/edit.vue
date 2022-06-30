<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <ecoContent top="0" bottom="0" style="padding:40px 20px 10px;">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="日期">
            {{form.date}}
            <!-- <el-input v-model="form.tplName"></el-input> -->
          </el-form-item>
          <el-form-item label="排班">
            <el-select style="width:100%" v-model="form.type" placeholder="排班">
              <el-option label="上班" value="WORKING_DAY"></el-option>
              <el-option label="休息" value="HOLIDAY_VACATIONS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="comments">
            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="form.comments"></el-input>
          </el-form-item>
          <el-form-item label="">
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
import {editScheduleAjax} from '@/modules/schedule/service/service.js'
// import EcoOrgPick from '@/components/orgPick/main.js'
export default{
  name:'scheduleAdd',
  components:{
    ecoLoading,
    ecoContent,
  },
  data(){
    return {
      form:{
        date:'',
        type:'',
        comments:'',
      }
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    getData(){
      let scheduleData = window.parent.sysvm.scheduleData;
      if (scheduleData){
        this.form.date = scheduleData.date;
        this.form.type = scheduleData.type;
        this.form.comments = scheduleData.comments;
      }
    },
    toFormNumber($event,formVal,key){
      if (/^[0-9]*$/.test(formVal)){
      }else{
        this.$message.error('该输入框只能输入数字')
        let val = formVal.replace(/(\D+[\d\D]*)/,'')
        this.form[key] = val;
      }
    },
    save(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.ecoLoadingRef.open();
            editScheduleAjax(this.form).then((res)=>{
              try {
                // if (res.data&&res.data.id){
                  this.$message({type: 'success',message: '编辑成功！'});
                  this.$refs.ecoLoadingRef.close();
                  let doObj = {}
                  doObj.action = 'scheduleEditCallBack';
                  doObj.close = true;
                  parent.window.sysvm.callBackDialogFunc(doObj);
                // }
              } catch (error) {
                
              }
            }).catch((error)=>{
              this.$refs.ecoLoadingRef.close();
              this.$message({type: 'error',message: '编辑失败！'});
            })
          } else {
            return false;
          }
      });
    }
  },
  watch: {

  }
}
</script>
<style>

</style>
