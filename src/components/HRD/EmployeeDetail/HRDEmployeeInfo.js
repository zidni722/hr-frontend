import React from "react";
// import autoBind from 'react-autbind';
import {Form, Button,Row,Col,Container } from 'react-bootstrap';
import '../../../css/style.css';
import Man from '../../../image/man.png';
import Girl from '../../../image/girl.png';
import HRDJobHistories from "./HRDJobHistories";
import Modal from 'react-modal';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { toast } from 'react-toastify';



const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '60%'
  }
};

var servicePeriod = null;
var id_depart = 0;
var id_title = 0;
var moment = require('moment');
var token   = "Bearer " + localStorage.getItem('token');
var options = null;
class HRDEmployeeInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab       : props.activeTab || 1,
            file            : null,
            newData         : {},
            modalIsOpen     : false,
            listLocation    : [],
            listDepartment  : [],
            listTitle       : [],
            user : [],
            reportingManager : null,
            lead : null,
            hr_bp : null,
            firstContract : {
                end_date : null,
            },
            secondContract : {
                end_date : null,
            }
        };
        this.handleChange       = this.handleChange.bind(this);
        this.handleChangeData   = this.handleChangeData.bind(this);
        this.closeModal         = this.closeModal.bind(this);
        this.listTitle          = this.listTitle.bind(this);
        this.handleChangeDepart = this.handleChangeDepart.bind(this);
        this.handleSubmit       = this.handleSubmit.bind(this);
    }

    handleSubmit(){
        var contract = []
        if(this.state.firstContract !== null && this.state.secondContract.end_date === null){
            contract = [this.state.firstContract]
        }
        if(this.state.firstContract !== null && this.state.secondContract.end_date !== null){
        
            contract = [this.state.firstContract, this.state.secondContract]
        }


        var data ={
            user_id : this.state.datas.id,
            employee_id :this.refs.employee_id.value,
            name : this.refs.name.value,
            location_id : parseInt(this.refs.location.value),
            status : this.state.datas.status,
            type : this.state.datas.type,
            join_date : moment(this.state.datas.join_date).format("YYYY-MM-DD"),
            contracts : contract,
            reporting_manager_id : this.state.reportingManager !== null ? this.state.reportingManager.value : null,
            hr_bp_id : this.state.hr_bp !== null ? this.state.hr_bp.value : null,
            lead_id : this.state.lead !== null ? this.state.lead.value : null,
            office_email : this.refs.office_email.value,
            permanent_date : this.state.datas.permanent_date,
            resign_date : this.state.datas.resign_date
        }
        
        var token = 'Bearer ' + localStorage.getItem('token');
        var url_submit = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/users/employee-info'
        Axios.post(url_submit,data,
            {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(() => {
            toast.success("✔ Success edit data !", {
                position: toast.POSITION.TOP_RIGHT
            });
            window.location.reload();
        }).catch(error => {
            error.response.data.validation_errors.map((validation)=>
                toast.error("⚠ " + validation, {
                    position: toast.POSITION.TOP_RIGHT
                })
            );
        })
    }
    handleChangeDepart(){
        id_depart = this.refs.department.value;
        this.listTitle(id_depart);
    }
    listTitle(id){
        var url_title = process.env.REACT_APP_DEV_BASEURL + 'v1/departments/'+ id +'/titles';
        Axios.get(url_title).then(res =>{
            this.setState({listTitle : res.data.data})
        })
    }
    closeModal() {
        this.setState({modalIsOpen : false});
    }
    componentWillReceiveProps(props) {
        this.setState({modalIsOpen : props.modal});
    }
    handleChange(event) {
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/users/upload-photo'
        const formData = new FormData()
        formData.append('photos', event.target.files[0]);
        formData.append('id', this.state.datas.id)

        Axios({
            url     : url,
            method  : 'POST',
            data    : formData,
            headers : {
                'Content-Type'  : 'multipart/form-data',
                'Authorization' : token
            }
        })
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    
    }
    handleChangeData(event){

        let newData     = Object.assign({}, this.state.newData);
        var key         = event.target.getAttribute('data-key');
        newData[key]    = event.target.value;
        
        this.setState({newData});
    }
    componentDidMount(){
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/locations'
        Axios.get(url).then(res => {
            this.setState({listLocation : res.data.data})
        })
        url = process.env.REACT_APP_DEV_BASEURL + 'v1/departments'
        Axios.get(url).then(res => {
            this.setState({listDepartment : res.data.data})
        })
        url = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/all-user'
        
        Axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
            this.setState({user : res.data.data})
        })
    }
    componentDidUpdate(previousProps){
        if(previousProps.data !== this.props.data){
            this.props.data.contracts.length >= 1 && this.setState({firstContract : this.props.data.contracts[0]})
            this.props.data.contracts.length >= 2 && this.setState({secondContract : this.props.data.contracts[1]})
            this.setState({datas : this.props.data},() => 
                this.listTitle(this.state.datas.title.department.id))
                id_depart = this.props.data.title.department.id
                id_title = this.props.data.title.id

                var d1= new Date();
                var d2= new Date(this.props.data.join_date)
                
                var m = moment(d1);
                var years = m.diff(d2, 'years');
                m.add(-years, 'years');
                var months = m.diff(d2, 'months');
                m.add(-months, 'months');
                var days = m.diff(d2, 'days');

                if (years <= 0) servicePeriod  = months + " Months " + days + " Days"
                if (years > 0) servicePeriod  = years + " Years " + months + " Months " + days + " Days"
                if (months <= 0 ) servicePeriod  = days + " Days"

                this.props.data.reporting_manager !== null && this.setState({reportingManager : { value: this.props.data.reporting_manager.id , 
                    label: this.props.data.reporting_manager.name} })
                this.props.data.lead !== null && this.setState({lead : { value: this.props.data.lead.id , 
                    label: this.props.data.lead.name} })
            

            if(this.props.data.photo_profile !== null){
                this.setState({
                    file : this.props.data.photo_profile
                })
            }
            else{
                if(this.props.data.gender === 'male'){
                    this.setState({
                        file : Man
                    })
                }
                else{
                    this.setState({
                        file : Girl
                    })
                }
                
            }
        }
       
         
    }
    
    render(){

        const listTitle  = this.state.listTitle.map((data,index) => {
            return(
                <option value={data.id} key={index}>{data.name}</option>
            );
        })
        const listDepartment = this.state.listDepartment.map((data,index) => {
            return(
                <option value={data.id} key={index}>{data.name}</option>
            );
        })
        var listLocation = this.state.listLocation.map((data,index) => {
            return(
                <option value={data.id} key={index}>{data.name}</option>
            );
        })

        options = this.state.user.map((data) => {
            
            return (
                {value: data.id, label: data.name} 
            ) 
        })


        return(
            <Container>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={modalStyles}
                    contentLabel="Modal">
                    <HRDJobHistories/>
                    
                    <Button 
                        variant="light"
                        style={{float : "right"}}
                        onClick={this.closeModal}>Close</Button>

                </Modal>

                <Form onSubmit={(e) => {this.handleSubmit(); e.preventDefault();}}>
                <Row>
                    <Col sm={3}>
                        <center>
                            <img src={this.state.file} alt="Foto Profile" className="foto-profile"/>
                            {/* <div className="box">
                                <input 
                                    type="file" 
                                    name="file-4[]" 
                                    id="file-4" 
                                    className="inputfile inputfile-3" 
                                    data-multiple-caption="{count} files selected" 
                                    onChange={this.handleChange} 
                                />
                                <label htmlFor="file-4" className="changetext"><span>Change</span></label>
                            </div> */}
                            
                        </center>
                    </Col>
                    <Col sm={9}>
                    
                        <Form.Group controlId="id">
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control
                                disabled={this.props.edited ? false : true} 
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.datas && this.state.datas.EmployeeID}
                                ref="employee_id"/>
                        </Form.Group>

                        <Form.Group controlId="2">
                            <Form.Label>Employee Name</Form.Label>
                            <Form.Control 
                                disabled={this.props.edited ? false : true} 
                                type="text" 
                                defaultValue={this.state.datas && this.state.datas.name}
                                ref="name"/>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control as="select"
                                disabled={true} 
                                onChange={this.handleChangeDepart}
                                value={id_depart}
                                ref="department">
                                {listDepartment}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control as="select"
                                data-key="title" 
                                disabled={true} 
                                value={id_title}
                                ref="title">
                                {listTitle}
                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId="4">
                            <Form.Label>Employee Status</Form.Label>

                            <Form.Control as="select"  
                                disabled={this.props.edited ? false : true}
                                ref="employee_status"
                                onChange={() => {
                                    var datas = {...this.state.datas}
                                    datas.status = this.refs.employee_status.value
                                    this.setState({datas : datas})
                                }}
                                value={this.state.datas && this.state.datas.status} style={{textTransform: "capitalize"}}>
                                <option value="active">active</option>
                                <option value="terminate">terminate</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="5">
                            <Form.Label>Employee Type</Form.Label>
                            <Form.Control as="select" 
                                disabled={this.props.edited ? false : true} 
                                ref="employee_type"
                                onChange={() => {
                                    var datas = {...this.state.datas}
                                    datas.type = this.refs.employee_type.value
                                    this.setState({datas : datas})
                                }}
                                value={this.state.datas && this.state.datas.type} style={{textTransform: "capitalize"}}>
                                <option>permanent</option>
                                <option>contract</option>
                                <option>intern</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="6">
                            <Form.Label>Join Date</Form.Label>
                            <DatePicker
                                selected={this.state.datas && new Date(this.state.datas.join_date)}
                                onChange={(date) => {
                                    var datas = {...this.state.datas}
                                    datas.join_date = moment(date).format("YYYY-MM-DD")
                                    this.setState({datas : datas})
                                }}

                                className="form-control"
                                style={{width:"500px"}}
                                disabled={this.props.edited ? false : true}
                                dateFormat="dd/MM/YYYY"/>
                        </Form.Group>

                        <Form.Group controlId="7">
                            <Form.Label>Service Period</Form.Label>
                            <Form.Control  
                                disabled
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.datas && servicePeriod }
                                ref="service_period" />
                        </Form.Group>

                        <Form.Group controlId="8">
                            <Form.Label>End 1st Contract</Form.Label>
                            <DatePicker
                                selected={this.state.firstContract && this.state.firstContract.end_date ? new Date(this.state.firstContract.end_date): null}
                                onChange={(date) => {
                                    var firstContract = {...this.state.firstContract}
                                    firstContract.end_date = moment(date).format("YYYY-MM-DD")
                                    firstContract.is_contract_available = true
                                    this.setState({firstContract : firstContract})

                                }}
                                className="form-control"
                                style={{width:"500px"}}
                                disabled={this.props.edited ? false : true}
                                dateFormat="dd/MM/YYYY"/>
                        </Form.Group>

                        <Form.Group controlId="9">
                            <Form.Label>End 2nd Contract</Form.Label>
                            <DatePicker
                                selected={this.state.secondContract && this.state.secondContract.end_date ? new Date(this.state.secondContract.end_date) : null}
                                onChange={(date) => {
                                    var secondContract = {...this.state.secondContract}
                                    secondContract.end_date = moment(date).format("YYYY-MM-DD")
                                    secondContract.is_contract_available = true
                                    this.setState({secondContract : secondContract})
                                }}
                                className="form-control"
                                style={{width:"500px"}}
                                disabled={this.props.edited ? false : true}
                                dateFormat="dd/MM/YYYY"/>
                        </Form.Group>

                        <Form.Group controlId="10">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                ref="location"
                                 value={this.state.datas && this.state.datas.location !== null && this.state.datas.location.id}>
                                {listLocation}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="11">
                            <Form.Label>Direct Manager Name</Form.Label>
                            <Select
                                value={this.state.reportingManager}
                                options={options}
                                isDisabled={this.props.edited ? false : true}
                                onChange={value => this.setState({reportingManager : value})}/>
                            
                        </Form.Group>
                        <Form.Group controlId="11">
                            <Form.Label>Lead</Form.Label>
                            <Select
                                value={this.state.lead}
                                options={options}
                                isDisabled={this.props.edited ? false : true}
                                onChange={value => this.setState({lead : value})}/>
                        </Form.Group>

                        <Form.Group controlId="12">
                            <Form.Label>HR-BP Name</Form.Label>
                            <Select
                                value={this.state.reportingManager}
                                options={options}
                                isDisabled={this.props.edited ? false : true}
                                onChange={value => this.setState({hr_bp : value})}/>
                        </Form.Group>

                        <Form.Group controlId="13">
                            <Form.Label>Office Email</Form.Label>
                            <Form.Control 
                                disabled={this.props.edited ? false : true}
                                type="text" 
                                className="text-muted" 
                                ref="office_email"
                                defaultValue={this.state.datas && this.state.datas.office_email}
                                data-key="office_email" />
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Contract Availability</Form.Label>
                            <Form.Control as="select"
                                data-key="depart" 
                                disabled={this.props.edited ? false : true}>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="2">
                            <Form.Label>Permanent Date</Form.Label>
                            <div>
                                <DatePicker
                                    selected={this.state.datas && this.state.datas.permanent_date ? new Date(this.state.datas.permanent_date) : null}
                                    onChange={(date) => {
                                        var datas = {...this.state.datas}
                                        datas.permanent_date = moment(date).format("YYYY-MM-DD")
                                        this.setState({datas : datas})
                                    }}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    disabled={this.props.edited ? false : true}
                                    dateFormat="dd/MM/YYYY"/>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="6">
                            <Form.Label>Resign Date</Form.Label>
                            <div>
                                <DatePicker
                                    selected={this.state.datas && this.state.datas.resign_date ?  new Date(this.state.datas.resign_date) : null}
                                    onChange={(date) => {
                                        var datas = {...this.state.datas}
                                        datas.resign_date = moment(date).format("YYYY-MM-DD")
                                        this.setState({datas : datas})
                                    }}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    disabled={this.props.edited ? false : true}
                                    dateFormat="dd/MM/YYYY"/>
                            </div>
                        </Form.Group>  
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="button-bawah" 
                            size="lg"
                            style={{width:"100%"}}
                            disabled={this.props.edited ? false : true}>
                            Save
                        </Button>
                    
                    </Col>
                </Row>
                </Form>
            </Container>
            

        );
    }
}
export default HRDEmployeeInfo;