import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from '../components/Layout';

export const Authenticated = ({ component: Component, ...rest }) => (
    <Layout>
    <Route {...rest} render={props => (
        localStorage.getItem('token') !== null  ?
        localStorage.getItem('admin') === "true" ?
        ( <Redirect to={{ pathname: '/home-hrd' }}/>) : ( <Component {...props}/>) 
        :
        ( <Redirect to={{ pathname: '/' }}/>)
    )} />
    </Layout>
)