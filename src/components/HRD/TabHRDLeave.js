import React from "react";
import { Tab, Tabs} from 'react-bootstrap';
import '../../css/style.css';
import LeaveCalenderHRD from "./LeaveCalenderHRD";
import TabLeaveReport from "./TabLeaveReport";


class TabHRDLeave extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeTab: props.activeTab || 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  
  render() {
    return (
      <div className="container">
        <Tabs className="myClass" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
        <Tab eventKey={1} title="Leave Report">
            <div className="bg-white content-tab">
                
                <TabLeaveReport/>
            </div>
        </Tab>
        <Tab eventKey={2} title="Leave Calendar">
            <div className="bg-white content-tab">
                <LeaveCalenderHRD/>
            </div>
        </Tab>

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

export default TabHRDLeave;