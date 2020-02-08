import React from "react";
import axios from 'axios';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

class Layout extends React.Component{
    constructor(props){
        super(props);
        if(localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined) {
            this.getProfile();
        }
    }

    getProfile(){
        var token = 'Bearer ' + localStorage.getItem('token');
        axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/users/profile',
            { 'headers': { 'Authorization' : token } 
        }).catch(error => {
            if(localStorage.getItem('token') === null){
                if(error.response){
                    if(error.response.status === 401){
                        //localStorage.removeItem('token');
                        history.push('/');
                        console.clear();
                    }
                }
            }
            else{
                window.location.reload();
            }
            
        })
    }
    render(){
        return(
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default Layout;