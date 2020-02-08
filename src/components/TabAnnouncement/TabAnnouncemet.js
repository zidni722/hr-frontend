import React from "react";
import { Tab, Tabs} from 'react-bootstrap';
import '../../css/style.css';
import ListAnnouncement from "./ListAnnouncement";
import AddAnnouncement from "./AddAnnouncement";



class TabAnnouncemet extends React.Component {
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
        <Tab eventKey={1} title="List Announcements">
            <div className="bg-white content-tab">
                
            <ListAnnouncement/>
            </div>
        </Tab>
        <Tab eventKey={2} title="Add Announcements">
            <div className="bg-white content-tab">
                <AddAnnouncement/>
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

export default TabAnnouncemet;