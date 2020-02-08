import React from "react";
import { Tab, Tabs } from 'react-bootstrap';
import '../css/style.css';
import LeaveHistoryDetailHRD from "./TabLeave/LeaveHistoryDetailHRD";
import LeaveSummaryDetail from '../components/TabLeave/LeaveSummaryDetail';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class HRDDetailTabLeave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      activeTab: props.activeTab || 1,
      data : null
    };
    
    this.handleSelect = this.handleSelect.bind(this);
  }
  
  onChange = date => this.setState({ date })
  
  componentDidUpdate(previousProps){
    if(previousProps.data !== this.props.data){
      this.setState({data : this.props.data})
    }
  }

  render() {
    return (
      <div className="container">
        <ToastContainer />
        <Tabs className="myClass" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
        <Tab eventKey={1} title="Leave History">
            <div className="bg-white content-tab">
                <h4>Leave Summary</h4>
                <hr/>
                <LeaveSummaryDetail id={this.state.data}/>
                <h4>Leave History</h4>
                <hr/>
                <LeaveHistoryDetailHRD data={this.state.data}/>
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

export default HRDDetailTabLeave;