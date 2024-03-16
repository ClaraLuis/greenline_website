import React, { useEffect } from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useLocation } from 'react-router-dom';
import '../../trans.css';
import generalstyles from './Generalfiles/CSS_GENERAL/general.module.css';
import Header from './Header/Header';
import Sidenav from './Sidenavfiles/Sidenav';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';

import { Contexthandlerscontext } from '../../Contexthandlerscontext.js';
// import socketIO from 'socket.io-client';
import Companies from './Companies/Companies';
import Leads from './Leads/Leads';
import Users from './Users/Users';
import Phases from './Phases/Phases';
import Calls from './Calls/Calls';
import Groups from './Groups/Groups';
import Campaigns from './Campaigns/Campaigns.js';
import FollowupsandMeetings from './FollowupsandMeetings/FollowupsandMeetings.js';
import Deals from './Deals/Deals.js';
import Privacy from './Privacy/Privacy.js';
import Termsofuse from './Termsofuse/Termsofuse.js';
import Securitylayers from './Securitylayers/Securitylayers.js';
import AddEditSecuritylayers from './Securitylayers/AddEditSecuritylayers.js';
import Analytics from './Campaigns/Analytics.js';
import API from '../../API/API.js';
import { NotificationManager } from 'react-notifications';
import formstyles from '../Website/Generalfiles/CSS_GENERAL/form.module.css';
import { useMutation } from 'react-query';
import Home from './Home/Home.js';
import SalesAnalytics from './Campaigns/SalesAnalytics.js';
import PhasesAnalytics from './Campaigns/PhasesAnalytics.js';
import UserAnalytics from './Campaigns/UserAnalytics.js';

const App = (props) => {
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { UserChooseCurrentCompan_API } = API();
    const { hidesidenav_context, setopenloginmodalcontext, openloginmodalcontext, pagetitle_context } = React.useContext(Contexthandlerscontext);

    return (
        <div class="row m-0 w-100">
            <Router>
                <div class={generalstyles.app_container + ' w-100 '}>
                    <div class="row m-0 w-100">
                        {pagetitle_context == 'dashboard' && (
                            <div class="d-flex ">
                                <Sidenav />
                            </div>
                        )}
                        <div style={{ top: 33, position: 'absolute', right: '0px', zIndex: 1000 }} class="col-lg-12">
                            <div class="row w-100 m-0 d-flex justify-content-end">
                                <div class="col-lg-3">
                                    <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                        <div style={{ fontSize: '14px' }} class=" text-capitalize d-flex align-items-center row m-0 ">
                                            <Dropdown>
                                                <Dropdown.Toggle>
                                                    <span style={{ color: 'lightgrey' }}>Hello,</span>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            const cookies = new Cookies();
                                                            cookies.set('coas8866612efaasasdscjckkkkas32131asdsadsassjjscjjjeasd123!@_#!@3123', null);
                                                            history.push('/login');
                                                        }}
                                                    >
                                                        Logout
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class={pagetitle_context == 'dashboard' ? (!hidesidenav_context ? `${generalstyles.app_main}` + '  app_main  ' : `${generalstyles.app_mainsm}` + '') : ' w-100 m-0 p-0 '}>
                            <div class={pagetitle_context == 'dashboard' && !hidesidenav_context ? generalstyles.app_container_inner + ' w-100 pt-0 ' : generalstyles.app_container_inner + ' p-3 '}>
                                <Route
                                    render={({ location, match }) => {
                                        return (
                                            <Switch key={location.key} location={location}>
                                                <Route
                                                    exact
                                                    path="/"
                                                    render={(props) => {
                                                        return <Redirect to={'/leads'} />;
                                                    }}
                                                />
                                                {/* <Route exact path="/home" component={Home} /> */}
                                                <Route exact path="/companies" component={Companies} />
                                                <Route exact path="/leads" component={Leads} />
                                                <Route exact path="/deals" component={Deals} />

                                                <Route exact path="/users" component={Users} />
                                                <Route exact path="/phases" component={Phases} />
                                                <Route exact path="/calls" component={Calls} />
                                                <Route exact path="/campaigns" component={Campaigns} />
                                                <Route exact path="/groups" component={Groups} />
                                                <Route exact path="/privacy" component={Privacy} />
                                                <Route exact path="/termsofuse" component={Termsofuse} />
                                                <Route exact path="/home" component={Home} />
                                                <Route exact path="/securitylayers" component={Securitylayers} />
                                                <Route exact path="/phasesanalytics" component={PhasesAnalytics} />
                                                <Route exact path="/salesanalytics" component={SalesAnalytics} />
                                                <Route exact path="/useranalytics" component={UserAnalytics} />

                                                <Route exact path="/addsecuritylayers/:functypeparam/:editsecuritygroupidparams" component={AddEditSecuritylayers} />

                                                <Route exact path="/encounters" component={FollowupsandMeetings} />
                                                <Route exact path="/analytics" component={Analytics} />
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
