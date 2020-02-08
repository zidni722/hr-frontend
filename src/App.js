import React, { Component } from 'react';
import './App.css';
import Router from '../src/Router';
require('dotenv').config();

class App extends Component {
  render() {
    return (
      <Router/>
    );
  }
}

export default App;
