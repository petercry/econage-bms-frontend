const getters = {
    baseData:state => {
        return state.baseData;
    },
    getBaseDataTextByKey:state => (id,key) => {
        if(!id || !key) return '';
        let _find = state.baseData[key].find(single => single.id == id);
        return _find?_find.text:'';
    },
    majorType:state => {
        return state.majorType;
    },
    roleType:state => {
        return state.roleType;
    },
    groupType:state => {
        return state.groupType;
    },
    roleList:state => {
        return state.roleList;
    },
    roleListGroup:state => {
        return state.roleListGroup;
    },
    deliverType:state => {
        return state.deliverType;
    },
    getDeliverTypeText:state => (id) => {
        if(!id) return '';
        let _find = state.deliverType.find(single => single.id == id);
        return _find?_find.text:'';
    },
    typeImgList:state =>{
        return state.typeImgList;
    },
    projectInfo:state => {
        return state.projectInfo;
    },
    milesRoleEdit:state => {
        if(!state.milesRole) return false;
        if(Object.keys(state.milesRole).length == 0) return true;
        if(state.milesRole['admin'] || state.milesRole['edit']){
            return true;
        }else{
            return false;
        }
    },
    milesRoleAdd:state => {
        if(!state.milesRole) return false;
        if(Object.keys(state.milesRole).length == 0) return true;
        if(state.milesRole['admin'] || state.milesRole['add']){
            return true;
        }else{
            return false;
        }
    },
    milesRoleDelete:state => {
        if(!state.milesRole) return false;
        if(Object.keys(state.milesRole).length == 0) return true;
        if(state.milesRole['admin'] || state.milesRole['delete']){
            return true;
        }else{
            return false;
        }
    },
    groupRoleEdit:state => {
        if(!state.groupRole) return false;
        if(Object.keys(state.groupRole).length == 0) return true;
        if(state.groupRole['admin'] || state.groupRole['edit']){
            return true;
        }else{
            return false;
        }
    },
    groupRoleAdd:state => {
        if(!state.groupRole) return false;
        if(Object.keys(state.groupRole).length == 0) return true;
        if(state.groupRole['admin'] || state.groupRole['add']){
            return true;
        }else{
            return false;
        }
    },
    groupRoleDelete:state => {
        if(!state.groupRole) return false;
        if(Object.keys(state.groupRole).length == 0) return true;
        if(state.groupRole['admin'] || state.groupRole['delete']){
            return true;
        }else{
            return false;
        }
    },
    milesType:state => {
        return state.milesType;
    },
    activityList:state => {
        return state.activityList;
    },
    userInfo:state => {
        return state.userInfo;
    }
}
export default getters
