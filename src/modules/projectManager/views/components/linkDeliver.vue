<template>
    <div style="position: relative;">
        <div class="linkDeliver" @click="dialogVisible = true" v-bind:class="{disabled:disabled}">
            <div class="selectDiv">
                <span v-show="tags.length==0" class="placeholder" >{{placeholder}}</span>
                 <el-tag
                    v-for="(tag,index) in tags"
                    :key="tag.id"
                    :closable="!disabled"
                    size="mini"
                    class="ellipsis"
                    @close="removeTag($event,index)"
                    :type="tag.type">
                    {{tag.name}}
                </el-tag>
            </div>
            <i class="el-icon-link icon"></i>
        </div>


        <el-dialog title="选择交付物" v-if="!disabled" @opened="openDialog" custom-class="deliverDialog" :visible.sync="dialogVisible" :modal="false" width="90%">
            <deliver-list :multiple="multiple" style="height:400px;position:relative;" ref="deliverList"></deliver-list>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import deliverList from '../moudle/deliver/list.vue'
  import {getDeliverInfoList} from '../../api/deliver.js'
  export default{
      name:'linkDeliver',
      data(){
          return {
              dialogVisible:false,
              tags:[]
          }
      },
      components:{
          deliverList
      },
      created(){
          this.initDataFunc();
      },
      props:{
            placeholder:{
                type:String,
                default:function(){
                    return "";
                }
            },
            initData:{
                type:Array | String,
                default () {
                    return []
                }
            },
            disabled:{
                type: Boolean,
                default(){
                    return false
                }
            },
            multiple:{
                type:Boolean,
                default(){
                    return true
                }
            }
      },
      methods: {
         submit(){
            this.tags = this.$refs['deliverList'].multipleSelection;
            this.$emit("callBack",this.tags);
            this.dialogVisible = false;
         },
         removeTag(e,index){
            e.stopPropagation();
            this.tags.splice(index, 1);
            this.$emit("callBack",this.tags);
         },
         openDialog(){
            //  分页暂时做不到默认选中。。因为选中的数据可能未加载。。
             let ids = []
             this.tags.forEach(element => {
                 ids.push(element.id);
             });
             this.$refs['deliverList'].selectRows(ids);
            // this.$refs['deliverList'].clearSelect();
         },
         initDataFunc(){
            let deliverIds = [];
            if(this.initData instanceof Array){
                deliverIds = this.initData;
            }else{
                deliverIds = this.initData.split('|');
            }
            if(deliverIds.length > 0){
                getDeliverInfoList({selectId:deliverIds}).then(res => {
                    this.tags = res.rows;
                })
            }else{
                this.tags = [];
            }


         }
      },
      watch: {
          initData:{
              deep:true,
              handler(newValue,oldValue){
                  this.initDataFunc();
              }
          }
      }
  }

</script>
<style scope>
.deliverDialog .el-dialog__body{
    padding: 0;
}
.linkDeliver{
    display: inline-block;
    cursor: pointer;
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    min-height: 36px;
    line-height: 34px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}
.linkDeliver .selectDiv{
    padding-right: 28px;
    display: inline-block;
    width: calc(100% - 22px);
}
.linkDeliver .icon{
    position: absolute;
    color: #003b90;
    right: 8px;
    top: 8px;
    font-size: 20px;
    line-height: 20px;
    cursor: unset;
}
.linkDeliver .el-tag--mini{
    padding: 0 3px;
    line-height: 20px;
    margin-right: 5px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fafafa;
    border-color:#e8e8e8;
    /* max-width: 150px; */
    position: relative;
    padding-right: 10px;
    white-space: normal;
    min-height: 22px;
    height: auto;
    top:6px;
}
.linkDeliver.disabled{
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
    pointer-events: none;

}
.linkDeliver .placeholder{
    color: #c1c5cd;
    font-size: 14px;
    display: inline-block;
    position: absolute;
    top: 0px;
}
.linkDeliver .el-tag .el-tag__close{
    color:#003b90;
}
.linkDeliver .el-tag .el-tag__close:hover{
    color: #fff;
    background-color:#003b90;
}
</style>
