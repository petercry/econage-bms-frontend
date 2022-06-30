
/**
 * TableColEl类
 * @author peter
 */
export class  TableColEl {
    
    /**
     * 添加字段
     * 
     * @param {string} desc  描述
     * @param {string} paramName  属性名
     * @param {string} colWidth  列宽
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
     */
    add(desc, paramName,colWidth,kvGroupDesc,isColFixed,isLinkStyle,isSortable) {
        this[paramName] = {desc, paramName,colWidth,kvGroupDesc,isColFixed,isLinkStyle,isSortable};
        return this;
      }
}