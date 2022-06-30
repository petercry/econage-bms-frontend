import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
      initRole:{
        PAGE_LIST:{
          permission:{}
        },
        PAGE_DESIGN_CHECK:{
          permission:{}
        },
        PAGE_CAR_CHECK:{
          permission:{}
        },
        PAGE_PROJECT_BASE:{
          permission:{}
        }
      },//各页面操作权限
      regulatoryComplianceList:[],//符合性
      importantTypeList:[],//重要类型 
      statusList:{'programming':'编制中','approving':'审批中','accomplished':'已完成','withdraw':'退回'},//状态
      demo:{},
      baseData:{
          PRO_CATEGORY:[], //项目类别
          PRO_PLATFORM:[], //项目平台
          '1117':[], //动力类型
          '1116':[],//车辆类型
          '1119':[], //气体燃料专用
          '1372459642503467009':[]
      },
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
    ecoEventData:{},
    ecoEvent:{},
    typeList:{"PROJECT":'项目',"REGULATION":'法规'},
    designStatusList:{'waiting':'待办','handled':'已办理','complete':'已完成'}
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
