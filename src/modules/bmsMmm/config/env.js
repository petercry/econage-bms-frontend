import {EcoUtil} from '@/components/util/main.js'
let baseUrl = EcoUtil.getBaseUrl();

let sysEnv = 1; //0 测试 1 正式  很重要
let ecoPubAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYy4xMjkyNDc1NzkwNTE0OTI1NTY5IiwicHQiOjEsImV4cCI6MTYwMDIyMjE1MywianRpIjoiMTMwNTc4MDY5OTg2MzI0MDcwNiJ9.6ME8EdsnPNjcptKw9IX-E48YYCc3c0nKErC8nb6l_Js'
export{
  baseUrl,sysEnv,ecoPubAuthToken
}