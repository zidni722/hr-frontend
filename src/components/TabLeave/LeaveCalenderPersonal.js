import React from "react";
import Helmet from 'react-helmet';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import date from 'date-and-time';
import  axios from 'axios';
const MySwal = withReactContent(Swal);
class LeaveCalenderPersonal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          selectedDay: undefined,
          getDay : '',
          data : {},
          startPending      : [],
          endPending        : [],
          startApproved     : [],
          endApproved       : [],
          startReject       : [],
          endReject         : []
        }
        this.handleDayChange = this.handleDayChange.bind(this);
    }
    handleDayChange(selectedDays) { 
        this.setState({
            getDay : selectedDays
        });
        MySwal.fire({
            text: date.format(selectedDays, 'YYYY-MM-DD'),
        });
    }
    componentDidMount(){
        
        var token = 'Bearer ' + localStorage.getItem('token');
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/users/calendars?year=2019';
        
        var state_startPending = {...this.state.startPending}
        var state_endPending   = {...this.state.endPending}
        var state_startApproved = {...this.state.startApproved}
        var state_endApproved = {...this.state.endApproved}
        var state_startReject = {...this.state.startReject}
        var state_endReject = {...this.state.endReject}
        axios.get(url, {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}).then(res =>
            {
                res.data.data.forEach((status,i) => (
                    status.status === 'pending' ? state_startPending[i] = status.start_date : undefined ,
                    status.status === 'pending' ? state_endPending[i] = status.end_date : undefined ,
                    status.status === 'approved' ? state_startApproved[i] = status.start_date : undefined ,
                    status.status === 'approved' ? state_endApproved[i] = status.end_date : undefined ,
                    status.status === 'rejected' ? state_startReject[i] = status.start_date: undefined ,
                    status.status === 'rejected' ? state_endReject[i] = status.end_date : undefined
                     
                 ),this.setState({
                     startPending : state_startPending,
                     endPending   : state_endPending,
                     startApproved : state_startApproved,
                     endApproved : state_endApproved,
                     startReject : state_startReject,
                     endReject : state_endReject,
                     data : res.data.data
                 }))
            }
        )
    }

    
    render() {
        var i = 0;
        var timeValuesPending = [];
        var timeValuesApproved = [];
        var timeValuesRejected = [];
        var start = null;
        var end = null;
        var d = null;
        if(this.state.startPending){
            
            for(i = 0 ; i < this.state.data.length ; i++){
                start = new Date(String(this.state.startPending[i]))
                end = new Date(String(this.state.endPending[i]))
                for (d = start ; d <= end ; d.setDate(d.getDate() + 1)) {
                    timeValuesPending.push(new Date(d));
                }
            }
        }
        if(this.state.startApproved){
            
            for(i = 0 ; i < this.state.data.length ; i++){
                start = new Date(String(this.state.startApproved[i]))
                end = new Date(String(this.state.endApproved[i]))
                for (d = start ; d <= end ; d.setDate(d.getDate() + 1)) {
                    timeValuesApproved.push(new Date(d));
                }
            }
        }
        
        if(this.state.startReject){
            for(i = 0 ; i < this.state.data.length ; i++){
                start = new Date(String(this.state.startReject[i]))
                end = new Date(String(this.state.endReject[i]))
                for (d = start ; d <= end ; d.setDate(d.getDate() + 1)) {
                    timeValuesRejected.push(new Date(d));
                }
            }
        }
        
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
            pending:
                timeValuesPending.map(time => 
                    new Date(time.toString()),  
                )
            ,
            rejected:
            timeValuesRejected.map(time => 
                new Date(time.toString())    
            ),
            aprroved:
                timeValuesApproved.map(time => 
                    new Date(time.toString()),  
            )
        
        }
        return(
            <div>
                <Helmet>
                    <style>{`
                    
                    .DayPicker-Day--pending{
                        color: #F7EB01;
                        font-weight : bold;
                    }
                    .DayPicker-Day--rejected{
                        text-decoration: line-through;
                    }
                    .DayPicker-Day--today{
                        color : blue !important;
                    }
                    .DayPicker-Day--rejected:before,
                    .DayPicker-Day--rejected:after {
                        content: "\u00a0\u00a0";
                    }
                    .DayPicker-Day--aprroved{
                        color: limegreen;
                        font-weight : bold;
                    }
                    .DayPicker-Day--outside{
                        background-color:white;
                        text-decoration : none;
                    }
                    .DayPicker-Day--holiday, DayPicker-Day--holiday:hover {
                        background-color: white;
                        color: red !important;
                        text-decoration: none !important;
                        font-weight : normal !important;
                        
                    }
                    .DayPicker-Day--disabled{
                        color: red !important;
                        text-decoration: none !important;
                        font-weight : normal !important;
                    }
                    
                    `}</style>
                </Helmet>
                <DayPicker 
                    month={new Date(2019, 0)}
                    modifiers={modifiers} 
                    // onDayClick={this.handleDayChange}
                    numberOfMonths={12}
                    canChangeMonth={false}
                    disabledDays={[ { daysOfWeek: [0, 6] }]}
                />
            </div>
        );
    }
}
export default LeaveCalenderPersonal;