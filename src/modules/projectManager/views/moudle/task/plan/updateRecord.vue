<template>
    <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5">
        <div class="updateRecordList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>

            <eco-content bottom="42px" top="0" ref="content" style="padding:0;">
                <el-table
                    :data="list"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    border
                    @header-dragend="changeColWidth"
                    ref="multipleTable"
                    height="100%"
                    @row-click="goDetail"
                    @row-dblclick="goDetail"
                    stripe

                >

                    <el-table-column
                        prop="index"
                        label="序号"
                        width='60'
                        min-width="60"
                        >
                        <template slot-scope="scope">

                            {{scope.$index+1}}
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="createUserName"
                        label="变更人"
                         width='100'
                        min-width="100"
                        >
                         <template slot-scope="scope">

                            <span @click="goDetail(scope.row)" class="pointerClass">{{scope.row.createUserName}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="createDate"
                        label="变更时间"
                        width='100'
                        min-width="100"
                        >
                      <template slot-scope="scope">{{scope.row.createDate?scope.row.createDate.substring(0,10):''}}</template>
                    </el-table-column>
                      <el-table-column

                        label="变更记录"

                        min-width="100"
                        >
                        <template slot-scope="scope">
                            <div class="update">
                                <p v-if="scope.row.lastO.name !== scope.row.originalO.name">任务名称：<span class="original">{{scope.row.originalO.name}}</span> -> <span class="last">{{scope.row.lastO.name}}</span></p>
                                <p v-if="scope.row.lastO.planStartDate !== scope.row.originalO.planStartDate">计划开始时间：<span class="original">{{scope.row.originalO.planStartDate}}</span> -> <span class="last">{{scope.row.lastO.planStartDate}}</span></p>
                                <p v-if="scope.row.lastO.planEndDate !== scope.row.originalO.planEndDate">计划完成时间：<span class="original">{{scope.row.originalO.planEndDate}}</span> -> <span class="last">{{scope.row.lastO.planEndDate}}</span></p>
                                <p v-if="scope.row.lastO.liableUserName !== scope.row.originalO.liableUserName">责任人：<span class="original">{{scope.row.originalO.liableUserName}}</span> -> <span class="last">{{scope.row.lastO.liableUserName}}</span></p>
                                <p v-html="$options.filters.capitalize(scope.row)"></p>
                            </div>
                        </template>
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
  import {EcoUtil} from '@/components/util/main.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {getChangePlanList} from '../../../../api/plan.js'
  export default{
      name:'updateRecord',
      components: {
        ecoContent,
        ecoLoading,
        ecoToolTitle
      },
      data(){
        return {
          list:[],
          total:0,

        }
      },
      computed:{

      },
      filters:{
          capitalize(row){
              const lastO_str = row.lastO.delivList && row.lastO.delivList.length > 0?row.lastO.delivsStr:"无";
              const originalO_str = row.originalO.delivList && row.originalO.delivList.length > 0?row.originalO.delivsStr:"无";

              if(lastO_str !== originalO_str){
                  return '交付物：<span class="original">'+originalO_str+'</span> -> <span class="last">'+lastO_str+'</span>';
              }else{
                  return '';
              }
          }
      },
      created(){


      },
      mounted(){
        this.getListDataFunc();
      },
      activated() {
        this.getListDataFunc();
      },
      methods: {

        getListDataFunc(){
            this.$refs.ecoLoadingRef.open();
            getChangePlanList(this.$route.params.id).then(res => {
                this.$refs.ecoLoadingRef.close();
                this.total = res.total;
                this.list = res.rows;
            })
        },

        goDetail({lastO}){
           EcoUtil.getSysvm().setTempStore("update-record-info",lastO);
          if(sysEnv == 0){
              let _width = '1024';
              let _height = '800';
              let url = window.location.origin + "/#" +'/addOrUpdatePlan/-1/0';
              EcoUtil.getSysvm().openDialog('详情',url,_width,_height,'15vh');
          }else{
              let _width = '1024';
              let _height = '800';
              let url = '/projectManager/index.html#/addOrUpdatePlan/-1/0';
              EcoUtil.getSysvm().openDialog('详情',url,_width,_height,'15vh');
          }

        },
        changeColWidth(nw,ow,col,evt){
            if(nw < col.minWidth){
                col.width = col.minWidth;
            }
        },

      },
      watch: {

      }
  }

</script>
<style scoped>

.updateRecordList{
    height: 100%;
    overflow: auto;
    background: #fff;
}
.updateRecordList .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.updateRecordList .toolBtn{
    margin:0 10px;
}
</style>
