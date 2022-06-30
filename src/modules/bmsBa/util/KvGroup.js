
/**
 * KvGroup类
 * @author peter
 */
export class  KvGroup {
    
    /**
     * 添加字段
     * 
     * @param {string} groupDesc  字段名
     * @param {array} kvList  kv列表
     * @param {Object} groupId  group_id值
     */
    add(groupDesc, groupId) {
        let kvList = new Array();
        this[groupDesc] = {kvList, groupId,groupDesc};
        return this;
      }
    
      /**
       * 根据KeyId获取其Value
       * 
       * @param {Object} value 
       */
      getValueByKeyId(keyId , groupDesc) {
        // 字段不存在返回‘’
        if (keyId === undefined || keyId === null) {
          return ''
        }
        let e = this[groupDesc];
        let return_value = Array.from(e.kvList).filter(item=>{return item.id == keyId}).map(item=>item.text).join('');
        return return_value;
      }
      getKvListByGroupDesc(groupDesc){
        //console.log("####getKvListByGroupDesc:" + groupDesc);
        let e = this[groupDesc];
        return Array.from(e.kvList); 
      }
}