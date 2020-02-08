import React from "react";
import {Table } from 'react-bootstrap';
import Axios from 'axios';

var token = 'Bearer ' + localStorage.getItem('token');


class LeaveSummaryDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            records : [],
            id : null
        };
    }
    loadData(id){
        Axios.get(process.env.REACT_APP_DEV_BASEURL + "v1/hr/users/leave-summary?user-id=" + id,
        {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(res => {
            this.setState({
                records : res.data.data
            })
        });
        
    }
    componentDidUpdate(previousProps){
        if(previousProps.id !== this.props.id){
          this.loadData(this.props.id)
        }
    }
    render(){
        var renderData = this.state.records.map((data, index) => {
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
export default LeaveSummaryDetail;