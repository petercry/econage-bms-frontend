import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
Vue.use(Vuex)

const state = {
  baseData:{
    faw_pm_rd_type:[],
    faw_pm_industry:[],
    faw_pm_product_type:[],
    faw_pm_platform:[],
    faw_pm_type:[],
    faw_pm_status:[],
    faw_pm_stage:[],
    faw_pm_production:[],
    faw_pm_sort:[],
    faw_pm_model_status:[],
    faw_pm_miles_status:[],
    faw_pm_pro_status:[],
    faw_pm_pro_important:[],
    faw_pm_pro_urgent:[],
    faw_pm_pro_attention:[],
    faw_pm_risk_status:[],
    faw_pm_risk_category:[],
    faw_pm_risk_important:[],
    faw_pm_risk_attention:[],
    faw_pm_risk_chance:[],
    faw_pm_risk_effect:[],
    faw_pm_field_type:[],
    faw_pm_view_range:[],
    faw_pm_work_drive:[],
    faw_pm_work_status:[],
    faw_pm_work_publish_status:[],
    faw_pm_task_deliv_status:[]
  },
  majorType:[],
  roleType:[],
  groupType:[],
  roleList:[],
  roleListGroup:[],
  deliverType:[],
  tempObj:{},
  projectInfo:{},
  typeImgList:{
      doc: require('../assets/type/doc.png'),
      docx: require('../assets/type/docx.png'),
      file: require('../assets/type/file.png'),
      folder: require('../assets/type/folder.png'),
      html: require('../assets/type/html.png'),
      image: require('../assets/type/image.png'),
      jpg: require('../assets/type/image.png'),
      png: require('../assets/type/image.png'),
      gif: require('../assets/type/image.png'),
      jpeg:require('../assets/type/image.png'),
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
      zip: require('../assets/type/zip.png'),
      blank: require('../assets/type/file.png'),
  },
  milesRole:{},
  groupRole:{},
  milesType:[],
  activityList:[],
  userInfo:{}
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
