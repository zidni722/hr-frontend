import React from 'react';
import axios from 'axios';
import { createBrowserHistory } from 'history';


export const history = createBrowserHistory();
class GetProfile extends React.Component{
    constructor(props){
        super(props);
        if(localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined  ) {
            this.getProfile();
            this.department();
            this.ListBank();
        }
        this.state = {
            data : null,
            department  : null,
            listBank : null
        }
    }
    ListBank(){
        axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/banks').then(res => {
            this.setState({ listBank : res.data.data });
        })
    }
    getProfile(){
        var token = 'Bearer ' + localStorage.getItem('token');
        axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/users/profile',
            { 'headers': { 'Authorization' : token } 
        }).then(res => {
            this.setState({
                data : res.data.data
            });
            localStorage.setItem('name',res.data.data.name)
        }).catch(error => {
            if(error.response){
                if(error.response.status === 401){
                    localStorage.removeItem('token');
                    console.clear();
                    history.push('/');
                }
            }
        })
    }
    department(){
        axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/departments').then(res => {
            this.setState({
                department  : res.data.data
            })
        })
    }
    
    render(){
        return(
            <div>
                {React.cloneElement(this.props.children, { 
                        data: this.state.data, 
                        department : this.state.department,
                        listBank : this.state.listBank
                    })
                }
            </div>
        )
    }
    
}

export default GetProfile;