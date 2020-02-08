import React from "react";
import {Form, Button,Row,Col,Container } from 'react-bootstrap';
import Axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';

var listBank = [];
class BenefitInfo extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            validate_npwp : false,
            validate_bpjs_ks : false,
            validate_bpjs_kt : false,
            data    : [],
            bank    : [],
            newData : {
                npwp: "",
                bpjs_tenagakerja: "",
                bpjs_kesehatan: ""
            },
            user_banks: null,
            bank_id : null
        }
        this.handleChangeData = this.handleChangeData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(){
        var token = 'Bearer ' + localStorage.getItem('token');
        var dataSend = {
            npwp                : this.state.newData.npwp,
            bpjs_tenagakerja    : this.state.newData.bpjs_tenagakerja,
            bpjs_kesehatan      : this.state.newData.bpjs_kesehatan,
            user_banks          : this.state.user_banks === null ? [] : [this.state.user_banks]
        }
        Axios.post(process.env.REACT_APP_DEV_BASEURL + 'v1/users/benefit-info',dataSend,
            {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(res => {
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
    handleChangeData(event){
        let newData = Object.assign({}, this.state.newData);
        var key = event.target.getAttribute('data-key');
        if(key === 'bank_id' || key === 'bank_account' || key === 'beneficiary_name'){
            var user_banks = {...this.state.user_banks}
            if(key === 'bank_id'){
                user_banks[key] = parseInt(this.state.bank_id);
                if(this.state.newData.length > 0){
                    var data = {...this.state.newData}
                    data.user_banks[0].bank_id = parseInt(this.state.bank_id)
                }
                
            } 
            else user_banks[key] = event.target.value;
            this.setState({user_banks : user_banks});
            
        }
        else newData[key] = event.target.value;

        if(key === "npwp")
            event.target.value.toString().length < 16 ? 
                this.setState({validate_npwp : true}) : 
                this.setState({validate_npwp : false})
        if(key === "bpjs_kesehatan")
            event.target.value.toString().length < 13 ? 
                this.setState({validate_bpjs_ks : true}) : 
                this.setState({validate_bpjs_ks : false})
        if(key === "bpjs_tenagakerja")
        event.target.value.toString().length < 11 ? 
            this.setState({validate_bpjs_kt : true}) : 
            this.setState({validate_bpjs_kt : false})
        if(key === "")
        this.setState({newData});
    }

    handleBankId = () => {
        let newData = Object.assign({}, this.state.newData);
        var user_banks = {...this.state.user_banks}
        user_banks['bank_id'] = parseInt(this.state.bank_id.value);
        if(this.state.newData.length > 0){
            var data = {...this.state.newData}
            data.user_banks[0].bank_id = parseInt(this.state.bank_id.value)
        }
        this.setState({user_banks : user_banks});
       this.setState({newData});

    }
    componentDidUpdate(previousProps){
        if(previousProps.data !== this.props.data){
            var data = {...this.state.newData}
            if(this.props.data.user_banks.length > 0){
                var bank_id = {value : this.props.data.user_banks[0].bank.id, label : "Bank " +  this.props.data.user_banks[0].bank.name}
                var bank_account = this.props.data.user_banks[0].bank_account
                var beneficiary_name = this.props.data.user_banks[0].beneficiary_name
                var user_banks = {
                    bank_account : bank_account,
                    bank_id : bank_id.value,
                    beneficiary_name : beneficiary_name
                }
                data.user_banks = [user_banks]
                this.setState({user_banks : user_banks, bank_id : bank_id})
            }
            
            data.npwp               = this.props.data.npwp;
            data.bpjs_tenagakerja   = this.props.data.bpjs_tenagakerja;
            data.bpjs_kesehatan     = this.props.data.bpjs_kesehatan;
            this.setState({ newData  : data })

            
        }
        if(previousProps.listBank !== this.props.listBank){
            listBank = this.props.listBank.map((data) => {
                return(
                    {label: "Bank " + data.name, value : data.id}
                )
            });
        } 
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
                            <Form.Label>Tax ID (NPWP)</Form.Label>
                            <Form.Label style={{color:"red",float:"right"}}>*required</Form.Label>
                            <Form.Control  
                                type="number"
                                required 
                                defaultValue={this.state.newData.npwp} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="npwp"
                                 keyboardType='numeric'/>
                            {
                                this.state.validate_npwp && 
                                    <Form.Label style={{color:"red"}}>NPWP Not Valid</Form.Label>
                            }
                        </Form.Group>

                    </Col>

                    <Col sm={4}>
                        <h5 className="kasihataskecil">BPJS</h5>
                        <hr/>
                        <Form.Group controlId="2">
                            <Form.Label>BPJS Ketenagakerjaan </Form.Label>
                            <Form.Control 
                                type="number" 
                                defaultValue={this.state.newData.bpjs_tenagakerja} 
                                disabled={this.props.edited ? false : true}
                                data-key="bpjs_tenagakerja"
                                onChange={this.handleChangeData}/>
                                {
                                     this.state.validate_bpjs_kt && 
                                     <Form.Label style={{color:"red"}}>BPJS Ketenagakerjaan Not Valid</Form.Label>
                                }
                        </Form.Group>

                        <Form.Group controlId="3">
                            <Form.Label>BPJS Kesehatan</Form.Label>
                            <Form.Control 
                                type="number" 
                                defaultValue={this.state.newData.bpjs_kesehatan} 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="bpjs_kesehatan"/>
                            {
                                this.state.validate_bpjs_ks && 
                                <Form.Label style={{color:"red"}}>BPJS Kesehatan Not Valid</Form.Label>
                            }
                        </Form.Group>
                    
                    </Col>
                    <Col sm={4}>
                        <h5 className="kasihataskecil">Bank Account</h5>
                        <hr/>
                        <Form.Group controlId="4">
                            <Form.Label>Bank Name</Form.Label>
                            <Select 
                                isDisabled={this.props.edited ? false : true}
                                options={listBank} 
                                data-key="bank_id"
                                value={this.state.bank_id}
                                onChange={value => this.setState({bank_id: value},() => this.handleBankId()  )}
                                placeholder="Choose Bank Name"
                                />
                        </Form.Group>
                        <Form.Group controlId="4">
                            <Form.Label>Bank Account </Form.Label>
                            <Form.Control 
                                type="text"  
                                defaultValue={
                                    this.state.newData.user_banks ? 
                                    this.state.newData.user_banks[0] ? this.state.newData.user_banks[0].bank_account :undefined
                                    :undefined
                                } 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="bank_account"/>
                        </Form.Group>
                        <Form.Group controlId="6">
                            <Form.Label>Beneficiary Name</Form.Label>
                            <Form.Control 
                                type="text"
                                defaultValue={
                                    this.state.newData.user_banks ? 
                                        this.state.newData.user_banks[0] ? this.state.newData.user_banks[0].beneficiary_name :undefined
                                    :undefined
                                } 
                                disabled={this.props.edited ? false : true}
                                onChange={this.handleChangeData}
                                data-key="beneficiary_name"/>
                        </Form.Group>
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
export default BenefitInfo;