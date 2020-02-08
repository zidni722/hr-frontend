import React from "react";
import {Table} from 'react-bootstrap';
import '../../css/style.css';
import Axios from 'axios';
import ReactPaginate from 'react-paginate';
import Loader from 'react-loader-spinner';

var moment = require('moment-business-days');
let renderData = null;
class LeaveHistoryDetailHRD extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            totalPage : 0,
            page : 1,
            data : [],
            loading : false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.loadData = this.loadData.bind(this);
    }
    loadData(id){
        var token   = "Bearer " + localStorage.getItem('token');
        var url = process.env.REACT_APP_DEV_BASEURL + "v1/hr/users/"+ id +"/leave-request?page=" + this.state.page
        Axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
            this.setState({data : res.data.data.records, totalPage : res.data.data.total_page})
        })
    }
    componentDidUpdate(previousProps){
        if(previousProps.data !== this.props.data){
          this.loadData(this.props.data)
          this.setState({ id : this.props.data })
        }
    }
    
    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }
    handlePageClick = data => {
        let selected = data.selected + 1;
        this.setState({ page: selected }, () => {
            this.loadData(this.state.id);
          });
    };

    render(){
        if(this.state.data !== undefined){
            renderData = this.state.data.map((data, index) => {
                var diff = moment(data.start_date).businessDiff(moment(data.end_date));
                return (
                    <tr key={index}>
                        <td className={ this.state.loading ? "opacity" : undefined  }>{data.leave_type.name}</td>
                        <td className={ this.state.loading ? "opacity" : undefined  }>{moment(data.apply_date).format('DD/MM/YYYY')}</td>
                        <td className={ this.state.loading ? "opacity" : undefined  }>{moment(data.start_date).format('DD/MM/YYYY')} <b>to</b> {moment(data.end_date).format('DD/MM/YYYY')}</td>
                        <td style={{textAlign : "center"}} className={ this.state.loading ? "opacity" : undefined  }><b>
                            {diff+1} </b></td>
                        <td className={ this.state.loading ? "opacity" : undefined  } style={{textTransform : "capitalize"}}>{data.status}</td>
                    </tr>
                );
            });
        }
        

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
                    </tr>
                    <tr>
                        
                    </tr>
                </thead>
                
                <tbody>
                    {this.state.data.length === 0 ? 
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
export default LeaveHistoryDetailHRD;