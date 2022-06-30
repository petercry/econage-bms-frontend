/**
 * TeamTask类 用于一个团队各人任务列表
 * @author peter
 */
export class  TeamTask {
    
    /**
     * @param {string} id  id
     * @param {string} userName  姓名
     * @param {object} taskColList 各状态的任务列表
     */


    add(id ,userName  ,taskColList ) {
        this[id] = {id ,userName  ,taskColList };
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