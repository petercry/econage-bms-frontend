const getters = {
    activityType:state => {
        return state.activityType;
    },
    activityList:state => {
        return state.activityList;
    },
    projectList:state => {
        return state.projectList;
    },
    getProjectName:state => (id) =>{
        if(!id) return '';
        let _find = state.projectList.find(single => single.id == id);
        return _find?_find.name:'';
    },
    getActivityName:state => (id) =>{
        if(!id) return '';
        let _find = state.activityList.find(single => single.id == id);
        return _find?_find.name:'';
    },
    userInfo:state => {
        return state.userInfo;
    }
}
export default getters
