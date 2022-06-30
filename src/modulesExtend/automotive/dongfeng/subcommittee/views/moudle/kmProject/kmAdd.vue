<template >
  <div class="kmAdd">
      <div class="center">
          <table >
            <tr><td>标准分类</td>
                <td>
                    <el-select v-model="standard_classification_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                </td>
                <td>标准类型</td>
                <td>
                    <el-select v-model="standard_type_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                <td>体系码</td>
                <td><el-input v-model="system_code_"></el-input></td>
            </tr>
            <tr>
                <td>标准编号</td>
                <td><el-input v-model="system_code_"></el-input></td>
                <td>标准名称</td>
                <td><el-input v-model="standard_name_"></el-input></td>
                <td>制定人</td>
                <td><el-input v-model="drafter_"></el-input></td>
            </tr>
            <tr>
                <td>年度</td>
                <td><el-input v-model="year_"></el-input></td>
                <td></td>
                <td></td>
                <td><el-link type="primary" style="font-size:20px">复制链接</el-link></td>
                <td></td>
            </tr>
            <tr>
                <td>标准编制目的及内容简介</td>
                <td colspan='5'><el-input v-model="purpose_content_"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none"></el-input></td>
            </tr>
            <tr>
                <td>部门</td>
                <td><el-input v-model="dept_"></el-input></td>
                <td>科室</td>
                <td><el-input v-model="department_"></el-input></td> 
                <td>责任人</td>
                <td><el-input v-model="responsible_"></el-input></td>
            </tr>
            <tr>
                <td>初稿完成时间</td>
                <td><el-input v-model="draft_completion_time_"></el-input></td>
                <td>会签完成时间</td>
                <td><el-input v-model="countersign_completion_time"></el-input></td>
                <td>复审年度</td>
                <td><el-input v-model="review_year_"></el-input></td>
            </tr>
            <tr>
                <td>标准状态标示</td>
                <td>
                    <el-select v-model="standard_status_indicator_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                <td>分标委</td>
                <td>
                    <el-select v-model="subcommittee_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                <td>规划来源</td>
                <td>
                    <el-select v-model="plan_source_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                </tr>
            <tr>
                <td>来源编号</td>
                <td>
                    <el-select v-model="source_num_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                <td>五化领域</td>
                <td>
                    <el-select v-model="five_aspects_field_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                <td>应用领域</td>
                <td>
                    <el-select v-model="application_field_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td>使用项目</td>
                <td>
                    <el-select v-model="applicable_item_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                <td>备注1</td>
                <td>
                    <el-select v-model="application_model_" placeholder="请选择">
                        <el-option v-for="item in normalSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </td>
                <td>备注2</td>
                <td><el-input v-model="remarks"></el-input></td>
            </tr>
          </table>
          <div class="footer">
              <el-button type="primary">保存</el-button>
              <el-button type="primary">关闭</el-button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            normalSort:[
                {
                lable: '1',
                value:'管理标准'
                },
                {
                lable: '2',
                value:'研发管理标准'
                },
                {
                lable: '3',
                value:'共通技术'
                },
                {
                lable: '4',
                value:'研发方法'
                },
                {
                lable: '5',
                value:'产品工程'
                },
                {
                lable: '6',
                value:'工艺装备'
                },
            ],
            standard_classification_:'',//标准分类
            standard_type_ :'',//标准类型
            standard_no_ :'',//标准编号
            standard_name_ :'',//标准名称
            system_code_ :'',//体系码
            drafter_:'',//制订人
            year_ :'',//年度
            purpose_content_ :'',//标准编制目的及内容简介
            dept_ :'',//部门
            department_ :'',//科室
            responsible_ :'',//责任人
            draft_completion_time_ :'',//初稿完成时间
            countersign_completion_time :'',//会签完成时间
            review_year_ :'',//复审年度
            subcommittee_ :'',//分标委
            plan_source_:'',//规划来源
            source_num_ :'',//来源编号（问题编号）
            five_aspects_field_ :'',//五化领域
            application_field_ :'',//应用领域
            applicable_item_ :'',//适用项目
            application_model_ :'',//应用车型
            remarks_ :'',//备注
            status_ :'',//状态
            create_user_ :'',//创建人
            create_date_ :'',//创建时间
            mod_user_ :'',//修改人
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-select::placeholder {
    color: red;
}
/deep/ .el-button {
    width: 70px;
    height: 36px;
}
/deep/ .el-link {
    margin-right: 10px;
    color: #0000ff;
    font-size: 16px;
}
/deep/ .el-input__inner {
    background: #d7d7d7;
    color: #000000;
    width: 200px;
    height: 30px;
    border: 1px solid #797979;
}
/deep/ .el-textarea__inner {
    border: 1px solid #797979;
    background: #d7d7d7;
    color: #000000;
}   
.kmAdd {
    width: 100%;
    height: 100%;
    .center {
        width: 1070px;
        margin: 20px auto;
        padding: 20px;
        box-sizing: border-box;
        background: white;
        border: 1px solid #797979;
        table {
        width: 100%;
        height: 100%;
        tr {
            td {
                padding: 10px;
                box-sizing: border-box;
                &:nth-child(odd) {
                    width: 120px;
                    padding: 10px;
                    box-sizing: border-box;
                }
            }
        }
        }
        .footer {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            margin-top: 10px;
        }  
    }
}
</style>