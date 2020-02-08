import React from "react";
import {Form, Row,Col,Container } from 'react-bootstrap';
import '../../css/style.css';
import Man from '../../image/man.png';
import Girl from '../../image/girl.png';
import Moment from "moment";
import Axios from "axios";


var servicePeriod = null;
class TeamDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            file   : null,
            id_team : null,
            data : {}
        };
    }
    componentDidUpdate(previousProps){
        if(previousProps.id_team !== this.props.id_team){
            var token = 'Bearer ' + localStorage.getItem('token');
            var url   = process.env.REACT_APP_DEV_BASEURL + 'v1/reporting-managers/users/' + this.props.id_team;
            Axios.get(url,{'headers' : {'Authorization' : token}}).then(res=>{
                this.setState({
                    data : res.data.data, 
                    join_date : res.data.data.join_date
                })
                if(res.data.data.photo_profile !== null){
                    this.setState({
                        file : res.data.data.photo_profile
                    })
                }
                else{
                    if(res.data.data.gender === 'male'){
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
            })
            
        }
    }
      
    render(){
            var d1= new Date();
            var d2 = new Date(this.state.join_date)
            var m = Moment(d1);
            var years = m.diff(d2, 'years');
            m.add(-years, 'years');
            var months = m.diff(d2, 'months');
            m.add(-months, 'months');
            var days = m.diff(d2, 'days');

            if (years <= 0) servicePeriod  = months + " Months " + days + " Days"
            if (years > 0) servicePeriod  = years + " Years " + months + " Months " + days + " Days"
            if (months <= 0 ) servicePeriod  = days + " Days"
            
        return(
            
            <Container>
                <Form>
                <Row>
                    <Col sm={3}>
                        <center>
                            <img src={this.state.file} alt="Foto Profile" className="foto-profile"/>
                            <div className="box">
                                <input 
                                    type="file" 
                                    name="file-4[]" 
                                    id="file-4" 
                                    className="inputfile inputfile-3" 
                                    data-multiple-caption="{count} files selected" 
                                   />
                                
                            </div>
                            
                        </center>
                    </Col>
                    <Col sm={9}>
                    
                        <Form.Group controlId="id">
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control
                                disabled={true}
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.data.EmployeeID}/>
                        </Form.Group>

                        <Form.Group controlId="2">
                            <Form.Label>Employee Name</Form.Label>
                            <Form.Control 
                                disabled
                                type="text" 
                                defaultValue={this.state.data.name}/>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control as="select"
                                disabled>
                                <option>{this.state.data.title && this.state.data.title.department.name}</option>
                                
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control as="select"
                                disabled>
                                <option>{this.state.data.title && this.state.data.title.name}</option>
                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId="4">
                            <Form.Label>Employee Status</Form.Label>

                            <Form.Control as="select"  
                                disabled>
                                <option>{this.state.data.status}</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="5">
                            <Form.Label>Employee Type</Form.Label>
                            <Form.Control as="select" 
                                disabled>
                                <option>{this.state.data.type}</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="6">
                            <Form.Label>Join Date</Form.Label>
                            <Form.Control
                                disabled
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.data && this.state.data.join_date}/>
                        </Form.Group>

                        <Form.Group controlId="7">
                            <Form.Label>Service Period</Form.Label>
                            <Form.Control  
                                disabled
                                type="text" 
                                className="text-muted" 
                                defaultValue={servicePeriod}/>
                        </Form.Group>

                        <Form.Group controlId="8">
                            <Form.Label>End 1st Contract</Form.Label>
                            <Form.Control 
                                type="text" 
                                disabled
                                className="text-muted" 
                                defaultValue="-"
                                onChange={this.handleChangeData}
                                data-key="end_1st_contract" />
                        </Form.Group>

                        <Form.Group controlId="9">
                            <Form.Label>End 2nd Contract</Form.Label>
                            <Form.Control 
                                disabled
                                type="text"
                                className="text-muted" 
                                defaultValue="-" 
                                data-key="end_2nd_contract"/>
                        </Form.Group>

                        <Form.Group controlId="10">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled>
                                <option>{}</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="11">
                            <Form.Label>Direct Manager Name</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled
                                onChange={this.handleChangeData}
                                data-key="manager">
                                <option>-</option>
                            </Form.Control>
                            
                        </Form.Group>

                        <Form.Group controlId="12">
                            <Form.Label>HR-BP Name</Form.Label>
                            <Form.Control 
                                disabled 
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.hr}
                                onChange={this.handleChangeData}
                                data-key="bp_name" />
                        </Form.Group>

                        <Form.Group controlId="13" style={{marginBottom : "50px"}}>
                            <Form.Label>Office Email</Form.Label>
                            <Form.Control 
                                disabled 
                                type="text" 
                                className="text-muted" 
                                defaultValue={this.state.data.office_email}/>
                        </Form.Group>       
                    </Col>
                </Row>
                </Form>
            </Container>
            

        );
    }
}
export default TeamDetail;