
/**
 * FormItemEl类 用于表单填写页
 * @author peter
 */
export class  FormItemEl {

    /**
     * 添加字段
     *
     * @param {string} desc  描述
     * @param {string} paramName  属性名
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isWholeRow  是否占满整行，为“否”则默认两个元素一行
     * @param {string} eleType  组件类型 date\time\textarea
     */
    add(desc, paramName,kvGroupDesc,isWholeRow,eleType) {
        this[paramName] = {desc, paramName,kvGroupDesc,isWholeRow,eleType};
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
