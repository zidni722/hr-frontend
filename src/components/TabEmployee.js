import React from "react";
import { Tab, Tabs, Alert } from 'react-bootstrap';
import EmployeeInfo from '../components/TabComponent/EmployeeInfo';
import PersonalInfo from '../components/TabComponent/PersonalInfo';
import BenefitInfo from '../components/TabComponent/BenefitInfo';
import GetProfile from "../action/GetProfile";
import Axios from "axios";
import ReactPaginate from 'react-paginate';

class TabEmployee extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeTab: props.activeTab || 1,
      edited : false,
      editedPersonal : false,
      editedBenefit : false,
      announcement : [],
      page : 1,
      totalPage : 1,
      showPaginate : false,
      showAnnouncement : false
    };
    
    this.handleSelect = this.handleSelect.bind(this);
    this.handleAnnouncement = this.handleAnnouncement.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  handlePageClick = data => {
    let selected = data.selected + 1;
    this.setState({ page: selected }, () => {
        this.handleAnnouncement();
      });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  handleAnnouncement(){
    var url = process.env.REACT_APP_DEV_BASEURL + "v1/announcements?paging=true&page=" + this.state.page
    Axios.get(url).then(res => {
      this.setState({announcement : res.data.data.records, totalPage : res.data.data.total_page})
      res.data.data.total_page <= 1 === true ? this.setState({showPaginate : false}) : this.setState({showPaginate : true})
      res.data.data.total_record === 0 ? this.setState({showAnnouncement : false}) : this.setState({showAnnouncement : true})
    })
  }
  componentDidMount(){
    this.handleAnnouncement();
  }
  
  render() {
    
    const announcement = this.state.announcement.map((data) => {
      return (
          <div>
            <p style={{color : "black", fontSize: "17px"}}> 
              <b>{data.title} : </b>{data.description}</p>
          </div>
      )
    })
    return (
      <div className="container">
        {
          this.state.showAnnouncement === true ? 
            <Alert variant="info">
              <h4>Announcements</h4>
              <hr/>
              {announcement}
              <div className="float-right">
                  {
                    this.state.showPaginate === true ? 
                      <ReactPaginate
                        previousLabel={'‹'}
                        nextLabel={'›'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        pageCount={this.state.totalPage}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'page-link'}
                        activeClassName={'pageactive'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        className={ this.state.loading ? "opacity hide" : "page-link"  }
                      />
                    : undefined
                  }
              </div>
            <div className="clearfix"></div>
            </Alert>
          : undefined
        }
        
        
        <Tabs className="myclassName" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
        <Tab eventKey={1} title="Employee Info">
          <div className="content-tab">
              <div>
                
                <h4>
                  Employee Info
                <i 
                className="fas fa-edit float-right" 
                onClick={()=> this.setState({ edited: !this.state.edited }) }></i>
                </h4>
                
              
              <hr/>
              <GetProfile>
              <EmployeeInfo 
                edited={this.state.edited} 
                data={this.props.data}
                department = {this.props.department}/>
              
              </GetProfile>
              </div>
          </div>
        </Tab>
        <Tab eventKey={2} title="Personal Info">
          <div className="bg-white content-tab">
              <h4>Personal Info
              <i 
                className="fas fa-edit float-right" 
                onClick={()=> this.setState({ editedPersonal: !this.state.editedPersonal }) }></i>
              </h4>
              <hr/>
              <GetProfile>
                <PersonalInfo 
                  edited={this.state.editedPersonal}
                  data={this.props.data}/>
              </GetProfile>
              
          </div> 
        </Tab>
        <Tab eventKey={3} title="Benefit Info">
          <div className="bg-white content-tab">
            <h4>Benefit Info
            <i 
                className="fas fa-edit float-right" 
                onClick={()=> this.setState({ editedBenefit: !this.state.editedBenefit }) }></i>
            </h4>
            <hr/>
            <GetProfile>
              <BenefitInfo 
                edited={this.state.editedBenefit}
                data={this.props.data}
                listBank={this.props.listBank}/>
            </GetProfile>
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
      editedBenefit:false
    });
  }
}

export default TabEmployee;