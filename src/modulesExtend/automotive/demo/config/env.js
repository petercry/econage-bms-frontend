import {EcoUtil} from '@/components/util/main.js' //只有引入components下的文件才能用绝对路径
let baseUrl = EcoUtil.getBaseUrl();

let sysEnv = 1; //0 测试 1 正式  很重要
let ecoPubAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTA2MTQ3MTk4OTM2NjAwNTc4IiwiY2xpZW50SWQiOiIxMTIyNzkyNDAzMzUzODAwNzA2Iiwic3ViamVjdFR5cGUiOiJBY2NvdW50SWQiLCJpYXQiOjE1NTcxMTU5OTl9.SigzRl-KrU5foo6B4K-b2I9kIbBDn0wL1IcpMQ4a3v7rutwVFxho_Dd7qK9G4RIUyiANvpPYeFpz0ipxk0X8GBSWmKsWsLcRY3jF6ZX1L6i2Bm4suaOLs2weOSw1PLgo1p7tHXITJJeukordRPRN06KaL93JthKjSKplLHL4lLrojU-0_Yi41IQGrxVS6PFGIk6DEbUr5fRdhcGBZuo9QwCMspgPD88evf3X_sWJ56bskgHeAtdLj6tu5KYU4ozFRfTro_D6Svkhl-ZHHsXKVpkXwDBtKGQNtNfNnqB9wZ7TpSvWCqcuRGj7CqRVFQza_ZE-A7cWdco5jXYQ0xRREw'
let a=1
export{
  baseUrl,sysEnv,ecoPubAuthToken
}
