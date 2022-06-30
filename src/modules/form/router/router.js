import Vue from 'vue'
import Router from 'vue-router'

const demo = r => require.ensure([], () => r(require('../views/demo.vue')), 'common')

const formDesign = (r) => require.ensure([], () => r(require('../views/design/index.vue')), 'formDesign');
const designFormSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designFormSetting.vue')), 'formDesignItem');
const designInputSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designInputSetting.vue')), 'formDesignItem');
const designTextareaSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designTextareaSetting.vue')), 'formDesignItem');
const designNumberSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designNumberSetting.vue')), 'formDesignItem');
const designDateSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designDateSetting.vue')), 'formDesignItem');
const designSelectSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designSelectSetting.vue')), 'formDesignItem');
const designRadioSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designRadioSetting.vue')), 'formDesignItem');
const designCheckboxSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designCheckboxSetting.vue')), 'formDesignItem');
const designAttachementSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designAttachementSetting.vue')), 'formDesignItem');
const designImgSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designImgSetting.vue')), 'formDesignItem');

const designApprovalSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designApprovalSetting.vue')), 'formDesignItem');



const designGridSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridSetting.vue')), 'formDesignItem');
const designGridInputSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridInputSetting.vue')), 'formDesignItem');
const designGridTextareaSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridTextareaSetting.vue')), 'formDesignItem');
const designGridNumberSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridNumberSetting.vue')), 'formDesignItem');
const designGridDateSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridDateSetting.vue')), 'formDesignItem');
const designGridSelectSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridSelectSetting.vue')), 'formDesignItem');
const designGridRadioSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridRadioSetting.vue')), 'formDesignItem');
const designGridCheckboxSetting = (r) => require.ensure([], () => r(require('../views/design/setting/grid/designGridCheckboxSetting.vue')), 'formDesignItem');


Vue.use(Router)
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'',
      redirect:'/formDesign/1237958319636295682'
    },
    {
        path: '/formDesign/:viewId',
        name: 'formDesign',
        component: formDesign,
        children:[
           {
              path: 'designFormSetting',
              name: 'designFormSetting',
              component: designFormSetting
            },

            {
              path: 'designInputSetting/:uuid/:tableDef/:action',
              name: 'designInputSetting',
              component: designInputSetting
            },

            {
              path: 'designTextareaSetting/:uuid/:tableDef/:action',
              name: 'designTextareaSetting',
              component: designTextareaSetting
            },

            {
              path: 'designNumberSetting/:uuid/:tableDef/:action',
              name: 'designNumberSetting',
              component: designNumberSetting
            },

            {
              path: 'designDateSetting/:uuid/:tableDef/:action',
              name: 'designDateSetting',
              component: designDateSetting
            },

            {
              path: 'designSelectSetting/:uuid/:tableDef/:action',
              name: 'designSelectSetting',
              component: designSelectSetting
            },

            {
              path: 'designRadioSetting/:uuid/:tableDef/:action',
              name: 'designRadioSetting',
              component: designRadioSetting
            },

            {
              path: 'designCheckboxSetting/:uuid/:tableDef/:action',
              name: 'designCheckboxSetting',
              component: designCheckboxSetting
            },

            {
              path: 'designAttachementSetting/:uuid/:tableDef/:action',
              name: 'designAttachementSetting',
              component: designAttachementSetting
            },

            {
              path: 'designImgSetting/:uuid/:tableDef/:action',
              name: 'designImgSetting',
              component: designImgSetting
            },

            {
              path: 'designApprovalSetting/:uuid/:tableDef/:action',
              name: 'designApprovalSetting',
              component: designApprovalSetting
            },


            {
              path: 'designGridSetting/:uuid/:tableDef/:action',
              name: 'designGridSetting',
              component: designGridSetting,
              children:[
                    {
                        path: 'designGridInputSetting/:childUUID/:childFieldId/:parentGridId',
                        name: 'designGridInputSetting',
                        component: designGridInputSetting
                    },
                    {
                        path: 'designGridTextareaSetting/:childUUID/:childFieldId/:parentGridId',
                        name: 'designGridTextareaSetting',
                        component: designGridTextareaSetting
                    },
                    {
                        path: 'designGridNumberSetting/:childUUID/:childFieldId/:parentGridId',
                        name: 'designGridNumberSetting',
                        component: designGridNumberSetting
                    },
                    {
                        path: 'designGridDateSetting/:childUUID/:childFieldId/:parentGridId',
                        name: 'designGridDateSetting',
                        component: designGridDateSetting
                    },
                    {
                        path: 'designGridSelectSetting/:childUUID/:childFieldId/:parentGridId',
                        name: 'designGridSelectSetting',
                        component: designGridSelectSetting
                    },
                    {
                        path: 'designGridRadioSetting/:childUUID/:childFieldId/:parentGridId',
                        name: 'designGridRadioSetting',
                        component: designGridRadioSetting
                    },
                    {
                        path: 'designGridCheckboxSetting/:childUUID/:childFieldId/:parentGridId',
                        name: 'designGridCheckboxSetting',
                        component: designGridCheckboxSetting
                    }
              ]
            }
          
        ]
    },
    {
      path:'/demo',
      name:'demo',
      component:demo
    } 
  ],

})
