// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import Frame from './Frame'
import router from './router/router'
import store from './store'
import i18n from './locale' //国际化
import { mapMutations } from 'vuex'
import token from '@/modules/bmsMmm/config/token.js';
Vue.prototype.$ecoToken = token;
/*引入主题*/
// import '../../assets/theme/1ba5fa/index.css'

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/iconfont.css'
// 引入css小部分重置
import './assets/css/main.css'
/*设置默认大小*/

import '../../assets/font-awesome-4.7.0/css/font-awesome.min.css'
import '../bmsMmm/util/taskCard.css';
import './util/page.css';
import '../bmsMmm/util/page.css';
//Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
Vue.prototype.$ELEMENT = { zIndex: 3000 };
Vue.config.productionTip = false
Vue.directive('ckeditor', {
  inserted(el, binding) {
    let value = binding.value;
    value = value.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
      let fileHeaderId = capture;
      let mtToken = token.fileManager.getTempToken();
      const imgPreviewUrl = "/api/file-manager/safe/preview?mt-token=[mtToken]&file-header-Id=[fileHeaderId]";
      let imgSrc = imgPreviewUrl.replace('[mtToken]',mtToken).replace('[fileHeaderId]',fileHeaderId);
      let imgHtml = match.replace(capture,imgSrc);
      return imgHtml;
    });
    el.innerHTML = value;
  }
});
import {
  Pagination,
  Dialog,
  // Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  // Menu,
  // Submenu,
  // MenuItem,
  // MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  // OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  // Breadcrumb,
  // BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  // Tree,
  // Alert,
  // Slider,
  // Icon,
  Row,
  Col,
  Timeline,
  TimelineItem,
  Link,
  Upload,
  Progress,
  Badge,
  Card,
  // Rate,
  // Steps,
  // Step,
  // Carousel,
  // CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  // ColorPicker,
  // Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification,
  Divider,
  Drawer
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
// Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
// Vue.use(Menu);
// Vue.use(Submenu);
// Vue.use(MenuItem);
// Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
// Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
// Vue.use(Breadcrumb);
// Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
// Vue.use(Tree);
// Vue.use(Alert);
// Vue.use(Slider);
// Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Link); 
Vue.use(Divider);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Badge);
Vue.use(Card);
// Vue.use(Rate);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
// Vue.use(ColorPicker);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Drawer);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.use(VueCookies)
import ElementLocale from 'element-ui/lib/locale'
ElementLocale.i18n((key, value) => i18n.t(key, value))


/* eslint-disable no-new */
new Vue({
  el: '#root',
  i18n,
  router,
  store,
  template: '<Frame/>',
  components: { Frame }
})
