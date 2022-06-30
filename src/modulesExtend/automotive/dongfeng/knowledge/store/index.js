import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
Vue.use(Vuex)

const state = {
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
  fileTableNode:null,
  fileTreeNode:null,
  fileMainTableNode:null,
  activeId:'',
  type:''
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
