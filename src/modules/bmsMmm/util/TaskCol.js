/**
 * TaskCol类 用于展示产品的各状态的需求
 * @author peter
 */
export class  TaskCol {
    
    /**
     * @param {string} colId  状态id
     * @param {string} colName  状态描述
     * @param {object} taskList  列表
     */


    add(colId ,colName ,taskList ) {
        this[colId] = {colId ,colName  ,taskList };
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
                return_e = this[i];
                break;
            }
        }
        return return_e;
    }
}