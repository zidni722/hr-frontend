import React from "react";
import {Form, Button,Row,Col,Container } from 'react-bootstrap';
import '../../css/style.css';
import '../../css/drop.css';
import Man from '../../image/man.png';
import Girl from '../../image/girl.png';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectSearch from 'react-select-search';
import { toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var moment = require('moment-business-days');
var listDepartment = null;
var listTitle = null;
var listLocation = null;
var token   = "Bearer " + localStorage.getItem('token');
const URL_USERS_HRBP = process.env.REACT_APP_DEV_BASEURL + "v1/hr/user-department/Human Resources Department"
const URL_USERS_LEAD = process.env.REACT_APP_DEV_BASEURL + "v1/hr/users/role/lead"
const URL_USERS_REPORTING_MANAGER = process.env.REACT_APP_DEV_BASEURL + "v1/hr/users/role/reporting-manager"

class EmployeeInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.activeTab || 1,
            file : Man,
            depart : [],
            departID : 1,
            listTitle : [],
            listLocation :[],
            selectedOption : null,
            user : [{name : "default", value : "defaultvalue"}],
            direct_manager_id : null,
            lead_id : null,
            hr_bp : null,
            joinDate : null,
            officeEmailValidationError : false,
            showContractField : false,
            listHrbp : [],
            listLead : [],
            listReportingManager : [],
            first_contract : null,
            second_contract : null

        };
        this.handleChange = this.handleChange.bind(this)
        this.ChangeDeparment = this.ChangeDeparment.bind(this)
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOfficeEmail = this.handleOfficeEmail.bind(this)
        this.changeEmployeeType = this.changeEmployeeType.bind(this)
        this.changeGender = this.changeGender.bind(this);
    }
    changeGender(){
        if (this.state.file === Man || this.state.file === Girl){
            if(this.refs.gender.value === "male") this.setState({file : Man})
            else this.setState({file : Girl})
        }
        
    }
    changeEmployeeType(){
        if(this.refs.type.value === 'contract') this.setState({showContractField : true})
        else this.setState({showContractField : false})
    }
    handleOfficeEmail(){
        this.refs.office_email.value.includes("@pawoon.com") === false ? 
            this.setState({officeEmailValidationError : true}) : 
            this.setState({officeEmailValidationError : false})
    }
    handleSubmit(){
        var data = null
        const formData = new FormData();
        if(this.refs.contract){
            var contractValue = this.refs.contract.value === '1' ? true : false;
        }
        data = {
            contracts : []
        }

        formData.append('employee_id', this.refs.employee_id.value);
        formData.append('name', this.refs.name.value);
        formData.append('title_id', parseInt(this.refs.title_id.value));
        formData.append('status', this.refs.status.value)
        formData.append('type_employee', this.refs.type.value)
        formData.append('join_date', moment(this.state.joinDate).format('YYYY-MM-DD'))
        formData.append('location_id' , parseInt(this.refs.location_id.value))
        formData.append('reporting_manager_id' ,parseInt(this.state.direct_manager_id))
        formData.append('office_email' , this.refs.office_email.value)
        formData.append('gender'	, this.refs.gender.value)
        formData.append('contracts', '[]')

        if(this.state.lead_id !== null){
            formData.append('lead_id' , parseInt(this.state.lead_id))
        } 
        if(this.state.hr_bp !== null){
            formData.append('hr_bp_id' , parseInt(this.state.hr_bp))
        }
        if(this.state.photo_profile !== undefined){
            formData.append('photo_profile', this.state.photo_profile)
        } 
        var contract = null;
        var jsonString = null
        var data_contract = [];
        if(this.state.first_contract !== null){
            contract = {end_date : moment(this.state.first_contract).format('YYYY-MM-DD'), is_contract_available : contractValue}
            data_contract = [...data.contracts]
            data_contract[0] = contract
            data.contracts = data_contract
            formData.delete('contracts')
            jsonString = JSON.stringify(data_contract)
            formData.append('contracts', jsonString)
        }
        if(this.state.second_contract !== null){
            contract = {end_date : moment(this.state.second_contract).format('YYYY-MM-DD'), is_contract_available : contractValue}
            data_contract = [...data.contracts]
            data_contract[1] = contract
            data.contracts = data_contract
            formData.delete('contracts')
            jsonString = JSON.stringify(data_contract)
            formData.append('contracts', jsonString)
        }
        
        var urlPost = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/users/add'
        //console.log(formData)
        Axios({
            url     : urlPost,
            method  : 'POST',
            data    : formData,
            headers : {
                'Content-Type'  : 'application/x-www-form-urlencoded',
                'Authorization' : token
            }
        }).then(() => {
                toast.success("✔ Success add new employee!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }).catch(error => {
                error.response.data.validation_errors.map((validation)=>
                    toast.error("⚠ " + validation, {
                        position: toast.POSITION.TOP_RIGHT
                    })
                );
            })
        
    }
    handleChangeName(selectedOption, key){
        this.setState({
            [key] : selectedOption.value
        })
    }
    handleChangeDate(date, key){
        this.setState({[key] : date})
        
    }
    handleChange(event) {
        this.setState({
          file: URL.createObjectURL(event.target.files[0]),
          photo_profile: event.target.files[0]
        })
    }
    ChangeDeparment(){
        var id = this.refs.department.value
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/departments/'+ id +'/titles'
        Axios.get(url).then(res =>{
            this.setState({listTitle : res.data.data, departID : id})
        })
    }

    componentDidMount(){
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/departments'
        Axios.get(url).then(res => {
            this.setState({depart : res.data.data})
        })
        url = process.env.REACT_APP_DEV_BASEURL + 'v1/departments/'+ this.state.departID +'/titles'
        Axios.get(url).then(res =>{
            this.setState({listTitle : res.data.data})
        })
        url = process.env.REACT_APP_DEV_BASEURL + 'v1/locations'
        Axios.get(url).then(res => {
            this.setState({listLocation : res.data.data})
        })

        Axios.get(URL_USERS_HRBP, {'headers' : {'Authorization' : token}}).then(res => {
            this.setState({listHrbp : res.data.data})
        })

        Axios.get(URL_USERS_LEAD, {'headers' : {'Authorization' : token}}).then(res => {
            this.setState({listLead : res.data.data})
        })

        Axios.get(URL_USERS_REPORTING_MANAGER, {'headers' : {'Authorization' : token}}).then(res => {
            this.setState({listReportingManager : res.data.data})
        })

    }
    render(){

        const listHrbp = this.state.listHrbp.map((data) => {
            return(
                {name: data.name, value : data.id}
            )
        })
        
        const listLead = this.state.listLead.map((data) => {
            return(
                {name: data.name, value : data.id}
            )
        }) 
        const listReportingManager = this.state.listReportingManager.map((data) => {
            return(
                {name: data.name, value : data.id}
            )
        })   
        

        listDepartment = this.state.depart.map((data,index) => {
            return(
                <option key={index} value={data.id}>{data.name}</option>
            )
        })
        listTitle = this.state.listTitle.map((data,index) => {
            return(
                <option key={index} value={data.id}>{data.name}</option>
            )
        })
        listLocation = this.state.listLocation.map((data,index) => {
            return(
                <option key={index} value={data.id}>{data.name}</option>
            )
        })

        return(
            
            <Container style={{paddingRight : "5%",paddingLeft : "5%"}}>
                <ToastContainer />
                <Form onSubmit={(e) => {this.handleSubmit(); e.preventDefault();}}>
                <Row>
                    
                    <Col sm={3}>
                        <center>
                            <h1 onClick={this.handleSubmit}>TES</h1>
                            <img src={this.state.file} alt="Foto Profile" className="foto-profile"/>
                            <div className="box">
                                <input 
                                    type="file" 
                                    name="file-4[]" 
                                    id="file-4" 
                                    className="inputfile inputfile-3" 
                                    data-multiple-caption="{count} files selected" 
                                    onChange={this.handleChange} 
                                />
                                <label htmlFor="file-4" className="changetext"><span>Upload Photos</span></label>
                            </div>
                            
                        </center>
                    </Col>
                    <Col sm={9}>
                    
                        <Form.Group controlId="1">
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control type="text" ref="employee_id" className="text-muted" required/>
                        </Form.Group>

                        <Form.Group controlId="2">
                            <Form.Label>Employee Name</Form.Label>
                            <Form.Control type="text" ref="name" required/>
                        </Form.Group>

                        <Form.Group controlId="4">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control as="select"  ref="gender" onChange={this.changeGender}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control 
                                as="select" 
                                ref="department"
                                onChange={this.ChangeDeparment}
                                selected={this.state.departID}>
                                {listDepartment}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control as="select" ref="title_id" >
                            {listTitle}
                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId="4">
                            <Form.Label>Employee Status</Form.Label>
                            <Form.Control as="select"  ref="status">
                                <option value="active">Active</option>
                                <option value="terminate">Terminate</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="5">
                            <Form.Label>Employee Type</Form.Label>
                            <Form.Control as="select" ref="type" onChange={this.changeEmployeeType}>
                                <option value="permanent">Permanent</option>
                                <option value="contract">Contract</option>
                                <option value="intern">Intern</option>
                            </Form.Control>
                        </Form.Group>

                        {
                            this.state.showContractField === true ? 
                            <div>
                                <Form.Group controlId="8">
                                <Form.Label>End 1st Contract</Form.Label>
                                <div>
                                    <DatePicker
                                        selected = {this.state.first_contract}
                                        onChange={(date) => this.handleChangeDate(date, "first_contract")}
                                        className="form-control"
                                        style={{width:"500px"}}
                                        dateFormat="dd-MM-YYYY"
                                        showYearDropdown/>
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="9">
                                    <Form.Label>End 2nd Contract</Form.Label>
                                    <div>
                                        <DatePicker
                                            selected = {this.state.second_contract}
                                            onChange={(date) => this.handleChangeDate(date, "second_contract")}
                                            className="form-control"
                                            style={{width:"500px"}}
                                            dateFormat="dd-MM-YYYY"
                                            showYearDropdown/>
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="5">
                                    <Form.Label>Contract Available</Form.Label>
                                    <Form.Control as="select" ref="contract" >
                                        <option></option>
                                        <option value="1">Yes</option>
                                        <option value="2">No</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            : undefined
                        }

                       <Form.Group controlId="6">
                            <Form.Label>Join Date</Form.Label>
                            <div>
                                <DatePicker
                                    selected = {this.state.joinDate}
                                    onChange={(date) => this.handleChangeDate(date, "joinDate")}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    dateFormat="dd-MM-YYYY"
                                    showYearDropdown
                                    required/>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="10">
                            <Form.Label>Location</Form.Label >
                            <Form.Control as="select" ref="location_id">
                                {listLocation}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="11" required>
                            <Form.Label>Direct Manager Name</Form.Label>
                            <Form.Label style={{color:"red",float:"right"}}>*required</Form.Label>
                            <SelectSearch 
                                options={listReportingManager} 
                                value={this.state.direct_manager_id}
                                onChange={(selectedOption) => this.handleChangeName(selectedOption,"direct_manager_id")}
                                name="language"
                                getOptionValue ={(option)=>option.tabValue} 
                                placeholder="Choose Direct Manager Name" 
                                />
                        </Form.Group>

                        <Form.Group controlId="12">
                            <Form.Label>Lead Name</Form.Label>
                            <SelectSearch 
                                options={listLead} 
                                value={this.state.lead_id}
                                onChange={(selectedOption) => this.handleChangeName(selectedOption,"lead_id")}
                                name="language"
                                getOptionValue ={(option)=>option.tabValue} 
                                placeholder="Choose Lead Name" 
                                />
                        </Form.Group>

                        <Form.Group controlId="12">
                            <Form.Label>HR-BP Name</Form.Label>
                            <SelectSearch 
                                options={listHrbp} 
                                value={this.state.hr_bp}
                                onChange={(selectedOption) => this.handleChangeName(selectedOption,"hr_bp")}
                                name="language"
                                getOptionValue ={(option)=>option.tabValue} 
                                placeholder="Choose HR-BP Name"
                                />
                        </Form.Group>

                        <Form.Group controlId="13">
                            <Form.Label>Office Email</Form.Label>
                            <Form.Control 
                            onChange={this.handleOfficeEmail}
                             type="text" className="text-muted" ref="office_email" required/>
                             {
                                this.state.officeEmailValidationError === false ? undefined :
                                <Form.Label style={{color:"red"}}>Email must contain @pawoon.com</Form.Label>
                            }
                        </Form.Group>

                        <Form.Group controlId="14">
                            <Form.Label>Personal Email</Form.Label>
                            <Form.Control type="text" ref="personal_email" required/>
                        </Form.Group>     
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="button-bawah" 
                            size="lg"
                            style={{width:"100%"}}
                            >
                            Save
                        </Button>
                    
                    </Col>
                </Row>
                </Form>
            </Container>
            

        );
    }
}
export default EmployeeInfo;