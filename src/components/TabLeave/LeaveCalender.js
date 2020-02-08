import React from "react";
import Helmet from 'react-helmet';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Modal from 'react-modal';

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
    // pending:[
    //     new Date(2019, 1, 18),
    //     new Date(2019, 1, 19),
    //     new Date(2019, 1, 22),
    // ],
    // aprroved:[
    //     new Date(2019,3,5)
    // ]
    

}
class LeaveCalenderHRD extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        //   selectedDay: undefined,
            getDay : '',
            modalIsOpen: false,
            approvedLeave : [
                {
                    name    : 'Irsyad Nurilhaq',
                    depart  : 'Technology'
                },
                {
                    name    : 'Ahmad Maulana',
                    depart  : 'Technology'
                }],
            pendingLeave : [
                {
                    name    : "Irsyad",
                    depart  : "Product"
                }
            ],
            rejectLeave : [
                {
                    name    : "Ahmad",
                    depart  : "HR"
                }
            ]
        }
        this.handleDayChange = this.handleDayChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    handleDayChange(selectedDays) { //Get tanggal yang diklik        
        this.setState({
            getDay : selectedDays,
            modalIsOpen : true,
        });
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
                <p style={{marginBottom : "0px"}}>
                    <b style={{color:"green"}}> {data.name}</b> 
                    {data.depart}
                </p> 
            );
        });
        const renderPending = this.state.pendingLeave.map(data => {
            return(
                <p style={{marginBottom : "0px"}}>
                    <b style={{color: "yellow"}}> {data.name}</b>
                    {data.depart}
                </p>
            );
        })
        const renderReject = this.state.rejectLeave.map(data => {
            return(
                <p style={{marginBottom : "0px"}}>
                    <b style={{color: "red"}}> {data.name}</b>
                    {data.depart}
                </p>
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
                    contentLabel="Example Modal"
                    >

                    {renderApproved}
                    {renderPending}
                    {renderReject}
                    <button onClick={this.closeModal} style={{float : "right"}}>close</button>

                </Modal>
                
            </div>
        );
    }
}

export default LeaveCalenderHRD;