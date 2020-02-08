import React from 'react';
import { 
    BrowserRouter as Router, 
    Route,Switch, Redirect
} from "react-router-dom";
import LoginPage from './components/LoginPage';
import LoginPegawai from './components/LoginPegawai';
import LoginHrd from './components/LoginHrd';
import Home from './components/Home';
import HomeLeave from './components/HomeLeave';
import HomeTeam from './components/HomeTeam';
import HomeHRD from './components/HomeHRD';
import HomeHRDLeave from './components/HomeHRDLeave';
import HRDDetailEmployee from './components/HRDDetailEmployee';
import HRDDetailLeave from './components/HRDDetailLeave';
import HomeHRDAdd from './components/HomeHRDAdd';
import { Authenticated } from './Auth/Auth';
import { UnAuthenticated } from './Auth/UnAuth';
import { AuthenticatedAdmin } from './Auth/AuthAdmin'
import HomeTeamDetail from './components/HomeTeamDetail';
import HomeHRDAnnouncement from './components/HomeHRDAnnouncement';

const NotFound = () => (
    <div>
      <h3>404 NOT FOUND</h3>
    </div>
)

const Logout = () => {
    localStorage.clear();
    
    return <Redirect to={{ pathname: '/home' }}/>
}


const MainRouter = () => (
    <Router>
        <Switch>
            <UnAuthenticated exact path="/" component={LoginPage} />
            <UnAuthenticated exact path="/loginpegawai" component={LoginPegawai} />
            <UnAuthenticated exact path="/loginhrd" component={LoginHrd} />
            <Route path="/logout" component={Logout}/>
            <Authenticated exact path="/home" component={Home}/>
            <Authenticated exact path="/leave" component={HomeLeave}/>
            <Authenticated exact path="/team" component={HomeTeam}/>
            <Authenticated exact path='/teamdetail/:id' component={HomeTeamDetail}/>
            <AuthenticatedAdmin exact path="/home-hrd" component={HomeHRD}/>
            <AuthenticatedAdmin exact path='/leave-hrd' component={HomeHRDLeave}/>
            <AuthenticatedAdmin exact path='/detail-employee/:id' component={HRDDetailEmployee}/>
            <AuthenticatedAdmin exact path='/detail-leave/:id' component={HRDDetailLeave}/>
            <AuthenticatedAdmin exact path='/add-employee' component={HomeHRDAdd}/>
            <AuthenticatedAdmin exact path='/announcement' component={HomeHRDAnnouncement}/>
            <Route exact component={NotFound}/>
        </Switch>

    </Router>
);
export default MainRouter;