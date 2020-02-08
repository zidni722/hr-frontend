import axios from "axios";
var token   = 'Bearer ' + localStorage.getItem('token');
var url     = process.env.REACT_APP_DEV_BASEURL + 'v1/users/profile';

export default function(){
    return axios.get(url,{'headers' : {'Authorization' : token}}).then(res=>{
        return res.data.data.is_reporting_manager
    })    
}

export function isLead(){
    return axios.get(url,{'headers' : {'Authorization' : token}}).then(res=>{
        return res.data.data.is_lead
    })  
}


export function idDepartment(){
    return axios.get(url,{'headers' : {'Authorization' : token}}).then(res=>{
        return res.data.data.title.department.id
    })
}
