import React from "react";
// import autoBind from 'react-autbind';
import {Form,Row,Col,Container, Table,Button } from 'react-bootstrap';
import '../../../css/style.css';
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from 'react-paginate';
import Axios from 'axios';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";

var moment = require('moment-business-days');
const modalStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '30%'
    }
  };
class HRDTabJobHistories extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeTab       : props.activeTab || 1,
            records : [],
            totalPage : 1,
            modalIsOpen: false,
            depart : [],
            title : [],
            id_title : 1,
            transfer_date : null,
            id : null
        };
        this.closeModal = this.closeModal.bind(this);
        this.handleDataDepartment = this.handleDataDepartment.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
      }
      handlePageClick = data => {
        let selected = data.selected + 1;
        this.setState({ page: selected }, () => {
            this.loadData();
          });
      };
      handleSubmit(){
          var data = {
            user_id : parseInt(this.state.id),
            title_id : this.state.id_title,
            transfer_date : moment(this.state.transfer_date).format("YYYY-MM-DD"),
            probation_review_date : moment(this.state.transfer_date).add(2, 'M').format("YYYY-MM-DD"),
            probation_end_date : moment(this.state.transfer_date).add(3, 'M').format("YYYY-MM-DD")
          }
          var token = 'Bearer ' + localStorage.getItem('token')
          var url_submit = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/job-history/add'
          Axios.post(url_submit,data, {'headers' : {'Authorization' : token, 'Content-Type' : 'application/json'}}).then(() => {
                window.location.reload()
          })
      }
      componentDidUpdate(previousProps){
        if(previousProps.id !== this.props.id){
            this.setState({id : this.props.id});
            var token   = "Bearer " + localStorage.getItem('token');
            var url = process.env.REACT_APP_DEV_BASEURL + 'v1/hr/job-history/' + this.props.id
            Axios.get(url,{'headers' : {'Authorization' : token}}).then((res) => {
                this.setState({records : res.data.data.records, totalPage : res.data.data.total_page})
            })
        }
      }
      closeModal() {
        this.setState({modalIsOpen: false, showButton : false});
      }
      handleDataDepartment(id){
            var url_depart = process.env.REACT_APP_DEV_BASEURL + 'v1/departments/' + id + '/titles'
            Axios.get(url_depart).then((res )=>{
                this.setState({ title : res.data.data, id_title : res.data.data[0].id})
            })
        }
      componentDidMount(){
        this.handleDataDepartment(1);
        var url_alldepart = process.env.REACT_APP_DEV_BASEURL + 'v1/departments'
        Axios.get(url_alldepart).then((res) => {
            this.setState({ depart : res.data.data })
        })
      }
    render(){
        const renderDepart = this.state.depart.map((data) => {
            return(
                <option value={data.id}>{data.name}</option>
            )
        })
        const rendertitle = this.state.title.map((data) => {
            return(
                <option value={data.id}>{data.name}</option>
            )
        })
        const renderData = this.state.records.map((data) => {
            return(
                <tr>
                    <td>{data.title.name}</td>
                    <td>{moment(data.transfer_date).format("DD/MM/YYYY")}</td>
                    <td>{moment(data.probation_review_date).format("DD/MM/YYYY")}</td>
                    <td>{moment(data.probation_end_date).format("DD/MM/YYYY")}</td>
                </tr>
            )
        })
        return(
            <Container>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}>
                    <div>
                        <center>
                            <h5>Change Job</h5>
                        </center>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="1">
                                <Form.Label>*Department</Form.Label>
                                <Form.Control as="select"  
                                    onChange={() => this.handleDataDepartment(this.refs.depart.value)}
                                    className="option"
                                    ref="depart">
                                    {renderDepart}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="1">
                                <Form.Label>*Title</Form.Label>
                                <Form.Control as="select"  
                                    onChange={() => this.setState({id_title : parseInt(this.refs.title.value)})}
                                    className="option"
                                    ref="title">
                                    {rendertitle}
                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId="1">
                                <Form.Label>*Transfer Date</Form.Label>
                                <div>
                                    <DatePicker
                                        selected={this.state.transfer_date}
                                        onChange={(date) => this.setState({transfer_date : date})}
                                        className="form-control"
                                        style={{width:"500px"}}
                                        dateFormat="dd-MM-YYYY"
                                        showYearDropdown/>
                                </div>
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="" 
                                size="lg"
                                style={{width:"100%"}}>
                                Save
                            </Button>
                        </Form>
                    </div>
                </Modal>
                <Row>
                    <Col sm={12}>
                        <div>
                            <div className="float-right">
                                <Button 
                                    variant="info" 
                                    style={{marginBottom : "10px"}}
                                    onClick={() => this.setState({modalIsOpen : true})}>
                                    Change Jobs
                                </Button>
                            </div>
                            <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Transfer Date</th>
                                    <th>Probation Review Date</th>
                                    <th>Probation End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.records.length === 0 ?
                                    <tr><td colSpan="4" align="center">No Data Found</td></tr>  :
                                    renderData
                                }
                            </tbody>
                            
                            </Table>
                            <div className="float-right">
                            {
                                this.state.records.length === 0 ? undefined :
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

            </Container>
            

        );
    }
}
export default HRDTabJobHistories;