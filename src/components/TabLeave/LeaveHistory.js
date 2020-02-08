import React from "react";
import {Table,Button} from 'react-bootstrap';
import '../../css/style.css';
import Swal from 'sweetalert2';
import Axios from 'axios';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';

var moment = require('moment-business-days');
const swalWithBootstrapButtons = Swal.mixin({
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger margin-right',
    buttonsStyling: false,
})
let renderData = null;
var token = 'Bearer ' + localStorage.getItem('token');
class LeaveHistory extends React.Component{
    constructor(){
        
        super();
        this.state = {
            totalPage : 0,
            page : 1,
            datas : [],
            loading : false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.loadData = this.loadData.bind(this);
    }
    loadData(){
        this.setState({ loading : true });

        
        Axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/users/leave-requests?paging=true&page=' + this.state.page,
        {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}
        ).then(res => {
            this.setState({datas : res.data.data.records, totalPage : res.data.data.total_page, loading : false });
        });
        
    }
    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }
    handleCancel(event){
        var id = event.target.getAttribute('id_leave');
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "Cancel this Leave",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
            }).then((result) => {
            if (result.value) {
                
                
                Axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/leave-requests/'+ id +'/cancel',
                {'headers' : {'Authorization' : token}}
                ).then(res => {
                     swalWithBootstrapButtons.fire(
                    'Done!',
                    'Canceled.',
                    'success'
                    );
                    this.loadData()
                });
            }
        })
    }
    
    componentDidMount(){
        this.loadData()
    }
    handlePageClick = data => {
        let selected = data.selected + 1;
        this.setState({ page: selected }, () => {
            this.loadData();
          });
    };

    render(){
        
        renderData = this.state.datas.map((data, index) => {
            return (
                <tr key={index}>
                    <td className={ this.state.loading ? "opacity" : undefined  }>{data.leave_type.name}</td>
                    <td className={ this.state.loading ? "opacity" : undefined  }>{moment(data.apply_date).format('DD/MM/YYYY')}</td>
                    <td className={ this.state.loading ? "opacity" : undefined  }>{moment(data.start_date).format('DD/MM/YYYY')} 
                    <b> to</b> {moment(data.end_date).format('DD/MM/YYYY')}</td>
                    <td style={{textAlign : "center"}} className={ this.state.loading ? "opacity" : undefined  }><b>
                        {data.duration} </b></td>
                    <td className={ this.state.loading ? "opacity" : undefined  } style={{textTransform : "capitalize"}}>{data.status}</td>
                    <td>
                       {moment().isBefore(moment(data.start_date)) ? data.status === 'pending' ? <Button 
                            variant="danger" 
                            size="sm"
                            id_leave={data.id}
                            onClick={this.handleCancel}
                            >Cancel</Button> : undefined : undefined }
                        {
                            moment().isBefore(moment(data.start_date)) ? data.status === 'approved' ? <Button 
                            variant="danger" 
                            size="sm"
                            id_leave={data.id}
                            onClick={this.handleCancel}
                            >Cancel</Button> : undefined : undefined
                        } 
                    </td>
                </tr>
            );
        });

        return(
            
            <div>
                <div className={ this.state.loading ? "show loader" : "hide" } >
                    <Loader 
                    type="Oval"
                    color="#00BDD5"
                    height="70"	
                    width="70"/>   
                </div>
                <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Leave Type</th>
                        <th>Apply Date</th>
                        <th>Leave Date</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    <tr>
                        
                    </tr>
                </thead>
                
                <tbody>
                    {this.state.datas.length === 0 ? 
                        <tr><td colSpan="6" align="center">No Data Found</td></tr> 
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
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
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
export default LeaveHistory;