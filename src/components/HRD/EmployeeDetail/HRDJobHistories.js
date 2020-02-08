import React from 'react';

import { Col, Row} from 'react-bootstrap';



class HRDJobHistories extends React.Component{
    constructor(props){
        super(props);
        this.state = {
           
            job_histories   : [
                {
                    title                   : 'Software Engineer',
                    depart                  : 'Technology',
                    transfer_date           : '2019/01/01',
                    probation_review_date	: '2019/01/01',
                    probation_end_date      : '2019/01/01'
                },
            ]
        }
    }
    
    render(){
        const jobhistories = this.state.job_histories.map((job,index) => {
           return(
            <Row
                key={index}>
                <Col xs={3}>
                <p style={{marginBottom : "0px",color : "black"}}>
                    {job.title}
                </p> 
                </Col>
                <Col xs={2} >
                    <p style={{marginBottom : "0px",color : "black"}}>
                        {job.depart}    
                    </p> 
                </Col>
                <Col xs={2}>
                    <p style={{marginBottom : "0px",color : "black"}}>
                        {job.transfer_date}    
                    </p> 
                </Col>
                <Col xs={2}>
                    <p style={{marginBottom : "0px",color : "black"}}>
                        {job.probation_end_date}    
                    </p> 
                </Col>
                <Col xs={2}>
                    <p style={{marginBottom : "0px",color : "black"}}>
                        {job.probation_review_date}    
                    </p> 
                </Col>
            </Row>
           );
        })
        
        return(
            <div style={{marginBottom : "15px"}}>
                <Row>
                <Col xs={3}>
                    <p style={{marginBottom : "0px",color : "black"}}>
                        <b>Title</b>
                    </p> 
                </Col>
                <Col xs={2} >
                    <p style={{marginBottom : "0px",color : "black"}}>
                        <b>Department</b> 
                    </p> 
                </Col>
                <Col xs={2}>
                    <p style={{marginBottom : "0px",color : "black"}}>
                        <b>Transfer Date</b>
                    </p> 
                </Col>
                <Col xs={2}>
                    <p style={{marginBottom : "0px",color : "black"}}>
                        <b>Probation End Date</b>    
                    </p> 
                </Col>
                    <Col xs={2}>
                        <p style={{marginBottom : "0px",color : "black"}}>
                            <b>Probation Review Date</b>  
                        </p> 
                    </Col>
                </Row>
                <tr><td colSpan="6" align="center">No Data Found</td></tr>                
                {jobhistories}
            </div>
            
        );
    }
}
export default HRDJobHistories;