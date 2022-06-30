import {EcoUtil} from '@/components/util/main.js'
let baseUrl = EcoUtil.getBaseUrl();

let sourceUrl = '';
let baseMainServerUrl = '/wh/servlet/MainServer';
let baseFileDownloadServletUrl = '/wh/servlet/FileDownload';

let rows = 30;
let sysEnv = 1; //0 测试 1 正式
let decimal = 100 //两位有效数字

export{
  rows,baseUrl,baseMainServerUrl,baseFileDownloadServletUrl,sysEnv,decimal,sourceUrl
}
