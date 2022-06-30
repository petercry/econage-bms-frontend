import {EcoUtil} from '@/components/util/main.js' //只有引入components下的文件才能用绝对路径
let baseUrl = EcoUtil.getBaseUrl();

let sysEnv = 1; //0 测试 1 正式  很重要

export{
  baseUrl,sysEnv,ecoPubAuthToken
}
