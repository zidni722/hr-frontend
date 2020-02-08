import React from "react";
import {Form, Button,Row,Col,Container } from 'react-bootstrap';
import Man from '../../image/man.png';
import Girl from '../../image/girl.png';
import Axios from "axios";
import { toast } from 'react-toastify';


let listDepartment      = null;
let listTitle           = null;
let listLocation        = null;
let servicePeriod       = null;
var token = 'Bearer ' + localStorage.getItem('token');
var moment = require('moment-business-days');
class EmployeeInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab       : props.activeTab || 1,
            file            : null,
            newData         : {
                'name'          : null,
                'location_id'   : null
            },
            data            : null,
            listType        : ["permanent", "contract", "intern"],
            listStatus      : ['active','terminate'],
            listDeparment   : null,
            listTitle       : null,
            listLocation    : null,
            

        };
        this.handleChange       = this.handleChange.bind(this);
        this.handleChangeData   = this.handleChangeData.bind(this);
        this.handleChangeDepart = this.handleChangeDepart.bind(this);
        this.handleSubmit       = this.handleSubmit.bind(this);

      }
      handleSubmit(){
        Axios.post(process.env.REACT_APP_DEV_BASEURL + 'v1/users/profile',this.state.newData,
            {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(() => {
            toast.success("✔ Success edit data !", {
                position: toast.POSITION.TOP_RIGHT
              });
            //   window.location.reload();
            
        }).catch(error => {
            error.response.data.validation_errors.map((validation)=>
                toast.error("⚠ " + validation, {
                    position: toast.POSITION.TOP_RIGHT
                })
            );
        })
        
      }
      handleChange(event) {

        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/users/upload-photo'
        const formData = new FormData()
        formData.append('photos', event.target.files[0]);
        formData.append('id', this.state.data.id)

        Axios({
            url     : url,
            method  : 'POST',
            data    : formData,
            headers : {
                'Content-Type'  : 'multipart/form-data',
                'Authorization' : token
            }
        }).then((res) => {
            res.status === 200 && toast.success("✔ Success upload photos !", {
                position: toast.POSITION.TOP_RIGHT
              });
        })
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
      }

      handleChangeData(event){
        let newData     = Object.assign({}, this.state.newData);
        var key         = event.target.getAttribute('data-key');

        if(key === 'location_id')
        {
            newData[key] = parseInt(event.target.value);
            this.setState({location_id : parseInt(event.target.value)})
        }
        
        else newData[key] = event.target.value;
        
        this.setState({newData});
      }

      handleChangeDepart(event){

        let newData     = Object.assign({}, this.state.newData);
        var key         = event.target.getAttribute('data-key').toLowerCase();
        newData[key]    = event.target.value;
        
        this.setState({newData});
        this.setState({
            department_id : event.target.value
        });
        Axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/departments/'+ event.target.value + '/titles').then(res => {
            this.setState({
                listTitle : res.data.data
            })
        });

        listTitle = this.state.listTitle.map((title,index) =>
            this.state.title_id === title.name ?
            <option selected key={index} value={title.id}>{title.name}</option>  
            :
            <option key={index} value={title.id}>{title.name}</option>         
        );
      }
      componentDidMount(){
          Axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/locations').then(res =>{
            this.setState({
                listLocation : res.data.data
            });
          });
         
      }


      componentDidUpdate(previousProps){
        
        if (previousProps.data !== this.props.data) {

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
                    
            this.setState({
                data            : this.props.data,
                id              : this.props.data.EmployeeID,
                name            : this.props.data.name, 
                title           : this.props.data.title.name,
                joinDate        : this.props.data.join_date,
                servicePeriod   : servicePeriod,
                type            : this.props.data.type,
                status          : this.props.data.status,
                office_email    : this.props.data.office_email,
                listDeparment   : this.props.department,
                department_id   : this.props.data.title.department.id,
                title_id        : this.props.data.title.id,
                contracts       : this.props.data.contracts
            });
            
            
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

            if(this.props.data.location !== null){
                this.setState({ location_id     : this.props.data.location.id})
            } 
            
            var newData         = {...this.state.newData};
            newData.name        = this.props.data.name;
            if(this.props.data.location !== null){
                newData.location_id = this.props.data.location.id;
            } 
            
            this.setState({newData});

            var department_id   = this.props.data.title.department.id; 
            Axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/departments/'+ department_id + '/titles').then(res => {

                this.setState({ listTitle : res.data.data })
            })
            
            if(this.props.department != null){
                listDepartment   = this.props.department.map((depart) => 
                    this.props.data.title.department.name === depart.name ? 
                    <option value={depart.id} key={depart.id}>{depart.name}</option>
                    :
                    <option value={depart.id} key={depart.id}>{depart.name}</option>
                    
                );
            }
        }
      }
    render(){
        if(this.state.joinDate !== undefined){
            var joinDate = this.state.joinDate
        }
        var listType = this.state.listType.map((type,index) => 
            this.state.type === type ?
            <option selected key={index}>{type}</option>
            :
            <option key={index}>{type}</option>
        );
        var listStatus  = this.state.listStatus.map((status,index) => 
            this.state.status === status ?
            <option selected key={index}>{status}</option>
            :
            <option key={index}>{status}</option>
        );
        
        if(this.state.listTitle != null){
            listTitle = this.state.listTitle.map((title,index) =>
                this.state.title_id === title.name ?
                <option selected key={index} value={title.id}>{title.name}</option>  
                :
                <option key={index} value={title.id}>{title.name}</option>         
            );
        }
        
        if(this.state.listLocation != null){
            listLocation = this.state.listLocation.map((location,index) =>
                this.state.location_id === location.id ?
                <option key={index} value={location.id}>{location.name}</option>
                :
                <option key={index} value={location.id}>{location.name}</option>
            );
 
        }
        return(
        <div> 
            <Form onSubmit={(e) => {this.handleSubmit(); e.preventDefault();}}>
            <Container className="bg-white" style={{ borderRadius : "15px"}}>
                <Row>
                    <Col sm={3}>
                        {
                             
                            <center>
                            <img src={this.state.file !== null && this.state.file} alt="Foto Profile" className="foto-profile"/>
                            <div className="box">
                                <input 
                                    type="file" 
                                    name="file-4[]" 
                                    id="file-4" 
                                    className="inputfile inputfile-3" 
                                    data-multiple-caption="{count} files selected" 
                                    onChange={this.handleChange}
                                    accept="image/*" 
                                />
                                <p style={{fontSize : "0.85em"}}>Max size : 5 MB</p>
                                <label htmlFor="file-4" className="changetext"><span>Change</span></label>

                            </div>
                        </center>
                        }
                        
                    </Col>
                    <Col sm={9}>
                    
                        <Form.Group controlId="id">
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control
                                disabled
                                data-key="id" 
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.id}
                                onChange={this.handleChangeData}/>
                        </Form.Group>

                        <Form.Group controlId="2">
                            <Form.Label>Employee Name</Form.Label>
                            <Form.Control 
                                disabled={this.props.edited ? false : true} 
                                type="text" 
                                defaultValue={this.state.name}
                                data-key="name" 
                                onChange={this.handleChangeData}/>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control as="select"
                                disabled
                                data-key="depart" 
                                value={this.state.department_id}
                                onChange={this.handleChangeDepart}>
                                {listDepartment}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control as="select"
                                disabled
                                data-key="title"
                                value={this.state.title_id} 
                                onChange={this.handleChangeData}>
                                {listTitle}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    </Row>
                </Container>
                <Container className="bg-white" style={{marginTop: "25px", padding: "20px",  borderRadius : "15px"}}>
                    <Row>
                    <Col sm={6}>
                        <Form.Group controlId="4">
                            <Form.Label>Employee Status</Form.Label>

                            <Form.Control as="select"  
                                disabled
                                onChange={this.handleChangeData}
                                data-key="employee_status"
                                className="option">
                            {listStatus}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="5">
                            <Form.Label>Employee Type</Form.Label>
                            <Form.Control as="select" 
                                disabled
                                onChange={this.handleChangeData}
                                data-key="employee_type"
                                style={{textTransfrom : "capitalze"}}
                                className="option">
                                {listType}
                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId="6">
                            <Form.Label>Join Date</Form.Label>
                            <Form.Control
                                disabled
                                type="text" 
                                className="text-muted" 
                                defaultValue={joinDate && moment(joinDate).format("DD/MM/YYYY")}
                                onChange={this.handleChangeData}
                                data-key="join_date" />
                        </Form.Group>
                        </Col>
                        <Col sm={6}>
                        <Form.Group controlId="7">
                            <Form.Label>Service Period</Form.Label>
                            <Form.Control  
                                disabled
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.servicePeriod}
                                onChange={this.handleChangeData}
                                data-key="service_period" />
                        </Form.Group>

                        <Form.Group controlId="8">
                            <Form.Label>End 1st Contract</Form.Label>
                            <Form.Control 
                                type="text" 
                                disabled
                                className="text-muted" 
                                defaultValue={this.state.contracts !== undefined ? 
                                    this.state.contracts[0] !== undefined ? 
                                    moment(this.state.contracts[0].end_date).format("DD/MM/YYYY") : "-" : undefined}
                                onChange={this.handleChangeData}
                                data-key="end_1st_contract" />
                        </Form.Group>

                        <Form.Group controlId="9">
                            <Form.Label>End 2nd Contract</Form.Label>
                            <Form.Control 
                                disabled
                                type="text"
                                className="text-muted" 
                                defaultValue={this.state.contracts !== undefined ? 
                                    this.state.contracts[1] !== undefined ? 
                                    this.state.contracts[1].end_date : "-" : undefined}
                                onChange={this.handleChangeData}
                                data-key="end_2nd_contract"/>
                        </Form.Group>
                        </Col>
                        </Row>
                    </Container>
                    <Container className="bg-white"  style={{marginTop: "25px", padding: "20px", borderRadius : "15px"}}>
                        <Row>
                        <Col sm={6}>
                        <Form.Group controlId="10">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="location_id"
                                value={this.state.location_id}>
                                <option>-</option>
                                {listLocation}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="11">
                            <Form.Label>Direct Manager Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                disabled
                                onChange={this.handleChangeData}
                                data-key="manager"
                                defaultValue={this.state.data ? this.state.data.reporting_manager ? 
                                this.state.data.reporting_manager.name : "-" :undefined}>
                                
                            </Form.Control>
                            
                        </Form.Group>
                        </Col>
                        <Col sm={6}>
                        <Form.Group controlId="12">
                            <Form.Label>HR-BP Name</Form.Label>
                            <Form.Control 
                                disabled 
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.data ? this.state.data.hr_bp ? this.state.data.hr_bp.name : "-" :undefined}
                                onChange={this.handleChangeData}
                                data-key="bp_name" />
                        </Form.Group>

                        <Form.Group controlId="13">
                            <Form.Label>Office Email</Form.Label>
                            <Form.Control 
                                disabled 
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.office_email}
                                data-key="office_email" />
                        </Form.Group>
                        </Col>
                        
                        <Form.Text className="text-muted button-bawah">
                            <b>If you got wrong information, Please contact HR.</b>
                        </Form.Text>
                        {this.props.edited ? 
                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="button-bawah" 
                                size="lg"
                                style={{width:"100%"}}
                                disabled={this.props.edited ? false : true}>
                                Save
                            </Button>
                        : undefined}         
                        
                        </Row>
                    </Container>
                </Form>
            </div>

        );
    }
}
export default EmployeeInfo;