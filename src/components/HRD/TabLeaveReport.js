import React from 'react';
import {Table, Form,Button} from 'react-bootstrap';
import '../../css/style.css';
import {CSVLink} from 'react-csv';
import ReactPaginate from 'react-paginate';
import axios from "axios"



var token   = "Bearer " + localStorage.getItem('token');
const DELETED = "deleted"
const EXPORT = "export"


class TabLeaveReport extends React.Component{
    constructor(){
        super();
        this.keywordId = React.createRef();
        this.department = React.createRef();
        this.keywordName = React.createRef();
        this.csv = React.createRef();
        this.state = {
            activePage : 1,
            totalPage : 0,
            employeeID : "",
            employeeName : "",
            departID : null,
            loading : false,
            datas : [],
            depart : [],
            dataExport : [],
            
        };
    }
    handlePageClick = data => {
        let selected = data.selected + 1;
        this.setState({ activePage: selected }, () => {
            this.loadData()
        });
        
        window.scrollTo(0, 0)
    };
    loadData = () => {
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/leave-report?paging=true&page='+ this.state.activePage
        + '&limit=50&employee-id='+ this.state.employeeID +'&employee-name='+ this.state.employeeName 
        +'&department-id=' + this.state.departID
        axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
            this.setState({
                datas : res.data.data.records, 
                loading : false, 
                totalPage : res.data.data.total_page});
        })
    }
    handleEnter = e => {
        if (e.key === 'Enter') this.loadData()
    }

    handleSelect = () => {
        this.setState({ departID : this.refs.department.value}, () => { this.loadData(); })
       
      }
    handleExport = () => {
        this.setState({dataExport : []})
        var url = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/leave-export?employee-id=' + this.state.employeeID 
        + '&employee-name='+ this.state.employeeName 
        + '&department-id=' + this.state.departID

        axios.get(url,{'headers' : {'Authorization' : token}}).then(res => {
             var data = res.data.data.map((data,index) => {
                return (
                    {
                    No : index +1, 
                    employeeID : data.employee_id,
                    employeeName : data.name,
                    leaveCarryOver : data.carry_over,
                    leaveTaken : data.taken,
                    leaveEntitlement : data.entitlement,
                    leaveBalance : data.balance
                })
            })
            this.setState({dataExport :data}, () => {
                this.csv.current.link.click()
            })
        })
        
       

    }

    componentDidMount() {
       this.loadData(1,null)
       var url = process.env.REACT_APP_DEV_BASEURL + 'v1/departments'
        axios.get(url).then(res => {
            this.setState({depart : res.data.data})
        })
        
    }
    
    render(){
       const render =  this.state.datas.map((data) => {
            return(
                <tr>
                    <td>{data.employee_id}</td>
                    <td>{data.name}</td>
                    <td>{data.title.department.name}</td>
                    <td>{data.entitlement}</td>
                    <td>{data.taken}</td>
                    <td>{data.balance}</td>
                </tr>
            );
        })

        const renderDepartment = this.state.depart.map((data,index) =>{
            return(
              <option value={data.id} key={index}>{data.name}</option>
            );
          })

        return(
            <div>
                <CSVLink
                    data={this.state.dataExport}
                    ref={this.csv}
                    filename="Leave Report"
                />  
                <h4>Leave Report</h4>
                <Button variant="info" style={{float : "right"}} onClick={this.handleExport}> 
                    <i className="fas fa-download"></i> Export Data Leave
                </Button>
            
            <div className="clearfix"/>
            <hr/>
                <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Department</th>
                        <th>Leave Entitlement</th>
                        <th>Leave Taken</th>
                        <th>Leave Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td width={'12%'}>
                            <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                                <Form.Control 
                                type="text"
                                ref="keywordId"
                                onChange={() => {this.setState({employeeID : this.refs.keywordId.value})}}
                                onKeyPress={this.handleEnter}
                                />
                            </Form.Group>
                        </td>
                        <td width={'25%'}>
                            <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                                <Form.Control 
                                type="text"
                                ref="keywordName"
                                onChange={() => {this.setState({employeeName : this.refs.keywordName.value})}}
                                onKeyPress={this.handleEnter}
                                />
                            </Form.Group>
                        </td>
                        <td width={'18%'}>
                            <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                                <Form.Control as="select" onChange={this.handleSelect} ref="department">
                                    <option value="">All Department</option>
                                    {renderDepartment}
                                </Form.Control>
                            </Form.Group>
                        </td>
                        <td width={'12%'}>
                            {/* <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                                <Form.Control 
                                type="text"
                                ref="leave_entitlement"
                                value={this.state.leave_entitlement}
                                onChange={this.handleFilter}
                                />
                            </Form.Group> */}
                        </td>
                        <td width={'12%'}>
                            {/* <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                                <Form.Control 
                                type="text"
                                ref="leave_taken"
                                value={this.state.leave_taken}
                                onChange={this.handleFilter}
                                />
                            </Form.Group> */}
                        </td>
                        <td width={'12%'}>
                            {/* <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                                <Form.Control 
                                type="text"
                                ref="leave_balance"
                                value={this.state.balance}
                                onChange={this.handleFilter}
                                />
                            </Form.Group> */}
                        </td>
                    </tr>
                    {render}

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
export default TabLeaveReport;