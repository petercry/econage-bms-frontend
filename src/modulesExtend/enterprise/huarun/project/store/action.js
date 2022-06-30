import {getEnumSelectEnabled} from '../service/service.js'
import {SET_BASE_DATA_OBJ} from './mutation-types.js'

const actions = {
    initProjectBaseData({commit,state},action = 'select-enabled'){
        return new Promise((resolve, reject) => {
            const keys = Object.keys(state.baseData);
            let index_ = 0;
            keys.map((key,index)=>{
                getEnumSelectEnabled(key,action).then(response => {
                    let obj = {};
                    obj.key = key;
                    obj.array = response.data;
                    commit(SET_BASE_DATA_OBJ,obj);
                    index_++;
                    if(index_ == keys.length - 1){
                        resolve();
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        })
    }

  
}

export default actions
