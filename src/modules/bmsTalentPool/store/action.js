import {getEnumSelectEnabled} from '@/modules/bmsTalentPool/service/service.js'
import {
  SET_BASE_DATA_OBJ,
} from './mutation-types.js'
const actions = {
  initProjectBaseData({commit,state},action = 'select-enabled'){
      return new Promise((resolve, reject) => {
          const keys = Object.keys(state.baseData);
          let index_ = 0;
          keys.map((key,index)=>{
              getEnumSelectEnabled(key,action).then(data => {
                  let obj = {};
                  obj.key = key;
                  obj.array = data;
                  commit(SET_BASE_DATA_OBJ,obj);
                  index_++;
                  if(index_ == keys.length - 1){
                    //   console.log(index_)
                      resolve();
                  }
              }).catch(error => {
                  reject(error);
              })
          })
      })
  },
  initSomeBaseData({commit},{array = [],action = 'select-enabled'}){
      array.forEach(element => {
          getEnumSelectEnabled(element,action).then(data => {
              let obj = {};
              obj.key = element;
              obj.array = data;
              commit(SET_BASE_DATA_OBJ,obj);
          }).catch(error => {
          })
      });
  },
}
export default actions
