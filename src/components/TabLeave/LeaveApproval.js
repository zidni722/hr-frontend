import React from "react";
import {Table,Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../../css/style4.css';
import '../../css/style.css';
import Axios from "axios";
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isManager,{isLead} from '../../action/LeadManager';


const swalWithBootstrapButtons = Swal.mixin({
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger margin-right',
    buttonsStyling: false,
})
var moment = require('moment-business-days');
var token   = "Bearer " + localStorage.getItem('token');


class LeaveApproval extends React.Component{
    constructor(){
        super();
        this.state = {
            totalPage : 1,
            currentPage: 1,
            datas : [],
            loading : false,
            url_prefix : '',
            isLead : null
        };
        this.handleReject = this.handleReject.bind(this);
        this.handelAccept = this.handelAccept.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.loadData = this.loadData.bind(this);
        
    }
    handlePageClick(data){
        let selected = data.selected + 1;
        this.setState({ currentPage: selected }, () => {
            this.loadData();
        });
    }
    handleReject = (id) =>{
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You reject this leave",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
              var url_reject = 'v1/'+ this.state.url_prefix +'/leave-requests/'+ id +'/reject';
              Axios.get(process.env.REACT_APP_DEV_BASEURL + url_reject,
                {'headers' : {'Authorization' : token}}).then(() => {
                    swalWithBootstrapButtons.fire(
                    'Done!',
                    'Rejected.',
                    'success'
                  );
                  this.loadData();
                })
            }
          })
    }

    handelAccept(id){
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You accept this leave",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            reverseButtons: true
          }).then((result) => {

            if (result.value) {
                var url_approve = process.env.REACT_APP_DEV_BASEURL + 'v1/'+ this.state.url_prefix +'/leave-requests/'+id+'/approve';
                Axios.get(url_approve,{'headers' : {'Authorization' : token}}).then(() => {
                    swalWithBootstrapButtons.fire(
                        'Accepted!',
                        '',
                        'success'
                    );
                    this.loadData()
                }).catch(error => {
                    toast.error("⚠ " + error.response.data.message , {
                        position: toast.POSITION.TOP_RIGHT
                    })
                })
            }
          })
    }

    loadData(url){
        if(url === undefined || url === null) url = this.state.url_prefix
        this.setState({loading:true})
        var url_get     = process.env.REACT_APP_DEV_BASEURL + "v1/"+ url +"/leave-requests?paging=true&page="+this.state.currentPage;
        Axios.get(url_get,{'headers' : {'Authorization' : token}}).then(res => {
            this.setState({datas : res.data.data.records, totalPage : res.data.data.total_page, loading : false})
        }).catch(() => this.setState({loading : false}));
    }
    
    componentDidMount(){
        isManager().then(res=>{
            if(res === true){
                this.loadData('reporting-managers');
                this.setState({url_prefix : 'reporting-managers', isManager : true})
            }
        })
        isLead().then(res=>{
            if(res === true){
                this.loadData('leads');
                this.setState({url_prefix : 'leads', isLead : true})
            }
        })
    }
    componentDidUpdate(previousProps){
        if (previousProps.data !== this.props.data){
            this.setState({depart_id : this.props.data.title.department.id})
        }
    }

    render(){
        
        const renderData = this.state.datas.map((data) => {
            
            return (
                <tr key={data.id}>
                    <td>{data.user.name}</td>
                    <td>{data.leave_type.name}</td>
                    <td>{moment(data.start_date).format("DD/MM/YYYY")}</td>
                    <td>{moment(data.end_date).format("DD/MM/YYYY")}</td>
                    <td>{data.duration} days</td>
                    <td>{data.description}</td>
                    <td>{data.proof === process.env.REACT_APP_DEV_URL_PROOF ? "-" 
                        : <a href={data.proof} 
                            style={{color:"blue",textAlign: "center"}} 
                            target="_blank"
                            rel="noopener noreferrer"> Download</a>}</td>
                    <td>{data.status}</td>
                    {
                        this.state.isLead && data.status === 'pending' || data.user.lead_id === null && data.status === 'pending' ? 
                        <td>
                        <Button 
                            variant="danger" 
                            style={{marginRight : "5px", marginBottom : "5px", width : "100%"}}
                            onClick={() => this.handleReject(data.id)}
                            >Reject
                        </Button>
                        <Button 
                            variant="success"
                            style={{width : "100%"}}
                            onClick={() => this.handelAccept(data.id)}
                            >Accept</Button>
                    </td>
                    : <td> - </td>
                    }
                    
                     
                </tr>
            );
        });

        return(
           <div>
               <div className={ this.state.loading ? "show loader" : "hide" } >
                    <Loader 
                    type="Oval"
                    color="#00BDD5"
                    height="100"	
                    width="100"/>   
                </div>
                <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Requester</th>
                        <th>Leave Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Duration</th>
                        <th>Description</th>
                        <th>Attachment</th>
                        <th>Status</th>
                        <th>Action</th>
                        {/* {
                            this.state.isLead && <th>Action</th>
                        }
                         */}
                    </tr>
                </thead>
                <tbody>
                    {this.state.datas.length === 0 ? 
                        <tr><td colSpan="9" align="center">No Data Found</td></tr> 
                        : renderData}
                </tbody>
                </Table>
                <div className="float-right">
                <ReactPaginate
                    previousLabel={'‹'}
                    nextLabel={'›'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    pageCount={this.state.totalPage}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'page-link'}
                    activeClassName={'pageactive'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-link'}
                    nextClassName={'page-link'}
                    className={ this.state.loading ? "opacity hide" : "page-link"  }
                />
                </div>
            </div>
        );
    }
}
export default LeaveApproval;