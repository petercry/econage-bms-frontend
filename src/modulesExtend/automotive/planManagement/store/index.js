import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      programSource:[], //规划来源
      standardType:[],//标准分类 
      planType:[],//计划类型
      tempObj:{},
      operationType:[],//调整类型
      editType:[], // 制修订
      planStatusList:[], //审批状态
      editStatus:[
        {
          id:'WAITING',
          text:'未开始'
        },
        // {
        //   id:'DOING',
        //   text:'审批中'
        // },
        {
          id:'DONE',
          text:'已完成'
        },
        {
          id:'DELETE',
          text:'已删除'
        },
        {
          id:'DELAY',
          text:'延迟'
        },
        {
          id:'INVALID',
          text:'作废'
        },
        {
            id:'FIRST_LEVEL_AUDIT',
            text:'一级审核',
        },
        {
            id:'SECONDARY_AUDIT',
            text:'二级审核',
        },
        {
            id:'SOLICITATION',
            text:'意见征求',
        },
        {
            id:'OPINION_MODIFY',
            text:'意见修改',
        },
        {
            id:'DEPART_PROOFREAD',
            text:'科室负责人校对',
        },
        {
            id:'DEPART_EXAMINE',
            text:'部门负责人审核',
        },
        {
            id:'JOIN_SIGN',
            text:'会签',
        },
        {
            id:'JOIN_SIGN_MODIFY',
            text:'会签修改',
        },
        {
            id:'STANDARD_REVIEW',
            text:'标准审查',
        },
        {
            id:'SUB_CHAIRMAN',
            text:'分标委议长审核',
        },
        {
            id:'SUB_PRESIDENT',
            text:'分管院长审核',
        },
        {
            id:'SPEAKER',
            text:'标委会议长审核',
        },
        {
            id:'START',
            text:'开始环节',
        }
        ],//制修订状态
      typeImgList:{
        doc: require('../assets/type/doc.png'),
        docx: require('../assets/type/docx.png'),
        file: require('../assets/type/file.png'),
        folder: require('../assets/type/folder.png'),
        html: require('../assets/type/html.png'),
        image: require('../assets/type/image.png'),
        'image1-icon': require('../assets/type/image1-icon.png'),
        link: require('../assets/type/link.png'),
        mht: require('../assets/type/mht.png'),
        movies: require('../assets/type/movies.png'),
        pdf: require('../assets/type/pdf.png'),
        ppt: require('../assets/type/ppt.png'),
        pptx: require('../assets/type/pptx.png'),
        rar: require('../assets/type/rar.png'),
        report: require('../assets/type/report.png'),
        txt: require('../assets/type/txt.png'),
        wpfile: require('../assets/type/wpfile.png'),
        wpfile1: require('../assets/type/wpfile1.png'),
        xls: require('../assets/type/xls.png'),
        xlsx: require('../assets/type/xlsx.png'),
        xml: require('../assets/type/xml.png'),
        xml1: require('../assets/type/xml1.png'),
        zip: require('../assets/type/zip.png')
      },
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
