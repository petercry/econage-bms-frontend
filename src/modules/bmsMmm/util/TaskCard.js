/**
 * TaskCard类 用于任务列表
 * @author peter
 */
export class  TaskCard {
    
    /**
     * @param {string} seq_num  编号
     * @param {string} content  内容
     * @param {string} status_id  状态
     * @param {string} date  日期
     * @param {string} manHour  工时
     * @param {string} percent  完成百分比
     * @param {string} sourceDesc  来源（项目）
     * @param {integer} typeId  来源（项目）
     * @param {integer} isAdmin  是否管理权限
     * @param {string} cardTypeProp 卡片类型（T：任务；R：需求）  
     * @param {integer} childrenCount 子任务数
     * @param {integer} taskCalendarId 日程id（任务被列入日程中，未列入则为空）
     * @param {integer} priority 优先级
     */


    add(seq_num ,content ,status_id ,date ,manHour ,percent,sourceDesc,typeId,isAdmin,cardTypeProp,childrenCount,taskCalendarId,priority) {
        this[seq_num] = {seq_num ,content ,status_id ,date ,manHour ,percent,sourceDesc,typeId,isAdmin,cardTypeProp,childrenCount,taskCalendarId,priority};
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