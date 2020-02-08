import React from "react";
import { Tab, Tabs } from 'react-bootstrap';
import '../css/style.css';
import LeaveSummary from '../components/TabLeave/LeaveSummary';
import LeaveHistory from "./TabLeave/LeaveHistory";
import ApplyLeave from "./TabLeave/ApplyLeave";
import LeaveApproval from "./TabLeave/LeaveApproval";
import LeaveCalenderManager from "./TabLeave/LeaveCalenderManager";
import LeaveCalenderPersonal from "./TabLeave/LeaveCalenderPersonal";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetProfile from "../action/GetProfile";


class TabLeave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      activeTab: props.activeTab || 1,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  
  onChange = date => this.setState({ date })
  

  render() {
    
    return (
      <div className="container">
        <ToastContainer />
        <Tabs className="myClass" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
        <Tab eventKey={1} title="Leave History">
            <div className="bg-white content-tab">
                <h4>Leave Summary</h4>
                <hr/>
                <LeaveSummary/>
                <h4>Leave History</h4>
                <hr/>
                <LeaveHistory/>
            </div>
        </Tab>
        <Tab eventKey={2} title="Apply Leave">
            <div className="bg-white content-tab">
                <h4>Apply Leave</h4>
                <hr/>
                <ApplyLeave/>
            </div>
        </Tab>
        <Tab eventKey={3} title="Leave Calendar">
          <div className="bg-white content-tab">
                <h4>Leave Calendar</h4>
                <hr/>
                <div style={{marginBottom : "15px"}}> 
                <center>
                  <i className="fas fa-circle" style={{color: "red"}}></i> : Public Holiday &nbsp;  &nbsp;
                  <i className="fas fa-circle" style={{color: "limegreen"}}></i> : Approved  &nbsp;  &nbsp;
                  <i className="fas fa-circle" style={{color: "#F7EB01"}}></i> : Pending &nbsp;  &nbsp;
                  <i style={{textDecoration : "line-through"}}><b>Date</b></i> : Reject 
                </center>
                </div>
                
                <LeaveCalenderPersonal/>
          </div>
        </Tab>
        {this.props.isManager === true || this.props.isLead === true ? 
          
          <Tab eventKey={4} title="Leave Approval">
          <div className="bg-white content-tab">
               <div style={{marginBottom : "50px"}}>
                  <h4>Leave History</h4>
                  <hr/>
                  <GetProfile>
                    <LeaveApproval/>
                  </GetProfile>
               </div>
                <div>
                  <h4>Leave Calender</h4>
                  <hr/>
                <div>
                    <LeaveCalenderManager/>
                  </div>
                </div>
          </div>
          </Tab>
          
          : undefined}
      </Tabs>
      </div>
    );
  }
  
  handleSelect(selectedTab) {
    this.setState({
      activeTab: selectedTab
    });
  }
}

export default TabLeave;