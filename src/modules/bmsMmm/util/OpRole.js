/**
 * OpRole类 用于操作权限
 * @author peter
 */
export class  OpRole {
    
    /**
     * @param {string} role_key 标识，如addTask 
     * @param {string} role_id  后端标识，如bms.task.bmsDevTask_bms.task.addTask
     * @param {boolean} flag  
     */


    add(role_key ,role_id ,flag) {
        this[role_key] = {role_key ,role_id ,flag };
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