import React from "react";
import Helmet from 'react-helmet';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Modal from 'react-modal';
import '../../css/style.css';
import {Button, Col, Row} from 'react-bootstrap';
import Axios from "axios";

var moment = require('moment-business-days');
const modalStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '50%'
    }
  };

const modifiers = {
    holiday: [
        new Date(2019, 0, 1),
        new Date(2019, 1, 5),
        new Date(2019, 2, 7),
        new Date(2019, 3, 3),
        new Date(2019, 3, 19),
        new Date(2019, 4, 30),
        new Date(2019, 5, 1),
        new Date(2019, 5, 3),
        new Date(2019, 5, 4),
        new Date(2019, 5, 5),
        new Date(2019, 5, 6),
        new Date(2019, 5, 7),
        new Date(2019, 7, 11),
        new Date(2019, 7, 17),
        new Date(2019, 8, 1),
        new Date(2019, 10, 9),
        new Date(2019, 11, 24),
        new Date(2019, 11, 25),
    ],
    pending:[
        new Date(2019, 1, 18),
        new Date(2019, 1, 19),
        new Date(2019, 1, 22),
    ],
    aprroved:[
        new Date(2019,3,5)
    ]
    

}
class LeaveCalenderHRD extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        //   selectedDay: undefined,
            getDay : '',
            modalIsOpen: false,
            approvedLeave : [],
            pendingLeave : [],
            rejectLeave : []
        }
        this.handleDayChange = this.handleDayChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    handleDayChange(selectedDays) { //Get tanggal yang diklik
        this.setState({approvedLeave : [], pendingLeave : [], rejectLeave : []})
        var day = moment(selectedDays).format("YYYY-MM-DD");
        var url = process.env.REACT_APP_DEV_BASEURL + "v1/hr/calendars/" + day;
        var data = null;
        var token   = "Bearer " + localStorage.getItem('token');
        Axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
            res.data.data.forEach((res) => {
                data = { id : res.id,name: res.user.name, depart: res.user.title.department.name}
                if(res.status === 'approved')   this.state.approvedLeave.push(data);
                if(res.status === 'pending')    this.state.pendingLeave.push(data);
                if(res.status === 'rejected')   this.state.rejectLeave.push(data);
            })
            this.setState({ getDay : selectedDays, modalIsOpen : true});
        })
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    
    
    closeModal() {
        this.setState({modalIsOpen: false});
    }


    render() {
        const renderApproved = this.state.approvedLeave.map(data => {
            return(
                <Row>
                    <Col xs={5}>
                    <p style={{marginBottom : "0px"}}>
                        {data.depart}
                    </p> 
                    </Col>
                    <Col xs={7}>
                        <p style={{marginBottom : "0px"}}>
                            <b style={{color:"green"}}> {data.name}</b>     
                        </p> 
                    </Col>
                </Row>
            );
        });
        const renderPending = this.state.pendingLeave.map(data => {
            return(
                <Row>
                    <Col xs={5}>
                    <p style={{marginBottom : "0px"}}>
                        {data.depart}
                    </p> 
                    </Col>
                    <Col xs={7}>
                        <p style={{marginBottom : "0px"}}>
                            <b style={{color: "rgb(247, 205, 1)"}}> {data.name}</b>     
                        </p> 
                    </Col>
                </Row>

            );
        })
        const renderReject = this.state.rejectLeave.map(data => {
            return(
                <Row>
                    <Col xs={5}>
                    <p style={{marginBottom : "0px"}}>
                        {data.depart}
                    </p> 
                    </Col>
                    <Col xs={7}>
                        <p style={{marginBottom : "0px"}}>
                            <b style={{color: "red"}}> {data.name}</b>     
                        </p> 
                    </Col>
                </Row>
            );
        })
        return(
            <div>
                <Helmet>
                    <style>{`
                    .DayPicker-Day--today{
                        color :blue
                    }
                    .DayPicker-Day--holiday, DayPicker-Day--holiday:hover {
                        background-color: white;
                        color: red;
                    }
                    .DayPicker-Day--outside{
                        background-color:white;
                    }
                    .DayPicker-Day--disabled{
                        color: red;
                    }
                    
                    `}</style>
                </Helmet>
                <DayPicker 
                    month={new Date(2019, 0)}
                    modifiers={modifiers} 
                    onDayClick={this.handleDayChange}
                    numberOfMonths={12}
                    canChangeMonth={false}
                    disabledDays={[ { daysOfWeek: [0, 6] }]}
                />
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={modalStyles}
                    contentLabel="Example Modal">
                    <div>
                    {moment(this.state.getDay).format('DD/MM/YYYY')}
                    </div>
                    {renderApproved}
                    {renderPending}
                    {renderReject}
                    <Button 
                        variant="light"
                        style={{float : "right"}}
                        onClick={this.closeModal}>Close</Button>
                    

                </Modal>
                
            </div>
        );
    }
}

export default LeaveCalenderHRD;