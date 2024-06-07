import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import Header from './Header/Header';
import Sidenav from './Sidenavfiles/Sidenav';
import '../../trans.css';
import generalstyles from './Generalfiles/CSS_GENERAL/general.module.css';

import { Contexthandlerscontext } from '../../Contexthandlerscontext.js';
// import socketIO from 'socket.io-client';
import Home from './Home/Home';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Login from './Login/Login';
import Footer from './Footer/Footer';
import ApplicationSuccess from './ApplicationSuccess/ApplicationSuccess';
import Companies from './Companies/Companies';
import AddCompany from './Companies/AddCompany';
import Reviews from './Reviews/Reviews';
import Interviews from './Interviews/Interviews';
import Users from './Users/Users';
import Salaries from './Salaries/Salaries';
import Photos from './Photos/Photos';
import Rewardscollections from './Rewardscollections/Rewardscollections';
import Rewards from './Rewards/Rewards';
import Addreward from './Rewards/Addreward';

const App = (props) => {
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { hidesidenav_context, sethidesidenav_context, setopenloginmodalcontext, openloginmodalcontext, pagetitle_context } = React.useContext(Contexthandlerscontext);
    useEffect(() => {
        // if (openloginmodalcontext != true) {
        //     const foo = params.get('secondtrial');
        //     if (foo != 'true') {
        //         setopenloginmodalcontext(true);
        //     }
        //     setTimeout(() => {
        //         alert('s');
        //         params.delete('secondtrial');
        //         history.replace({
        //             search: params.toString(),
        //         });
        //         clearTimeout(this);
        //     }, 2000);
        // }
    }, []);

    return (
        <div class="row m-0 w-100">
            <Router>
                <div class={generalstyles.app_container + ' w-100 '}>
                    <div class="row m-0 w-100">
                        {pagetitle_context == 'dashboard' && (
                            <div class="d-flex d-md-none">
                                <Sidenav />
                            </div>
                        )}
                        <div class={pagetitle_context == 'dashboard' ? (!hidesidenav_context ? `${generalstyles.app_main}` + '  app_main  ' : `${generalstyles.app_mainsm}` + '') : ' w-100 m-0 p-0 '}>
                            <div class={pagetitle_context == 'dashboard' && !hidesidenav_context ? generalstyles.app_container_inner + ' w-100 pt-0 ' : generalstyles.app_container_inner + ' p-3 '}>
                                {pagetitle_context != 'login' && <Header />}

                                {pagetitle_context == 'dashboard' && (
                                    <div class="d-none d-md-flex">
                                        <Sidenav />
                                    </div>
                                )}

                                <Route
                                    render={({ location, match }) => {
                                        return (
                                            <Switch key={location.key} location={location}>
                                                <Route
                                                    exact
                                                    path="/"
                                                    render={(props) => {
                                                        return <Redirect to={`/home`} />;
                                                    }}
                                                />
                                                <Route exact path="/login" component={Login} />
                                                <Route exact path="/home" component={Home} />
                                            </Switch>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        </div>
    );
};

export default App;
