import Vue from 'vue';
import Router from 'vue-router';

const  categoryIndex = r => require.ensure([], () => r(require('../views/wfCategory/categoryIndex.vue')), 'setting')
const  categoryAdd = r => require.ensure([], () => r(require('../views/wfCategory/categoryAdd.vue')), 'setting')
const  categoryDet = r => require.ensure([], () => r(require('../views/wfCategory/categoryDet.vue')), 'setting')
const  categoryEdit = r => require.ensure([], () => r(require('../views/wfCategory/categoryEdit.vue')), 'setting')
const  categorySort = r => require.ensure([], () => r(require('../views/wfCategory/categorySort.vue')), 'setting')

const wfTemplateList = (r) => require.ensure([], () => r(require('../views/wfTemplate/wfTemplateList.vue')), 'wfTemplate');
const wfTemplateAdd = (r) => require.ensure([], () => r(require('../views/wfTemplate/wfTemplateAdd.vue')), 'wfTemplate');


const formDesign = (r) => require.ensure([], () => r(require('../views/design/index.vue')), 'formDesign');
const formDesignView = (r) => require.ensure([], () => r(require('../views/design/content/contentView.vue')), 'formDesign');

const designFormSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designFormSetting.vue')), 'formDesignItem');
const designTabViewSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designTabViewSetting.vue')), 'formDesignItem');


const designInputSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designInputSetting.vue')), 'formDesignItem');
const designTextareaSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designTextareaSetting.vue')), 'formDesignItem');
const designNumberSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designNumberSetting.vue')), 'formDesignItem');
const designDateSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designDateSetting.vue')), 'formDesignItem');
const designSelectSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designSelectSetting.vue')), 'formDesignItem');
const designRadioSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designRadioSetting.vue')), 'formDesignItem');
const designCheckboxSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designCheckboxSetting.vue')), 'formDesignItem');
const designSegmentHeaderSetting = (r) => require.ensure([],	() => r(require('../views/design/setting/designSegmentHeaderSetting.vue')),	'formDesignItem');
const designAttachementSetting = (r) => require.ensure(	[],() => r(require('../views/design/setting/designAttachementSetting.vue')),'formDesignItem');
const designApprovalSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designApprovalSetting.vue')), 'formDesignItem');
const designImgSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designImgSetting.vue')), 'formDesignItem');
const designUserSelectSetting = (r) =>require.ensure(	[],() => r(require('../views/design/setting/designUserSelectSetting.vue')),'formDesignItem');
const designOrgSelectSetting = (r) =>require.ensure([],	() => r(require('../views/design/setting/designOrgSelectSetting.vue')),'formDesignItem');
const designRelWFSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designRelWFSetting.vue')), 'formDesignItem');
const designSeqFieldSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designSeqFieldSetting.vue')), 'formDesignItem');
const designFormulaSetting = (r) =>	require.ensure([],() => r(require('../views/design/setting/formula/designFormulaSetting.vue')),'formDesignItem');
const designCascaderSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designCascaderSetting.vue')), 'formDesignItem');
const designApiSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designApiSetting.vue')), 'formDesignItem');
const designBtnSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designBtnSetting.vue')), 'formDesignItem');


const designGridSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridSetting.vue')),	'formDesignGridItem');
const designGridInputSetting = (r) => require.ensure(	[],() => r(require('../views/design/setting/grid/designGridInputSetting.vue')),'formDesignGridItem');
const designGridTextareaSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridTextareaSetting.vue')),'formDesignGridItem');
const designGridNumberSetting = (r) => require.ensure([],	() => r(require('../views/design/setting/grid/designGridNumberSetting.vue')),'formDesignGridItem');
const designGridDateSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridDateSetting.vue')),'formDesignGridItem');
const designGridSelectSetting = (r) => require.ensure(	[],() => r(require('../views/design/setting/grid/designGridSelectSetting.vue')),'formDesignGridItem');
const designGridRadioSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridRadioSetting.vue')),'formDesignGridItem');
const designGridCheckboxSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridCheckboxSetting.vue')),'formDesignGridItem');
const designGridUserSelectSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridUserSelectSetting.vue')),'formDesignGridItem');
const designGridOrgSelectSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridOrgSelectSetting.vue')),'formDesignGridItem');
const designGridRelWFSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridRelWFSetting.vue')),'formDesignGridItem');
const designGridAttachmentSetting = (r) => require.ensure(	[],() => r(require('../views/design/setting/grid/designGridAttachmentSetting.vue')),'formDesignGridItem');
const designGridApiSetting = (r) => require.ensure([],() => r(require('../views/design/setting/grid/designGridApiSetting.vue')),'formDesignGridItem');

const linkWfSetting = (r) => require.ensure([], () => r(require('../views/components/linkWfSetting.vue')), 'setting');
const wfSeqIndexSetting = (r) => require.ensure([], () => r(require('../views/wfSeqIndex/wfSeqIndexSetting.vue')), 'setting');
const wfSeqIndexSelect = (r) => require.ensure([], () => r(require('../views/wfSeqIndex/wfSeqIndexSelect.vue')), 'setting');

const flowDirection = (r) => require.ensure([], () => r(require('../views/direction/flowDirection.vue')), 'flowDirection');
const wfTemplatePublish = (r) => require.ensure([], () => r(require('../views/wfTemplate/wfTemplatePublish.vue')), 'wfTemplate');

const wfStart = (r) => require.ensure([], () => r(require('../views/handle/wfStart.vue')), 'flow');
const wfDetail = (r) => require.ensure([], () => r(require('../views/handle/wfDetail.vue')), 'flow');
const wfToDo = (r) => require.ensure([], () => r(require('../views/handle/wfToDo.vue')), 'flow');
const wfToView = (r) => require.ensure([], () => r(require('../views/handle/wfToView.vue')), 'flow');
const wfToControl = (r) => require.ensure([], () => r(require('../views/handle/wfToControl.vue')), 'flow');
const wfViewDetail = (r) => require.ensure([], () => r(require('../views/handle/wfViewDetail.vue')), 'flow');
const wfToDoCC = (r) => require.ensure([], () => r(require('../views/handle/wfToDoCC.vue')), 'flow');
const wfSsoForward = (r) => require.ensure([], () => r(require('../views/handle/wfSsoForward.vue')), 'flow');

const designSealSetting = (r) => require.ensure([], () => r(require('../views/design/setting/designSealSetting.vue')), 'formDesignItem');
const importTemplateDialog = (r) => require.ensure([], () => r(require('../views/wfTemplate/importTemplateDialog.vue')), 'wfTemplate');
const flowSetting = (r) => require.ensure([], () => r(require('../views/setting/flowSetting.vue')), 'setting');
// const flowTest = (r) => require.ensure([], () => r(require('@/flowform/views/test/flowTest.vue')), 'setting');
// const flowTestDetail = (r) => require.ensure([], () => r(require('@/flowform/views/test/flowTestDetail.vue')), 'setting');
const cancelApiSetting = (r) => require.ensure([], () => r(require('../views/components/cancelApiSetting.vue')), 'setting');


const printSetList = (r) => require.ensure([], () => r(require('../views/setting/printSetList.vue')), 'setting');
const showFlowChart = (r) => require.ensure([], () => r(require('../views/components/showFlowChart.vue')), 'setting');
const showFlowHis = (r) => require.ensure([], () => r(require('../views/components/showFlowHis.vue')), 'setting');
const relateSetting = (r) => require.ensure([], () => r(require('../views/components/relateSetting.vue')), 'setting');
const flowStartQuanXian = (r) => require.ensure([], () => r(require('../views/components/flowStartQuanXian.vue')), 'setting');

const copyTemplateDialog = (r) => require.ensure([], () => r(require('../views/components/copyTemplateDialog.vue')), 'setting');
const flowControl = (r) => require.ensure([], () => r(require('../views/components/flowControl.vue')), 'setting');
const flowSimpleControl = (r) => require.ensure([], () => r(require('../views/components/flowSimpleControl.vue')), 'setting');
const changeWfStatus = (r) => require.ensure([], () => r(require('../views/components/changeWfStatus.vue')), 'setting');
const showFlowDirectionSort = (r) => require.ensure([], () => r(require('../views/direction/module/showFlowDirectionSort.vue')), 'setting');
const signatureSetting = (r) => require.ensure([], () => r(require('../views/components/signatureSetting.vue')), 'setting');
const selectSignature = (r) => require.ensure([], () => r(require('../views/components/selectSignature.vue')), 'setting');
const connectorAddAndUpdate = (r) => require.ensure([], () => r(require('../views/components/connectorAddAndUpdate.vue')), 'setting');
const sceneSetting = (r) => require.ensure([], () => r(require('../views/components/sceneSetting.vue')), 'setting');
const selectConnector = (r) => require.ensure([], () => r(require('../views/components/selectConnector.vue')), 'setting');
const printSetListForMulit = (r) => require.ensure([], () => r(require('../views/setting/printSetListForMulit.vue')), 'setting');
const viewApiSetting = (r) => require.ensure([], () => r(require('../views/components/viewApiSetting.vue')), 'setting');
// const rateWorkFlowDialog = (r) => require.ensure([], () => r(require('@/flowform/views/components/rateWorkFlowDialog.vue')), 'setting');
// const showRateInfoDialog = (r) => require.ensure([], () => r(require('@/flowform/views/components/showRateInfoDialog.vue')), 'setting');
 const multipleApprDialog = (r) => require.ensure([], () => r(require('../views/components/multipleApprDialog.vue')), 'setting');

// const wfSeqIndexList = (r) => require.ensure([], () => r(require('@/flowform/views/wfSeqIndex/wfSeqIndexList.vue')), 'wfSeqindex');
// const wfSeqIndexAdd = (r) => require.ensure([], () => r(require('@/flowform/views/wfSeqIndex/wfSeqIndexAdd.vue')), 'wfSeqindex');
// const wfSeqIndexEdit = (r) => require.ensure([], () => r(require('@/flowform/views/wfSeqIndex/wfSeqIndexEdit.vue')), 'wfSeqindex');

const wfApiSelectPage = (r) => require.ensure([], () => r(require('../views/wfApi/wfApiSelectPage.vue')), 'wfApi');
const wfApiViewDetailPage = (r) => require.ensure([], () => r(require('../views/wfApi/wfApiViewDetailPage.vue')), 'wfApi');

const wfRelWFPage = (r) => require.ensure([], () => r(require('../views/wfPage/wfRelWFPage.vue')), 'flow');
const apiOutPutPage = (r) => require.ensure([], () => r(require('../views/components/apiOutPutPage.vue')), 'wfApi');
const buttonSetting = (r) => require.ensure([], () => r(require('../views/components/buttonSetting.vue')), 'setting');
const wfGridExlImportPage = (r) => require.ensure([], () => r(require('../views/wfPage/wfGridExlImportPage.vue')), 'setting');
const iconChoose = (r) => require.ensure([], () => r(require('../views/wfPage/iconChoose.vue')), 'setting');

const wfAllAttViewPage = (r) => require.ensure([], () => r(require('../views/wfPage/wfAllAttViewPage.vue')), 'setting');


const formulaSetting = (r) => require.ensure([], () => r(require('../views/wfformula/formulaSetting.vue')), 'setting');
const formulaConcatenateSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/concatenateSetting.vue')), 'formulaSetting');
const formulaCalculateSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/calculateSetting.vue')), 'formulaSetting');
const formulaSumSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/sumSetting.vue')), 'formulaSetting');
const formulaRmbupperSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/rmbupperSetting.vue')), 'formulaSetting');
const formulaDaysSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/daysSetting.vue')), 'formulaSetting');
const formulaHoursSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/hoursSetting.vue')), 'formulaSetting');
const formulaYearsSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/yearsSetting.vue')), 'formulaSetting');
const formulaDatedeltaSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/datedeltaSetting.vue')), 'formulaSetting');
const formulaMidSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/midSetting.vue')), 'formulaSetting');
const formulaTonumberSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/tonumberSetting.vue')), 'formulaSetting');
const formulaCountSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/countSetting.vue')), 'formulaSetting');
const formulaMaxSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/maxSetting.vue')), 'formulaSetting');
const formulaMinSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/minSetting.vue')), 'formulaSetting');
const formulaIndxSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/indxSetting.vue')), 'formulaSetting');
const formulaGridindxSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/gridindxSetting.vue')), 'formulaSetting');
const formulaOpsymbolSetting = (r) => require.ensure([], () => r(require('../views/wfformula/setting/opsymbolSetting.vue')), 'formulaSetting');



Vue.use(Router);
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


export default new Router({
	mode: 'hash',
	routes: [
		{
			path: '',
			redirect: '/wfTemplateList'
		},

		{
			path:'/categoryIndex',
			name:'categoryIndex',
			component:categoryIndex,
			children:[
				{
				  path:'categoryDet/:parentId',
				  name:'categoryDet',
				  component:categoryDet,
				}
			]
		},

		{
			path:'/categoryAdd/:parentId',
			name:'categoryAdd',
			component:categoryAdd
		},

		{
			path:'/categoryEdit/:id',
			name:'categoryEdit',
			component:categoryEdit
		},

		{
			path:'/categorySort/:parentId',
			name:'categorySort',
			component:categorySort
		},


		{
		 	path: '/wfStart',
		 	name: 'wfStart',
		 	component: wfStart
		 },

		 {
			path: '/wfDetail/:taskId/:operateId',
			name: 'wfDetail',
			component: wfDetail
		 },
		 {
			path: '/wfToDo',
			name: 'wfToDo',
			component: wfToDo
		 },
		{
			path: '/wfToView',
			name: 'wfToView',
			component: wfToView
		},
		{
			path: '/wfToControl',
			name: 'wfToControl',
			component: wfToControl
		},
		{
			path: '/wfViewDetail/:wfId/:operateId',
			name: 'wfViewDetail',
			component: wfViewDetail
		},

		{
			path: '/formDesignView/:formId/:templateId',
			name: 'formDesignView',
		    component: formDesignView,
		},

		{
		 	path: '/formDesign/:formId/:templateId',
		 	name: 'formDesign',
			component: formDesign,
		 	children: [
		 		{
		 			path: 'designFormSetting/:formOperateId',
		 			name: 'designFormSetting',
		 			component: designFormSetting
				 },

				 {
					path: 'designTabViewSetting/:formOperateId/:viewId',
					name: 'designTabViewSetting',
					component: designTabViewSetting
				},

				{
		 			path: 'designInputSetting/:formOperateId/:uuid/:itemId/:action',
		 			name: 'designInputSetting',
		 			component: designInputSetting
				 },
				 {
					path: 'designTextareaSetting/:formOperateId/:uuid/:itemId/:action',
					name: 'designTextareaSetting',
					component: designTextareaSetting
				},
				{
		 			path: 'designNumberSetting/:formOperateId/:uuid/:itemId/:action',
		 			name: 'designNumberSetting',
		 			component: designNumberSetting
				 },
				 {
					path: 'designDateSetting/:formOperateId/:uuid/:itemId/:action',
					name: 'designDateSetting',
					component: designDateSetting
				},
				{
		 			path: 'designRadioSetting/:formOperateId/:uuid/:itemId/:action',
		 			name: 'designRadioSetting',
		 			component: designRadioSetting
				},
				{
		 			path: 'designSelectSetting/:formOperateId/:uuid/:itemId/:action',
		 			name: 'designSelectSetting',
		 			component: designSelectSetting
				 },
				 {
		 			path: 'designCheckboxSetting/:formOperateId/:uuid/:itemId/:action',
		 			name: 'designCheckboxSetting',
		 			component: designCheckboxSetting
				  },
				  {
		 			path: 'designSegmentHeaderSetting/:formOperateId/:uuid/:itemId/:action',
		 			name: 'designSegmentHeaderSetting',
		 			component: designSegmentHeaderSetting
				  },
				  {
		 			path: 'designAttachementSetting/:formOperateId/:uuid/:itemId/:action',
		 			name: 'designAttachementSetting',
		 			component: designAttachementSetting
				  },


				{
					path: 'designImgSetting/:formOperateId/:uuid/:itemId/:action',
					name: 'designImgSetting',
					component: designImgSetting
				},

				   {
						path: 'designApprovalSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designApprovalSetting',
						component: designApprovalSetting
					},

					{
						path: 'designUserSelectSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designUserSelectSetting',
						component: designUserSelectSetting
					},

					{
						path: 'designOrgSelectSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designOrgSelectSetting',
						component: designOrgSelectSetting
					},

					{
						path: 'designRelWFSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designRelWFSetting',
						component: designRelWFSetting
					},

					{
						path: 'designSeqFieldSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designSeqFieldSetting',
						component: designSeqFieldSetting
					},

					{
						path: 'designCascaderSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designCascaderSetting',
						component: designCascaderSetting
					},

					{
						path: 'designApiSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designApiSetting',
						component: designApiSetting
					},

					{
						path: 'designBtnSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designBtnSetting',
						component: designBtnSetting
					},

					{
						path: 'designGridSetting/:formOperateId/:uuid/:itemId/:action',
						name: 'designGridSetting',
						component: designGridSetting,
						children:[
							{
								path: 'designGridInputSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridInputSetting',
								component: designGridInputSetting
							},
							{
								path: 'designGridTextareaSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridTextareaSetting',
								component: designGridTextareaSetting
							},
							{
								path: 'designGridNumberSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridNumberSetting',
								component: designGridNumberSetting
							},
							{
								path: 'designGridDateSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridDateSetting',
								component: designGridDateSetting
							},
							{
								path: 'designGridSelectSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridSelectSetting',
								component: designGridSelectSetting
							},
							{
								path: 'designGridRadioSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridRadioSetting',
								component: designGridRadioSetting
							},
							{
								path: 'designGridCheckboxSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridCheckboxSetting',
								component: designGridCheckboxSetting
							},
							{
								path: 'designGridUserSelectSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridUserSelectSetting',
								component: designGridUserSelectSetting
							},
							{
								path: 'designGridOrgSelectSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridOrgSelectSetting',
								component: designGridOrgSelectSetting
							},
							{
								path: 'designGridRelWFSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridRelWFSetting',
								component: designGridRelWFSetting
							},
							{
								path: 'designGridAttachmentSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridAttachmentSetting',
								component: designGridAttachmentSetting
							},

							{
								path: 'designGridApiSetting/:childUUID/:childItemId/:parentItemId',
								name: 'designGridApiSetting',
								component: designGridApiSetting
							}
						]
					},

				{
					path: 'designSealSetting/:formOperateId/:uuid/:itemId/:action',
					name: 'designSealSetting',
					component: designSealSetting
				},


			]},



		{
			path: '/designFormulaSetting/:storeKey',
			name: 'designFormulaSetting',
			component: designFormulaSetting
		},

		{
			path: '/wfTemplateList',
			name: 'wfTemplateList',
			component: wfTemplateList
		},

		{
			path: '/wfTemplateAdd',
			name: 'wfTemplateAdd',
			component: wfTemplateAdd
		},

		{
			path: '/linkWfSetting/:operateId/:scId',
			name: 'linkWfSetting',
			component: linkWfSetting
		},

		{
			path: '/wfSeqIndexSetting/:itemOperateId/:seqGroupId',
			name: 'wfSeqIndexSetting',
			component: wfSeqIndexSetting
		},

		{
			path: '/wfSeqIndexSelect',
			name: 'wfSeqIndexSelect',
			component: wfSeqIndexSelect
		},

		{
			path: '/wfTemplatePublish/:formId/:templateId',
			name: 'wfTemplatePublish',
			component: wfTemplatePublish
		},

		// {
		// 	path: '/wfSeqIndexList',
		// 	name: 'wfSeqIndexList',
		// 	component: wfSeqIndexList
		// },



		// {
		// 	path: '/wfSeqIndexAdd',
		// 	name: 'wfSeqIndexAdd',
		// 	component: wfSeqIndexAdd
		// },

		// {
		// 	path: '/wfSeqIndexEdit/:id',
		// 	name: 'wfSeqIndexEdit',
		// 	component: wfSeqIndexEdit
		// },



		{
			path: '/flowSetting/:formId/:templateId',
			name: 'flowSetting',
			component: flowSetting
		},
		{
			path: '/flowDirection/:formId/:templateId',
			name: 'flowDirection',
			component: flowDirection
		},
		// {
		// 	path: '/flowTest/:formId/:templateId',
		// 	name: 'flowTest',
		// 	component: flowTest
		// },

		// {
		// 	path: '/flowTestDetail/:formId/:templateId/:recordId',
		// 	name: 'flowTestDetail',
		// 	component: flowTestDetail
		// },


		{
			path: '/printSetList/:wfId/:flag',
			name: 'printSetList',
			component: printSetList
		},
		{
			path: '/showFlowChart/:wfId',
			name: 'showFlowChart',
			component: showFlowChart
		},
		{
			path: '/showFlowHis/:operateId',
			name: 'showFlowHis',
			component: showFlowHis
		},

		{
			path: '/wfToDoCC/:operateId',
			name: 'wfToDoCC',
			component: wfToDoCC
		},

		{
			path: '/wfSsoForward/:targetURL/:requestSource',
			name: 'wfSsoForward',
			component: wfSsoForward
		},
		{
			path: '/relateSetting/:operateId',
			name: 'relateSetting',
			component: relateSetting
		},
		{
			path: '/flowStartQuanXian/:templateId',
			name: 'flowStartQuanXian',
			component: flowStartQuanXian
		},
		{
			path: '/copyTemplateDialog/:templateId/:wfName',
			name: 'copyTemplateDialog',
			component: copyTemplateDialog
		},
		{
			path: '/flowControl/:wfId',
			name: 'flowControl',
			component: flowControl
		},
		{
			path: '/flowSimpleControl/:wfId',
			name: 'flowSimpleControl',
			component: flowSimpleControl
		},
		{
			path: '/changeWfStatus/:wfId/:folder',
			name: 'changeWfStatus',
			component: changeWfStatus
		},
		{
			path: '/showFlowDirectionSort/:reqId',
			name: 'showFlowDirectionSort',
			component: showFlowDirectionSort
		},
		{
			path: '/signatureSetting/:operateId',
			name: 'signatureSetting',
			component: signatureSetting
		},
		{
			path: '/selectSignature/:linkId',
			name: 'selectSignature',
			component: selectSignature
		},
		{
			path: '/connectorAddAndUpdate/:operateId/:refId/:catName/:agentId',
			name: 'connectorAddAndUpdate',
			component: connectorAddAndUpdate
		},
		{
			path: '/sceneSetting/:operateId/:refId/:scId',
			name: 'sceneSetting',
			component: sceneSetting
		},
		{
			path: '/selectConnector/:operateId/:catName/:agentId/:flag',
			name: 'selectConnector',
			component: selectConnector
		},

		{
			path: '/wfApiSelectPage/:storeKey',
			name: 'wfApiSelectPage',
			component: wfApiSelectPage
		},

		{
			path: '/wfApiViewDetailPage/:storeKey',
			name: 'wfApiViewDetailPage',
			component: wfApiViewDetailPage
		},

		{
			path:'/wfRelWFPage/:storeKey',
			name:'wfRelWFPage',
			component:wfRelWFPage
		},


		{
			path: '/apiOutPutPage/:refId',
			name: 'apiOutPutPage',
			component: apiOutPutPage
		},
		{
			path: '/importTemplateDialog',
			name: 'importTemplateDialog',
			component: importTemplateDialog
		},
		{
			path: '/printSetListForMulit/:wfTemplateId',
			name: 'printSetListForMulit',
			component: printSetListForMulit
		},
		{
			path: '/viewApiSetting/:operateId/:refId/:scId',
			name: 'viewApiSetting',
			component: viewApiSetting
		},
		// {
		// 	path: '/rateWorkFlow/:wfId/:wfName',
		// 	name: 'rateWorkFlow',
		// 	component: rateWorkFlowDialog
		// },
		// {
		// 	path: '/showRateInfo/:wfId/:wfName',
		// 	name: 'showRateInfo',
		// 	component: showRateInfoDialog
		// },
		{
			path: '/multipleApprDialog/:batchTasks',
			name: 'multipleApprDialog',
			component: multipleApprDialog
		},
		{
			path: '/buttonSetting/:operateId',
			name: 'buttonSetting',
			component: buttonSetting
		},

		{
			path: '/wfGridExlImportPage/:storeKey',
			name: 'wfGridExlImportPage',
			component: wfGridExlImportPage
		},

		{
			path: '/iconChoose',
			name: 'iconChoose',
			component: iconChoose
		},

		{
			path:'/wfAllAttViewPage/:operate_id',
			name:'wfAllAttViewPage',
			component:wfAllAttViewPage
		},
		{
			path: '/cancelApiSetting/:operateId/:refId/:scId',
			name: 'cancelApiSetting',
			component: cancelApiSetting
		},
		{
			path: '/formulaSetting/:storeKey',
			name: 'formulaSetting',
			component: formulaSetting,
			children:[
				{
					path: 'formulaConcatenateSetting/:uuid',
					name: 'formulaConcatenateSetting',
					component: formulaConcatenateSetting
				},
				{
					path: 'formulaCalculateSetting/:uuid',
					name: 'formulaCalculateSetting',
					component: formulaCalculateSetting
				},
				{
					path: 'formulaSumSetting/:uuid',
					name: 'formulaSumSetting',
					component: formulaSumSetting
				},
				{
					path: 'formulaRmbupperSetting/:uuid',
					name: 'formulaRmbupperSetting',
					component: formulaRmbupperSetting
				},
				{
					path: 'formulaDaysSetting/:uuid',
					name: 'formulaDaysSetting',
					component: formulaDaysSetting
				},
				{
					path: 'formulaHoursSetting/:uuid',
					name: 'formulaHoursSetting',
					component: formulaHoursSetting
				},
				{
					path: 'formulaYearsSetting/:uuid',
					name: 'formulaYearsSetting',
					component: formulaYearsSetting
				},
				{
					path: 'formulaDatedeltaSetting/:uuid',
					name: 'formulaDatedeltaSetting',
					component: formulaDatedeltaSetting
				},
				{
					path: 'formulaMidSetting/:uuid',
					name: 'formulaMidSetting',
					component: formulaMidSetting
				},
				{
					path: 'formulaTonumberSetting/:uuid',
					name: 'formulaTonumberSetting',
					component: formulaTonumberSetting
				},
				{
					path: 'formulaCountSetting/:uuid',
					name: 'formulaCountSetting',
					component: formulaCountSetting
				},
				{
					path:'formulaMaxSetting/:uuid',
					name:'formulaMaxSetting',
					component:formulaMaxSetting
				},
				{
					path:'formulaMinSetting/:uuid',
					name:'formulaMinSetting',
					component:formulaMinSetting
				},
				{
					path:'formulaIndxSetting/:uuid',
					name:'formulaIndxSetting',
					component:formulaIndxSetting
				},
				{
					path:'formulaGridindxSetting/:uuid',
					name:'formulaGridindxSetting',
					component:formulaGridindxSetting
				},
				{
					path: 'formulaOpsymbolSetting/:uuid',
					name: 'formulaOpsymbolSetting',
					component: formulaOpsymbolSetting
				}
			]
		}

	]
});
