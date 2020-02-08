import React from "react";
import { Tab, Tabs } from 'react-bootstrap';
import '../css/style.css';
import TeamDetail from '../components/TabComponent/TeamDetail';




class TabEmployeeManager extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeTab: props.activeTab || 1,
      edited : false,
      editedPersonal : false,
      editedBenefit : false,
      id_team : null,
      data : {}
    };
    
    // Bind the handleSelect function already here (not in the render function)
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  componentDidMount(){
    
  }
  componentDidUpdate(previousProps){
    if(previousProps.id_team !== this.props.id_team){
      this.setState({id_team : this.props.id_team})
    }
  }
  
  render() {
    
    return (
      <div className="container">
        <Tabs className="myclassName" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
        <Tab eventKey={1} title="Employement Info">
          <div className="bg-white content-tab">
              <div>
                <h4>
                  Employee Info
                </h4>
              <hr/>
              <TeamDetail 
                id_team={this.state.id_team}/>
              </div>
          </div>
        </Tab>
      </Tabs>
      </div>
    );
  }
  
  handleSelect(selectedTab) {
    // The active tab must be set into the state so that
    // the Tabs component knows about the change and re-renders.
    this.setState({
      activeTab: selectedTab,
      edited: false,
      editedPersonal:false,
      editedBenefit:false
    });
  }
}

export default TabEmployeeManager;