import React from "react";
import '../css/style.css';
import {Table,Button ,Form} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner';
import Axios from "axios";

let renderTitle = null;
let title_id = '';
class TabTeam extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      employee_id: '',
      employee_name: '',
      totalPage : 1,
      page : 1,
      datas : [],
      listTitle : [],
      loading : false,
      idDepartment : null
    };
    this.loadData = this.loadData.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  handlePageClick(data){
      let selected = data.selected + 1;
      this.setState({ page: selected }, () => {
          this.loadData();
      });
  }
  handlePress = e => {
    if (e.key === 'Enter'){
      this.loadData();
    }
  }

  loadData(){
    this.setState({datas : [],loading:true})
    var token = 'Bearer ' + localStorage.getItem('token');
    var url   = process.env.REACT_APP_DEV_BASEURL + 'v1/reporting-managers/users?page='+ this.state.page +'&name='+ this.state.employee_name +'&user-id='+ this.state.employee_id +'&title-id=' + title_id
    Axios.get(url, {'headers' : {'Authorization' : token}}).then((res) => {
      this.setState({datas : res.data.data.records, totalPage : res.data.data.total_page,loading:false})
    })
  }
  componentDidMount(){
    this.loadData();
  }
  componentDidUpdate(previousProps){

    if(previousProps.idDepartment !== this.props.idDepartment){
      Axios.get(process.env.REACT_APP_DEV_BASEURL + 'v1/departments/'+ this.props.idDepartment +'/titles').then(res =>{
        this.setState({listTitle : res.data.data})
      })
    }
  }
  handleSelect(){
    title_id = this.refs.title.value;
    this.loadData();
  }

  render() {
    //console.log(this.state.datas)
    renderTitle = this.state.listTitle.map((data,index) => (
      <option key={index} value={data.id}>{data.name}</option>
    ))
    const renderData = this.state.datas.map((data,index) => {
      return (
        <tr key={index}>
          <td>{data.employee_id}</td>
          <td>{data.name}</td>
          <td>{data.title.name}</td>
          <td>
              <Button variant="primary">
                <Link to={"/teamdetail/"+data.id}>
                  Info
                </Link>
              </Button>
          </td>
        </tr>
      );
    });

    return (
      <div className="container">
        <div className="bg-white content-tab">
          <h4>Team Data</h4>
          <hr/>
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
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                      <td width={"25%"}>
                        <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                          <Form.Control 
                            type="text"
                            ref="employee_id"
                            onChange={() => this.setState({employee_id : this.refs.employee_id.value})}
                            onKeyPress={this.handlePress} 
                          />
                        </Form.Group>
                      </td>
                      <td width={"25%"}>
                        <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                          <Form.Control 
                            type="text"
                            ref="employee_name"
                            onChange={() => this.setState({employee_name : this.refs.employee_name.value})}
                            onKeyPress={this.handlePress}
                          />
                        </Form.Group>
                      </td>
                      <td width={"25%"}>
                        <Form.Group controlId="1" style={{marginBottom : "0px"}}>
                          <Form.Control as="select" onChange={this.handleSelect} ref="title"> 
                              <option value="">All Team</option>
                              {renderTitle}
                          </Form.Control>
                        </Form.Group>
                      </td>
                      <td width={"25%"}></td>
                    </tr>
                   {renderData}
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
      </div>
    );
  }
  
}

export default TabTeam;