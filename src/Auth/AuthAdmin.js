import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Axios from 'axios';


var token = 'Bearer ' + localStorage.getItem('token');


var url = process.env.REACT_APP_DEV_BASEURL + "v1/hr/calendars/" + "2010-10-10";
// var isAdmin;
// var isis = true

function checkAdmin (){
    
    return Axios.get(url,{'headers' : {'Authorization' : token}}).then(() => {
        localStorage.setItem('admin',true)
    }).catch(() => {
        localStorage.removeItem('admin');
        
       // <Redirect to={{ pathname: '/' }}/>
    })
} 


export var AuthenticatedAdmin = ({ component: Component, ...rest }) => (
    
    checkAdmin(),
    <Route {...rest} render={props => (
        localStorage.getItem('admin') === "true" ?
        ( <Component {...props}/>)
        :
        ( <Redirect to={{ pathname: '/home' }}/>)
        
    )} />

)