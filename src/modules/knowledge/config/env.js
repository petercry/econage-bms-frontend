import {EcoUtil} from '@/components/util/main.js'
let baseUrl = EcoUtil.getBaseUrl();

let rows = 30;
let sysEnv = 0; //0 测试 1 正式

export{
  rows,baseUrl,sysEnv
}
