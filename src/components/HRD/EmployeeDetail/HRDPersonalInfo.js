import React from "react";
import {Form, Button,Row,Col,Container } from 'react-bootstrap';
import '../../../css/style.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
import moment from "moment";
import { toast } from 'react-toastify';

var dob         = null;
var spouse_dob  = null;
var c1_dob      = null;
var c2_dob      = null;
var c3_dob      = null;
class HRDPersonalInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            newData   : {},
            data      : [],
            spouses   : {},
            newSpouses : {
                name            : null,
                gender          : null,
                national_id     : null,
                date_of_birth   : null,
                proof           : null
            },
            childrens: [
                {
                    name	  : "",
                    gender	: "",
                    date_of_birth : ""
                },
                
                {
                    name	  : "",
                    gender	: "",
                    date_of_birth : ""
                },
                {
                    name	  : "",
                    gender	: "",
                    date_of_birth : ""
                }
            ],
            spouse_proof : null,
            c1_birthday_certificate : null,
            c2_birthday_certificate : null,
            c3_birthday_certificate : null,
        };
        this.handleChange        = this.handleChange.bind(this);
        this.handleChangeData    = this.handleChangeData.bind(this);
        this.handleDeleteChild   = this.handleDeleteChild.bind(this);
        this.handleSubmit        = this.handleSubmit.bind(this);
        this.handleChangeSpouses = this.handleChangeSpouses.bind(this);
        this.handleChangeBirthdaySpouses = this.handleChangeBirthdaySpouses.bind(this);
        this.handleDeleteSpouses = this.handleDeleteSpouses.bind(this);
        this.handleAddChild      = this.handleAddChild.bind(this);
        this.handleDateChild     = this.handleDateChild.bind(this);
    }
    componentDidMount(){
        var startdate = moment();
        startdate = startdate.subtract(17, "year");
        this.setState({
            minBirthday : startdate._d
        })
    }

    componentDidUpdate(previousProps){
        if(previousProps.data !== this.props.data){
            var spouses     = this.props.data.spouses;
            var childrens   = this.props.data.childrens;
            
            this.setState({
                data                : this.props.data,
                religion            : this.props.data.religion.id,
                spouses             : spouses
            })

            if (childrens.length > 0) {
                var state_childrens = this.state.childrens;

                childrens.forEach((child, i) => {
                    state_childrens[i]['name'] = child.name;
                    state_childrens[i]['gender'] = child.gender;
                    state_childrens[i]['date_of_birth'] = child.date_of_birth; 
                })
            }

            dob                     = new Date(this.props.data.date_of_birth);
            if(spouses.length > 0) spouse_dob = new Date(spouses[0].date_of_birth); 
            if(childrens.length >= 1) c1_dob = new Date(childrens[0].date_of_birth);
            if(childrens.length >= 2) c2_dob = new Date(childrens[1].date_of_birth);
            if(childrens.length >= 3) c3_dob = new Date(childrens[2].date_of_birth);

            
            //update new data
            var newData             = {...this.state.newData};
            newData.user_id         = this.props.data.id;
            newData.personal_email	= this.props.data.personal_email;
            newData.tax_status      = this.props.data.tax_status;
            newData.national_id	    = this.props.data.national_id;
            newData.gender	        = this.props.data.gender;
            newData.place_of_birth	= this.props.data.place_of_birth;
            newData.date_of_birth	= this.props.data.date_of_birth;
            newData.religion_id	    = this.props.data.religion.id === 0 ? 1 : this.props.data.religion.id ;
            newData.marital_status	= this.props.data.marital_status === "" ? "married" : this.props.data.marital_status;
            newData.phone	        = this.props.data.phone;
            newData.address     	= this.props.data.address;
            newData.current_address	= this.props.data.current_address;
            newData.spouses         = spouses;
            newData.childrens       = childrens;
            this.setState({newData});
        }
    }

    handleDateChild(date,index){
        var dateString = date;
        var dateObj = new Date(dateString);
        var momentObj   = moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        var key = "date_of_birth";

        var data                        = {...this.state.newData};
        var child                       = {...this.state.childrens};
        child[(index)][key]             = momentString;
        if(index === 0) c1_dob = new Date(momentString);
        if(index === 1) c2_dob = new Date(momentString);
        if(index === 2) c3_dob = new Date(momentString);
        this.setState({ childrens: child });
        data.childrens[index]           = this.state.childrens[(index)];
        this.setState({newData : data});
    }
    handleAddChild(event){
        var key                         = event.target.getAttribute('data-key');
        var index                       = parseInt(event.target.getAttribute('index')); 
        var data                        = {...this.state.newData};
        var child                       = {...this.state.childrens};
        child[(index)][key]             = event.target.value;
        this.setState({ childrens: child });
        data.childrens[index]           = this.state.childrens[(index)];
        this.setState({newData : data});
    }
    handleDeleteSpouses(){
        var data     = {...this.state.newData};
        data.spouses = [];
        this.setState({
            newData : data
        });
        
    }
    handleChangeBirthdaySpouses(dob,key){           
        var dateString = dob;
        var dateObj = new Date(dateString);
        var momentObj   = moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        var data = {...this.state.newData};
        if(data.spouses.length > 0){
            data.spouses[0][key] = momentString;
            this.setState({
                newData : data
            })  
        }
        else{
            data.spouses[key] = momentString;
            var newSpouses     = {...this.state.newSpouses};
            newSpouses[0][key]    = momentString;
            this.setState({newSpouses : newSpouses})
        }
        spouse_dob = new Date(momentString);
    }
    handleChangeSpouses(event){
        var key = event.target.getAttribute('data-key');
        var value = event.target.value;
        var data = {...this.state.newData};
        
            
            if(data.spouses.length > 0){
                data.spouses[0][key] = value;
                this.setState({
                    newData : data
                })
            }
            else{
                var newSpouses     = {...this.state.newSpouses};
                newSpouses[key]    = value;
                this.setState({newSpouses : newSpouses})
                data.spouses = [this.state.newSpouses];
                this.setState({newData : data})
            }
    }
    

    handleSubmit(){
        const formData = new FormData()
        formData.append('user_id', this.state.newData.user_id)
        formData.append('personal_email', this.state.newData.personal_email)
        formData.append('tax_status', this.state.newData.tax_status)
        formData.append('national_id', this.state.newData.national_id)
        formData.append('gender',this.state.newData.gender)
        formData.append('place_of_birth', this.state.newData.place_of_birth)
        formData.append('date_of_birth',this.state.newData.date_of_birth)
        formData.append('religion_id', this.state.newData.religion_id)
        formData.append('marital_status',this.state.newData.marital_status)
        formData.append('phone',this.state.newData.phone)
        formData.append('address',this.state.newData.address)
        formData.append('current_address', this.state.newData.current_address)
        formData.append('spouses', JSON.stringify(this.state.newData.spouses))
        formData.append('childrens', JSON.stringify(this.state.newData.childrens))
        if(this.state.newData.spouses.id === undefined && this.state.spouse_proof !== null){
            formData.append('spouse_proof', this.state.spouse_proof)
        }
        var lengthArrayChild = this.state.newData.childrens.length 
        if(this.state.newData.childrens[0]){
            if(this.state.newData.childrens[0].id === undefined && lengthArrayChild > 0 && this.state.c1_birthday_certificate !== null){
                formData.append('children_proof_1', this.state.c1_birthday_certificate)
            }  
        }
        if(this.state.newData.childrens[1]){
            if(this.state.newData.childrens[1].id === undefined && lengthArrayChild > 1 && this.state.c2_birthday_certificate !== null){
                formData.append('children_proof_2', this.state.c2_birthday_certificate)
            }  
        }
        if(this.state.newData.childrens[2]){
            if(this.state.newData.childrens[2].id === undefined && lengthArrayChild > 2 && this.state.c3_birthday_certificate !== null){
                formData.append('children_proof_3', this.state.c3_birthday_certificate)
            }  
        }


        var token = 'Bearer ' + localStorage.getItem('token');
        var url_submit = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/users/personal-info'
        Axios.post(url_submit,formData,
            {'headers' : {'Authorization' : token, 'Content-Type' : 'multipart/form-data'}}
        ).then(() => {
            toast.success("✔ Success edit data !", {
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


    handleDeleteChild(event){
        var index     = event.target.getAttribute('data-key')
        var childrens = {...this.state.newData}
            childrens.childrens.splice(index,1)
            this.setState({ newData : childrens })       
    }
    handleChange(date,key) {
        this.setState({
          startDate: date
        });
        dob = new Date(date);
        let newData     = Object.assign({}, this.state.newData);
        
        var dateString = date;
        var dateObj = new Date(dateString);
        var momentObj   = moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');

        newData[key]    = momentString;
        this.setState({newData});
        
    }
    handleChangeData(event){
        let newData     = Object.assign({}, this.state.newData);
        var key         = event.target.getAttribute('data-key');
        newData[key]    = event.target.value;
        

        if(key === 'marriage_certificate'){
            this.setState({
                spouse_proof : event.target.files[0]
            })
        }
        if(key === 'c1_birthday_certificate' || key === 'c2_birthday_certificate' || key === 'c3_birthday_certificate'){
            this.setState({
                [key] : event.target.files[0]
            })
        }
        if(key === "religion_id"){
            newData["religion_id"] = parseInt(event.target.value);
            this.setState({religion : parseInt(event.target.value)})
        }
        
        var data = {...this.state.data}
        if(key === "gender"){
            
            data.gender = event.target.value;
            this.setState({data});
        }

        if(key === "marital_status"){
            data.marital_status = event.target.value;
            this.setState({data});
        }
        if(key === "address"){
            data.address = event.target.value;
            this.setState({data});
        }
        if(key === "current_address"){
            data.current_address = event.target.value;
            this.setState({data});
        }
            
        this.setState({newData});
        
    }

    render(){
        
        return(
            <Container>
                 <Form onSubmit={(e) => {this.handleSubmit(); e.preventDefault();}}>
                    <Row style={{paddingBottom : "50px"}}>
                    <Col sm={6}>
                        <Form.Group controlId="14" >
                            <Form.Label>Personal Email</Form.Label>
                            <Form.Control 
                                type="text" 
                                disabled={this.props.edited ? false : true} 
                                defaultValue={this.state.data.personal_email} 
                                onChange={this.handleChangeData}
                                data-key="personal_email"/>
                        </Form.Group>
                        <Form.Group controlId="6">
                            <Form.Label>Tax Status</Form.Label>
                            <Form.Control 
                                disabled={this.props.edited ? false : true} 
                                type="text" 
                                className="text-muted"
                                data-key="tax_status"
                                onChange={this.handleChangeData} 
                                defaultValue={this.state.data.tax_status} />
                        </Form.Group>
                        <Form.Group controlId="1">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="gender"
                                value={this.state.data.gender}
                                className="option">
                                <option></option>
                                <option>male</option>
                                <option>female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="2">
                            <Form.Label>Place of Birth</Form.Label>
                            <Form.Control 
                                type="text" 
                                defaultValue={this.state.data.place_of_birth}  
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="place_of_birth"/>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Date of Birth</Form.Label>
                            <div>
                                <DatePicker
                                    selected={dob}
                                    onChange={(date) => this.handleChange(date, "date_of_birth")}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    disabled={this.props.edited ? false : true}
                                    dateFormat="dd-MM-YYYY"
                                    showYearDropdown/>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="4">
                            <Form.Label>Religion</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="religion_id"
                                value={this.state.religion}>
                                <option value="1">Moslem</option>
                                <option value="2">Catholic</option>
                                <option value="3">Christian</option>
                                <option value="4">Buddhist</option>
                                <option value="5">Hindu</option>
                            </Form.Control>
                        </Form.Group>
                    

                        <Form.Group controlId="5">
                            <Form.Label>Marital Status</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={this.state.data.marital_status}
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="marital_status"
                                className="option">
                                <option>married</option>
                                <option>single</option>
                                <option>widowed</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="6">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control 
                                type="text" 
                                defaultValue={this.state.data.phone} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="phone"/>
                        </Form.Group>

                        <Form.Group controlId="7">
                            <Form.Label>National ID</Form.Label>
                            <Form.Control 
                                type="text" 
                                defaultValue={this.state.data.national_id} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="national_id"/>
                        </Form.Group>

                        <Form.Group controlId="8">
                            <Form.Label>Address (Based on National ID)</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows="3" 
                                value={this.state.data.address} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="address"/>
                        </Form.Group>

                        <Form.Group controlId="9">
                            <Form.Label>Current Address</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="3" 
                                value={this.state.data.current_address} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="current_address"/>
                        </Form.Group>


                        <h4 className="kasihatas">Spouse
                            {this.props.edited ? 
                                <i className="fas fa-trash-alt" 
                                    style={{color:"red",fontSize : "1rem", marginLeft : "10px"}}
                                    data-key="1"
                                    onClick={this.handleDeleteSpouses}> </i> 
                                : undefined }
                        </h4>
                        <hr/>
                        <Form.Group controlId="11">
                            <Form.Label>Spouse Name</Form.Label>
                            <Form.Control 
                                type="text"  
                                value={
                                    this.state.newData.spouses  ? 
                                        this.state.newData.spouses[0] ? this.state.newData.spouses[0].name  : ""
                                    : ""
                                } 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeSpouses}
                                data-key="name"/>
                        </Form.Group>

                        <Form.Group controlId="12">
                            <Form.Label>Spouse Gender</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeSpouses}
                                data-key="gender"
                                value={
                                    this.state.newData.spouses ? 
                                        this.state.newData.spouses[0] ? this.state.newData.spouses[0].gender 
                                        : "Select Gender"
                                    : undefined
                                }
                                className="option">
                                <option >Select Gender</option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="13">
                            <Form.Label>Spouse Date of Birth</Form.Label>
                            <div>
                                <DatePicker
                                    selected={
                                        this.state.newData.spouses ? 
                                            this.state.newData.spouses[0] ? spouse_dob : undefined 
                                        : undefined
                                    }
                                    onChange={(date) => this.handleChangeBirthdaySpouses(date, "date_of_birth")}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    disabled={this.props.edited ? false : true}
                                    dateFormat="dd-MM-YYYY"
                                    data-key="date_of_birth"
                                    maxDate={new Date(this.state.minBirthday)}
                                    showYearDropdown/>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="14">
                            <Form.Label>Spouse National ID</Form.Label>
                            <Form.Control 
                                type="text"  
                                value={
                                    this.state.newData.spouses ? 
                                        this.state.newData.spouses[0] ? this.state.newData.spouses[0].national_id : "" 
                                    : ""
                                } 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeSpouses}
                                data-key="national_id"/>
                        </Form.Group>
                        {
                            this.state.newData.spouses && this.state.newData.spouses[0] &&  
                            this.state.newData.spouses[0].proof !== null ? 
                                <a href={this.state.newData.spouses[0].proof} 
                                    style={{color:"blue",textAlign: "center"}} 
                                    target="_blank"
                                    rel="noopener noreferrer"> Download Marriage Certificate File</a>
                            :
                            <Form.Group >
                              <Form.Label>Marriage Certificate <span>(PDF File)</span> </Form.Label>
                            <Form.Control 
                                    type="file" 
                                    className="form-control" 
                                    disabled={this.props.edited ? false : true}
                                    accept="application/pdf"
                                    onChange={this.handleChangeData}
                                    data-key="marriage_certificate"/>
                                </Form.Group> 

                        }

                    </Col>

                    <Col sm={6}>
                        <h4 className="kasihataskecil">First Child's 
                            {this.props.edited ? 
                                <i className="fas fa-trash-alt" 
                                    style={{color:"red",fontSize : "1rem", marginLeft : "10px"}}
                                    data-key="0"
                                    onClick={this.handleDeleteChild}> </i> 
                                : undefined }
                            
                        </h4>
                        <hr/>
                        <Form.Group controlId="15">
                            <Form.Label>Child's Name</Form.Label>
                            <Form.Control 
                                type="text"  
                                value={
                                    this.state.newData.childrens ? this.state.newData.childrens[0] ?  
                                        this.state.newData.childrens[0].name   : ""
                                    : ""
                                } 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleAddChild}
                                data-key="name"
                                index="0"/>
                        </Form.Group>

                        <Form.Group controlId="16">
                            <Form.Label>Child's Gender</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleAddChild}
                                data-key="gender"
                                index="0"
                                className="option"
                                value={this.state.newData.childrens ? this.state.newData.childrens[0] ?  
                                    this.state.newData.childrens[0].gender   : ""
                                : ""}>
                                <option>Select Gender</option>
                                <option>male</option>
                                <option>female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="17">
                            <Form.Label>Child's Date of Birth</Form.Label>
                            <div>
                                <DatePicker
                                    selected={
                                        this.state.newData.childrens ? this.state.newData.childrens[0] ?  
                                            c1_dob   : undefined
                                        : undefined
                                    }
                                    onChange={(date) => this.handleDateChild(date,0)}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    disabled={this.props.edited ? false : true}
                                    dateFormat="dd-MM-YYYY"
                                    maxDate={new Date()}
                                    showYearDropdown/>
                            </div>
                        </Form.Group>
                        {
                        this.state.newData.childrens && this.state.newData.childrens[0] &&
                                this.state.newData.childrens[0].proof !== undefined ? 
                                <a href={this.state.newData.childrens[0].proof} 
                                    style={{color:"blue",textAlign: "center"}} 
                                    target="_blank"
                                    rel="noopener noreferrer"> Download Children 1 Birth Certificate</a>
                                :
                                <Form.Group style={{marginBottom : "50px"}}>
                                    <Form.Label>Birth Certificate <span>(PDF File)</span> </Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        className="form-control" 
                                        disabled={this.props.edited ? false : true}
                                        onChange={this.handleChangeData}
                                        data-key="c1_birthday_certificate"/>
                                 </Form.Group>
                        }


                        <h4 className="kasihataskecil">Second Child's
                            {this.props.edited ? 
                                <i className="fas fa-trash-alt" 
                                    style={{color:"red",fontSize : "1rem", marginLeft : "10px"}}
                                    data-key="1"
                                    onClick={this.handleDeleteChild}> </i> 
                                : undefined }
                        </h4>
                        <hr/>
                        <Form.Group controlId="15">
                            <Form.Label>Child's Name</Form.Label>
                            <Form.Control 
                                type="text"  
                                defaultValue={
                                    this.state.newData.childrens ? this.state.newData.childrens[1] ?  
                                        this.state.newData.childrens[1].name   : ""
                                    : ""
                                } 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleAddChild}
                                data-key="name"
                                index="1"/>
                        </Form.Group>

                        <Form.Group controlId="16">
                            <Form.Label>Child's Gender</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleAddChild}
                                data-key="gender"
                                index="1"
                                value={
                                    this.state.newData.childrens ? this.state.newData.childrens[1] ?  
                                        this.state.newData.childrens[1].gender   : ""
                                    : ""
                                }
                                className="option">
                                <option>Select Gender</option>
                                <option>male</option>
                                <option>female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="17">
                            <Form.Label>Child's Date of Birth</Form.Label>
                            <div>
                                <DatePicker
                                    selected={
                                        this.state.newData.childrens ? this.state.newData.childrens[1] ?  
                                        c2_dob   : undefined
                                    : undefined
                                    }
                                    onChange={(date) => this.handleDateChild(date,1)}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    disabled={this.props.edited ? false : true}
                                    dateFormat="dd-MM-YYYY"
                                    data-key="1"
                                    maxDate={new Date()}
                                    showYearDropdown/>
                            </div>
                        </Form.Group>
                        {
                                this.state.newData.childrens && this.state.newData.childrens[1] &&
                                this.state.newData.childrens[1].proof !== undefined ? 
                                <a href={this.state.newData.childrens[1].proof} 
                                    style={{color:"blue",textAlign: "center"}} 
                                    target="_blank"
                                    rel="noopener noreferrer"> Download Children 2 Birth Certificate</a>
                                :
                                <Form.Group style={{marginBottom : "50px"}}>
                                    <Form.Label>Birth Certificate <span>(PDF File)</span> </Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        className="form-control" 
                                        disabled={this.props.edited ? false : true}
                                        onChange={this.handleChangeData}
                                        data-key="c2_birthday_certificate"/>
                                 </Form.Group>
                            }

                        <h4 className="kasihataskecil">Third Child's
                            {this.props.edited ? 
                                <i className="fas fa-trash-alt" 
                                    style={{color:"red",fontSize : "1rem", marginLeft : "10px"}}
                                    data-key="2"
                                    onClick={this.handleDeleteChild}> </i> 
                                : undefined }
                        </h4>
                        <hr/>
                        <Form.Group controlId="15">
                            <Form.Label>Child's Name</Form.Label>
                            <Form.Control 
                                type="text"  
                                defaultValue={
                                    this.state.newData.childrens ? this.state.newData.childrens[2] ?  
                                        this.state.newData.childrens[2].name   : ""
                                    : ""
                                } 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleAddChild}
                                data-key="name"
                                index="2"/>
                        </Form.Group>

                        <Form.Group controlId="16">
                            <Form.Label>Child's Gender</Form.Label>
                            <Form.Control
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleAddChild}
                                data-key="gender"
                                index="2"
                                value={
                                    this.state.newData.childrens ? this.state.newData.childrens[2] ?  
                                        this.state.newData.childrens[2].gender   : ""
                                    : ""
                                }
                                className="option">
                                <option>Select Gender</option>
                                <option>male</option>
                                <option>female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="17">
                            <Form.Label>Child's Date of Birth</Form.Label>
                            <div>
                                <DatePicker
                                    selected={
                                        this.state.newData.childrens ? this.state.newData.childrens[2] ?  
                                        c3_dob   : undefined
                                    : undefined
                                    }
                                    onChange={(date) => this.handleDateChild(date,2)}
                                    className="form-control"
                                    style={{width:"500px"}}
                                    disabled={this.props.edited ? false : true}
                                    dateFormat="dd-MM-YYYY"
                                    data-key="2"
                                    maxDate={new Date()}
                                    showYearDropdown/>
                            </div>
                        </Form.Group>
                        {
                            this.state.newData.childrens && this.state.newData.childrens[2] &&
                            this.state.newData.childrens[2].proof !== undefined ? 
                            <a href={this.state.newData.childrens[2].proof} 
                                style={{color:"blue",textAlign: "center"}} 
                                target="_blank"
                                rel="noopener noreferrer"> Download Children 3 Birth Certificate</a>
                            :
                            <Form.Group style={{marginBottom : "50px"}}>
                                <Form.Label>Birth Certificate <span>(PDF File)</span> </Form.Label>
                                <Form.Control 
                                    type="file" 
                                    className="form-control" 
                                    disabled={this.props.edited ? false : true}
                                    onChange={this.handleChangeData}
                                    data-key="c3_birthday_certificate"/>
                                </Form.Group>
                        }
                      
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
                        
                    </Col>
                </Row>
                </Form>
            </Container>
            
                                
        );
        
    }
}
export default HRDPersonalInfo;