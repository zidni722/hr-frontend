import React from "react";
// import autoBind from 'react-autbind';
import {Form,Row,Col,Container, Table, Button } from 'react-bootstrap';
// import '../../../css/style.css';
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from 'react-paginate';
import Axios from 'axios';


var moment = require('moment-business-days');
class ListAnnouncement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab       : props.activeTab || 1,
            records : [],
            totalPage : 1
        };
        this.handleCancel = this.handleCancel.bind(this)
      }
    componentDidMount(){
        var url = process.env.REACT_APP_DEV_BASEURL + "v1/announcements"
        Axios.get(url).then((res) => {
            this.setState({records : res.data.data})
        })
    }
    handleCancel(id){
        var url_cancel = process.env.REACT_APP_DEV_BASEURL + 'v1/announcements/'+ id +'/delete'
        Axios.get(url_cancel).then(() => {
            this.componentDidMount();
        })
    }
    render(){
        const renderData = this.state.records.map((data,index) => {
            return(
                <tr>
                    <td>{index+1}</td>
                    <td>{moment(data.start_date).format("DD/MM/YYYY")}</td>
                    <td>{moment(data.end_date).format("DD/MM/YYYY")}</td>
                    <td>{data.description}</td>
                    <td>
                        <Button variant="danger" 
                            onClick={() => this.handleCancel(data.id)}>
                            Delete
                        </Button>
                    </td>
                </tr>
            )
        })
        return(
            <Container>

                <Form>
                <Row>
                    <Col sm={12}>
                        <div>
                            <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.records.length === 0 ? 
                                    <tr><td colSpan="5" align="center">No Data Found</td></tr>
                                    :  renderData
                                }
                               
                            </tbody>
                            
                            </Table>
                            <div className="float-right">
                            {
                                this.state.records.length === 0 ? 
                                undefined
                                : 
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
                            }
                            
                            </div>
                        </div>
                    </Col>
                </Row>
                </Form>

            </Container>
            

        );
    }
}
export default ListAnnouncement;