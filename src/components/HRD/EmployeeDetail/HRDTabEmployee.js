import React from "react";
import { Tab, Tabs } from 'react-bootstrap';
import '../../../css/style.css';
import HRDEmployeeInfo from '../EmployeeDetail/HRDEmployeeInfo';
import HRDPersonalInfo from '../EmployeeDetail/HRDPersonalInfo';
import HRDBenefitInfo from '../EmployeeDetail/HRDBenefitInfo';
import HRDTabJobHistories from "./HRDTabJobHistories";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class HRDTabEmployee extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeTab: props.activeTab || 1,
      edited : false,
      editedPersonal : false,
      editedBenefit : false,
      editedJobHistories : false,
      modalIsOpen : false,
      name : '',
      data : [],
      id : null
      
    };
    this.handleSelect = this.handleSelect.bind(this);
    
  }
  componentDidUpdate(previousProps){
    if(previousProps.name !== this.props.name){
      this.setState({name : this.props.name, data : this.props.data})
    }
    if(previousProps.id !== this.props.id){
      this.setState({id : this.props.id})
    }
  }
  

  
  render() {

    return (
      <div className="container">
        <ToastContainer/>
        <Tabs className="myclassName" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
        <Tab eventKey={1} title="Employement Info">
          <div className="bg-white content-tab">
              <div>
                <h4>
                  {this.state.name}
                 <i 
                className="fas fa-edit float-right" 
                onClick={()=> this.setState({ edited: !this.state.edited }) }></i>
                </h4>
                
              </div>
              <hr/>
                  
              <HRDEmployeeInfo edited={this.state.edited} modal={this.state.modalIsOpen} data={this.state.data}/>
          </div>
        </Tab>
        <Tab eventKey={2} title="Personal Info">
          <div className="bg-white content-tab">
              <h4>{this.state.name}
                <i 
                className="fas fa-edit float-right" 
                onClick={()=> this.setState({ editedPersonal: !this.state.editedPersonal }) }></i>
              </h4>
              <hr/>
              
              <HRDPersonalInfo edited={this.state.editedPersonal} data={this.state.data}/>
          </div> 
        </Tab>
        <Tab eventKey={3} title="Benefit Info">
          <div className="bg-white content-tab">
            <h4>{this.state.name}
              <i 
                className="fas fa-edit float-right" 
                onClick={()=> this.setState({ editedBenefit: !this.state.editedBenefit }) }></i>
            </h4>
            <hr/>
            <HRDBenefitInfo edited={this.state.editedBenefit} data={this.state.data}/>
          </div>
        </Tab>
        <Tab eventKey={4} title="Job Histories">
          <div className="bg-white content-tab">
            <h4> {this.state.name}
              
            </h4>
            <HRDTabJobHistories edited={this.state.editedJobHistories}  id={this.state.id}/>
          </div>
        </Tab>
      </Tabs>
      </div>
    );
  }
  
  handleSelect(selectedTab) {
    this.setState({
      activeTab: selectedTab,
      edited: false,
      editedPersonal:false,
      editedBenefit:false,
      editedJobHistories : false,
      modalIsOpen : false
    });
  }
}

export default HRDTabEmployee;