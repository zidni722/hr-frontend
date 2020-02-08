import axios from 'axios';
var token   = 'Bearer ' + localStorage.getItem('token');
var url     = process.env.REACT_APP_DEV_BASEURL + 'v1/users/profile';

export default function(){
    return axios.get(url,{'headers' : {'Authorization' : token}}).then(res=>{
        return res.data.data.name
    })    
}
