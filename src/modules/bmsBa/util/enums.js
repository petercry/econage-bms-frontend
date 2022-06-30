import { Enum } from './Enum.js'

/**
 * 全局公共枚举类
 */
export default {
  // uri请求方法
  baInfoKv: new Enum().add('GET', 'GET', 1).add('POST', 'POST', 2).add('PUT', 'PUT', 3).add('DELETE', 'DELETE', 4),

}
