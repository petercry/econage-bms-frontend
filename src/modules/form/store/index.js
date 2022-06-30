import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
    wfFormDesignConfig:{},
    wfFormDesignConfigChange:{},
    wfFormDesignConfig2:{},
    wfFormDesignConfigChange2:{},

    formDesignModelAndView:{},

    wfGridDesignConfig:{},
    wfGridDesignConfigChange:{},
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
