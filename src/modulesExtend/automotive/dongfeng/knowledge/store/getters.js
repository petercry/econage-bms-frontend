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
        return state.projectList.find(single => single.id == id).name || '';
    },
    getActivityName:state => (id) =>{
        if(!id) return '';
        return state.activityList.find(single => single.id == id).name || '';
    }
}
export default getters
