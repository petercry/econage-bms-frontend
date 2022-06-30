
/**
 * DataCompareEl类 用于存放新旧值，用于操作记录
 * @author peter
 */
export class  DataCompareEl {
    
    /**
     * 添加字段
     * 
     * @param {string} field  字段标识（一般和数据库字段或bean属性一致）
     * @param {string} fieldDesc   字段描述
     * @param {string} oldValue  
     * @param {string} newValue
     */
    add(field, fieldDesc,oldValue,newValue) {
        this[field] = {field,fieldDesc, oldValue,newValue};
        return this;
    }
    getLength() {
        let idx = 0;
        for (let i in this) {
            idx++;
        }
        return idx;
    }
    getNodeByIdx(checkIdx){
        let idx = 0;
        let return_e;
        for (let i in this) {
            if(idx < checkIdx){
                idx++;
                continue;
            }else if(idx == checkIdx){
                //console.log("hit it!idx:" +idx+"i:"+i.desc+"##isWholeRow:"+i.isWholeRow);
                return_e = this[i];
                break;
            }
        }
        return return_e;
    }
}