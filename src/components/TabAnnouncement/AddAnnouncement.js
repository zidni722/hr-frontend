import React from "react";
import {Form,Row,Col,Container,Button } from 'react-bootstrap';
// import '../../../css/style.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from 'axios';

var moment = require('moment-business-days');
class AddAnnouncement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab       : props.activeTab || 1,
            start_date : null,
            end_date : null,
            description : null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      handleSubmit(){
          var url = process.env.REACT_APP_DEV_BASEURL + 'v1/announcements'
          var data = {
            start_date : moment(this.state.start_date).format("YYYY-MM-DD"),
            end_date : moment(this.state.end_date).format("YYYY-MM-DD"),
            description : this.refs.description.value 
          }
          Axios.post(url,data).then(res => {
          })
      }
    render(){
        return(
            <Container style={{paddingRight : "5%",paddingLeft : "5%"}}>
            <Form onSubmit={this.handleSubmit}>
            <Row>

                <Col sm={12}>
                
                    <Form.Group controlId="1">
                        <Form.Label>Start Date</Form.Label>
                        <div>
                            <DatePicker
                                required
                                selected={this.state.start_date}
                                onChange={(date) => this.setState({start_date : date})}
                                minDate={new Date()}
                                className="form-control"
                                style={{width:"500px"}}
                                dateFormat="dd-MM-YYYY"
                            />
                        </div>
                    </Form.Group>
                    <Form.Group controlId="1">
                        <Form.Label>End Date</Form.Label>
                        <div>
                            <DatePicker
                                required
                                selected={this.state.end_date}
                                onChange={(date) => this.setState({end_date : date})}
                                minDate={this.state.start_date}
                                className="form-control"
                                style={{width:"500px"}}
                                dateFormat="dd-MM-YYYY"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group controlId="8">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            required
                            as="textarea"
                            rows="3" 
                            ref="description"/>
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
export default AddAnnouncement;