import React from "react";
// import '../css/style4.css';
import PawoonWhite from '../image/logo-pawoon-blue.png';
import Ava from '../image/ava-boy.png';
import { Link } from "react-router-dom";
import TabEmployee from "./TabEmployee";
import MediaQuery from 'react-responsive';
import isManager from '../action/LeadManager';
import GetName from '../action/GetName';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Home extends React.Component{
    constructor(props){
        super();
        this.state = {
            
            active      :   false,
            isManager   :   false,
            name        :   ''
        }
        isManager().then(data =>{
            this.setState({isManager : data})
        })  
        GetName().then(data => {
            this.setState({name : data})
        })
    }
    
    render(){
        
        return(
            <div className="wrapper">
                <ToastContainer />
                <nav id="sidebar" className={this.state.active ? 'active' : undefined}>
                    <div className="sidebar-header">
                        <h3><img src={PawoonWhite} alt="LogoPawoon"/></h3>
                        <img src={Ava} alt="Avatar"/>
                        <center>
                            <Link 
                                to={this.props.location} 
                                className="dropdown-toggle" 
                                data-toggle="dropdown" 
                                role="button" 
                                aria-haspopup="true" 
                                aria-expanded="false">
                                {this.state.name}


                            </Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/logout">
                                        <i className="fa fa-power-off" aria-hidden="true"></i>
                                            Logout
                                    </Link>
                                </li>
                            </ul>
                        </center>    
                    </div>
                    <ul className="list-unstyled components">
                        <li className="active link-top">
                            <Link to="/home" >
                                Employee Data
                            </Link>
                        </li>
                        <li>
                            <Link to="/leave">
                                Leave System
                            </Link>
                        </li>
                        {this.state.isManager && <li>
                            <Link to="/team">
                                Team Data
                            </Link>
                        </li>}
                    </ul>
                </nav>

                
                <div id="content">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                        <MediaQuery query="(min-width: 768px)">
                            <div 
                                id="sidebarCollapseLeft" 
                                onClick={()=>this.state.active ? this.setState({active:false}) : this.setState({active:true})}>
                                <i className={this.state.active ? 'fas fa-align-justify' : 'fas fa-arrow-left'}></i>
                            </div>
                        </MediaQuery>
                        <MediaQuery query="(max-width: 1024px)">
                            <div 
                                id="sidebarCollapseLeft" 
                                onClick={()=>this.state.active ? this.setState({active:false}) : this.setState({active:true})}>
                                <i className={this.state.active ? 'fas fa-arrow-left' : 'fas fa-align-justify'}></i>
                            </div>
                        </MediaQuery>
                        </div>
                    </nav>
                    <TabEmployee/>
                </div>
            </div>
        );
    }
}
export default Home;