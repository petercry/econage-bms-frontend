const getters = {
  baseData:state => {
      return state.baseData;
  },
  getBaseDataTextByKey:state => (id,key) => {
      if(!id || !key) return '';
      let _find = state.baseData[key].data?state.baseData[key].data.find(single => single.id == id):null;
      return _find?_find.text:'';
  }
}
export default getters
