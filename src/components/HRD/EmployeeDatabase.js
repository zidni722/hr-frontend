import React from "react";
import '../../css/style.css';
import {Table,Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {Form} from 'react-bootstrap';
import {CSVLink} from 'react-csv';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import Axios from "axios";

var moment = require('moment-business-days');
var bigInt = require("big-integer");
var token   = "Bearer " + localStorage.getItem('token');
const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '30%'
  }
};

var url = "";
var department_id = "";
class EmployeeDatabase extends React.Component {
  constructor(){
    super();
    this.keywordId = React.createRef();
    this.keywordName = React.createRef();
    this.csvLink = React.createRef();
    this.state = {
      loading : false,
      page : 1,
      totalPage : 1,
      employee_id : "",
      employee_name : "",
      datasPerPage: 50,
      datas : [],
      depart :[],
      modalIsOpen: false,
      export : [],
      showButton : false,
      loadingExport : false
    };
    this.loadData = this.loadData.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.export = this.export.bind(this);
    this.servicePeriod = this.servicePeriod.bind(this);
    this.exportLeave = this.exportLeave.bind(this);
  }
  servicePeriod(date){
    var d1= new Date();
    var d2= new Date(date)

    var m = moment(d1);
    var years = m.diff(d2, 'years');
    m.add(-years, 'years');
    var months = m.diff(d2, 'months');
    m.add(-months, 'months');
    var days = m.diff(d2, 'days');
    var servicePeriod = null;
    if (years <= 0) servicePeriod  = months + " Months " + days + " Days"
    if (years > 0) servicePeriod  = years + " Years " + months + " Months " + days + " Days"
    if (months <= 0 ) servicePeriod  = days + " Days"

    return servicePeriod
  }

  exportLeave(){
    var url = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/all-leave'
    this.setState({loading : true})
    Axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
      const data = res.data.data.map((data,index) => {
        return(
          {
            No : index+1,
            EmployeeID : data.user.employee_id,
            EmployeeName : data.user.name,
            Department : data.user.title.department.name,
            Title : data.user.title.name,
            LeaveType : data.leave_type.name,
            StartDate : data.start_date,
            EndDate : data.end_date,
            Duration : data.duration,
            Description : data.description,
            Proof : data.proof ,
            Status : data.status
          }
        );
      })

      this.setState({export : data, loading : false}, () => {
        this.csvLink.current.link.click()
      });
    })
  }
  
  export(i){
    this.setState({loadingExport : true, showButton : false})
    var url = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/users/export?employee-id='+ 
              this.state.employee_id +'&employee-name='+ this.state.employee_name +'&department-id=' + department_id
    Axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
      if(i === 1){
        const filter = res.data.data.map((data,index) => {
          var service_period = this.servicePeriod(data.join_date)
          return(
            { 
              No : index+1,
              employee_id : data.EmployeeID,
              employee_name : data.name,
              department : data.title.department.name,
              title : data.title.name,
              employee_status : data.status,
              employee_type : data.type,
              join_date : data.join_date,
              service_period : service_period,
              end_1st_contract : data.contracts.length === 1 ? data.contracts[0].end_date : "",
              end_2nd_contract : data.contracts.length >= 2 ? data.contracts[1].end_date : "",
              location : data.location !== null ? data.location.name : "",
              direct_manager_name : data.reporting_manager !== null ? data.reporting_manager.name : "",
              hr_bp_name : data.hr_bp !== null ? data.hr_bp.name : "",
              office_email : data.office_email,
            }
          );
          
        })
        this.setState({export : filter}, () => this.setState({showButton : true, 
          loadingExport : false}))
      }

      if(i === 2){
        const filter = res.data.data.map((data,index) => {
          var national_id = String(data.national_id)
          var spouse_national_id = null
          if(data.spouses.length === 1) {
            spouse_national_id = String(data.spouses[0].national_id)
          }
          return (
            {
              No : index+1,
              employee_id : data.EmployeeID,
              employee_name : data.name,
              personal_email : data.personal_email,
              tax_status : data.tax_status,
              gender : data.gender,
              place_of_birth : data.place_of_birth,
              date_of_birth : data.date_of_birth,
              religion : data.religion.name,
              marital_status : data.marital_status,
              phone_number : data.phone,
              national_id : national_id,
              address : data.address,
              current_address : data.current_address,
              spouse_name : data.spouses.length === 1 ? data.spouses[0].name : "",
              spouse_gender : data.spouses.length === 1 ? data.spouses[0].gender : "",
              spouse_date_of_birth : data.spouses.length === 1 ? data.spouses[0].date_of_birth : "",
              spouse_national_id : data.spouses.length === 1 ? spouse_national_id + " ": "",
              first_child_name : data.childrens.length >= 1 ? data.childrens[0].name : "",
              first_child_gender : data.childrens.length >= 1 ? data.childrens[0].gender : "",
              first_child_date_of_birth : data.childrens.length >= 1 ? data.childrens[0].date_of_birth : "",
              second_child_name : data.childrens.length >= 2 ? data.childrens[1].name : "",
              second_child_gender : data.childrens.length >= 2 ? data.childrens[1].gender : "",
              second_child_date_of_birth : data.childrens.length >= 2 ? data.childrens[1].date_of_birth : "",
              third_child_name : data.childrens.length === 3 ? data.childrens[2].name : "",
              third_child_gender : data.childrens.length === 3 ? data.childrens[2].gender : "",
              third_child_date_of_birth : data.childrens.length === 3 ? data.childrens[2].date_of_birth : "",
            }
          )
        })
        this.setState({export : filter}, () => this.setState({showButton : true, 
          loadingExport : false}))
      }
      if( i === 3){
        const filter = res.data.data.map((data,index) => {
          return (
            {
              No : index +1 ,
              employee_id : data.EmployeeID,
              employee_name : data.name,
              npwp : data.npwp,
              bpjs_ketenagakerjaan : data.bpjs_tenagakerja,
              bpjs_kesehatan : data.bpjs_kesehatan,
              bank_account : data.user_banks.length > 0 ? data.user_banks[0].bank_account : "",
              bank_name : data.user_banks.length > 0 ? data.user_banks[0].bank.name : "",
              beneficiary_name: data.user_banks.length > 0 ? data.user_banks[0].beneficiary_name : "",
            }
          )
        })
        this.setState({export : filter}, () => this.setState({showButton : true, 
          loadingExport : false}))
      }
      if(i === 4){
        var filter = res.data.data.map((data,index) => {
          
          return (
            {
              No : index + 1,
              employee_id : data.EmployeeID,
              employee_name : data.name,
            }
          )
        })
        for(var key = 0 ; key < res.data.data.length ; key ++){
          res.data.data[key].job_histories.map((data,index) => {
            var index = index + 1
            var title = "title_" + index;
            var transfer_date = "transfer_date_" + index;
            var probation_end_date = "probation_end_date_" +index;
            var probation_review_date = "probation_review_date_" + index
            return (
              filter[key] = {
                ...filter[key], 
                [title] : data.title.name, 
                [transfer_date] : data.transfer_date,
                [probation_end_date] : data.probation_end_date,
                [probation_review_date] : data.probation_review_date
              }
            )
          })
          key++;
        }
        this.setState({export : filter}, () => this.setState({showButton : true, 
          loadingExport : false}))
      }
      if(i === 0 ){
        var filter = res.data.data.map((data,index) => {
          var service_period = this.servicePeriod(data.join_date)
          var national_id1 = bigInt(data.national_id)
          return (
            {
              No : index + 1,
              employee_id : data.EmployeeID,
              employee_name : data.name,
              department : data.title.department.name,
              title : data.title.name,
              employee_status : data.status,
              employee_type : data.type,
              join_date : data.join_date,
              service_period : service_period,
              end_1st_contract : data.contracts.length === 1 ? data.contracts[0].end_date : "",
              end_2nd_contract : data.contracts.length >= 2 ? data.contracts[1].end_date : "",
              location : data.location !== null ? data.location.name : "",
              direct_manager_name : data.reporting_manager !== null ? data.reporting_manager.name : "",
              hr_bp_name : data.hr_bp !== null ? data.hr_bp.name : "",
              office_email : data.office_email,
              personal_email : data.personal_email,
              tax_status : data.tax_status,
              gender : data.gender,
              place_of_birth : data.place_of_birth,
              date_of_birth : data.date_of_birth,
              religion : data.religion.name,
              marital_status : data.marital_status,
              phone_number : data.phone,
              national_id : national_id1,
              address : data.address,
              current_address : data.current_address,
              spouse_name : data.spouses.length === 1 ? data.spouses[0].name : "",
              spouse_gender : data.spouses.length === 1 ? data.spouses[0].gender : "",
              spouse_date_of_birth : data.spouses.length === 1 ? data.spouses[0].date_of_birth : "",
              spouse_national_id : data.spouses.length === 1 ? data.spouses[0].national_id + " " : "",
              first_child_name : data.childrens.length >= 1 ? data.childrens[0].name : "",
              first_child_gender : data.childrens.length >= 1 ? data.childrens[0].gender : "",
              first_child_date_of_birth : data.childrens.length >= 1 ? data.childrens[0].date_of_birth : "",
              second_child_name : data.childrens.length >= 2 ? data.childrens[1].name : "",
              second_child_gender : data.childrens.length >= 2 ? data.childrens[1].gender : "",
              second_child_date_of_birth : data.childrens.length >= 2 ? data.childrens[1].date_of_birth : "",
              third_child_name : data.childrens.length === 3 ? data.childrens[2].name : "",
              third_child_gender : data.childrens.length === 3 ? data.childrens[2].gender : "",
              third_child_date_of_birth : data.childrens.length === 3 ? data.childrens[2].date_of_birth : "",
              npwp : data.npwp,
              bpjs_ketenagakerjaan : data.bpjs_tenagakerja,
              bpjs_kesehatan : data.bpjs_kesehatan,
              bank_account : data.user_banks.length > 0 ? data.user_banks[0].bank_account : "",
              bank_name : data.user_banks.length > 0 ? data.user_banks[0].bank.name : "",
              beneficiary_name: data.user_banks.length > 0 ? data.user_banks[0].beneficiary_name : "",
            }
          )
        })
        for(var key = 0 ; key < res.data.data.length ; key ++){
          res.data.data[key].job_histories.map((data,index) => {
            var index = index + 1
            var title = "title_" + index;
            var transfer_date = "transfer_date_" + index;
            var probation_end_date = "probation_end_date_" +index;
            var probation_review_date = "probation_review_date_" + index
            return (
              filter[key] = {
                ...filter[key], 
                [title] : data.title.name, 
                [transfer_date] : data.transfer_date,
                [probation_end_date] : data.probation_end_date,
                [probation_review_date] : data.probation_review_date
              }
            )
          })
          key++;
        }
        this.setState({export : filter}, () => this.setState({showButton : true, 
          loadingExport : false}))
      }

      
    })
    
  }

  closeModal() {
    this.setState({modalIsOpen: false, showButton : false});
  }

  componentDidMount(){
    this.loadData();
    url = process.env.REACT_APP_DEV_BASEURL + 'v1/departments'
    axios.get(url).then(res => {
      this.setState({depart : res.data.data})
    })
  }

  loadData(){
    this.setState({loading : true})
    url = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/users?paging=true&page='+ this.state.page+'&limit=50&employee-id='+ 
          this.state.employee_id +'&employee-name='+ this.state.employee_name +'&department-id=' + department_id
    axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
      this.setState({datas : res.data.data.records, loading : false, totalPage : res.data.data.total_page });
    })
  }
  handleEnter(e){
    if (e.key === 'Enter'){
      this.loadData();
    }
  }
  handleSelect(){
    department_id = this.refs.department.value;
    this.loadData();
  }
  handlePageClick = data => {
    let selected = data.selected + 1;
    this.setState({ page: selected }, () => {
        this.loadData();
      });
    window.scrollTo(0, 0)
  };
  
  render() {
      
    const renderDepartment = this.state.depart.map((data,index) =>{
      return(
        <option value={data.id} key={index}>{data.name}</option>
      );
    })
     const renderData = this.state.datas.map((data, index) => {
         return (
            <tr 
            key={index} >
              <td className={ this.state.loading ? "opacity" : undefined  }>{data.employee_id}</td>
              <td className={ this.state.loading ? "opacity" : undefined  }>{data.name}</td>
              <td className={ this.state.loading ? "opacity" : undefined  }>{data.title && data.title.department.name}</td>
              <td align="center" className={ this.state.loading ? "opacity" : undefined  }>
                <Button variant="primary" style={{marginRight : "10px"}}>
                  <Link to={"/detail-employee/"+data.id}>
                    Detail
                  </Link>
                </Button>
                <Button variant="light">
                  <Link to={"/detail-leave/"+data.id}>
                    Leave
                  </Link>
                </Button>
              </td >
            </tr>
         );
     });

    let date = new Date();
    let namefile = date.getDate() +'-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' Employee Data.csv'; 
    return (
      <div className="container">
        <div className="bg-white content-tab">
          <h4>Employee Database</h4>
          <hr/>
          <div className="float-right" style={{margin:"10px", marginRight: "0"}}>
            <Button variant="info" onClick={() => this.setState({modalIsOpen : true})}>
              <i className="fas fa-download"></i> Export Data</Button>
          </div>
          
          <div >
          <div className={ this.state.loading ? "show loader" : "hide" }>
            <Loader 
              type="Oval"
              color="#00BDD5"
              height="100"	
              width="100"
            />   
          </div>
          
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th><center>Action</center></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td width={'25%'} >
                    <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                      <Form.Control 
                        type="text"
                        ref="employee_id"
                        onChange={() => this.setState({employee_id : this.refs.employee_id.value})} 
                        onKeyPress={this.handleEnter}
                      />
                    </Form.Group>
                  </td>
                  <td width={'25%'}>
                    <Form.Group controlId="2" style={{marginBottom : "0px"}}>
                      <Form.Control 
                        type="text"
                        ref="employee_name"
                        onChange={() => this.setState({employee_name : this.refs.employee_name.value})}
                        onKeyPress={this.handleEnter}
                      />
                    </Form.Group>
                  </td>
                  <td width={'25%'} >
                    <Form.Group controlId="1">
                      <Form.Control as="select" onChange={this.handleSelect} ref="department">
                        <option value="">All Department</option>
                        {renderDepartment}
                      </Form.Control>
                    </Form.Group>
                  </td>
                  <td width={'25%'}></td>
                </tr>
              </tbody>
              
              <tbody>
                
                {this.state.datas.length === 0 ? 
                <tr><td colSpan="4" align="center">No Data Found</td></tr> 
                : renderData}
              </tbody>
            </Table>
          </div>
          <div className="float-right">
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
            </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}>
          <div>
            <h5>Please Select One : </h5>
            <Form.Check type="radio" label="All Data" name="radio" onClick={() => {this.export(0)}}/>
            <Form.Check type="radio" label="Employee Info" name="radio" onClick={() => {this.export(1)}}/>
            <Form.Check type="radio" label="Personal Info" name="radio" onClick={() => {this.export(2)}}/>    
            <Form.Check type="radio" label="Benefit Info" name="radio" onClick={() => {this.export(3)}}/>    
            <Form.Check type="radio" label="Job History" name="radio" onClick={() => {this.export(4)}}/>
            <center>
            { this.state.loadingExport ? <Loader 
              type="Oval"
              color="#00BDD5"
              height="40"	
              width="40"
            /> : null
            } 
            </center>
            {this.state.showButton ? <CSVLink
              onClick={() => this.setState({modalIsOpen : false, loadingExport : false, showButton : false})}
              data={this.state.export}
              filename={namefile}>
              <Button variant="info" style={{marginTop : "15px", width : "100%"}}><i className="fas fa-download"></i> Export Data</Button>
            </CSVLink> : null}        
          </div>
          </Modal>
      </div>
    );
  }
  
}

export default EmployeeDatabase;