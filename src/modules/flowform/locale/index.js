import Vue from 'vue'
import VueCookies from 'vue-cookies'
import VueI18n from 'vue-i18n'
import customZhCn from './lang/zh-CN'
import customJa from './lang/ja'
import customEn from './lang/en'
import zhCnLocale from 'element-ui/lib/locale/lang/zh-CN'
import jaLocale from 'element-ui/lib/locale/lang/ja'
import enLocale from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)
const navLang = navigator.language

console.log(VueCookies.get('language'));
let lang = VueCookies.get('language') || 'zh-CN'

if(lang == 'cn'){lang = 'zh-CN'} //中文
else if(lang == 'jp'){lang = 'ja'}; //日文
console.log(lang);

Vue.config.lang = lang

// vue-i18n 6.x+写法
Vue.locale = () => {}
const messages = {
  'zh-CN': Object.assign(zhCnLocale, customZhCn),
  'ja': Object.assign(jaLocale, customJa),
  'en': Object.assign(enLocale, customEn),
}
const i18n = new VueI18n({
  locale: lang,
  messages
})

export default i18n
