import React from "react";
import '../css/style.css';
import PawoonWhite from '../image/logo-pawoon-blue.png';
import GoogleLogo from '../image/gmail.svg';
import { Link } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import axios from 'axios';

class LoginHrd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email : null
        }
        this.responseGoogle = this.responseGoogle.bind(this);
    }

    responseGoogle(response){
        axios.post(process.env.REACT_APP_DEV_BASEURL + `v1/login`, { 
            email : response.profileObj.email
        }).then(res => {
            if(res.data.status === 200){
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('admin',res.data.data.is_hr);
                if(res.data.data.is_hr)
                {
                    //this.props.history.push("/home-hrd");
                    window.location.reload();
                }
                else{
                    alert('You dont have to access this page')
                }
            }
        })
    }
    render(){
        return(
        <div className="login">
            
            <div className="bg-white login-box">
                <div className="text-center">
                    <Link to={this.props.location}>
                         <img src={PawoonWhite} className="white-logo" alt="Pawoon"/>
                    </Link>
                </div>
                <p className="p-3 text-center text-abu">You are on the HRD login page<br/> or back to&nbsp;
                        <Link to="/" className="link">home</Link>
                </p>
                    <GoogleLogin
                        clientId={process.env.REACT_APP_DEV_API_GOOGLE}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} className="link loginas text-black" style={{textAlign : "left",backgroundColor : "white"}}>
                                <img src={GoogleLogo} className="imgas" alt="Gmail"/>
                                    Login with Gmail
                            </button>
                        )}
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}/>
                
                
                <center>
                <p className="text-center text-abu powered">You can only log in with registered account.<br/></p>
                {/* <p className="text-abu text-center powered">All rights reserved by Pawoon.</p> */}
                
                </center>
            </div>
            
            
        </div>
        );
    }
}
export default LoginHrd;