<template>
    <div>
      <ecoContent top="20px" bottom="0" style="left:20px;right:20px">
        <el-form label-position="right" :model="formData" label-width="80px">
            <el-form-item label="年份" prop="yearDate" style="margin-bottom: 20px">
                <el-input v-model="formData.yearDate"></el-input>
            </el-form-item>
            <el-form-item label="评分说明" prop="name">
                  <ecoFileUploadChunk
                    style="max-width:500px"
                    :modular="module"
                    :modularInnerId="formData.id"
                    ref="ecoFileUploadRef"
                    :btnFlag=true
                  ></ecoFileUploadChunk>
            </el-form-item>
            <el-form-item label="" prop="yearDate" class="btnPos">
              <el-button type="primary" @click.native="submitHandle">
                保存
              </el-button>
              <el-button @click.native="save">
                关闭
              </el-button>
            </el-form-item>
        </el-form>
      </ecoContent>
    </div>
</template>

<script>
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'

export default {
    name:"",
    data() {
        return {
            formData:{
                yearDate: '11',
                id: '123'
            },
            module: 'annual',
        }
    },
    components:{
        ecoFileUploadChunk,
        ecoContent
  },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.btnPos {
    position: absolute;
    bottom: 15px;
}
</style>
