import {EcoUtil} from '@/components/util/main.js'
let baseUrl = EcoUtil.getBaseUrl();

let sysEnv = 0; //0 测试 1 正式  很重要
let rows = 30;
export{
  baseUrl,sysEnv,rows
}
