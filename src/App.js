import React, { Suspense, useContext, useState } from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, useHistory, Route, Redirect } from 'react-router-dom';
import { Contexthandlerscontext_provider } from './Contexthandlerscontext';
import { Contexthandlerscontext } from './Contexthandlerscontext.js';
import { Loggedincontext } from './Loggedincontext.js';
import { Routedispatcherprovider } from './Routedispatcher';
import './components/Website/Generalfiles/CSS_GENERAL/bootstrap.css';
import './components/Website/Generalfiles/CSS_GENERAL/dropdown.css';
import './trans.css';
// import pepsicologoresp from './components/Website/Generalfiles/images/pepsicologoresp.png';
import axios from 'axios';
import Cookies from 'universal-cookie';
import logo from './components/Website/Generalfiles/images/logo.png';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const Websiterouter = React.lazy(() => import('./components/Website/Websiterouter'));
const Login = React.lazy(() => import('./components/Website/Login/Login'));

const App = (props) => {
    let history = useHistory();
    const { fetchAuthorizationQueryContext, loggedincontext, setloggedincontext } = useContext(Loggedincontext);

    const client = new ApolloClient({
        uri: 'http://localhost:3001/graphql',
        cache: new InMemoryCache(),
    });
    axios.interceptors.request.use(function (config) {
        const cookies = new Cookies();

        var defaultheaders = config.headers;
        var token = cookies.get('coas8866612efaasasdscjckkkkas32131asdsadsassjjscjjjeasd123!@_#!@3123');
        if (token != undefined) {
            defaultheaders.Authorization = 'Bearer ' + token;
        }

        config.headers = defaultheaders;
        return config;
    });
    const isadminandloggedin = () => {
        return loggedincontext;
    };
    return (
        <ApolloProvider client={client}>
            <Contexthandlerscontext_provider>
                <Contexthandlerscontext.Consumer>
                    {(value) => {
                        return (
                            <>
                                {/* {value.fetchuseauthorizationQueryContext.isFetching && ( */}
                                {fetchAuthorizationQueryContext?.isFetching && (
                                    <div style={{ height: '100vh' }} class="row w-100 allcentered m-0">
                                        <div class="col-lg-12 p-0">
                                            <div class="row m-0 w-100">
                                                <div class="col-lg-12 p-0 d-flex allcentered">
                                                    <img style={{ objectFit: 'contain', widht: '15vh', height: '15vh' }} src={logo} />
                                                </div>
                                                <div class="col-lg-12 p-0 d-flex allcentered mt-3">
                                                    <p class="font-weight-600">Loading...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* )}
                            {/* {!value.fetchuseauthorizationQueryContext.isFetching && value.fetchuseauthorizationQueryContext.isSuccess && ( */}
                                {!fetchAuthorizationQueryContext?.isFetching && (
                                    <Router>
                                        <Routedispatcherprovider>
                                            <div style={{ width: '100%' }}>
                                                <Suspense
                                                    fallback={
                                                        <div style={{ height: '100vh' }} class="row w-100 allcentered m-0">
                                                            <div class="col-lg-12 p-0">
                                                                <div class="row m-0 w-100">
                                                                    <div class="col-lg-12 p-0 d-flex allcentered">
                                                                        <img style={{ objectFit: 'contain', widht: '15vh', height: '15vh' }} src={logo} />
                                                                    </div>
                                                                    <div class="col-lg-12 p-0 d-flex allcentered mt-3">
                                                                        <p class="font-weight-600">Loading...</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    {isadminandloggedin() && <Websiterouter />}
                                                    {!isadminandloggedin() && (
                                                        <>
                                                            <Route
                                                                exact
                                                                path="/"
                                                                render={(props) => {
                                                                    return <Redirect to={'/login'} />;
                                                                }}
                                                            />
                                                            <Route exact path="/login" component={Login} />
                                                        </>
                                                    )}
                                                </Suspense>
                                            </div>
                                        </Routedispatcherprovider>
                                    </Router>
                                )}
                                {/* )} */}
                                <NotificationContainer />
                                <ReactQueryDevtools initialIsOpen />
                            </>
                        );
                    }}
                </Contexthandlerscontext.Consumer>
            </Contexthandlerscontext_provider>
        </ApolloProvider>
    );
};

export default App;
