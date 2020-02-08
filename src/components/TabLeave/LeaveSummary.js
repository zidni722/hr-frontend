import React from "react";
import {Table } from 'react-bootstrap';
import Axios from 'axios';

var token = 'Bearer ' + localStorage.getItem('token');
const URL_SUMMARY = "v1/users/leave-summary"
var _ = require('lodash');

class LeaveSummary extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            records : []
        };
    }
    loadData(){
        Axios.get(process.env.REACT_APP_DEV_BASEURL + URL_SUMMARY,
        {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(res => {
            this.setState({
                records : res.data.data
            })
            
        });
        
    }

    componentDidMount(){
        this.loadData()
    }
    render(){
        var arrayLeaveSummary = _.filter(this.state.records, (o) => o.leave_type_name != "Remote")
        var renderData = arrayLeaveSummary.map((data, index) => {
            return (
                <tr key={index}>
                    <td>{data.leave_type_name}</td>
                    <td>{data.entitlement}</td>
                    <td>{data.carry_over}</td>
                    <td>{data.taken}</td>
                    <td>{data.balance}</td>
                </tr>
            );
        })
        return(
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Leave Type</th>
                        <th>Leave Entitlement</th>
                        <th>Carry Over</th>
                        <th>Leave Taken</th>
                        <th>Leave Balance</th>

                    </tr>
                </thead>
                <tbody>
                    {renderData}
                </tbody>
                </Table>
        );
    }
}
export default LeaveSummary;