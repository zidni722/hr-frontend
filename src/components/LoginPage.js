import React from "react";
import '../css/style.css';
import PawoonWhite from '../image/logo-pawoon-blue.png';
import Employee from '../image/man.svg';
import Manager from '../image/manager.svg';
import { Link } from "react-router-dom";


class LoginPage extends React.Component{
    render(){
        
        return(
        <div className="login">
            
            <div className="bg-white login-box">
                <div className="text-center">
                    <img src={PawoonWhite} className="white-logo" alt="LogoPawoon"/>
                </div>
                <p className="p-4 text-center text-abu">Welcome to HRIS Pawoon.</p>
                <Link to="/loginpegawai" className="link loginas text-black">
                    <img src={Employee} className="imgas" alt="Employee"/>
                    Login as Employee
                </Link>
                <Link to="/loginhrd" className="link loginas text-black">
                    <img src={Manager} className="imgas" alt="Manager"/>
                    Login as HRD
                </Link>
                <p className="text-center text-abu powered">All rights reserved by Pawoon.</p>
            </div>
            
            
        </div>
        );
    }
}
export default LoginPage;