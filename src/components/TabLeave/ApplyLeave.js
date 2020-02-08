import React from "react";
import { Form, Jumbotron, Button,Row,Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../css/style.css';
import {Leave} from '../../constants/Policy';
import  axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getDay from "date-fns/getDay";
import Loader from 'react-loader-spinner'
import Swal from 'sweetalert2';

var _ = require('lodash');
var diff = null;
var LeaveType = null;
var moment = require('moment-business-days');
var today = new Date();

const CUTI_TAHUNAN = "Cuti Tahunan"
const SAKIT = "Sakit"
const HAJI = "Menunaikan Ibadah Haji"
const MELAHIRKAN = "Karyawati Melahirkan"
const ISTRI_MELAHIRKAN = "Istri Melahirkan / Keguguran"
const KEGUGURAN = "Karyawati Keguguran"
const HAID ="Haid / Menstruasi"
const REMOTE = "Remote"
const URL_SUMMARY = "v1/users/leave-summary"

const swalWithBootstrapButtons = Swal.mixin({
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger margin-right',
    buttonsStyling: false,
})


moment.updateLocale('us', {
    holidays: [
        '06-03-2019',
        '06-04-2019',
        '06-05-2019',
        '06-06-2019',
        '06-07-2019',
        '08-11-2019',
        '08-17-2019',
        '09-01-2019',
        '11-09-2019',
        '12-24-2019',
        '12-25-2019'
    ],
    holidayFormat: 'MM-DD-YYYY',
    workingWeekdays: [1, 2, 3, 4, 5]
 });
 
class ApplyLeave extends React.Component{
    constructor(props) {
        super(props);
        this.displayData = [];
        this.highlightWithRanges = [
            { "react-datepicker__day--highlighted-custom-1": 
                [
                    new Date('06-03-2019'),
                    new Date('06-04-2019'),
                    new Date('06-05-2019'),
                    new Date('06-06-2019'),
                    new Date('06-07-2019'),
                    new Date('08-11-2019'),
                    new Date('08-17-2019'),
                    new Date('09-01-2019'),
                    new Date('11-09-2019'),
                    new Date('12-24-2019'),
                    new Date('12-25-2019')
                ]
            }
        ];
        
        var start = new Date();
        start.setDate(start.getDate());
        
        this.state = {
            LeaveType : [],
            leave_type : null,
            file : null,
            selectStart : null, // tanggal mulai cuti yang dipilih
            selectEnd : null , //tanggal akhir cuti yang dipilih
            duration : 0,//inisial durasi awal cuti,
            startDateSend : moment(new Date()).format('YYYY-MM-DD'),
            endDateSend : "",
            minDate : null,
            girl : null,
            gender : null,
            days : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            showProof : false,
            maxDate : null,
            getHour : today.getHours(),
            validation : [],
            loading : false
        };
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.handleLeaveType = this.handleLeaveType.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)


    }
    isWeekday = date => {
        const day = getDay(date);
        return day !== 0 && day !== 6;
      };
    onChange(e) {
        if(e.target.files[0] !== null){
            if(e.target.files[0].size > 5000000){
                e.target.value = null
                toast.error("⚠ Max size file is 5 MB", {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
            else this.setState({file: e.target.files[0]}) 
        } 
        
        
    }
    actionSubmit = () => {
        var token = 'Bearer ' + localStorage.getItem('token');
        const url = process.env.REACT_APP_DEV_BASEURL + 'v1/leave-requests';
        const formData = new FormData();
        formData.append('leave_type_id', this.refs.leave_type.value);
        formData.append('start_date', this.state.startDateSend);
        formData.append('end_date', this.state.endDateSend);
        formData.append('description', this.refs.description.value);
        formData.append('duration', this.state.duration);
        if(this.state.file !== null) {
            formData.append('proof', this.state.file);
        }
        this.setState({loading : true})
        axios({
            url     : url,
            method  : 'POST',
            data    : formData,
            headers : {
                'Content-Type'  : 'multipart/form-data',
                'Authorization' : token
            }
        }).then(() => {
            
            toast.success("✔ Success apply leave !", {
                position: toast.POSITION.TOP_RIGHT
            });
            this.setState({loading : false})
            
        }).catch(error => {
            error.response.data.validation_errors.map((validation)=>
                toast.error("⚠ " + validation, {
                    position: toast.POSITION.TOP_RIGHT
                })
            );
            this.setState({loading : false})
        })
    }
    onFormSubmit(){
        var leave_type = parseInt(this.refs.leave_type.value)
        var balanceLeave = _.find(this.state.validation, function(data) { return data.leave_type_id === leave_type ; });
        if(balanceLeave.name === REMOTE) this.actionSubmit()
        else{
            this.state.duration > balanceLeave.balance ? 
            swalWithBootstrapButtons.fire({
                title: 'Cuti yang anda ambil melebihi jumlah quota cuti?',
                text: "Jika anda melanjutkan maka akan masuk kategori not paid leave",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
                reverseButtons: true
            }).then((result) => {
                result.value && this.actionSubmit()
            }) : this.actionSubmit()
        }
        
        
        
        
    }
    handleLeaveType(event){
        var index = event.nativeEvent.target.selectedIndex;
        var leaveName = event.nativeEvent.target[index].text
        if(leaveName === KEGUGURAN || leaveName === HAJI){
            this.setState({showProof : true})
        }
        
        else{
            this.setState({showProof : false})
        }

        if(leaveName === CUTI_TAHUNAN){ 
            var start = new Date();
            start.setDate(start.getDate() + 7); // h+7
            var cuti    = moment(start).format('YYYY-MM-DD');

            this.setState({
                selectStart : start,
                minDate : start,
                duration : null,
                startDateSend : cuti,
            });
        }
        else if(leaveName === SAKIT){
            this.setState({
                selectStart :null,
                selectEnd : null,
                duration : null,
                minDate : null
            });
        }
        else{
            this.setState({
                selectStart : new Date(),
                selectEnd : null,
                minDate : new Date(),
                duration : null
            });
        }

        if(leaveName === REMOTE) {
            if(this.state.getHour < 11 ) this.setState({maxDate : new Date()})
            else {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                this.setState({
                    maxDate : tomorrow,
                    minDate :  tomorrow, 
                    selectStart: tomorrow, 
                    startDateSend : moment(tomorrow).format('YYYY-MM-DD')})
            }
        }
        else this.setState({maxDate : null})
        this.setState({leave_type : leaveName  })
        
    }
    handleChangeStart(date) {
        
        //if(moment(date).isBusinessDay()) diff = moment(this.state.selectEnd).businessDiff(moment(date)) + 1 ;
        //else diff = moment(this.state.selectEnd).businessDiff(moment(date));
        this.setState({ 
            startDateSend : moment(date).format('YYYY-MM-DD'),
            selectStart : date, 
            duration    : null,
            endDate     : date,
            selectEnd : null
        })

        if(this.state.leave_type === SAKIT && diff >= 2 || 
            this.state.leave_type === MELAHIRKAN || 
            this.state.leave_type === HAJI){
                this.setState({showProof : true})
        }
        else{
            this.setState({showProof : false})
        }

        if(this.state.leave_type === REMOTE) {
            if(this.state.getHour < 11 ) this.setState({maxDate : new Date(date)})
            else {
                var tomorrow = new Date(date);
                tomorrow.setDate(tomorrow.getDate() + 1);
                this.setState({maxDate : date, minDate :  tomorrow})
            }
        }
        else this.setState({maxDate : null})
    }
    handleChangeEnd(date){
        if(moment(date).isBusinessDay()) diff = moment(this.state.selectStart).businessDiff(moment(date)) + 1 ;
        else diff = moment(this.state.selectStart).businessDiff(moment(date));
        this.setState({ 
            endDateSend : moment(date).format('YYYY-MM-DD'),
            selectEnd   : date, 
            duration    : diff 
        })

        if(this.state.leave_type === SAKIT && diff >= 2 || 
            this.state.leave_type === KEGUGURAN || 
            this.state.leave_type === HAJI){
                this.setState({showProof : true})
        }
        else{
            this.setState({showProof : false})
        }

        if(this.state.leave_type === REMOTE) {
            if(this.state.getHour < 11 ) this.setState({maxDate : new Date(date)})
            else {
                var tomorrow = new Date(date);
                tomorrow.setDate(tomorrow.getDate() + 1);
                this.setState({maxDate : this.state.selectStart})
            }
        }
        else this.setState({maxDate : null})
    }

    componentDidMount(){
        var token = 'Bearer ' + localStorage.getItem('token');
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/users/profile'
        axios.get(url, {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}).then(res => {
           this.setState({gender : res.data.data.gender, departmentId : res.data.data.title.department.id },() => {
                url = process.env.REACT_APP_DEV_BASEURL + 'v1/leave-types';
                axios.get(url).then(res => {
                    if(this.state.gender === 'female') {
                        if(this.state.departmentId === 8 ){
                            var girl =  _.remove(res.data.data, function(n) {
                                return n.name !== ISTRI_MELAHIRKAN 
                            });
                            this.setState({LeaveType : girl})
                        }
                            
                        else {
                            var girl =  _.remove(res.data.data, function(n) {
                                return n.name !== ISTRI_MELAHIRKAN && n.name !== REMOTE
                            });
                            this.setState({LeaveType : girl});
                        }
                    }
                    else {
                        if(this.state.departmentId === 8 ){
                            var boy = _.remove(res.data.data, function(n) {
                                return n.name !== MELAHIRKAN && n.name !== KEGUGURAN && n.name !== HAID
                            });
                            this.setState({LeaveType : boy});
                        }
                        else{
                            var boy = _.remove(res.data.data, function(n) {
                                return n.name !== MELAHIRKAN && n.name !== KEGUGURAN && n.name !== HAID && n.id !== REMOTE
                            });
                            this.setState({LeaveType : boy});
                        }
                        
                    }
                });
           })
        });

        axios.get(process.env.REACT_APP_DEV_BASEURL + URL_SUMMARY,
        {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(res => {
            this.setState({
                validation : res.data.data
            })
        });        
    }
    
    render(){
        LeaveType = this.state.LeaveType.map((leave,index) => 
            <option value={leave.id} key={index}>{leave.name}</option>
        )

      return(
            <div style={{marginBottom : "150px"}}>
                <div className={ this.state.loading ? "show loader" : "hide" } style={{marginTop : "20%"}} >
                    <Loader 
                    type="Oval"
                    color="#00BDD5"
                    height="100"	
                    width="100"/>   
                </div>
                <Jumbotron>
                    <h1>Policy</h1>
                    <Leave/>
                </Jumbotron>
                <Row style={{paddingBottom : "50px"}}>
                    <Col sm={1}/>
                    <Col sm={10}>
                        <Form>
                        <Form.Group controlId="1">
                            <Form.Label>Leave Type</Form.Label>
                            <Form.Control as="select" 
                                onChange={this.handleLeaveType}
                                ref="leave_type">
                                <option></option>
                                {LeaveType}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="2">
                            <Form.Label>From</Form.Label>
                            <br></br>
                            <DatePicker 
                                key="1"
                                selected={this.state.selectStart}
                                onChange={this.handleChangeStart}
                                minDate={this.state.minDate}
                                className="form-control width200"
                                dateFormat="dd-MM-YYYY"
                                highlightDates={this.highlightWithRanges}
                                filterDate={this.isWeekday}
                                required>
                                <div style={{color: 'red',paddingLeft : "20px", paddingBottom : "5px"}}>
                                    Red : Public Holiday
                                </div>
                                </DatePicker>  
                        </Form.Group>
                        <Form.Group controlId="3">
                            <Form.Label>To</Form.Label>
                            <br></br>
                            <DatePicker
                                selected={this.state.selectEnd}
                                onChange={this.handleChangeEnd}
                                className="form-control width200"
                                minDate={this.state.selectStart}
                                maxDate={this.state.maxDate}
                                highlightDates={this.highlightWithRanges}
                                filterDate={this.isWeekday}
                                dateFormat="dd-MM-YYYY"
                            >
                            <div style={{color: 'red',paddingLeft : "20px", paddingBottom : "5px"}}>
                                    Red : Public Holiday
                                </div>
                            </DatePicker>
                        </Form.Group>
                        <b>Duration : {this.state.duration} Days</b>
                        <Form.Group controlId="4" style={{marginTop: "15px"}}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="5"
                                ref="description"
                                required/>
                        </Form.Group>
                        {
                            this.state.showProof === true ? 
                            <Form.Group controlId="5">
                                <Form.Label>Attachment <b>( PDF File and Max 5 MB )</b></Form.Label>
                                <Form.Control 
                                    type="file"  
                                    className="form-control" 
                                    onChange={this.onChange}
                                    accept="application/pdf"/>
                            </Form.Group> : undefined
                        }
                        
                        <Button variant="primary" size="lg" style={{width: "100%"}} onClick={this.onFormSubmit}>Submit</Button>
                    </Form>
                    </Col>
                    <Col sm={1}/>
                </Row>
                </div>
        );
    }
}
export default ApplyLeave;