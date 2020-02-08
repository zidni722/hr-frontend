import React from "react";
import {Form, Button,Row,Col,Container } from 'react-bootstrap';
import '../../../css/style.css';
import Axios from "axios";
import { toast } from 'react-toastify';

var renderBank = null;
class HRDBenefitInfo extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            user_banks : [],
            npwp : null,
            bpjs_tenagakerja : null,
            bpjs_kesehatan : null,
            userbanksend : [],
            bank : null
        }
        this.handleChangeData = this.handleChangeData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(){
        var data = {
            npwp : this.state.npwp,
            bpjs_tenagakerja : this.state.bpjs_tenagakerja,
            bpjs_kesehatan : this.state.bpjs_kesehatan,
            user_banks : this.state.userbanksend
        }
        var token = 'Bearer ' + localStorage.getItem('token');
        var url_submit = process.env.REACT_APP_DEV_BASEURL + "v1/hr/users/benefit-info/" + this.state.id           
        Axios.post(url_submit,data,
            {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(() => {
            window.location.reload();
        }).catch((error) => {
            error.response.data.validation_errors.map((validation)=>
            toast.error("⚠ " + validation, {
                position: toast.POSITION.TOP_RIGHT
            })
        );
        })
    }
    handleChangeData(event){
        var key = event.target.getAttribute('data-key');
        if(key === 'bank_id' || key === 'bank_account' || key === 'beneficiary_name'){
            var user_banks = {...this.state.userbanksend[0]}
            if(key === 'bank_id'){
                user_banks[key] = parseInt(event.target.value);
            } 
            else user_banks[key] = event.target.value;
            this.setState({userbanksend : [user_banks]});
            
        }
    }
    
    componentDidUpdate(previousProps){
        if(previousProps.data !== this.props.data){
            
            this.setState({
                id : this.props.data.id,
                npwp : this.props.data.npwp,
                bpjs_tenagakerja : this.props.data.bpjs_tenagakerja,
                bpjs_kesehatan : this.props.data.bpjs_kesehatan,
                user_banks : this.props.data.user_banks 
            })
            if(this.props.data.user_banks.length > 0){
                this.setState({
                    userbanksend : [{
                        id : this.props.data.user_banks[0].id,
                        bank_id : this.props.data.user_banks[0].bank.id,
                        bank_account : this.props.data.user_banks[0].bank_account,
                        beneficiary_name : this.props.data.user_banks[0].beneficiary_name
                    }]
                })
            }
        }
    }
    componentDidMount(){
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/banks';
        Axios.get(url).then(res => {
            this.setState({listBank : res.data.data},() => {
                renderBank = this.state.listBank && this.state.listBank.map((data,index) => {
                    return(
                        <option key={index} value={data.id}>Bank {data.name}</option>
                    )
                })
            })
        })
        
    }
    
    render(){
        
        return(
            <Container>
                 <Form onSubmit={(e) => {this.handleSubmit(); e.preventDefault();}}>
                <Row>
                    <Col sm={4}>
                        <h5 className="kasihataskecil">Tax</h5>
                        <hr/>
                        <Form.Group controlId="1">
                            <Form.Label>*Tax ID (NPWP)</Form.Label>
                            <Form.Control  
                                type="text" 
                                defaultValue={this.state.npwp} 
                                disabled={this.props.edited ? false : true}
                                onChange={() => this.setState({npwp : this.refs.npwp.value})}
                                ref="npwp"/>
                        </Form.Group>

                    </Col>

                    <Col sm={4}>
                        <h5 className="kasihataskecil">BPJS</h5>
                        <hr/>
                        <Form.Group controlId="2">
                            <Form.Label>BPJS Ketenagakerjaan </Form.Label>
                            <Form.Control 
                                type="text" 
                                defaultValue={this.state.bpjs_tenagakerja} 
                                disabled={this.props.edited ? false : true}
                                ref="bpjs_ketenagakerjaan"
                                onChange={() => this.setState({bpjs_tenagakerja : this.refs.bpjs_ketenagakerjaan.value})}/>
                        </Form.Group>

                        <Form.Group controlId="3">
                            <Form.Label>BPJS Kesehatan</Form.Label>
                            <Form.Control 
                                type="text" 
                                defaultValue={this.state.bpjs_kesehatan} 
                                disabled={this.props.edited ? false : true}
                                onChange={() => this.setState({bpjs_kesehatan : this.refs.bpjs_kesehatan.value})}
                                ref="bpjs_kesehatan"/>
                        </Form.Group>
                    
                    </Col>
                    <Col sm={4}>
                        <h5 className="kasihataskecil">Bank Account</h5>
                        <hr/>
                        <Form.Group controlId="4">
                            <Form.Label>Bank Account </Form.Label>
                            <Form.Control 
                                type="text"  
                                defaultValue={this.state.user_banks[0] && this.state.user_banks[0].bank_account} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="bank_account"/>
                        </Form.Group>

                        <Form.Group controlId="5">
                            <Form.Label>Bank Name</Form.Label>
                            <Form.Control 
                                as="select" 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="bank_id"
                                value={this.state.userbanksend[0] && this.state.userbanksend[0].bank_id}>
                                {renderBank}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="6">
                            <Form.Label>Beneficiary Name</Form.Label>
                            <Form.Control 
                                type="text"  
                                defaultValue={this.state.user_banks[0] && this.state.user_banks[0].beneficiary_name} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="beneficiary_name"/>
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
export default HRDBenefitInfo;